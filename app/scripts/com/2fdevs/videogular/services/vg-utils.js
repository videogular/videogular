"use strict";
angular.module("com.2fdevs.videogular")
    .service("VG_UTILS", ["$window", function ($window) {
        this.fixEventOffset = function ($event) {
            /**
             * There's no offsetX in Firefox, so we fix that.
             * Solution provided by Jack Moore in this post:
             * http://www.jacklmoore.com/notes/mouse-position/
             * @param $event
             * @returns {*}
             */
            var matchedFF = navigator.userAgent.match(/Firefox\/(\d+)/i)
            if (matchedFF && Number.parseInt(matchedFF.pop()) < 39) {
                var style = $event.currentTarget.currentStyle || window.getComputedStyle($event.target, null);
                var borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
                var borderTopWidth = parseInt(style['borderTopWidth'], 10);
                var rect = $event.currentTarget.getBoundingClientRect();
                var offsetX = $event.clientX - borderLeftWidth - rect.left;
                var offsetY = $event.clientY - borderTopWidth - rect.top;

                $event.offsetX = offsetX;
                $event.offsetY = offsetY;
            }

            return $event;
        };

        /**
         * Inspired by Paul Irish
         * https://gist.github.com/paulirish/211209
         * @returns {number}
         */
        this.getZIndex = function () {
            var zIndex = 1;
            var elementZIndex;

            var tags = document.getElementsByTagName('*');

            for (var i = 0, l = tags.length; i < l; i++) {
                elementZIndex = parseInt(window.getComputedStyle(tags[i])["z-index"]);

                if (elementZIndex > zIndex) {
                    zIndex = elementZIndex + 1;
                }
            }

            return zIndex;
        };

        // Very simple mobile detection, not 100% reliable
        this.isMobileDevice = function () {
            return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf("IEMobile") !== -1);
        };

        this.isiOSDevice = function () {
            return (navigator.userAgent.match(/ip(hone|ad|od)/i) && !navigator.userAgent.match(/(iemobile)[\/\s]?([\w\.]*)/i));
        };

        this.isCordova = function () {
            return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        };

        /**
         * Test the browser's support for HTML5 localStorage.
         * @returns {boolean}
         */
        this.supportsLocalStorage = function () {
            var testKey = 'videogular-test-key';
            var storage = $window.sessionStorage;

            try {
                storage.setItem(testKey, '1');
                storage.removeItem(testKey);
                return 'localStorage' in $window && $window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        };
    }]);
