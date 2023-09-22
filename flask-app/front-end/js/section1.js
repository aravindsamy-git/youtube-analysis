document.addEventListener("DOMContentLoaded", () => {
  const initialHash = window.location.hash;

  if (initialHash === "#search-the-channel") {
    const searchButton = document.getElementById("searchQuerySubmit");
    const searchInput = document.getElementById("searchQueryInput");

    searchButton.addEventListener("click", handleSearch);

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    });

    function handleSearch() {
      const channelName = searchInput.value;
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
        updateChannelList(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
      function updateChannelList(channelData) {
        const channelContainer = document.getElementById("channelContainer");
  
        channelContainer.innerHTML = "";
  
        if (channelData.length > 0) {
          channelData.forEach((channel) => {
            const channelElement = document.createElement("div");
            channelElement.classList.add("card");
            channelElement.innerHTML = `
              <img src='${channel.logo}' alt='Channel Logo'>
              <h2>${channel.name}</h2>
              <p>Subscribers:${channel.subscriberCount}</p>
              <button class="see-insights-button" data-channel-id="${channel.id}" onclick="scrollToSectionAndChannel('${channel.id}', 'section-channel-insights')">See Insights</button>
            `;
            channelContainer.appendChild(channelElement);
          });
  
        } else {
          const messageElement = document.createElement("p");
          messageElement.textContent = "No channels found with the given name.";
          channelContainer.appendChild(messageElement);
        }
      }
    }
  });
  