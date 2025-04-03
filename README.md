# songs-semantic-correlation

This project aims to analyze the semantic proximity between RaussTuna's original songs using word embeddings and similarity measurements.

## Directory Structure

```
project-folder/
|_ lyrics-analysis/
   |_ data/
   |  |_ model_cbow_s50.txt  # Pre-trained Portuguese word embeddings
   |  |_ ...                 # Other models
   |_ docs/
   |  |_ abstract.pdf        # Paper abstract for this project
   |  |_ poster.pdf          # Poster for this project
   |_ outputs/
   |  |_ output_cbow_s50.csv # Similarity results
   |  |_ result_cbow_s50.png # Visualization results
   |  |_ ...                 # Other analysis outputs
   |_ songs/
   |  |_ song1.json          # Song metadata and lyrics
   |  |_ song2.json
   |  |_ ...
   |  |_ songN.json
   |_ utils/
   |  |_ preprocessing.py    # Preprocessing functions for text cleaning
   |  |_ embeddings.py       # Handles embedding generation and similarity calculations
   |_ visualization/
   |  |_ plot_embeddings.py  # Scripts for generating visualizations
   |_ config.json            # Configuration file for paths and parameters
   |_ main.py                # Main script to orchestrate the analysis
   |_ requirements.txt       # Python dependencies
|_ .gitignore
|_ LICENSE
|_ README.md
```

## Pre-Trained Model

This project requires pre-trained word embeddings for semantic analysis. You can download the embeddings from the NILC website:

**Download pre-trained embedding model:**  
[http://nilc.icmc.usp.br/embeddings](http://nilc.icmc.usp.br/embeddings)

After downloading, extract the file into the `lyrics-analysis/data/` directory and rename it as `download_model.txt`.

Then, update the `embeddings_path` field in `lyrics-analysis/config.json` with the correct filename of the embedding model.

## Installation & Requirements

Ensure you have Python 3 installed. Then, install the required dependencies:

```bash
cd lyrics-analysis
pip install -r requirements.txt
```

## Run

Execute the main script to start the analysis:

```bash
python3 main.py
```