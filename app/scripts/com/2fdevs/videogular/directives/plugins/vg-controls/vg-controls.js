/**
 * @license Videogular v0.7.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgControls
 * @restrict E
 * @description
 * This directive acts as a container and you will need other directives to control the media.
 * Inside this directive you can add other directives like vg-play-pause-button and vg-scrubbar.
 *
 * @param {boolean=false} vgAutohide Boolean variable or value to activate autohide.
 * @param {number=2000} vgAutohideTime Number variable or value that represents the time in milliseconds that will wait vgControls until it hides.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'></vg-controls>
 * </videogular>
 * ```
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.controls", [])
	.directive("vgControls",
    ["$timeout", function ($timeout) {
      return {
        restrict: "E",
        require: "^videogular",
        transclude: true,
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'scripts/com/2fdevs/videogular/directives/plugins/vg-controls/views/vg-controls.html';
        },
        scope: {
          vgAutohide: "=?",
          vgAutohideTime: "=?"
        },
        link: function (scope, elem, attr, API) {
          var w = 0;
          var h = 0;
          var autoHideTime = 2000;
          var hideInterval;

          scope.API = API;

          scope.onMouseMove = function onMouseMove() {
            if (scope.vgAutohide) showControls();
          };

          function setAutohide(value) {
            if (value) {
              hideInterval = $timeout(hideControls, autoHideTime);
            }
            else {
              scope.animationClass = "";
              $timeout.cancel(hideInterval);
              showControls();
            }
          }

          function setAutohideTime(value) {
            autoHideTime = value;
          }

          function hideControls() {
            scope.animationClass = "hide-animation";
          }

          function showControls() {
            scope.animationClass = "show-animation";
            $timeout.cancel(hideInterval);
            if (scope.vgAutohide) hideInterval = $timeout(hideControls, autoHideTime);
          }

          if (API.isConfig) {
            scope.$watch("API.config",
              function() {
                if (scope.API.config) {
                  var ahValue = scope.API.config.plugins.controls.autohide || false;
                  var ahtValue = scope.API.config.plugins.controls.autohideTime || 2000;
                  scope.vgAutohide = ahValue;
                  scope.vgAutohideTime = ahtValue;
                  setAutohideTime(ahtValue);
                  setAutohide(ahValue);
                }
              }
            );
          }
          else {
            // If vg-autohide has been set
            if (scope.vgAutohide != undefined) {
              scope.$watch("vgAutohide", setAutohide);
            }

            // If vg-autohide-time has been set
            if (scope.vgAutohideTime != undefined) {
              scope.$watch("vgAutohideTime", setAutohideTime);
            }
          }
        }
      }
    }]
  );
