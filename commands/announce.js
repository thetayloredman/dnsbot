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

// Main runner
exports.run = (client, message, args, log) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply('No permission!');
    }

    // Parse flags
    let title = args.join(' ').split('-title ').slice(1);
    let ot = title;
    title = title.join(' ').split('-description ')[0]
    let description = ot.join(' ').split('-description ')[1]
    title.trim();
    description.trim();

    let ping;

    // Ping flag
    if (description.includes(' -ping')) {
        ping = true;
        description = description.replace(/ -ping/g, '');
    }

    // Embed builder
    let embed = new discord.MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor('YELLOW')
        .setAuthor('Announcement from ' + message.author.tag)
        .setFooter('Deep Network Security')
        .setTimestamp();

    if (ping) {
        client.channels.cache.get(client.config.announceChannel).send('<@' + client.config.announceRole + '>')
    }
    client.channels.cache.get(client.config.announceChannel).send(embed);

    message.reply('Done!');
};

// Config
exports.config = {
    description: 'Make an announcement!'
};