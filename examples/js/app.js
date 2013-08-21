"use strict";
// Declare app level module which depends on filters, and services
var videogularApp = angular.module("videogularApp",
	[
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
		"autoHide": false,
		"autoPlay": false,
		"theme": "themes/default/videogular.css"
	};
}]);
