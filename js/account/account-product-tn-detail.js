/*
 Title:我的定期
 Author:cuixu
 Date:2017-3-6 15:31:00
 Version:v1.0
*/

mui.init();

(function($) {
	var PNDETAIL = function() {
//		this.ws = plus.webview.currentWebview();
		this.ws = GHUTILS.parseUrlParam(window.location.href)
		return this;
	}
	PNDETAIL.prototype = {
		init: function() {
//			GHUTILS.setUserAgent();
			this.pageInit(); //页面初始化
			this.bindEvent();
			this.getData();
		},
		pageInit: function() {
			var _this = this;
		},
		getData: function() {//获取持有中产品详情
			var _this = this;
			GHUTILS.nativeUI.showWaiting()
			if(this.ws.producttype=="hold"){
				GHUTILS.LOAD({
					url: GHUTILS.API.CHA.proholdtndetail+"?productOid="+_this.ws.productOid,
					data: {},
					type: "post",				
					async: true,
					callback: function(result) {
						console.log(JSON.stringify(result))
						if (GHUTILS.checkErrorCode(result)) {
							var html = '';
							
//							html += _this.getdetailHtml(result);
//							$(".app_detail").html(html)
							$("#investAmt").html(GHUTILS.formatCurrency(result.investVolume))
	       					$("#expectIncome").html(GHUTILS.formatCurrency(result.expectIncome))
	       					$("#expAror").html(result.expAror)
	       					$("#payAmount").html(GHUTILS.formatCurrency(result.payAmount))
	       					$("#repayDate").html(result.durationPeriodEndDate)
	       					$("#setupDate").html(result.setupDate)
//	       					$("#latestOrderTime").html(result.latestOrderTime)
						}
//						plus.nativeUI.closeWaiting();
						GHUTILS.nativeUI.closeWaiting()
					},
					errcallback: function(result) {
//						plus.nativeUI.closeWaiting();
					}
	
				});
			} else if(this.ws.producttype=="closed"){
				GHUTILS.LOAD({
					url: GHUTILS.API.CHA.proclosetndetail+"?proOid="+_this.ws.productOid,
					data: {},
					type: "post",				
					async: true,
					callback: function(result) {
						if (GHUTILS.checkErrorCode(result)) {
							var html = '';
							html += _this.getdetailHtml(result);
							$(".app_detail").html(html)
						}
						GHUTILS.nativeUI.closeWaiting()
//						plus.nativeUI.closeWaiting();
					},
					errcallback: function(result) {
//						plus.nativeUI.closeWaiting();
					}
	
				});
			}
			
		},
		getdetailHtml: function(tradeObj) {
			if(this.ws.producttype == "hold"){
				var detail = '<li class="mui-table-view-cell"><span class="mui-pull-left">投资金额</span><span class="mui-pull-right">'+ GHUTILS.formatCurrency(tradeObj.investAmt) +'元</span></li><li class="mui-table-view-cell"><span class="mui-pull-left">预期收益率</span><span class="mui-pull-right">'+ tradeObj.expAror +'%</span></li><li class="mui-table-view-cell"><span class="mui-pull-left">预期收益</span><span class="mui-pull-right">'+ GHUTILS.formatCurrency(tradeObj.expectIncome) +'元</span></li><li class="mui-table-view-cell"><span class="mui-pull-left">还本付息日期</span><span class="mui-pull-right">'+ tradeObj.repayDate +'</span></li>'
			} else if(this.ws.producttype == "closed"){
				var detail = '<li class="mui-table-view-cell"><span class="mui-pull-left">计息日</span><span class="mui-pull-right">'+ tradeObj.sdate +'至'+ tradeObj.edate +'</span></li><li class="mui-table-view-cell"><span class="mui-pull-left">总期限</span><span class="mui-pull-right">'+ tradeObj.dayNum +'天</span></li><li class="mui-table-view-cell"><span class="mui-pull-left">投资金额</span><span class="mui-pull-right">'+ GHUTILS.formatCurrency(tradeObj.investAmt) +'元</span></li><li class="mui-table-view-cell"><span class="mui-pull-left">累计收益</span><span class="mui-pull-right">'+ GHUTILS.formatCurrency(tradeObj.totalIncome) +'元</span></li>'
			}
			return detail;
		},
		bindEvent: function() {
			var _this = this;			
			$(".mui-title").html(decodeURIComponent(_this.ws.productname))
			$('#trade-record').off().on('tap',function(e){
				GHUTILS.OPENPAGE({
					url:"../../html/account/account-product-tn-deal.html",
					extras:{
						productOid: _this.ws.productOid
					}
				})
				GHUTILS.nativeUI.showWaiting();
			});
			
			$("#app_prodetail").off().on('tap',function(e){
				GHUTILS.OPENPAGE({
					url:"../../html/product-tn/product-tn-detail.html",
					extras:{
						productOid: _this.ws.productOid
					}
				})
				GHUTILS.nativeUI.showWaiting();
			});
		}			
	}
	$(function() {
		var pndetail = new PNDETAIL();
		pndetail.init();
	});
})(Zepto);