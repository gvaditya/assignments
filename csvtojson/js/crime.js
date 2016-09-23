function checkIf(array,property,value)//function to check array contains an object with an attribute that equals a given value
{
  for(var i = 0; i < array.length; i++) {
    if (array[i][property] == value) {
      return i;
    }
  }
  return -1;
}
var fs = require('fs');
var readline = require('readline');
var finalTheft = {"UNDER":new Array(16).fill(0),"OVER":new Array(16).fill(0)};
var finalAssault = {};//"arrest":new Array(16).fill(0),"noArrest":new Array(16).fill(0)
var arrest = [];
var noArrest = [];
//data which is to be aggregated to make a graph is given to readline by mamking an interface
var rl = readline.createInterface({input:fs.createReadStream('../data/Crimes_-_2001_to_present.csv')});
var isTrue = true;//for the header to be identified for the first time
const yr = 2001;
var header=[];//list of headers to be saved in this array and the scope is kept out of rl.on('line') to maintain the data
rl.on('line',(line)=>{
  if(isTrue)
  {
    header = line.split(',');//array of names of the columns present in the data
    isTrue=false;//to distingiush the data from header we change isTrue to false
  }
  else {
    //replace the commas in data elements with empty string so that it won't be problem while we split ther csv
    var dataLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});
    dataLine = dataLine.split(',');//now split the data, since there is no comma in any data element
    if(dataLine[header.indexOf('Primary Type')]=='THEFT')//check is the case is a theft
    {
      if(dataLine[header.indexOf('Description')]=='OVER $500')
      {
        //incrementing the count of theft whose value is over $500
        finalTheft["OVER"][parseInt(dataLine[header.indexOf('Year')])%2001]++;
      }
      else if(dataLine[header.indexOf('Description')]=='$500 AND UNDER')
      {
        //incrementing the count of theft whose value is under $500
        finalTheft["UNDER"][parseInt(dataLine[header.indexOf('Year')])%2001]++;
      }
    }
    else if(dataLine[header.indexOf('Primary Type')]=='ASSAULT')//check is the case is assault
    {
      if(dataLine[header.indexOf('Arrest')]=='true')
      {
        var year = parseInt(dataLine[header.indexOf('Year')]);
        var index = checkIf(arrest,'year',year);
        if(index>=0)
        arrest[index]['value']++;
        else {
          arrest[arrest.length]={'year':year,'value':1};
        }
      }
      else if(dataLine[header.indexOf('Arrest')]=='false')
      {
        var year = parseInt(dataLine[header.indexOf('Year')]);
        var index = checkIf(noArrest,'year',year);
        if(index>=0)
        noArrest[index]['value']++;
        else {
          noArrest[noArrest.length]={'year':year,'value':1};
        }
      }
    }
  }

});
rl.on('close',()=>{
  var theft =[];
  for(var i=0; i<16;i++)
  {
    var year = (yr+i);
    var th = {};
    th[year]={'under':0,'over':0};
    th[year].under = finalTheft.UNDER[i];
    th[year].over = finalTheft.OVER[i];
    theft[theft.length]=th;
  }
  finalAssault={'arrest':arrest,'noArrest':noArrest};
  fs.writeFileSync('../json/finalTheft.json',JSON.stringify(theft));
  fs.writeFileSync('../json/finalAssault.json',JSON.stringify(finalAssault));
});
