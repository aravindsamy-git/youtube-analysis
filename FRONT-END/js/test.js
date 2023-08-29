document.addEventListener("DOMContentLoaded", function () {
    var channel_id = "UCX6OQ3DkcsbYNE6H8uQQuVA"; // Your channel ID
    var php_script_url = "../../BACK-END/php/get channel_data.php"; // Relative path to your PHP script

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var channelData = JSON.parse(xhr.responseText);
                displayChannelInfo(channelData);
            } else {
                console.error("Error fetching channel data:", xhr.statusText);
            }
        }
    };

    xhr.open("GET", php_script_url + "?channel_id=" + channel_id, true);
    xhr.send();
})

function displayChannelInfo(channelData) {
    var logo = document.getElementById("logo");
    logo.innerHTML = `<img src="${channelData.items[0].snippet.thumbnails.default.url}" alt="Channel Logo" />`;

    var channelName = document.getElementById("channelName");
    channelName.textContent = `Channel Name: ${channelData.items[0].snippet.title}`;

    var subscribers = document.getElementById("subscribers");
    subscribers.textContent = `Subscribers: ${channelData.items[0].statistics.subscriberCount}`;

    var joinedDate = document.getElementById("joinedDate");
    joinedDate.textContent = `Joined Date: ${channelData.items[0].snippet.publishedAt}`;

    var channelBio = document.getElementById("channelBio");
    channelBio.textContent = `Channel Bio: ${channelData.items[0].snippet.customUrl}`;

    var channelDescription = document.getElementById("channelDescription");
    channelDescription.textContent = `Channel Description: ${channelData.items[0].snippet.description}`;
}
