"use strict";
// Declare app level module which depends on filters, and services
var videogularApp = angular.module("videogularApp", ["ngSanitize", "videogular", 'controllers']);
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
			//{"type": "video/mp4", "url": "http://content.bitsontherun.com/videos/lWMJeVvV-364767.mp4"},
			{"type": "video/mp4", "url": "assets/videos/oceans-clip.mp4"},
			{"type": "video/webm", "url": "assets/videos/oceans-clip.webm"},
			{"type": "video/ogg", "url": "assets/videos/oceans-clip.ogv"}
		]
	};
}]);

// Here starts all the videogular stuff
var vgDirectives = angular.module("videogular", []);

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

vgDirectives.directive("videogular", function($rootScope, VG_STATES, VG_THEMES, VG_EVENTS) {
		return {
			restrict: "AE",
			link: {
				pre: function (scope, elem, attrs) {
					var elementScope = $(elem);
					var videoElement = elementScope.find("video");
					var overlayPlay = elementScope.find(".overlayPlay");
					var overlayPlayContainer = elementScope.find(".overlayPlayContainer");
					var controlBar = elementScope.find("vg-controls");
					var scrubBar = elementScope.find("vg-scrubBar");
					var timeDisplay = elementScope.find("vg-timeDisplay");
					var fullScreenButton = elementScope.find("vg-fullScreenButton");

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
						//Chrome fix
						event.target.width++;
						event.target.width--;

						scope.$emit(VG_EVENTS.ON_START_PLAYING, [event.target.duration]);
						scope.$apply();
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

vgDirectives.directive("vgOverlayplay", function($rootScope, VG_EVENTS, VG_STATES, VG_THEMES){
		return {
			restrict: "E",
			template:
				"<div class='overlayPlayContainer' ng-click='onClickOverlayPlay($event)'>" +
					"<div class='iconButton' ng-bind-html='overlayPlayIcon'>" +
					"</div>" +
				"</div>",
			link: function(scope, elem, attrs) {
				console.log("overlayPlay created");
				scope.overlayPlayIcon = VG_THEMES.PLAY;

				scope.onClickOverlayPlay = function ($event) {
					scope.$emit(VG_EVENTS.ON_PLAY);
				};

				function onChangeState(target, params) {
					switch (params[0]) {
						case VG_STATES.PLAY:
							scope.overlayPlayIcon = "";
							break;

						case VG_STATES.PAUSE:
							scope.overlayPlayIcon = VG_THEMES.PLAY;
							break;

						case VG_STATES.STOP:
							scope.overlayPlayIcon = VG_THEMES.PLAY;
							break;
					}
				}

				$rootScope.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
			}
		}
	}
);

vgDirectives.directive("vgControls", function($rootScope, VG_EVENTS){
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
				console.log("controlbar created");

				function onUpdateSize(target, params) {
					var w = params[0];
					var h = params[1];
					var controlBarHeight = elem[0].clientHeight;

					elem.css("top", (parseInt(h, 10) - parseInt(controlBarHeight, 10)) + "px");
				}

				$rootScope.$on(VG_EVENTS.ON_UPDATE_SIZE, onUpdateSize);
			}
		}
	}
);

vgDirectives.directive("vgTimedisplay", function($rootScope, VG_EVENTS){
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
				console.log("timedisplay created");

				scope.currentTime = "00:00";
				scope.totalTime = "00:00";
				scope.percentTime = 0;

				function onUpdateTime(target, params) {
					var mm = Math.floor(params[0] / 60);
					var ss = Math.floor(params[0] - (mm * 60));
					var mins = mm < 10 ? "0" + mm : mm;
					var secs = ss < 10 ? "0" + ss : ss;

					scope.currentTime = mins + ":" + secs;
					scope.percentTime = Math.round((params[0] / params[1]) * 100);
				}

				function onStartPlaying(target, params) {
					var mm = Math.floor(params[0] / 60);
					var ss = Math.floor(params[0] - (mm * 60));
					var mins = mm < 10 ? "0" + mm : mm;
					var secs = ss < 10 ? "0" + ss : ss;

					scope.totalTime = mins + ":" + secs;
				}

				$rootScope.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
				$rootScope.$on(VG_EVENTS.ON_UPDATE_TIME, onUpdateTime);
			}
		}
	}
);

vgDirectives.directive("vgScrubbar", function(){
		return {
			restrict: "E",
			replace: true,
			link: function(scope, elem, attrs) {
				console.log("scrubbar created");

				function onScrubBarClick($event) {
					scope.isSeeking = false;
					scope.videoElement[0].currentTime = $event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth;
				}
				function onScrubBarMouseDown($event) {
					scope.isSeeking = true;
					scope.videoElement[0].currentTime = $event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth;
				}
				function onScrubBarMouseUp($event) {
					scope.isSeeking = false;
					scope.videoElement[0].currentTime = $event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth;
				}
				function onScrubBarMouseMove($event) {
					if (scope.isSeeking) {
						scope.videoElement[0].currentTime = $event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth;
					}
				}
				function onScrubBarMouseLeave($event) {
					scope.isSeeking = false;
				}

				scope.isSeeking = false;

				elem.bind("click", onScrubBarClick);
				elem.bind("mousedown", onScrubBarMouseDown);
				elem.bind("mouseup", onScrubBarMouseUp);
				elem.bind("mousemove", onScrubBarMouseMove);
				elem.bind("mouseleave", onScrubBarMouseLeave);
			}
		}
	}
);

vgDirectives.directive("vgScrubbarcurrenttime", function(){
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
				console.log("scrubbarcurrenttime created");
				scope.$watch("percentTime", onUpdateTime, true);

				function onUpdateTime(newModel){
					elem.css("width", newModel + "%");
				}
			}
		}
	}
);

