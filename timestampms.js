var express = require("express");

var app = express();

var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));

app.use(function(req, res) {
  if (req.query.length > 0) {
    var time = "";
    var result = {"unixtimestamp": null, "date": null};
    req.query.forEach(function(value){
      if (value) {
        time = value;
        if (isNaN(time)) {
          //proceed as if time string
          var date = new Date(time);
          if (date) {
            result.date = time;
            result.unixtimestamp = date.getTime();
          }
        }
        else {
          //proceed as if timestamp
          result.unixtimestamp = time;
          result.date = new Date(time).toDateString();
        }
        return false;
      }
    });
    res.send(JSON.stringify(result));
  }
});

app.listen(12345);