// ==UserScript==
// @name            Coderah Battlelog Mods
// @author          Alex Howard
// @namespace       http://www.coderah.com/?page_id=389
// @description     Multiple modifications for Battlelog (bf3 beta)
// @version	        1.7
// @include         http://battlelog.battlefield.com/*
// ==/UserScript==

function coderah_battlelog_mods_main () {
	var verboseDebug = false;

var mods = {};

var styleInject = document.createElement("style");
styleInject.innerHTML = '#mod-menu { position:fixed; left:0px; top:0px; z-index:9999999;  background: #DFDFDF; width: 270px; height: auto; border: 1px solid #AAA;}#mod-menu .content-wrapper { padding-bottom:40px;}#mod-menu .content { padding:5px; font-family: Arial,sans-serif; color:#121212; font-size:14px;}#mod-menu .version { font-family: BebasNeueRegular,Arial,sans-serif; color: #343434; padding:3px; position:relative; top:10px; right:5px;}.mod-status { color: #3A3A3A; display:inline;}#mod-auto-join-button { font-size:12px !important;}#mod-menu .comcenter-settings { position:absolute; bottom:0px; width:100%; background: none repeat scroll 0 0 #F3F3F3; cursor: pointer;}#mod-menu-autojoin-status-box .text { font-family: BebasNeueRegular,Arial,sans-serif !important; font-weight: normal; text-decoration: none; font-size:16px;}#mod-menu-autojoin-status-box .mod-status { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; font-size:16px;}#mod-menu h1, #mod-menu h2, #mod-menu h3, #mod-menu h4 { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; color: #DBDBDB; display: block; text-align:center; background:rgba(0, 142, 163, 0.7); padding: 3px; /*padding-left:3px; color: #8A8A8A; height: 17px; line-height: 16px; background: #F4F4F4; border-top: 1px solid #F0F0F0; border-bottom: 1px solid #F0F0F0; font-size: 11px; font-weight: bold; text-transform: uppercase;*/}/* MODS */.serverguide-filter-gamemode { height: auto !important;}';
document.body.appendChild(styleInject);

$("body").append($('<div id="mod-menu"> <div class="comcenter-notification-title" id="mod-menu-header">BATTLELOG MOD - MENU  <div class="comcenter-contract">&nbsp;</div> </div>  <div class="content-wrapper">  <h3>STATUS</h3>  <div class="content">   Password Bypass: <div class="mod-status" id="mod-status-password-bypass">not ready</div><br>   AutoJoin Server: <div class="mod-status" id="mod-status-autojoin">not ready</div><br>   GameMode Filters: <div class="mod-status" id="mod-status-gamemode-filters">not ready</div>  </div>    <span id="mod-menu-autojoin">  <h3>SERVER BROWSER</h3>  <div class="content">   <center>    <button class="base-button-arrow-large" id="mod-auto-join-button">AUTO JOIN SELECTED SERVER</button>   </center>   <div id="mod-menu-autojoin-status-box">    <span style="position:relative;top:7px;" class="text">State: <span class="mod-status"></span></span>    <button class="base-button-arrow-small-grey" style="float:right;" id="mod-auto-join-cancel">Cancel</button> <br clear="all">   </div>  </div>  </span>    <div class="comcenter-settings">   <div class="base-left">      </div>   <div class="base-right">   <span class="version"></span>   </div>   </div>  </div></div>'));

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
	}
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

