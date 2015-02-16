"use strict";
/**
 * @ngdoc controller
 * @name com.2fdevs.videogular.controller:vgController
 * @description
 * Videogular controller.
 * This controller offers a public API:
 *
 * Methods
 * - play(): Plays media.
 * - pause(): Pause media.
 * - stop(): Stops media.
 * - playPause(): Toggles play and pause.
 * - seekTime(value, byPercent): Seeks to a specified time position. Param value must be an integer representing the target position in seconds or a percentage. By default seekTime seeks by seconds, if you want to seek by percentage just pass byPercent to true.
 * - setVolume(volume): Sets volume. Param volume must be an integer with a value between 0 and 1.
 * - toggleFullScreen(): Toggles between fullscreen and normal mode.
 * - updateTheme(css-url): Removes previous CSS theme and sets a new one.
 * - clearMedia(): Cleans the current media file.
 * - changeSource(array): Updates current media source. Param `array` must be an array of media source objects.
 * A media source is an object with two properties `src` and `type`. The `src` property must contains a trustful url resource.
 * {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}
 *
 * Properties
 * - config: String with a url to JSON config file.
 * - isReady: Boolean value with current player initialization state.
 * - isBuffering: Boolean value to know if player is buffering media.
 * - isCompleted: Boolean value to know if current media file has been completed.
 * - isLive: Boolean value to know if current media file is a Live Streaming.
 * - playsInline: Boolean value to know if Videogular if fullscreen mode will use native mode or inline playing.
 * - mediaElement: Reference to video/audio object.
 * - videogularElement: Reference to videogular tag.
 * - sources: Array with current sources.
 * - tracks: Array with current tracks.
 * - isFullScreen: Boolean value to know if we’re in fullscreen mode.
 * - currentState: String value with “play”, “pause” or “stop”.
 * - currentTime: Number value with current media time progress.
 * - totalTime: Number value with total media time.
 * - timeLeft: Number value with current media time left.
 * - volume: Number value with current volume between 0 and 1.
 *
 */
