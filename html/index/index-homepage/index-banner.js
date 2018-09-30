/*
 Title:banner
 Author:yang sen
 Date:2016-8-13 12:57:45
 Version:v1.0
*/
define(function(){
    var BANNER = (function(){
 		var API = "";

 		return{

 			//初始化
			init:function(data){
				this.handleBanner(data);
				this.pageInit();
			},
			pageInit:function(){
				//console.log("banner")
				var _this = this;
				//绑定事件
				if(_this.bind){
					_this.bindEvent();
				}
			},
			handleBanner: function(banners) {
				//轮播banner
				var _this = this;
				var bannerHtml = "";
				var bannerfirst = "";
				var bannerlast = "";
				var bannerindicator = "";
				var bannerSrc = "";
	
				if (banners && banners.rows.length > 0) {
					var banners = banners.rows;
//					/console.log(JSON.stringify(banners))
					$.each(banners, function(i, val) {
						var imageUrl = val.imageUrl || "";
						var linkUrl = val.linkUrl || "";
						var title = val.title || "";
						var isLink = val.isLink || ""; //0链接 1:跳转
						var toPage = val.toPage || ""; //T1:理财 T2:加薪宝
						var _imgname = val.imageUrl.split("/")[2] || "";
						var relativePath = HOST + imageUrl  || "";
						var onlineUrl = HOST + imageUrl  || "";
						var indicatorActive = '';
						
						
						bannerHtml += "<div class='mui-slider-item app_banner_link' data-links='" + linkUrl + "' data-title='" + title + "' data-topage='" + toPage + "'><img src='" + relativePath + "' /></div>";
						
						if (i == 0) {
							bannerfirst = "<div class='mui-slider-item mui-slider-item-duplicate app_banner_link' data-links='" + linkUrl + "' data-title='" + title + "' data-topage='" + toPage + "'><img src='" + relativePath + "' /></div>";
							bannerSrc = "<img style='width: 100%; display: block;margin-left: 100%;' class='app_banner_link' data-links='" + linkUrl + "' data-title='" + title + "' data-topage='" + toPage + "' src='" + relativePath + "' />";
						}
						if (i == banners.length - 1) {
							bannerlast = "<div class='mui-slider-item mui-slider-item-duplicate app_banner_link' data-links='"  + linkUrl + "' data-title='" + title + "' data-topage='" + toPage + "'><img src='" + relativePath + "' /></div>";
						}
						//图片下方的轮播小点点 
						if (i == 0) {
							indicatorActive = "mui-active";
						}						
						bannerindicator += "<div class='mui-indicator "+ indicatorActive +"'></div>";
					});

					if (banners.length > 0) {						
						$("#app_banner_slider").html(bannerlast + bannerHtml + bannerfirst);
						$("#app_banner_slider_indicator").html(bannerindicator);
						$('#app_banner_slider').attr("style","");
						mui('#app_banner_sliderbox').slider({
							interval:4000
						});
									
					} else {
						$("#app_banner_slider_indicator").html("");
						$("#app_banner_slider").html(bannerSrc);
					}

				}else{
					$("#app_banner_slider").html('<img src="../../images/banner_def.png" style="width: 100%; display: block;margin-left: 100%;" id="app_banner_slider_img"/>');
					$("#app_banner_slider_indicator").html("");
				}
	
			},
			bindEvent: function() {
				var _this = this;
				
				$("#banner_icon").off().on("tap",function(){
					GHUTILS.OPENPAGE({
						url: "../setting/setting-problems.html"
					})
				})
				
				$(".app_banner_link").off().on("tap",function(){
					var links = $(this).attr("data-links") || '';
					var title = $(this).attr("data-title") || '';
					var topage = $(this).attr("data-topage") || '';
					
					if (topage == 'T1') {
						GHUTILS.OPENPAGE({
								url: "../../html/product-t0/product-t0-list.html",
							})
					} else if (topage == 'T2') {
						GHUTILS.OPENPAGE({
								url: "../../html/product-tn/product-tn-list.html",
							})
					} else if (topage == 'T3') {
//						console.log(GHUTILS.getloginStatus(false))
//						if(!GHUTILS.getloginStatus(false)){
							GHUTILS.OPENPAGE({
								url: "../../html/usermgmt/usermgmt-reg.html",
							})
//						} else {
//							mui.toast("您已领取过体验金")
//						}
						
				} else if (topage == 'T4') {
						GHUTILS.OPENPAGE({
							url: "index-activite2.html"
						})
						return false
						
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

	$["banner"] = function(data){
		
		BANNER.bind = getCfgBind("banner");		
		BANNER.init(data);
	}
})