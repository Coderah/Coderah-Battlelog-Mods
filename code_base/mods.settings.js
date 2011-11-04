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