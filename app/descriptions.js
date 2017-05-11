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

const fs = require('fs');
const console = require('console');
const googleTranslate = require('./google_translate');
const jsonUtils = require('./json_utils');

/**
 * Generate translated description files
 * @namespace descriptions
 */

/** @module */
module.exports = {
    /**
     * Create translations of the descriptions file
     * @param {google_translate.Locale} source - default locale
     * @param {google_translate.Language[]} languages -
     * Array of {@link google_translate.Language} objects to
     * convert to
     */
    doTranslations: function(source, languages) {
        // load default description file
        const file =
            `${source.path}/${source.language.dir}/${source.filename}`;
        const desc = fs.readFileSync(file, {encoding: 'utf8'});
        if (desc) {
            // translate and write out each language
            for (let i = 0; i < languages.length; i++) {
                const target = jsonUtils.copy(source);
                target.language.iso_code = languages[i].iso_code;
                target.language.dir = languages[i].dir;
                _doTranslation(desc, source, target);
            }
        }
    },
};

/**
 * Translate and write out the new file
 * @param {{string}} description - the text to translate
 * @param {google_translate.Locale} source - source locale
 * @param {google_translate.Locale} target - target locale
 * @private
 * @memberOf descriptions
 */
function _doTranslation(description, source, target) {
    googleTranslate.translate([description], source.language, target.language)
        .then((results) => {
            console.log('Translated description file',
                source.language.iso_code, '=>', target.language.iso_code);
            _writeFile(target, results[0]);
        }).catch((error) => {
        console.error('ERROR:', error);
    });
}

/**
 * Save a file
 * @param {google_translate.Locale} locale - location to write to
 * @param {string} text - text to write
 * @private
 * @memberOf descriptions
 */
function _writeFile(locale, text) {
    const dir = `${locale.path}/${locale.language.dir}`;
    const file = `${dir}/${locale.filename}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(file, text, {encoding: 'utf8'});
}
