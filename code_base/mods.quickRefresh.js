mods.quickRefresh = {
	html: '<div class="serverguide-header-refresh-button alternate history"><button id="mod-quick-refresh" class="common-button-medium-grey" style="position:relative;"><p>Quick Refresh</p></button></div>',

	apply: function() {
		mods.modifyFunction("serverguide.base.block_mainContent.render", serverguide.base.block_mainContent.render, [
		{
			type: "addAfter",
			modify: ['c.push(Surface.importTemplate(("serverguide"+("."+"quickmatchbutton")),o,null,kwargs));c.push("\\n </div>\\n");', 
				'c.push(Surface.importTemplate("serverguide.quickmatchbutton", o, null, kwargs));c.push("\\n </div>\\n");'],
			code: function() {
				if (o.serverguideTab !== "history" && o.serverguideTab !== "favourites" && o.serverguideAction !== "serverguide-action-show") { c.push(mods.quickRefresh.html); }
			}
		}
		]);
	
		$(".serverguide-button-actions-wrapper")
		.live("click", function() {
			var lastIndex = $("#serverguide-listcontainer .serverguide-bodycells").length - 1;

			$("#serverguide-listcontainer .serverguide-bodycells").each(function(i) { 
				var $thisp = $(this).parent();
				mods.serverInfo.getStatus("/bf3/servers/getNumPlayersOnServer/%GUID%/".replace("%GUID%", $(this).attr("guid")), function(response) {
					var server = $S($thisp.attr("id")).getState().server;
					var updatedInfo = {numPlayers: response.players,numQueued: response.queued,map: response.map,mapMode: response.mapMode};
					var mapinfo = $S.callFunction("serverguide.mapinfo", server.game, response.map);
					
					$S($thisp.attr("id")).update({server: updatedInfo,mapinfo: mapinfo});
					
					if (i == lastIndex) {
						serverguideList.pingServerList();
						serverguide.refreshHighlight();
					}
				});
			});
		});
		
		if (!$(".serverguide-header-refresh-button:visible")[0]) {
			$(".serverguide-button-actions-wrapper").append(mods.quickRefresh.html);
		}
		
		mods.debug("quickRefresh applied");
	}
}