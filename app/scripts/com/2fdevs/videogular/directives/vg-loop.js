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

          function setLoop(value) {
            if (value) {
              API.mediaElement.attr("loop", value);
            }
            else {
              API.mediaElement.removeAttr("loop");
            }
          }

          if (API.isConfig) {
            scope.$watch(
              function() {
                return API.config;
              },
              function() {
                if (API.config) {
                  setLoop(API.config.loop);
                }
              }
            );
          }
          else {
            scope.$watch(attr.vgLoop, function (newValue, oldValue) {
              if ((!loop || newValue != oldValue) && newValue) {
                loop = newValue;
                setLoop(loop);
              }
              else {
                setLoop();
              }
            });
          }
        }
      }
    }
  }
  ]);
