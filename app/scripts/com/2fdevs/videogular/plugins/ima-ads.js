/**
 * @license Videogular v0.6.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
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
				vgAdTagUrl: "="
			},
			link: function (scope, elem, attr, API) {
				var contentCompleteCalled = false;
				var adDisplayContainer = new google.ima.AdDisplayContainer(elem[0]);
				var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
				var adsManager = null;
				var adsLoaded = false;
				var w;
				var h;

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
							contentCompleteCalled = true;
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

					// Handle events.
					adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false, this);
					adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAllAdsComplete, false, this);
					adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete, false, this);

					adsManager.init(w, h, google.ima.ViewMode.NORMAL);
					adsManager.start();
				}

				function onContentPauseRequested(adErrorEvent) {
					show();
					API.pause();
				}

				function onContentResumeRequested(adErrorEvent) {
					// Without this check the video starts over from the beginning on a
					// post-roll's CONTENT_RESUME_REQUESTED
					if (!contentCompleteCalled) {
						API.play();
						hide();
					}
				}

				function onAdError(adErrorEvent) {
					if (adsManager) adsManager.destroy();
					hide();
					API.play();
				}

				function onAllAdsComplete() {
					hide();
				}

				function onAdComplete() {
					hide();
				}

				function show() {
					elem.css("display", "block");
				}

				function hide() {
					elem.css("display", "none");
				}

				adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false, this);
				adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false, this);


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
	}
	]
);
