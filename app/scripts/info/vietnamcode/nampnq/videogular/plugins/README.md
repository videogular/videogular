#How to use youtube plugin

Add directives, and video source to your HTML:

```html
<videogular vg-width="config.width" vg-height="config.height" vg-theme="config.theme.url" vg-autoplay="config.autoPlay" vg-stretch="config.stretch.value" vg-responsive="config.responsive">
	<video class='videoPlayer' preload='metadata'>
		<source type="video/youtube" src="http://www.youtube.com/watch?v=nOEw9iiopwI" />
	</video>

	<vg-youtube></vg-youtube>

	<vg-controls vg-autohide="config.autoHide" style="height: 50px;">
		<vg-play-pause-button vg-play-icon="config.theme.playIcon" vg-pause-icon="config.theme.pauseIcon"></vg-play-pause-button>
		<vg-timeDisplay>{{ currentTime }}</vg-timeDisplay>
		<vg-scrubBar>
			<vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>
		</vg-scrubBar>
		<vg-timeDisplay>{{ totalTime }}</vg-timeDisplay>
		<vg-volume>
			<vg-mutebutton
				vg-volume-level-3-icon="config.theme.volumeLevel3Icon"
				vg-volume-level-2-icon="config.theme.volumeLevel2Icon"
				vg-volume-level-1-icon="config.theme.volumeLevel1Icon"
				vg-volume-level-0-icon="config.theme.volumeLevel0Icon"
				vg-mute-icon="config.theme.muteIcon">
			</vg-mutebutton>
			<vg-volumebar></vg-volumebar>
		</vg-volume>
		<vg-fullscreenButton vg-enter-full-screen-icon="config.theme.enterFullScreenIcon" vg-exit-full-screen-icon="config.theme.exitFullScreenIcon"></vg-fullscreenButton>
	</vg-controls>
</videogular>
```

Additionally, you will need to add youtube plugins and videogular to your application:

```js
"use strict";
angular.module("videogularApp",
    [
        "controllers",

        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controlbar",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.buffering",
        "info.vietnamcode.nampnq.videogular.plugins.youtube"
    ]
);
```

And that's all :)