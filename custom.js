const COLORS = {
    "AQUA": "#1abc9c",
    "DARKER_AQUA": "#16a085",
    "GREEN": "#2ecc71",
    "DARKER_GREEN": "#27ae60",
    "BLUE": "#3498db",
    "DARKER_BLUE": "#2980b9",
    "PURPLE": "#9b59b6",
    "DARKER_PURPLE": "#8e44ad",
    "YELLOW": "#f1c40f",
    "DARKER_YELLOW": "#f39c12",
    "ORANGE": "#e67e22",
    "DARKER_ORANGE": "#d35400",
    "RED": "#e74c3c",
    "DARKER_RED": "#c0392b",
    "GREY": "#95a5a6",
    "DARKER_GREY": "#7f8c8d"
};



const MENU = {
    "bar": () => { return loadJSON(dataParseBar, getBarCharts); },
    "bubble": () => { UIkit.modal.alert('Under construction!') },
    /*"bubble": () => { return loadJSON(dataParseBubble, getBubbleCharts); },*/
    "line": () => { return loadJSON(dataParseLine, getLineCharts); }
};

const MARGIN = { top: 20, right: 30, bottom: 30, left: 40 };
const STATES = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'VI', 'WA', 'WV', 'WI', 'WY'];
const MAXYEAR = new Date().getFullYear();
const MINYEAR = MAXYEAR - 5;


let selectedState = "";

function getRandomColor() {
    return Object.values(COLORS)[[Math.round(Math.random() * (Object.keys(COLORS).length - 1))]];
}

/**
 * Load a json data file for use.
 * @param  {@function} dataParse function to parse/changing rows
 * @param  {@function} callback function will manipulate data.
 * @return {null}      not return a value.
 */
function loadJSON(dataParse, callback) {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET",'db.json', true);
    xobj.onreadystatechange = () => {
        if (xobj.readyState == 4) {
            if (xobj.status == "200") {
                callback(dataParse(JSON.parse(xobj.responseText)));
            } else {
                alert(xobj.responseText);
            }
        }
    };
    xobj.send(null);
}

function toggleSpinner() {
    const toggle = d3.select("#spinner").classed("uk-hidden");
    d3.select("#spinner").classed("uk-hidden", !toggle);
}

function update() {

    setTimeout(() => {
        toggleSpinner();
        selectedState = d3.select("#selectButton").node().value;
        const selectedChart = d3.select("#charts li.uk-active div").attr("id");
        d3.select(`#${selectedChart}`).selectAll("svg").remove();
        MENU[selectedChart]();
        toggleSpinner();
    }, 500);
}


function start() {
    d3.select("#selectButton")
        .selectAll('option')
        .data(STATES)
        .enter()
        .append('option')
        .text((d) => { return d; })
        .attr("value", (d) => { return d; });

    d3.select("#selectButton").on("change", () => {
        update();
    });

    d3.select("#menu").on("click", () => {
        update();
    });

    setTimeout(() => {
        toggleSpinner();
        update();
    }, 1000);

}

