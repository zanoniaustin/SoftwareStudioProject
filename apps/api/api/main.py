import json
import torch
import torch.nn as nn
from torchvision import models, transforms
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io
import os

app = FastAPI()

# --- Load Mappings and Manifest at Startup ---

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

MODEL_PATH = os.path.join(BASE_DIR, "model", "pokemon_card_model.pth")
IDX2ID_PATH = os.path.join(BASE_DIR, "label", "idx2id.json")
MANIFEST_PATH = os.path.join(BASE_DIR,  "data", "ALL_Pokemon_Cards_manifest_with_base64.csv")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

with open(IDX2ID_PATH, "r") as f:
    idx2id = json.load(f)

manifest_df = pd.read_csv(MANIFEST_PATH)
manifest_df.set_index("id", inplace=True)  # assuming the manifest has an 'id' column

# --- Define the model architecture to match training ---
num_classes = len(idx2id)
model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, num_classes)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# --- Image Transform (as used during model training) ---
transform = transforms.Compose([
    transforms.Resize((224, 224)),   # or whatever size the model expects
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# --- API Endpoint ---
@app.post("/identify_card")
async def identify_card_api(file: UploadFile = File(...)):
    try:
        # 1. Load image
        img_bytes = await file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        input_tensor = transform(image).unsqueeze(0).to(device)
        
        # 2. Model prediction
        with torch.no_grad():
            outputs = model(input_tensor)
            pred_idx = int(outputs.argmax(1).item())
        
        # 3. Map idx to card id
        card_id = idx2id[str(pred_idx)]
        
        # 4. Lookup details in manifest
        if card_id in manifest_df.index:
            card_row = manifest_df.loc[card_id]
            base64_image = card_row.get("base64_image", "")

            result = {
                "id": card_id,
                "name": card_row.get("name", ""),
                "set": card_row.get("set", ""),
                "hp": float(card_row.get("hp", "")),
                "rarity": card_row.get("rarity", ""),
                "types": card_row.get("types", ""),  # may need eval if stringified list
                "official_card_image_url": card_row.get("official_card_image_url", ""),
                "base64_image": base64_image  # <--- The base64 encoded image from CSV
            }
            # If 'types' column is a string like "['Dragon']", convert to list
            if isinstance(result["types"], str) and result["types"].startswith("["):
                import ast
                try:
                    result["types"] = ast.literal_eval(result["types"])
                except Exception:
                    pass
        else:
            return JSONResponse(content={"error": "Card ID not found in manifest"}, status_code=404)
        return JSONResponse(content=result)
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
