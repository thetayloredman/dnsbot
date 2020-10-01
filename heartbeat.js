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
exports.run = async (client, log) => {
    log('i', 'Running heartbeat!');

    // Ensure no unauthorized guilds
    client.guilds.cache.forEach((guild) => {
        if (guild.id !== client.config.guild) {
            log('w', `Leaving guild ${  guild.name  } (${  guild.id  })...`);
            guild.leave();
        }
    });

    client.guilds.cache.get(client.config.guild).members.cache.forEach((member) => {
        if (member.roles.cache.has(client.config.staffRole)) {
            let hasRole = false;
            client.config.staffRoles.forEach((role) => {
                if (hasRole) {
                    return;
                }
                if (member.roles.cache.has(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                log('i', `Took role @Staff from ${  member.user.tag}`);
                member.roles.remove(client.config.staffRole, 'AutoStaffRole Removal');
            }
        } else {
            let hasRole = false;
            client.config.staffRoles.forEach((role) => {
                if (hasRole) {
                    return;
                }
                if (member.roles.cache.has(role)) {
                    hasRole = true;
                }
            });
            if (hasRole) {
                log('i', `Added role @Staff for ${  member.user.tag}`);
                member.roles.add(client.config.staffRole, 'AutoStaffRole Addition');
            }
        }
    });

    client.guilds.cache.get(client.config.guild).members.fetch().then(() => {
        // ESLint hates the regex, let's bypass that
        // eslint-disable-next-line no-control-regex
        client.guilds.cache.get(client.config.guild).members.cache.filter(member => { return /[^\x00-\x7F]+/g.test(member.nickname);}).forEach(member => {
            if (member.roles.cache.has(client.config.staffRole)) {return;}
            log('i', `Fixing unicode nickname for ${member.user.tag}`);
            member.setNickname(`[Moderated Nickname] No. ${  Math.floor(Math.random * 9999)  } (AUTO)`, 'AutoNoUnicode').catch(e => log('w', `Failed for ${member.user.tag}`));
        });
    });
};