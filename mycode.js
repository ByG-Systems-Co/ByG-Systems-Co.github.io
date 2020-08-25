document.addEventListener('DOMContentLoaded', function(event) {
    //the event occurred


    ctx = document.getElementById('myChartID').getContext('2d'); // Chart Data Set

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: "Dummy Chart",
                data: [],
                backgroundColor: 'rgba(255, 0, 0, 1)'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

});

let ctx;
let mychart;

let country = "";
let charttype = "";
let rawconfirmed = "";
let rawrecovered = "";
let rawdeaths = "";
let rawpopulation = "";
let allconfirmed = [];
let allrecovered = [];
let alldeaths = [];
let allpopulation = [];

let confirmedID = "";
let recoveredID = "";
let deathsID = "";
let populationID = "";


function convertDate(date)
{
    let data = date.split('/');
    let retval = "20" + data[2] + "." + data[0] + "." + data[1];
    return retval;
}

async function loadData(v_url) 
{
    try {
        var v_array = await getText(v_url);
        if (0 <= v_url.search("confirmed"))  { rawconfirmed  = v_array; }
        if (0 <= v_url.search("recovered"))  { rawrecovered  = v_array; }
        if (0 <= v_url.search("deaths"))     { rawdeaths     = v_array; }
        if (0 <= v_url.search("population")) { rawpopulation = v_array; }
    }
    catch{
        console.log(error);
    }
}

function getText(v_url) 
{
    var data = jQuery.get(v_url, function(data) 
    {
        return data;
    });
    return data;
}

function convertStringToArray(string, array)
{
    let lines = string.split(/\r\n|\n/);
    for (let i = 0; i < lines.length; i++ )
    {
        let data = lines[i].split(',');
        array.push(data);
    }
}

function getSelectValue(selectname)
{
    var e = document.getElementById(selectname);
    var strUser = e.options[e.selectedIndex].value;
    return strUser;
}

function selectorChanged()
{
    country    = getSelectValue("CountrySelector");
    chart      = getSelectValue("ChartSelector");
    charttype  = getSelectValue("ChartTypeSelector");
    chartrange = document.getElementById("ChartRange").value;

    if (charttype == "Fixed")
    {
        myChart.options.scales.yAxes[0].ticks.max = parseInt(chartrange);
    } else {
        updateConfigAsNewObject(myChart);
    }

    lookForIDs(country);
    prepareDataForChart(country);

    switch(chart)
    {
        case "Confirmed":
            myChart.data.datasets[0].data = dataallcases; 
            myChart.data.datasets[0].label = "Confirmed Cases in " + country;
            break;
        case "Recovered":
            myChart.data.datasets[0].data = dataallrecovered;  
            myChart.data.datasets[0].label = "Recovered Cases in " + country;
            break;
        case "Deaths":
            myChart.data.datasets[0].data = dataalldeaths;  
            myChart.data.datasets[0].label = "Deaths in " + country;
            break;
        case "NewCases":
            myChart.data.datasets[0].data = datanewcases;  
            myChart.data.datasets[0].label = "New Cases in " + country;
            break;
        case "NewCases1M":
            myChart.data.datasets[0].data = datanewcases1M;  
            myChart.data.datasets[0].label = "New Cases / 1 Million in " + country;
            break;
        case "ActiveCases":
            myChart.data.datasets[0].data = dataactive;  
            myChart.data.datasets[0].label = "Active Cases in " + country;
            break;
        case "ActiveCases1M":
            myChart.data.datasets[0].data = dataactive1M;  
            myChart.data.datasets[0].label = "Active Cases / 1 Million in " + country;
            break;
        default:
            myChart.data.datasets[0].data = datanewcases;  
            myChart.data.datasets[0].label = "Should never occure...";
            break;
    }

    myChart.data.labels = dateaxis;
    myChart.update();
}

function updateConfigAsNewObject(chart) 
{
    chart.options = {
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

function lookForIDs(country) 
{
    for (let i = 0; i < allconfirmed.length; i++)  if (allconfirmed[i][1]  == country) confirmedID = i;
    for (let i = 0; i < allrecovered.length; i++)  if (allrecovered[i][1]  == country) recoveredID = i;
    for (let i = 0; i < alldeaths.length; i++)     if (alldeaths[i][1]     == country) deathsID = i;
    for (let i = 0; i < allpopulation.length; i++) if (allpopulation[i][0] == country) populationID = i;
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

let dateaxis = [];
let dataallcases = [];
let dataallrecovered = [];
let dataalldeaths = [];
let datanewcases = [];
let datanewcases1M = [];
let dataactive = [];
let dataactive1M = [];

function prepareDataForChart(country)
{
    dateaxis = [];
    dataallcases = [];
    dataallrecovered = [];
    dataalldeaths = [];
    datanewcases = [];
    datanewcases1M = [];
    dataactive = [];
    dataactive1M = [];
    for( let i = 4; i < allconfirmed[0].length; i++)
    {
        dateaxis.push(convertDate(allconfirmed[0][i]));
        dataallcases.push(allconfirmed[confirmedID][i]);
        dataallrecovered.push(allrecovered[recoveredID][i]);
        dataalldeaths.push(alldeaths[deathsID][i]);
        dataactive.push(allconfirmed[confirmedID][i]-allrecovered[recoveredID][i]-alldeaths[deathsID][i]);
        dataactive1M.push(dataactive[i-4]/(allpopulation[populationID][1]/1000000));
        if ( i == 4 ) 
        {
            datanewcases.push(0);
            datanewcases1M.push(0);
        } else {
            datanewcases.push(allconfirmed[confirmedID][i]-allconfirmed[confirmedID][i-1]);
            datanewcases1M.push((allconfirmed[confirmedID][i]-allconfirmed[confirmedID][i-1])/(allpopulation[populationID][1]/1000000));
        }
    }
}

$(document).ready(async function () 
{
    await loadData("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv");
    await loadData("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv");
    await loadData("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv");
    await loadData("population.csv");

    await convertStringToArray(rawconfirmed, allconfirmed);
    await convertStringToArray(rawrecovered, allrecovered);
    await convertStringToArray(rawdeaths, alldeaths);
    await convertStringToArray(rawpopulation, allpopulation);

    selectorChanged();
    
    document.getElementById("startdate").innerHTML = convertDate(allconfirmed[0][4]);
    document.getElementById("enddate").innerHTML = convertDate(allconfirmed[0][allconfirmed[0].length-1]);
});




