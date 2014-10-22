/**
 * @license Videogular v0.6.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
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
angular.module("com.2fdevs.videogular.plugins.buffering", [])
	.directive(
	"vgBuffering",
	["VG_UTILS", function (VG_UTILS) {
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
							if (newVal != oldVal) {
								onPlayerReady(newVal);
							}
						}
					);
				}

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
