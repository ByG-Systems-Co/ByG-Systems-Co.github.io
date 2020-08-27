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
        isDataLoaded();
});

fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")
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
        isDataLoaded();
});

fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")
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
        isDataLoaded();
});

fetch("population.csv")
    .then(response => response.text())
    .then((csv) => {
        let lines = csv.split(/\r\n|\n/);
        for (let i = 0; i < lines.length; i++ )
            allpopulation.push(lines[i].split(','));

        allpopulationReady = true;
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

    for (let i = 0; i < allconfirmed.length; i++)  if (allconfirmed[i][1]  == country) confirmedID = i;
    for (let i = 0; i < allrecovered.length; i++)  if (allrecovered[i][1]  == country) recoveredID = i;
    for (let i = 0; i < alldeaths.length; i++)     if (alldeaths[i][1]     == country) deathsID = i;
    for (let i = 0; i < allpopulation.length; i++) if (allpopulation[i][0] == country) populationID = i;

    //Innen kell folytatnom...

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
