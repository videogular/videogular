/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgFullscreenButton
 * @restrict E
 * @description
 * Directive to switch between fullscreen and normal mode.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-fullscreen-button></vg-fullscreen-button>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgFullscreenButton",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        scope: {},
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'bower_components/vg-controls/views/vg-fullscreen-button.html';
        },
        link: function (scope, elem, attr, API) {
          scope.onChangeFullScreen = function onChangeFullScreen(isFullScreen) {
            scope.fullscreenIcon = {enter: !isFullScreen, exit: isFullScreen};
          };

          scope.onClickFullScreen = function onClickFullScreen() {
            API.toggleFullScreen();
          };

          scope.fullscreenIcon = {enter: true};

          scope.$watch(
            function () {
              return API.isFullScreen;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.onChangeFullScreen(newVal);
              }
            }
          );
        }
      }
    }]
  );
