/*
 Title:新手指南
 Author: 
 Date:
 Version:v1.0
*/
(function($) {
	var GUIDE = function(){
//		this.ws = plus.webview.currentWebview();
		return this;
	}
	GUIDE.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
			this.getData();//获取数据
		},
		pageInit:function(){
			var _this = this;
			GHUTILS.nativeUI.closeWaiting();
			var mySwiper = new Swiper ('.swiper-container', {
			    loop: true,
//			    autoplay: 3000,
			    // 如果需要分页器
			    pagination: '.swiper-pagination',
			    paginationClickable: true,
//		        paginationBulletRender: function (swiper, index, className) {
//		            return '<span class="' + className + '">' + (index + 1) + '</span>';
//		        },

			    // 如果需要前进后退按钮
			    nextButton: '.swiper-button-next',
			    prevButton: '.swiper-button-prev',
			    
			    // 如果需要滚动条
			  })
			$(".swiper-pagination-bullet").eq(0).html("注册")
			$(".swiper-pagination-bullet").eq(1).html("认证绑卡")
			$(".swiper-pagination-bullet").eq(2).html("充值")
			$(".swiper-pagination-bullet").eq(3).html("投资")
			$(".swiper-pagination-bullet").eq(4).html("查看收益")
		},
		getData:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;
		}
	}
	$(function(){
		var guide = new GUIDE();
			guide.init();
	})
})(Zepto);
