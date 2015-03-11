/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgPlayPauseButton
 * @restrict E
 * @description
 * Adds a button inside vg-controls to play and pause media.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-play-pause-button></vg-play-pause-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-play-pause-button",
        '<button class="iconButton" ng-click="onClickPlayPause()" ng-class="playPauseIcon" aria-label="Play/Pause" type="button"></button>');
    }]
  )
  .directive("vgPlayPauseButton",
    ["VG_STATES", function (VG_STATES) {
      return {
        restrict: "E",
        require: "^videogular",
        scope: {},
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-play-pause-button';
        },
        link: function (scope, elem, attr, API) {
          scope.setState = function setState(newState) {
            switch (newState) {
              case VG_STATES.PLAY:
                scope.playPauseIcon = {pause: true};
                break;

              case VG_STATES.PAUSE:
                scope.playPauseIcon = {play: true};
                break;

              case VG_STATES.STOP:
                scope.playPauseIcon = {play: true};
                break;
            }
          };

          scope.onClickPlayPause = function onClickPlayPause() {
            API.playPause();
          };

          scope.playPauseIcon = {play: true};

          scope.$watch(
            function () {
              return API.currentState;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.setState(newVal);
              }
            }
          );
        }
      }
    }]
  );
