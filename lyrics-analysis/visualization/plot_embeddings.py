from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def plot_embeddings(embeddings, song_names, perplexity=30, learning_rate=200):
    pca = PCA(n_components=2)
    reduced_embeddings = pca.fit_transform(np.array(embeddings))

    tsne = TSNE(n_components=2, perplexity=perplexity, learning_rate=learning_rate, random_state=42)

    reduced_embeddings = np.array(reduced_embeddings)

    embeddings_2d = tsne.fit_transform(reduced_embeddings)

    plt.figure(figsize=(10, 8))
    sns.scatterplot(x=embeddings_2d[:, 0], y=embeddings_2d[:, 1], hue=np.array(song_names, dtype=str), palette="tab10", legend=False)

    for i, name in enumerate(song_names):
        plt.annotate(name, (embeddings_2d[i, 0], embeddings_2d[i, 1]),
                 textcoords="offset points", xytext=(5,5), ha='right', fontsize=8)

    plt.title("t-SNE Visualization of Song Embeddings")
    plt.show()
