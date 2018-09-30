/*
 Title:优惠券
 Author:cui xu
 Date:2017-3-1 14:25:04
 Version:v1.0
*/
(function($) {
	var ACCOUNT = function() {
		this.ws = null;
		this.states = ["notUsed", "used", "expired"];
		this.pageNum = [1, 1, 1];
		this.rules = '';
		this.products = '';
		this.title = '';
		this.rows = 10;
		return this;
	}
	ACCOUNT.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
		},
		pageInit: function() {
			var _this = this;
			mui.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					mui(pullRefreshEl).pullToRefresh({
						up: {
							auto: true,
							callback: function() {
								var self = this;
								_this.getList(index, self);
							}
						}
					});
				});
			});
		},
		getList: function(index, refresh) {
			GHUTILS.nativeUI.showWaiting()
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.coupon +"?page=" + _this.pageNum[index] +"&rows=" + _this.rows +"&status=" + _this.states[index] ,
				data: {},
				type:'post',
				async: true,
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result)) {
						if (_this.pageNum[index] == 1) {
							$('#app-' + _this.states[index] + '-num').html('(' + result.total + ')');
						}
//					console.log(JSON.stringify(result))
						var couponList = result.rows;
						
						_this.pageNum[index]++;
						var couponHtml = '';

						if (index == 0) {
							for (var i in couponList) {
								couponHtml += _this.addUsableItem(couponList[i]);
							}
						} else if (index == 1) {
							for (var i in couponList) {
								couponHtml += _this.addUsedItem(couponList[i]);
							}
						} else if (index == 2) {
							for (var i in couponList) {
								couponHtml += _this.addExpiredItem(couponList[i]);
							}
						}

						if (couponList.length < 10 || $.isEmptyObject(couponList)) {
							refresh.endPullUpToRefresh(true);
						} else {
							refresh.endPullUpToRefresh(false);
						}
						GHUTILS.nativeUI.closeWaiting()
						$('#app-' + _this.states[index] + '-list').append(couponHtml);
						_this.bindEvent();
					}
				},
				errcallback: function(result) {
					GHUTILS.nativeUI.closeWaiting()
					refresh.endPullUpToRefresh(true);
				}
			});
		},
		bindEvent: function() {
			var _this = this
			$(".app_user_coupon_box.on .coupon_receive_btn").off().on("click", function(){
				if($(this).hasClass("app_loading")){
					return
				}
				$(this).addClass("app_loading")
				_this.receiveCoupon($(this))
			})
			
			$(".tasteCoupon_btn").off().on("click", function(){
				_this.expproducts($(this).attr("data-couponId"), $(this).attr("data-couponType"), $(this).attr("data-couponAmount"));
			})
		},
		//可用
		addUsableItem: function(tradeObj) {
			var couponHtml = '<div class="app_user_coupon_box on app_clearfix">'+ this.itemsUsableObj(tradeObj, "立即领取") +'</div>';
			return couponHtml;
		},
		//已使用
		addUsedItem: function(tradeObj) {
			var couponHtml = '<div class="app_user_coupon_box used app_clearfix">'+ this.itemsUsableObj(tradeObj, "已领取") +'</div>';
			return couponHtml;
		},
		//过期
		addExpiredItem: function(tradeObj) {
			var couponHtml = '<div class="app_user_coupon_box off app_clearfix">'+ this.itemsUsableObj(tradeObj, "已过期") +'</div>';
			return couponHtml;
		},
		//优惠劵
		itemsUsableObj: function(tradeObj, redName) {
			var _this = this;
			var couponHtml = '';
			
			var products = "";
			if(tradeObj.products){
				if(tradeObj.products != "适用全场") {
					products = "仅限投资" + tradeObj.products
				} else {
					products = tradeObj.products
				}
				
			} else {
				products = "适用全场"
			}
			
			var rules = "";
			if(tradeObj.investAmount){
				rules = "满" + tradeObj.investAmount + "元使用"
			} else {
				rules = "全场适用"
			}
			if(tradeObj.type ==='coupon'){
				couponHtml = '<div class="app_coupon_num_box"><h5 class="app_cf mui-text-left app_mb30">代金券</h5><span class="app_f18">￥</span><span class="app_coupon_num"><span  class="app_fb">'
							+ tradeObj.amount +'</span></span></div><div class="app_coupon_info"><div class="ui-border-b app_mt10 mui-ellipsis  app_cmain">'
							+ tradeObj.name +'</div><div class="app_c3b app_mt10 mui-ellipsis ">'
							+ products +'</div><div class="app_c3b app_mt10 mui-ellipsis  ">'
							+ rules +'</div><div class="app_c3b app_mt10 app_bts app_bottom">有效期至:'
							+ tradeObj.finish +'</div></div>';
			}else if(tradeObj.type ==='rateCoupon'){
				couponHtml = '<div class="app_coupon_num_box"><h5 class="app_cf mui-text-left app_mb30">加息券</h5><span class="app_coupon_num"><span  class="app_fb">'
							+ tradeObj.amount +'</span></span><span class="app_f18">%</span></div><div class="app_coupon_info"><div class="ui-border-b app_mt10 mui-ellipsis  app_cmain">'
							+ tradeObj.name +'</div><div class="app_c3b app_mt10 mui-ellipsis">'
							+ products +'</div><div class="app_c3b app_mt10 mui-ellipsis">'
							+ rules +'</div><div class="app_c3b app_mt10 app_bts app_bottom">有效期至:'
							+ tradeObj.finish +'</div></div>'
			}else if(tradeObj.type ==='tasteCoupon'){
				couponHtml = '<div class="app_coupon_num_box"><h5 class="app_cf mui-text-center app_mt20 app_mb20">体验金</h5><span class="app_f18">￥</span><span class="app_coupon_num"><span  class="app_fb">'
							+ tradeObj.amount +'</span></span></div><div class="app_coupon_info"><div class="ui-border-b app_mt10 mui-ellipsis">体验天数：'
							+ tradeObj.validPeriod +'天</div><div class="tasteCoupon_btn" data-couponId="'
							+ tradeObj.couponId +'" data-couponType="'
							+ tradeObj.type +'" data-couponAmount="'
							+ tradeObj.amount +'">立即使用</div><div class="app_c3b app_mt10 mui-ellipsis">适用产品：'
							+ products +'</div><div class="app_c3b app_mt10 mui-ellipsis">使用规则：'
							+ rules +'</div><div class="app_c3b app_mt10 app_bts app_bottom">有效期至：'
							+ tradeObj.finish +'</div></div>'
			}else if(tradeObj.type ==='redPackets'){
				couponHtml = '<div class="app_coupon_list"><div class="ui-border-b app_mt10 mui-ellipsis  app_cmain app_ml10">'
							+ tradeObj.name +'</div><div class="ui-border-b app_mt5 mui-ellipsis app_cmain app_ml10">￥<span class="app_f24">'
							+ tradeObj.amount +'</span></div><div class="coupon_receive_btn" data-oid="'+tradeObj.couponId+'">'+redName+'</div><div class="app_c3b app_mt10 app_bottom">有效期至:'
							+ tradeObj.finish +'</div></div>'
			}
			
			return couponHtml;
		},
		//领红包
		receiveCoupon: function(couponObj){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.receiveCoupon+"?couponId="+couponObj.attr("data-oid"),
				type: "post",
				sw: true,
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						mui.alert("请在余额中查看", "红包领取成功!", "确认", function(){
							_this.pageNum = [1, 1, 1];
							$("#app-notUsed-list").html("")
							$("#app-used-list").html("")
							$("#app-expired-list").html("")
							mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
								mui(pullRefreshEl).pullToRefresh().refresh(true)
								_this.getList(index, mui(pullRefreshEl).pullToRefresh())
							});
						})
					}else{
						couponObj.removeClass("app_loading")
					}
				},
				errcallback: function(){
					couponObj.removeClass("app_loading")
				}
			})
		},
		//获取体验金产品
		expproducts: function(couponId, couponType, couponAmount){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.tdetail + "?channelOid=" + channelOid,
				type: "post",
				sw: true,
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						GHUTILS.OPENPAGE({
							url: "../../html/product-t0/product-t0-detail.html",
							extras:{
								productOid: result.oid,
								couponId: couponId,
								couponType: couponType,
								couponAmount: couponAmount
							}
						})
					}
				}
			})
		}
	}
	GHUTILS.getUserInfo(function(){
		$(function() {
			var ac = new ACCOUNT();
			ac.init();
		});
	},true);
	
})(Zepto);
