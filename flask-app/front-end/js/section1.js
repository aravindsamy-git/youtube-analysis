document.addEventListener("DOMContentLoaded", () => {
    const initialHash = window.location.hash;
  
    if (initialHash === "#search-the-channel") {
      const searchButton = document.getElementById("searchQuerySubmit");
      const searchInput = document.getElementById("searchQueryInput");
  
      // Add event listener for the search button click
      searchButton.addEventListener("click", handleSearch);
  
      // Add event listener for the Enter key press in the input field
      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          handleSearch();
        }
      });
  
      function handleSearch() {
        // Check if channel_id is in session storage and remove it
        if (sessionStorage.getItem("channel_id")) {
          sessionStorage.removeItem("channel_id");
        }
  
        // Rest of your search code here
        const channelName = searchInput.value;
        // Create a JSON object with the user input
        const inputData = { userinput: channelName };
  
        fetch('/searchchannel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputData),
        })
        .then(response => response.json())
        .then(data => {
          // Handle the JSON data (channel data) here
          updateChannelList(data); // Call the function to update the HTML with channel data
        })
        .catch(error => console.error('Error:', error));
      }
  
      // Function to update the HTML with channel data
      function updateChannelList(channelData) {
        const channelContainer = document.getElementById("channelContainer");
  
        channelContainer.innerHTML = "";
  
        if (channelData.length > 0) {
          channelData.forEach((channel) => {
            const channelElement = document.createElement("div");
            channelElement.classList.add("card"); // Add the "card" class to the card div
            channelElement.innerHTML = `
              <img src='${channel.logo}' alt='Channel Logo'>
              <h2>${channel.name}</h2>
              <p>Subscribers:${channel.subscriberCount}</p>
              <button class="see-insights-button" data-channel-id="${channel.id}" onclick="scrollToSectionAndChannel('${channel.id}', 'section-channel-insights')">See Insights</button>
            `;
            channelContainer.appendChild(channelElement);
          });
  
        } else {
          // No channels found message
          const messageElement = document.createElement("p");
          messageElement.textContent = "No channels found with the given name.";
          channelContainer.appendChild(messageElement);
        }
      }
    }
  });
  