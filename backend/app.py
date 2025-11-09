# backend/app.py (Final Code with Single Video Embed Logic)

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from werkzeug.security import generate_password_hash, check_password_hash
from googleapiclient.discovery import build
import datetime
import os

# ⚠️ महत्वपूर्ण: अपनी असली YouTube Data API Key यहाँ डालें 
YOUTUBE_API_KEY = "AIzaSyDv-lHf00jZUQ09u6aqkOgDXzsGLmnHi5w"

app = Flask(__name__)
CORS(app) 

# SQLite डेटाबेस कॉन्फ़िगरेशन
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ----------------------------------------------------------------------
# 1. डेटाबेस मॉडल 
# ----------------------------------------------------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# ----------------------------------------------------------------------
# 2. Flask Setup: डेटाबेस बनाना
# ----------------------------------------------------------------------
with app.app_context():
    if not os.path.exists('site.db'):
        db.create_all()
        print("SQLite Database 'site.db' created.")
    else:
        print("SQLite Database already exists.")

# ----------------------------------------------------------------------
# 3. मूड मैपिंग और YouTube API सेटअप
# ----------------------------------------------------------------------
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

MOOD_TO_QUERY = {
    'Happy': 'Uplifting Bollywood Party Songs', 
    'Sad': 'Emotional Indian Acoustic Songs',    
    'Energetic': 'High Energy Bollywood Workout Hits', 
    'Relaxing': 'Calm Indian Instrumental Music',    
    'Romantic': 'Best Romantic Bollywood Love Songs',
    'Angry': 'Intense Indian Rock Metal Songs', 
}

# ----------------------------------------------------------------------
# 4. YouTube Helper Function (Single Working Video Logic)
# ----------------------------------------------------------------------
def fetch_working_video_id(query):
    """
    सर्च क्वेरी के लिए एक single, embeddable, और working video ID लौटाता है।
    """
    # चरण 1: YouTube API से 5 Video ID प्राप्त करें
    search_response = youtube.search().list(
        q=query, # प्लेलिस्ट की बजाय सीधे वीडियो सर्च करें
        part='snippet',
        maxResults=5, 
        type='video'
    ).execute()

    video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]

    if not video_ids:
        return None, None 

    # चरण 2: प्रत्येक वीडियो की उपलब्धता और एम्बेड की अनुमति की जाँच करें
    videos_info = youtube.videos().list(
        id=','.join(video_ids), 
        part='status,player,snippet'
    ).execute()
    
    for item in videos_info.get('items', []):
        status = item.get('status', {})
        player = item.get('player', {})
        
        is_public = status.get('uploadStatus') == 'processed'
        is_embeddable = player.get('embedHtml') is not None
        
        if is_public and is_embeddable:
            # पहला वैध वीडियो मिलते ही उसे लौटा दें
            title = item['snippet']['title']
            return item['id'], title
    
    return None, None 


# ----------------------------------------------------------------------
# 5. API Routes (अब केवल Single Video ID लौटा रहे हैं)
# ----------------------------------------------------------------------
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'error': 'All fields are required'}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({'error': 'User already exists with this email'}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password_hash=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Signup successful! You can now log in.'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database error during signup: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        return jsonify({
            'message': f'Login successful for {user.name}', 
            'token': 'dummy_jwt_token', 
            'user': {'name': user.name, 'email': user.email}
        }), 200
    
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/get_playlist', methods=['POST'])
def get_playlist():
    data = request.get_json()
    mood = data.get('mood')

    if not mood or mood not in MOOD_TO_QUERY:
        return jsonify({'error': 'Invalid mood selected'}), 400

    search_query = MOOD_TO_QUERY.get(mood)
    
    try:
        # सिंगल वीडियो ID प्राप्त करें
        video_id, video_title = fetch_working_video_id(search_query)

        if video_id:
            return jsonify({
                'mood': mood,
                'title': video_title,
                'videoId': video_id, 
                'is_single_video': True 
            })

        return jsonify({'error': 'No suitable video found.'}), 404

    except Exception as e:
        print(f"YouTube API Error: {e}")
        return jsonify({'error': 'YouTube API communication failed'}), 500

@app.route('/api/search_playlist', methods=['POST'])
def search_playlist():
    data = request.get_json()
    search_term = data.get('query')

    if not search_term:
        return jsonify({'error': 'Search query cannot be empty'}), 400

    full_query = search_term + ' indian songs'
    
    try:
        # सिंगल वीडियो ID प्राप्त करें
        video_id, video_title = fetch_working_video_id(full_query)

        if video_id:
            return jsonify({
                'mood': search_term, 
                'title': video_title,
                'videoId': video_id, 
                'is_single_video': True 
            })

        return jsonify({'error': f'No suitable video found for: {search_term}'}), 404

    except Exception as e:
        print(f"YouTube API Error: {e}")
        return jsonify({'error': 'YouTube API communication failed'}), 500


# ----------------------------------------------------------------------
# 6. सर्वर चलाना
# ----------------------------------------------------------------------
if __name__ == '__main__':
    print("Flask server running on http://127.0.0.1:5000/")
    app.run(debug=True, port=5000)