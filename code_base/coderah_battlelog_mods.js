launcher.verifyPassword = function(game, gameServerGuid, plaintextPassword, callback) { callback(true); }

joinflow.showPasswordPromptPopup = function(server, callback)
{
	var pass = "fakepassword";

	launcher.verifyPassword(server.game, server.guid, pass, function(passwordOk) {
		if( passwordOk )
		{
			S.globalContext["session"]["serverPassword"] = pass;
			callback();
		}
		else
		{
			base.showReceipt("Wrong password!", "skull");
		}
	} );
}

S.debug = function(msg)
{
	if (typeof msg == "object" && !(typeof JSON == "undefined")) {
		console.log("S.debug() object - " + JSON.stringify(msg));
	} else {
		console.log("S.debug() - " + msg);
	}
} 

base.showReceipt("Battlelog Mods - Password bypass ready.", receiptTypes.OK, 5000);