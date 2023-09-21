document.addEventListener("DOMContentLoaded", function () {
    let chart = null; // Declare a variable to hold the chart instance
    const loader = document.getElementById("loader"); // Add this line

    function fetchAndPlotSentimentData(channel_id) {
        loader.style.display = "block";
        // Check if a chart exists and destroy it
        if (chart) {
            chart.destroy();
        }

        fetch('/get_video_sentiment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userinput: channel_id }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                // Extract sentiment data
                const { positive, neutral, negative } = data;

                // Create a bar chart
                const ctx = document.getElementById('sentimentChart').getContext('2d');
                chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Positive', 'Neutral', 'Negative'],
                        datasets: [{
                            label: 'Sentiment Analysis',
                            data: [positive, neutral, negative],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(255, 99, 132, 0.7)',
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 99, 132, 1)',
                            ],
                            borderWidth: 1,
                        }],
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
                loader.style.display = "none";
            })
            .catch((error) => {
                console.error('Error:', error);
                loader.style.display = "none";
            });
    }

    window.addEventListener("hashchange", function (event) {
        const currentHash = window.location.hash;
        if (currentHash === "#section-comments-analysis") {
            console.log("Hash changed");
            const channel_id = sessionStorage.getItem("channel_id");
            fetchAndPlotSentimentData(channel_id);
        }
    });

    // Initial load
    const initialHash = window.location.hash;
    if (initialHash === "#section-comments-analysis") {
        const channel_id = sessionStorage.getItem("channel_id");
        fetchAndPlotSentimentData(channel_id);
    }
});
