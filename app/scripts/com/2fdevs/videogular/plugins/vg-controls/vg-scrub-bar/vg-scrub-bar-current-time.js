/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarCurrentTime
 * @restrict E
 * @description
 * Layer inside vg-scrubbar to display the current time.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrubbar>
 *            <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
 *        </vg-scrubbar>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgScrubBarCurrentTime",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        link: function (scope, elem, attr, API) {
          var percentTime = 0;

          scope.onUpdateTime = function onUpdateTime(newCurrentTime) {
            if (typeof newCurrentTime === 'number' && API.totalTime) {
              percentTime = 100 * (newCurrentTime / API.totalTime);
              elem.css("width", percentTime + "%");
            } else {
              elem.css("width", 0);
            }
          };

          scope.$watch(
            function () {
              return API.currentTime;
            },
            function (newVal, oldVal) {
              scope.onUpdateTime(newVal);
            }
          );
        }
      }
    }]
  );
