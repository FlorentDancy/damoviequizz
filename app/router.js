define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Play = require("components/play/index");
  var Highscores = require("components/highscores/index");

  require("collectionCache");
  require("bootstrap");

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    initialize: function() {
      // Set up the highscores.
      this.highscores = new Highscores.Collection();
      this.round = new Play.Collection();

      // Use main layout and set Views.
      var Layout = Backbone.Layout.extend({
        el: "main",

        template: require("ldsh!./templates/main"),

        views: {
          //TODO changer pour mettre le bouton "Play ?" par défaut
          ".game": new Play.Views.List({ model: this.round })
        }
      });
      
      // Render to the page.
      new Layout().render();
    },

    routes: {
      "": "start",
      "play": "play",
      "highscores": "highscores"
    },

    play: function() {
      // Reset the state and render.
      //this.reset();
      console.log("play");

    },

    highscores: function() {

      // Fetch the data.
      //this.highscores.fetch();
      console.log("highscores")
    }
  });

  module.exports = Router;
});