define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Collection = Backbone.Collection.extend({
    url: function() {
      //return app.api + "users/" + this.user + "/repos?callback=?";
    }
  });

  module.exports = Collection;
});
