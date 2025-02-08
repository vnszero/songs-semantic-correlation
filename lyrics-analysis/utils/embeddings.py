from gensim.models import KeyedVectors
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class EmbeddingHandler:
    def __init__(self, embedding_path):
        self.embeddings = KeyedVectors.load_word2vec_format(embedding_path, binary=False)

    def get_sentence_embedding(self, text):
        words = text.split()
        vectors = [self.embeddings[word] for word in words if word in self.embeddings]
        if not vectors:
            return np.zeros(self.embeddings.vector_size) # No valid words found
        return sum(vectors) / len(vectors)

    def calculate_similarity(self, emb1, emb2):
        emb1 = emb1 / np.linalg.norm(emb1)
        emb2 = emb2 / np.linalg.norm(emb2)
        return np.dot(emb1, emb2)
