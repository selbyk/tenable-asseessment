var esClient = require('../../modules/es-client');

module.exports = {
  method: 'POST',
  regex: '/auth/register',
  route: function(params, query, body) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        console.log('JEU!');
        console.log(body);
        esClient.indexDoc('tenable', 'user', {
          _id: body.credentials.username,
          password: body.credentials.password
        }).then(function(data) {
          console.log(data);
          resolve({
            statusCode: 200,
            headers: {},
            body: data
          });
        }).catch(e => reject({
          statusCode: 200,
          headers: {},
          body: e
        }));
      });
  }
};
