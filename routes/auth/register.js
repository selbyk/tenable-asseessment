"use strict";
let esClient = require(global.BASEPATH + 'modules/es-client');
let maxim = require(global.BASEPATH + 'modules/maxim');

/**
 * Creates a new user account
 * @name POST /auth/register
 * @type Route
 * @instance
 * @memberof routes
 */
module.exports = {
  method: 'POST',
  regex: '/auth/register',
  route: function(params, query, body) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        esClient.indexDoc('tenable', 'user', {
          _id: body.credentials.username,
          password: body.credentials.password,
        }).then(function(data) {
          console.log(data);
          if (data.created === true) {
            resolve({
              statusCode: 200,
              headers: {},
              body: {
                message: {
                  type: 'info',
                  message: 'Account created successfully, you may login.'
                }
              }
            });
          } else {
            resolve({
              statusCode: 406,
              headers: {},
              body: {
                message: {
                  type: 'error',
                  code: 406,
                  message: 'Username has been taken.'
                }
              }
            });
          }
        }).catch(e => {
          maxim.error(e);
          reject({
            statusCode: 500,
            headers: {},
            body: {
              message: {
                type: 'error',
                code: 42,
                message: 'There was a database communication error.  Let us know.'
              }
            }
          });
        });
      });
  }
};
