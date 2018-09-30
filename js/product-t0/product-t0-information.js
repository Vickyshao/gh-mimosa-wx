/*
 Title:活期产品信息
 Author:sunli haiyang
 Date:2016-6-21 20:41:37
 Version:v1.0
*/

(function($) {
	var PRODUCTT0INFO = function(){
		this.ws = GHUTILS.parseUrlParam(window.location.href);
		return this;
	}
	PRODUCTT0INFO.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			$("#app_productName").html(decodeURIComponent(_this.ws.productName))
			$("#app_investMin").html(_this.ws.investMin)
			$("#app_investAdditional").html(_this.ws.investAdditional)
			$("#app_singleDailyMaxRedeem").html(_this.ws.singleDailyMaxRedeem)
		},
		getData:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;
		}
	}
	$(function(){
		var t0info = new PRODUCTT0INFO();
			t0info.init();
	});
})(Zepto);