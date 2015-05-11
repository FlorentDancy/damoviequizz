define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Item = require("../item/view");

  var options = {
    namespace: 'highscores',
    storages: ['local'],
    expireDays: 1
  };

  var basil = new Basil(options);

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    serialize: function() {
      return { highscores: this.collection };
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
