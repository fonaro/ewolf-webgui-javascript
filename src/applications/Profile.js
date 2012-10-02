var Profile = function (id,applicationFrame,userID,userName) {
	var self = this;
	
	var profileRequestName = id + "__ProfileRequest__",
			wolfpacksRequestName = id + "__WolfpakcsRequest__";
	
	Application.call(this, id, applicationFrame, "Searching profile...");
	
	var waitingForName = [];
	
	var handleProfileResonse = new ResponseHandler("profile",
			["id","name"],handleProfileData);
	
	var handleWolfpacksResponse = new ResponseHandler("wolfpacks",
			["wolfpacksList"],handleWolfpacksData);
	
	if(userID) {
		handleProfileResonse.error(onProfileNotFound)
												.badResponseHandler(onProfileNotFound);
		
		eWolf.serverRequest.registerRequest(profileRequestName,getProfileData);
		eWolf.serverRequest.registerRequest(wolfpacksRequestName,geWolfpacksData);
	} else {
		profileRequestName = eWolf.PROFILE_REQUEST_NAME;
		wolfpacksRequestName = eWolf.WOLFPACKS_REQUEST_NAME;
	}
	
	eWolf.serverRequest.registerHandler(profileRequestName,handleProfileResonse.getHandler());
	eWolf.serverRequest.registerHandler(wolfpacksRequestName,handleWolfpacksResponse.getHandler());
	
	eWolf.serverRequest.bindRequest(profileRequestName,id);
	eWolf.serverRequest.bindRequest(wolfpacksRequestName,id);
	
	var wolfpacksContainer = new CommaSeperatedList("Wolfpakcs");
	this.title.appendAtBottomPart(wolfpacksContainer.getList());	
	
	if(userID) {
		this.title.addFunction("Send message...", function (event) {
			new NewMessage(id,applicationFrame,userID).select();
		}, true);
		
		this.title.addFunction("Add to wolfpack...", function () {
			new AddToWolfpack(id, userID,self.frame, this, wolfpacksContainer.getItemNames());
			return false;
		}, true);
	} else {
		this.title.addFunction("Post", function() {
			new NewPost(id,applicationFrame).select();
		}, true);
	}
	
	var newsFeed = null;
	
	function onProfileFound() {		
		self.title.setTitle(CreateUserBox(userID,userName,true));
		eWolf.members.addKnownUsers(userID,userName);
		
		self.title.showAll();
		
		if(newsFeed == null) {			
			newsFeed = new ProfileNewsFeedList(id,userID)
				.appendTo(self.frame);
		} 	
		
		while(waitingForName.length > 0) {
			waitingForName.pop()(userName);
		}
	}
	
	function onProfileNotFound() {
		self.title.setTitle("Profile not found");
		
		self.title.hideAll();
		
		if(newsFeed != null) {			
			newsFeed.destroy();
			newsFeed = null;
		} 
	}
	
	function handleProfileData(data, textStatus, postData) {
		userID = data.id;
		userName = data.name;
		onProfileFound();
	}
	
	function handleWolfpacksData(data, textStatus, postData) {		
		wolfpacksContainer.removeAll();		 

		 $.each(data.wolfpacksList,function(i,pack) {
			 wolfpacksContainer.addItem(CreateWolfpackBox(pack),pack);
		 });
	  }
	
	function getProfileData() {		
		return {	profile: { userID: userID	} };
	}
	
	function geWolfpacksData() {
		return { wolfpacks: {	userID: userID } };
	}
	
	this.onReceiveName = function(nameHandler) {
		if(userName != null) {
			nameHandler(userName);
		} else {
			waitingForName.push(nameHandler);
		}
		
		return self;
	};
	
	this.getID = function() {
		return userID;
	};
	
	this.getName = function() {
		return userName;
	};
	
	return this;
};
