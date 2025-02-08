import os
import json
from utils.preprocessing import preprocess_lyrics
from utils.embeddings import EmbeddingHandler
from visualization.plot_embeddings import plot_embeddings

def load_and_preprocess_songs(songs_dir):
    songs_data = []
    for filename in os.listdir(songs_dir):
        if filename.endswith(".json"):
            filepath = os.path.join(songs_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                song = json.load(f)
                processed_lyrics = preprocess_lyrics(song.get("lyrics", ""))
                songs_data.append({
                    "name": song.get("name"),
                    "processed_lyrics": processed_lyrics
                })
    return songs_data

def load_config(config_path="config.json"):
    with open(config_path, 'r') as f:
        return json.load(f)

def main():
    config = load_config()
    songs_dir = config["songs_directory"]
    embedding_path = config["embeddings_path"]
    tsne_params = config.get("tsne_params", {"perplexity": 30, "learning_rate": 200})

    # load songs
    songs = load_and_preprocess_songs(songs_dir)

    # load embeddings
    embedding_handler = EmbeddingHandler(embedding_path)

    # generate embeddings
    for song in songs:
        lyrics = song["processed_lyrics"]
        embedding = embedding_handler.get_sentence_embedding(lyrics)
        song["embedding"] = embedding

    # filter out songs with no valid embedding
    songs_with_embeddings = [song for song in songs if song["embedding"] is not None]

    similarities = []
    num_songs = len(songs_with_embeddings)
    for i in range(num_songs):
        for j in range(i + 1, num_songs):  # To avoid (A vs B and B vs A)
            sim = embedding_handler.calculate_similarity(
                songs_with_embeddings[i]["embedding"],
                songs_with_embeddings[j]["embedding"]
            )
            similarities.append((songs_with_embeddings[i]["name"], songs_with_embeddings[j]["name"], sim))

    # order by similarity (opcional)
    similarities.sort(key=lambda x: x[2], reverse=True)

    # Exibir resultados formatados
    print("Similarity between songs:")
    for song1, song2, sim in similarities:
        print(f"{song1} ↔ {song2}: {sim:.4f}")

    print(f"Musics with embeddings: {num_songs}")

    # plot embeddings with t-SNE
    embeddings = [song["embedding"] for song in songs_with_embeddings]
    song_names = [song["name"] for song in songs_with_embeddings]

    tsne_params["perplexity"] = min(tsne_params["perplexity"], len(songs_with_embeddings) - 1)

    plot_embeddings(embeddings, song_names, **tsne_params)

if __name__ == "__main__":
    main()
