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
      // Set up the highscores.
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

      gameLayout = Layout;
      
      // Render to the page.
      new Layout().render();
    },

    routes: {
      "": "start",
      "play": "play",
      "highscores": "highscores"
    },

    start: function(){
      //gameLayout.removeView(".game");
      //gameLayout.setView(".game", new StartView());
    },

    play: function() {
      // Reset the state and render.
      //this.reset();
      //this.round.fetch();
    },

    highscores: function() {
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
