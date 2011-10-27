 var verboseDebug = false;

var mods = {changelogLoaded: false};

if ($("body").is("#base-bf3-body")) {
	
	var styleInject = document.createElement("style");
	styleInject.innerHTML = <?style.css?>;
	document.body.appendChild(styleInject);

	$("body").append($(<?mod-menu.html?>));

	<?mods.menu.js?>

	<?mods.eventHandler.js?>
	<?mods.serverMethods.js?>

	<?mods.autoJoin.js?>
	<?mods.autoHooah.js?>

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
		mods.updateUI();
		mods.autoJoin.apply();
		mods.autoHooah.apply();
	});

}