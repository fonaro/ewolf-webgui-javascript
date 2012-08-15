var AddMembersToWolfpack = function(fatherID,wolfpack, existingMemebers,
		onFinish,request) {
	var thisObj = this;
	this.frame = $("<span/>");
	
	madeChanges = false;	

	addMembersQuery = new FriendsQueryTagList(400).appendTo(this.frame);
	
	$.each(existingMemebers, function(i, item) {
		addMembersQuery.addTagByQuery(item,false);
	});
	
	applyBtn = $("<input/>").attr({
		"type": "button",
		"value": "Apply"
	}).appendTo(this.frame);
	
	cancelBtn = $("<input/>").attr({
		"type": "button",
		"value": "Cancel"
	}).appendTo(this.frame);
	
	errorMessage = $("<div/>").addClass("errorArea").appendTo(this.frame);
	
	responseHandler = new ResponseHandler("addWolfpackMember",[],null);
	
	this.apply = function() {
		var itemsToAdd = addMembersQuery.tagList.match({removable:true});
		
		if(itemsToAdd.isEmpty()) {
			errorMessage.html("Please add new members...");
		} else {
			applyBtn.hide(200);
			cancelBtn.hide(200);
			
			errorMessage.html("");
			
			request.request({
				addWolfpackMember: {
					wolfpackNames: [wolfpack],
					userIDs: itemsToAdd.getData()
				}
			},responseHandler.getHandler());
		}		
		
		return thisObj;
	};
	
	this.cancel = function() {
		if(onFinish != null) {
			onFinish();
		}
		
		thisObj.frame.remove();
		
		if(madeChanges) {
			madeChanges = false;
			eWolf.trigger("needRefresh."+fatherID);
		}
		
		delete thisObj;
	};
	
	this.success = function(data, textStatus, postData) {
		madeChanges = true;
		this.cancel();
	};
	
	this.error = function(data, textStatus, postData) {
		var errorMsg = null;
		
		if(data.wolfpacksResult == null) {
			console.log("No wolfpacksResult in response");
		} else if(data.wolfpacksResult[0] != "success") {
			errorMsg = "Error: " + data.wolfpacksResult[0];
			errorMessage.append(errorMsg+"<br>");
		}
		
		if(data.usersResult == null) {
			console.log("No usersResult in response");
		} else {
			$.each(data.usersResult, function(i, result) {
				var itemID = postData.userID[i];
				var item = addMembersQuery.tagList.match({id:itemID});
				
				if(result == "success") {
					madeChanges = true;
					item.unremovable().markOK();
				} else {
					var errorMsg = "Failed to add: " + itemID +
							" with error: " + result;
					errorMessage.append(errorMsg+"<br>");
					
					item.markError(errorMsg);
				}					
			});
		}
		
		if(errorMsg == null) {
			errorMessage.append("Unknown error...<br>");
		}			
	};
	
	this.complete = function (textStatus, postData) {
		if(madeChanges) {
			madeChanges = false;
			eWolf.trigger("needRefresh."+fatherID);
		}
		
		applyBtn.show(200);
		cancelBtn.show(200);
	};
	
	applyBtn.click(this.apply);	
	cancelBtn.click(this.cancel);
	
	responseHandler.success(this.success)	
		.error(this.error)	
		.complete(this.complete);
	
	return this;
};