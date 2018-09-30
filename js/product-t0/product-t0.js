/*
 Title:活期产品详情
 Author:sunli haiyang
 Date:2016-6-21 20:41:37
 Version:v1.0
*/
mui.init();
mui('.mui-scroll-wrapper').scroll({
	 deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	bounce: false, //是否启用回弹
	scrollX: false, //是否横向滚动
});
(function($) {

	var PRODUCTT0DETAIL = function(){
		this.productName = "";
		this.riskLevel = "";
		this.lockPeriodDays = "";
		this.files = "";
		this.profit = "";
		this.annualInterestSec = [];
		this.incomeCalcBasis = 0;
		this.investMax = 0;
		this.investMin = 0;
		this.investAdditional = 0;
		this.netUnitShare = 0;
		this.rewardInterest = 0;
		this.time = 0;
		this.investFiles = "";
		this.serviceFiles = "";
		this.param = "";
		return this;
	}
	PRODUCTT0DETAIL.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			_this.param = GHUTILS.parseUrlParam(window.location.href)
			this.time = mui.os.ios ? 0 : 200 
			
			var pad = document.body.clientWidth
			$(".mui-scroll").css({"padding-left":pad/2,"padding-right":pad/2})
			$(".mui-scroll .app-control-items .num").each(function(){
				right = $(this).width()/2
				$(this).css("right",-right)
			})
			
			_this.initDom();
			//安卓更换键盘
			if(mui.os.android){
				$("#app_investMoney").attr("type","tel")
			}
			document.addEventListener("refreshT0Data", function(e) {
				_this.initDom();
			});
		},
		getData:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;

			$("#app_projectDetail").off().on('tap', function() {
				GHUTILS.OPENPAGE({
					url: "../../html/product-t0/product-t0-protocol.html?as=item1mobile",
					extras: {
						tabindex: 1,
						productOid: _this.param.productOid,
						productName: _this.productName,
						investMin: _this.investMin,
						investAdditional: _this.investAdditional,
						netUnitShare: _this.netUnitShare,
						annualInterestSec: _this.annualInterestSec,
						incomeCalcBasis: _this.incomeCalcBasis,
						investFiles: _this.investFiles,
						serviceFiles: _this.serviceFiles
					}
				})
//				GHUTILS.nativeUI.showWaiting();
			})
			
			$("#app_profitExplanation").off().on('tap', function() {
				GHUTILS.OPENPAGE({
					url: "../../html/product-t0/product-t0-protocol.html?as=item2mobile",
					extras: {
						tabindex: 2,
						productOid: _this.param.productOid,
						productName: _this.productName,
						investMin: _this.investMin,
						investAdditional: _this.investAdditional,
						netUnitShare: _this.netUnitShare,
						annualInterestSec: _this.annualInterestSec,
						incomeCalcBasis: _this.incomeCalcBasis,
						investFiles: _this.investFiles,
						serviceFiles: _this.serviceFiles
					}
				})
//				GHUTILS.nativeUI.showWaiting();
			})
			
			$("#app_investRecord").off().on('tap', function() {
				GHUTILS.OPENPAGE({
					url: "../../html/product-t0/product-t0-protocol.html?as=item3mobile",
					extras: {
						tabindex: 3,
						productOid: _this.param.productOid,
						productName: _this.productName,
						investMin: _this.investMin,
						investAdditional: _this.investAdditional,
						netUnitShare: _this.netUnitShare,
						annualInterestSec: _this.annualInterestSec,
						incomeCalcBasis: _this.incomeCalcBasis,
						investFiles: _this.investFiles,
						serviceFiles: _this.serviceFiles
					}
				})
//				GHUTILS.nativeUI.showWaiting();
			})
			
//			$("#app_safe").on("tap", function(){
//				GHUTILS.OPENPAGE({
//					url: "../../html/index/index-shortcut/index-insurance.html",
//					id: GHUTILS.PAGESID.INSURANCE,
//				});
//			})
			
			var scroll = mui('.mui-scroll-wrapper').scroll();
			document.querySelector('.mui-scroll-wrapper' ).addEventListener('scroll', function (e ) {
				$(".count").val(-parseInt(scroll.x)*100)
				_this.setProfit(_this.annualInterestSec, $("#app_investMoney").val());
			})
			
			_this.bindInput();
		},
		bindInput: function(){
			var _this = this;
			$("#app_investMoney").off().on({
				'input': function(){
					if($(this).val() > _this.investMax){
						$(this).val(_this.investMax)
					}
					_this.setProfit(_this.annualInterestSec, $(this).val());
				},
				"focus":function(){
					$(document).on('keyup', function (e) {
						if (e.keyCode === 13) {
							$("#app_investMoney").blur();
						}
					}.bind(this))
				},
				'blur': function(){
					mui('.mui-scroll-wrapper').scroll().scrollTo(-GHUTILS.Fdiv($(this).val(), 100), 0, 0)
					$(document).off('keyup')
				}
			})
		},
		initDom: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.buildQueryUrl(GHUTILS.API.TARGET.gett0detail, {
					oid: _this.param.productOid
				}),
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
						$('#app_lockDays').html(result.lockPeriodDays);
						$('#app_purchasingAmount').html(GHUTILS.formatCurrency(result.investMin));
						_this.productName = result.productName;
						_this.lockPeriodDays = result.lockPeriodDays
						_this.riskLevel = result.riskLevel;
						_this.showlabel(result.productLabels);
						_this.incomeCalcBasis = Number(result.incomeCalcBasis);
						_this.investMax = GHUTILS.Fmul(result.investMax, result.netUnitShare) || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare);
						_this.investMin = result.investMin;
						_this.investAdditional = GHUTILS.Fmul(result.investAdditional, result.netUnitShare);
						_this.netUnitShare = result.netUnitShare;
						_this.rewardInterest = result.rewardInterest;
						_this.investFiles = HOST+result.investFiles[0].furl;
						_this.serviceFiles = HOST+result.serviceFiles[0].furl;
						if(_this.investMax > 1000000){
							_this.investMax = 1000000
						}
						$("#app_scroll").html(_this.getScrollHtml(_this.investMax))
						
						$("#app_secureLevel").html(
							function () {
								switch(result.riskLevel){
									case "R1" : return '<img src="../../images/icon_satr5.png"/>';break;
									case "R2" : return '<img src="../../images/icon_satr4.png"/>';break;
									case "R3" : return '<img src="../../images/icon_satr3.png"/>';break;
									case "R4" : return '<img src="../../images/icon_satr2.png"/>';break;
									case "R5" : return '<img src="../../images/icon_satr1.png"/>';break;
									default : return "";break;
								}
							}
						);
						
						if(GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < 10000){
							$("#app_canInvestDiv").html("剩余可投(元)");
							$("#app_canInvest").html(GHUTILS.formatCurrency(GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare)))
						}else{
							$("#app_canInvest").html(GHUTILS.formatCurrency(GHUTILS.Fdiv(GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare), 10000)))
						}
						
						if(result.state == "RAISEEND"){
							$('#app_invest').addClass("app_status_off");
//							$('#app_invest').html("募集结束");
							$('#app_invest').html("已售罄");
						}else if(result.maxSaleVolume == result.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin){
							$('#app_invest').addClass("app_status_off");
							$('#app_invest').html("已售罄");
							$("#app_canInvestDiv").html("剩余可投(元)");
							$("#app_canInvest").html("0.00");
						}else if(result.isOpenPurchase == "NO"){
							$('#app_invest').addClass("app_status_off");
							$('#app_invest').html("不可购买");
						}else{
							$('#app_invest').html("购买");
						}
						_this.files = JSON.stringify(result.files);
						//显示七日年化收益和万元收益
						_this.showProfit(result);
						//将分享按钮显示出来
						$('#share_btn').show();
						$("#app_invest").off().on("tap",function(){
							_this.isLogin(function(){
								if(!$(this).hasClass("app_status_off")){
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
													annualInterestSec: $('#app_sevDayYrt').html().split('-'),
													incomeCalcBasis: Number(result.incomeCalcBasis),
													purchasingAmount: result.investMin,
													increaseAmount: GHUTILS.Fmul(result.investAdditional, result.netUnitShare),
													maxSaleVolume: GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare),
													investMax: GHUTILS.Fmul(result.investMax, result.netUnitShare),
													investVolume: parseFloat($("#app_investMoney").val()),
													proT0Detail: 'PROT0DETAIL',
													investFiles: HOST+result.investFiles[0].furl,
													serviceFiles: HOST+result.serviceFiles[0].furl,
													productCode: result.productCode,
													interestsFirstDays: result.interestsFirstDays,
													maxHold: result.maxHold,
													companyName: result.companyName,
													singleDailyMaxRedeem: result.singleDailyMaxRedeem,
													singleDayRedeemCount: result.singleDayRedeemCount,
													rewardInterest: result.rewardInterest,
													lockPeriodDays: result.lockPeriodDays
												}
											})
											GHUTILS.nativeUI.showWaiting();
										}
									}, true)
								}
							})
						});
					}
				}
			});
		},
		//产品标签显示
		showlabel: function(labelCodes){
			var labels = "";
			for(var i in labelCodes){
				if(labelCodes[i].labelType == "extend"){
					labels = '<span class="app_detailtag app_tag_c6">'+ labelCodes[i].labelName +'</span>'
				}
			}
			$("#app_label").append(labels)
		},
		//七日年化收益和万元收益显示
		showProfit: function(tradeObj){
			var _this = this;
			var showTypeObj = GHUTILS.switchShowType(tradeObj, false);
			$('#app_sevDayYrt').html(showTypeObj.interestSec);
			$('#app_ttAmtInt').html(showTypeObj.profit + "元");
			_this.profit = showTypeObj.profit + "元"
			_this.annualInterestSec = showTypeObj.interestSec.split('-')
			
			//刻度条初始值
			_this.setVolume(_this.investMax, _this.annualInterestSec);
		},
		//预期每日收益
		setProfit: function(annualInterest, investMoney){
			var _this = this;
			if(annualInterest.length == 1){
				if(_this.rewardInterest){
					var annualInterestSec = GHUTILS.Fadd(parseFloat(annualInterest[0].replace('%','')), _this.rewardInterest)
				}else{
					var annualInterestSec = parseFloat(annualInterest[0].replace('%',''))
				}
				var profit = GHUTILS.Fmul(GHUTILS.Fsub(Math.pow(GHUTILS.Fadd(1, GHUTILS.Fdiv(annualInterestSec, 100)), GHUTILS.Fdiv(1, _this.incomeCalcBasis)), 1), investMoney);
				$('#app_profit').html(GHUTILS.formatCurrency(profit));
			}else{
				if(_this.rewardInterest){
					var annualInterestSec0 = GHUTILS.Fadd(parseFloat(annualInterest[0].replace('%','')), _this.rewardInterest)
					var annualInterestSec1 = GHUTILS.Fadd(parseFloat(annualInterest[1].replace('%','')), _this.rewardInterest)
				}else{
					var annualInterestSec0 = parseFloat(annualInterest[0].replace('%',''))
					var annualInterestSec1 = parseFloat(annualInterest[1].replace('%',''))
				}
				var profit0 = GHUTILS.Fmul(GHUTILS.Fsub(Math.pow(GHUTILS.Fadd(1, GHUTILS.Fdiv(annualInterestSec0, 100)), GHUTILS.Fdiv(1, _this.incomeCalcBasis)), 1), investMoney);
				var profit1 = GHUTILS.Fmul(GHUTILS.Fsub(Math.pow(GHUTILS.Fadd(1, GHUTILS.Fdiv(annualInterestSec1, 100)), GHUTILS.Fdiv(1, _this.incomeCalcBasis)), 1), investMoney);
				$('#app_profit').html(GHUTILS.formatCurrency(profit0)+'-'+GHUTILS.formatCurrency(profit1));
			}
		},
		getScrollHtml: function(investMax){
			var html = '';
			var st = investMax/100/50 - 1
			if(investMax > 5000){
				for(var i = 0;i < st;i++){
					html += '<div class="app-control-items"><span class="num">'+(i+2)*5000+'</span></div>'
				}
			}
			html = '<span class="f-num">0</span><div class="app-control-items mui-control-first"><span class="num">5000</span></div>' + html
			return html
		},
		//刻度条初始值
		setVolume: function(investMax, annualInterestSec){
			var _this = this;
			$("#app_investMoney").val(1000)
			_this.setProfit(annualInterestSec, 1000);
			mui('.mui-scroll-wrapper').scroll().scrollTo(-GHUTILS.Fdiv(1000, 100), 0, 0)
		},
		isLogin: function(ifTrue){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.islogin,
				type: "post",
				callback: function(result){
					if(GHUTILS.checkErrorCode(result)){
						if(result.islogin){
							ifTrue.apply(null, arguments)
						}else{
							mui.toast("请先登录")
							window.location.href = "../../html/usermgmt/usermgmt-login.html?actionUrl=../../html/product-t0/product-t0.html?productOid="+_this.param.productOid
//
//								GHUTILS.loginOut(function(){
//								var cb = {
////									cb:"showTab",
////									tabindex:1,
////									pageid:plus.webview.currentWebview().id
//								}
//								GHUTILS.openLogin(JSON.stringify(cb));
//							});
						}
					}
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
				}
			})
		}
	}
	$(function(){
		var t0de = new PRODUCTT0DETAIL();
			t0de.init();
	});
})(Zepto);