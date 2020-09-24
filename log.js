/**
 * Deep Network Security Discord Bot - By BadBoyHaloCat
 * Copyright (C) 2020  Logan Devine
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * If your software can interact with users remotely through a computer
 * network, you should also make sure that it provides a way for users to
 * get its source.  For example, if your program is a web application, its
 * interface could display a "Source" link that leads users to an archive
 * of the code.  There are many ways you could offer source, and different
 * solutions will be better for different programs; see section 13 for the
 * specific requirements.
 * 
 * You should also get your employer (if you work as a programmer) or school,
 * if any, to sign a "copyright disclaimer" for the program, if necessary.
 * For more information on this, and how to apply and follow the GNU AGPL, see
 * <https://www.gnu.org/licenses/>.
 * 
 * See LICENCE for more information.
 */

// Modules
const discord = require('discord.js');
const enmap = require('enmap');
const chalk = require('chalk');
const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');
const http = require('http');
const https = require('https');

// Timestamp
function getTimestamp () {
    let d = new Date(Date.now());
    let output = `${d.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}/${d.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}/${d.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} ${d.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${d.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${d.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
    return output;
}

// Main function
function log (type, message, stack = false, critical = false) {
    switch (type) {
        case 'i':
            console.log(`${chalk.blue.bold(`[INFO ${getTimestamp()  }]`)} ${chalk.blue(message)}`);
            break;
        case 'w':
            console.log(`${chalk.yellow.bold(`[WARN ${getTimestamp()  }]`)} ${chalk.yellow(message)}`);
            break;
        case 'e':
            console.log(`${chalk.red.bold(`[ERR ${getTimestamp()  }]`)} ${chalk.red(message)}`);
            break;
        default:
            log('i', message); // Recursively call self and log with info
            break;
    }
    if (type === 'e') {
        // Err specifics
        if (stack) {
            let stack = new Error().stack.split('\n');
            stack.shift();
            stack.forEach((item) => {
                console.log(`${chalk.red.bold(`[ERR ${getTimestamp()  }]`)} ${chalk.gray(item)}`);
            });
        }
        if (critical) {
            console.log(`${chalk.red.bold(`[ERR ${getTimestamp()  }]`)} ${chalk.red.bold('Process exiting due to error set as critical. There is likely additional logging output above.')}`);
            process.exit(1);
        }
    }
}

// Export
module.exports = log;