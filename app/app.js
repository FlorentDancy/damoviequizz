define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Layout = require("layoutmanager");
  var Basil = require("basil");

  // Alias the module for easier identification.
  var app = module.exports;

  // The root path to run the application through.
  app.root = "/";

  // API endpoint.
  app.api = "http://api.themoviedb.org/3/";
  app.apikey = "7ea5f490261a949e52930517e1b4657c";

});
