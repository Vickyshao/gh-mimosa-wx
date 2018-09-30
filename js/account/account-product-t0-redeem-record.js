/*
 Title:我的活期-赎回记录
 Author:fan qiao
 Date:2017-7-29 17:04:00
 Version:v1.0
*/

(function($) {

	var ACCOUNT = function() {
		this.ws = null;
		this.counter = 1;
		return this;
	}
	ACCOUNT.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
			this.bindEvent(); //事件绑定
			this.pullRefresh();
		},
		pageInit: function() {
			var _this = this;
			GHUTILS.listLinks();
		},
		getData: function() {/*活期数据*/
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0redeem+"?page="+ _this.counter +"&rows=10",
				async: true,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if (GHUTILS.checkErrorCode(result)) {
						console.log(JSON.stringify(result))
						var html = '';
						_this.counter ++;
						var list = result.rows
						for (var i in list) {
							html = _this.getHtml(list[i])
							$("#proList").append(html)
						}
						
						
						if(list.length < 10  || $.isEmptyObject(list)){
								mui('#app_pullRefresh').pullRefresh().endPullupToRefresh(true);
							} else {
								mui('#app_pullRefresh').pullRefresh().endPullupToRefresh(false);
							}
						_this.bindEvent();
					}
				},
				errcallback: function(result) {
					mui('#app_pullRefresh').pullRefresh().endPullupToRefresh(true);
					mui.toast("网络错误，请稍后再试")
				}
			});
		},
		getHtml: function(tradeObj) {
			var holdingHtml = '<div class="app_in_product_box app_pb0 app_redeem"><div class="app_in_product_title app_pl20 app_pr20"><span class="app_pr">'+ tradeObj.productName +'</span><span class="app_cmain app_fr">已投资'
								+ tradeObj.holdDays +'天</span></div><ul class="mui-table-view mui-grid-view app_bgn app_np app_pb0" style="overflow: hidden;"><li class="mui-table-view-cell mui-col-xs-6 app_mt10 app_mb10 app_pt0 app_block_border mui-text-left app_pl20"><div class="app_f12 app_cb2">昨日收益(元)</div><div class="app_mt5 app_f16 app_cred">'
								+ "已赎回" +'</div></li><li class="mui-table-view-cell mui-col-xs-6 app_mt10 app_mb10 app_pt0 mui-text-left app_pl20"><div class="app_f12 app_cb2">历史年化收益</div><div class="app_mt5 app_f16 app_cred">'
								+ GHUTILS.Fmul(tradeObj.incomeRatio, 100) +'<span class="app_f14">%</span></div></li></ul><ul class="mui-table-view mui-grid-view app_np app_pb0 app_bgfa" style="overflow: hidden;"><li class="mui-table-view-cell mui-col-xs-6 app_mt10 app_mb10 app_pt0 mui-text-left app_pl20"><div class="app_f12 app_cb2">赎回金额: <span class="app_c2">'
								+ GHUTILS.formatCurrency(tradeObj.orderVolume) +'元</span></div></li><li class="mui-table-view-cell mui-col-xs-6 app_mt10 app_mb10 app_pt0 mui-text-right app_pr20"><div class="app_f12 app_cb2">赎回日期：<span class="app_c2">'
								+ tradeObj.orderTime.split(" ")[0] +'</span></div></li></ul></div>';

			return holdingHtml;
		},
		bindEvent: function() {
			var _this = this;
			$("#app_invest").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "account-product-t0-redeem.html",
				})
			})
			$("#redeem_record").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "account-product-t0-redeem-record.html",
				})
			})
			$(".app_links").off().on("tap", function() {
				var tradeOrderOid = $(this).attr("data-url");
				
				GHUTILS.OPENPAGE({
						url: "account-product-t0-holding-details.html",
						id: GHUTILS.PAGESID.ACCT0HOLDDET,
						extras: {
							tradeOrderOid : tradeOrderOid
						}
				})
			});
		},
		pullRefresh: function() {
			var _this = this;
			mui.init({
			    pullRefresh : {
				    container:"#app_pullRefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				    up : {
				      height:50,//可选.默认50.触发上拉加载拖动距离
				      auto:true,//可选,默认false.自动上拉加载一次
				      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
				      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
				      callback :function(){
				      	_this.getData();//获取数据
				      	
				      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				    }
				  }
			});

		}
	}
	$(function() {

		var ac = new ACCOUNT();
		ac.init();
	});
})(Zepto);
