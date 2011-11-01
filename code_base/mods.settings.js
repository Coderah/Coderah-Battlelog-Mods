mods.settings = { //set defaults

}

mods.setSetting = function(setting, val, saveSettings) {
	if (typeof saveSettings == "undefined") { saveSettings = true; }

	mods.settings[setting] = val;
	if (saveSettings) { mods.saveSettings(); }
}

mods.loadSettings = function() {
	if (localStorage.modSettings) { globalStorage.modSettings = localStorage.modSettings; }
	if (globalStorage.modSettings) {
		var globalStorageModSettings = JSON.parse(globalStorage.modSettings);
		for (var modSetting in globalStorageModSettings) {
			mods.settings[modSetting] = globalStorageModSettings[modSetting];
			mods.debug("loaded " + modSetting + "=" + mods.settings[modSetting]);
		}
	} else {
		mods.debug("unable to load settings; used defaults");
	}
}

mods.saveSettings = function() {
	if (!globalStorage.modSettings) { 
		globalStorage.modSettings = JSON.stringify(mods.settings);
		mods.debug("save settings object didn't exist created; saved settings");
	} else {
		var globalStorageModSettings = JSON.parse(globalStorage.modSettings);
		for (var modSetting in mods.settings) {
			globalStorageModSettings[modSetting] = mods.settings[modSetting];
			//mods.debug("saved " + modSetting + "=" + globalStorageModSettings[modSetting]);
		}
		
		globalStorage.modSettings = JSON.stringify(globalStorageModSettings);
	}
}