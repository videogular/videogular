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
		};

		this.fixEventOffset = function($event) {
			/**
			 * There's no offsetX in Firefox, so we fix that.
			 * Solution provided by Iaz Brannigan's answer in this thread:
			 * http://stackoverflow.com/questions/11334452/event-offsetx-in-firefox
			 * @param $event
			 * @returns {*}
			 */
			if (!$event.hasOwnProperty('offsetX') || !$event.hasOwnProperty('offsetY')) {
				$event.offsetX = $event.layerX - $event.currentTarget.offsetLeft;
				$event.offsetY = $event.layerY;
			}

			return $event;
		};
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
		ON_PLAY: "onVgPlay",
		ON_PAUSE: "onVgPause",
		ON_PLAY_PAUSE: "onVgPlayPause",
		ON_START_PLAYING: "onVgStartPlaying",
		ON_COMPLETE: "onVgComplete",
		ON_SET_STATE: "onVgSetState",
		ON_SET_VOLUME: "onVgSetVolume",
		ON_TOGGLE_FULLSCREEN: "onVgToggleFullscreen",
		ON_ENTER_FULLSCREEN: "onVgEnterFullscreen",
		ON_EXIT_FULLSCREEN: "onVgExitFullscreen",
		ON_BUFFERING: "onVgBuffering",
		ON_UPDATE_TIME: "onVgUpdateTime",
		ON_SEEK_TIME: "onVgSeekTime",
		ON_UPDATE_SIZE: "onVgUpdateSize",
		ON_UPDATE_THEME: "onVgUpdateTheme",
		ON_PLAYER_READY: "onVgPlayerReady"
	}
);

videogular.directive("videogular", function(VG_STATES, VG_EVENTS) {
		return {
			restrict: "AE",
			link: {
				pre: function (scope, elem, attrs) {
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

						updateSize();
						scope.$apply();
					};

					function updateSize()
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
					}

					function onSeekTime(target, params)
					{
						videoElement[0].currentTime = params[0];
					}

					function onUpdateTime(event)
					{
						scope.$emit(VG_EVENTS.ON_UPDATE_TIME, [event.target.currentTime, event.target.duration]);
						scope.$apply();
					}

					function onToggleFullscreen($event) {
						screenfull.toggle(elementScope[0]);
					}

					function onSetVolume(target, params) {
						videoElement[0].volume = params[0];
						localStorage["vgVolume"] = params[0];
						scope.$apply();
					}

					function onPlayPause(event) {
						if (videoElement[0].paused) {
							videoElement[0].play();
							setState(VG_STATES.PLAY);
						}
						else {
							videoElement[0].pause();
							setState(VG_STATES.PAUSE);
						}
					}

					function onPlay(event) {
						videoElement[0].play();
						setState(VG_STATES.PLAY);
					}

					function onPause(event) {
						videoElement[0].pause();
						setState(VG_STATES.PAUSE);
					}

					function onStartBuffering(event){
						scope.$emit(VG_EVENTS.ON_BUFFERING);
						scope.$apply();
					}

					function onComplete(event){
						setState(VG_STATES.STOP);
						scope.$emit(VG_EVENTS.ON_COMPLETE);
						scope.$apply();
					}

					function onStartPlaying(event){
						//Chrome fix: Chrome needs to update the video tag size or it will show a white screen
						event.target.width++;
						event.target.width--;

						scope.$emit(VG_EVENTS.ON_START_PLAYING, [event.target.duration]);
						scope.$apply();
					}

					function setState(newState) {
						state = newState;
						scope.$emit(VG_EVENTS.ON_SET_STATE, [state]);
						scope.$apply();
					}

					function onUpdateSize(w, h) {
						currentWidth = w;
						currentHeight = h;
						updateSize();
					}

					function onElementReady() {
						scope.isPlayerReady = true;
						scope.$emit(VG_EVENTS.ON_PLAYER_READY);
						updateSize();
					}

					scope.onChangeWidth = function (value) {
						onUpdateSize(value, currentHeight);
					};

					scope.onChangeHeight = function (value) {
						onUpdateSize(currentWidth, value);
					};

					var elementScope = angular.element(elem);
					var videoElement = elementScope.find("video");
					var currentWidth = attrs.width + "px";
					var currentHeight = attrs.height + "px";
					var state = VG_STATES.STOP;

					scope.videoElement = videoElement;
					scope.videogularElement = elementScope;
					scope.isPlayerReady = false;

					elementScope[0].style.width = currentWidth;
					elementScope[0].style.height = currentHeight;

					videoElement[0].addEventListener("waiting", onStartBuffering, false);
					videoElement[0].addEventListener("ended", onComplete, false);
					videoElement[0].addEventListener("playing", onStartPlaying, false);
					videoElement[0].addEventListener("timeupdate", onUpdateTime, false);

					elementScope.ready(onElementReady);
					scope.$on(VG_EVENTS.ON_PLAY, onPlay);
					scope.$on(VG_EVENTS.ON_PAUSE, onPause);
					scope.$on(VG_EVENTS.ON_PLAY_PAUSE, onPlayPause);
					scope.$on(VG_EVENTS.ON_TOGGLE_FULLSCREEN, onToggleFullscreen);
					scope.$on(VG_EVENTS.ON_SET_VOLUME, onSetVolume);
					scope.$on(VG_EVENTS.ON_SEEK_TIME, onSeekTime);
				}
			}
		}
	}
);

