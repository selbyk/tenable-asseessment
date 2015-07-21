var request = require('http').request;

module.exports = {
  indexDoc: function(_index, _type, doc) {
    return new Promise(function(resolve, reject){
      var _id = null;
      if (doc.hasOwnProperty("_id")) {
        _id = doc._id;
        delete doc[_id];
      }
      var postData = JSON.stringify(doc);

      var options = {
        hostname: 'localhost',
        port: 9200,
        path: '/' + _index + '/' + _type,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': postData.length
        }
      };

      if (_id !== null) {
        options.path = options.path + '/' + _id;
        options.method = "PUT";
      }

      var req = request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var chunks = [''];
        res.on('data', function(chunk) {
          console.log('BODY: ' + chunk);
          chunks.push(chunk);
        });
        res.on('end', function() {
          resolve(JSON.parse(chunks.join('')));
        });
      });
      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        reject(e);
      });
      // write data to request body
      req.write(postData);
      req.end();
    });
  },
  updateDoc: function(_index, _type, doc) {
    return new Promise(function(resolve, reject){
      var _id = null;
      if (doc.hasOwnProperty("_id")) {
        _id = doc._id;
        delete doc[_id];
      } else {
        reject('no id given');
        return;
      }
      var postData = JSON.stringify({doc:doc});

      var options = {
        hostname: 'localhost',
        port: 9200,
        path: '/' + _index + '/' + _type + '/' + _id + '/_update',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': postData.length
        }
      };

      var req = request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var chunks = [''];
        res.on('data', function(chunk) {
          console.log('BODY: ' + chunk);
          chunks.push(chunk);
        });
        res.on('end', function() {
          resolve(JSON.parse(chunks.join('')));
        });
      });
      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        reject(e);
      });
      // write data to request body
      req.write(postData);
      req.end();
    });
  },
  findDoc: function(opts) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        var options = {
          hostname: 'localhost',
          port: 9200,
          path: '/' + opts._index + '/' + opts._type + '/' + opts._id,
          method: 'GET'
        };

        var req = request(options, function(res) {
          res.setEncoding('utf8');
          var fuck = '';
          res.on('data', function(chunk) {
            fuck += chunk;
          });
          res.on('end', function() {
            resolve(JSON.parse(fuck));
          });
        });

        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
          console.log(e);
          reject(e);
        });

        // write data to request body
        req.end();
      });
  },
  search: function(opts) {
    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        var postData = JSON.stringify({query:opts.query});
        var options = {
          hostname: 'localhost',
          port: 9200,
          path: '/' + opts._index + '/' + opts._type + '/_search',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
          }
        };

        var req = request(options, function(res) {
          res.setEncoding('utf8');
          var fuck = '';
          res.on('data', function(chunk) {
            fuck += chunk;
          });
          res.on('end', function() {
            resolve(JSON.parse(fuck));
          });
          res.on('error', function() {
            resolve(JSON.parse(fuck));
          });
        });

        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
          console.log(e);
          reject(e);
        });
        req.write(postData);
        // write data to request body
        req.end();
      });
  }
};
