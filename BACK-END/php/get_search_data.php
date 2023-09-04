<?php
if (isset($_GET["channelName"])) {
    $channelName = $_GET["channelName"];
    $apiKey = "AIzaSyApsrTvd8n3eF9UdxACQP7LXSxto48-vGk"; // Replace with your actual API key

    // Create a YouTube Data API request URL to search for channels
    $channelSearchUrl = "https://www.googleapis.com/youtube/v3/search?q=" . urlencode($channelName) . "&type=channel&part=id&key=" . $apiKey;

    // Make the API request to search for channels
    $channelSearchResponse = file_get_contents($channelSearchUrl);

    // Parse the JSON response for channel search
    $channelSearchData = json_decode($channelSearchResponse, true);

    // Initialize an array to store channel details
    $channelDetails = [];

    // Display the channel information
    if (isset($channelSearchData["items"])) {
        foreach ($channelSearchData["items"] as $channelItem) {
            $channelId = $channelItem["id"]["channelId"];

            // Create a YouTube Data API request URL to retrieve channel details
            $channelDetailsUrl = "https://www.googleapis.com/youtube/v3/channels?id=" . $channelId . "&part=snippet,statistics&key=" . $apiKey;

            // Make the API request to retrieve channel details
            $channelDetailsResponse = file_get_contents($channelDetailsUrl);

            // Parse the JSON response for channel details
            $channelDetailsData = json_decode($channelDetailsResponse, true);

            if (isset($channelDetailsData["items"][0])) {
                $channelSnippet = $channelDetailsData["items"][0]["snippet"];
                $channelStatistics = $channelDetailsData["items"][0]["statistics"];
                $channelLogo = $channelSnippet["thumbnails"]["default"]["url"];
                $channelTitle = $channelSnippet["title"];
                $channelDescription = $channelSnippet["description"];
                $subscriberCount = $channelStatistics["subscriberCount"];

                // Store channel details in an array
                $channelDetails[] = [
                    "logo" => $channelLogo,
                    "name" => $channelTitle,
                    "description" => $channelDescription,
                    "subscriberCount" => $subscriberCount,
                ];
            }
        }
    }

    // Check if any channels were found and return the channel details as JSON
    if (count($channelDetails) > 0) {
        header("Content-Type: application/json");
        echo json_encode($channelDetails);
    } else {
        $noChannelsMessage = ["message" => "No channels found with the name '" . $channelName . "'"];
        header("Content-Type: application/json");
        echo json_encode($noChannelsMessage);
    }
} else {
    echo "No channel name provided.";
}
?>