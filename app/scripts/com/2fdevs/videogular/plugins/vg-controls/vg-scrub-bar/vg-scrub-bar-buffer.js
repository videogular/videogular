/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarBuffer
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display the buffer.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-buffer></vg-scrub-bar-buffer>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .directive("vgScrubBarBuffer",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            link: function (scope, elem, attr, API) {
                var percentTime = 0;

                scope.onUpdateBuffer = function onUpdateBuffer(newBuffer) {
                    if (typeof newBuffer === 'number' && API.totalTime) {
                        percentTime = 100 * (newBuffer / API.totalTime);
                        elem.css("width", percentTime + "%");
                    } else {
                        elem.css("width", 0);
                    }
                };

                scope.$watch(
                    function () {
                        return API.bufferEnd;
                    },
                    function (newVal, oldVal) {
                        scope.onUpdateBuffer(newVal);
                    }
                );
            }
        }
    }]
);
