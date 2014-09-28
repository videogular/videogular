/**
 * @license Videogular v0.6.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.poster:poster
 * @restrict E
 * @description
 * Shows an image when player hasn't been played or has been completed a video.
 *
 * You can customize vgPosterImage with these attributes:
 *
 * ```html
 * <videogular vg-width="config.width"
 *    vg-height="config.height"
 *    vg-theme="config.theme.url"
 *    vg-autoplay="config.autoPlay"
 *    vg-responsive="config.responsive">
 *    <video preload='metadata'>
 *        <source src="assets/videos/videogular.mp4" type="video/mp4">
 *        <source src="assets/videos/videogular.webm" type="video/webm">
 *
 *    <track kind="captions" src="assets/subs/pale-blue-dot.vtt" srclang="en" label="English" default></track>
 *    </video>
 *
 *    <vg-poster-image vg-url='config.plugins.poster.url'></vg-poster-image>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.poster", [])
	.directive(
	"vgPosterImage",
	["VG_STATES", function (VG_STATES) {
		return {
			restrict: "E",
			require: "^videogular",
			scope: {
				vgUrl: "="
			},
			template: '<img ng-src="{{vgUrl}}">',
			link: function (scope, elem, attr, API) {
				function onUpdateState(newState) {
					switch (newState) {
						case VG_STATES.PLAY:
							elem.css("display", "none");
							break;

						case VG_STATES.STOP:
							elem.css("display", "block");
							break;
					}
				}

				scope.$watch(
					function () {
						return API.currentState;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							onUpdateState(newVal);
						}
					}
				);
			}
		}
	}
	]);
