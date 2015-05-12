define(function(require, exports, module) {
  "use strict";

  module.exports = {
    Collection: require("./collection"),

    Views: {
      List: require("./list/view"),
      Item: require("./item/view")
    }
  };
});
