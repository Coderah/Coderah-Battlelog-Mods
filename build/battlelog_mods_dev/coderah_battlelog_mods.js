window.verboseDebug = false;

if (typeof(window.mods) == "undefined") { window.mods = {}; }

mods.changelogLoaded = false;
mods.codeVersion = "2.4";

if ($("body").is("#base-bf3-body")) {
	
	var styleInject = document.createElement("style");
	styleInject.innerHTML = '#mod-menu { position:absolute; left:0px; top:0px; z-index:9999999; background: #DFDFDF; width: 270px; height: auto; border-top: 4px solid #F1F1F1; -webkit-box-shadow: 0px 5px 11px rgba(0,0,0,0.4); -moz-box-shadow: 0px 5px 11px rgba(0,0,0,0.4); box-shadow: 0px 5px 11px rgba(0,0,0,0.4);}#mod-menu-item { left: -10px;}#mod-menu .content-wrapper { padding-bottom:40px;}#mod-menu .content { padding:5px; font-family: Arial,sans-serif; color:#121212; font-size:14px;}#mod-menu .version { font-family: BebasNeueRegular,Arial,sans-serif; color: #343434; padding: 3px; margin-top: 5px; float: right;}#mod-menu .changelog-link { margin-top: 10px; float: right; color: #308DBF; cursor: pointer; font-size: 11px; font-wieght: normal; text-decoration: none; font-family: Arial,sans-serif;}#mod-menu .changelog-link:hover { text-decoration:underline;}.mod-status { color: #3A3A3A; display:inline;}#mod-auto-join-button { font-family: "BebasNeueRegular",sans-serif !important; font-weight: normal; font-size:26px !important;}#mod-auto-join-simple-button { float:left; margin-left: 5px;}#mod-menu .comcenter-settings { position:absolute; bottom:0px; width:100%; background: none repeat scroll 0 0 #F3F3F3;}#mod-menu-autojoin-status-box { position: fixed; left: 293px; bottom: 1px; z-index: 99999; width: 350px; background: #DFDFDF; border-bottom: #FFC600 solid 3px; padding: 2px;}.mod-ticbox-holder {}.mod-ticbox-label { color: #353535; text-shadow: none; font-weight: normal; font-size: 12px; font-family: Arial,sans-serif; cursor:pointer; margin-left: 5px;  position:relative; top:-1px;}.mod-ticbox-holder:hover .mod-ticbox-label { font-weight: bold;}.mod-ticbox-holder.checked .mod-ticbox-label { font-weight:bold; color: #000;}.mod-ticbox { width: 10px; height: 10px; background: url(http://battlelog-cdn.battlefield.com/public/serverguide/icon_checkbox.png?v=209) no-repeat; background-position: 0 -20px; display:inline-block; cursor:pointer;}.mod-ticbox-holder:hover .mod-ticbox { background-position: 0 -30px;}.mod-ticbox-holder.checked .mod-ticbox { background-position: 0 0;}.mod-ticbox-holder.checked:hover .mod-ticbox { background-position: 0 -10px;}#mod-menu-autojoin-status-box .text { font-family: BebasNeueRegular,Arial,sans-serif !important; font-weight: normal; text-decoration: none; font-size:16px;}#mod-menu-autojoin-status-box .mod-status { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; font-size:16px;}#mod-menu h1, #mod-menu h2, #mod-menu h3, #mod-menu h4 { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; color: #DBDBDB; display: block; text-align:center; background:rgba(0, 142, 163, 0.7); padding: 3px; /*padding-left:3px; color: #8A8A8A; height: 17px; line-height: 16px; background: #F4F4F4; border-top: 1px solid #F0F0F0; border-bottom: 1px solid #F0F0F0; font-size: 11px; font-weight: bold; text-transform: uppercase;*/}#mod-menu-update-changelog { max-height: 400px; background: rgba(0,0,0,0.8); position: fixed; left: -416px; top:140px; -webkit-box-shadow: 0px 0px 13px rgba(0,0,0,0.8); -moz-box-shadow: 0px 0px 13px rgba(0,0,0,0.8); box-shadow: 0px 0px 13px rgba(0,0,0,0.8); z-index: 99999999;}#mod-menu-update-changelog h2 { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; color: #DBDBDB;}#mod-menu-update-changelog .closeButton { background: url(http://battlelog-cdn.battlefield.com/public/base/shared/row_icon_chat.png?v=185); background-position: 0 -26px; padding-right: 13px; position: absolute; top: 3px; right: 3px; background-color: #DBDBDB; padding-bottom: 13px; cursor:pointer;}#mod-menu-update-changelog .inner { overflow: auto; margin:7px; color: #DCDCDC; font-weight: normal; font-size: 13px; font-family: BebasNeueRegular,Arial,sans-serif; padding:5px; line-height:18px; max-height: 360px;}#mod-menu-update-changelog .inner p { color: #BCBCBC; line-height: 18px; margin-left: 15px;}.mod-base-section-dropdown { position: relative; height: 37px; top: 19px;}.mod-activedropdown .base-dropdown-left{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) 0 0 no-repeat;}.mod-activedropdown .base-dropdown-middle{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) 0 -36px repeat-x;}.mod-activedropdown .base-dropdown-right{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) -9px 0 no-repeat;}#base-sub-navbar li.mod-base-section-dropdown.mod-activedropdown .base-dropdown-middle a,#base-sub-navbar #base-section-nav-bf3 li.mod-base-section-dropdown.active.mod-activedropdown .base-dropdown-middle a{  color:#353535;  background:none;}.mod-update-receipt { position:fixed; left:10px; top:70px;}/* MODS */.serverguide-filter-gamemode { height: auto !important;}.mod-auto-hooah { position: absolute; right: 5px; top: -25px; color: #308DBF; cursor:pointer; font-size: 11px; font-wieght: normal; text-decoration:none; font-family: Arial,sans-serif;}.mod-auto-hooah:hover { text-decoration: underline;}/*.serverguide-filter-map { width: 240px !important; border-right: 1px solid #E1E1E1 !important;}*/.mod-serverguide-filter-mods { max-height:310px; min-height:310px; overflow-y:auto; width:155px !important;}.mod-serverguide-filter-mods .serverguide-filter-selectables { margin-left:16px;}';
	document.body.appendChild(styleInject);

	$("body").append($('<div id="mod-menu" style="display:none"> <div class="content-wrapper">  <h3>SETTINGS</h3>  <div class="content">   <div class="mod-ticbox-holder" data="autoHideOfflineFriends">    <div class="mod-ticbox"></div>    <span class="mod-ticbox-label">Hide offline friends list on page load</span>   </div>  </div>   <h3>STATUS</h3>  <div class="content">   AutoJoin Server: <div class="mod-status" id="mod-status-autojoin">not ready</div><br>   Auto Hooah: <div class="mod-status" id="mod-status-auto-hooah">not ready</div><br>  </div>    <div class="comcenter-settings">   <div class="base-left">      </div>   <div class="base-right">   <span class="version"></span>   <span class="changelog-link">changelog</span>   </div>   </div>  </div></div><div id="mod-menu-autojoin-status-box"> <span style="position:relative;top:7px;" class="text">AutoJoin State: <span class="mod-status"></span></span> <button class="base-button-arrow-small-grey" style="float:right;" id="mod-auto-join-cancel">Cancel</button> <br clear="all"></div><div id="mod-menu-update-changelog"> <h2>Battlelog Mods - Changelog</h2> <span class="closeButton"></span> <div class="inner">   </div></div>'));
	
	if (mods.updaterPresent) {
		$("#mod-menu .version").html("extension: " + mods.getExtensionVersion() + " | code: " + mods.codeVersion);
	}
	
	if (typeof mods.func == "undefined") { mods.func = {}; }

mods.func.getCodePortionOfString = function(string) {
	return string.substring(string.indexOf('{')+1, string.lastIndexOf('}'));
}

mods.modifyFunction = function(funcName, func, changes) {
	if (typeof changes == "object") {
		var funcAsString = func.toString().replace(/\t/gi, "").replace(/\r/gi, "").replace(/\n/gi, "").replace(/    /gi, "");
		
		var modifiedAt = [];
		
		for (var i in changes) {
			var change = changes[i];
			
			if (typeof change.code == "function") { change.code = mods.func.getCodePortionOfString(change.code.toString()); } //get string from function
			
			if (typeof change.modify == "object") {
				for (var i in change.modify) {
					modifiedAt.push(funcAsString.indexOf(change.modify[i]));
					
					switch (change.type) {
						case "addAfter":
							funcAsString = funcAsString.replace(change.modify[i], change.modify[i] + change.code);
							break;
							
						case "addBefore":
							funcAsString = funcAsString.replace(change.modify[i], change.code + change.modify[i]);
							break;
							
						case "replace":
							funcAsString = funcAsString.replace(change.modify[i], change.code);
							break;
					}
				}
			} else {
				modifiedAt.push(funcAsString.indexOf(change.modify));
				switch (change.type) {
					case "addAfter":
						funcAsString = funcAsString.replace(change.modify, change.modify + change.code);
						break;
						
					case "addBefore":
						funcAsString = funcAsString.replace(change.modify, change.code + change.modify);
						break;
						
					case "replace":
						funcAsString = funcAsString.replace(change.modify, change.code);
						break;
				}
			}
		}
		
		eval(funcName + " = " + funcAsString);
		
		console.log(funcName + ": " + modifiedAt);
		return modifiedAt;
	}
}

	mods.menuItem = ['<li rel="mods" class="mod-base-section-dropdown" id="mod-menu-item">',
'<div class="base-dropdown-left"></div><div class="base-dropdown-middle">',
'<a class="wfont">Mods</a>',
'</div><div class="base-dropdown-right"></div>',
'<div class="base-dropdown-spacer"></div>',
'</li>'].join('');

$("ul#base-section-nav-bf3").append($(mods.menuItem));

$("#mod-menu-item").live("click", function() {
	var menuItemPosition = $(this).offset();
	
	if (!$(this).is(".mod-activedropdown")) {
		$(this).addClass("mod-activedropdown");
		$("#mod-menu").css({"left": menuItemPosition.left + "px", "top": (menuItemPosition.top + $(this).height() - 1) + "px"}).show();
	} else {
		$(this).removeClass("mod-activedropdown");
		$("#mod-menu").hide();
	}
});

$("#mod-menu .changelog-link").click(function() {
	if (mods.changelogLoaded) {
		mods.changelog.show();
	} else {
		mods.changelog.load(mods.getExtensionVersion(), true);
		
	}
});

$(".mod-ticbox-holder").live("click", function() {
	if ($(this).is(".checked")) {
		$(this).removeClass("checked");
		mods.setSetting($(this).attr("data"), false);
	} else {
		$(this).addClass("checked");
		mods.setSetting($(this).attr("data"), true);
	}
});

mods.updateUI = function() {
	for (var i in mods.settings) {
		if (mods.settings[i] && $('.mod-ticbox-holder[data=' + i + ']')[0]) {
			$('.mod-ticbox-holder[data=' + i + ']').addClass("checked");
		}
	}
}

//standard render mod
mods.modifyFunction("base.menu.surface_6_10.render", base.menu.surface_6_10.render, [{
	type: "addAfter",
	modify: '"));c.push("</a>\\n </li>\\n </ul>\\n ");',
	code: function() {
		if ($("#mod-menu").is(":visible")) {
			c.push(mods.menuItem.replace('class="mod-base-section-dropdown"', 'class="mod-base-section-dropdown mod-activedropdown"'));
		} else {
			c.push(mods.menuItem);
		}
	}
}]);

	mods.eventHandler = {
	lastEvent: undefined,
	callbacks: {},
	
	/* ## Events ##
		launch_state - on launcher state change (error message usually in eventObject.launcherState.errorMessage)
	*/
	
	addCallback: function(eventType, callback) {
		
		if (this.callbacks[eventType]) {
			this.callbacks[eventType].push(callback);
			mods.debug("added callback for eventType(" + eventType + ") (along-side)");
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
};
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

	mods.autoJoin = {
	modState: "not ready",
	checkCount: 0,
	state: 0,
	server: {},
	checkTimeout: null,
	msWait: 2000,
	
	errorMessagesForRetry: ["Could not join server since it's full", "Could not join server since it couldn't be found."],
	
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
	mods.autoHooah = {
	state: "not ready",

	apply: function() {
		if (this.state == "not ready") {
			mods.modifyFunction("feed.base.render", feed.base.render, [{
				type: "addAfter",
				modify: ['<div id="feed-container">\\n\');', '<div id=\\"feed-container\\">\\n");'],
				code: function() {
					c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
				}
			}]);
			
			$("#feed-container:visible").prepend($('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>'));
			
			$(".mod-auto-hooah:not(.undo)").live("click", function() {
				$("form.feed-like-item:visible a").click();
				$(this).hide();
				$(".mod-auto-hooah.undo").show();
			});
			
			$(".mod-auto-hooah.undo").live("click", function() {
				$("form.feed-unlike-item:visible a").click();
				$(this).hide();
				$(".mod-auto-hooah:not(.undo)").show();
			});
			
			this.state = "ready";
			this.setMenuState();
			//base.showReceipt("Battlelog Mods - autoHooah ready.", receiptTypes.OK, 5000);
			mods.debug("autoHooah applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-auto-hooah").html(this.state);
	}
};
	mods.autoHideOfflineFriends = {
	apply:function() {
		if (mods.settings.autoHideOfflineFriends) {
			$("#comcenter-offline-separator .dropdownicon").click(); //hide offline friends
			
			mods.debug("hid offline friends based on setting");
		}
	}
}

	//debug functions
	mods.debug = function() {
		for (var arg in arguments) {
			var argument = arguments[arg];
			if (typeof argument == "object") { 
				console.log(argument);
			} else {
				console.log("mods.debug() - " + argument);
			}
		}
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

	mods.settings = { //set defaults

}

mods.setSetting = function(setting, val, saveSettings) {
	if (typeof saveSettings == "undefined") { saveSettings = true; }

	mods.settings[setting] = val;
	if (saveSettings) { mods.saveSettings(); }
}

mods.loadSettings = function() {
	if (localStorage.modSettings) {
		var localStorageModSettings = JSON.parse(localStorage.modSettings);
		for (var modSetting in localStorageModSettings) {
			mods.settings[modSetting] = localStorageModSettings[modSetting];
			mods.debug("loaded " + modSetting + "=" + mods.settings[modSetting]);
		}
	} else {
		mods.debug("unable to load settings; used defaults");
	}
}

mods.saveSettings = function() {
	if (!localStorage.modSettings) { 
		localStorage.modSettings = JSON.stringify(mods.settings);
		mods.debug("save settings object didn't exist created; saved settings");
	} else {
		var localStorageModSettings = JSON.parse(localStorage.modSettings);
		for (var modSetting in mods.settings) {
			localStorageModSettings[modSetting] = mods.settings[modSetting];
			//mods.debug("saved " + modSetting + "=" + localStorageModSettings[modSetting]);
		}
		
		localStorage.modSettings = JSON.stringify(localStorageModSettings);
	}
}

	//apply mods
	$(document).ready(function() {
		mods.loadSettings();
		mods.autoJoin.apply();
		mods.autoHooah.apply();
		mods.autoHideOfflineFriends.apply();
		mods.updateUI();
		
		var userInPlatoon = false;
		if (S.globalContext.userContext.platoons && S.globalContext.userContext.platoons.length>0) { //check user platoon
			for (var i in S.globalContext.userContext.platoons) {
				if (S.globalContext.userContext.platoons[i].name == "Coderah Battlelog Mods") {
					mods.debug("user is in battlelog mods platoon");
					userInPlatoon = true;
				}
			}
		}
		
		if (!userInPlatoon) {
			$('<center><a href="http://battlelog.battlefield.com/bf3/platoon/2832655240999277587/"><button class="base-button-arrow-large" id="mod-platoon-button">Join our Platoon!</button></a></center>')
				.insertBefore("#mod-menu .comcenter-settings");
		}
		
		if (mods.settings.lastCodeVersion) { //if the code version loaded was different than last time display changelog
			if (mods.settings.lastCodeVersion !== mods.codeVersion) {
				mods.changelog.load(mods.getExtensionVersion(), true);
				mods.setSetting("lastCodeVersion", mods.codeVersion, true);
			}
		} else {
			mods.setSetting("lastCodeVersion", mods.codeVersion, true);
		}
	});

}