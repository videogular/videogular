/**
 * @license Videogular v0.7.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
angular.module("com.2fdevs.videogular", ["ngSanitize"])
  .run(["$window", "VG_UTILS",
    function ($window, VG_UTILS) {
      // Native fullscreen polyfill
      var fullScreenAPI;
      var APIs = {
        w3: {
          enabled: "fullscreenEnabled",
          element: "fullscreenElement",
          request: "requestFullscreen",
          exit: "exitFullscreen",
          onchange: "fullscreenchange",
          onerror: "fullscreenerror"
        },
        newWebkit: {
          enabled: "webkitFullscreenEnabled",
          element: "webkitFullscreenElement",
          request: "webkitRequestFullscreen",
          exit: "webkitExitFullscreen",
          onchange: "webkitfullscreenchange",
          onerror: "webkitfullscreenerror"
        },
        oldWebkit: {
          enabled: "webkitIsFullScreen",
          element: "webkitCurrentFullScreenElement",
          request: "webkitRequestFullScreen",
          exit: "webkitCancelFullScreen",
          onchange: "webkitfullscreenchange",
          onerror: "webkitfullscreenerror"
        },
        moz: {
          enabled: "mozFullScreen",
          element: "mozFullScreenElement",
          request: "mozRequestFullScreen",
          exit: "mozCancelFullScreen",
          onchange: "mozfullscreenchange",
          onerror: "mozfullscreenerror"
        },
        ios: {
          enabled: "webkitFullscreenEnabled",
          element: "webkitFullscreenElement",
          request: "webkitEnterFullscreen",
          exit: "webkitExitFullscreen",
          onchange: "webkitfullscreenchange",
          onerror: "webkitfullscreenerror"
        },
        ms: {
          enabled: "msFullscreenEnabled",
          element: "msFullscreenElement",
          request: "msRequestFullscreen",
          exit: "msExitFullscreen",
          onchange: "msfullscreenchange",
          onerror: "msfullscreenerror"
        }
      };

      for (var browser in APIs) {
        if (APIs[browser].enabled in document) {
          fullScreenAPI = APIs[browser];
          fullScreenAPI.isFullScreen = function () {
            return (document[this.element] != null);
          };

          break;
        }
      }

      // Override APIs on iOS
      if (VG_UTILS.isiOSDevice()) {
        fullScreenAPI = APIs.ios;
        fullScreenAPI.isFullScreen = function () {
          return (document[this.element] != null);
        };
      }

      angular.element($window)[0].fullScreenAPI = fullScreenAPI;
    }
  ]);
