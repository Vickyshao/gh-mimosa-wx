/*
 Title:首页
 Author:cui xu
 Date:2017-3-1 15:02:10
 Version:v1.0
*/
mui.init();
(function($) {

	var DR = function() {
		this.ws = null;
		return this;
	}
	DR.prototype = {
		init: function() {
			this.pageInit(); //页面初始化
			this.bindEvent(); //事件绑定
			this.getData(); //获取数据
		},
		pageInit: function() {
			var _this = this;
			_this.ws =  GHUTILS.parseUrlParam(window.location.href)
			$("#app_send_Amt").html(GHUTILS.formatCurrency(_this.ws.Amt))
//			$("#app_send_time").html(_this.ws.time)
			$("#app_send_time").html('2016-08-27')
			console.log(_this.ws.ID);
			/*对应显示ID
			 * 
			 * app_box_recharge // 充值
			 * app_box_withdraw // 提现
			 * app_box_t0order // 活期认购
			 * app_box_tnorder // 定期认购
			 * app_box_t0redeem // 活期赎回
			 * * */
			switch(_this.ws.ID){
				case 'app_box_recharge':
					$('#app_title').html('充值');
					$('#app_box_recharge').removeClass('app_none');
					if(_this.ws.success) {
						$('#app_box_suc').removeClass('app_none');
					} else {
						$('#app_box_err').removeClass('app_none');
					}
					break;
				case 'app_box_withdraw':
					$('#app_title').html('提现');
					$('#app_box_withdraw').removeClass('app_none');
					break;
				case 'app_box_t0order':
					$('#app_title').html('活期认购');
					$('#app_t0_curDate').html(_this.ws.curDate);
					$('#app_t0_valueDate').html(_this.ws.valueDate);
					$('#app_box_t0order').removeClass('app_none');
					break;
				case 'app_box_tnorder':
					$('#app_title').html('定期认购');
					$('#app_tn_curDate').html(_this.ws.curDate);
					$('#app_tn_valueDate').html(_this.ws.valueDate);
					$('#app_tn_bdJxEndDt').html(_this.ws.bdJxEndDt);
					$('#app_box_tnorder').removeClass('app_none');
					break;
				case 'app_box_t0redeem':
				    $('#app_title').html('活期赎回');
//					$('#app_curDate').html(_this.ws.curDate);
//					$('#app_nextWorkDay').html( _this.ws.nextWorkDay); 
					$('#app_box_t0redeem').removeClass('app_none');
					break;
				default:
					break;
			}
			if(_this.ws.ID == "app_box_recharge"){
				if(!$.isEmptyObject(_this.ws.opener().parent())){
					_this.ws.opener().parent().close("none",0);
				}
			}
			setTimeout(function(){
//				_this.ws.opener().close("none",0);
			},100)
		},
		getData: function() {
			var _this = this;
//			plus.nativeUI.closeWaiting();
		},
		bindEvent: function() {
			var _this = this;
			
		},
		resetAfilter: function() {

		},
		closeafilter: function() {

		}
	}
	$(function() {
		var dr = new DR();
		dr.init();
	});
})(Zepto);