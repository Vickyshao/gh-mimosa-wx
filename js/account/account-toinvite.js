/*
 Title:首页
 Author:fan qiao
 Date:2017-07-31 15:27:26
 Version:v1.0
*/

(function($) {

	var ACCOUNT_INVITE = function(){
		SHARE.GETSHARE();//初始分享列表
		this.counter = 1;
		this.contents = {
     		href: HOST + '/mimosah5/share/register.html?inviteCode=' + GHUTILS.getLocalUserInfo('sceneid'),
     		title: '沪深理财，1元起投，预期最高收益10%',
     		content: '国企控股平台安全有保证',
     		thumbs: HOST + '/mimosah5/share/img/shareicon.png'
		} 
		return this;
	}
	ACCOUNT_INVITE.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
		},
		pageInit:function(){
			var _this = this;
//			_this.getFriendEventInfo();
//			_this.getRegisterEventInfo();
			_this.flag = false;
			_this.check();
			_this.getInviteRule();
		},
		bindEvent:function(){
			var _this = this;
			//我的邀请
			$("#myinvite").off().on("tap", function() {		
				if(GHUTILS.getloginStatus(true)){
					GHUTILS.OPENPAGE({
						url: "account-invitation.html",
						extras: {
							invitecode: _this.invitecode
						}
					})
				}
			});
			
			$("#share_btn").on("tap",function(){
//				if(_this.flag == "yes"){
//					mui.toast("投资满1次后即可成为邀请人，快去投资吧！")
//				}else {
					if(!$("#share_btn").hasClass('active')){
			   			GHUTILS.silderBox.show("#share_list");
			   		}
//				}
		   });
		    $("#copy_btn").on("tap",function(){
				if(_this.flag == "yes"){
					mui.toast("投资满1次后即可成为邀请人，快去投资吧！")
				}else {
					GHUTILS.copyToClip($("#sceneid").html())
				}
		    });
		    $(".app_icon_close").on("tap",function(){
		    	GHUTILS.silderBox.hide("#share_list");
		    });
		    
		     //微信好友分享
		     $("#app_wxfriend").on("tap",function(){	
		     	//友盟监听
		    	SHARE.POSTSHARE(0, '#share_list', _this.contents)
		    });
		    //微信朋友圈分享
		     $("#app_wxfriendaround").on("tap",function(){
		     	//友盟监听
		    	SHARE.POSTSHARE(1, '#share_list', _this.contents)
		    });
		    //QQ分享
//		     $("#app_qq").on("tap",function(){
//		     	//友盟监听
//		    	SHARE.POSTSHARE(2, '#share_list', _this.contents)
//		    });
		},
		check: function() {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.usermoneyinfo,
				type: "post",
				sw: true,
				callback: function(result) {
					console.log(JSON.stringify(result))
					_this.flag = result.isFreshman
//					if(_this.flag == "yes"){
//						$("#sceneid").html("投资满1次显示")
//					} else {
						var code = GHUTILS.getLocalUserInfo("sceneid")
						$("#sceneid").html(code)
						
						var _url = "https://www.hushenlc.cn/mimosah5/share/register.html"
					    if (_url.indexOf('?')) {
							var link = _url + "?inviteCode=" + code
						} else {
							var link = _url + "&inviteCode=" + code
						}
					    $('#link').val(link)
//					}
				}
			})
			
//			$("#sceneid").html("投资满1次显示邀请码")
		},
		//获取活动规则
		getProtocolInfo: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.getActRuleInfo+"?typeId=INVITE",
				type: "post",
				sw: true,
				callback: function(result) {
					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						$("#app_rules").html(function(){
							if(result.content){
								return "<li>" + result.content + "</li>"
							}else{
								return "<li>暂无</li>"
							}
						})
					}
				}
			})
		},
		//获取邀请红包值
		getFriendEventInfo: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.getEventInfo,
				data:{
					eventType: "friend",
					couponType: "coupon"
				},
				type: "post",
				sw: true,
				callback: function(result) {
//					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result)){
						$("#content").removeClass("app_none")
						$("#amount").html(result.money)
						_this.contents.title = '沪深理财，超高收益，全场加息！还送'+ result.money +'元体验金';
						_this.contents.href = HOST + '/mimosah5/share/register.html?inviteCode=' + GHUTILS.getLocalUserInfo('sceneid')
					} else{
						 $(".mui-content").html("<div class='text-align-center app_mt20'><img src='../../images/app-nodata1.png' width='120px'/><div class='app_mt20 app_cgray'>暂无活动</div></div>")
					}
				}
			})
		},
		//获取注册红包值
		getRegisterEventInfo: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.getEventInfo,
				data:{
					eventType: "newUser",
					couponType: "coupon"
				},
				type: "post",
				sw: true,
				callback: function(result) {
					if(GHUTILS.checkErrorCode(result)){
     					_this.contents.title = '沪深理财，超高收益，全场加息！还送'+ result.money +'元体验金';
						_this.contents.href = HOST + '/mimosah5/share/register.html?inviteCode=' + GHUTILS.getLocalUserInfo('sceneid')
					}
				}
			})
		},
		//获取邀请规则
		getInviteRule: function(){
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.getActRuleInfo+"?typeId=INVITE",
				type: "post",
				sw: true,
				callback: function(result){
//					console.log(JSON.stringify(result))
					if(GHUTILS.checkErrorCode(result) && result.content){
						$("#app_inviteRuleTitle").html("活动规则")
						$("#app_inviteRule").html(result.content)
					}
				}
			})
		}
	}
	GHUTILS.getUserInfo(function(){
		$(function(){
			var ac = new ACCOUNT_INVITE();
				ac.init();
		});
	},true);
	
})(Zepto);
