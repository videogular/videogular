/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:ngPlaybackButton
 * @restrict E
 * @description
 * Directive to display a playback buttom to control the playback rate.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-playback-button></vg-playback-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-playback-button",
        '<button class="playbackValue iconButton" ng-click="onClickPlayback()">{{playback}}x</button>');
    }]
  )
  .directive("vgPlaybackButton",
    ["VG_UTILS", function (VG_UTILS) {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-playback-button';
        },
        link: function (scope, elem, attr, API) {

          scope.playback = '1.0';

          scope.onClickPlayback = function onClickPlayback() {

            var playbackOptions = ['.5', '1.0', '1.5', '2.0'];
            
            var nextPlaybackRate = playbackOptions.indexOf(scope.playback)+1;

            if(nextPlaybackRate >= playbackOptions.length) {
                scope.playback = playbackOptions[0];
            }
            else {
                scope.playback = playbackOptions[nextPlaybackRate];
            }

            API.setPlayback(scope.playback);
          };

          scope.$watch(
            function () {
              return API.playback;
            }
          );
        }
      }
    }]
  );