/*
 Title:minbanner
 Author:yang sen
 Date:2016-8-13 12:57:45
 Version:v1.0
*/

define(function(){
    var MINBANNER = (function(){
 		var API = "";

 		return{

 			//初始化
			init:function(data){
//				this.handleActivity(data);
			},
			pageInit:function(){
				//console.log("minbanner")
			},
			handleActivity: function(activity) {
				var _this = this;
				$("#app_newcomer_activity_left").off();
				$("#app_newcomer_activity_right").off();
				$("#app_newcomer_activity_pic1").attr({
					"src": "../../images/activity_def.png"
				});
				$("#app_newcomer_activity_pic2").attr({
					"src": "../../images/activity_def.png"
				});
				//活动图片
				if (activity && activity.length > 0) {
					$.each(activity, function(i, e) {
						if(e.location == "left"){
							$("#app_newcomer_activity_pic1").attr({
								"src": e.picUrl,
								"data-onlineUrl": e.picUrl,
								"data-load": "1",
								"data-type": "activity"
							});
							_this.activityTap($("#app_newcomer_activity_left"), e);
						}else if(e.location == "right"){
							$("#app_newcomer_activity_pic2").attr({
								"src": e.picUrl,
								"data-onlineUrl": e.picUrl,
								"data-load": "1",
								"data-type": "activity"
							});
							_this.activityTap($("#app_newcomer_activity_right"), e);
						}
					});
				}
			},
			activityTap: function(obj, e){
				if(e.linkUrl){
					obj.off().on('tap', function(){
						GHUTILS.OPENPAGE({
							url:"../../../html/index/index-linkpage.html",
							extras:{
								links:e.linkUrl,
								title:e.title
							}
						})
					})
				}else{
					obj.off().on('tap', function(){
						GHUTILS.OPENPAGE({
//							url: "index-product.html",
//							id: GHUTILS.PAGESID.PCT,
//							extras: {
//								showId: e.toPage
//							}
							url: "../../../html/usermgmt/usermgmt-reg.html",
						})
//						GHUTILS.nativeUI.showWaiting();
					})
				}
			},
			bindEvent:function(){
				$("#app_newcomer_activity_pic1").off().on("tap", function() {
				//友盟监听
//					plus.statistic.eventTrig( "app_newcomer_activity_1", "app-newcomer-activity-1" );
	
				});
				$("#app_newcomer_activity_pic2").off().on("tap", function() {
					//友盟监听
//					plus.statistic.eventTrig( "app_newcomer_activity_2", "app-newcomer-activity-2" );
				});
			},
			dateInit:function(){
	
	        }
		}
 	})();
	
	$["activity"] = function(data){
		MINBANNER.init(data);
	}
})