# Tenable Programming Assessment

My solution to the programming assessment specified in [./docs/Assessment.md](https://github.com/selbyk/tenable-asseessment/blob/master/docs/Assessment.md)

Test frontend and pretty documentation can be found at [tenable.selby.io](http://tenable.selby.io/)

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
 - Have to fix routes to work with `retort`...

References Used:
- [https://nodejs.org/api/](https://nodejs.org/api/)
- [Nessus 5.0 REST Protocol
Specification [pdf]](http://static.tenable.com/documentation/nessus_5.0_XMLRPC_protocol_guide.pdf)
