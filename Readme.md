# [Tenable Programming Assessment](https://github.com/selbyk/tenable-asseessment)

NOTICE: Ouch, just noticed some of the es6 features I'm using are only avaliable in io.js!
Namely the classes I used... but I'm not sure what else is broken.

My solution to the programming assessment specified in [./docs/Assessment.md](https://github.com/selbyk/tenable-asseessment/blob/master/docs/Assessment.md)

_There is a live version I just set up on my [selby.io](http://www.selby.io:4443/) server **http** on port **4443**, **https** on port
**4444**, and I installed [Marvel Sense and opened up port
9200](http://selby.io:9200/_plugin/marvel/sense/) so you can play with it. It's
not a BIG deal if it goes down, but I do use it on my site, so be nice. =)_

References Used:
- [https://nodejs.org/api/](https://nodejs.org/api/)
- [Nessus 5.0 REST Protocol
Specification [pdf]](http://static.tenable.com/documentation/nessus_5.0_XMLRPC_protocol_guide.pdf)
- [SWAGGER RESTFUL API DOCUMENTATION SPECIFICATION](http://swagger.io/specification/)
- [Learning JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/)
- [Using ES6 Harmony with NodeJS](https://www.airpair.com/javascript/posts/using-es6-harmony-with-nodejs)
- [MDN JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [Elasticsearch Reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)

Documentation:

- [API Specification in ./docs/spec](https://github.com/selbyk/tenable-asseessment/blob/master/docs/spec)
- [Code Documentation in ./docs/jsdocs](https://github.com/selbyk/tenable-asseessment/blob/master/docs/jsdocs)
- [Test Frontend and Documentation at tenable.selby.io (WIP)](http://tenable.selby.io/)

### Example Requests

Request
```http
POST /auth/register HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Cache-Control: no-cache

{ "credentials":{"username":"selby.kendrick","password":"thisisntsecure"} }
```
Response
```json
{
    "message": {
        "type": "info",
        "message": "Account created successfully, you may login."
    }
}
```
Request
```http
POST /auth/identify HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Cache-Control: no-cache

{ "credentials":{"username":"selby.kendrick","password":"thisisntsecure"} }
```
Response
```json
{
    "grant": {
        "access_token": "0685cfa7799850e12d3d1c70bf488245b5e8f1d0af3dfd4a72be19baeced2ace142a523d0ad0cc87731f09b2bcedc7d2"
    }
}
```
Request
```http
GET /auth/me HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 0685cfa7799850e12d3d1c70bf488245b5e8f1d0af3dfd4a72be19baeced2ace142a523d0ad0cc87731f09b2bcedc7d2
Cache-Control: no-cache
```
Response
```json
{
    "user": {
        "username": "selby.kendrick"
    }
}
```
Request
```http
GET /auth/revoke HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 0685cfa7799850e12d3d1c70bf488245b5e8f1d0af3dfd4a72be19baeced2ace142a523d0ad0cc87731f09b2bcedc7d2
Cache-Control: no-cache
```
Response
```json
{
    "message": {
        "type": "info",
        "message": "selby.kendrick logged out successfully"
    }
}
```
Request
```http
POST /configurations HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 14df6f84c97556ecbfd4907f479212f731309ca47a90bd4dd224df305db468de01a027ebb5b3f451b2b1573efda77b1c
Cache-Control: no-cache

{ "configuration":{ "name":"testing123", "hostname":"my.domain.com", "port": 8348, "username":"selby.kendrick" } }
```
Response
```json
{
    "configuration": {
        "name": "testing123",
        "hostname": "my.domain.com",
        "port": 8348,
        "username": "selby.kendrick",
        "_id": "AU6yMCedKI-gU2xUq7PY"
    }
}
```
Request
```http
GET /configurations/AU6yMCedKI-gU2xUq7PY HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 14df6f84c97556ecbfd4907f479212f731309ca47a90bd4dd224df305db468de01a027ebb5b3f451b2b1573efda77b1c
Cache-Control: no-cache
```
Response
```json
{
    "configuration": {
        "name": "testing123",
        "hostname": "my.domain.com",
        "port": 8348,
        "username": "selby.kendrick"
    }
}
```
Request
```http
PUT /configurations/AU6yMCedKI-gU2xUq7PY HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 2ee14f0a7404f222e2055190b75ce66ef99bb2220e47dce79a82abc2494b58f5c5ae08bbaa5e1a351cc4a25591fe89c4
Cache-Control: no-cache

{ "configuration": { "name": "modified123", "hostname": "my.domain.org", "port": 8438, "username": "selby.kendrick" } }
```
Response
```json
{
    "message": {
        "type": "error",
        "code": 401,
        "message": "invalid credentials, must be authorizatized."
    }
}
```
Request
```http
PUT /configurations/AU6yMCedKI-gU2xUq7PY HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 14df6f84c97556ecbfd4907f479212f731309ca47a90bd4dd224df305db468de01a027ebb5b3f451b2b1573efda77b1c
Cache-Control: no-cache

{ "configuration": { "name": "modified123", "hostname": "my.domain.org", "port": 8438, "username": "selby.kendrick" } }
```
Response
```json
{
    "message": {
        "type": "info",
        "code": 200,
        "message": "Updated doc successfully."
    }
}
```
Request
```http
GET /configurations/AU6yMCedKI-gU2xUq7PY HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Cache-Control: no-cache
```
Response
```json
{
    "message": {
        "type": "error",
        "code": 401,
        "message": "Unauthorized, valid token must be given."
    }
}
```
Request
```http
GET /configurations/AU6yMCedKI-gU2xUq7PY HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 14df6f84c97556ecbfd4907f479212f731309ca47a90bd4dd224df305db468de01a027ebb5b3f451b2b1573efda77b1c
Cache-Control: no-cache
```
Response
```json
{
    "configuration": {
        "name": "modified123",
        "hostname": "my.domain.org",
        "port": 8438,
        "username": "selby.kendrick",
        "_id": "AU6yMCedKI-gU2xUq7PY"
    }
}
```
Request
```http
GET /configurations HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 14df6f84c97556ecbfd4907f479212f731309ca47a90bd4dd224df305db468de01a027ebb5b3f451b2b1573efda77b1c
Cache-Control: no-cache
```
Response
```json
{
    "configurations": [
        {
            "name": "name1",
            "hostname": "some.ssiodjs.com",
            "port": 2324,
            "username": "selby.kendrick",
            "_id": "AU6yBBSiKI-gU2xUq7PT"
        },
        {
            "name": "modified123",
            "hostname": "my.domain.org",
            "port": 8438,
            "username": "selby.kendrick",
            "_id": "AU6yMCedKI-gU2xUq7PY"
        },
        {
            "name": "name123",
            "hostname": "some.ssiodjs.com",
            "port": 2324,
            "username": "selby.kendrick",
            "_id": "AU6yLgjLKI-gU2xUq7PX"
        }
    ]
}
```
Request
```http
GET /configurations HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer 4535345345
Cache-Control: no-cache
```
Response
```json
{
    "message": {
        "type": "error",
        "code": 401,
        "message": "Unauthorized, invalid token given. Please login again."
    }
}
```
Request
```http
GET /configurations HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Cache-Control: no-cache
```
Response
```json
{
    "message": {
        "type": "error",
        "code": 401,
        "message": "Unauthorized, invalid token must be given."
    }
}
```
Request
```http
GET /configurations?page=1&sort=-name HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer c2c96b3042bafe9bbe466080bd6d66fbba1a0903f1f6ea61317b27b3887b13b195ce9e5e07f68030ee0cce7d61ceabcd
Cache-Control: no-cache
```
Response
```json
{
    "configurations": [
        {
            "name": "name123",
            "hostname": "some.ssiodjs.com",
            "port": 2324,
            "username": "selby.kendrick",
            "_id": "AU6yLgjLKI-gU2xUq7PX"
        },
        {
            "name": "name1",
            "hostname": "some.ssiodjs.com",
            "port": 2324,
            "username": "selby.kendrick",
            "_id": "AU6yBBSiKI-gU2xUq7PT"
        },
        {
            "name": "modified123",
            "hostname": "my.domain.org",
            "port": 8438,
            "username": "selby.kendrick",
            "_id": "AU6yMCedKI-gU2xUq7PY"
        }
    ]
}
```
Request
```http
GET /configurations?page=1&sort=name HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer c2c96b3042bafe9bbe466080bd6d66fbba1a0903f1f6ea61317b27b3887b13b195ce9e5e07f68030ee0cce7d61ceabcd
Cache-Control: no-cache

```
Response
```json
{
    "configurations": [
        {
            "name": "modified123",
            "hostname": "my.domain.org",
            "port": 8438,
            "username": "selby.kendrick",
            "_id": "AU6yMCedKI-gU2xUq7PY"
        },
        {
            "name": "name1",
            "hostname": "some.ssiodjs.com",
            "port": 2324,
            "username": "selby.kendrick",
            "_id": "AU6yBBSiKI-gU2xUq7PT"
        },
        {
            "name": "name123",
            "hostname": "some.ssiodjs.com",
            "port": 2324,
            "username": "selby.kendrick",
            "_id": "AU6yLgjLKI-gU2xUq7PX"
        }
    ]
}
```
Request
```http
GET /configurations?page=2&sort=name HTTP/1.1
Host: localhost:4443
Content-Type: application/json
Authorization: Bearer c2c96b3042bafe9bbe466080bd6d66fbba1a0903f1f6ea61317b27b3887b13b195ce9e5e07f68030ee0cce7d61ceabcd
Cache-Control: no-cache
```
Response
```json
{
    "configurations": []
}
```

##### Timeline
- Day 1
 - Gauge project by building simple node http server, router, and start on
ElasticSearch client
 - Start a separate ember project and begin figuring out how I could use it to
test the API. Unit tests are my next big hurdle as a SE, and something I'd like
to work on at Tenable
 - Realize afterward that making the Router a singleton was pointless the
way I ended up using it but decided to leave it to show I know what a singleton
is lol
- Day 2
 - Realize I have no idea how to properly document APIs and decide to learn how
to formally define one using the Swagger RESTful API Specification from which beautiful
documentation can be generated (and code, but I didn't cheat =P). Plus, API
specs actually seem like a pretty awesome and extremely useful idea. I love
formal definitions of anything, and it seems like Swagger's doing a pretty good
job even though I hate the name.
- Day 3
 - Polish up the definition of the API I had in mind and generate the documentation I can follow to spec
 - Decide keeping a timeline is a decent way to show my thought process and to
show the learning phase I use on projects what are uncharted territory for me
 - Push the ember stuff to github in case my computer blows up or something
 - Started a new git repository with only the Swagger definition and markdown files
so that I can copy over my draft
 - Got the Router documented and working with a hello world route, now I think all that's left is the ElasticSearch client and to define the routes.
 - I also found a bug in some guy's small project I'm using to generate Bootstrap code from the Swagger specs.  It's bizarrely tiny and ridiculous. 2 extra chars in 10000 lines of CSS. -.-' https://github.com/nknapp/bootprint-swagger/issues/12
- Day 4
 - Copied over basic ElasticSearch client I started on day one
 - Revised API spec again, it's getting pretty polished
 - Realized I don't want to deal with the native Node.js response/request APIs in
in every route, so I started working on a new module, `retort`, that takes care of some
heavy lifting so the router only has to deal with the information it needs
 - Wrote a couple shell scripts to help with housekeeping
 - Have to fix routes to work with `retort`... then I can start actually implementing
the features
 - Decided to try out es6.  Not all features avaliable yet. *cough* importing modules *cough*  Thought compiling node/iojs would do the trick since people claimed it worked on the dev branch, bu.  Apparently they're waiting on Google's v8 so I decided to pull v8's master branch and recompile. Tried compiling from the owner of the Chromium issue with no luck, I think it's gonna be a while before es6 modules see the light of day. http://code.google.com/p/v8/issues/detail?id=1569&q=owner%3Aadamk&colspec=ID%20Type%20Status%20Priority%20Owner%20Summary%20HW%20OS%20Area%20Stars

Stopped updating this and am almost done anyway.  Wish I had spent more time on the Elastic client than the routing, but I was having fun and got carried away.  Also wish I had localized the error messages.  I started to.
