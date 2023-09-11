document.addEventListener("DOMContentLoaded", function () {
    let svg = null;
    let width, height; // Declare width and height variables
    let messageElement = null;

    window.addEventListener("hashchange", function (event) {
        const currentHash = window.location.hash;
        if (currentHash === "#section-channel-insights") {
            // Clear existing chart and message
            clearGraph();
            clearMessage();

            // Check if channel_id is in session storage and remove it
            // Get the channel_id from session storage
            const channel_id = sessionStorage.getItem("channel_id");

            // Call the function to handle word frequency
            handleWordFrequency(channel_id);
        }
    });

    const initialHash = window.location.hash;

    if (initialHash === "#section-channel-insights") {
        const channel_id = sessionStorage.getItem("channel_id");

        // Call the function to handle word frequency without data for the initial load
        handleWordFrequency(channel_id);
    }

    // Create the SVG element once with initial dimensions
    const margin = { top: 50, right: 30, bottom: 90, left: 70 };
    width = 500 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Define the function to clear the existing chart
    function clearGraph() {
        // Check if an SVG element exists and remove it
        if (svg) {
            svg.selectAll("*").remove(); // Remove all child elements
        }
    }

    // Define the function to update the chart
    function updateChart(data) {
        clearGraph();
        createChart(data);
    }

    // Define the function to display a message
    function showMessage(message) {
        if (!messageElement) {
            // Create the message element if it doesn't exist
            messageElement = svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("background-color", "black")
                .style("color", "white")
                .text(message);
        } else {
            messageElement.text(message);
        }
    }

    // Define the function to clear the message
    function clearMessage() {
        if (messageElement) {
            // Remove the message element
            messageElement.remove();
            messageElement = null;
        }
    }

    // Define the function to create an empty chart with a message
    // Define the function to create an empty chart with a message
    function createEmptyChart(message) {
        clearGraph(); // Clear existing chart if it exists

        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        showMessage(message); // Display the message
    }


    // Define the function to create a chart
    function createChart(data) {
        clearGraph(); // Clear existing chart if it exists

        const filteredWordFrequencies = data.filter(d => d.frequency > 1 || d.description);

        if (filteredWordFrequencies.length === 0) {
            showMessage("No word frequency data available for this channel.");
            return;
        } else {
            clearMessage();
        }

        var x = d3.scaleBand()
            .range([0, width])
            .domain(filteredWordFrequencies.map(function (d) { return d.word; }))
            .padding(0.2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll(".tick text")
            .attr("transform", "translate(-12, 10) rotate(-90)")
            .style("text-anchor", "end")
            .style("font-size", "13px");

        var y = d3.scaleLinear()
            .domain([0, d3.max(filteredWordFrequencies, function (d) { return d.frequency; })])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("mybar")
            .data(filteredWordFrequencies)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.word); })
            .attr("width", x.bandwidth())
            .attr("fill", "#69b3a2")
            .attr("height", function (d) { return height - y(0); })
            .attr("y", function (d) { return y(0); });

        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function (d) { return y(d.frequency); })
            .attr("height", function (d) { return height - y(d.frequency); })
            .delay(function (d, i) { return (i * 100); });
    }

    function handleWordFrequency(channel_id) {
        // Check if channel_id is available
        if (channel_id) {
            // Fetch data or perform necessary operations to get the data
            // Once you have the data, call createChart(data) or updateChart(data) as needed
            fetch('/word_frequencies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userinput: channel_id }),
            })
                .then(response => response.json())
                .then(data => {

                    if (!data || (Array.isArray(data) && data.every(item => item.frequency === 1))) {
                        // Data is null or all word frequencies are 1, return without creating the graph
                        createEmptyChart("No word frequency data available for this channel.");
                        return;
                    }

                    if (svg) {
                        console.log(data);
                        updateChart(data);
                    } else {
                        console.log(data);
                        createChart(data);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }
});
