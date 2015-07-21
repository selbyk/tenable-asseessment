"use strict";
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
        require('crypto').randomBytes(48, function(ex, buf) {
          let token = buf.toString('hex');
          esClient.indexDoc('tenable', 'user', {
            _id: body.credentials.username,
            password: body.credentials.password,
            token: token
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
      });
  }
};
