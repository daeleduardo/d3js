function dataParseBar(db) {
    // Group by state
    let statesSum = db.reduce((acc, obj) => {
        const key = obj["state"];

        if (selectedState !== '' && selectedState !== key) { return acc; }
        if (!acc[key]) {
            acc[key] = { state: obj.state, value: 0 };
        }
        acc[key].value++;
        return acc;
    }, {});

    if (Object.keys(statesSum).length === 0 && statesSum.constructor === Object) {
        statesSum[selectedState] = { state: selectedState, value: 0 }
    }

    return statesSum

}


function getBarCharts(db) {

    const barHeight = 30;
    const MAX_WIDTH = screen.width;
    const MAX_HEIGHT = ((Object.keys(db).length) * (barHeight * 1.82)) + (barHeight * 2);
    const MAX_BAR_WIDTH = Math.ceil(MAX_WIDTH/3);
    let scaleFactor = 0.2;
    let maxValue = d3.max(Object.values(db), d => d.value) * scaleFactor;


    const svg = d3
        .select("#bar")
        .append("svg")
        .classed("uk-color-white", true)
        .attr("width", MAX_WIDTH)
        .attr("height", MAX_HEIGHT);

    const groupBars = svg
        .selectAll("g")
        .data(Object.values(db))
        .enter()
        .append("g")
        .attr("transform", (d, i) => {
            return "translate(0," + i * barHeight + ")";
        });

    const bars = groupBars
        .append("rect")
        .classed("uk-color-white", true)
        .attr("height", barHeight - 1)
        .attr("x", 25)
        .attr("y", 20);

    const txtLabels = groupBars
        .append("text")
        .attr("x", (d) => {
            return 0;
        })
        .attr("y", barHeight / 2)
        .attr("dy", "1.5em")
        .attr("class", "uk-color-white")
        .attr("text-anchor", "start")
        .style("fill-opacity", "0.0")
        .style("stroke-opacity", "0.0")
        .text((d) => {
            return `${d.state}`;
        });


    const txtValues = groupBars
        .append("text")
        .attr("x", (d) => {
            return (((d.value * scaleFactor) / maxValue) * MAX_BAR_WIDTH) + (((d.value * scaleFactor) == maxValue) ? 72 : 53);
        })
        .attr("y", barHeight / 2)
        .attr("dy", "1.5em")
        .attr("class", "uk-color-white")
        .attr("text-anchor", "end")
        .text((d) => {
            return `${d.value}`;
        });

    bars.transition()
        .delay((d, i) => { return i * 10; })
        .duration(2000)
        .style("fill", COLORS.AQUA)
        .style("stroke", COLORS.WHITE)
        .attr("width", (d) => {
            return Math.min((((d.value * scaleFactor) / maxValue) * MAX_BAR_WIDTH),MAX_BAR_WIDTH);
        });
;
        
    txtValues.transition().delay((d, i) => { return i * 15; })
        .duration(2000)
        .attr("class", "uk-color-black");

    txtLabels.transition().delay((d, i) => { return i * 5; })
        .duration(2000)
        .style("fill-opacity", "1.0")
        .style("stroke-opacity", "1.0")
        .attr("class", "uk-color-black");

}