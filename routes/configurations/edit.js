"use strict";
let esClient = require(global.BASEPATH + 'modules/es-client');
let maxim = require(global.BASEPATH + 'modules/maxim');

/**
 * Modifies a configuration
 * @name PUT /configurations/:id
 * @type Route
 * @instance
 * @memberof routes
 */
module.exports = {
  method: 'PUT',
  regex: '/configurations/.+',
  route: function(requestInfo, query, body) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        var _id = requestInfo.path.substring(16);
        console.log('VIEW CONFIG! ' + _id);
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
            if (data.hits.total === 1) {
              var doc = body.configuration;
              doc._id = _id;
              esClient.updateDoc(
                'tenable',
                'configuration',
                doc
              ).then(function(data) {
                console.log(data);
                if (data._id === _id) {
                  resolve({
                    statusCode: 200,
                    headers: {},
                    body: {
                      message: {
                        type: 'info',
                        code: 200,
                        message: 'Updated doc successfully.'
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
                        message: 'Failed to update doc.'
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
            } else {
              resolve({
                statusCode: 401,
                headers: {},
                body: {
                  message: {
                    type: 'error',
                    code: 401,
                    message: 'invalid credentials, must be authorizatized.'
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
