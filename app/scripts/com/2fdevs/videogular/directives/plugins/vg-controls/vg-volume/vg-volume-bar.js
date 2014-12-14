/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgVolumeBar
 * @restrict E
 * @description
 * Directive to display a vertical volume bar to control the volume.
 * This directive must be inside vg-volume directive and requires vg-mute-button to be displayed.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *            <vg-volume-bar><vg-volume-bar>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgVolumeBar",
    ["VG_UTILS", function (VG_UTILS) {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'scripts/com/2fdevs/videogular/directives/plugins/vg-controls/vg-volume/views/vg-volume-bar.html';
        },
        link: function (scope, elem, attr, API) {
          var isChangingVolume = false;
          var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
          var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));

          scope.onClickVolume = function onClickVolume(event) {
            event = VG_UTILS.fixEventOffset(event);
            var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
            var value = event.offsetY * 100 / volumeHeight;
            var volValue = 1 - (value / 100);

            API.setVolume(volValue);
          };

          scope.onMouseDownVolume = function onMouseDownVolume() {
            isChangingVolume = true;
          };

          scope.onMouseUpVolume = function onMouseUpVolume() {
            isChangingVolume = false;
          };

          scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
            isChangingVolume = false;
          };

          scope.onMouseMoveVolume = function onMouseMoveVolume(event) {
            if (isChangingVolume) {
              event = VG_UTILS.fixEventOffset(event);
              var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
              var value = event.offsetY * 100 / volumeHeight;
              var volValue = 1 - (value / 100);

              API.setVolume(volValue);
            }
          };

          function updateVolumeView(value) {
            value = value * 100;
            volumeValueElem.css("height", value + "%");
            volumeValueElem.css("top", (100 - value) + "%");
          }

          function onChangeVisibility(value) {
            elem.css("visibility", value);
          }

          elem.css("visibility", scope.volumeVisibility);

          scope.$watch("volumeVisibility", onChangeVisibility);

          scope.$watch(
            function () {
              return API.volume;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                updateVolumeView(newVal);
              }
            }
          );
        }
      }
    }]
  );
