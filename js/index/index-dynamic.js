/*
 Title:公告
 Author:dxy
 Date:2016-6-30 15:50:00
 Version:v1.0
*/
//	mui.init();

(function($) {
	var rows = 10;
	var PR = function() {
		this.ws = null;
		this.pageNum = 1;
		return this;
	}
	PR.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
			this.bindEvent(); //事件绑定
			//this.getNotice(); //获取数据
			this.pullRefresh();
		},
		pageInit: function() {
			var _this = this;
		},
		bindEvent: function() {
			var _this = this;
	
			$(".app_linkHtml").off().on("tap",function(){
				GHUTILS.OPENPAGE({
					url:"content_pages.html",
					extras:{
						title: $(this).attr("data-title"),
						content: $(this).attr("data-linkHtml")
					}
				})
			});

			GHUTILS.linkPages();
		},
		getNotice: function(page, rows, refresh) {
			var _this = this;
			var num = window.innerWidth < 375 ? 8 : 12;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.getnotices + "?page=" + page + "&rows=" + rows + "&channelOid=" + cmsChannelOid,
				data: {},
				type: "post",
				async: true,
				callback: function(result) {
					var notice = result.rows;
					var html = "";
					var newHtml = "";
					var hotHtml = "";
					_this.pageNum++;
					
					$.each(notice, function(i, val) {
						var linkpages = "";
						var linkHtml = "";
						var title = val.title.length > num ? val.title.substr(0,num)+"..." : val.title
						if(val.linkUrl){
							linkpages = "app_link_pages";
						}else{
							if(val.linkHtml){
								linkpages = "app_linkHtml";
								linkHtml = val.linkHtml
								if(val.linkHtml.lastIndexOf(",") != -1 && val.linkHtml.length - val.linkHtml.lastIndexOf(",") == 1){
									linkHtml = val.linkHtml.substr(0,val.linkHtml.lastIndexOf(","))
								}
							}
						}
						if (val.subscript == "New") {
							newHtml = "<img src='../../images/icon_new.png' class='app_news_icons app_ml5' />";
						} else {
							newHtml = '';
						}
						if (val.subscript == "Hot") {
							hotHtml = "<img src='../../images/icon_hot.png' class='app_news_icons app_ml5'/>";
						} else {
							hotHtml = '';
						}
						html = html + "<div class='" + linkpages + " app_bline app_links' data-linkHtml='"+linkHtml+"' data-links='" + val.linkUrl + "' data-title='" + val.title + "'><li class='mui-table-view-cell'><a class='mui-navigate-right' href='javascript:;'><span class='mui-badge mui-badge-inverted'>" + val.releaseTime + "</span>" + title + "" + newHtml + hotHtml + "</a></li></div>";
					})
					if (notice.length < 10 || $.isEmptyObject(notice)) {
						refresh.endPullUpToRefresh(true);
					} else {
						refresh.endPullUpToRefresh(false);
					}
					$("#home_notice_title").append(html);
					_this.bindEvent();
				}
			});
		},

		pullRefresh: function() {
			var _this = this;

			//阻尼系数
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: deceleration
			});
			mui.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				mui.each(document.querySelectorAll('.mui-scroll'), function(index, pullRefreshEl) {
					mui(pullRefreshEl).pullToRefresh({
						up: {
							auto: true,
							callback: function() {
								var self = this;
								setTimeout(function() {
									_this.getNotice(_this.pageNum, rows, self);
								}, 700);
							}
						}
					});
				});

			});
		},
	}
	$(function() {
		var pr = new PR();
		pr.init();
	});
})(Zepto);