/*
 Title:关于我们
 Author:fan qiao
 Date:2017-3-2 15:13:00 
 Version:v1.0
*/
mui.init();
(function($) {		
	var ABOUTUS = function(){
		this.ws = null;
		return this;
	}
//	添加此项加上链接
	GHUTILS.listLinks();
	ABOUTUS.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
//			UPDATA.upDataInit({checkNewVer:"checkversion"});
		},
		pageInit:function(){
			var _this = this;
			GHUTILS.getHotline($(".telnum"), $("#app_contactService"));
		},		
		getData:function(){
			var _this = this;
//			plus.runtime.getProperty( plus.runtime.appid, function ( wgtinfo ) {
//				    //如果是检测版本，把版本号写入  
//				    console.log("wgtinfo.version==="+wgtinfo.version)
//					document.getElementById("app_txt_ver").innerHTML ='Ver : ' + wgtinfo.version;
//			})
			
		},
		bindEvent:function(){
//			$('#app-safety').on('tap',function(){
//				
//				GHUTILS.OPENPAGE({
//					url:"../index/index-linkpage.html",
//					id:GHUTILS.PAGESID.LINKPAGES,
//					extras:{
//						contentId:"app-safety",
//						title:$("#app-safety").attr("data-title"),
//					}
//				})
//				GHUTILS.nativeUI.showWaiting();
//			});
			
			$("#wechat").on('tap',function(){
//				GHUTILS.copyToClip($(this).find("span").html())
				GHUTILS.OPENPAGE({
					url:"../../html/setting/setting-about-us-wechat.html"
				})
			});			
		}
	}
	$(function(){
		var sett = new ABOUTUS();
			sett.init();
	});
})(Zepto);