const http = require('http');
const https = require('https');

let config = {
  serverUrl: process.env.TEST_SERVER_URL || '',
  tokenId: process.env.LOG_TOKEN_ID || '',
  tokenType: process.env.LOG_TOKEN_TYPE || 'Bearer'
};

function configure(options) {
  config = { ...config, ...options };
}

function Log(stack, level, pkg, message) {
  return new Promise((resolve, reject) => {
    const urlStr = config.serverUrl;
    if (!urlStr) {
      console.log(`[Local Log] stack=${stack} level=${level} package=${pkg} message=${message}`);
      return resolve();
    }

    try {
      const url = new URL(urlStr);
      const isHttps = url.protocol === 'https:';
      const requestLib = isHttps ? https : http;

      const payload = JSON.stringify({
        stack,
        level,
        package: pkg,
        message: message ? message.toString().substring(0, 48) : ''
      });

      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      };

      if (config.tokenId) {
        headers['Authorization'] = `${config.tokenType} ${config.tokenId}`.trim();
      }

      const req = requestLib.request(
        urlStr,
        {
          method: 'POST',
          headers
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve();
            } else {
              reject(new Error(`Server responded with status ${res.statusCode}: ${data}`));
            }
          });
        }
      );

      req.on('error', (err) => {
        reject(err);
      });

      req.write(payload);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { Log, configure };
