# Chrome Extension Locales

Generate messages.json and description i18n files for a Chrome Extension using the Google Translate API

Prerequisites:

[Node.js](https://nodejs.org/en/)

[Google Cloud SDK](https://cloud.google.com/sdk/)

<br />

Usage:

[Create a Google Cloud project, enable the Translate API, and create a Service Account](https://cloud.google.com/translate/docs/getting-started)

Set the GOOGLE_APPLICATION_CREDENTIALS environment variable pointing to your [Service Account](https://cloud.google.com/translate/docs/common/auth#service-accounts) json file

Customize the [input.json](input.json) file

run:

    npm install --save

run:

    node app/main input.json

<br /><br /><br />

[![bitHound Overall Score](https://www.bithound.io/github/opus1269/chrome-extension-locales/badges/score.svg)](https://www.bithound.io/github/opus1269/chrome-extension-locales)
[![bitHound Code](https://www.bithound.io/github/opus1269/chrome-extension-locales/badges/code.svg)](https://www.bithound.io/github/opus1269/chrome-extension-locales)
