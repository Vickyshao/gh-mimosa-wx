/*
 Title:首页
 Author:yang sen
 Date:2016-6-4 18:31:00
 Version:v1.0
*/
mui.init();
(function($) {

	var SETTINGPRO = function(){
		this.ws = null;
		return this;
	}
	SETTINGPRO.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			GHUTILS.nativeUI.closeWaiting();
		},		
		getData:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;
			//初始化页面连接
			$('.app_links').on('tap',function(){
				var _showId = $(this).attr("data-showid");
				var _title = $(this).attr("data-title")
				GHUTILS.OPENPAGE({
					url:'setting-problems-details.html',
					extras:{
						showId:_showId,
						title:_title,
					}
				})
				GHUTILS.nativeUI.showWaiting();
			});
		}
	}
	$(function(){
		var settpro = new SETTINGPRO();
			settpro.init();
	});
})(Zepto);