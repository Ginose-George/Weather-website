const express = require("express");
const https = require("https");
const bodyParser = require("body-parser")


const app = express();
app.use(bodyParser.urlencoded({extended : true}));

// When request comes from the client
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

//Manipulating recived data which is recived by client
app.post("/",function(req,res){

  const query = req.body.cityName;
  const appid = "53bdca6384ac510f9f84b88ee7de9c99";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+appid+"&units=metric";

  //communicate with external Server
  https.get(url,function(response){
    console.log(response.statusCode);

    //Tap into the weatherdata
    response.on("data",function(data){

      //converting plain text to JSON
      const weatherdata = JSON.parse(data);

      //Manipulating recived JSON data
      var temp = weatherdata.main.temp
      const description = weatherdata.weather[0].description;
      const icon = weatherdata.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

      //Sending response to client
      res.write("<p>The weather is currently "+description+".</p>");
      res.write("<h1>The temperature in "+query+" is "+temp+" celcius</h1>");
      res.write("<img src=" + imageURL + ">");
      res.send();

    });


  });

  console.log("post request recived");
});














app.listen(3000,function(){
  console.log("Server is running on port 3000");
});
