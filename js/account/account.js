/*
Title:我的
Author:fan qiao
Date:2017-7-29 14:40:00
Version:v1.0
*/
(function($) {
	var ACCOUNT = function() {
		this.ws = null;
		this.userInfo = null;
		this.historySY = '--';
		this.totalVal = '--';
		this.yincome = '--';
		this.t0 = '--';
		this.tn = '--';
		this.canuse = 0;
		this.invitecode = null;
		this.expTipNum = 0;
		return this;
	}
	ACCOUNT.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
			this.getData(); //获取数据
			this.bindEvent(); //事件绑定
		},
		pageInit: function() {
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
								setTimeout(function() {
									mui('#app_pullRefresh').pullRefresh().endPulldownToRefresh();
								}, 300);
								setTimeout(function() {
									GHUTILS.getUserInfo(function() {
										_this.getData(true);
									});
								}, 500);
							} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					}
				}
			});		
		},
		getData: function() { 
			var that = this;
			GHUTILS.nativeUI.showWaiting()
			GHUTILS.getUserInfo(function(result){
				if(result.islogin)that.setData(true);
			},true);
		},
		setData: function(ifLogin) {
			var that = this;
			var showMobile = GHUTILS.getLocalUserInfo("userAcc")
			if(showMobile){
				showMobile = showMobile.substr(0,3)+"****"+showMobile.substr(7,4);
				$(".appmy_phone").html(showMobile)
			}
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.useraccount,
				type: "post",
				async: true,
				callback: function(result) {
//					console.log(JSON.stringify(result))
					GHUTILS.nativeUI.closeWaiting()
					if (result.errorCode == 0) {
						that.totalVal = GHUTILS.formatCurrency(result.capitalAmount); //总资产
						that.historySY = GHUTILS.formatCurrency(result.totalIncomeAmount); //累计收益
						that.yincome = GHUTILS.formatCurrency(result.t0YesterdayIncome); //昨日收益
						that.tn = GHUTILS.formatCurrency(result.tnCapitalAmount); //定期持有中金额
						that.t0 = GHUTILS.formatCurrency(result.t0CapitalAmount); //活期期持有中金额
						that.canuse = GHUTILS.formatCurrency(result.applyAvailableBalance); //可用余额
						
						that.invitecode = result.uid;
						if(that.totalVal.length > 20){
							$("#app-totalValue").addClass("app_f16")
						} else if(that.totalVal.length > 14){
							$("#app-totalValue").addClass("app_f18")
						} else if(that.totalVal.length > 11){
							$("#app-totalValue").addClass("app_f24")
						}
						$("#app-totalValue").html(that.totalVal);
						$("#app-historySY").html(that.historySY);
						$("#yesterday-income").html(that.yincome);
						$("#hold-t0").html(that.t0)
						$("#hold-tn").html(that.tn)
						$("#app-canuse").html(that.canuse)
						that.eyeStatus();//小眼睛的状态
					}else if(ifLogin && result.errorCode == 10002){
						GHUTILS.loginOut(function(){
							var cb = {
								cb:"reload",							
							}
							GHUTILS.openLogin(JSON.stringify(cb));
						});
					}else if(result.errorCode == '40004'){
						
					}else if(ifLogin){
						var _msg = result.errorMessage
						if(_msg && _msg.indexOf("(CODE") > 0){
							_msg = _msg.substr(0, _msg.indexOf("(CODE"))
						}
						mui.toast(_msg || "数据更新中，请耐心等待");
					}
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
				}
			});
			
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.mailQueryPage+"?page=1&rows=100&isRead=no",
				type: "post",
				async: true,
				callback: function(result) {
//					console.log(JSON.stringify(result))
					if (result.errorCode == 0) {
						if(result.total>0){
							if(result.total>99){
								$(".appmy_rightcount").html("···")
							}else{
								$(".appmy_rightcount").html(result.total)
							}
							
							$(".appmy_rightcount").removeClass("app_none")
						} else {
							$(".appmy_rightcount").addClass("app_none")
						}
					}else if(ifLogin && result.errorCode == 10002){
						GHUTILS.loginOut(function(){
							var cb = {
								cb:"reload",
								
							}
							GHUTILS.openLogin(JSON.stringify(cb));
						});
					}else if(result.errorCode == '40004'){
						
					}else if(ifLogin){
						var _msg = result.errorMessage
						if(_msg && _msg.indexOf("(CODE") > 0){
							_msg = _msg.substr(0, _msg.indexOf("(CODE"))
						}
						mui.toast(_msg || "数据更新中，请耐心等待");
					}
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
				}
			});
		},
		//元素配置
		elementConfig: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.elementConfig+'?codes=["coupon","invitefriends","myinvitation","myregular"]',
				type: "post",
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result) && result.datas.length > 0){
						result.datas.forEach(function(e, i){
							if(e.isDisplay == "yes"){
								$("#app_"+e.code).removeClass("app_none")
							}else if(!$("#app_"+e.code).hasClass("app_none")){
								$("#app_"+e.code).addClass("app_none");
							}
						})
					}
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
				}
			})
		},

		eyeStatus: function() {
			var _this = this;
//			if(GHUTILS.getLocalCfg("showstatus")) {
			if((localStorage.getItem('showstatus') == 'true' &&  GHUTILS.userInfo.investorOid == localStorage.getItem('investorOid'))||(localStorage.getItem('showstatus') == null)) {
				$('.app-icon-eye').addClass("mui-active");
				$("#app-totalValue").html(_this.totalVal).removeClass("app_f22")
				$("#app-historySY").html(_this.historySY)
				$("#hold-t0").html(_this.t0)
				$("#hold-tn").html(_this.tn)
				$("#yesterday-income").html(_this.yincome)
				$("#app-canuse").html(_this.canuse)
			} else {
				$('.app-icon-eye').removeClass("mui-active");
				$("#app-totalValue").html("****").addClass("app_f22")
				$("#app-historySY").html("****")
				$("#yesterday-income").html("****")
				$("#hold-t0").html("****")
				$("#hold-tn").html("****")
				$("#app-canuse").html("****")
			}
		},
		bindEvent: function() {
			var _this = this;
			//总收益
			$(".app-totalValue-box").off().on("tap", function() {
					GHUTILS.OPENPAGE({
						url: "../../html/account/account-details.html?as=totalValue"
					})
			});
			//消息
			$("#app_mymessage").off().on("tap", function(){
				GHUTILS.OPENPAGE({
					url: "../../html/account/account-message.html"
				})
			})
			$("#app_feedback").off().on("tap", function(){
				GHUTILS.OPENPAGE({
					url: "../setting/setting-feedback.html",
				})
			})
			//设置
			$("#app_setting").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "../../html/setting/setting.html"
				})
			})
			//眼睛
			$(".app-icon-eye").off().on("tap", function(){
				localStorage.setItem('investorOid' , GHUTILS.userInfo.investorOid)
				if($(this).hasClass("mui-active")){
					$(this).removeClass("mui-active");
					$("#app-totalValue").html("****").addClass("app_f22")
					$("#app-historySY").html("****")
					$("#app-canuse").html("****")
					$("#yesterday-income").html("****")
					$("#hold-t0").html("****")
					$("#hold-tn").html("****")
					$("#app-canuse").html("****")
					localStorage.setItem('showstatus' , false)
				} else {
					$(this).addClass("mui-active");
					$("#app-totalValue").html(_this.totalVal).removeClass("app_f22")
					$("#app-historySY").html(_this.historySY)
					$("#app-canuse").html(0.00)
					$("#hold-t0").html(_this.t0)
					$("#hold-tn").html(_this.tn)
					$("#app-canuse").html(_this.canuse)
					$("#yesterday-income").html(_this.yincome)
					localStorage.setItem('showstatus', true)
				}
			})			
			//累计收益
			$(".app-historySY-box").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "account-income.html",
					id: "income"
				})				
			});		

			//活期投资
			$("#app_invest").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "../../html/product-t0/product-t0-detail.html",
					extras: {
						productOid: JSON.parse(localStorage.getItem("productInfo")).productOid || ''
					}
				});	
			})
				

			//活期赎回
			$("#app_redeem").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "../../html/account/account-product-t0-redeem.html",
					extras: {
						productOid: JSON.parse(localStorage.getItem("productInfo")).productOid || '',
						productName: JSON.parse(localStorage.getItem("productInfo")).productName || ''
					}
				});
			})
			
			//活期资金明细
			$("#app_t0DealDetail").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "../../html/account/account-product-t0-deal.html",
					extras: {
						productOid: JSON.parse(localStorage.getItem("productInfo")).productOid || '',
						tabid: '0'
					}
				});
			})

			$("#app-applying-box").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "../../html/account/account-orderlist.html?as=" + "item2mobile",
					extras: {
						"tabid": "applying"
					}
				})
			});

			$("#app-holding-box").off().on("tap", function() {
				GHUTILS.OPENPAGE({
					url: "../../html/account/account-orderlist.html",
					extras: {
						"tabid": "holding"
					}
				})
			});
			
			//我的邀请
			$("#app_invitefriends").off().on("tap", function() {
				if(GHUTILS.getloginStatus(true)){
					GHUTILS.OPENPAGE({
						url: "account-toinvite.html"
					})
				}
			});

			//我的优惠卷
			$("#app_coupon").off().on("tap", function() {
				if(GHUTILS.getloginStatus(true)){
					GHUTILS.OPENPAGE({
						url: 'account-coupon.html',
					})
				}
			})

			//我的活期
			$("#app_prot0").off().on("tap", function() {
				if(GHUTILS.getloginStatus(true)){
					GHUTILS.OPENPAGE({
						url: "account-product-t0-orderlist.html",
					});
				}
			})

			//我的定期
			$("#app_protn").off().on("tap", function() {
				if(GHUTILS.getloginStatus(true)){
					GHUTILS.OPENPAGE({
						url: "account-orderlist.html",
					});
				}
			})
			
			//充提记录
			$("#app_record").off().on("tap",function() {
				if(GHUTILS.getloginStatus(true)) {
					GHUTILS.OPENPAGE({
						url:"account-deposit-widthdraw-record.html",
					})
				}
			})
			
			//交易明细
			$("#app_detail").off().on("tap",function() {
				if(GHUTILS.getloginStatus(true)) {
					GHUTILS.OPENPAGE({
						url:"account-deal.html",
					})
//					GHUTILS.nativeUI.showWaiting();
				}
			})
			//提现
			$("#app-accountWithdraw").off().on("tap", function() {
				GHUTILS.getUserInfo(function(){
					if(GHUTILS.checkDepWit()) {
						GHUTILS.OPENPAGE({
							url: "../../html/account/account-withdraw.html"
						})
					}
				}, true)
			})
			
			//充值
			$("#app-accountDeposit").off().on("tap", function() {
				GHUTILS.getUserInfo(function(){
					if(GHUTILS.checkDepWit()) {
						console.log(GHUTILS.getLocalUserInfo('bankCardNum'))
						GHUTILS.OPENPAGE({
							url: "../../html/account/account-deposit.html"
						})
					}
				}, true)
			});
			//关于我们
			$("#app_about").off().on("tap", function() {
				if(GHUTILS.getloginStatus(true)){
					GHUTILS.OPENPAGE({
//						url: "../setting/setting-about-us.html"
						url: "../setting/setting-about-list.html"
					})
				}
			})
