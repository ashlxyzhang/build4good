from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS
from dotenv import load_dotenv

# Import the recommendation function from the script
from script import recommend_albums, album_data, cosine_sim

load_dotenv()
app = Flask(__name__)
CORS(app)

# Spotify API credentials
SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")

def get_spotify_token():
    url = 'https://accounts.spotify.com/api/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    payload = {'grant_type': 'client_credentials'}
    response = requests.post(url, headers=headers, data=payload, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
    
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        print("Failed to get token")
        print(f"Error: {response.text}")
        print(f"Status Code: {response.status_code}")
        return None

spotify_token = get_spotify_token()

@app.route('/recommend', methods=['GET'])
def recommend():
    album_name = request.args.get('album_name')
    recommendations = recommend_albums(album_name, album_data, cosine_sim, top_n=10)
    if isinstance(recommendations, str):
        return jsonify({"error": recommendations}), 404
    return jsonify(recommendations.to_dict('records'))

def get_album_by_track(track_name, artist_name, token):
    url = 'https://api.spotify.com/v1/search'
    headers = {'Authorization': f'Bearer {token}'}
    params = {'q': f'track:{track_name} artist:{artist_name}', 'type': 'track', 'limit': 1}
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        tracks = response.json().get('tracks', {}).get('items', [])
        if tracks:
            album_data = tracks[0].get('album', {})
            album_name = album_data.get('name', 'Unknown Album')
            # Fetch the album image. Assuming we want the first image (typically the largest)
            album_image_url = album_data.get('images', [{}])[0].get('url', '')
            return album_name, album_image_url  # Return both name and image URL
        else:
            return "Track not found", ""
    else:
        return "Failed to search for track", ""
    
def get_pic_by_album(album_name, artist_name, token):
    url = 'https://api.spotify.com/v1/search'
    headers = {'Authorization': f'Bearer {token}'}
    params = {'q': f'album:{album_name} artist:{artist_name}', 'type': 'track', 'limit': 1}
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        tracks = response.json().get('tracks', {}).get('items', [])
        if tracks:
            album_data = tracks[0].get('album', {})
            # Fetch the album image. Assuming we want the first image (typically the largest)
            album_image_url = album_data.get('images', [{}])[0].get('url', '')
            return album_image_url  # Return both name and image URL
        else:
            return "Album not found", ""
    else:
        return "Failed to search for album", ""

@app.route('/identify_song', methods=['POST'])
def identify_song():
    audio_file = request.files['audio']
    data = {
        'return': 'apple_music,spotify',
        'api_token':os.environ.get("AUDD_API_KEY"),
    }
    files = {
        'file': audio_file,
    }
    response = requests.post('https://api.audd.io/', data=data, files=files)
    result = response.json()
    
    if result.get('result'):
        if spotify_token:
            song_title = result['result']['title']
            artist_name = result['result']['artist']
            album_name, album_image_url = get_album_by_track(song_title, artist_name, spotify_token)
            # Update the result object to include both album name and image URL separately
            result['result']['album'] = album_name
            result['result']['album_image_url'] = album_image_url  # Add a new field for the image URL
    return jsonify(result)

@app.route('/get_album_art', methods=['GET'])
def get_album_art():
    if spotify_token:
        album_image_url = get_pic_by_album(request.args.get('album_title'), request.args.get('artist_name'), spotify_token)
    return album_image_url

if __name__ == '__main__':
    app.run(debug=True)