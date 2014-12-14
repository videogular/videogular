/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.vgMedia
 * @restrict E
 * @description
 * Directive to add a source of videos or audios. This directive will create a &lt;video&gt; tag and usually will be above plugin tags.
 *
 * @param {array} vgSrc Bindable array with a list of media sources. A media source is an object with two properties `src` and `type`. The `src` property must contains a trusful url resource.
 * {src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgMedia",
  [function () {
    return {
      restrict: "E",
      require: ["^videogular", "vgMedia"],
      controller: "vgMediaController",
      scope: {
        vgSrc: "=?"
      },
      link: function (scope, elem, attr, controllers) {
        var API = controllers[0];
        var mediaCtrl = controllers[1];

        mediaCtrl.init(API);
        mediaCtrl.compile(elem, '<video></video>');

        if (API.isConfig) {
          scope.$watch(
            function() {
              return API.config;
            },
            function() {
              if (API.config) {
                scope.vgSrc = API.config.sources;
              }
            }
          );
        }
      }
    }
  }
  ]);
