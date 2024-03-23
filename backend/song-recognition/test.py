import requests

# Replace 'YOUR_AUDD_API_TOKEN_HERE' with your actual Audd.io API token
API_TOKEN = "d827c87cbacc09b9cd4357bbce3d0812"
AUDIO_FILE_PATH = 'steamroller.mp3'

def test_audd_api(api_token, audio_file_path):
    url = 'https://api.audd.io/'
    files = {'file': open(audio_file_path, 'rb')}
    data = {'api_token': api_token, 'return': 'apple_music,spotify'}

    response = requests.post(url, files=files, data=data)
    return response.json()

if __name__ == '__main__':
    result = test_audd_api(API_TOKEN, AUDIO_FILE_PATH)
    print(result)
