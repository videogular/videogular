/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:vgTracks
 * @restrict A
 * @description
 * Optional directive for `vg-media` to add a list of tracks.
 *
 * vgTracks Bindable array with a list of subtitles sources. A track source is an object with five properties: src, kind, srclang, label and default.
 * ```js
 * {
 *    src: "assets/subs/pale-blue-dot.vtt",
 *    kind: "subtitles",
 *    srclang: "en",
 *    label: "English",
 *    default: "true/false"
 * }
 * ```
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgTracks",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: {
        pre: function (scope, elem, attr, API) {
          var tracks;
          var trackText;
          var i;
          var l;

          scope.changeSource = function changeSource() {
            // Remove previous tracks
            var oldTracks = API.mediaElement.children();

            for (i = 0, l = oldTracks.length; i < l; i++) {
              oldTracks[i].remove();
            }

            // Add new tracks
            if (tracks) {
              for (i = 0, l = tracks.length; i < l; i++) {
                trackText = "";
                trackText += '<track ';

                // Add track properties
                for (var prop in tracks[i]) {
                  trackText += prop + '="' + tracks[i][prop] + '" ';
                }

                trackText += '></track>';

                API.mediaElement.append(trackText);
              }
            }
          };

          scope.setTracks = function setTracks(value) {
            // Add tracks to the API to have it available for other plugins (like controls)
            tracks = value;
            API.tracks = value;
            scope.changeSource();
          };

          if (API.isConfig) {
            scope.$watch(
              function() {
                return API.config;
              },
              function() {
                if (API.config) {
                  scope.setTracks(API.config.tracks);
                }
              }
            );
          }
          else {
            scope.$watch(attr.vgTracks, function (newValue, oldValue) {
              if ((!tracks || newValue != oldValue)) {
                scope.setTracks(newValue);
              }
            });
          }
        }
      }
    }
  }
  ]);
