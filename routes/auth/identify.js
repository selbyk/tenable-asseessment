var esClient = require('../../modules/es-client');

module.exports = {
  method: 'POST',
  regex: '/auth/identify',
  route: function(params, query, body) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        console.log('JEU!');
        console.log(body);
        esClient.findDoc({
          _index: 'tenable',
          _type: 'user',
          _id: body.credentials.username
        }).then(function(data) {
          resolve({
            statusCode: 200,
            headers: {},
            body: data
          });
        }).catch(function(e) {
          reject({
            statusCode: 500,
            headers: {},
            body: e
          });
        });
      });
  }
};
