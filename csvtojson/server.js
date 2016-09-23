//set required packages
var fs = require("fs");
var http = require("http");
var url = require("url");

//create Server
var server = http.createServer(function (request, response) {

   //Get path name
   var pathname = url.parse(request.url).pathname;

   //For default file return index.html
   if(pathname == "/") {
       response.writeHead(200,{"Content-Type": "text/html"});
       html = fs.readFileSync("index.html", "utf8");
       response.write(html);
   }
   //For arrest  return arrestNoArrest.html
   else if(pathname == "/arrest") {
       response.writeHead(200,{"Content-Type": "text/html"});
       html = fs.readFileSync("arrestNoArrest.html", "utf8");
       response.write(html);
   }
   //For arrest  return theft.html
   else if(pathname == "/theft") {
       response.writeHead(200,{"Content-Type": "text/html"});
       html = fs.readFileSync("theft.html", "utf8");
       response.write(html);
   }
   //Return file
   else{
     try{
     script = fs.readFileSync("./"+pathname, "utf8");
     response.writeHead(200,{"Content-Type": "text/"+pathname.split('.')[1]});
     response.write(script);
   }
   //Error Handling
   catch(err){
     response.writeHead(404,{"Content-Type": "text/plain"});
     response.write("Error 404: File Not Found!");
     response.end();
     return;
   }
}

response.end();
});

server.listen(8080);
