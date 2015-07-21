"use strict";
let esClient = require(global.BASEPATH + 'modules/es-client');
let maxim = require(global.BASEPATH + 'modules/maxim');

/**
 * Lists all configurations
 * @name GET /configurations
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
        let configsQuery = {};
        let size = 10;
        let page = 1;
        if (query.page && query.page > 0) {
          page = query.page;
        }
        configsQuery.size = size;
        configsQuery.from = size * (page - 1);
        if (query.sort) {
          let sortFields = query.sort.split(',');
          let possibleFields = ['name', 'hostname', 'port', 'username'];
          configsQuery.sort = [];
          for (var field of sortFields) {
            let sorter = {};
            let key = null;
            let order = 'asc';
            if (field[0] === '-') {
              key = field.substring(1);
              order = 'desc';
            } else {
              key = field;
            }
            sorter[key] = {
              order: order
            };
            configsQuery.sort.push(sorter);
          }
        }
        console.log('LISTLISTLIST!');
        console.log(query);
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
              configsQuery.query = {
                filtered: {
                  query: {
                    match_all: {}
                  }
                }
              };
              esClient.search({
                _index: 'tenable',
                _type: 'configuration',
                body: configsQuery
              }).then(function(data) {
                console.log(data);
                var configurations = data.hits.hits.map(function(configHit) {
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
