// Draws a bar chart for average yearly energy by screen technology.
const drawBarChart = data => {
    if (!data.length) return;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const chart = svg.append("g")
        .attr("transform", `translate(${STANDARD_MARGIN.left}, ${STANDARD_MARGIN.top})`);

    // Horizontal position is based on category; vertical position is based on energy.
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Screen_Tech))
        .range([0, INNER_WIDTH])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy)])
        .nice()
        .range([INNER_HEIGHT, 0]);

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${INNER_HEIGHT})`)
        .call(d3.axisBottom(xScale));

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
        .text("Avg Energy (kWh)");

    // Bars are interactive so users can inspect exact values quickly.
    chart.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => xScale(d.Screen_Tech))
        .attr("y", d => yScale(d.energy))
        .attr("width", xScale.bandwidth())
        .attr("height", d => INNER_HEIGHT - yScale(d.energy))
        .attr("fill", "#d62828")
        .on("mousemove", (event, d) => {
            showTooltip(
                event,
                `${d.Screen_Tech}<br>Avg Energy: ${d.energy.toFixed(2)} kWh`
            );
            moveTooltip(event);
        })
        .on("mouseleave", hideTooltip);
};