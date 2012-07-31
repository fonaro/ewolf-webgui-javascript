var PopUp = function(frame, activator) {
	var thisObj = this;
	
	var pos = $(activator).position();

	// .outerWidth() takes into account border and padding.
	var width = $(activator).outerWidth() - 26;
	var height = $(activator).outerHeight();
	
	var leftMargin = parseInt($(activator).css("margin-left"));

	//show the menu directly over the placeholder
	this.frame = $("<div/>").css({
		position : "absolute",
		top : (pos.top + height + 1) + "px",
		left : (pos.left + 13 + leftMargin) + "px",
		width : width,
		"border": "1px solid #999",
		"background-color" : "white"
	}).appendTo(frame).hide();
	
	function clickFunc() {
		if(! thisObj.frame.is(":hover")) {
			thisObj.destroy();
		}		
	};
	
	$(document).bind("click",clickFunc);
	
	this.destroy = function () {
		thisObj.frame.hide(200,function() {
			thisObj.frame.remove();
		});
		 $(document).unbind("click",clickFunc);
		 delete thisObj;
	};
	
	this.frame.show(200);
	
	return this;
};