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
			
			setTimeout(function() { 
				$(".serverguide-apply-filter-button:visible").click(); 
				mods.showAllGameModeFilters.state = "ready";
				mods.showAllGameModeFilters.setMenuState();
				base.showReceipt("Battlelog Mods - GameMode Filters ready.", receiptTypes.OK, 5000);
				mods.debug("showAllGameModeFilters applied");
			}, 2000);
			
			/*if ($(".serverguide-filter-gamemode .serverguide-filter-selectables")) {
				var clickFunction = $(".serverguide-filter-gamemode .serverguide-filter-selectables div:first").data("events").mousedown[0].handler;
				var savedFilterGameModes = $.parseJSON($.jStorage.get("serverguide-filter-localstorage", null)).gamemodes;
				mods.debug(savedFilterGameModes);
				for (var nGameMode in this.newGameModes) {
					var newGameMode = this.newGameModes[nGameMode];
					
					var c = [];
					
					c.push('<div class="serverguide-selectable ');
					if (savedFilterGameModes.indexOf(newGameMode.key) > -1) {
						c.push('serverguide-include');
					} else {
						c.push('serverguide-exclude');
					}
					c.push('" filter="gamemodes" value="' + newGameMode.key + '">');
					c.push('<div class="ticbox"></div>');
					c.push('<span>' + newGameMode.label + '</span>');
					c.push('</div>');
					
					$(".serverguide-filter-gamemode .serverguide-filter-selectables").append($(c.join('')).click(clickFunction));
				}
				
				mods.showAllGameModeFilters.state = "ready";
				mods.showAllGameModeFilters.setMenuState();
				base.showReceipt("Battlelog Mods - GameMode Filters ready.", receiptTypes.OK, 5000);
				mods.debug("showAllGameModeFilters applied");
			}*/
		}
	},
	
	setMenuState: function() {
		$("#mod-status-gamemode-filters").html(this.state);
	}
};