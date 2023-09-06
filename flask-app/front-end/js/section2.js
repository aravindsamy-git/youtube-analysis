// Get word frequency data from Flask (assuming it's in JSON format)
const wordFrequencies = JSON.parse('{{ word_frequencies_json | safe }}');
console.log(wordFrequencies);

// Filter out single-time repeated words
const filteredWordFrequencies = wordFrequencies.filter(function (d) {
    return d.frequency > 1; // Adjust the condition as needed
});

// Set up SVG dimensions and margins
var margin = { top: 50, right: 30, bottom: 90, left: 70 }, // Adjusted margins
    width = 1100 - margin.left - margin.right, // Adjusted width
    height = 600 - margin.top - margin.bottom; // Adjusted height

// Append the svg object to the body of the page
var svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x = d3.scaleBand()
    .range([0, width])
    .domain(filteredWordFrequencies.map(function (d) { return d.word; }))
    .padding(0.2);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll(".tick text") // Select all x-axis labels
    .attr("transform", "translate(-12, 10) rotate(-90)") // Adjust the rotation angle
    .style("text-anchor", "end")
    .style("font-size", "13px"); // Adjust font size if needed

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, d3.max(filteredWordFrequencies, function (d) { return d.frequency; })])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
    .data(filteredWordFrequencies)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.word); })
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    .attr("height", function (d) { return height - y(0); })
    .attr("y", function (d) { return y(0); })

// Animation
svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d) { return y(d.frequency); })
    .attr("height", function (d) { return height - y(d.frequency); })
    .delay(function (d, i) { console.log(i); return (i * 100) })