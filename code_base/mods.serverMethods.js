mods.selectedServer = {
	getInfo: function() {
		selectedIDx = serverguide.serverHighlightIndex;//$(".serverguide-bodycells.active").attr("idx");
		return $S("serverguide-server-" + selectedIDx).getState().server;
	},
	
	getUrls: function() {
		retObject = {};
	
		retObject.joinUrl = $("#serverguide-show-joinserver-form").attr("action");
		retObject.playerCountUrl = $("#serverguide-numplayers-url").val().replace("%GUID%", $("#serverguide-show-joinserver-form").attr("guid"));
		
		return retObject;
	}
};

mods.serverInfo = {
	getStatus: function(url, callback) { //requires playerCountUrl
		$.get(url, callback);
	} // callback gets object (first parameter) EX: {"mapMode":64,"players":47,"queued":0,"map":"MP_013"}
};