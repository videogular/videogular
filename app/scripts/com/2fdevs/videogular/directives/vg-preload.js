"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgPreload",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: {
        pre: function (scope, elem, attr, API) {
          var preload;

          scope.$watch(attr.vgPreload, function (newValue, oldValue) {
            if ((!preload || newValue != oldValue) && newValue) {
              preload = newValue;
              API.mediaElement.attr("preload", preload);
            }
            else {
              API.mediaElement.removeAttr("preload");
            }
          });
        }
      }
    }
  }
  ]);
