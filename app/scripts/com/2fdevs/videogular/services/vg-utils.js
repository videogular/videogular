"use strict";
angular.module("com.2fdevs.videogular")
  .service("VG_UTILS", function () {
    this.fixEventOffset = function ($event) {
      /**
       * There's no offsetX in Firefox, so we fix that.
       * Solution provided by Jack Moore in this post:
       * http://www.jacklmoore.com/notes/mouse-position/
       * @param $event
       * @returns {*}
       */
      if (navigator.userAgent.match(/Firefox/i)) {
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

      var tags = document.getElementsByTagName('*');

      for (var i=0, l=tags.length; i<l; i++) {
        if (tags[i].style.zIndex && parseInt(tags[i].style.zIndex) > zIndex) {
          zIndex = parseInt(tags[i].style.zIndex) + 1;
        }
      }

      return zIndex;
    };

    // Very simple mobile detection, not 100% reliable
    this.isMobileDevice = function () {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf("IEMobile") !== -1);
    };

    this.isiOSDevice = function () {
      return (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i));
    };
  });
