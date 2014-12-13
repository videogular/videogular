/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgVolume
 * @restrict E
 * @description
 * Directive to control the volume.
 * This directive acts as a container and you will need other directives like vg-mutebutton and vg-volumebar to control the volume.
 * In mobile will be hided since volume API is disabled for mobile devices.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume></vg-volume>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgVolume",
    ["VG_UTILS", function (VG_UTILS) {
      return {
        restrict: "E",
        link: function (scope, elem, attr) {
          function onMouseOverVolume() {
            scope.volumeVisibility = "visible";
            scope.$apply();
          }

          function onMouseLeaveVolume() {
            scope.volumeVisibility = "hidden";
            scope.$apply();
          }

          // We hide volume controls on mobile devices
          if (VG_UTILS.isMobileDevice()) {
            elem.css("display", "none");
          }
          else {
            scope.volumeVisibility = "hidden";

            elem.bind("mouseover", onMouseOverVolume);
            elem.bind("mouseleave", onMouseLeaveVolume);
          }
        }
      }
    }]
  );
