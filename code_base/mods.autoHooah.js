mods.autoHooah = {
	state: "not ready",

	apply: function() {
		if (this.state == "not ready") {
			feed.base.render = function(o, b, kwargs) {
				var c = [];
				b = b || block_feed_base;
				kwargs = kwargs || {};
				Surface.Renderer.addUsedComponent("feed");
				Surface.Renderer.addUsedTemplate("feed.base");
				var l_session;
				c.push("\n");
				l_session = S.Modifier.get(Surface.globalContext, "session");
				c.push("\n");
				o.feedContext = ((typeof (o) != "undefined" && o !== null && typeof (o.feedContext) != "undefined" && o.feedContext !== null) ? o.feedContext : "friend");
				o.showFeedItems = ((typeof (o) != "undefined" && o !== null && typeof (o.showFeedItems) != "undefined" && o.showFeedItems !== null) ? o.showFeedItems : 10);
				c.push('\n<div>\n <!-- events navigation -->\n <div id="feed-container">\n');
				
				//mod
				c.push('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>\n');
				//endMod
				
				if (((typeof (o) != "undefined" && o !== null && typeof (o.feedDisabled) != "undefined" && o.feedDisabled !== null) && o.feedDisabled)) {
					c.push(' <p class="feed-unavailable">Sorry, Feeds are currently disabled</p>\n');
				} else {
					if ((typeof (o) != "undefined" && o !== null && typeof (o.feed) != "undefined" && o.feed !== null)) {
						c.push(" ");
						c.push(Surface.importTemplate(("feed" + ("." + "index")), {"feed": o.feed,"sessionUserId": S.Modifier.get(l_session, "userId", 0),"nowTimestamp": o.nowTimestamp,"feedContext": o.feedContext}, null, kwargs));
						c.push("\n");
					} else {
						c.push(' <p class="feed-unavailable">');
						c.push(Surface.valOut("Sorry, this Battle feed is not available right now. Please try again later."));
						c.push("</p>\n");
					}
				}
				c.push(" </div>\n</div>\n");
				c.push(b.get("feedMoreEvents")(o, b, kwargs));
				return c.join("");
			};
			
			$("#feed-container:visible").prepend($('<span class="mod-auto-hooah">hooah all items</span><span class="mod-auto-hooah undo" style="display:none;">un-hooah all items</span>'));
			
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