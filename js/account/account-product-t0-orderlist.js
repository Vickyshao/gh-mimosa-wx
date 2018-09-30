/*
 Title:我的活期
 Author:fan qiao
 Date:2016-8-19 9:31:00
 Version:v1.0
*/

(function($) {
	var ACCOUNT = function() {
		this.ws = null;
		this.counter = 1;
		this.productOid = null;
		this.allValue = 0;
		return this;
	}
	ACCOUNT.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
//			this.bindEvent(); //事件绑定
			this.pullRefresh();
		},
		pageInit: function() {
			var _this = this;
			GHUTILS.listLinks();
		},
		getData: function(index, refresh) {/*活期数据*/
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0list+"?page="+ _this.counter +"&rows=10",
				async: true,
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result)) {
						console.log("getDatagetDatagetData",JSON.stringify(result))
						var html = '';
						_this.counter ++;
						$("#yes-income").html(GHUTILS.formatCurrency(result.yesterdayAllIncome))
						$("#app-amount").html(GHUTILS.formatCurrency(result.allValue))
						$("#app-tasteAmount").html(GHUTILS.formatCurrency(result.expGoldAmount))
						if(result.allValue){
							$("#app_redeem").removeClass("app_btn_loading")
						}else{
							$("#app_redeem").addClass("app_btn_loading")
						}
						if(result.redeemableProductOids && result.redeemableProductOids.length > 0){
							_this.productOid = result.redeemableProductOids[0]
						}
						var list = result.pageResp.rows
						if(list && list.length > 0){
							_this.allValue = $("#app-amount").html()
							for (var i in list) {
								html = _this.getHtml(list[i])
								$("#proList").append(html)
							}
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
					refresh.endPullUpToRefresh(true);
					mui.toast("网络错误，请稍后再试")
				}
			});
		},
		getHtml: function(tradeObj) {
			var productType = ''
			if(tradeObj.orderType && tradeObj.orderType == "expGoldInvest"){
				productType = ' <span>(体验金)</span>'
			}
			
			var incomeRatio = tradeObj.incomeRatio, yesterdayIncome = tradeObj.yesterdayIncome;
			if(incomeRatio && incomeRatio != "0.00"){
				incomeRatio = tradeObj.incomeRatio + '<span class="app_f14">%</span>'
				yesterdayIncome = GHUTILS.formatCurrency(tradeObj.yesterdayIncome)
			}else{
				incomeRatio = "待分配"
				yesterdayIncome = "待分配"
			}
			
			var holdingHtml = '<div class="app_in_product_box app_links app_pb0" data-url="'+ tradeObj.tradeOrderOid +'"><div class="app_in_product_title app_pl20 app_pr20"><span class="app_pr">'+ tradeObj.productName +'</span><span class="app_cmain app_fr">'
								+ tradeObj.viewStatusDisp +'</span></div><ul class="mui-table-view mui-grid-view app_bgn app_np app_pb0" style="overflow: hidden;"><li class="mui-table-view-cell mui-col-xs-6 app_mt10 app_mb10 app_pt0 app_block_border mui-text-left app_pl20"><div class="app_f12 app_cb2">昨日收益(元)</div><div class="app_mt5 app_f16 app_cred">'
								+ yesterdayIncome +'</div></li><li class="mui-table-view-cell mui-col-xs-6 app_mt10 app_mb10 app_pt0 mui-text-left app_pl20"><div class="app_f12 app_cb2">昨日年化收益</div><div class="app_mt5 app_f16 app_cred">'
								+ incomeRatio +'</div></li></ul><ul class="mui-table-view mui-grid-view app_np app_pb0 app_bgfa" style="overflow: hidden;"><li class="mui-table-view-cell mui-col-xs-6 app_mt10 app_mb10 app_pt0 mui-text-left app_pl20"><div class="app_f12 app_cb2">在投金额: <span class="app_c2">'
								+ GHUTILS.formatCurrency(tradeObj.value) +'元</span>'+productType+'</div></li><li class="mui-table-view-cell mui-col-xs-6 app_mt10 app_mb10 app_pt0 mui-text-right app_pr20"><div class="app_f12 app_cb2">购买日期：<span class="app_c2">'
								+ tradeObj.orderTime.split(" ")[0] +'</span></div></li></ul></div>';

			return tradeObj.value ? holdingHtml : '';
		},
		bindEvent: function() {
			var _this = this;
			$("#app_redeem").off().on("tap", function() {
				if($(this).hasClass("app_loading") || $(this).hasClass("app_btn_loading")){
					return
				}
				$(this).addClass("app_loading")
				_this.gett0detail(_this.productOid)
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
					extras: {
						tradeOrderOid : tradeOrderOid
					}
				})
			});
		},
		//活期产品详情
		gett0detail: function(oid){
			if(!oid){
				mui.toast("暂无可赎回的产品")
				$("#app_redeem").removeClass("app_loading")
				return
			}
			var _this = this;
			GHUTILS.nativeUI.showWaiting();
			GHUTILS.LOAD({
				url: GHUTILS.API.TARGET.gett0detail+"?oid="+oid,
				type: "post",
				sw: false,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if(result && result.errorCode == 0){
						if(result.isOpenRemeed == "YES"){
							_this.prot0detail(oid, result.productName, result.isPreviousCurVolume, result.previousCurVolume, result.previousCurVolumePercent);
						}else{
							mui.toast("该产品赎回申请已关闭")
							GHUTILS.nativeUI.closeWaiting();
							$("#app_redeem").removeClass("app_loading")
						}
					}else if(result.errorCode == 10002){
						GHUTILS.nativeUI.closeWaiting();
						$("#app_redeem").removeClass("app_loading")
						GHUTILS.loginOut(function(){
							GHUTILS.openLogin();
						});
					}else{
						GHUTILS.nativeUI.closeWaiting();
						var _msg = result.errorMessage
						if(_msg && _msg.indexOf("(CODE") > 0){
							_msg = _msg.substr(0, _msg.indexOf("(CODE"))
						}
						mui.toast(_msg || "数据更新中，请耐心等待")
						$("#app_redeem").removeClass("app_loading")
					}
				},
				errcallback: function(){
					GHUTILS.nativeUI.closeWaiting();
					$("#app_redeem").removeClass("app_loading")
					mui.toast("网络错误，请稍后再试")
				}
			})
		},
		//我的活期产品详情
		prot0detail: function(productOid, productName, isPreviousCurVolume, previousCurVolume, previousCurVolumePercent){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0detail +"?productOid=" + productOid,
				data: {},
				type: "post",
				sw: false,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if (GHUTILS.checkErrorCode(result)) {
						if(result.singleDayRedeemCount && result.dayRedeemCount >= result.singleDayRedeemCount){
							mui.toast("产品已达当日最高赎回限制"+result.singleDayRedeemCount+"笔!")
							$("#app_redeem").removeClass("app_loading")
							GHUTILS.nativeUI.closeWaiting();
						}else{
							GHUTILS.nativeUI.closeWaiting();
							$("#app_redeem").removeClass("app_loading")
							setTimeout(function(){
								GHUTILS.OPENPAGE({
									url:"../../html/account/account-product-t0-redeem.html",
									id:"t0redeem",
								    extras:{
										productOid: productOid,
										productName: productName,
										redeem: result.redeemableHoldVolume,
										minRredeem: result.minRredeem,
										maxRredeem: result.maxRredeem,
										additionalRredeem: result.additionalRredeem,
										proT0OrderList: 'prot0orderlist',
										dailyNetMaxRredeem: result.dailyNetMaxRredeem,
										singleDailyMaxRredeem: GHUTILS.Fsub(result.singleDailyMaxRedeem, result.dayRedeemVolume),
										netMaxRredeemDay: result.netMaxRredeemDay,
										singleDailyMaxRedeem: result.singleDailyMaxRedeem,
										isPreviousCurVolume: isPreviousCurVolume,
										previousCurVolume: previousCurVolume,
										previousCurVolumePercent: previousCurVolumePercent,
										allValue: _this.allValue
									}
								})
							}, 500)
						}
					}else{
						$("#app_redeem").removeClass("app_loading")
					}
				},
				errcallback: function(){
					GHUTILS.nativeUI.closeWaiting();
					$("#app_redeem").removeClass("app_loading")
					mui.toast("网络错误，请稍后再试")
				}
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
	GHUTILS.getUserInfo(function(){
		$(function() {
			var ac = new ACCOUNT();
			ac.init();
		});
	},true);
	
})(Zepto);
