from googleapiclient.discovery import build
import pandas as pd

api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

channel_id = 'CHANNEL_ID'

playlists_response = youtube.playlists().list(
    part='snippet,contentDetails',
    channelId=channel_id,
    maxResults=50
).execute()

playlist_ids = [item['id'] for item in playlists_response['items']]

video_metrics_list = []

for playlist_id in playlist_ids:
    playlist_items_response = youtube.playlistItems().list(
        part='contentDetails',
        playlistId=playlist_id,
        maxResults=50
    ).execute()

    video_ids = [item['contentDetails']['videoId'] for item in playlist_items_response['items']]

    for video_id in video_ids:
        video_response = youtube.videos().list(
            part='statistics',
            id=video_id
        ).execute()

        video_data = video_response['items'][0]['statistics']
        video_metrics_list.append({
            'video_id': video_id,
            'views': video_data.get('viewCount', 0),
            'likes': video_data.get('likeCount', 0),
            'comments': video_data.get('commentCount', 0)
        })

video_df = pd.DataFrame(video_metrics_list)
print(video_df)
