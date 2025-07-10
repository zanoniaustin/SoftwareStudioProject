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