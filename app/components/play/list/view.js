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
  var actors = [];
  var popularMovies = {};


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
      //TODO récupérer les valeurs via collection ?
      //currentMovie["casting"].indexOf(currentActorId) > -1 ? goodAnswer = true : goodAnswer = false;
      if((goodAnswer && elem.hasClass("yes")) || (!goodAnswer && elem.hasClass("no"))) {
        basil.set('currentRound', basil.get('currentRound') + 1);
        this.nextRound(true);
      }
      else{
        this.gameOver();
      }
    },

    getHighscores: function(keys){
      var that = this;
      $.each(keys, function(key, value){
        if(typeof value !== 'number'){
          keys.splice(key, 1);
          that.getHighscores(keys);
        }
      });
    },

    saveHighscore: function(name, score, time){

      var keys = basil.keys();
      this.getHighscores(keys);
      var largestKey;
      $.isEmptyObject(keys) ? largestKey = 0 : largestKey = Math.max.apply( Math, keys );
      var newKey = largestKey + 1;
      newKey = newKey.toString();
      basil.set(newKey, {"name" : name, "score" : score,  "time" : time});

    },

    randomProperty: function (obj) {
      var keys = Object.keys(obj);
      return obj[keys[ keys.length * Math.random() << 0]];
    },

    gameOver: function(){
      var finalTime = basil.get('currentTimer');
      //    and reset ($('#divId').timer('remove')) ?
      // open popup
      // if yes alors créer l'objet (data seconds, get round du model, valeur de l'input pour name) et saveHighscore
      // puis fermer la modale
      // et créer nouveau round
    },

    beforeRender: function(){
      this.nextRound(false);
    },

    afterRender: function(){

      //Instance of the timer
      $(".timer").timer({seconds: basil.get('currentTimer')});

      //Update currentTimer to be able to resume after changing views
      if($('.timer').data('seconds') > -1){
        setInterval(function(){ basil.set('currentTimer', $('.timer').data('seconds')); }, 1000);
      }

    },

    getData: function(){
      var dfd = $.Deferred();
      var getPopularMovies = $.ajax({
        method: "GET",
        url: app.api + "movie/popular",
        data: { api_key: app.apikey }
      });

      getPopularMovies.done(function( msg ) {
        popularMovies = msg.results;

        $.each(popularMovies, function(key, value){

          var getCast = $.ajax({
            method: "GET",
            url: app.api + "movie/"+ value['id'] +"/credits",
            data: { api_key: app.apikey }
          });

          getCast.done(function(data){
            popularMovies[key]["cast"] = data["cast"];

            $.each(popularMovies[key]["cast"], function(key, value){
              actors.push(value["id"]);
            });

            dfd.resolve();
          });

        });
      });

      return dfd.promise();
    },

    nextRound: function(render){
      var newRoundNumber =  basil.get('currentRound');
      var that = this;

      $.when(this.getData()).done(function(){

        var currentMovie = that.randomProperty(popularMovies);
        var currentActorId = actors[Math.floor(Math.random() * actors.length)];

        var getActorInfo = $.ajax({
          method: "GET",
          url: app.api + "person/" + currentActorId,
          data: { api_key: app.apikey }
        });

        getActorInfo.done(function( data ) {

          var newRound = {
            "currentActor" : {
              "actorName" : data["name"],
              "actorPicture" : data["profile_path"],
              "actorId" : data["id"]
            },
            "currentMovie" : {
              "posterUrl" : currentMovie["poster_path"],
              "cast" : currentMovie["cast"]
            },
            "currentRoundNumber": newRoundNumber
          };

          if(!$.isEmptyObject(rounds["models"])){
            rounds.reset();
            rounds.add(newRound);
          }
          else{
            rounds.add(newRound);
            rounds.each(function(round) {
              that.setView("", new Item({ model: round }));
            }, that);
          }

          // Only trigger render if it not inserted inside `beforeRender`.
          if (render !== false) {
            that.render();
          }

        });
      });

    },

    initialize: function() {
      var that = this;

      //this.listenTo(rounds, "reset", this.render);

      if(!actors.length || $.isEmptyObject(popularMovies)){
        this.getData();
      }

    }

  });

  module.exports = Layout;
});
