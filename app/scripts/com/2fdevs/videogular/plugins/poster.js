/**
 * @license Videogular v0.6.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.poster:vgPoster
 * @restrict E
 * @description
 * Shows an image when player hasn't been played or has been completed a video.
 *
 * You can customize vgPosterImage with these attributes:
 *
 * ```html
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-video vg-src="sources"></vg-video>
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
