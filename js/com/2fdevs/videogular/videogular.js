"use strict";
// Here starts all the videogular stuff
var vgDirectives = angular.module("com.2fdevs.videogular", []);

// Constants
vgDirectives.constant("VG_STATES",
	{
		PLAY: "play",
		PAUSE: "pause",
		STOP: "stop"
	}
);

vgDirectives.constant("VG_THEMES",
	{
		PLAY: "&#xe000;",
		PAUSE: "&#xe001;",
		VOLUME_LEVEL_3: "&#xe002;",
		VOLUME_LEVEL_2: "&#xe003;",
		VOLUME_LEVEL_1: "&#xe004;",
		VOLUME_LEVEL_0: "&#xe005;",
		VOLUME_MUTE: "&#xe006;",
		ENTER_FULLSCREEN: "&#xe007;",
		EXIT_FULLSCREEN: "&#xe008;",
		LOADING: "&#xe009;"
	}
);

vgDirectives.constant("VG_EVENTS",
	{
		ON_PLAY: "onPlay",
		ON_START_PLAYING: "onStartPlaying",
		ON_PAUSE: "onPause",
		ON_COMPLETE: "onComplete",
		ON_SET_STATE: "onSetState",
		ON_SET_VOLUME: "onSetVolume",
		ON_TOGGLE_FULLSCREEN: "onToggleFullscreen",
		ON_ENTER_FULLSCREEN: "onEnterFullscreen",
		ON_EXIT_FULLSCREEN: "onExitFullscreen",
		ON_BUFFERING: "onBuffering",
		ON_UPDATE_TIME: "onUpdateTime",
		ON_UPDATE_SIZE: "onUpdateSize"
	}
);

vgDirectives.directive("videogular", function(VG_STATES, VG_EVENTS) {
		return {
			restrict: "AE",
			link: {
				pre: function (scope, elem, attrs) {
					var elementScope = $(elem);
					var videoElement = elementScope.find("video");
					var controlBar = elementScope.find("vg-controls");

					var currentWidth = attrs.width + "px";
					var currentHeight = attrs.height + "px";

					scope.state = VG_STATES.STOP;
					scope.videoElement = videoElement;

					elementScope[0].style.width = currentWidth;
					elementScope[0].style.height = currentHeight;

					screenfull.onchange = function()
					{
						var w = currentWidth;
						var h = currentHeight;

						if (screenfull.isFullscreen) {
							w = screen.width;
							h = screen.height;
							scope.$emit(VG_EVENTS.ON_ENTER_FULLSCREEN);
						}
						else {
							scope.$emit(VG_EVENTS.ON_EXIT_FULLSCREEN);
						}

						scope.updateSize();
						scope.$apply();
					};

					scope.updateSize = function()
					{
						var w = currentWidth;
						var h = currentHeight;
						var videoTop = 0;
						var videoHeight = h;
						var controlBarHeight = controlBar.css("height");

						//TODO: We should change video position on controlbar, not here
						if (screenfull.isFullscreen)
						{
							w = screen.width;
							h = screen.height;
							videoTop = ((screen.height - videoElement.height()) / 2);
							videoHeight = parseInt(h, 10) - parseInt(controlBarHeight, 10);
						}

						elementScope.css("width", parseInt(w, 10) + "px");
						elementScope.css("height", parseInt(h, 10) + "px");
						videoElement.attr("width", parseInt(w, 10) + "px");
						videoElement.attr("height", parseInt(videoHeight, 10) + "px");
						videoElement.css("top", parseInt(videoTop, 10) + "px");

						scope.$emit(VG_EVENTS.ON_UPDATE_SIZE, [w, h]);
					};

					scope.onUpdateTime = function(event)
					{
						scope.$emit(VG_EVENTS.ON_UPDATE_TIME, [event.target.currentTime, event.target.duration]);
						scope.$apply();
					};

					scope.onToggleFullscreen = function ($event) {
						screenfull.toggle(elementScope[0]);
					};

					scope.onPlay = function() {
						scope.playVideo(videoElement[0]);
					};

					scope.playVideo = function(videoElement) {
						if (videoElement.paused) {
							videoElement.removeEventListener("playing", scope.onStartPlaying);
							videoElement.addEventListener("playing", scope.onStartPlaying, false);

							//Add and remove listeners
							videoElement.removeEventListener("timeupdate", scope.onUpdateTime);
							videoElement.addEventListener("timeupdate", scope.onUpdateTime, false);

							videoElement.play();
							scope.setState(VG_STATES.PLAY);
						}
						else {
							videoElement.pause();
							scope.setState(VG_STATES.PAUSE);
						}
					};

					scope.onStartPlaying = function(event){
						//Chrome fix: Chrome needs to update the video tag size or it will show a white screen
						event.target.width++;
						event.target.width--;

						scope.$emit(VG_EVENTS.ON_START_PLAYING, [event.target.duration]);
					};

					scope.setState = function(state) {
						scope.state = state;
						scope.$emit(VG_EVENTS.ON_SET_STATE, [scope.state]);
					};

					setTimeout(scope.updateSize, 100);

					scope.$on(VG_EVENTS.ON_PLAY, scope.onPlay);
					scope.$on(VG_EVENTS.ON_TOGGLE_FULLSCREEN, scope.onToggleFullscreen);
				}
			}
		}
	}
);

//Image poster in HTML5 video element
vgDirectives.directive("vgPoster", function () {
		return {
			restrict: "A",
			link: function (scope, elem, attrs) {
				scope.$watch(attrs.foejsPoster, function(value) {
					scope.videoElement.attr("poster", attrs.vgPoster);
				});
			}
		}
	}
);