//showAllGameModeFilters
mods.showAllGameModeFilters = {
	state: "not ready",
	newGameModes: [
		{
			icon: "/public/serverguide/bfbc2/conquest.png",
			key: "conquest",
			label: "Conquest Small"
		},
		{
			icon: "/public/serverguide/bfbc2/tdm.png",
			key: "teamdeathmatch",
			label: "Team DM"
		},
		{
			icon: "/public/serverguide/bfbc2/sqrush.png",
			key: "sqrush",
			label: "Squad Rush"
		},
		{
		icon: "/public/serverguide/bfbc2/sqdm.png",
			key: "sqdm",
			label: "Squad DM"
		}
	],

	apply: function() {
		if (this.state == "not ready") {
			serverguide.filtergamemode.render = function(o, b, kwargs) {
				
				//mod
				for (var nGameMode in mods.showAllGameModeFilters.newGameModes) {
					o.gamemodes.push(mods.showAllGameModeFilters.newGameModes[nGameMode]);
				}
				//endMod
				
				var c = [];
				b = b || block_serverguide_filtergamemode;
				kwargs = kwargs || {};
				Surface.Renderer.addUsedComponent('serverguide');
				Surface.Renderer.addUsedTemplate('serverguide.filtergamemode');
				var l_for_serverguide_filtergamemode_6_10_list;
				c.push("\n<div class=\"serverguide-filter serverguide-filter-gamemode\">\n <div class=\"serverguide-filter-name\"><h1>");
				c.push(Surface.valOut("Mode"));
				c.push("</h1></div>\n <div class=\"serverguide-filter-selectables\">\n");
				l_for_serverguide_filtergamemode_6_10_list = o.gamemodes;
				if ((S.Modifier.count(l_for_serverguide_filtergamemode_6_10_list) > 0)) {
					for (var l_for_serverguide_filtergamemode_6_10_key in l_for_serverguide_filtergamemode_6_10_list) {
						if (!Surface.isValidLoopItem(l_for_serverguide_filtergamemode_6_10_list[l_for_serverguide_filtergamemode_6_10_key])) {
							continue;
						}
						var l_modeinfo = l_for_serverguide_filtergamemode_6_10_list[l_for_serverguide_filtergamemode_6_10_key];
						c.push(" <div class=\"serverguide-selectable ");
						if (S.Modifier.contains(o.filter.gamemodes, l_modeinfo.key)) {
							c.push("serverguide-include");
						}
						else {
							c.push("serverguide-exclude");
						}
						c.push("\" filter=\"gamemodes\" value=\"");
						c.push(Surface.valOut(l_modeinfo.key));
						c.push("\" >\n <div class=\"ticbox\"></div>\n <span>");
						c.push(Surface.valOut(l_modeinfo.label));
						c.push("</span>\n </div>\n");
					}
				}
				c.push("\n </div>\n <input type=\"hidden\" name=\"gamemodes\" value=\"");
				c.push(Surface.valOut(S.Modifier.join(o.filter.gamemodes, "|")));
				c.push("\" />\n</div>");
				return c.join('');
			}
			
			$(".serverguide-apply-filter-button:visible").click(); //refresh so the new game modes show up right away
			
			this.state = "ready";
			this.setMenuState();
			mods.debug("showAllGameModeFilters applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-gamemode-filters").html(this.state);
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
mods.showAllGameModeFilters.apply();

	function getExtensionVersion() {
	return 1.7;
}

$("#mod-menu .version").html(getExtensionVersion());

function createUpdateNotification() {
	var updateReceipt = $('<div class="common-receipt type-checkbox" style="cursor: pointer;">' +
		'<div class="common-receipt-message">' +
		'Battlelog Mods -  update available, click here to update.' +
		'</div>' +
		'<div class="base-clear"></div>' +
		'</div>');
		
	updateReceipt.click(function() {
		base.showReceipt("Battlelog Mods - refresh to finalize update.", receiptTypes.OK, 5000);
		$("body").append('<iframe src="http://coderah.com/bf3/battlelog_mods.user.js"></iframe>');
		$(this).remove();
	});
	$("#base-receipts").append(updateReceipt);
}

$.get("http://coderah.com/bf3/battlelog_mods_version.php", function(data) { 
	if (data.version > getExtensionVersion()) {
		createUpdateNotification();
	}
});
}

function contentEval(source) {
  if ('function' == typeof source) {
    source = '(' + source + ')();'
  }

  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;
  document.body.appendChild(script);
}

contentEval(coderah_battlelog_mods_main);

