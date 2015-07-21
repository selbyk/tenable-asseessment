"use strict";
let urlParser = require('url').parse;

/*var Exchange = (function() {
  var _properties = new WeakMap();

  function Exchange(request, response) {
    this.statusCode = 500;
    let parsedUrl = require('url').parse(request.url, true);

    var privateProperties = {
      processing: true,
      waitingRoute: null,
      req: {
        method: request.method,
        headers: request.headers,
        path: parsedUrl.pathname,
        query: parsedUrl.query,
        body: {}
      },
      res: response,
      headers: {},
      body: {
        message: {
          type: 'error',
          code: 500,
          message: 'Unexpected error'
        }
      }
    };
    _properties.set(this, privateProperties);
    this.processRequest(request);
  }

  Exchange.prototype.processRequest = function(request) {
    let requestData = '';
    let _this = this;
    if (request.method === 'POST' || request.method === 'PUT') {
      request.on('data', function(data) {
        requestData += data;
      });
      request.on('end', function() {
        _properties.get(_this).req.body = JSON.parse(requestData);
        _properties.get(_this).processing = false;
        _this.handleResponse();
      });
    } else {
      _properties.get(_this).processing = false;
      _this.handleResponse();
    }
  };

  Exchange.prototype.handleResponse = function(handler) {
    var _this = this;
    if (!handler) {
      if (!_properties.get(this).processing && _properties.get(this).waitingRoute !== null) {
        _properties.get(this).waitingRoute(_properties.get(this).requestInfo.params, _properties.get(this).requestInfo.query, _properties.get(this).requestInfo.body).then(function(response) {
          _this.setStatus(response.statusCode);
          _this.addHeaders(response.headers);
          _this.setBody(response.body);
          _this.send();
        }).catch(e => {
          _this.setStatus(500);
          _this.setBody(e);
          _this.send();
        });
      }
    } else {
      if (_properties.get(this).processing) {
        _properties.get(this).waitingRoute = handler;
      } else {
        handler(_properties.get(this).requestInfo.params, _properties.get(this).requestInfo.query, _properties.get(this).requestInfo.body).then(function(response) {
          _this.setStatus(response.statusCode);
          _this.addHeaders(response.headers);
          _this.setBody(response.body);
          _this.send();
        }).catch(e => {
          _this.setStatus(500);
          _this.setBody(e);
          _this.send();
        });
      }
    }
  };

  Exchange.prototype.req = function() {
    return _properties.get(this).requestInfo;
  };

  Exchange.prototype.addHeader = function(key, value) {
    _properties.get(this).headers[key] = value;
  };

  Exchange.prototype.addHeaders = function(headers) {
    for (var key of Object.keys(headers)) {
      this.addHeader(key, _properties.get(this).headers[key]);
    }
  };

  Exchange.prototype.setStatus = function(code) {
    this.statusCode = code;
  };

  Exchange.prototype.setBody = function(data) {
    _properties.get(this).body = data;
  };

  Exchange.prototype.send = function() {
    let payload = JSON.stringify(_properties.get(this).body);
    this.addHeader('Content-Length', payload.length);
    this.addHeader('Content-Type', 'application/json');
    _properties.get(this).response.writeHead(this.statusCode, _properties.get(this).headers);
    _properties.get(this).response.end(payload);
  };

  return Exchange;
}());*/


/*{
  let req, res, headers, body;

  let processing = true;
  let waitingRoute = null;

  var Exchange = class {
    constructor(request, response) {
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
      let parsedUrl = require('url').parse(request.url, true);
      req = {
        method: request.method,
        headers: request.headers,
        path: parsedUrl.pathname,
        query: parsedUrl.query,
        body: {}
      };
      this.processRequest(request);
    }

    get req(){
      return req;
    }

    processRequest(request) {
      let requestData = '';
      let _this = this;
      if (request.method === 'POST' || request.method === 'PUT') {
        request.on('data', function(data) {
          requestData += data;
        });
        request.on('end', function() {
          req.body = JSON.parse(requestData);
          processing = false;
          _this.handleResponse();
        });
      } else {
        processing = false;
        _this.handleResponse();
      }
    }

    handleResponse(handler) {
      let response = null;
      if(!handler){
        if(!processing && waitingRoute !== null){
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
    }

    addHeaders(headers) {
      for(var key of Object.keys(headers)){
        this.addHeader(key, headers[key]);
      }
    }

    setStatus(code) {
      this.statusCode = code;
    }

    setBody(data) {
      body = data;
    }

    send() {
      let payload = JSON.stringify(body);
      this.addHeader('Content-Length', payload.length);
      this.addHeader('Content-Type', 'application/json');
      res.writeHead(this.statusCode, headers);
      res.end(payload);
    }
  };
}*/

module.exports = Exchange;
