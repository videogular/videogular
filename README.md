## Videogular

Videogular is an HTML5 video player for AngularJS. Videogular is a wrapper over the HTML5 video tag, so you just could add whatever you want. This provides a very powerful but simple to use solution for everybody.

## How to use Videogular

To start using Videogular, just create a `DIV` with the `videogular` attribute and the `video` tag inside. In AngularJS the HTML5 `poster` video attribute is not supported, so you could use `vg-poster` to add your image to your video tag.

```html
<div videogular width="640" height="264">
	<video class='videoPlayer' controls preload='none' width='640' height='264' vg-poster='assets/images/oceans-clip.png'>
		<source src='assets/videos/oceans-clip.mp4' type='video/mp4'>
		<source src='assets/videos/oceans-clip.webm' type='video/webm'>
		<source src='assets/videos/oceans-clip.ogv' type='video/ogg'>
	</video>
</div>
```

Because `videogular` is an HTML5 video player for AngularJS it works (obviously) with all the AngularJS directives.

```html
<div videogular width="640" height="264">
	<video class='videoPlayer' preload='none' width='{{ data.width }}' height='{{ data.height }}' vg-poster='{{ data.poster }}'>
		<source ng-repeat='media in data.media' ng-src='{{ media.url }}' type='{{ media.type }}'>
	</video>
</div>
```


## Plugins

With Videogular you can write your own plugins through a simple API based in events. The plugins should be directives and they should communicate with the main `videogular` directive through an API based in events.

### API Events

- **VG_EVENTS.ON_PLAY**: Triggered when video plays.
- **VG_EVENTS.ON_START_PLAYING**: Triggered when video starts playing after buffer.
- **VG_EVENTS.ON_PAUSE**: Triggered when video is paused.
- **VG_EVENTS.ON_COMPLETE**: Triggered when video is completed
- **VG_EVENTS.ON_SET_STATE**: Triggered when state changes. Possible values could be "play", "pause" or "stop".
- **VG_EVENTS.ON_SET_VOLUME**: Triggered when volume changes.
- **VG_EVENTS.ON_TOGGLE_FULLSCREEN**: Triggered when fullscreen changes.
- **VG_EVENTS.ON_ENTER_FULLSCREEN**: Triggered when video enters in fullscreen.
- **VG_EVENTS.ON_EXIT_FULLSCREEN**: Triggered when video exits from fullscreen.
- **VG_EVENTS.ON_BUFFERING**: Triggered when video is buffering.
- **VG_EVENTS.ON_UPDATE_TIME**: Triggered when video progress updates.
- **VG_EVENTS.ON_UPDATE_SIZE**: Triggered when video size updates.

### Plugin example

Currently you will find a plugins folder with some source code to inspire you, however, you could see how easy is to write your own plugin with this example:

```js
var myVGPlugin = angular.module("com.2fdevs.videogular.plugins.myPlugin", []);
myVGPlugin.directive("vgOverlayplay", function($rootScope, VG_EVENTS, VG_STATES, VG_THEMES){
		return {
			restrict: "E",
			template: "<div>my videogular plugin</div>",
			link: function(scope, elem, attrs) {
				function onChangeState(target, params) {
					console.log("state changed to " + params[0]);
				}

				$rootScope.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
			}
		}
	}
);
```

## Themes

Themes will be available in a future release (very soon probably), but it should be very easy to change the current theme just by modifying `examples/css/videogular.css` file.
