mods.autoJoin = {
	modState: "not ready",
	checkCount: 0,
	state: 0,
	server: {},
	checkTimeout: null,
	msWait: 2000,
	
	errorMessagesForRetry: ["Could not join server since it's full", "Could not join this server: it's full."],
	
	join: function() {
		mods.autoJoin.setStatus("connecting...");
		joinflow.joinServerByUrl(mods.autoJoin.server.joinUrl, null, function(serverFound) {});
	},
	
	checkServer: function() {
		if (mods.autoJoin.state == 1) {
			mods.autoJoin.checkCount += 1;
			
			mods.serverInfo.getStatus(mods.autoJoin.server.playerCountUrl, function(response) {
				mods.autoJoin.setStatus("checking ( " + mods.autoJoin.checkCount + " ) (players: " + response.players + " )...");
				if (response.players < mods.autoJoin.server.maxPlayers) {
					mods.debug("attempting join based on playerCount (" + response.players  + " < "+ mods.autoJoin.server.maxPlayers + ")");
					mods.autoJoin.join();
				} else {
					clearTimeout(mods.autoJoin.checkTimeout);
					mods.autoJoin.checkTimeout = setTimeout(mods.autoJoin.checkServer, mods.autoJoin.msWait);
				}
			});
		}
	},
	
	showStatusBox: function() {
		//$("#mod-auto-join-button").hide();
		$("#mod-menu-autojoin-status-box").show();
		this.setStatus("waiting...");
	},
	
	hideStatusBox: function() {
		$("#mod-menu-autojoin-status-box").hide();
		//$("#mod-auto-join-button").show();
	},
	
	setStatus: function(text) {
		$("#mod-menu-autojoin-status-box .mod-status").html(text);
	},
	
	cancel: function() {
		this.state = 0;
		clearTimeout(this.checkTimeout);
		mods.autoJoin.hideStatusBox();
	},
	
	apply: function() {
		if (this.modState == "not ready") {
			mods.modifyFunction("serverguide.serverinfo.surface_29_26.render", serverguide.serverinfo.surface_29_26.render, [{
				type: "addBefore",
				modify: 'c.push("</surf:container>");',
				code: function() {
					c.push('<center>\n');
					c.push('<button class="base-button-arrow-almost-gigantic" id="mod-auto-join-button">AUTO JOIN SERVER</button>\n');
					c.push('</center>\n');
				}
			}]); //add autoJoin button in serverbrowser render
			
			mods.modifyFunction("serverguide.show.surface_44_21.render", serverguide.show.surface_44_21.render, [{
				type: "addAfter",
				modify: 'c.push("serverguide-show-serverjoin");',
				code: function() {
					c.push('" style="top:22px;');
				}
			},
			{ type: "replace", modify: 'base-button-dropdown ', code: '' },
			{ type: "replace", modify: 'almost-gigantic-dropdown', code: 'large-drop\\" style=\\"float:left;' },
			{ type: "replace", modify: 'almost-gigantic', code: 'large\\" style=\\"float:left;' },
			{
				type: "addAfter",
				modify: ['class="base-general-dropdown-area"', 'class=\\"base-general-dropdown-area\\"'],
				code: ' style=\\"top:29px;width:160px\\"'
			},
			{
				type: "addAfter",
				modify: ['"));c.push(\'" />\\n\');}', '"));c.push("\\" />\\n");}'],
				code: function() {
					c.push('<button class="base-button-arrow-large" id="mod-auto-join-simple-button">Auto Join Server</button>\n');
				}
			}
			]); //add autoJoin button to full server view render
			
			mods.modifyFunction("serverguide.joinfriendform.surface_41_13.render", serverguide.joinfriendform.surface_41_13.render, [{
				type: 'addAfter',
				modify: ['c.push("profile-joinbutton");c.push(\'">\');', 'c.push("profile-joinbutton");c.push("\\">\");'],
				code: function() {
					c.push('<button class="base-button-arrow-large" id="mod-auto-join-simple-button" style="float:right;">Auto Join Server</button>\n');
				}
			}]); //add autoJoin button to profile view render
		
			mods.eventHandler.addCallback("launch_state", function(eventType, eventObject) {
				//mods.debug("launch_state event = "+JSON.stringify(eventObject.launcherState));
				if (mods.autoJoin.state == 1) {
					if (eventObject.launcherState.name == "launch_error" && mods.autoJoin.errorMessagesForRetry.indexOf(eventObject.launcherState.errorMessage) > -1) {
						clearTimeout(mods.autoJoin.checkTimeout);
						mods.autoJoin.checkTimeout = setTimeout(mods.autoJoin.checkServer, mods.autoJoin.msWait);
						mods.debug("autojoin attempting connection again: reason{object}", eventObject.launcherState);
						mods.autoJoin.setStatus("waiting...");
					}
					
					if (eventObject.launcherState.name == "launch_error" && eventObject.launcherState.errorMessage == "Can't join, this server is changing map, please try again soon.") {
						clearTimeout(mods.autoJoin.checkTimeout);
						mods.autoJoin.checkTimeout = setTimeout(mods.autoJoin.checkServer, 30000);
						mods.debug("autojoin encountered server changing map message, waiting for 30 seconds before checking again");
					}
					
					if ((eventObject.launcherState.gameState && eventObject.launcherState.gameState == "State_ConnectToGameId") || (eventObject.launcherState.name == "launch_cancelling")) {
						mods.autoJoin.cancel();
						mods.debug("autojoin finished");
					}
				}
			});
			
			$("#mod-auto-join-button, #mod-auto-join-simple-button").live("click", function(e) {
				mods.autoJoin.checkCount = 0;
				mods.autoJoin.server = mods.selectedServer.getUrls();
				
				mods.serverInfo.getDetailed(mods.autoJoin.server.joinUrl, function(data) {
					mods.autoJoin.server.maxPlayers = data.maxPlayers;
				
					if (typeof mods.autoJoin.server.joinUrl != "undefined") {
						mods.autoJoin.showStatusBox();
						mods.autoJoin.state = 1;
						mods.debug("attempting to autojoin {object}");
						mods.debug(mods.autoJoin.server);
						mods.autoJoin.checkServer();
					}
				});
				
				e.preventDefault();
				return false;
			});
			
			$("#mod-auto-join-cancel").live("click", function() {
				mods.autoJoin.cancel();
				gamemanager.clearLaunchState();
				gamemanager.hide();
			});
			
			//$(".serverguide-bodycells.active:visible div:first").click();
			$("#serverguide-join-button").append($('<center><button class="base-button-arrow-almost-gigantic" id="mod-auto-join-button">AUTO JOIN SERVER</button></center>'));
			
			$("#profile-joinbutton").prepend('<button class="base-button-arrow-large" id="mod-auto-join-simple-button" style="float:right;">Auto Join Server</button>');
			
			if ($("#serverguide-show-serverjoin")[0] && $("#serverguide-show-serverjoin")[0].nodeName == "SURF:CONTAINER") { //add full view button if we loaded the page into one
				$("#serverguide-show-serverjoin")
					.css("top", "22px")
					.append('<button class="base-button-arrow-large" id="mod-auto-join-simple-button">Auto Join Server</button>');
				
				$("#serverguide-show-serverjoin input.base-button-arrow-almost-gigantic").removeClass("base-button-arrow-almost-gigantic")
					.addClass("base-button-arrow-large").css("float", "left");
				$("#serverguide-show-serverjoin input.base-button-arrow-almost-gigantic-dropdown").removeClass("base-button-arrow-almost-gigantic-dropdown")
					.addClass("base-button-arrow-large-drop").css("float", "left")
					.next().removeClass("base-button-dropdown").css({"top": "29px", "width": "160px"});
			}
			
			this.modState = "ready";
			this.setMenuState();
			this.hideStatusBox();
			$("#mod-menu-autojoin").show();
			//base.showReceipt("Battlelog Mods - Auto Join ready.", receiptTypes.OK, 5000);
			mods.debug("autoJoin applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-autojoin").html(this.modState);
	}
}