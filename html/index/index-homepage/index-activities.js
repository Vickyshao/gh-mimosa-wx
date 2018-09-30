/*
 Title:banner
 Author:yang sen
 Date:2016-8-13 12:57:45
 Version:v1.0
*/
define(function(){
    var ACTIVITY = (function(){
 		var API = "";

 		return{

 			//初始化
			init:function(data){
				this.pageInit();
//				this.handleBanner(data);
				this.bindEvent();
			},
			pageInit:function(){
				//console.log("banner")
				var _this = this;
				//绑定事件
				
				
			},
			handleBanner: function(banners) {
				//热门活动banner
				var _this = this;
				var bannerHtml = "";
				var bannerfirst = "";
				var bannerlast = "";
				var bannerSrc = "";
				if (banners && banners.length > 0) {
					$.each(banners, function(i, val) {
						var picUrl = val.picUrl || "";
						var linkUrl = val.linkUrl || "";
						var title = val.title || "";
						var toPage = val.toPage || ""; //T1:理财 T2:加薪宝
						var _imgname = val.picUrl.split("/")[2] || "";
						var relativePath = picUrl  || "";
						var onlineUrl = picUrl  || "";
						
						
						bannerHtml += "<div class='mui-slider-item app_p15 app_activity_link' data-links='" + linkUrl + "' data-title='" + title + "' data-topage='" + toPage + "'><img src='" + relativePath + "' /></div>";
						
						if (i == 0) {
							bannerfirst = "<div class='mui-slider-item app_p15 mui-slider-item-duplicate app_activity_link' data-links='" + linkUrl + "' data-title='" + title + "' data-topage='" + toPage + "'><img src='" + relativePath + "' /></div>";
							bannerSrc = "<img style='width: 100%; display: block;margin-left: 100%;' class='app_activity_link' data-links='" + linkUrl + "' data-title='" + title + "' data-topage='" + toPage + "' src='" + relativePath + "' />";
						}
						if (i == banners.length - 1) {
							bannerlast = "<div class='mui-slider-item app_p15 mui-slider-item-duplicate app_activity_link' data-links='"  + linkUrl + "' data-title='" + title + "' data-topage='" + toPage + "'><img src='" + relativePath + "' /></div>";
						}
					});
					if (banners.length > 0) {						
						$("#app_activity_slider").html(bannerlast + bannerHtml + bannerfirst);
//						$("#app_activity_slider").html(bannerHtml);
						$('#app_activity_slider').attr("style","");
									
					} else {
						$("#app_activity_slider").html(bannerSrc);
						mui('#app_activity_sliderbox').slider().setStopped(true);//暂时禁止滚动;
					}
					
					if(banners.length>1){
						mui('#app_activity_sliderbox').slider({
							interval:3000
						});
					} else {
						
					}

				}else{
					$("#app_activity_slider").html('<img src="../../images/activity_def.png" style="width: 100%; display: block;margin-left: 100%;" id="app_activity_slider_img"/>');
				}	
	
			},
			bindEvent: function() {
				var _this = this;
				$(".app_activity_link").off().on("tap",function(){
					var links = $(this).attr("data-links") || '';
					var title = $(this).attr("data-title") || '';
					var topage = $(this).attr("data-topage") || '';
					if (topage) {
						return;
						if (GHUTILS.getloginStatus(true)) {
							GHUTILS.OPENPAGE({
								url: "../../html/account/account-toinvite.html",
							})
//							GHUTILS.nativeUI.showWaiting();
						}
						
					}  else if (links != '')  {
						GHUTILS.OPENPAGE({
							url:"../../html/index/index-linkpage.html",
							extras:{
								links:links,
								title:title
							}
						})
					}
					
				});
				
			}
		}
 	})();

//	$(function(){
//		
//	});

	$["actcarousel"] = function(data){
		
		ACTIVITY.bind = getCfgBind("actcarousel");		
		ACTIVITY.init(data);
	}
})