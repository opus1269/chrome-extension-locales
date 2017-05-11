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

const translate = require('@google-cloud/translate');
const process = require('process');
const console = require('console');

/**
 * Generate translations with the Google Translate API
 * @see  https://cloud.google.com/translate/docs/
 * @namespace google_translate
 */

/**
 * Language type
 * @typedef {{}} google_translate.Language
 * @property {string} dir - directory name that Chrome API needs
 * @property {string} iso_code - ISO-639-1 code of language
 */

/**
 * Specify a location and language for a file
 * @typedef {{}} google_translate.Locale
 * @property {string} path - base directory
 * @property {string} filename - chrome extension locale filename
 * @property {google_translate.Language} language - ISO-639-1
 * @memberOf google_translate
 */

/**
 * Google Translate options
 * @typedef {{}} Options
 * @property {string} from - source language
 * @property {string} to - target language
 * @property {string} format - text or html
 * @property {string} model - translation model 
 * @memberOf google_translate
 */

/** @module */
module.exports = {

    /**
     * Get the Google Translate Scope
     * @return {string}
     */
    getScope: function() {
        return _SCOPE;
    },

    /**
     * Initialize the Google Translate API
     * @param {object} authClient - Google auth client
     * @param {string} projectId - Google Cloud project ID
     */
    initialize: function(authClient, projectId) {
        // Instantiate a Google translate client
        _translateClient = translate({
            auth: authClient,
            projectId: projectId,
        });
    },

    /**
     * Translate an array of strings
     * @param {string[]} input - Array of strings to translate
     * @param {google_translate.Language} from - source language
     * @param {google_translate.Language} to - target language
     * @return {Promise<string[]>} Array of translated strings
     */
    translate: function(input, from, to) {
        if(!_translateClient) {
            console.error('Google Translate API not initialized');
            process.exit(1);
        }

        const options = {
            from: from.iso_code,
            to: to.iso_code,
        };

        // Break up messages into chunks of size _MAX_STRINGS
        // and call API multiple times if needed
        const count = Math.ceil(input.length / _MAX_STRINGS);
        const msgArray = [];
        const promises = [];
        for (let i = 0; i < count; i++) {
            const begin = i * _MAX_STRINGS;
            const end = begin + _MAX_STRINGS;
            msgArray.push(input.slice(begin, end));
            promises.push(_doTranslation(msgArray[i], options));
        }

        // Translate the chunks and collate
        return Promise.all(promises).then((values) => {
            let translations = [];
            values.forEach((value) => {
                translations = translations.concat(value);
            });
            return Promise.resolve(translations);
        }).catch((error) => {
            console.error('ERROR:', error);
        });
    },
};

/**
 * Scope for this API
 * @type {string}
 * @const
 * @default
 * @private
 * @memberOf google_translate
 */
const _SCOPE = 'https://translation.googleapis.com/language/translate/v2';

/**
 * The Google Translation API has a limit of 128 translations in a single
 * request and throws 'Too many text segments' Error
 * @const
 * @default
 * @type {number}
 * @private
 * @memberOf google_translate
 */
const _MAX_STRINGS = 128;

/**
 * A Google Translation client
 * @type {object}
 * @private
 * @memberOf google_translate
 */
let _translateClient;

/**
 * Call API to do the translation
 * @param {string[]} strings - Array of strings to translate
 * @param {Options} options - translate options
 * @return {Promise.<string[]>} Translated strings
 * @private
 * @memberOf google_translate
 */
function _doTranslation(strings, options) {
    return _translateClient.translate(strings, options)
        .then((results) => {
            let trans = results[0];
            trans = Array.isArray(trans) ? trans : [trans];
            return Promise.resolve(trans);
        });
}


