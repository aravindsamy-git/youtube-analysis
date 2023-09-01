<?php
// Replace 'YOUR_API_KEY' with your actual YouTube Data API key
$apiKey = 'YOUR_API_KEY';

// Function to get the channel ID from a custom URL
function getChannelIdFromCustomUrl($url, $apiKey) {
    // Extract the username from the custom URL
    $username = substr($url, strrpos($url, '@') + 1);

    // Prepare the YouTube Data API URL to retrieve channel ID based on the username
    $apiUrl = "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=$username&key=$apiKey";

    // Make an HTTP request to the YouTube Data API
    $response = file_get_contents($apiUrl);

    if ($response !== false) {
        $data = json_decode($response, true);

        if (isset($data['items'][0]['id'])) {
            return $data['items'][0]['id'];
        }
    }

    return false;
}

// Function to fetch channel details based on a query
function fetchChannelDetails($query, $apiKey) {
    $query = urlencode($query);
    $apiEndpoint = "https://www.googleapis.com/youtube/v3/search?q=$query&type=channel&part=snippet&key=$apiKey";
    $response = file_get_contents($apiEndpoint);
    $data = json_decode($response, true);

    $channelsData = [];

    if ($data && isset($data['items'])) {
        foreach ($data['items'] as $channel) {
            $title = $channel['snippet']['title'];
            $description = $channel['snippet']['description'];
            $thumbnail = $channel['snippet']['thumbnails']['default']['url'];
            $customUrl = $channel['snippet']['customUrl'];

            $channelId = getChannelIdFromCustomUrl("https://www.youtube.com/@$customUrl", $apiKey);

            if ($channelId) {
                $channelsData[] = [
                    'channelId' => $channelId,
                    'title' => $title,
                    'description' => $description,
                    'thumbnail' => $thumbnail,
                ];
            }
        }
    }

    return $channelsData;
}

if (isset($_GET['query'])) {
    $query = urlencode($_GET['query']);
    $channelsData = fetchChannelDetails($query, $apiKey);

    // Now you have an array of channel data that you can use as needed
    // You can loop through $channelsData and populate the data as desired
    foreach ($channelsData as $channelData) {
        $channelId = $channelData['channelId'];
        $title = $channelData['title'];
        $description = $channelData['description'];
        $thumbnail = $channelData['thumbnail'];

        // Populate the data as needed (e.g., display in HTML)
        echo "<div class='channel-card'>
              <img src='$thumbnail' alt='Channel Thumbnail'>
              <p class='channel-card-title'>$title</p>
              <p class='channel-card-description'>$description</p>
            </div>";
    }
}
?>
