/*
 Title:关于我们微信公众号
 Author:fan qiao
 Date:2017-3-2 15:23:00 
 Version:v1.0
*/
mui.init();
(function($) {	
	var ABOUTUS = function(){
		this.ws = null;
		return this;
	}
	ABOUTUS.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
		},		
		getData:function(){
			var _this = this;			
		},
		bindEvent:function(){
			
		}
	}
	$(function(){
		var sett = new ABOUTUS();
			sett.init();
	});
})(Zepto);