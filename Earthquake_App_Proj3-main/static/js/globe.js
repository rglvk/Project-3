let url = "http://127.0.0.1:5000/data";

let latArray = [];
let lonArray = [];
let magArray = [];
let hoverText = [];
let depthArray = [];
let alertArray = [];
let countryArray = [];
let tsunamiArray = [];

fetch(url)
    .then(response => { // Parse the response as JSON
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
    }) 
    .then(data => {
        // console.log(data); // JSON data is now parsed and available as 'data'

        let features = data.features;
        

        for (let i = 0; i < features.length; i++) {
            if (features && features[i]) {
                let varOne = features[i].geometry;

                let lat = varOne.coordinates[1];
                let lon = varOne.coordinates[0];
                let mag = features[i].properties.magnitude;
                let depth = features[i].properties.depth;
                let country = features[i].properties.country;
                let alert = features[i].properties.alert;
                let tsunami = features[i].properties.tsunami;
                // heatArray.push([location.coordinates[0], location.coordinates[1], features[i].properties.location, features[i].properties.magnitude]);
                latArray.push(lat);
                lonArray.push(lon);
                var mag2 = Math.pow(mag,3) / 30;
                magArray.push(mag2);
                hoverText.push('Kaggle Earthquake Dataset');
                depthArray.push(depth);
                countryArray.push(country);
                alertArray.push(alert);
                tsunamiArray.push(tsunami);
        
            } else {
                console.log("Data or property is not defined:", features[i]);
            }
        }
        var trace1 = {
        x: magArray, //unpack(rows, 'Status'),
        y: countryArray, // unpack(rows, 'Type'),
        z: latArray, // unpack(rows, 'Elev'),
        marker: {
            size: 2,
            color: magArray, // unpack(rows, 'Elev'),
            colorscale: 'Reds',
            line: {color: 'transparent'}
        },
        mode: 'markers',
        type: 'scatter3d',
        text: hoverText, // unpack(rows, 'Country'),
        hoverinfo: 'x+y+z+text',
        showlegend: false
        };

        var x = magArray; // unpack(rows, 'Elev');

        var trace2 = {
            x: magArray, // unpack(rows, 'Elev'),
            type: 'histogram',
            hoverinfo: 'x+y',
            showlegend: false,
            xaxis: 'x2',
            yaxis: 'y2',
            marker: {
                color: 'red'
            }};

        var trace3 = {
            geo: 'geo3',
            type:'scattergeo',
            locationmode: 'world',
            lon: lonArray, // unpack(rows, 'Longitude'),
            lat: latArray, // unpack(rows, 'Latitude'),
            hoverinfo:  'text',
            text:  countryArray, // unpack(rows, 'Elev'),
            mode: 'markers',
            showlegend: false,
            marker: {
            size: 4,
            color: magArray, // unpack(rows, 'Elev'),
            colorscale: 'Reds',
            opacity: 0.8,
            symbol: 'circle',
            line: {
                width: 1
            }
            }
        };

        var data = [trace1, trace2, trace3];

        var layout = {
            paper_bgcolor: 'black',
            plot_bgcolor: 'black',
            title: 'Earthquake Severity and Location, Around the Globe:',
            font: {color: 'white'},
            colorbar: true,
            annotations: [{
                x: 0,
                y: 0,
                xref: 'paper',
                yref: 'paper',
                text: 'Source: Kaggle Earthquake Dataset',
                showarrow: false
            }],
            geo3: {
                domain: {
            x: [0, 0.45],
            y: [0.02, 0.98]
                },
                scope: 'world',
                projection: {
                type: 'orthographic'
                },
                showland: true,
                showocean: true,
                showlakes: true,
                landcolor: 'rgb(250,250,250)',
                lakecolor: 'rgb(127,205,255)',
                oceancolor: 'rgb(6,66,115)',
                subunitcolor: 'rgb(217,217,217)',
                countrycolor: 'rgb(217,217,217)',
                countrywidth: 0.5,
                subunitwidth: 0.5,
                bgcolor: 'black'
            },
            scene: {domain: {
            x: [0.55, 1],
            y: [0, 0.6]
            },
                xaxis: {title: 'Magnitude',
                        showticklabels: false,
                        showgrid: true,
                        gridcolor: 'white'},
                yaxis: {title: 'Country',
                        showticklabels: false,
                        showgrid: true,
                        gridcolor: 'white'},
                zaxis: {title: 'Latitude',
                        showgrid: true,
                        gridcolor: 'white'}
                    },
            yaxis2: {
                anchor: 'x2',
            domain: [0.7, 1],
            showgrid: false
            },
            xaxis2: {
            tickangle: 45,
            anchor: 'y2',
            ticksuffix: 'm',
            domain: [0.6, 1]},
        };

        Plotly.newPlot("myDiv", data, layout, {showLink: false});

        console.log(alertArray)

        const uniqueAlerts = {}

        for (const element of alertArray)
        {
            if(uniqueAlerts[element])
            {
            uniqueAlerts[element] += 1
            }
            else
            {
            uniqueAlerts[element] = 1
            }
        }


        alertColors = Object.keys(uniqueAlerts)

        console.log(alertColors)

        alertCounts = Object.values(uniqueAlerts)
                
        var data = {
        labels: alertColors,
        series: alertCounts
        };

        var options = {
            labelInterpolationFnc: function(value) {
                return Math.round(value / data.series.reduce(sum) * 100) + '%';
            },
            width:600,
            height:400,
            showLabel:false,
            plugins:
            [
                Chartist.plugins.legend()
            ]
        };

        var responsiveOptions = [
            ['screen and (min-width: 640px)', {
              chartPadding: 30,
              labelOffset: 100,
              labelDirection: 'explode',
              labelInterpolationFnc: function(value) {
                return value;
              }
            }],
            ['screen and (min-width: 1024px)', {
              labelOffset: 80,
              chartPadding: 40
            }]
          ];

        new Chartist.Pie('.ct-chart', data, options, responsiveOptions);


}).catch(error => {
    console.error("Error fetching or parsing data:", error);
});


