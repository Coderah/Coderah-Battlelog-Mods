var verboseDebug = false;

var mods = {};

var styleInject = document.createElement("style");
styleInject.innerHTML = <?style.css?>;
document.body.appendChild(styleInject);

$("body").append($(<?mod-menu.html?>));

$("#mod-menu .content-wrapper, #mod-menu-autojoin").hide();
$("#mod-menu-header, #mod-menu .comcenter-settings").click(function() {
	$("#mod-menu .content-wrapper").toggle();
});

mods.eventHandler = {
	lastEvent: undefined,
	callbacks: {},
	
	/* ## Events ##
		launch_state - on launcher state change (error message usually in eventObject.launcherState.errorMessage)
	*/
	
	addCallback: function(eventType, callback) {
		
		if (typeof this.callbacks[eventType] == "array") {
			this.callbacks[eventType].push(callback);
			mods.debug("added callback for eventType(" + eventType + ")");
		} else {
			this.callbacks[eventType] = [callback];
			mods.debug("added callback for eventType(" + eventType + ")");
		}
	},
	
	runCallbacks: function(eventType, eventObject) {
		for (var i in this.callbacks[eventType]) {
			var callback = this.callbacks[eventType][i];
			
			callback(eventType, eventObject);
		}
	},
	
	eventTrigger: function(object) {
		this.lastEvent = object;
		
		if (object.launcherState) {
			this.runCallbacks("launch_state", object);
		}
	},
}

//password bypass
mods.passwordBypass = {
	state: "not ready",

	apply: function() {
		if (this.state == "not ready") {
			launcher.verifyPassword = function(game, gameServerGuid, plaintextPassword, callback) { mods.debug("password bypassed"); callback(true); }

			joinflow.showPasswordPromptPopup = function(server, callback)
			{
				var pass = "fakepassword";

				launcher.verifyPassword(server.game, server.guid, pass, function(passwordOk) {
					if( passwordOk )
					{
						S.globalContext["session"]["serverPassword"] = pass;
						callback();
					}
					else
					{
						base.showReceipt("Wrong password!", "skull");
					}
				} );
			}
			
			this.state = "ready";
			this.setMenuState();
			base.showReceipt("Battlelog Mods - Password bypass ready.", receiptTypes.OK, 5000);
			mods.debug("passwordBypass applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-password-bypass").html(this.state);
	}
};

//autojoin
mods.autoJoin = {
	modState: "not ready",
	state: 0,
	server: null,
	joinTimeout: null,
	
	errorMessagesForRetry: ["Could not join server since it's full", "Can't join, this server is changing map, please try again soon.", "Could not join server since it couldn't be found."],
	
	join: function() {
		mods.autoJoin.setStatus("trying...");
		joinflow.joinServerByUrl(mods.autoJoin.server, null, function(serverFound) {
			if (serverFound) {
				mods.debug("server found by url");
			}
		});
	},
	
	showStatusBox: function() {
		$("#mod-auto-join-button").hide();
		$("#mod-menu-autojoin-status-box").show();
		this.setStatus("waiting...");
	},
	
	hideStatusBox: function() {
		$("#mod-menu-autojoin-status-box").hide();
		$("#mod-auto-join-button").show();
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
			mods.eventHandler.addCallback("launch_state", function(eventType, eventObject) {
				//mods.debug("launch_state event = "+JSON.stringify(eventObject.launcherState));
				if (mods.autoJoin.state == 1) {
					if (eventObject.launcherState.name == "launch_error" && mods.autoJoin.errorMessagesForRetry.indexOf(eventObject.launcherState.errorMessage) > -1) {
						mods.autoJoin.joinTimeout = setTimeout(mods.autoJoin.join, 1500);
						mods.debug("autojoin attempting connection again (" + eventObject.launcherState.errorMessage + ")");
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
			
			this.modState = "ready";
			this.setMenuState();
			this.hideStatusBox();
			$("#mod-menu-autojoin").show();
			mods.debug("autoJoin applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-autojoin").html(this.modState);
	}
}


//debug functions
mods.debug = function(msg) {
	console.log("mods.debug() - " + msg);
}

S.debug = function(msg)
{
	if (typeof msg == "object") {
		mods.eventHandler.eventTrigger(msg);
		
		if (!(typeof JSON == "undefined")) {
			try {
				if (verboseDebug) { console.log("S.debug() object - " + JSON.stringify(msg)); }
			} catch (e) {
				if (verboseDebug) { console.log("S.debug() unserializable object - " + msg); }
			}
		} else {
			if (verboseDebug) { console.log("S.debug() - " + msg); }
		}
	} else {
		if (verboseDebug) { console.log("S.debug() - " + msg); }
	}
}



//apply mods
mods.passwordBypass.apply();
mods.autoJoin.apply();