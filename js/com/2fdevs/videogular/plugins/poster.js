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
				
				function onPlayVideo() {
					elem.css("display", "none");
				}

				function onCompleteVideo() {
					elem.css("display", "block");
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
				
				scope.$on(VG_EVENTS.ON_PLAY, onPlayVideo);
				scope.$on(VG_EVENTS.ON_COMPLETE, onCompleteVideo);
			}
		}
	}
);

posterImageDirectives.directive("vgPosterStretch", function(VG_EVENTS) {
		return {
			restrict: "A",
			link: function(scope, elem, attrs) {
				function onUpdateSize() {
					if (currentStretch == "fill" && img.length > 0)
					{
						var leftPos = elem.width - img.width;
						img.css("left", leftPos + "px");
					}
				}
				
				function onLoadPoster() {
					img = angular.element(elem).find("img");
					updateStretch(currentStretch);
				}

				function updateStretch(value) {
					if (img) {
						if (currentStretch) {
							img.removeClass(currentStretch);
						}

						currentStretch = value;

						img.addClass(value);

						switch (currentStretch) {
							case "fill":
								//Center image horizontally. Ugly.
								var leftPos = (elem[0].clientWidth - img[0].clientWidth) / 2;
								img.css("left", leftPos + "px");
								break;

							default:
								img.css("left", "0px");
								break;
						}
					}
					else {
						currentStretch = value;
					}
				}

				var currentStretch;
				var img;

				if (attrs.vgPosterStretch === "none" ||
					attrs.vgPosterStretch === "fit" ||
					attrs.vgPosterStretch === "fill") {
					updateStretch(attrs.vgPosterStretch);
				}
				else {
					scope.$watch(attrs.vgPosterStretch, function(value) {
						updateStretch(value);
					});
				}

				scope.$on(VG_EVENTS.ON_LOAD_POSTER, onLoadPoster);
				scope.$on(VG_EVENTS.ON_UPDATE_SIZE, onUpdateSize);
			}
		}
	}
);

