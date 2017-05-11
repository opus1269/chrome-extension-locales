/*
 * Copyright (c) 2017, Michael A. Updike
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived from this
 * software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 * USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

/**
 * Generate translated messages.json files
 * @namespace messages
 */

const fs = require('fs');
const console = require('console');
const googleTranslate = require('./google_translate');
const jsonUtils = require('./json_utils');

/** @module */
module.exports = {
    /**
     * Create translations of the default messages.json
     * @param {google_translate.Locale} source - default locale
     * @param {google_translate.Language[]} languages -
     * Array of {@link google_translate.Language} objects to
     * convert to
     */
    doTranslations: function(source, languages) {
        // load default locales file
        const filename =
            `${source.path}/${source.language.dir}/${source.filename}`;
        const json = jsonUtils.read(filename);
        if (json) {
            // translate and write out each language
            for (let i = 0; i < languages.length; i++) {
                const target = jsonUtils.copy(source);
                target.language.iso_code = languages[i].iso_code;
                target.language.dir = languages[i].dir;
                _doTranslation(json, source, target);
            }
        }
     },
};

/**
 * Translate and write out the new file
 * @param {{}} json - the json to translate
 * @param {google_translate.Locale} source - source locale
 * @param {google_translate.Locale} target - target locale
 * @private
 * @memberOf messages
 */
function _doTranslation(json, source, target) {
    // shallow copy
    let outputJSON = jsonUtils.copy(json);

    // get strings to translate
    const messages = _getMessages(json);

    // call API
    googleTranslate.translate(messages, source.language, target.language)
        .then((results) => {
            console.log('Translated messages.json file',
                source.language.iso_code, '=>', target.language.iso_code);
            // update JSON with translated strings
            _setMessages(outputJSON, results);
            // add translation info.
            outputJSON.translationInfo = {};
            outputJSON.translationInfo.message = 'Google Translate API';
            outputJSON.translationInfo.description = 'Add your name and ' +
                'contact info, if you want';
            _writeFile(target, outputJSON);
        }).catch((error) => {
        console.error('ERROR:', error);
    });

}

/**
 * Get the value of the 'message' key from JSON
 * @param {{}} json - JSON to parse
 * @return {?string} message string, undefined if key not found
 * @private
 * @memberOf messages
 */
function _getMessage(json) {
    let message = undefined;
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            if (key === 'message') {
                message = json[key];
                break;
            }
        }
    }
    return message;
}

/**
 * Set the translated message
 * @param {{}} json - JSON to update
 * @param {string} message - translated message string
 * @return {boolean} true if set
 * @private
 * @memberOf messages
 */
function _setMessage(json, message) {
    let ret = false;
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            if (key === 'message') {
                json[key] = message;
                ret = true;
                break;
            }
        }
    }
    return ret;
}

/**
 * Get the all the 'message' key values from JSON
 * @param {{}} json - JSON to parse
 * @return {string[]} Array of message strings
 * @private
 * @memberOf messages
 */
function _getMessages(json) {
    let messages = [];
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            let message = _getMessage(json[key]);
            if (message) {
                messages.push(message);
            }
        }
    }
    return messages;
}

/**
 * Set the translated messages
 * @param {{}} json - JSON to set messages
 * @param {string[]} messages - translated messages
 * @private
 * @memberOf messages
 */
function _setMessages(json, messages) {
    let ct = 0;
    let length = messages.length;
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            if (_setMessage(json[key], messages[ct])) {
                ct++;
                if (ct === length) {
                    break;
                }
            }
        }
    }
}

/**
 * Save a JSON file
 * @param {google_translate.Locale} locale - location to write to
 * @param {{}} json - json to write
 * @private
 * @memberOf messages
 */
function _writeFile(locale, json) {
    const dir = `${locale.path}/${locale.language.dir}`;
    const file = `${dir}/${locale.filename}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    jsonUtils.write(file, json);
}

