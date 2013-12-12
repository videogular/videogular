"use strict";
angular.module("com.2fdevs.videogular.plugins.buffering", [])
	.directive(
		"vgBuffering",
		["VG_EVENTS", "VG_UTILS", function(VG_EVENTS, VG_UTILS){
			return {
				restrict: "E",
				require: "^videogular",
				templateUrl: "views/videogular/plugins/buffering/buffering.html",
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
