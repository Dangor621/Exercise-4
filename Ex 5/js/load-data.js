// Load all CSV files in parallel, then normalize each row shape.
Promise.all([
    d3.csv("data/avg_energy_55.csv", d => ({
        Screen_Tech: d.Screen_Tech,
        energy: +d["Mean(Labelled energy consumption (kWh/year))"]
    })),
    d3.csv("data/ARE_Spot_Prices.csv", d => ({
        year: +(d.year ?? d.Year),
        averagePrice: +(d.averagePrice ?? d["Average Price (notTas-Snowy)"])
    })),
    d3.csv("data/tv_size_counts.csv", d => ({
        Screensize_Category: d.Screensize_Category,
        "Count(Brand_Reg)": +d["Count(Brand_Reg)"]
    }))
])
    .then(([barData, lineData, donutData]) => {
        // Remove invalid rows so each chart receives clean data.
        const validBarData = barData.filter(d => d.Screen_Tech && Number.isFinite(d.energy));
        const validLineData = lineData
            .filter(d => Number.isFinite(d.year) && Number.isFinite(d.averagePrice))
            .sort((a, b) => a.year - b.year);
        const validDonutData = donutData.filter(
            d => d.Screensize_Category && Number.isFinite(d["Count(Brand_Reg)"])
        );

        // Render the three charts once all datasets are ready.
        drawBarChart(validBarData);
        drawLineChart(validLineData);
        drawDonutChart(validDonutData);
    })
    .catch(error => {
        console.error("Error loading CSV files:", error);
    });