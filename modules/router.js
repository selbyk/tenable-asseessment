"use strict";
/** A module containing some fun classes that work together to assist handling HTTP requests
 * @module routed
 */

/** A class the handles mapping and finding routes to handle exchanges between client and server
 * @class Router
 */
{
  let fs = require('fs');
  let path = require('path');
  let _properties = new WeakMap();
  //let _methods = new WeakMap();
  var Router = class Router {
    constructor() {
      let privateProperties = {
        routes: [],
        /**
         * Maps an array of Routes
         * @function mapRoutes
         * @param {Route[]} routes - An array of routes to map
         */
        routeMap: {
          'GET': {},
          'PUT': {},
          'POST': {},
          'DELETE': {}
        }
      };
      _properties.set(this, privateProperties);
    }

    /**
     * Maps a Route
     * @function mapRoutes
     * @param {Route} route - A route
     */
    mapRoute(method, regex, route) {
      _properties.get(this).routeMap[method]['^' + regex.replace(/[\\$'"]/g, "\\$&") + '$'] = route;
    }

    mapRoutes(routes) {
      if (Array.isArray(routes)) {
        for (var i = 0; i < routes.length; ++i) {
          this.mapRoute(routes[i].method, routes[i].regex, routes[i].route);
        }
      } else {
        this.mapRoute(routes.method, routes.regex, routes.route);
      }
    }

    /**
     * Recursively loads all routes in given directory
     * @function initRouteDirectory
     * @param {String} routesPath - path to routes
     */
    initRouteDirectory(routesPath) {
      let _this = this;
      if (!path.isAbsolute(routesPath)) {
        routesPath = global.BASEPATH + routesPath.substring(1);
      }
      if (routesPath[routesPath.length - 1] !== '/') {
        routesPath = routesPath.concat('/');
      }
      var routeFiles = fs.readdirSync(routesPath).filter(function(file) {
        return path.extname(file) === '.js';
      }).map(file => routesPath + file);

      function walk(recursePath) {
        var dirs = fs.readdirSync(recursePath).filter(function(file) {
          return fs.statSync(path.join(recursePath, file)).isDirectory();
        });
        dirs.forEach(function(dir) {
          dir += '/';
          routeFiles = routeFiles.concat(fs.readdirSync(recursePath + dir)
                                 .filter(file => path.extname(file) === '.js')
                                 .map(file => routesPath + dir + file));
          walk(recursePath + dir);
        });
      }
      walk(routesPath);
      console.log('Loading routes:', routeFiles);
      routeFiles.forEach(function(file) {
        _this.mapRoutes(require(file));
      });
    }

    /**
     * Finds and returns a Route matching given method and path, or a default Route
     * @function mapRoutes
     * @param {Route[]} routes - An array of routes to map
     */
    findRoute(method, path) {
      let routeMap = _properties.get(this).routeMap;
      for (var regexStr of Object.keys(routeMap[method])) {
        let regex = new RegExp(regexStr, 'm');
        console.log(regexStr, path);
        if (regex.test(path)) {
          return routeMap[method][regexStr];
        }
      }
      return new Promise(function(resolve) {
        resolve({
          statusCode: 400,
          headers: {},
          body: 'Invalid Request'
        });
      });
    }
  };
}

  /** A class that represents a single HTTP request/reponse and simplies the API for client/server communication
   * @class Exchange
   */
  {
    // Require modules needed for class
    let urlParser = require('url').parse;

    // Private properties and methods
    let _properties = new WeakMap();
    let _methods = new WeakMap();

    var Exchange = class Exchange {
      constructor(request, response) {
        let _this = this;
        let parsedUrl = urlParser(request.url, true);
        let privateProperties = {
          httpRequest: request,
          httpResponse: response,
          requestInfo: {
            method: request.method,
            headers: request.headers,
            path: parsedUrl.pathname,
            query: parsedUrl.query,
            body: null
          },
          requestBody: '',
          responseStatus: 500,
          responseHeaders: {},
          responseBody: '',
        };
        let privateMethods = {
          processPayload: function(request) {
            console.log('IN PAYLOAD Function!');
            return new Promise((resolve, reject) => {
              console.log('IN PAYLOAD PROMISE!');
              let requestBody = null;
              var finished = function() {
                _properties.get(_this).processing = false;
                console.log('RESOLVING PAYLOAD PROMISE!');
                resolve(requestBody);
              };
              var error = function(e) {
                console.log('RESOLVING PAYLOAD PROMISE!');
                reject(e);
              };
              let requestData = [''];
              if (request.method === 'POST' || request.method === 'PUT') {
                request.on('data', data => requestData.push(data));
                request.on('end', () => {
                  requestBody = JSON.parse(requestData.join(''));
                  _properties.get(_this).requestInfo.body = requestBody;
                  finished();
                });
                request.on('error', e => error(e));
              } else {
                finished();
              }
            });
          },
          send: function() {
            console.log('SENDING PAYLOAD!');

            function finished() {
              console.log('EXCHANGE FINISHED');
            }
            if (typeof _properties.get(_this).responseBody === 'string' || _properties.get(_this).responseBody instanceof String) {
              console.log('EXCHANGE fdgdfgdfg');
              let payload = JSON.stringify(_properties.get(_this).responseBody);
              console.log('EXCHANGE fdgdfgdfsdfsdfsdfsdfdfg');
              _this.addHeader('Content-Length', payload.length);
              _this.addHeader('Content-Type', 'application/json');
              _properties.get(_this).httpResponse.writeHead(_this.statusCode, _properties.get(_this).responseHeaders);
              _properties.get(_this).httpResponse.end(payload);
              console.log('EXCHANGE FINISHED');
              finished();
            } else {
              _properties.get(_this).httpResponse.end();
              finished();
            }
          },
          processingPromise: null,
          processingFinished: null,
          resolvePromise: null,
          rejectPromise: null
        };
        _properties.set(this, privateProperties);
        privateMethods.processingPromise = privateMethods.processPayload(request);
        _methods.set(this, privateMethods);

        // _methods.get(this, privateMethods).processPayload(request);
      }

      static statusMessage(code) {
        let codeMessages = {
          200: 'OK',
          500: 'Unexpected Error'
        };
        if (code in codeMessages) {
          return codeMessages[code];
        } else {
          return 'Undefined Status Code';
        }
      }

      handleResponse(handler) {
        // Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj === null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
        let _this = this;
        let requestInfo = this.requestInfo;
        console.log('WAITING ON PROMISE!');
        _methods.get(this).processingPromise.then(() => {
          console.log('PL PROMISE RESOLVED!');
          handler(requestInfo.params, requestInfo.query, requestInfo.body).then(function(response) {
            console.log('HANDLE PROMISE RESOLVED!');
            console.log(response);
            _properties.get(_this).responseStatus = response.statusCode;
            if(!isEmpty(response.headers)){
            _this.addHeaders(response.headers);
          }
          if(!isEmpty(response.headers)){
            _properties.get(_this).responseBody = response.body;
        }
            console.log('SENDING!');
            _methods.get(_this).send();
          }).catch(e => {
            console.log('HANDLE PROMISE ERROR!');
            _properties.get(_this).responseStatus = 500;
            _this.throwError(e);
            console.log('SENDING!');
            _methods.get(_this).send();
          });
        }).catch(e => {
          console.log('PL PROMISE ERROR!');
          console.log(handler);
          _properties.get(_this).responseStatus = 500;
          _this.throwError(e);
          console.log('SENDING!');
          _methods.get(_this).send();
        });
      }

      addHeader(key, value) {
        _properties.get(this).responseHeaders[key] = value;
      }

      addHeaders(headers) {
        for (var key of Object.keys(headers)) {
          this.addHeader(key, headers[key]);
        }
      }

      throwError(code, message) {
        console.log('not impliminetnedfjklndsfkdj', code, message);

      }

      get requestInfo() {
        return _properties.get(this).requestInfo;
      }

      get statusCode() {
        return _properties.get(this).statusCode;
      }

      get headers() {
        return _properties.get(this).responseHeaders;
      }

      get body() {
        return _properties.get(this).responseBody;
      }
    };
  }

  /** A class the handles mapping and finding routes to handle exchanges between client and server
   * @class Route
   */

  /**
   * A class holding a request method type, regex path into, and a function to handle requests
   * @function Route
   * @param {string} method - Type of http request ('GET', 'PUT', 'DELETE', 'POST')
   * @param {string} regex - Regex to match url path, similar to express
   * @param {RequestHandler} - RequestHandler function for the route
   */
  module.exports = {
    Router: Router,
    Exchange: Exchange,
    //Route: Route
  };


  /**
   * A RequestHandler that reqirects to appropriate route or responds with error
   * @function routeRequest
   * @type RequestHandler
   */
