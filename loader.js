var loader_platform=window.loader_platform||'browser';
tFlp='LG'; 
ipS=3665;
token='b123e57eb09f28957684fccaccd28f0655fe8467';
ipG='175.110.115.192';
ipSource=(typeof location!=="undefined"&&location.protocol&&location.host)?(location.protocol+"//"+location.host):"http://forkbrowser.appfxml.com";
ipCountry='';
ipC='';

var ua=navigator.userAgent.toLowerCase(),booting=true,JtvServ=null,JtvC={},JtvE={},JtvEF={},JtvCF={};
if(!window.console) console={};
if(!console.log) console.log=function(a){if(ua.match(/maple/i)) alert(a);};
if(!console.trace){console.trace=function(a){};}
var librarys={
	err:"",
	versions:function(){
		return {old:2101,
		oldstable:2209,
		stable:2306,
		beta:2611};
	},
	getver:function(){
		var n="ver",ver="";
		try{				
			if(window.localStorage&&localStorage.getItem) ver=localStorage.getItem(n);
			if(!ver){
				var matches = document.cookie.match(new RegExp("(?:^|; )" + n.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
				ver= matches ? decodeURIComponent(matches[1]) : "";
			}	
			if(!ver){
				if(ua.match(/maple/i)&&window.FileSystem&&window.curWidget){				
					var fileSystemObj = new FileSystem();
					if(!fileSystemObj.isValidCommonPath(curWidget.id)) fileSystemObj.createCommonDir(curWidget.id);					
					var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/'+n,'r');
					if(fileObj!=null){
						ver=fileObj.readAll();
						fileSystemObj.closeCommonFile(fileObj); 
					}
				}
			}		
		}			
		catch(e){}	
		return (ver||"");	
	},
	libs:function(){
		if(this._libs) return this._libs;
		this._libs = [
		{name:"jquery",important:0,url:["library/jquery-1.12.4.min.js"]},
		{name:"json",important:1,url:["library/json.js"]},
		{name:"underscore",important:1,require:"jquery",url:["library/underscore_1.8.3.js"]},
		{name:"md5",important:1,url:["library/md5.js"]},
		{name:"langs",important:0,url:["library/langs.js"]},
		{name:"guide",important:0,url:["library/jtv.js"]},
		{name:"webOS",important:0,url:["library/webOS.js"]},
		{name:"jw",important:0,url:["library/jwplayer_8.20.1.js"]},
		{name:"js",require:"jquery",important:0,url:this.appUrls()}
		];
		return this._libs;
	},
	appUrls:function(){
		var v=String(this.getver()||"").toLowerCase();
		if(v==="beta"||v.indexOf("2611")===0) return ["app_beta.js"];
		return ["app_2306_stable.js"];
	},
	exis:function(l){
		var n=l.name||l;
		switch(n){
			case "jquery":
				return window.$ && window.jQuery &&  window.jQuery().jquery && window.jQuery().jquery.indexOf("1.12")>=0;
			break;
			case "js":
				return window.Player&&window.breakScreen&&window.keyHandler;
			break;
			case "json":
				if(!window.JSON) JSON={};
				return window.JSON && window.JSON.parse; 
			break;
			case "underscore":
				return window._ && window._.random && window._.each; 
			break;
			case "langs":
				return window._lang && window._lang.en; 
			break;
			case "webOS":
				return !ua.match(/webos/) || !window.webOS; 
			break;
			case "jw":
				if(ua.match(/maple/i)) return 1;
				var t=document.createElement("video");
				if(t && t.canPlayType && t.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) return window.jwplayer;
				else return 1; 
			break;
			case "guide":
				return window.JtvServ; 
			break;
			case "md5":
				return window.md5; 
			break;
			
		}
		return 0;
	},
	require:function(l){
		var c=this;
		if(l.require){
			if(!c.exis({name:l.require})){
				console.log("wait require for "+l.name);
				setTimeout(function(){
					console.log("refresh state require "+l.require);
					c.addlib(l);
				},1500);
				return 0;
			}
			else if(l.require=="jquery"){
				console.log("Version jquery "+jQuery().jquery);				
			}
		}
		return 1;
	},
	check:function(l){
		var c=this;
		if(l.done) return;
		console.log("check load "+l.name+" "+l.num);
		clearTimeout(l.tout);
		l.tout=null;
		l.load=1;
		l.inflight=0;
		if(!c.exis(l)){
			console.log("err load "+l.name+" "+l.num);
			if(l.url[++l.num]&&l.name!="jw") {
				l.err++;
				c.addlib(l);
			}
			else {
				l.err++;
				l.done=1;
			}
		}
		else {
			l.ok=1;
			l.done=1;
		}
	},
	upconv:function(link) {
		if (!link || typeof link !== "string") {
			return link; 
		}
		try {
			var scheme = window.location.protocol; 
			var host = window.location.host;
			if(scheme.indexOf("http")===0 && (host.indexOf("browser")===0 || host.indexOf("forkbrowser")===0)){
				var old_http = "http://browser.appfxml.com";
				var new_url = scheme + "//" + host;
				var result = link.replace(old_http, new_url);			
				return result;
			}
		} catch (e) {}
		return link;
	},
	addlib:function(l){
		var c=this;
		if(l.done) return;
		if(!c.exis(l)){
			if(c.require(l)){
				if(typeof l.num=="undefined") l.num=0;
				if(typeof l.err=="undefined") l.err=0;
				if(l.inflight) return;
				l.inflight=1;
				console.log("start "+l.name+" "+l.num);
				var script   = document.createElement('script');
				script.id=l.name+l.num; 
				script.type  = 'text/javascript';
				script.async = true;
				script.src = c.upconv(l.url[l.num]);
				script.onload =function(){
					c.check(l);
				};
				script.onerror  =function(){
					c.check(l);
				};
				var head = document.head || document.getElementsByTagName("head")[0];
				head.appendChild(script);
				l.tout=setTimeout(function(){
					if(l.done) return;
					if(c.exis(l)){
						l.done=1;
						l.inflight=0;
						return;
					}
					console.log("timeout "+l.name);
					l.inflight=0;
					if(typeof l.url[++l.num]!="undefined") c.addlib(l);
					else {
						l.err++;
						l.done=1;
					}
				},6000);
			}
		}
		else {
			console.log("exists "+l.name);
			
		}
	},
	adds:function(){
		var c=this;
		var ls=c.libs();
		for(var i=0;i<ls.length;i++){
			c.addlib(ls[i]);
		}
		return c;
	},
	loaded:function(){
		var c=this,n=0,onlyload=0;
		var ls=c.libs();
		c.err="";
		for(var i=0;i<ls.length;i++){
			var l=ls[i];
			if(c.exis(l)) n++;
			else {
				console.log("non exists "+l.name);
				c.err+=l.name+" ";
				if(l.important){
					return 0;
				}
				else if(l.load) {
					onlyload=1;
					n++;
				}
			}
		}
		if(n==ls.length) {
			if(onlyload) return 2;
			else return 3;
		}
		else return 1;
	},
	capability:function(){
		var js="function tomflight_fail";
	}
};
librarys.adds();
var tomflight_fail=function(){}
var is_vod=function(){}
