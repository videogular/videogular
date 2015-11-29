/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgVolume
 * @restrict E
 * @description
 * Directive to control the volume.
 * This directive acts as a container and you will need other directives like vg-mutebutton and vg-volumebar to control the volume.
 * In mobile will be hided since volume API is disabled for mobile devices.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume></vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .directive("vgVolume",
    ["VG_UTILS", function (VG_UTILS) {
        return {
            restrict: "E",
            link: function (scope, elem, attr) {
                scope.onMouseOverVolume = function onMouseOverVolume() {
                    scope.$evalAsync(function () {
                        scope.volumeVisibility = "visible";
                    });
                };

                scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
                    scope.$evalAsync(function () {
                        scope.volumeVisibility = "hidden";
                    });
                };

                scope.onDestroy = function() {
                    elem.unbind("mouseover", scope.onScrubBarTouchStart);
                    elem.unbind("mouseleave", scope.onScrubBarTouchEnd);
                };

                // We hide volume controls on mobile devices
                if (VG_UTILS.isMobileDevice()) {
                    elem.css("display", "none");
                }
                else {
                    scope.volumeVisibility = "hidden";

                    elem.bind("mouseover", scope.onMouseOverVolume);
                    elem.bind("mouseleave", scope.onMouseLeaveVolume);
                }

                scope.$on('destroy', scope.onDestroy.bind(scope));
            }
        }
    }]
);
