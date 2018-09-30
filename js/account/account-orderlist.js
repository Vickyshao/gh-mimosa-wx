/*
 Title:我的定期
 Author:cui xu
 Date:2017-3-2 17:23:08
 Version:v1.0
*/

mui.init();

(function($) {

	var urlParams = GHUTILS.parseUrlParam();
	if (urlParams.as) {
		$("#" + urlParams.as).addClass("mui-active");
	}

	var PR = function() {
//		this.ws = plus.webview.currentWebview().tabid;
		this.projectStates = ["hold", "apply", "closed"];
		this.pageNum = [1, 1, 1];
		return this;
	}
	PR.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
			this.pullRefresh();
		},
		pageInit: function() {
			var _this = this;
		},
		getData: function(index, refresh) {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.protnlist,
				data: {},
				type: "post",				
				async: true,
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result)) {
						$("#app-holdamt").html(GHUTILS.formatCurrency(result.tnCapitalAmount))
						$("#yes-income").html(GHUTILS.formatCurrency(result.tnYesterdayIncome))
						$("#app-historySY").html(GHUTILS.formatCurrency(result.totalIncomeAmount))
						_this.pageNum[index]++;
						var html = '';
						if (index == 0) {
							$("#holdcount").html(result.holdingTnDetails.total)
							for (var i in result.holdingTnDetails.rows) {
								html += _this.getHoldingHtml(result.holdingTnDetails.rows[i]);
							}
						} else if (index == 1) {
							$("#applycount").html(result.toConfirmTnDetails.total)
							for (var i in result.toConfirmTnDetails.rows) {
								html += _this.getApplyingHtml(result.toConfirmTnDetails.rows[i]);
							}
						} else if (index == 2) {
							$("#closedcount").html(result.closedTnDetails.total)
							for (var i in result.closedTnDetails.rows) {
								html += _this.getYJQHtml(result.closedTnDetails.rows[i]);
							}
						}
						$('#app-' + _this.projectStates[index] + '-box').append(html);
						_this.bindEvent();
//						_this.closeWaiting(index);
						refresh.endPullUpToRefresh(true);
					}

				},
				errcallback: function(result) {
//					_this.closeWaiting(index);
					refresh.endPullUpToRefresh(true);
					mui.toast("网络错误，请稍后再试")
				}

			});
		},
		getHoldingHtml: function(tradeObj) {
			var expAror = tradeObj.expAror;
			var name = tradeObj.productName;
			if(name.length > 16){
				name = name.substr(0,15)+'...'
			}
			if(tradeObj.status === 'repaying') {
				var holdingHtml = '<div class="app_myproduct_box app_pb20" data-type="hold"><div class="app_box_title"><div class="app_box_title_txt"><span class="app_title_more app_fr app_cb3 app_informaion"> 还本付息中</span><span class="app_f1x app_fn">'+ name +'</span></div></div><div class="app_box_con app_f1x"><ul class="mui-table-view mui-grid-view"><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">年化收益率</div><div class="app_mt5 app_c2">'+ tradeObj.expYearRate +'</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">收益方式</div><div class="app_mt5 app_c2">到期还本付息</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">本息总金额</div><div class="app_mt5 app_c2">'+ GHUTILS.formatCurrency(tradeObj.investAmount) +'元</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">到期日</div><div class="app_mt5 app_c2">'+ tradeObj.durationPeriodEndDate +'</div></li></ul></div></div>'
				
			} else {
				var holdingHtml = '<div class="app_myproduct_box app_pb20 app-details" data-type="hold"  data-href="'+tradeObj.productOid+'" data-name="'+tradeObj.productName+'"><div class="app_box_title"><div class="app_box_title_txt"><span class="app_title_more app_fr app_cb3 app_informaion"> ></span><span class="app_fn app_f1x">'+ name +'</span></div></div><div class="app_box_con app_f1x"><ul class="mui-table-view mui-grid-view"><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">预期年化收益率</div><div class="app_mt5 app_c2">'+ tradeObj.expYearRate +'</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">收益方式</div><div class="app_mt5 app_c2">到期还本付息</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">投资金额</div><div class="app_mt5 app_c2">'+ GHUTILS.formatCurrency(tradeObj.investAmount) +'元</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">到期日</div><div class="app_mt5 app_c2">'+ tradeObj.durationPeriodEndDate +'</div></li></ul></div></div>'
			}

			return holdingHtml;
		},
		getApplyingHtml: function(tradeObj) {
			var name = tradeObj.productName;
			if(name.length > 20){
				name = name.substr(0,19)+'...'
			}
			if(tradeObj.status === 'refunding') {
				var applyingHtml = '<div class="app_myproduct_box app_pb20"><div class="app_box_title"><div class="app_box_title_txt"><span class="app_title_more app_fr app_c8 app_cdetail app_informaion">退款中</span><span class="app_fn app_f1x">' + name + '</span></div></div><div class="app_box_con app_f1x app_pb10"><ul class="mui-table-view mui-grid-view"><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8">本息退额(元)</div><div class="app_mt5 app_c2">' + GHUTILS.formatCurrency(tradeObj.refundAmount) + '</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8">预计到账日期</div><div class="app_mt5 app_c2">' + tradeObj.setupDate + '</div></li></ul></div></div>';
			
			} else {
				var applyingHtml = '<div class="app_myproduct_box app_pb20"><div class="app_box_title"><div class="app_box_title_txt"><span class="app_fn app_f1x">' + name + '</span></div></div><div class="app_box_con app_f1x app_pb10"><ul class="mui-table-view mui-grid-view"><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8">已确认金额(元)</div><div class="app_mt5 app_c2">' + GHUTILS.formatCurrency(tradeObj.acceptedAmount || 0) + '</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8">已受理金额(元)</div><div class="app_mt5 app_c2">' + GHUTILS.formatCurrency(tradeObj.toConfirmInvestAmount) + '</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8">产品预计成立日</div><div class="app_mt5 app_c2">'+ tradeObj.setupDate +'</div></li></ul></div></div>';

				


			}
			return applyingHtml;
		},
		getYJQHtml: function(tradeObj) {
			var name = tradeObj.productName;
			if(name.length > 16){
				name = name.substr(0,15)+'...'
			}
			if (tradeObj.status === 'closed') {
				var yjqHtml = '<div class="app_myproduct_box app_pb20 app-details-yjq" data-type="closed" data-href="'+tradeObj.productOid+'" data-name="'+tradeObj.productName+'"><div class="app_box_title"><div class="app_box_title_txt"><span class="app_f1x">'+ name +'</span></div></div><div class="app_box_con app_f1x app_pb10"><ul class="mui-table-view mui-grid-view"><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">产品成立日</div><div class="app_mt5 app_c2">'+ tradeObj.setupDate +'</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">本息金额</div><div class="app_mt5 app_c2">'+ GHUTILS.formatCurrency(tradeObj.orderAmount) +'元</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">还本付息日</div><div class="app_mt5 app_c2">'+ tradeObj.repayDate +'</div></li></ul></div></div>'
				
			} else if (tradeObj.status === 'refunded'){
				var yjqHtml = '<div class="app_myproduct_box app_pb20"><div class="app_box_title"><div class="app_box_title_txt"><span class="app_fn app_f1x">'+ name +'</span></div></div><div class="app_box_con app_f1x app_pb10"><ul class="mui-table-view mui-grid-view"><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">本息金额</div><div class="app_mt5 app_c2">'+ GHUTILS.formatCurrency(tradeObj.orderAmount) +'元</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_c8 ">退款日</div><div class="app_mt5 app_c2">'+ tradeObj.raiseFailDate +'</div></li></ul></div></div>'
			
			} else if (tradeObj.status === 'refunding'){
//				var yjqHtml = '<div class="app_product_ihbox app_p0"><div class="app_box_title"><div class="app_box_title_txt"><span class="app_f1x">'+ name +'</span></div></div><div class="app_box_con app_f1x"><ul class="mui-table-view mui-grid-view"><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_f16 ">退还本金</div><div class="app_mt5 app_cdetail">'+ GHUTILS.formatCurrency(tradeObj.investAmt) +'元</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_f16 ">退还募集收益</div><div class="app_mt5 app_cdetail">'+ GHUTILS.formatCurrency(tradeObj.totalIncome) +'元</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left"><div class="app_f16 ">预期退还日期</div><div class="app_mt5 app_cdetail">'+ tradeObj.toRefundDate +'</div></li></ul></div></div>'
			}
			return yjqHtml;
		},
		bindEvent: function() {
			var _this = this;
			$(".app-details").off().on("tap", function() {
				var ids = $(this).attr("data-href");
				var producttype = $(this).attr("data-type");
				var name = $(this).attr("data-name");
				GHUTILS.OPENPAGE({
					url: "../../html/account/account-product-tn-detail.html",
					extras: {
						"productOid": ids,
						"producttype": producttype,
						"productname": name
					}
				})
				GHUTILS.nativeUI.showWaiting();
			})
			$(".app-details-yjq").off().on("tap", function() {
				return;
				var ids = $(this).attr("data-href");
				var producttype = $(this).attr("data-type");
				var name = $(this).attr("data-name");
				GHUTILS.OPENPAGE({
					url: "account-product-tn-detail.html",
					extras: {
						"productOid": ids,
						"producttype": producttype,
						"productname": name
					}
				})
				GHUTILS.nativeUI.showWaiting();//显示警告框
			})
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
								_this.getData(index, self);
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
})(Zepto);
