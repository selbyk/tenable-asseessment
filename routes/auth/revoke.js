var esClient = require('../../modules/es-client');

module.exports = {
  method: 'GET',
  regex: '/auth/identify',
  route: function(params, query, body) {
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
              require('crypto').randomBytes(48, function(ex, buf) {
                esClient.updateDoc('tenable', 'user', {
                  _id: data.hits.hits[0].username,
                  token: buf.toString('hex')
                }).then(function(data) {
                  console.log(data);
                  resolve({
                    statusCode: 200,
                    headers: {},
                    body: {
                      message: {
                        type: 'info',
                        message: data.hits.total.hits[0].username + ' logged out successfully'
                      }
                    }
                  });
                }).catch(e => reject({
                  statusCode: 500,
                  headers: {},
                  body: {
                    message: {
                      type: 'error',
                      code: 42,
                      message: 'There was a database communication error.  Let us know.'
                    }
                  }
                }));
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
                message: 'There was a database communication error.  Let us know.'
              }
            }
          }));
        };
      });
  }
}
