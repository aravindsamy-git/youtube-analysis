from googleapiclient.discovery import build
import pandas as pd

api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

channel_id = 'CHANNEL_ID'

response = youtube.playlists().list(
    part='id',
    channelId=channel_id,
    maxResults=50
).execute()

playlist_ids = [item['id'] for item in response['items']]

def get_video_metrics(video_id):
    response = youtube.videos().list(
        part='statistics',
        id=video_id
    ).execute()
    video_data = response['items'][0]['statistics']
    return {
        'video_id': video_id,
        'like_count': video_data.get('likeCount', 0),
        'dislike_count': video_data.get('dislikeCount', 0),
        'comment_count': video_data.get('commentCount', 0),
        'share_count': video_data.get('shareCount', 0)
    }

video_metrics_list = []

for playlist_id in playlist_ids:
    response = youtube.playlistItems().list(
        part='contentDetails',
        playlistId=playlist_id,
        maxResults=50
    ).execute()

    video_ids = [item['contentDetails']['videoId'] for item in response['items']]

    for video_id in video_ids:
        video_metrics = get_video_metrics(video_id)
        video_metrics_list.append(video_metrics)

video_metrics_df = pd.DataFrame(video_metrics_list)
print(video_metrics_df)
