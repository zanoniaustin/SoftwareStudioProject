import json
import pandas as pd
import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io
import os
import cv2
import pytesseract
import requests
from bs4 import BeautifulSoup
import re
import ast
import tempfile

app = FastAPI()

POKEMON_SETS = [
    "Base Set", "Jungle", "Fossil", "Team Rocket", "Gym Heroes", "Gym Challenge",
    "Neo Genesis", "Neo Discovery", "Neo Revelation", "Neo Destiny",
    "Expedition", "Aquapolis", "Skyridge", "EX Ruby & Sapphire", "XY", "Sun & Moon",
    "Sword & Shield", "Scarlet & Violet"
]

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.path.join(BASE_DIR, "model", "pokemon_card_model.pth")
IDX2ID_PATH = os.path.join(BASE_DIR, "label", "idx2id.json")
MANIFEST_PATH = os.path.join(BASE_DIR, "data", "ALL_Pokemon_Cards_manifest_with_base64.csv")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

with open(IDX2ID_PATH, "r") as f:
    idx2id = json.load(f)

manifest_df = pd.read_csv(MANIFEST_PATH).set_index("id")

num_classes = len(idx2id)
model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, num_classes)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def preprocess_image(image):
    img = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    _, thresh = cv2.threshold(img, 150, 255, cv2.THRESH_BINARY)
    return thresh

def extract_card_details(image):
    img = preprocess_image(image)
    text = pytesseract.image_to_string(img).replace("Seige", "Stage")
    card_name, set_name = None, None
    for line in text.split('\n'):
        line = line.strip()
        if not card_name and re.search(r'[A-Za-z\s]{4,}', line):
            card_name = line
        if re.search(r'(Base|Jungle|Fossil|Rocket|Gym|Neo|Expedition|Aquapolis|Skyridge|EX|XY|Sun.*Moon|Sword.*Shield|Scarlet.*Violet|[A-Za-z\s]*Set)', line, re.IGNORECASE):
            set_name = line
            break
    if not set_name:
        set_name = next((s for s in POKEMON_SETS if s.lower() in text.lower()), None)
    return card_name, set_name

def get_price_from_pricecharting(card_name, set_name=None):
    query = f"{card_name} {set_name or ''}".strip().replace(' ', '+')
    url = f"https://www.pricecharting.com/search-products?q={query}&type=prices"
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        price = soup.select_one('td.price.numeric')
        return price.text.strip() if price else "Price not found"
    except Exception as e:
        return f"Error fetching price: {str(e)}"

@app.post("/identify_card")
async def identify_card_api(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        input_tensor = transform(image).unsqueeze(0).to(device)
        with torch.no_grad():
            pred_idx = int(model(input_tensor).argmax(1).item())
        card_id = idx2id.get(str(pred_idx))
        if not card_id or card_id not in manifest_df.index:
            return JSONResponse(content={"error": "Card not found"}, status_code=404)
        card_row = manifest_df.loc[card_id]
        result = {
            "id": card_id,
            "name": card_row.get("name", ""),
            "set": card_row.get("set", ""),
            "hp": float(card_row.get("hp", 0)) if card_row.get("hp") else 0,
            "rarity": card_row.get("rarity", ""),
            "types": card_row.get("types", ""),
            "official_card_image_url": card_row.get("official_card_image_url", ""),
            "base64_image": card_row.get("base64_image", "")
        }
        if isinstance(result["types"], str) and result["types"].startswith("["):
            try:
                result["types"] = ast.literal_eval(result["types"])
            except Exception:
                pass
        with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as temp_file:
            image.save(temp_file.name, format="PNG")
            temp_image = cv2.imread(temp_file.name)
            if temp_image is not None:
                card_name, set_name = extract_card_details(temp_image)
                if card_name:
                    result["ocr_card_name"] = card_name
                    result["ocr_set_name"] = set_name or "Unknown"
                    result["price"] = get_price_from_pricecharting(card_name, set_name)
                else:
                    result["price"] = "Could not identify card name from image"
            else:
                result["price"] = "Error: Could not process image for OCR"
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": f"Server error: {str(e)}"}, status_code=500)
