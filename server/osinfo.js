'use strict';

const chalk = require("chalk");
const os = require("os")

function logInfo(projectName) {
    console.log(chalk.bgBlackBright(projectName))    
    console.log(chalk.cyanBright('Running on: '), os.platform(), os.arch())
    console.log(chalk.cyanBright('Home dir: '), os.homedir())
    console.log(chalk.cyanBright('Cores: '), os.cpus().length)
}


module.exports = {logInfo}
