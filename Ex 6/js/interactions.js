function populateFilters(data) {
    const filterContainer = d3.select('#filters_screen');

    const filterButtons = filterContainer
        .selectAll('.filter')
        .data(filterState, d => d.id);

    filterButtons
        .enter()
        .append('button')
        .attr('class', d => `filter ${d.isActive ? 'active' : ''}`)
        .attr('data-filter', d => d.id)
        .text(d => d.label)
        .on('click', function (event, d) {
            // keep one active
            filterState.forEach(f => {
                f.isActive = false;
            });

            const clickedFilter = filterState.find(f => f.id === d.id);
            if (clickedFilter) {
                clickedFilter.isActive = true;
            }

            d3.selectAll('.filter').classed('active', btn => btn.isActive);

            // rebuild histogram
            const activeFilter = filterState.find(f => f.isActive);
            const filteredData = activeFilter && activeFilter.id !== 'all'
                ? globalData.filter(row => row.screenTech === activeFilter.id)
                : globalData;

            updateHistogram(filteredData);
        });

    updateFilterButtons();
}

function updateFilterButtons() {
    d3.selectAll('.filter')
        .attr('class', d => `filter ${filterState.find(f => f.id === d.id).isActive ? 'active' : ''}`);
}

function createTooltip() {
    const tooltip = innerChartS
        .append('g')
        .attr('class', 'tooltip')
        .attr('opacity', 0);

    tooltip
        .append('rect')
        .attr('class', 'tooltip-background')
        .attr('width', 180)
        .attr('height', 40)
        .attr('x', -90)
        .attr('y', -50);

    tooltip
        .append('text')
        .attr('class', 'tooltip-text')
        .attr('x', 0)
        .attr('y', -30);
}

function handleMouseEvents() {
    const tooltip = innerChartS.select('.tooltip');
    const tooltipText = tooltip.select('text');

    innerChartS
        .selectAll('circle')
        .on('mouseenter', function (event, d) {
            const circle = d3.select(this);
            const cx = parseFloat(circle.attr('cx'));
            const cy = parseFloat(circle.attr('cy'));

            // place tooltip
            tooltip
                .attr('transform', `translate(${cx},${cy})`)
                .transition()
                .duration(200)
                .attr('opacity', 1);

            tooltipText.text(`★ ${d.star.toFixed(1)} | ⚡ ${d.energyConsumption.toFixed(1)}W`);

            circle
                .transition()
                .duration(200)
                .attr('r', 6)
                .attr('opacity', 1);
        })
        .on('mouseleave', function (event, d) {
            const circle = d3.select(this);

            tooltip
                .transition()
                .duration(200)
                .attr('opacity', 0);

            circle
                .transition()
                .duration(200)
                .attr('r', 4)
                .attr('opacity', 0.5);
        });
}
