var serverguide = {hasPluginAndGame: false,filterSearchTimeout: false,rowSelect: false,active_scoreboard: false,init: function() {
        var scrollTo = function(element) {
            $("html,body").animate({scrollTop: $(element).offset().top - 250}, {duration: "fast",easing: "swing"});
        };
        $(document).keypress(function(event) {
            if (Surface.globalContext.componentName != "serverguide" || /textarea|select/i.test(event.target.nodeName) || event.target.type === "text") {
                return;
            }
            var highlightClass = "active";
            var getHighlightClassIndex = function(elements) {
                var highlightIndex = -1;
                elements.each(function(i, element) {
                    if ($(element).parent().hasClass(highlightClass)) {
                        highlightIndex = i;
                        return false;
                    }
                });
                return highlightIndex;
            };
            var elements;
            var element;
            switch (event.which) {
                case 110:
                    elements = $(".serverguide-bodycell.serverguide-cell-expansion");
                    if (elements.length > 0) {
                        element = $(elements[getHighlightClassIndex(elements) + 1]);
                        if (element.length == 0) {
                            element = $(elements[0]);
                        }
                        element.click();
                        scrollTo(element);
                    }
                    break;
                case 112:
                    elements = $(".serverguide-bodycell.serverguide-cell-expansion");
                    if (elements.length > 0) {
                        var newIndex = getHighlightClassIndex(elements) - 1;
                        element = (newIndex < 0) ? $(elements[elements.length - 1]) : $(elements[newIndex]);
                        element.click();
                        scrollTo(element);
                    }
                    break;
                case 13:
                    $("#serverguide-show-joinserver-form").submit();
                    break;
            }
        });
        $("#selected-server-info table tr").last().html($(".serverguide-bodycells.active > .serverguide-cell-ping").text() + " ms ping").css({"font-weight": "bold"});
    },onPageShow: function() {
        serverguide.initSearchField();
        serverguide.disableNotOwnedExpansion();
        serverguide.greyOutGameSelectionMaps();
        serverguideList.setServerShowPosition();
        serverguideList.setServerShowHeight();
        $("#serverguide-show-column").railer($("#content"), $(".serverguide-list:first"));
        $(".serverguide-apply-filter-button").click(function() {
            $(".serverguide-list").hide();
            $("#serverguide-show-column").hide();
            $("#serverguide-loading-list-indicator").show();
            omniture_click("", "viewServers_click");
        });
        $(".show-all-scoreboard").live("click", function() {
            popup.render("serverplayers", {"scoreboard": {}});
            server_scoreboard();
        });
        $(".serverguide-add-favorite").pageLive("click", function() {
            $(".serverguide-add-favorite-toggle").hide();
            $(".serverguide-add-favorite-loading").show();
            var form = $(this).children("form");
            var url = form.attr("action");
            var guid = form.children("input").val();
            serverguide.addFavorite(url, guid);
        });
        $(".serverguide-server-link").pageLive("click", function(e) {
            e.preventDefault();
            popup.render("serverurl", $(this).attr("href"));
        });
        $(".serverguide-server-link-field").pageLive("click", function(e) {
            $(this).focus().select();
        });
        $("#serverguide-show-friends-with-server-toggle").pageLive("click", function() {
            $("#serverguide-show-friends-with-server").toggle();
        });
        $(".base-button-dropdown-joinnow").pageLive("click", function(e) {
            e.preventDefault();
            $("#serverguide-show-joinserver-form").submit();
        });
        $(".base-button-dropdown a").pageLive("click", function(e) {
            $(this).parents(".base-button-dropdown:first").hide();
            return false;
        });
        $("#serverguide-result .serverguide-bodycell, #serverguide-result .serverguide-cell-name a").pageLive("click", function(e) {
            if (e.target.tagName == "A") {
                e.preventDefault();
            }
            if (e.target.tagName == "INPUT") {
                return;
            }
            if (serverguide.rowSelect) {
                serverguide.rowSelect.abort();
            }
            var serverRow = $(e.target).parents(".serverguide-bodycells");
            $(".serverguide-bodycells").removeClass("active");
            serverRow.addClass("active");
            var idx = serverRow.attr("idx");
            var guid = serverRow.attr("guid");
            var url = $("#serverguide-show-url").val().replace("%GUID%", guid);
            var ping = serverRow.children(".serverguide-cell-ping").children("span").html();
            serverguide.rowSelect = base.ajaxGetJson(url, function(success, response) {
                if (success) {
                    S.debug("Got server info response...");
                    S.debug(response);
                    serverRow.siblings().removeClass("active");
                    var serverinfo = response["message"]["SERVER_INFO"];
                    var players = response["message"]["SERVER_PLAYERS"];
                    var friends = comcenter.getFriendsPlayingOnServer(serverinfo.guid);
                    var isFavorite = response["message"]["isFavorite"];
                    var friendsWithFavServer = response["message"]["friendsWithFavServer"];
                    serverinfo["ping"] = ping;
                    $S("serverguide-show").update({loading: false,players: players,friends: friends,serverinfo: serverinfo,isFavorite: isFavorite,friendsWithFavServer: friendsWithFavServer});
                    $S("serverguide-server-" + idx).update({server: serverinfo,friendsOnServer: friends,setActive: true});
                    var showserverinfo = $.jStorage.get("serverinfo-more-info-visible");
                    if (showserverinfo) {
                        $("#serverinfo-more-info-expanded").show();
                    }
                }
            });
            return false;
        });
        $(".serverguide-reset-filter-button").pageBind("click", serverguide.resetFilters);
        if ($("#serverguide-filters").length) {
            serverguide.initGuideFilters();
        }
        if ($("#serverguide-result").length) {
            serverguideList.initServerListing();
            serverguideSort.initSortColumns();
        }
        if ($("#serverguide-autobrowse-on").length > 0 && $(".serverguide-bodycells").length >= 30) {
            serverguideList.setServerListAutoBrowse();
        }
        if ($("#serverguide-show-serverjoin").length) {
            serverguideShow.initServerShow();
        }
        if ($("#serverguide-plugin-not-found").length) {
            serverguide.registerForEvent("plugin", function(event, result) {
                if (!result) {
                    $("#serverguide-plugin-not-found").show();
                }
            });
            serverguide.registerForEvent("game", function(event, result) {
                if (!result) {
                    $("#serverguide-game-not-found").show();
                }
            });
        }
        serverguide.toggleRemoveFavorite();
        $(serverguide.initPlugin);
        var currentServerGuid = false;
        if ($("#serverguide-show").length) {
            try {
                var sgshow = $S("serverguide-show");
                if (sgshow && sgshow.getState() && sgshow.getState().serverinfo && sgshow.getState().serverinfo.guid) {
                    currentServerGuid = $S("serverguide-show").getState().serverinfo.guid;
                }
            } catch (e) {
            }
        }
        serverguide.updateInviteList(currentServerGuid);
        (function() {
            $("#serverinfo-showmoreplayers").pageLive("click", function() {
                $(".serverguide-hideplayer").toggle();
            });
            $("#serverinfo-more-info-view").pageLive("click", function() {
                $("#serverinfo-more-info-view").hide();
                $("#serverinfo-more-info-hide").show();
                $.jStorage.set("serverinfo-more-info-visible", true);
                $("#serverinfo-more-info-expanded").stop(true, true).slideDown(150);
            });
            $("#serverinfo-more-info-hide").pageLive("click", function() {
                $("#serverinfo-more-info-hide").hide();
                $("#serverinfo-more-info-view").show();
                $.jStorage.deleteKey("serverinfo-more-info-visible");
                $("#serverinfo-more-info-expanded").stop(true, true).slideUp(150);
            });
        })();
        if (S.globalContext.session.isLoggedIn) {
            $("#serverguide-friends-tab-playing").html(comcenter.getFriendsPlayingCount());
            $(".serverguide-friends-tab").pageLive("click", function(e) {
                var friends = comcenter.getFriendsListFromLs();
                var guids = [];
                for (var i in friends) {
                    if (friends[i].presence && friends[i].presence.isPlaying) {
                        guids.push(friends[i].presence.serverGuid);
                    }
                }
                var url = $(this).attr("rel").replace("#GUIDS#", guids.join(","));
                Surface.ajaxNavigation.navigateTo(url);
            });
            if (S.globalContext.isAjaxNavigation) {
                serverguide.updateFriendsPlayingOnServers();
            } else {
                setTimeout(serverguide.updateFriendsPlayingOnServers, 1000);
            }
        }
        $("#server-info-maprotation-container .base-box-push-inner").sodaSlider();
    },updateFriendsPlayingOnServers: function() {
        var el = $("#serverguide-listcontainer");
        if (el.length) {
            var playingFriends = comcenter.getFriendsPlaying();
            var surfaces = el.find(".serverguide-surface-finder").parent();
            var surfaceCount = surfaces.length;
            for (var i = 0; i < surfaceCount; i++) {
                var surface = $S(surfaces[i].id);
                var state = surface.getState();
                surface.update({"friendsOnServer": playingFriends[state.server.guid]});
            }
        }
    },toggleRemoveFavorite: function() {
    },addFavorite: function(url, guid) {
        var surf = $S("serverguide-show");
        $.ajax({url: url,dataType: "json",type: "POST",data: "guid=" + guid + "&post-check-sum=" + S.globalContext.session.postChecksum,complete: base.onComplete(function(success, response) {
                if (success) {
                    var favorite_row_id = ".serverguide-favorites-list div[guid='" + guid + "']";
                    if (response.message == "GAMESERVERBOOKMARK_REMOVED") {
                        base.showReceipt("Removed server from favourites", "checkbox");
                        if ($(favorite_row_id).length) {
                            $(favorite_row_id).fadeOut();
                        }
                    } else {
                        base.showReceipt("Added server to favourites", "checkbox");
                        if ($(favorite_row_id).length) {
                            $(favorite_row_id).fadeIn();
                        }
                    }
                    S.globalContext.favGuids.push(guid);
                    surf.refresh();
                    serverguide.toggleRemoveFavorite();
                } else {
                    surf.refresh();
                }
                $(".serverguide-add-favorite-loading").hide();
                $(".serverguide-add-favorite-toggle").show();
                if (response.message == "GAMESERVERBOOKMARK_REMOVED") {
                    $(".base-secondary-right-column .serverguide-add-favorite-toggle").removeClass("isFavorite");
                }
            }, false)});
    },updateInviteList: function(guid) {
        S.debug("Update with guid: " + guid);
        var state = false;
        if (!$("#serverguide-invite-list").length) {
            return false;
        }
        state = $S("serverguide-invite-list").getState();
        var ls = $.jStorage.get("serverguide-invites", {});
        if (state.invites == null || state.invites.length == 0 && ls[guid] != null) {
            $S("serverguide-invite-list").setState({"invites": ls[guid].invites,"serverGuid": guid});
            $S("serverguide-invite-list").refresh();
        }
        var state = $S("serverguide-invite-list").getState();
        ls[guid] = state;
        var ls = $.jStorage.set("serverguide-invites", ls);
        $S("serverguide-invite-list").refresh();
        serverguide.removeOldStatesInInviteList();
    },removeOldStatesInInviteList: function() {
        clearTimeout(serverguide.invitesTimeout);
        serverguide.invitesTimeout = setTimeout(function() {
            if (!$("#serverguide-invite-list").length) {
                return false;
            }
            var state = $S("serverguide-invite-list").getState();
            for (var i in state.invites) {
                var u = state.invites[i];
                if (u.inviteStatus == "1" || u.inviteStatus == "3") {
                    $("#serverguide-invite-item-" + u.userId).slideToggle();
                    state.invites.splice(i, 1);
                }
            }
            var ls = $.jStorage.get("serverguide-invites", {});
            ls[state.serverGuid] = state;
            $.jStorage.set("serverguide-invites", ls);
            $S("serverguide-invite-list").setState(state);
            $S("serverguide-invite-list").refresh();
        }, 5555);
    },resetFilters: function(element) {
        $.jStorage.deleteKey("serverguide-filter-localstorage");
        $(".serverguide-selectable.serverguide-include").removeClass(".serverguide-include").click();
        $("#serverguide-search-input").val("");
        S.globalContext.searchQuery = "";
        var resetUrl = $(element).attr("reseturl");
        $S("serverguide-filterstring").update({searchQuery: false});
        base.redirect(resetUrl);
    },data: {},setFilterDescription: function() {
        $("#serverguide-filter-saved").hide();
        serverguide.data.gameexpansions = $(".serverguide-selectable[filter=gameexpansions]").filter(".serverguide-include").map(function() {
            return $(this).children("div").children("img").attr("alt");
        }).toArray();
        serverguide.data.maxGameexpansions = $(".serverguide-selectable[filter=gameexpansions]").length;
        serverguide.data.gamemodes = $(".serverguide-selectable[filter=gamemodes]").filter(".serverguide-include").map(function() {
            return $(this).children("span").text();
        }).toArray();
        serverguide.data.maxGamemodes = $(".serverguide-selectable[filter=gamemodes]").length;
        serverguide.data.regions = $(".serverguide-selectable[filter=regions]").filter(".serverguide-include").map(function() {
            return $(this).children("span").text();
        }).toArray();
        serverguide.data.maxRegions = $(".serverguide-selectable[filter=regions]").length;
        serverguide.data.gamepresets = $(".serverguide-selectable[filter=gamepresets]").filter(".serverguide-include").map(function() {
            return $(this).children("span").text();
        }).toArray();
        serverguide.data.maxGamepresets = $(".serverguide-selectable[filter=presets]").length;
        serverguide.data.ranked = $(".serverguide-selectable[filter=ranked]").filter(".serverguide-include").map(function() {
            return $(this).attr("value");
        }).toArray();
        serverguide.data.maxRanked = $(".serverguide-selectable[filter=ranked]").length;
        serverguide.data.evented = $(".serverguide-selectable[filter=evented]").filter(".serverguide-include").map(function() {
            return $(this).attr("value");
        }).toArray();
        serverguide.data.maxEvented = $(".serverguide-selectable[filter=evented]").length;
        serverguide.data.punkbuster = $(".serverguide-selectable[filter=punkbuster]").filter(".serverguide-include").map(function() {
            return $(this).attr("value");
        }).toArray();
        serverguide.data.maxPunkbuster = $(".serverguide-selectable[filter=punkbuster]").length;
        serverguide.data.maps = $(".serverguide-selectable[filter=maps]").filter(".serverguide-include").map(function() {
            return $(this).children("span").text();
        }).toArray();
        serverguide.data.slots = $("input[name=slots]").siblings(".serverguide-include").map(function() {
            var returnValue = $(this).children("span").text();
            return returnValue;
        }).toArray();
        serverguide.data.maxSlots = $(".serverguide-selectable[filter=slots]").length;
        if ($("#serverguide-filter-form").length) {
            $.jStorage.set("serverguide-filter-localstorage", S.encodeJSON(serverguide.data));
            $S("serverguide-filterstring").update(serverguide.data);
            clearTimeout(serverguide.filterSearchTimeout);
            serverguide.filterSearchTimeout = setTimeout(function() {
                var serverGuideFormData = $("#serverguide-filter-form").serialize();
                var urlFilter = $("#serverguide-filter-form").attr("rel");
                $.ajax({url: urlFilter,dataType: "json",type: "GET",data: serverGuideFormData,beforeSend: function() {
                        $("#serverguide-filter-count").html("Loading...");
                    },complete: base.onComplete(function(success, response) {
                        var servers = response.data.servers;
                        if (servers == 0) {
                            $(".serverguide-apply-filter-button").attr("disabled", true);
                        } else {
                            $(".serverguide-apply-filter-button").attr("disabled", false);
                        }
                        $("#serverguide-filter-count").stop(true, true);
                        $("#serverguide-filter-count").hide();
                        $("#serverguide-filter-count").html("Found <span class='serverguide-filter-count-amount'>" + servers + "</span> servers");
                        $("#serverguide-filter-count").fadeIn(100);
                    }, false)});
            }, 800);
        }
    },initSearchField: function() {
        var q = $("#serverguide-search-input");
        var clear = function() {
            if (q.val() == q.attr("title")) {
                q.val("");
            }
        };
        var submitfilter = function() {
            $("#serverguide-filter-saved").stop(true, true).fadeIn(200);
            clear();
        };
        var fill = function() {
            if (q.val() == "") {
                q.val(q.attr("title"));
            }
        };
        q.pageBind("focus", clear);
        q.pageBind("blur", function() {
            serverguide.setFilterDescription();
            fill;
        });
        $("#serverguide-filter-form").pageBind("submit", submitfilter);
        fill();
    },initPlugin: function() {
        if ($("#serverguide-plugin-not-found")) {
            if (launcher.getInstance()) {
                serverguide._triggerEvent("plugin", [true]);
            } else {
                serverguide._triggerEvent("plugin", [false]);
            }
        }
    },filterSurfaceTimeout: 0,initGuideFilters: function() {
        $("#serverguide-search-input").pageBind("focus", function() {
            $(".serverguide-apply-filter-button").attr("disabled", false);
        });
        $("#serverguide-filtertoggle").pageBind("click", function(e) {
            if ($(e.target).hasClass("serverguide-reset-filter-button")) {
                serverguide.resetFilters(e.target);
                return false;
            }
            if ($(e.target).is("button")) {
                return false;
            }
            var elements = $("#serverguide-filters, #serverguide-apply-filters");
            if ($("#serverguide-filters").is(":visible")) {
                $("#serverguide-filters").hide();
                $("#serverguide-apply-filters").hide();
                $("#serverguide-filtertoggle").addClass("serverguide-filtertoggle-contracted").removeClass("serverguide-filtertoggle-expanded");
                $("#serverguide-filter-form").addClass("serverguide-filter-form-contracted");
                $("#serverguide-change-link").show();
            } else {
                $("#serverguide-filters").show();
                $("#serverguide-apply-filters").show();
                $("#serverguide-filtertoggle").removeClass("serverguide-filtertoggle-contracted").addClass("serverguide-filtertoggle-expanded");
                $("#serverguide-filter-form").removeClass("serverguide-filter-form-contracted");
                $("#serverguide-change-link").hide();
                $("#serverguide-search-input").focus();
            }
        });
        serverguide.setFilterDescription();
        $("input[type=hidden]").pageLive("newvalue", function(e) {
            serverguide.setFilterDescription();
        });
        $(".serverguide-selectable").each(function() {
            var filter = $(this).attr("filter");
            if (!filter) {
                return;
            }
            $(this).pageBind("mousedown", function() {
                if ($(this).hasClass("serverguide-disabled")) {
                    return;
                }
                var isSelected = $(this).hasClass("serverguide-include");
                if (isSelected) {
                    $(this).removeClass("serverguide-include").addClass("serverguide-exclude");
                } else {
                    $(this).removeClass("serverguide-exclude").addClass("serverguide-include");
                }
                var value = $(this).attr("value");
                var inp = $("input[name=" + filter + "]");
                var elements = inp.val().split("|");
                if (inp.val() == "") {
                    elements = [];
                }
                S.debug("isSelected: " + isSelected);
                if (isSelected) {
                    var index = $.inArray(value, elements);
                    S.debug("value: " + value + " elements: " + elements + " index: " + index);
                    if (index > -1) {
                        elements.splice(index, 1);
                    }
                } else {
                    elements.push(value);
                }
                inp.val(elements.join("|"));
                if (filter == "gamemodes") {
                    var noGameModesSelected = true;
                    $(".serverguide-selectable[filter='gamemodes']").each(function() {
                        if ($(this).hasClass("serverguide-include")) {
                            noGameModesSelected = false;
                        }
                    });
                    if (noGameModesSelected) {
                        $(".serverguide-filter-gamemode input[name='gamemodes']").val("");
                        $(".serverguide-selectable[filter='maps']").removeClass("serverguide-disabled");
                    }
                    if (!noGameModesSelected) {
                        $(".serverguide-selectable[filter='maps']").each(function() {
                            var mapmode = false;
                            var mapmodes = $(this).attr("modes").toLowerCase();
                            for (i = 0; i <= elements.length; i++) {
                                if (elements[i] === undefined) {
                                    continue;
                                }
                                if (mapmodes.indexOf(elements[i].toLowerCase()) > -1) {
                                    mapmode = true;
                                }
                            }
                            if (mapmode) {
                                $(this).removeClass("serverguide-disabled");
                            } else {
                                $(this).addClass("serverguide-disabled");
                            }
                        });
                    }
                }
                var self = $(this);
                clearTimeout(serverguide.filterSurfaceTimeout);
                serverguide.filterSurfaceTimeout = setTimeout(function() {
                    serverguide.setFilterDescription();
                    if (self.attr("value") == "bfbc2" || self.attr("value") == "bfbc2nam") {
                        serverguide.greyOutGameSelectionMaps();
                    }
                }, ($.browser.msie ? 800 : 200));
            });
        });
        $("#serverguide-join-random").pageBind("click", function() {
            var itemCount = $("#serverguide-result .serverguide-cell-join form").size();
            var idx = Math.floor(Math.random() * itemCount);
            $("#serverguide-server-" + idx + " .serverguide-cell-join form input[type=submit]").click();
        });
    },greyOutGameSelectionMaps: function() {
        var bc2 = $(".serverguide-selectable[value='bfbc2']").hasClass("serverguide-include");
        var nam = $(".serverguide-selectable[value='bfbc2nam']").hasClass("serverguide-include");
        $("[filter='maps']").removeClass("serverguide-disabled");
        if (bc2 && !nam) {
            $(".serverguide-include[value*='NAM']").trigger("click");
            $("div[value*='NAM']").addClass("serverguide-disabled").removeClass("serverguide-include").addClass("serverguide-exclude");
        }
        if (!bc2 && nam) {
            $(".serverguide-include[filter='maps']:not([value*='NAM'])").trigger("click");
            $("[filter='maps']:not([value*='NAM'])").addClass("serverguide-disabled").removeClass("serverguide-include").addClass("serverguide-exclude");
            $("div[value*='NAM']").removeClass("serverguide-disabled");
        }
        var maps = "";
        $(".serverguide-selectable[filter='maps']").filter(".serverguide-include").each(function() {
            maps = maps + "|" + $(this).attr("value");
        });
        $("input[name='maps']").val(maps);
        serverguide.setFilterDescription();
        serverguide.disableNotOwnedExpansion();
    },disableNotOwnedExpansion: function() {
        var platforms = S.globalContext.staticContext["platforms"];
        var gameExpansion = S.globalContext.staticContext["gameExpansions"];
        var userId = S.globalContext["session"]["userId"];
        if (userId != null && !base.ownsGameExpansion(gameExpansion.BFBC2NAM, platforms.PC)) {
            $("div[filter='gameexpansions'][value='bfbc2nam']").addClass("serverguide-disabled");
            $("div[value*='NAM']").addClass("serverguide-disabled");
        }
    },showQueryServerResult: function(game, server) {
        S.debug("QueryServerResults: " + server);
    },inviteToServer: function(userId, guid) {
        var url = "/comcenter/inviteToServer/" + userId + "/" + guid;
        base.ajaxPostJson(url, function(success, response) {
            if (success) {
                S.debug(response);
            }
        });
    },update_server_scoreboard: function() {
        var guid = $("#server-guid").attr("value");
        var url = $("#serverguide-show-url").val().replace("%GUID%", guid);
        base.ajaxGetJson(url, function(success, response) {
            if (success) {
                var serverinfo = response["message"]["SERVER_INFO"];
                $S("serverguide-scoreboard").update({"scoreboard": serverinfo});
            }
        });
    },live_update_server_scoreboard: function() {
        serverguide.update_server_scoreboard();
        active_scoreboard = setTimeout(serverguide.live_update_server_scoreboard, 5000);
    },stop_update_server_scoreboard: function() {
        clearTimeout(active_scoreboard);
    },registerForEvent: function(event, callback) {
        jQuery("#esnlaunch_container").pageBind("bf.serverguide." + event, callback);
    },_triggerEvent: function(event, data) {
        jQuery("#esnlaunch_container").triggerHandler("bf.serverguide." + event, data);
    }};
