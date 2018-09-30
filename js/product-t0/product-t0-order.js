/*
 Title:活期认购
 Author:sunli haiyang
 Date:2016-6-22 15:18:27
 Version:v1.0
*/
mui.init();
(function($) {

	var PRODUCTT0ORDER = function(){
		this.tips = "#app_tips_box";
		this.maxVolume = 0;
		
		this.couponId = "";//使用卡券id
        this.couponType = "";//卡券种类
        this.couponDeductibleAmount = "";//实际优惠金额
        this.couponAmount = "";//卡券金额
        this.payAmouont = "";//实付金额
        this.couponList = [];//投资人所有的优惠券，加息券
        this.availableCouponList = [];//指定投资金额下可用卡券
        this.notAvailableCouponList = [];//指定投资金额下不可用卡券
        this.checkedCoupon = {};//已选卡券
        this.maxProfitList = [];//最高优惠金额卡券集合
        this.maxProfitOidList = [];//最高优惠金额卡券id数组
        this.flag = true;
		
		this.ws = GHUTILS.parseUrlParam(window.location.href);
		return this;
	}
	PRODUCTT0ORDER.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
		},
		pageInit:function(){
			var _this = this;
			GHUTILS.getUserInfo(function(result){
				if(result.islogin){
					_this.ws.productName = decodeURIComponent(_this.ws.productName)
					_this.ws.annualInterestSec = decodeURIComponent(_this.ws.annualInterestSec).split("-")
					_this.ws.investFiles = decodeURIComponent(_this.ws.investFiles)
					_this.ws.serviceFiles = decodeURIComponent(_this.ws.serviceFiles)
					_this.ws.productLabels = JSON.parse(decodeURIComponent(_this.ws.productLabels))
					_this.ws.purchasingAmount= parseFloat(_this.ws.purchasingAmount)
					_this.ws.increaseAmount= parseFloat(_this.ws.increaseAmount)
					_this.ws.maxSaleVolume= parseFloat(_this.ws.maxSaleVolume)
					_this.ws.investMax= parseFloat(_this.ws.investMax)
					_this.ws.maxHold= parseFloat(_this.ws.maxHold)
					_this.ws.rewardInterest = parseFloat(_this.ws.rewardInterest)
					_this.ws.interestsFirstDays = parseFloat(_this.ws.interestsFirstDays)
					_this.ws.lockPeriodDays = parseFloat(_this.ws.lockPeriodDays || 0)
					_this.ws.incomeCalcBasis = parseFloat(_this.ws.incomeCalcBasis)
					if(_this.ws.couponAmount){
                    	_this.ws.couponAmount = parseFloat(_this.ws.couponAmount)
                    }
					if(!_this.ws.maxSaleVolume || _this.ws.maxSaleVolume < _this.ws.purchasingAmount){
                    	$("#app_confirm").addClass("app_btn_loading").html("已售罄");
                    }
					$("#app_investMoney").val('');
					$("#app_interestsFirstDays").html("T+" + _this.ws.interestsFirstDays + "起息")
					$("#app_lockPeriodDays").html(_this.ws.lockPeriodDays ? _this.ws.lockPeriodDays + "天" : "随时可退")
					_this.setAmount(_this.ws.purchasingAmount ,_this.ws.increaseAmount, _this.ws.investMax);
					_this.initProfit(_this.ws.annualInterestSec,_this.ws.purchasingAmount);
					_this.getCouponList();
				}
			},true)
		},
		//获取单人持有份额
		getData:function(volume){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.TARGET.mholdvol + "?productOid=" + _this.ws.productOid,
				type: "post",
				sw: true,
				callback: function(result) {
					if(GHUTILS.checkErrorCode(result,_this.tips)){
						if(volume > GHUTILS.Fsub(_this.ws.maxHold, result.maxHoldVol)){
							_this.maxVolume = GHUTILS.Fsub(_this.ws.maxHold, result.maxHoldVol)
						}else{
							_this.maxVolume = volume
						}
					}
				},
			})
		},
		bindEvent:function(){
		 	var _this = this;
		 	$("#app_investMoney").on({
		 		"focus":function(){
					$(document).on('keyup', function (e) {
						if (e.keyCode === 13) {
							$("#app_investMoney").blur();
						}
					}.bind(this))
				},
				"blur":function(){
					if(_this.ws.couponId){
						return
					}
					var formatMoney = GHUTILS.formatCurrency($("#app_investMoney").val());
					formatMoney = formatMoney == '0.00' ? '' : formatMoney;
					$("#app_investMoney").val(formatMoney);
					if(_this.couponList && _this.couponList.length > 0){
                        _this.chooseCoupon(parseFloat(formatMoney.replace(/\,/g,'')))
                    }
					if(!$("#app_investMoney").val()){
						$("#app_confirm").attr("disabled","disabled")
					}
					$(document).off('keyup')
				},
				"input":function(){
					_this.chooseCoupon(parseFloat($("#app_investMoney").val().replace(/\,/g,'')))
				}
			})
		 	
		 	$('.app_aggrementSpan input[type="checkbox"]').on("change", function(){
				if($(this).is(':checked')){
					$(this).parent('span').removeClass('app_icon_checknone').addClass('app_icon_checked')
					if(this == document.getElementById('app_couponCkeck')){
                        $("#app_discount").html('无')
                        $("#app_maxyield").html('&nbsp;')
                        _this.couponId = "";//使用卡券id
                        _this.couponType = "";//卡券种类
                        _this.couponDeductibleAmount = "";//实际优惠金额
                        _this.couponAmount = "";//卡券金额
                        _this.payAmouont = "";//实付金额
                        _this.showDeposit($("#app_availableBalance").html().trim().replace(/\,/g,''), parseFloat($('#app_investMoney').val().replace(/\,/g,'') || 0));
                    }
				}else {
					$(this).parent('span').removeClass('app_icon_checked').addClass('app_icon_checknone')
					if(this == document.getElementById('app_couponCkeck')){
                        if(!$("#app_investMoney").val()){
                            mui.toast('请先输入投资金额!')
                            this.checked = true
                            $(this).parent('span').removeClass('app_icon_checknone').addClass('app_icon_checked')
                        }else if(JSON.stringify(_this.checkedCoupon) == '{}'){
                            mui.toast('投资金额范围内没有可用的优惠券!')
                            this.checked = true
                            $(this).parent('span').removeClass('app_icon_checknone').addClass('app_icon_checked')
                        }else{
                            var investMoney = parseFloat($('#app_investMoney').val().replace(/\,/g,''))
                            switch(_this.checkedCoupon.type){
                                case 'coupon' : 
                                    $("#app_discount").html('代金券'+_this.checkedCoupon.amount+'元')
                                    $("#app_maxyield").html(_this.checkedCoupon.maxProfit ? '收益最高' : '&nbsp;')
                                    if(_this.checkedCoupon.amount > investMoney){
                                        _this.couponDeductibleAmount = investMoney;//实际优惠金额
                                        _this.payAmouont = 0;//实付金额
                                    }else{
                                        _this.couponDeductibleAmount = _this.checkedCoupon.amount;//实际优惠金额
                                        _this.payAmouont = GHUTILS.Fsub(investMoney, _this.checkedCoupon.amount);//实付金额
                                    }
                                    break
                                case 'rateCoupon' : 
                                    $("#app_discount").html('加息券'+_this.checkedCoupon.amount+'%')
                                    $("#app_maxyield").html(_this.checkedCoupon.maxProfit ? '收益最高' : '&nbsp;')
                                    _this.couponDeductibleAmount = 0;//实际优惠金额
                                    _this.payAmouont = investMoney;//实付金额
                                    break
                                default : break
                            }
                            _this.showDeposit($("#app_availableBalance").html().trim().replace(/\,/g,''), _this.payAmouont);
                            _this.couponId = _this.checkedCoupon.couponId;//使用卡券id
                            _this.couponType = _this.checkedCoupon.type;//卡券种类
                            _this.couponAmount = _this.checkedCoupon.amount;//卡券金额
                        }
                    }
				}
			})
		 	
			$('#app_confirm').on('click',function(){
				if($(this).hasClass("app_btn_loading")){
					return
				}
				$(_this.tips).html("&nbsp;")
				GHUTILS.getUserInfo(function(){
					if(GHUTILS.checkDealpwd() && _this.isValid()){
						if($('#app_aggrement').is(':checked')){
							if(GHUTILS.isLabelProduct(_this.ws.productLabels, '1', true)){
								if(!GHUTILS.isFreshman()){
									return
								}
							}
							GHUTILS.OPENPAGE({
								url: '../../html/usermgmt/usermgmt-dealpwd.html',
								extras: {
									type: 'deal',
									productOid: _this.ws.productOid,
									moneyVolume: _this.ws.couponAmount ? _this.ws.couponAmount : $("#app_investMoney").val().trim().replace(/\,/g,''),
									pageindex: 1,
									title: "转入成功",
									productName: _this.ws.productName,
									couponId: _this.ws.couponId || _this.couponId,
				                    couponType: _this.ws.couponType || _this.couponType,
				                    couponDeductibleAmount: _this.ws.couponAmount || _this.couponDeductibleAmount,
				                    couponAmount: _this.ws.couponAmount || _this.couponAmount,
				                    payAmouont: _this.ws.couponId ? 0 : (_this.payAmouont !== "" ? _this.payAmouont : $('#app_investMoney').val().replace(/\,/g,''))
								}
							});
						}else{
							GHUTILS.showError("您必须同意《风险揭示书》和《定向委托投资管理协议》才能进行投标",_this.tips);
						}
					}
				}, true)
			});
			
			$("#app_investFiles").on('click',function(){
				GHUTILS.OPENPAGE({
					url:"../../html/index/index-linkpage.html",
					extras:{
						contentId : "app-investFiles",
						title : '定向委托投资管理协议',
						links : _this.ws.investFiles,
						incomeCalcBasis: _this.ws.incomeCalcBasis
					}
				})
			});
			
			$("#app_serviceFiles").on('click',function(){
				GHUTILS.OPENPAGE({
					url:"../../html/index/index-linkpage.html",
					extras:{
						contentId : "app-serviceFiles",
						title : '风险揭示书',
						links : _this.ws.serviceFiles
					}
				})
			});
			
			//选择优惠券
            $("#app_chooseCoupon").on('tap', function(){
            	if(_this.couponList.length == 0){
					mui.toast("暂无可用卡券")
					return
				}
                var checkedCoupon = $("#app_couponCkeck").is(':checked') ? {} : _this.checkedCoupon
                $('.app_dialog_list_box').html('')
                $('.app_dialog_list_box').append(_this.addItem(_this.availableCouponList,true,checkedCoupon))
                if(_this.notAvailableCouponList && _this.notAvailableCouponList.length > 0){
                    $('.app_dialog_list_box').append('<div class="app_lines"><span>不可用</span></div>')
                    $('.app_dialog_list_box').append(_this.addItem(_this.notAvailableCouponList,false,checkedCoupon))
                }
                _this.selectCoupon();
                GHUTILS.dialogBox.show()
            })
		},
		setAmount: function(purchasingAmount,increaseAmount,investMax){
			var _this = this;
			var maxInvestVolume = 0;
			$("#app_Money").html(GHUTILS.formatCurrency(purchasingAmount)+"元")
			if(investMax){
				maxInvestVolume = _this.ws.maxSaleVolume >= investMax ? investMax : _this.ws.maxSaleVolume
			}else{
				maxInvestVolume = _this.ws.maxSaleVolume
			}
			if(_this.ws.maxHold){
				_this.getData(maxInvestVolume)
			}else{
				_this.maxVolume = maxInvestVolume;
			}
			
			_this.getAvailableBalance(purchasingAmount);
		},
		initProfit: function(annualInterest,purchasingAmount){
			var _this = this;
			if(_this.ws.couponAmount){
				$("#app_investMoney").val(GHUTILS.formatCurrency(_this.ws.couponAmount) + " 元 体验金").attr("readonly","readonly")
				$("#app_confirm").removeAttr("disabled")
				var investMoney = parseFloat(_this.ws.couponAmount);
				$("#app_balanceDiv").addClass("app_none")
			}else{
				$("#app_investMoney").removeAttr("readonly")
				var investMoney = parseFloat($('#app_investMoney').val().replace(/\,/g,''));
				$("#app_balanceDiv").removeClass("app_none")
			}
			if(investMoney >= purchasingAmount || _this.ws.couponId){
				_this.setProfit(annualInterest, investMoney);
			}else{
				$('#app_profit').val('');
			};
			$('#app_investMoney').on('input',function(){
				investMoney = $(this).val().replace(/\,/g,'');
				var balance = parseFloat($("#app_availableBalance").html().replace(/\,/g,''));
				var payAmouont = _this.payAmouont !== "" ? _this.payAmouont : investMoney
				if(investMoney >= purchasingAmount){
					_this.setProfit(annualInterest, investMoney);
				}else if(investMoney > 0){
					$('#app_profit').val('0.00');
				}else{
					$('#app_profit').val('');
				}
				if(payAmouont <= balance && investMoney >= purchasingAmount){
					$("#app_confirm").removeAttr("disabled")
				}else{
					$("#app_confirm").attr("disabled","disabled")
				}
			})
		},
		isValid: function(){
			var valid = true;
			var _this = this;
			if(_this.ws.couponAmount){
				return true
			}
			var investMoney = parseFloat($('#app_investMoney').val().replace(/\,/g,'') || 0);
			var annualInterest = _this.ws.annualInterestSec;
			var investMaxMoney = _this.maxVolume;
			var payAmouont = _this.payAmouont !== "" ? _this.payAmouont : investMoney
			if(!investMoney){
				GHUTILS.showError("请输入投资金额!",_this.tips);
				valid = false;
			}else if(investMoney > investMaxMoney){
				GHUTILS.showError("输入金额不可大于目前最高可投金额"+investMaxMoney+'元!',_this.tips);
				$("#app_investMoney").val(GHUTILS.formatCurrency(investMaxMoney));
				_this.chooseCoupon(investMaxMoney);
				_this.setProfit(annualInterest, investMaxMoney);
				investMoney = parseFloat($('#app_investMoney').val().replace(/\,/g,'') || 0);
				payAmouont = _this.payAmouont !== "" ? _this.payAmouont : investMoney
				if(parseFloat($("#app_availableBalance").html().replace(/\,/g,'')) >= payAmouont && investMoney >= _this.ws.purchasingAmount){
					$("#app_confirm").removeAttr("disabled")
				}else{
					$("#app_confirm").attr("disabled","disabled")
				}
				valid = false;
			}else if(investMoney < _this.ws.purchasingAmount){
				GHUTILS.showError("金额不可小于最低起投金额!",_this.tips);
				$("#app_investMoney").val(_this.ws.purchasingAmount > 100000000 ? "100,000,000" : GHUTILS.formatCurrency(_this.ws.purchasingAmount));
				_this.chooseCoupon(parseFloat($("#app_investMoney").val().replace(/\,/g,'')));
				_this.setProfit(annualInterest, $("#app_investMoney").val().replace(/\,/g,''));
				investMoney = parseFloat($('#app_investMoney').val().replace(/\,/g,'') || 0);
				payAmouont = _this.payAmouont !== "" ? _this.payAmouont : investMoney
				if(parseFloat($("#app_availableBalance").html().replace(/\,/g,'')) >= payAmouont){
					$("#app_confirm").removeAttr("disabled")
				}else{
					$("#app_confirm").attr("disabled","disabled")
				}
				valid = false;
			}else if(GHUTILS.Fdiv((GHUTILS.Fmul(GHUTILS.Fsub(investMoney, _this.ws.purchasingAmount), 100)), (GHUTILS.Fmul(_this.ws.increaseAmount, 100))).toString().indexOf('.') > 0){
				GHUTILS.showError('超出'+_this.ws.purchasingAmount+'元部分必须为'+_this.ws.increaseAmount+'元的整数倍!',_this.tips);
				valid = false;
			}else if(GHUTILS.Fsub(payAmouont, $("#app_availableBalance").html().trim().replace(/\,/g,'')) > 0){
				GHUTILS.showError('余额不足!',_this.tips);
				valid = false;
			}
			return valid;
		},
		//每日收益
		setProfit: function(annualInterest, investMoney){
			var _this = this;
			if(annualInterest.length == 1){
				if(_this.ws.rewardInterest){
					var annualInterestSec = GHUTILS.Fadd(parseFloat(annualInterest[0].split("+")[0].replace('%','')), _this.ws.rewardInterest)
				}else{
					var annualInterestSec = parseFloat(annualInterest[0].replace('%',''))
				}
				var profit = GHUTILS.Fmul(GHUTILS.Fsub(Math.pow(GHUTILS.Fadd(1, GHUTILS.Fdiv(annualInterestSec, 100)), GHUTILS.Fdiv(1, _this.ws.incomeCalcBasis)), 1), investMoney);
				$('#app_profit').val(GHUTILS.formatCurrency(profit));
			}else{
				if(_this.ws.rewardInterest){
					var annualInterestSec0 = GHUTILS.Fadd(parseFloat(annualInterest[0].replace('%','')), _this.ws.rewardInterest)
					var annualInterestSec1 = GHUTILS.Fadd(parseFloat(annualInterest[1].split("+")[0].replace('%','')), _this.ws.rewardInterest)
				}else{
					var annualInterestSec0 = parseFloat(annualInterest[0].replace('%',''))
					var annualInterestSec1 = parseFloat(annualInterest[1].replace('%',''))
				}
				var profit0 = GHUTILS.Fmul(GHUTILS.Fsub(Math.pow(GHUTILS.Fadd(1, GHUTILS.Fdiv(annualInterestSec0, 100)), GHUTILS.Fdiv(1, _this.ws.incomeCalcBasis)), 1), investMoney);
				var profit1 = GHUTILS.Fmul(GHUTILS.Fsub(Math.pow(GHUTILS.Fadd(1, GHUTILS.Fdiv(annualInterestSec1, 100)), GHUTILS.Fdiv(1, _this.ws.incomeCalcBasis)), 1), investMoney);
				$('#app_profit').val(GHUTILS.formatCurrency(profit0)+'-'+GHUTILS.formatCurrency(profit1));
			}
		},
		getAvailableBalance: function(purchasingAmount){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.usermoneyinfo,
				type: "post",
				sw: true,
				callback: function(result) {
					if(GHUTILS.checkErrorCode(result,_this.tips)){
						//显示账户余额
						$("#app_availableBalance").html(GHUTILS.formatCurrency(result.applyAvailableBalance) || 0);
						_this.showDeposit(result.applyAvailableBalance, purchasingAmount);
					}
				}
			});
		},
		showDeposit: function(accountBalance, investMoney){
			var _this = this;
			if(_this.ws.couponId || (accountBalance && accountBalance >= investMoney)){
				$("#app_goDeposit_div").html("&nbsp;")
				$("#app_goDeposit_div").parent("a").removeClass("mui-navigate-right")
			}else{
				$("#app_goDeposit_div").html('<div id="app_goDeposit">余额不足,请充值</div>')
				$("#app_goDeposit_div").parent("a").addClass("mui-navigate-right")
				$("#app_goDeposit").off().on('click', function(){
					GHUTILS.getUserInfo(function(){
						if(GHUTILS.checkDepWit(JSON.stringify(_this.ws))){
							GHUTILS.OPENPAGE({
								url: "../../html/account/account-deposit.html",
							})
						}
					}, true)
				})
			}
		},
		//初始化可用卡券信息
        getCouponList: function(){
            var _this = this;
            _this.couponList = [];
            _this.notAvailableCouponList = [];
            GHUTILS.LOAD({
                url: GHUTILS.API.TARGET.mycouponofpro+'?proOid='+_this.ws.productOid,
                type: "post",
                sw: true,
                callback: function(result) {
                    console.log(JSON.stringify(result))
                    if(GHUTILS.checkErrorCode(result,_this.tips)){
                        if(result.total != 0 && !_this.ws.couponId){
                            for(var p in result.rows){
                                switch(result.rows[p].type){
                                    case 'coupon' : case 'rateCoupon' : 
                                        _this.couponList.push(result.rows[p])
                                        break
                                    default : break
                                }
                            }
                            _this.notAvailableCouponList = _this.couponList
                            console.log('总卡券：-----'+JSON.stringify(_this.couponList))
                            
                            if(_this.couponList && _this.couponList.length > 0){
                                _this.chooseCoupon(0);
//                              $("#app_chooseCoupon").removeClass("app_none")
//                              $("#app_checkCoupon").removeClass("app_none")
                            }else{
                                _this.ifNoCoupon();
                            }
                            //首次进入页面选择卡券
                            if(_this.flag){
                                _this.chooseCoupon($("#app_investMoney").val());
                                _this.flag = false
                            }
                        }else{
                            _this.ifNoCoupon();
                        }
                    }
                }
            });
        },
        ifNoCoupon: function(){
//          if(!$("#app_chooseCoupon").hasClass("app_none")){
//              $("#app_chooseCoupon").addClass("app_none")
//          }
            if(!$("#app_checkCoupon").hasClass("app_none")){
                $("#app_checkCoupon").addClass("app_none")
            }
        },
        //金额输入完成或投资金额重置后，获取适用卡券，选取收益最高卡券
        chooseCoupon: function(investMoney){
            var _this = this;
            _this.notAvailableCouponList = [];
            _this.availableCouponList = [];
            _this.maxProfitList = [];
            _this.checkedCoupon = {};
            _this.maxProfitOidList = [];
            _this.couponId = "";//使用卡券id
            _this.couponType = "";//卡券种类
            _this.couponDeductibleAmount = "";//实际优惠金额
            _this.couponAmount = "";//卡券金额
            _this.payAmouont = investMoney;//实付金额
            if(investMoney){
                for(var p in _this.couponList){
                    var minAmt = _this.couponList[p].investAmount, maxAmt = _this.couponList[p].maxAmt;
                    if((minAmt && investMoney < minAmt) || (maxAmt && investMoney > maxAmt)){
                        _this.notAvailableCouponList.push(_this.couponList[p])
                    }else if(_this.couponList[p].type == "coupon" && _this.couponList[p].amount >= investMoney){
                        _this.notAvailableCouponList.push(_this.couponList[p])
                    }else{
                        _this.availableCouponList.push(_this.couponList[p])
                    }
                }
                console.log('总卡券：-----'+JSON.stringify(_this.couponList))
                console.log('不可用卡券：-----'+JSON.stringify(_this.notAvailableCouponList))
                console.log('可用卡券：-----'+JSON.stringify(_this.availableCouponList))
                
                //有可用卡券，默认选择收益最高
                if(_this.availableCouponList && _this.availableCouponList.length > 0){
                    var discountMoney = 0, validPeriod = 0, discountArr = [], discountObjArr = [], discountObj = {};
                    
                    //获取可用卡券中各卡券实际优惠金额
                    for(var p in _this.availableCouponList){
                        if(_this.availableCouponList[p].type == 'coupon'){
                            if(_this.availableCouponList[p].amount > investMoney){
                                discountMoney = investMoney
                            }else{
                                discountMoney = _this.availableCouponList[p].amount
                            }
                        }else{
                            if(_this.availableCouponList[p].validPeriod){
                                validPeriod = _this.availableCouponList[p].validPeriod > _this.ws.lockPeriodDays ? _this.ws.lockPeriodDays : _this.availableCouponList[p].validPeriod
                            }else{
                                validPeriod = _this.ws.lockPeriodDays
                            }
                            discountMoney = GHUTILS.Fdiv(GHUTILS.Fdiv(GHUTILS.Fmul(GHUTILS.Fmul(investMoney, _this.availableCouponList[p].amount), validPeriod), _this.ws.incomeCalcBasis), 100)
                            if(_this.availableCouponList[p].maxRateAmount){
                                discountMoney = discountMoney > _this.availableCouponList[p].maxRateAmount ? _this.availableCouponList[p].maxRateAmount : discountMoney
                            }
                        }
                        discountObj = _this.availableCouponList[p]
                        discountObj.money = discountMoney
                        discountArr.push(discountMoney)
                        discountObjArr.push(discountObj)
                    }
                    
                    //计算最大优惠金额，获取最大优惠金额卡券数组
                    var maxDiscount = Math.max.apply(Math, discountArr), couponObj = {};
                    for(var p in discountObjArr){
                        if(discountObjArr[p].money == maxDiscount){
                            couponObj = discountObjArr[p]
                            couponObj.maxProfit = true
                            _this.maxProfitList.push(couponObj)
                        }
                    }
                    console.log('最高优惠金额卡券-----'+JSON.stringify(_this.maxProfitList))
                    
                    //优惠金额最大卡券有多张，选择时间最近的卡券，获取优惠金额最大卡券oid数组
                    if(_this.maxProfitList.length > 1){
                        var msecArr = [];
                        for(var p in _this.maxProfitList){
                            var dateArr = _this.maxProfitList[p].finish.split(' ')[0].split('-');
                            var timeArr = _this.maxProfitList[p].finish.split(' ')[1].split(':');
                            msecArr.push(new Date(dateArr[0],(dateArr[1]-1),dateArr[2],timeArr[0],timeArr[1],timeArr[2]).getTime());
                            _this.maxProfitList[p].msec = msecArr[p];
                            _this.maxProfitOidList.push(_this.maxProfitList[p].couponId)
                        }
                        var minMsec = Math.min.apply(Math, msecArr), minMsecArr = [];
                        for(var p in _this.maxProfitList){
                            if(_this.maxProfitList[p].msec == minMsec){
                                minMsecArr.push(_this.maxProfitList[p])
                            }
                        }
                        _this.checkedCoupon = minMsecArr[0]
                    }else{
                        _this.checkedCoupon = _this.maxProfitList[0]
                        _this.maxProfitOidList.push(_this.checkedCoupon.couponId)
                    }
                    
                    //选择使用卡券
                    document.getElementById('app_couponCkeck').checked = false
                    $('#app_couponCkeck').parent('span').removeClass('app_icon_checked').addClass('app_icon_checknone')
                    switch(_this.checkedCoupon.type){
                        case 'coupon' : 
                            $("#app_discount").html('代金券'+_this.checkedCoupon.amount+'元')
                            $("#app_maxyield").html('收益最高')
                            if(_this.checkedCoupon.amount > investMoney){
                                _this.couponDeductibleAmount = investMoney;//实际优惠金额
                                _this.payAmouont = 0;//实付金额
                            }else{
                                _this.couponDeductibleAmount = _this.checkedCoupon.amount;//实际优惠金额
                                _this.payAmouont = GHUTILS.Fsub(investMoney, _this.checkedCoupon.amount);//实付金额
                            }
                            break
                        case 'rateCoupon' : 
                            $("#app_discount").html('加息券'+_this.checkedCoupon.amount+'%')
                            $("#app_maxyield").html('收益最高')
                            _this.couponDeductibleAmount = 0;//实际优惠金额
                            _this.payAmouont = investMoney;//实付金额
                            break
                        default : break
                    }
                    _this.showDeposit($("#app_availableBalance").html().trim().replace(/\,/g,''), _this.payAmouont);
                    _this.couponId = _this.checkedCoupon.couponId;//使用卡券id
                    _this.couponType = _this.checkedCoupon.type;//卡券种类
                    _this.couponAmount = _this.checkedCoupon.amount;//卡券金额
                }else{
                    _this.ifNoAvailableCoupon();
                    _this.showDeposit($("#app_availableBalance").html().trim().replace(/\,/g,''), investMoney);
                }
            }else{
                _this.ifNoAvailableCoupon();
            }
        },
        ifNoAvailableCoupon: function(){
            var _this = this;
            _this.notAvailableCouponList = _this.couponList;
            document.getElementById('app_couponCkeck').checked = true
            $('#app_couponCkeck').parent('span').removeClass('app_icon_checknone').addClass('app_icon_checked')
            $("#app_discount").html('无')
            $("#app_maxyield").html('&nbsp;')
        },
        addItem: function(couponList, ifAvailable,checkedCoupon) {
            var _this = this
            var html = "";
            if(couponList && couponList.length > 0){
                for (var i in couponList) {
                    if(ifAvailable){
                        html += '<div class="app_user_coupon_box on app_clearfix" data-oid="'+couponList[i].couponId+'">';
                    }else{
                        html += '<div class="app_user_coupon_box off app_clearfix">';
                    }
                     html+= _this.itemsObj(couponList[i], ifAvailable,checkedCoupon)+ '</div>';
                }
            }
            return html;
        },
        itemsObj: function(tradeObj, ifAvailable,checkedCoupon) {
            var _this = this;
            var couponHtml = '', html = '', checked = '', namestyle = '';
            
            if(ifAvailable){
                if(JSON.stringify(checkedCoupon) != '{}' && checkedCoupon.couponId == tradeObj.couponId){
                    checked = ' checked="checked"'
                }
                html = '<div style="position: absolute;right: 5px;top: 5px;"><input type="checkbox"'+ checked +'></div>'
                namestyle = ' style="max-width: 90%;"'
            }
            
            var products = "";
            if(tradeObj.products){
                if(tradeObj.products != "适用全场") {
                    products = "仅限投资" + tradeObj.products
                } else {
                    products = tradeObj.products
                }
                
            } else {
                products = "适用全场"
            }
            
            var rules = "";
            if(tradeObj.investAmount){
                rules = "满" + tradeObj.investAmount + "元使用"
            } else {
                rules = "全场适用"
            }
            
            if(tradeObj.type ==='coupon'){
				couponHtml = '<div class="app_coupon_num_box"><h5 class="app_cf mui-text-left app_mb30">代金券</h5><span class="app_f18">￥</span><span class="app_coupon_num"><span  class="app_fb">'
							+ tradeObj.amount +'</span></span></div>'
							+ html +'<div class="app_coupon_info"><div class="ui-border-b app_mt10 mui-ellipsis  app_cmain"'+namestyle+'>'
							+ tradeObj.name +'</div><div class="app_c3b app_mt10 mui-ellipsis ">'
							+ products +'</div><div class="app_c3b app_mt10 mui-ellipsis  ">'
							+ rules +'</div><div class="app_c3b app_mt10 app_bts app_bottom">有效期至:'
							+ tradeObj.finish +'</div></div>';
            }else{
				couponHtml = '<div class="app_coupon_num_box"><h5 class="app_cf mui-text-left app_mb30">加息券</h5><span class="app_coupon_num"><span  class="app_fb">'
							+ tradeObj.amount +'</span></span><span class="app_f18">%</span></div>'
							+ html +'<div class="app_coupon_info"><div class="ui-border-b app_mt10 mui-ellipsis  app_cmain"'+namestyle+'>'
							+ tradeObj.name +'</div><div class="app_c3b app_mt10 mui-ellipsis">'
							+ products +'</div><div class="app_c3b app_mt10 mui-ellipsis">'
							+ rules +'</div><div class="app_c3b app_mt10 app_bts app_bottom">有效期至:'
							+ tradeObj.finish +'</div></div>'
			}
            return couponHtml;
        },
        //可选优惠券点击
        selectCoupon: function(){
            var _this = this;
            $(".on").on('tap', function(){
                $('#app_maxyield').html('&nbsp;')
                if($(this).find('input[type="checkbox"]').is(':checked')){
                    $(this).find('input[type="checkbox"]')[0].checked = false;
                    document.getElementById('app_couponCkeck').checked = true
					$('#app_couponCkeck').parent('span').removeClass('app_icon_checknone').addClass('app_icon_checked')
					$("#app_discount").html('无')
					_this.couponId = "";//使用卡券id
					_this.couponType = "";//卡券种类
					_this.couponDeductibleAmount = "";//实际优惠金额
					_this.couponAmount = "";//卡券金额
					_this.payAmouont = "";//实付金额
					_this.showDeposit($("#app_availableBalance").html().trim().replace(/\,/g,''), parseFloat($('#app_investMoney').val().replace(/\,/g,'') || 0));
                }else{
                    $(".on input").forEach(function(e,i) {
                        if(e.checked){
                            e.checked = false
                        }
                    });
                    $(this).find('input[type="checkbox"]')[0].checked = true;
                    var oid = $(this).attr("data-oid")
                    _this.availableCouponList.forEach(function(ele) {
						if(ele.couponId == oid){
							_this.checkedCoupon = ele;
							if(_this.maxProfitOidList.indexOf(ele.couponId) > -1){
								_this.checkedCoupon.maxProfit = true
							}else{
								_this.checkedCoupon.maxProfit = false
							}
							document.getElementById('app_couponCkeck').checked = false
							$('#app_couponCkeck').parent('span').removeClass('app_icon_checked').addClass('app_icon_checknone')
							var investMoney = parseFloat($('#app_investMoney').val().replace(/\,/g,''))
							switch(ele.type){
								case 'coupon' : 
									$("#app_discount").html('代金券'+ele.amount+'元')
									$("#app_maxyield").html(_this.checkedCoupon.maxProfit ? '收益最高' : '&nbsp;')
									if(ele.amount > investMoney){
										_this.couponDeductibleAmount = investMoney;//实际优惠金额
										_this.payAmouont = 0;//实付金额
									}else{
										_this.couponDeductibleAmount = ele.amount;//实际优惠金额
										_this.payAmouont = GHUTILS.Fsub(investMoney, ele.amount);//实付金额
									}
									break
								case 'rateCoupon' : 
									$("#app_discount").html('加息券'+ele.amount+'%')
									$("#app_maxyield").html(_this.checkedCoupon.maxProfit ? '收益最高' : '&nbsp;')
									_this.couponDeductibleAmount = 0;//实际优惠金额
									_this.payAmouont = investMoney;//实付金额
									break
								default : break
							}
							_this.showDeposit($("#app_availableBalance").html().trim().replace(/\,/g,''), _this.payAmouont);
							_this.couponId = ele.couponId;//使用卡券id
							_this.couponType = ele.type;//卡券种类
							_this.couponAmount = ele.amount;//卡券金额
						}
					});
                }
            })
        }
	}
	$(function(){
		var t0or = new PRODUCTT0ORDER();
			t0or.init();
	});
})(Zepto);