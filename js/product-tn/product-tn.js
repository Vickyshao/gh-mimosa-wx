/*
 Title:定期产品列表
 Author:sunli haiyang
 Date:2016-6-19 13:50:34
 Version:v1.0
*/
(function($) {

	var PRODUCTTN = function(){
		this.ws = null;
		return this;
	}
	PRODUCTTN.prototype = {
		init:function(){
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			
			document.addEventListener("closeAfilter", function(e) {
				$(".app_icon_box").removeClass("app_active");
				$("#app_icon_box img").attr("src","../../images/icon_filter.png")
			});
			
		},		
		getData:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;
			$("#app_filter_btn").on("tap",function(){
				var show = '';
				var obj = $("#app_icon_box");
				var that = $(this);
				if(that.hasClass("app_btn_loading")){
					return
				}
				that.addClass("app_btn_loading");
				setTimeout(function(){
					that.removeClass("app_btn_loading");
				},510);
				if(obj.hasClass("app_active")){
					obj.removeClass("app_active");
					$("#app_icon_box img").attr("src","../../images/icon_filter.png")
					show = 'hide';
				}else{
					obj.addClass("app_active");
					$("#app_icon_box img").attr("src","../../images/icon_filter_active.png")
					show = 'show';
				}
				
				mui.fire(plus.webview.getWebviewById(GHUTILS.PAGESID.PRTTNLIST),"showMenu",{
					show:show
				});
			});
			
			$("#app_filter_btn_02").on("tap",function(){
				var data = {
					sort: "durationPeriodDays",
					order: ""
				};
				
				if($(this).find('img').attr("src") == "../../images/icon_nor.png"){
					data.order = "desc"
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_down.png");
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_nor.png");
				}else if($(this).find('img').attr("src") == "../../images/icon_down.png"){
					data.order = "asc"
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_up.png");
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_nor.png");
				}else{
					data.order = ""
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_nor.png");
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_nor.png");
				}
				if($("#app_icon_box").hasClass("app_active")){
					$("#app_icon_box").removeClass("app_active");
					$("#app_icon_box img").attr("src","../../images/icon_filter.png")
				}
				mui.fire(plus.webview.getWebviewById(GHUTILS.PAGESID.PRTTNLIST),"sortTN",data);
			});
			
			$("#app_filter_btn_03").on("tap",function(){
				var data = {
					sort: "expAror",
					order: ""
				};
				
				if($(this).find('img').attr("src") == "../../images/icon_nor.png"){
					data.order = "desc"
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_down.png");
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_nor.png");
				}else if($(this).find('img').attr("src") == "../../images/icon_down.png"){
					data.order = "asc"
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_up.png");
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_nor.png");
				}else{
					data.order = ""
					$("#app_filter_btn_03 img").attr("src", "../../images/icon_nor.png");
					$("#app_filter_btn_02 img").attr("src", "../../images/icon_nor.png");
				}
				if($("#app_icon_box").hasClass("app_active")){
					$("#app_icon_box").removeClass("app_active");
					$("#app_icon_box img").attr("src","../../images/icon_filter.png")
				}
				mui.fire(plus.webview.getWebviewById(GHUTILS.PAGESID.PRTTNLIST),"sortTN",data);
			});
		},
		resetAfilter:function(){
			
		},
		closeafilter:function(){
			
		}
	}
	$(function(){
		var ptn = new PRODUCTTN();
			ptn.init();
	});
})(Zepto);