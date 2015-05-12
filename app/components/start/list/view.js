define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Play = require("components/play/index");

  var options = {
    namespace: 'highscores',
    storages: ['local'],
    expireDays: 1
  };

  var basil = new Basil(options);

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    initialize: function() {

    },

    events: {
      "click .start": "startGame"
    },

    startGame: function(){
      basil.set('currentRound', 1);
      basil.set('currentTimer', 0);
    }
  });

  module.exports = Layout;
});
