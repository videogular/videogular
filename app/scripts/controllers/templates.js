'use strict';
angular.module('myApp').controller('TemplatesCtrl',
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
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"}
        ],
				tracks: [
					{
						src: "assets/subs/pale-blue-dot.vtt",
						kind: "subtitles",
						srclang: "en",
						label: "English",
						default: ""
					}
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
			playsInline: true,
			autoHide: false,
			autoHideTime: 3000,
			autoPlay: false,
			sources: $scope.media[0].sources,
			tracks: $scope.media[0].tracks,
			loop: false,
			preload: "auto",
			controls: false,
			theme: {
				url: "styles/themes/default/videogular.css"
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
					adTagUrl: "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=%2F3510761%2FadRulesSampleTags&ciu_szs=160x600%2C300x250%2C728x90&cust_params=adrule%3Dpremidpostpodandbumpers&impl=s&gdfp_req=1&env=vp&ad_rule=1&vid=47570401&cmsid=481&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]",
					skipButton: "<div class='skipButton'>skip ad</div>"
				},
        analytics: {
          category: "Videogular",
          label: "Main",
          events: {
            ready: true,
            play: true,
            pause: true,
            stop: true,
            complete: true,
            progress: 10
          }
        }
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
