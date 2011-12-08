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