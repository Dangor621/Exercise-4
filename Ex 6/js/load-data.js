d3.csv('data/W6_TVdata.csv', d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    star: +d.star,
    energyConsumption: +d.energyConsumption
})).then(data => {
    // store parsed rows
    globalData = data;

    console.log('Data loaded successfully:', globalData.length, 'records');

    drawHistogram(globalData);
    drawScatterplot(globalData);
    populateFilters(globalData);

    createTooltip();
    handleMouseEvents();

}).catch(error => {
    console.error('Error loading data:', error);
});
