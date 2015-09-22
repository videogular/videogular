/**
 * @ngdoc service
 * @name com.2fdevs.videogular.service:vgFullscreen
 *
 * @description
 * Native fullscreen polyfill service.
 *
 *    * vgFullscreen.onchange: String with the onchange event name.
 *    * vgFullscreen.onerror: String with the onerror event name.
 *    * vgFullscreen.isAvailable: Boolean with fullscreen availability.
 *    * vgFullscreen.isFullScreen: Boolean with current view mode.
 *    * vgFullscreen.exit: Exit fullscreen function.
 *    * vgFullscreen.request: Request for fullscreen access function.
 **/
"use strict";
angular.module("com.2fdevs.videogular")
    .service("vgFullscreen", ["VG_UTILS", function (VG_UTILS) {
        // Native fullscreen polyfill
        var element;
        var polyfill = null;
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
                onchange: "MSFullscreenChange",
                onerror: "MSFullscreenError"
            }
        };

        for (var browser in APIs) {
            if (APIs[browser].enabled in document) {
                polyfill = APIs[browser];
                break;
            }
        }

        // Override APIs on iOS
        if (VG_UTILS.isiOSDevice()) {
            polyfill = APIs.ios;
        }

        function isFullScreen() {
            var result = false;

            if (element) {
                result = (document[polyfill.element] != null || element.webkitDisplayingFullscreen)
            }
            else {
                result = (document[polyfill.element] != null)
            }

            return result;
        }

        this.isAvailable = (polyfill != null);

        if (polyfill) {
            this.onchange = polyfill.onchange;
            this.onerror = polyfill.onerror;
            this.isFullScreen = isFullScreen;
            this.exit = function () {
                document[polyfill.exit]();
            };
            this.request = function (elem) {
                element = elem;
                element[polyfill.request]();
            };
        }
    }]);
