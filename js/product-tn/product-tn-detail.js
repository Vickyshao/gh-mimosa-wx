/*
 Title:定期产品详情
 Author:sunli haiyang
 Date:2016-6-20 19:00:36
 Version:v1.0
*/
(function($) {

	var PRODUCTTNDETAIL = function(){
		
		this.productName = "";
		this.riskLevel = "";
		this.durationPeriod = "";
		this.files = "";
		this.annualInterestSec = [];
		this.incomeCalcBasis = 0;
		this.investMax = 0;
		this.investMin = 0;
		this.investAdditional = 0;
		this.netUnitShare = 0;
		this.rewardInterest = 0;
		this.investFiles = "";
		this.serviceFiles = "";
		this.ws = GHUTILS.parseUrlParam(window.location.href);
		return this;
	}
	PRODUCTTNDETAIL.prototype = {
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
			
			$("#app_projectDetail").off().on('tap', function() {
				GHUTILS.OPENPAGE({
					url: "../../html/product-tn/product-tn-protocol.html",
					extras: {
						as:'item1mobile',
						tabindex: 1,
						productOid: _this.ws.productOid,
						productName: _this.productName,
						investMin: _this.investMin,
						investAdditional: _this.investAdditional,
						netUnitShare: _this.netUnitShare,
//						riskLevel: _this.riskLevel,
//						files: _this.files,
						durationPeriod: _this.durationPeriod,
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
					url: "../../html/product-tn/product-tn-protocol.html",
					extras: {
						as:'item2mobile',
						tabindex: 2,
						productOid: _this.ws.productOid,
						productName: _this.productName,
						investMin: _this.investMin,
						investAdditional: _this.investAdditional,
						netUnitShare: _this.netUnitShare,
//						riskLevel: _this.riskLevel,
//						files: _this.files,
						durationPeriod: _this.durationPeriod,
						annualInterestSec: _this.annualInterestSec,
						incomeCalcBasis: _this.incomeCalcBasis,
						investFiles: _this.investFiles,
						serviceFiles: _this.serviceFiles
					}
				})
//				GHUTILS.nativeUI.showWaiting();
			})
			
			$("#app_traderecord").off().on('tap', function() {
				GHUTILS.OPENPAGE({
					url: "../../html/product-tn/product-tn-protocol.html",
					extras: {
						as:'item3mobile',
						tabindex: 3,
						productOid: _this.ws.productOid,
						productName: _this.productName,
						investMin: _this.investMin,
						investAdditional: _this.investAdditional,
						netUnitShare: _this.netUnitShare,
//						riskLevel: _this.riskLevel,
//						files: _this.files,
						durationPeriod: _this.durationPeriod,
						annualInterestSec: _this.annualInterestSec,
						incomeCalcBasis: _this.incomeCalcBasis,
						investFiles: _this.investFiles,
						serviceFiles: _this.serviceFiles
					}
				})
//				GHUTILS.nativeUI.showWaiting();
			})
			
		},
		initDom: function(){
			var _this = this;
			GHUTILS.nativeUI.showWaiting()
			GHUTILS.LOAD({
				url: GHUTILS.buildQueryUrl(GHUTILS.API.TARGET.getproductdetail, {
					oid: _this.ws.productOid
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
						$('#app_annualInterest').html(function(){
							var annualInterestSec = result.annualInterestSec.replace(/\%/g,'').split('-'), interest = "";
							var annualInterestMin, annualInterestMax;
							if(annualInterestSec.length > 1){
								annualInterestMin = annualInterestSec[0]
								annualInterestMax = annualInterestSec[1]
								
//								if(result.rewardInterest){
//									annualInterestMin = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestMin, result.rewardInterest), 2)
//									annualInterestMax = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestMax, result.rewardInterest), 2)
//								}
								
								interest = annualInterestMin + '-' + annualInterestMax
							}else{
								interest = annualInterestSec[0]
								
//								if(result.rewardInterest){
//									interest = GHUTILS.toFixeds(GHUTILS.Fadd(interest, result.rewardInterest), 2)
//								}
							}
							if(result.rewardInterest){
								interest += '%+' + GHUTILS.toFixeds(result.rewardInterest, 2)
							}
							return interest
						});
						
						//募集进度条，剩余可投
						if(result.maxSaleVolume == result.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin){
//							$("#app_raisedAmount").html(result.raisedTotalNumber);
							$("#app_unit").html("元")
							$("#app_canInvestMoney").html("0.00");
//							document.getElementById("app_progressBar").style.width = "100%";
						}else{
//							var collectPercent = GHUTILS.toFixeds(GHUTILS.Fmul(GHUTILS.Fdiv(GHUTILS.Fadd(result.collectedVolume, GHUTILS.Fmul(result.lockCollectedVolume, result.netUnitShare)), result.raisedTotalNumber), 100),2,'%')
//							$("#app_raisedAmount").html(GHUTILS.formatCurrency(GHUTILS.Fadd(result.collectedVolume, GHUTILS.Fmul(result.lockCollectedVolume, result.netUnitShare))));
							var canInvestMoney = GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare)
							if(canInvestMoney < 10000){
								$("#app_unit").html("元")
								$("#app_canInvestMoney").html(GHUTILS.formatCurrency(canInvestMoney))
							}else{
								$("#app_unit").html("万元")
								$("#app_canInvestMoney").html(GHUTILS.formatCurrency(GHUTILS.Fdiv(canInvestMoney, 10000)))
							}
//							document.getElementById("app_progressBar").style.width = collectPercent;
						}
						
						$("#app_durationPeriod").html(result.durationPeriod);
						$('#app_purchasingAmount').html(GHUTILS.formatCurrency(result.investMin)+"元");
						if(result.state != "RAISING" || result.maxSaleVolume == result.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin){
							$('#app_invest').addClass("app_status_off").html("已售罄");
						}else if(result.isOpenPurchase == "NO"){
							$('#app_invest').addClass("app_status_off").html("不可购买");
						}else{
							$('#app_invest').html("转入");
						}
						$("#app_investDate").html(result.investTime.split(" ")[0]);
						$("#app_tn_curDate").html(result.setupDate);
						$("#app_tn_valueDate").html(result.repayDate);
						_this.productName = result.productName;
						_this.durationPeriod = result.durationPeriod
						_this.riskLevel = result.riskLevel;
						_this.annualInterestSec = result.annualInterestSec.split('-');
						_this.incomeCalcBasis = Number(result.incomeCalcBasis);
						_this.netUnitShare = result.netUnitShare;
						_this.investMin = result.investMin;
						_this.investAdditional = GHUTILS.Fmul(result.investAdditional, result.netUnitShare);
						_this.investMax = GHUTILS.Fmul(result.investMax, result.netUnitShare) || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare);
						_this.rewardInterest = result.rewardInterest
						_this.investFiles = HOST+result.investFiles[0].furl
						_this.serviceFiles = HOST+result.serviceFiles[0].furl
						if(_this.investMax > 1000000){
							_this.investMax = 1000000
						}
						
						_this.showlabel(result.productLabels);
						
						$("#app_invest").off().on("tap",function(){
							GHUTILS.checkLogin(function(){
								console.log("result = "+JSON.stringify(result))
								if(!$("#app_invest").hasClass("app_status_off")){
									GHUTILS.getUserInfo(function(){
										if(GHUTILS.checkDealpwd()){
											if(GHUTILS.isLabelProduct(result.productLabels, '1', true)){
												if(!GHUTILS.isFreshman()){
													return
												}
											}
											var lastOrder = false
//											if(GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin){
//												lastOrder = GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare)
//											}
											GHUTILS.OPENPAGE({
												url:"../../html/product-tn/product-tn-order.html",
												extras:{
													productName: result.productName,
													productOid: result.oid,
													purchasingAmount: result.investMin,
													increaseAmount: GHUTILS.Fmul(result.investAdditional, result.netUnitShare),
													maxSaleVolume: GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare),
//													investMax: GHUTILS.Fmul(result.investMax, result.netUnitShare),
													investMax: GHUTILS.Fmul(result.investMax, result.netUnitShare) || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare),
													annualInterestSec: result.annualInterestSec,
													durationPeriod: result.durationPeriod,
													incomeCalcBasis: Number(result.incomeCalcBasis),
													investVolume: parseFloat($("#app_investMoney").val()),
													proTnDetail: 'PROTNDETAIL',
													investFiles: result.investFiles[0].furl,
													serviceFiles: result.serviceFiles[0].furl,
													files: JSON.stringify(result.files),
													productCode: result.productCode,
													rewardInterest: result.rewardInterest,
													interestsStartDate: result.interestsStartDate,
													interestsEndDate: result.interestsEndDate,
													annualInterest: $("#app_annualInterest").html()+"%",
													maxHold: result.maxHold,
													lastOrder: lastOrder
												}
											})
//											GHUTILS.nativeUI.showWaiting();
										}
									}, true)
								}
							})
						});
						GHUTILS.nativeUI.closeWaiting()
					}
				}
			});
		},
		getFileBacksHtml: function(url,name){
			if(name.indexOf('.html') != -1 && name.length - name.lastIndexOf('.html') == 5){
				name = name.substr(0,name.lastIndexOf('.html'))
			}
			return '<li class="mui-table-view-cell app_fileBacks"><a class="mui-navigate-right app_link_pages" data-links="'+url+'" data-title="'+name+'">'+name+'</a></li>'
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
		//预期收益
//		setProfit: function(annualInterest, investMoney, investPeriod){
//			var _this = this;
//			if(annualInterest.length == 1){
//				if(_this.rewardInterest){
//					var annualInterestSec = GHUTILS.Fadd(parseFloat(annualInterest[0].replace('%','')), _this.rewardInterest)
//				}else{
//					var annualInterestSec = parseFloat(annualInterest[0].replace('%',''))
//				}
//				var profit = GHUTILS.Fdiv(GHUTILS.Fdiv(GHUTILS.Fmul(GHUTILS.Fmul(investMoney, annualInterestSec), investPeriod), _this.incomeCalcBasis), 100);
//				$('#app_profit').html(GHUTILS.formatCurrency(profit));
//			}else{
//				if(_this.rewardInterest){
//					var annualInterestSec0 = GHUTILS.Fadd(parseFloat(annualInterest[0].replace('%','')), _this.rewardInterest)
//					var annualInterestSec1 = GHUTILS.Fadd(parseFloat(annualInterest[1].replace('%','')), _this.rewardInterest)
//				}else{
//					var annualInterestSec0 = parseFloat(annualInterest[0].replace('%',''))
//					var annualInterestSec1 = parseFloat(annualInterest[1].replace('%',''))
//				}
//				var profit0 = GHUTILS.Fdiv(GHUTILS.Fdiv(GHUTILS.Fmul(GHUTILS.Fmul(investMoney, annualInterestSec0), investPeriod), _this.incomeCalcBasis), 100);
//				var profit1 = GHUTILS.Fdiv(GHUTILS.Fdiv(GHUTILS.Fmul(GHUTILS.Fmul(investMoney, annualInterestSec1), investPeriod), _this.incomeCalcBasis), 100);
//				$('#app_profit').html(GHUTILS.formatCurrency(profit0)+'-'+GHUTILS.formatCurrency(profit1));
//			}
//		},
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
							GHUTILS.loginOut(function(){
								var cb = {
//									cb:"showTab",
//									tabindex:1,
//									pageid:plus.webview.currentWebview().id
								}
								GHUTILS.openLogin(JSON.stringify(cb));
							});
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
		var tnde = new PRODUCTTNDETAIL();
			tnde.init();
	});
})(Zepto);