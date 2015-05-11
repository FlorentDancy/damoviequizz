define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Play = require("components/play/index");
  var Highscores = require("components/highscores/index");
  var Start = require("components/start/index");
  var gameLayout;

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
          ".game": new Play.Views.List({model : this.round})
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

    start: function(){
      gameLayout.setView(".game", new Start.Views.List());
      gameLayout.render();
    },

    play: function() {
      gameLayout.setView(".game", new Play.Views.List({model : this.round}));
      gameLayout.render();
      // Reset the state and render.
      //this.reset();
      //this.round.fetch();
    },

    highscores: function() {
      gameLayout.setView(".game", new Highscores.Views.List({model : this.highscores}));
      gameLayout.render();
      //Clear the data
      //this.highscores.clear();
      // Fetch the data.
      //this.highscores.fetch();
    },

    reset: function(){
      // Reset collections to initial state.
      //this.play.reset();
    }
  });

  module.exports = Router;
});
