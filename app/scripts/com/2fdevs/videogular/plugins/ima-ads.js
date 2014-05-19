/**
 * @license Videogular v0.4.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.imaads", [])
	.directive(
		"vgImaAds",
		["$timeout", "VG_STATES", "VG_EVENTS", function($timeout, VG_STATES, VG_EVENTS){
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
				link: function(scope, elem, attr, API) {
					var contentCompleteCalled = false;
					var adDisplayContainer = new google.ima.AdDisplayContainer(elem[0]);
					var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
					var adsManager = null;
					var adsLoaded = false;
					var w;
					var h;

					function onUpdateSize(target, params) {
						var mode;

						w = params[0];
						h = params[1];

						if (API.isFullScreen) {
							mode = google.ima.ViewMode.FULLSCREEN;
						}
						else {
							mode = google.ima.ViewMode.NORMAL;
						}

						if (adsManager) adsManager.resize(w, h, mode);
					}

					function onPlay() {
						if (!adsLoaded) {
							API.pause();
							requestAds(scope.vgAdTagUrl);
							adsLoaded = true;
						}
					}

					function onStartPlaying() {
						adDisplayContainer.initialize();
					}

					function requestAds(adTagUrl) {
						var adsRequest = new google.ima.AdsRequest();
						var size = API.getSize();
						adsRequest.adTagUrl = adTagUrl;
						adsRequest.linearAdSlotWidth = size.width;
						adsRequest.linearAdSlotHeight = size.height;
						adsRequest.nonLinearAdSlotWidth = size.width;
						adsRequest.nonLinearAdSlotHeight = size.height;
						adsLoader.requestAds(adsRequest);
					}

					function onAdsManagerLoaded(adsManagerLoadedEvent) {
						show();
						adsManager = adsManagerLoadedEvent.getAdsManager(API.videoElement[0]);
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

					function onVideoComplete() {
						contentCompleteCalled = true;
						adsLoader.contentComplete();
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

					API.$on(VG_EVENTS.ON_UPDATE_SIZE, onUpdateSize);
					API.$on(VG_EVENTS.ON_PLAY, onPlay);
					API.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
					API.$on(VG_EVENTS.ON_COMPLETE, onVideoComplete);

					if (scope.vgCompanion) {
						googletag.cmd.push(function() {
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
