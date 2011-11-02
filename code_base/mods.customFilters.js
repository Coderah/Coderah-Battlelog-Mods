mods.customFilters = {
	ticHtml: ['<div class="serverguide-filter mod-serverguide-filter-mods">',
		'<div class="serverguide-filter-name"><h1>Mods - Max Players</h1></div>',
		'<div class="serverguide-filter-selectables">',
		'<div class="mod-ticbox-holder" data="customFiltersPlayers16"><div class="mod-ticbox"></div><span class="mod-ticbox-label">16</span></div>',
		'<div class="mod-ticbox-holder" data="customFiltersPlayers24"><div class="mod-ticbox"></div><span class="mod-ticbox-label">24</span></div>',
		'<div class="mod-ticbox-holder" data="customFiltersPlayers32"><div class="mod-ticbox"></div><span class="mod-ticbox-label">32</span></div>',
		'<div class="mod-ticbox-holder" data="customFiltersPlayers40"><div class="mod-ticbox"></div><span class="mod-ticbox-label">40</span></div>',
		'<div class="mod-ticbox-holder" data="customFiltersPlayers48"><div class="mod-ticbox"></div><span class="mod-ticbox-label">48</span></div>',
		'<div class="mod-ticbox-holder" data="customFiltersPlayers64"><div class="mod-ticbox"></div><span class="mod-ticbox-label">64</span></div>',
		'</div>',
		'<div class="serverguide-filter-name"><h1>Mods - Extra</h1></div>',
		'<div class="serverguide-filter-selectables">',
		'<div class="mod-ticbox-holder" data="customFiltersHideSecure"><div class="mod-ticbox"></div><span class="mod-ticbox-label">Hide secure servers</span></div>',
		'</div>',
		'</div>'],

	apply:function() {
		this.ticHtml = this.ticHtml.join('');
	
		mods.modifyFunction("serverguide.filtermaps.render", serverguide.filtermaps.render, [{
			type: "addBefore",
			modify: 'return c.join("");',
			code: function() {
				c.push(mods.customFilters.ticHtml);
				setTimeout(function() { 
					mods.updateUI();
					$(".serverguide-bodycells:first .serverguide-bodycell:first").click();
					serverguideList.setServerListAutoBrowse();
				}, 200);
			}
		}]);
		
		mods.modifyFunction("serverguide.serverrow.surface_3_2.render", serverguide.serverrow.surface_3_2.render, [{
			type: "addBefore",
			modify: "var c=[];",
			code: function() {
				if (mods.settings.customFiltersHideSecure) {
					if (o.server.hasPassword) { return ""; }
				}
				
				if (mods.settings.customFiltersPlayers16 || mods.settings.customFiltersPlayers24 ||
					mods.settings.customFiltersPlayers32 || mods.settings.customFiltersPlayers40 ||
					mods.settings.customFiltersPlayers48 || mods.settings.customFiltersPlayers64) 
				{
					var shouldKeepServer = false;
					
					if (mods.settings.customFiltersPlayers16 && o.server.maxPlayers == 16) { shouldKeepServer = true; }
					if (mods.settings.customFiltersPlayers24 && o.server.maxPlayers == 24) { shouldKeepServer = true; }
					if (mods.settings.customFiltersPlayers32 && o.server.maxPlayers == 32) { shouldKeepServer = true; }
					if (mods.settings.customFiltersPlayers40 && o.server.maxPlayers == 40) { shouldKeepServer = true; }
					if (mods.settings.customFiltersPlayers48 && o.server.maxPlayers == 48) { shouldKeepServer = true; }
					if (mods.settings.customFiltersPlayers64 && o.server.maxPlayers == 64) { shouldKeepServer = true; }
					
					if (!shouldKeepServer) { return ""; }
				}
			}
		}]);
		
		$("#serverguide-filters > div div:last").before(this.ticHtml);
		$(".serverguide-apply-filter-button").click();
		
		mods.debug("customFilters applied");
	}
}