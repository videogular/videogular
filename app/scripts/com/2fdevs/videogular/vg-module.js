/**
 * @license Videogular v1.0.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
angular.module("com.2fdevs.videogular", ["ngSanitize"])
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-media", "<video></video>");
    }]
  );
