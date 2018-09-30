/*
 Title:用户协议内容
 Author:fan qiao
 Date:2017-3-7 10:05:00
 Version:v1.0
*/
(function($) {
	var Contentpages = function() {
		this.ws = GHUTILS.parseUrlParam(window.location.href)
		this.tips = '#aaa';
		return this;
	}
	Contentpages.prototype = {
		init: function() {
//			GHUTILS.setUserAgent();
//			$(".app_content_box").css({"top": ""+GHUTILS.setTop(54)+"px"})
			this.pageInit();
			this.bindEvent();
			this.getData();
		},
		pageInit: function() {
			var _this = this;
			
			var urlParam = GHUTILS.parseUrlParam(window.location.href)
			if(urlParam.typeId == "PLATFORM" || urlParam.typeId == "BANK"){
				//沪深理财平台服务协议、绑卡协议
				_this.getPlatForm(urlParam);
			}else if(urlParam.typeId == "investFiles"){
				
			}else if(urlParam.typeId == "files"){
				
			}else if(urlParam.typeId == "servicesFiles"){
				
			}else{				
				$(".app_title").html(decodeURIComponent(urlParam.title));
				$(".app_content_txt").append(decodeURIComponent(urlParam.content));
			}
		},
		getData: function() {
			
		},
		getPlatForm: function(urlParam) {
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CMS.getProtocolInfo+"?typeId="+urlParam.typeId,
				type: "post",
				sw: true,
				callback: function(result) {
					if(GHUTILS.checkErrorCode(result, _this.tips)){
						$(".app_title").html(decodeURIComponent(urlParam.title));
						$(".app_content_txt").append(result.content);
					}
				}
			})
		},
		bindEvent: function() {
			
		},
	}
	$(function() {
		var cp = new Contentpages();
		cp.init();
	});
})(Zepto);
