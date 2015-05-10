define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    serialize: function() {
      return { currentRound: this.model };
    },

    events: {
      //click: "changeUser"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    /*updateOrg: function(ev) {
     app.router.go("org", this.$(".org").val());

     return false;
     }*/
  });

  module.exports = Layout;
});
