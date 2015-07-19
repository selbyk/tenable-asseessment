var esClient = require('../../modules/es-client');

module.exports = {
  method: 'GET',
  regex: '/auth/identify',
  route: function(params, query, body){
    var payload = {
      message: 'revoke!'
    };
    return {statusCode: 200, headers: {}, body: payload};
  }
};
