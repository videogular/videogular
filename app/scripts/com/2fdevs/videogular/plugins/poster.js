"use strict";
angular.module("com.2fdevs.videogular.plugins.poster", [])
	.directive(
		"vgPosterImage",
		["VG_EVENTS", function(VG_EVENTS) {
			return {
				restrict: "E",
				require: "^videogular",
				scope: {
					vgUrl: "=",
					vgStretch: "="
				},
				templateUrl: "views/videogular/plugins/poster/poster.html",
				link: function(scope, elem, attr, API) {
					var img = elem.find("img");
					var width = 0;
					var leftPos = 0;

					function onPlayVideo() {
						elem.css("display", "none");
					}

					function onCompleteVideo() {
						elem.css("display", "block");
					}

					function onUpdateSize(target, param) {
						width = param[0];
						centerImage();
					}

					function onLoadPoster() {
						if (width == 0) width = elem[0].clientWidth;
						centerImage();
					}

					function onUpdateStretch(newValue, oldValue) {
						if (newValue != oldValue) {
							centerImage();
						}
					}

					function centerImage() {
						switch (scope.vgStretch) {
							case "fill":
								if (width > img[0].width) {
									img.css("width", width);
									img.css("height", "auto");
									img.css("left", "0");
								}
								else{
									img.css("width", "auto");
									img.css("height", "100%");

									leftPos = (width - img[0].width) / 2;
									img.css("left", leftPos + "px");
								}
								break;

							case "fit":
								img.css("width", "100%");
								img.css("height", "auto");
								img.css("left", "0px");
								break;


							case "none":
								img.css("width", "auto");
								img.css("height", "auto");
								img.css("left", "0px");
								break;
						}
					}

					img[0].onload = onLoadPoster;

					scope.$watch("vgStretch", onUpdateStretch);

					API.$on(VG_EVENTS.ON_PLAY, onPlayVideo);
					API.$on(VG_EVENTS.ON_COMPLETE, onCompleteVideo);
					API.$on(VG_EVENTS.ON_UPDATE_SIZE, onUpdateSize);
				}
			}
		}
	]);
