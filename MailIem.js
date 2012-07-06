var MailItem = function(item) {
	var canvas = $("<div/>").append(item.text);
	
	if(item.attachment != null) {
		var imageCanvas = $("<div/>").appendTo(canvas);
		var attachCanvas = $("<ul/>").appendTo(canvas);
		
		$.each(item.attachment, function(i, attach) {
			if(attach.contentType.substring(0,5) == "image") {
				var aObj = $("<a/>").attr({
					href: attach.path,
					target: "_TRG_"+attach.filename
				}).appendTo(imageCanvas);
				
				$("<img/>").attr({
					"src": attach.path,
					style: "padding:5px 5px 5px 5px; height:130px;"
				}).appendTo(aObj);				
				
				
				$("<em/>").append("&nbsp;").appendTo(imageCanvas);
			} else {
				var li = $("<li/>").appendTo(attachCanvas);
				
				$("<a/>").attr({
					href: attach.path,
					target: "_TRG_"+attach.filename
				}).append(attach.filename).appendTo(li);
			}
		});
	}	
	
	return canvas;
};
