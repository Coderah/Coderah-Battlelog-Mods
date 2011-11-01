if (typeof mods.func == "undefined") { mods.func = {}; }

mods.func.getCodePortionOfString = function(string) {
	return string.substring(string.indexOf('{')+1, string.lastIndexOf('}'));
}

mods.modifyFunction = function(funcName, func, changes) {
	if (typeof changes == "object") {
		var funcAsString = func.toString();
		
		for (var i in changes) {
			var change = changes[i];
			
			if (typeof change.code == "function") { change.code = mods.func.getCodePortionOfString(change.code.toString()); } //get string from function
			
			switch (change.type) {
				case "addAfter":
					funcAsString = funcAsString.replace(change.modify, change.modify + change.code);
					break;
					
				case "addBefore":
					funcAsString = funcAsString.replace(change.modify, change.code + change.modify);
					break;
					
				case "replace":
					funcAsString = funcAsString.replace(change.modify, change.code);
					break;
			}
		}
		
		eval(funcName + " = " + funcAsString);
	}
}