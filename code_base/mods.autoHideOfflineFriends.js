mods.autoHideOfflineFriends = {
	apply:function() {
		if (mods.settings.autoHideOfflineFriends) {
			$("#comcenter-offline-separator .dropdownicon").click(); //hide offline friends
			
			mods.debug("hid offline friends based on setting");
		}
	}
}