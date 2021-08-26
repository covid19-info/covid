function linearRegression(data) {
  var sum_x = 0, sum_y = 0
    , sum_xy = 0, sum_xx = 0
    , count = 0
    , m, b;

  if (data.length === 0) {
    throw new Error('Empty data');
  }

  // calculate sums
  for (var i = 0, len = data.length; i < len; i++) {
    var point = data[i];
    sum_x += point[0];
    sum_y += point[1];
    sum_xx += point[0] * point[0];
    sum_xy += point[0] * point[1];
    count++;
  }

  // calculate slope (m) and y-intercept (b) for f(x) = m * x + b
  m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
  b = (sum_y / count) - (m * sum_x) / count;

//  return function(m, b, x) {
//    return m * x + b;
//  }.bind(null, m, b);
  
   return m;
}


function movingAverage(values, N,roundRes) {
  var i = 0;
  var sum = 0;
  var means = [];
  for ( i = 0; i < values.length; i++) {
      means[i] = null;
  }
  i=0;
  for ( n = Math.min(N - 1, values.length); i < n; i++) {
    sum += values[i];
  }
  for (let n = values.length; i < n; i++) {
    sum += values[i];
    if (roundRes) { 
        means[i] = Math.round(sum / N);
    } else {  
        means[i] = sum / N;
    }
    sum -= values[i - N + 1];
  }
  return means;
}


function linearRegressionDataSet(values, N) {

  means=[];
  for ( i = 0; i < values.length; i++) {
      means[i] = 0;
  }
// make dataset for linearRegression
  
  for ( i = 0; i < values.length; i++) {
      ds =[];
      for ( j = 0; j<N; j++){
        k=i-N+j;
        if (k<0) {
          num = 0;
        }  else {
          num = values[k] ;
        }

       ds[j]=[j,num];
    }
     
    means[i]=linearRegression(ds);
  }
   return means; 

}

function RMSE(realData,forecastData) {
  if (realData.length<forecastData.length) {
    lengthData = realData.length;
  } else {
    lengthData = forecastData.length;
 
  }
  var sum =0;
  for ( i = 0; i < lengthData; i++) {
      sum = sum+ Math.pow(forecastData[i]-realData[i],2);
  }
  return Math.sqrt((sum/lengthData));
}


  
function RMSE_NORM(realData,forecastData) {
 if (realData.length==0) {
  return 'N/A';

}

 if (forecastData.length==0) {
  return 'N/A';
}
 
var diff = Math.max.apply(Math, realData)-Math.min.apply(Math, realData);
  if (diff==0) {return 0;}  
  return RMSE(realData,forecastData)/diff;
}






//  if ((means[i] == Number.POSITIVE_INFINITY) || (means[i] == Number.NEGATIVE_INFINITY))
//        {
//            means[i]=0;
//        }
      

function percentDataSet(values) {

  means=[];
  means[0] = 0;
  for ( i = 1; i < values.length; i++) {
      
      if ((values[i]==null) || (values[i]==0)  ||  (values[i-1]==null) || (values[i-1]==0))  {
            means[i]=0;
            continue;
      }    
//      if (values[i]>values[i-1]) {
          means[i]=Math.round(((values[i]-values[i-1])/((values[i]+values[i-1])/2))*1000)/10; 
//      }
//      if (values[i]<values[i-1]) {
//          means[i]= Math.round(((1-(values[i-1]/values[i]))*100)); 
//        }
      if (values[i]==values[i-1]) {
        means[i]= 0; 
      }
//       console.log(values[i],values[i-1],means[i]);
    }
 return means;
}

function buildTimeDataSet(dailyCases,startDate,predictDays) {

var dateList=[];
var countDate=dailyCases.length;

countDate=dailyCases.length+predictDays;

 var dt = new Date(startDate);
 var tm= dt.getTime();
 var msInDay = 1000 * 60 * 60 * 24;
 for (var i = 0; i < countDate; i++){
   dt = new Date(tm); 
   dateList[i]=(dt.getMonth()+1) +'/'+dt.getDate();
   tm=tm+msInDay;  
 } 

return dateList;
}


function buildHolidaysDataSet(startDate,timeDataSet,holidaysList) {
  
  var found=false;
  var dateList=[];
  var dt = new Date(startDate);
  var tm= dt.getTime();
  var msInDay = 1000 * 60 * 60 * 24;
  for (var i = 0; i < timeDataSet.length; i++){
    dt = new Date(tm);
    found=false;
    for (var j = 0; j < holidaysList.length; j++){
      dtHL = new Date(holidaysList[j]);
      
      if ((dtHL.getMonth() == dt.getMonth()) && (dtHL.getDate() == dt.getDate()) && (dtHL.getFullYear() == dt.getFullYear()) ) {
        found=true;
      }
    }
 
    dateList[i]=found;
    tm=tm+msInDay;  
  } 
return dateList;
}



