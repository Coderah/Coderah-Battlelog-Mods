launcher.verifyPassword = function(game, gameServerGuid, plaintextPassword, callback) { callback(true); }
S.debug = function(msg)
{
	if (typeof msg == "object" && !(typeof JSON == "undefined")) {
		console.log("S.debug() object - " + JSON.stringify(msg));
	} else {
		console.log("S.debug() - " + msg);
	}
} 