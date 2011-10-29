mods.selectedServer = {
	getInfo: function() {
		selectedIDx = serverguide.serverHighlightIndex;//$(".serverguide-bodycells.active").attr("idx");
		return $S("serverguide-server-" + selectedIDx).getState().server;
	},
	
	getUrls: function() {
		retObject = {};
	
		formObject = $("#serverguide-show-joinserver-form, .profile-view-status-joinbutton form.join-friend")
		
		if (formObject.find("input[name=guid]")[0]) {
			serverGUID = formObject.find("input[name=guid]").val();
		} else {
			serverGUID = formObject.attr("guid");
		}
	
		retObject.joinUrl = formObject.attr("action");
		retObject.playerCountUrl = "/bf3/servers/getNumPlayersOnServer/%GUID%/".replace("%GUID%", serverGUID);
		
		return retObject;
	}
};

mods.serverInfo = {
	getStatus: function(url, callback) { //requires playerCountUrl
		$.get(url, callback);
	}, // callback gets object (first parameter) EX: {"mapMode":64,"players":47,"queued":0,"map":"MP_013"}
	
	getDetailed: function(url, callback) {
		$.ajax({
		  url: url,
		  success: function(data) { callback(data.context.server); },
		  beforeSend: function(xhr) { xhr.setRequestHeader("X-AjaxNavigation", "1"); }
		});
	} //callback gets detailed server object, url is a valid "/bf3/servers/show/" link
};