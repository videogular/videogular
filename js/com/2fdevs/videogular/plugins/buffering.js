"use strict";
// ControlBar plugin
var bufferingDirectives = angular.module("com.2fdevs.videogular.plugins.buffering", []);

bufferingDirectives.directive("vgBuffering", function(VG_EVENTS, VG_THEMES){
		return {
			restrict: "E",
			template:
				"<div class='bufferingContainer'>" +
					"<div class='loadingSpinner stop'></div>" +
				"</div>",
			link: function(scope, elem, attrs) {
				function onBuffering(target, params) {
					spinner.removeClass("stop");
					spinner.show();
				}

				function onStartPlaying(target, params) {
					spinner.addClass("stop");
					spinner.hide();
				}

				var spinner = $(elem).find(".loadingSpinner");
				spinner.hide();
				scope.$on(VG_EVENTS.ON_BUFFERING, onBuffering);
				scope.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
			}
		}
	}
);

