//定义公共信息

var GHUTILS = {};
//请求地址相关配置

var HOST = "https://www.hushenlc.cn";//---> jz生产
var channelOid = "2c9180825d009645015d068b91573434";//---> jz生产
var cid = "0001";//---> jz生产
var ckey = "0001"//---> jz生产
var cmsChannelOid = "2c9180835d00963f015d068f7edb0000"//--> jz生产

//var HOST = "http://106.14.171.12";//---> jz12
//var channelOid = "2c9180845dcb79aa015dcb853a470112";
//var cid = "0001";
//var ckey = "0001";
//var cmsChannelOid = "2c9180835dbfa200015dcb8595550017";

//84环境（地址：http://114.215.133.84）
//var channelid = "999920170228100000"

//var HOST = "";
//var channelOid = "8a2373945cfce314015cfcf6619f016b";
//var cid = "jinzhu";
//var ckey = "jinzhu";
//var cmsChannelOid = "8a23739459821cd901598223f2a10000";

//var returnUrl="http://114.215.133.84/gh-mimosa-pc/pages/"
//215环境（地址：http://118.190.115.215）
//var HOST = "";
//var channelOid = "402880885ccf876c015ccf9a25ee0106";//---> gh215
//var cid = "123456";//---> gh215
//var ckey = "123456"//---> gh215
//var cmsChannelOid = "402880865cc9d275015ccf9d867b0000"//--> gh215
//生产环境（地址：https://www.hushenlc.cn） 
//var HOST = "";//http://139.129.250.127---> jz127
//var channelOid="2c9180825d009645015d068b91573434";
//var cid="0001";
//var ckey="0001";
//var cmsChannelOid="2c9180835d00963f015d068f7edb0000"
//var returnUrl="http://139.129.250.127/gh-mimosa-pc/pages/"

//demo环境（地址：http://demo.guohuaitech.com）
//var HOST = "";
//var channelOid = "8a9de9a35b47385b015b473ddee10007";//---> demo
//var cid = "123456";//---> demo
//var ckey = "123456"//---> demo
//var cmsChannelOid = "8a9de9a35b473f7b015b474124400000"//--> demo

//用户基础数据
GHUTILS.userInfo = null;

