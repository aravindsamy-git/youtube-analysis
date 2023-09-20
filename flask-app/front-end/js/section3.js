document.addEventListener("DOMContentLoaded", function () {

    function videometrics(channel_id){
        if (channel_id) {
            // Make an API call to your Python function to fetch data
            fetch('/video_metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userinput: channel_id }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const topEngagementVideosList = document.getElementById('top-engagement-videos');            
    
                    // Iterate through the top engagement videos and create list items
                    data.video_metrics.forEach(video => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <h3>${video.title}</h3>
                            <p>Likes: ${video.likes}</p>
                            <p>Comments: ${video.comments}</p>
                            <p>Total Engagement: ${video.total_engagement}</p>
                        `;
                        topEngagementVideosList.appendChild(listItem);
                    });
                    
                    // Display the section after populating data
                    const sectionVideoMetrics = document.getElementById('section-video-metrics-div');
                    sectionVideoMetrics.style.display = 'block';
                })
                .catch(error => console.error('Error:', error));
        }
    }

    window.addEventListener("hashchange", function (event) {
        const currentHash = window.location.hash;
        if (currentHash === "#section-video-metrics") {
            console.log("hash changed")
            const channel_id = sessionStorage.getItem("channel_id");
            videometrics(channel_id)
        }
    });

    const initialHash = window.location.hash;

    if (initialHash === "#section-video-metrics") {
        console.log("wait initializing")
        const channel_id = sessionStorage.getItem("channel_id");
        videometrics(channel_id);
    }

})