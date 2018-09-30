/*
 Title:我的邀请
 Author:cui xu
 Date:2017-3-2 14:31:03
 Version:v1.0
*/
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	bounce: false, //是否启用回弹
});
(function($) {

	var ACCOUNT_INVITE = function(){
//		SHARE.GETSHARE();//初始分享列表
		this.counter = 1;
		return this;
	}
	ACCOUNT_INVITE.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
//			$("#app_pullRefresh").css({"top": GHUTILS.setTop(170)+"px !important"})
			this.pageInit();//页面初始化
//			this.getData();//获取数据
			this.bindEvent();//事件绑定
		},
		pageInit:function(){
			var _this = this;	
			//上拉加载
			mui.init({
			    pullRefresh : {
				    container:"#app_pullRefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				    up : {
				      height:50,//可选.默认50.触发上拉加载拖动距离
				      auto:true,//可选,默认false.自动上拉加载一次
				      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
				      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
				      callback :function(){
				      	_this.getData();//获取数据
				      	
				      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				    }
				  }
			});
		},
		getData:function(){
			var _this = this;
//			if(GHUTILS.getloginStatus(true)){
				GHUTILS.LOAD({
					url : GHUTILS.API.CHA.getmyinvites + '?page=' + _this.counter + '&rows=10',
					async : true,
					callback : function(result){
						if (GHUTILS.checkErrorCode(result)) {
							console.log(JSON.stringify(result))
							_this.counter ++;
							$("#account").html(result.total);
							var inviteItem = '';
							if(result.rows.length>0){
								$("#invitePeople").removeClass("app_none")
							}
							for(var p in result.rows){
								inviteItem = _this.addInviteItem(result.rows[p]);
								$("#invitePeople").append(inviteItem);
							}
							
							if(result.rows.length < 10 || $.isEmptyObject(result.rows)){
								mui('#app_pullRefresh').pullRefresh().endPullupToRefresh(true);
							} else {
								mui('#app_pullRefresh').pullRefresh().endPullupToRefresh(false);
							}
						}
					}
				});
//			}

		},
		bindEvent:function(){
			var _this = this;
			$("#charts").on("tap", function(){
				GHUTILS.OPENPAGE({
					url: "account-invite-charts.html"
				})
			})

		},
		addInviteItem:function(item){
			var realName = item.realName?item.realName:"--"
			var inviteObj = '<ul class="mui-table-view mui-grid-view app_pn app_list_title app_bbe app_mt0 app_c26"><li class="mui-table-view-cell mui-media mui-col-xs-5 mui-text-left"><div class="app_f16">'+ item.phone +'</div></li><li class="mui-table-view-cell mui-media mui-col-xs-3 mui-text-left app_notbac"><div class="app_f16">'+ realName +'</div></li><li class="mui-table-view-cell mui-media mui-col-xs-4 mui-text-left app_notbac"><div class="app_f16">'+ item.date.split(" ")[0] +'</div></li></ul>'
//			var inviteObj = '<li class="mui-table-view-cell app_links app_c9'
//				+ '"><a class=""><span class="mui-badge mui-badge-inverted">'
//				+ item.date.split(" ")[0] +'</span>邀请用户手机号:' + (item.phone).substr(0, 3)
//				+ '****'+(item.phone).substr(7, 11)+'</a></li>';
			return inviteObj;
		},
	}
	$(function(){
		var ac = new ACCOUNT_INVITE();
			ac.init();
	});
})(Zepto);
