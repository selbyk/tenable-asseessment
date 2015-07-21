/**
 * Namespace of all route definitions
 * @namespace routes
 */

var fs = require('fs'),
  path = require('path');

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
    console.log('IN ROUTE');
    return new Promise((resolve, reject) => {
      var payload = {
        message: 'Hello, world!'
      };
      console.log('RESOLVING ROUTE Promise');
      resolve({statusCode: 200, headers: {}, body: payload});
    });
  }
}];