GHUTILS = {

	//请求接口
	API: {
		//用户相关
		USER: {
			doLogin:         HOST + '/mimosa/client/investor/baseaccount/login',	//登录
			doLogout:        HOST + '/mimosa/client/investor/baseaccount/logout',	//登出
			checkimgvc:      HOST + '/mimosa/client/captcha/checkimgvc',			//校验验证码
			checklock:		 HOST + '/mimosa/client/investor/baseaccount/checklock',//查看锁定状态
			sendverifyv1:    HOST + '/mimosa/client/sms/sendvc',					//注册、忘记密码发送验证码
			verify:   	     HOST + '/mimosa/client/sms/checkvc',					//验证手机验证码是否正确
			register:        HOST + '/mimosa/client/investor/baseaccount/regist',	//注册
			seq:             HOST + '/mimosa/client/investor/baseaccount/checkloginpwd',			//修改登录密码时判断是否与之前密码相同
			setpassword:     HOST + '/mimosa/client/investor/baseaccount/editloginpwd',				//设置登录密码
			modifypassword:  HOST + '/mimosa/client/investor/baseaccount/modifyloginpwd',			//修改登录密码
			updatepassword:  HOST + '/mimosa/client/investor/baseaccount/forgetloginpwd',			//重置登录密码
			dealpaypwd:      HOST + '/mimosa/client/investor/baseaccount/editpaypwd',				//设置支付密码
			modifypaypwd:    HOST + '/mimosa/client/investor/baseaccount/modifypaypwd',				//修改支付密码
			forgetpaypwd:    HOST + '/mimosa/client/investor/baseaccount/forgetpaypwd',				//重置支付密码
			checkpaypwd:     HOST + '/mimosa/client/investor/baseaccount/checkpaypwd',				//验证原支付密码
			userinfo: 	     HOST + '/mimosa/client/investor/baseaccount/accountinfo',				//用户相关信息
			findBankByCard:	 HOST + '/settlement/channelBank/findBankInfoByCard',	//判断银行卡与卡号是否匹配
//			isbind:	         HOST + '/mimosa/client/investor/bank/isbind',			//判断银行卡是否已绑定
			valid4ele:	     HOST + '/mimosa/client/investor/bank/bindcardapply',	//绑卡四要素验证
			bankadd:	     HOST + '/mimosa/client/investor/bank/add',				//新增银行卡
			removebank:      HOST + '/mimosa/boot/investor/bank/removebank'			//解绑银行卡
		},
		//账户信息相关
		CHA:{
			usermoneyinfo:   HOST + '/mimosa/client/investor/baseaccount/userinfo',	//用户资金相关信息  
			islogin: 	     HOST + '/mimosa/client/investor/baseaccount/islogin',	//用户是否登录
			getmyinvites:    HOST + '/mimosa/client/investor/baseaccount/referdetail/referlist',	//我的邀请
			invitecharts:    HOST + '/mimosa/client/investor/baseaccount/referdetail/recomtop10',	//邀请排行榜
			dealDate:        HOST + '/mimosa/client/platform/baseaccount/deta',		//首页交易额
			prot0list:       HOST + '/mimosa/client/tradeorder/currentOrderList',	//我的沪深一号
			prot0detail:     HOST + '/mimosa/client/holdconfirm/mycurrdetail',		//我的活期产品详情
			prot0orderdetail:HOST + '/mimosa/client/tradeorder/currentOrderDetail',	//我的活期产品订单详情
			prot0redeem:     HOST + '/mimosa/client/tradeorder/currentOrderClose',	//我的赎回记录
			prot0qrydetail:  HOST + '/mimosa/client/tradeorder/mng',				//交易明细
			prot0qryincome:  HOST + '/mimosa/client/investor/holdincome/qryincome2',//我的活期交易明细--收益
			protnlist:       HOST + '/mimosa/client/holdconfirm/tnhold',			//我的定期列表
			proholdtndetail: HOST + '/mimosa/client/holdconfirm/tningdetailer',		//我的定期持有中详情
			proclosetndetail:HOST + '/mimosa/client/holdconfirm/closedregularinfo',	//我的定期已结清详情
			depwdrawlist:    HOST + '/mimosa/client/investor/bankorder/mng',		//充提记录
			accountIncome:   HOST + '/mimosa/client/investor/holdincome/mydatedetail',				//累计收益页面
			useraccount:     HOST + '/mimosa/client/investor/baseaccount/myhome',	//我的首页
			accountdetail:   HOST + '/mimosa/client/investor/baseaccount/mycaptial',//我的资产详情
			coupon:          HOST + '/mimosa/client/tulip/myallcoupon',				//我的卡券
			receiveCoupon:   HOST + '/mimosa/client/investor/bankorder/receiveredenvelope',			//领取红包
			tdetail:         HOST + '/mimosa/product/client/tdetail',				//获取体验金产品oid
			getEventInfo:    HOST + '/mimosa/client/tulip/getEventInfo',			//活动红包
			switchFind:      HOST + '/mimosa/client/switch/find'					//操作限制管理接口
		},
		//用户签到相关
		signIn:{
			sign:	         HOST + '/mimosa/client/tulip/signIn',					//签到
			checkSign:	     HOST + '/mimosa/client/tulip/checkSign'				//检查是否签到
		},
		//理财信息相关
		TARGET:{
			gettnproductlist:HOST + '/mimosa/product/client/tnproducts',			//定期产品列表
			gett0productlist:HOST + '/mimosa/product/client/t0products',			//活期产品列表
//			gett0productlist:HOST + '/mimosa/product/client/t0products4XZG',		//活期产品列表(排序)
			getproductlist:  HOST + '/mimosa/product/client/apphome',				//首页产品列表
			getproductdetail:HOST + '/mimosa/product/client/pdetail',				//定期产品详情
			mycouponofpro:   HOST + '/mimosa/client/tulip/mycouponofpro',			//认购获取优惠券
			mholdvol:        HOST + '/mimosa/client/holdconfirm/mholdvol',			//获取活期产品单人已持有金额
			gett0detail:     HOST + '/mimosa/product/client/cdetail',				//活期产品详情
			tradeordermng:   HOST + '/mimosa/boot/tradeorder/mng'					//获取产品投资信息
		},
		//交易相关
		ORDER:{
			dapply:	         HOST + '/mimosa/client/investor/bankorder/apply/dapply',				//充值发送验证码
			deposit:	     HOST + '/mimosa/client/investor/bankorder/deposit',	//充值
			depositbf:	     HOST + '/mimosa/client/investor/bankorder/depositbf',	//充值(不需要验证码)
			withdraw:	     HOST + '/mimosa/client/investor/bankorder/withdraw',	//提现
			invest:          HOST + '/mimosa/client/tradeorder/invest',				//产品购买
			performredeem:   HOST + '/mimosa/client/tradeorder/redeem',				//活期赎回
			depositisdone:   HOST + '/mimosa/client/investor/bankorder/isdone',		//检测充值订单是否完成
			investisdone:    HOST + '/mimosa/client/tradeorder/isdone'				//检测申购订单是否完成
		},
		//接口日志
		LOGS:{
			slog:            HOST + '/mimosa/client/platform/errorlog/slog'			//接口日志
		},
		//CMS相关
		CMS:{
			gethome:         HOST + '/cms/app/home',								//获取主页信息
			getnotices:      HOST + '/cms/app/getNotices',							//获取公告信息
			feedback:        HOST + '/cms/app/addAdvice',							//意见反馈
//			messages:        HOST + '/cms/boot/push/pushQuery',						//消息中心
			messages:        HOST + '/cms/app/pushQuery',							//消息中心
			mailQueryPage:   HOST + '/cms/client/mail/queryPage',					//查询站内信(已读未读)
			mailDetail:      HOST + '/cms/client/mail/detail',						//站内信详情
			mailAllread:     HOST + '/cms/client/mail/allread',						//站内信全部设置为已读
			bankCardFind:    HOST + '/cms/client/bankCard/find',					//银行卡信息
			bankCardFindall: HOST + '/cms/client/bankCard/findall',					//查询所有银行信息
			getProtocolInfo: HOST + '/cms/app/getProtocolInfo',						//获取协议接口
			getActRuleInfo:  HOST + '/cms/app/getActRuleInfo',						//获取邀请规则
			elementConfig:   HOST + '/cms/client/element/find',						//元素配置
			upDataUrl:       HOST + '/cms/app/getVersionUpdateInfo',					//版本信息获取
			infromationtype: HOST + '/cms/app/getInformationType',					//获取资讯类型
			getinformationsalltoapp:HOST + '/cms/app/getInformationsAlltoApp',
			getinformations: HOST + '/cms/app/getInformations'						//获取资讯信息

		},
		//微信
		WX:{
			sdkconfig: HOST + '/weixin/getjssdk',
			getopenid: HOST + '/weixin/getopenid',

		}
	},
	
	//获取图形码
	changeVCode1:function(obj){
		$(obj).attr('src',HOST + '/mimosa/client/captcha/getimgvc?t='+new Date().getTime());
	},

	
	//打开新页面
	OPENPAGE :function(op) {
		//op -- >url,extras.
		if (!op.url) {
			return
		}
		window.location.href = GHUTILS.buildQueryUrl(op.url,op.extras);
	},

	/**
	 * 公共ajax请求方法
	 * 参数说明：{}
	 * url: 请求地址 (string)
	 * params: 请求参数 (string || object)
	 * callback: 成功回调 function
	 * errcallback: 错误回调(错误提示类型tipscode,错误代码errcode, 错误回调 errcb ) (0 || object)
	 * type: 请求类型，"GET" || "POST" 默认是"POST"。(string)
	 * contentType: 请求内容类型，默认为"application/json"。
	 */
	LOAD : function(op) {
		if (!op || !op.url) {
			return;
		}

		if (op.params) {
			op.url = op.url + "?" + decodeURIComponent($.param(op.params));
		}

		if (op.sw && window.plus) {
			GHUTILS.nativeUI.showWaiting();
		}
				
		var _async = op.async == false ? false : true;

		var options = {
			url: op.url,
			data: JSON.stringify(op.data) || "",
			type: op.type || "POST",//HTTP请求类型
			async: _async,
			contentType:op.contentType || "application/json",
			dataType: "json",
			timeout: op.timeout || 30000,
			success: function(d) {
				//console.log(window.location.href)
				//console.log("load success:"+op.url)
				if (op.callback && typeof(op.callback) == 'function') {
					op.callback.apply(null, arguments);
				}

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				GHUTILS.nativeUI.closeWaiting();
				if (op.errcallback) {
					op.errcallback();
				}

				if(op.url != GHUTILS.API.LOGS.slog){
					GHUTILS.LOAD({
						url: GHUTILS.API.LOGS.slog,
						data: {
							reqUri: op.url,
							params: JSON.stringify(op.data) || ""
						},
						sw: false
					})
				}
				console.log(op.url);
				console.log(XMLHttpRequest.status)
				console.log(JSON.stringify(textStatus))
				//console.log(JSON.stringify(errorThrown))
//              mui.toast('网络错误，请稍后再试',{verticalAlign:"center"});
			}
		};
		try {
			mui.ajax(options);
		} catch (e) {
		 	console.log("网络错误，请稍后再试");
		 	if( window.plus){
				GHUTILS.nativeUI.closeWaiting();
				setTimeout(function() {
					plus.webview.currentWebview().endPullToRefresh();
				}, 200);
			}
		}

	},
	
	/**
	 * 将对象转换成带参数的形式 &a=1&b=2
	 */
	buildQueryUrl: function(url, param) {
		var x = url
		var ba = true;
		var allurl = '';
		if (x.indexOf('?') != -1) {
			if (x.indexOf('?') == url.length - 1) {
				ba = false
			} else {
				ba = true
			}
		} else {
			//x = x + '?'
			ba = false
		}
		var builder = ''
		for (var i in param) {
			var p = '&' + i + '='
			if (param[i] || (param[i]+'' == '0')) {
				var v = param[i]
				if (Object.prototype.toString.call(v) === '[object Array]') {
					for (var j = 0; j < v.length; j++) {
						builder = builder + p + encodeURIComponent(v[j])
					}
				} else if (typeof(v) == "object" && Object.prototype.toString.call(v).toLowerCase() == "[object object]" && !v.length) {
					builder = builder + p + encodeURIComponent(JSON.stringify(v))
				} else {
					builder = builder + p + encodeURIComponent(v)
				}
			}
		}
		if (!ba) {
			builder = builder.substring(1)
		}
		
		if(builder){
			x = x + '?'
		}

		return x + builder
	},

	//验证接口返回ErrorCode是否为0
	checkErrorCode:function(result,tips){
		var tips = tips || false;
		var icon = '<span class="app-icon app-icon-clear"></span>';
//		console.log(JSON.stringify(result))
		if (result.errorCode == 0) {
			return true;
		}else {
			var _msg = '';
			if ( result.errorCode == 502 ||  result.errorCode == 404 ){
				_msg = '请求错误,请稍后重试';

			}else{
				_msg = result.errorMessage
				if(_msg && _msg.indexOf("(CODE") > 0){
					_msg = _msg.substr(0, _msg.indexOf("(CODE"))
				}
			}
//			 && !plus.webview.getWebviewById(GHUTILS.PAGESID.LOGIN)
			if((result.errorCode == '10002'|| result.errorCode == '20005')){
				GHUTILS.openLogin();
			}

//			if ( result.errorCode == 'E10000' && _msg.length > 100){
//
//				return false;
//			}

//			if(tips){
//				$(tips).html(_msg);
//			}else{
				GHUTILS.toast(_msg || "数据更新中，请耐心等待");
//			}
			GHUTILS.nativeUI.closeWaiting();
//			if(window.plus){
//				GHUTILS.nativeUI.closeWaiting();
//				plus.webview.currentWebview().endPullToRefresh();
//			}

			return false;
		}
	},

	//获取浏览器参数
	parseUrlParam : function(url) {
		if (!url) {
			url=window.location.href;
		}
		var urlParam = {};
		if (url.indexOf("?") < 0) {
			return urlParam;
		}
		var params = url.substring(url.indexOf("?") + 1).split("&");
		for (var i = 0; i < params.length; i++) {
			var k = params[i].substring(0,params[i].indexOf("="));
			var v = params[i].substring(params[i].indexOf("=")+1);
			if (v.indexOf("#") > 0) {
				v = v.substring(0, v.indexOf("#"));
			}
			urlParam[k] = v;
		}
		return urlParam;
	},

//	nativeUI:{
//		showWaiting:function(msg){
//			var _msg = msg || '';
//			plus.nativeUI.showWaiting(_msg,{background:"rgba(0,0,0,0.2)"});
//		}
//	},

	//获取用户信息
	getUserInfo:function(cb,gologin){
		GHUTILS.LOAD({
			url: GHUTILS.API.USER.userinfo,
			type: "post",
			sw:false,
			callback: function(result) {
				console.log(JSON.stringify(result))
				if (result.errorCode == 0 &&　result.islogin) {

					GHUTILS.userInfo = result;
				}else if( result.errorCode == 10002 ){
					GHUTILS.nativeUI.closeWaiting()
					if(gologin){
						GHUTILS.OPENPAGE({
							url: "../../html/usermgmt/usermgmt-login.html",
							extras: {
								actionUrl:encodeURIComponent(window.location.href)
							}
						});
					}
					
				}else{
					GHUTILS.nativeUI.closeWaiting()
					var _msg = result.errorMessage
					if(_msg && _msg.indexOf("(CODE") > 0){
						_msg = _msg.substr(0, _msg.indexOf("(CODE"))
					}
					mui.toast(_msg || "数据更新中，请耐心等待");
				}
				//回调
				if (cb && typeof(cb) == 'function') {
					cb.apply(null, arguments);
				}
				
			},
			errcallback: function() {
				GHUTILS.nativeUI.closeWaiting()
				mui.toast("网络错误，请稍后再试")
			}
		});
	},
	//判断产品是否为某种标签产品,labelArr为标签数组,label为标签,通过code判断增加code参数为true
	isLabelProduct: function(labelArr, label, code){
		var labelProduct = false
		if(labelArr && labelArr.length > 0){
			labelArr.forEach(function(e, i){
				if(e.labelName == label && !code){
					labelProduct = true
				}else if(e.labelCode == label && code){
					labelProduct = true
				}
			})
		}
		return labelProduct
	},
	//获取当前用户体验金
	getTasteCoupon: function(){
		var tasteCouponList = [], couponId = "", amount = 0;
		GHUTILS.LOAD({
			url: GHUTILS.API.CHA.coupon +"?page=1&rows=10000&status=notUsed",
			type:'post',
			async: false,
			callback: function(result){
				console.log(JSON.stringify(result))
				if(result.errorCode == 0){
					if(result.rows && result.rows.length > 0){
						for(var p in result.rows){
							if(result.rows[p].type == "tasteCoupon"){
								tasteCouponList.push(result.rows[p])
							}
						}
						if(tasteCouponList.length > 0){
							var amountList = [], maxAmountObjList = [], msecList = [], minMsecObjList = [], maxAmount = 0, minMsec = 0;
							for(var p in tasteCouponList){
								amountList.push(tasteCouponList[p].amount)
							}
							maxAmount = Math.max.apply(Math, amountList)
							for(var p in tasteCouponList){
								if(tasteCouponList[p].amount == maxAmount){
									maxAmountObjList.push(tasteCouponList[p]);
								}
							}
							for(var p in maxAmountObjList){
								var dateArr = maxAmountObjList[p].finish.split('-');
								msecList.push(new Date(dateArr[0],(dateArr[1]-1),dateArr[2]).getTime());
								maxAmountObjList[p].msec = msecList[p];
							}
							minMsec = Math.min.apply(Math, msecList)
							for(var p in maxAmountObjList){
								if(maxAmountObjList[p].msec == minMsec){
									minMsecObjList.push(maxAmountObjList[p]);
								}
							}
							couponId = minMsecObjList[0].oid
							amount = minMsecObjList[0].amount
						}
					}
				}else if(result.errorCode == 10002 || result.errorCode == 20005){
					GHUTILS.openLogin();
				}else{
					var _msg = result.errorMessage
					if(_msg && _msg.indexOf("(CODE") > 0){
						_msg = _msg.substr(0, _msg.indexOf("(CODE"))
					}
					mui.toast(_msg || "数据更新中，请耐心等待")
				}

			}
		})
		return {"tasteCouponList": tasteCouponList, "couponId": couponId, "amount": amount}
	},
	//购买新手产品时判断用户是否为新手用户
	isFreshman: function(){
		var freshman = false
		GHUTILS.LOAD({
			url: GHUTILS.API.CHA.usermoneyinfo,
			type: "post",
			async: false,
			sw: true,
			callback: function(result) {
				if(GHUTILS.checkErrorCode(result)){
					if(result.isFreshman && result.isFreshman == 'yes'){
						freshman = true
					}else{
						mui.toast('非新手用户不可购买新手产品')
					}
				}
			}
		});
		return freshman
	},
	//产品标签显示
	showProductLabels: function(labelCodes){
		var type = "";
		if(labelCodes && labelCodes.length > 0){
//			labelCodes.forEach(function(e, i){
//				if(e.labelCode == "1"){
//					type += '<span class="app_tag_icon app_tag_c1">'+e.labelName+'</span>'
//				}else if(e.labelCode == "7"){
//					type += '<span class="app_tag_icon app_tag_c4">'+e.labelName+'</span>'
//				}else if(e.labelCode == "8"){
//					type += '<span class="app_tag_icon app_tag_c5">'+e.labelName+'</span>'
//				}else if(e.labelCode == "2"){
//					type += '<span class="app_tag_icon app_tag_c2">'+e.labelName+'</span>'
//				}else if(e.labelCode == "3" || e.labelCode == "4" || e.labelCode == "5" || e.labelCode == "6"){
//					type += '<span class="app_tag_icon app_tag_c3">'+e.labelName+'</span>'
//				}
//			})
//			labelCodes.forEach(function(e, i){
//				if(e.labelType == "extend"){
//					type += '<span class="app_tag_icon app_tag_c6">'+e.labelName+'</span>'
//				}
//			})
			labelCodes.forEach(function(e, i){
				if(e.labelType == "general"){
					type = '<div class="app_product_icon">'+e.labelName+'</div>'
				}
			})
		}
		return type
	},
	//安卓切换小眼睛图标,获取输入框焦点
	inputFocus: function(inputId){
		$(inputId)
		.on('focus', function () {
			$(inputId).parent().find(".app-icon-eye").on("tap", function(){
				var imm, InputMethodManager;
				if (mui.os.android) {
					//强制当前webview获得焦点
					var wv_current = plus.android.currentWebview();
					plus.android.importClass(wv_current);
					wv_current.requestFocus();
					
					var main = plus.android.runtimeMainActivity();
					var Context = plus.android.importClass("android.content.Context");
					InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
					imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
					imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
					
					setTimeout(function() {
						var inputElem = document.querySelector(inputId);
						inputElem.focus(); 
					}, 200);
				}
			})
		})
		.on('blur', function () {
			$(".app-icon-eye").off("tap")
		})
	},
	
	//获取本地用户信息：传key返回指定key的值。不传key返回所有信息
	getLocalUserInfo:function(key){
//		var userInfo = localStorage.getItem("userInfo") || '[]';
//		userInfo = JSON.parse(userInfo);
//		if(!GHUTILS.userInfo){
//			GHUTILS.getUserInfo(null,true,false)
//		}
		var userInfo = GHUTILS.userInfo || [];
		var info = null;
		if(key){
			$.each(userInfo, function(m,n) {
				if(key == m){
					info = n;
				}
			});
		}else{
			info = userInfo;
		}
		return info
	},
	//获取登录状态 gologin:是否打开登录页面
	getloginStatus:function(gologin){
//		var userInfo = localStorage.getItem("userInfo") || '{"loginStatus":false}';
//			userInfo = JSON.parse(userInfo);
			//console.log(gologin)
		if(!GHUTILS.userInfo){
			GHUTILS.getUserInfo(null,true,false)
		}
		var userInfo = GHUTILS.userInfo || [];
		if(gologin && !userInfo.islogin){
			mui.toast("请先登录");
			mui.fire("", "login",{});
		}
		return userInfo.islogin;
	},

	//获取本地信息
	getLocalCfg:function(key){
		var userId = localStorage.getItem("userID") || '';
		var uConfigList = localStorage.getItem("userConfigList") || '[]',
		uConfigList = JSON.parse(uConfigList);
		var cfg = null;
		
		for (var i = 0; i < uConfigList.length; i++) {
			if(uConfigList[i].mobile == userId){
				if(key){
					mui.each(uConfigList[i], function(m,n) {
						if(key == m){
							cfg = n;
						}
					});
				}else{
					cfg = uConfigList[i];
				}
			}
				
		}
		return cfg
	},
	getOpenId : function() {
//		if (!GHUTILS.getloginStatus()) {
			var params = GHUTILS.parseUrlParam(location.href);
			if (params.code && !GHUTILS.GHLocalStorage.getRaw("moneyopenid")) {
				GHUTILS.LOAD({
					url: GHUTILS.API.WX.getopenid,
					params: {
						code: params.code,
						tp: "10001"
					},
					async:false,
					type: "post",
					callback: function(result) {
						if (GHUTILS.checkErrorCode(result)) {
							GHUTILS.GHLocalStorage.put("moneyopenid", result.body.openid || '');
						}
					}
				});
			}
//		}
	},
	GHLocalStorage : {
		put: function(key, value) {
			if (!key) {
				return;
			}
			if(typeof(value) == "object") {
				localStorage.setItem(key, JSON.stringify(value));
			}else{
				localStorage.setItem(key, value);
			}
		},
		get: function(key) {
			return JSON.parse(localStorage.getItem(key));
		},
		getRaw: function(key) {
			return localStorage.getItem(key) || null;
		},
		remove: function(Key) {
			localStorage.removeItem(key);
		},
		clear: function() {
			localStorage.clear();
		}
	},


	//加密指纹
	makeSpwd:function(spwd){
		var jssha = new jsSHA("SHA-1", "TEXT");
		var skey = localStorage.getItem("userID") || '';
		jssha.update(skey + spwd);
		
		var hex = jssha.getHash("HEX");
		return hex;
	},
	//
	linkChackLogin:function(url){

		if(GHUTILS.getloginStatus()){
			return true;
		}else{
//			var cbobj = {
//				cb:"firePage",
//				even:"tapLink",
//				extars:'{"elm":"'+ elmid +'"}'
//			}
			//问下,下面注释的代码是干嘛用的??????????
//			mui.fire(plus.webview.getLaunchWebview(), "login",{
//				cbobj:JSON.stringify(cbobj)
//			} );
			GHUTILS.OPENPAGE({
				url: '../../html/usermgmt/usermgmt-login.html',
				extras: {
					actionUrl:url
				}
			})
			mui.toast("请先登录")
			return false;
		}
	},

	//排序
	/**
	 * @description
	 * data json obj
	 * field field to be sorted
	 * direction desc,esc
	 * @param {Object} data
	 * @param {Object} field
	 * @param {Object} direction
	 */
	sort:function (data,field,direction) {
		if (!field || !direction) {
			return;
		}
		if (direction.toLowerCase() == "esc") {//升序
			data.sort(function(a,b) {
				var f=a[field]?a[field]:0;
				var s=b[field]?b[field]:0;
				return f -s;
			});
		}else{
			data.sort(function(a,b) {
				var f=a[field]?a[field]:0;
				var s=b[field]?b[field]:0;
				return s -f;
			});
		}
	},

	//转几位小数点（按位数截取），带后缀（单位）GHUTILS.toFixed(10000,4,"元") = 10000.0000元
	toFixeds: function(numb, digital,suffix) {
		var digital = digital ? digital : 0;
		var fixed = 1;
		for (var i = 0; i < digital; i++) {
			fixed = fixed * 10;
		}

		if (numb == undefined || numb.length == 0) {
			return "--";
		}else {
			var numb = GHUTILS.Fmul(Number(numb), fixed);
			return (parseInt(numb)/fixed).toFixed(digital) + (suffix ? suffix : "");
		}
	},

	//转几位小数点（四舍五入），带后缀（单位）GHUTILS.toDecimal(10000,4,"元") = 10000.0000元
	toDecimal: function(numb, digital,suffix) {
		var digital = digital ? digital : 0;
		var fixed = 1;
		for (var i = 0; i < digital; i++) {
			fixed =fixed * 10;
		}
		if (numb == undefined || numb.length == 0) {
			return "--";
		}else {
			var numb = GHUTILS.Fmul(Number(numb), fixed);
			return (Math.round(numb)/fixed).toFixed(digital) + (suffix ? suffix : "");
		}
	},

	//数值单位转换 GHUTILS.NumbF100(10000,4) = 1.0000万
	NumbF0: function(v,digital) {
		if (v == undefined || v.length == 0) {
			 return "--";
		}
		var fixed= digital ? digital : 0;
		var d=v<0?"-":"";
		v = Math.abs(v);
		if (v < 10) {
			v = GHUTILS.toDecimal(v,fixed);
		}else if (v > 10000 * 10000) {
			v = GHUTILS.toDecimal(v / 10000 / 10000,fixed) + '亿';
		}else if (v > 10000) {
			v = GHUTILS.toDecimal(v / 10000,fixed) + '万';
		} else {
			var x = (v / 1000).toFixed(fixed);
			v = (x >= 10) ? '1万' : (v).toFixed(fixed);
		}
		return d+v;
	},

	//日期时间 0000-00-00 00:00:00
	currentDate: function(t) {
		var nowdata = t ? new Date(t) : new Date();
		var y = nowdata.getFullYear(),
			m = nowdata.getMonth() + 1,
			d = nowdata.getDate(),
			h = nowdata.getHours(),
			min = nowdata.getMinutes(),
			s = nowdata.getSeconds(),
			time = null;
		var totr = function(t) {
			t < 10 ? t = '0' + t : t;
			return t;
		};

		time = y + '-' + totr(m) + '-' + totr(d) + ' ' + totr(h) + ':' + totr(min) + ':' + totr(s)

		return time

	},

	//格式化数字 GHUTILS.fmnum(10000,2) = 10,000.00
	fmnum:function(s, n){
		   n = n > 0 && n <= 20 ? n : 2;
		   s = Number(GHUTILS.toFixeds(parseFloat((s + "").replace(/[^\d\.-]/g, "")),n)).toFixed(n) + "";
		   var l = s.split(".")[0].split("").reverse(),
		   r = s.split(".")[1];
		   t = "";
		   for(i = 0; i < l.length; i ++ )
		   {
		      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		   }
		   return t.split("").reverse().join("") + "." + r;
	},
	//修复JS浮点的加减乘除运算 Fadd加 Fsub减 Fmul乘 Fdiv除
	Fadd:function(a, b) {
    	var c, d, e;
	    try {
	        c = a.toString().split(".")[1].length;
	    } catch (f) {
	        c = 0;
	    }
	    try {
	        d = b.toString().split(".")[1].length;
	    } catch (f) {
	        d = 0;
	    }
	    return e = Math.pow(10, Math.max(c, d)), (GHUTILS.Fmul(a, e) + GHUTILS.Fmul(b, e)) / e;
	},
	Fsub:function(a, b) {
	    var c, d, e;
	    try {
	        c = a.toString().split(".")[1].length;
	    } catch (f) {
	        c = 0;
	    }
	    try {
	        d = b.toString().split(".")[1].length;
	    } catch (f) {
	        d = 0;
	    }
	    return e = Math.pow(10, Math.max(c, d)), (GHUTILS.Fmul(a, e) - GHUTILS.Fmul(b, e)) / e;
	},

	Fmul:function(a, b) {
	    var c = 0,
	        d = a.toString(),
	        e = b.toString();
	    try {
	        c += d.split(".")[1].length;
	    } catch (f) {}
	    try {
	        c += e.split(".")[1].length;
	    } catch (f) {}
	    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	},

	Fdiv:function(a, b) {
	    var c, d, e = 0,
	        f = 0;
	    try {
	        e = a.toString().split(".")[1].length;
	    } catch (g) {}
	    try {
	        f = b.toString().split(".")[1].length;
	    } catch (g) {}
	    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), GHUTILS.Fmul(c / d, Math.pow(10, f - e));
	},

	checkInput :function(obj, regnum){
		var regTel = /^[0-9]{0,11}$/g; //电话号码(0)
		var regPwd = /^([\x21-\x7e]|[a-zA-Z0-9]){0,16}$/g; //密码(1)
		var regNum = /^\d+$/g; //纯数字(2)
		var regNump = /^(([1-9]\d*)|0)(\.\d{0,2})?$/g; //含两位小数数字(3)
		var regNumId = /^\d{0,17}(\d|X)$/g; //身份验证(4)
		var regYzm = /^\d{0,6}$/g; //纯数字验证码(5)
		var regMoney = /^((([1-9]{1}\d{0,7}))|(100000000))?$/;//1亿以内整数金额(6)
		//var	regTxt    = /^[\u4E00-\u9FA5]$/g;//汉字(4)

		var value = obj.value;
		if (3 == regnum || 6 == regnum) {
			value=value.replace(",","");
		}
		var regs = [regTel, regPwd, regNum, regNump, regNumId, regYzm, regMoney];

		if (value && !value.match(regs[regnum])) {
			obj.value = obj.getAttribute("app_backvalue");
		}else{
			obj.setAttribute("app_backvalue",value);
		}
	},

	//验证文本框
	testInput:{
		tel: function(t) {
			var re = /^1[3|4|5|7|8][0-9]{9}$/;
			var test = re.test(t) ? true : false;
			return test;
		},
		pw: function(t) {
			var re = /^([\x21-\x7e]|[a-zA-Z0-9]){8,20}$/;
			var test = re.test(t) ? true : false;
			return test;
		},
		txt: function(t) {
			var re = /^[\u4E00-\u9FA5]+$/;
			var test = re.test(t) ? true : false;
			return test;
		},
		IDnum: function(t) {
			var re = /^\d{15}$|\d{17}(\d|x|X)$/;
			var test = re.test(t) ? true : false;
			return test;
		},
		num: function(t) {
			var re = /^[0-9]{6}$/;//安全码和验证码都是6位数字
			var test = re.test(t) ? true : false;
			return test;
		},
		floatNum: function(t) {
			var re = /^(([1-9]\d*)|0)(\.\d{0,2})?$/;//两位小数
			var test = re.test(t) ? true : false;
			return test;
		},
		cardNum: function(t) {
			var re = /^(\d{16,19})$/;
			var test = re.test(t) ? true : false;
			return test;
		}
	},

	//打开登录页面
	openLogin:function(cbobj){
		GHUTILS.OPENPAGE({
			url: "../../html/usermgmt/usermgmt-login.html",
			extras: {
				actionUrl:encodeURIComponent(window.location.href)
			}
		});
	},

	//登出
	loginOut:function(callback){

		GHUTILS.LOAD({
				url: GHUTILS.API.USER.doLogout,
//				data: {},
				type: "post",
				async: false,
				callback: function(result) {
					if (result.errorCode == '0') {
						//GHUTILS.getUserInfo(function(){
							if(callback){
								callback();
							}else{
								mui.toast("已经退出登录");
							}
							
						//});
					} else {
						var _msg = result.errorMessage
						if(_msg && _msg.indexOf("(CODE") > 0){
							_msg = _msg.substr(0, _msg.indexOf("(CODE"))
						}
						mui.toast(_msg || "数据更新中，请耐心等待")
					}
				}
			});
	},
	//表单提交验证
	validate:function(scope){
		var result = true;
		$(scope ? "#" + scope + " input,select" : "input,select").forEach(function(d, i) {
			var dom = $(d);
			var valid = dom.attr("valid");
			if (valid && result) {
				var ops = JSON.parse(valid);

				var tips = ops.tipsbox || false;
				if (ops.required || dom.val()) {
					if (!dom.val()) {
						GHUTILS.showError(ops.msg,tips);
						result = false;
						return;
					}
					if (ops.subvalid){
						for (var i = 0; i < ops.subvalid.length; i++) {
							var e = ops.subvalid[i];
							if (e.minLength) {
								if (dom.val().length < e.minLength) {
									GHUTILS.showError(e.msg,tips);
									result = false;
									return;
								}
							}
							if (e.maxLength) {
								if (dom.val().length > e.maxLength) {
									GHUTILS.showError(e.msg,tips);
									result = false;
									return;
								}
							}
							if (e.between) {
								if (dom.val().length < e.between[0] || dom.val().length > e.between[1]) {
									GHUTILS.showError(e.msg,tips);
									result = false;
									return;
								}
							}
							if (e.finalLength) {
								if (dom.val().length != e.finalLength) {
									GHUTILS.showError(e.msg,tips);
									result = false;
									return;
								}
							}
							if (e.equals) {
								if (dom.val() != $("#" + e.equals).val()) {
									GHUTILS.showError(e.msg,tips);
									result = false;
									return;
								}
							}

							if (e.mobilePhone) {
								if (!dom.val().match("^1[3|4|5|7|8][0-9]{9}$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							} else if (e.identityCard) {
								if (!dom.val().match("^\\d{17}[X|\\d|x]$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							} else if (e.passWord) {
								if (!dom.val().match("^([\x21-\x7e]|[a-zA-Z0-9]){0,16}$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							} else if (e.debitCard) {
								if (!dom.val().match("^\\d{16,19}$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							} else if (e.positiveInteger) {
								if (!dom.val().match("^[0-9]+\\d*$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							} else if (e.positiveNumber) {
								if (!dom.val().match("^[0-9]+\.?[0-9]*$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							} else if (e.floatNum) {
								if (!dom.val().match("^(([1-9]\\d*)|0)(\.\\d{0,2})?$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							}else if (e.nickName) {
								if (!dom.val().match("^[\u4E00-\u9FA5A-Za-z0-9_]{2,15}$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							}else if (e.invitationNum) {
								if (!dom.val().match("^[A-Za-z0-9]{7}$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							}else if (e.realName) {
								if (!dom.val().match("^[\u4E00-\u9FA5A-Za-z_·]{1,20}$")) {
									GHUTILS.showError(e.msg,tips);
									result = false;
								}
							}
						};
					}
				}
			}
		});
		return result;
	},


	//获取验证码按钮倒计时
	btnTime:function(obj){
		if(obj){
			var t = 120;
	        var btntime = setInterval(function(){
	            if(t >= 0){
	                obj.html('重新获取('+ t +')');
	                t--;
	            }else{
	                obj.removeClass("app_btn_loading");
	                obj.html("短信获取");
	                clearInterval(btntime);
	                t = 120;
	            }
	        },1000)
		}
	},
	//获取验证码按钮倒计时
	btnTime2:function(obj){
		if(obj){
			var t = 120;
			var num = 0;
	        var btntime = setInterval(function(){
	            if(t >= 0){
	                $(".my_tips").html("");
	            	$(".circle").removeClass("app_none")
	                $("#my_time").html(t);
	                num = t * 3;
					if (num<180) {
						$('.circle').find('.right').css('transform', "rotate(" + num + "deg)");
					} else {
						$('.circle').find('.right').css('transform', "rotate(180deg)");
						$('.circle').find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
					};
					t--;
	            }else{
	                obj.removeClass("app_loading");
	            	$(".circle").addClass("app_none")
	                $(".my_tips").html("重新获取");
	                clearInterval(btntime);
	                t = 120;
	            }
	        },1000)
		}
	},		
	/**
	 * 将数值截取后2位小数,格式化成金额形式
	 *
	 * @param num 数值(Number或者String)
	 * @return 金额格式的字符串,如'1,234,567.45'
	 * @type String
	 */
	formatCurrency: function(num) {
		if (num != null) {
			num = num.toString().replace(/\$|\,/g, '');
		} else {
			return "0.00"
		}
		if (isNaN(num))
			num = "0";
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(GHUTILS.Fmul(num, 100));
		cents = num % 100;
		num = Math.floor(num / 100).toString();
		if (cents < 10)
			cents = "0" + cents;
		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
			num = num.substring(0, num.length - (4 * i + 3)) + ',' +
			num.substring(num.length - (4 * i + 3));
		return (((sign) ? '' : '-') + num + '.' + cents);
	},

	formatIntCurrency:function(num){
		num = parseInt(num.toString().replace(/\$|\,/g,'')).toString();
		if(isNaN(num))
	    num = "0";
	    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
	    num = num.substring(0,num.length-(4*i+3))+','+
	    num.substring(num.length-(4*i+3));
	    return num;
	},

	//格式化时间格式
	/*param{
	 * data:time,
	 * type:0,
	 * showtime:"true"
	 * }
	 * */
	formatTimestamp : function(param) {
		var d = new Date();
		d.setTime(param && param.time || d);
		var datetime = null;
		var x = d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();
		var y = (d.getHours() < 10 ? " 0" : " ") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();

		if (param.showtime == "false") {
			datetime = x + y;
		} else {
			datetime = x;
		}
		return datetime;
	},

	//错误提示
	toast:function(content){
		mui.toast(content);
	},

	showError:function(content,tips){
//		if(tips){
//			var icon = '<span class="app-icon app-icon-clear"></span>';
//			$(tips).html(icon + content);
//			return
//		}
		if(content){
			GHUTILS.toast(content);
		}
	},

	popupBox:{
		show:function(obj){
			$(obj).show();
			$(".mui-popup-backdrop").show();
			setTimeout(function(){
				$(obj).addClass("mui-popup-in");
				$(".mui-popup-backdrop").addClass("mui-active");
			},100)
		},
		hide:function(obj){
			$(obj).removeClass("mui-popup-in");
			$(".mui-popup-backdrop").removeClass("mui-active");
			setTimeout(function(){
				$(obj).hide();
				$(".mui-popup-backdrop").hide();
			},400);
		}
	},
	silderBox:{
		show:function(obj){
			$(obj).addClass("app_active");
			setTimeout(function(){
				$(obj).addClass("app_show");
			},50);
			$(obj).off().on("tap",function(e){

				if("#"+e.target.id == obj){
					GHUTILS.silderBox.hide(obj);
				}
			})
		},
		hide:function(obj){
			$(obj).removeClass("app_show");
			setTimeout(function(){
				$(obj).removeClass("app_active");
			},500);
		}
	},
	listLinks:function(){
		var $ = Zepto || false;
		if($){
			$('.app_links').off().on('tap',function(){
				var actionurl = $(this).attr("data-url");
				var checklogin = $(this).attr("data-checklogin");
				
				if(checklogin == "true"){
					GHUTILS.isLogin(function(){
						window.location.href = actionurl
					},actionurl)
				}else{
					window.location.href = actionurl
				}
				
			});
		}
	},
	linkPages:function(){
		var $ = Zepto || false;
		if($){
			$('.app_link_pages').off().on('tap',function(){
				var _links = $(this).attr("data-links") || "";//URL
				var _title = $(this).attr("data-title") || "";//TITLE
				var _autoShow = $(this).attr("data-autoShow") || true;//显示load动画
				
				if(_links == ""){
					return
				}
				
				GHUTILS.OPENPAGE({
					url:"../index/index-linkpage.html",
					autoShow:_autoShow,
					extras:{
						links:_links,
						title:_title
					}
				})
			});
		}
	},
	//获取客服热线
	getHotline: function(obj1, obj2){
		GHUTILS.LOAD({
			url: GHUTILS.API.CMS.elementConfig+'?codes=["hotline"]',
			type: "post",
			callback: function(result){
				if(GHUTILS.checkErrorCode(result) && result.datas.length > 0){
					result.datas.forEach(function(e, i){
						switch (e.code){
							case "hotline" : 
								if(obj1){
									obj1.html(e.content)
								}
								if(obj2){
									obj2.off().on('tap', function() {
										GHUTILS.phoneCall(e.content.trim().replace(/\-/g,''));
									})
								}
								break
							default : break
						}
					})
				}
			}
		})
	},
	//拨打电话 num 为电话号码
	phoneCall:function(num){
		var btnArray = ['否', '是'];
		mui.confirm('是否要打电话询问客服？', '提示', btnArray, function(e) {
			if (e.index == 1) {
				location.href = 'tel:' + num;
			}
		})
	},
	//判断是否实名认证或是否设置支付密码
	checkDepWit: function(actionParam){
		var iftrue = true
		var url = ''
		var extras = ''
		var msg = ''
		if (!GHUTILS.getLocalUserInfo('bankCardNum')) {
			msg = '请先绑卡'
			url=  "../../html/usermgmt/usermgmt-bankcard-add.html"
			extras = {
				actionUrl:(window.location.href).split('?')[0],
				actionParam:actionParam
			}
			iftrue = false;
		}
		if(!GHUTILS.getLocalUserInfo('paypwd')){
			msg = '请先设置支付密码'
			if(url){
				extras = {
					type: "set",
					bankadd:'addBank',
					actionUrl:(window.location.href).split('?')[0],
					actionParam:actionParam
				}
			}else{
				extras = {
					type: "set",
				}
			}
			url= "../../html/usermgmt/usermgmt-dealpwd.html"
			iftrue = false;
		} 
		
		if(!iftrue){
			GHUTILS.toast(msg);
			setTimeout(function(){
				GHUTILS.OPENPAGE({
					url: url,
					extras: extras
				})
			}, 2000)
		}
		return iftrue;
	},
	//判断是否设置支付密码
	checkDealpwd: function(){
		var iftrue = true
		if(!GHUTILS.getLocalUserInfo('paypwd')){
			GHUTILS.toast('请先设置支付密码');
			GHUTILS.OPENPAGE({
				url: "../../html/usermgmt/usermgmt-dealpwd.html",
				extras: {
					type: "set"
				}
			})
			iftrue = false;
		}
		return iftrue;
	},
	//活期产品根据不同状态返回收益率和万份收益数据
//	switchShowType: function(tradeObj, detail, showSign){
//		if(!tradeObj){
//			return {"interestSec": 0, "profit": 0}
//		}
//		var annualInterestSec = [], rewardYieldRange = [], tenThsPerDayProfit = [], rewardTenThsProfit = [];
//		var annualInterestSec0 = "", annualInterestSec1 = "", rewardYieldRange1 = "";
//		var tenThsPerDayProfit0 = "", tenThsPerDayProfit1 = "", rewardTenThsProfit1 = "";
//		var interestSec = "", profit = "";
//		switch (tradeObj.showType) {
//			case "1" : annualInterestSec = tradeObj.annualInterestSec.split("-");
//					   annualInterestSec0 = annualInterestSec[0].replace('%','');
//					   annualInterestSec1 = annualInterestSec[1].replace('%','');
//					   if(detail){
//							interestSec = tradeObj.annualInterestSec;
//					   }else if(showSign){
//							interestSec = annualInterestSec0+showSign+"-"+annualInterestSec1
//					   }else{
//							interestSec = annualInterestSec0+"-"+annualInterestSec1
//					   }
//					   if(tradeObj.rewardInterest){
//					   		interestSec += "+"+GHUTILS.toFixeds(tradeObj.rewardInterest, 2)
//					   }
//					   tenThsPerDayProfit = tradeObj.tenThsPerDayProfit.split("-");
//					   tenThsPerDayProfit0 = tenThsPerDayProfit[0];
//					   tenThsPerDayProfit1 = tenThsPerDayProfit[1];
//					   profit = GHUTILS.toFixeds(tenThsPerDayProfit0,2,'')+"-"+GHUTILS.toFixeds(tenThsPerDayProfit1,2,'')
//					   break
//			case "2" : if(detail){
//							interestSec = tradeObj.annualInterestSec;
//					   }else{
//							interestSec = tradeObj.annualInterestSec.replace('%','');
//					   }
//					   if(tradeObj.rewardInterest){
//					   		interestSec += "+"+GHUTILS.toFixeds(tradeObj.rewardInterest, 2)
//					   }
//					   profit = GHUTILS.toFixeds(tradeObj.tenThsPerDayProfit,2,'');
//					   break
//			case "4" : annualInterestSec = tradeObj.annualInterestSec.split("-");
//					   annualInterestSec1 = parseFloat(annualInterestSec[1].replace('%',''));
//					   rewardYieldRange = tradeObj.rewardYieldRange.split("-");
//					   if(rewardYieldRange.length == 1){
//							rewardYieldRange1 = parseFloat(rewardYieldRange[0].replace('%',''));
//					   }else{
//							rewardYieldRange1 = parseFloat(rewardYieldRange[1].replace('%',''));
//					   }
//					   tenThsPerDayProfit = tradeObj.tenThsPerDayProfit.split("-");
//					   tenThsPerDayProfit0 = tenThsPerDayProfit[0];
//					   tenThsPerDayProfit1 = parseFloat(tenThsPerDayProfit[1]);
//					   rewardTenThsProfit = tradeObj.rewardTenThsProfit.split("-");
//					   if(rewardTenThsProfit.length == 1){
//							rewardTenThsProfit1 = parseFloat(rewardTenThsProfit[0]);
//					   }else{
//							rewardTenThsProfit1 = parseFloat(rewardTenThsProfit[1]);
//					   }
//					   if(detail){
//							annualInterestSec0 = annualInterestSec[0];
//							interestSec = annualInterestSec0+"-"+GHUTILS.toFixeds(annualInterestSec1 + rewardYieldRange1,2,'%')
//					   }else if(showSign){
//							annualInterestSec0 = annualInterestSec[0].replace('%',showSign);
//							interestSec = annualInterestSec0+"-"+GHUTILS.toFixeds(annualInterestSec1 + rewardYieldRange1,2)
//					   }else{
//							annualInterestSec0 = annualInterestSec[0].replace('%','');
//							interestSec = annualInterestSec0+"-"+GHUTILS.toFixeds(annualInterestSec1 + rewardYieldRange1,2,'')
//					   }
//					   profit = GHUTILS.toFixeds(tenThsPerDayProfit0,2,'')+"-"+GHUTILS.toFixeds(tenThsPerDayProfit1 + rewardTenThsProfit1,2,'')
//					   break
//			case "5" : annualInterestSec0 = parseFloat(tradeObj.annualInterestSec.replace('%',''));
//					   rewardYieldRange = tradeObj.rewardYieldRange.split("-");
//					   if(rewardYieldRange.length == 1){
//							rewardYieldRange1 = parseFloat(rewardYieldRange[0].replace('%',''));
//					   }else{
//							rewardYieldRange1 = parseFloat(rewardYieldRange[1].replace('%',''));
//					   }
//					   tenThsPerDayProfit0 = parseFloat(tradeObj.tenThsPerDayProfit);
//					   rewardTenThsProfit = tradeObj.rewardTenThsProfit.split("-");
//					   if(rewardTenThsProfit.length == 1){
//							rewardTenThsProfit1 = parseFloat(rewardTenThsProfit[0]);
//					   }else{
//							rewardTenThsProfit1 = parseFloat(rewardTenThsProfit[1]);
//					   }
//					   if(detail){
//							interestSec = GHUTILS.toFixeds(annualInterestSec0,2,'')+"%-"+GHUTILS.toFixeds(annualInterestSec0 + rewardYieldRange1,2,'%')
//					   }else if(showSign){
//							interestSec = GHUTILS.toFixeds(annualInterestSec0,2,showSign)+"-"+GHUTILS.toFixeds(annualInterestSec0 + rewardYieldRange1,2)
//					   }else{
//							interestSec = GHUTILS.toFixeds(annualInterestSec0,2,'')+"-"+GHUTILS.toFixeds(annualInterestSec0 + rewardYieldRange1,2,'')
//					   }
//					   profit = GHUTILS.toFixeds(tenThsPerDayProfit0,2,'')+"-"+GHUTILS.toFixeds(tenThsPerDayProfit0 + rewardTenThsProfit1,2,'')
//					   break
//			default : break
//		}
//		
//		return {"interestSec": interestSec, "profit": profit}
//	},
	switchShowType: function(tradeObj){
		if(!tradeObj){
			return {"interestSec": 0,"profit": 0}
		}
		var annualInterestSec = [];
		var annualInterestSec0 = "", annualInterestSec1 = "";
		var interestSec = "", profit = "";
		
		if(tradeObj.annualInterestSec.split("-").length > 1){
			annualInterestSec = tradeObj.annualInterestSec.split("-");
			annualInterestSec0 = annualInterestSec[0].replace('%','');
			annualInterestSec1 = annualInterestSec[1].replace('%','');
			
//			if(tradeObj.rewardInterest){
//				annualInterestSec0 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec0, tradeObj.rewardInterest), 2)
//				annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, tradeObj.rewardInterest), 2)
//			}
			
			if(tradeObj.rewardYieldRange){
				var rewardYield = tradeObj.rewardYieldRange.replace(/\%/g,'').split('-')
				if(rewardYield.length == 1){
					annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, rewardYield[0]), 2)
				}else{
					annualInterestSec1 = GHUTILS.toFixeds(GHUTILS.Fadd(annualInterestSec1, rewardYield[1]), 2)
				}
			}
			
			interestSec = annualInterestSec0 + "-" + annualInterestSec1
		}else{
			interestSec = tradeObj.annualInterestSec.replace('%','');
//			if(tradeObj.rewardInterest){
//				interestSec = GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, tradeObj.rewardInterest), 2)
//			}
			
			if(tradeObj.rewardYieldRange){
				var rewardYield = tradeObj.rewardYieldRange.replace(/\%/g,'').split('-')
				if(rewardYield.length == 1){
					interestSec += '-' + GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, rewardYield[0]), 2)
				}else{
					interestSec += '-' + GHUTILS.toFixeds(GHUTILS.Fadd(interestSec, rewardYield[1]), 2)
				}
			}
		}
		
		if(tradeObj.rewardInterest){
			interestSec += '%+' + GHUTILS.toFixeds(tradeObj.rewardInterest, 2)
		}
		
		var tenThsPerDayProfit = tradeObj.tenThsPerDayProfit.split('-')
		if(tradeObj.rewardTenThsProfit){
			if(tenThsPerDayProfit.length > 1){
				if(tradeObj.rewardTenThsProfit.split('-').length > 1){
					profit = tenThsPerDayProfit[0] + '-' + GHUTILS.Fadd(tenThsPerDayProfit[1], tradeObj.rewardTenThsProfit.split('-')[1])
				}else{
					profit = tenThsPerDayProfit[0] + '-' + GHUTILS.Fadd(tenThsPerDayProfit[1], tradeObj.rewardTenThsProfit)
				}
			}else{
				if(tradeObj.rewardTenThsProfit.split('-').length > 1){
					profit = tenThsPerDayProfit[0] + '-' + GHUTILS.Fadd(tenThsPerDayProfit[0], tradeObj.rewardTenThsProfit.split('-')[1])
				}else{
					profit = tenThsPerDayProfit[0] + '-' + GHUTILS.Fadd(tenThsPerDayProfit[0], tradeObj.rewardTenThsProfit)
				}
			}
		}else{
			profit = tradeObj.tenThsPerDayProfit
		}
		
		return {"interestSec": interestSec,"profit": profit}
	},
	/**
	 * get cookie
	 * @param {Object} cookie
	 * @param {Object} name
	 */
	getCookie: function(cookie, name) {
		var str = "; " + cookie + "; ",
			index = str.indexOf("; " + name + "=");
		if (index != -1) {
			var tempStr = str.substring(index + name.length + 3, str.length),
				target = tempStr.substring(0, tempStr.indexOf("; "));
			return decodeURIComponent(target);
		}
		return null;
	},
	isLogin: function(callback,url){
		var _this = this;
		GHUTILS.LOAD({
			url: GHUTILS.API.CHA.islogin,
			type: "post",
			callback: function(result){
				if(GHUTILS.checkErrorCode(result)){
					if(result.islogin){
						if(callback){
							callback()
						}
					}else{
						var _url = ''
						if(url){
							_url = url
						}else{							
							_url = window.location.href
						}
						GHUTILS.OPENPAGE({
							url: "../../html/usermgmt/usermgmt-login.html",
							extras: {
								actionUrl:encodeURIComponent(_url)
							}
						});
						
					}
				}
			}
		})
	},
	checkLogin:function(func){
		if(GHUTILS.userInfo){
			if(typeof(func) == "function"){
				func.apply(null, arguments);
			}
		}else{
			GHUTILS.getUserInfo(function(result){
				if(result.islogin){
					func.apply(null, arguments);
				}
			},true)
		}
	},
	bottomNav: function(){
		$(".app_nav_bottom").find(".app-tab-item").off().on("click",function(){
			
			
		})
	},
	nativeUI:{
//		app里面加载数据loading
		showWaiting: function(){
			if($(".app_loading_box").length == 0){
				var appLoadingBox = '<div class="app_loading_box"><div class="mui-loading"><div class="mui-spinner"></div></div></div>'
				$("body").append(appLoadingBox);
			}
			$(".app_loading_box").addClass("app_active");
			setTimeout(function(){
				$(".app_loading_box").addClass("app_show");
			},100);

		},
		closeWaiting:function(){
			$(".app_loading_box").removeClass("app_show");
			setTimeout(function(){
				$(".app_loading_box").removeClass("app_active");
			},200)
		}
	},
	dialogBox:{
		show: function(){
			$(".app_dialog_warp").addClass("app_active");
			setTimeout(function(){
				$(".app_dialog_warp").addClass("app_show");
			},100);
			
			$(".app_close_box").off().on("click",function(){
				GHUTILS.dialogBox.hide();
			})
			
		},
		hide:function(){
			$(".app_dialog_warp").removeClass("app_show");
			setTimeout(function(){
				$(".app_dialog_warp").removeClass("app_active");
			},200)
		}
	}
};

