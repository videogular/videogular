/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgMuteButton
 * @restrict E
 * @description
 * Directive to display a button to mute volume.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgMuteButton",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'bower_components/vg-controls/views/vg-mute-button.html';
        },
        link: function (scope, elem, attr, API) {
          var isMuted = false;
          var UP = 38;
          var DOWN = 40;
          var CHANGE_PER_PRESS = 0.05;

          scope.onClickMute = function onClickMute() {
            if (isMuted) {
              scope.currentVolume = scope.defaultVolume;
            }
            else {
              scope.currentVolume = 0;
              scope.muteIcon = {mute: true};
            }

            isMuted = !isMuted;

            API.setVolume(scope.currentVolume);
          };

          scope.onMuteButtonFocus = function onMuteButtonFocus() {
            scope.volumeVisibility = "visible";
          };

          scope.onMuteButtonLoseFocus = function onMuteButtonLoseFocus() {
            scope.volumeVisibility = "hidden";
          };

          scope.onMuteButtonKeyDown = function onMuteButtonKeyDown(event) {
            var currentVolume = (API.volume != null) ? API.volume : 1;
            var newVolume;

            if (event.which === UP || event.keyCode === UP) {
              newVolume = currentVolume + CHANGE_PER_PRESS;
              if (newVolume > 1) newVolume = 1;

              API.setVolume(newVolume);
              event.preventDefault();
            }
            else if (event.which === DOWN || event.keyCode === DOWN) {
              newVolume = currentVolume - CHANGE_PER_PRESS;
              if (newVolume < 0) newVolume = 0;

              API.setVolume(newVolume);
              event.preventDefault();
            }
          };

          scope.onSetVolume = function onSetVolume(newVolume) {
            scope.currentVolume = newVolume;

            // TODO: Save volume with LocalStorage
            // if it's not muted we save the default volume
            if (!isMuted) {
              scope.defaultVolume = newVolume;
            }
            else {
              // if was muted but the user changed the volume
              if (newVolume > 0) {
                scope.defaultVolume = newVolume;
              }
            }

            var percentValue = Math.round(newVolume * 100);
            if (percentValue == 0) {
              scope.muteIcon = {mute: true};
            }
            else if (percentValue > 0 && percentValue < 25) {
              scope.muteIcon = {level0: true};
            }
            else if (percentValue >= 25 && percentValue < 50) {
              scope.muteIcon = {level1: true};
            }
            else if (percentValue >= 50 && percentValue < 75) {
              scope.muteIcon = {level2: true};
            }
            else if (percentValue >= 75) {
              scope.muteIcon = {level3: true};
            }
          };

          scope.defaultVolume = 1;
          scope.currentVolume = scope.defaultVolume;
          scope.muteIcon = {level3: true};

          //TODO: get volume from localStorage

          scope.$watch(
            function () {
              return API.volume;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.onSetVolume(newVal);
              }
            }
          );
        }
      }
    }]
  );
