import re
import spacy

try:
    # load the portuguese spaCy model
    nlp = spacy.load("pt_core_news_sm")
except OSError:
    print("Model 'pt_core_news_sm' not found. Installing...")
    import os
    os.system("python -m spacy download pt_core_news_sm")
    nlp = spacy.load("pt_core_news_sm")

def preprocess_lyrics(lyrics:str):
    # convert to lowercase
    lyrics = lyrics.lower()

    # remove ponctuation and special characters
    lyrics = re.sub(r"[^\w\s]", "", lyrics)

    # Process the text with spaCy
    doc = nlp(lyrics)

    # tokenize, remove stopwords and stemming
    tokens = [
        token.lemma_
        for token in doc
        if not token.is_stop and not token.is_punct and not token.is_space
    ]

    return " ".join(tokens)
