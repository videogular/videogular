"use strict";
angular.module("com.2fdevs.videogular")
  .controller("vgController",
    ['$scope', '$window', 'vgConfigLoader', 'VG_UTILS', 'VG_STATES', function ($scope, $window, vgConfigLoader, VG_UTILS, VG_STATES) {
      var ctrl = this;
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
        $scope.API.currentState = VG_STATES.STOP;

        isMetaDataLoaded = true;

        if ($scope.vgConfig) {
          vgConfigLoader.loadConfig($scope.vgConfig).then(
            function success(result) {
              ctrl.onLoadConfig(result);
            }
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

        $scope.vgPlayerReady({$API: $scope.API});
      };

      this.onLoadMetaData = function (evt) {
        $scope.API.isBuffering = false;
        $scope.API.onUpdateTime(evt);
      };

      this.onUpdateTime = function (event) {
        $scope.API.currentTime = VG_UTILS.secondsToDate(event.target.currentTime);

        if (event.target.duration != Infinity) {
          $scope.API.totalTime = VG_UTILS.secondsToDate(event.target.duration);
          $scope.API.timeLeft = VG_UTILS.secondsToDate(event.target.duration - event.target.currentTime);
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

        $scope.API.currentTime = VG_UTILS.secondsToDate(second);
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
        // There is no native full screen support
        if (!angular.element($window)[0].fullScreenAPI) {
          if ($scope.API.isFullScreen) {
            $scope.API.videogularElement.removeClass("fullscreen");
            $scope.API.videogularElement.css("z-index", 0);
          }
          else {
            $scope.API.videogularElement.addClass("fullscreen");
            $scope.API.videogularElement.css("z-index", VG_UTILS.getZIndex());
          }

          $scope.API.isFullScreen = !$scope.API.isFullScreen;
        }
        // Perform native full screen support
        else {
          if (angular.element($window)[0].fullScreenAPI.isFullScreen()) {
            if (!VG_UTILS.isMobileDevice()) {
              document[angular.element($window)[0].fullScreenAPI.exit]();
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
        element[angular.element($window)[0].fullScreenAPI.request]();
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
        $scope.API.currentTime = VG_UTILS.secondsToDate(0);
        $scope.API.totalTime = VG_UTILS.secondsToDate(0);
        $scope.API.timeLeft = VG_UTILS.secondsToDate(0);
        $scope.API.isLive = false;
        $scope.API.isConfig = ($scope.vgConfig != undefined);

        $scope.API.updateTheme($scope.vgTheme);
        $scope.addBindings();

        if (angular.element($window)[0].fullScreenAPI) {
          document.addEventListener(angular.element($window)[0].fullScreenAPI.onchange, $scope.onFullScreenChange);
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
      };

      $scope.onFullScreenChange = function (event) {
        $scope.API.isFullScreen = angular.element($window)[0].fullScreenAPI.isFullScreen();
        $scope.$apply();
      };

      // Empty mediaElement on destroy to avoid that Chrome downloads video even when it's not present
      $scope.$on('$destroy', this.clearMedia);

      // Empty mediaElement when router changes
      $scope.$on('$routeChangeStart', this.clearMedia);

      $scope.init();
    }]
  );
