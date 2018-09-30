/*
 Title:忘记密码
 Author:sunli haiyang
 Date:2016-6-18 11:01:28
 Version:v1.0
*/
mui.init();
(function($) {

	var FORGETPWD = function(){
		this.getVcode = $("#app-message");
		this.tips1 = $("#app_tips_box1");
		this.tips2 = $("#app_tips_box2");
		this.mobile = "";
		this.ws = GHUTILS.parseUrlParam(window.location.href);
		return this;
	}
	FORGETPWD.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			_this.mobile = _this.ws.mobile;
			console.log(_this.mobile)
			$("#app_mobile").html(_this.mobile);
		},		
		getData:function(){
			var _this = this;
			GHUTILS.btnTime2(_this.getVcode);
		},
		bindEvent:function(){
			var _this = this;
			_this.getVcode.off().on("tap",function(){
				if(_this.getVcode.hasClass("app_loading")){
					return
				}
				_this.tips1.html("&nbsp;")
//				if(GHUTILS.validate("app-phoneDiv")){
//					//判断用户是否锁定
//					GHUTILS.LOAD({
//						url: GHUTILS.API.USER.checklock + '?userAcc=' + $("#app_mobile").val(),
//						data: {},
//						type: "post",
//						sw:false,
//						callback: function(result) {
//							if (GHUTILS.checkErrorCode(result,_this.tips1)) {
//								_this.getVericode();
//							}
//						}				
//					});
//				}
				if(GHUTILS.validate("app-phoneDiv")){
					_this.getVcode.addClass("app_loading")
					_this.checklock();
				}
			});
			
//			$("#app-stepOneNext").off().on("tap",function(){
//				_this.tips1.html("&nbsp;")
//				if(GHUTILS.validate("app-stepOne")){
//					_this.checkvericode();
//				}
//			})
			
			$("#app-confirm").off().on("tap",function(){
				if(GHUTILS.validate("app-stepTwo")){
					_this.updatepassword();
				}
			})
			
//			GHUTILS.inputFocus("#app-pwd");
			
//			GHUTILS.inputFocus("#app-confirmPwd");
			
			$("#app-stepTwo input").forEach(function(e, i){
				$(e).on("input", function(){
					_this.buttonEnable();
				})
			})
		},
		buttonEnable: function(){
			if($("#app-vericode").val().length == 6 && $("#app-pwd").val().length >= 6 && $("#app-confirmPwd").val().length >= 6){
				$("#app-confirm").removeAttr("disabled")
			}else{
				$("#app-confirm").attr("disabled","disabled")
			}
		},
		//判断用户是否锁定
		checklock: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.USER.checklock + '?userAcc=' + $("#app_mobile").html(),
				data: {},
				type: "post",
				sw:false,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if (GHUTILS.checkErrorCode(result,_this.tips1)) {
						_this.getVericode();
					}else{
						_this.getVcode.removeClass("app_loading")
					}
				},
				errcallback: function(){
					_this.getVcode.removeClass("app_loading")
				}
			});
		},
		getVericode: function(){
			var _this = this;
//			_this.getVcode.addClass("app_btn_loading")
			GHUTILS.LOAD({
				url: GHUTILS.API.USER.sendverifyv1,
				data: {
					phone: $("#app_mobile").val(),
					smsType: "forgetlogin",
					values: ["", 2]
				},
				type: "post",
				sw: true,
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result, _this.tips1)) {
						GHUTILS.btnTime2(_this.getVcode);
					}else{
						_this.getVcode.removeClass("app_loading")
					}
				},
				errcallback: function(){
					_this.getVcode.removeClass("app_loading")
				}
			});
		},
//		checkvericode: function(){
//			var _this = this;
//			GHUTILS.LOAD({
//				url: GHUTILS.API.USER.verify,
//				data: {
//					phone: $("#app_mobile").val(),
//					veriCode: $("#app-vericode").val(),
//					smsType: "forgetlogin"
//				},
//				type: "post",
//				sw: true,
//				callback: function(result) {
//					if (GHUTILS.checkErrorCode(result,_this.tips1)) {
//						$(".steps").hide();
//						$("#app-stepTwo").show();
//					}
//				}
//			});
//		},
		updatepassword: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.USER.updatepassword,
				data: {
					userAcc: $("#app_mobile").html(),
					userPwd: $('#app-pwd').val(),
					vericode: $("#app-vericode").val(),
					platform: "wx",
					wxopenid: GHUTILS.GHLocalStorage.getRaw("moneyopenid")
				},
				type: "post",
				sw: true,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if (GHUTILS.checkErrorCode(result,_this.tips2)) {
						mui.toast("密码修改成功");
						mui.back();
					}
				}
			});
		}
	}
	$(function(){
		var fp = new FORGETPWD();
			fp.init();
	});
})(Zepto);