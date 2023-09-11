from flask import Flask, render_template
import googleapiclient.discovery
from flask import Flask, request, jsonify
from googleapiclient.discovery import build
import string
from collections import Counter
import json



app = Flask(__name__, template_folder='front-end/html', static_folder='front-end')

api_key = "AIzaSyD0t0SxBdD3OFS5snTtVLd4Rm3_zJDL0FE"

youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)


@app.route('/') # Home page route
def home():
    return render_template('home.html')

@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")

@app.route('/searchchannel', methods=['POST'])
def search_channel():
    # Get the channel name from the POST request
    channel_name = request.json['userinput']

    # Initialize a list to store channel data
    channel_data = []

    # Search for channels with the given name
    search_response = youtube.search().list(
        q=channel_name,
        type="channel",
        part="id,snippet",
    ).execute()

    # Check if channels with the given name exist
    if "items" in search_response:
        for item in search_response["items"]:
            channel_id = item["id"]["channelId"]
            channel_title = item["snippet"]["title"]
            channel_logo = item["snippet"]["thumbnails"]["high"]["url"]
            
            # Fetch additional channel information (e.g., subscriber count, description)
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
    # Remove punctuation and convert text to lowercase
    text = text.translate(str.maketrans('', '', string.punctuation)).lower()

    # Split the text into words
    words = text.split()

    # Count word frequencies using Counter
    word_frequencies = Counter(words)

    return word_frequencies

@app.route('/word_frequencies', methods=['POST'])
def generate_word_frequency():
    channel_id = request.json['userinput']
    
    # Initialize the YouTube Data API client
    youtube = build('youtube', 'v3', developerKey=api_key)

    # Make a request to the YouTube Data API to get channel information
    response = youtube.channels().list(
        part='snippet',
        id=channel_id
    ).execute()

    if 'items' in response:
        channel_data = response['items'][0]
        channel_description = channel_data['snippet']['description']
    else:
        channel_description = ''

    # Count word frequencies using the count_word_frequencies function
    word_frequencies = count_word_frequencies(channel_description)
    
    word_frequencies = [
    {"word": word, "frequency": frequency}
    for word, frequency in word_frequencies.items()]
    

    word_frequencies_json = json.dumps(word_frequencies)
    return word_frequencies_json

if __name__ == '__main__':
    app.run(debug=True)
