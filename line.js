function dataParseLine(db) {

    let csvMock = [];

    if (selectedState === '') {
        Object.values(STATES).forEach(ele => {
            const color = getRandomColor();
            for (let year = MINYEAR; year < MAXYEAR; year++) {
                csvMock.push({
                    color: color,
                    state: ele,
                    year: year,
                    sales: (Math.round(Math.random() * (10 - 1)) + 1)
                });
            }
        });
    } else {
        const color = getRandomColor();
        for (let year = MINYEAR; year < MAXYEAR; year++) {
            csvMock.push({
                color: color,
                state: selectedState,
                year: year,
                sales: (Math.round(Math.random() * (10 - 1)) + 1)
            });
        }
    }



    /*
        for (let year = minYear; year < maxYear; year++) {
            csvMock.push({
                state: "total",
                year: year,
                sales: (Math.round(Math.random() * (100 - 1)) + 1)
            })
        }
    */

    return csvMock;

    /* map to add random sales and year numbers
    
        db.map((item)=>{
            const maxYear = new Date().getFullYear() - 1;
            const minYear = maxYear - 5;
            item.sales = Math.round(Math.random() * (100 - 1)) + 1;
            item.year = Math.round(Math.random() * (maxYear - minYear)) + minYear;
            return item;
        });
*/


}


function getLineCharts(db) {


    const MAX_WIDTH = screen.width * 0.9;
    const MAX_HEIGHT = screen.height * 0.7;
    const width = MAX_WIDTH - MARGIN.left - MARGIN.right;
    const height = MAX_HEIGHT - MARGIN.top - MARGIN.bottom;


    let svg = d3
        .select("#line")
        .append("svg")
        .attr("viewBox", [0, 0, MAX_WIDTH, MAX_HEIGHT])
        .attr("width", MAX_WIDTH)
        .attr("height", MAX_HEIGHT)
        .append("g")
        .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")")
        .classed("uk-color-white", true)


    let x = d3.scaleTime()
        .domain(d3.extent(db, (d) => { return d3.timeParse("%Y")(d.year); }))
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
        .domain([0, d3.max(db, (d) => { return +d.sales; })])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));



    let color = d3.scaleOrdinal().range(d3.schemeCategory10);

    const productCategories = [1,2,3,4,5,6,7,8,9,10];

    console.log(productCategories);
    console.log(d3.schemeCategory10);
    color.domain(productCategories);
                


    let path = svg.append("path")
        .datum(db)
        .attr("fill", "none")
        .attr("stroke-width", "2")
        .attr("stroke", (d) => { return color(d.sales); })
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("d", d3.line()
            .x((d) => { return x(d3.timeParse("%Y")(d.year)) })
            .y((d) => { return y(d.sales) })
        )

    const pathLength = path.node().getTotalLength();

    

    path.attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

}




