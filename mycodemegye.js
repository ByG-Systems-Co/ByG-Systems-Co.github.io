let conf;
let allconfirmed = [];
let allconfirmedReady = false;
let allrecovered = [];
let allrecoveredReady = false;
let alldeaths = [];
let alldeathsReady = false;
let allpopulation = [];
let allpopulationReady = false;
let DOMReady = false;

let rawmegye;
let rawmegyedata;

let myChart;
let ctx;

ctx = document.getElementById('myChartID').getContext('2d'); // Chart Data Set
    
myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: "Dummy Chart",
            data: [],
            backgroundColor: 'rgba(255, 0, 0, 1)'
/*        },{
            label: "Dummy Chart 2",
            data: [],
            backgroundColor: 'rgba(0, 0, 255, 1)'            
*/        }]
    },
    options: {
        // Boolean - whether or not the chart should be responsive and resize when the browser does.
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

setChartSize();

fetch("https://flo.uri.sh/visualisation/1788250/embed?auto=1")
    .then(response => response.text())
    .then((csv) => {
        let lines = csv.split(/\r\n|\n/);
        for (let i = 0; i < lines.length; i++ )
        {
            allconfirmed.push(lines[i].split(','));
            let n = lines[i].indexOf("_Flourish_data_column_names =");
            if (n > 0) {
                n = lines[i].indexOf("{");
                if (n > 0) {
                    let data = lines[i].slice(n, lines[i].length - 1);
//                    console.log(data);
                    rawmegye = JSON.parse(data);
//                    console.log(rawmegye.data.value[10]);  //debug
                }

            }
            n = lines[i].indexOf("_Flourish_data = ");
            if (n > 0) 
            {
//                console.log(lines[i]);
                n = lines[i].indexOf("{");
                if (n > 0) {
                    let data = lines[i].slice(n, lines[i].length - 1);
//                    console.log(data);
                    rawmegyedata = JSON.parse(data);
//                    console.log(rawmegyedata.data);
//                    console.log(rawmegyedata.data[200].value[10]);  //debug
                }
            }
        }

        allconfirmedReady = true;
        console.log("https://flo.uri.sh/visualisation/1788250/embed?auto=1 is loaded");
        isDataLoaded();
});

fetch("populationmegyek.csv")
    .then(response => response.text())
    .then((csv) => {
        let lines = csv.split(/\r\n|\n/);
        for (let i = 0; i < lines.length; i++ )
            allpopulation.push(lines[i].split(','));

        allpopulationReady = true;
        console.log("population.csv is loaded");
        isDataLoaded();
});

function convertDate(date)
{
    let data = date.split('/');
    let retval = "20" + data[2] + "." + data[0] + "." + data[1];
    return retval;
}

function isDataLoaded() 
{
    if( allconfirmedReady & allpopulationReady )
    {
        console.log("All external Data is loaded");
        document.getElementById("startdate").innerHTML = allconfirmed[0][4];
        document.getElementById("enddate").innerHTML = allconfirmed[0][allconfirmed[0].length-1];

        selectorChanged();
    }
}

function drawChart(myChart, country, chart, charttype, chartrange, chartnorm)
{
    let confirmedID = 0;
//    let recoveredID = 0;
//    let deathsID = 0;
    let populationID = 0;
    let norm = 1;

    // look for IDs:
    for (let i = 0; i < rawmegye.data.value.length; i++)  if (rawmegye.data.value[i]  == country) confirmedID = i;
//    for (let i = 0; i < allrecovered.length; i++)  if (allrecovered[i][1]  == country) recoveredID = i;
//    for (let i = 0; i < alldeaths.length; i++)     if (alldeaths[i][1]     == country) deathsID = i;
    for (let i = 0; i < allpopulation.length; i++) if (allpopulation[i][0] == country) populationID = i;

    console.log(country);
    console.log(confirmedID);
    console.log(populationID);

    if (charttype == "Fixed")
    {
        myChart.options.scales.yAxes[0].ticks.max = parseInt(chartrange);
    } else {
        updateConfigAsNewObject(myChart);
    }

    if(chartnorm!="Off")
    {
        norm = 1000000 / allpopulation[populationID][1];
    } else {
        norm = 1;
    }

    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];
//    myChart.data.datasets[1].data = [];

    console.log(rawmegyedata.data.length);

    for (let i = 0; i < rawmegyedata.data.length; i++)
    {
        myChart.data.labels.push((rawmegyedata.data[i].label));

        switch(chart)
        {
            case "Confirmed":
                myChart.data.datasets[0].data.push((rawmegyedata.data[i].value[confirmedID]) * norm);
                myChart.data.datasets[0].label = "Confirmed Cases in " + country;
                console.log(rawmegyedata.data[i].value[confirmedID])
                break;

            case "ConfirmedDaily":    
                if ( (i != 0) )
                {   
                    myChart.data.datasets[0].data.push((rawmegyedata.data[i].value[confirmedID]-rawmegyedata.data[i-1].value[confirmedID]) * norm);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Confirmed Daily in " + country;
                break;

            case "ConfirmedMA":     
                if ( i > (0+14) )
                {   
                    myChart.data.datasets[0].data.push(((rawmegyedata.data[i].value[confirmedID]-rawmegyedata.data[i-13].value[confirmedID])/14) * norm);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Confirmed 14-day Moving Average " + country;
                break;

            case "Confirmed7MA":    
                if ( i > (0+7) )
                {   
                    myChart.data.datasets[0].data.push(((rawmegyedata.data[i].value[confirmedID]-rawmegyedata.data[i-6].value[confirmedID])/7) * norm);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Confirmed 14-day Moving Average " + country;
                break;

            case "Confirmed28MA":    
                if ( i > (0+28) )
                {   
                    myChart.data.datasets[0].data.push(((rawmegyedata.data[i].value[confirmedID]-rawmegyedata.data[i-27].value[confirmedID])/28) * norm);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Confirmed 14-day Moving Average " + country;
                break;

            case "Recovered":
                    myChart.data.datasets[0].data.push((allrecovered[recoveredID][i]) * norm);
                    myChart.data.datasets[0].label = "Recovered Cases in " + country;
                    break;

            case "Deaths":
                    myChart.data.datasets[0].data.push((alldeaths[deathsID][i]) * norm);
                    myChart.data.datasets[0].label = "Deaths in " + country;
                    break;

            case "RecoveredDaily":    
                if ( i != 4  )
                {   
                    myChart.data.datasets[0].data.push((allrecovered[recoveredID][i]-allrecovered[recoveredID][i-1]) * norm);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Recovered Daily in " + country;
                break;

            case "DeathsDaily":    
                if ( i != 4 )
                {   
                    myChart.data.datasets[0].data.push((alldeaths[deathsID][i]-alldeaths[deathsID][i-1]) * norm);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Deaths Daily in " + country;
                break;

            case "ActiveCases":
                if ( i != 4 )
                {   
                    myChart.data.datasets[0].data.push(
                        ( allconfirmed[confirmedID][i] - allrecovered[recoveredID][i] - alldeaths[deathsID][i] ) * norm
                    );
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Active Cases in " + country;
                break;

            case "RecoveredMA":    
                if ( i > (4+14) )
                {   
                    myChart.data.datasets[0].data.push(((allrecovered[recoveredID][i]-allrecovered[recoveredID][i-13])/14) * norm);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Recovered  14-day Moving Average " + country;
                break;

            case "DeathsMA":    
                if ( i > (4+14) )
                {   
                    myChart.data.datasets[0].data.push(((alldeaths[deathsID][i]-alldeaths[deathsID][i-13])/14) * norm);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Deaths 14-day Moving Average " + country;
                break;

            default:
                myChart.data.datasets[0].label = "Should never occure...";
                break; 
        }
    }

    if(norm!=1)
    {
        myChart.data.datasets[0].label = myChart.data.datasets[0].label + " / 1 Million";
    }

    myChart.update();
}

function updateConfigAsNewObject(chart) 
{
    chart.options = {
        // Boolean - whether or not the chart should be responsive and resize when the browser does.
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: false,
//        scaleLabel: function(label){return label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "  ");},
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    chart.update();
}

function selectorChanged()
{
    let country    = getSelectValue("CountrySelector");
    let chart      = getSelectValue("ChartSelector");
    let charttype  = getSelectValue("ChartTypeSelector");
    let chartrange = document.getElementById("ChartRange").value;
    let chartnorm  = getSelectValue("NormSelector");

    drawChart(myChart, country, chart, charttype, chartrange, chartnorm);
}

function getSelectValue(selectname)
{
    var e = document.getElementById(selectname);
    var strUser = e.options[e.selectedIndex].value;
    return strUser;
}

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) 
{
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) 
    {
        textbox.addEventListener(event, function() 
        {
            if (inputFilter(this.value)) 
            {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

setInputFilter(document.getElementById("ChartRange"), function(value) 
{
    return /^\d*$/.test(value); 
});

window.addEventListener("resize", setChartSize);

function setChartSize()
{
    let rect = document.getElementById("myChartID").getBoundingClientRect();
    let sollHeight = window.innerHeight - parseInt(rect.top);
    
    document.getElementById("myChartID").style = "display: block; height: " + sollHeight + "px;"
    document.getElementById("myChartID").height = sollHeight;
}
