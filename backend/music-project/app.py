from flask import Flask, request, jsonify, render_template, send_from_directory
import os

# Import the recommendation function from the script
from script import recommend_albums, album_data, cosine_sim

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    # Serve the index.html file
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    album_name = data['album_name']
    recommendations = recommend_albums(album_name, album_data, cosine_sim, top_n=10)
    if isinstance(recommendations, str):
        return jsonify({"error": recommendations}), 404
    return jsonify(recommendations.to_dict('records'))

if __name__ == '__main__':
    app.run(debug=True)
