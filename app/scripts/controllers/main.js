'use strict';
angular.module('myApp').controller('MainCtrl',
	function ($scope, $sce) {
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
			sources: [
				{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
				{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
				{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
			],
			transclude: true,
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
				},
				ads: {
					companion: "companionAd",
					companionSize: [728, 90],
					network: "6062",
					unitPath: "iab_vast_samples",
					adTagUrl: "http://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=%2F6062%2Fiab_vast_samples&ciu_szs=300x250%2C728x90&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]&cust_params=iab_vast_samples%3Dlinear"
				}
			}
		};
	}
);
