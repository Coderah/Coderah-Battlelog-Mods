// ==UserScript==
// @name            Coderah Battlelog Mods
// @author          Alex Howard
// @namespace       http://www.coderah.com/?page_id=389
// @description     Multiple modifications for Battlelog (BF3)
// @version	        2.2
// @include         http://battlelog.battlefield.com/*
// ==/UserScript==

function coderah_battlelog_mods_main () {
	if (typeof(window.mods) == "undefined") { window.mods = {}; }

mods.updaterPresent = true;

if (typeof(mods.debug) == "undefined") {
	mods.debug = function(message) {
		console.log("mods.debug() - " + message);
	}
} //set temporary debug function

mods.getExtensionVersion = function() {
	return "2.2";
}

mods.createUpdateNotification = function(info) {
	var newVersion = info.version;
	var updateReceipt = $('<div class="common-receipt type-checkbox mod-update-receipt" style="cursor: pointer;width:auto;">' +
		'<div class="common-receipt-checkbox"></div>' +
		'<div class="common-receipt-message" style="float:left;">' +
		'Battlelog Mods Extension -  update available, click here to update. (' + newVersion + ')' +
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
			$("body").append('<iframe src="http://coderah.com/bf3/battlelog_mods.user.js"></iframe>');
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
		$.get("http://coderah.com/bf3/battlelog_mods_changelog.php?version=" + version + "&codeVersion=" + mods.codeVersion, function(data) { 
			$("#mod-menu-update-changelog .inner").html(data);
			mods.changelogLoaded = true;
			mods.debug("loaded changelog for " + version);
			$("#mod-menu-update-changelog").css({"left": "-" + $("#mod-menu-update-changelog").outerWidth() + "px"});
			if (showOnLoad) { mods.changelog.show(); }
		});
	}
}

$("#mod-menu-update-changelog .closeButton").live("click", function() {
	mods.changelog.hide();
});

$.get("http://coderah.com/bf3/battlelog_mods_version.php?type=greasemonkey", function(data) { 
	if (data.url) { mods.debug("update check returned url: " + data.url); }
	if (data.version > parseFloat(mods.getExtensionVersion())) {
		mods.createUpdateNotification(data);
	}
	
	if (data.codeUrl) {
		var body = document.body;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = data.codeUrl;
		body.appendChild(script);
		
		mods.debug("loading code (" + data.codeVersion + ")");
		mods.debug("code url: " + data.codeUrl);
	} else {
		mods.debug("unable to load code, url not provided.");
	}
});
}

function contentEval(source) {
  if ('function' == typeof source) {
    source = '(' + source + ')();'
  }

  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;
  document.body.appendChild(script);
}

contentEval(coderah_battlelog_mods_main);

