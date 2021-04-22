function dataParseBubble(db) {
    // Group by state
    let statesSum = db.reduce((acc, obj) => {
        const key = obj["state"];

        if (selectedState !== '' && selectedState !== key) { return acc; }
        if (!acc[key]) {
            acc[key] = { state: obj.state, count: 0, sales: (Math.round(Math.random() * (100 - 10)) + 10) };
        }
        acc[key].count++;
        return acc;
    }, {});

    if (Object.keys(statesSum).length === 0 && statesSum.constructor === Object) {
        statesSum[selectedState] = { state: selectedState, count: 1, sales: (Math.round(Math.random() * (10 - 1)) + 1) }
    }

    return statesSum

}


function getBubbleCharts(db) {
    const barHeight = 30;

    const MAX_WIDTH = screen.width;
    const MAX_HEIGHT = ((Object.keys(db).length) * (barHeight * 1.82)) + (barHeight * 2);
    const svg = d3
        .select("#bubble")
        .append("svg")
        .classed("uk-color-white", true)
        .attr("width", MAX_WIDTH)
        .attr("height", MAX_HEIGHT)
        .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

    const sales = d3.extent(db, (d) => { return d.sales; });

    let x = d3.scaleLinear()
        .domain(sales)
        .range([0, MAX_WIDTH]);

    svg.append("g")
        .attr("transform", "translate(0," + MAX_HEIGHT + ")")
        .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
        .domain([d3.max(db, (d) => { return +d.count; }), 0])
        .range([MAX_HEIGHT, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    let z = d3.scaleLinear()
        .domain(sales)
        .range([1, 50]);

    svg.append('g')
        .selectAll("dot")
        .data(db)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.sales); })
        .attr("cy", function (d) { return y(d.count); })
        .attr("r", function (d) { return z(d.sales); })
        .style("fill", "#69b3a2")
        .style("opacity", "0.7")
        .attr("stroke", "black");
}