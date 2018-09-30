/*
 Title:银行卡信息
 Author:fan qiao
 Date:2017-3-2 11:50:00
 Version:v1.0
*/
mui.init();
(function($) {
	var BANKCARD = function(){
//		this.ws = plus.webview.currentWebview();
		return this;
	}
	BANKCARD.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
		},
		pageInit:function(){
			var _this = this;
			GHUTILS.nativeUI.showWaiting()
			GHUTILS.getUserInfo(function(result){
				if(result.islogin){
					GHUTILS.nativeUI.closeWaiting()
					//姓名
					$("#app_name").html(GHUTILS.getLocalUserInfo("name"))
					
					//身份证号
					$("#app_idNumb").html(GHUTILS.getLocalUserInfo("idNumb"))
					
					//银行
					$("#app_bankName").html(GHUTILS.getLocalUserInfo("bankName"))
					
					//储蓄卡号
					$("#app_bankCardNum").html(GHUTILS.getLocalUserInfo("bankCardNum"))
					
					//手机号
					$("#app_userAcc").html(GHUTILS.getLocalUserInfo("bankPhone"))
				}
			},true)
		},		
		bindEvent:function(){
			var _this = this;
			$("#app_delete").on('tap', function(){
				var btnArray = ['取消', '确定'];
				mui.confirm('确定要删除吗？', '删除银行卡', btnArray, function(e) {//根据同卡进出原则，删除银行卡，该银行卡购买的项目到期后仍会返还到原银行卡。
					if (e.index == 1) {
						_this.ifBalance();
					}
				})
			})
		},
		ifBalance: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.usermoneyinfo,
				type: "post",
				sw: true,
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						if(result.balance && result.balance > 0){
							mui.toast('余额为0才可解绑卡！')
						}else{
							_this.removebank();
						}
					}
				}
			})
		},
		removebank: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.USER.removebank+'?investorOid='+GHUTILS.getLocalUserInfo("investorOid"),
				type: "post",
				sw: true,
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						GHUTILS.getUserInfo(function(){
//							mui.fire(plus.webview.getWebviewById(GHUTILS.PAGESID.BANKCARDLIST), "loadData")
//							mui.fire(plus.webview.getWebviewById(GHUTILS.PAGESID.SETTING), "loadData")
							mui.toast("已删除")
							setTimeout(function(){
								mui.back();
							}, 2000)
						})
					}
				}
			})
		}
	}
	$(function(){
		var bc = new BANKCARD();
			bc.init();
	});
//	$(function(){
//		var bc = new BANKCARD();
//			bc.init();
//	});
})(Zepto);