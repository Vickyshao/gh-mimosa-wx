/*
 Title:用户协议
 Author:fan qiao
 Date:2017-3-3 17:48:00
 Version:v1.0
*/
(function($) {
	var LINKPAGE = function() {
		this.ws = null;
		return this;
	}
	LINKPAGE.prototype = {
		init: function() {
//			GHUTILS.setUserAgent();
			this.pageInit(); //页面初始化
			this.bindEvent(); //事件绑定
			this.getData(); //获取数据
		},
		pageInit: function() {
			var _this = this;
//			var ws = plus.webview.currentWebview();
			var ws = GHUTILS.parseUrlParam(window.location.href);
			ws.links = HOST+ decodeURIComponent(ws.links)
			document.getElementById("app_title").innerHTML = decodeURIComponent(ws.title);
//			document.getElementById("app_title").innerHTML = decodeURIComponent(decodeURIComponent(ws.title));
			if (!ws.contentId) {
				mui.init({
					subpages: [{
						url: ws.links ,
						styles: {
							top: '44px',
							bottom: -6
						}
					}]
				})
			} else if (ws.contentId == "app-register") {
				$("#app-register").removeClass("app_none");
			} else if (ws.contentId == "app-recharge") {
				$("#app-recharge").removeClass("app_none");
			} else if (ws.contentId == "app-product") {
				$.get(ws.links,function(templates){
					var begin = templates.indexOf('<body');
					var end = templates.indexOf('</body>');
					var temp = templates.substr(begin, end);
//					var temp = $(templates).filter("body").html();
					$("#app-product").html(temp);
				});
				$("#app-product").removeClass("app_none");
			} else if (ws.contentId == "app-investFiles") {
				GHUTILS.getUserInfo(function(){
					$.get(ws.links,function(templates){
					var begin = templates.indexOf('<body');
					var end = templates.indexOf('</body>');
					var temp = templates.substr(begin, end);
					temp = temp.replace('#incomeCalcBasis',ws.incomeCalcBasis)
//							   .replace('#incomeCalcBasis1',ws.incomeCalcBasis)
//							   .replace('#investMin',ws.investMin)
//							   .replace('#investMin1',ws.investMin)
//							   .replace('#singleDailyMaxRedeem',ws.singleDailyMaxRedeem)
							   .replace('#username',GHUTILS.getLocalUserInfo('name') || "")
							   .replace('#userAcc',GHUTILS.getLocalUserInfo('userAcc') || "")
							   .replace('#idNumb',GHUTILS.getLocalUserInfo('idNumb') || "")
//							   .replace('#productFullName',ws.productName)
					$("#app-product").html(temp);
				});
				$("#app-product").removeClass("app_none");
				},true)
			} else if (ws.contentId == "app-serviceFiles") {
				$.get(ws.links,function(templates){
					var begin = templates.indexOf('<body');
					var end = templates.indexOf('</body>');
					var temp = templates.substr(begin, end);
//					temp = temp.replace('#username',GHUTILS.getLocalUserInfo('name'))
//							   .replace('#identify_code',GHUTILS.getLocalUserInfo('idNumb'))
//							   .replace('#year',GHUTILS.currentDate().split("-")[0])
//							   .replace('#month',GHUTILS.currentDate().split("-")[1])
//							   .replace('#day',GHUTILS.currentDate().split(" ")[0].split("-")[2])
//							   .replace('#accountname',GHUTILS.getLocalUserInfo('name'))
//							   .replace('#bankName',GHUTILS.getLocalUserInfo('bankName'))
//							   .replace('#bankCardNum',GHUTILS.getLocalUserInfo('bankCardNum'))
					$("#app-product").html(temp);
				});
				$("#app-product").removeClass("app_none");
			} else if (ws.contentId == "app-files") {
				$.get(ws.links,function(templates){
					var begin = templates.indexOf('<body');
					var end = templates.indexOf('</body>');
					var temp = templates.substr(begin, end);
					temp = temp.replace('#productName',decodeURIComponent(ws.productName))
							   .replace('#incomeCalcBasis',ws.incomeCalcBasis)
							   .replace('#year',GHUTILS.currentDate().split("-")[0])
							   .replace('#month',GHUTILS.currentDate().split("-")[1])
							   .replace('#day',GHUTILS.currentDate().split(" ")[0].split("-")[2])
							   .replace('#money',ws.money || "")
							   .replace('#interestsStartDate0',ws.interestsStartDate.split("-")[0])
							   .replace('#interestsStartDate1',ws.interestsStartDate.split("-")[1])
							   .replace('#interestsStartDate2',ws.interestsStartDate.split("-")[2])
							   .replace('#interestsEndDate0',ws.interestsEndDate.split("-")[0])
							   .replace('#interestsEndDate1',ws.interestsEndDate.split("-")[1])
							   .replace('#interestsEndDate2',ws.interestsEndDate.split("-")[2])
							   .replace('#durationPeriod',ws.durationPeriod)
							   .replace('#annualInterest',decodeURIComponent(ws.annualInterest))
							   .replace('#incomeCalcBasis1',ws.incomeCalcBasis)
					$("#app-product").html(temp);
				});
				$("#app-product").removeClass("app_none");
			} else if (ws.contentId == "app-risk") {
				$("#app-risk").removeClass("app_none");
			} else if (ws.contentId == "app-xin-pro1") {
				$("#app-xin-pro1").removeClass("app_none");
			} else if (ws.contentId == "app-xin-pro2") {
				$("#app-xin-pro2").removeClass("app_none");
			} else if (ws.contentId == "app-xin-pro3") {
				$("#app-xin-pro3").removeClass("app_none");
			} else if (ws.contentId == "app-safety") {
				$("#app-safety").removeClass("app_none");
			} else if (ws.contentId == "app-yue-pro1") {
				$("#app-yue-pro1").removeClass("app_none");
			} else if (ws.contentId == "app-yue-pro2") {
				$("#app-yue-pro2").removeClass("app_none");
			} else if (ws.contentId == "app-yue-pro3") {
				$("#app-yue-pro3").removeClass("app_none");
			} else if (ws.contentId == "app-yue-pro4") {
				$("#app-yue-pro4").removeClass("app_none");
			} else if (ws.contentId == "app-yue-pro5") {
				$("#app-yue-pro5").removeClass("app_none");
			}
			var userinfo = GHUTILS.getLocalUserInfo();
			$(".app_realname").html(userinfo.name);
			$("#app_idNm").html(userinfo.idNumb);
			$("#app_data").html(GHUTILS.formatTimestamp({
				showtime: "true"
			}));
			$("#app_value").html(ws.payvalue);
		},
		getData: function() {
			var _this = this;

		},
		bindEvent: function() {
			var _this = this;

		},
		resetAfilter: function() {

		},
		closeafilter: function() {

		}
	}
	$(function() {
		var lp = new LINKPAGE();
		lp.init();
	});
})(Zepto);
