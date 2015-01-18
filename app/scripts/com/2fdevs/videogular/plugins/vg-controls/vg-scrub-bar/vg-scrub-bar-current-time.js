/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgScrubBarCurrentTime
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
            if (newCurrentTime && API.totalTime) {
              var currentISO = newCurrentTime.getTime() - (API.totalTime.getTimezoneOffset() * 60000);
              var totalISO = API.totalTime.getTime() - (API.totalTime.getTimezoneOffset() * 60000);
              percentTime = (currentISO * -1 / 1000) * 100 / (totalISO * -1 / 1000);
              elem.css("width", percentTime + "%");
            }
          };

          scope.onComplete = function onComplete() {
            percentTime = 0;
            elem.css("width", percentTime + "%");
          };

          scope.$watch(
            function () {
              return API.currentTime;
            },
            function (newVal, oldVal) {
              scope.onUpdateTime(newVal);
            }
          );

          scope.$watch(
            function () {
              return API.isCompleted;
            },
            function (newVal, oldVal) {
              scope.onComplete(newVal);
            }
          );
        }
      }
    }]
  );
