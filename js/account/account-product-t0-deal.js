/*
 Title:活期资金明细
 Author:cuixu
 Date:2017-3-6 13:31:00
 Version:v1.0
*/
mui.init();
(function($) {
	var T0DEAL = function(){
		this.pageNum = [1, 1, 1];
		this.rows = 10;
		this.Obj = GHUTILS.parseUrlParam(window.location.href);
		this.productOid = this.Obj.productOid;
		this.detailType = [["invest","expGoldinvest"], ["normalRedeem","clearRedeem","expGoldRedeem"]];
		return this;
	}
	T0DEAL.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.pullRefresh();
		},
		pageInit:function(){
			
		},
		getData:function(index, refresh){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.buildQueryUrl(GHUTILS.API.CHA.prot0qrydetail, {
					page: _this.pageNum[index],
					rows: _this.rows,
					orderType: _this.detailType[index],
					productOid: _this.productOid
				}),
//				url: GHUTILS.API.CHA.prot0qrydetail+"?page="+_this.pageNum[index]+"&rows="+_this.rows+"&productOid="+_this.ws.productOid+"&orderType="+_this.detailType[index],
				data: {},
				type: "post",
				async: true,		
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result)) {
						var html = '';
						var list = result.rows;
						_this.pageNum[index]++;
//						for (var i in list) {
							if(index==0){
								//投资记录
								for (var i in list) {
									list[i].operate = "+"
									html += _this.getT0DealHtml(list[i]);
								}
								
								$('#app_typeinvest_ul').append(html);
							}else if(index==1){
								//赎回
								for(var i in list){
									list[i].operate = "-"
									html += _this.getT0DealHtml(list[i]);
								}
								$('#app_typeredeem_ul').append(html);
							}
//						}
						
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
				url: GHUTILS.API.CHA.prot0qryincome+"?page="+_this.pageNum[index]+"&rows="+_this.rows+"&productOid="+_this.productOid,
				data: {},
				type: "post",
				async: true,		
				callback: function(result) {
					console.log(JSON.stringify(result))
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
				
			}
		},
		bindEvent:function(){
			var _this = this;
		},
		getT0DealHtml: function(obj){
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
		var t0deal = new T0DEAL();
			t0deal.init();
	});
})(Zepto);