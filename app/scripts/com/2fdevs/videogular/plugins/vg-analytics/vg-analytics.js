/**
 * @license Videogular v0.7.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.analytics:vgAnalytics
 * @restrict E
 * @description
 * Adds analytics support for your videos.
 * This plugin requires the awesome angulartics module:
 * http://luisfarzati.github.io/angulartics
 *
 * Videogular analytics injects Angulartics, so to use your preferred plugin you need to add it on your app.
 *
 * ```html
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-analytics vg-track-info="events"></vg-analytics>
 * </videogular>
 * ```
 *
 * @param {object} vgTrackInfo Object with the tracking info.
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.analytics", ["angulartics"])
  .directive(
  "vgAnalytics",
  ["$analytics", "VG_STATES", function ($analytics, VG_STATES) {
    return {
      restrict: "E",
      require: "^videogular",
      scope: {
        vgTrackInfo: "="
      },
      link: function (scope, elem, attr, API) {
        var info = null;
        var currentState = null;
        var totalISO = null;
        var progressTracks = [];

        if (scope.vgTrackInfo.category || scope.vgTrackInfo.label) {
          info = {};

          if (scope.vgTrackInfo.category) info.category = scope.vgTrackInfo.category;
          if (scope.vgTrackInfo.label) info.label = scope.vgTrackInfo.label;
        }

        scope.trackEvent = function trackEvent(eventName) {
          $analytics.eventTrack(eventName, info);
        };

        scope.onPlayerReady = function onPlayerReady(isReady) {
          if (isReady) {
            scope.trackEvent("ready");
          }
        };

        scope.onChangeState = function onChangeState(state) {
          currentState = state;

          switch(state) {
            case VG_STATES.PLAY:
              if (scope.vgTrackInfo.events.play) scope.trackEvent("play");
              break;

            case VG_STATES.PAUSE:
              if (scope.vgTrackInfo.events.pause) scope.trackEvent("pause");
              break;

            case VG_STATES.STOP:
              if (scope.vgTrackInfo.events.stop) scope.trackEvent("stop");
              break;
          }
        };

        scope.onCompleteVideo = function onCompleteVideo(isCompleted) {
          if (isCompleted) {
            scope.trackEvent("complete");
          }
        };

        scope.onUpdateTime = function onUpdateTime(newCurrentTime) {
          var currentISO = newCurrentTime.getTime() - (API.totalTime.getTimezoneOffset() * 60000);

          if (currentISO && totalISO) {
            if (progressTracks.length > 0 && currentISO >= progressTracks[0].jump) {
              scope.trackEvent("progress " + progressTracks[0].percent + "%");
              progressTracks.shift();
            }
          }
        };

        // Add ready track event
        if (scope.vgTrackInfo.events.ready) {
          scope.$watch(
            function () {
              return API.isReady;
            },
            function (newVal, oldVal) {
              scope.onPlayerReady(newVal);
            }
          );
        }

        // Add state track event
        if (scope.vgTrackInfo.events.play || scope.vgTrackInfo.events.pause || scope.vgTrackInfo.events.stop) {
          scope.$watch(
            function () {
              return API.currentState;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) scope.onChangeState(newVal);
            }
          );
        }

        // Add complete track event
        if (scope.vgTrackInfo.events.complete) {
          scope.$watch(
            function () {
              return API.isCompleted;
            },
            function (newVal, oldVal) {
              scope.onCompleteVideo(newVal);
            }
          );
        }

        // Add progress track event
        if (scope.vgTrackInfo.events.progress) {
          scope.$watch(
            function () {
              return API.currentTime;
            },
            function (newVal, oldVal) {
              scope.onUpdateTime(newVal);
            }
          );

          var totalTimeWatch = scope.$watch(
            function () {
              return API.totalTime;
            },
            function (newVal, oldVal) {
              totalISO = newVal.getTime() - (newVal.getTimezoneOffset() * 60000);

              if (totalISO > 0) {
                var totalTracks = scope.vgTrackInfo.events.progress - 1;
                var progressJump = Math.floor(totalISO / scope.vgTrackInfo.events.progress);

                for (var i=0; i<totalTracks; i++) {
                  progressTracks.push({percent: (i + 1) * scope.vgTrackInfo.events.progress, jump: (i + 1) * progressJump});
                }

                totalTimeWatch();
              }
            }
          );
        }
      }
    }
  }
  ]);