videogular.directive("vgWidth", function() {
		return {
			restrict: "A",
			link: function (scope, elem, attrs) {
				function updateSize(value) {
					scope.onChangeWidth(value);
				}

				if (attrs.vgWidth) {
					// Watch for a model
					if (isNaN(parseInt(attrs.vgWidth))) {
						scope.$watch(attrs.vgWidth, function(value) {
							updateSize(value);
						});
					}
					else {
						updateSize(attrs.vgWidth);
					}
				}

			}
		}
	}
);

videogular.directive("vgHeight", function() {
		return {
			restrict: "A",
			link: function (scope, elem, attrs) {
				function updateSize(value) {
					scope.onChangeHeight(value);
				}

				if (attrs.vgWidth) {
					// Watch for a model
					if (isNaN(parseInt(attrs.vgHeight))) {
						scope.$watch(attrs.vgHeight, function(value) {
							updateSize(value);
						});
					}
					else {
						updateSize(attrs.vgHeight);
					}
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

videogular.directive("vgAutoplay", function(VG_EVENTS) {
		return {
			restrict: "A",
			link: function (scope, elem, attrs) {
				function onPlayerReady() {
					if (autoplay) {
						scope.$emit(VG_EVENTS.ON_PLAY);
					}
				}

				function onPlay() {
					if (onPlayerReadyListener) onPlayerReadyListener();
					if (onPlayListener) onPlayListener();
				}

				var autoplay = (attrs.vgAutoplay === "true" || attrs.vgAutoplay === true);
				var onPlayerReadyListener;
				var onPlayListener;

				// It doesn't make any sense to add a watcher here
				if (autoplay) {
					if (!scope.isPlayerReady) {
						if (onPlayerReadyListener) onPlayerReadyListener();
						onPlayerReadyListener = scope.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
						onPlayListener = scope.$on(VG_EVENTS.ON_PLAY, onPlay);
					}
					else {
						onPlayerReady();
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
				function updatePoster(value) {
					scope.videoElement.attr("poster", value);
				}

				if (attrs.vgPoster.indexOf(".jpg") > 0 ||
						attrs.vgPoster.indexOf(".jpeg") > 0 ||
						attrs.vgPoster.indexOf(".png") > 0 ||
						attrs.vgPoster.indexOf(".gif") > 0 ||
						attrs.vgPoster.indexOf("/") > 0) {
					updatePoster(attrs.vgPoster);
				}
				else {
					scope.$watch(attrs.vgPoster, function(value) {
						updatePoster(value);
					});
				}
			}
		}
	}
);


//Image poster in HTML5 video element
videogular.directive("vgSrc", function () {
		return {
			restrict: "A",
			link: function (scope, elem, attrs) {
				function updateSource(value) {
					scope.videoElement.attr("src", value);
				}

				if (attrs.vgSrc.indexOf(".mp4") > 0 ||
					attrs.vgSrc.indexOf(".ogg") > 0 ||
					attrs.vgSrc.indexOf(".ogv") > 0 ||
					attrs.vgSrc.indexOf(".webm") > 0 ||
					attrs.vgSrc.indexOf("/") > 0) {
					updateSource(attrs.vgSrc);
				}
				else {
					scope.$watch(attrs.vgSrc, function(value) {
						updateSource(value);
					});
				}
			}
		}
	}
);
