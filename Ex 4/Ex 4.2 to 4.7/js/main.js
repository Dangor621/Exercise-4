const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", "0 0 900 700")
    .attr("preserveAspectRatio", "xMidYMid meet");

const chart = {
    margin: { top: 30, right: 90, bottom: 60, left: 190 },
    width: 900,
    minHeight: 700,
    rowHeight: 34
};

const innerWidth = chart.width - chart.margin.left - chart.margin.right;
let innerHeight = chart.minHeight - chart.margin.top - chart.margin.bottom;

const root = svg.append("g")
    .attr("transform", `translate(${chart.margin.left}, ${chart.margin.top})`);

const gridLayer = root.append("g").attr("class", "grid");
const barsLayer = root.append("g").attr("class", "bars-layer");
const axisLayer = root.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`);

const tooltip = d3.select("#tooltip");

const cards = {
    totalBrands: document.getElementById("card-total-brands"),
    totalSold: document.getElementById("card-total-sold"),
    topBrand: document.getElementById("card-top-brand"),
    averageSold: document.getElementById("card-average-sold")
};

const state = {
    rawData: [],
    pinnedBrand: null
};

// sort by sales
const getDisplayData = () => {
    return [...state.rawData].sort((a, b) => d3.descending(a.count, b.count));
};

const isActiveBrand = brand => {
    if (state.pinnedBrand) {
        return state.pinnedBrand === brand;
    }

    return true;
};

// update top cards
const updateCards = data => {
    const totalSold = d3.sum(data, d => d.count);
    const top = data[0] || { brand: "-", count: 0 };
    const avg = data.length ? Math.round(totalSold / data.length) : 0;

    cards.totalBrands.textContent = data.length.toLocaleString();
    cards.totalSold.textContent = totalSold.toLocaleString();
    cards.topBrand.textContent = top.brand;
    cards.averageSold.textContent = avg.toLocaleString();
};

const resizeChart = dataLength => {
    innerHeight = Math.max(220, dataLength * chart.rowHeight);
    const totalHeight = innerHeight + chart.margin.top + chart.margin.bottom;
    const finalHeight = Math.max(chart.minHeight, totalHeight);

    svg.attr("viewBox", `0 0 ${chart.width} ${finalHeight}`);
    axisLayer.attr("transform", `translate(0, ${innerHeight})`);
};

const showTooltip = (event, datum) => {
    tooltip
        .classed("visible", true)
        .html(`<strong>${datum.brand}</strong><br>Sold: ${datum.count.toLocaleString()}`)
        .style("left", `${event.clientX + 14}px`)
        .style("top", `${event.clientY + 14}px`);
};

const moveTooltip = event => {
    tooltip
        .style("left", `${event.clientX + 14}px`)
        .style("top", `${event.clientY + 14}px`);
};

const hideTooltip = () => {
    tooltip.classed("visible", false);
};

const updateChart = () => {
    const data = getDisplayData();
    const maxCount = d3.max(data, d => d.count) || 0;

    resizeChart(data.length);
    updateCards(data);

    const xScale = d3.scaleLinear()
        .domain([0, maxCount * 1.1 || 1])
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, innerHeight])
        .padding(0.28);

    gridLayer
        .transition()
        .duration(500)
        .call(d3.axisBottom(xScale).ticks(7).tickSize(innerHeight).tickFormat(""));

    axisLayer
        .transition()
        .duration(500)
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(7).tickSizeOuter(0));

    const groups = barsLayer
        .selectAll("g.bar-row")
        .data(data, d => d.brand)
        .join(
            enter => {
                const row = enter.append("g")
                    .attr("class", "bar-row")
                    .attr("transform", d => `translate(0, ${yScale(d.brand) || 0})`);

                row.append("rect")
                    .attr("class", "bar-rect")
                    .attr("height", yScale.bandwidth())
                    .attr("width", 0);

                row.append("text")
                    .attr("class", "brand-label")
                    .attr("x", -14)
                    .attr("y", yScale.bandwidth() / 2)
                    .attr("dy", "0.35em")
                    .attr("text-anchor", "end")
                    .text(d => d.brand);

                row.append("text")
                    .attr("class", "count-label")
                    .attr("x", 10)
                    .attr("y", yScale.bandwidth() / 2)
                    .attr("dy", "0.35em")
                    .text(d => d.count);

                return row;
            },
            update => update,
            exit => exit
                .transition()
                .duration(300)
                .style("opacity", 0)
                .remove()
        );

    groups
        .on("mouseenter", function (event, d) {
            showTooltip(event, d);
        })
        .on("mousemove", function (event) {
            moveTooltip(event);
        })
        .on("mouseleave", function () {
            hideTooltip();
        })
        // click to pin
        .on("click", function (_, d) {
            state.pinnedBrand = state.pinnedBrand === d.brand ? null : d.brand;
            updateChart();
        });

    groups
        .transition()
        .duration(600)
        .attr("transform", d => `translate(0, ${yScale(d.brand) || 0})`);

    groups.select(".bar-rect")
        .classed("active", d => isActiveBrand(d.brand))
        .classed("dimmed", d => !isActiveBrand(d.brand))
        .transition()
        .duration(650)
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.count));

    groups.select(".brand-label")
        .classed("active", d => isActiveBrand(d.brand))
        .classed("dimmed", d => !isActiveBrand(d.brand))
        .transition()
        .duration(650)
        .attr("y", yScale.bandwidth() / 2)
        .text(d => d.brand);

    groups.select(".count-label")
        .classed("active", d => isActiveBrand(d.brand))
        .classed("dimmed", d => !isActiveBrand(d.brand))
        .transition()
        .duration(650)
        .attr("x", d => xScale(d.count) + 10)
        .attr("y", yScale.bandwidth() / 2)
        .tween("text", function (d) {
            const that = d3.select(this);
            const current = Number((that.text() || "0").replace(/,/g, ""));
            const interpolate = d3.interpolateNumber(current || 0, d.count);
            return t => {
                that.text(Math.round(interpolate(t)).toLocaleString());
            };
        });
};

d3.csv("data/BrandCount.csv").then(rawData => {
    // parse csv fields
    state.rawData = rawData.map(d => ({
        brand: d["Brand_Reg"],
        count: +d["Count(SoldIn)"]
    })).filter(d => d.brand && Number.isFinite(d.count));

    updateChart();
}).catch(err => console.error("CSV Load Error:", err));