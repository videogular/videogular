'use strict';
angular.module('myApp').controller('AudioCtrl',
	function ($scope, $sce) {
		$scope.currentTime = 0;
		$scope.totalTime = 0;
		$scope.state = null;
		$scope.volume = 1;
		$scope.isCompleted = false;
		$scope.API = null;

		$scope.onPlayerReady = function (API) {
			$scope.API = API;
		};

		$scope.onError = function (event) {
      console.log("VIDEOGULAR ERROR EVENT");
			console.log(event);
		};

		$scope.onCompleteVideo = function () {
			$scope.isCompleted = true;
		};

		$scope.onUpdateState = function (state) {
			$scope.state = state;
		};

		$scope.onUpdateTime = function (currentTime, totalTime) {
			$scope.currentTime = currentTime;
			$scope.totalTime = totalTime;
		};

		$scope.onUpdateVolume = function (newVol) {
			$scope.volume = newVol;
		};

		$scope.media = [
			{
				sources: [
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.mp3"), type: "audio/mpeg"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.ogg"), type: "audio/ogg"}
				]
			},
			{
				sources: [
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov"), type: "video/mp4"},
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"), type: "video/ogg"}
				]
			}
		];

		$scope.config = {
			autoHide: false,
			autoHideTime: 3000,
			autoPlay: false,
			sources: $scope.media[0].sources,
			loop: true,
			preload: "auto",
			controls: false,
			theme: {
				url: "styles/themes/default/videogular.css"
			}
		};

		$scope.changeSource = function () {
			$scope.config.sources = $scope.media[1].sources;
			$scope.config.tracks = undefined;
			$scope.config.loop = false;
			$scope.config.preload = true;
		};

		$scope.wrongSource = function () {
			$scope.config.sources = [
        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogula.mp4"), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogula.webm"), type: "video/webm"},
        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogula.ogg"), type: "video/ogg"}
      ];
			$scope.config.tracks = undefined;
			$scope.config.loop = false;
			$scope.config.preload = true;
		};
	}
);
