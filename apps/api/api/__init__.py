import ast
import io
import json
import os
import re
import time

import cv2
import pandas as pd
import pytesseract
import requests
import torch
import torch.nn as nn
from PIL import Image
from bs4 import BeautifulSoup
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from torchvision import models, transforms
from typing import Annotated

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        if re.search(
                r'(Base|Jungle|Fossil|Rocket|Gym|Neo|Expedition|Aquapolis|Skyridge|EX|XY|Sun.*Moon|Sword.*Shield|Scarlet.*Violet|[A-Za-z\s]*Set)',
                line, re.IGNORECASE):
            set_name = line
            break
    if not set_name:
        set_name = next((s for s in POKEMON_SETS if s.lower() in text.lower()), None)
    return card_name, set_name


def get_price_from_ebay_sold(card_name, set_name=None, rarity=None):
    invalid_names = {'your', 'pokemon', 'card', 'the', 'a', 'an'}

    if not card_name or not any(c.isalnum() for c in card_name) or card_name.lower() in invalid_names:
        return "Invalid card name"

    query_parts = [card_name]
    if set_name:
        query_parts.append(set_name)
    if rarity and "holo" in rarity.lower():
        query_parts.append("Holo")
    elif rarity:
        query_parts.append(rarity)
    query = " ".join(query_parts).strip() + " pokemon card"
    query = re.sub(r'[^\w\s]', '', query).replace(' ', '+').strip('+')
    if not query or query.lower() in invalid_names:
        return "Invalid query"

    url = f"https://www.ebay.com/sch/i.html?_nkw={query}&_sacat=0&LH_Sold=1&LH_Complete=1"
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.ebay.com/',
            'Connection': 'keep-alive',
            'DNT': '1',
        }

        time.sleep(2)
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        sold_prices = soup.select('.s-item__price')
        if sold_prices:
            prices = []
            for price in sold_prices[:5]:  # Limit to 5 recent sales
                price_text = price.text.strip()
                if price_text.startswith('$'):
                    try:
                        price_value = float(price_text.replace('$', '').replace(',', ''))
                        prices.append(price_value)
                    except ValueError:
                        continue
            if prices:
                avg_price = sum(prices) / len(prices)
                return f"${avg_price:.2f}"

        return "Price not found"

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            return "Price unavailable due to server restrictions"
        return f"Error fetching price: {str(e)}"
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
        price = get_price_from_ebay_sold(
            card_row.get("name", ""),
            card_row.get("set", ""),
            card_row.get("rarity", "")
        )
        result = {
            "id": card_id,
            "name": card_row.get("name", ""),
            "set": card_row.get("set", ""),
            "hp": float(card_row.get("hp", 0)) if card_row.get("hp") else 0,
            "rarity": card_row.get("rarity", ""),
            "types": card_row.get("types", ""),
            "official_card_image_url": card_row.get("official_card_image_url", ""),
            "base64_image": card_row.get("base64_image", ""),
            "price": price
        }
        if isinstance(result["types"], str) and result["types"].startswith("["):
            try:
                result["types"] = ast.literal_eval(result["types"])
            except Exception:
                pass

        result["ocr_card_name"] = result["name"]
        result["ocr_set_name"] = result["set"]

        result["price"] = get_price_from_ebay_sold(result["name"], result["set"], result["rarity"])
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": f"Server error: {str(e)}"}, status_code=500)

@app.post("/search_cards")
async def search_cards_api(query: str = ""):
    try:
        if not query:
            results_df = manifest_df.head(20)
        else:
            results_df = manifest_df[manifest_df['name'].str.contains(query, case=False, na=False)]

        results = results_df.reset_index().to_dict(orient='records')

        formatted_results = []
        for card in results:
            price = "N/A" # No price column in CSV, so we use a placeholder.

            formatted_results.append({
                "id": card.get("id", ""),
                "name": card.get("name", ""),
                # Correctly format 'set' as an object to match frontend type
                "set": {
                    "name": card.get("set", ""),
                    "number": "" # CSV does not contain a card number, so this is empty
                },
                "rarity": card.get("rarity", ""),
                "base64_image": card.get("base64_image", ""), # Use base64 from CSV
                "price": price
            })

        return JSONResponse(content=formatted_results)

    except Exception as e:
        return JSONResponse(content={"error": f"Server error: {str(e)}"}, status_code=500)

@app.post("regsiter")
async def register_api(username: Annotated[str, Form()],
                    email: Annotated[str, Form()],
                    password: Annotated[str, Form()]):
    print("Resgister")
