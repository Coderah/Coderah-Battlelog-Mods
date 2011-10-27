// ==UserScript==
// @name            Coderah Battlelog Mods
// @author          Alex Howard
// @namespace       http://www.coderah.com/?page_id=389
// @description     Multiple modifications for Battlelog (bf3 beta)
// @version	        1.9
// @include         http://battlelog.battlefield.com/*
// ==/UserScript==

function coderah_battlelog_mods_main () {
	 var verboseDebug = false;

var mods = {changelogLoaded: false};

if ($("body").is("#base-bf3-body")) {
	
	var styleInject = document.createElement("style");
	styleInject.innerHTML = '#mod-menu { position:absolute; left:0px; top:0px; z-index:9999999; background: #DFDFDF; width: 270px; height: auto; border-top: 4px solid #F1F1F1; -webkit-box-shadow: 0px 5px 11px rgba(0,0,0,0.4); -moz-box-shadow: 0px 5px 11px rgba(0,0,0,0.4); box-shadow: 0px 5px 11px rgba(0,0,0,0.4);}#mod-menu-item { left: -10px;}#mod-menu .content-wrapper { padding-bottom:40px;}#mod-menu .content { padding:5px; font-family: Arial,sans-serif; color:#121212; font-size:14px;}#mod-menu .version { font-family: BebasNeueRegular,Arial,sans-serif; color: #343434; padding: 3px; margin-top: 5px; float: right;}#mod-menu .changelog-link { margin-top: 10px; float: right; color: #308DBF; cursor: pointer; font-size: 11px; font-wieght: normal; text-decoration: none; font-family: Arial,sans-serif;}#mod-menu .changelog-link:hover { text-decoration:underline;}.mod-status { color: #3A3A3A; display:inline;}#mod-auto-join-button { font-family: "BebasNeueRegular",sans-serif !important; font-weight: normal; font-size:26px !important;}#mod-menu .comcenter-settings { position:absolute; bottom:0px; width:100%; background: none repeat scroll 0 0 #F3F3F3;}#mod-menu-autojoin-status-box { position: fixed; left: 293px; bottom: 1px; z-index: 99999; width: 350px; background: #DFDFDF; border-bottom: #FFC600 solid 3px; padding: 2px;}.mod-ticbox-holder {}.mod-ticbox-label { color: #353535; text-shadow: none; font-weight: normal; font-size: 12px; font-family: Arial,sans-serif; cursor:pointer;}.mod-ticbox-holder:hover .mod-ticbox-label { font-weight: bold;}.mod-ticbox-holder.checked .mod-ticbox-label { font-weight:bold; color: #000;}.mod-ticbox { width: 10px; height: 10px; background: url(http://battlelog-cdn.battlefield.com/public/serverguide/icon_checkbox.png?v=209) no-repeat; background-position: 0 -20px; display:inline-block; cursor:pointer;}.mod-ticbox-holder:hover .mod-ticbox { background-position: 0 -30px;}.mod-ticbox-holder.checked .mod-ticbox { background-position: 0 0;}.mod-ticbox-holder.checked:hover .mod-ticbox { background-position: 0 -10px;}#mod-menu-autojoin-status-box .text { font-family: BebasNeueRegular,Arial,sans-serif !important; font-weight: normal; text-decoration: none; font-size:16px;}#mod-menu-autojoin-status-box .mod-status { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; font-size:16px;}#mod-menu h1, #mod-menu h2, #mod-menu h3, #mod-menu h4 { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; color: #DBDBDB; display: block; text-align:center; background:rgba(0, 142, 163, 0.7); padding: 3px; /*padding-left:3px; color: #8A8A8A; height: 17px; line-height: 16px; background: #F4F4F4; border-top: 1px solid #F0F0F0; border-bottom: 1px solid #F0F0F0; font-size: 11px; font-weight: bold; text-transform: uppercase;*/}#mod-menu-update-changelog { max-height: 400px; background: rgba(0,0,0,0.8); position: fixed; left: -416px; top:140px; -webkit-box-shadow: 0px 0px 13px rgba(0,0,0,0.8); -moz-box-shadow: 0px 0px 13px rgba(0,0,0,0.8); box-shadow: 0px 0px 13px rgba(0,0,0,0.8); z-index: 99999999;}#mod-menu-update-changelog h2 { font-family: BebasNeueRegular,Arial,sans-serif; font-weight: normal; text-decoration: none; color: #DBDBDB;}#mod-menu-update-changelog .closeButton { background: url(http://battlelog-cdn.battlefield.com/public/base/shared/row_icon_chat.png?v=185); background-position: 0 -26px; padding-right: 13px; position: absolute; top: 3px; right: 3px; background-color: #DBDBDB; padding-bottom: 13px; cursor:pointer;}#mod-menu-update-changelog .inner { overflow: auto; margin:7px; color: #DCDCDC; font-weight: normal; font-size: 13px; font-family: BebasNeueRegular,Arial,sans-serif; padding:5px; line-height:18px; max-height: 360px;}#mod-menu-update-changelog .inner p { color: #BCBCBC; line-height: 18px; margin-left: 15px;}.mod-base-section-dropdown { position: relative; height: 37px; top: 19px;}.mod-activedropdown .base-dropdown-left{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) 0 0 no-repeat;}.mod-activedropdown .base-dropdown-middle{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) 0 -36px repeat-x;}.mod-activedropdown .base-dropdown-right{  background:url(http://battlelog-cdn.battlefield.com/public/base/shared/menu-item-bg.png?v=180) -9px 0 no-repeat;}#base-sub-navbar li.mod-base-section-dropdown.mod-activedropdown .base-dropdown-middle a,#base-sub-navbar #base-section-nav-bf3 li.mod-base-section-dropdown.active.mod-activedropdown .base-dropdown-middle a{  color:#353535;  background:none;}.mod-update-receipt { position:fixed; left:10px; top:70px;}/* MODS */.serverguide-filter-gamemode { height: auto !important;}.mod-auto-hooah { position: absolute; right: 5px; top: -25px; color: #308DBF; cursor:pointer; font-size: 11px; font-wieght: normal; text-decoration:none; font-family: Arial,sans-serif;}.mod-auto-hooah:hover { text-decoration: underline;}';
	document.body.appendChild(styleInject);

	$("body").append($('<div id="mod-menu" style="display:none"> <div class="content-wrapper">  <!--<h3>SETTINGS</h3>  <div class="content">   <div class="mod-ticbox-holder" data="showGameOnLoad">    <div class="mod-ticbox"></div>    <span class="mod-ticbox-label">Show game window when map is loading</span>   </div>  </div>-->   <h3>STATUS</h3>  <div class="content">   AutoJoin Server: <div class="mod-status" id="mod-status-autojoin">not ready</div><br>   Auto Hooah: <div class="mod-status" id="mod-status-auto-hooah">not ready</div><br>  </div>    <div class="comcenter-settings">   <div class="base-left">      </div>   <div class="base-right">   <span class="version"></span>   <span class="changelog-link">changelog</span>   </div>   </div>  </div></div><div id="mod-menu-autojoin-status-box"> <span style="position:relative;top:7px;" class="text">AutoJoin State: <span class="mod-status"></span></span> <button class="base-button-arrow-small-grey" style="float:right;" id="mod-auto-join-cancel">Cancel</button> <br clear="all"></div><div id="mod-menu-update-changelog"> <h2>Battlelog Mods - Changelog</h2> <span class="closeButton"></span> <div class="inner">   </div></div>'));

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

$(".mod-ticbox-holder").click(function() {
	if ($(this).is(".checked")) {
		$(this).removeClass("checked");
		mods.setSetting($(this).attr("data"), false);
	} else {
		$(this).addClass("checked");
		mods.setSetting($(this).attr("data"), true);
	}
});

mods.updateUI = function() {
	if (mods.settings.showGameOnLoad) { $('.mod-ticbox-holder[data=showGameOnLoad]').addClass("checked"); }
}

//standard render mod
base.menu.surface_6_10.render = function(o, b, kwargs) {
    var c = [];
    b = b || block_base_menu;
    kwargs = kwargs || {};
    Surface.Renderer.addUsedComponent("base");
    Surface.Renderer.addUsedTemplate("base.menu");
    c.push('<surf:container id="');
    c.push("base-header-menu");
    c.push('">');
    var l_currentUrl;
    var l_urlParts;
    var l_partCount;
    var l_activeMenu;
    var l_session;
    var l_realm;
    var l_activeSubMenu;
    l_activeMenu = S.Modifier.get(Surface.globalContext, "activeMenu");
    l_currentUrl = S.Modifier.get(Surface.globalContext, "currentUrl");
    l_session = S.Modifier.get(Surface.globalContext, "session");
    l_realm = S.Modifier.get(Surface.globalContext, "realm");
    c.push("\n");
    l_urlParts = S.Modifier.explode(l_currentUrl, "|", true);
    l_partCount = S.Modifier.count(l_urlParts);
    if ((l_partCount > 2)) {
        l_activeSubMenu = S.Modifier.get(l_urlParts, 2);
    } else {
        l_activeSubMenu = false;
    }
    c.push('\n <div id="base-sub-navbar">\n');
    if ((l_realm.section == Surface.globalContext.staticContext.games.BF3)) {
        c.push(' <input id="url-getDropdownMenu" type="hidden" value="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/getDropdownMenu/{type}/", Surface.urlContext, {"type": "#TYPE#"})));
        c.push('"/>\n <ul class="base-section-menu" id="base-section-nav-bf3">\n');
        o.s = {"_section": "bf3"};
        c.push('\n <li><a href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/", Surface.urlContext, o.s)));
        c.push('" class="base-header-logo base-header-logo-bf3"></a></li>\n <li class="base-section-menu-before-dropdown-link');
        if ((l_activeMenu == "home")) {
            c.push(" active");
        }
        c.push('">\n <a data="home" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("Home"));
        c.push('</a>\n </li>\n <li rel="mp" class="base-section-dropdown ');
        if (((l_activeMenu == "serverguide") || ((l_activeMenu == "leaderboard") && !(l_activeSubMenu)))) {
            c.push("active");
        }
        c.push('">\n <div class="base-dropdown-left"></div><div class="base-dropdown-middle">\n <a class="wfont" data="serverguide" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/servers/{getrandom}/", Surface.urlContext)));
        c.push('">');
        c.push(Surface.valOut("Multiplayer"));
        c.push('</a>\n </div><div class="base-dropdown-right"></div>\n');
        if (Surface.globalContext.staticContext.isOpenBeta) {
            c.push(' <div class="base-dropdown-spacer"></div>\n');
        }
        c.push(" ");
        c.push(Surface.importTemplate(("base" + ("." + "menudropdown")), {"type": "mp"}, null, kwargs));
        c.push("\n </li>\n");
        if (Surface.globalContext.staticContext.isOpenBeta) {
            c.push(' <li rel="coop">\n <span class="inactive wfont">');
            c.push(Surface.valOut("CO-OP"));
            c.push('</span>\n </li>\n <li rel="campaign" class="base-section-menu-before-dropdown-link">\n <span class="inactive wfont">');
            c.push(Surface.valOut("Campaign"));
            c.push("</span>\n </li>\n");
        } else {
            c.push(' <li rel="coop" class="base-section-dropdown ');
            if (((l_activeMenu == "coop") || ((l_activeMenu == "leaderboard") && (l_activeSubMenu == "coop")))) {
                c.push("active");
            }
            c.push('">\n <div class="base-dropdown-left"></div><div class="base-dropdown-middle">\n <a class="wfont" data="coop" href="');
            c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/coop/{coopId}/", Surface.urlContext)));
            c.push('">');
            c.push(Surface.valOut("CO-OP"));
            c.push('</a>\n </div><div class="base-dropdown-right"></div>\n ');
            c.push(Surface.importTemplate(("base" + ("." + "menudropdown")), {"type": "coop"}, null, kwargs));
            c.push('\n </li>\n <li rel="campaign" class="base-section-dropdown ');
            if ((l_activeMenu == "campaign")) {
                c.push("active");
            }
            c.push('">\n <div class="base-dropdown-left"></div><div class="base-dropdown-middle">\n <a class="wfont" data="campaign" href="');
            c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/campaign/", Surface.urlContext)));
            c.push('">');
            c.push(Surface.valOut("Campaign"));
            c.push('</a>\n </div><div class="base-dropdown-right"></div>\n ');
            c.push(Surface.importTemplate(("base" + ("." + "menudropdown")), {"type": "campaign"}, null, kwargs));
            c.push("\n </li>\n");
        }
        c.push('\n <li rel="platoon" class="base-section-dropdown ');
        if ((l_activeMenu == "platoon")) {
            c.push("active");
        }
        c.push('">\n <div class="base-dropdown-left"></div><div class="base-dropdown-middle">\n');
        if (((typeof (l_session) != "undefined" && l_session !== null && typeof (l_session.isLoggedIn) != "undefined" && l_session.isLoggedIn !== null) ? l_session.isLoggedIn : false)) {
            c.push(' <a class="wfont" data="platoon" href="');
            c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/platoon/{id}/{menu}/{refresh}/", Surface.urlContext)));
            c.push('">');
            c.push(Surface.valOut("Platoons"));
            c.push("</a>\n");
        } else {
            c.push(' <a class="wfont" data="platoon" href="');
            c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/leaderboard/platoons/{platformString}/", Surface.urlContext)));
            c.push('">');
            c.push(Surface.valOut("Platoons"));
            c.push("</a>\n");
        }
        c.push(' </div><div class="base-dropdown-right"></div>\n <div class="base-dropdown-spacer"></div>\n ');
        c.push(Surface.importTemplate(("base" + ("." + "menudropdown")), {"type": "platoon","platoons": ((typeof (Surface) != "undefined" && Surface !== null && typeof (Surface.globalContext) != "undefined" && Surface.globalContext !== null && typeof (Surface.globalContext.userContext) != "undefined" && Surface.globalContext.userContext !== null && typeof (Surface.globalContext.userContext.platoons) != "undefined" && Surface.globalContext.userContext.platoons !== null) ? Surface.globalContext.userContext.platoons : []),"invitedPlatoons": ((typeof (Surface) != "undefined" && Surface !== null && typeof (Surface.globalContext) != "undefined" && Surface.globalContext !== null && typeof (Surface.globalContext.userContext) != "undefined" && Surface.globalContext.userContext !== null && typeof (Surface.globalContext.userContext.invitedPlatoons) != "undefined" && Surface.globalContext.userContext.invitedPlatoons !== null) ? Surface.globalContext.userContext.invitedPlatoons : [])}, null, kwargs));
        c.push("\n </li>\n <li ");
        if ((l_activeMenu == "devblog")) {
            c.push('class="active"');
        }
        c.push('>\n <a data="devblog" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/devblog/{offset}/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("News"));
        c.push("</a>\n </li>\n <li ");
        if ((l_activeMenu == "forum")) {
            c.push('class="active"');
        }
        c.push('>\n <a data="forum" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/forum/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("Forums"));
        c.push("</a>\n </li>\n ");
		
		//mod
		if ($("#mod-menu").is(":visible")) {
			c.push(mods.menuItem.replace('class="mod-base-section-dropdown"', 'class="mod-base-section-dropdown mod-activedropdown"'));
		} else {
			c.push(mods.menuItem);
		}
		//endMod
		
		c.push("</ul>\n ");
    }
    c.push('\n <div class="base-clear"></div>\n </div>\n ');
    c.push("</surf:container>");
    Surface.Renderer.addSurfaceState("base.menu", "surface_6_10", "base-header-menu", o, b);
    return c.join("");
};

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
		selectedIDx = $(".serverguide-bodycells.active").attr("idx");
		return $S("serverguide-server-" + selectedIDx).getState().server;
	},
	
	getUrls: function() {
		retObject = {};
	
		retObject.joinUrl = $("#serverguide-show-joinserver-form").attr("action");
		retObject.playerCountUrl = $("#serverguide-numplayers-url").val().replace("%GUID%", mods.selectedServer.getInfo().guid);
		
		return retObject;
	}
};

mods.serverInfo = {
	getStatus: function(url, callback) { //requires playerCountUrl
		$.get(url, callback);
	} // callback gets object (first parameter) EX: {"mapMode":64,"players":47,"queued":0,"map":"MP_013"}
};

	mods.autoJoin = {
	modState: "not ready",
	checkCount: 0,
	state: 0,
	server: {},
	checkTimeout: null,
	msWait: 2000,
	
	errorMessagesForRetry: ["Could not join server since it's full", "Can't join, this server is changing map, please try again soon.", "Could not join server since it couldn't be found."],
	
	join: function() {
		if (mods.autoJoin.state == 1) {
			mods.autoJoin.setStatus("connecting...");
			joinflow.joinServerByUrl(mods.autoJoin.server.joinUrl, null, function(serverFound) {});
		}
	},
	
	checkServer: function() {
		if (mods.autoJoin.state == 1) {
			mods.autoJoin.checkCount += 1;
			
			mods.serverInfo.getStatus(mods.autoJoin.server.playerCountUrl, function(response) {
				mods.autoJoin.setStatus("checking ( " + mods.autoJoin.checkCount + " ) (players: " + response.players + " )...");
				if (response.players < mods.autoJoin.server.maxPlayers) {
					mods.debug("attempting join based on playerCount (" + response.players  + " < "+ mods.autoJoin.maxPlayers + ")");
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
						clearTimeout(mods.autoJoin.checkTimeout);
						mods.autoJoin.checkTimeout = setTimeout(mods.autoJoin.checkServer, mods.autoJoin.msWait);
						mods.debug("autojoin attempting connection again: reason{object}", eventObject.launcherState);
						mods.autoJoin.setStatus("waiting...");
					}
					if ((eventObject.launcherState.gameState && eventObject.launcherState.gameState == "State_ConnectToGameId") || (eventObject.launcherState.name == "launch_cancelling")) {
						mods.autoJoin.cancel();
						mods.debug("autojoin finished");
					}
				}
			});
			
			$("#mod-auto-join-button").live("click", function(e) {
				mods.autoJoin.checkCount = 0;
				mods.autoJoin.server = mods.selectedServer.getUrls();
				mods.autoJoin.server.maxPlayers = mods.selectedServer.getInfo().maxPlayers;
				
				if (typeof mods.autoJoin.server.joinUrl != "undefined") {
					mods.autoJoin.showStatusBox();
					mods.autoJoin.state = 1;
					mods.debug("attempting to autojoin {object}");
					mods.debug(mods.autoJoin.server);
					mods.autoJoin.checkServer();
				}
				
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
	mods.autoHooah = {
	state: "not ready",

	apply: function() {
		if (this.state == "not ready") {
			feed.base.render = function(o, b, kwargs) {
				var c = [];
				b = b || block_feed_base;
				kwargs = kwargs || {};
				Surface.Renderer.addUsedComponent("feed");
				Surface.Renderer.addUsedTemplate("feed.base");
				var l_session;
				c.push("\n");
				l_session = S.Modifier.get(Surface.globalContext, "session");
				c.push("\n");
				o.feedContext = ((typeof (o) != "undefined" && o !== null && typeof (o.feedContext) != "undefined" && o.feedContext !== null) ? o.feedContext : "friend");
				o.showFeedItems = ((typeof (o) != "undefined" && o !== null && typeof (o.showFeedItems) != "undefined" && o.showFeedItems !== null) ? o.showFeedItems : 10);
				c.push('\n<div>\n <!-- events navigation -->\n <div id="feed-container">\n');
				
				//mod
				c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
				//endMod
				
				if (((typeof (o) != "undefined" && o !== null && typeof (o.feedDisabled) != "undefined" && o.feedDisabled !== null) && o.feedDisabled)) {
					c.push(' <p class="feed-unavailable">Sorry, Feeds are currently disabled</p>\n');
				} else {
					if ((typeof (o) != "undefined" && o !== null && typeof (o.feed) != "undefined" && o.feed !== null)) {
						c.push(" ");
						c.push(Surface.importTemplate(("feed" + ("." + "index")), {"feed": o.feed,"sessionUserId": S.Modifier.get(l_session, "userId", 0),"nowTimestamp": o.nowTimestamp,"feedContext": o.feedContext}, null, kwargs));
						c.push("\n");
					} else {
						c.push(' <p class="feed-unavailable">');
						c.push(Surface.valOut("Sorry, this Battle feed is not available right now. Please try again later."));
						c.push("</p>\n");
					}
				}
				c.push(" </div>\n</div>\n");
				c.push(b.get("feedMoreEvents")(o, b, kwargs));
				return c.join("");
			};
			
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
			base.showReceipt("Battlelog Mods - autoHooah ready.", receiptTypes.OK, 5000);
			mods.debug("autoHooah applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-auto-hooah").html(this.state);
	}
};

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
			mods.debug("saved " + modSetting + "=" + localStorageModSettings[modSetting]);
		}
		
		localStorage.modSettings = JSON.stringify(localStorageModSettings);
	}
}

	//apply mods
	$(document).ready(function() {
		mods.loadSettings();
		mods.updateUI();
		mods.autoJoin.apply();
		mods.autoHooah.apply();
	});

}

	mods.getExtensionVersion = function() {
	return 1.9;
}

$("#mod-menu .version").html(mods.getExtensionVersion());

mods.createUpdateNotification = function(info) {
	var newVersion = info.version;
	var updateReceipt = $('<div class="common-receipt type-checkbox mod-update-receipt" style="cursor: pointer;width:auto;">' +
		'<div class="common-receipt-checkbox"></div>' +
		'<div class="common-receipt-message" style="float:left;">' +
		'Battlelog Mods -  update available, click here to update. (' + newVersion + ')' +
		'</div>' +
		'<div class="base-clear"></div>' +
		'</div>');
		
	if (info.url) {
		mods.updateUrl = info.url;
	}
		
	mods.changelog.load(newVersion);
		
	updateReceipt.click(function() {
		base.showReceipt("Battlelog Mods - refresh to finalize update.", receiptTypes.OK, 5000);
		if (mods.updateUrl) {
			$("body").append('<iframe src="' + mods.updateUrl + '"></iframe>');
		} else {
			$("body").append('<iframe src="http://coderah.com/bf3/battlelog_mods.user.js"></iframe>');
		}
		$(this).remove();
		if (mods.changelogLoaded) {
			mods.changelog.show();
		}
	});
	$("#base-receipts").parent().prepend(updateReceipt);
}

mods.changelog = {
	show: function() {
		$("#mod-menu-update-changelog").animate({"left": "0px"});
	},
	
	hide: function() {
		$("#mod-menu-update-changelog").animate({"left": "-" + $("#mod-menu-update-changelog").outerWidth() + "px"});
	},
	
	load: function(version, showOnLoad) {
		if (typeof showOnLoad == "undefined") { showOnLoad = false; }
		$.get("http://coderah.com/bf3/battlelog_mods_changelog.php?version=" + version, function(data) { 
			$("#mod-menu-update-changelog .inner").html(data);
			mods.changelogLoaded = true;
			mods.debug("loaded changelog for " + version);
			$("#mod-menu-update-changelog").css({"left": "-" + $("#mod-menu-update-changelog").outerWidth() + "px"});
			if (showOnLoad) { mods.changelog.show(); }
		});
	}
}

$("#mod-menu-update-changelog .closeButton").click(function() {
	mods.changelog.hide();
});

$.get("http://coderah.com/bf3/battlelog_mods_version.php?type=greasemonkey", function(data) { 
	if (data.url) { mods.debug("update check returned url: " + data.url); }
	if (data.version > mods.getExtensionVersion()) {
		mods.createUpdateNotification(data);
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

