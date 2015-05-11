define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Item = require("../item/view");
  var HighscoresCollection = require("../collection");

  var options = {
    namespace: 'highscores',
    storages: ['local'],
    expireDays: 1
  };

  var basil = new Basil(options);
  var highscores = new HighscoresCollection();

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    events : {
      "click .reset" : "resetHighscores"
    },

    resetHighscores: function(){
      basil.reset();
      highscores.reset();
    },

    beforeRender: function() {
      if (this.collection && this.collection.length){
        this.collection.each(function(highscore) {
          this.insertView("ul", new Item({
            model: highscore
          }));
        }, this);
      }
    },

    initialize: function() {
      // Whenever the collection resets, re-render.
      //this.listenTo(this.collection, "sync request reset", this.render);
    }
  });

  module.exports = Layout;
});
