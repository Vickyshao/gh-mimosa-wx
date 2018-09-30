/*
 Title:计算器详情
 Author:fanyu
 Date:2016-8-22 09:31:00
 Version:v1.0
*/

mui.init();
mui('.mui-scroll-wrapper').scroll({
	 deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	bounce: false, //是否启用回弹
	scrollX: false, //是否横向滚动
});
(function($) {
	var DT = function() {
		this.ws = plus.webview.currentWebview();
		return this;
	}
	DT.prototype = {
		init: function() {
//			GHUTILS.setUserAgent();
			this.pageInit(); //页面初始化
		},
		pageInit: function() {
			var _this = this;
			$("#app_title").html(_this.ws.title)
			_this.getData(_this.ws.title);
		},
		getData: function(type) {
			var _this = this, step1 = 1,step2 = 1, step3 = 1, max1, max2, max3;
			switch(type){
				case "买房计算器" : 
					$("#app_button").html("买房")
					$("#app_title1").html("房屋总价")
					$("#app_title2").html("几年后使用投资资金买房")
					$("#app_unit").html("万元")
					$("#app_scroll_1").html(_this.getScrollHtml(500, 1, 50))
					$("#app_scroll_2").html(_this.getScrollHtml(7, 0.02, 1))
					$("#app_scroll_3").html(_this.getScrollHtml(15, 0.02, 1))
					step1 = 1,step2 = 0.02, step3 = 0.02, max1 = 500, max2 = 7, max3 = 15;
					break
				case "教育计算器" : 
					$("#app_button").html("教育")
					$("#app_title1").html("教育投资总价")
					$("#app_title2").html("准备连续储蓄几年")
					$("#app_unit").html("元")
					$("#app_scroll_1").html(_this.getScrollHtml(100000, 20, 1000))
					$("#app_scroll_2").html(_this.getScrollHtml(7, 0.02, 1))
					$("#app_scroll_3").html(_this.getScrollHtml(15, 0.02, 1))
					step1 = 20,step2 = 0.02, step3 = 0.02, max1 = 100000, max2 = 7, max3 = 15;
					break
				case "养老计算器" : 
					$("#app_button").html("养老")
					$("#app_title1").html("养老总金额")
					$("#app_title2").html("准备连续储蓄几年")
					$("#app_unit").html("元")
					$("#app_scroll_1").html(_this.getScrollHtml(500000, 200, 10000))
					$("#app_scroll_2").html(_this.getScrollHtml(25, 0.02, 1))
					$("#app_scroll_3").html(_this.getScrollHtml(15, 0.02, 1))
					step1 = 200,step2 = 0.02, step3 = 0.02, max1 = 500000, max2 = 25, max3 = 15;
					break
				default : break
			}
			
			var pad = document.body.clientWidth - 30
			$(".mui-scroll").css({"padding-left":pad/2,"padding-right":pad/2})
			
			$(".mui-scroll .app-control-items .num").each(function(){
				right = $(this).width()/2
				$(this).css("right",-right)
			})
			this.bindEvent(step1, step2, step3, max1, max2, max3); //事件绑定
		},
		bindEvent: function(step1, step2, step3, max1, max2, max3) {
			var _this = this;
			
			var scroll_01 = mui('#app_scroll_01').scroll();
			document.querySelector('#app_scroll_01').addEventListener('scroll', function (e) {
				$("#app_count_01").val(GHUTILS.Fmul(-parseInt(scroll_01.x), step1))
				_this.getVolume();
			})
			
			var scroll_02 = mui('#app_scroll_02').scroll();
			document.querySelector('#app_scroll_02').addEventListener('scroll', function (e) {
				$("#app_count_02").val(GHUTILS.Fmul(-parseInt(scroll_02.x), step2))
				_this.getVolume();
			})
			
			var scroll_03 = mui('#app_scroll_03').scroll();
			document.querySelector('#app_scroll_03').addEventListener('scroll', function (e) {
				$("#app_count_03").val(GHUTILS.Fmul(-parseInt(scroll_03.x), step3))
				_this.getVolume();
			})
			
			$("#app_invest").on("tap", function(){
				var wg = plus.webview.getLaunchWebview();
				mui.fire(wg, "showtab", {
					tabindex: 1
				});
				plus.webview.currentWebview().opener().close("none", 0)
				plus.webview.currentWebview().close("none", 0)
			})
			
			$(".app_investinput").on({
				'input': function(){
					_this.getVolume();
				},
				"focus":function(){
					$(document).on('keyup', function (e) {
						if (e.keyCode === 13) {
							$(".app_investinput").blur();
						}
					}.bind(this))
				},
				'blur': function(){
					$(document).off('keyup')
				}
			})
			
			$("#app_count_01").on({
				'input': function(){
					if($(this).val() > max1){
						$(this).val(max1)
					}
				},
				'blur': function(){
					mui('#app_scroll_01').scroll().scrollTo(-GHUTILS.Fdiv($(this).val(), step1), 0, 0)
				}
			})
			
			$("#app_count_02").on({
				'input': function(){
					if($(this).val() > max2){
						$(this).val(max2)
					}
				},
				'blur': function(){
					mui('#app_scroll_02').scroll().scrollTo(-GHUTILS.Fdiv($(this).val(), step2), 0, 0)
				}
			})
			
			$("#app_count_03").on({
				'input': function(){
					if($(this).val() > max3){
						$(this).val(max3)
					}
				},
				'blur': function(){
					mui('#app_scroll_03').scroll().scrollTo(-GHUTILS.Fdiv($(this).val(), step3), 0, 0)
				}
			})
		},
		getScrollHtml: function(total, smallStep, bigStep){
			var html = '';
			var st = GHUTILS.Fdiv(total, smallStep)/50 - 1
			for(var i = 0;i < st;i++){
				html += '<div class="app-control-items"><span class="num">'+(i+2)*bigStep+'</span></div>'
			}
			html = '<span class="f-num">0</span><div class="app-control-items mui-control-first"><span class="num">'+bigStep+'</span></div>' + html
			return html
		},
		getVolume: function(){
			var rate = GHUTILS.Fadd(GHUTILS.Fdiv(GHUTILS.Fdiv($("#app_count_03").val(), 100), 12), 1)//分母
			var month = GHUTILS.Fmul($("#app_count_02").val(), 12)//幂
			if($("#app_unit").html() == "万元"){
				var totalVolume = GHUTILS.Fmul($("#app_count_01").val(), 10000)//总金额
			}else{
				var totalVolume = $("#app_count_01").val()
			}
			var investVolume = GHUTILS.Fdiv(GHUTILS.Fmul(GHUTILS.Fdiv(totalVolume, Math.pow(rate, month)), 10000), month)
			if($("#app_count_01").val() == 0 || $("#app_count_02").val() == 0 || $("#app_count_03").val() == 0){
				$("#app_money").html(GHUTILS.formatCurrency(0))
			}else{
				$("#app_money").html(GHUTILS.formatCurrency(investVolume))
			}
		}
	}
	mui.plusReady(function() {
		var PR = new DT();
		PR.init();
	});
})(Zepto);