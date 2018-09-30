/*
 Title:登录密码
 Author:fan qiao
 Date:2017-3-2 14:11:00
 Version:v1.0
*/
mui.init();
(function($) {

	var PWD = function(){
		this.seq = null;
		this.tips = "#app_tips_box";
		this.param = ''
//		this.ws = plus.webview.currentWebview();
		this.ws = GHUTILS.parseUrlParam(window.location.href);
		return this;
	}
	PWD.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			_this.param = GHUTILS.parseUrlParam(window.location.href)
			switch(_this.param.type){

				case "set" : 
					$("#app-stepThree").removeClass("app_none")
					$("#app_confirm_div").removeClass("app_none")
					$("#app_title").html("设置")
					break
				case "modify" : 
					$("#app-stepOne").removeClass("app_none")
					$("#app_stepOne_next_div").removeClass("app_none")
					$("#app_title").html("修改")
					break
				default : 
					break
			}
			
		},		
		getData:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;
			$('#app_stepOne_next').off().on('tap',function(){
				$(_this.tips).html("&nbsp;")
				if(GHUTILS.validate("app-stepOne")){
					$('#app-oriPwd').blur()
					_this.getSeq()
				}
			});
			
			$('#app_confirm').off().on('tap',function(){
				$(_this.tips).html("&nbsp;")
				if(_this.param.type == "set"){
					if(GHUTILS.validate("app-stepThree")){
						_this.setPassword($('#app-userPwd').val(), "设置")
					}
				}else{
					if(GHUTILS.validate("app-stepTwo")){
						if($("#app-userPwdNew").val() == $("#app-oriPwd").val()){
							GHUTILS.showError("新密码不能与原密码相同", _this.tips)
						}else{
							_this.resetPassword($('#app-userPwdNew').val(), "修改");
						}
					}
				}
			});
			
//			GHUTILS.inputFocus("#app-oriPwd");
//			
//			GHUTILS.inputFocus("#app-userPwdNew");
//			
//			GHUTILS.inputFocus("#app-userPwdNewConfirm");
//			
//			GHUTILS.inputFocus("#app-userPwd");
//			
//			GHUTILS.inputFocus("#app-userPwdConfirm");
		},
		getSeq: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.USER.seq,
				data: {
					platform: "wx",
					userPwd: $('#app-oriPwd').val()
				},
				type: "post",
				sw: true,
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result,_this.tips)) {
						$("#app-stepOne").addClass("app_none")
						$("#app_stepOne_next_div").addClass("app_none")
						$("#app-stepTwo").removeClass("app_none")
						$("#app_confirm_div").removeClass("app_none")
					}
				}
			});
		},
		setPassword: function(userPwd, message){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.USER.setpassword,
				type: "post",
				sw: true,
				data: {
					userPwd: userPwd,
					platform: "wx",
					wxopenid: GHUTILS.GHLocalStorage.getRaw("moneyopenid")
				},
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result,_this.tips)) {
						_this.doLogout(message);
					}
				}
			});
		},
		resetPassword: function(userPwd, message){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.USER.modifypassword,
				type: "post",
				sw: true,
				data: {
					oldUserPwd: $('#app-oriPwd').val(),
					userPwd: userPwd,
					platform: "wx",
					wxopenid: GHUTILS.GHLocalStorage.getRaw("moneyopenid")
				},
				callback: function(result) {
					if (GHUTILS.checkErrorCode(result,_this.tips)) {
						_this.doLogout(message);
					}
				}
			});
		},
		doLogout: function(message){
			var _this = this;
			GHUTILS.loginOut(function(){
				mui.toast("密码已"+message+"，请重新登录！");
//				_this.ws.opener().close("none",0);
//				plus.webview.getWebviewById(GHUTILS.PAGESID.SETTING).close("none",0);
//				var wg = plus.webview.getLaunchWebview();
//				mui.fire(wg, "showtab", {
//					tabindex: 0
//				});
				setTimeout(function(){
					GHUTILS.OPENPAGE({
						url:"../../html/usermgmt/usermgmt-login.html",
						extras:{
							pwd: true
						}
					})
				}, 2000)
			})
		}
	}
	$(function(){
		var pwd = new PWD();
			pwd.init();
	});
})(Zepto);
