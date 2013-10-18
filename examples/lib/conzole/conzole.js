/*
Conzole 0.1
by Pierluigi Pesenti
*/

conzole=(function($parent, undefined) {
	var
		former=null,
		pinned=false,
		isOpen=false,
		over=false,
		dragging=false,
		messages=[],
		timers=[],
		autoUpdate=true,
		watchInterval=null,
		panel=null,
		handle=null,
		initialized=false,
		watchList=[],
		showTimeDiff=true,
		latestTime=0,
		helpVisible=false,
		width=320,
		parent=$parent,
		watching={},
		watchFields=[]
	;

	init();
	function now() {
		return new Date().valueOf();
	}
	function wrapConsole() {
		if(!window.console) {
			window.console={};
			window.console.log=function() {}
			window.console.debug=function() {}
			window.console.info=function() {}
			window.console.warn=function() {}
			window.console.error=function() {}
			window.console.time=function() {}
			window.console.timeEnd=function() {}
			//window.console={};
		} else {
			console.formerLog=console.log;
			console.formerDebug=console.debug;
			console.formerInfo=console.info;
			console.formerWarn=console.warn;
			console.formerError=console.error;
			console.formerTime=console.time;
			console.formerTimeEnd=console.timeEnd;
		}


		console.log=function() {if(console.formerLog) {console.formerLog.apply(this, arguments);} conzole.log.apply(this, arguments);}
		console.debug=function() {if(console.formerDebug) {console.formerDebug.apply(this, arguments);} conzole.debug.apply(this, arguments);}
		console.info=function() {if(console.formerInfo) {console.formerInfo.apply(this, arguments);} conzole.info.apply(this, arguments);}
		console.warn=function() {if(console.formerWarn) {console.formerWarn.apply(this, arguments);} conzole.warn.apply(this, arguments);}
		console.error=function() {if(console.formerError) {console.formerError.apply(this, arguments);} conzole.error.apply(this, arguments);}
		console.time=function(arg) {if(console.formerTime) {console.formerTime(arg);} conzole.time(arg);}
		console.timeEnd=function(arg) {if(console.formerTimeEnd) {console.formerTimeEnd(arg);} conzole.timeEnd(arg);}
	}
	function init() {
		wrapConsole();

		var ntime=now();
		latestTime=ntime;
		var body=document.getElementsByTagName('body')[0];
		var help=document.createElement('div');
		help.setAttribute('id', 'conzoleHelp');
		help.style.display='none';
		helpHTML='<p>version 0.1.0</p><p>by Pierluigi Pesenti<br /><a href="http://oaxoa.github.io/Conzole/">http://oaxoa.github.io/Conzole/</a></p>'+
		'<button id="conzoleBack" onclick="conzole.toggleHelp()">back</button>'+
		'';
		help.innerHTML=helpHTML;
		var tpanel=document.createElement('div');
		tpanel.setAttribute('id', 'conzolePanel');
		panel=tpanel;
		var thandle=document.createElement('div');
		thandle.setAttribute('id', 'conzoleHandle');
		handle=thandle;
		listen('mousedown', handle, onHandleDown);

		var logo=document.createElement('div');
		logo.setAttribute('id', 'conzoleLogo');
		logo.innerHTML='<h1>Conzole</h1><span onclick="conzole.toggleHelp()">i</span>';

		var content=document.createElement('div');
		content.setAttribute('id', 'conzoleContent');
		var topInterface=document.createElement('div');
		topInterface.setAttribute('id', 'conzoleTopInterface');
		var tiHTML='';
		tiHTML+='<button id="conzoleClear" title="Clear [c]" onclick="conzole.clear()">Clear</button>';
		tiHTML+='<span id="cb2" title="Auto update [u]" onclick="conzole.toggleUpdate()" class="on"><input class="conzoleCheckbox" type="checkbox" id="conzoleUpdate" checked onchange="conzole.toggleUpdate()" /></span>';
		tiHTML+='<span id="cb3" title="Alternate timings [t]" onclick="conzole.toggleShowTimeDiff()" class="on"><input class="conzoleCheckbox" type="checkbox" id="conzoleShowTimeDiff" checked onchange="conzole.toggleShowTimeDiff()" /></span>';
		topInterface.innerHTML=tiHTML;
		var list=document.createElement('div');
		list.setAttribute('id', 'conzoleList');
		var wlist=document.createElement('div');
		wlist.setAttribute('id', 'conzoleWatchList');
		content.appendChild(topInterface);
		content.appendChild(list);
		content.appendChild(wlist);
		content.appendChild(help);

		panel.appendChild(logo);
		panel.appendChild(help);
		panel.appendChild(content);
		panel.appendChild(handle);

		body.appendChild(panel);
		var head=document.getElementsByTagName('head')[0];
		var css=document.createElement('style');
		css.setAttribute('type', 'text/css');
		head.appendChild(css);
		var sprite='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAAB4CAIAAACYQ4AXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlk'+
					'Ij8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9y'+
					'Zy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5'+
					'cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDQkI5NUNDMUFFNjBFMjExOUI2RjgyMjJENEM1NEJGQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRp'+
					'ZDo2MUFCNTJERjYxNEYxMUUyOUYxRUMwQjlDQUFFRjBCRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MUFCNTJERTYxNEYxMUUyOUYxRUMwQjlDQUFFRjBCRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06'+
					'RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEOTkxNDMxNjRFNjFFMjExOTdENUNFN0Y2RDI2NjFCNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDQkI5NUNDMUFFNjBFMjExOUI2RjgyMjJENEM1NEJGQSIvPiA8L3JkZjpEZXNjcmlwdGlv'+
					'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';
		var cssContent=''+
			'\r\n.conzoleCheckbox {visibility: hidden;}'+
			'\r\n#cb1,#cb2,#cb3 {vertical-align: middle; margin: 0; padding: 0; margin-left: 2px; width: 20px; height: 20px; background: transparent url('+sprite+') no-repeat; display: inline-block;}'+
			'\r\n#cb1 {background-position: 0 0	;}'+
			'\r\n#cb1.on {background-position: 0 -20px	;}'+
			'\r\n#cb2 {background-position: 0 -40px	;}'+
			'\r\n#cb2.on {background-position: 0 -60px	;}'+
			'\r\n#cb3 {background-position: 0 -80px	;}'+
			'\r\n#cb3.on {background-position: 0 -100px	;}'+
			'\r\n#conzoleHelp a {color: #fc0; text-decoration: none; font-weight: normal;}'+
			'\r\n#conzoleHelp {color: #fff; display: none; margin-top: 40px; text-align: center;}'+
			'\r\n#conzoleHelp p {margin: .8em 0; padding: 0; min-width: auto; width: auto; height: auto;}'+
			'\r\n#conzoleLogo {position: absolute; right: 0; top: 0; height: 32px; width: 126px;}'+
			'\r\n#conzoleLogo h1 {position: absolute; right: 12px; top: 8px; margin: 0; padding: 0; width: 88px; height: 18px; background: transparent url('+sprite+') no-repeat -20px -20px; text-indent: -9999px; overflow: hidden;}'+
			'\r\n#conzoleLogo span {position: absolute; right: 106px; top: 8px; width: 20px; height: 20px; display: block; background: transparent url('+sprite+') no-repeat -20px -40px; text-indent: -9999px; overflow: hidden;}'+
			'\r\n#conzolePanel ::selection {background: #444;}'+
			'\r\n#conzolePanel ::-moz-selection {background: #444;}'+
			'\r\n#conzolePanel {opacity: .9; min-width: 225px; background: #222; display: none; z-index: 2147483647; font-family: sans-serif; font-size: 12px; overflow: hidden; padding:0; position: fixed; right: 0; top: 0; color: #ddd;}'+
			'\r\n#conzolePanel a {color: #FFF; background: #000; padding: 0 6px; font-weight: bold;}'+
			'\r\n#conzolePanel button {line-height: 1.5em; color: #ddd; border: 1px solid #000; background: #333; font-weight: normal; font-size: 13px; }'+
			'\r\n#conzolePanel label {margin-left: 2em; font-size: 13px;}'+
			'\r\n#conzolePanel label em, #conzoleClear em {font-size: 13px; color: #ccc; font-style: normal; padding: 0 3px; font-weight: bold; color: #fff;}'+
			'\r\n#conzolePanel #conzoleTopInterface button {vertical-align: middle; display: inline-block; margin: 0; padding: 0; margin-right: 8px;width: 32px; height: 20px; background: transparent url('+sprite+') no-repeat -20px 0; border: none; text-indent: -9999px; overflow: hidden;}'+
			'\r\n#conzoleHandle {cursor: e-resize; width: 6px; position: absolute; left: 0; top: 0; background: #222;}'+
			'\r\n#conzoleHandle:hover {background: #888;}'+
			'\r\n#conzoleList {text-transform: none; height: auto; overflow: auto; margin-left: 6px; margin-top: 36px;list-style: none; background: #444; color: #ccc; font-size: 12px; border: 1px solid 999;}'+
			'\r\n#conzoleList li {position: relative; padding: 3px 8px 3px 38px; background: transparent; font-size: 12px; border: none; border-bottom: 1px solid #666; border-left: 6px solid #444;}'+
			'\r\n#conzoleList.fullTime li {position: relative; padding: 3px 8px 3px 50px; background: transparent; font-size: 12px; border: none; border-bottom: 1px solid #666; border-left: 6px solid #444;}'+
			'\r\n#conzoleList li:first-child {color: #fff; font-weight: bold;}'+
			'\r\n#conzoleList li span {color: #999;font-style: normal; margin-right: 1em; font-size: 11px;}'+
			'\r\n#conzoleList li strong {color: #fff; font-weight: bold;}'+
			'\r\n#conzoleList li em {color: #BBB; font-style: normal; margin-right: 1em; position: absolute; left: 1px; font-size: 11px; line-height: 16px; color: #999; text-align: right; width: 32px;}'+
			'\r\n#conzoleList.fullTime li em {left: 3px;}'+
			'\r\n#conzoleList li.error {border-left-color: #f66;}'+
			'\r\n#conzoleList li.info {border-left-color: #3AF;}'+
			'\r\n#conzoleList li.warn {border-left-color: #FC0;}'+
			'\r\n.conzoleCheckbox {vertical-align: middle; width: 16px; height: 16px; background: #999; border: 1px solid #666; margin: 0; padding: 0;}'+
			'\r\n#conzoleWatchList {margin-top: 1em; padding: 0 1em 2em 1em; }'+
			'\r\n#conzoleWatchList label {display: block; margin: 0;}'+
			'\r\n#conzoleWatchList input, #conzoleWatchList textarea {margin-bottom: 1em; height: 1.5em; background: #444; border: 1px solid #666; color: #fff; width: 100%; max-width: 100%;}'+
			'\r\n#conzoleWatchList textarea {height: auto; max-height: 300px;}'+
			'\r\n#conzoleTopInterface {position: absolute; left: 6px; top: 8px;}';
		if(css.styleSheet) {
			css.styleSheet.cssText=cssContent;
		} else {
			css.innerHTML=cssContent;
		}

		listen('resize', window, function() {resize()});
		window.onerror=function(err, url, line) {
			urlParts=url.split('/');
			urlParts[urlParts.length-1]='<strong>'+urlParts[urlParts.length-1]+'</strong>';
			url=urlParts.join('/');
			error(err+'<br /><span>'+url+' | Line: <strong>'+line+'</strong></span>');
			open();
			return true;
		}
		listen('keypress', document, returnKey);

		watchInterval=setInterval(function() {updateWatchFields()}, 30);

		resize();


	}
	function arrayGetIndex(array, value, property) {
		for(var i=0; i<array.length; i++) {
			var val=property?array[i][property]:array[i];
			if(val===value) return i;
		}
		return false;
	}
	function time(timerName) {
		var index=arrayGetIndex(timers, timerName, 'name');
		if(index===false) {
			timers.push({name:timerName, time:now()});
		} else {
			timers[index].time=now();
		}
	}
	function timeEnd(timerName) {
		var index=arrayGetIndex(timers, timerName, 'name');
		if(index!==false) {
			var timerObject=timers.splice(index, 1)[0];
			log(timerObject.name+': '+(now()-timerObject.time)/1000);
		}
	}
	function open() {
		isOpen=true;
		if(autoUpdate) update();
		panel.style.display='block';
	}
	function close() {
		isOpen=false;
		panel.style.display='none';
	}
	function toggle() {
		isOpen?close():open();
	}
	function onHandleDown() {
		dragging=true;
		listen('mousemove', window, onHandleMove);
		listen('mouseup', window, onHandleUp);
	}
	function onHandleMove(e) {setWidth(getWindowSize().width-Math.max(e.pageX, 0));}
	function setWidth(n) {
		width=n;
		var cp=document.getElementById('conzolePanel');
		cp.style.width=width+'px';
	}
	function onHandleUp(e) {
		dragging=false;
		window.removeEventListener('mousemove', onHandleMove);
		window.removeEventListener('mouseup', onHandleUp);
	}
	function clear() {
		messages=[];
		update();
		// force repaint in Opera
		width=width+1;
		width=width-1;
	}
	function toggleHelp() {
		helpVisible=!helpVisible;
		var help=document.getElementById('conzoleHelp');
		var cc=document.getElementById('conzoleContent');
		help.style.display=helpVisible ? 'block' : 'none';
		cc.style.display=helpVisible ? 'none' : 'block';
	}
	function toggleUpdate() {
		autoUpdate=!autoUpdate;
		if(autoUpdate) update();

		var cb=document.getElementById('cb2');
		setElementClass(cb, autoUpdate?'on':'off');
	}
	function toggleShowTimeDiff() {
		showTimeDiff=!showTimeDiff;
		var cl=document.getElementById('conzoleList');
		var clName=showTimeDiff?'':'fullTime';
		if(cl) {
			cl.setAttribute('class', clName);
			cl.setAttribute('className', clName);
		}
		if(autoUpdate) update();

		var cb=document.getElementById('cb3');
		setElementClass(cb, showTimeDiff?'on':'off');
	}
	function setElementClass(el, c) {
		if(el.className) el.className=c;
	}
	function update() {
		if(isOpen) {
			var list=document.getElementById('conzoleList');
			if(list) {
				if(!initialized) {initialized=true;}
				var temp=[];
				var i;
				var maxLength=300;
				var len=messages.length<maxLength ? messages.length : maxLength;
				for(i=messages.length-1; i>=messages.length-len; i--) {
					temp.push(messages[i]);
				}
				var out='';
				var counter=0, prevObject, obj;

				for(i=0; i<temp.length; i++) {
					obj=temp[i];
					var msg=obj.message;
					msg=msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
					var tdiff=obj.timeDiff/1000;
					tdiffStr=tdiff>1 ? tdiff.toPrecision(4) : tdiff.toPrecision(2);
					var timeStr=showTimeDiff ? tdiffStr : obj.time;

					var countString=obj.count>1?'('+obj.count+') ':'';
					out+='<li class="'+obj.type+'"><em>'+timeStr+'</em> '+countString+msg+'</li>';
				}
				list.innerHTML=out;
			} else {
				setTimeout(function() {update();}, 30);
			}
		}
	}
	function doLog(message, type, caller) {
		var args = Array.prototype.slice.call(message);
		message=args.join(' ');
		var ntime=now();
		var tdiff=latestTime>0 ? ntime-latestTime : 0;
		latestTime=ntime;
		type=type || 'log';
		var now2 = new Date();
		var timeString = [addZero(now2.getHours()), addZero(now2.getMinutes()), addZero(now2.getSeconds())].join(':');

		var current={time:timeString, timeDiff:tdiff, message:message, type:type, count:1};
		if(messages.length>0) {
			var prev=messages[messages.length-1];
			if(prev.type===current.type && prev.message===current.message) {
				prev.count++;
				prev.time=current.time;
				prev.timeDiff=current.timeDiff;
			} else {
				messages.push(current);
			}
		} else {
			messages.push(current);
		}


		if(autoUpdate) update();
	}
	function log() {
		doLog(arguments, 'log');
	}
	function debug() {
		doLog(arguments, 'log');
	}
	function info() {
		doLog(arguments, 'info');
	}
	function warn() {
		doLog(arguments, 'warn');
	}
	function error() {
		doLog(arguments, 'error');
		open();
	}
	function returnKey(e) {
		e=e || window.event;
		var node = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null);
		var code=e.charCode || e.keyCode;
		var el;
		if (node.type!=='textarea' && node.type!=='text' && node.type!=='password') {
			switch(code) {
				case 122: // z
					toggle();
					break;
				case 117: // u
					el=document.getElementById('conzoleUpdate');
					el.checked=!el.checked;
					el.onchange();
					break;
				case 116: // t
					el=document.getElementById('conzoleShowTimeDiff');
					el.checked=!el.checked;
					el.onchange();
					break;
				case 99: // c
					el=document.getElementById('conzoleClear');
					el.onclick();
					break;
			}
		}
	}
	function addZero(num) {
		return (num >= 0 && num < 10) ? '0' + num : num + '';
	}
	function arrayEqual(arr1, arr2) {
		if(arr1.length===arr2.length) {
			for(var i=0; i<arr1.length; i++) {
				if(arr1[i]!==arr2[i]) return false;
			}
			return true;
		} else {
			return false;
		}
	}
	function updateWatchFields() {
		if(autoUpdate) {
			var w=document.getElementById('conzoleWatchList'), el;
			if(w===undefined) {
				setTimeout(function () {updateWatchFields()}, 50);
			} else {
				var html='', newWatchFields=[], field, tas, i, value, j, ta;
				for(field in watching) {
					if(watching.hasOwnProperty(field)) {
						newWatchFields.push(field);
					}
				}
				if(arrayEqual(newWatchFields, watchFields)) {
					// update
					for(i=0;i<watchFields.length;i++) {
						field=watchFields[i];
						tas=w.getElementsByTagName('textarea');
						for(j=0; j<tas.length; j++) {
							ta=tas[j];
							if(ta.getAttribute('data-el')===field) {
								value=watching[field];
								if(typeof value==='object') value=JSON.stringify(value);
								if(ta.innerHTML!==value) ta.innerHTML=value;
							}
						}
					}
				} else {
					rebuildWatchFields();
				}
				resize();
			}
		}
	}
	function rebuildWatchFields() {
		var w=document.getElementById('conzoleWatchList'), el;
		if(w===undefined) {
			setTimeout(function () {updateWatchFields()}, 50);
		} else {
			var html='', field, value;
			watchFields=[];
			for(field in watching) {

				if(watching.hasOwnProperty(field)) {
					watchFields.push(field);
					value=watching[field];
					if(typeof value==='object') {
						value=JSON.stringify(value);
					}
					html+='<label>'+field+'</label><textarea data-el="'+field+'" readonly>'+value+'</textarea>';
				}
			}
			if(html!=='') {
				html=html='<h3>Watching: </h3>'+html;
			}
			w.innerHTML=html;
			resize();
		}

	}
	function resize() {
		var cp=document.getElementById('conzolePanel');
		var ch=document.getElementById('conzoleHandle');
		var cti=document.getElementById('conzoleTopInterface');
		var cwl=document.getElementById('conzoleWatchList');
		var cl=document.getElementById('conzoleList');
		if(cp && cti && cwl && cl) {
			var wh=getWindowSize().height;
			cp.style.height=ch.style.height=wh+'px';
			cp.style.width=width+'px';
			var th=wh-cti.offsetHeight-cwl.offsetHeight;
			cl.style.height=th+'px';
		}
	}
	function listen(e, el, f) {
		if (el.addEventListener) el.addEventListener(e,f,false);
		else if (el.attachEvent) return el.attachEvent('on'+e,f);
		else alert('Cannot listen events.');
	}
	function getWindowSize(){
		if(window.innerWidth!=undefined){
			return {width:window.innerWidth, height:window.innerHeight};
		} else {
			var B=document.body,
			D=document.documentElement;
			return {width:Math.max(D.clientWidth, B.clientWidth),
			height:Math.max(D.clientHeight, B.clientHeight)};
		}
	}

	return {
		open:open,
		close:close,
		toggle:toggle,
		setWidth:setWidth,
		clear:clear,
		toggleUpdate:toggleUpdate,
		toggleShowTimeDiff:toggleShowTimeDiff,
		toggleHelp:toggleHelp,
		time:time,
		timeEnd:timeEnd,
		watching:watching,

		log:log,
		debug:debug,
		info:info,
		warn:warn,
		error:error
	};
})(this);

