document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchQuerySubmit");

    searchButton.addEventListener("click", () => {
        const channelName = document.getElementById("searchQueryInput").value;
        console.log(channelName)
        searchChannels(channelName);
    });
});


function searchChannels(channelName) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `../../BACK-END/php/get_search_data.php?query=${channelName}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const channelList = document.getElementById("channel-list");

            // Clear previous results
            channelList.innerHTML = "";

            const data = JSON.parse(xhr.responseText);

            if (data.length > 0) {
                const results = data.map((channel) => {
                    return `<div><img src='${channel.logo}' alt='Channel Logo'><h2>${channel.name}</h2><p><strong>Description:</strong> ${channel.description}</p><p><strong>Subscribers:</strong> ${channel.subscriberCount}</p></div>`;
                });
                channelList.innerHTML = results.join("");
            } else {
                channelList.innerHTML = "No channels found with the name '" + channelName + "'";
            }
        }
    };

    xhr.send();
}