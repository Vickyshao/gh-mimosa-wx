/*
 Title:理财支付结果
 Author:fan qiao
 Date:2017-7-29 18:13:50
 Version:v1.0
*/
(function($) {
	mui.init({
		
	});
	var LCJG = function(){
		this.ws = null;
		this.pageIndex = null;
		this.moneyNum = 0;
		this.productName = "";
		this.valueDate = '';
		this.accountDate = '';
		this.couponType = '';
		this.coupon = '';
		this.counter = 1;
		this.state = false;
		
		this.pagesid = '';
		this.proTnDetail = '';
		
		this.titleTxt = '';
		this.deal = '';
		this.pageTitle = $("#app_title");
		this.conBoxJg = $(".app_con_box_jg");
		this.conBoxJg1 = $("#app_con_box1");
		this.conBoxJg2 = $("#app_con_box2");
		this.conBoxJg3 = $("#app_con_box3");
		this.conBoxJg4 = $("#app_con_box4");
		this.conBoxJg5 = $("#app_con_box5");
		this.conBoxJg6 = $("#app_con_box6");
		this.conBoxJg7 = $("#app_con_box7");
		this.conBoxJg8 = $("#app_con_box8");
		this.conBoxJg9 = $("#app_con_box9");
		this.conBoxJg10 = $("#app_con_box10");
		this.sendNum = $(".app_send_num");
		this.sendNum1 = $("#app_send_num1");
		this.sendNum2 = $("#app_send_num2");
		this.sendNum3 = $("#app_send_num3");
		this.sendNum4 = $("#app_send_num4");
		this.sendNum5 = $("#app_send_num5");
		this.sendNum8 = $("#app_send_num8");
		this.sendNum9 = $("#app_send_num9");
		this.sendNum10 = $("#app_send_num10");
		this.sendTime = $(".app_send_time");
		this.sendTime11 = $("#app_send_time1_1");
		this.sendTime12 = $("#app_send_time1_2");
		this.sendTime13 = $("#app_send_time1_3");
		this.sendTime21 = $("#app_send_time2_1");
		this.sendTime31 = $("#app_send_time3_1");
		this.sendTime41 = $("#app_send_time4_1");
		this.sendTime51 = $("#app_send_time5_1");
		this.sendTime52 = $("#app_send_time5_2");
		this.sendTime53 = $("#app_send_time5_3");
		this.sendTime82 = $("#app_send_time8_2");
		this.sendTime83 = $("#app_send_time8_3");
		this.sendTime92 = $("#app_send_time9_2");
		this.sendTime93 = $("#app_send_time9_3");
		this.sendTime101 = $("#app_send_time10_1");
		this.sendTime102 = $("#app_send_time10_2");
		this.prodname8 = $("#app_prodname8");
		this.prodname9 = $("#app_prodname9");
		this.btnTouzi = $("#app_btn_tz");
		this.btnPttz = $("#app_pttz");
		this.btnTyjtz = $("#app_tyjtz");
		this.btnTouzihq = $("#app_btn_tzhq");
		this.btnFanHuiTouzi = $("#app_btn_fhtz");
		this.btnAccount = $(".app_btn_account");
		this.btnOk = $(".app_btn_ok");
		this.btnSh = $("#app_btn_sh");
		this.btnShhq = $("#app_btn_shhq");
		
		return this;
	}
	LCJG.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//点击事件
		},		
		pageInit:function(){
			var _this = this;
			_this.pageTitle.html(_this.titleTxt);
			//投资回调失败
			if(!_this.state){
				if(_this.pageIndex == 0 || _this.pageIndex == 1){
					$("#app_dealType").html("投资")
				}else if(_this.pageIndex == 3){
					$("#app_dealType").html("充值")
				}else if(_this.pageIndex == 2){
					$("#app_dealType").html("赎回")
				}
				_this.conBoxJg7.show();
				return
			}
			
			//按钮、金额
			var conBox = [_this.conBoxJg8,_this.conBoxJg9,_this.conBoxJg10,_this.conBoxJg2,_this.conBoxJg3],
				sendNums = [_this.sendNum8,_this.sendNum9,_this.sendNum10,_this.sendNum2,_this.sendNum3],
				prodname = [_this.prodname8,_this.prodname9,_this.prodname9];
			conBox[_this.pageIndex].show();
			sendNums[_this.pageIndex].html(GHUTILS.formatCurrency(_this.moneyNum));
			if(_this.pageIndex == 0 || _this.pageIndex == 1){
				prodname[_this.pageIndex].html(_this.productName)
			}
			
			if(_this.valueDate){
				_this.sendTime82.html(_this.valueDate);
				_this.sendTime92.html(_this.valueDate);
			}
			if(_this.accountDate){
				_this.sendTime83.html(_this.accountDate);
				_this.sendTime93.html(_this.accountDate);
			}
			if(_this.pageIndex == 1){
				if(_this.couponType == "tasteCoupon"){
					$("#app_tasteProd").show();
				}else{
					$("#app_notTasteProd").show();
				}
			}
			if(_this.pageIndex == 2){
				_this.sendTime101.html(GHUTILS.currentDate());
				_this.sendTime102.html(_this.deal.split(" ")[0]);
			}
			if(_this.pageIndex == 4){
				_this.sendTime31.html(_this.deal.split(" ")[0]);
			}
		},		
		//点击事件
		bindEvent:function(){
			var _this = this;
			//继续投资  定期
			_this.btnTouzi.off().on("tap",function(){
				_this.continueInvestTn();//继续投资定期
			});
			//继续投资  活期
			_this.btnTouzihq.off().on("tap",function(){
				_this.continueInvestT0();//继续投资活期
			});
			
			//充值成功    活期列表
			_this.btnFanHuiTouzi.off().on("tap", function(){
				GHUTILS.OPENPAGE({
					url: '../../html/index/index.html'
				});
			});
			
			//提现成功    我的账户
			_this.btnOk.off().on("tap",function(){
				GHUTILS.OPENPAGE({
					url: '../../html/account/account.html',
				});
			});
			
			//返回我的账户
			_this.btnAccount.off().on("tap",function(){
				GHUTILS.OPENPAGE({
					url: '../../html/account/account.html',
				});
			});
			
			//继续赎回  活期赎回
			_this.btnSh.off().on("tap",function(){
				_this.getT0Data();
			});
			
			_this.btnShhq.off().on("tap",function(){
				_this.getT0Data();
			});
		},
		pageReset:function(){
			var _this = this;
			_this.pageTitle.html('')
			_this.sendTime.html('');
			_this.sendNum.html('');
			_this.conBoxJg.hide();
		},
		continueInvestT0:function(){
			var _this = this
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
						result.investMax = GHUTILS.Fmul(result.investMax, result.netUnitShare) || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare)
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
								couponId: "",
								couponType: "",
								couponAmount: "",
								productLabels: JSON.stringify(result.productLabels)
							}
						})
					}
				}
			});
		},
		continueInvestTn:function(){
			var _this = this
			GHUTILS.LOAD({
				url: GHUTILS.buildQueryUrl(GHUTILS.API.TARGET.getproductdetail, {
					oid: _this.productOid
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
						result.investMax = GHUTILS.Fmul(result.investMax, result.netUnitShare) || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare);
						if(result.investMax > 1000000){
							result.investMax = 1000000
						}
						var lastOrder = false
//						if(GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin){
//							lastOrder = GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare)
//						}
						GHUTILS.OPENPAGE({
							url:"../../html/product-tn/product-tn-order.html",
							extras:{
								productName: result.productName,
								productOid: result.oid,
								purchasingAmount: result.investMin,
								increaseAmount: GHUTILS.Fmul(result.investAdditional, result.netUnitShare),
								maxSaleVolume: GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare),
								investMax:result.investMax,
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
								maxHold: result.maxHold,
								interestsStartDate: result.interestsStartDate,
								interestsEndDate: result.interestsEndDate,
								annualInterest: result.annualInterestSec,
								lastOrder: lastOrder
							}
						})
					}
				}
			});
		},
		getT0Data: function() {/*活期数据*/
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0list+"?page="+ _this.counter +"&rows=10",
				async: true,
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result)) {
						console.log("getT0Data",result.allValue)
						_this.continueRedeem(GHUTILS.formatCurrency(result.allValue))
					}
				},
				errcallback: function() {					
				}
			});
		},
		continueRedeem:function(allValue){
			var _this = this
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0detail +"?productOid=" + _this.productOid,
				data: {},
				type: "post",
				async: true,
				callback: function(result) {
					console.log("continueRedeemDate",result);
					if (GHUTILS.checkErrorCode(result)) {
						GHUTILS.OPENPAGE({
							url:"../../html/account/account-product-t0-redeem.html",
						    extras:{
								orderlist: 'orderlist',
								productOid: _this.productOid,
								productName: _this.productName,
								allValue: allValue,
								redeem: result.redeemableHoldVolume,
								minRredeem: result.minRredeem,
								maxRredeem: result.maxRredeem,
								additionalRredeem: result.additionalRredeem,
								dailyNetMaxRredeem: result.dailyNetMaxRredeem,
								singleDailyMaxRredeem: GHUTILS.Fsub(result.singleDailyMaxRedeem, result.dayRedeemVolume),
								netMaxRredeemDay: result.netMaxRredeemDay,
								singleDailyMaxRedeem: result.singleDailyMaxRedeem,
//								investFiles: result.serviceFiles[0].furl,
//								serviceFiles: result.investFiles[0].furl,
								productCode: result.productCode,
								incomeCalcBasis: result.incomeCalcBasis,
								purchasingAmount: result.investMin
							}
						})
					}
				},
				errcallback: function(){
				}
			});
		}
	}
	$(function(){
		$(function(){			
			var lcjg = new LCJG();
			ws = GHUTILS.parseUrlParam(window.location.href);
			lcjg.pageIndex = ws.pageindex;			
			lcjg.moneyNum  = ws.moneynum || '';
			lcjg.productName  = decodeURIComponent(ws.productName) || '';
			lcjg.titleTxt  = decodeURIComponent(ws.titletxt) || '';
			lcjg.deal = decodeURIComponent(ws.deal) ||  '';
			lcjg.pagesid = ws.pagesid || '';
			lcjg.proTnDetail = ws.proTnDetail || '';
			lcjg.valueDate = ws.valueDate || '';
			lcjg.accountDate = ws.accountDate || '';
			lcjg.couponType = ws.couponType || '';
			lcjg.coupon = ws.coupon || '';
			lcjg.state = ws.state;
			lcjg.deal = decodeURIComponent(ws.deal) ;
			lcjg.productOid = ws.productOid;
			lcjg.productType = ws.productType;
			lcjg.type = ws.type;
			
			console.log("结果PageId：" + lcjg.pageIndex);	
			lcjg.init();	
		});
	});
})(Zepto);