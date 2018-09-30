/*
 Title:活期资金明细
 Author:cuixu 
 Date:2017-3-7 18:31:00
 Version:v1.0
*/
mui.init();
(function($) {
	var TnDEAL = function(){
//		this.ws = plus.webview.currentWebview();
		this.ws = GHUTILS.parseUrlParam(window.location.href)
		this.pageNum = [1, 1, 1];
		this.rows = 10;
		this.detailType = ["invest", "cash"];
		return this;
	}
	TnDEAL.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
//			$("#slider").css({"top": GHUTILS.setTop(44)+"px"})
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.pullRefresh();
		},
		pageInit:function(){

		},		
		getData:function(index, refresh){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0qrydetail+"?page="+_this.pageNum[index]+"&rows="+_this.rows+"&productOid="+_this.ws.productOid+"&orderType="+_this.detailType[index],
				data: {},
				type: "post",
				async: true,		
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result)) {
						var html = '';
						var list = result.rows;
						_this.pageNum[index]++;
						for (var i in list) {
							if(index==0){
								//投资记录
								list[i].operate = "+"
								html += _this.getTnDEALHtml(list[i]);
							}
							if(index==1){
								//赎回
								list[i].operate = "-"
								html += _this.getTnDEALHtml(list[i]);
							}
						}
						$('#app_type'+ _this.detailType[index] +'_ul').append(html);
						if (list.length < 10 || $.isEmptyObject(list)) {
							refresh.endPullUpToRefresh(true);
						}else{
							refresh.endPullUpToRefresh(false);
						}
						_this.closeWaiting(index);
					}
				}
			});
		},
		getIncomeData:function(index, refresh){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0qryincome+"?page="+_this.pageNum[index]+"&rows="+_this.rows+"&productOid="+_this.ws.productOid,
				data: {},
				type: "post",
				async: true,		
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result)) {
						var html = '';
						var list = '';
						if(result.details){
							list = result.details.rows;
						}
						_this.pageNum[index]++;
						for (var i in list) {
							if(index==2){
								//投资记录
								list[i].operate = "+"
								html += _this.getT0incomeHtml(list[i]);
							}
						}
						if(_this.pageNum[index]===2){
							$("#Allamount").html(GHUTILS.formatCurrency(result.totalIncome))
						}
						$('#app_typeincome_ul').append(html);
						if (list.length < 10 || $.isEmptyObject(list)) {
							refresh.endPullUpToRefresh(true);
						}else{
							refresh.endPullUpToRefresh(false);
						}
						_this.closeWaiting(index);
					}
				}
			});
		},
		closeWaiting:function(index){
			if(mui("#slider").slider().getSlideNumber() == index){
//				plus.nativeUI.closeWaiting();
			}
		},
		bindEvent:function(){
			var _this = this;
		},
		getTnDEALHtml: function(obj){
			return '<li class="mui-table-view-cell"><div><span>'+ obj.createTime + '</span><span class="mui-pull-right">'+ obj.operate + GHUTILS.formatCurrency(obj.orderAmount) +'元</span></div><div>交易状态：'+ obj.orderStatusDisp +'</div></li>';
		},
		getT0incomeHtml: function(obj){
			return '<li class="mui-table-view-cell"><div><span>'+ obj.time + '</span><span class="mui-pull-right">'+ obj.operate + GHUTILS.formatCurrency(obj.amount) +'元</span></div></li>';
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
								if(index == 0 || index == 1){
									_this.getData(index, self);
								} else if(index == 2){
									_this.getIncomeData(index, self);
								}								
							}
						}
					});
				});

			});

		}
	}
	$(function(){

		var tndeal = new TnDEAL();
			tndeal.init();
	});
})(Zepto);