from googleapiclient.discovery import build
import pandas as pd

api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

video_id = 'YOUR_VIDEO_ID'

related_response = youtube.search().list(
    part='snippet',
    relatedToVideoId=video_id,
    type='video',
    maxResults=10
).execute()

related_videos = []

for item in related_response['items']:
    related_video_id = item['id']['videoId']
    related_video_title = item['snippet']['title']
    related_video_description = item['snippet']['description']
    related_channel_name = item['snippet']['channelTitle']
    related_video_url = f'https://www.youtube.com/watch?v={related_video_id}'
    related_thumbnail_url = item['snippet']['thumbnails']['default']['url']
    related_videos.append({
        'related_video_id': related_video_id,
        'related_video_title': related_video_title,
        'related_video_description': related_video_description,
        'related_channel_name': related_channel_name,
        'related_video_url': related_video_url,
        'related_thumbnail_url': related_thumbnail_url
    })

related_df = pd.DataFrame(related_videos)
print(related_df)
