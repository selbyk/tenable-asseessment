"use strict"; {
  let req, res, headers, body;

  let processing = false;
  let waitingRoute = null;

  var Exchange = class {
    constructor(request, response) {
      req = request;
      res = response;
      this.statusCode = 500;
      headers = {};
      body = {
        message: {
          type: 'error',
          code: 500,
          message: 'Unexpected error'
        }
      };
    }

    processRequest(request) {
      processing = true;
      let parsedUrl = require('url').parse(request.url, true);
      req = {
        method: request.method,
        headers: request.headers,
        path: parsedUrl.pathname,
        query: parsedUrl.query,
        body: null
      };
      let requestData = '';
      if (request.method === 'POST' || request.method === 'PUT') {
        request.on('data', function(data) {
          requestData += data;
        });
        request.on('end', function() {
          req.body = JSON.parse(requestData);
          processing = false;
          this.handleResponse();
        });
      } else {
        processing = false;
      }
      return {method: req.method, path: req.path};
    }

    handleResponse(handler) {
      let response = null;
      if(!handler){
        if(waitingRoute !== null){
          response = waitingRoute(req.params, req.query, req.body);
        }
      } else {
        if(processing) {
          waitingRoute = handler;
        } else {
          response = handler(req.params, req.query, req.body);
        }
      }
      if(response !== null){
        this.setStatus(response.statusCode);
        this.addHeaders(response.headers);
        this.setBody(response.body);
        this.send();
      }
    }

    addHeader(key, value) {
      headers[key] = value;
    };

    addHeaders(headers) {
      for(var key of Object.keys(headers)){
        addHeader(key, headers[key]);
      }
    };

    setStatus(code) {
      this.statusCode = code;
    };

    setBody(data) {
      body = data;
    };

    send() {
      let payload = JSON.stringify(body);
      this.addHeader('Content-Length', payload.length);
      this.addHeader('Content-Type', 'application/json');
      res.writeHead(this.statusCode, headers);
      res.end(payload);
    };
  }
}

module.exports = Exchange;
