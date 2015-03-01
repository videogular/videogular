'use strict';
angular.module('myApp').controller('AudioCtrl',
	function ($sce) {
		this.currentTime = 0;
		this.totalTime = 0;
		this.state = null;
		this.volume = 1;
		this.isCompleted = false;
		this.API = null;

		this.onPlayerReady = function (API) {
			this.API = API;
		};

		this.onError = function (event) {
      console.log("VIDEOGULAR ERROR EVENT");
			console.log(event);
		};

		this.onCompleteVideo = function () {
			this.isCompleted = true;
		};

		this.onUpdateState = function (state) {
			this.state = state;
		};

		this.onUpdateTime = function (currentTime, totalTime) {
			this.currentTime = currentTime;
			this.totalTime = totalTime;
		};

		this.onUpdateVolume = function (newVol) {
			this.volume = newVol;
		};

		this.media = [
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

		this.config = {
			autoHide: false,
			autoHideTime: 3000,
			autoPlay: false,
			sources: this.media[0].sources,
			loop: true,
			preload: "auto",
			controls: false,
			theme: {
				url: "styles/themes/default/videogular.css"
			}
		};

		this.changeSource = function () {
			this.config.sources = this.media[1].sources;
			this.config.tracks = undefined;
			this.config.loop = false;
			this.config.preload = true;
		};

		this.wrongSource = function () {
			this.config.sources = [
        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogula.mp4"), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogula.webm"), type: "video/webm"},
        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogula.ogg"), type: "video/ogg"}
      ];
			this.config.tracks = undefined;
			this.config.loop = false;
			this.config.preload = true;
		};
	}
);
