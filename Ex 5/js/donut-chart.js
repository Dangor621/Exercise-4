// Draws the TV size distribution as a donut with a total in the center.
const drawDonutChart = data => {
    if (!data.length) return;

    const radius = Math.min(CHART_WIDTH, CHART_HEIGHT) * 0.36;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const chart = svg.append("g")
        .attr("transform", `translate(${CHART_WIDTH / 2}, ${CHART_HEIGHT / 2})`);

    // Keep category colors consistent across arc rendering.
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.Screensize_Category))
        .range(["#e76f51", "#2a9d8f", "#0466c8", "#ffb703", "#6c757d"]);

    const pie = d3.pie()
        .value(d => d["Count(Brand_Reg)"])
        .sort(null);

    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    const arcData = pie(data);
    const totalCount = d3.sum(data, d => d["Count(Brand_Reg)"]);

    // Render each category arc and wire hover tooltips.
    chart.selectAll("path")
        .data(arcData)
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", d => color(d.data.Screensize_Category))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .on("mousemove", (event, d) => {
            showTooltip(
                event,
                `${d.data.Screensize_Category}<br>Count: ${d.data["Count(Brand_Reg)"]}`
            );
            moveTooltip(event);
        })
        .on("mouseleave", hideTooltip);

    chart.selectAll("text")
        .data(arcData)
        .join("text")
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", "#ffffff")
        .text(d => d.data.Screensize_Category);

    // Center label and number summarize the full donut count.
    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.15em")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("fill", "#495057")
        .text("Total");

    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.15em")
        .style("font-size", "24px")
        .style("font-weight", "800")
        .style("fill", "#212529")
        .text(totalCount);
};