# from flask import Flask, request, jsonify, render_template
# import requests

# app = Flask(__name__)

# @app.route('/')
# def index():
#     # Serve the index.html file
#     return render_template('index.html')

# @app.route('/identify_song', methods=['POST'])
# def identify_song():
#     audio_file = request.files['audio']
#     files = {
#         'file': audio_file,
#         'return': 'apple_music,spotify',
#         'api_token': "097a03f7ab11c91dfdf78657be5445a2852",
#     }
#     response = requests.post('https://api.audd.io/', files=files)
#     result = response.json()

#     return jsonify(result)

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify, render_template
import requests
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()
app = Flask(__name__)

# Spotify API credentials
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

def get_spotify_token():
    url = 'https://accounts.spotify.com/api/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    payload = {'grant_type': 'client_credentials'}
    response = requests.post(url, headers=headers, data=payload, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
    
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        print("Failed to get token")
        return None

# def get_album_by_track(track_name, artist_name, token):
#     url = 'https://api.spotify.com/v1/search'
#     headers = {'Authorization': f'Bearer {token}'}
#     params = {'q': f'track:{track_name} artist:{artist_name}', 'type': 'track', 'limit': 1}
#     response = requests.get(url, headers=headers, params=params)
    
#     if response.status_code == 200:
#         tracks = response.json().get('tracks', {}).get('items', [])
#         if tracks:
#             album = tracks[0].get('album', {}).get('name', 'Unknown Album')
#             return album
#         else:
#             return "Track not found"
#     else:
#         return "Failed to search for track"

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

    

@app.route('/')
def index():
    return render_template('index.html')

# @app.route('/identify_song', methods=['POST'])
# def identify_song():
#     audio_file = request.files['audio']
#     data = {
#         'return': 'apple_music,spotify',
#         'api_token': "097a03f7ab11c91f78657be5445a2852",
#     }
#     files = {
#         'file': audio_file,
#     }
#     response = requests.post('https://api.audd.io/', data=data, files=files)
#     result = response.json()
#     print(result)

#     if result.get('result'):
#         spotify_token = get_spotify_token()
#         if spotify_token:
#             song_title = result['result']['title']
#             artist_name = result['result']['artist']
#             album_name = get_album_by_track(song_title, artist_name, spotify_token)
#             result['result']['album'] = album_name
#     return jsonify(result)

@app.route('/identify_song', methods=['POST'])
def identify_song():
    audio_file = request.files['audio']
    data = {
        'return': 'apple_music,spotify',
        'api_token':os.getenv("AUDD_API_KEY"),
    }
    files = {
        'file': audio_file,
    }
    response = requests.post('https://api.audd.io/', data=data, files=files)
    result = response.json()
    
    if result.get('result'):
        spotify_token = get_spotify_token()
        if spotify_token:
            song_title = result['result']['title']
            artist_name = result['result']['artist']
            album_name, album_image_url = get_album_by_track(song_title, artist_name, spotify_token)
            # Update the result object to include both album name and image URL separately
            result['result']['album'] = album_name
            result['result']['album_image_url'] = album_image_url  # Add a new field for the image URL
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

