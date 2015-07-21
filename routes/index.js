"use strict";
/**
 * Namespace of all route definitions
 * @namespace routes
 */
let maxim = require(global.BASEPATH + 'modules/maxim');

// Finds all routes and returns them as an array.
// Not the most optimized code, but it only runs once.
module.exports = [
  /**
   * Hello world route at /
   * @name GET /
   * @type Route
   * @instance
   * @memberof routes
   */
  {
    method: 'GET',
    regex: '/',
    route: (params, query, body) => {
      maxim.error('IN ROUTE');
      return new Promise((resolve, reject) => {
        var payload = {
          message: 'Hello, world!'
        };
        maxim.log('RESOLVING ROUTE Promise');
        resolve({
          statusCode: 200,
          headers: {},
          body: payload
        });
      });
    }
  }
];
