mods.autoJoin = {
	modState: "not ready",
	state: 0,
	server: null,
	joinTimeout: null,
	
	errorMessagesForRetry: ["Could not join server since it's full", "Can't join, this server is changing map, please try again soon.", "Could not join server since it couldn't be found."],
	
	join: function() {
		if (mods.autoJoin.state == 1) {
			mods.autoJoin.setStatus("trying...");
			joinflow.joinServerByUrl(mods.autoJoin.server, null, function(serverFound) {
				if (serverFound) {
					mods.debug("server found by url");
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
		clearTimeout(this.joinTimeout);
		mods.autoJoin.hideStatusBox();
	},
	
	apply: function() {
		if (this.modState == "not ready") {
			serverguide.serverinfo.surface_29_26.render = function (o, b, kwargs) {
				var c = [];
				b = b || block_serverguide_serverinfo;
				kwargs = kwargs || {};
				Surface.Renderer.addUsedComponent("serverguide");
				Surface.Renderer.addUsedTemplate("serverguide.serverinfo");
				c.push('<surf:container id="');
				c.push("serverguide-join-button");
				c.push('">');
				if ((((typeof (Surface) != "undefined" && Surface !== null && typeof (Surface.globalContext) != "undefined" && Surface.globalContext !== null && typeof (Surface.globalContext.userContext) != "undefined" && Surface.globalContext.userContext !== null && typeof (Surface.globalContext.userContext.isInParty) != "undefined" && Surface.globalContext.userContext.isInParty !== null) ? Surface.globalContext.userContext.isInParty : 0) > 0)) {
					c.push(' <input type="button" class="base-button-arrow-almost-gigantic-dropdown base-button-general-dropdown" name="submit" value="');
					c.push(Surface.valOut("Join server"));
					c.push('" />\n <div class="base-button-dropdown base-general-dropdown-area">\n <div class="base-button-dropdown-inner">\n <ul>\n');
					if (((typeof (o) != "undefined" && o !== null && typeof (o.session) != "undefined" && o.session !== null && typeof (o.session.isLoggedIn) != "undefined" && o.session.isLoggedIn !== null) ? o.session.isLoggedIn : false)) {
						c.push(' <li>\n <a class="base-no-ajax join-server-submit-link">\n <span class="join-alone"></span>');
						c.push(Surface.valOut("Join alone"));
						c.push('\n </a>\n </li>\n <li>\n <a href="');
						c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/gamemanager/createGroupJoinToServer/{guid}/", Surface.urlContext, {
							"guid": o.serverinfo.guid
						})));
						c.push('" class="base-no-ajax base-button-dropdown-joingroup"><span class="join-party"></span>');
						c.push(Surface.valOut("Join with Party"));
						c.push("</a>\n </li>\n");
					}
					c.push(' </ul>\n </div>\n <div class="base-button-dropdown-shadow"></div>\n </div>\n');
				} else {
					c.push(' <input type="submit" class="base-button-arrow-almost-gigantic" name="submit" value="');
					c.push(Surface.valOut("Join server"));
					c.push('" />\n');
				}
				
				//mod
				c.push('<center>\n');
				c.push('<button class="base-button-arrow-almost-gigantic" id="mod-auto-join-button">AUTO JOIN SERVER</button>\n');
				c.push('</center>\n');
				//endMod
				
				c.push("</surf:container>");
				Surface.Renderer.addSurfaceState("serverguide.serverinfo", "surface_29_26", "serverguide-join-button", o, b);
				return c.join("");
			};
		
			mods.eventHandler.addCallback("launch_state", function(eventType, eventObject) {
				//mods.debug("launch_state event = "+JSON.stringify(eventObject.launcherState));
				if (mods.autoJoin.state == 1) {
					if (eventObject.launcherState.name == "launch_error" && mods.autoJoin.errorMessagesForRetry.indexOf(eventObject.launcherState.errorMessage) > -1) {
						clearTimeout(mods.autoJoin.joinTimeout);
						mods.autoJoin.joinTimeout = setTimeout(mods.autoJoin.join, 1500);
						mods.debug("autojoin attempting connection again: reason{object}", eventObject.launcherState);
						mods.autoJoin.setStatus("waiting...");
					}
					if ((eventObject.launcherState.gameState && eventObject.launcherState.gameState == "State_ConnectToGameId") || (eventObject.launcherState.name == "launch_cancelling")) {
						mods.autoJoin.cancel();
						mods.debug("autojoin finished");
					}
				}
			});
			
			$("#mod-auto-join-button").live("click", function() {
				mods.autoJoin.server = $("#serverguide-show-joinserver-form").attr("action");
				if (typeof mods.autoJoin.server != "undefined") {
					mods.autoJoin.showStatusBox();
					mods.autoJoin.state = 1;
					mods.debug("attempting to autojoin (" + mods.autoJoin.server + ")");
					mods.autoJoin.join();
				}
			});
			
			$("#mod-auto-join-cancel").live("click", function() {
				mods.autoJoin.cancel();
				gamemanager.clearLaunchState();
				gamemanager.hide();
			});
			
			//$(".serverguide-bodycells.active:visible div:first").click();
			$("#serverguide-join-button").append($('<center><button class="base-button-arrow-almost-gigantic" id="mod-auto-join-button">AUTO JOIN SERVER</button></center>'));
			
			this.modState = "ready";
			this.setMenuState();
			this.hideStatusBox();
			$("#mod-menu-autojoin").show();
			base.showReceipt("Battlelog Mods - Auto Join ready.", receiptTypes.OK, 5000);
			mods.debug("autoJoin applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-autojoin").html(this.modState);
	}
}