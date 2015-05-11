Da Movie Quizz
=============


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
