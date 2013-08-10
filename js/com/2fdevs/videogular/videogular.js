"use strict";
var videogular = angular.module("com.2fdevs.videogular", ["ngSanitize"]);

videogular.service("VG_UTILS", function() {
		/**
		 * Calculate word dimensions for given text using HTML elements.
		 * Optionally classes can be added to calculate with a specific style / layout.
		 *
		 * Solution provided by:
		 * http://blog.bripkens.de/2011/06/html-javascript-calculate-text-dimensions/
		 *
		 * @method calculateWordDimensions
		 * @param {String} text The word for which you would like to know the dimensions.
		 * @param {String[]} [classes] An array of strings which represent css classes which should be applied to the DIV which is used for the calculation of word dimensions.
		 * @param {Boolean} [escape] Whether or not the word should be escaped. Defaults to true.
		 * @return {Object} An object with width and height properties.
		 */
		this.calculateWordDimensions = function(text, classes, escape) {
			classes = classes || [];

			if (escape === undefined) {
				escape = true;
			}

			classes.push('textDimensionCalculation');

			var div = document.createElement('div');
			div.setAttribute('class', classes.join(' '));

			if (escape) {
				angular.element(div).text(text);
			} else {
				div.innerHTML = text;
			}

			document.body.appendChild(div);

			var dimensions = {
				width : angular.element(div).prop("offsetWidth"),
				height : angular.element(div).prop("offsetHeight")
			};

			div.parentNode.removeChild(div);

			return dimensions;
		}
	}
);

videogular.constant("VG_STATES",
	{
		PLAY: "play",
		PAUSE: "pause",
		STOP: "stop"
	}
);

videogular.constant("VG_THEMES",
	{
		PLAY: "&#xe000;",
		PAUSE: "&#xe001;",
		VOLUME_LEVEL_3: "&#xe002;",
		VOLUME_LEVEL_2: "&#xe003;",
		VOLUME_LEVEL_1: "&#xe004;",
		VOLUME_LEVEL_0: "&#xe005;",
		VOLUME_MUTE: "&#xe006;",
		ENTER_FULLSCREEN: "&#xe007;",
		EXIT_FULLSCREEN: "&#xe008;"
	}
);

videogular.constant("VG_EVENTS",
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
		ON_SEEK_TIME: "onSeekTime",
		ON_UPDATE_SIZE: "onUpdateSize",
		ON_UPDATE_THEME: "onUpdateTheme"
	}
);

videogular.directive("videogular", function(VG_STATES, VG_EVENTS) {
		return {
			restrict: "AE",
			link: {
				pre: function (scope, elem, attrs) {
					var elementScope = angular.element(elem);
					var videoElement = elementScope.find("video");
					var controlBar = elementScope.find("vg-controls");

					var currentWidth = attrs.width + "px";
					var currentHeight = attrs.height + "px";

					scope.state = VG_STATES.STOP;
					scope.videoElement = videoElement;
					scope.videogularElement = elementScope;

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

						//TODO: We should change video position on controlbar, not here
						if (screenfull.isFullscreen)
						{
							w = window.screen.width;
							h = window.screen.height;
						}

						elementScope.css("width", parseInt(w, 10) + "px");
						elementScope.css("height", parseInt(h, 10) + "px");
						videoElement.attr("width", parseInt(w, 10));
						videoElement.attr("height", parseInt(h, 10));

						scope.$emit(VG_EVENTS.ON_UPDATE_SIZE, [w, h]);
					};

					scope.onSeekTime = function(target, params)
					{
						videoElement[0].currentTime = params[0];
					};

					scope.onUpdateTime = function(event)
					{
						scope.$emit(VG_EVENTS.ON_UPDATE_TIME, [event.target.currentTime, event.target.duration]);
						scope.$apply();
					};

					scope.onToggleFullscreen = function ($event) {
						screenfull.toggle(elementScope[0]);
					};

					scope.onSetVolume = function (target, params) {
						videoElement[0].volume = params[0];
						localStorage["vgVolume"] = params[0];
					};

					scope.onPlay = function() {
						scope.playVideo(videoElement[0]);
					};

					scope.playVideo = function(videoElement) {
						if (videoElement.paused) {
							videoElement.play();
							scope.setState(VG_STATES.PLAY);
						}
						else {
							videoElement.pause();
							scope.setState(VG_STATES.PAUSE);
						}
					};

					scope.onStartBuffering = function(event){
						scope.$emit(VG_EVENTS.ON_BUFFERING);
						scope.$apply();
					};

					scope.onStartPlaying = function(event){
						//Chrome fix: Chrome needs to update the video tag size or it will show a white screen
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

					videoElement[0].addEventListener("waiting", scope.onStartBuffering, false);
					videoElement[0].addEventListener("playing", scope.onStartPlaying, false);
					videoElement[0].addEventListener("timeupdate", scope.onUpdateTime, false);

					scope.$on(VG_EVENTS.ON_PLAY, scope.onPlay);
					scope.$on(VG_EVENTS.ON_TOGGLE_FULLSCREEN, scope.onToggleFullscreen);
					scope.$on(VG_EVENTS.ON_SET_VOLUME, scope.onSetVolume);
					scope.$on(VG_EVENTS.ON_SEEK_TIME, scope.onSeekTime);
				}
			}
		}
	}
);

videogular.directive("vgTheme", function(VG_EVENTS) {
		return {
			restrict: "A",
			link: function (scope, elem, attrs) {
				function updateTheme(value) {
					if (currentTheme) {
						// Remove previous theme
						var links = document.getElementsByTagName("link");
						for (var i=0, l=links.length; i<l; i++) {
							if (links[i].outerHTML.indexOf(currentTheme) >= 0) {
								links[i].parentNode.removeChild(links[i]);
							}
						}
					}

					var headElem = angular.element(document).find("head");
					headElem.append("<link rel='stylesheet' href='" + value + "'>");

					currentTheme = value;

					scope.$emit(VG_EVENTS.ON_UPDATE_THEME);
				}

				var currentTheme;

				if (attrs.vgTheme) {
					// Watch for a model
					if (attrs.vgTheme.indexOf(".css") < 0) {
						scope.$watch(attrs.vgTheme, function(value) {
							updateTheme(value);
						});
					}
					// Inject theme
					else {
						updateTheme(attrs.vgTheme);
					}
				}

			}
		}
	}
);

//Image poster in HTML5 video element
videogular.directive("vgPoster", function () {
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
