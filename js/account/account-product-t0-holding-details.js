/*
 Title:活期持有详情
 Author:fanyu
 Date:2016-6-4 18:31:00
 Version:v1.0
*/
mui.init();
(function($) {

	var T0HDDETAIL = function(){
		this.ws = GHUTILS.parseUrlParam(window.location.href);
		return this;
	}
	T0HDDETAIL.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
		},
		pageInit:function(){
			var _this = this;
//			_this.getData();//获取数据
			this.time = mui.os.ios ? 0 : 200 
//			document.addEventListener("loadData", function(e) {
//				_this.getT0Detail();
//				_this.getData();
//			});
			GHUTILS.getUserInfo(function(result){
				if(result.islogin){
				    _this.getData();
				}
			},true)
		},
		getData:function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0orderdetail+"?oid="+_this.ws.tradeOrderOid,
				type: "post",
				sw: true,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						$("#app_title").html(result.productName)
						if(result.incomeRatio && result.incomeRatio != "0.00"){
							$("#app_ratio").html(result.incomeRatio).parent().append('<span class="app_f24">%</span>')
							$("#app_yesterdayIncome").html(GHUTILS.formatCurrency(result.yesterdayIncome))
						}else{
							$("#app_ratio").html("待分配")
							$("#app_yesterdayIncome").html("待分配")
						}
						$("#app_totalIncome").html(GHUTILS.formatCurrency(result.totalIncome))
						$("#app_holdDays").html(result.holdDays)
						if(result.rewardNestDays){
							$("#app_rewardNestDays").parent().removeClass("app_none")
							$("#app_rewardNestDays").html(result.rewardNestDays)
						}
						
						$("#app_value").html(GHUTILS.formatCurrency(result.value))
						$("#app_orderTime").html(result.orderTime)
						if(result.rewardIncomeRatio){
							$("#app_rewardIncomeRatio").html(result.rewardIncomeRatio)
						} else {
							$("#app_rewardIncomeRatio").parent().html("暂无加息")
						}
						
					}
				}
			})
		},
		bindEvent:function(){
			var _this = this;			
		}
	}
 	$(function(){
		var t0holddetail = new T0HDDETAIL();
			t0holddetail.init();
	});
})(Zepto);