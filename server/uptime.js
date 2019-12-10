'use strict';

module.exports = class Uptime {
    constructor() {
        this.serverStartTime;
    }

    startUptime() {
        this.serverStartTime = Date.now()
    }

    getTotalUptime() {
        let seconds = Math.floor((Date.now() - this.serverStartTime) / 1000)
        let hours = Math.floor(seconds / 3600)
        let minutes = Math.floor((seconds - hours * 3600) / 60)
        seconds = Math.floor(seconds - minutes * 60 - hours * 3600)
        return hours + " hours " + minutes + " minutes " + seconds + " seconds"
    }

    logStatus() {
        console.log("Current uptime: ", this.getTotalUptime())
    }
}