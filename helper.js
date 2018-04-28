/**
 * js公用方法
 * 提供于业务逻辑操作,不包含私有逻辑方法
 * ***/
(function(){
	helper = {},			 //全局对象
	//执行其中的的 JavaScript 代码
	helper.eval = function(){
		var code = arguments[0];
		if(!!(window.attachEvent && !window.opera)){
			//ie
			execScript(code);
		}else{
			//not ie
			eval(code);
		}
	},
	apply = function(scope,config){
		for(var i in config){
			scope[i] = config[i];
		}
		return scope;
	},
	applyIf = function(scope,config){
		for(var i in config){
			if(!scope[i])
				scope[i] = config[i];
		}
		return scope;
	},
	getElement = function(e){
		if(typeof e == "object"){
			var obj = e;
			obj.hide = function(){
				obj.classList.remove("show");
				obj.classList.add("hide");
			}
			obj.show = function(){
				obj.classList.remove("hide");
				obj.classList.add("show");
			}
			return obj;
		}
		var obj = document.getElementById(e);
		if(!(!!obj)){
			obj = document.getElementsByClassName(e)[0];
		}
		obj.add = function(e){
			obj.appendChild(e);
			return e;
		}
		obj.removeh = function(e){
			obj.removeChild(e);
			return e;
		}
		return obj;
	},
	ajax = function(method,url,params,scope,callback,errorback,completeback,async,cfg){
		//异步请求 同步请求将 async传入 false ,data参数 name=John&location=Boston
		var method = method||'get',async = async||true;
		var p = params;
		if(typeof params=='object'){
			p = "";
			for(key in params){
				p += key+"="+params[key]+"&";
			}
			p = p.substring(0,p.length-1);
		}
		var config = helper.apply({type: method,url: url,async: async},cfg);
		$.ajax(helper.apply({
		   data: p+"&temp="+Math.random(),
		   success: function(msg){
		   		var data = msg;
		   		if(!(msg instanceof Object)){
		   			data = JSON.parse(msg);
		   		}
		   		if(data.success){
		   			if(!!callback) callback.call(scope,data);
		   		}else{
		   			alert(data.message);
		   		}
		   },
		   error: function(XMLHttpRequest, textStatus, errorThrown){
		   		if(!!errorback) errorback.call(scope);
		   },
		   complete: function(XHR, TS){
		   		//在这里清除一些定义的参数
		   		if(!!completeback) completeback.call(scope);
		   }
		},config));
	},
	ajaxJsonp = function(method,async,url,scope,callback,errorback,completeback){
		//jsonp 跨域请求
		$.ajax({
			 type: method||"get",
			 async: async||true,
			 url: url,
			 dataType: "jsonp",
			 jsonp: "jsonpCallback",
			 success: function(json){
			 	if(!!json){
				 	if(!!callback) callback.call(scope,json);
			 	}
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown){
				if(!!errorback) errorback.call(scope);
			 },
			 complete: function(XHR, TS){
		   		//在这里清除一些定义的参数
		   		if(!!completeback) completeback.call(scope);
		   	 }
		});
	},
	format= function(result,args){
		//格式化字符串
		for (var key in args) { 
			var reg=new RegExp ("({"+key+"})","g");
			result = result.replace(reg, helper.tranNullVal(args[key])); 
		} 
		return result; 
	},
	tranNullVal = function(val){
		//将null undefined 等值转换未 ''空字符返回
		if(!(!!val)){
			val = '';
		}
		return val;
	},
	trim = function(str){
		//去除前后空格
		if(typeof str != 'string') return;
		if(str.length==0) return str;
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},
	isContains = function(str, substr){
		//js判断一个字符串是否包含一个子串的方法
		//true or false
		return new RegExp(substr).test(str);
	},
	locationParams = function(name){
		//获取浏览器参数
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); return null;
	},
	createStyle= function(str){
		//在head中创建样式
		var nod = document.createElement("style");
		nod.type="text/css";
		if(nod.styleSheet){        //ie下  
			nod.styleSheet.cssText = str;  
		} else {  
			nod.innerHTML = str;
		}  
		document.getElementsByTagName("head")[0].appendChild(nod);
	},
	//提示对话框 移动端mobile
	open = function(content,btn){
		if(typeof content == 'object'){
			layer.open(helper.apply({content: content,btn: btn||'我知道了'},content));
			return;
		}
		layer.open({content: content,btn: btn||'我知道了'});
	},
	//默认2秒后消失 移动端mobile
	openMsg = function(content,time){
		layer.open({content: content,skin: 'msg',time: time||2});
	},
	//询问对话框 移动端mobile
	confirm = function(content,scope,fn){
		layer.open({content: content,btn: ['是', '否'],
			yes: function(index){
			  fn.call(scope);
		      layer.close(index);
		    },
		    no: function(index){
		    	layer.close(index);
		    }
		});
	},
	//底部对话框 移动端mobile
	confirmFooter = function(content,scope,fn){
		layer.open({content: content,btn: ['删除', '取消'],skin: 'footer',yes: function(index){
		      fn.call(scope);
		      layer.close(index);
		    }
		});
	},
	//正在加载中... 移动端mobile
	loading = function(content){
		//var index = layer.open({type: 2,content: '正在提交',time:2}); 2秒后自动关闭
		if(typeof content == 'object'){
			var index = layer.open(helper.apply({type: 2,content: content},content));
			return;
		}
		var index = layer.open({type: 2,content: content});
	},
	//关闭某一个提示框 移动端mobile
	close = function(index){
		//var index = layer.open({type: 2,content: '正在提交'}); 显示
		//layer.close(index); 关闭
		layer.close(index);
	},
	//关闭所有提示提示框 移动端mobile
	closeAll = function(){
		layer.closeAll();
	},
	//提示对话框 pc端desktop
	pcAlert = function(content,option){
		/*
		 ConfirmFun: null  点击确定的回调函数
		 * */
		var cfg = { Width: 300, Height: 150, Title: "消息提示", Content: content, ConfirmFun: null };
		if(!!option) helper.apply(cfg,option);
		$.DialogBySHF.Alert(cfg);
	},
	pcConfirm = function(content,option){
		/*
		 ConfirmFun: null  点击确定的回调函数
		 CancelFun: null   点击取消的回调函数
		 * */
		var cfg = { Width: 300, Height: 150, Title: "提示信息", Content: '你好，这是确认信息，类似于JS中的confirm', ConfirmFun: null, CancelFun: null };
		if(!!option) helper.apply(cfg,option);
		$.DialogBySHF.Confirm(cfg);
	}
	recudeTime = function(time){
		//返回时 分 秒
		var hours=Math.floor(time/3600); //计算出小时数
		var time1 = time - hours*3600;
		var minutes=Math.floor(time1/60);
		var seconds = Math.floor(time1 - minutes*60);
		var time_number = new Array(hours,minutes,seconds);
		for(i in time_number){
			if(time_number[i] < 10)
				time_number[i] = "0"+time_number[i];
		}
		return time_number[0]+" : "+time_number[1]+" : "+time_number[2];
	},
	//获取两个时间节点间的秒数
	second = function(date1,date2){
		var mmtimes = date1.getTime()-date2.getTime();
		var second = Math.floor(mmtimes/1000);
		return second;
	},
	createVoice = function(){
		var div = document.createElement("div");
		div.classList.add("palyVoice");
		document.body.appendChild(div);
		setTimeout(function(){
			document.body.appendChild(div);
			var html = '<audio class="media" hidden="true"></audio>';
			document.getElementsByClassName('palyVoice')[0].innerHTML = html;
		},500);
	},
	playVoice = function(params){
		/*
		var cfg = {
			target: e,		//目标对象
			src: voiceSrc,  //远程url
			scope: this,    //作用域
			time: time,     //录音长度
			playFn: this.audioPlay, //播放中回调函数
			endedFn: this.endedFn	//播放结束回调函数
		};
		*/
		//html5 播放语音
		//var html = '<audio id="media" autoplay="autoplay" src="http://localhost:7001/user/web_app/newrepair/wx/WxDownController/readVoice?token=czdg_app&rid=666" hidden="true"></audio>';
		var playFn,endedFn;
		document.getElementsByClassName("media")[0].addEventListener("play", playFn=function(){
			(params.playFn).apply(params.scope,[params.target,arguments]);
		}, false);
		var breakflag = false;
		document.getElementsByClassName("media")[0].addEventListener("ended", endedFn=function(){
			if(breakflag) return;
			breakflag = true;
			(params.endedFn).apply(params.scope,[params.target,arguments]);
			document.getElementsByClassName("media")[0].removeEventListener("play",playFn);
			document.getElementsByClassName("media")[0].removeEventListener("ended",endedFn);
		}, false);
		setTimeout(function(){
			if(breakflag) return;
			breakflag = true;
			(params.endedFn).apply(params.scope,[params.target,arguments]);
			document.getElementsByClassName("media")[0].removeEventListener("play",playFn);
			document.getElementsByClassName("media")[0].removeEventListener("ended",endedFn);
		},params.time);
		document.getElementsByClassName("media")[0].src = params.src;
		document.getElementsByClassName("media")[0].play();
	},
	sysType = function(){
		//系统手机类型 ios、android
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 			//ios终端
		if(isAndroid){
			return 'android';
		}
		return 'ios';
	},
	/*
	 * 可把字符串作为 URI 进行编码
	 * 会进行转义的：;/?:@&=+$,# 具有特殊含义的 ASCII 标点符号
	 */
	js_encodeURIComponent= function(str){
		return encodeURIComponent(str);
	},
	//产生一个随机的数字加字母组合的字符
	randomWord= function(){
		return Math.random().toString(36).substr(2);
	},
	//js 时间戳转yyyy-MM-dd HH-mm-ss工具类 inputTime(1513681997385) =>2017-12-19 19:13:17
	formatDateTime = function(inputTime){
		var date = new Date(inputTime);
	    var y = date.getFullYear();  
	    var m = date.getMonth() + 1;  
	    m = m < 10 ? ('0' + m) : m;  
	    var d = date.getDate();  
	    d = d < 10 ? ('0' + d) : d;  
	    var h = date.getHours();
	    h = h < 10 ? ('0' + h) : h;
	    var minute = date.getMinutes();
	    var second = date.getSeconds();
	    minute = minute < 10 ? ('0' + minute) : minute;  
	    second = second < 10 ? ('0' + second) : second; 
	    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
	},
	helper.apply = apply;
	helper.applyIf = applyIf;
	helper.e = getElement;
	helper.ajax = ajax;
	helper.ajaxJsonp = ajaxJsonp;
	helper.format = format;
	helper.tranNullVal = tranNullVal;
	helper.trim = trim;
	helper.isContains = isContains;
	helper.locationParams = locationParams;
	helper.createStyle = createStyle;
	/*** 移动端提示框 ***/
	helper.open = open;
	helper.openMsg = openMsg;
	helper.confirm = confirm;
	helper.confirmFooter = confirmFooter;
	helper.loading = loading;
	helper.close = close;
	helper.closeAll = closeAll;
	
	/**** pc端提示框 ***/
	helper.alert = pcAlert;
	helper.pcConfirm = pcConfirm;
	
	helper.recudeTime = recudeTime;
	helper.second = second;
	helper.createVoice = createVoice;
	helper.playVoice = playVoice;
	helper.sysType = sysType;
	helper.js_encodeURIComponent = js_encodeURIComponent;
	helper.randomWord = randomWord;
	helper.formatDateTime = formatDateTime;
})();










