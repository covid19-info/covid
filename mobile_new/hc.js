Highcharts.ajax({
    url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-history.csv',
    dataType: 'csv',
    success: function (csv) {

        // Parse the CSV Data
        /*Highcharts.data({
            csv: data,
            switchRowsAndColumns: true,
            parsed: function () {
                console.log(this.columns);
            }
        });*/

        // Very simple and case-specific CSV string splitting
        function CSVtoArray(text) {
            return text.replace(/^"/, '')
                .replace(/",$/, '')
                .split('","');
        }

        csv = csv.split(/\n/);

        var countries = {},
            mapChart,
            countryChart,
            numRegex = /^[0-9\.]+$/,
            lastCommaRegex = /,\s$/,
            quoteRegex = /\"/g,
            categories = CSVtoArray(csv[2]).slice(4);

        // Parse the CSV into arrays, one array each country
        csv.slice(3).forEach(function (line) {
            var row = CSVtoArray(line),
                data = row.slice(4);

            data.forEach(function (val, i) {
                val = val.replace(quoteRegex, '');
                if (numRegex.test(val)) {
                    val = parseInt(val, 10);
                } else if (!val || lastCommaRegex.test(val)) {
                    val = null;
                }
                data[i] = val;
            });

            countries[row[1]] = {
                name: row[0],
                code3: row[1],
                data: data
            };
        });

        // For each country, use the latest value for current population
        var data = [];
        for (var code3 in countries) {
            if (Object.hasOwnProperty.call(countries, code3)) {
                var value = null,
                    year,
                    itemData = countries[code3].data,
                    i = itemData.length;

                while (i--) {
                    if (typeof itemData[i] === 'number') {
                        value = itemData[i];
                        year = categories[i];
                        break;
                    }
                }
                data.push({
                    name: countries[code3].name,
                    code3: code3,
                    value: value,
                    year: year
                });
            }
        }


//start
      console.log(countries);  
      console.log(data);  

      countries7Days=getWorldNewCasesIn7Days();
      console.log(countries7Days);

      countriesData=getDailyCases();
      console.log(countriesData);

       

//   data 
//   clear data 

      for (let i = 0; i < data.length; i++) {
          data[i].value=1;
      }          
      
// replace
      
      for (let i = 0; i < data.length; i++) {
         for(let j = 0; j < countries7Days.length; j++) {
           if  (countries7Days[j][0] !== undefined) { 
            if  (data[i].code3==countries7Days[j][0]) {
              data[i].value=countries7Days[j][1];
              if (data[i].value==0) {data[i].value=1;}
              exitCicle=true;
              break; 
            }
          }
         }
        } 
      console.log(data);
  
    
  // clear data      
      for (var key in countries) {
    // skip loop if the property is from prototype
        if (!countries.hasOwnProperty(key)) continue;

        var obj = countries[key];
        obj['data']=[];
       }

 // fill data         
      for (var key in countries) {
    // skip loop if the property is from prototype
        if (!countries.hasOwnProperty(key)) continue;

        var obj = countries[key];
        for (let i = 0; i < countriesData.length; i++) {
          if(countriesData[i][0]==obj['code3']) {
            obj['data'].push(countriesData[i][1]);
          } 
        }
      }         


      console.log(countries);  

// end


        // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
        var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
        mapData.forEach(function (country) {
            country.id = country.properties['hc-key']; // for Chart.get()
            country.flag = country.id.replace('UK', 'GB').toLowerCase();
        });

        // Wrap point.select to get to the total selected points
        Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            var points = mapChart.getSelectedPoints();
            if (points.length) {
     
 //          if (points.length === 1) {
 //                   document.querySelector('#info #flag')
 //                       .className = 'flag ' + points[0].flag;
 //                   document.querySelector('#info h2').innerHTML = points[0].name;
 //               } else {
 //                   document.querySelector('#info #flag')
 //                       .className = 'flag';
 //                   document.querySelector('#info h2').innerHTML = 'Comparing countries';
//
//                }

//                document.querySelector('#info .subheader')
//                    .innerHTML = '<h4>Historical population</h4><small><em>Shift + Click on map to compare countries</em></small>';

                if (!countryChart) {
                    countryChart = Highcharts.chart('country-chart', {
                        chart: {
                            height: 500,
                            spacingLeft: 0
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: null
                        },
                        subtitle: {
                            text: null
                        },
   //                     xAxis: {
   //                         tickPixelInterval: 50,
   //                         crosshair: true
   //                     },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                            day: '%e. %b'
                          }
                        },
                        yAxis: {
                            title: null,
                            opposite: true
                        },
                        tooltip: {
                            split: true
                        },
                        plotOptions: {
                            series: {
                                animation: {
                                    duration: 500
                                },
                                marker: {
                                    enabled: false
                                },
                                threshold: 0,
//                                pointStart: parseInt(categories[0], 10)
                                pointStart: Date.UTC(2020,0,03),
                                pointInterval: 3600 * 1000 * 24 
                             }
                        }
                    });
                }

                countryChart.series.slice(0).forEach(function (s) {
                    s.remove(false);
                });
                points.forEach(function (p) {
                    countryChart.addSeries({
                        name: p.name,
                        data: countries[p.code3].data,
                        type: points.length > 1 ? 'line' : 'area'
                    }, false);
                });
                countryChart.redraw();

            } else {
                document.querySelector('#info #flag').className = '';
                document.querySelector('#info h2').innerHTML = '';
                document.querySelector('#info .subheader').innerHTML = '';
                if (countryChart) {
                    countryChart = countryChart.destroy();
                }
            }
        });

        // Initiate the map chart
        mapChart = Highcharts.mapChart('container', {

            title: {
                text: 'Coronavirus by country'
            },
            chart: {
                            height: 500,
                            spacingLeft: 0
                        },

            subtitle: {
                text: 'Click countries to view history'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                  theme: {
                    fill: 'white',
                    'stroke-width': 1,
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#a4edba'
                        },
                        select: {
                            stroke: '#039',
                            fill: '#a4edba'
                        }
                      }
                  },
                verticalAlign: 'bottom',
                width:50,
                height:50,
              },
              buttons:{
                zoomOut:{
                y:58
                }
              }
            },


            colorAxis: {
                 type: 'logarithmic',
 //               endOnTick: false,
 //               startOnTick: false,
                min: 1,
                max:5000,
                minColor: '#10FF00',
                maxColor: '#FF0000'
            },

            tooltip: {
                footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
            },

            series: [{
                data: data,
                mapData: mapData,
                joinBy: ['iso-a3', 'code3'],
                name: 'Cases per 100000 last 7 days',
                allowPointSelect: true,
                cursor: 'pointer',
                states: {
                    select: {
                        color: '#a4edba',
                        borderColor: 'black',
                        dashStyle: 'shortdot'
                    }
                },
                borderWidth: 0.5
            }]
        });

        // Pre-select a country
        mapChart.get('ae').select();
    }
});
