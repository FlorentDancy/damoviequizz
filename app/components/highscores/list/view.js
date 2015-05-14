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
      highscores.each(function(highscore) {
        this.insertView("ul", new Item({
          model: highscore
        }));
      }, this);
    },

    serialize: function() {
      return { highscores: highscores };
    },

    //Pour trier les éléments de la collection
    /*comparator: function (model) {
      return model.get("score");
    },*/

    initialize: function() {
      this.listenTo(highscores, "reset", this.render);

      var entries = basil.keys();
      highscores.reset();
      $.each(entries, function(key, value){
        if(!isNaN(value)){
          var entry = {
            "name" : basil.get(value)['name'],
            "score" : basil.get(value)['score'],
            "time" : basil.get(value)['time']
          };
          highscores.add(entry);
        }
      });
      this.render();

    }
  });

  module.exports = Layout;
});
