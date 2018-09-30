/*
 Title:资产详情
 Author:cui xu
 Date:2017-3-2 11:08:06
 Version:v1.0
*/
mui.init();
(function($) {
	var urlParams=GHUTILS.parseUrlParam();
	if (urlParams.as) {
		$("#"+urlParams.as).addClass("mui-active");
	}
	
	var ACCOUNT_DETAILS = function(){
		this.month = '';
		this.day = '';
		this.incomeDateArr = [];
		this.incomes = {};
		this.onlyOne = 0;
		this.account = {};
		return this;
	}
	ACCOUNT_DETAILS.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.checkLogin();//判断用户登录之后获取数据
		},
		pageInit:function(){
			var _this = this;
			//阻尼系数 判断ios版本
//			var deceleration = mui.os.ios?0.003:0.0009;
//			mui('.mui-scroll-wrapper').scroll({
//				bounce: false,
//				indicators: true, //是否显示滚动条
//				deceleration:deceleration
//			});
		},
		checkLogin:function(){
			var that = this;
			GHUTILS.getUserInfo(function(){
				that.getData(true);
			},true);
		},
		getData:function(ifLogin){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.accountdetail,
				type: "post",
				async: true,
				callback: function(result) {		
					console.log(JSON.stringify(result))
					if (GHUTILS.checkErrorCode(result)) {
						
						var t0detail = ''
						if(result.t0CapitalDetails) {
							for(var i in result.t0CapitalDetails) {
								t0detail += '<div><span class="mui-pull-right app_f1x">'+ GHUTILS.formatCurrency(result.t0CapitalDetails[i].amount) +'</span><span class="app_ml25">'+ result.t0CapitalDetails[i].productName +'</span></div>'
							}
						}
						$(".app_amtt0detail").html(t0detail)
						
						var tndetail = ''
						if(result.tnCapitalDetails) {
							for(var i in result.tnCapitalDetails) {
								tndetail += '<div><span class="mui-pull-right app_f1x">'+ GHUTILS.formatCurrency(result.tnCapitalDetails[i].amount) +'</span><span class="app_ml25">'+ result.tnCapitalDetails[i].productName +'</span></div>'
							}
						}
						$(".app_amttndetail").html(tndetail)
						
						var applydetail = ''
						if(result.applyCapitalDetails) {
							for(var i in result.applyCapitalDetails) {
								applydetail += '<div><span class="mui-pull-right app_f1x">'+ GHUTILS.formatCurrency(result.applyCapitalDetails[i].amount) +'</span><span class="app_ml25">'+ result.applyCapitalDetails[i].productName +'</span></div>'
							}
						}
						$(".app_amtapplydetail").html(applydetail)
						
						$("#app_totalSal").html(GHUTILS.formatCurrency(result.capitalAmount));
						_this.account = {'balance':result.applyAvailableBalance,'onWayBalance':result.withdrawFrozenBalance,'exp':result.experienceCouponAmount,"applyAmt":result.applyAmt,"t0Amt":result.t0CapitalAmount,"tnAmt":result.tnCapitalAmount};
						$('#app_apply').html(GHUTILS.formatCurrency(_this.account.applyAmt));
						$('#app_hqTotalAmt').html(GHUTILS.formatCurrency(_this.account.t0Amt));
						$('#app_balance').html(GHUTILS.formatCurrency(_this.account.balance));
						$('#app_onWayBalance').html(GHUTILS.formatCurrency(_this.account.onWayBalance));
						$('#app_dsTotalAmount').html(GHUTILS.formatCurrency(_this.account.tnAmt));
						_this.drawChart();
					}
				}
			})
		},
		bindEvent:function(){ var _this = this;},
		drawChart:function(){
			var _this = this;					
		    var option = {
			    series : [
			        {
			            name: '访问来源',
			            type: 'pie',
			            hoverAnimation :false,
			            label:{
			              normal:false,
			              textStyle:{}
			            },
			            animation:false,
			            center:['50%','50%'],
			            radius:['75%','100%'],
			            data:[
			                {value:_this.account.t0Amt, name:'活期资产'},
			                {value:_this.account.tnAmt, name:'定期资产'},
			                {value:_this.account.applyAmt, name:'申请中资产'},
			                {value:_this.account.balance, name:'可用余额'},
			                {value:_this.account.onWayBalance, name:'冻结金额'},
			            ]
			        }
			    ],
			    color:['#6bc9fe', '#008fe4', '#0064c9','#1f92b7','#1C4871']
			};
		
		var pieChart = echarts.init(document.getElementById("app_pie_chart"));
			setTimeout(function(){
				pieChart.setOption(option);
			},20)
		}
	}
	$(function(){
		var ac = new ACCOUNT_DETAILS();
			ac.init();
	});
})(Zepto);
