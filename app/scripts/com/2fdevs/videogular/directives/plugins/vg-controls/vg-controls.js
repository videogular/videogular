/**
 * @license Videogular v0.7.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgControls
 * @restrict E
 * @description
 * This directive acts as a container and you will need other directives to control the media.
 * Inside this directive you can add other directives like vg-play-pause-button and vg-scrubbar.
 *
 * @param {boolean=false} vgAutohide Boolean variable or value to activate autohide.
 * @param {number=2000} vgAutohideTime Number variable or value that represents the time in milliseconds that will wait vgControls until it hides.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'></vg-controls>
 * </videogular>
 * ```
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.controls", [])
	.directive(
	"vgControls",
	["$timeout", function ($timeout) {
		return {
			restrict: "E",
			require: "^videogular",
			transclude: true,
      templateUrl: function(elem, attrs) {
        return attrs.vgTemplate || 'scripts/com/2fdevs/videogular/plugins/vg-controls/views/vg-controls.html';
      },
			scope: {
				autoHide: "=vgAutohide",
				autoHideTime: "=vgAutohideTime"
			},
			link: function (scope, elem, attr, API) {
				var w = 0;
				var h = 0;
				var autoHideTime = 2000;
				var hideInterval;

				scope.onMouseMove = function onMouseMove() {
					if (scope.autoHide) showControls();
				};

				function hideControls() {
					scope.animationClass = "hide-animation";
				}

				function showControls() {
					scope.animationClass = "show-animation";
					$timeout.cancel(hideInterval);
					if (scope.autoHide) hideInterval = $timeout(hideControls, autoHideTime);
				}

				// If vg-autohide has been set
				if (scope.autoHide != undefined) {
					scope.$watch("autoHide", function (value) {
						if (value) {
							scope.animationClass = "hide-animation";
						}
						else {
							scope.animationClass = "";
							$timeout.cancel(hideInterval);
							showControls();
						}
					});
				}

				// If vg-autohide-time has been set
				if (scope.autoHideTime != undefined) {
					scope.$watch("autoHideTime", function (value) {
						autoHideTime = value;
					});
				}
			}
		}
	}
	])






