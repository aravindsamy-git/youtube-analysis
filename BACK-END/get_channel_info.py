from googleapiclient.discovery import build

api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

def get_channel_info(channel_id):
    response = youtube.channels().list(
        part='snippet,statistics',
        id=channel_id
    ).execute()

    if 'items' in response:
        channel_data = response['items'][0]
        channel_info = {
            'channel_title': channel_data['snippet']['title'],
            'channel_description': channel_data['snippet']['description'],
            'subscriber_count': channel_data['statistics']['subscriberCount'],
            'view_count': channel_data['statistics']['viewCount'],
            'video_count': channel_data['statistics']['videoCount']
        }
        return channel_info
    else:
        return None

channel_id = 'UCX6OQ3DkcsbYNE6H8uQQuVA'
channel_info = get_channel_info(channel_id)

if channel_info:
    print("Channel Title:", channel_info['channel_title'])
    print("Channel Description:", channel_info['channel_description'])
    print("Subscriber Count:", channel_info['subscriber_count'])
    print("View Count:", channel_info['view_count'])
    print("Video Count:", channel_info['video_count'])
else:
    print("Channel not found or error in API response.")
