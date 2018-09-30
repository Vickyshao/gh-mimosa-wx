/*
 Title:首页配置
 Author:yang sen
 Date:2016年8月11日15:02:24
 Version:v1.0
*/

var index_cfg = [
	{
		"navTab": "首页",
		"navPageId":"app_homepage",
		"refreshPageId":"homopagewebview",
		"navIcon":"app_icon_home",
		"titleType":"txt",
		"titleGrounp":[],
		"titleId":"app_title",
		"pageUrl":"html/index/index-homepage.html",
		"titleIconLeft":{
			"icon":"",
			"id":"",
			"url":"",
			"pageid":"",
			"checklogin":""
		},
		"titleIconRight":{
//			"icon":"app_icon_scan",
//			"id":"app_btn_scan",
//			"url":"html/index/index-scan.html",
//			"pageid":"scan",
//			"checklogin":"false"
			"icon":"",
			"id":"",
			"url":"",
			"pageid":"",
			"checklogin":""
		},		
		"checklogin":"false"
	},
	{
		"navTab": "理财",
		"navPageId":"app_productlist",
		"navIcon":"app_icon_tn",
		"titleType":"tabGrounp",
		"titleGrounp":[{
			"pageTxt":"活期",
			"pageId":"app_productt0",
			"refreshPageId":"productt0list",
			"pageUrl":"html/product-t0/product-t0.html"
			},{
			"pageTxt":"定期",
			"pageId":"app_producttn",
			"refreshPageId":"producttnlist",
			"pageUrl":"html/product-tn/product-tn.html"
		}],
		"titleId":"app_title_buttons",
		"pageUrl":"",
		"titleIconLeft":{
			"icon":"",
			"id":"",
			"url":"",
			"pageid":"",
			"checklogin":""
		},
		"titleIconRight":{
			"icon":"",
			"id":"",
			"url":"",
			"pageid":"",
			"checklogin":""
		},
		"checklogin":"false"
	},
	{
		"navTab": "我的",
		"navPageId":"app_account",
		"refreshPageId":"accountwebview",
		"navIcon":"app_icon_my",
		"titleType":"txt",
		"titleGrounp":[],
		"titleId":"app_title",
		"pageUrl":"html/account/account.html",
		"titleIconLeft":{
//			"icon":"app_icon_setting",
//			"id":"app_btn_setting",
//			"url":"html/setting/setting.html",
//			"pageid":"setting",
//			"checklogin":"true"
			"icon":"",
			"id":"",
			"url":"",
			"pageid":"",
			"checklogin":""
		},
		"titleIconRight":{
//			"icon":"app_icon_imy",
//			"id":"app_btn_account",
//			"url":"html/account/account-message.html",
//			"pageid":"message",
//			"checklogin":"true"
			"icon":"",
			"id":"",
			"url":"",
			"pageid":"",
			"checklogin":""
		},
		"checklogin":"true"
	}
];

var homepageCfg = [
	{
		"module": "banner",
		"keyname": "banner",
		"path":"index-homepage/index-banner",
		"eventbind": true
	},
	{
		"module": "notice",
		"keyname": "notice",
		"path":"index-homepage/index-notice",
		"eventbind": true
	},
//	{
//		"module": "gridnav",
//		"keyname": "gridnav",
//		"path":"index-homepage/index-gridnav",
//		"eventbind": false
//	},
	{
		"module": "safe",
		"keyname": "safe",
		"path":"index-homepage/index-safe",
		"eventbind": true
	},
	{
		"module": "productlist",
		"keyname": "productlist",
		"path":"index-homepage/index-productlist",
		"eventbind": true
	},
	{
		"module": "accumulate",
		"keyname": "accumulate",
		"path":"index-homepage/index-accumulate",
		"eventbind": true
	},
	{
		"module": "activities",
		"keyname": "actcarousel",
		"path":"index-homepage/index-activities",
		"eventbind": false
	},
	{
		"module": "minbanner",
		"keyname": "activity",
		"path":"index-homepage/index-minbanner",
		"eventbind": true
	},
	{
		"module": "newlist",
		"keyname": "information",
		"path":"index-homepage/index-newlist",
		"eventbind": true
	}
];
var getCfgBind = function(value){
	
	var info = null;
	
	for (var i = 0; i < homepageCfg.length; i++) {
		if(homepageCfg[i].keyname == value){
			info = homepageCfg[i].eventbind;
		}
	}
	return info;
}
var getIndexCfgInfo = function(key){
	
	var info = null;
	
	for (var i = 0; i < index_cfg.length; i++) {
		
		mui.each(index_cfg[i], function(m,n) {
				
			if(n == key){
				info = index_cfg[i];
			}
		});

	}
	return info;
}

