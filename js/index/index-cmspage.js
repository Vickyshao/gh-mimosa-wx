//mui.init();
(function($) {
	var SETT = function() {
		this.ws = null;
		return this;
	}
	GHUTILS.listLinks();
	SETT.prototype = {
		init: function() {
			this.bindEvent(); //事件绑定
			this.getData();
		},
		getData: function() {
			var _this = this;   
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
		
		bindEvent: function() {
			var _this = this;
			_this.isLogin(function(){
					$("#to_register .txt").html('立即变现');
					$('.logined').css('display','block');
					$('.no-login').css('display','none');
					$("#to_register").attr("url",'../account/account-coupon.html');
					$("#to_login").attr("url",'../account/account-toinvite.html');
			},function(){
					$("#to_register .txt").html('立即领取');
					$('.logined').css('display','none');
					$('.no-login').css('display','block');
					$("#to_register").attr("url",'../usermgmt/usermgmt-reg.html');
					$("#to_login").attr("url",'../usermgmt/usermgmt-login.html');
			});
			
			$("#to_register").off().on('tap', function(){
	//			如果是已登录状态,按钮显示立即变现,并且链接跳转到优惠券页面
				var _url = $("#to_register").attr('url');
				GHUTILS.OPENPAGE({
					url: _url
				});
			});
			//	登录状态按钮跳转到“我的”页面
			$("#to_login").off().on('tap', function(){
				var _url = $("#to_login").attr('url');
				GHUTILS.OPENPAGE({
					url: _url
				});
			});
		}
	}
	$(function() {
		var sett = new SETT();
		sett.init();
	});
})(Zepto);