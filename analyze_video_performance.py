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

def get_video_performance(video_id):
    response = youtube.videos().list(
        part='snippet,statistics',
        id=video_id
    ).execute()

    video_data = response['items'][0]
    title = video_data['snippet']['title']
    views = video_data['statistics']['viewCount']
    likes = video_data['statistics']['likeCount']
    dislikes = video_data['statistics']['dislikeCount']
    comments = video_data['statistics']['commentCount']

    return {
        'video_id': video_id,
        'title': title,
        'views': views,
        'likes': likes,
        'dislikes': dislikes,
        'comments': comments
    }

performance_data = []

for video_id in video_ids:
    video_performance = get_video_performance(video_id)
    performance_data.append(video_performance)

performance_df = pd.DataFrame(performance_data)
print(performance_df)
