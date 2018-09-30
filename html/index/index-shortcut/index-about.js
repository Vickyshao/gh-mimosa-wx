/*
 Title:关于我们
 Author:
 Date:2016-6-4 18:31:00
 Version:v1.0
*/
(function($) {
	var ABOUT = function() {
		this.ws = null;
		return this;
	}
	ABOUT.prototype = {
		init: function() {
//			GHUTILS.setUserAgent();

//			$(".mui-fullscreen").css({"top": ""+GHUTILS.setTop(44)+"px"})
//			if (GHUTILS.getloginStatus(true)) {
				this.pageInit(); //页面初始化
//				plus.nativeUI.closeWaiting();
//			}
		},
		pageInit: function() {
			var _this = this;
			GHUTILS.getHotline($("#hot_tel"), $("#hot_tel"));
			
			
		},
		closeWaiting: function(index) {
//			plus.nativeUI.closeWaiting();

		},
		bindEvent: function() {
			var _this = this;
		}	
	}
	$(function() {
		var ab = new ABOUT();
		ab.init();
	});
})(Zepto);
