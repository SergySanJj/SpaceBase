'use strict';

// const osinfo = require('./osinfo')
// osinfo.logInfo("Star Base Server")

// const Uptime = require('./uptime')
// let timing = new Uptime()
// timing.startUptime()


// Server


const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});





