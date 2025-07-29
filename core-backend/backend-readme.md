# SoftwareStudioProject - Backend

This document describes how to set up, run, and use the backend for the Pokémon Card Identification project.

---

## Requirements

- Python `3.10` or `3.11`
- Conda (Miniconda or Anaconda) installed

---

## Environment Setup (macOS & Windows)

1. Download and install Miniconda or Anaconda from the official website.
2. Open your terminal and run:
   ```sh
   conda create -n software-studio python=3.10 -y
   conda activate software-studio
   pip install -r requirements.txt
   ```
   > Make sure you are in the same directory as this README and the `requirements.txt` file before running the install command.

---

## Project Goals

1. Train on the Pokémon TCG Dataset of card images in a Jupyter notebook.
   - Start with cards from a single release for a manageable dataset.
   - Split data: 70% train, 15% validation, 15% test.
2. Save the trained model (e.g., to a database or container).
3. Test and verify model accuracy.

---

## Jupyter Notebook Usage

- Use the notebook for brainstorming and model training.
- Document your process in `main.py` after experimentation.
- To run the notebook:
  ```sh
  cd notebook
  jupyter-notebook .
  ```
  Open `core-backend-notebook.ipynb` in your browser.

---

## Directory Structure

```
core-backend/
│
├── README.md
├── requirements.txt
│
├── app/
│   └── main.py
│
├── data/
│   └── ALL_Pokemon_Cards_manifest_with_base64.csv   # Main dataset
│
├── notebook/
│   └── core-backend-notebook.ipynb
│
├── model/
│   └── pokemon_card_model.pth                       # Trained model artifacts
│
└── label/
    └── idx2id.json                                  # Label mapping file
```

---

## How to Start the Python Backend API

1. **Install Dependencies**
   - Use [Poetry](https://python-poetry.org/) (recommended):
     ```sh
     poetry install
     ```
   - Or use pip:
     ```sh
     pip install -r requirements.txt
     ```
   - Ensure all required files are in their respective folders.

2. **(Optional) Edit Paths**
   - If your folder structure is different, update the `BASE_DIR` path in `main.py`:
     ```python
     BASE_DIR = "/absolute/path/to/core-backend/"
     ```

3. **Start the Application**
   - With Poetry:
     ```sh
     poetry run uvicorn main:app --reload
     ```
   - Or with pip/venv:
     ```sh
     uvicorn main:app --reload
     ```

4. **Access the API**
   - Main API endpoint:
     ```
     http://localhost:8000/identify_card
     ```
     - POST an image (field name: `file`, type: `image/jpeg` or `image/png`)
   - Swagger (interactive docs):
     ```
     http://localhost:8000/docs
     ```
     - Test endpoints, upload images, view responses.
   - Redoc (read-only docs):
     ```
     http://localhost:8000/redoc
     ```

---

## API Example Response

```json
{
  "id": "smp-SM125",
  "name": "Naganadel-GX",
  "set": "SM Black Star Promos",
  "hp": 210,
  "rarity": "Promo",
  "types": ["Psychic"],
  "official_card_image_url": "",
  "base64_image": "<long_base64_string>"
}
```

---

## Model Notes

- Trained using images from the **pokemon-cards.csv** dataset (13,088 images).
- Training Set Accuracy: **0.9362**
- Model training time: ~2 hours 15 minutes.

> **Important:**  
> This model is optimized for clean, high-quality images similar to those in the training dataset.  
> It may not correctly identify real-world photos of Pokémon cards taken with a phone or under different lighting, backgrounds, or angles.  
> For best results on real-world uploads, additional training on such photos is recommended.

---

## How to Run the Jupyter Notebook

1. **Install Dependencies**
   ```sh
   pip install -r requirements.txt
   ```

2. **Check Directory Structure**
   - Ensure the following directories exist and are correctly referenced in the notebook:
     - **Base Directory:** `model/`, `label/`, `data/`
     - **Parent Directory:** `images/`, `Data/`, `ALL_Pokemon_Cards/`, `ALL_Pokemon_Cards_standard/`

3. **Prepare Required Datasets**
   - **Image Dataset:** Place the folder containing Pokémon card images in the `Data` directory.
   - **Metadata CSV:** Place the file `pokemon-tcg-data-master 1999-2023.csv` in the `Data` directory.

4. **Test via Image Upload**
   - Upload or select an image for testing.
   - Apply the same preprocessing steps (resize, normalize) as used during training.
   - Use the saved model to predict the card.
   - Lookup card details in the metadata for the prediction result.

---

## High-Level Steps

1. **Image Preprocessing**
   - Remove duplicate and corrupt files.
   - Convert images to RGB, resize to 224x224 pixels, and save as JPEG.
   - Build a manifest CSV linking image paths to metadata (id, set, etc.).

2. **Merge Datasets**
   - Merge the image manifest with `pokemon-tcg-data-master 1999-2023.csv` on the card `id`.

3. **Label Mapping**
   - Assign each unique card id an integer label (`id2idx`, `idx2id`).

4. **Dataset & Dataloader**
   - Use all images for training (no validation/test split).

5. **Data Augmentation**
   - Apply strong augmentation techniques in the training transforms.

6. **Model Training**
   - Use a pre-trained ResNet model and replace the final layer with the correct number of classes.
   - Train on all images and save the model as a `.pth` file.

---

## Credits / Data Sources

- **Pokémon TCG Card Images Dataset**
  - Source: [Kaggle - pokemon-cards.csv by priyamchoksi](https://www.kaggle.com/datasets/priyamchoksi/pokemon-cards)
  - Author: priyamchoksi
  - License: See dataset page for terms

- **Pokémon Card Metadata Dataset**
  - Source: [Kaggle - pokemon-tcg-data-master 1999-2023.csv by adampq](https://www.kaggle.com/datasets/adampq/pokemon-tcg-all-cards-1999-2023)
  - Author: adampq
  - License: See dataset page for terms

All data and images used for model training, testing, and inference in this project come from the sources listed above.  
Please refer to the linked Kaggle pages for licensing and usage restrictions.

---