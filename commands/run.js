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
    // comment below to enable beta command!
    // return message.reply('You stumbled upon a wild **disabled command**! Try again later, or report this to `@BadBoyHaloCat#1826`.');

    function validateLang (lang) {
        let langs = {
            awk: ['awk'],
            bash: ['bash'],
            c: ['c'],
            cpp: [
                'cpp',
                'c++'
            ],
            csharp: [
                'csharp',
                'cs',
                'c#'
            ],
            elixir: ['elixir'],
            emacs: ['emacs'],
            go: ['go'],
            java: [
                'java',
                'jar'
            ],
            julia: ['julia'],
            kotlin: ['kotlin'],
            nasm: ['nasm'],
            node: [
                'js',
                'javascript',
                'nodejs'
            ],
            perl: ['perl'],
            php: ['php'],
            python2: [
                'python2',
                'py2'
            ],
            python3: [
                'python3',
                'py3',
                'py'
            ],
            ruby: ['ruby'],
            rust: ['rust'],
            swift: ['swift'],
            typescript: [
                'ts',
                'typescript'
            ]
        };
        let values = Object.values(langs);
        let keys = Object.keys(langs);
        let found;
        values.forEach((value, index) => {
            if (found) {return;}
            if (value.includes(lang)) {
                found = index;
            }
        });

        if (!found) {
            return;
        }

        return keys[found]; // Poof
    }

    let langName = validateLang(args[0].split('\n')[0]);

    if (!langName) {
        return message.reply('Unknown language! (Or unsupported)');
    }

    let code = message.content.split('\n');
    code.shift();
    code.shift();
    code.pop();
    code = code.join('\n');

    https.request({ host: 'emkc.org', path: '/api/v1/piston/execute', method: 'POST' }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            if (!data.ran) {
                message.reply('Internal error.');
            } else {
                message.reply(`Ran using ${data.language} version ${data.version}. Output:\n\`\`\`\n${data.output}\n\`\`\``);
            }
        });
    }).end(JSON.stringify({
        language: langName,
        source: code,
        args: []
    }));
};

// Config
exports.config = {
    description: 'Execute code.'
};