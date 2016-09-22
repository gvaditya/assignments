var fs = require('fs');
var readline = require('readline');
var finalTheft = {"UNDER":new Array(16).fill(0),"OVER":new Array(16).fill(0)};
var finalAssault = {"arrest":new Array(16).fill(0),"noArrest":new Array(16).fill(0)};
var rl = readline.createInterface({input:fs.createReadStream('Crimes_-_2001_to_present.csv')});
var isTrue = true;
const yr = 2001;
rl.on('line',(line)=>{
  if(isTrue)
  {
    isTrue=false;
  }
  else {
    var dataLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});
    dataLine = dataLine.split(',');
    if(dataLine[5]=='THEFT')
    {
        if(dataLine[6]=='OVER $500')
        {
              finalTheft["OVER"][parseInt(dataLine[17])%2001]++;
        }
        else if(dataLine[6]=='$500 AND UNDER')
        {
              finalTheft["UNDER"][parseInt(dataLine[17])%2001]++;

        }
    }
    else if(dataLine[5]=='ASSAULT')
    {
      if(dataLine[8]=='true')
      {
        finalAssault["arrest"][parseInt(dataLine[17])%2001]++;
      }
      else if(dataLine[8]=='false')
      {
        finalAssault["noArrest"][parseInt(dataLine[17])%2001]++;
      }
    }
  }

});
rl.on('close',()=>{
  var theft =[];
  var assault =[];
  for(var i=0; i<16;i++)
  {
    var year = (yr+i);
    var th = {};
    th[year]={'under':0,'over':0};
    var as = {};
    as[year]={'arrest':0,'noArrest':0};
    th[year].under = finalTheft.UNDER[i];
    th[year].over = finalTheft.OVER[i];
    as[year].arrest = finalAssault.arrest[i];
    as[year].noArrest = finalAssault.noArrest[i];
    theft[theft.length]=th;
    assault[assault.length] = as;
  }
  fs.writeFileSync('finalTheft.json',JSON.stringify(theft));
  fs.writeFileSync('finalAssault.json',JSON.stringify(assault));
});
