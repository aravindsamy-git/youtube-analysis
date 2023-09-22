from flask import Flask, render_template, request, jsonify, redirect, url_for
import googleapiclient.discovery
from googleapiclient.discovery import build
import string
from collections import Counter
import json
from textblob import TextBlob
from flask_sqlalchemy import SQLAlchemy
import bcrypt


app = Flask(__name__, template_folder='front-end/html', static_folder='front-end')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///youtube_analytics.db'

db = SQLAlchemy(app)

api_key = "AIzaSyBVUV0g_pn-zkenxmgt1pqHMcjsOpR2-9c"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    name = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'


youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        new_user = User(name=name, email=email, password=hashed_password)

        try:
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('dashboard'))
        except Exception as e:
            return render_template('home.html')

    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
            return redirect(url_for('dashboard'))


@app.route('/searchchannel', methods=['POST'])
def search_channel():
    channel_name = request.json['userinput']
    channel_data = []
    search_response = youtube.search().list(
        q=channel_name,
        type="channel",
        part="id,snippet",
    ).execute()
    if "items" in search_response:
        for item in search_response["items"]:
            channel_id = item["id"]["channelId"]
            channel_title = item["snippet"]["title"]
            channel_logo = item["snippet"]["thumbnails"]["high"]["url"]
            channel_info = youtube.channels().list(
                id=channel_id,
                part="statistics,snippet"
            ).execute()

            if "items" in channel_info:
                channel_stats = channel_info["items"][0]["statistics"]

                channel_data.append({
                    "name": channel_title,
                    "id": channel_id,
                    "logo": channel_logo,
                    "subscriberCount": channel_stats.get("subscriberCount", "N/A"),
                })

    return jsonify(channel_data)


def count_word_frequencies(text):
    text = text.translate(str.maketrans('', '', string.punctuation)).lower()
    words = text.split()
    word_frequencies = Counter(words)

    return word_frequencies

@app.route('/word_frequencies', methods=['POST'])
def generate_word_frequency():
    channel_id = request.json['userinput']
    youtube = build('youtube', 'v3', developerKey=api_key)
    response = youtube.channels().list(
        part='snippet',
        id=channel_id
    ).execute()

    if 'items' in response:
        channel_data = response['items'][0]
        channel_description = channel_data['snippet']['description']
    else:
        channel_description = ''
    word_frequencies = count_word_frequencies(channel_description)
    
    word_frequencies = [
    {"word": word, "frequency": frequency}
    for word, frequency in word_frequencies.items()]
    

    word_frequencies_json = json.dumps(word_frequencies)
    return word_frequencies_json

@app.route('/video_metrics', methods=['POST'])
def get_channel_video_metrics():
    channel_id = request.json['userinput']

    video_data_list = []

    nextPageToken = None

    while True:
        try:
            video_search_response = youtube.search().list(
                q='',
                type='video',
                channelId=channel_id,
                part='snippet',
                maxResults=50,
                pageToken=nextPageToken
            ).execute()

            for search_result in video_search_response.get('items', []):
                video_id = search_result['id']['videoId']
                video_title = search_result['snippet']['title']
                video_stats_response = youtube.videos().list(
                    part='statistics',
                    id=video_id
                ).execute()
                if 'items' in video_stats_response:
                    video_stats = video_stats_response['items'][0]['statistics']
                    likes = int(video_stats.get('likeCount', 0))
                    comments = int(video_stats.get('commentCount', 0))
                else:
                    likes = 0
                    comments = 0
                total_engagement = likes + comments

                video_data_list.append({
                    "title": video_title,
                    "likes": likes,
                    "comments": comments,
                    "total_engagement": total_engagement,
                })

            nextPageToken = video_search_response.get('nextPageToken')
            if not nextPageToken:
                break

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    sorted_videos = sorted(video_data_list, key=lambda x: x["total_engagement"], reverse=True)

    top_10_engagement_videos = sorted_videos[:10]

    return jsonify({"video_metrics": top_10_engagement_videos})


@app.route("/get_video_sentiment", methods=['POST'])
def get_video_sentiment():
    channel_id = request.json['userinput']

    sentiment_counts = {
        "positive": 0,
        "neutral": 0,
        "negative": 0,
    }

    nextPageToken = None

    while True:
        try:
            video_search_response = youtube.search().list(
                q='',
                type='video',
                channelId=channel_id,
                part='snippet',
                maxResults=50,
                pageToken=nextPageToken
            ).execute()

            for search_result in video_search_response.get('items', []):
                video_id = search_result['id']['videoId']

                video_details_response = youtube.videos().list(
                    part='snippet',
                    id=video_id
                ).execute()

                if 'items' in video_details_response:
                    video_details = video_details_response['items'][0]['snippet']
                    description = video_details.get('description', 'No description available')
                    text_blob = TextBlob(description)
                    polarity = text_blob.sentiment.polarity

                    if polarity > 0:
                        sentiment_counts["positive"] += 1
                    elif polarity < 0:
                        sentiment_counts["negative"] += 1
                    else:
                        sentiment_counts["neutral"] += 1

            nextPageToken = video_search_response.get('nextPageToken')
            if not nextPageToken:
                break

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            break

    return jsonify(sentiment_counts)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
