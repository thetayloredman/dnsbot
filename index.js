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
client.config = require('./config.json');

// Import functions
const log = require('./log.js');

// Variables

// Load
fs.readdir(client.config.directories.commands, (err, files) => {
    if (err) {
        log('e', `Failed to read directory ${client.config.directories.commands}: ${err}`, true, true);
    }
    files.forEach((file) => {
        if (!file.endsWith('.js')) {return;}
        let name = file.split('.')[0];
        log('i', `Loading command ${name}`);
        commands.set(name, require(`${client.config.directories.commands}${file}`));
    });
});
fs.readdir(client.config.directories.modules, (err, files) => {
    if (err) {
        log('e', `Failed to read directory ${client.config.directories.modules}: ${err}`, true, true);
    }
    files.forEach((file) => {
        if (!file.endsWith('.js')) {return;}
        let name = file.split('.')[0];
        log('i', `Loading module ${name}`);
        modules.set(name, require(`${client.config.directories.modules}${file}`));
    });
});

// Ready event
client.on('ready', () => {
    log('i', `Client has logged in as ${client.user.tag} (${client.user.id}) with ${client.users.cache.count} users.`);
});

// Message event
client.on('message', (message) => {
    log('i', `Message in guild "${message.guild.name}" (${message.guild.id}) channel "${message.channel.name}" (${message.channel.id}): "${message.content}" (${message.id})`);
    let modulesTemp = [...modules.entries()];
    modulesTemp.forEach((moduleEntry) => {
        log('i', `Running module ${moduleEntry[1]} for message ${message.id}`);
        moduleEntry[2].run();
    });

    // Command exit
    if (!message.content.startsWith(client.config.prefix)) {return;}
    let args = message.content.slice(client.config.prefix.length).split(/ +/g);
    let command = args.shift();
    if (!commands.get(command)) {
        message.reply('Unknown command!');
        return log('i', `User ${message.author.tag} tried to run an unknown command: "${command}".`);
    }
    log('i', `Running command${command} for user ${message.author.tag}`);
    let commandrun = commands.get(command);
    commandrun.run(client, message, args);
});

// Other logging events
client.on('guildMemberAdd', (member) => {
    log('i', `A new member joined! Name: "${member.user.tag}" ID: ${member.user.id}`);
});
client.on('guildCreate', (guild) => {
    if (guild.id === client.config.guild.id) {return;}
    log('w', `I was added to an UNAUTHORIZED GUILD: ${guild.name} (${guild.id}): LAUNCHING ANTI-STEAL MODULE!`);
    require('./antisteal.js').run();
});

// Log in
client.login(client.config.token);