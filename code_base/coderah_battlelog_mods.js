window.verboseDebug = false;

if (typeof(window.mods) == "undefined") { window.mods = {}; }

mods.changelogLoaded = false;
mods.codeVersion = "<?codeVersion?>";

if ($("body").is("#base-bf3-body")) {
	
	var styleInject = document.createElement("style");
	styleInject.innerHTML = <?style.css?>;
	document.body.appendChild(styleInject);

	$("body").append($(<?mod-menu.html?>));
	
	if (mods.updaterPresent) {
		$("#mod-menu .version").html("extension: " + mods.getExtensionVersion() + " | code: " + mods.codeVersion);
	}
	
	<?mods.modifyFunction.js?>

	<?mods.menu.js?>

	<?mods.eventHandler.js?>
	<?mods.serverMethods.js?>

	<?mods.autoJoin.js?>
	<?mods.autoHooah.js?>
	<?mods.autoHideOfflineFriends.js?>
	<?mods.customFilters.js?>

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

	<?mods.settings.js?>

	//apply mods
	$(document).ready(function() {
		mods.loadSettings();
		mods.autoJoin.apply();
		mods.autoHooah.apply();
		mods.autoHideOfflineFriends.apply();
		mods.customFilters.apply();
		mods.updateUI();
		
		var userInPlatoon = false;
		if (S.globalContext.userContext.platoons && S.globalContext.userContext.platoons.length>0) { //check user platoon
			for (var i in S.globalContext.userContext.platoons) {
				if (S.globalContext.userContext.platoons[i].name == "Coderah Battlelog Mods") {
					mods.debug("user is in battlelog mods platoon");
					userInPlatoon = true;
				}
			}
		}
		
		if (!userInPlatoon) {
			$('<center><a href="http://battlelog.battlefield.com/bf3/platoon/2832655240999277587/"><button class="base-button-arrow-large" id="mod-platoon-button">Join our Platoon!</button></a></center>')
				.insertBefore("#mod-menu .comcenter-settings");
		}
		
		if (mods.settings.lastCodeVersion) { //if the code version loaded was different than last time display changelog
			if (mods.settings.lastCodeVersion !== mods.codeVersion) {
				mods.changelog.load(mods.getExtensionVersion(), true);
				mods.setSetting("lastCodeVersion", mods.codeVersion, true);
			}
		} else {
			mods.setSetting("lastCodeVersion", mods.codeVersion, true);
		}
	});

}