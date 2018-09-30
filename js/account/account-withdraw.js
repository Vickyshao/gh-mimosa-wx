/*
 Title:提现
 Author:fan qiao
 Date:2017-7-31 11:39:15
 Version:v1.0
*/
mui.init();
(function($) {

	var WITHDRAW = function(){
		this.tips = '#app_tips_box';
		return this;
	}
	WITHDRAW.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			GHUTILS.nativeUI.showWaiting()
			GHUTILS.getUserInfo(function(){
				_this.getData(true);
				_this.bankCardFind();
			},true);
		},		
		getData:function(ifLogin){
			var _this = this;	
			$(_this.tips).html("&nbsp;");
			console.log(GHUTILS.getLocalUserInfo());
			$("#app_bankName").html(GHUTILS.getLocalUserInfo("bankName"))
			$("#app_bankCardNum").html(GHUTILS.getLocalUserInfo("bankCardNum"))
			_this.switchFind("WithdrawNum");
			_this.switchFind("TradingDayWithdrawFee");
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.usermoneyinfo,
				type: "post",
				sw: true,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result,_this.tips)){
						GHUTILS.nativeUI.closeWaiting();
						$("#app_availableBalance").html(GHUTILS.formatCurrency(result.withdrawAvailableBalance) || 0);
						$("#app_Balance").html(GHUTILS.formatCurrency(result.balance) || 0);
					}
				}
			});   	
		},
		//获取银行卡icon
		bankCardFind: function(){
			var _this = this, bankname = GHUTILS.getLocalUserInfo("bankName");
			console.log(bankname);
			if(bankname){
				GHUTILS.LOAD({
					url: GHUTILS.API.CMS.bankCardFind+'?codes=["'+bankcodetrans[bankcode[bankname]]+'"]',
					type: "post",
					sw: true,
					callback: function(result){
						console.log(JSON.stringify(result))
						if(GHUTILS.checkErrorCode(result,_this.tips)){
							GHUTILS.nativeUI.closeWaiting();
							if(result.datas && result.datas.length > 0){
								if(result.datas[0].bankLogo){
									$("#app_bankimg").attr("src", HOST+result.datas[0].bankLogo)
								}else{
									GHUTILS.showError("数据更新中，请稍后...", _this.tips)
								}
							}else{
								GHUTILS.showError("数据更新中，请稍后...", _this.tips)
							}
						}
					}
				})
			}else{
				GHUTILS.showError("用户未绑卡", _this.tips)
			}
		},
		bindEvent:function(){
			var _this = this;

			$("#app_withdrawMoney").on({
				"focus":function(){
					$(document).on('keyup', function (e) {
						if (e.keyCode === 13 && !$("#app_withdrawBtn").attr("disabled")) {
							$("#app_withdrawMoney").blur();
						}
					}.bind(this))
				},
				"blur":function(){
					var formatMoney = GHUTILS.formatCurrency($("#app_withdrawMoney").val());
					formatMoney = formatMoney == '0.00' ? '' : formatMoney;
					$("#app_withdrawMoney").val(formatMoney);
					$(document).off('keyup')
				}
			})

			//提现
			$('#app_withdrawBtn').on('tap',function(){
				if($(this).hasClass("app_loading")){
					return
				}
				var withdrawMoney = $("#app_withdrawMoney").val().trim().replace(/\,/g,'');
				//非数字自动变为0
				if(isNaN(withdrawMoney)){
					$("#app_withdrawMoney").val(0);
					return
				}
				if(!GHUTILS.validate()){
					return
				}else if(_this.isValidMoney()){
					return
				}else{
					$("#app_withdrawBtn").addClass("app_loading")
					//提现
					$(_this.tips).html("&nbsp;");
					_this.withdraw();
				}
			});
			
//			//全部提现
//			$('#app_withdrawAll').on('tap',function(){
//				$(_this.tips).html("&nbsp;");
//				var canWithDraw = $('#app_availableBalance').html();
//				$('#app_withdrawMoney').val(canWithDraw);
//			});
			$("input").forEach(function(e, i){
				$(e).on("input", function(){
					_this.buttonEnable();
				})
			})

		},
		buttonEnable: function(){
			if($("#app_withdrawMoney").val() && parseFloat($('#app_withdrawMoney').val().trim().replace(/\,/g,'')) > 0 && $("#app_dealpwd").val().length == 6){
				$("#app_withdrawBtn").removeAttr("disabled")
			}else{
				$("#app_withdrawBtn").attr("disabled","disabled")
			}
		},
		//验证提现金额
		isValidMoney: function(){
			var _this = this;
			var valid = false;
			var withdrawMoney = parseFloat($('#app_withdrawMoney').val().trim().replace(/\,/g,''));
			var availableBalance = parseFloat($('#app_availableBalance').html().trim().replace(/\,/g,''));
			if(availableBalance == 0){
				GHUTILS.showError('账户余额不足，无法提现',_this.tips);
				valid = true;
			}else if(withdrawMoney > availableBalance){
				GHUTILS.showError('账户余额不足，无法提现',_this.tips);
				valid = true;
			}else if(withdrawMoney <= 0){
				GHUTILS.showError('提现金额有误，最低大于0元起提',_this.tips);
				valid = true;
			}
			return valid;
		},
		switchFind: function(code){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.switchFind+"?code="+code,
				type: "post",
				sw: true,
				callback: function(result){
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result,_this.tips)){
						if(result.status && result.status == "enable"){
							if(code == "Withdraw"){
								_this.withdraw();
							}else{
								$(".app_"+code).html(result.content || 0)
							}
						}else{
							if(code == "Withdraw"){
								GHUTILS.showError("该用户不可提现！", _this.tips)
								$("#app_withdrawBtn").removeClass("app_loading")
							}
						}
					}else if(code == "Withdraw"){
						$("#app_withdrawBtn").removeClass("app_loading")
					}
				},
				errcallback: function(){
					if(code == "Withdraw"){
						$("#app_withdrawBtn").removeClass("app_loading")
					}
				}
			})
		},
		//提现
		withdraw: function(){
			var _this = this;
			$(_this.tips).html("&nbsp;");
//			GHUTILS.OPENPAGE({
//				url: '../../html/usermgmt/usermgmt-dealpwd.html',
//				extras:{
//					type: 'withdraw',
//					moneyVolume: $("#app_withdrawMoney").val().trim().replace(/\,/g,''),
//					pageindex: 4,
//					title: "提现成功"
//				}
//			})
			GHUTILS.nativeUI.showWaiting();
			GHUTILS.LOAD({
				url: GHUTILS.API.USER.checkpaypwd,
				data: {
					payPwd: $("#app_dealpwd").val()
				},
				type: "post",
				sw: false,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if(result && result.errorCode == 0){
						_this.doWithdraw();
					}else if(result.errorCode == 10002){
						GHUTILS.nativeUI.closeWaiting();
						$("#app_dealpwd").val("");
						$("#app_withdrawBtn").attr("disabled","disabled")
						$("#app_withdrawBtn").removeClass("app_loading")
						GHUTILS.loginOut(function(){
							var cb = {
								cb:"reload",
							}
							GHUTILS.openLogin(JSON.stringify(cb));
						});
					}else if(result.errorCode == '40004'){
						GHUTILS.nativeUI.closeWaiting();
						$("#app_dealpwd").val("");
						$("#app_withdrawBtn").attr("disabled","disabled")
						$("#app_withdrawBtn").removeClass("app_loading")
						
					}else{
						GHUTILS.nativeUI.closeWaiting();
						var _msg = result.errorMessage
						if(_msg && _msg.indexOf("(CODE") > 0){
							_msg = _msg.substr(0, _msg.indexOf("(CODE"))
						}
						GHUTILS.showError(_msg || "数据更新中，请耐心等待", _this.tips)
						$("#app_dealpwd").val("");
						$("#app_withdrawBtn").attr("disabled","disabled")
						$("#app_withdrawBtn").removeClass("app_loading")
					}
				},
				errcallback: function(err){
					GHUTILS.nativeUI.closeWaiting();
					$("#app_dealpwd").val("");
					$("#app_withdrawBtn").attr("disabled","disabled")
					$("#app_withdrawBtn").removeClass("app_loading")
					GHUTILS.showError("密码验证失败，请重试！", _this.tips)
				}
			})		
		},
		doWithdraw: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.ORDER.withdraw,
				data: {
					orderAmount: $("#app_withdrawMoney").val().trim().replace(/\,/g,'')
				},
				type: "post",
				async: true,
				sw:false,
				callback: function(result) {
					console.log(JSON.stringify(result))
					GHUTILS.nativeUI.closeWaiting();
					if(result && result.errorCode == 0){
						GHUTILS.getUserInfo(function(){
							_this.openResultPage({beginInterestDate: '',interestArrivedDate: '',deal: GHUTILS.currentDate()}, true);
						});
					}else{
						var _msg = result.errorMessage
						if(_msg && _msg.indexOf("(CODE") > 0){
							_msg = _msg.substr(0, _msg.indexOf("(CODE"))
						}
						mui.toast(_msg || "数据更新中，请耐心等待")
						$("#app_withdrawBtn").removeClass("app_loading")
					}
				},
				errcallback: function(err){
					GHUTILS.nativeUI.closeWaiting();
					$("#app_withdrawBtn").removeClass("app_loading")
				}
			}); 
		},
		openResultPage:function(dt, state){
			var _this = this;
			//打了结果页面
			console.log("打开结果页面。");
			
			GHUTILS.OPENPAGE({
				url: '../../html/account/account-zxym-jg.html',
				extras: {
					titletxt: "提现成功",
					pageindex: 4,
					productName: "",
					moneynum: $("#app_withdrawMoney").val().trim().replace(/\,/g,''),
					valueDate: dt.beginInterestDate,
					accountDate: dt.interestArrivedDate,
					pagesid: '',
					deal: dt.deal,
					proTnDetail: '',
					proT0Detail: '',
					proT0OrderList: '',
					accT0HoldDet: '',
					couponType: '',
					coupon: '',
					state: state
				}
			});
			
			setTimeout(function(){
				$("#app_withdrawBtn").removeClass("app_loading")
			}, 500)
		}
	}
	$(function(){
		var wi = new WITHDRAW();
			wi.init();
//		document.addEventListener("pageReset", function(e) {
//			wi.pageReset();
//		});
	});
})(Zepto);