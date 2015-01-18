/**
 * @license Videogular v0.7.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.poster:vgPoster
 * @restrict E
 * @description
 * Shows an image when player hasn't been played or has been completed a video.
 *
 * @param {string} vgUrl String with a scope name variable. URL to an image supported by the img tag.
 * **This parameter is required.**
 *
 * ```html
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-poster vg-url='config.plugins.poster.url'></vg-poster>
 * </videogular>
 * ```
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.poster", [])
	.directive("vgPoster",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        scope: {
          vgUrl: "=?"
        },
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'bower_components/vg-poster/views/vg-poster.html';
        },
        link: function (scope, elem, attr, API) {
          scope.API = API;

          if (API.isConfig) {
            scope.$watch("API.config",
              function() {
                if (scope.API.config) {
                  scope.vgUrl = scope.API.config.plugins.poster.url;
                }
              }
            );
          }
        }
      }
    }]
  );
