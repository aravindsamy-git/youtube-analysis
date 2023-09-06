from googleapiclient.discovery import build
import pandas as pd

api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

channel_id = 'CHANNEL_ID'

video_ids = []

response = youtube.channels().list(
    part='contentDetails',
    id=channel_id
).execute()

uploads_playlist_id = response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

next_page_token = None

while True:
    response = youtube.playlistItems().list(
        part='contentDetails',
        playlistId=uploads_playlist_id,
        maxResults=50,
        pageToken=next_page_token
    ).execute()

    for item in response['items']:
        video_ids.append(item['contentDetails']['videoId'])

    next_page_token = response.get('nextPageToken')

    if next_page_token is None:
        break

def get_video_viewer_behavior(video_id):
    response = youtube.videos().list(
        part='statistics,insights',
        id=video_id
    ).execute()

    video_data = response['items'][0]
    insights = video_data['insights']['averageViewPercentage']

    return {
        'video_id': video_id,
        'average_view_percentage': insights
    }

viewer_behavior_data = []

for video_id in video_ids:
    viewer_behavior = get_video_viewer_behavior(video_id)
    viewer_behavior_data.append(viewer_behavior)

viewer_behavior_df = pd.DataFrame(viewer_behavior_data)
print(viewer_behavior_df)
