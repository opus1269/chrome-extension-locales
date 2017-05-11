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

const google = require('googleapis');
const googleTranslate = require('./google_translate');
const jsonFile = require('./json_utils');
const messages = require('./messages');
const descriptions = require('./descriptions');
const process = require('process');
const console = require('console');

/**
 * Input JSON Object
 * @typedef {{}} InputJSON
 * @property {google_translate.Locale} messages - default locale
 * @property {google_translate.Locale} description - default description
 * @property {google_translate.Language[]} languages -
 * Array of {@link google_translate.Language} objects to convert to
 */

// Get an authClient and projectId from the GOOGLE_APPLICATION_CREDENTIALS
// environment variables.
google.auth.getApplicationDefault(function(err, authClient, projectId) {
    if (err) {
        console.error(`ERROR: ${err}`);
        process.exit(1);
    }

    /**
     * Input JSON object
     * @type {InputJSON}
     */
    let input;

    // Process command line arguments
    const args = process.argv;
    if (args.length < 3) {
        console.error('Usage: node app/main input.json');
        process.exit(1);
    } else {
        // load input JSON
        input = jsonFile.read(args[2]);
        if (!input) {
            console.error(`\n\nERROR: Failed to load ${args[2]}`);
            process.exit(1);
        }
    }

    if (!projectId) {
        console.error('ERROR: projectId not specified.\n' +
        'Set GOOGLE_APPLICATION_CREDENTIALS environment variable');
        process.exit(1);
    }

    // The createScopedRequired method returns true when running on GAE or a
    // local developer machine. In that case, the desired scopes must be
    // passed in manually. When the code is running in GCE or a Managed VM,
    // the scopes are pulled from the GCE metadata server.
    // See https://cloud.google.com/compute/docs/authentication for more
    // information.
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        // Scopes can be specified either as an array or as a single,
        // space-delimited string.
        authClient = authClient.createScoped([
            googleTranslate.getScope(),
        ]);
    }

    // Initialize the Google Translate API
    googleTranslate.initialize(authClient, projectId);

    // translate the default message.json to all the target languages
    messages.doTranslations(input.messages, input.languages);

    // translate the default description file to all the target languages
    descriptions.doTranslations(input.description, input.languages);
});

