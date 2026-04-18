// Shared chart canvas settings so every chart keeps the same proportions.
const CHART_WIDTH = 1000;
const CHART_HEIGHT = 500;
const STANDARD_MARGIN = { top: 40, right: 60, bottom: 40, left: 60 };

const INNER_WIDTH = CHART_WIDTH - STANDARD_MARGIN.left - STANDARD_MARGIN.right;
const INNER_HEIGHT = CHART_HEIGHT - STANDARD_MARGIN.top - STANDARD_MARGIN.bottom;

// Create the tooltip once and reuse it across all charts.
const getTooltip = () => {
	let tooltip = d3.select("body").select(".chart-tooltip");

	if (tooltip.empty()) {
		tooltip = d3.select("body")
			.append("div")
			.attr("class", "chart-tooltip")
			.style("position", "fixed")
			.style("pointer-events", "none")
			.style("padding", "8px 10px")
			.style("border-radius", "8px")
			.style("background", "rgba(15, 23, 42, 0.92)")
			.style("color", "#ffffff")
			.style("font-size", "12px")
			.style("line-height", "1.35")
			.style("opacity", 0)
			.style("z-index", 9999);
	}

	return tooltip;
};

// Show tooltip near the pointer with chart-specific content.
const showTooltip = (event, html) => {
	const tooltip = getTooltip();
	tooltip
		.html(html)
		.style("opacity", 1)
		.style("left", `${event.clientX + 12}px`)
		.style("top", `${event.clientY + 12}px`);
};

// Keep the tooltip tracking the cursor while moving.
const moveTooltip = event => {
	d3.select("body").select(".chart-tooltip")
		.style("left", `${event.clientX + 12}px`)
		.style("top", `${event.clientY + 12}px`);
};

// Fade tooltip out when the pointer leaves the mark.
const hideTooltip = () => {
	d3.select("body").select(".chart-tooltip")
		.style("opacity", 0);
};