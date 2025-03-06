from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from adjustText import adjust_text

def plot_embeddings(embeddings, embedding_path, song_names, perplexity=30, learning_rate=200):
    pca = PCA(n_components=2)
    reduced_embeddings = pca.fit_transform(np.array(embeddings))

    tsne = TSNE(n_components=2, perplexity=perplexity, learning_rate=learning_rate, random_state=42)
    embeddings_2d = tsne.fit_transform(reduced_embeddings)

    plt.figure(figsize=(12, 10))  # Bigger figure for better spacing
    sns.scatterplot(x=embeddings_2d[:, 0], y=embeddings_2d[:, 1], 
                    hue=song_names, palette="tab10", legend=False, alpha=0.8)  # Add transparency

    # Store text labels for adjustment
    texts = []
    for i, name in enumerate(song_names):
        texts.append(plt.text(embeddings_2d[i, 0], embeddings_2d[i, 1], name, 
                              fontsize=9, ha='center', bbox=dict(facecolor='white', alpha=0.5, edgecolor='none')))

    adjust_text(texts, arrowprops=dict(arrowstyle="-", color='gray', alpha=0.5))  # Auto-adjust labels

    embedding_lib_name = embedding_path.removeprefix('data/').removesuffix('.txt')
    plt.title(f"Representação visual de semelhanças entre canções\nModelo {embedding_lib_name}")  
    plt.xlabel("Estilo lírico (Dimensão 1)")  
    plt.ylabel("Estilo lírico (Dimensão 2)")

    plt.show()
