var SHARE = {};
var shares = {};
SHARE = {
	GETSHARE: function(){					
//		$.share.getServices(function(s) {
//			if (s && s.length > 0) {
//				for (var i = 0; i < s.length; i++) {
//					var t = s[i];
//					shares[t.id] = t;
//				}
//			}
//		}, function() {
//			console.log("获取分享服务列表失败");
//		});		
	},
	//发送分享
	POSTSHARE:function(sindex, obj, contents){
		var ids = [{
				id: "weixin",
				ex: "WXSceneSession"  //微信好友
			}, {
				id: "weixin",
				ex: "WXSceneTimeline" //朋友圈
			}, {
				id: "qq"	          //QQ好友			
			}];			
		var share = shares[ids[sindex].id];
		if (share) {
			if (share.authenticated) {
				SHARE.SHAREMESSAGE(share, ids[sindex].ex, contents);
				//分享弹框隐藏
				GHUTILS.silderBox.hide(obj);
			} else {
				share.authorize(function() {
					SHARE.SHAREMESSAGE(share, ids[sindex].ex, contents);
					//分享弹框隐藏
					GHUTILS.silderBox.hide(obj);						
				}, function(e) {
					console.log("认证授权失败：" + e.code + " - " + e.message);
				});
			}
		} else {
			GHUTILS.toast("分享失败")
		}			
	},
	//发送分享内容
	SHAREMESSAGE: function(share, ex, contents) {
		var msg = {
			extra: {
				scene: ex
			}
		};
		//微博不支持href分享
		if(share.id == 'sinaweibo'){
			msg.content = contents.title + ',' + contents.content + encodeURI(contents.href);
		}else{
			msg.href = encodeURI(contents.href) || '';
			msg.content = contents.content || '';
		}
		msg.title = contents.title || '';
		msg.thumbs = [contents.thumbs];			
					
		share.send(msg, function() {
			GHUTILS.toast("分享到\"" + share.description + "\"成功！ ");
		}, function(e) {
			console.log("分享到\"" + share.description + "\"失败: " + e.code + " - " + e.message);
		});
	}
}
