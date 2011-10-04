mods.showGameOnLoad = {
	state: "not ready",
	alreadyHitLoadingMessage: false,

	apply: function() {
		if (this.state == "not ready") {
			mods.eventHandler.addCallback("launch_state", function(eventType, eventObject) {
				if (mods.settings.showGameOnLoad) {
					if (eventObject.launcherState.gameState == "State_GameLoading") {
						if (!mods.showGameOnLoad.alreadyHitLoadingMessage) {
							launcher.restoreWindow(games.BF3);
							mods.showGameOnLoad.alreadyHitLoadingMessage = true;
							mods.debug("loading map message found; restoring game window");
						}
					}
					if (eventObject.launcherState.name == "launch_ready") {
						if (mods.showGameOnLoad.alreadyHitLoadingMessage) { debug("game is loaded reset showGameOnLoad"); }
						mods.showGameOnLoad.alreadyHitLoadingMessage = false;
					}
				}
			});
			
			this.state = "ready";
			this.setMenuState();
			base.showReceipt("Battlelog Mods - Show Game on load ready.", receiptTypes.OK, 5000);
			mods.debug("showGameOnLoad applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-show-game-on-load").html(this.state);
	}
};