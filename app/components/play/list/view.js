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
      "click .answer": "checkAnswer",
      "click .modal-answer": "handleModalAnswer"
    },

    notify: function(color, message, elem){
      elem.text(message);

      if(color === "green"){
        elem.addClass("alert-success");
      }
      else if (color === "red"){
        elem.addClass("alert-danger");
      }
      else if (color === "blue"){
        elem.addClass("alert-info");
      }

      elem.fadeIn(2000)
        .fadeOut(5000, function(e) {

          if(color === "green"){
            elem.removeClass("alert-success");
          }
          else if (color === "red"){
            elem.removeClass("alert-danger");
          }
          else if (color === "blue"){
            elem.removeClass("alert-info");
          }

        });
    },

    checkAnswer: function(ev){

      var goodAnswer = false;
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
          this.notify("green", "Tu as gagné une vie ! :)", $(".message"));
          basil.set('currentLives', basil.get('currentLives') + 1);
        }
        this.checkHighscore(basil.get('currentRound'));
        this.nextRound(true);
      }
      else{
        if(basil.get('currentLives') > 0){
          this.notify("red", "Tu as perdu une vie ! :(", $(".message"));
          basil.set('currentLives', basil.get('currentLives') - 1);
          this.nextRound(true);
        }
        else{
          this.gameOver();
        }

      }

    },

    checkHighscore: function(currentScore){
      if(basil.get('1') === null){
        this.notify("blue", "Nouveau meilleur score !", $(".message"));
      }
      else{
        if(currentScore == basil.get('1')["score"] + 1){
          this.notify("blue", "Nouveau meilleur score !", $(".message"));
        }
      }

    },

    getHighscores: function(keys){
      var that = this;

      $.each(keys, function(key, value){
        if(isNaN(value)){
          keys.splice(key, 1);
          that.getHighscores(keys);
        }
      });

    },

    saveHighscore: function(name, score, time){

      var keys = basil.keys();
      this.getHighscores(keys);
      var highscores= [];

      $.each(keys, function(key, value){
        highscores.push([value, basil.get(value)["name"], basil.get(value)["score"], basil.get(value)["time"]])
      });

      var newHighscoreKey = highscores.length + 1;
      newHighscoreKey = newHighscoreKey.toString();

      if(!$.isEmptyObject(highscores)){

        for(var i = 0; i < highscores.length; i++){
          if(score > highscores[i][2]){
            newHighscoreKey = i + 1; break;
          }
        }

        if(newHighscoreKey < 11){
          for(var j = highscores.length; j > newHighscoreKey - 1; j--){
            var newKey = j+1;
            newKey = newKey.toString();
            basil.set(newKey, {"name" : highscores[j - 1][1], "score" : highscores[j - 1][2],  "time" : highscores[j - 1][3]});

          }

          newHighscoreKey = newHighscoreKey.toString();
        }


      }

      if(newHighscoreKey < 11) {
        basil.set(newHighscoreKey, {"name": name, "score": score, "time": time});
      }

    },

    randomProperty: function (obj) {
      var keys = Object.keys(obj);
      return obj[keys[ keys.length * Math.random() << 0]];
    },

    gameOver: function(){
      $(".score-modal").text(basil.get('currentRound'));
      $(".time-modal").text(basil.get('currentTimer'));
      $("#gameOverModal").modal('show');
    },

    handleModalAnswer: function(e){
      if($(e.target).hasClass("modal-save")){

        if(!$(".username-modal").val()){
          this.notify("red", "Indique ton nom !", $(".message-modal"));
        }
        else{
          this.saveHighscore($(".username-modal").val(), $(".score-modal").text(), $(".time-modal").text());
          $("#gameOverModal").modal('hide');
          this.reset();
        }

      }
      else{
        $("#gameOverModal").modal('hide');
        this.reset();
      }

    },

    reset: function(){
      basil.set('currentRound', 1);
      basil.set('currentTimer', 0);
      basil.set('currentLives', 3);
      this.initialize();
    },

    beforeRender: function(){
      var that = this;
      rounds.each(function(round) {
        that.setView("div", new Item({ model: round }));
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

      $.when(this.getData()).done(function(){

        var currentMovie = that.randomProperty(popularMovies);
        var currentActorId = actors[Math.floor(Math.random() * actors.length)];
        var currentLives = basil.get("currentLives");

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
