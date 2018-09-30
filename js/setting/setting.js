/*
 Title:设置
 Author:fan qiao
 Date:2017-3-6 16:56:00
 Version:v1.0
*/
mui.init();
(function($) {
	var SETTING = function() {
		this.ws = null;
		this.userInfo = null;
		return this;
	}
	SETTING.prototype = {
		init: function() {
			var _this = this
//			GHUTILS.setUserAgent();
			this.pageInit(); //页面初始化
			this.bindEvent(); //事件绑定
			//this.getData();//获取数据			
		},
		pageInit: function() {
			var _this = this;
			GHUTILS.nativeUI.showWaiting()
			GHUTILS.getUserInfo(function(){
				_this.loadData(); //获取数据
			})
			
			GHUTILS.getHotline($("#app_hotlineNumber"), $("#app_hotline"))
		},
		loadData: function() {
			var _this = this;
            //实名认证
			var realNameDisp = GHUTILS.getLocalUserInfo('name') || "";
			if(!realNameDisp){
				$('#realName').html('未认证');
				$('#realNameDiv').addClass('mui-navigate-right');
			} else {
				$('#realNameDiv').removeClass('mui-navigate-right');
				$('#realName').html(realNameDisp);
			}
			//手机认证
			var userAcc = GHUTILS.getLocalUserInfo('userAcc') || "";
			if(userAcc){
				userAcc = userAcc.substr(0,3)+"****"+userAcc.substr(7,4);
			}
			$('#showMobile').html(userAcc);
			//银行卡
			var bankName = GHUTILS.getLocalUserInfo('bankName') || "";
			if(bankName){
				$("#app_banks").html("1张")
			}else{
				$("#app_banks").html("未绑定")
			}
			GHUTILS.nativeUI.closeWaiting()
		},

		bindEvent: function() {
			var _this = this;
			//初始化页面连接
			GHUTILS.listLinks();			
			$("#app-realname").on('tap', function(){
				GHUTILS.getUserInfo(function(){
					if(!GHUTILS.getLocalUserInfo('paypwd')){
						mui.toast("请先设置支付密码")
						setTimeout(function(){
							GHUTILS.OPENPAGE({
								url: "../../html/usermgmt/usermgmt-dealpwd.html",
								extras: {
									type: "set",
									bankadd: true
								}
							})
						}, 2000)
					}else if(!GHUTILS.getLocalUserInfo('name')){
						GHUTILS.OPENPAGE({
							url: "../../html/usermgmt/usermgmt-bankcard-add.html"
						})
					}
				})
			})			

			$("#app_bankcard").on('tap', function(){
				GHUTILS.OPENPAGE({
					url: "../../html/usermgmt/usermgmt-bankcard-list.html"
				})
			})
			
			$('#app-confirm').on('tap',function(){

				GHUTILS.loginOut(function(){
					GHUTILS.OPENPAGE({
						url:"../../html/usermgmt/usermgmt-login.html"
					});				
				});
			});
			
			$("#app_serviceagreement").off().on("tap", function(){
				_this.getProtocolInfo();
			})
		},
		//元素配置
		elementConfig: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.elementConfig+'?codes=["commonproblem","serviceagreement","aboutus","hotline"]',
				type: "post",
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result) && result.datas.length > 0){
						result.datas.forEach(function(e, i){
							switch (e.code){
								case "commonproblem" : 
									$("#app_commonproblem").off().on("tap", function(){
										var url = "../../html/setting/setting-problems.html", id = "setting-problems.html", extras = {};
										if(e.content){
											url = "../../html/index/index-linkpage.html"
											extras = {
												links:e.content,
												title:"常见问题"
											}
										}
										GHUTILS.OPENPAGE({
											url:url,
											extras:extras
										})
									})
									break;
								case "serviceagreement" : 
									$("#app_serviceagreement").off().on("tap", function(){
										if(e.content){
											GHUTILS.OPENPAGE({
												url:"../../html/index/index-linkpage.html",
												extras:{
													links:e.content,
													title:"沪深理财平台服务协议"
												}
											})
										}else{
											_this.getProtocolInfo();
										}
									})
									break;
								case "aboutus" : 
									$("#app_aboutus").off().on("tap", function(){
										GHUTILS.OPENPAGE({
											url:"../../html/setting/setting-about-us.html"
										})
									})
									break
								case "hotline" : 
									$("#app_hotlineNumber").html(e.content)
									$("#app_hotline").off().on("tap", function(){
										GHUTILS.phoneCall(e.content.trim().replace(/\-/g,''));
									})
									break
								default : break
							}
						})
					}
				}
			})
		},
		//获取协议信息
		getProtocolInfo: function(){
			var _this = this;
			GHUTILS.OPENPAGE({
				url:"../../html/index/content_pages.html",
				extras:{
					title: "沪深理财平台服务协议",
					typeId: "PLATFORM"
				}
			})
//			GHUTILS.LOAD({
//				url: GHUTILS.API.CMS.getProtocolInfo+"?typeId=PLATFORM",
//				type: "post",
//				sw: true,
//				callback: function(result) {
//					if(GHUTILS.checkErrorCode(result)){
//						GHUTILS.OPENPAGE({
//							url:"../../html/index/content_pages.html",
//							extras:{
//								title: "沪深理财平台服务协议",
//								content: encodeURIComponent(result.content)
//							}
//						})
//					}
//				}
//			})
		}
	}
	$(function() {
		var sett = new SETTING();
		sett.init();
	});
})(Zepto);
