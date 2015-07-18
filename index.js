// Require our needed modules
var http = require('http');
var https = require('https');
var fs = require('fs');

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
function handleSeverError(err){
  if (err.code == 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(function() {
      server.close();
      server.listen(PORT, HOST);
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
  console.log(req.method + " " + req.url);
  var body = 'Hello, world.';
  res.writeHead(200, {
    'Content-Length': body.length,
    'Content-Type': 'text/plain'
  });
  res.end(body);
}

httpsServer.on('error', handleSeverError);
httpsServer.on('request', handleClientRequest);
httpsServer.listen(4444); // port 4444 seems as good as any

// Was going to make http 301 redirect to https on same port
// But I didn't realize ports 80 and 443 had a special relationship
httpServer.on('error', handleSeverError);
httpServer.on('request', handleClientRequest);
httpServer.listen(4443); // port 4444 seems as good as any
