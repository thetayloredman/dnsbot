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

// Initialize client
let client = new discord.Client();

// Databases
let logging = new enmap({ name: 'logging' });
let ranks = new enmap({ name: 'ranks' });

// Caches and scripts
let preload = new enmap();
let events = new enmap();
let modules = new enmap();
let commands = new enmap();

// Import files
const config = require('config.json');
client.config = config;

// Import functions
const log = require('./log.js');

// Variables

// Pre-Load Scripts
fs.readdir('./preload/', (err, files) => {
    if (err) {
        log('e', `Failed to read directory ./preload/: ${err}`, true, true);
    }
    files.forEach((file) => {
        if (!file.endsWith('.js')) {return;}
        let name = file.split('.')[0];
        log('i', `Loading pre-load script ${name}`);
        preload.set(name, require(`./preload/${file}`));
    });
});

let scripts = [...preload.entries()];
scripts.forEach((script) => {
    log('i', `Running pre-load script ${script[0]}`);
    script[1].run();
});

// Load
fs.readdir('./events/', (err, files) => {
    if (err) {
        log('e', `Failed to read directory ./events/: ${err}`, true, true);
    }
    files.forEach((file) => {
        if (!file.endsWith('.js')) {return;}
        let name = file.split('.')[0];
        log('i', `Loading event ${name}`);
        events.set(name, require(`./events/${file}`));
    });
});
fs.readdir('./commands/', (err, files) => {
    if (err) {
        log('e', `Failed to read directory ./events/: ${err}`, true, true);
    }
    files.forEach((file) => {
        if (!file.endsWith('.js')) {return;}
        let name = file.split('.')[0];
        log('i', `Loading command ${name}`);
        commands.set(name, require(`./commands/${file}`));
    });
});
fs.readdir('./modules/', (err, files) => {
    if (err) {
        log('e', `Failed to read directory ./modules/: ${err}`, true, true);
    }
    files.forEach((file) => {
        if (!file.endsWith('.js')) {return;}
        let name = file.split('.')[0];
        log('i', `Loading module ${name}`);
        modules.set(name, require(`./modules/${file}`));
    });
});