require.config({
  paths: {
    // Make vendor easier to access.
    //"vendor": "../bower_components",

    // Almond is used to lighten the output filesize.
    "almond": "../bower_components/almond/almond",

    // Opt for Lo-Dash Underscore compatibility build over Underscore.
    "underscore": "../bower_components/lodash/dist/lodash.underscore",

    // Map `lodash` to a valid location for the template loader plugin.
    "lodash": "../bower_components/lodash/dist/lodash",

    // Use the Lo-Dash template loader.
    "ldsh": "../bower_components/lodash-template-loader/loader",

    // Map remaining vendor dependencies.
    "jquery": "../bower_components/jquery/jquery",
    "backbone": "../bower_components/backbone/backbone",
    "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
    "layoutmanager": "../bower_components/layoutmanager/backbone.layoutmanager",
    "collectionCache": "../vendor/backbone.collectioncache",
    "basil": "../vendor/basil"
  },

  shim: {
    // This is required to ensure Backbone works as expected within the AMD
    // environment.
    "backbone": {
      // These are the two hard dependencies that will be loaded first.
      deps: ["jquery", "underscore"],

      // This maps the global `Backbone` object to `require("backbone")`.
      exports: "Backbone"
    },

    // Backbone.CollectionCache depends on Backbone.
    "collectionCache": ["backbone"],

    // Twitter Bootstrap depends on jQuery.
    "bootstrap": ["jquery"]
  }
});
