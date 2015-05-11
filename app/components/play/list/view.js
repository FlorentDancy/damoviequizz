define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var HighscoresCollection = require("../../highscores/collection");

  var options = {
    namespace: 'highscores',
    storages: ['local'],
    expireDays: 1
  };

  var basil = new Basil(options);
  var highscores = new HighscoresCollection();

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    serialize: function() {
      return { currentRound: this.model };
    },

    events: {
      //click: "changeUser"
    },

    saveHighscore: function(name, score, time){

      var keys = basil.keys();
      var largestKey;
      $.isEmptyObject(keys) ? largestKey = 0 : largestKey = Math.max.apply( Math, keys );
      var newKey = largestKey + 1;
      newKey = newKey.toString();
      basil.set(newKey, {"name" : name, "score" : score,  "time" : time});

    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    }

    /*updateOrg: function(ev) {
     app.router.go("org", this.$(".org").val());

     return false;
     }*/
  });

  module.exports = Layout;
});
