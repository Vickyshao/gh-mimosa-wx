/*
 Title:我的定期
 Author:fanyu
 Date:2016-8-22 09:31:00
 Version:v1.0
*/

mui.init();

(function($) {
	var PR = function() {
		this.pageNum = 1;
		this.ws = GHUTILS.parseUrlParam();
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
			$(".app_productName").html(decodeURIComponent(_this.ws.productName))
		},
		getData: function(refresh) {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.TARGET.tradeordermng+"?page="+_this.pageNum+"&rows=10&orderType=invest&orderType=expGoldInvest&productOid="+_this.ws.productOid,
				type: "post",
				async: true,
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result)) {
						var list = result.rows, html = "";
						for(var p in list){
							html += _this.getInvestList(list[p]);
						}
						$("#app_box_list").append(html)
						refresh.endPullUpToRefresh(_this.pageNum*10 < result.total ? false : true);
						_this.pageNum++;
					}
				},
				errcallback: function(result) {
					refresh.endPullUpToRefresh(true);
				}
			});
		},
		getInvestList: function(tradeObj){
			var html = "";
			html = '<ul class="mui-table-view mui-grid-view app_notborder app_list_con"><li class="mui-table-view-cell mui-media mui-col-xs-4 mui-text-left"><div class="mui-h5 app_c3">'
					+tradeObj.phoneNum+'</div></li><li class="mui-table-view-cell mui-media mui-col-xs-4 mui-text-center"><div class="mui-h5 app_c3">'
					+GHUTILS.formatCurrency(tradeObj.orderAmount)+'</div></li><li class="mui-table-view-cell mui-media mui-col-xs-4 mui-text-right"><div class="mui-h5 app_c5">'
					+tradeObj.orderTime.split(" ")[0]+'</div><div class="mui-h5 app_c5">'
					+tradeObj.orderTime.split(" ")[1]+'</div></li></ul>'
			return html
		},
		bindEvent: function() {
			var _this = this;
		},
		pullRefresh: function() {
			var _this = this;
			//阻尼系数
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: 0.0009
			});
			mui.ready(function() {
				mui("#app_scroll").pullToRefresh({
					up: {
						auto: true,
						callback: function() {
							var self = this;
							_this.getData(self);
						}
					}
				});
			});
		}
	}
	$(function() {
		var pr = new PR();
		pr.init();
	});
})(Zepto);