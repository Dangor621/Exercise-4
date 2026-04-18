function drawHistogram(data) {
    const bins = binGenerator(data);

    const energyExtent = d3.extent(data, d => d.energyConsumption);
    xScaleH
        .domain([0, energyExtent[1]])
        .range([0, INNER_WIDTH]);

    const maxBinCount = d3.max(bins, d => d.length);
    yScaleH
        .domain([0, maxBinCount])
        .range([INNER_HEIGHT, 0]);

    const histogramContainer = d3.select('#histogram');
    histogramContainer.html('');

    svgH = histogramContainer
        .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // inner plotting area
    innerChartH = svgH
        .append('g')
        .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    innerChartH
        .selectAll('.bar')
        .data(bins)
        .enter()
        .append('rect')
        .attr('class', 'bar histogram-bar')
        .attr('x', d => xScaleH(d.x0))
        .attr('y', d => yScaleH(d.length))
        .attr('width', d => Math.max(0, xScaleH(d.x1) - xScaleH(d.x0) - 1))
        .attr('height', d => INNER_HEIGHT - yScaleH(d.length));

    innerChartH
        .append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${INNER_HEIGHT})`)
        .call(xAxisH);

    innerChartH
        .append('text')
        .attr('class', 'axis-title')
        .attr('x', INNER_WIDTH / 2)
        .attr('y', INNER_HEIGHT + 60)
        .text('Energy Consumption (W)');

    innerChartH
        .append('g')
        .attr('class', 'axis')
        .call(yAxisH);

    innerChartH
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('x', -INNER_HEIGHT / 2)
        .attr('y', -75)
        .text('Number of Models');

    console.log('Histogram drawn with', bins.length, 'bins');
}

function updateHistogram(filteredData) {
    const bins = binGenerator(filteredData);

    const maxBinCount = d3.max(bins, d => d.length);
    yScaleH.domain([0, maxBinCount]);

    innerChartH
        .select('.axis:last-of-type')
        .transition()
        .duration(500)
        .call(yAxisH);

    // update bar join
    const bars = innerChartH
        .selectAll('.histogram-bar')
        .data(bins, (d, i) => i);

    bars
        .enter()
        .append('rect')
        .attr('class', 'bar histogram-bar')
        .attr('x', d => xScaleH(d.x0))
        .attr('width', d => Math.max(0, xScaleH(d.x1) - xScaleH(d.x0) - 1))
        .attr('y', d => yScaleH(0))
        .attr('height', 0)
        .merge(bars)
        .transition()
        .duration(500)
        .attr('x', d => xScaleH(d.x0))
        .attr('y', d => yScaleH(d.length))
        .attr('width', d => Math.max(0, xScaleH(d.x1) - xScaleH(d.x0) - 1))
        .attr('height', d => INNER_HEIGHT - yScaleH(d.length));

    bars.exit().remove();

    console.log('Histogram updated with', bins.length, 'bins from', filteredData.length, 'records');
}

