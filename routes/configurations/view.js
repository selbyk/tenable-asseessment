"use strict";
let esClient = require(global.BASEPATH + 'modules/es-client');
let maxim = require(global.BASEPATH + 'modules/maxim');

/**
 * View a specific configurations
 * @name GET /configurations/:id
 * @type Route
 * @instance
 * @memberof routes
 */
module.exports = {
  method: 'GET',
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
              esClient.findDoc({
                _index: 'tenable',
                _type: 'configuration',
                _id: _id
              }).then(function(data) {
                console.log(data);
                if(data.found === true){
                  resolve({
                    statusCode: 200,
                    headers: {},
                    body: {
                      configuration: data._source
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
                        message: 'Unauthorized, invalid credentials given.'
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
