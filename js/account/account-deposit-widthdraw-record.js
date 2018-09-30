/*
 Title:交易明细
 Author:cui xu
 Date:2017-3-6 16:30:34
 Version:v1.0
*/
(function($) {
	var ACCOUNT_DEAL = function() {
		this.counter = 1;
		this.rows = 10;
		this.tradeType = "";
		this.nodata = false;
		this.pullobj = null;
		this.dataLoading = true;
		return this;
	}
	ACCOUNT_DEAL.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
			this.bindEvent(); //事件绑定 
			this.checkLogin();//判断页面登录之后获取数据
		},
		pageInit: function() {
			var _this = this;
		},
		checkLogin:function(){
			var that = this;
			GHUTILS.nativeUI.showWaiting()
			GHUTILS.getUserInfo(function(){
				that.getData(true);
			},true);
		},
		getData:function(ifLogin) {
			var _this = this;
			var myDate  = new Date();
			var _m = (myDate.getMonth()+1);//月
			_m = _m >9 ? _m : "0" + _m;
			var _d = myDate.getDate() + 1;	//日+1		
			_d = _d >9 ? _d : "0" + _d;
			var startDate = myDate.getFullYear() - 1  + "-" + _m + "-" + _d + " 00:00:00";//开始时间：去年时间
			var endDate = myDate.getFullYear() + 1 + "-" + _m + "-" + _d + " 23:59:59";//结束时间：明年时间(正式环境就取当前时间)
			_this.dataLoading = false;
			
			if(_this.tradeType == ""){
				_this.tradeType = ["deposit","depositlong","withdraw","withdrawlong","offsetPositive","offsetNegative","redEnvelope"]
			}
			
			//请求数据标识，防止重复请求
			GHUTILS.LOAD({
				url: GHUTILS.buildQueryUrl(GHUTILS.API.CHA.depwdrawlist, {
					page: _this.counter,
					rows: _this.rows,
					orderTimeBegin: startDate,
					orderTimeEnd: endDate,
					orderType: _this.tradeType
				}),
//				url: GHUTILS.API.CHA.depwdrawlist + '?page=' + _this.counter + '&rows=10&orderTimeBegin=' + startDate + '&orderTimeEnd=' + endDate + '&orderType=' + _this.tradeType,
				async: true,
				callback: function(result) {
					GHUTILS.nativeUI.closeWaiting()
					_this.dataLoading = true;
					if (GHUTILS.checkErrorCode(result)) {
						var tradeList = result.rows;
						_this.counter += 1;
						var tradeHtml = '';
						for (var i in tradeList) {
							tradeHtml += _this.getTradeHtml(tradeList[i]);
						}
						if(tradeList.length < _this.rows){
							$('#showMore').html('没有更多数据了！');
						}else{
							$('#showMore').html('点击加载更多...');
							$('#showMore').off().on('tap',function(){
								_this.getData(true);
							});
						}
						$('#showMore').removeClass('app_none')
						$("#tradeList").append(tradeHtml);
						
					}
				},
				errcallback: function(result) {
					$('#showMore').html('没有更多数据了！');
					$('#showMore').removeClass('app_none')
					_this.dataLoading = true;
//					_this.pullobj.endPullUpToRefresh(true);
				}
			});
		},
		showMenu: function(show) {
			var _this = this;
			var obj = $(".app_dialog");
			if (show== "hide") {
				obj.removeClass("app_show");
				setTimeout(function() {
					obj.removeClass("app_active");
				}, 500);
			} else {
				obj.addClass("app_active");
				setTimeout(function() {
					obj.addClass("app_show");
				}, 50);
			}
		},
		bindEvent: function() {
			var _this = this;
			$('.app_links').on('tap', function() {
				_this.tradeType = $(this).attr("data-tradeType");
				if(_this.tradeType ) _this.tradeType = JSON.parse(_this.tradeType)
				$(".app_links").removeClass("app_active");
				$(this).addClass("app_active");
				$(".app_dialog").removeClass("app_show");
				$(".app_icon_box").removeClass("app_active");
				var _txt = $(this).find(".app_sort_list_txt").html();
				_this.changeTitle({
					title: _txt
				});
				_this.reloadData();
				_this.showMenu('hide');
			});
			$("#app_dialog_box").on("tap", function(e) {
				if (e.target.id == 'app_dialog_box') {
					_this.showMenu('hide');
					_this.closeafilter();
				}
			});
			// 
			$("#app_filter_btn").on("tap", function() {
				var show = '';
				var obj = $("#app_icon_box") //.app_icon_box
				var dialog = $(".app_dialog");
				var that = $(this);
				if(that.hasClass("app_btn_loading")){
					return
				}
				that.addClass("app_btn_loading");
				setTimeout(function(){
					that.removeClass("app_btn_loading");
				},50);
				if (obj.hasClass("app_active")) {
					obj.removeClass("app_active");
					show = 'hide';
				} else {
					obj.addClass("app_active");
					show = 'show';
				}
				_this.showMenu(show)
			});
			// 全部按钮
			$("#app_filter_btn_all").on("tap", function() {
				_this.tradeType = "";
				if (!$(this).hasClass("app_active")) {
					$(this).addClass("app_active");
					_this.changeTitle({
						title: "交易类型"
					});
					_this.closeafilter();
				}
			});
		

		},
		getTradeHtml: function(tradeObj) {
			//console.log(tradeObj);
			var _this = this;
			var tradeNum = tradeObj.orderCode;
			var statusHtml = '';
			
			if(tradeObj.orderStatus == "done") {
				statusHtml = '<div class=" app_cgreen">'+tradeObj.orderStatusDisp+'</div>'
			} else {
				statusHtml = '<div class="">'+tradeObj.orderStatusDisp+'</div>'
			}
			var fee="--"
			if(tradeObj.fee){
				fee = GHUTILS.formatCurrency(tradeObj.fee) + "元"
			}
			var itemHtml = "";
			if(tradeObj.orderType != "withdraw"){
				itemHtml = '<ul class="mui-table-view mui-grid-view app_mt10"><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易流水号</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+ tradeNum + '</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">充值金额</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+GHUTILS.formatCurrency(tradeObj.orderAmount)+'元</li><li class="mui-table-view-cell mui-col-xs-2 mui-text-right" style="padding-left:0;"><div class="app_cmain">'+tradeObj.orderTypeDisp+'</div></li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易时间</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+tradeObj.orderTime+'</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易状态</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+ statusHtml + '</li></ul>';
			} else if(tradeObj.orderType != "deposit"){
				itemHtml = '<ul class="mui-table-view mui-grid-view app_mt10"><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易流水号</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+ tradeNum + '</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">提现金额</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+GHUTILS.formatCurrency(tradeObj.orderAmount)+'元</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">提现手续费</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+fee+'</li><li class="mui-table-view-cell mui-col-xs-2 mui-text-right"><div class="app_cmain">'+tradeObj.orderTypeDisp+'</div></li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易时间</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+tradeObj.orderTime+'</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易状态</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+ statusHtml + '</li></ul>';
			} else if(tradeObj.orderType == "offsetPositive"){
				itemHtml = '<ul class="mui-table-view mui-grid-view app_mt10"><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易流水号</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+ tradeNum + '</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">冲正金额</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+GHUTILS.formatCurrency(tradeObj.orderAmount)+'元</li><li class="mui-table-view-cell mui-col-xs-2 mui-text-right"><div class="app_cmain">'+tradeObj.orderTypeDisp+'</div></li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易时间</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+tradeObj.orderTime+'</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易状态</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+ statusHtml + '</li></ul>';
			} else if(tradeObj.orderType == "offsetNegative"){
				itemHtml = '<ul class="mui-table-view mui-grid-view app_mt10"><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易流水号</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+ tradeNum + '</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">冲负金额</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+GHUTILS.formatCurrency(tradeObj.orderAmount)+'元</li><li class="mui-table-view-cell mui-col-xs-2 mui-text-right"><div class="app_cmain">'+tradeObj.orderTypeDisp+'</div></li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易时间</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+tradeObj.orderTime+'</li><li class="mui-table-view-cell mui-col-xs-4 mui-text-left"><div class="">交易状态</div></li><li class="mui-table-view-cell mui-col-xs-6 mui-text-left">'+ statusHtml + '</li></ul>';
			}
			return itemHtml;
		},
		reloadData: function() {
			var _this = this;
			if (_this.tradeType == "") {
				$(".app_links").removeClass("app_active");
			}
			_this.nodata = false;
			_this.counter = 1;
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);
//			if(_this.pullobj){
//				_this.pullobj.refresh(true);
//			}
			$('#tradeList').html('');
			GHUTILS.nativeUI.showWaiting()
			_this.getData();
		},
		changeTitle: function(_txt) {
			_txt = _txt.title;
			if (_txt == "交易类型") {
				$("#typeName").html("交易类型");
				$("#app_filter_btn").removeClass("app_links app_active");
			} else {
				$("#typeName").html(_txt);
				$("#app_filter_btn").addClass("app_links app_active");
				$("#app_filter_btn_all").removeClass("app_links app_active");
			}
		},
		closeafilter: function() {
			var _this = this;
			$(".app_icon_box").removeClass("app_active");
			_this.showMenu('hide');
			// _this.tradeType = "";
			// _this.reloadData();
		},
	}
	$(function() {
		var ad = new ACCOUNT_DEAL();
		ad.init();
	});
})(Zepto);