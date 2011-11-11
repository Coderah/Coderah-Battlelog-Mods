mods.autoAcceptPartyJoin = {
	apply: function() {
		Push.unbind("NotificationEventGroupInvite", notificationevent.handleGroupInvite);
	
		mods.modifyFunction("notificationevent.handleGroupInvite", notificationevent.handleGroupInvite, [{
			type: "addAfter",
			modify: ['popup.render("groupjoininvite",gameInvite);', 'popup.render("groupjoininvite", gameInvite);'],
			code: function() {
				if (mods.settings.autoAcceptPartyJoin) { $(".popup-groupjoininvite-accepted-button").click(); }
			}
		}]);
		
		Push.bind("NotificationEventGroupInvite", notificationevent.handleGroupInvite);
	}
}