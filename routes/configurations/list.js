"use strict";
let esClient = require(global.BASEPATH + 'modules/es-client');
let maxim = require(global.BASEPATH + 'modules/maxim');

/**
 * Returns user of access token used to authenticate request
 * @name GET /auth/me
 * @type Route
 * @instance
 * @memberof routes
 */
module.exports = {
  method: 'GET',
  regex: '/configurations',
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
                message: 'Unauthorized, valid token must be given.'
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
              esClient.search({
                _index: 'tenable',
                _type: 'configuration',
                query: {
                  filtered: {
                    query: {
                      match_all: {}
                    }
                  }
                }
              }).then(function(data) {
                console.log(data);
                var configurations = data.hits.hits.map(function(configHit){
                  let config = configHit._source;
                  config._id = configHit._id;
                  return config;
                });
                  resolve({
                    statusCode: 200,
                    headers: {},
                    body: {
                      configurations: configurations
                    }
                  });
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
