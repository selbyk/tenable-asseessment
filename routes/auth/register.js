var esClient = require('../../modules/es-client');

module.exports = {
  method: 'GET',
  regex: '/auth/register',
  route: function(req, res){
    var regex = /\?(.+)$/m;
    var params = {};
    var matches = req.url.match(regex);
    if(matches !== null) {
      matches = matches[1];
      matches = matches.split('&');
      matches.forEach(function(match){
        match = match.split('=');
        var meh = match[1].split(',').length;
        params[match[0]] = meh === 1 ? match[1] : meh;
      });
      //params = params.split('=');
    }

    esClient.indexDoc('tenable', 'user', {
      _id: params.username,
      password: params.password
    });

    console.log(params);
    var body = 'reg!';
    res.writeHead(200, {
      'Content-Length': body.length,
      'Content-Type': 'text/plain'
    });
    res.end(body);
  }
};
