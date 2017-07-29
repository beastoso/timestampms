'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];


app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    });

app.route('/:datestr').get(function(req, res, next) {
  if (req.url && req.url.length > 1) {
    var str = "";
    var timeStr = req.url.substring(1);
    var result = {"unix": null, "natural": null};
    var date = new Date(isNaN(timeStr) ? Date.parse(decodeURIComponent(timeStr)) : (Number(timeStr)*1000));
    if (date && !isNaN(date.getTime())) {
      result.natural = months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
      result.unix = Number(date.getTime()/1000).toFixed(0);
    }
    str += JSON.stringify(result);
    res.send(str);
  }
});


// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

