from googleapiclient.discovery import build
import pandas as pd

api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

def get_video_ids(playlist_id):
    video_ids = []
    nextPageToken = None

    while True:
        response = youtube.playlistItems().list(
            part='contentDetails',
            playlistId=playlist_id,
            maxResults=50,
            pageToken=nextPageToken
        ).execute()

        for item in response['items']:
            video_ids.append(item['contentDetails']['videoId'])

        nextPageToken = response.get('nextPageToken')

        if nextPageToken is None:
            break

    return video_ids

def get_video_info(video_ids):
    video_info_list = []

    for video_id in video_ids:
        response = youtube.videos().list(
            part='snippet,statistics',
            id=video_id
        ).execute()

        if 'items' in response:
            video_data = response['items'][0]
            video_info = {
                'video_title': video_data['snippet']['title'],
                'video_description': video_data['snippet']['description'],
                'view_count': video_data['statistics'].get('viewCount', 0),
                'like_count': video_data['statistics'].get('likeCount', 0),
                'comment_count': video_data['statistics'].get('commentCount', 0),
            }

            video_info_list.append(video_info)

    return video_info_list

channel_id = 'UCX6OQ3DkcsbYNE6H8uQQuVA'
response = youtube.channels().list(
    part='contentDetails',
    id=channel_id
).execute()

uploads_playlist_id = response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

video_ids = get_video_ids(uploads_playlist_id)
video_info_list = get_video_info(video_ids)

video_df = pd.DataFrame(video_info_list)
print(video_df)
