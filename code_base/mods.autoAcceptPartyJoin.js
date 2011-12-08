mods.states.add("autoAcceptPartyJoin");

mods.autoAcceptPartyJoin = {
	apply: function() {
		if (mods.states.get("autoAcceptPartyJoin") == "not ready") {
			Push.unbind("NotificationEventGroupInvite", notificationevent.handleGroupInvite);
		
			mods.modifyFunction("notificationevent.handleGroupInvite", notificationevent.handleGroupInvite, [{
				type: "addAfter",
				modify: ['popup.render("groupjoininvite",gameInvite);', 'popup.render("groupjoininvite", gameInvite);'],
				code: function() {
					if (mods.settings.autoAcceptPartyJoin) { $(".popup-groupjoininvite-accepted-button").click(); }
				}
			}]);
			
			Push.bind("NotificationEventGroupInvite", notificationevent.handleGroupInvite);
			
			mods.states.ready("autoAcceptPartyJoin");
		}
	}
}