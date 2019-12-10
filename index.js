'use strict';

const osinfo = require('./osinfo')
osinfo.logInfo("Star Base Server")

const Uptime = require('./uptime')
let timing = new Uptime()
timing.startUptime()


// Server

const express = require("express");

const PORT = 1234;
const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
 console.log(`Server is listening on port: ${PORT}`);
});


