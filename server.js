'use strict';
const osinfo = require('./serverscripts/osinfo');
osinfo.logInfo("Star Base Server");

const Uptime = require('./serverscripts/uptime');
let timing = new Uptime();
timing.startUptime();


const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// app.use(express.static(__dirname));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
});

app.listen(port);
console.log(`Server started on ${port}`);