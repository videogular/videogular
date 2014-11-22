/**
 * @license Videogular v0.7.1 http://videogular.com
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
			template: "<div class='bufferingContainer'>" +
				"<div ng-class='spinnerClass' class='loadingSpinner'></div>" +
				"</div>",
			link: function (scope, elem, attr, API) {
				function showSpinner() {
					scope.spinnerClass = {stop: API.isBuffering};
					elem.css("display", "block");
				}

				function hideSpinner() {
					scope.spinnerClass = {stop: API.isBuffering};
					elem.css("display", "none");
				}

				function setState(isBuffering) {
					if (isBuffering) {
						showSpinner();
					}
					else {
						hideSpinner();
					}
				}

				function onStateChange(state) {
					if (state == VG_STATES.STOP) {
            hideSpinner();
					}
				}

				function onPlayerReady(isReady) {
					if (isReady) {
						hideSpinner();
					}
				}

				showSpinner();

				// Workaround for issue #16: https://github.com/2fdevs/videogular/issues/16
				if (VG_UTILS.isMobileDevice()) {
					hideSpinner();
				}
				else {
					scope.$watch(
						function () {
							return API.isReady;
						},
						function (newVal, oldVal) {
							if (API.isReady == true || newVal != oldVal) {
								onPlayerReady(newVal);
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
							onStateChange(newVal);
						}
					}
				);

				scope.$watch(
					function () {
						return API.isBuffering;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							setState(newVal);
						}
					}
				);
			}
		}
	}
	]);
