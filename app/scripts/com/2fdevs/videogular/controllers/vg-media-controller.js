"use strict";
angular.module("com.2fdevs.videogular")
  .controller("vgMediaController",
    ["$scope", "$compile", "$timeout", "VG_UTILS", "VG_STATES", function($scope, $compile, $timeout, VG_UTILS, VG_STATES) {
      var ctrl = this;

      this.init = function init(APICtrl) {
        ctrl.API = APICtrl;
        ctrl.API.sources = $scope.vgSrc;

        $scope.$watch("vgSrc", this.onChangeSource);
      };

      this.onChangeSource = function (newValue, oldValue) {
        if ((!ctrl.sources || newValue != oldValue) && newValue) {
          ctrl.sources = newValue;
          ctrl.API.sources = ctrl.sources;
          ctrl.changeSource();
        }
      };

      this.compile = function compile(elem, html) {
        ctrl.API.mediaElement = angular.element(html);
        var compiled = $compile(ctrl.API.mediaElement)($scope);

        ctrl.API.addListeners();

        elem.append(compiled);

        ctrl.API.onVideoReady();
      };

      this.changeSource = function changeSource() {
        var canPlay = "";

        // It's a cool browser
        if (ctrl.API.mediaElement[0].canPlayType) {
          for (var i = 0, l = ctrl.sources.length; i < l; i++) {
            canPlay = ctrl.API.mediaElement[0].canPlayType(ctrl.sources[i].type);

            if (canPlay == "maybe" || canPlay == "probably") {
              ctrl.API.mediaElement.attr("src", ctrl.sources[i].src);
              ctrl.API.mediaElement.attr("type", ctrl.sources[i].type);
              break;
            }
          }
        }
        // It's a crappy browser and it doesn't deserve any respect
        else {
          // Get H264 or the first one
          ctrl.API.mediaElement.attr("src", ctrl.sources[0].src);
          ctrl.API.mediaElement.attr("type", ctrl.sources[0].type);
        }

        $timeout(function() {
          if (ctrl.API.autoPlay && !VG_UTILS.isMobileDevice() || ctrl.API.currentState === VG_STATES.PLAY) ctrl.API.play();
        });

        if (canPlay == "") {
          ctrl.API.onVideoError();
        }
      };
    }]
  );
