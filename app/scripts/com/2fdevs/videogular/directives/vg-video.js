/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.vgVideo
 * @restrict E
 * @description
 * Directive to add a source of videos. This directive will create a &lt;video&gt; tag and usually will be above plugin tags.
 *
 * @param {array} vgSrc Bindable array with a list of video sources. A video source is an object with two properties `src` and `type`. The `src` property must contains a trusful url resource.
 * {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/7359898/video/videogular.mp4"), type: "video/mp4"}
 * **This parameter is required.**
 *
 * @param {boolean} [vgLoop=false] vgLoop Boolean value or scope variable name to auto start playing video when it is initialized.
 * @param {string} [vgPreload=false] vgPreload String value or scope variable name to set how to preload the video. **This parameter is disabled in mobile devices** because user must click on content to start data preload.
 * @param {boolean} [vgNativeControls=false] vgNativeControls String value or scope variable name to set native controls visible.
 * @param {array} [vgTracks=false] vgTracks Bindable array with a list of subtitles sources. A track source is an object with five properties: `src`, `kind`, `srclang`, `label` and `default`.
 * {src: "assets/subs/pale-blue-dot.vtt", kind: "subtitles", srclang: "en", label: "English", default: "true/false"}
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgVideo",
  ["$compile", function ($compile) {
    return {
      restrict: "E",
      require: ["^videogular", "vgVideo"],
      controller: "vgMediaController",
      scope: {
        vgSrc: "=",
        vgLoop: "=",
        vgPreload: "=",
        vgNativeControls: "=",
        vgTracks: "="
      },
      link: function (scope, elem, attr, controllers) {
        var API = controllers[0];
        var mediaCtrl = controllers[1];

        mediaCtrl.init(API);
        mediaCtrl.compile(elem, '<video vg-source="vgSrc"></video>');
      }
    }
  }
  ]);