vgDirectives.directive("vgFullscreenbutton", function($rootScope, VG_EVENTS, VG_THEMES){
		return {
			restrict: "E",
			template: "<div ng-click='onClickFullScreen($event)' class='iconButton' ng-bind-html='fullscreenIcon'></div>",
			link: function(scope, elem, attrs) {
				function onEnterFullScreen() {
					scope.fullscreenIcon = VG_THEMES.EXIT_FULLSCREEN;
				}
				function onExitFullScreen() {
					scope.fullscreenIcon = VG_THEMES.ENTER_FULLSCREEN;
				}

				scope.onClickFullScreen = function ($event) {
					scope.$emit(VG_EVENTS.ON_TOGGLE_FULLSCREEN);
				};

				scope.fullscreenIcon = VG_THEMES.ENTER_FULLSCREEN;

				$rootScope.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, onEnterFullScreen);
				$rootScope.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, onExitFullScreen);

				if (!screenfull.enabled) scope.css("display", "none");
			}
		}
	}
);

vgDirectives.directive("vgPlaypausebutton", function($rootScope, VG_EVENTS, VG_STATES, VG_THEMES){
		return {
			restrict: "E",
			template: "<div ng-click='onClickPlayPause($event)' class='iconButton' ng-bind-html='playpauseIcon'></div>",
			link: function(scope, elem, attrs) {
				scope.playpauseIcon = VG_THEMES.PLAY;

				scope.onClickPlayPause = function ($event) {
					scope.$emit(VG_EVENTS.ON_PLAY);
				};

				function onChangeState(target, params) {
					switch (params[0]) {
						case VG_STATES.PLAY:
							scope.playpauseIcon = VG_THEMES.PAUSE;
							break;

						case VG_STATES.PAUSE:
							scope.playpauseIcon = VG_THEMES.PLAY;
							break;

						case VG_STATES.STOP:
							scope.playpauseIcon = VG_THEMES.PLAY;
							break;
					}
				}

				$rootScope.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
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
