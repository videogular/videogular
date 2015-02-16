/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:videogular
 * @restrict E
 * @description
 * Main directive that must wrap a &lt;vg-media&gt; tag and all plugins.
 *
 * &lt;video&gt; tag usually will be above plugin tags, that's because plugins should be in a layer over the &lt;video&gt;.
 *
 * @param {string} vgTheme String with a scope name variable. This directive will inject a CSS link in the header of your page.
 * **This parameter is required.**
 *
 * @param {boolean} [vgAutoPlay=false] vgAutoPlay Boolean value or a String with a scope name variable to auto start playing video when it is initialized.
 *
 * **This parameter is disabled in mobile devices** because user must click on content to prevent consuming mobile data plans.
 *
 * @param {function} vgConfig String with a url to a config file. Config file's must be a JSON file object with the following structure:
 * ```js
{
  "controls": false,
  "loop": false,
  "autoplay": false,
  "preload": "auto",
  "theme": "path/to/videogular.css",
  "sources": [
    {
      "src": "path/to/videogular.mp4",
      "type": "video/mp4"
    },
    {
      "src": "path/to/videogular.webm",
      "type": "video/webm"
    },
    {
      "src": "path/to/videogular.ogg",
      "type": "video/ogg"
    }
  ],
  "tracks": [
    {
      "src": "path/to/pale-blue-dot.vtt",
      "kind": "subtitles",
      "srclang": "en",
      "label": "English",
      "default": ""
    }
  ],
  "plugins": {
    "controls": {
      "autohide": true,
      "autohideTime": 3000
    },
    "poster": {
      "url": "path/to/earth.png"
    },
    "ima-ads": {
      "companion": "companionAd",
      "companionSize": [728, 90],
      "network": "6062",
      "unitPath": "iab_vast_samples",
      "adTagUrl": "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=%2F3510761%2FadRulesSampleTags&ciu_szs=160x600%2C300x250%2C728x90&cust_params=adrule%3Dpremidpostpodandbumpers&impl=s&gdfp_req=1&env=vp&ad_rule=1&vid=47570401&cmsid=481&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]",
      "skipButton": "<div class='skipButton'>skip ad</div>"
    },
    "analytics": {
      "category": "Videogular",
      "label": "Main",
      "events": {
        "ready": true,
        "play": true,
        "pause": true,
        "stop": true,
        "complete": true,
        "progress": 10
      }
    }
  }
}
 * ```
 * @param {function} vgComplete Function name in controller's scope to call when video have been completed.
 * @param {function} vgUpdateVolume Function name in controller's scope to call when volume changes. Receives a param with the new volume.
 * @param {function} vgUpdateTime Function name in controller's scope to call when video playback time is updated. Receives two params with current time and duration in milliseconds.
 * @param {function} vgUpdateState Function name in controller's scope to call when video state changes. Receives a param with the new state. Possible values are "play", "stop" or "pause".
 * @param {function} vgPlayerReady Function name in controller's scope to call when video have been initialized. Receives a param with the videogular API.
 * @param {function} vgChangeSource Function name in controller's scope to change current video source. Receives a param with the new video.
 * @param {function} vgPlaysInline Boolean to disable native fullscreen and plays video inline.
 * @param {function} vgError Function name in controller's scope to receive an error from video object. Receives a param with the error event.
 * This is a free parameter and it could be values like "new.mp4", "320" or "sd". This will allow you to use this to change a video or video quality.
 * This callback will not change the video, you should do that by updating your sources scope variable.
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("videogular",
  [function () {
    return {
      restrict: "E",
      scope: {
        vgTheme: "=?",
        vgAutoPlay: "=?",
        vgPlaysInline: "=?",
        vgConfig: "@",
        vgComplete: "&",
        vgUpdateVolume: "&",
        vgUpdateTime: "&",
        vgUpdateState: "&",
        vgPlayerReady: "&",
        vgChangeSource: "&",
        vgError: "&"
      },
      controller: "vgController",
      link: {
        pre: function (scope, elem, attr, controller) {
          controller.videogularElement = angular.element(elem);
        }
      }
    }
  }
  ]);
