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

          function setPreload(value) {
            if (value) {
              API.mediaElement.attr("preload", value);
            }
            else {
              API.mediaElement.removeAttr("preload");
            }
          }

          if (API.isConfig) {
            scope.$watch(
              function() {
                return API.config;
              },
              function() {
                if (API.config) {
                  setPreload(API.config.preload);
                }
              }
            );
          }
          else {
            scope.$watch(attr.vgPreload, function (newValue, oldValue) {
              if ((!preload || newValue != oldValue) && newValue) {
                preload = newValue;
                setPreload(preload);
              }
              else {
                setPreload();
              }
            });
          }
        }
      }
    }
  }
  ]);
