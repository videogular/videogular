"use strict";
// ControlBar plugin
var controlBarPluginDirectives = angular.module("com.2fdevs.videogular.plugins.controlbar", []);

controlBarPluginDirectives.directive("vgControls", function($rootScope, VG_EVENTS){
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

controlBarPluginDirectives.directive("vgTimedisplay", function($rootScope, VG_EVENTS){
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

controlBarPluginDirectives.directive("vgScrubbar", function(){
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

controlBarPluginDirectives.directive("vgScrubbarcurrenttime", function(){
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

controlBarPluginDirectives.directive("vgFullscreenbutton", function($rootScope, VG_EVENTS, VG_THEMES){
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

controlBarPluginDirectives.directive("vgPlaypausebutton", function($rootScope, VG_EVENTS, VG_STATES, VG_THEMES){
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