from flask import Flask, render_template
import googleapiclient.discovery
from flask import Flask, request, jsonify


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


if __name__ == '__main__':
    app.run(debug=True)
