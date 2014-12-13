"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgLoop",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: {
        pre: function (scope, elem, attr, API) {
          var loop;

          scope.$watch(attr.vgLoop, function (newValue, oldValue) {
            if ((!loop || newValue != oldValue) && newValue) {
              loop = newValue;
              API.mediaElement.attr("loop", loop);
            }
            else {
              API.mediaElement.removeAttr("loop");
            }
          });
        }
      }
    }
  }
  ]);
