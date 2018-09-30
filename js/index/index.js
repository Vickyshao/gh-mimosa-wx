/*
 Title:首页
 Author:yang sen
 Date:2016-6-4 18:31:00
 Version:v1.0
*/

(function($) {
	var HomepageSub = function() {
		this.recommendObj = {};
		this.index = 0;
		this.flag = true;
		return this;
	}
	HomepageSub.prototype = {
		
		domInit:function(){
			var _this = this;
			
			//for (var i = 0; i < homepageCfg.length; i++) {
			var cfg = homepageCfg[_this.index];
			_this.demoTmp(cfg,_this.index);

			//}
	
		},
		demoTmp:function(cfg,index){
			var _this = this;
			//console.log(JSON.stringify(cfg));
			if( index < homepageCfg.length){
				$.get(cfg.path + ".html",function(templates){
					var temp = $(templates).filter("#app_"+ cfg.module +"_template").html();
					$("#app_content_box").append(temp);
					require([cfg.path],function(){
						_this.domInit();
					});
				});
				_this.index++;
			}else{
				_this.init();
			}
		},
		init: function() {
			GHUTILS.getOpenId();
			this.pageInit();
			this.getOnlineData();
			this.recommend();   //获取定期、活期数据
//			this.getData(); //刷新首页数据
			this.bindEvent();
 		},
		pageInit: function() {
			var _this = this;
			var starPage = localStorage.getItem("startPages");
			if (starPage) {
				var bannerImg = document.getElementById("app_banner_slider_img");
				var DefImg = new Image();
				DefImg.src = bannerImg.src;
				DefImg.onload = function() {
					//setTimeout(function() {
						//plus.navigator.closeSplashscreen();
						$(".mui-content").addClass("app_pages_show");
						plus.nativeUI.closeWaiting();
						
						//未登录不检测手势密码，签到，直接检测版本更新
						_this.isLogin();
					//}, 100)
				}
			}else{
				$(".mui-content").addClass("app_pages_show");
				
				//引导页未点击，新app未登录，不检测签到，手势密码，版本更新，由引导页点击事件检测版本更新
//				mui.fire(plus.webview.getLaunchWebview(), "indexLoaded");
			}

			_this.pullRefreshPush();
			GHUTILS.listLinks();

		},
		pullRefreshPush: function() {
			var _this = this;
			
			//下拉刷新
			mui.init({
				pullRefresh: {
					indicators: false,
					container: "#app_pullRefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
					down: {
						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						callback: function() {
									_this.getOnlineData(); //获取数据
									_this.recommend(); //刷新首页产品
//									_this.getData(); //刷新首页数据
								
							} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					}
				}
			});
		},
		getOnlineData: function() {
			var _this = this;
			
			var imgH = $("#app_banner_slider").find("img").eq(0).height();
			if(imgH != 0){
				$("#app_banner_sliderbox").height(imgH);
			}
			
			var actimgH = $("#app_activity_slider").find("img").eq(0).height();
			if(actimgH != 0){
				$("#app_activity_sliderbox").height(actimgH + 30);
			}
			GHUTILS.LOAD({
					url: GHUTILS.API.CMS.gethome+'?channelOid='+cmsChannelOid,
					data: {
						//username: _this.nickName.val()
					},
					type: "post",
					async: true,
					callback: function(result) {
						if(GHUTILS.checkErrorCode(result)){
							var result = result.info
							if(result && result.banner && result.actcarousel){
								setTimeout(function() {
										mui('#app_pullRefresh').pullRefresh().endPulldownToRefresh();
								}, 300);
								setTimeout(function() {
										$.each(result, function(key,data) {
											//console.log(key);
											$[key](data);
										});
								}, 500);
							}
						}
						
					},
					errcallback: function() {
						mui.toast("网络错误，请稍后再试")
					}
				}
			);
		},
		getData: function() {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.dealDate,
				type: "post",
				callback: function(result) {
//					console.log(JSON.stringify(result))
//					if (GHUTILS.checkErrorCode(result)) {
						var amount = 0;
						var person = 0;
						if(result.totalLoanAmount>10000){
							amount = GHUTILS.formatCurrency(result.totalLoanAmount/10000)
							$("#totalLoanAmount").html(amount+'<span class="app_f1x">万</span>')
						} else if(result.totalLoanAmount>100000000){
							amount = GHUTILS.formatCurrency(result.totalLoanAmount/100000000)
							$("#totalLoanAmount").html(amount+'<span class="app_f1x">亿</span>')
						} else {
							amount = GHUTILS.formatCurrency(result.totalLoanAmount)
							$("#totalLoanAmount").html(amount)
						}
						if(result.registerAmount>10000){
							person = GHUTILS.formatCurrency(result.registerAmount/10000)
						} else if(result.registerAmount>100000000){
							person = GHUTILS.formatCurrency(result.registerAmount/100000000)
						} else {
							$("#totalAmount").html(result.registerAmount)
						}
						
//					}
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
				}
			});
		},
		recommend:function(){
			var _this = this;
			//活期产品
			GHUTILS.LOAD({
				url: GHUTILS.API.TARGET.getproductlist,
				params: {
//					channeOid: channelOid,
//					productLabel: "7"
					channelOid: channelOid,
					page: 1,
					rows: 6,
					expArorStart: "",
					expArorEnd: "",
					durationPeriodDaysStart: "",
					durationPeriodDaysEnd: ""
				},
				type: "post",
				//sw: true,
				callback: function(result) {
					//console.log("首页列表"+JSON.stringify(result))
					if (GHUTILS.checkErrorCode(result)) {
						_this.recommendObj = []
//						_this.recommendObj.tn = []
//						_this.recommendObj.t0 = []
						for (var i = 0; i < result.rows.length; i++) {
							_this.recommendObj.push(result.rows[i]);
//							if(result.rows[i].type == "PRODUCTTYPE_01"){
//								_this.recommendObj.tn.push(result.rows[i]);
//							}
//							if(result.rows[i].type == "PRODUCTTYPE_02"){
//								_this.recommendObj.t0.push(result.rows[i]);
//							}
						}
						$["productlist"](_this.recommendObj);
						if(result.rows && result.rows.length > 0){
							$("#totalAmount").html(result.rows[0].purchaseNum)
						}
					}
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
				}
			});
		},
		//获取协议信息
		getProtocolInfo: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.getProtocolInfo+"?typeId=PRODUCT",
				type: "post",
				sw: true,
				callback: function(result) {
					if(GHUTILS.checkErrorCode(result)){
						GHUTILS.OPENPAGE({
							url:"../../html/index/content_pages.html",
							extras:{
								title: "安全保障",
								content: encodeURIComponent(result.content)
							}
						})
					}
				}
			})
		},
		isLogin: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.islogin,
				type: "post",
				callback: function(result){
					if(GHUTILS.checkErrorCode(result)){
						if(!result.islogin){
							mui.fire(plus.webview.getLaunchWebview(), "indexLoaded");
						}
					}
				}
			})
		},
		//元素配置
		elementConfig: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.elementConfig+'?codes=["beginnersguide","bankingsupervision"]',
				type: "post",
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result) && result.datas.length > 0){
						result.datas.forEach(function(e, i){
							switch (e.code){
								case "beginnersguide" : 
									$("#app_xin").off().on("tap", function(){
										var url = "../../html/index/index-shortcut/index-guide.html", id = "", extras = {};
										if(e.content){
											url = "../../html/index/index-linkpage.html"
											extras = {
												links:e.content,
												title:"新手指南"
											}
										}
										GHUTILS.OPENPAGE({
											url:url,
											extras:extras
										})
									})
									break
								case "bankingsupervision" : 
									$(".app_safe_link").off().on('tap',function(){
										var url = "../../html/index/index-shortcut/index-insurance.html", id = GHUTILS.PAGESID.INSURANCE, extras = {};
										if(e.content){
											url = "../../html/index/index-linkpage.html"
											extras = {
												links:e.content,
												title:"安全保障"
											}
										}
										GHUTILS.OPENPAGE({
											url:url,
											extras:extras
										})
									})
									break
								default : break
							}
						})
					}
				}
			})
		},
		getSignIn:function(){
			var _this = this;
			//获得签到活动
			GHUTILS.LOAD({
				url:GHUTILS.API.CHA.getEventInfo,
				data:{
					eventType:'sign',
					couponType:'coupon'
				},
				type:'post',
				callback:function(result){
					console.log("签到活动="+JSON.stringify(result));
					if(result.errorCode == 0 && result.money != null){
						//提示签到或已签到
						GHUTILS.LOAD({
							url: GHUTILS.API.signIn.checkSign,
							params: {},
							type: "post",
							callback: function(result) {
								
								console.log(result)
								
								if(result.errorCode == 0) {
									_this.showDailog("#app_show_sigin");
									
								} else if(result.errorCode == -1) {
									_this.getSignInInfo(false);
								} 
							}
						});
					}else{
						//提示签到或已签到
						GHUTILS.LOAD({
							url: GHUTILS.API.signIn.checkSign,
							params: {},
							type: "post",
							callback: function(result) {
								
								console.log(result)
								
								if(result.errorCode == 0) {
									_this.showDailog("#app_show_sigin");
									
								} else if(result.errorCode == -1) {
									_this.showDailog("#app_show_siginend");
								} 
							}
						});
					}
				}
			})
		},
		bindEvent: function() {
			var _this = this;
			
			GHUTILS.listLinks();
			
			$("#app_xin").off().on('tap', function() {

//				if (GHUTILS.linkChackLogin(this.id, _this.ws.id)) {
					GHUTILS.OPENPAGE({
						url: "../../html/index/index-shortcut/index-guide.html",
					});
//				}
			})
//			_this.elementConfig();
			$("#app-safe").off().on('tap', function() {

//				if (GHUTILS.linkChackLogin(this.id, _this.ws.id)) {
					GHUTILS.OPENPAGE({
							url: "../../html/index/index-shortcut/index-insurance.html",
						});
//				}
			})
			

			$("#app-about").on("tap", function() {
//				if (GHUTILS.linkChackLogin(this.id, _this.ws.id)) {
					GHUTILS.OPENPAGE({
						url: "../../html/index/index-shortcut/index-about.html",
					})
//				}
			});
			
			//每日签到
			$("#app-signIn").on("tap", function() {
				GHUTILS.getUserInfo(function(result){
					//console.log(result)
					
					if(result.islogin){
						_this.getSignIn()
					}
					
					
				},true);
				
			});
			
			//签到
			$("#app_signIn_btn").on("tap", function() {
				_this.dosigIn();				
			});
			
			
			$("#app-accountDeal").off().on('tap', function() {
				GHUTILS.checkLogin(function(){
					GHUTILS.OPENPAGE({
						url: "../../html/account/account-deal-parent.html",
					})
				})
			});
			
			$(".app_signIn_close").off().on("click",function(){
				$(".app_signIn_dialog").removeClass("app_active app_show");
				$(".app_signIn_money").html("0");
			});
			
			
			//签到成功，马上使用
			$("#app_signIn_use").on("tap",function(){
				GHUTILS.OPENPAGE({
					url: "../../html/product-tn/product-tn-list.html",
				});
			});
			
			$(".app_safe_link").off().on('tap', function() {
				GHUTILS.OPENPAGE({
					url: "index-shortcut/index-insurance.html"
				});
			})
		},
		showDailog:function(elm,obj){
			
			$(".app_signIn_dialog").removeClass("app_active app_show");
			$(elm).addClass("app_active");
			setTimeout(function(){
				$(elm).addClass("app_show");
			},100);
			
			
		},
		dosigIn:function(){
			var _this = this;
			if(_this.flag == false){
				return;
			}
			_this.flag = false;
			GHUTILS.LOAD({
				url: GHUTILS.API.signIn.sign,
				type: "post",
				callback: function(result) {
					if(result.errorCode == 0) {
						
						console.log(result);
						
						_this.getSignInInfo(true);
						_this.flag = true;
					} else {
						console.log("签到信息=" + result.errorMessage);
					}
				}
			})
		},
		getSignInInfo:function(statics){
			var _this = this;
			//获取金额
			GHUTILS.LOAD({
				url:GHUTILS.API.CHA.getEventInfo,
				data:{
					eventType:'sign',
					couponType:'coupon'
				},
				type:'post',
				callback:function(result){
					console.log("显示金额="+JSON.stringify(result));
					if(result.errorCode == 0 && result.money !=null){
						var temp = result.money.toFixed(2);
						$(".app_signIn_money").html(temp);
						var elm = '';
						if(statics){
							elm = "#app_show_siginsuccess";
						}else{
							elm = "#app_show_siginyse";
						}
						
						_this.showDailog(elm);
					}else{
						_this.showDailog("#app_show_siginend");
					}
				}
			})
		},
	}
	$(function() {
		var hpvw = new HomepageSub();
		hpvw.domInit();
		
	});
})(Zepto);
