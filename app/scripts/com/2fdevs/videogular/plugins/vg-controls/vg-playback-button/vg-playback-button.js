/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:ngPlaybackButton
 * @restrict E
 * @description
 * Directive to display a playback buttom to control the playback rate.
 *
 * @param {array} vgSpeeds Bindable array with a list of speed options as strings. Default ['0.5', '1', '1.5', '2']
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-playback-button vg-speeds='config.playbackSpeeds'></vg-playback-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-playback-button",
            '<button class="playbackValue iconButton" ng-click="onClickPlayback()">{{playback}}x</button>');
    }]
)
    .directive("vgPlaybackButton",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-playback-button';
            },
            scope: {
                vgSpeeds: '=?'
            },
            link: function (scope, elem, attr, API) {
                scope.playback = '1';

                scope.setPlayback = function(playback) {
                    scope.playback = playback;
                    API.setPlayback(parseFloat(playback));
                };

                scope.onClickPlayback = function onClickPlayback() {
                    var playbackOptions = scope.vgSpeeds || ['0.5', '1', '1.5', '2'];
                    var nextPlaybackRate = playbackOptions.indexOf(scope.playback.toString()) + 1;

                    if (nextPlaybackRate >= playbackOptions.length) {
                        scope.playback = playbackOptions[0];
                    }
                    else {
                        scope.playback = playbackOptions[nextPlaybackRate];
                    }

                    scope.setPlayback(scope.playback);
                };

                scope.$watch(
                    function () {
                        return API.playback;
                    },
                    function(newVal, oldVal) {
                        if (newVal != oldVal) {
                            scope.setPlayback(newVal);
                        }
                    }
                );
            }
        }
    }]
);
