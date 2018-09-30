/*
 Title:首页
 Author:cui xu
 Date:2017-3-2 15:31:09
 Version:v1.0
*/

(function($) {

	var ACCOUNT_INVITE = function(){
		this.ws = null;
		this.counter = 1;
		return this;
	}
	ACCOUNT_INVITE.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.getData();//获取数据
			this.bindEvent();//事件绑定
//			this.addInviteItem();
		},
		pageInit:function(){
			var _this = this;	
			//下拉刷新
			mui.init({
			    pullRefresh : {
				    container:"#app_pullRefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				    down : {
				      height:40,//可选,默认40.触发下拉刷新拖动距离,
				      auto: true,//可选,默认false.自动下拉刷新一次
				      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				      contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				      contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				      callback :function(){
				      	setTimeout(function(){
							mui('#app_pullRefresh').pullRefresh().endPulldownToRefresh();
						},500);
				      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				    }
				  }
			});
		},
		getData:function(){
			var _this = this;
//			if(GHUTILS.getloginStatus(true)){
				GHUTILS.LOAD({
					url : GHUTILS.API.CHA.invitecharts,
					async : true,
					callback : function(result){
						if (GHUTILS.checkErrorCode(result)) {
							_this.counter ++;
							if(result.rows.length > 0){
								$("#invitePeople").removeClass("app_none")
							}
							var inviteItem = '';
							for(var p in result.rows){
								inviteItem = _this.addInviteItem(result.rows[p]);
								$("#invitePeople").append(inviteItem);
							}
						}
					}
				});
//			}

		},
		bindEvent:function(){
			var _this = this;

		},
		addInviteItem:function(item){
			var realName = item.realName?item.realName:"--"
			var inviteObj = '<ul class="mui-table-view app_bbe mui-grid-view app_pn app_list_title app_mt0 app_c26"><li class="mui-table-view-cell mui-media mui-col-xs-5 mui-text-left"><div class="app_f16">'+ item.phoneNum +'</div></li><li class="mui-table-view-cell mui-media mui-col-xs-3 mui-text-left app_notbac"><div class="app_f16">'+ realName +'</div></li><li class="mui-table-view-cell mui-media mui-col-xs-4 mui-text-left app_notbac"><div class="app_f16">'+ item.recommendCount +'</div></li></ul>'
			return inviteObj;
		},
	}
	$(function(){
		var ac = new ACCOUNT_INVITE();
			ac.init();
	});
})(Zepto);
