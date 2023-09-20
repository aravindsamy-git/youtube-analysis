from flask import Flask, render_template
import googleapiclient.discovery
from flask import Flask, request, jsonify
from googleapiclient.discovery import build
import string
from collections import Counter
import json


app = Flask(__name__, template_folder='front-end/html', static_folder='front-end')

api_key = "AIzaSyDHJgRvECdWfPV9xc_D-QMgIjebCzbsCNQ"

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

@app.route('/video_metrics', methods=['POST'])
def get_channel_video_metrics():
    channel_id = request.json['userinput']

    video_data_list = []

    nextPageToken = None

    while True:
        try:
            # Set up parameters for retrieving videos from the channel
            video_search_response = youtube.search().list(
                q='',
                type='video',
                channelId=channel_id,
                part='snippet',
                maxResults=50,  # Number of videos to retrieve per page (maximum: 50)
                pageToken=nextPageToken
            ).execute()

            for search_result in video_search_response.get('items', []):
                video_id = search_result['id']['videoId']
                video_title = search_result['snippet']['title']

                # Get video statistics (likes and comments)
                video_stats_response = youtube.videos().list(
                    part='statistics',
                    id=video_id
                ).execute()

                # Check if the response contains items
                if 'items' in video_stats_response:
                    video_stats = video_stats_response['items'][0]['statistics']
                    # Check if 'likeCount' and 'commentCount' fields exist
                    likes = int(video_stats.get('likeCount', 0))
                    comments = int(video_stats.get('commentCount', 0))
                else:
                    # Handle the case where video statistics are not available
                    likes = 0
                    comments = 0

                # Calculate total engagement (likes + comments)
                total_engagement = likes + comments

                # You can add more video metrics as needed

                video_data_list.append({
                    "title": video_title,
                    "likes": likes,
                    "comments": comments,
                    "total_engagement": total_engagement,  # Add total engagement
                    # Add more video metrics here
                })

            # Check if there are more pages of results
            nextPageToken = video_search_response.get('nextPageToken')
            if not nextPageToken:
                break

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Sort the video list by total engagement (likes + comments) in descending order
    sorted_videos = sorted(video_data_list, key=lambda x: x["total_engagement"], reverse=True)

    # Get the top 10 engagement videos
    top_10_engagement_videos = sorted_videos[:10]

    return jsonify({"video_metrics": top_10_engagement_videos})

if __name__ == '__main__':
    app.run(debug=True)
