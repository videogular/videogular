/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarCuePoints
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display a cue point timeline.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-cue-points vg-cue-points='config.cuePoints[0]'></vg-scrub-bar-cue-points>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
        ["$templateCache", function($templateCache) {
            $templateCache.put("vg-templates/vg-scrub-bar-cue-points",
                '<div class="cue-point-timeline" ng-style="timelineWidth">' +
                    '<div ng-repeat="cuePoint in vgCuePoints" class="cue-point" ng-style="cuePoint.$$style"></div>' +
                '</div>');
        }]
    )
    .directive("vgScrubBarCuePoints",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            templateUrl: function(elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-scrub-bar-cue-points';
            },
            scope: {
                "vgCuePoints": "="
            },
            link: function (scope, elem, attr, API) {
                var totalTimeWatch;

                scope.onPlayerReady = function onPlayerReady() {
                    scope.updateCuePoints(scope.vgCuePoints);
                    totalTimeWatch();
                };

                scope.updateCuePoints = function onUpdateCuePoints(cuePoints) {
                    var totalWidth = parseInt(elem[0].clientWidth);
                    var left = parseInt(elem[0].offsetLeft);

                    for (var i=0, l=cuePoints.length; i<l; i++) {
                        var cuePointDuration = (cuePoints[i].timeLapse.end - cuePoints[i].timeLapse.start) * 1000;
                        var position = (left + (totalWidth * cuePoints[i].timeLapse.start / API.totalTime * 1000)) + "px";
                        var percentWidth = 0;

                        if (typeof cuePointDuration === 'number' && API.totalTime) {
                            percentWidth = 100 * (cuePointDuration / API.totalTime) + "%";
                        }

                        cuePoints[i].$$style = {
                            width: percentWidth,
                            left: position
                        };
                    }
                };

                totalTimeWatch = scope.$watch(
                    function() {
                        return API.totalTime;
                    },
                    function (newVal, oldVal) {
                        if (newVal > 0) scope.onPlayerReady(newVal);
                    }
                );
            }
        }
    }]
);
