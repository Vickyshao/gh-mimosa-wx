/*
 Title:理财小工具
 Author:
 Date:2016-6-4 18:31:00
 Version:v1.0
*/
(function($) {
	var TOOLS = function() {
		this.ws = null;
		return this;
	}
	TOOLS.prototype = {
		init: function() {
//			GHUTILS.setUserAgent();
//			if (GHUTILS.getloginStatus(true)) {
				this.pageInit(); //页面初始化
				this.bindEvent();
				plus.nativeUI.closeWaiting();
//			}
		},
		pageInit: function() {
			var _this = this;
		},
		bindEvent: function() {
			var _this = this;
			$('.app_links').on('tap',function(){
				GHUTILS.OPENPAGE({
					url:"../../../html/index/index-shortcut/index-tools-details.html",
					extras:{
						title:$(this).attr("data-title")
					}
				})
			});
		}	
	}
	mui.plusReady(function() {
		var ab = new TOOLS();
		ab.init();
	});
})(Zepto);
