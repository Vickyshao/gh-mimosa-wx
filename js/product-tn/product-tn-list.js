/*
 Title:定期产品列表内页
 Author:sunli haiyang
 Date:2016-6-19 13:50:34
 Version:v1.0
*/
(function($) {

	var PRODUCTTNLIST = function(){
		this.param = {
			channelOid : channelOid,
			page : 1,
			rows : 10,
			sort : "",
			order : "",
			durationPeriodDaysStart : "",
			durationPeriodDaysEnd : "",
			expArorStart : "",
			expArorEnd : "",
		};
		this.param3 = {
			durationPeriodDaysStart : "",
			durationPeriodDaysEnd : "",
		};
		this.param4 = {
			expArorStart : "",
			expArorEnd : "",
		};
		this.upRefresh = false;
		this.prodOidList = [];
		return this;
	}
	PRODUCTTNLIST.prototype = {
		init:function(){
			GHUTILS.getOpenId();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.initDom(true,true);
		},
		pageInit:function(){
			var _this = this;
			
			//初始化下拉刷新
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
				      		_this.prodOidList = [];
				      		_this.initDom(true,true);
						},500);
				      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				    },
				    up : {
				      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
				      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
				      callback :function(){
				      	setTimeout(function(){
				      		_this.param.page += 1;
				      		_this.initDom(false);
							mui('#app_pullRefresh').pullRefresh().endPullupToRefresh(_this.upRefresh);
						},500);
				      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				    }
				  }
			});

		},
		showMenu:function(show){
			var _this = this;
			var obj = $(".app_dialog");

			if( show == "hide"){
				obj.removeClass("app_show");

				setTimeout(function(){
					obj.removeClass("app_active");
				},500);
			}else{
				obj.addClass("app_active");
				setTimeout(function(){
					obj.addClass("app_show");
				},50);
			}
		},
		refresh: function(data){
			var _this = this;
			_this.param.sort = data.sort;
			_this.param.order = data.order;
			_this.param.page = 1;
			_this.initDom(true);
			mui('#app_pullRefresh').pullRefresh().refresh(true);
		},
		bindEvent:function(){
			var _this = this;
			
			GHUTILS.listLinks()
			
			//投资期限
			$("#app_filter_btn_02").on("tap",function(){
				var data = {
					sort: "durationPeriodDays",
					order: ""
				};
				
				if($(this).find('img').attr("src") == "../../images/icon_nor.png"){
					data.order = "desc"
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_down.png");
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_nor.png");
				}else if($(this).find('img').attr("src") == "../../images/icon_down.png"){
					data.order = "asc"
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_up.png");
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_nor.png");
				}else{
					data.order = ""
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_nor.png");
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_nor.png");
				}
				if($("#app_icon_box").hasClass("app_active")){
					$("#app_icon_box").removeClass("app_active");
					$("#app_icon_box img").attr("src","../../images/icon_filter.png")
				}
				
				if($(".app_dialog").hasClass("app_show")){
					$(".app_dialog").removeClass("app_show");
					setTimeout(function(){
						$(".app_dialog").removeClass("app_active");
					},500);
				}
				_this.refresh(data);
			});
			
			//年化利率
			$("#app_filter_btn_03").on("tap",function(){
				var data = {
					sort: "expAror",
					order: ""
				};
				
				if($(this).find('img').attr("src") == "../../images/icon_nor.png"){
					data.order = "desc"
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_down.png");
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_nor.png");
				}else if($(this).find('img').attr("src") == "../../images/icon_down.png"){
					data.order = "asc"
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_up.png");
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_nor.png");
				}else{
					data.order = ""
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_nor.png");
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_nor.png");
				}
				if($("#app_icon_box").hasClass("app_active")){
					$("#app_icon_box").removeClass("app_active");
					$("#app_icon_box img").attr("src","../../images/icon_filter.png")
				}

				_this.refresh(data);
			});
			
			//打开筛选
			$("#app_filter_btn").on("tap",function(){
				var show = '';
				var obj = $("#app_icon_box");
				var that = $(this);
				if(that.hasClass("app_btn_loading")){
					return
				}
				that.addClass("app_btn_loading");
				setTimeout(function(){
					that.removeClass("app_btn_loading");
				},510);
				if(obj.hasClass("app_active")){
					obj.removeClass("app_active");
					$("#app_icon_box img").attr("src","../../images/icon_filter.png")
					show = 'hide';
				}else{
					obj.addClass("app_active");
					$("#app_icon_box img").attr("src","../../images/icon_filter_active.png")
					show = 'show';
				}
			
				_this.showMenu(show);
			});
			
			$(".app_btn_hide").on("tap",function(){
				_this.closeAfilter();
			});
		
			$("#app_dialog_box").on("tap",function(e){
				if(e.target.id == 'app_dialog_box'){
					_this.closeAfilter();
				}
			});

			$(".app_filter_view li").on("tap",function(){
				var idx = $(this).index();
				var obj = $(this).closest(".app_filter_view")
				obj.find("li").removeClass("app_active").eq(idx).addClass("app_active");
			});

//			$(".app_sort_box1 li").on("tap",function(){
//				_this.param1 = JSON.parse($(this).attr("data-sort"));
//			});
//			$(".app_sort_box2 li").on("tap",function(){
//				_this.param2 = JSON.parse($(this).attr("data-sort"));
//			});
			$(".app_sort_box3 li").on("tap",function(){
				_this.param3 = JSON.parse($(this).attr("data-sort"));
			});
			$(".app_sort_box4 li").on("tap",function(){
				_this.param4 = JSON.parse($(this).attr("data-sort"));
			});

			//筛选
			$("#app_filter_btn_confirm").on("tap",function(){
//				_this.param.reveal = _this.param1.reveal;
//				_this.param.investMinStart = _this.param2.investMinStart;
//				_this.param.investMinEnd = _this.param2.investMinEnd;
				_this.param.durationPeriodDaysStart = _this.param3.durationPeriodDaysStart;
				_this.param.durationPeriodDaysEnd = _this.param3.durationPeriodDaysEnd;
				_this.param.expArorStart = _this.param4.expArorStart;
				_this.param.expArorEnd = _this.param4.expArorEnd;
				_this.param.page = 1;
				_this.initDom(true);
				mui('#app_pullRefresh').pullRefresh().refresh(true);
			});
		},
		closeAfilter:function(){
			this.showMenu('hide');
			$(".app_icon_box").removeClass("app_active");
			$("#app_icon_box img").attr("src","../../images/icon_filter.png")
		},
		//获取当前用户体验金
		getTasteCoupon: function(){return
			var _this = this;
			_this.tasteCouponList = []
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.coupon +"?page=1&rows=10000&status=notUsed",
				type:'post',
				callback: function(result){
					//console.log(JSON.stringify(result))
					if(result.errorCode == 0){
						if(result.rows && result.rows.length > 0){
							for(var p in result.rows){
								if(result.rows[p].type == "tasteCoupon"){
									_this.tasteCouponList.push(result.rows[p])
								}
							}
							if(_this.tasteCouponList.length > 0){
								var amountList = [], maxAmountObjList = [], msecList = [], minMsecObjList = [], maxAmount = 0, minMsec = 0;
								for(var p in _this.tasteCouponList){
									amountList.push(_this.tasteCouponList[p].amount)
								}
								maxAmount = Math.max.apply(Math, amountList)
								for(var p in _this.tasteCouponList){
									if(_this.tasteCouponList[p].amount == maxAmount){
										maxAmountObjList.push(_this.tasteCouponList[p]);
									}
								}
								for(var p in maxAmountObjList){
									var dateArr = maxAmountObjList[p].finish.split('-');
									msecList.push(new Date(dateArr[0],(dateArr[1]-1),dateArr[2]).getTime());
									maxAmountObjList[p].msec = msecList[p];
								}
								minMsec = Math.min.apply(Math, msecList)
								for(var p in maxAmountObjList){
									if(maxAmountObjList[p].msec == minMsec){
										minMsecObjList.push(maxAmountObjList[p]);
									}
								}
								_this.couponId = minMsecObjList[0].oid
								_this.amount = minMsecObjList[0].amount
							}
						}
					}else if(result.errorCode != 10002 && result.errorCode != 20005){
						mui.toast(result.errorMessage)
					}
					_this.initDom(true,true,true);
				},
				errcallback: function(err){
					_this.initDom(true,true,true);
				}
			})
		},
		initDom: function(clearList,down,noWaiting){
			var _this = this;
			var _sw=true && !noWaiting;
			$('#app_list_tips').hide();
			GHUTILS.LOAD({
				url: GHUTILS.buildQueryUrl(GHUTILS.API.TARGET.gettnproductlist, _this.param),
				type: "post",
				sw: _sw,
				callback: function(result) {
					//console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						_this.upRefresh = _this.param.page*_this.param.rows < result.total ? false : true
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
						_this.getProgress()
						_this.showDetails();
					}
				},
				errcallback: function() {
					if(down){
						mui('#app_pullRefresh').pullRefresh().endPulldownToRefresh();
					}else{
						mui('#app_pullRefresh').pullRefresh().endPullupToRefresh()
					}
					mui.toast("网络错误，请稍后再试")
				}
			});
		},
		protnlist: function(productOid){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.protnlist,
				type: "post",				
				async: true,
				callback: function(result) {
					if(GHUTILS.checkErrorCode(result)){
						if(result.holdingTnDetails.rows && result.holdingTnDetails.rows.length > 0){
							result.holdingTnDetails.rows.forEach(function(e, i){
								_this.prodOidList.push(e.productOid)
							})
						}
						if(result.toConfirmTnDetails.rows && result.toConfirmTnDetails.rows.length > 0){
							result.toConfirmTnDetails.rows.forEach(function(e, i){
								_this.prodOidList.push(e.productOid)
							})
						}
						if(result.closedTnDetails.rows && result.closedTnDetails.rows.length > 0){
							result.closedTnDetails.rows.forEach(function(e, i){
								_this.prodOidList.push(e.productOid)
							})
						}
						console.log(JSON.stringify(_this.prodOidList))
						if(_this.prodOidList.indexOf(productOid) > -1){
							GHUTILS.OPENPAGE({
								url:"../../html/product-tn/product-tn-detail.html",
								extras:{
									productOid: productOid
								}
							})
							GHUTILS.nativeUI.showWaiting();
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
		showDetails: function(){
			var _this = this;
			$('.app_showdetail').off().on('tap',function(){
				window.location.href = "../../html/product-tn/product-tn-detail.html?productOid="+$(this).attr("data-oid")
//					GHUTILS.OPENPAGE({
//						url:"../../html/product-tn/product-tn.html",
//						extras:{
//							productOid: $(this).attr("data-oid")
//						}
//					})
//					GHUTILS.nativeUI.showWaiting();
			});
			
			$(".app_soldoutdetail").off().on('tap',function(){
				var productOid = $(this).attr("data-oid")
				GHUTILS.checkLogin(function(){
					if(_this.prodOidList && _this.prodOidList.length > 0){
						if(_this.prodOidList.indexOf(productOid) > -1){
							GHUTILS.OPENPAGE({
								url:"../../html/product-tn/product-tn-detail.html",
								extras:{
									productOid: productOid
								}
							})
//							GHUTILS.nativeUI.showWaiting();
						}else{
							mui.toast("项目已售罄，项目详情仅对本项目投资人公开")
						}
					}else{
						_this.protnlist(productOid);
					}
				})
			})
			
			$(".app_tastedetail").off().on('tap', function(){
				GHUTILS.checkLogin(function(){
					window.location.href = ""
					GHUTILS.OPENPAGE({
						url: '../../html/product-tn/product-tn-expproducts-detail.html',
						extras: {
							productOid: productOid
						}
					})
//					GHUTILS.nativeUI.showWaiting();
					
				})
			})
		},
		//获取交易html
		getProdHtml: function(tradeObj){
			var _this = this;
			var prodText = '';
			//募集进度
			var collectPercent = GHUTILS.toFixeds(GHUTILS.Fmul(GHUTILS.Fdiv(GHUTILS.Fadd(tradeObj.collectedVolume, GHUTILS.Fmul(tradeObj.lockCollectedVolume, 1)), tradeObj.raisedTotalNumber), 100),2,"%");
			var type = '', soldOut = '', detailtype = ' app_showdetail', buttonHtml = '立即投资';
			if(!tradeObj.investMin){
				tradeObj.investMin = 0
			}
			if(tradeObj.state != "RAISING" || tradeObj.maxSaleVolume == tradeObj.lockCollectedVolume || GHUTILS.Fmul(GHUTILS.Fsub(tradeObj.maxSaleVolume, tradeObj.lockCollectedVolume), 1) < tradeObj.investMin){
				soldOut = " sold_out";
				detailtype = " app_soldoutdetail";
				collectPercent = "100.00%"
				buttonHtml = "已售罄"
			}
			type = GHUTILS.showProductLabels(tradeObj.labelList);
			
			//相关数据处理
			var aniNum = tradeObj.expArrorDisp.split("~");
				
			if(aniNum.length > 1){
				var animin = aniNum[0].replace('%', '');
				var animax = aniNum[1].replace('%', '');
				
//				if(tradeObj.rewardInterest){
//					animin = GHUTILS.toFixeds(GHUTILS.Fadd(animin, tradeObj.rewardInterest), 2)
//					animax = GHUTILS.toFixeds(GHUTILS.Fadd(animax, tradeObj.rewardInterest), 2)
//				}
				
				aniNum = animin + '-' + animax
			}else{
				aniNum = aniNum[0].replace('%', '');
				
//				if(tradeObj.rewardInterest){
//					aniNum = GHUTILS.toFixeds(GHUTILS.Fadd(aniNum, tradeObj.rewardInterest), 2)
//				}
				
//				aniNum = aniNum
			}
			
			if(tradeObj.rewardInterest){
				aniNum += '%+' + GHUTILS.toFixeds(tradeObj.rewardInterest, 2)
			}
			
			if(tradeObj.state == "RAISEFAIL" || tradeObj.state == "CLEARED"){
				prodText = '';
			}else{
//				var progress = "";
//				if(collectPercent == "100.00"){
//					progress = '<div class="app_fr app_progress"><img src="../../images/shouqin.png"/></div>'
//				} else {
//					progress = '<div class="circle" data-collectPercent="'+ collectPercent +'"><div class="pie_left"><div class="left"></div></div><div class="pie_right"><div class="right"></div></div><div class="mask"><span class="app_f18">'+ collectPercent +'</span>%</div></div>'
//				}
//				prodText = '<div class="app_product_ihbox'+detailtype+soldOut+'" data-oid="'+tradeObj.productOid 
//							+ '"><div class="app_product_ihbox_title app_c4">'+ tradeObj.name + type 
//							+'<span class="mui-pull-right app_ca6 app_f12">'+ GHUTILS.formatCurrency(tradeObj.investMin) 
//							+'元起投</span></div><div class="app_product_ihcon app_clearfix"><div class="app_product_ihview app_fl app_pt5 mui-col-xs-6"><div class=""><div class="app_cmain "><span class="app_f16">'
//							+ aniNum +'</span></div><p class="app_f12 app_cb3a app_mt6 app_ca6">预期年化收益率</p></div></div><div class="app_pt5 text-align-center app_pa center"><div class="text-align-center"><div class="app_cf71 app_f16"><span class="app_f24">'
//							+ tradeObj.durationPeriodDays +'</span>天</div><p class="app_f12 app_cb3a app_mt6 app_ca6">投资期限</p></div></div><div class="app_product_ihview app_fl mui-col-xs-6">'+ progress +'</div></div></div>'
				
				prodText = '<div class="app_product_ihbox'+detailtype+soldOut+'" data-oid="'+tradeObj.productOid+'">'
							+ type + '<div class="app_product_ihbox_title app_c4">'
							+ tradeObj.name + '</div><div class="app_product_ihcon app_clearfix"><div class="app_product_ihview app_fl app_pt5 mui-col-xs-7"><div class="app_cmain "><span class="app_f20">'
							+ aniNum + '%</span></div><p class="app_f14 app_cb3a app_mt8 app_c8">预期年化收益率</p></div><div class="app_product_ihview app_fl mui-col-xs-5 app_pt5 app_pb10 app_f14 app_c4 text-align-right"><span class="app_c8">起投金额：</span>'
							+ GHUTILS.formatCurrency(tradeObj.investMin) + '元<div class="app_mt10"><span class="app_c8">投资期限：</span>'
							+ tradeObj.durationPeriodDays + '天</div></div></div><div class="app_clearfix app_pt10"><div class="app_pt15 app_pb15 app_w70p app_fl"><div class="app_progress_txt app_c80">'
							+ collectPercent + '</div><div class="app_progress_bar"><span style="width: '
							+ collectPercent + ';"></span></div></div><div><div class="mui-btn mui-btn-primary app_fr">'+buttonHtml+'</div></div></div></div>'
				
			}
			return prodText;
		},
		getProgress:function(collectPercent){
			$('.circle').each(function(index, el) {
				var num = $(this).attr("data-collectPercent") * 3.6;
				if (num<=180) {
					$(this).find('.right').css('transform', "rotate(" + num + "deg)");
				} else {
					$(this).find('.right').css('transform', "rotate(180deg)");
					$(this).find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
				};
			});
		}
	}
	$(function(){
		var ptn = new PRODUCTTNLIST();
			ptn.init();
	});
})(Zepto);
