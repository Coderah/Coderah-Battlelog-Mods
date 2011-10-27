mods.getExtensionVersion = function() {
	return "<?version?>";
}

$("#mod-menu .version").html(mods.getExtensionVersion());

mods.createUpdateNotification = function(info) {
	var newVersion = info.version;
	var updateReceipt = $('<div class="common-receipt type-checkbox mod-update-receipt" style="cursor: pointer;width:auto;">' +
		'<div class="common-receipt-checkbox"></div>' +
		'<div class="common-receipt-message" style="float:left;">' +
		'Battlelog Mods -  update available, click here to update. (' + newVersion + ')' +
		'</div>' +
		'<div class="base-clear"></div>' +
		'</div>');
		
	if (info.url) {
		mods.updateUrl = info.url;
	}
		
	mods.changelog.load(newVersion);
		
	updateReceipt.click(function() {
		base.showReceipt("Battlelog Mods - refresh to finalize update.", receiptTypes.OK, 5000);
		if (mods.updateUrl) {
			$("body").append('<iframe src="' + mods.updateUrl + '"></iframe>');
		} else {
			$("body").append('<iframe src="http://coderah.com/bf3/<?updateFile?>"></iframe>');
		}
		$(this).remove();
		if (mods.changelogLoaded) {
			mods.changelog.show();
		}
	});
	$("#base-receipts").parent().prepend(updateReceipt);
}

mods.changelog = {
	show: function() {
		$("#mod-menu-update-changelog").animate({"left": "0px"});
	},
	
	hide: function() {
		$("#mod-menu-update-changelog").animate({"left": "-" + $("#mod-menu-update-changelog").outerWidth() + "px"});
	},
	
	load: function(version, showOnLoad) {
		if (typeof showOnLoad == "undefined") { showOnLoad = false; }
		$.get("http://coderah.com/bf3/battlelog_mods_changelog.php?version=" + version, function(data) { 
			$("#mod-menu-update-changelog .inner").html(data);
			mods.changelogLoaded = true;
			mods.debug("loaded changelog for " + version);
			$("#mod-menu-update-changelog").css({"left": "-" + $("#mod-menu-update-changelog").outerWidth() + "px"});
			if (showOnLoad) { mods.changelog.show(); }
		});
	}
}

$("#mod-menu-update-changelog .closeButton").click(function() {
	mods.changelog.hide();
});

$.get("http://coderah.com/bf3/battlelog_mods_version.php?type=<?buildType?>", function(data) { 
	if (data.url) { mods.debug("update check returned url: " + data.url); }
	if (data.version > parseFloat(mods.getExtensionVersion())) {
		mods.createUpdateNotification(data);
	}
});