/**
 * @license Videogular v0.7.1 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.imaads:vgImaAds
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
				vgNetwork: "=",
				vgUnitPath: "=",
				vgCompanion: "=",
				vgCompanionSize: "=",
				vgAdTagUrl: "=",
				vgSkipButton: "="
			},
			link: function (scope, elem, attr, API) {
				var adDisplayContainer = new google.ima.AdDisplayContainer(elem[0]);
				var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
				var adsManager = null;
				var adsLoaded = false;
				var w;
				var h;
				var onContentEnded = function() {adsLoader.contentComplete();};
				var currentAd = 0;
				var skipButton = angular.element(scope.vgSkipButton);

				function onPlayerReady(isReady) {
					if (isReady) {
						API.mediaElement[0].addEventListener('ended', onContentEnded);

						w = API.videogularElement[0].offsetWidth;
						h = API.videogularElement[0].offsetHeight;

						adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false, this);
						adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false, this);

						if (scope.vgCompanion) {
							googletag.cmd.push(function () {
								googletag.defineSlot("/" + scope.vgNetwork + "/" + scope.vgUnitPath, scope.vgCompanionSize, scope.vgCompanion)
									.addService(googletag.companionAds())
									.addService(googletag.pubads());
								googletag.companionAds().setRefreshUnfilledSlots(true);
								googletag.pubads().enableVideoAds();
								googletag.enableServices();
							});
						}
					}
				}

				function onUpdateState(newState) {
					switch (newState) {
						case VG_STATES.PLAY:
							if (!adsLoaded) {
								API.pause();
								adDisplayContainer.initialize();
								requestAds(scope.vgAdTagUrl);
								adsLoaded = true;
							}
							break;

						case VG_STATES.STOP:
							adsLoader.contentComplete();
							break;
					}

				}

				function requestAds(adTagUrl) {
					// Show only to get computed style in pixels
					show();

					var adsRequest = new google.ima.AdsRequest();
					var computedStyle = $window.getComputedStyle(elem[0]);
					adsRequest.adTagUrl = adTagUrl;

					adsRequest.linearAdSlotWidth = parseInt(computedStyle.width, 10);
					adsRequest.linearAdSlotHeight = parseInt(computedStyle.height, 10);
					adsRequest.nonLinearAdSlotWidth = parseInt(computedStyle.width, 10);
					adsRequest.nonLinearAdSlotHeight = parseInt(computedStyle.height, 10);

					adsLoader.requestAds(adsRequest);
				}

				function onAdsManagerLoaded(adsManagerLoadedEvent) {
					show();
					adsManager = adsManagerLoadedEvent.getAdsManager(API.mediaElement[0]);
					processAdsManager(adsManager);
				}

				function processAdsManager(adsManager) {
					// Attach the pause/resume events.
					adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested, false, this);
					adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested, false, this);
					adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, onSkippableStateChanged, false, this);
					adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAllAdsComplete, false, this);
					adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete, false, this);
					adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false, this);

					adsManager.init(w, h, google.ima.ViewMode.NORMAL);
					adsManager.start();
				}

				function onSkippableStateChanged() {
					var isSkippable = adsManager.getAdSkippableState();

					if (isSkippable) {
						skipButton.css("display", "block");
					}
					else {
						skipButton.css("display", "none");
					}
				}

				function onClickSkip() {
					adsManager.skip();
				}

				function onContentPauseRequested() {
					show();
					API.mediaElement[0].removeEventListener('ended', onContentEnded);
					API.pause();
				}

				function onContentResumeRequested() {
					API.mediaElement[0].addEventListener('ended', onContentEnded);

					API.play();
					hide();
				}

				function onAdError() {
					if (adsManager) adsManager.destroy();
					hide();
					API.play();
				}

				function onAllAdsComplete() {
					hide();
				}

				function onAdComplete() {
					// TODO: Update view with current ad count
					currentAd++;
				}

				function show() {
					elem.css("display", "block");
				}

				function hide() {
					elem.css("display", "none");
				}

				skipButton.bind("click", onClickSkip);

				elem.prepend(skipButton);

				angular.element($window).bind("resize", function() {
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

				scope.$watch(
					function () {
						return API.isReady;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							onPlayerReady(newVal);
						}
					}
				);

				scope.$watch(
					function () {
						return API.currentState;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							onUpdateState(newVal);
						}
					}
				);
			}
		}
	}
	]
);
