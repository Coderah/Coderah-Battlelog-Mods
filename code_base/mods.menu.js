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
	for (var i in mods.settings) {
		if (mods.settings[i] && $('.mod-ticbox-holder[data=' + i + ']')[0]) {
			$('.mod-ticbox-holder[data=' + i + ']').addClass("checked");
		}
	}
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
    if ((l_realm.section == Surface.globalContext.staticContext.games.BFBC2)) {
        c.push(' <ul class="base-section-menu" id="base-section-nav-bfbc2">\n');
        o.s = {"_section": "bfbc2"};
        c.push('\n <li><a href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/", Surface.urlContext, o.s)));
        c.push('" class="base-header-logo base-header-logo-bfbc2"></a></li>\n <li ');
        if ((l_activeMenu == "home")) {
            c.push('class="active"');
        }
        c.push('>\n <a data="home" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("Home"));
        c.push("</a>\n </li>\n <li ");
        if ((l_activeMenu == "serverguide")) {
            c.push('class="active"');
        }
        c.push('>\n <a data="serverguide" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/servers/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("Server Browser"));
        c.push("</a>\n </li>\n <li ");
        if ((l_activeMenu == "leaderboard")) {
            c.push('class="active"');
        }
        c.push('>\n <a data="leaderboard" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/leaderboard/{username}/{group}/{category}/{platform}/{friends}/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("Leaderboard"));
        c.push('</a>\n </li>\n <li class="');
        if ((l_activeMenu == "devblog")) {
            c.push("active");
        } else {
            if (((typeof (Surface) != "undefined" && Surface !== null && typeof (Surface.globalContext) != "undefined" && Surface.globalContext !== null && typeof (Surface.globalContext.showNewsUnread) != "undefined" && Surface.globalContext.showNewsUnread !== null) ? Surface.globalContext.showNewsUnread : false)) {
                c.push("news-unread");
            }
        }
        c.push('">\n <a data="devblog" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/news/{offset}/", Surface.urlContext, o.s)));
        c.push('" >');
        c.push(Surface.valOut("News"));
        c.push("</a>\n </li>\n <li ");
        if ((l_activeMenu == "forum")) {
            c.push('class="active"');
        }
        c.push('>\n <a data="forum" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/forum/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("Forums"));
        c.push("</a>\n </li>\n");
        if ((((typeof (l_session) != "undefined" && l_session !== null && typeof (l_session.isLoggedIn) != "undefined" && l_session.isLoggedIn !== null) ? l_session.isLoggedIn : false) && false)) {
            c.push(" <li ");
            if ((l_activeMenu == "admin")) {
                c.push('class="active"');
            }
            c.push('>\n <a class="wfont" href="');
            c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/admin/", Surface.urlContext)));
            c.push('">');
            c.push(Surface.valOut("Admin"));
            c.push("</a>\n </li>\n");
        }
        c.push(" </ul>\n ");
    }
    c.push("\n");
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
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/servers/", Surface.urlContext)));
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
            c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/coop/{personaId}/{personaName}/", Surface.urlContext)));
            c.push('">');
            c.push(Surface.valOut("CO-OP"));
            c.push('</a>\n </div><div class="base-dropdown-right"></div>\n <div class="base-dropdown-spacer"></div>\n ');
            c.push(Surface.importTemplate(("base" + ("." + "menudropdown")), {"type": "coop"}, null, kwargs));
            c.push('\n </li>\n <li class="base-section-menu-before-dropdown-link');
            if ((l_activeMenu == "campaign")) {
                c.push(" active");
            }
            c.push('">\n <a class="wfont" data="campaign" href="');
            c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/campaign/", Surface.urlContext)));
            c.push('">');
            c.push(Surface.valOut("Campaign"));
            c.push("</a>\n </li>\n");
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
            c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/leaderboard/{username}/platoons/", Surface.urlContext)));
            c.push('">');
            c.push(Surface.valOut("Platoons"));
            c.push("</a>\n");
        }
        c.push(' </div><div class="base-dropdown-right"></div>\n <div class="base-dropdown-spacer"></div>\n ');
        c.push(Surface.importTemplate(("base" + ("." + "menudropdown")), {"type": "platoon","platoons": ((typeof (Surface) != "undefined" && Surface !== null && typeof (Surface.globalContext) != "undefined" && Surface.globalContext !== null && typeof (Surface.globalContext.userContext) != "undefined" && Surface.globalContext.userContext !== null && typeof (Surface.globalContext.userContext.platoons) != "undefined" && Surface.globalContext.userContext.platoons !== null) ? Surface.globalContext.userContext.platoons : []),"invitedPlatoons": ((typeof (Surface) != "undefined" && Surface !== null && typeof (Surface.globalContext) != "undefined" && Surface.globalContext !== null && typeof (Surface.globalContext.userContext) != "undefined" && Surface.globalContext.userContext !== null && typeof (Surface.globalContext.userContext.invitedPlatoons) != "undefined" && Surface.globalContext.userContext.invitedPlatoons !== null) ? Surface.globalContext.userContext.invitedPlatoons : [])}, null, kwargs));
        c.push('\n </li>\n <li class="');
        if ((l_activeMenu == "devblog")) {
            c.push("active");
        }
        c.push('">\n <a data="devblog" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/news/{offset}/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("News"));
        c.push("\n");
        if (((l_activeMenu != "devblog") && ((typeof (Surface) != "undefined" && Surface !== null && typeof (Surface.globalContext) != "undefined" && Surface.globalContext !== null && typeof (Surface.globalContext.showNewsUnread) != "undefined" && Surface.globalContext.showNewsUnread !== null) ? Surface.globalContext.showNewsUnread : false))) {
            c.push(' <div class="base-menu-news-unread"></div>\n');
        }
        c.push(" </a>\n </li>\n <li ");
        if ((l_activeMenu == "forum")) {
            c.push('class="active"');
        }
        c.push('>\n <a data="forum" href="');
        c.push(Surface.valOut(S.Modifier.urlformat("/{_section}/{_language}/forum/", Surface.urlContext, o.s)));
        c.push('">');
        c.push(Surface.valOut("Forums"));
        c.push("</a>\n </li>\n");
		
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
