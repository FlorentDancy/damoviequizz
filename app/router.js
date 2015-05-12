define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Play = require("components/play/index");
  var Highscores = require("components/highscores/index");
  var Start = require("components/start/index");
  var gameLayout;
  var options = {
    namespace: 'highscores',
    storages: ['local'],
    expireDays: 1
  };

  var basil = new Basil(options);

  require("collectionCache");
  require("bootstrap");

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    initialize: function() {
      this.highscores = new Highscores.Collection();
      this.round = new Play.Collection();
      this.start = Start.Collection;

      // Use main layout and set Views.
      var Layout = Backbone.Layout.extend({
        el: "main",

        template: require("ldsh!./templates/main"),

        views: {
          ".game": new Start.Views.List()
        }
      });
      
      // Render to the page.
      gameLayout = new Layout();
      gameLayout.render();
    },

    routes: {
      "": "start",
      "play": "play",
      "highscores": "highscores"
    },

    init: function(view){
      if(!basil.get('currentTimer')){
        basil.set('currentTimer', 0);
      }
      gameLayout.setView(".game", view);
      gameLayout.render();
    },

    start: function(){
      this.init(new Start.Views.List());
    },

    play: function() {
      this.init(new Play.Views.List({model : this.round}));
    },

    highscores: function() {
      this.init(new Highscores.Views.List({model : this.highscores}));
    }

  });

  module.exports = Router;
});
