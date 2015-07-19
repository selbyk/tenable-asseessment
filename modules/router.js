"use strict";
/** A module to asstist in routing http requests
 * @module routed
 */

let routes;
let routeMap;

class Router {
  constructor() {
    routeMap = {
      'GET': {},
      'PUT': {},
      'POST': {},
      'DELETE': {}
    };
  }

  mapRoute(method, regex, route) {
    routeMap[method]['^'+regex.replace(/[\\$'"]/g, "\\$&")+'$'] = route;
  }

  mapRoutes(routes) {
    for (var i = 0; i < routes.length; ++i) {
      this.mapRoute(routes[i].method, routes[i].regex, routes[i].route);
    }
  }

  findRoute(method, path) {
     for(var regexStr of Object.keys(routeMap[method])){
       let regex = new RegExp(regexStr, 'm');
       console.log(regexStr,path);
       if(regex.test(path)){
         return routeMap[method][regexStr];
       }
     }
     return () => ({statusCode: 400, headers: {}, body: 'Invalid Request'})
  }
}

/** A Singleton that maps routes and handles request redirects
 * @module routed
 * @type {Singleton}
 */
 module.exports = {
   getInstance: (function() { // BEGIN iife
               var instance;
               return function() {
                   if (!instance) {
                     instance = new Router();
                   }
                   return instance;
               };
        }()) // END iife
 };

/**
 * Maps a RequestHandler to given request method and regex path
 * @function mapRouteHandler
 * @param {string} method - Type of http request ('GET', 'PUT', 'DELETE', 'POST')
 * @param {string} regex - Regex to match url path, similar to express
 * @param {RequestHandler} - RequestHandler function for the route
 */
//Router.prototype.

/**
 * Maps an array of Routes
 * @function mapRoutes
 * @param {Route[]} routes - An array of routes to map
 */
//Router.prototype.;

/**
 * A RequestHandler that reqirects to appropriate route or responds with error
 * @function routeRequest
 * @type RequestHandler
 */
//Router.prototype.

//Router.prototype.Router = Router;

//module.exports = exports = new Router();
