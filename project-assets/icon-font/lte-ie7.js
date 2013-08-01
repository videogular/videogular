/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-play' : '&#xe000;',
			'icon-pause' : '&#xe001;',
			'icon-volume-high' : '&#xe002;',
			'icon-volume-medium' : '&#xe003;',
			'icon-volume-low' : '&#xe004;',
			'icon-volume-mute' : '&#xe005;',
			'icon-volume-mute-2' : '&#xe006;',
			'icon-expand' : '&#xe007;',
			'icon-contract' : '&#xe008;',
			'icon-spinner' : '&#xe009;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};