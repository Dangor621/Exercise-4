function drawScatterplot(data) {
    const starExtent = d3.extent(data, d => d.star);
    const energyExtent = d3.extent(data, d => d.energyConsumption);

    xScaleS
        .domain([Math.max(0, starExtent[0] - 0.5), starExtent[1] + 0.5])
        .range([0, INNER_WIDTH]);

    yScaleS
        .domain([Math.max(0, energyExtent[0] - 20), energyExtent[1] + 20])
        .range([INNER_HEIGHT, 0]);

    const scatterplotContainer = d3.select('#scatterplot');
    scatterplotContainer.html('');

    svgS = scatterplotContainer
        .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    innerChartS = svgS
        .append('g')
        .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // draw scatter points
    innerChartS
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'scatterplot-circle')
        .attr('cx', d => xScaleS(d.star))
        .attr('cy', d => yScaleS(d.energyConsumption))
        .attr('r', 4)
        .attr('fill', d => colorScale(d.screenTech))
        .attr('opacity', 0.5);

    innerChartS
        .append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${INNER_HEIGHT})`)
        .call(xAxisS);

    innerChartS
        .append('text')
        .attr('class', 'axis-title')
        .attr('x', INNER_WIDTH / 2)
        .attr('y', INNER_HEIGHT + 60)
        .text('Star Rating');

    innerChartS
        .append('g')
        .attr('class', 'axis')
        .call(yAxisS);

    innerChartS
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('x', -INNER_HEIGHT / 2)
        .attr('y', -75)
        .text('Energy Consumption (W)');

    drawLegend();

    console.log('Scatterplot drawn with', data.length, 'points');
}

function drawLegend() {
    const legendX = INNER_WIDTH - 150;
    const legendY = 20;
    const legendItemHeight = 20;

    const legend = innerChartS
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${legendX},${legendY})`);

    legend
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'legend-text')
        .style('font-weight', 'bold')
        .text('Screen Tech');

    const technologies = colorScale.domain();

    // add legend rows
    technologies.forEach((tech, index) => {
        const legendItem = legend
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', `translate(0,${(index + 1) * legendItemHeight})`);

        legendItem
            .append('rect')
            .attr('class', 'legend-rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('x', 0)
            .attr('y', 0)
            .style('fill', colorScale(tech))
            .style('stroke', '#001a4d')
            .style('stroke-width', '1px');

        legendItem
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', 18)
            .attr('y', 10)
            .text(tech);
    });

    // wrap legend area
    const legendBBox = legend.node().getBBox();
    legend
        .insert('rect', ':first-child')
        .attr('x', legendBBox.x - 10)
        .attr('y', legendBBox.y - 8)
        .attr('width', legendBBox.width + 20)
        .attr('height', legendBBox.height + 16)
        .attr('rx', 4)
        .attr('ry', 4)
        .style('fill', '#ffffff')
        .style('stroke', '#e0e6ed')
        .style('stroke-width', '1px')
        .style('opacity', 0.95)
        .lower();
}
