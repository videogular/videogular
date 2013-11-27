"use strict";
angular.module("com.2fdevs.videogular.plugins.buffering", [])
	.directive(
		"vgBuffering",
		["$rootScope", "VG_EVENTS", function($rootScope, VG_EVENTS){
			return {
				restrict: "E",
				templateUrl: "views/videogular/plugins/buffering/buffering.html",
				link: function($scope, $elem, $attr) {
					var spinner = angular.element($elem[0].getElementsByClassName("loadingSpinner"));

					function onPlayerReady(target, params) {
						spinner.addClass("stop");
						$elem.css("display", "none");
					}

					function onBuffering(target, params) {
						spinner.removeClass("stop");
						$elem.css("display", "block");
					}

					function onStartPlaying(target, params) {
						spinner.addClass("stop");
						$elem.css("display", "none");
					}

					spinner.removeClass("stop");

					$rootScope.$on(VG_EVENTS.ON_BUFFERING, onBuffering);
					$rootScope.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
					$rootScope.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
				}
			}
		}
	]);


