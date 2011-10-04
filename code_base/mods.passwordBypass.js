mods.passwordBypass = {
	state: "not ready",

	apply: function() {
		if (this.state == "not ready") {
			launcher.verifyPassword = function(game, gameServerGuid, plaintextPassword, callback) { mods.debug("password bypassed"); callback(true); }

			joinflow.showPasswordPromptPopup = function(server, callback) {
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
			
			this.state = "ready";
			this.setMenuState();
			base.showReceipt("Battlelog Mods - Password bypass ready.", receiptTypes.OK, 5000);
			mods.debug("passwordBypass applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-password-bypass").html(this.state);
	}
};