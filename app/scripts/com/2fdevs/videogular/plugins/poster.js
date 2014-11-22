/**
 * @license Videogular v0.7.1 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.poster:vgPoster
 * @restrict E
 * @description
 * Shows an image when player hasn't been played or has been completed a video.
 *
 * @param {string} vgUrl String with a scope name variable. URL to an image supported by the img tag.
 * **This parameter is required.**
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
"use strict";
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