function buildHolidaysWeeks(startDate,timeDataSet) {
  
  var fillWeek=0;
  var found=false;
  var dateList=[];
  var dt = new Date(startDate);
  var tm= dt.getTime();
  var msInDay = 1000 * 60 * 60 * 24;
  for (var i = 0; i < timeDataSet.length; i++){
    dateList[i]=null;
  }
  for (var i = 0; i < timeDataSet.length; i++){
    dt = new Date(tm);
    
    fillWeek=0;
    if (timeDataSet[i]==true) {
        if (dt.getDay()==6) {
            fillWeek=i+1;
        } else {
            fillWeek=i-dt.getDay();  
        } 
        for (var j = 0; j < 7; j++){
          dateList[i+j]=1;
        }          
    }

    tm=tm+msInDay;  
  } 
return dateList;
}


function buildMovingDataSet(dailyCases) {
  return movingAverage(dailyCases,7,true);
}



function replaceMinus(dataSet) {

  var tmpResult=[];
  for (var i = 0; i < dataSet.length; i++){
   if (dataSet[i]<0) {
	    tmpResult[i]=0;
   }else {
   	  tmpResult[i]=dataSet[i];
   } 	   
	}
   return tmpResult;
}





function buildHWSDataSet(dailyCases,predictDays,onDay,calcRange) {

var startPoint=onDay-calcRange;
    if (startPoint<=0) {startPoint=0;}
var endPoint=onDay;



smarr=[];
for (var i = 0; i < endPoint; i++){

  var  dd=dailyCases[i];
   if ((dd==null) || (dd==0)) {
      dd = 0.01;     
   }
  if ((i>=startPoint) && (i<endPoint)) {
      smarr.push([i,dd]);
  }
}


var fhw = ssci.fore.holtWinter()
                .period(7)
                .data(smarr)
                .x(function(d){ return d[0]; })
                .y(function(d){ return d[1]; })
                .level(0.66)
//                .trend(0.0)
                .season(1.0);
               
fhw();

var calcArr = fhw.outputY();

var forecastHWS = fhw.forecast(predictDays);

for (var i = 0; i < forecastHWS.length; i++){
   console.log(forecastHWS[i]);
}
 
predictArrayHWS=[];

for (var i = 0; i < dailyCases.length+predictDays; i++){
   if (i<endPoint) {
          predictArrayHWS.push(null);  
       //   predictArrayHWS.push(Math.round(calcArr[i-7]));
   } 
   if ((i>=endPoint) &&  (i<endPoint+predictDays)) {
      
      predictArrayHWS.push(Math.round(forecastHWS[i-endPoint][1]));
   }
   if (i>=endPoint+predictDays) {
      predictArrayHWS.push(null);
   }  
 }

  return predictArrayHWS;
}




function builPRDataSet(dailyCases,predictDays,onDay,calcRange) {

var startPoint=onDay-calcRange;
    if (startPoint<=0) {startPoint=0;}
var endPoint=onDay;


  var someDataA = [];
 

  for (var i = 0; i < dailyCases.length; i++){
   if ((i>=startPoint) && (i<endPoint)) {
      someDataA.push(new DataPoint(i-startPoint, dailyCases[i]));
   }
  } 
 
  var polyA = new PolynomialRegression(someDataA, 4);
  var termsA = polyA.getTerms();
  var predictArrayA =[];

  for (var i = 0; i < dailyCases.length+predictDays; i++){
   if (i<endPoint) {
       if (i>startPoint) { 
          predictArrayA.push(null);  
 //           predictArrayA.push(Math.round(polyA.predictY(termsA,i-startPoint)));
       }
       else {        
          predictArrayA.push(null);
       }   
    } 
    if ((i>=endPoint) &&  (i<endPoint+predictDays)) {
      predictArrayA.push(Math.round(polyA.predictY(termsA,i-startPoint)));
    }
    if (i>=endPoint+predictDays) {
      predictArrayA.push(null);
    }  
  } 
  return predictArrayA;
}

