/*
 Title:活动列表
 Author:sunli haiyang
 Date:2016-6-21 20:41:37
 Version:v1.0
*/
(function($) {

	var ACTIVITIES = function(){
		return this;
	}
	ACTIVITIES.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			mui.init({
			    pullRefresh : {
			    	indicators:false,
				    container:"#app_pullRefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				    down : {
				      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				      contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				      contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				      callback :function(){
				      	setTimeout(function(){
				      		_this.initDom();
						},500);
				      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				    }
				  }
			});
		},
		getData:function(){
			var _this = this;
			GHUTILS.listLinks()
			_this.initDom();
		},
		bindEvent:function(){
			var _this = this;
			
			$(".activities_box").off().on("tap",function(){
				console.log("click")
				var links = $(this).attr("data-links") || '';
				var title = $(this).attr("data-title") || '';
				var topage = $(this).attr("data-topage") || '';
					
				if (topage == "other") {
					GHUTILS.OPENPAGE({
						url: "../../html/index/index-activite2.html"
					})
				} else if (links)  {
					GHUTILS.OPENPAGE({
						url:"../index/index-linkpage.html",
						extras:{
							links:links,
							title:title
						}
					})
				}
					
			});
		},
		initDom: function(){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.gethome+'?channelOid='+cmsChannelOid,
				type: "post",
				async: true,
				callback: function(result) {
					if(GHUTILS.checkErrorCode(result)){
						var html = "";
						var list = result.info.actcarousel;
						for (var i in list) {
							html += '<div class="activities_box" data-title="'+ list[i].title +'" data-links="'+ list[i].linkUrl +'" data-topage="'+ list[i].toPage +'"><ul class="mui-table-view"><img src="'+ HOST + list[i].picUrl +'" alt="" /><li class="mui-table-view-cell"><a href="javascript:;" class="mui-navigate-right">活动时间：'+ list[i].beginTime +'至'+ list[i].endTime +'</a></li></ul></div>'
						}
						
						$("#app_activities").html(html)
						
						
						_this.bindEvent();//事件绑定
					}
					mui('#app_pullRefresh').pullRefresh().endPulldownToRefresh();
				},
				errcallback: function() {
					mui.toast("网络错误，请稍后再试")
					mui('#app_pullRefresh').pullRefresh().endPulldownToRefresh();
				}
			});
		}
	}
	$(function(){
		var actwv = new ACTIVITIES();
			actwv.init();
	});
})(Zepto);