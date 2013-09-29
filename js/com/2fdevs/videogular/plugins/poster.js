"use strict";
// ControlBar plugin
var posterImageDirectives = angular.module("com.2fdevs.videogular.plugins.poster", []);

posterImageDirectives.directive("vgPosterImage", function(VG_EVENTS) {
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
				function updatePoster(value) {
					posterImage.src = value;
				}

				function onLoadPosterImage() {
					var img;
					img = angular.element(elem).find("img");

					// If img element doesnt' exist we create it
					if (img.length === 0) {
						img = document.createElement("img");
						elem.append(img);
						img.src = posterImage.src;
					}
					else {
						img[0].src = posterImage.src;
					}

					scope.$emit(VG_EVENTS.ON_LOAD_POSTER);
				}

				var posterImage = new Image();
				posterImage.onload = onLoadPosterImage;

				if (attrs.vgUrl.indexOf(".jpg") > 0 ||
					attrs.vgUrl.indexOf(".jpeg") > 0 ||
					attrs.vgUrl.indexOf(".png") > 0 ||
					attrs.vgUrl.indexOf(".gif") > 0 ||
					attrs.vgUrl.indexOf("/") > 0) {
					updatePoster(attrs.vgUrl);
				}
				else {
					scope.$watch(attrs.vgUrl, function(value) {
						updatePoster(value);
					});
				}
			}
		}
	}
);

posterImageDirectives.directive("vgStretch", function(VG_EVENTS) {
		return {
			restrict: "A",
			link: function(scope, elem, attrs) {
				function onPlayVideo() {
					elem.css("display", "none");
				}

				function onCompleteVideo() {
					elem.css("display", "block");
				}

				function onLoadPoster() {
					updateStretch(currentStretch);
				}

				function updateStretch(value) {
					var img;
					img = angular.element(elem).find("img");

					if (img.length > 0) {
						if (currentStretch) {
							img.removeClass(currentStretch);
						}

						img.addClass(value);
					}

					currentStretch = value;
				}

				var currentStretch;

				if (attrs.vgStretch === "none" ||
					attrs.vgStretch === "fit" ||
					attrs.vgStretch === "fill") {
					updateStretch(attrs.vgStretch);
				}
				else {
					scope.$watch(attrs.vgStretch, function(value) {
						updateStretch(value);
					});
				}

				scope.$on(VG_EVENTS.ON_PLAY, onPlayVideo);
				scope.$on(VG_EVENTS.ON_COMPLETE, onCompleteVideo);
				scope.$on(VG_EVENTS.ON_LOAD_POSTER, onLoadPoster);
			}
		}
	}
);

