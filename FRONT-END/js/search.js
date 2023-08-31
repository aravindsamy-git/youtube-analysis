document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchQuerySubmit");
    const searchResults = document.getElementById("searchResults");

    searchButton.addEventListener("click", () => {
        const channelName = document.getElementById("searchQueryInput").value;
        searchChannels(channelName);
    });
});

function searchChannels(channelName) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `../../BACK-END/php/get_search_data.php?query=${channelName}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText)
            document.getElementById("searchResults").innerHTML = xhr.responseText;
        }
    };

    xhr.send();
}