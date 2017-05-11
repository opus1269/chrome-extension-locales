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
 * Read and write JSON formatted files
 * @namespace json_file
 */

const console = require('console');
const JsonFile = require('jsonfile');

/** @module */
module.exports = {
    /**
     * Read a JSON file
     * @param {string} file - file to read
     * @return {?{}} JSON from file
     */
    read: function(file) {
        let json;
        try {
            json = JsonFile.readFileSync(file);
        } catch (ex) {
            console.error('ERROR:', ex);
        }
        return json;
    },

    /**
     * Write a JSON file
     * @param {string} file - file to write
     * @param {{}} json - JSON to write
     */
    write: function(file, json) {
        JsonFile.writeFileSync(file, json, {spaces: 2});
    },

    /**
     * Get a shallow copy of some json
     * @param {{}} json - JSON to copy
     * @return {{}} shallow copy
     */
    copy: function(json) {
        return JSON.parse(JSON.stringify(json));
    },

};
