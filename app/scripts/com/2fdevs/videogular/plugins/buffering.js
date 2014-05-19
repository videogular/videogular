/**
 * @license Videogular v0.4.0 http://videogular.com
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
 * 		vg-height="config.height"
 * 		vg-theme="config.theme.url"
 * 		vg-autoplay="config.autoPlay"
 * 		vg-stretch="config.stretch.value"
 * 		vg-responsive="config.responsive">
 * 	<video preload='metadata'>
 * 		<source src="assets/videos/videogular.mp4" type="video/mp4">
 *		<source src="assets/videos/videogular.webm" type="video/webm">
 *
 *  	<track kind="captions" src="assets/subs/pale-blue-dot.vtt" srclang="en" label="English" default></track>
 * 	</video>
 *
 * 	<vg-buffering></vg-buffering>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.buffering", [])
	.directive(
		"vgBuffering",
		["VG_EVENTS", "VG_UTILS", function(VG_EVENTS, VG_UTILS){
			return {
				restrict: "E",
				require: "^videogular",
				template:
					"<div class='bufferingContainer'>"+
						"<div class='loadingSpinner stop'></div>"+
					"</div>",
				link: function(scope, elem, attr, API) {
					var spinner = angular.element(elem[0].getElementsByClassName("loadingSpinner"));

					function onPlayerReady() {
						spinner.addClass("stop");
						elem.css("display", "none");
					}

					function onBuffering() {
						spinner.removeClass("stop");
						elem.css("display", "block");
					}

					function onStartPlaying() {
						spinner.addClass("stop");
						elem.css("display", "none");
					}

					spinner.removeClass("stop");

					// Workaround for issue #16: https://github.com/2fdevs/videogular/issues/16
					if (VG_UTILS.isiOSDevice()) {
						spinner.addClass("stop");
						elem.css("display", "none");
					}
					else {
						if (API.isPlayerReady()) onPlayerReady();
						else API.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
					}

					API.$on(VG_EVENTS.ON_BUFFERING, onBuffering);
					API.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
				}
			}
		}
	]);
