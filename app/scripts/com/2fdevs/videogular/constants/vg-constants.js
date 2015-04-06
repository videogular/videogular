/**
 * @ngdoc service
 * @name com.2fdevs.videogular.constant:VG_STATES
 *
 * @description
 * Possible video states:
 *  - VG_STATES.PLAY: "play"
 *  - VG_STATES.PAUSE: "pause"
 *  - VG_STATES.STOP: "stop"
 **/
/**
 * @ngdoc service
 * @name com.2fdevs.videogular.constant:VG_VOLUME_LOCAL_STORAGE
 *
 * @description localStorage key for storing volume changes.
 **/
"use strict";
angular.module("com.2fdevs.videogular")
  .constant("VG_STATES", {
    PLAY: "play",
    PAUSE: "pause",
    STOP: "stop"
  })
  .constant("VG_VOLUME_KEY", "videogularVolume");
