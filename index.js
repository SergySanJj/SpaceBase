'use strict';

// const osinfo = require('./osinfo')
// osinfo.logInfo("Star Base Server")

// const Uptime = require('./uptime')
// let timing = new Uptime()
// timing.startUptime()


// Server


const express = require('express');
const app = express();
const PORT = process.env.PORT || 1337;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(PORT, function () {
  console.log(`Running on ${PORT}`);
});





