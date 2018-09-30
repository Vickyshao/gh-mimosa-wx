/*
 Title:我的定期
 Author:cui xu
 Date:2017-3-7 13:31:00
 Version:v1.0
*/
mui.init();

(function($) {
	var PR = function() {
		this.type = ["notice", "activity"];
		this.pageNum = [1, 1, 1, 1];
		this.isRead = ["", "", "no", "is"];
		this.topage = GHUTILS.parseUrlParam().topagge;
		return this;
	}
	PR.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
			this.bindEvent(); //事件绑定
			this.pullRefresh();
		},
		pageInit: function() {
			var _this = this;
			if(_this.topage &&_this.topage == "mail"){
				$("#app_title").html("站内信")
				$("#app_notice_box").addClass("app_none")
				$("#app_activity_box").addClass("app_none")
				$("#app_mail_box").removeClass("app_hidden")
				$("#app_allread").removeClass("app_none")
			}
		},
		getData: function(index, refresh) {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.messages+"?type="+_this.type[index]+'&page='+_this.pageNum[index]+'&rows=10&status=on',
				data: {},
				type: "post",				
				async: true,
				callback: function(result) {
//					console.log(JSON.stringify(result))
					if (GHUTILS.checkErrorCode(result)) {
						var list = result.rows;
						_this.pageNum[index]++;
						var html = '';
						for (var i in list) {
							html += _this.getHtml(list[i]);
						}
//						$('#' + _this.type[index] + 'count').html(result.total);
							
						$('#app-' + _this.type[index] + '-box').append(html);
						_this.pushTap();
//						_this.closeWaiting(index);
						if (list.length < 10 || $.isEmptyObject(list)) {
							refresh.endPullUpToRefresh(true);
						} else {
							refresh.endPullUpToRefresh(false);
						}
					}

				},
				errcallback: function(result) {
//					_this.closeWaiting(index);
					refresh.endPullUpToRefresh(true);
				}

			});
		},
		getMail: function(index, refresh){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.mailQueryPage+"?page="+_this.pageNum[index]+"&rows=100&isRead="+_this.isRead[index],
				type: "post",
				async: true,
				callback: function(result){
//					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						var list = result.rows;
						_this.pageNum[index]++;
						var ishtml = '', nohtml = '';
						if(index == 3){
							for (var i in list) {
								ishtml += _this.getMailHtml(list[i]);
							}
							$('#app-ismail-box').append(ishtml);
						}else{
							var total = result.total
							if(total > 99){
								total = "99+"
							}
							
							$(".total").html(total)
							for (var i in list) {
								nohtml += _this.getMailHtml(list[i]);
							}
							$('#app-nomail-box').append(nohtml);
						}
						
//						$('#' + _this.type[index] + 'count').html(result.total);
						
						_this.mailTap();
//						_this.closeWaiting(index);
						if (list.length < 10 || $.isEmptyObject(list)) {
							refresh.endPullUpToRefresh(true);
						} else {
							refresh.endPullUpToRefresh(false);
						}
					}
				},
				errcallback: function(result) {
//					_this.closeWaiting(index);
					refresh.endPullUpToRefresh(true);
				}
			})
		},
		getHtml: function(Obj) {
			if(Obj.title.length>12){
				Obj.title = Obj.title.substr(0,8)+'...'
			}
			var time = Obj.pushTime;
			var html="<div class='app_myproduct_box app_pb20 app_links' data-type='"+ Obj.type +"' data-title='"+ Obj.title +"' data-url='"+ Obj.url +"' data-summary='"+ Obj.summary +"'><div class='app_c3b app_lh24 app_f15'>"+ Obj.title +"<span class='mui-pull-right app_ca6 app_f12'>"+ time +"</span></div><div class='app_ca6 app_f13 mui-ellipsis-2 app_lh24'>"+ Obj.summary +"</div></div>"
			return html;
		},
		getMailHtml: function(Obj){
			if(Obj.mesTitle.length>12){
				Obj.mesTitle = Obj.mesTitle.substr(0,8)+'...'
			}
			var time = Obj.updateTime;
			var html="<div class='app_myproduct_box app_pb20 app_mail' data-oid='" + Obj.oid + "'><div class='app_c3b app_f15 app_lh24'>"+ Obj.mesTitle +"<span class='mui-pull-right app_ca6 app_f12'>"+ time +"</span></div><div class='app_ca6 app_f13 app_lh24 mui-ellipsis-2'>"+ Obj.mesContent +"</div></div>"
			return html;
		},
		bindEvent: function() {
			var _this = this;
			
			$(".tap_box").off().on("tap", function(){
				if($(this).find("img").attr("src") == "../../images/icon_filter.png"){
					$(this).find("img").attr("src","../../images/icon_filter_active.png")
					$(".type-list").removeClass("app_none")
				}else{
					$(this).find("img").attr("src","../../images/icon_filter.png")
					$(".type-list").addClass("app_none")
				}
			})
			
			$(".type-list").find("li").each(function(){
				$(this).off().on("tap", function(){
					if($(this).html() != $("#app_title").html()){
						$("#app_title").html($(this).html())
						$("#app_notice_box").addClass("app_none")
						$("#app_activity_box").addClass("app_none")
						$("#app_mail_box").addClass("app_hidden")
						$("#app_allread").addClass("app_none")
						if($(this).html() == "公告"){
							$("#app_notice_box").removeClass("app_none")
						}else if($(this).html() == "活动"){
							$("#app_activity_box").removeClass("app_none")
						}else{
							$("#app_mail_box").removeClass("app_hidden")
							$("#app_allread").removeClass("app_none")
						}
					}
					$("#app_title").next().attr("src","../../images/icon_filter.png")
					$(".type-list").addClass("app_none")
				})
			})
			
			$("#app_allread").off().on("tap", function(){
				_this.mailAllread();
			})
			
//			$(".app_link").off().on("tap", function() {
//				var productOid = $(this).attr("data-href");
//				var producttype = $(this).attr("data-type");
//				GHUTILS.OPENPAGE({
//					url: "../product-tn/product-tn-detail.html",
//					id: GHUTILS.PAGESID.PROTNDETAIL,
//					extras: {
//						"productOid": productOid,
//						"producttype": productOid,
//						orderlist: "orderlist"
//					}
//				})
//			})
		},
		pushTap: function(){
			var _this = this;
			$(".app_links").off().on("tap", function() {
				var type = $(this).attr("data-type");
				var links = $(this).attr("data-url");
				var title = $(this).attr("data-title");
				var summary = $(this).attr("data-summary");
				if(type == "notice"){
					if(summary != ""){
						GHUTILS.OPENPAGE({
							url:"../../html/index/content_pages.html",
							extras:{
								title: title,
								content: summary
							}
						})
					}
				}else if(type == "activity"){
					if(links != ""){
						GHUTILS.OPENPAGE({
							url:"../../html/index/index-linkpage.html",
							extras:{
								links:links,
								title:title
							}
						})
					}
				}
			})
		},
		mailTap: function(){
			var _this = this;
			$(".app_mail").off().on("tap", function(){
				var mailOid = $(this).attr("data-oid")
				_this.getMailDetail(mailOid)
			})
		},
		getMailDetail: function(mailOid){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.mailDetail+"?mailOid="+mailOid,
				type: "post",
				sw: true,
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						GHUTILS.OPENPAGE({
							url:"../../html/index/content_pages.html",
							extras:{
								title: result.mesTitle,
								content: result.mesContent
							}
						})
					}
					
					setTimeout(function(){
						_this.pageNum[2] = 1;
						_this.pageNum[3] = 1;
						$("#app-nomail-box").html("");
						$("#app-ismail-box").html("");
						mui("#app_nomail_scroll").pullToRefresh().refresh(true)
						mui("#app_ismail_scroll").pullToRefresh().refresh(true)
						_this.getMail(2, mui("#app_nomail_scroll").pullToRefresh())
						_this.getMail(3, mui("#app_ismail_scroll").pullToRefresh())
//						mui.fire(plus.webview.getWebviewById(GHUTILS.PAGESID.ACCOUNTVW), "loadData");
					}, 500)
				}
			})
		},
		mailAllread: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.mailAllread,
				type: "post",
				sw: true,
				callback: function(result){
					if(GHUTILS.checkErrorCode(result)){
						_this.pageNum[2] = 1;
						_this.pageNum[3] = 1;
						$("#app-nomail-box").html("");
						$("#app-ismail-box").html("");
						mui("#app_nomail_scroll").pullToRefresh().refresh(true)
						mui("#app_ismail_scroll").pullToRefresh().refresh(true)
						_this.getMail(2, mui("#app_nomail_scroll").pullToRefresh())
						_this.getMail(3, mui("#app_ismail_scroll").pullToRefresh())
					}
				}
			})
		},
		pullRefresh: function() {
			var _this = this;
			//阻尼系数 判断ios版本
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: deceleration
			});//可删去
			mui.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				mui.each(document.querySelectorAll('.mui-scroll'), function(index, pullRefreshEl) {
					mui(pullRefreshEl).pullToRefresh({
						up: {
							auto: true,
							callback: function() {
								var self = this;
								if(index == 0 || index == 1){
									_this.getData(index, self);
								}else{
									_this.getMail(index, self);
								}
							}
						}
					});
				});

			});

		}
	}
	GHUTILS.getUserInfo(function(){
		$(function() {
			var pr = new PR();
			pr.init();
		});
	},true)
	
})(Zepto);