function findBestStart(realDataSet,startPoint)
{
     
  //  up 14 days before start 
  //  21 days forecast 
  //  14+ 21= 35 

  if (startPoint<16) {
    return startPoint;
  } 
  var minRMSE=100000;
  var minStartPoint=startPoint; 
  var currStartPoint=startPoint; 
//  var backdays=parseInt(document.getElementById('calcRange').value);
  var forvardForecast=21;

//  for (var j = 0; j<14; j++) {
  for (var j = 0; j<25; j++) {

//     backdays=parseInt(document.getElementById('calcRange').value)-j;
     backdays=42-j;
    
   
//     for (var i = 2; i < 16-j; i++){
          for (var i = 3; i < 16; i++){
	     
      
      currForDataSet = buildHWSDataSet(realDataSet,forvardForecast+i-j,startPoint-i, backdays);     

      currRMSE = RMSE_NORM(realDataSet.slice(startPoint-i,startPoint),currForDataSet.slice(startPoint-i,startPoint)); 
      if (minRMSE > currRMSE) {
        minRMSE = currRMSE;
        minStartPoint = startPoint-i;
        minBackdays=backdays;
      }
    }
  }
  document.getElementById('calcRange').value=minBackdays;
  return  minStartPoint;
}

function total_to_daily(dataSet) {

  var tmpResult=[];
  tmpResult[0]=dataSet[0];
  for (var i = 1; i < dataSet.length; i++){
      tmpResult[i]=dataSet[i]-dataSet[i-1];
      if (dataSet[i-1]>=dataSet[i]) {
        console.log(dataSet[i-1],dataSet[i],tmpResult[i]);
      }    
   	   
	}
   return tmpResult;
}



function showDataTable(dateDataSet,realDataSet,forecastDataSet,forecastDay,holidaysDS) {

  var tempStr="";
  var tableStr="";
  var forTmp=[];
  var realTmp=[];
  var percentInfo=[];
  var mistakeMessage='';
  var nullCount=0;
  
  for (var i = 0; i < forecastDataSet.length; i++){
   if (forecastDataSet[i]!=null) {
      outStr=dateDataSet[i];
      addStyle='';
      if (i==forecastDay) { 
        outStr='<u>'+outStr+'</u>';
        } 
 if (holidaysDS[i]==true) {
          addStyle=' style="color:#FF0000"; title="extra/long holidays" ';  
          mistakeMessage=" Extra/long holidays. ";
      }
      tempStr=tempStr+'<td><div '+addStyle+'>'+outStr+'</div></td>';
 
    } 
  }
  
  tableStr='<tr><td>Date</td>'+tempStr+'</tr>';
  tempStr="";
  for (var i = 0; i < forecastDataSet.length; i++){
   if (forecastDataSet[i]!=null) {
      currForec=forecastDataSet[i];   
	    if (currForec==0) {
	       currForec='n/a';
	    }	
      tempStr=tempStr+'<td>'+currForec+'</td>';
      forTmp.push(forecastDataSet[i]);
    } 
  }

  tableStr=tableStr+'<tr><td>Forecast</td>'+tempStr+'</tr>';
  tempStr="";
     
  for (var i = 0; i < forecastDataSet.length; i++){
   if (forecastDataSet[i]!=null) {
        
      if ((realDataSet[i]==null) || (i>=realDataSet.length))
      {
        currReal='';
      }  else {
        currReal=realDataSet[i];
      }
 //     if ((i<realDataSet.length) && (i>(realDataSet.length-7)))
        if (i<realDataSet.length)
   
	   {
 //         if (((realDataSet[i]==null) || (realDataSet[i]<1000)) && (realDataSet.length-i<8)) {
            if ((realDataSet[i]==null) || (realDataSet[i]<1000)) {
  
	      nullCount=nullCount+1;
        
          } 
     }

      tempStr=tempStr+'<td>'+currReal+'</td>';
      realTmp.push(currReal); 
    }
  }

  if (nullCount>3) {
      mistakeMessage=mistakeMessage +" Not outbrake/epidemic. Endemic status. ";
  }

  tableStr=tableStr+'<tr><td>Real</td>'+tempStr+'</tr>';  
  
	var minus=false;
  for (var i = 0; i < forTmp.length; i++){
    if (forTmp[i]>realTmp[i]) {
      currPercent= realTmp[i]/forTmp[i];
	 minus=false;    
    } else {
      currPercent= forTmp[i]/realTmp[i];
	   minus=true;
    }
        
    if (realTmp[i]=='') {
      currPercent='';
    } else {
      currPercent =Math.round((1-currPercent)*10000)/100;
      if (minus) {
      currPercent=0-currPercent;
      }	
    }
	  if (forTmp[i]==0) {
      currPercent='';
    }  
    percentInfo.push(currPercent);
  }

  tempStr='';
  for (var i = 0; i < percentInfo.length; i++){
    tempStr=tempStr+'<td>'+percentInfo[i]+'</td>';
  }

  tableStr=tableStr+'<tr><td>Error (%) </td>'+tempStr+'</tr>';

  if (mistakeMessage!='') {
    mistakeMessage=mistakeMessage+' Forecast may be wrong.<br>';
  }
  document.getElementById("tableForecast").innerHTML = mistakeMessage+ "<table style='font-size: 12px; border: 1px solid black;'> <tr>"+tableStr+ "</tr></table>"; 
    
}

