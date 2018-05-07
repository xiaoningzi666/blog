var Editor = function($) {

	// 编辑器对象
	var config, editor, content,
		initConfig = function() {
			var customConfig = {};
			if(typeof(EditorConfig) !== "undefined") {
				customConfig = EditorConfig;
			}
			config = {
				"id": "editor",
				"initContentText": "点击开始编辑内容",
				"uploadImageUrl": "http://pic.zhxing.me/upload",
				"toolBars": ["insertImage", "bold", "italic", "underline"]
			};
			$.extend(config, customConfig);
			editor = $("#" + config.id);
			content = editor.children("#content");
		},
		initEvent = function() {
			// 上传图片
			$("a[data-role=insertImage]").click(() => $("#img").click());
			// 加粗
			$("a[data-role=bold]").click(() => document.execCommand("bold", false));
			// 斜体
			$("a[data-role=italic]").click(() => document.execCommand("italic", false));
			// 下划线
			$("a[data-role=underline]").click(() => document.execCommand("underline", false));
			// 上传事件
			$("#img").change(function() {
				var files = this.files;
				var image = files[0];
				var formData = new FormData(); //初始化一个FormData对象
				formData.append("image", image);
				$.ajax({
					url: config.uploadImageUrl,
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(data) {
						console.log(data);
						var code = data.code;
						var msg = data.msg;
						if(code == "") {
							document.execCommand("insertImage", false, msg);
						} else {
							alert(msg);
						}
						return;
					},
					error: function(data) {
						console.log("upload image failed")
					}
				});
			});
			// 键盘监听事件
			$("#content").keyup(function(e) {
				var keyCode = e.keyCode;
				if(keyCode == 8) { // delete
					var html = $(this).html();
					if(html == "") {
						document.execCommand("insertHTML", false, "<p><br></p>");
					}
				}
			});
		},
		initContentText = function() {
			// 初始化编辑内容
			content.html("<p>" + config.initContentText + "</p>");
		};

	// 检查并初始化编辑器配置
	initConfig();
	initContentText();
	initEvent();

	// 编辑器可用属性
	return {
		getHtmlContent: function() {
			// 获取编辑器内容
			return content.html();
		},
		getTextContent: function() {
			return content.text();
		},
		clearHtmlContent: function() {
			initContentText();
		}
	};

}(window.jQuery);