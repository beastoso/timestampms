var express = require("express");
var path = require("path");

var app = express();

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

app.use(function(req, res, next) {
  if (req.url && req.url.length > 1) {
    var time = req.url.substring(1);
    var result = {"unix": null, "natural": null};
    var date = new Date(time);
    if (date) {
      result.natural = months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
      result.unix = date.getTime();
    }
    res.send(JSON.stringify(result));
  }
  else if (next) {
    next();
  }
});

app.use(express.static(path.join(path.join(__dirname,"views"), "index.html")));

app.listen(80);