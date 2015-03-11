/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBar
 * @restrict E
 * @description
 * Directive to control the time and display other information layers about the progress of the media.
 * This directive acts as a container and you can add more layers to display current time, cuepoints, buffer or whatever you need.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar></vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-scrub-bar",
        '<div role="slider" aria-valuemax="{{ariaTime(API.totalTime)}}" aria-valuenow="{{ariaTime(API.currentTime)}}" aria-valuemin="0" aria-label="Time scrub bar" tabindex="0" ng-transclude ng-keydown="onScrubBarKeyDown($event)"></div>');
    }]
  )
  .directive("vgScrubBar",
    ["VG_STATES", "VG_UTILS", function (VG_STATES, VG_UTILS) {
      return {
        restrict: "E",
        require: "^videogular",
        transclude: true,
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-scrub-bar';
        },
        link: function (scope, elem, attr, API) {
          var isSeeking = false;
          var isPlaying = false;
          var isPlayingWhenSeeking = false;
          var touchStartX = 0;
          var LEFT = 37;
          var RIGHT = 39;
          var NUM_PERCENT = 5;

          scope.API = API;
          scope.ariaTime = function(time) {
            return Math.round(time / 1000);
          };

          scope.onScrubBarTouchStart = function onScrubBarTouchStart($event) {
            var event = $event.originalEvent || $event;
            var touches = event.touches;
            var touchX;

            if (VG_UTILS.isiOSDevice()) {
              touchStartX = (touches[0].clientX - event.layerX) * -1;
            }
            else {
              touchStartX = event.layerX;
            }

            touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;

            isSeeking = true;
            if (isPlaying) isPlayingWhenSeeking = true;
            API.pause();
            API.seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);

            scope.$apply();
          };

          scope.onScrubBarTouchEnd = function onScrubBarTouchEnd($event) {
            var event = $event.originalEvent || $event;
            if (isPlayingWhenSeeking) {
              isPlayingWhenSeeking = false;
              API.play();
            }
            isSeeking = false;

            scope.$apply();
          };

          scope.onScrubBarTouchMove = function onScrubBarTouchMove($event) {
            var event = $event.originalEvent || $event;
            var touches = event.touches;
            var touchX;

            if (isSeeking) {
              touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
              API.seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
            }

            scope.$apply();
          };

          scope.onScrubBarTouchLeave = function onScrubBarTouchLeave(event) {
            isSeeking = false;

            scope.$apply();
          };

          scope.onScrubBarMouseDown = function onScrubBarMouseDown(event) {
            event = VG_UTILS.fixEventOffset(event);

            isSeeking = true;
            if (isPlaying) isPlayingWhenSeeking = true;
            API.pause();

            API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

            scope.$apply();
          };

          scope.onScrubBarMouseUp = function onScrubBarMouseUp(event) {
            //event = VG_UTILS.fixEventOffset(event);

            if (isPlayingWhenSeeking) {
              isPlayingWhenSeeking = false;
              API.play();
            }
            isSeeking = false;
            //API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

            scope.$apply();
          };

          scope.onScrubBarMouseMove = function onScrubBarMouseMove(event) {
            if (isSeeking) {
              event = VG_UTILS.fixEventOffset(event);
              API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
            }

            scope.$apply();
          };

          scope.onScrubBarMouseLeave = function onScrubBarMouseLeave(event) {
            isSeeking = false;

            scope.$apply();
          };

          scope.onScrubBarKeyDown = function onScrubBarKeyDown(event) {
            var currentPercent = (API.currentTime / API.totalTime) * 100;

            if (event.which === LEFT || event.keyCode === LEFT) {
              API.seekTime(currentPercent - NUM_PERCENT, true);
              event.preventDefault();
            }
            else if (event.which === RIGHT || event.keyCode === RIGHT) {
              API.seekTime(currentPercent + NUM_PERCENT, true);
              event.preventDefault();
            }
          };

          scope.setState = function setState(newState) {
            if (!isSeeking) {
              switch (newState) {
                case VG_STATES.PLAY:
                  isPlaying = true;
                  break;

                case VG_STATES.PAUSE:
                  isPlaying = false;
                  break;

                case VG_STATES.STOP:
                  isPlaying = false;
                  break;
              }
            }
          };

          scope.$watch(
            function () {
              return API.currentState;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.setState(newVal);
              }
            }
          );

          // Touch move is really buggy in Chrome for Android, maybe we could use mouse move that works ok
          if (VG_UTILS.isMobileDevice()) {
            elem.bind("touchstart", scope.onScrubBarTouchStart);
            elem.bind("touchend", scope.onScrubBarTouchEnd);
            elem.bind("touchmove", scope.onScrubBarTouchMove);
            elem.bind("touchleave", scope.onScrubBarTouchLeave);
          }
          else {
            elem.bind("mousedown", scope.onScrubBarMouseDown);
            elem.bind("mouseup", scope.onScrubBarMouseUp);
            elem.bind("mousemove", scope.onScrubBarMouseMove);
            elem.bind("mouseleave", scope.onScrubBarMouseLeave);
          }
        }
      }
    }]
  );
