/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgVolumeBar
 * @restrict E
 * @description
 * Directive to display a vertical volume bar to control the volume.
 * This directive must be inside vg-volume directive and requires vg-mute-button to be displayed.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *            <vg-volume-bar><vg-volume-bar>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-volume-bar",
        '<div class="verticalVolumeBar">\
          <div class="volumeBackground" ng-click="onClickVolume($event)" ng-mousedown="onMouseDownVolume()" ng-mouseup="onMouseUpVolume()" ng-mousemove="onMouseMoveVolume($event)" ng-mouseleave="onMouseLeaveVolume()">\
            <div class="volumeValue"></div>\
            <div class="volumeClickArea"></div>\
          </div>\
        </div>');
    }]
  )
  .directive("vgVolumeBar",
    ["VG_UTILS", function (VG_UTILS) {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-volume-bar';
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

          scope.updateVolumeView = function updateVolumeView(value) {
            value = value * 100;
            volumeValueElem.css("height", value + "%");
            volumeValueElem.css("top", (100 - value) + "%");
          };

          scope.onChangeVisibility = function onChangeVisibility(value) {
            elem.css("visibility", value);
          };

          elem.css("visibility", scope.volumeVisibility);

          scope.$watch("volumeVisibility", scope.onChangeVisibility);

          scope.$watch(
            function () {
              return API.volume;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.updateVolumeView(newVal);
              }
            }
          );
        }
      }
    }]
  );
