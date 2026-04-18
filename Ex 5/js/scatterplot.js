// Alternative line chart implementation kept for reference/testing.
const drawLineChart = data => {
    if (!data.length) return;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`);

    const innerChart = svg.append("g")
        .attr("transform", `translate(${STANDARD_MARGIN.left}, ${STANDARD_MARGIN.top})`);

    // Translate year and price values into screen positions.
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, INNER_WIDTH]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.averagePrice)])
        .nice()
        .range([INNER_HEIGHT, 0]);

    // Draw axes first so the rest of the chart has clear context.
    innerChart.append("g")
        .attr("transform", `translate(0,${INNER_HEIGHT})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    innerChart.append("g")
        .call(d3.axisLeft(yScale));

    innerChart.append("text")
        .text("Average Price ($ per MWh)")
        .attr("x", -INNER_HEIGHT / 2)
        .attr("y", -STANDARD_MARGIN.left + 15)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("font-weight", "bold")
        .style("font-size", "14px");

    innerChart.append("text")
        .text("Year")
        .attr("x", INNER_WIDTH / 2)
        .attr("y", INNER_HEIGHT + STANDARD_MARGIN.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "14px");

    // Connect each yearly value to reveal the overall trend.
    const lineGenerator = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d.year))
        .y(d => yScale(d.averagePrice));

    innerChart.append("path")
        .attr("d", lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "#2196F3")
        .attr("stroke-width", 2.5);

    // Use point hover to emphasize a single year during inspection.
    innerChart.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 4)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.averagePrice))
        .attr("fill", "#2196F3")
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", 6)
                .attr("opacity", 1);
            console.log(`Year: ${d.year}, Price: $${d.averagePrice.toFixed(2)}/MWh`);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("r", 4)
                .attr("opacity", 0.7);
        });
};