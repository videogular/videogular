/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.vgMedia
 * @restrict E
 * @description
 * Directive to add a source of videos or audios. This directive will create a &lt;video&gt; tag and usually will be above plugin tags.
 *
 * @param {array} vgSrc Bindable array with a list of media sources. A media source is an object with two properties `src` and `type`. The `src` property must contains a trusful url resource.
 * {src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgMedia",
  ["$timeout", "VG_STATES", function ($timeout, VG_STATES) {
    return {
      restrict: "E",
      require: "^videogular",
      templateUrl: function(elem, attrs) {
        return attrs.vgTemplate || 'bower_components/videogular/views/vg-media.html';
      },
      scope: {
        vgSrc: "=?"
      },
      link: function (scope, elem, attr, API) {
        var sources;

        // FUNCTIONS
        scope.onChangeSource = function onChangeSource(newValue, oldValue) {
          if ((!sources || newValue != oldValue) && newValue) {
            sources = newValue;
            API.sources = sources;
            scope.changeSource();
          }
        };

        scope.changeSource = function changeSource() {
          var canPlay = "";

          // It's a cool browser
          if (API.mediaElement[0].canPlayType) {
            for (var i = 0, l = sources.length; i < l; i++) {
              canPlay = API.mediaElement[0].canPlayType(sources[i].type);

              if (canPlay == "maybe" || canPlay == "probably") {
                API.mediaElement.attr("src", sources[i].src);
                API.mediaElement.attr("type", sources[i].type);
                break;
              }
            }
          }
          // It's a crappy browser and it doesn't deserve any respect
          else {
            // Get H264 or the first one
            API.mediaElement.attr("src", sources[0].src);
            API.mediaElement.attr("type", sources[0].type);
          }

          $timeout(function() {
            if (API.autoPlay && !VG_UTILS.isMobileDevice() || API.currentState === VG_STATES.PLAY) API.play();
          });

          if (canPlay == "") {
            API.onVideoError();
          }
        };

        // INIT
        API.mediaElement = elem.find("video");
        API.sources = scope.vgSrc;

        API.addListeners();
        API.onVideoReady();

        scope.$watch("vgSrc", scope.onChangeSource);

        if (API.isConfig) {
          scope.$watch(
            function() {
              return API.config;
            },
            function() {
              if (API.config) {
                scope.vgSrc = API.config.sources;
              }
            }
          );
        }
      }
    }
  }
  ]);
