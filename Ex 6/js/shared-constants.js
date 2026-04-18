// shared chart setup
const MARGIN = {
    top: 30,
    right: 40,
    bottom: 80,
    left: 110
};

const WIDTH = 1200;
const HEIGHT = 600;

const INNER_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

let svgH = null;
let innerChartH = null;

let xScaleH = d3.scaleLinear();
let yScaleH = d3.scaleLinear();

const xAxisH = d3.axisBottom().scale(xScaleH);
const yAxisH = d3.axisLeft().scale(yScaleH);

let svgS = null;
let innerChartS = null;

let xScaleS = d3.scaleLinear();
let yScaleS = d3.scaleLinear();

const xAxisS = d3.axisBottom().scale(xScaleS);
const yAxisS = d3.axisLeft().scale(yScaleS);

const colorScale = d3.scaleOrdinal()
    .domain(['LED', 'LCD', 'OLED'])
    .range(['#e53935', '#43a047', '#1e88e5']);

let binGenerator = d3.bin()
    .value(d => d.energyConsumption);

let filterState = [
    { id: 'all', label: 'All Tech', isActive: true },
    { id: 'LED', label: 'LED', isActive: false },
    { id: 'LCD', label: 'LCD', isActive: false },
    { id: 'OLED', label: 'OLED', isActive: false }
];

let globalData = [];
