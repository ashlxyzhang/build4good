import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load the dataset
data_path = 'Top5000.csv'
album_data = pd.read_csv(data_path)

# Handle missing values
album_data['gens'] = album_data['gens'].fillna('')
album_data['descs'] = album_data['descs'].fillna('')

# Combine genres and descriptions into a single text feature
album_data['combined_features'] = album_data['gens'] + ' ' + album_data['descs']

# Vectorize the combined text features using TF-IDF
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(album_data['combined_features'])

# Select and standardize the numerical features
numerical_features = album_data[['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'tempo', 'valence']]
scaler = StandardScaler()
scaled_numerical_features = scaler.fit_transform(numerical_features)

# Combine the TF-IDF features with the scaled numerical features
combined_features = np.hstack([tfidf_matrix.toarray(), scaled_numerical_features])

# Calculate the cosine similarity matrix for the combined features
cosine_sim = cosine_similarity(combined_features, combined_features)

def recommend_albums(album_name, album_data, cosine_sim, top_n=10):
    """
    Recommend top N similar albums based on a given album name.
    
    :param album_name: Name of the album to find recommendations for.
    :param album_data: DataFrame containing album data.
    :param cosine_sim: Cosine similarity matrix.
    :param top_n: Number of top similar albums to return.
    :return: DataFrame with top N recommended albums.
    """
    if album_name not in album_data['album'].values:
        return f"No album named '{album_name}' found in the dataset."
        
    idx = album_data.index[album_data['album'] == album_name].tolist()[0]
    
    # Get the pairwise similarity scores of all albums with that album
    sim_scores = list(enumerate(cosine_sim[idx]))
    
    # Sort the albums based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get the scores of the top N most similar albums, ignoring the first one as it is the input album itself
    sim_scores = sim_scores[1:top_n + 1]
    
    # Get the album indices
    album_indices = [i[0] for i in sim_scores]
    
    # Return the top N most similar albums
    return album_data.iloc[album_indices][['album', 'ars_name', 'avg_rat', 'gens', 'descs']]

# Example usage
# test_album_name = "Born to Run"
# print(recommend_albums(test_album_name, album_data, cosine_sim, top_n=5))
