mods.getExtensionVersion = function() {
	return <?version?>;
}

$("#mod-menu .version").html(mods.getExtensionVersion());

mods.createUpdateNotification = function(info) {
	var newVersion = info.version;
	var updateReceipt = $('<div class="common-receipt type-checkbox" style="cursor: pointer;">' +
		'<div class="common-receipt-message">' +
		'Battlelog Mods -  update available, click here to update. (' + newVersion + ')' +
		'</div>' +
		'<div class="base-clear"></div>' +
		'</div>');
		
	if (data.url) {
		mods.updateUrl = data.url;
	}
		
	$.get("http://coderah.com/bf3/battlelog_mods_changelog.php?version=" + newVersion, function(data) { 
		$("#mod-menu-update-changelog .inner").html(data);
		mods.changelogLoaded = true;
		mods.debug("loaded changelog for " + newVersion);
	});
		
	updateReceipt.click(function() {
		base.showReceipt("Battlelog Mods - refresh to finalize update.", receiptTypes.OK, 5000);
		if (mods.updateUrl) {
			$("body").append('<iframe src="' + mods.updateUrl + '"></iframe>');
		} else {
			$("body").append('<iframe src="http://coderah.com/bf3/<?updateFile?>"></iframe>');
		}
		$(this).remove();
		if (mods.changelogLoaded) {
			$("#mod-menu-update-changelog").animate({"left": "0px"});
		}
	});
	$("#base-receipts").append(updateReceipt);
}

$("#mod-menu-update-changelog .closeButton").click(function() {
	$("#mod-menu-update-changelog").animate({"left": "-416px"});
});

$.get("http://coderah.com/bf3/battlelog_mods_version.php?type=<?buildType?>", function(data) { 
	if (data.url) { mods.debug("update check returned url: " + data.url); }
	if (data.version > mods.getExtensionVersion()) {
		mods.createUpdateNotification(data);
	}
});