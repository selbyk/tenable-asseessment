var esClient = require('../../modules/es-client');

module.exports = {
  method: 'GET',
  regex: '/auth/me',
  route: function(params, query, body) {
    var payload = {
      message: 'het!'
    };
    return {
      statusCode: 200,
      headers: {},
      body: payload
    };
  }
};
