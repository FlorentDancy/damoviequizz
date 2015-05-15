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

    notify: function(color, message){
      $(".message").text(message);

      if(color === "green"){
        $(".message").addClass("alert-success");
      }
      else if (color === "red"){
        $(".message").addClass("alert-danger");
      }

      $(".message").fadeIn(2000)
        .fadeOut(5000, function(e) {

          if(color === "green"){
            $(".message").removeClass("alert-success");
          }
          else if (color === "red"){
            $(".message").removeClass("alert-danger");
          }

        });
    },

    checkAnswer: function(ev){

      var goodAnswer = false;
      var that = this;
      var elem = ev.target;
      var currentCast = rounds["models"][0]["attributes"]["currentMovie"]["cast"];
      var currentActorId = rounds["models"][0]["attributes"]["currentActor"]["actorId"];

      $.each(currentCast, function(key, value){
        if(currentCast[key]['id'] === currentActorId){
          goodAnswer = true;
        }
      });

      if((goodAnswer && $(elem).hasClass("yes")) || (!goodAnswer && $(elem).hasClass("no"))) {

        basil.set('currentRound', basil.get('currentRound') + 1);
        if(basil.get('currentRound') % 10 === 0){
          this.notify("green", "Tu as gagné une vie ! :)");
          basil.set('currentLives', basil.get('currentLives') + 1);
        }
        this.nextRound(true);
      }
      else{
        if(basil.get('currentLives') > 0){
          this.notify("red", "Tu as perdu une vie ! :(");
          basil.set('currentLives', basil.get('currentLives') - 1);
          this.nextRound(true);
        }
        else{
          this.gameOver();
        }

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
      console.log("Start game over");
      var finalTime = basil.get('currentTimer');
      var finalScore = basil.get('currentScore');
      //    and reset ($('#divId').timer('remove')) ?
      // open popup
      // if yes alors créer l'objet (data seconds, get round du model, valeur de l'input pour name) et saveHighscore
      // puis fermer la modale
      // et créer nouveau round
    },

    beforeRender: function(){
      var that = this;
      rounds.each(function(round) {
        that.setView("", new Item({ model: round }));
      }, that);
    },

    afterRender: function(){

      //Instance of the timer
      $(".timer").timer({seconds: basil.get('currentTimer')});

      //Update currentTimer to be able to resume after changing views
      this.liveUpdateTimer();

    },

    liveUpdateTimer: function(){

      if(basil.get('currentTimer') === 0){
        setInterval(function(){
          if($('.timer').data('seconds') > -1){
            basil.set('currentTimer', $('.timer').data('seconds'));
          }
          else{
            basil.set('currentTimer', basil.get('currentTimer') + 1);
          }
        }, 1000);
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
      var currentActorId;

      $.when(this.getData()).done(function(){

        var currentMovie = that.randomProperty(popularMovies);
        var currentLives = basil.get("currentLives");

        if(Math.floor(Math.random() * 2) === 0){
          currentActorId = actors[Math.floor(Math.random() * actors.length)];
        }
        else{
          //FIXME Asynchro
          if(currentMovie["cast"]){
            currentActorId = currentMovie["cast"][Math.floor(Math.random() * currentMovie["cast"].length)]["id"];
          }
          else{
            currentActorId = actors[Math.floor(Math.random() * actors.length)];
          }
        }

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
            "currentRoundNumber": newRoundNumber,
            "currentLives": currentLives
          };

          if(!$.isEmptyObject(rounds["models"])){
            rounds.reset();
          }

          rounds.add(newRound);

          if(render){
            that.render();
          }

        });
      });

    },

    initialize: function() {

      this.listenTo(rounds, "reset", this.render);
      this.nextRound(false);

    }

  });

  module.exports = Layout;
});
