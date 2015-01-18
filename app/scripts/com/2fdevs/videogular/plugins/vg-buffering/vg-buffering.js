/**
 * @license Videogular v0.7.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.buffering:vgBuffering
 * @restrict E
 * @description
 * Shows a spinner when Videogular is buffering or preparing the video player.
 *
 * ```html
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-buffering></vg-buffering>
 * </videogular>
 * ```
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.buffering", [])
	.directive(
	"vgBuffering",
	["VG_STATES", "VG_UTILS", function (VG_STATES, VG_UTILS) {
		return {
			restrict: "E",
			require: "^videogular",
      templateUrl: function(elem, attrs) {
        return attrs.vgTemplate || 'bower_components/vg-buffering/views/vg-buffering.html';
      },
			link: function (scope, elem, attr, API) {
        scope.showSpinner = function showSpinner() {
					scope.spinnerClass = {stop: API.isBuffering};
					elem.css("display", "block");
				};

        scope.hideSpinner = function hideSpinner() {
					scope.spinnerClass = {stop: API.isBuffering};
					elem.css("display", "none");
				};

        scope.setState = function setState(isBuffering) {
					if (isBuffering) {
            scope.showSpinner();
					}
					else {
            scope.hideSpinner();
					}
				};

        scope.onStateChange = function onStateChange(state) {
					if (state == VG_STATES.STOP) {
            scope.hideSpinner();
					}
				};

        scope.onPlayerReady = function onPlayerReady(isReady) {
					if (isReady) {
            scope.hideSpinner();
					}
				};

        scope.showSpinner();

				// Workaround for issue #16: https://github.com/2fdevs/videogular/issues/16
				if (VG_UTILS.isMobileDevice()) {
          scope.hideSpinner();
				}
				else {
					scope.$watch(
						function () {
							return API.isReady;
						},
						function (newVal, oldVal) {
							if (API.isReady == true || newVal != oldVal) {
                scope.onPlayerReady(newVal);
							}
						}
					);
				}

				scope.$watch(
					function () {
						return API.currentState;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
              scope.onStateChange(newVal);
						}
					}
				);

				scope.$watch(
					function () {
						return API.isBuffering;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
              scope.setState(newVal);
						}
					}
				);
			}
		}
	}
	]);
