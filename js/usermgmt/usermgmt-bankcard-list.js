/*
 Title:银行卡信息
 Author:fan qiao
 Date:2017-3-2 11:18:00
 Version:v1.0
*/
mui.init();
(function($) {
	var BANKCARD = function(){
		return this;
	}
	BANKCARD.prototype = {
		init:function(){
			var _this = this;
//			GHUTILS.setUserAgent();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
		},
		pageInit:function(){
			var _this = this;
			GHUTILS.nativeUI.showWaiting()
			GHUTILS.getUserInfo(function(){
				_this.getData();//获取数据
			})
		},		
		getData:function(){
			var _this = this;
			$("#app_banklist").html(_this.getBankList())
			GHUTILS.nativeUI.closeWaiting()
			$(".app_bank_list_owned").on('tap', function(){
				GHUTILS.OPENPAGE({
					url: "../../html/usermgmt/usermgmt-bankcard-edit.html"
				})
			})
		},
		bindEvent:function(){
			var _this = this;
			$(".app_bank_list_add").on('tap', function(){
				if(!GHUTILS.getLocalUserInfo('paypwd')){
					GHUTILS.toast('请先设置支付密码');
					setTimeout(function(){
						GHUTILS.OPENPAGE({
							url: "../../html/usermgmt/usermgmt-dealpwd.html",
							extras: {
								type: "set",
								bankadd: true
							}
						})
					}, 2000)
				}else{
					GHUTILS.OPENPAGE({
						url: "../../html/usermgmt/usermgmt-bankcard-add.html",
						extras: {
							actionUrl:'../../html/usermgmt/usermgmt-bankcard-list.html',
							actionParam:JSON.stringify(GHUTILS.parseUrlParam(window.location.href))
						}
					})
				}
			})
		},
		getBankList: function(){
			var _this = this, html = '', bankname = GHUTILS.getLocalUserInfo("bankName"), bankCardNum = GHUTILS.getLocalUserInfo("bankCardNum");
			if(bankname && bankCardNum){
				$(".app_bank_list_add").addClass("app_none")
				GHUTILS.LOAD({
					url: GHUTILS.API.CMS.bankCardFind+'?codes=["'+bankcodetrans[bankcode[bankname]]+'"]',
					type: "post",
					async: false,
					sw: true,
					callback: function(result){
						console.log(JSON.stringify(result))
						if(GHUTILS.checkErrorCode(result,_this.tips)){
							GHUTILS.nativeUI.closeWaiting();
							if(result.datas && result.datas.length > 0){
								var bank = result.datas[0]
								if(bank){
									html = '<div class="app_bank_list_owned" style="background-image:'+bank.bgColor+'"><div class="app_bank_list_icondiv"><div class="app_bank_list_icon"><img src="'+
										bank.bankLogo+'" class="app_w100p"></div></div><div class="app_bank_list_detaildiv"><div>'+
										bankname+'</div><div class="app_f10">单笔可支付'+
										bank.payOneLimit+'元</div><div class="app_mt10">'+
										bankCardNum+'</div></div></div>'
								}else{
									mui.toast("数据更新中，请稍后...")
								}
							}else{
								mui.toast("数据更新中，请稍后...")
							}
						}
					}
				})
			}else{
				$(".app_bank_list_add").removeClass("app_none")
			}
			return html
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