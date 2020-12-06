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

fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")
    .then(response => response.text())
    .then((csv) => {
        let lines = csv.split(/\r\n|\n/);
        for (let i = 0; i < lines.length; i++ )
            allconfirmed.push(lines[i].split(','));

        for (let i = 4; i < allconfirmed[0].length; i++)
            allconfirmed[0][i] = convertDate(allconfirmed[0][i]);

        for ( let i = 1; i < allconfirmed.length - 1; i++ )
        {
            if ( allconfirmed[i][1] == allconfirmed[i+1][1] )
            {
                for (let j = 4; j < allconfirmed[i].length; j++)
                    allconfirmed[i][j] = parseInt(allconfirmed[i][j]) + parseInt(allconfirmed[i+1][j]);
                allconfirmed.splice(i+1, 1);
                i--;
            } else {
                for (let j = 4; j < allconfirmed[i].length; j++)
                    allconfirmed[i][j] = parseInt(allconfirmed[i][j]);
            }
        }
        allconfirmedReady = true;
        console.log("time_series_covid19_confirmed_global.csv is loaded");
        isDataLoaded();
});

fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv")
    .then(response => response.text())
    .then((csv) => {
        let lines = csv.split(/\r\n|\n/);
        for (let i = 0; i < lines.length; i++ )
            allrecovered.push(lines[i].split(','));

        for (let i = 4; i < allrecovered[0].length; i++)
            allrecovered[0][i] = convertDate(allrecovered[0][i]);

        for ( let i = 1; i < allrecovered.length - 1; i++ )
        {
            if ( allrecovered[i][1] == allrecovered[i+1][1] )
            {
                for (let j = 4; j < allrecovered[i].length; j++)
                    allrecovered[i][j] = parseInt(allrecovered[i][j]) + parseInt(allrecovered[i+1][j]);
                allrecovered.splice(i+1, 1);
                i--;
            } else {
                for (let j = 4; j < allrecovered[i].length; j++)
                    allrecovered[i][j] = parseInt(allrecovered[i][j]);
            }
        }
        allrecoveredReady = true;
        console.log("time_series_covid19_recovered_global.csv is loaded");
        isDataLoaded();
});

fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv")
    .then(response => response.text())
    .then((csv) => {
        let lines = csv.split(/\r\n|\n/);
        for (let i = 0; i < lines.length; i++ )
            alldeaths.push(lines[i].split(','));

        for (let i = 4; i < alldeaths[0].length; i++)
            alldeaths[0][i] = convertDate(alldeaths[0][i]);

        for ( let i = 1; i < alldeaths.length - 1; i++ )
        {
            if ( alldeaths[i][1] == alldeaths[i+1][1] )
            {
                for (let j = 4; j < alldeaths[i].length; j++)
                    alldeaths[i][j] = parseInt(alldeaths[i][j]) + parseInt(alldeaths[i+1][j]);
                alldeaths.splice(i+1, 1);
                i--;
            } else {
                for (let j = 4; j < alldeaths[i].length; j++)
                    alldeaths[i][j] = parseInt(alldeaths[i][j]);
            }
        }
        alldeathsReady = true;
        console.log("time_series_covid19_deaths_global.csv is loaded");
        isDataLoaded();
});

fetch("population.csv")
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
    if( allconfirmedReady & alldeathsReady & allrecoveredReady & allpopulationReady )
    {
        console.log("All external Data is loaded");
        document.getElementById("startdate").innerHTML = allconfirmed[0][4];
        document.getElementById("enddate").innerHTML = allconfirmed[0][allconfirmed[0].length-1];

        selectorChanged();
    }
}

function drawChart(myChart, country, chart, charttype, chartrange)
{
    let confirmedID = 0;
    let recoveredID = 0;
    let deathsID = 0;
    let populationID = 0;

    // look for IDs:
    for (let i = 0; i < allconfirmed.length; i++)  if (allconfirmed[i][1]  == country) confirmedID = i;
    for (let i = 0; i < allrecovered.length; i++)  if (allrecovered[i][1]  == country) recoveredID = i;
    for (let i = 0; i < alldeaths.length; i++)     if (alldeaths[i][1]     == country) deathsID = i;
    for (let i = 0; i < allpopulation.length; i++) if (allpopulation[i][0] == country) populationID = i;

    if (charttype == "Fixed")
    {
        myChart.options.scales.yAxes[0].ticks.max = parseInt(chartrange);
    } else {
        updateConfigAsNewObject(myChart);
    }

    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];
