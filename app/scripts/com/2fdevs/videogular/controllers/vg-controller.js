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
 * - setState(state): Sets a new state. Param state mus be an string with 'play', 'pause' or 'stop'. This method only changes the state of the player, but doesn't plays, pauses or stops the media file.
 * - toggleFullScreen(): Toggles between fullscreen and normal mode.
 * - updateTheme(css-url): Removes previous CSS theme and sets a new one.
 * - clearMedia(): Cleans the current media file.
 * - changeSource(array): Updates current media source. Param `array` must be an array of media source objects.
 * A media source is an object with two properties `src` and `type`. The `src` property must contains a trustful url resource.
 * <pre>{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}</pre>
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
 * - cuePoints: Object containing a list of timelines with cue points. Each property in the object represents a timeline, which is an Array of objects with the next definition:
 * <pre>{
 *    timeLapse:{
 *      start: 0,
 *      end: 10
 *    },
 *    onLeave: callback(currentTime, timeLapse, params),
 *    onUpdate: callback(currentTime, timeLapse, params),
 *    onComplete: callback(currentTime, timeLapse, params),
 *    params: {
 *      // Custom object with desired structure and data
 *    }
 * }</pre>
 *
 *    * timeLapse: Object with start and end properties to define in seconds when this timeline is active.\n
 *    * onLeave: Callback function that will be called when user seeks and the new time doesn't reach to the timeLapse.start property.
 *    * onUpdate: Callback function that will be called when the progress is in the middle of timeLapse.start and timeLapse.end.
 *    * onComplete: Callback function that will be called when the progress is bigger than timeLapse.end.
 *    * params: Custom object with data to pass to the callbacks.
 *
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
      this.mediaElement[0].src = '';
    };

    this.onCanPlay = function (evt) {
      this.isBuffering = false;
      $scope.$apply();
    };

    this.onVideoReady = function () {
      this.isReady = true;
      this.autoPlay = $scope.vgAutoPlay;
      this.playsInline = $scope.vgPlaysInline;
      this.cuePoints = $scope.vgCuePoints;
      this.currentState = VG_STATES.STOP;

      isMetaDataLoaded = true;

      if ($scope.vgConfig) {
        vgConfigLoader.loadConfig($scope.vgConfig).then(
          this.onLoadConfig.bind(this)
        );
      }
      else {
        $scope.vgPlayerReady({$API: this});
      }
    };

    this.onLoadConfig = function(config) {
      this.config = config;

      $scope.vgTheme = this.config.theme;
      $scope.vgAutoPlay = this.config.autoPlay;
      $scope.vgPlaysInline = this.config.playsInline;
      $scope.vgCuePoints = this.config.cuePoints;

      $scope.vgPlayerReady({$API: this});
    };

    this.onLoadMetaData = function (evt) {
      this.isBuffering = false;
      this.onUpdateTime(evt);
    };

    this.onUpdateTime = function (event) {
      this.currentTime = 1000 * event.target.currentTime;

      if (event.target.duration != Infinity) {
        this.totalTime = 1000 * event.target.duration;
        this.timeLeft = 1000 * (event.target.duration - event.target.currentTime);
        this.isLive = false;
      }
      else {
        // It's a live streaming without and end
        this.isLive = true;
      }

      if (this.cuePoints) {
        this.checkCuePoints(event.target.currentTime);
      }

      $scope.vgUpdateTime({$currentTime: event.target.currentTime, $duration: event.target.duration});

      $scope.$apply();
    };

    this.checkCuePoints = function checkCuePoints(currentTime) {
      for (var tl in this.cuePoints) {
        for (var i=0, l=this.cuePoints[tl].length; i<l; i++) {
          var cp = this.cuePoints[tl][i];

          if (currentTime < cp.timeLapse.end) cp.$$isCompleted = false;

          // Check if we've been reached to the cue point
          if (currentTime > cp.timeLapse.start) {
            cp.$$isDirty = true;

            // We're in the timelapse
            if (currentTime < cp.timeLapse.end) {
              if (cp.onUpdate) cp.onUpdate(currentTime, cp.timeLapse, cp.params);
            }

            // We've been passed the cue point
            if (currentTime >= cp.timeLapse.end) {
              if (cp.onComplete && !cp.$$isCompleted) {
                cp.$$isCompleted = true;
                cp.onComplete(currentTime, cp.timeLapse, cp.params);
              }
            }
          }
          else {
            if (cp.onLeave && cp.$$isDirty) {
              cp.onLeave(currentTime, cp.timeLapse, cp.params);
            }

            cp.$$isDirty = false;
          }
        }
      }
    };

    this.onPlay = function () {
      this.setState(VG_STATES.PLAY);
      $scope.$apply();
    };

    this.onPause = function () {
      if (this.mediaElement[0].currentTime == 0) {
        this.setState(VG_STATES.STOP);
      }
      else {
        this.setState(VG_STATES.PAUSE);
      }

      $scope.$apply();
    };

    this.onVolumeChange = function () {
      this.volume = this.mediaElement[0].volume;
      $scope.$apply();
    };

    this.seekTime = function (value, byPercent) {
      var second;
      if (byPercent) {
        second = value * this.mediaElement[0].duration / 100;
        this.mediaElement[0].currentTime = second;
      }
      else {
        second = value;
        this.mediaElement[0].currentTime = second;
      }

      this.currentTime = 1000 * second;
    };

    this.playPause = function () {
      if (this.mediaElement[0].paused) {
        this.play();
      }
      else {
        this.pause();
      }
    };

    this.setState = function (newState) {
      if (newState && newState != this.currentState) {
        $scope.vgUpdateState({$state: newState});

        this.currentState = newState;
      }

      return this.currentState;
    };

    this.play = function () {
      this.mediaElement[0].play();
      this.setState(VG_STATES.PLAY);
    };

    this.pause = function () {
      this.mediaElement[0].pause();
      this.setState(VG_STATES.PAUSE);
    };

    this.stop = function () {
      this.mediaElement[0].pause();
      this.mediaElement[0].currentTime = 0;
      this.setState(VG_STATES.STOP);
    };

    this.toggleFullScreen = function () {
      // There is no native full screen support or we want to play inline
      if (!vgFullscreen.isAvailable || $scope.vgPlaysInline) {
        if (this.isFullScreen) {
          this.videogularElement.removeClass("fullscreen");
          this.videogularElement.css("z-index", "auto");
        }
        else {
          this.videogularElement.addClass("fullscreen");
          this.videogularElement.css("z-index", VG_UTILS.getZIndex());
        }

        this.isFullScreen = !this.isFullScreen;
      }
      // Perform native full screen support
      else {
        if (this.isFullScreen) {
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
                this.enterElementInFullScreen(this.mediaElement[0]);
              }
              else {
                isFullScreenPressed = true;
                this.play();
              }
            }
            else {
              this.enterElementInFullScreen(this.mediaElement[0]);
            }
          }
          else {
            this.enterElementInFullScreen(this.videogularElement[0]);
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

      this.mediaElement[0].volume = newVolume;
      this.volume = newVolume;
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
            break;
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
      this.isBuffering = true;
      $scope.$apply();
    };

    this.onStartPlaying = function (event) {
      this.isBuffering = false;
      $scope.$apply();
    };

    this.onComplete = function (event) {
      $scope.vgComplete();

      this.setState(VG_STATES.STOP);
      this.isCompleted = true;
      $scope.$apply();
    };

    this.onVideoError = function (event) {
      $scope.vgError({$event: event});
    };

    this.addListeners = function () {
      this.mediaElement[0].addEventListener("canplay", this.onCanPlay.bind(this), false);
      this.mediaElement[0].addEventListener("loadedmetadata", this.onLoadMetaData.bind(this), false);
      this.mediaElement[0].addEventListener("waiting", this.onStartBuffering.bind(this), false);
      this.mediaElement[0].addEventListener("ended", this.onComplete.bind(this), false);
      this.mediaElement[0].addEventListener("playing", this.onStartPlaying.bind(this), false);
      this.mediaElement[0].addEventListener("play", this.onPlay.bind(this), false);
      this.mediaElement[0].addEventListener("pause", this.onPause.bind(this), false);
      this.mediaElement[0].addEventListener("volumechange", this.onVolumeChange.bind(this), false);
      this.mediaElement[0].addEventListener("timeupdate", this.onUpdateTime.bind(this), false);
      this.mediaElement[0].addEventListener("error", this.onVideoError.bind(this), false);
    };

    this.init = function () {
      this.isReady = false;
      this.isCompleted = false;
      this.currentTime = 0;
      this.totalTime = 0;
      this.timeLeft = 0;
      this.isLive = false;
      this.isFullScreen = false;
      this.isConfig = ($scope.vgConfig != undefined);

      if (vgFullscreen.isAvailable) {
        this.isFullScreen = vgFullscreen.isFullScreen();
      }

      this.updateTheme($scope.vgTheme);
      this.addBindings();

      if (vgFullscreen.isAvailable) {
        document.addEventListener(vgFullscreen.onchange, this.onFullScreenChange.bind(this));
      }
    };

    this.onUpdateTheme = function onUpdateTheme(newValue) {
      this.updateTheme(newValue);
    };

    this.onUpdateAutoPlay = function onUpdateAutoPlay(newValue) {
      if (newValue) this.play(this);
    };

    this.addBindings = function () {
      $scope.$watch("vgTheme", this.onUpdateTheme.bind(this));

      $scope.$watch("vgAutoPlay", this.onUpdateAutoPlay.bind(this));

      $scope.$watch("vgPlaysInline", function (newValue, oldValue) {
        this.playsInline = newValue;
      });
    };

    this.onFullScreenChange = function (event) {
      this.isFullScreen = vgFullscreen.isFullScreen();
      $scope.$apply();
    };

    // Empty mediaElement on destroy to avoid that Chrome downloads video even when it's not present
    $scope.$on('$destroy', this.clearMedia.bind(this));

    // Empty mediaElement when router changes
    $scope.$on('$routeChangeStart', this.clearMedia.bind(this));

    this.init();
  }]
);
