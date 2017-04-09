/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgFullscreenButton
 * @restrict E
 * @description
 * Directive to switch between fullscreen and normal mode.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-fullscreen-button></vg-fullscreen-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-fullscreen-button",
            '<button class="iconButton" ng-click="onClickFullScreen()" ng-class="fullscreenIcon" aria-label="Toggle full screen" type="button"> </button>');
    }]
)
    .directive("vgFullscreenButton",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            scope: {},
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-fullscreen-button';
            },
            link: function (scope, elem, attr, API) {
                scope.onChangeFullScreen = function onChangeFullScreen(isFullScreen) {
                    scope.fullscreenIcon = {enter: !isFullScreen, exit: isFullScreen};
                };

                scope.onClickFullScreen = function onClickFullScreen() {
                    API.toggleFullScreen();
                };

                scope.fullscreenIcon = {enter: true};

                scope.$watch(
                    function () {
                        return API.isFullScreen;
                    },
                    function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            scope.onChangeFullScreen(newVal);
                        }
                    }
                );
            }
        }
    }]
);
