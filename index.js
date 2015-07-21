"use strict";
/**
 * Define global types for documentation
 */

/** Function used to handle a request
 * @name RequestHandler
 * @callback
 * @param {http.IncomingMessage} req - Object containing request information recieve by server.
 * @param {http.ServerResponse} res - Object containing the information we will response to the request with
 */

/**
 * Object that defines a route
 * @typedef {Object} Route
 * @property {string} method - Type of http request ('GET', 'PUT', 'DELETE', 'POST')
 * @property {string} regex - Regex to match url path, similar to express
 * @property {RequestHandler} - RequestHandler function for the route
 */

global.BASEPATH = __dirname;

// Require needed core Node.js modules
var http = require('http');
var https = require('https');
var fs = require('fs');

// Require Router module, routes, and initalize routes in the Router
//var Router = require('./modules/router');
var routed = require('./modules/router');
var router = new routed.Router();
router.initRouteDirectory('./routes');

// Configure https keys
var httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
  requestCert: false,
  rejectUnauthorized: false
};

// Create our servers
var httpServer = http.createServer();
var httpsServer = https.createServer(httpsOptions);

/**
 * Handles all errors thrown by the servers.
 * @function handleSeverError
 * @param {Object} err - The error that was thrown.
 */
function handleSeverError(err) {
  if (err.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
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
 * @name handleClientRequest
 * @type {RequestHandler}
 */
function handleClientRequest(req, res) {
  // Just let me know what's going on.
  console.log(req.method + " " + req.url);
  let exchange = new routed.Exchange(req, res);
  exchange.addHeader('Access-Control-Allow-Origin:', '*');
  let route = router.findRoute(exchange.requestInfo.method, exchange.requestInfo.path);
  exchange.handleResponse(route);
}

httpsServer.on('error', handleSeverError);
httpsServer.on('request', handleClientRequest);
httpsServer.listen(4444); // port 4444 seems as good as any

// Was going to make http 301 redirect to https on same port
// But I didn't realize ports 80 and 443 had a special relationship
httpServer.on('error', handleSeverError);
httpServer.on('request', handleClientRequest);
httpServer.listen(4443); // port 4444 seems as good as any
