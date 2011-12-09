window.verboseDebug = false;

if (typeof(window.mods) == "undefined") { window.mods = {}; }

mods.changelogLoaded = false;
mods.codeVersion = "2.7";

if ($("body").is("#base-bf3-body")) {
	
	var styleInject = document.createElement("style");
	styleInject.innerHTML = '#mod-menu { position:absolute; left:0px; top:0px; z-index:9999999; background: #DFDFDF; width: 270px; height: auto; border-top: 4px solid #F1F1F1; -webkit-box-shadow: 0px 5px 11px rgba(0,0,0,0.4); -moz-box-shadow: 0px 5px 11px rgba(0,0,0,0.4); box-shadow: 0px 5px 11px rgba(0,0,0,0.4);}#mod-menu-item { left: -10px;}#mod-menu .content-wrapper { padding-bottom:40px;}#mod-menu .content { padding:5px; font-family: Arial,sans-serif; color:#121212; font-size:14px;}#mod-menu .version { font-family: BebasNeueRegular,Arial,sans-serif; color: #343434; padding: 3px; margin-top: 5px; float: right;}#mod-menu .changelog-link { margin-top: 10px; float: right; color: #308DBF; cursor: pointer; font-size: 11px; font-wieght: normal; text-decoration: none; font-family: Arial,sans-serif;}#mod-menu .changelog-link:hover { text-decoration:underline;}.mod-status { color: #3A3A3A; display:inline;}#mod-auto-join-button { font-family: "BebasNeueRegular",sans-serif !important; font-weight: normal; font-size:26px !important;}#mod-auto-join-simple-button { float:left; margin-left: 5px;}#mod-menu .comcenter-settings { position:absolute; bottom:0px; width:100%; background: none repeat scroll 0 0 #F3F3F3;}#mod-menu-autojoin-status-box { position: fixed; left: 293px; bottom: 1px; z-index: 99999; width: 350px; background: #DFDFDF; border-bottom: #FFC600 solid 3px; padding: 2px; display: none;}.mod-ticbox-holder {}.mod-ticbox-label { color: #353535; text-shadow: none; font-weight: normal; font-size: 12px; font-family: Arial,sans-serif; cursor:pointer; margin-left: 5px;  position:relative; top:-1px;}.mod-ticbox-holder:hover .mod-ticbox-label { font-weight: bold;}.mod-ticbox-holder.checked .mod-ticbox-label { font-weight:bold; color: #000;}.mod-ticbox { width: 10px; height: 10px; background: url(http://battlelog-cdn.battlefield.com/public/serverguide/icon_checkbox.png?v=209) no-repeat; background-position: 0 -20px; display:inline-block; cursor:pointer;}.mod-ticbox-holder:hover .mod-ticbox { background-position: 0 -30px;}.mod-ticbox-holder.checked .mod-ticbox { background-position: 0 0;}.mod-ticbox-holder.checked:hover .mod-ticbox { background-position: 0 -10px;}#mod-menu-autojoin-status-box .text { font-family: BebasNeueRegular,Arial,sans-serif !important; font-weight: normal; text-decoration: none; font-size:16px;}#mod-menu-autojoin-status-box .mod-status { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; font-size:16px;}#mod-menu h1, #mod-menu h2, #mod-menu h3, #mod-menu h4 { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; color: #DBDBDB; display: block; text-align:center; background:rgba(0, 142, 163, 0.7); padding: 3px; /*padding-left:3px; color: #8A8A8A; height: 17px; line-height: 16px; background: #F4F4F4; border-top: 1px solid #F0F0F0; border-bottom: 1px solid #F0F0F0; font-size: 11px; font-weight: bold; text-transform: uppercase;*/}#mod-menu-update-changelog { max-height: 400px; background: rgba(0,0,0,0.8); position: fixed; left: -416px; top:140px; -webkit-box-shadow: 0px 0px 13px rgba(0,0,0,0.8); -moz-box-shadow: 0px 0px 13px rgba(0,0,0,0.8); box-shadow: 0px 0px 13px rgba(0,0,0,0.8); z-index: 99999999;}#mod-menu-update-changelog h2 { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; color: #DBDBDB;}#mod-menu-update-changelog .closeButton { background: url(http://battlelog-cdn.battlefield.com/public/base/shared/row_icon_chat.png?v=185); background-position: 0 -26px; padding-right: 13px; position: absolute; top: 3px; right: 3px; background-color: #DBDBDB; padding-bottom: 13px; cursor:pointer;}#mod-menu-update-changelog .inner { overflow: auto; margin:7px; color: #DCDCDC; font-weight: normal; font-size: 13px; font-family: BebasNeueRegular,Arial,sans-serif; padding:5px; line-height:18px; max-height: 360px;}#mod-menu-update-changelog .inner p { color: #BCBCBC; line-height: 18px; margin-left: 15px;}.mod-base-section-dropdown { position: relative; height: 37px; top: 19px;}.mod-activedropdown .base-dropdown-left{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) 0 0 no-repeat;}.mod-activedropdown .base-dropdown-middle{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) 0 -36px repeat-x;}.mod-activedropdown .base-dropdown-right{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) -9px 0 no-repeat;}#base-sub-navbar li.mod-base-section-dropdown.mod-activedropdown .base-dropdown-middle a,#base-sub-navbar #base-section-nav-bf3 li.mod-base-section-dropdown.active.mod-activedropdown .base-dropdown-middle a{  color:#353535;  background:none;}.mod-update-receipt { position:fixed; left:10px; top:70px;}/* MODS */.serverguide-filter-gamemode { height: auto !important;}.mod-auto-hooah { position: absolute; right: 5px; top: -25px; color: #308DBF; cursor:pointer; font-size: 11px; font-wieght: normal; text-decoration:none; font-family: Arial,sans-serif;}#profile-battlelog .common-box-inner .mod-auto-hooah { top: 12px; right: 20px;}.mod-auto-hooah:hover { text-decoration: underline;}/*.serverguide-filter-map { width: 240px !important; border-right: 1px solid #E1E1E1 !important;}*/.mod-serverguide-filter-mods { max-height:310px; min-height:310px; overflow-y:auto; width:155px !important;}.mod-serverguide-filter-mods .serverguide-filter-selectables { margin-left:16px;}';
	document.body.appendChild(styleInject);

	$("body").append($('<div id="mod-menu" style="display:none"> <div class="content-wrapper">  <h3>SETTINGS</h3>  <div class="content">   <div class="mod-ticbox-holder" data="autoHideOfflineFriends">    <div class="mod-ticbox"></div>    <span class="mod-ticbox-label">Hide offline friends list on page load</span>   </div>   <!--<div class="mod-ticbox-holder" data="autoAcceptPartyJoin">    <div class="mod-ticbox"></div>    <span class="mod-ticbox-label">Auto accept Party join to server requests</span>   </div>-->  </div>   <h3>STATUS</h3>  <div class="content" id="mods-status">  </div>    <div class="comcenter-settings">   <div class="base-left">      </div>   <div class="base-right">   <span class="version"></span>   <span class="changelog-link">changelog</span>   </div>   </div>  </div></div><div id="mod-menu-autojoin-status-box"> <span style="position:relative;top:7px;" class="text">AutoJoin State: <span class="mod-status"></span></span> <button class="base-button-arrow-small-grey" style="float:right;" id="mod-auto-join-cancel">Cancel</button> <br clear="all"></div><div id="mod-menu-update-changelog"> <h2>Battlelog Mods - Changelog</h2> <span class="closeButton"></span> <div class="inner">   </div></div>'));
	
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
		
		if (typeof console !== "undefined") { console.log(funcName + ": " + modifiedAt); }
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
mods.modifyFunction("base.menu.surface_8_10.render", base.menu.surface_8_10.render, [{
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
	mods.states = {
	mods: {},
	
	update: function(name) {
		$("#mod-status-" + name.replace(" ", "-")).html(this.mods[name]);
	},
	
	get: function(name) {
		return this.mods[name];
	},
	
	add: function(name) {
		this.mods[name] = "not ready";
		
		if (!$("#mod-status-" + name.replace(" ", "-"))[0]) {
			$("#mods-status").append(name + ': <div class="mod-status" id="mod-status-' + name.replace(" ", "-") + '"></div><br>');
		}
		
		this.update(name);
	},
	
	ready: function(name) {
		this.mods[name] = "ready";
		this.update(name);
	},
	
	error: function(name) {
		this.mods[name] = "error";
		this.update(name);
	}
}
	
	mods.states.add("autoHooah");

mods.autoHooah = {
	apply: function() {
		if (mods.states.get("autoHooah") == "not ready") {
			mods.modifyFunction("feed.base.render", feed.base.render, [{
				type: "addAfter",
				modify: ['<div id="feed-container">\\n\');', '<div id=\\"feed-container\\">\\n");'],
				code: function() {
					mods.debug(o);
					if (o.feedContext !== "platoon" && o.feedContext !== "profile") {
						c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
					}
				}
			}]);
			
			mods.modifyFunction("platoon.index._use_127_9_block_content.render", platoon.index._use_127_9_block_content.render, [{
				type: "addAfter",
				modify: ['c.push(\' <div id="platoon-feed">\\n\');', 'c.push(" <div id=\\"platoon-feed\\">\\n");'],
				code: function() {
					c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
				}
			}]);
			
			mods.modifyFunction("profile.overview._use_93_22_block_content.render", profile.overview._use_93_22_block_content.render, [{
				type: "addBefore",
				modify: ['c.push(\' <form method="POST" class="wallpost" action="\');', 'c.push(" <form method=\\"POST\\" class=\\"wallpost\\" action=\\"");'],
				code: function() {
					c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
				}
			}]);
			
			if ($("#platoon-feed, #profile-battlelog .common-box-inner")[0]) {
				$("#platoon-feed, #profile-battlelog .common-box-inner").prepend($('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>'));
			} else {
				$("#feed-container:visible").prepend($('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>'));
			}
			
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
			
			mods.states.ready("autoHooah");
			//base.showReceipt("Battlelog Mods - autoHooah ready.", receiptTypes.OK, 5000);
			mods.debug("autoHooah applied");
		}
	}
};
	mods.states.add("autoHideOfflineFriends");

mods.autoHideOfflineFriends = {
	shouldBeHidden: false,
	
	apply:function() {
		if (mods.states.get("autoHideOfflineFriends") == "not ready") {
			if (mods.settings.autoHideOfflineFriends) {
				$("#comcenter-offline-separator.showing-offline .dropdownicon").click(); //hide offline friends
				this.shouldBeHidden = true;
				
				mods.modifyFunction("comcenter.list.surface_34_22.render", comcenter.list.surface_34_22.render, [
				{
					type: "addBefore",
					modify: "var c",
					code: function() {
						setTimeout(function() {
							if (mods.autoHideOfflineFriends.shouldBeHidden) {
								$("#comcenter-offline-separator.showing-offline .dropdownicon").click();
								mods.autoHideOfflineFriends.shouldBeHidden = false;
							}
						}, 100);
					}
				}
				]);
				
				mods.debug("hid offline friends based on setting");
			}
			
			mods.states.ready("autoHideOfflineFriends");
		}
	}
}
	mods.states.add("customFilters")

mods.customFilters = {
	apply:function() {
		if (mods.states.get("customFilters") == "not ready") {
			mods.modifyFunction("serverguide.filterslots.render", serverguide.filterslots.render, [{
				type: "addAfter",
				modify: 'c.push(Surface.valOut("32"));',
				code: function() {
					c.push('</span>\n </div>\n <div class="serverguide-selectable ');
					if ((S.Modifier.contains(o.filter.gameSize, 48) > 0)) {
						c.push("serverguide-include");
					} else {
						c.push("serverguide-exclude");
					}
					c.push('" filter="gameSize" value="48" iteration="6">\n <div class="ticbox"></div>\n <span>');
					c.push(Surface.valOut("48"));
				}
			}]);
			
			setTimeout(function() { $(".serverguide-apply-filter-button").click() }, 500);
			
			mods.states.ready("customFilters");
			mods.debug("customFilters applied");
		}
	}
}
	mods.states.add("quickRefresh");

mods.quickRefresh = {
	html: '<div class="serverguide-header-refresh-button alternate history"><button id="mod-quick-refresh" class="common-button-medium-grey" style="position:relative;"><p>Quick Refresh</p></button></div>',

	apply: function() {
		if (mods.states.get("quickRefresh") == "not ready") {
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
			
			mods.states.ready("quickRefresh");
			mods.debug("quickRefresh applied");
		}
	}
}

	//debug functions
	mods.debug = function() {
		if (typeof console == "undefined") { return; }
		
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
			if (typeof console == "undefined") { return; }
			
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
			if (typeof console == "undefined") { return; }
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
	if (Surface.cookieGet("modSettings") !== "") {
		var localStorageModSettings = JSON.parse(Surface.cookieGet("modSettings"));
		for (var modSetting in localStorageModSettings) {
			mods.settings[modSetting] = localStorageModSettings[modSetting];
			mods.debug("loaded " + modSetting + "=" + mods.settings[modSetting]);
		}
	} else {
		mods.debug("unable to load settings; used defaults");
	}
}

mods.saveSettings = function() {
	if (Surface.cookieGet("modSettings") == "") {
		Surface.cookieSet("modSettings", JSON.stringify(mods.settings), 100);
		mods.debug("save settings object didn't exist created; saved settings");
	} else {
		var localStorageModSettings = JSON.parse(Surface.cookieGet("modSettings"));
		for (var modSetting in mods.settings) {
			localStorageModSettings[modSetting] = mods.settings[modSetting];
			//mods.debug("saved " + modSetting + "=" + localStorageModSettings[modSetting]);
		}
		
		Surface.cookieSet("modSettings", JSON.stringify(localStorageModSettings), 100);
	}
}

	//apply mods
	$(document).ready(function() {
		mods.loadSettings();
		try { mods.autoHooah.apply(); } catch (e) { mods.states.error("autoHooah"); }
		try { mods.autoHideOfflineFriends.apply(); } catch (e) { mods.states.error("autoHideOfflineFriends"); }
		try { mods.customFilters.apply(); } catch (e) { mods.states.error("customFilters"); }
		try { mods.quickRefresh.apply(); } catch (e) { mods.states.error("quickRefresh"); }
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