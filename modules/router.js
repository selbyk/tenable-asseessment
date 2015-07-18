/** A Singleton that maps routes and handles request redirects
 * @module Router
 * @type {Singleton}
 */
function Router() {
  this.routes = [];
  this.routeMap = {
    'GET': '',
    'PUT': '',
    'POST': '',
    'DELETE': ''
  };
}

/**
 * Maps a RequestHandler to given request method and regex path
 * @function mapRouteHandler
 * @param {string} method - Type of http request ('GET', 'PUT', 'DELETE', 'POST')
 * @param {string} regex - Regex to match url path, similar to express
 * @param {RequestHandler} - RequestHandler function for the route
 */
Router.prototype.mapRouteHandler = function(method, regex, route) {
  this.routeMap[method] = this.routeMap[method].concat('!' + regex + ':' + this.routes.length + '#');
  this.routes.push(route);
};

/**
 * Maps an array of Routes
 * @function mapRoutes
 * @param {Route[]} routes - An array of routes to map
 */
Router.prototype.mapRoutes = function(routes) {
  for (var i = 0; i < routes.length; ++i) {
    this.mapRouteHandler(routes[i].method, routes[i].regex, routes[i].route);
  }
};

/**
 * A RequestHandler that reqirects to appropriate route or responds with error
 * @function routeRequest
 * @type RequestHandler
 */
Router.prototype.routeRequest = function(req, res) {
  var routeIndex;
  var longestMatch = -1;
  if (this.routeMap.hasOwnProperty(req.method)) {
    var url = req.url.match(/\/[^?]*/);
    var regex = new RegExp('!(' + url + '):([0-9]+)#', 'g');
    var match;
    while ((match = regex.exec(this.routeMap[req.method])) !== null) {
      if (match[1].length > longestMatch) {
        longestMatch = match[1].length;
        routeIndex = match[2];
      }
    }
  }
  if (longestMatch !== -1) {
    console.log(this.routes);
    this.routes[routeIndex](req, res);
  } else {
    var body = 'Error: No route found - router.js';
    res.writeHead(404, {
      'Content-Length': body.length,
      'Content-Type': 'text/plain'
    });
    res.end(body);
  }
};

Router.prototype.Router = Router;

module.exports = exports = new Router();
