/**
 * @license videogular v1.4.4 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.imaads.directive:vgImaAds
 * @restrict E
 * @description
 * Directive to show Google Interactive Media Ads.
 *
 * @param {string} vgNetwork Your network name.
 * @param {string} vgUnitPath Target unit path.
 * @param {string} vgCompanion Companion name.
 * @param {array} vgCompanionSize Companion size as an array like [width, height].
 * @param {string} vgAdTagUrl Ad tag url, usually a link to the VAST file provided by DoubleClick.
 * @param {string} vgSkipButton Custom skip button HTML like &lt;div class='skipButton'&gt;skip ad&lt;/div&gt;.
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.imaads", [])
    .directive(
    "vgImaAds",
    ["$window", "VG_STATES", function ($window, VG_STATES) {
        return {
            restrict: "E",
            require: "^videogular",
            scope: {
                vgNetwork: "=?",
                vgUnitPath: "=?",
                vgCompanion: "=?",
                vgCompanionSize: "=?",
                vgAdTagUrl: "=?",
                vgSkipButton: "=?"
            },
            link: function (scope, elem, attr, API) {
                var adDisplayContainer = new google.ima.AdDisplayContainer(elem[0]);
                var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
                var adsManager = null;
                var adsLoaded = false;
                var w;
                var h;
                var onContentEnded = function () {
                    adsLoader.contentComplete();
                };
                var currentAd = 0;
                var skipButton = angular.element(scope.vgSkipButton);

                scope.API = API;

                scope.onPlayerReady = function onPlayerReady(isReady) {
                    if (isReady) {
                        API.mediaElement[0].addEventListener('ended', onContentEnded);

                        adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, scope.onAdsManagerLoaded, false, this);
                        adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, scope.onAdError, false, this);

                        scope.loadAds();
                    }
                };

                scope.onUpdateAds = function onUpdateAds(newVal, oldVal) {
                    if (newVal != oldVal) {
                        scope.loadAds();
                        API.pause();
                        adDisplayContainer.initialize();
                        scope.requestAds(scope.vgAdTagUrl);
                    }
                };

                scope.loadAds = function loadAds() {
                    if (scope.vgCompanion) {
                        googletag.cmd.push(
                            function () {
                                googletag.defineSlot("/" + scope.vgNetwork + "/" + scope.vgUnitPath, scope.vgCompanionSize, scope.vgCompanion)
                                    .addService(googletag.companionAds())
                                    .addService(googletag.pubads());
                                googletag.companionAds().setRefreshUnfilledSlots(true);
                                googletag.pubads().enableVideoAds();
                                googletag.enableServices();
                            }
                        );
                    }
                };

                scope.onUpdateState = function onUpdateState(newState) {
                    switch (newState) {
                        case VG_STATES.PLAY:
                            if (!adsLoaded) {
                                API.pause();
                                adDisplayContainer.initialize();
                                scope.requestAds(scope.vgAdTagUrl);
                                adsLoaded = true;
                            }
                            break;

                        case VG_STATES.STOP:
                            adsLoader.contentComplete();
                            break;
                    }
                };

                scope.requestAds = function requestAds(adTagUrl) {
                    // Show only to get computed style in pixels
                    scope.show();

                    var adsRequest = new google.ima.AdsRequest();
                    var computedStyle = $window.getComputedStyle(elem[0]);
                    adsRequest.adTagUrl = adTagUrl;

                    adsRequest.linearAdSlotWidth = parseInt(computedStyle.width, 10);
                    adsRequest.linearAdSlotHeight = parseInt(computedStyle.height, 10);
                    adsRequest.nonLinearAdSlotWidth = parseInt(computedStyle.width, 10);
                    adsRequest.nonLinearAdSlotHeight = parseInt(computedStyle.height, 10);

                    adsLoader.requestAds(adsRequest);
                };

                scope.onAdsManagerLoaded = function onAdsManagerLoaded(adsManagerLoadedEvent) {
                    scope.show();
                    adsManager = adsManagerLoadedEvent.getAdsManager(API.mediaElement[0]);

                    scope.processAdsManager(adsManager);
                };

                scope.processAdsManager = function processAdsManager(adsManager) {
                    w = API.videogularElement[0].offsetWidth;
                    h = API.videogularElement[0].offsetHeight;

                    // Attach the pause/resume events.
                    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, scope.onContentPauseRequested, false, this);
                    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, scope.onContentResumeRequested, false, this);
                    adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, scope.onSkippableStateChanged, false, this);
                    adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, scope.onAllAdsComplete, false, this);
                    adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, scope.onAdComplete, false, this);
                    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, scope.onAdError, false, this);

                    adsManager.init(w, h, google.ima.ViewMode.NORMAL);
                    adsManager.start();
                };

                scope.onSkippableStateChanged = function onSkippableStateChanged() {
                    var isSkippable = adsManager.getAdSkippableState();

                    if (isSkippable) {
                        skipButton.css("display", "block");
                    }
                    else {
                        skipButton.css("display", "none");
                    }
                };

                scope.onClickSkip = function onClickSkip() {
                    adsManager.skip();
                };

                scope.onContentPauseRequested = function onContentPauseRequested() {
                    scope.show();
                    API.mediaElement[0].removeEventListener('ended', onContentEnded);
                    API.pause();
                };

                scope.onContentResumeRequested = function onContentResumeRequested() {
                    API.mediaElement[0].addEventListener('ended', onContentEnded);

                    API.play();
                    scope.hide();
                };

                scope.onAdError = function onAdError() {
                    if (adsManager) adsManager.destroy();
                    scope.hide();
                    API.play();
                };

                scope.onAllAdsComplete = function onAllAdsComplete() {
                    scope.hide();

                    // The last ad was a post-roll
                    if (adsManager.getCuePoints().join().indexOf("-1") >= 0) {
                        API.stop();
                    }
                };

                scope.onAdComplete = function onAdComplete() {
                    // TODO: Update view with current ad count
                    currentAd++;
                };

                scope.show = function show() {
                    elem.css("display", "block");
                };

                scope.hide = function hide() {
                    elem.css("display", "none");
                };

                skipButton.bind("click", scope.onClickSkip);

                elem.prepend(skipButton);

                angular.element($window).bind("resize", function () {
                    w = API.videogularElement[0].offsetWidth;
                    h = API.videogularElement[0].offsetHeight;

                    if (adsManager) {
                        if (API.isFullScreen) {
                            adsManager.resize(w, h, google.ima.ViewMode.FULLSCREEN);
                        }
                        else {
                            adsManager.resize(w, h, google.ima.ViewMode.NORMAL);
                        }
                    }
                });

                if (API.isConfig) {
                    scope.$watch("API.config",
                        function () {
                            if (scope.API.config) {
                                scope.vgNetwork = scope.API.config.plugins["ima-ads"].network;
                                scope.vgUnitPath = scope.API.config.plugins["ima-ads"].unitPath;
                                scope.vgCompanion = scope.API.config.plugins["ima-ads"].companion;
                                scope.vgCompanionSize = scope.API.config.plugins["ima-ads"].companionSize;
                                scope.vgAdTagUrl = scope.API.config.plugins["ima-ads"].adTagUrl;
                                scope.vgSkipButton = scope.API.config.plugins["ima-ads"].skipButton;

                                scope.onPlayerReady(true);
                            }
                        }
                    );
                }
                else {
                    scope.$watch("vgAdTagUrl", scope.onUpdateAds.bind(scope));
                }

                scope.$watch(
                    function () {
                        return API.isReady;
                    },
                    function (newVal, oldVal) {
                        if (API.isReady == true || newVal != oldVal) {
                            scope.onPlayerReady(newVal);
                        }
                    }
                );

                scope.$watch(
                    function () {
                        return API.currentState;
                    },
                    function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            scope.onUpdateState(newVal);
                        }
                    }
                );
            }
        }
    }]
);
