"use strict";
// Declare app level module which depends on filters, and services
var videogularApp = angular.module("videogularApp",
	[
		"ngSanitize",
		"controllers",

		"com.2fdevs.videogular",
		"com.2fdevs.videogular.plugins.controlbar",
		"com.2fdevs.videogular.plugins.overlayplay",
		"com.2fdevs.videogular.plugins.buffering"
	]
);

videogularApp.config(["$routeProvider",
		function ($routeProvider) {
			$routeProvider.when(
				"/", {
					templateUrl: "partials/video.html",
					controller: "VideoController"
				}
			);
			$routeProvider.otherwise({redirectTo: "/404"});
		}
	]
);

// Controllers
var controllerModule = angular.module('controllers', []);
controllerModule.controller("MainController", ["$scope", function (scope) {
	scope.data = {
		"width": 640,
		"height": 264,
		"poster": "assets/images/oceans-clip.png",
		"media": [
			{"type": "video/mp4", "url": "assets/videos/oceans-clip.mp4"},
			{"type": "video/webm", "url": "assets/videos/oceans-clip.webm"},
			{"type": "video/ogg", "url": "assets/videos/oceans-clip.ogv"}
		]
	};
}]);
