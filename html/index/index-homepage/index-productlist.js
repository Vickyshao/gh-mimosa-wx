/*
 Title:porductlist
 Author:yang sen
 Date:2016-8-13 12:57:45
 Version:v1.0
*/
define(function(){
    var PORDUCTLIST = (function(){
 		var API = "";
		var dqhqObj = [$("#app-recommend-huoqi"), $("#app-recommend-dingqi"), $("#app-recommend")];
		
 		return{

 			//初始化
			init:function(data){
				//this.getData();
//				this.recommendT0(data.t0);
//				this.recommendTn(data.tn);
				this.recommend(data)
				this.pageInit();
				this.dataObj = data;
			},
			pageInit:function(){
				var _this = this;
				
				//绑定事件
				if(_this.bind){
					_this.bindEvent();
				}
			},
			recommendT0:function(data){
				var _this = this;
				var prodList = data;
				var productHtml = '';
				if (!$.isEmptyObject(prodList)) {
					for (var i in prodList) {
						productHtml += _this.getProduct0Html(prodList[i],i);
						//获取产品OID
						localStorage.setItem("productInfo", JSON.stringify({
							productOid: prodList[i].oid,
							productName: prodList[i].productName
						}));
					}
				} 
				dqhqObj[0].html(productHtml);
			},
			recommendTn:function(data){
				var _this = this;
				var prodList = data;
				var productHtml = '';
				if (!$.isEmptyObject(prodList)) {
					for (var i in prodList) {
						//if (prodList[i].prodId == "3") {
							//if (prodList[i].newFlag != "1" && prodList[i].seckillFlag != "1") {
								productHtml += _this.getProductHtml(prodList[i],i);
							//	break;
							//}
						//}
					}
				} else {
					dqhqObj[0].removeClass("app_bline");
				}
				dqhqObj[1].html(productHtml);
			},
			recommend:function(data){
				var _this = this;
				var prodList = data;
				var productHtml = '';
				if (!$.isEmptyObject(prodList)) {
					for (var i in prodList) {
						if(prodList[i].type == "PRODUCTTYPE_02"){
							productHtml += _this.getProduct0Html(prodList[i],i);
						}else{
//							productHtml += _this.getProductHtml(prodList[i],i);
						}
					}
				} 
				dqhqObj[2].html(productHtml);
			},
			//活期产品
			getProduct0Html: function(tradeObj,index) {
				var _this = this, type = '', soldOut = '', buttonHtml = '立即投资';
				if(!tradeObj.investMin){
					tradeObj.investMin = 0
				}
				if(tradeObj.maxSaleVolume == tradeObj.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(tradeObj.maxSaleVolume, tradeObj.lockCollectedVolume), 1) < tradeObj.investMin){
					soldOut = " sold_out";
					buttonHtml = '已售罄'
				}
				type = _this.showGeneralLabel(tradeObj)
				var product0Html = '<div class="app_in_product_box app-recommend-huoqi' +
									soldOut + '" data-href="' +
									tradeObj.productOid + '">'+ type +'<div class="app_in_product_title"><span class="app_pr">' + 
									tradeObj.name + _this.showExtendLabel(tradeObj) + '<span class="app_in_product_tips">灵活理财，躺着赚钱</span></span></div><div class="app_mt20"><div class="app_cmain app_in_product_block">每满30天+0.5%</div><div class="app_pt25 text-align-center"><div class="app_cmain "><span class="app_f40">'+
									_this.switchShowType(tradeObj).interestSec + '<span class="app_f18">%</span></span></div><div class="app_f14 app_mt10 app_bb">昨日最高年化收益</div></div><div class="mui-col-xs-6 app_f14 app_mt10 app_mb10 app_fl text-align-center app_ca6"><span class="app_c6"><span class="app_icon app_icon_jsdz"></span>极速到账</span></div><div class="mui-col-xs-6 app_fl app_f14 app_mt10 app_mb10 text-align-center app_ca6"><span class="app_c6"><span class="app_icon app_icon_syyz"></span>收益月增</span></div><div class="app_mt25 app_ml20 app_mr20 app_mb15"><button type="button" class="mui-btn mui-btn-primary mui-btn-block">'+buttonHtml+'</button></div></div></div>';
				return product0Html;
			},
			//定期产品
			getProductHtml: function(tradeObj,index) {
				var _this = this;
				var prodctHtml = "";
				
//				var collectPercent = GHUTILS.toFixeds(GHUTILS.Fmul(GHUTILS.Fdiv(GHUTILS.Fadd(tradeObj.collectedVolume, GHUTILS.Fmul(tradeObj.lockCollectedVolume, 1)), tradeObj.raisedTotalNumber), 100),2);
				var type = '', soldOut = '', buttonHtml = '立即投资', detailtype = ' app-recommend-dingqi';
				if(!tradeObj.investMin){
					tradeObj.investMin = 0
				}
				if(tradeObj.state != "RAISING"){
					soldOut = " sold_out";
					detailtype = " app_soldoutdetail";
					buttonHtml = "已售罄"
//					buttonHtml = "募集结束"
//					type += '<span class="app_tag_icon">募集结束</span>'
				}else if(tradeObj.raisedTotalNumber == GHUTILS.Fadd(tradeObj.collectedVolume, GHUTILS.Fmul(tradeObj.lockCollectedVolume, 1)) || GHUTILS.Fsub(GHUTILS.Fsub(tradeObj.raisedTotalNumber, tradeObj.collectedVolume), GHUTILS.Fmul(tradeObj.lockCollectedVolume, 1)) < tradeObj.investMin){
					soldOut = " sold_out";
					detailtype = " app_soldoutdetail";
					buttonHtml = "已售罄"
//					type += '<span class="app_tag_icon">售罄</span>'
//					collectPercent = "100.00"
				}
//				type += GHUTILS.showProductLabels(tradeObj.productLabels);
				type = _this.showGeneralLabel(tradeObj)
				
				if(tradeObj.state == "RAISEFAIL" || tradeObj.state == "CLEARED"){
					prodctHtml = '';
				}else{
//				if(tradeObj.state == "RAISEEND" && GHUTILS.Fadd(tradeObj.collectedVolume, GHUTILS.Fmul(tradeObj.lockCollectedVolume, tradeObj.netUnitShare)) != tradeObj.raisedTotalNumber){
//					prodctHtml = '';
//				}else if(tradeObj.maxSaleVolume == tradeObj.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(tradeObj.maxSaleVolume, tradeObj.lockCollectedVolume), tradeObj.netUnitShare) < tradeObj.investMin){
//					prodctHtml = '';
//				}else{
//					prodctHtml = '<div class="app_product_ihbox app-recommend-dingqi'
//								+soldOut+'" data-href="'
//								+tradeObj.oid + '"><div class="app_product_ihbox_title">' 
//								+tradeObj.productName +type+'</div><div class="app_product_ihcon app_clearfix"><div class="app_product_ihview app_fl app_pt5 mui-col-xs-5"><div class="app_cf90 "><span class="app_f18">' 
//								+aniNum + '%</span></div><p class="app_f14 app_cb3a app_mt8">预期年化收益率</p></div><div class="app_product_ihview app_fl mui-col-xs-7 app_pl10 app_pt5 app_pb5 app_f14"><div>投资期限：<span class="app_clistnum">' 
//								+tradeObj.durationPeriod + '天</span></div><div class="app_mt10">起投金额：<span class="app_clistnum">' 
//								+GHUTILS.formatCurrency(tradeObj.investMin) + '元</span></div></div></div><div class="app_pt15 app_pb15"><div class="app_progress_txt app_c80">'
//								+collectPercent+'%</div><div class="app_progress_bar"><span style="width: '
//								+collectPercent+'%;"></span></div></div></div>';
					prodctHtml = '<div class="app_in_product_box' +
									detailtype + soldOut + '" data-href="' +
									tradeObj.productOid + '">'+ type +'<div class="app_in_product_title"><span class="app_pr">' + 
									tradeObj.name + _this.showExtendLabel(tradeObj) + '</span></div><div class=""><div class="app_pt25 text-align-center"><div class="app_cmain "><span class="app_f40">'+ 
//									GHUTILS.switchShowType(tradeObj, false).interestSec + '%</span>'+ type +'</div><p class="app_f14 app_c80 app_mt8">昨日年化收益率</p></div><div class="app_mt20"><button type="button" class="mui-btn mui-btn-primary mui-btn-block">立即投资</button></div><div class="app_clearfix app_mt10 app_f14 app_c80"><div class="mui-col-xs-4 app_fl text-align-center">T日起息</div><div class="mui-col-xs-4 app_fl text-align-center">随时可退</div><div class="mui-col-xs-4 app_fl text-align-center">提现闪电到账</div></div></div></div>';	
									_this.switchShowType(tradeObj).interestSec + '<span class="app_f24">%</span></span></div><p class="app_f14 app_mt10">预期年化收益率</p></div><div class="mui-col-xs-6 app_f14 app_mt25 app_mb10 app_fl text-align-center app_ca6"><span class="app_c6">起投金额：</span>'+ GHUTILS.formatCurrency(tradeObj.investMin) +'元</div><div class="mui-col-xs-6 app_fl app_f14 app_mt25 app_mb10 text-align-center app_ca6"><span class="app_c6">锁定期：</span>'+ tradeObj.durationPeriodDays +'天</div><div class="app_mt25"><button type="button" class="mui-btn mui-btn-primary mui-btn-block">'+buttonHtml+'</button></div></div></div>';
				}
				return prodctHtml;
			},
			showGeneralLabel: function(tradeObj){
				var html = ""
				tradeObj.labelList.forEach(function(e, i){
					if(e.labelType == "general" && e.labelCode == "1"){
						html = '<span class="app_intag_icon app_intag_c1">'+e.labelName+'</span>'
					}
				})
				return html
			},
			showExtendLabel: function(tradeObj){
				var html = ""
				tradeObj.labelList.forEach(function(e, i){
					if(e.labelType == "extend"){
						html = '<span class="app_moretag">'+e.labelName+'</span>'
					}
				})
				return html
			},
			switchShowType: function(tradeObj){
				if(!tradeObj){
					return {"interestSec": 0}
				}
				var annualInterestSec = [];
				var annualInterestSec0 = "", annualInterestSec1 = "";
				var interestSec = "";
				
				if(tradeObj.expArrorDisp.split("~").length > 1){
					annualInterestSec = tradeObj.expArrorDisp.split("~");
					annualInterestSec0 = annualInterestSec[0].replace('%','');
					annualInterestSec1 = annualInterestSec[1].replace('%','');
					
//					if(tradeObj.rewardInterest){
//						annualInterestSec0 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec0, tradeObj.rewardInterest), 2)
//						annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, tradeObj.rewardInterest), 2)
//					}
					
					if(tradeObj.rewardYieldRange){
						var rewardYield = tradeObj.rewardYieldRange.replace(/\%/g,'').split('-')
						if(rewardYield.length == 1){
							annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, rewardYield[0]), 2)
						}else{
							annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, rewardYield[1]), 2)
						}
					}
					
					interestSec = annualInterestSec0 + "-" + annualInterestSec1
				}else{
					interestSec = tradeObj.expArrorDisp.replace('%','');
					
//					if(tradeObj.rewardInterest){
//						interestSec = GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, tradeObj.rewardInterest), 2)
//					}
					
					if(tradeObj.rewardYieldRange){
						var rewardYield = tradeObj.rewardYieldRange.replace(/\%/g,'').split('-')
						if(rewardYield.length == 1){
							interestSec += '-' + GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, rewardYield[0]), 2)
						}else{
							interestSec += '-' + GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, rewardYield[1]), 2)
						}
					}
				}
				if(tradeObj.rewardInterest){
					interestSec += '<span class="app_f24">%</span>+' + GHUTILS.toFixeds(tradeObj.rewardInterest, 2)
				}
				return {"interestSec": interestSec}
			},
			bindEvent:function(){
				var _this = this;
				//活期
				$(".app-recommend-huoqi").off().on("tap", function() {
					var href = this.getAttribute("data-href");
//					if (GHUTILS.linkChackLogin(this.id, ws.id)) {
						GHUTILS.OPENPAGE({
							url: "../product-t0/product-t0-detail.html",
//							id: GHUTILS.PAGESID.PROT0DETAIL,
							extras: {
								"productOid": href
							}
						})
//						GHUTILS.nativeUI.showWaiting();
//					}
//					var thisId = this.id, wsId = ws.id;
//					_this.isLogin(function(){
//						GHUTILS.getUserInfo(function(){
//							if(GHUTILS.checkDealpwd()){
//								_this.gett0detail(href, thisId, wsId);
//							}
//						}, true)
//					})
				})
				//定期
				$(".app-recommend-dingqi").off().on("tap", function() {
					// 友盟监听
//					if (GHUTILS.linkChackLogin('../../html/index/index.html')) {
						GHUTILS.OPENPAGE({
							url: "../../html/product-tn/product-tn-detail.html",
							extras: {
								"productOid": $(this).attr("data-href"),
//								collectPercent: $(this).attr("data-collectPercent") || 0
							}
						})
//						GHUTILS.nativeUI.showWaiting();
//					}
	
				});
				
				//售罄定期产品
				$(".app_soldoutdetail").off().on("tap", function() {
					var oid = $(this).attr("data-href")
					GHUTILS.checkLogin(function(){
//						if(GHUTILS.linkChackLogin('../../html/index/index.html')){
						 	_this.protnlist(oid);
//						}
					})
				})
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
								GHUTILS.loginOut(function(){
									var cb = {
										cb:"reload",
										pageid:plus.webview.currentWebview().id
									}
									GHUTILS.openLogin(JSON.stringify(cb));
								});
							}
						}
					}
				})
			},
			protnlist: function(productOid){
				var _this = this, prodOidList = [];
				GHUTILS.LOAD({
					url: GHUTILS.API.CHA.protnlist,
					type: "post",				
					async: true,
					callback: function(result) {
						if(GHUTILS.checkErrorCode(result)){
							if(result.holdingTnDetails.rows && result.holdingTnDetails.rows.length > 0){
								result.holdingTnDetails.rows.forEach(function(e, i){
									prodOidList.push(e.productOid)
								})
							}
							if(result.toConfirmTnDetails.rows && result.toConfirmTnDetails.rows.length > 0){
								result.toConfirmTnDetails.rows.forEach(function(e, i){
									prodOidList.push(e.productOid)
								})
							}
							if(result.closedTnDetails.rows && result.closedTnDetails.rows.length > 0){
								result.closedTnDetails.rows.forEach(function(e, i){
									prodOidList.push(e.productOid)
								})
							}
							console.log(JSON.stringify(prodOidList))
							if(prodOidList.indexOf(productOid) > -1){
								GHUTILS.OPENPAGE({
									url: "../../html/product-tn/product-tn.html",
									extras: {
										"productOid": productOid
									}
								})
//								GHUTILS.nativeUI.showWaiting();
							}else{
								mui.toast("项目已售罄，项目详情仅对本项目投资人公开")
							}
						}
					},
					errcallback: function() {
						mui.toast("网络错误，请稍后再试")
					}
				})
			},
			gett0detail: function(oid, thisId, wsId){
				var _this = this;
				GHUTILS.LOAD({
					url: GHUTILS.API.TARGET.gett0detail+"?oid="+oid,
					type: "post",
					sw: true,
					callback: function(result) {
						if(GHUTILS.checkErrorCode(result)){
							if(result.state == "RAISEEND"){
//								mui.toast("募集结束")
								mui.toast("已售罄")
								return
							}else if(result.maxSaleVolume == result.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin){
								mui.toast("已售罄")
								return
							}else if(result.isOpenPurchase == "NO"){
								mui.toast("不可购买")
								return
							}
							if(GHUTILS.isLabelProduct(result.productLabels, "1", true)){
								if(!GHUTILS.isFreshman()){
									return
								}
							}
							GHUTILS.checkLogin(function(){
								if(!result.investMin){
									result.investMin = 0
								}
								if(!result.investMax){
									result.investMax = 0
								}
								var lastOrder = false
//								if(GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin){
//									lastOrder = GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare)
//								}
								GHUTILS.OPENPAGE({
									url: "../../html/product-t0/product-t0-order.html",
									extras: {
										productName: result.productName,
										productOid: result.oid,
										annualInterestSec: GHUTILS.switchShowType(result).interestSec.split('-'),
										incomeCalcBasis: Number(result.incomeCalcBasis),
										purchasingAmount: result.investMin,
										increaseAmount: GHUTILS.Fmul(result.investAdditional, result.netUnitShare),
										maxSaleVolume: GHUTILS.Fmul(GHUTILS.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare),
										investMax: GHUTILS.Fmul(result.investMax, result.netUnitShare),
										investVolume: "",
										investFiles: HOST+result.investFiles[0].furl,
										serviceFiles: HOST+result.serviceFiles[0].furl,
										productCode: result.productCode,
										interestsFirstDays: result.interestsFirstDays,
										maxHold: result.maxHold,
										rewardInterest: result.rewardInterest,
										lockPeriodDays: result.lockPeriodDays,
										lastOrder: lastOrder
									}
								})
//								GHUTILS.nativeUI.showWaiting();
							
							})
						}
					}
				})
			},
			dateInit:function(){
	
	        }
		}
 	})();

	$["productlist"] = function(data){

		PORDUCTLIST.bind = getCfgBind("productlist");
		PORDUCTLIST.init(data);
	}
})
