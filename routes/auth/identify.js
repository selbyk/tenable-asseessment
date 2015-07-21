"use strict";
let esClient = require(global.BASEPATH + 'modules/es-client');
let maxim = require(global.BASEPATH + 'modules/maxim');

/**
 * Update account to given credentials with uniquely generated token and return it
 * @name GET /auth/revoke
 * @type Route
 * @instance
 * @memberof routes
 */
module.exports = {
  method: 'POST',
  regex: '/auth/identify',
  route: function(params, query, body) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        function identifyUser() {
          esClient.findDoc({
            _index: 'tenable',
            _type: 'user',
            _id: body.credentials.username
          }).then(function(data) {
            console.log(data);
            if (data.found === true && body.credentials.password === data._source.password) {
              resolve({
                statusCode: 200,
                headers: {},
                body: {
                  grant: {
                    access_token: data._source.token
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
                    message: 'Unauthorized, valid credentials given.'
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
        }

        function updateToken(token) {
          console.log('JEU!');
          console.log(body);
          console.log(token);
          esClient.updateDoc('tenable', 'user', {
            _id: body.credentials.username,
            token: token
          }).then(function(data) {
            console.log(data);
            if (data._id === body.credentials.username) {
              identifyUser();
            } else {
              resolve({
                statusCode: 401,
                headers: {},
                body: {
                  message: {
                    type: 'error',
                    code: 500,
                    message: 'There was a problem generating access token.'
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
        }
        var findUniqueToken = function() {

          require('crypto').randomBytes(48, function(ex, buf) {
            var token = buf.toString('hex');
            esClient.search({
              _index: 'tenable',
              _type: 'user',
              body: {
                query: {
                  filtered: {
                    filter: {
                      term: {
                        token: token
                      }
                    }
                  }
                }
              }
            }).then(function(data) {
              console.log(data);
              if (data.hits.total === 0) {
                updateToken(token);
              } else {
                findUniqueToken();
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
          });
        };
        findUniqueToken();
      });
  }
};
