/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarCurrentTime
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display the current time.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .directive("vgScrubBarCurrentTime",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            link: function (scope, elem, attr, API) {
                var percentTime = 0;

                scope.onUpdateTime = function onUpdateTime(newCurrentTime) {
                    if (typeof newCurrentTime === 'number' && API.totalTime) {
                        percentTime = 100 * (newCurrentTime / API.totalTime);
                        elem.css("width", percentTime + "%");
                    } else {
                        elem.css("width", 0);
                    }
                };

                scope.$watch(
                    function () {
                        return API.currentTime;
                    },
                    function (newVal, oldVal) {
                        scope.onUpdateTime(newVal);
                    }
                );
            }
        }
    }]
);
