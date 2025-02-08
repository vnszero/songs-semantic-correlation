# songs-semantic-correlation
This project seeks to make a proximity analysis between RaussTuna's original songs

## directory structure
project-folder/
|_ lyrics-analysis/
||_ songs/
|||_ song1.json
|||_ song2.json
|||_ ...
|||_ songN.json
||_ data/
|||_ cbow_s50.txt  # Pre-trained Portuguese word embeddings
||_ utils/
|||_ preprocessing.py  # Contains preprocessing functions
|||_ embeddings.py     # Handles embedding generation and similarity calculations
||_ visualization/
|||_ plot_embeddings.py  # Visualization scripts
||_ config.json        # Configuration file for paths and parameters
||_ main.py            # Main script to orchestrate the analysis
||_ requirements.txt
|_ .gitignore
|_ LICENSE
|_ README.md

## pre-trained model
Download pre-trained embedding model:
http://nilc.icmc.usp.br/embeddings

Extract it to lyrics-analysis/data/download_model.txt

Update embeddings_path in config.json file name