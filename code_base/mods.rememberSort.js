mods.rememberSort = {
	dontSet: false,

	apply: function() {
		$(".serverguide-sorter").live("click", function() {
			if (!mods.settings.saveSort || mods.rememberSort.dontSet == true) { return; }
			var rememberSort = {};
			
			rememberSort.selector = "." + $(this).attr("class").replace(/ /gi, ".").replace(".serverguide-sort-down","").replace(".serverguide-sort-up","");
			
			if ($(this).hasClass("serverguide-sort-up")) { rememberSort.type="up"; }
			if ($(this).hasClass("serverguide-sort-down")) { rememberSort.type="down"; }
			
			mods.setSetting("rememberSort", rememberSort);
		});
	
		mods.modifyFunction("serverguide.onPageShow", serverguide.onPageShow, [{
			type: "addBefore",
			modify: '})();}',
			code: function() {
				if (mods.settings.saveSort && mods.settings.rememberSort) {
					setTimeout(function() { 
						mods.rememberSort.dontSet = true;
						$(mods.settings.rememberSort.selector).click();
						
						if (mods.settings.rememberSort.type == "up" && !$(mods.settings.rememberSort.selector).hasClass("serverguide-sort-up")) {
							$(mods.settings.rememberSort.selector).click();
						} 
						if (mods.settings.rememberSort.type == "down" && !$(mods.settings.rememberSort.selector).hasClass("serverguide-sort-down")) {
							$(mods.settings.rememberSort.selector).click();
						}
						mods.rememberSort.dontSet = false;
					}, 800);
				}
			}
		}]);
		
		mods.debug("rememberSort applied");
	}
}