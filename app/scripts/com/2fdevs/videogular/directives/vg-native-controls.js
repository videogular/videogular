"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgNativeControls",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: {
        pre: function (scope, elem, attr, API) {
          var controls;

          scope.$watch(attr.vgNativeControls, function (newValue, oldValue) {
            if ((!controls || newValue != oldValue) && newValue) {
              controls = newValue;
              API.mediaElement.attr("controls", "");
            }
            else {
              API.mediaElement.removeAttr("controls");
            }
          });
        }
      }
    }
  }
  ]);
