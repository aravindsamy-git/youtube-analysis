document.addEventListener("DOMContentLoaded", function () {

    let svg = null;

    window.addEventListener("hashchange", function (event) {
        const currentHash = window.location.hash;
        if (currentHash === "#section-channel-insights") {
            const channel_id = sessionStorage.getItem("channel_id");
            handle_wordfrequncy();

            function handle_wordfrequncy() {
                const inputData = { userinput: channel_id };

                fetch('/word_frequencies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputData),
                })
                .then(response => response.json())
                .then(data => {
                    if (svg) {
                        updateChart(data);
                    } else {
                        createChart(data);
                    }
                })
                .catch(error => console.error('Error:', error));
            }

            function createChart(data) {
                const filteredWordFrequencies = data.filter(d => d.frequency > 1);

                var margin = { top: 50, right: 30, bottom: 90, left: 70 },
                    width = 500 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                svg = d3.select("#chart-container")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
                        
                var x = d3.scaleBand()
                    .range([0, width])
                    .domain(filteredWordFrequencies.map(function(d) { return d.word; }))
                    .padding(0.2);
                
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .selectAll(".tick text")
                    .attr("transform", "translate(-12, 10) rotate(-90)")
                    .style("text-anchor", "end")
                    .style("font-size", "13px");
                
                var y = d3.scaleLinear()
                    .domain([0, d3.max(filteredWordFrequencies, function(d) { return d.frequency; })])
                    .range([height, 0]);
                
                svg.append("g")
                    .call(d3.axisLeft(y));
                
                svg.selectAll("mybar")
                    .data(filteredWordFrequencies)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) { return x(d.word); })
                    .attr("width", x.bandwidth())
                    .attr("fill", "#69b3a2")
                    .attr("height", function(d) { return height - y(0); })
                    .attr("y", function(d) { return y(0); });
                
                svg.selectAll("rect")
                    .transition()
                    .duration(800)
                    .attr("y", function(d) { return y(d.frequency); })
                    .attr("height", function(d) { return height - y(d.frequency); })
                    .delay(function(d,i){return(i*100)});
            }
        }
    });

    const initialHash = window.location.hash;

    if (initialHash === "#section-channel-insights") {
        const channel_id = sessionStorage.getItem("channel_id");
        handle_wordfrequncy();

        function handle_wordfrequncy() {
            const inputData = { userinput: channel_id };

            fetch('/word_frequencies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            })
            .then(response => response.json())
            .then(data => {
                if (svg) {
                    updateChart(data);
                } else {
                    createChart(data);
                }
            })
            .catch(error => console.error('Error:', error));
        }

        function createChart(data) {
            const filteredWordFrequencies = data.filter(d => d.frequency > 1);

            var margin = { top: 50, right: 30, bottom: 90, left: 70 },
                width = 500 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            svg = d3.select("#chart-container")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            
            var x = d3.scaleBand()
                .range([0, width])
                .domain(filteredWordFrequencies.map(function(d) { return d.word; }))
                .padding(0.2);
            
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll(".tick text")
                .attr("transform", "translate(-12, 10) rotate(-90)")
                .style("text-anchor", "end")
                .style("font-size", "13px");
            
            var y = d3.scaleLinear()
                .domain([0, d3.max(filteredWordFrequencies, function(d) { return d.frequency; })])
                .range([height, 0]);
            
            svg.append("g")
                .call(d3.axisLeft(y));
            
            svg.selectAll("mybar")
                .data(filteredWordFrequencies)
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.word); })
                .attr("width", x.bandwidth())
                .attr("fill", "#69b3a2")
                .attr("height", function(d) { return height - y(0); })
                .attr("y", function(d) { return y(0); });
            
            svg.selectAll("rect")
                .transition()
                .duration(800)
                .attr("y", function(d) { return y(d.frequency); })
                .attr("height", function(d) { return height - y(d.frequency); })
                .delay(function(d,i){return(i*100)});
        }

        function updateChart(data) {
            const filteredWordFrequencies = data.filter(d => d.frequency > 1);

            var x = d3.scaleBand()
                .range([0, width])
                .domain(filteredWordFrequencies.map(function(d) { return d.word; }))
                .padding(0.2);

            svg.select("g")
                .selectAll(".tick text")
                .attr("transform", "translate(-12, 10) rotate(-90)")
                .style("text-anchor", "end")
                .style("font-size", "13px");

            var y = d3.scaleLinear()
                .domain([0, d3.max(filteredWordFrequencies, function(d) { return d.frequency; })])
                .range([height, 0]);

            svg.select("g")
                .call(d3.axisLeft(y));

            svg.selectAll("rect")
                .data(filteredWordFrequencies)
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.word); })
                .attr("width", x.bandwidth())
                .attr("fill", "#69b3a2")
                .attr("height", function(d) { return height - y(0); })
                .attr("y", function(d) { return y(0); });

            svg.selectAll("rect")
                .transition()
                .duration(800)
                .attr("y", function(d) { return y(d.frequency); })
                .attr("height", function(d) { return height - y(d.frequency); })
                .delay(function(d,i){return(i*100)});
        }
    }
});
