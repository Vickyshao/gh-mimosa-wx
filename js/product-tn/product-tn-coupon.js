/*
 Title:优惠券
 Author:yang sen
 Date:2016-6-4 18:31:00
 Version:v1.0
*/
(function($) {
	var ACCOUNT = function() {
		this.ws = GHUTILS.parseUrlParam(window.location.href);
		return this;
	}
	ACCOUNT.prototype = {
		init: function() {
			this.pageInit();
		},
		pageInit: function() {
			var _this = this;
			var info = eval("("+decodeURIComponent(_this.ws.info)+")");
			_this.ws.availableCouponList = info.availableCouponList
			_this.ws.notAvailableCouponList = info.notAvailableCouponList
			_this.ws.checkedCoupon = info.checkedCoupon
			console.log(_this.ws.availableCouponList)
			console.log(_this.ws.notAvailableCouponList)
			console.log(_this.ws.checkedCoupon)
			console.log()
			
			_this.getList(this.ws.availableCouponList, true);
			
		},
		getList: function(couponList, ifAvailable) {
			var _this = this;
			var couponHtml = '';
			if(couponList && couponList.length > 0){
				for (var i in couponList) {
					couponHtml += _this.addItem(couponList[i], ifAvailable);
				}
			}
			$('#app_couponList').append(couponHtml);
			if(ifAvailable){
				_this.getList(_this.ws.notAvailableCouponList, false);
				_this.selectCoupon();
			}
		},
		//可选优惠券点击
		selectCoupon: function(){
			var _this = this;
			$(".on").on('tap', function(){
				if($(this).find('input[type="checkbox"]').is(':checked')){
					$(this).find('input[type="checkbox"]')[0].checked = false;
//					mui.fire(plus.webview.getWebviewById(GHUTILS.PAGESID.PROTNORDER), "uncheckCoupon")
				}else{
					$(".on input").forEach(function(e,i) {
						if(e.checked){
							e.checked = false
						}
					});
					$(this).find('input[type="checkbox"]')[0].checked = true;
//					mui.fire(plus.webview.getWebviewById(GHUTILS.PAGESID.PROTNORDER), "checkCoupon", {
//						oid: $(this).attr("data-oid")
//					})
				}
			})
		},
		addItem: function(tradeObj, ifAvailable) {
			var html = "";
			if(ifAvailable){
				html = '<div class="app_user_coupon_box on app_clearfix" data-oid="'+tradeObj.couponId+'">';
			}else{
				html = '<div class="app_user_coupon_box off app_clearfix">';
			}
			return html + this.itemsObj(tradeObj, ifAvailable) + '</div>';
		},
		itemsObj: function(tradeObj, ifAvailable) {
			var _this = this;
			var couponHtml = '', html = '', checked = '';
			
			if(ifAvailable){
				if(JSON.stringify(_this.ws.checkedCoupon) != '{}' && _this.ws.checkedCoupon.couponId == tradeObj.couponId){
					checked = ' checked="checked"'
				}
				html = '<div style="position: absolute;right: 5px;top: 5px;"><input type="checkbox"'+ checked +'></div>'
			}
			
			var products = "";
			if(tradeObj.products){
				if(tradeObj.products != "适用全场") {
					products = "仅限投资" + tradeObj.products
				} else {
					products = "全产品通用"
				}
				
			} else {
				products = "全产品通用"
			}
			
			var rules = "";
			if(tradeObj.investAmount){
				rules = "满" + tradeObj.investAmount + "元使用"
			} else {
				rules = "满1元使用"
			}
			
			if(tradeObj.type ==='coupon'){
				couponHtml = '<div class="app_coupon_num_box"><h5 class="app_cf mui-text-left app_mb30">代金券</h5><span class="app_f18">￥</span><span class="app_coupon_num"><span  class="app_fb">'
												+ tradeObj.amount +'</span></span></div>'
												+ html +'<div class="app_coupon_info"><div class="ui-border-b app_mt10 mui-ellipsis  app_cmain">'
												+ tradeObj.name +'</div><div class="app_c3b app_mt10 mui-ellipsis ">'
												+ products +'</div><div class="app_c3b app_mt10 mui-ellipsis  ">'
												+ rules +'</div><div class="app_c3b app_mt10 app_bts app_bottom">有效期至'
												+ tradeObj.finish +'</div></div>';
			}else{
				couponHtml = '<div class="app_coupon_num_box"><h5 class="app_cf mui-text-left app_mb30">加息券</h5><span class="app_coupon_num"><span  class="app_fb">'
							+ tradeObj.amount +'</span></span><span class="app_f18">%</span></div>'
							+ html +'<div class="app_coupon_info"><div class="ui-border-b app_mt10 mui-ellipsis  app_cmain">'
							+ tradeObj.name +'</div><div class="app_c3b app_mt10 mui-ellipsis">'
							+ products +'</div><div class="app_c3b app_mt10 mui-ellipsis">'
							+ rules +'</div><div class="app_c3b app_mt10 app_bts app_bottom">有效期至:'
							+ tradeObj.finish +'</div></div>'
			}
			
			return couponHtml;
		}
	}
	$(function() {
		var ac = new ACCOUNT();
		ac.init();
	});
})(Zepto);
