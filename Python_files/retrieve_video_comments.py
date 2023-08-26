from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import pandas as pd

api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

channel_id = 'UCX6OQ3DkcsbYNE6H8uQQuVA'

try:
    channels_response = youtube.channels().list(
        part='contentDetails',
        id=channel_id
    ).execute()

    uploads_playlist_id = channels_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

    video_ids = []
    nextPageToken = None

    while True:
        playlist_response = youtube.playlistItems().list(
            part='contentDetails',
            playlistId=uploads_playlist_id,
            maxResults=50,
            pageToken=nextPageToken
        ).execute()

        for item in playlist_response['items']:
            video_ids.append(item['contentDetails']['videoId'])

        nextPageToken = playlist_response.get('nextPageToken')

        if nextPageToken is None:
            break

    for video_id in video_ids:
        comments_data = []

        response = youtube.commentThreads().list(
            part='id,snippet',
            videoId=video_id,
            maxResults=100
        ).execute()

        for item in response['items']:
            comment_data = {
                'Video ID': video_id,
                'Comment ID': item['id'],
                'Comment': item['snippet']['topLevelComment']['snippet']['textDisplay'],
                'Author Name': item['snippet']['topLevelComment']['snippet']['authorDisplayName'],
                'Timestamp': item['snippet']['topLevelComment']['snippet']['publishedAt']
            }
            comments_data.append(comment_data)

        df = pd.DataFrame(comments_data)
        print(f"DataFrame for Video ID: {video_id}")
        print(df)
        print("\n")

except HttpError as e:
    print('An HTTP error occurred:', e.content)
