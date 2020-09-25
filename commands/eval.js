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

/**
 * This eval command was made by WilsontheWolf
 * (github: WilsontheWolf)
 * and then was adapted to fit this bot.
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
module.exports.run = async (client, message, args, log, err) => {
    if (message.author.id !== client.config.ownerId) {
        log('w', `${message.author.tag} tried to use eval!`);
        return err(message, '002');
    }
    const embed = new discord.MessageEmbed()
        .setFooter(`Eval command executed by ${message.author.username}`)
        .setTimestamp();
    let code = args.join(' ');
    let msg;
    let response;
    let e = false;
    try {
        if (code.includes('await') && !message.content.includes('\n'))
        {code = `( async () => {return ${  code  }})()`;}
        else if (code.includes('await') && message.content.includes('\n'))
        {code = `( async () => {${  code  }})()`;};
        response = await eval(code);
        if (typeof response !== 'string') {
            response = require('util').inspect(response, { depth: 3 });
        }
    } catch (err) {
        e = true;
        response = err.toString();
        const Linter = require('eslint').Linter;
        let linter = new Linter();
        let lint = linter.verify(code, { 'env': { 'commonjs': true, 'es2021': true, 'node': true }, 'extends': 'eslint:recommended', 'parserOptions': { 'ecmaVersion': 12 } });
        let error = lint.find(e => e.fatal);
        if (error) {
            let line = code.split('\n')[error.line - 1];
            let match = line.slice(error.column - 1).match(/\w+/i);
            let length = match ? match[0].length : 1;
            response = `${line}
${' '.repeat(error.column - 1)}${'^'.repeat(length)}
[${error.line}:${error.column}] ${error.message} `;
        }
    }
    const length = `\`\`\`${response}\`\`\``.length;
    embed
        .setTitle(e ? '**Error**' : '**Success**')
        .setColor(e ? 'RED' : 'GREEN')
        .setDescription(`\`\`\`${response.substr(0, 2042)}\`\`\``);
    if (length >= 2049) {
        log('i', `An eval command executed by ${message.author.username}'s response was too long (${length}/2048) the response was:
${response}`);
        embed.addField('Note:', `The response was too long with a length of \`${length}/2048\` characters. it was logged to the console. `);
    }

    message.channel.send(embed);
};

// Config
exports.config = {
    description: 'Evalulate code!\nRequires OWNER.',
    enabled: true
};