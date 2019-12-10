'use strict';

const osinfo = require('./osinfo')
osinfo.logInfo("Star Base Server")

const Uptime = require('./uptime')
let timing = new Uptime()
timing.startUptime()
setTimeout(() => { timing.logStatus() }, 2000);


