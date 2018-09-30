/*
 Title:accumulate
 Author:yang sen
 Date:2016-8-13 12:57:45
 Version:v1.0
*/
define(function(){
    var SAFE = (function(){
 		var API = "";

 		return{

 			//初始化
			init:function(){
				this.pageInit();
			},
			pageInit:function(){
				//console.log("gridnav")
				_this.bindEvnet()
			},
			bindEvnet:function(){
				var _this = this;
			},
			dateInit:function(){

	        }
		}
 	})();

	$["safe"] = function(){
		BANNER.bind = getCfgBind("safe");	
		SAFE.init();
	}
})