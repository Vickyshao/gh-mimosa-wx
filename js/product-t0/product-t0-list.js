/*
 Title:活期产品列表
 Author:sunli haiyang
 Date:2016-6-21 20:41:37
 Version:v1.0
*/
(function($) {

	var PRODUCTT0DETAIL = function(){
		
		this.param = {
			channelOid : channelOid,
			page : 1,
			rows : 10
		};
		this.upRefresh = false;
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
			mui.init({
			    pullRefresh : {
			    	indicators:false,
				    container:"#app_pullRefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				    down : {
				      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				      contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				      contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				      callback :function(){
				      	setTimeout(function(){
				      		_this.param.page = 1;
				      		_this.initDom(true,true);
						},500);
				      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				    },
//				    up : {
//				      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
//				      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
//				      callback :function(){
//				      	setTimeout(function(){
//				      		_this.param.page += 1;
//				      		_this.initDom(false);
//							mui('#app_pullRefresh').pullRefresh().endPullupToRefresh(_this.upRefresh);
//						},500);
//				      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//				    }
				  }
			});
			

		},
		getData:function(){
			var _this = this;
			_this.param.page = 1;
			_this.initDom(true,true,true);
		},
		bindEvent:function(){
			var _this = this;
			//页面链接
			GHUTILS.listLinks()
		},
		initDom: function(clearList,down,noWaiting){
			var _this = this;
			var _sw=true && !noWaiting;
			$('#app_list_tips').hide();
			GHUTILS.LOAD({
				url: GHUTILS.buildQueryUrl(GHUTILS.API.TARGET.gett0productlist, _this.param),
				type: "post",
				sw: _sw,
				callback: function(result) {
//					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						_this.upRefresh = _this.param.page*_this.param.rows < result.rows.length ? false : true
						if(down){
							mui('#app_pullRefresh').pullRefresh().endPulldownToRefresh();
							if(!_this.upRefresh){
								mui('#app_pullRefresh').pullRefresh().refresh(true);
							}
						}
						var prodList = result.rows;
						var prodHtml = '';
						for(var i in prodList){
							 prodHtml += _this.getProdHtml(prodList[i]);
						}
						if(clearList){
							$(".app_product_list").html("");
						}
						if(prodHtml == ''){
							if($(".app_product_list").html() == ''){
								$("#app_list_tips").show();
							}
							return
						}
						$(".app_product_list").append(prodHtml);
						_this.showDetails();
					}
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
				}
			});
		},
		showDetails: function(){
			var _this = this;
			$('.app_showdetail').off().on('tap',function(){
//				if(GHUTILS.linkChackLogin(this.id,_this.ws.id)){
					var productOid = $(this).attr("data-oid");
					
					GHUTILS.OPENPAGE({
						url:"../../html/product-t0/product-t0-detail.html",
//						id:GHUTILS.PAGESID.PROT0DETAIL,
						extras:{productOid: productOid}
					})
//					GHUTILS.nativeUI.showWaiting();
//				}
			});
		},
		//获取交易html
		getProdHtml: function(tradeObj){
			var _this = this;
			var type = '', soldOut = '', buttonHtml = '立即投资';
			if(!tradeObj.investMin){
				tradeObj.investMin = 0
			}
			if(tradeObj.state != "DURATIONING" || tradeObj.maxSaleVolume == tradeObj.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(tradeObj.maxSaleVolume, tradeObj.lockCollectedVolume), 1) < tradeObj.investMin){
				soldOut = " sold_out";
				buttonHtml = "已售罄"
			}
			type = GHUTILS.showProductLabels(tradeObj.labelList);
			var prodHtml = '<div class="app_product_ihbox app_showdetail'+
							soldOut+'" data-oid="'+
							tradeObj.productOid+'">'+
							type+'<div class="app_product_ihbox_title app_c4">'+
							tradeObj.name+'</div><div class="app_product_ihcon app_clearfix"><div class="app_product_ihview app_fl app_pt5 mui-col-xs-6"><div class="app_cmain "><span class="app_f18">'+
							_this.switchShowType(tradeObj).interestSec+'%</span></div><p class="app_f14 app_cb3a app_mt8 app_c8">随时取现</p></div><div class="app_product_ihview app_fl mui-col-xs-6 app_pt5 app_pb10 app_f14 app_c4 text-align-right"><span class="app_c8">每万元收益：</span>'+
							tradeObj.tenThousandIncome+'元<div class="app_mt10"><span class="app_c8">投资人次：</span>'+
							tradeObj.purchaseNum+'</div></div></div><div class="app_clearfix app_pt10"><div class="app_pt15 app_pb25 app_w70p app_fl"></div><div><div class="mui-btn mui-btn-primary app_fr">'+buttonHtml+'</div></div></div></div>'
			return prodHtml;
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
				
//				if(tradeObj.rewardInterest){
//					annualInterestSec0 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec0, tradeObj.rewardInterest), 2)
//					annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, tradeObj.rewardInterest), 2)
//				}
				
//				if(tradeObj.rewardYieldRange){
//					var rewardYield = tradeObj.rewardYieldRange.replace(/\%/g,'').split('-')
//					if(rewardYield.length == 1){
//						annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, rewardYield[0]), 2)
//					}else{
//						annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, rewardYield[1]), 2)
//					}
//				}
				
				interestSec = annualInterestSec0 + "-" + annualInterestSec1
			}else{
				interestSec = tradeObj.expArrorDisp.replace('%','');
//				if(tradeObj.rewardInterest){
//					interestSec = GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, tradeObj.rewardInterest), 2)
//				}
				
//				if(tradeObj.rewardYieldRange){
//					var rewardYield = tradeObj.rewardYieldRange.replace(/\%/g,'').split('-')
//					if(rewardYield.length == 1){
//						interestSec += '-' + GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, rewardYield[0]), 2)
//					}else{
//						interestSec += '-' + GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, rewardYield[1]), 2)
//					}
//				}
			}
			if(tradeObj.rewardInterest){
				interestSec += '%+' + GHUTILS.toFixeds(tradeObj.rewardInterest, 2)
			}
			return {"interestSec": interestSec}
		}
	}
	$(function(){
		var t0de = new PRODUCTT0DETAIL();
			t0de.init();
	});
})(Zepto);