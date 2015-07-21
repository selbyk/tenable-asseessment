var esClient = require('../../modules/es-client');

module.exports = {
  method: 'GET',
  regex: '/auth/me',
  route: function(requestInfo, query, body) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        console.log('JEU!');
        console.log(body);
        if (!requestInfo.headers.authorization) {
          resolve({
            statusCode: 401,
            headers: {},
            body: {
              message: {
                type: 'error',
                code: 401,
                message: 'Unauthorized, invalid token must be given.'
              }
            }
          });
        } else {
          var token = requestInfo.headers.authorization.split(' ')[1];
          esClient.search({
            _index: 'tenable',
            _type: 'user',
            query: {
              filtered: {
                filter: {
                  term: {
                    token: token
                  }
                }
              }
            }
          }).then(function(data) {
            console.log(data);
            if (data.hits.total === 1) {
              resolve({
                statusCode: 200,
                headers: {},
                body: {
                  user: {
                    username: data.hits.hits[0]._id
                  }
                }
              });
            } else {
              resolve({
                statusCode: 401,
                headers: {},
                body: {
                  message: {
                    type: 'error',
                    code: 401,
                    message: 'Unauthorized, invalid token given. Please login again.'
                  }
                }
              });
            }
          }).catch(e => reject({
            statusCode: 500,
            headers: {},
            body: {
              message: {
                type: 'error',
                code: 42,
                message: 'There was a database communication error.  Let us know.' + e.message
              }
            }
          }));
        };
    });
}
};
