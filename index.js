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
const database = require('@replit/database');
const chalk = require('chalk');
const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');
const http = require('http');
const https = require('https');
const dotenv = require('dotenv');

// Import functions
const log = require('./log.js');
const heartbeat = require('./heartbeat.js');

// ENV
dotenv.config({
    path: `${__dirname  }/.env`
});

// Validate ENV
if (!process.env.token) {
    log('e', 'Environment variables were invalid. You need to provide "token".', true, true);
}

// Initialize client
let client = new discord.Client();

// Web init
require('./web.js')(client);

// Databases
let logging = new database();
let permLevels = new database();

// Caches and scripts
client.modules = new enmap();
client.commands = new enmap();
client.commandConfig = new enmap();

// Import files
client.config = require('./config.json');

// Variables

// Error code function
function err (message, code) {
    let codes = new Map([
        [
            '001',
            {
                message: 'Internal Error',
                details: 'Something happened internally.',
                reportable: true
            }
        ],
        [
            '002',
            {
                message: 'No Permission',
                details: 'You don\'t have permission to do that!',
                reportable: true
            }
        ]
    ]);

    if (!message) {
        log('e', 'You didn\'t provide the <Message>!', true, true);
        return;
    }

    if (!codes.get(code)) {
        log('e', 'Unknown error code!', true);
        err(message, '001');
        return;
    }

    let codeData = codes.get(code);

    let out = `ERROR \`${code}\` "${codeData.message}"\n${codeData.details}`;

    if (codeData.reportable) {
        out += `\nIf you believe this was a mistake / bug, please contact <@${client.config.ownerId}> and provide this information:`;
        out += `\n\`\`\`\nERROR REPORT\nError Number: ${  code  }\nChannel Name / ID: ${  message.channel.name  } (${  message.channel.id  })\nMessage ID: ${  message.id  }\nMessage link: https://discordapp.com/channels/${  message.guild.id  }/${  message.channel.id  }/${  message.id  }\n\`\`\``;
    }

    message.reply(out);
}

// Heartbeat
setInterval(() => {
    heartbeat.run(client, log);
}, client.config.heartbeatSeconds * 1000);

// Load
fs.readdir(client.config.directories.commands, (err, files) => {
    if (err) {
        log('e', `Failed to read directory ${client.config.directories.commands}: ${err}`, true, true);
    }
    files.forEach((file) => {
        if (!file.endsWith('.js')) {
            return;
        }
        let name = file.split('.')[0];
        log('i', `Loading command ${name}`);
        client.commands.set(name, require(`${client.config.directories.commands}${file}`));
        client.commandConfig.set('commands', require(`${client.config.directories.commands}${file}`).config, name);
    });
});
fs.readdir(client.config.directories.modules, (err, files) => {
    if (err) {
        log('e', `Failed to read directory ${client.config.directories.modules}: ${err}`, true, true);
    }
    files.forEach((file) => {
        if (!file.endsWith('.js')) {
            return;
        }
        let name = file.split('.')[0];
        log('i', `Loading module ${name}`);
        client.modules.set(name, require(`${client.config.directories.modules}${file}`));
    });
});

// Ready event
client.on('ready', () => {
    log('i', `Client has logged in as ${client.user.tag} (${client.user.id}) with ${client.users.cache.size} users.`);

    client.user.setActivity('bootup', {
        type: 'WATCHING'
    });

    heartbeat.run(client, log);

    // Status refreshes
    let statusId = 0;
    setInterval(() => {
        if (!client.config.statusArray[statusId]) {
            statusId = 0;
        }
        let status = client.config.statusArray[statusId];
        let text = status[0];
        client.config.statusFilters.forEach((filter) => {
            text = eval(`text.replace(/${filter[0]}/g, ${eval(filter[1])})`);
        });
        let readable = status[1].toUpperCase() === 'PLAYING' ? 'Playing' : status[1].toUpperCase() === 'WATCHING' ? 'Watching' : status[1].toUpperCase() === 'LISTENING' ? 'Listening to' : 'Watching';
        log('i', `Setting status to "${  chalk.white(readable)  } ${  chalk.white.bold(text)  }"`);
        client.user.setActivity(text, {
            type: status[1]
        });
        statusId++;
    }, client.config.statusSeconds * 1000);
});

// Message event
client.on('message', (message) => {
    if (message.author.bot || message.channel.type === 'dm') {
        return;
    }
    log('i', `Message in guild "${message.guild.name}" (${message.guild.id}) channel "${message.channel.name}" (${message.channel.id}): "${message.content}" (${message.id})`);
    let modulesTemp = [...client.modules.entries()];
    modulesTemp.forEach((moduleEntry) => {
        log('i', `Running module ${moduleEntry[0]} for message ${message.id}`);
        moduleEntry[1].run(client, message, log);
    });

    // Command exit
    if (!message.content.startsWith(client.config.prefix)) {
        return;
    }
    let args = message.content.slice(client.config.prefix.length).split(/ +/g);
    let command = args.shift();
    if (!client.commands.get(command)) {
        message.reply('Unknown command!');
        return log('i', `User ${message.author.tag} tried to run an unknown command: "${command}".`);
    }
    log('i', `Running command ${command} for user ${message.author.tag}`);
    let config = client.commandConfig.get('commands', command);
    if (!config.enabled) {
        log('i', `${message.author.tag} tried to use a disabled command.`);
        return message.reply('That command is **disabled**!');
    }
    let commandrun = client.commands.get(command);
    commandrun.run(client, message, args, log, err);
});

// Other logging events
client.on('guildMemberAdd', (member) => {
    log('i', `A new member joined! Name: "${member.user.tag}" ID: ${member.user.id}`);
});

// Log in
client.login(process.env.token);