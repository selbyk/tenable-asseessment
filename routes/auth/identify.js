var esClient = require('../../modules/es-client');

module.exports = {
  method: 'POST',
  regex: '/auth/identify',
  route: function(params, query, body){
    var payload = {
      message: 'identify!'
    };
    return {statusCode: 200, headers: {}, body: payload};
  }
};
