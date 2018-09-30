/*
 Title:首页
 Author:yang sen
 Date:2016-6-4 18:31:00
 Version:v1.0
*/
(function($) {
	var PR = function() {
		this.ws = null;
		this.infotypes = [];
		this.firstpage = 1;
		this.pageNum = [];
		return this;
	}
	PR.prototype = {
		init: function() {
//			GHUTILS.setUserAgent();
//			$("#slider").css({"top": ""+GHUTILS.setTop(44)+"px"})
			this.bindEvent(); //事件绑定
			this.pageInit(); //页面初始化

		},
		pageInit: function() {
			var _this = this;
			GHUTILS.linkPages();
			_this.getType();
		},
		getType: function() {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.infromationtype,
				data: {},
				type: "post",
				async: true,
				callback: function(result) {
					//选项卡显示
					var list = result;
					var contentHtml = '';
					var scrollHtml = '';
					for (var i in list) {
						_this.infotypes[i] = list[i].name;

						var item = Number(i) + 2;
						scrollHtml += '<a class="mui-control-item" href="#item' + item + 'mobile" >' + list[i].name + '</a>';
						contentHtml += '<div id="item' + item + 'mobile" class="mui-slider-item mui-control-content" ><div class="mui-scroll-wrapper app_mt5"><div class="mui-scroll app_box_con app_f1x" ><ul class="mui-table-view app_table_ihview" id="app-information-show-' + item + '"></ul></div></div></div>';
					}
					for (i = 0; i < _this.infotypes.length + 1; i++) {
						//页码初始值
						_this.pageNum.push("1");
					}
					if (result.length != 0) {
						$("#sliderSegmentedControl").removeClass("app_none");
						$("#app-scroll").append(scrollHtml);
						$("#app-information-show").append(contentHtml);
					} else {
						$("#app-information-show").css("margin-top", "-45px");
					}
					_this.pullRefresh();
				}
			});
		},
		getAllInformaiton: function(page, refresh) {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.getinformationsalltoapp + "?page=" + page + "&rows=10&channelOid="+cmsChannelOid,
				type: "post",
				async: true,
				sw: true,
				callback: function(result) {
					var infromations = result.rows;
					var allHtml = '';

					for (var i in infromations) {
						allHtml += _this.getInfoHtml(infromations[i]);
					}
					if (infromations.length < 10 || $.isEmptyObject(infromations)) {
						refresh.endPullUpToRefresh(true);
					} else { 
						refresh.endPullUpToRefresh(false);
					}
					$("#app-information-show-all").append(allHtml);
					_this.bindEvent();
				}
			});
		},
		getInfoHtml: function(info){
			var _this = this;
			var linkpages = "", content = "", infoHtml = "", thumbnailUrl = "";
			if(info){
				if(info.url){
					linkpages = "app_link_pages";
				}else{
					if(info.content){
						linkpages = "app_content";
						content = info.content
						if(info.content.lastIndexOf(",") != -1 && info.content.length - info.content.lastIndexOf(",") == 1){
							content = encodeURIComponent(info.content.substr(0,info.content.lastIndexOf(",")))
						}
					}
				}
				if(info.thumbnailUrl){
					thumbnailUrl = '<img class="mui-media-object mui-pull-left" src="' + HOST + info.thumbnailUrl + '">'
				}
				infoHtml = "<div class='"+linkpages+" app_bline' data-content='"+content+"' data-links='" + info.url + "' data-title='" + info.title + "'><li class='mui-table-view-cell mui-media app_pl15'>"+thumbnailUrl+"<div class='mui-media-body'><div class='mui-ellipsis app_f14 app_pt5 app_pb5'>" + info.title + "</div><p class='mui-h6 mui-ellipsis-2'>" + info.summary + "</p></div></li></div>";
			}
			return infoHtml;
		},
		getInformationByType: function(type, page, refresh) {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.getinformations + "?type=" + type + "&status=published" + "&page=" + page + "&rows=10&channelOid="+cmsChannelOid,
				data: {},
				type: "post",
				async: true,
				sw: true,
				callback: function(result) {
					var infomationHtml = '';
//					console.log(cmsChannelOid)
  					var result = result.rows;
					for(var infotype in _this.infotypes){
						if(type == _this.infotypes[infotype]){
							for (var i in result) {
//								console.log(i)
								infomationHtml += _this.getInformationHtml(result[i]);
							}
							$("#app-information-show-" + (Number(infotype) + 2)).append(infomationHtml);
						}
					}

					if (result.length < 10 || $.isEmptyObject(result)) {
						refresh.endPullUpToRefresh(true);
					} else {
						refresh.endPullUpToRefresh(false);
					}

					_this.bindEvent();
				}

			});
		},
		getInformationHtml: function(tradeObj) {
			var linkpages = "", content = "", thumbnailUrl = "";
			if(tradeObj.url){
				linkpages = "app_link_pages";
			}else{
				if(tradeObj.content){
					linkpages = "app_content";
					content = tradeObj.content
					if(tradeObj.content.lastIndexOf(",") != -1 && tradeObj.content.length - tradeObj.content.lastIndexOf(",") == 1){
						content = encodeURIComponent(tradeObj.content.substr(0,tradeObj.content.lastIndexOf(",")))
					}
				}
			}
			if(tradeObj.thumbnailUrl){
				thumbnailUrl = '<img class="mui-media-object mui-pull-left" src="' + HOST + tradeObj.thumbnailUrl + '">'
			}
			var infomationHtml = "<div class='"+linkpages+" app_bline' data-content='"+content+"' data-links='" + tradeObj.url + "' data-title='" + tradeObj.title + "'><li class='mui-table-view-cell mui-media app_pl15'>"+thumbnailUrl+"<div class='mui-media-body'><div class='mui-ellipsis app_f14 app_pt5 app_pb5'>" + tradeObj.title + "</div><p class='mui-h6 mui-ellipsis-2'>" + tradeObj.summary + "</p></div></li></div>";
			return infomationHtml;
		},
		bindEvent: function() {
			var _this = this;
			$(".app_link_pages").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "index-linkpage.html",
//					id: GHUTILS.PAGESID.LINKPAGES,
					autoshow: true,
					extras: {
						links: $(this).attr("data-links"),
						title: $(this).attr("data-title"),
					}
				})
//				GHUTILS.nativeUI.showWaiting();
			})
			$(".app_content").off().on("tap",function(){
				GHUTILS.OPENPAGE({
					url:"content_pages.html",
//					id:GHUTILS.PAGESID.CONTENT,
					autoShow:true,
					extras:{
						title: $(this).attr("data-title"),
						content: $(this).attr("data-content")
					}
				})
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
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					mui(pullRefreshEl).pullToRefresh({
						up: {
							auto: true,
							callback: function() {
								var self = this;
								if (index == 0) {
									_this.getAllInformaiton(_this.firstpage, self);
									_this.firstpage++;
								} else {
									var type = _this.infotypes[index - 1];
									_this.getInformationByType(type, _this.pageNum[index], self);
									_this.pageNum[index]++;
								}
							}
						}
					});
				});
			});
		}
	}
	$(function() {
		var pr = new PR();
		pr.init();
	});
	//			$(function() {
	//				var pr = new PR();
	//				pr.init();
	//			});
})(Zepto);