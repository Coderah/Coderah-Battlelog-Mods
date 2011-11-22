mods.autoHideOfflineFriends = {
	shouldBeHidden: false,
	
	apply:function() {
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
	}
}