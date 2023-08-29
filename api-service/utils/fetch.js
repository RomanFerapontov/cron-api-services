'use strict';

const https = require('node:https');
const http = require('node:http');

module.exports = {
  fetch: (url) =>
    new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      protocol.get(url, (res) => {
        let buffer = '';
        res.on('data', (chunk) => (buffer += chunk));
        res.on('end', () => resolve(JSON.parse(buffer)));
      });
    }),
};
