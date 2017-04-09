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
 * @name com.2fdevs.videogular.constant:VG_VOLUME_KEY
 *
 * @description localStorage key name for persistent video play volume on a domain.
 **/
"use strict";
angular.module("com.2fdevs.videogular")
    .constant("VG_STATES", {
        PLAY: "play",
        PAUSE: "pause",
        STOP: "stop"
    })
    .constant("VG_VOLUME_KEY", "videogularVolume");
