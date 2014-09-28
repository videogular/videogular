/**
 * @license Videogular v0.6.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.buffering:buffering
 * @restrict E
 * @description
 * Shows a spinner when Videogular is buffering or preparing the video player.
 *
 * ```html
 * <videogular vg-width="config.width"
 *        vg-height="config.height"
 *        vg-theme="config.theme.url"
 *        vg-autoplay="config.autoPlay"
 *        vg-stretch="config.stretch.value"
 *        vg-responsive="config.responsive">
 *    <video preload='metadata'>
 *        <source src="assets/videos/videogular.mp4" type="video/mp4">
 *        <source src="assets/videos/videogular.webm" type="video/webm">
 *
 *    <track kind="captions" src="assets/subs/pale-blue-dot.vtt" srclang="en" label="English" default></track>
 *    </video>
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
							console.log(newVal + " != " + oldVal);
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
