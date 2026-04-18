// Draws the ARE spot price trend over time as a line chart.
const drawLineChart = data => {
    if (!data.length) return;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const chart = svg.append("g")
        .attr("transform", `translate(${STANDARD_MARGIN.left}, ${STANDARD_MARGIN.top})`);

    // Years are continuous on X; average price values map to Y.
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, INNER_WIDTH]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.averagePrice)])
        .nice()
        .range([INNER_HEIGHT, 0]);

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${INNER_HEIGHT})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    chart.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

    chart.append("text")
        .attr("x", -INNER_HEIGHT / 2)
        .attr("y", -STANDARD_MARGIN.left + 18)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "600")
        .text("Spot Price ($/MWh)");

    // The line path links yearly values in order.
    const lineGenerator = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.averagePrice));

    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#0466c8")
        .attr("stroke-width", 2.5)
        .attr("d", lineGenerator);

    // Points expose tooltips so each year's value can be read directly.
    chart.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.averagePrice))
        .attr("r", 4)
        .attr("fill", "#e76f51")
        .on("mousemove", (event, d) => {
            showTooltip(
                event,
                `Year: ${d.year}<br>Spot Price: $${d.averagePrice.toFixed(2)} /MWh`
            );
            moveTooltip(event);
        })
        .on("mouseleave", hideTooltip);
};