var session = {onPageShow: function() {
    },init: function(template) {
    }};
var settings = {setCaptureMode: function(state) {
        $(".voice-setting-mode").removeClass("active");
        $(".voice-settings-voice-info").hide();
        if (state == ESN.Sonar.CAPTURE_MODE_PUSH_TO_TALK) {
            $("#voice-settings-mode-push").addClass("active");
            $("#voice-settings-mode-push-info").show();
        } else {
            $("#voice-settings-mode-voice").addClass("active");
            $("#voice-settings-mode-voice-info").show();
        }
        base.showReceipt("Capture mode updated!");
    },setSettingsAfterSonarInit: function() {
        ESN.Sonar.addAudioCallback();
        try {
            $("#voice-sensitivity-slider").slider("value", 100 - (ESN.Sonar.getVoiceSensitivity() * 100));
            $("#voice-volume-slider").slider("value", ESN.Sonar.getCaptureVolume() * 100);
            $("#voice-speaker-volumn-slider").slider("value", ESN.Sonar.getVolume() * 100);
        } catch (e) {
            S.debug("Could not set sliders...");
        }
        $("#settings-voice-toggle-block").attr("checked", ESN.Sonar.client.blockPushToTalkKey());
        var voiceActivation = ESN.Sonar.getVoiceActivationEnabled();
        if (voiceActivation) {
            $(".voiceSetMode:first").addClass("selected");
            $("#voice-settings-mode-voice-info").show();
        } else {
            $(".voiceSetMode:last").addClass("selected");
            $("#voice-settings-mode-push-info").show();
        }
        ESN.Sonar.debug("Setting settings");
        $("#voice-settings-ppt-key").html(ESN.Sonar.getPushToTalkKey());
        var devices = ESN.Sonar.getPlaybackDevices();
        var currentDevice = ESN.Sonar.getCurrentPlaybackDevice();
        for (var i in devices) {
            if (devices[i].deviceId == currentDevice) {
                devices[i].active = true;
            }
        }
        $S("playbackDevices").update({"devices": devices});
        var devices = ESN.Sonar.getCaptureDevices();
        var currentDevice = ESN.Sonar.getCurrentCaptureDevice();
        for (var i = 0; i < devices.length; i++) {
            if (devices[i].deviceId == currentDevice) {
                devices[i].active = true;
            }
        }
        $S("captureDevices").update({"devices": devices});
        var loopBack = ESN.Sonar.getAudioLoopbackEnabled();
        $(".sonar-audio-checkbox").attr("checked", loopBack);
    },onPageShow: function() {
        $(function() {
            if (!ESN.Sonar.ensureConnectedToServer(function() {
                S.debug("Sonar started");
                setTimeout(settings.setSettingsAfterSonarInit, 1000);
            })) {
                S.error("Could not start Voice in settings.");
            }
        });
        $(".voiceSetMode").pageBind("click", function(e) {
            if ($(this).attr("data-mode") == ESN.Sonar.CAPTURE_MODE_VOICE_ACTIVATION) {
                ESN.Sonar.setCaptureMode(ESN.Sonar.CAPTURE_MODE_VOICE_ACTIVATION);
            }
            if ($(this).attr("data-mode") == ESN.Sonar.CAPTURE_MODE_PUSH_TO_TALK) {
                ESN.Sonar.setCaptureMode(ESN.Sonar.CAPTURE_MODE_PUSH_TO_TALK);
            }
            $(".voiceSetMode").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#settings-voice-toggle-block").pageBind("change", function() {
            var checked = $(this).attr("checked");
            S.debug("Setting blocked to: " + checked);
            ESN.Sonar.client.blockPushToTalkKey(checked);
        });
        $("#voice-change-ppt-button").pageBind("click", function() {
            $("#voice-settings-ppt-key").html("Click a key or combination to set. (Esc to cancel)");
            $(".sonar-ppt-status").removeClass("active");
            setTimeout(function() {
                ESN.Sonar.catchNextKeyAndSetAsPushToTalk();
            }, 100);
        });
        $("#voice-volume-slider").slider({slide: function(event, ui) {
                var setMicVolume = parseFloat($(ui).attr("value")) / 100;
                ESN.Sonar.setCaptureVolume(setMicVolume);
            },animate: true,max: 100,min: 0,range: "min",value: ESN.Sonar.getCaptureVolume()});
        $("#voice-sensitivity-slider").slider({slide: function(event, ui) {
                var value = (100 - parseInt($(ui).attr("value"))) / 100;
                S.info("set value" + value);
                ESN.Sonar.setVoiceSensitivity(value);
            },animate: true,max: 100,min: 0,value: ESN.Sonar.getVoiceSensitivity()});
        $("#voice-speaker-volumn-slider").slider({slide: function(event, ui) {
                var setMicVolume = parseFloat($(ui).attr("value"));
                ESN.Sonar.setVolume(setMicVolume / 100);
                if ($(".comcenter-sonar-slider").length) {
                    $(".comcenter-sonar-slider").slider("value", setMicVolume);
                }
            },animate: true,max: 100,min: 0,value: 0,range: "min"});
        $(".settings-uninstall-venice").pageBind("click", function() {
            patcher.launch(games.BF3, "-uninstall -shutdown");
        });
        $(".settings-install-venice").pageBind("click", function(installDoneCallback) {
            patcher.installGame(games.BF3, installDoneCallback);
        });
    },init: function(template) {
        launcher.isGameInstalled(games.BF3, function(installed) {
            if (installed) {
                $(".settings-uninstall-venice").show();
            } else {
                $(".settings-install-venice").show();
            }
        });
    },gotAudio: function(v) {
        $(".voice-sending-status").attr("className", v.xmit ? "voice-sending-status active" : "voice-sending-status not-sending");
        var avg = 0 + parseInt(v.avgAmp);
        var voiceHeight = avg * 0.044;
        if (voiceHeight > 314) {
            voiceHeight = 314;
        }
        var voiceSens = ESN.Sonar.getVoiceSensitivity();
        sensAmp = ((100 - voiceSens) * 80) * 0.044;
        if (v.xmit && v.vaState && voiceHeight < sensAmp) {
        }
        $(".voice-settings-volume-bar").css("width", voiceHeight);
    }};