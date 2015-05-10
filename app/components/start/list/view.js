define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Play = require("components/play/index");

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    initialize: function() {

    },

    events: {
      "click .start": "startGame"
    },

    startGame: function(){

    }
  });

  module.exports = Layout;
});
