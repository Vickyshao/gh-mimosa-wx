/*
 Title:newlist
 Author:yang sen
 Date:2016-8-13 12:57:45
 Version:v1.0
*/
define(function(){
    var NEWLIST = (function(){
 		var API = "";

 		return{

 			//初始化
			init:function(data){
//				this.handleInfo(data);
				this.pageInit();
			},
			pageInit:function(){
				var _this = this;
				
				//绑定事件
				if(_this.bind){
					_this.bindEvent();
				}
			},
			handleInfo: function(info) {
				var _this = this;
				//推荐资讯
				if (info && info.length > 0) {

					var infoHtml = '';
					for(var i in info){
						 infoHtml += _this.getInfoHtml(info[i]);
					}
					$("#app_informationList").html(infoHtml);
					
				}else{
					$("#app_informationList").html('<li class="mui-table-view-cell mui-media app_link_pages app_pl5"><img class="mui-media-object mui-pull-left" src="../../images/news_def.png"><div class="mui-media-body"><div class="mui-ellipsis app_f14 app_pt5 app_pb5"></div><p class="mui-h6 mui-ellipsis-2"></p></div></li>');
					
					
				}
				
			},
			getInfoHtml: function(info){
				var _this = this;
				var linkpages = "", content = "", infoHtml = "", thumbnailUrl = "";
				if(info){
					if(info.url){
						linkpages = " app_link_pages";
					}else{
						if(info.content){
							linkpages = " app_content";
							content = info.content
							if(info.content.lastIndexOf(",") != -1 && info.content.length - info.content.lastIndexOf(",") == 1){
								content = encodeURIComponent(info.content.substr(0,info.content.lastIndexOf(",")))
							}
						}
					}
					if(info.thumbnailUrl){
						thumbnailUrl = '<img class="mui-media-object mui-pull-left" src="'+HOST + info.thumbnailUrl+'" data-onlineUrl="'+HOST + info.thumbnailUrl+'" data-load="1" data-type="news">'
					}
					infoHtml = "<li class='mui-table-view-cell mui-media app_pl5"
							   +linkpages+"' data-links='"
							   +info.url+"' data-title='"
							   +info.title+"' data-content='"
							   +content+"'>"+thumbnailUrl+"<div class='mui-media-body'><div class='mui-ellipsis app_f14 app_pt5 app_pb5'>"
							   +info.title+"</div><p class='mui-h6 mui-ellipsis-2'>"
							   +info.summary+"</p></div></li>";
				}
				return infoHtml;
			},
			dateInit:function(){
	
	      	},
	      	bindEvent:function(){
				GHUTILS.linkPages();
				$(".app_content").off().on("tap",function(){
					
					if( $(this).attr("data-content") == "" ){
						return
					}
					
					GHUTILS.OPENPAGE({
						url:"content_pages.html",
						extras:{
							title: $(this).attr("data-title"),
							content: $(this).attr("data-content")
						}
					})
				});
				$('.app_informaion').off().on('tap', function() {
					GHUTILS.OPENPAGE({
						url: "index-information.html",
					})
//					GHUTILS.nativeUI.showWaiting();
				});
	      	}
	      
		}
 	})();

	$["information"] = function(data){

		NEWLIST.bind = getCfgBind("information");
		NEWLIST.init(data);
	}
})