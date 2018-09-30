/*
 Title:首页
 Author:
 Date:2016-6-20 
 Version:v1.0
*/
mui.init();
(function($) {

	var FEEDBACK = function(){
		this.ws = null;
		return this;
	}
	FEEDBACK.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
		},		
		getData:function(){
			var _this = this;
			GHUTILS.getUserInfo(false, true)
		},
		bindEvent:function(){
			//初始化页面连接
			var _this = this;
			$("#app-feedback").on("tap",function(){
				var content=encodeURIComponent($("#app-feedback-content").val().trim());
				var phone=GHUTILS.getLocalUserInfo('userAcc');
				var os="wx";
				var name = GHUTILS.getLocalUserInfo('fullName') || '';
				
				if(!content){
					mui.toast('请输入反馈内容');
					return false;
				}
//				if(phone && !phone.match("^1[3|4|5|7|8][0-9]{9}$")){
//					mui.toast('请输入正确格式的手机号码');
//					return false;
//				}
		    	GHUTILS.LOAD({
					url: GHUTILS.API.CMS.feedback+"?content="+encodeURIComponent(content)+"&phone="+phone+"&os="+os+"&name="+name,
					type: "post",
					async: true,
					sw:true,
					callback: function(result) {
						if(GHUTILS.checkErrorCode(result)){
							mui.toast('反馈成功!');
							setTimeout(function(){
								mui.back();
							}, 2000)
						}
					}
				});
			});
			
			$(".mui-icon-phone").on("tap", function(){
				GHUTILS.LOAD({
					url: GHUTILS.API.CMS.elementConfig+'?codes=["hotline"]',
					type: "post",
					sw: true,
					callback: function(result){
						if(result.errorCode == 0 && result.datas.length > 0){
							result.datas.forEach(function(e, i){
								switch (e.code){
									case "hotline" : 
										_this.showPhoneCall(e.content)
										break
									default : break
								}
							})
						}else{
							_this.showPhoneCall("021-80339858")
						}
					},
					errcallback: function(err){
						_this.showPhoneCall("021-80339858")
					}
				})
			})
		},
		showPhoneCall: function(phoneno){
			mui.confirm('<div>'+phoneno+'</div><div>热线服务时间</div><div>周一至周五09:00-18:00</div>', '拨打客服电话', ["取消","拨打"], function(event) {
				var index = event.index;
				if(index === 1) {
					GHUTILS.phoneCall(phoneno.trim().replace(/\-/g,''));
				}
			},'div');
		}
	}
	$(function(){
		var sett = new FEEDBACK();
			sett.init();
	});
})(Zepto);