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

//Extension auto update code
function getExtensionVersion() {
	return 1.3;
}

function createUpdateNotification() {
	var updateReceipt = $('<div class="common-receipt type-checkbox" style="cursor: pointer;">' +
		'<div class="common-receipt-message">' +
		'Battlelog Mods -  update available, click here to update.' +
		'</div>' +
		'<div class="base-clear"></div>' +
		'</div>');
		
	updateReceipt.click(function() {
		base.showReceipt("Battlelog Mods - refresh to finalize update.", receiptTypes.OK, 5000);
		$("body").append('<iframe src="http://coderah.com/bf3/battlelog_mods.crx"></iframe>');
		$(this).remove();
	});
	$("#base-receipts").append(updateReceipt);
}

$.get("http://coderah.com/bf3/battlelog_mods_version.php", function(data) { 
	if (data.version > getExtensionVersion()) {
		createUpdateNotification();
	}
});