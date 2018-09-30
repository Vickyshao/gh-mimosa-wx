/*
 Title:资产详情
 Author:fan qiao
 Date:2017-7-29 15:44:22
 Version:v1.0
*/

mui.init();

(function($) {
	var urlParams=GHUTILS.parseUrlParam();
	if (urlParams.as) {
		$("#"+urlParams.as).addClass("mui-active");
	}
	
	var ACCOUNT_DETAILS = function(){
		this.month = '';
		this.day = '';
		this.incomeDateArr = [];
		this.incomes = {};
		this.onlyOne = 0;
		this.account = {};
		return this;
	}
	ACCOUNT_DETAILS.prototype = {
		init:function(){
//			GHUTILS.setUserAgent();
			this.pageInit();//页面初始化
			this.bindEvent();//事件绑定
//			this.getData();//获取数据
			this.bindDtpicker()
			//默认显示当前日期
			this.checkDate();
		},
		pageInit:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;
			
			$("#app_title_change").on("tap",function(){
				var obj = $(this);
				var style = obj.attr("data-show");				
				if(style == "list"){
					obj.removeClass("app_icon_list")
					obj.addClass("app_icon_calender")
					$(".app_box_tab_con").hide();
					$("#app_box_list").show();
					obj.attr("data-show","clander");	
				}else{
					obj.addClass("app_icon_list")
					obj.removeClass("app_icon_calender")
					$(".app_box_tab_con").hide();
					$("#app_box_calendar").show();
					obj.attr("data-show","list");
				}
			})
			
		},
		initjeDate:function(marksArr){
			var _this = this;
			jeDate({
	          dateCell:'#app_calendar_box',
	          format:'YYYY-MM-DD',
	          isinitVal:true,
	          marks: marksArr,
	          choosefun:function(e){
	          	//点击具体日期切换年月
				_this.checkDate(e);				
	          },
	          initfun:function(e){
	            //that.getData(e,1);
	        }});
	        if(_this.onlyOne==0){
				$("#app_calendar_box").trigger("click");
	        	_this.onlyOne = 1;
	        }
		},
		bindDtpicker:function(){
	        var _this = this;
	        document.getElementById("app_date_title").onclick = function(){
	        	var dtitle = this;
                var defdate = this.getAttribute("data-defdate");
                var myDate = new Date();
                var options = {"value":defdate,"type":"month","beginYear":2017,"endYear":myDate.getFullYear()};
                var picker = new mui.DtPicker(options);
               
                picker.show(function(rs) {
                	if($('#app_date_title').hasClass('active')){
                		return
                	}
                	$('#app_date_title').addClass('active')
                    /*
                     * rs.value 拼合后的 value
                     * rs.text 拼合后的 text
                     * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                     * rs.m 月，用法同年
                     * rs.d 日，用法同年
                     * rs.h 时，用法同年
                     * rs.i 分（minutes 的第二个字母），用法同年
                     */
                    /* 
                     * 返回 false 可以阻止选择框的关闭
                     * return false;
                     */
                    /*
                     * 释放组件资源，释放后将将不能再操作组件
                     * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
                     * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
                     * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
                     */                   
                    $("#app_calendar_box").val(rs.value).trigger("click");
					dtitle.setAttribute("data-defdate",rs.value);
					$("#app_date_title_txt").html(rs.y.value + '年' + rs.m.value + '月') ;
					//切换时间
					_this.checkDate(rs.value + '-' + rs.d.value);
                    picker.dispose();
                });
                $('#app_date_title').removeClass('active')
            }
		},
		//日期标题切换显示同时获取每日收益
		checkDate: function(e){
			var _this = this;
		    var myDate = e == null? new Date() : new Date(e.replace(/-/g, "/"));
          	var _m = (myDate.getMonth()+1);
			_m = _m >9 ? _m : "0" + _m;
			var nowMonth = myDate.getFullYear() + "-" + _m ;
			var _d = myDate.getDate();			
			_d = _d >9 ? _d : "0" + _d;
			var nowDay = nowMonth + "-" + _d;			
			$("#app_date_title").attr("data-defdate",nowMonth);				
			$("#app_date_title_txt").html(myDate.getFullYear() + "年" + _m + '月');
			//获取当天日期
			if(!_this.day){
				_this.day = nowDay;
			}			
			//获取每日收益			
			if(_this.month!=nowMonth){
				_this.month = nowMonth;	
				//查询客户一个月内活期定期收益
				_this.getMonthDaysOfIncome(myDate.getFullYear(), _m);
			}	
			//将数据显示到当前列表
			_this.getIncomeHtml(_this.incomes)						
			//初始日期并且将标注显示出来
			_this.initjeDate(_this.incomeDateArr);
			//活期定期收益显示
			var allIncomes = _this.incomes;
			var showDQIncome = false;
			var showHQIncome = false;
			for(var i in allIncomes){
				var dayIncomes = allIncomes[i];
				for(var j in dayIncomes){
					if(j == 'date'){
						continue;
					}
					if(dayIncomes.date == nowDay){
						if(j == 't0Income' && dayIncomes[j]){
							$('#app_xinIncome').html(GHUTILS.formatCurrency(dayIncomes[j]));	
							showHQIncome=true;
						}
						if(j == 'tnIncome' && dayIncomes[j]){
							$('#app_dqIncome').html(GHUTILS.formatCurrency(dayIncomes[j]))
							showDQIncome=true;
						}	
					}
				}
			}				
			if(!showDQIncome){				
				$('#app_dqIncome').html('0.00')
			}
			if(!showHQIncome){
				$('#app_xinIncome').html('0.00')
			}
		},
		//查询客户一个月内活期定期收益
		getMonthDaysOfIncome: function(year, month){
			var _this = this;
			GHUTILS.LOAD({
				url: GHUTILS.API.CHA.accountIncome + '?year=' + year + '&month=' + month,		
				data: {},
				type: "post",
				async: false,
				callback: function(result) {
//					console.log(JSON.stringify(result))
					if (GHUTILS.checkErrorCode(result)) {
						//清除数据
						_this.incomes = {};
						_this.incomeDateArr = [];	
						
						var datas = result.details.rows;
						
						$("#app_totalInt").html(GHUTILS.formatCurrency(result.totalIncome));
						if(result.confirmDate){
							$("#app_confirmDate").html(result.confirmDate);
						}else{
							$(".confirm").css({"display":'none'})
							
						}
						
						_this.incomes = datas;
						var hqIncomes = [];
						var dqIncomes = [];	
						for(var i in datas){
							var currdayIncomes = datas[i];
							for(var j in currdayIncomes){
								if(j == 'date'){
									continue
								}
								if(j == 't0Income' && currdayIncomes[j]){
									hqIncomes.push(currdayIncomes.date);
								}
								if(j == 'tnIncome' && currdayIncomes[j]){
									dqIncomes.push(currdayIncomes.date);
								}
							}							
						}
						_this.incomeDateArr[0] = dqIncomes;
						_this.incomeDateArr[1] = hqIncomes;
						_this.incomeDateArr[2] = [_this.day];
					}
				}
			})
		},		
		getIncomeHtml: function(incomes){
			var html = '';
			for(var i in incomes){
				var currdayIncomes = incomes[i];
				for(var j in currdayIncomes){
					if(j == 'date'){
						continue;
					}
					if(currdayIncomes[j]){
						html +='<li style="line-height:40px"><span class="mui-pull-right">'+ GHUTILS.formatCurrency(currdayIncomes[j]) +'元</span><span>'+ currdayIncomes.date +'</span></li>'
					}
				}
			}
			$('#app_income_list').html(html);
		}		
	}
	GHUTILS.getUserInfo(function() {
		$(function(){
			var ac = new ACCOUNT_DETAILS();
				ac.init();
		});
	},true);
})(Zepto);