function buildChart2(range,forecast) {
   


  calcRecur=7;
  predictDays  = calcRecur*2;
  calcRange=calcRecur*6;
     
  calcRange=range;
  predictDays=forecast;
  

  onDay=dailyCases.length;
  
  dstime=   buildTimeDataSet(dailyCases,startDate,predictDays+15);
  dsHolidays  = buildHolidaysDataSet(startDate,dstime,holidaysList);
  dsHolidaysWeeks= buildHolidaysWeeks(startDate,dsHolidays);
  dsmoving= movingAverage(dailyCases,calcRecur,true);

//  dsmoving= movingAverage(dailyCases,14,true);

  
  forTrend= linearRegressionDataSet(dsmoving,calcRecur);
  dspercent = movingAverage(percentDataSet(dsmoving),calcRecur,true);
  dspercent = percentDataSet(dsmoving,calcRecur,true);

// dspercent =  dsmoving;


  dspr=     builPRDataSet(dailyCases,  predictDays,onDay,calcRange);
  dsprmov=  builPRDataSet(dsmoving,    predictDays,onDay,calcRange);

  onDay=    findBestStart(dailyCases,onDay);
  
  predictDays=predictDays+(dailyCases.length-onDay);
//NEW 22/12/2020
//  predictDays=Math.round(parseInt(document.getElementById('calcRange').value)/2-1) ;
 
  dvHWS=    buildHWSDataSet(dailyCases,predictDays,onDay, parseInt(document.getElementById('calcRange').value));
  dvHWS =   replaceMinus(dvHWS);


  fc = Highcharts.chart('container', {

    title: {
        text: 'Covid cases: daily and forecast in '+countryName
    },
    chart: {
        zoomType: 'x',
        resetZoomButton: {
            position: {
                 align: 'left', 
                // verticalAlign: 'top', // by default
                x: 0,
                y: -30
            }
        }
    },


    credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                showCheckbox: false,
                selected: true,
                marker: {
                     enabled: false
                }
            },
            spline: {

                events: {
                    legendItemClick: function(event) {

                        this.checkbox.click();
                        return false;
                    }
                },
                showInLegend: true
            }
        },


    subtitle: {
        text: 'Source: ours estimation '
    },

    yAxis: {
        title: {
            text: 'Number of daily cases'
        }
    },

    
    xAxis: {
    categories: dstime,
    crosshair: {
    	enabled: true,
      width: 1, 
    }
  },

    series: [{
        name: 'Daily new cases',
        data: dailyCases,
        point: {
                
                events: {
                    click: function () {
                        var chart = this.series.chart;
                        var numPred=parseInt(document.getElementById('pred').value);        
                        fc.xAxis[0].update({
                categories: buildTimeDataSet(dailyCases,startDate,numPred+15)
            });

                var currentX=this.x+1;
                var clickX=  this.x+1;
                 
                if  (document.getElementById('autoSet').checked==true) {
                    currentX=findBestStart(dailyCases,currentX);
                    numPred=numPred+(this.x+1-currentX);
              //      if (numPred>parseInt(document.getElementById('calcRange').value/2)) {
              //          numPred= Math.round(parseInt(document.getElementById('calcRange').value)/2)-1;
              //      }
                } 
                
                dvHWS=buildHWSDataSet(dailyCases,numPred,currentX, parseInt(document.getElementById('calcRange').value));                        
                dvHWS = replaceMinus(dvHWS);
   
                fc.series[2].setData(dvHWS);                        

                document.getElementById('rmse').value=RMSE_NORM(dailyCases.slice(currentX,currentX+numPred),dvHWS.slice(currentX,currentX+ numPred));
                showDataTable(buildTimeDataSet(dailyCases,startDate,numPred),dailyCases,dvHWS,clickX,dsHolidays);

                    }
                }
            },
            
   
    },{
        name: '7 day moving average',
       color: 'green', 
       visible: false, 
       data: dsmoving
       
    },{

        name: 'hws',
       color: 'brown',
        label: {
        enabled: false
    }, 
       data: dvHWS
    },
    {
        name: 'extra holidays',
       color: 'red', 
       visible: false, 
       data: dsHolidaysWeeks
       
    }

],

 
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
});

  return fc;

}

