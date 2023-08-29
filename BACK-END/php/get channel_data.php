<?php
$channel_id = $_GET['channel_id']; // Get the channel ID from the query string

// Your YouTube Data API key
$api_key = 'AIzaSyApsrTvd8n3eF9UdxACQP7LXSxto48-vGk';

// Construct the API URL
$api_url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id={$channel_id}&key={$api_key}";

// Fetch data from the API
$response = file_get_contents($api_url);
echo $response;
?>
