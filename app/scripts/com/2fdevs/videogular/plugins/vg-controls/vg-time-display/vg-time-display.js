/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgTimeDisplay
 * @restrict E
 * @description
 * Adds a time display inside vg-controls to play and pause media.
 * You have three scope variables to show current time, time left and total time.
 *
 * Those scope variables are type Date so you can add a date filter to show the time as you wish.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-time-display>{{currentTime | date:'hh:mm'}}</vg-time-display>
 *        <vg-time-display>{{timeLeft | date:'mm:ss'}}</vg-time-display>
 *        <vg-time-display>{{totalTime | date:'hh:mm:ss'}}</vg-time-display>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgTimeDisplay",
    [function () {
      return {
        require: "^videogular",
        restrict: "E",
        link: function (scope, elem, attr, API) {
          scope.currentTime = API.currentTime;
          scope.timeLeft = API.timeLeft;
          scope.totalTime = API.totalTime;
          scope.isLive = API.isLive;

          scope.$watch(
            function () {
              return API.currentTime;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.currentTime = newVal;
              }
            }
          );

          scope.$watch(
            function () {
              return API.timeLeft;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.timeLeft = newVal;
              }
            }
          );

          scope.$watch(
            function () {
              return API.totalTime;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.totalTime = newVal;
              }
            }
          );

          scope.$watch(
            function () {
              return API.isLive;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.isLive = newVal;
              }
            }
          );
        }
      }
    }]
  );
