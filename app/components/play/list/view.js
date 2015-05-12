define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var PlayCollection = require("../../play/collection");
  var Item = require("../item/view");
  var TimerJquery = require("timerjquery");

  var options = {
    namespace: 'highscores',
    storages: ['local'],
    expireDays: 1
  };

  var basil = new Basil(options);
  var rounds = new PlayCollection();

  var timer;

  /* TODO A METTRE DANS LE MODEL
  this.round = 0;
  this.currentActorId = "";
  this.currentMovie = "";*/

  this.actors = {};
  this.popularMovies = {};


  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    serialize: function() {
      return { currentRound: rounds };
    },

    events: {
      "click .answer": "checkAnswer"
    },

    checkAnswer: function(ev){

      var goodAnswer;
      var elem = $(this);
      //TODO utiliser variable du modèle directement
      //currentMovie["casting"].indexOf(currentActorId) > -1 ? goodAnswer = true : goodAnswer = false;
      if((goodAnswer && elem.hasClass("yes")) || (!goodAnswer && elem.hasClass("no"))) {
        this.nextRound();
        //TODO Update value of round dans la collection
        /*this.round =+1 ;*/
      }
      else{
        this.gameOver();
      }
    },

    saveHighscore: function(name, score, time){

      var keys = basil.keys();
      var largestKey;
      $.isEmptyObject(keys) ? largestKey = 0 : largestKey = Math.max.apply( Math, keys );
      var newKey = largestKey + 1;
      newKey = newKey.toString();
      basil.set(newKey, {"name" : name, "score" : score,  "time" : time});

    },

    nextRound: function(){
      //TODO Sélection au hasard d'un nouvel acteur et d'un film
      //TODO Maj de leurs valeurs dans la collection
      //TODO Actualiser la vue

      var newRound = {
        "currentActor" : {
          "actorName" : "nom",
          "actorFirstName" : "prénom",
          "actorId" : "0"
        },
        "currentMovie" : {
          "posterUrl" : "https://www.movieposter.com/posters/archive/main/24/MPW-12495",
          "casting" : ["0"]
        },
        "currentRoundNumber": 0
      };
      rounds.reset();
      rounds.add(newRound);

      rounds.each(function(round) {
        this.insertView("div", new Item({
          model: round
        }));
      }, this);

    },

    gameOver: function(){
      // stop timer ($('#divId').timer('pause');) and get its value ($('#divId').data('seconds');)
      //    and reset ($('#divId').timer('remove'))
      // open popup
      // if yes alors créer l'objet (data seconds, get round du model, valeur de l'input pour name) et saveHighscore
      // puis fermer la modale
      // et créer nouveau round
    },

    beforeRender: function(){
      this.nextRound();
    },

    afterRender: function(){

      //Instance of the timer
      $(".timer").timer();

      //Get new datas for the round
      this.nextRound();
    },

    initialize: function() {

      this.listenTo(this.model, "change", this.render);

      //Appel API pour get liste popular movies
      //Populate l'objet "popularMovies"
      //Populate l'objet "actors" en prenant tous les acteurs de tous les popularMovies

    }

  });

  module.exports = Layout;
});
