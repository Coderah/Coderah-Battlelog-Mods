function getExtensionVersion() {
	return <?version?>;
}

$("#mod-menu .version").html(getExtensionVersion());

function createUpdateNotification(newVersion) {
	var updateReceipt = $('<div class="common-receipt type-checkbox" style="cursor: pointer;">' +
		'<div class="common-receipt-message">' +
		'Battlelog Mods -  update available, click here to update.' +
		'</div>' +
		'<div class="base-clear"></div>' +
		'</div>');
		
	updateReceipt.click(function() {
		base.showReceipt("Battlelog Mods - refresh to finalize update.", receiptTypes.OK, 5000);
		$("body").append('<iframe src="http://coderah.com/bf3/<?updateFile?>?' + newVersion + '"></iframe>');
		$(this).remove();
	});
	$("#base-receipts").append(updateReceipt);
}

$.get("http://coderah.com/bf3/battlelog_mods_version.php", function(data) { 
	if (data.version > getExtensionVersion()) {
		createUpdateNotification(data.version);
	}
});