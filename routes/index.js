/**
 * Namespace of all route definitions
 * @namespace routes
 */

var fs = require('fs'),
  path = require('path');

// Finds all routes and returns them as an array.
// Not the most optimized code, but it only runs once.
module.exports = function() {
  /**
   * Hello world route at /
   * @name GET /
   * @type Route
   * @instance
   * @memberof routes
   */
  var routes = [{
    method: 'GET',
    regex: '/',
    route: function(params, query, body) {
      var payload = {
        message: 'Hello, world!'
      };
      return {statusCode: 200, headers: {}, body: payload};
    }
  }];

  var dirs = fs.readdirSync('./routes').filter(function(file) {
    return fs.statSync(path.join('./routes', file)).isDirectory();
  });

  var routeFiles = [];
  dirs.forEach(function(dir) {
    var files = fs.readdirSync('./routes/' + dir).filter(function(file) {
      return path.extname(file) === '.js';
    });
    files.forEach(function(file) {
      routeFiles.push('./' + dir + '/' + file);
    });
  });

  routeFiles.forEach(function(file) {
    routes.push(require(file));
  });
  console.log(routes);

  return routes;
}();
