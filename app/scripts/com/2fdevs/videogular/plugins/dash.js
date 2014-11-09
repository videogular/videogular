/**
 * @license Videogular v0.7.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.dash:vgDash
 * @restrict E
 * @description
 * Adds support for vg-video and vg-audio tags.
 * This plugin requires dash.all.js file available at dash.js project:
 * https://github.com/Dash-Industry-Forum/dash.js
 *
 * ```html
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-video vg-src="sources" vg-dash></vg-video>
 * </videogular>
 * ```
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.dash", [])
  .directive(
  "vgDash",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: function (scope, elem, attr, API) {
        var context;
        var player;

        function isDASH(url) {
          if (url.indexOf) {
            return (url.indexOf(".mpd") > 0);
          }
        }

        function onSourceChange(url) {
          // It's DASH, we use Dash.js
          if (isDASH(url)) {
            context = new Dash.di.DashContext();
            player = new MediaPlayer(context);
            player.setAutoPlay(API.autoPlay);
            player.startup();
            player.attachView(API.mediaElement[0]);
            player.attachSource(url);
          }
          else {
            if (player) {
              player.reset();
              player = null;
            }
          }
        }

        scope.$watch(
          function () {
            return API.sources;
          },
          function (newVal, oldVal) {
            onSourceChange(newVal[0].src);
          }
        );
      }
    }
  }
  ]);

