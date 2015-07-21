"use strict";
/** path to ./index.js
 * @global */
global.BASEPATH = __dirname + '/';

// Require needed core Node.js modules
var http = require('http');
var https = require('https');
var fs = require('fs');

// Require Maxim logger, Router module, routes, and initalize routes in the Router
let maxim = require('./modules/maxim');
var routed = require('./modules/routed');
var router = new routed.Router();

maxim.logLevel = 'all';
router.initRouteDirectory('./routes');

// Configure https keys
var httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
  requestCert: false,
  rejectUnauthorized: false
};

// Create our servers
maxim.info('Creating HTTP(S) servers');
var httpServer = http.createServer();
var httpsServer = https.createServer(httpsOptions);

/**
 * Handles all errors thrown by the servers.
 * @function handleSeverError
 * @param {Object} err - The error that was thrown.
 */
function handleSeverError(err) {
  if (err.code === 'EADDRINUSE') {
    maxim.error('Address in use, retrying...');
    setTimeout(function() {
      httpServer.close();
      httpServer.listen(4443);
      httpsServer.close();
      httpsServer.listen(4444);
    }, 1000);
  }
}

/**
 * Handles all client requests.
 * @function handleClientRequest
 * @param {http.IncomingMessage} req - Object containing request information recieve by server.
 * @param {http.ServerResponse} res - Object containing the information we will response to the request with
 */
function handleClientRequest(req, res) {
  // Just let me know what's going on.
  maxim.info(req.method + " " + req.url);
  let exchange = new routed.Exchange(req, res);
  exchange.addHeader('Access-Control-Allow-Origin:', '*');
  let route = router.findRoute(exchange.requestInfo.method, exchange.requestInfo.path);
  exchange.handleResponse(route);
}

maxim.log("HTTPS server listening on port 4444...");
httpsServer.on('error', handleSeverError);
httpsServer.on('request', handleClientRequest);
httpsServer.listen(4444); // port 4444 seems as good as any

// Was going to make http 301 redirect to https on same port
// But I didn't realize ports 80 and 443 had a special relationship
maxim.log("HTTP server listening on port 4443...");
httpServer.on('error', handleSeverError);
httpServer.on('request', handleClientRequest);
httpServer.listen(4443); // port 4444 seems as good as any