//    myChart.data.datasets[1].data = [];

    for (let i = 4; i < allconfirmed[confirmedID].length; i++)
    {
        myChart.data.labels.push((allconfirmed[0][i]));

        switch(chart)
        {
            case "Confirmed":
                myChart.data.datasets[0].data.push((allconfirmed[confirmedID][i]));
                myChart.data.datasets[0].label = "Confirmed Cases in " + country;
                break;
            case "Recovered":
                myChart.data.datasets[0].data.push((allrecovered[recoveredID][i]));
                myChart.data.datasets[0].label = "Recovered Cases in " + country;
                break;
            case "Deaths":
                myChart.data.datasets[0].data.push((alldeaths[deathsID][i]));
                myChart.data.datasets[0].label = "Deaths in " + country;
                break;
            case "NewCases":
            case "ConfirmedDaily":    
                if ( i != 4 )
                {   
                    myChart.data.datasets[0].data.push(allconfirmed[confirmedID][i]-allconfirmed[confirmedID][i-1]);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Confirmed Daily in " + country;
                break;
            case "RecoveredDaily":    
                if ( i != 4 )
                {   
                    myChart.data.datasets[0].data.push(allrecovered[recoveredID][i]-allrecovered[recoveredID][i-1]);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Recovered Daily in " + country;
                break;
            case "DeathsDaily":    
                if ( i != 4 )
                {   
                    myChart.data.datasets[0].data.push(alldeaths[deathsID][i]-alldeaths[deathsID][i-1]);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Deaths Daily in " + country;
                break;
            case "NewCases1M":
                if ( i != 4 )
                {   
                    myChart.data.datasets[0].data.push(
                        ( allconfirmed[confirmedID][i] - allconfirmed[confirmedID][i-1] ) / allpopulation[populationID][1] * 1000000
                    );
               } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "New Cases / 1 Million in " + country;
                break;
            case "ActiveCases":
                if ( i != 4 )
                {   
                    myChart.data.datasets[0].data.push(
                        ( allconfirmed[confirmedID][i] - allrecovered[recoveredID][i] - alldeaths[deathsID][i] )
                    );
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Active Cases in " + country;
                break;
            case "ActiveCases1M":
                if ( i != 4 )
                {   
                    myChart.data.datasets[0].data.push(
                        ( allconfirmed[confirmedID][i] - allrecovered[recoveredID][i] - alldeaths[deathsID][i] ) / allpopulation[populationID][1] * 1000000
                    );
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Active Cases / 1 Million in " + country;
                break;

            case "ConfirmedMA":    
                if ( i > (4+14) )
                {   
                    myChart.data.datasets[0].data.push((allconfirmed[confirmedID][i]-allconfirmed[confirmedID][i-13])/14);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Confirmed 14-day Moving Average " + country;
                break;

            case "RecoveredMA":    
                if ( i > (4+14) )
                {   
                    myChart.data.datasets[0].data.push((allrecovered[recoveredID][i]-allrecovered[recoveredID][i-13])/14);
                } else {
                    myChart.data.datasets[0].data.push(0);
                }
                myChart.data.datasets[0].label = "Recovered  14-day Moving Average " + country;
                break;

            case "DeathsMA":    
                if ( i > (4+14) )
                {   
                    myChart.data.datasets[0].data.push((alldeaths[deathsID][i]-alldeaths[deathsID][i-13])/14);
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

    drawChart(myChart, country, chart, charttype, chartrange);
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
    let sollHeight = $(window).height() - parseInt(rect.top) - 10;

    document.getElementById("myChartID").style = "display: block; height: " + sollHeight + "px;"
    document.getElementById("myChartID").height = sollHeight;
}
