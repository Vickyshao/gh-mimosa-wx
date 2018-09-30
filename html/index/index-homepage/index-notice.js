/*
 Title:notice
 Author:yang sen
 Date:2016-8-13 12:57:45
 Version:v1.0
*/
define(function(){
    var NOTICE = (function(){
 		var API = "";

 		return{

 			//初始化
			init:function(data){
				this.handleNotice(data);
				this.pageInit();
			},
			pageInit:function(){
				var _this = this;
				//console.log("notice")
				//绑定事件
				if(_this.bind){
					_this.bindEvent();
				}
			},
			handleNotice: function(notice) {
				if (notice && notice.rows.length > 0) {
					//公告
					var val = notice.rows[notice.rows.length-1];
					var html = "";
					var title = val.title.length > 15 ? val.title.substr(0,15)+"..." : val.title
					var subscript = val.subscript;
					if (subscript == 'New') {
						html = "<div class='' >" + title + " <img src='../../images/icon_new.png' class='app_news_icons'/></div>";
					} else if (subscript == 'Hot') {
						html = "<div class='' >" + title + " <img src='../../images/icon_hot.png' class='app_news_icons'/></div>";
					} else {
						html = "<div class='' >" + title + "</div>";
					}
	//				$.each(notices, function(i, val) {
	//					var title = val.title.length > 15 ? val.title.substr(0,15)+"..." : val.title
	//					var subscript = val.subscript;
	//					var linkUrl = val.linkUrl;
	//					if (subscript == 'New') {
	//						html = html + "<div class='' >" + title + " <img src='../../images/icon_new.png' class='app_news_icons'/></div>";
	//					} else if (subscript == 'Hot') {
	//						html = html + "<div class='' >" + title + " <img src='../../images/icon_hot.png' class='app_news_icons'/></div>";
	//
	//					} else {
	//						html = html + "<div class='' >" + title + "</div>";
	//					}
	//				});
					$(".app_clbox_con").html(html);
				}else{
					$(".app_clbox_con").html("");
				}
			},
			dateInit:function(){
	
	        },
	        bindEvent:function(){
	        	
		       	$('.app_clbox_warp').off().on('tap', function() {
					GHUTILS.OPENPAGE({
						url: "../../html/index/index-dynamic.html",
					})

				});
	       	}
		}
 	})();

	$["notice"] = function(data){
		
		NOTICE.bind = getCfgBind("notice");
		NOTICE.init(data);
	}
})