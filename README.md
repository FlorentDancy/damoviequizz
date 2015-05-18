Da Movie Quizz
=============

## Main features ##

- Quizz based on [The Movie Database API](http://docs.themoviedb.apiary.io/)
- Persistency of the timer during navigation between pages, until new game is started
- Possibility to save the score when the game is over
- Persistency of the highscores of the day (10 best highscores)
- Possibility to reset the highscores
- 3 lives when starting a game
- Notification system (when losing a life, when winning a life - every 10 rounds, and when making a new highscore)
- (Not yet, see [PR](https://github.com/FlorentDancy/damoviequizz/pull/1)) 50/50 chance for the answer


## Running locally ##

To run locally you will need to install [Node.js](http://nodejs.org) and
[grunt](http://github.com/gruntjs/grunt).

``` bash
# Clone the repository.
git clone git@github.com:FlorentDancy/damoviequizz.git

# Change directory into it.
cd damoviequizz

# Install the Node dependencies and Bower dependencies.
npm install -q

# Run the server
grunt server
```

## Installation problem ##

If you encounter such an error :

``` bash
# May appear when running `grunt server`
Loading "server.js" tasks...ERROR
>> TypeError: Cannot read property 'prototype' of undefined
Warning: Task "server" not found. Use --force to continue.

```
... then you need to do as follow :
``` bash
nano /node_modules/grunt-bbb-server/package.json

# Now you need to change the version of the http-proxy dependancy, by writing
"http-proxy": "~1.11.1",

# Then you need to run the following commands
cd /node_modules/grunt-bbb-server
npm update

# Finally, you can check that all this process worked by doing...
cat /node_modules/grunt-bbb-server/node_modules/http-proxy/package.json

# ... and check that the version is now 1.11.1

```
[source of the solution](https://github.com/backbone-boilerplate/grunt-bbb-server/pull/9/files)

### Backbone Boilerplate ###

[backbone-boilerplate](https://github.com/tbranyen/backbone-boilerplate)

The foundation of the entire application structure and the deployment assets.
Along with [grunt-bbb](https://github.com/backbone-boilerplate/grunt-bbb) the
application can be tested locally and built for production with the same tool.

### Backbone LayoutManager ###

[backbone.layoutmanager](https://github.com/tbranyen/backbone.layoutmanager)

Used for the general layout and View arrangement.  Is also used to facilitate
re-rendering and collection lists.  One single layout is created throughout
the lifespan of the application and instead the individual regions are updated.

### Backbone CollectionCache ###

[backbone.collectioncache.js](https://gist.github.com/2866702)

This is a *work-in-progress* Backbone plugin to provide a better caching
mechanism for Collections.  It's used within this application to provide
client-side caching in both sessionStorage (persist refresh) and inside memory
for faster lookups.

### Lo-Dash Template Loader ###

[ldsh](https://github.com/tbranyen/lodash-template-loader/)

An AMD plugin for loading and inlining optimized Lo-Dash templates.  Used to
load the templates in a very relative and component-driven way.

### Twitter Bootstrap ###

[bootstrap](https://github.com/twitter/bootstrap/)

Made the design look significantly better than the original.  Responsible for
the entire UI layer.
