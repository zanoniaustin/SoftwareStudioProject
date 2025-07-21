# SoftwareStudioProject - Backend

Follow these steps to set up your environment for backend development.

## Requirements

- Python `3.10` or `3.11`
- Conda (Miniconda or Anaconda) installed

### Setup Instructions (macOS & Windows)

1. Download and install Miniconda or Anaconda from the official website.
2. Open your terminal and run:

   ```
   conda create -n software-studio python=3.10 -y
   conda activate software-studio
   pip install -r requirements.txt
   ```

   > Make sure you are in the same directory as this README and the `requirements.txt` file before running the install command.

## Goals

1. Train on the Pokemon TCG Dataset of thier images in a Jupyter notebook first.
   - Make sure the cards are all from a single release. This will give us a smaller set of data to train and work things out.
   - When training divide the cards into 70 train, 15 validation, 15 test.
2. Save the train model somewhere. Maybe a database or container.
3. Test and verify its accuracy. 

## Jupyter Notebook

For brainstorming and training lets use a jupyter notebook then write our process in `main.py`.

To run the notebook make sure you are in the sub-directory `notebook` and run `jupyter-notebook .` then open the notebook **core-backend-notebook.ipynb`

## Notes

- Add any required libraries to the `requirements.txt` file.
- Update this README with additional setup or run instructions as needed.


----------------------------------------------------------------------------------------------------------------------------------------------



## How to Start Python backend application API and Invoke URL

## Directory Structure
   model/pokemon_card_model.pth – Trained model weights
   label/idx2id.json – Label mapping file
   data/ALL_Pokemon_Cards_manifest_with_base64.csv – Metadata and base64-encoded card images
   main.py – Main FastAPI application

   backend/
│
├── README.md
├── requirements.txt
├── app
│   └── main.py
│
├── data/
│   └── pokemon-manifest-file.csv       # Store the main dataset here
│
├── notebook/
│   └── core-backend-notebook.ipynb
│
├── model/
│   └── pokemon_card_model.pth     # Trained model artifacts
│
└── label/
    └── idx2id.json                # Label mapping file


## How to Start the Python App
   1. Install Dependencies
         Use Poetry (recommended) or pip install -r requirements.txt.

         Ensure all required files are in their respective folders.

   2. (Optional) Edit Paths
         If your folder structure is different, edit the BASE_DIR path in main.py to match your project root.
         BASE_DIR = "/absolute/path/to/core-backend/"

   3. Start the Application
         With Poetry:
         poetry run uvicorn main:app --reload
   
         Or with pip/venv:
         uvicorn main:app --reload

   4. Access the API
         Main API endpoint:http://localhost:8000/identify_card
         POST an image (field name: file, type: image/jpeg or image/png).

         Swagger (interactive docs):http://localhost:8000/docs
         Test endpoints, upload images, view responses.

         Redoc (read-only docs):http://localhost:8000/redoc

API Example Response
json
Copy
Edit
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

## Note:
This model is trained using images from the pokemon-cards.csv dataset, with a total of 13,088 images.The reported Training Set Accuracy is 0.9362.Model training time around ~2 hours 15 minutes.
Important: This model is currently optimized for clean, high-quality images similar to those in the training dataset.It may not correctly identify real-world photos of Pokémon cards taken with a phone or under different lighting, backgrounds, or angles. For best results on real-world uploads, additional training on such photos is recommended.


## How to Run Notebook
  1. Install Dependencies
         Review and use the provided requirements.txt.

  2. Directory Structure to Update

         Check/Update Paths:

            Ensure these directories exist and are correctly referenced in the notebook:
            Base Directory->model,label,data
            Parent Directory->images,Data,ALL_Pokemon_Cards,ALL_Pokemon_Cards_standard

   3. Required Datasets
         Image Dataset: Folder containing Pokemon card images (must be placed in Data directory).
         Metadata CSV: File pokemon-tcg-data-master 1999-2023.csv (must be placed in Data directory).

   4. Testing via Image Upload
         Upload or select an image.
         Use the same preprocessing (resize, normalize).
         Predict card with the saved model.
         Lookup card details in metadata.

## Directory Structure

## High-Level Steps
   Image Preprocessing:
      -Remove duplicates, check for corrupt files.
      -Convert images to RGB, resize to 224x224, save as JPEG.
   Build manifest CSV linking image paths and metadata (id, set, etc).

   Merge Datasets:Merge image manifest with pokemon-tcg-data-master 1999-2023.csv on id.

   Label Mapping:Assign each unique card id an integer label (id2idx, idx2id).

   Dataset & Dataloader:All images used for training (no split).

   Apply strong data augmentation in transforms.

   Model Training:
      -Use a pre-trained ResNet (replace final layer with num_classes).
      - Train on all images, save model as .pth.

      
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

----------------------------------------------------------------------------------------------------------------------------------------------

