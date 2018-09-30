/*
 Title:活期产品详情
 Author:sunli haiyang
 Date:2016-6-21 20:41:37
 Version:v1.0
*/
(function($) {

	var PRODUCTT0DETAIL = function(){
		this.productName = "";
		this.lockPeriodDays = 0;
		this.singleDailyMaxRedeem = 0;
		this.investMax = 0;
		this.investMin = 0;
		this.investAdditional = 0;
		this.productOid = GHUTILS.parseUrlParam(window.location.href).productOid;
		this.ws = GHUTILS.parseUrlParam(window.location.href);
		return this;
	}
	PRODUCTT0DETAIL.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			_this.initDom();
		},
		getData:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;
			
			//初始化页面连接
			GHUTILS.listLinks();
			
			$("#app_investRecord").on("tap", function(){
				GHUTILS.OPENPAGE({
					url: "product-t0-protocol.html",
					extras: {
						productOid: _this.productOid,
						productName: _this.productName
					}
				})
			})
			
			$("#app_introduce").on("tap", function(){
				GHUTILS.OPENPAGE({
					url: "product-t0-introduce.html",
					extras: {
						productName: _this.productName,
						lockPeriodDays: _this.lockPeriodDays,
						investMin: _this.investMin,
						interest: $("#app_sevDayYrt").html()
					}
				})
			})
			
			$("#app_information").on("tap", function(){
				GHUTILS.OPENPAGE({
					url: "product-t0-information.html",
					extras: {
						productName: _this.productName,
						investMin: _this.investMin,
						investAdditional: _this.investAdditional,
						singleDailyMaxRedeem: _this.singleDailyMaxRedeem
					}
				})
			})
		},
		initDom: function(){
			var _this = this;
			GHUTILS.nativeUI.showWaiting()
			GHUTILS.LOAD({
				url: GHUTILS.API.TARGET.gett0detail+"?oid="+_this.productOid,
				type: "post",
				sw: true,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						if(!result.investMin){
							result.investMin = 0
						}
						if(!result.investMax){
							result.investMax = 0
						}
						$('#app_title').html(result.productName);
						$("#app_t0_curDate").html(result.investTime.split(" ")[0]);
						$("#app_t0_valueDate").html(result.interestsFirstDate);
						$('#app_purchasingAmount').html(GHUTILS.formatCurrency(result.investMin));
						$(".purchaseNum").html(result.purchaseNum)
						$(".app_lockPeriodDays").html(result.lockPeriodDays+"天")
						_this.productName = result.productName;
						_this.lockPeriodDays = result.lockPeriodDays;
						_this.singleDailyMaxRedeem = result.singleDailyMaxRedeem;
						_this.investMin = result.investMin;
						_this.investAdditional = GHUTILS.Fmul(result.investAdditional, result.netUnitShare);
						
						_this.isLogin(function(){
							if(result.state == "RAISEEND"){
								$('#app_invest').html("已售罄").addClass("app_status_off");
							}else if(result.maxSaleVolume == result.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin){
								$('#app_invest').html("已售罄").addClass("app_status_off");
							}else if(result.isOpenPurchase == "NO"){
								$('#app_invest').html("不可购买").addClass("app_status_off");
							}else{
								$('#app_invest').html("立即抢购");
							}
						}, function(){
							$('#app_invest').html("登录后投资");
						});
						
						//显示七日年化收益和万元收益
						_this.showProfit(result);
						$("#app_invest").off().on("click",function(){
							GHUTILS.checkLogin(function(){
								if(!$("#app_invest").hasClass("app_status_off")){
									GHUTILS.getUserInfo(function(){
										if(GHUTILS.checkDealpwd()){
											if(GHUTILS.isLabelProduct(result.productLabels, "1", true)){
												if(!GHUTILS.isFreshman()){
													return
												}
											}
											GHUTILS.OPENPAGE({
												url:"../../html/product-t0/product-t0-order.html",
												extras:{
													productName: result.productName,
													productOid: result.oid,
													annualInterestSec: result.annualInterestSec,
													incomeCalcBasis: Number(result.incomeCalcBasis),
													purchasingAmount: result.investMin,
													increaseAmount: GHUTILS.Fmul(result.investAdditional, result.netUnitShare),
													maxSaleVolume: GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare),
													investMax: GHUTILS.Fmul(result.investMax, result.netUnitShare),
													investFiles: HOST+result.investFiles[0].furl,
													serviceFiles: HOST+result.serviceFiles[0].furl,
													interestsFirstDays: result.interestsFirstDays,
													lockPeriodDays: result.lockPeriodDays,
													maxHold: result.maxHold || 0,
													rewardInterest: result.rewardInterest,
													couponId: _this.ws.couponId || "",
													couponType: _this.ws.couponType || "",
													couponAmount: _this.ws.couponAmount || "",
													productLabels: JSON.stringify(result.productLabels)
												}
											})
										}
									}, true)
								}
							})
						});
					}
					GHUTILS.nativeUI.closeWaiting();
				}
			});
			
		},
		//七日年化收益和万元收益显示
		showProfit: function(tradeObj){
			var _this = this;
			var showTypeObj = GHUTILS.switchShowType(tradeObj);
			$('#app_sevDayYrt').html(showTypeObj.interestSec);
			$("#app_maxInterest").html(parseFloat(showTypeObj.interestSec.split('-')[showTypeObj.interestSec.split('-').length-1]) + '%')
			
			_this.getT0RewardChart(tradeObj.rewardYields, 'app_rewardRIdChart');
		},
		isLogin: function(ifTrue, failure){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.islogin,
				type: "post",
				callback: function(result){
					if(GHUTILS.checkErrorCode(result)){
						if(result.islogin){
							ifTrue()
						}else{
							failure()
						}
					}
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
				}
			})
		},
		//奖励收益柱状图信息展示处理
		getT0RewardChart: function(ProfitWeek, rid){
			var _this = this;
			if(ProfitWeek !=null){
				var xData = [];
				var yData = [];
				var compareData = [];
				for (i = 0; i < ProfitWeek.length; i++) {
					xData[i] = ProfitWeek[i].level;
					yData[i] = ProfitWeek[i].profit;
					compareData[i] = parseFloat(ProfitWeek[i].profit);
				}
				var maxY = Math.max.apply({},compareData)+0.3;
				var minY = Math.min.apply({},compareData)-1;
				setTimeout(function(){
					var myChart = echarts.init(document.getElementById(rid));
					myChart.setOption(_this.getRewardOption(xData,yData,minY.toFixed(1),maxY.toFixed(1)));
					
				},_this.time)
			}
		},
		//奖励收益柱状图信息数值
		getRewardOption: function(xdata, ydata, minY, maxY){

			var rewardChartOption =  {
				legend: {
					data: [''],
					textStyle: {
						color: '#CCC'
					}
				},
				color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					offset: 0,
					color: '#ffe190'
				}, {
					offset: 1,
					color: '#ffe190'
				}])],
				grid: {
					x: 20,
					x2: 20,
					y: 30,
					y2: 55
				},
				animation: false,
           		addDataAnimation: false,
				calculable: false,
				xAxis: [{
					type: 'category',
					boundaryGap: true,
					data: xdata,
					splitLine: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: '#adadad',
							width: 0.1
						}
					},
					axisTick: {
						show: false
					},
					axisLabel : {
			            show : true,
			            interval : 0,
			            rotate : 50,
			            textStyle : {
			                color : '#adadad'
			            }
			        }
				}],
				yAxis: [{
					type: 'value',
					min: minY||'0',
					max: maxY||'5.5',
					splitLine: {
						show: false,
						lineStyle: {
							color: '#adadad',
							width: 0.1
						}
					},
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel : {
			            show : false,
			            textStyle : {
			                color : '#adadad'
			            },
			            formatter: function (value, index) {
							var fixedValue = GHUTILS.toFixeds(value,2);
							return fixedValue;
						}
			        }
				}],
				series: [{
					type: 'bar',
					itemStyle: {
		                normal: {
		                    label : {
		                    	show: true,
		                    	position: 'top'
		                    }
		                }
		            },
					data: ydata
				}]
			};
			return rewardChartOption;
		}
	}
	$(function(){
		var t0de = new PRODUCTT0DETAIL();
			t0de.init();
	});
})(Zepto);