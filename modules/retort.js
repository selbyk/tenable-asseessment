/** An intermediary simplification of the API calls needed to help you ACK all your SYNs
 * @module retort
 * @type {Constructor}
 */
function retort(request, response) {
  var req = request;
  var res = response;

  var statusCode = 500;
  var headers = {};
  var body = {
    message: {
      type: 'error',
      code: 500,
      message: 'Unexpected error'
    }
  };

  this.request = {
    method: null,
    path: null,
    params: null,
    body: null
  };

  this.addHeader = function(key, value) {
    headers[key] = value;
  };

  this.setStatus = function(code) {
    statusCode = code;
  };

  this.setBody = function(data) {
    body = data;
  };

  this.send = function() {
    var payload = JSON.stringify(body);
    this.addHeader('Content-Length', payload.length);
    this.addHeader('Content-Type', 'application/json');
    response.writeHead(statusCode, headers);
    response.end(payload);
  };

  return this;
}

module.exports = retort;
