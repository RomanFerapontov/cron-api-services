const http = require('node:http');
const { host, port } = require('../config');

const { Worker } = require('worker_threads');

let cache = { message: 'No recieved data from etherscan, try again in minute'};

const serverStart = () => {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url === '/most-changed-balance') {

        const worker = new Worker(`${__dirname}/utils/worker.js`);

        worker.on('message', (result) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          if (!result.maxChangeAddress) res.end(JSON.stringify(cache))
          else {
            cache = result;
            res.end(JSON.stringify(result));
          }
        });

        worker.on('error', (error) => {
          console.error(error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Server error');
        });

        worker.on('exit', async (code) => {
          if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            setTimeout(serverStart, 10000)
            res.end('Server restarted in 10 sec');
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    } catch (error) {
      console.error(error);
    }
  });

  server.listen(port, () => {
    console.log(`Server started on ${host}:${port}`);
  });
};

module.exports = serverStart;
