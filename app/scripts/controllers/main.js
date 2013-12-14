'use strict';
angular.module('myApp').controller('MainCtrl',
	function ($scope) {
		$scope.currentTime = 0;
		$scope.totalTime = 0;
		$scope.state = null;
		$scope.volume = 1;
		$scope.isCompleted = false;
		$scope.API = null;

		$scope.onPlayerReady = function(API) {
			$scope.API = API;
		};

		$scope.onCompleteVideo = function() {
			$scope.isCompleted = true;
		};

		$scope.onUpdateState = function(state) {
			$scope.state = state;
		};

		$scope.onUpdateTime = function(currentTime, totalTime) {
			$scope.currentTime = currentTime;
			$scope.totalTime = totalTime;
		};

		$scope.onUpdateVolume = function(newVol) {
			$scope.volume = newVol;
		};

		$scope.onUpdateSize = function(width, height) {
			$scope.config.width = width;
			$scope.config.height = height;
		};

		$scope.stretchModes = [
			{label: "None", value: "none"},
			{label: "Fit", value: "fit"},
			{label: "Fill", value: "fill"}
		];

		$scope.config = {
			width: 740,
			height: 380,
			autoHide: false,
			autoHideTime: 3000,
			autoPlay: false,
			responsive: false,
			stretch: $scope.stretchModes[1],
			theme: {
				url: "styles/themes/default/videogular.css",
				playIcon: "&#xe000;",
				pauseIcon: "&#xe001;",
				volumeLevel3Icon: "&#xe002;",
				volumeLevel2Icon: "&#xe003;",
				volumeLevel1Icon: "&#xe004;",
				volumeLevel0Icon: "&#xe005;",
				muteIcon: "&#xe006;",
				enterFullScreenIcon: "&#xe007;",
				exitFullScreenIcon: "&#xe008;"
			},
			plugins: {
				poster: {
					url: "assets/images/videogular.png"
				}
			}
		};
	}
);
