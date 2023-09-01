<?php
if (isset($_GET['query'])) {
    $query = urlencode($_GET['query']);
    $apiKey = 'AIzaSyApsrTvd8n3eF9UdxACQP7LXSxto48-vGk';

    $apiEndpoint = "https://www.googleapis.com/youtube/v3/search?q=$query&type=channel&part=snippet&key=$apiKey";
    $response = file_get_contents($apiEndpoint);
    $data = json_decode($response, true);

    if ($data && isset($data['items'])) {
        $channels = $data['items'];
        foreach ($channels as $channel) {
            $title = $channel['snippet']['title'];
            $description = $channel['snippet']['description'];
            $thumbnail = $channel['snippet']['thumbnails']['default']['url'];

            echo "<div class='channel-card'>
                    <img src='$thumbnail' alt='Channel Thumbnail'>
                    <h3>$title</h3>
                    <p>$description</p>
                  </div>";
        }
    } else {
        echo "<p>No search results found.</p>";
    }
}
?>