angular.module("com.2fdevs.videogular")
  .controller("vgController",
  ['$scope', '$window', 'vgConfigLoader', 'vgFullscreen', 'VG_UTILS', 'VG_STATES', function ($scope, $window, vgConfigLoader, vgFullscreen, VG_UTILS, VG_STATES) {
    var currentTheme = null;
    var isFullScreenPressed = false;
    var isMetaDataLoaded = false;

    // PUBLIC $API
    this.videogularElement = null;

    this.clearMedia = function () {
      $scope.API.mediaElement[0].src = '';
    };

    this.onCanPlay = function (evt) {
      $scope.API.isBuffering = false;
      $scope.$apply();
    };

    this.onVideoReady = function () {
      // Here we're in the video scope, we can't use 'this.'
      $scope.API.isReady = true;
      $scope.API.autoPlay = $scope.vgAutoPlay;
      $scope.API.playsInline = $scope.vgPlaysInline;
      $scope.API.currentState = VG_STATES.STOP;

      isMetaDataLoaded = true;

      if ($scope.vgConfig) {
        vgConfigLoader.loadConfig($scope.vgConfig).then(
          this.onLoadConfig.bind(this)
        );
      }
      else {
        $scope.vgPlayerReady({$API: $scope.API});
      }
    };

    this.onLoadConfig = function(config) {
      $scope.API.config = config;

      $scope.vgTheme = $scope.API.config.theme;
      $scope.vgAutoPlay = $scope.API.config.autoPlay;
      $scope.vgPlaysInline = $scope.API.config.playsInline;

      $scope.vgPlayerReady({$API: $scope.API});
    };

    this.onLoadMetaData = function (evt) {
      $scope.API.isBuffering = false;
      $scope.API.onUpdateTime(evt);
    };

    this.onUpdateTime = function (event) {
      $scope.API.currentTime = 1000 * event.target.currentTime;

      if (event.target.duration != Infinity) {
        $scope.API.totalTime = 1000 * event.target.duration;
        $scope.API.timeLeft = 1000 * (event.target.duration - event.target.currentTime);
        $scope.API.isLive = false;
      }
      else {
        // It's a live streaming without and end
        $scope.API.isLive = true;
      }

      $scope.vgUpdateTime({$currentTime: event.target.currentTime, $duration: event.target.duration});

      $scope.$apply();
    };

    this.onPlay = function () {
      $scope.API.setState(VG_STATES.PLAY);
      $scope.$apply();
    };

    this.onPause = function () {
      $scope.API.setState(VG_STATES.PAUSE);
      $scope.$apply();
    };

    this.onVolumeChange = function () {
      $scope.API.volume = $scope.API.mediaElement[0].volume;
      $scope.$apply();
    };

    this.seekTime = function (value, byPercent) {
      var second;
      if (byPercent) {
        second = value * $scope.API.mediaElement[0].duration / 100;
        $scope.API.mediaElement[0].currentTime = second;
      }
      else {
        second = value;
        $scope.API.mediaElement[0].currentTime = second;
      }

      $scope.API.currentTime = 1000 * second;
    };

    this.playPause = function () {
      if ($scope.API.mediaElement[0].paused) {
        this.play();
      }
      else {
        this.pause();
      }
    };

    this.setState = function (newState) {
      if (newState && newState != $scope.API.currentState) {
        $scope.vgUpdateState({$state: newState});

        $scope.API.currentState = newState;
      }

      return $scope.API.currentState;
    };

    this.play = function () {
      $scope.API.mediaElement[0].play();
      this.setState(VG_STATES.PLAY);
    };

    this.pause = function () {
      $scope.API.mediaElement[0].pause();
      this.setState(VG_STATES.PAUSE);
    };

    this.stop = function () {
      $scope.API.mediaElement[0].pause();
      $scope.API.mediaElement[0].currentTime = 0;
      this.setState(VG_STATES.STOP);
    };

    this.toggleFullScreen = function () {
      // There is no native full screen support or we want to play inline
      if (!vgFullscreen.isAvailable || $scope.vgPlaysInline) {
        if ($scope.API.isFullScreen) {
          $scope.API.videogularElement.removeClass("fullscreen");
          $scope.API.videogularElement.css("z-index", "auto");
        }
        else {
          $scope.API.videogularElement.addClass("fullscreen");
          $scope.API.videogularElement.css("z-index", VG_UTILS.getZIndex());
        }

        $scope.API.isFullScreen = !$scope.API.isFullScreen;
      }
      // Perform native full screen support
      else {
        if ($scope.API.isFullScreen) {
          if (!VG_UTILS.isMobileDevice()) {
            vgFullscreen.exit();
          }
        }
        else {
          // On mobile devices we should make fullscreen only the video object
          if (VG_UTILS.isMobileDevice()) {
            // On iOS we should check if user pressed before fullscreen button
            // and also if metadata is loaded
            if (VG_UTILS.isiOSDevice()) {
              if (isMetaDataLoaded) {
                this.enterElementInFullScreen($scope.API.mediaElement[0]);
              }
              else {
                isFullScreenPressed = true;
                this.play();
              }
            }
            else {
              this.enterElementInFullScreen($scope.API.mediaElement[0]);
            }
          }
          else {
            this.enterElementInFullScreen($scope.API.videogularElement[0]);
          }
        }
      }
    };

    this.enterElementInFullScreen = function (element) {
      vgFullscreen.request(element);
    };

    this.changeSource = function (newValue) {
      $scope.vgChangeSource({$source: newValue});
    };

    this.setVolume = function (newVolume) {
      $scope.vgUpdateVolume({$volume: newVolume});

      $scope.API.mediaElement[0].volume = newVolume;
      $scope.API.volume = newVolume;
    };

    this.updateTheme = function (value) {
      var links = document.getElementsByTagName("link");
      var i;
      var l;

      // Remove previous theme
      if (currentTheme) {
        for (i = 0, l = links.length; i < l; i++) {
          if (links[i].outerHTML.indexOf(currentTheme) >= 0) {
            links[i].parentNode.removeChild(links[i]);
          }
        }
      }

      if (value) {
        var headElem = angular.element(document).find("head");
        var exists = false;

        // Look if theme already exists
        for (i = 0, l = links.length; i < l; i++) {
          exists = (links[i].outerHTML.indexOf(value) >= 0);
          if (exists) break;
        }

        if (!exists) {
          headElem.append("<link rel='stylesheet' href='" + value + "'>");
        }

        currentTheme = value;
      }
    };

    this.onStartBuffering = function (event) {
      $scope.API.isBuffering = true;
      $scope.$apply();
    };

    this.onStartPlaying = function (event) {
      $scope.API.isBuffering = false;
      $scope.$apply();
    };

    this.onComplete = function (event) {
      $scope.vgComplete();

      $scope.API.setState(VG_STATES.STOP);
      $scope.API.isCompleted = true;
      $scope.$apply();
    };

    this.onVideoError = function (event) {
      $scope.vgError({$event: event});
    };

    this.addListeners = function () {
      $scope.API.mediaElement[0].addEventListener("canplay", $scope.API.onCanPlay, false);
      $scope.API.mediaElement[0].addEventListener("loadedmetadata", $scope.API.onLoadMetaData, false);
      $scope.API.mediaElement[0].addEventListener("waiting", $scope.API.onStartBuffering, false);
      $scope.API.mediaElement[0].addEventListener("ended", $scope.API.onComplete, false);
      $scope.API.mediaElement[0].addEventListener("playing", $scope.API.onStartPlaying, false);
      $scope.API.mediaElement[0].addEventListener("play", $scope.API.onPlay, false);
      $scope.API.mediaElement[0].addEventListener("pause", $scope.API.onPause, false);
      $scope.API.mediaElement[0].addEventListener("volumechange", $scope.API.onVolumeChange, false);
      $scope.API.mediaElement[0].addEventListener("timeupdate", $scope.API.onUpdateTime, false);
      $scope.API.mediaElement[0].addEventListener("error", $scope.API.onVideoError, false);
    };

    // FUNCTIONS NOT AVAILABLE THROUGH API
    $scope.API = this;

    $scope.init = function () {
      $scope.API.isReady = false;
      $scope.API.isCompleted = false;
      $scope.API.currentTime = 0;
      $scope.API.totalTime = 0;
      $scope.API.timeLeft = 0;
      $scope.API.isLive = false;
      $scope.API.isConfig = ($scope.vgConfig != undefined);

      $scope.API.updateTheme($scope.vgTheme);
      $scope.addBindings();

      if (vgFullscreen.isAvailable) {
        document.addEventListener(vgFullscreen.onchange, $scope.onFullScreenChange);
      }
    };

    $scope.addBindings = function () {
      $scope.$watch("vgTheme", function (newValue, oldValue) {
        if (newValue != oldValue) {
          $scope.API.updateTheme(newValue);
        }
      });

      $scope.$watch("vgAutoPlay", function (newValue, oldValue) {
        if (newValue != oldValue) {
          if (newValue) $scope.API.play();
        }
      });

      $scope.$watch("vgPlaysInline", function (newValue, oldValue) {
        $scope.API.playsInline = $scope.vgPlaysInline;
      });
    };

    $scope.onFullScreenChange = function (event) {
      $scope.API.isFullScreen = vgFullscreen.isFullScreen();
      $scope.$apply();
    };

    // Empty mediaElement on destroy to avoid that Chrome downloads video even when it's not present
    $scope.$on('$destroy', this.clearMedia);

    // Empty mediaElement when router changes
    $scope.$on('$routeChangeStart', this.clearMedia);

    $scope.init();
  }]
);