//			$(".app-expgold").off().on("tap", function() {
//				if ($(this).hasClass("data-role")) {
//					if (localStorage.getItem('expCheck') > 0) {
//						localStorage.setItem('expCheck', '0');
//						localStorage.setItem('expNum', _this.expTipNum);
//					}
//				}
//				GHUTILS.OPENPAGE({
//					url: "../../html/account/account-expgold.html"
//				})
//			})
			
			//连接入口
			GHUTILS.listLinks();

//			GHUTILS.getHotline(false, $("#app_tel_link"))

		},
		//提现获取持有中产品
		getProt0list: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0list,
				type: "post",
				sw: false,
				callback: function(result) {
					console.log("1."+JSON.stringify(result))
					if(result && result.errorCode == 0){
						if(result.holdingDetails.rows.length > 0){
							_this.gett0detail(result.holdingDetails.rows[0].productOid);
						}else{
							$("#app-accountDeposit").removeClass("app_loading")
							var btnArray = ['取消', '存活期'];
							mui.confirm('您暂无可提现的活期产品', '', btnArray, function(e) {
								if (e.index == 1) {
									mui.fire(plus.webview.getLaunchWebview(), "showtab",{
										tabindex: 1,
										elm:'app_productt0'
									});
								}
							})
						}
					}else if(result.errorCode == 10002){
					
						$("#app-accountDeposit").removeClass("app_loading")
						GHUTILS.loginOut(function(){
							var cb = {
								cb:"reload",
							}
							GHUTILS.openLogin(JSON.stringify(cb));
						});
					}else if(result.errorCode == '40004'){
						
						$("#app-accountDeposit").removeClass("app_loading")
						
					}else{
					
						mui.toast(result.errorMessage)
						$("#app-accountDeposit").removeClass("app_loading")
					}
				},
				errcallback: function(){
					$("#app-accountDeposit").removeClass("app_loading")
				}
			});
		},
		//活期产品详情
		gett0detail: function(oid){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.TARGET.gett0detail+"?oid="+oid,
				type: "post",
				sw: false,
				callback: function(result) {
					console.log("2."+JSON.stringify(result))
					if(result && result.errorCode == 0){
						if(!result.investMin){
							result.investMin = 0
						}
						_this.prot0detail(oid, result.productName, result.isOpenRemeed, Number(result.incomeCalcBasis), result.investMin, HOST+result.serviceFiles[0].furl, HOST+result.investFiles[0].furl, result.productCode)
					}else if(result.errorCode == 10002){
						
						$("#app-accountDeposit").removeClass("app_loading")
						GHUTILS.loginOut(function(){
							var cb = {
								cb:"reload",
							
							}
							GHUTILS.openLogin(JSON.stringify(cb));
						});
					}else if(result.errorCode == 40004){
					
						$("#app-accountDeposit").removeClass("app_loading")
						
					}else{
					
						mui.toast(result.errorMessage)
						$("#app-accountDeposit").removeClass("app_loading")
					}
				},
				errcallback: function(){
					$("#app-accountDeposit").removeClass("app_loading")
				}
			})
		},
		//我的活期产品详情
		prot0detail: function(productOid, productName, isOpenRemeed, incomeCalcBasis, purchasingAmount, serviceFiles, investFiles, productCode){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.prot0detail +"?productOid=" + productOid,
				data: {},
				type: "post",
				async: false,
				callback: function(result) {
					console.log("3."+JSON.stringify(result))
					$("#app-accountDeposit").removeClass("app_loading")
					if (GHUTILS.checkErrorCode(result)) {
						if(isOpenRemeed == "NO"){
							
							var btnArray = ['取消', '存活期'];
							mui.confirm('您暂无可提现的活期产品', '', btnArray, function(e) {
								if (e.index == 1) {
									mui.fire(plus.webview.getLaunchWebview(), "showtab",{
										tabindex: 1,
										elm:'app_productt0'
									});
								}
							})
						}else if(result.singleDayRedeemCount && result.dayRedeemCount >= result.singleDayRedeemCount){
							mui.toast("产品已达当日最高赎回限制"+result.singleDayRedeemCount+"笔!")
							
							return
						}else{
							GHUTILS.OPENPAGE({
								url:"../../html/account/account-product-t0-redeem.html",
							    extras:{
									productOid: productOid,
									productName: productName,
									redeem: result.redeemableHoldVolume,
									minRredeem: result.minRredeem,
									maxRredeem: result.maxRredeem,
									additionalRredeem: result.additionalRredeem,
									dailyNetMaxRredeem: result.dailyNetMaxRredeem,
									singleDailyMaxRredeem: GHUTILS.Fsub(result.singleDailyMaxRedeem, result.dayRedeemVolume),
									netMaxRredeemDay: result.netMaxRredeemDay,
									singleDailyMaxRedeem: result.singleDailyMaxRedeem,
									investFiles: investFiles,
									serviceFiles: serviceFiles,
									productCode: productCode,
									incomeCalcBasis: incomeCalcBasis,
									purchasingAmount: purchasingAmount
								}
							})
						}
					}else{
					
					}
				},
				errcallback: function(){
					$("#app-accountDeposit").removeClass("app_loading")
				}
			});
		}
	}
	$(function() {

		var ac = new ACCOUNT();
		ac.init();
	});
})(Zepto);
