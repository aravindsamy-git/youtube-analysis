from googleapiclient.discovery import build
import pandas as pd

api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

search_query = 'music'

search_response = youtube.search().list(
    part='snippet',
    q=search_query,
    type='video',
    maxResults=10
).execute()

search_results = []

for item in search_response['items']:
    video_id = item['id']['videoId']
    video_title = item['snippet']['title']
    video_description = item['snippet']['description']
    channel_name = item['snippet']['channelTitle']
    video_url = f'https://www.youtube.com/watch?v={video_id}'
    thumbnail_url = item['snippet']['thumbnails']['default']['url']
    search_results.append({
        'video_id': video_id,
        'video_title': video_title,
        'video_description': video_description,
        'channel_name': channel_name,
        'video_url': video_url,
        'thumbnail_url': thumbnail_url
    })

search_df = pd.DataFrame(search_results)
print(search_df)
