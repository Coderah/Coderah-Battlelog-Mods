mods.autoHooah = {
	state: "not ready",

	apply: function() {
		if (this.state == "not ready") {
			mods.modifyFunction("feed.base.render", feed.base.render, [{
				type: "addAfter",
				modify: ['<div id="feed-container">\\n\');', '<div id=\\"feed-container\\">\\n");'],
				code: function() {
					mods.debug(o);
					if (o.feedContext !== "platoon" && o.feedContext !== "profile") {
						c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
					}
				}
			}]);
			
			mods.modifyFunction("platoon.index._use_127_9_block_content.render", platoon.index._use_127_9_block_content.render, [{
				type: "addAfter",
				modify: ['c.push(\' <div id="platoon-feed">\\n\');', 'c.push(" <div id=\\"platoon-feed\\">\\n");'],
				code: function() {
					c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
				}
			}]);
			
			mods.modifyFunction("profile.overview._use_93_22_block_content.render", profile.overview._use_93_22_block_content.render, [{
				type: "addBefore",
				modify: ['c.push(\' <form method="POST" class="wallpost" action="\');', 'c.push(" <form method=\\"POST\\" class=\\"wallpost\\" action=\\"");'],
				code: function() {
					c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
				}
			}]);
			
			if ($("#platoon-feed, #profile-battlelog .common-box-inner")[0]) {
				$("#platoon-feed, #profile-battlelog .common-box-inner").prepend($('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>'));
			} else {
				$("#feed-container:visible").prepend($('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>'));
			}
			
			$(".mod-auto-hooah:not(.undo)").live("click", function() {
				$("form.feed-like-item:visible a").click();
				$(this).hide();
				$(".mod-auto-hooah.undo").show();
			});
			
			$(".mod-auto-hooah.undo").live("click", function() {
				$("form.feed-unlike-item:visible a").click();
				$(this).hide();
				$(".mod-auto-hooah:not(.undo)").show();
			});
			
			this.state = "ready";
			this.setMenuState();
			//base.showReceipt("Battlelog Mods - autoHooah ready.", receiptTypes.OK, 5000);
			mods.debug("autoHooah applied");
		}
	},
	
	setMenuState: function() {
		$("#mod-status-auto-hooah").html(this.state);
	}
};