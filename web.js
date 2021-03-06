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

// Middleware and such
const cp = require('cookie-parser');
const ejs = require('ejs');
// Import functions
const log = require('./log.js');
module.exports = (client) => {

    // Db thing
    const tokens = new database();

    // Functions
    function checkAuthCookies (cookies) {
        let needed = [
            'Authorization',
            'DiscordID'
        ];
        let ok = true;
        needed.forEach((cookie) => {
            if (!ok) {return;}
            if (!cookies[cookie]) {ok = false;}
        });
        return ok; // Return the value.
    }
    function checkValidCookies (cookies) {
    // Ensure there is a cookies db key
        tokens.list().then((keys) => {
            if (!keys.includes('tokens')) {
                tokens.set('tokens', []);
            }
        });

        // Now we can check it
        if (!tokens.get('tokens').includes(cookies.Authorization)) {
            return false;
        }
        return true; // Must be OK
    }

    // Serve file
    function get (path) {
        let content = fs.readFile(path, 'utf-8', (err, contents) => {
            if (err) {
                return;
            }
            return contents;
        });
        if (!content) {
            return;
        }
        return ejs.render(content, {
        /**
         * EJS vars
         */
            members: client.users.cache.size
        });
    }


    const app = new express();

    // Middleware
    app.use(cp());

    // Listen
    app.listen('8080', () => {
        log('i', 'WEB: Listening at port 8080!');
    });

    // Pre-Auth pages
    app.get('/ping', (req, res) => { // Ping server
        res.end('OK');
        log('i', 'Got ping!');
    });
};