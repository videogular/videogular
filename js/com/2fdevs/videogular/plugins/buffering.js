"use strict";
// ControlBar plugin
var bufferingDirectives = angular.module("com.2fdevs.videogular.plugins.buffering", []);

bufferingDirectives.directive("vgBuffering", function(VG_EVENTS){
		return {
			restrict: "AE",
			template:
				"<div class='bufferingContainer'>" +
					"<div class='loadingSpinner stop'></div>" +
				"</div>",
			link: function(scope, elem, attrs) {
				function onPlayerReady(target, params) {
					console.log("buffering - on player ready");
					spinner.addClass("stop");
					elem.css("display", "none");
				}

				function onBuffering(target, params) {
					spinner.removeClass("stop");
					elem.css("display", "block");
				}

				function onStartPlaying(target, params) {
					spinner.addClass("stop");
					elem.css("display", "none");
				}

				var spinner = angular.element(elem[0].getElementsByClassName("loadingSpinner"));
				spinner.removeClass("stop");
				scope.$on(VG_EVENTS.ON_BUFFERING, onBuffering);
				scope.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
				scope.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
			}
		}
	}
);

