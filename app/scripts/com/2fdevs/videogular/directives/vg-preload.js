/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:vgPreload
 * @restrict A
 * @description
 * Optional directive for `vg-media` to preload media files. Possible values are: "auto", "none" and "preload"
 *
 */
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

          scope.setPreload = function setPreload(value) {
            if (value) {
              API.mediaElement.attr("preload", value);
            }
            else {
              API.mediaElement.removeAttr("preload");
            }
          };

          if (API.isConfig) {
            scope.$watch(
              function() {
                return API.config;
              },
              function() {
                if (API.config) {
                  scope.setPreload(API.config.preload);
                }
              }
            );
          }
          else {
            scope.$watch(attr.vgPreload, function (newValue, oldValue) {
              if ((!preload || newValue != oldValue) && newValue) {
                preload = newValue;
                scope.setPreload(preload);
              }
              else {
                scope.setPreload();
              }
            });
          }
        }
      }
    }
  }
  ]);
