var joinflow = {currentServerInfo: null,test: "no",onPageShow: function() {
    },init: function(template) {
        $("#joinflow-registration").live("click", function() {
            joinflow.hidePopup(true);
        });
    },joinFriend: function(form) {
        var formValues = {};
        $(form).find(":input").each(function() {
            formValues[this.name] = $(this).val();
        });
        friendPersonaId = formValues.friendPersonaId;
        joinflow.joinServerByUrl($(form).attr("action"), friendPersonaId, function(foundServer) {
        });
        return false;
    },joinServerByUrl: function(url, friendPersonaId, callback) {
        var serverUrl = url;
        if (serverUrl.indexOf("?") == -1) {
            serverUrl += "?";
        } else {
            serverUrl += "&";
        }
        serverUrl += "json=1&join=true";
        S.debug(serverUrl);
        $.ajax({url: serverUrl,dataType: "json",complete: base.onComplete(function(success, response, xmlHttpRequest) {
                if (success) {
                    joinflow._joinServer(response.data, friendPersonaId);
                } else {
                    S.debug("No server info returned: " + response);
                    if (xmlHttpRequest.status == 404) {
                        return joinflow.showPopup("serveroffline", {});
                    } else {
                        return base.showReceipt("Could not to join server.", receiptTypes.ERROR);
                    }
                }
                if (callback) {
                    callback(success);
                }
            }, false)});
    },hasValidPlugin: function() {
        return gamemanager.verifyPlugin(S.globalContext.realm.section);
    },checkJoinGameRequirements: function(callback, server, friendPersonaId) {
        var callback = callback || null;
        var server = server || null;
        var friendPersonaId = friendPersonaId || 0;
        var namespaces = S.globalContext.staticContext.nucleusNamespaces;
        if (!S.globalContext["session"]["isLoggedIn"]) {
            joinflow.showLoginPopup(server, friendPersonaId);
            return false;
        }
        if (!S.globalContext["session"]["currentPersona"] || (S.globalContext["session"]["currentPersona"]["namespace"] != namespaces.BATTLEFIELD && S.globalContext["session"]["currentPersona"]["namespace"] != namespaces.CEM_EA_ID)) {
            joinflow.showNotValidPersonaPopup(server, friendPersonaId, callback);
            return false;
        }
        if (!joinflow.hasValidPlugin()) {
            joinflow.showPluginPopup(server, friendPersonaId, callback);
            return false;
        }
        if (!gamemanager.patcherState.name || gamemanager.patcherState.name != gamemanager.states.PATCHER_OK) {
            joinflow.showPatcherPopup(server, friendPersonaId, callback);
            return false;
        }
        if (gamemanager.inviteState && gamemanager.inviteState.name == gamemanager.states.INVITE_STARTED) {
            if (server && server.guid && (server.guid != gamemanager.inviteState.server.guid)) {
                joinflow.showGroupJoinPopup(server, friendPersonaId, callback);
                return false;
            }
        }
        if (gamemanager.gameState && gamemanager.gameState.name != gamemanager.states.GAME_OK) {
            joinflow.showInstallGameButton(server, friendPersonaId, callback);
            return false;
        }
        return true;
    },_joinServer: function(server, friendPersonaId) {
        var friendPersonaId = friendPersonaId || false;
        S.debug("_joinServer in joinflow.js");
        S.debug(server);
        if (!joinflow.checkJoinGameRequirements(null, server, friendPersonaId)) {
            S.debug("Could not join game since all requirements is not set...");
            return false;
        }
        joinflow._saveCurrentServer(server.game, server.guid, friendPersonaId);
        if (server && !server.online) {
            joinflow._deleteCurrentServer();
            joinflow.showPopup("serveroffline", {server: server});
            return false;
        }
        if (server.hasPassword && (S.globalContext["session"]["serverPassword"] == null || typeof (S.globalContext["session"]["serverPassword"]) == "undefined")) {
            joinflow.showPasswordPromptPopup(server, function() {
                joinflow._joinServer(server, friendPersonaId);
            });
            return;
        }
        launcher.isGameInstalled(server.game, function(installed) {
            var platforms = S.globalContext.staticContext["platforms"];
            var gameExpansions = S.globalContext.staticContext["gameExpansions"];
            if (installed) {
                if (server.gameExpansion && !base.ownsGameExpansion(server.gameExpansion, platforms.PC)) {
                    joinflow.showBuyPopup(server);
                } else {
                    launcher.checkForPatchAvailable(server.game, gameTypes.MP, function(game, wasUpToDate) {
                        if (wasUpToDate === true) {
                            joinflow.launch(server, friendPersonaId);
                        } else {
                            popup.render("installstate", gamemanager.getCurrentStateObject());
                        }
                    });
                }
            } else {
                if (base.ownsGame(server.game, platforms.PC)) {
                    if (server.game == games.BFBC2) {
                        joinflow.showBFBC2ExePopup(server);
                    } else {
                        joinflow.showInstallGameButton(server.game, friendPersonaId, function(game, wasUpToDate) {
                            joinflow._joinServer(server);
                        });
                    }
                } else {
                    joinflow.showBuyPopup(server);
                }
            }
        });
    },launch: function(server, friendPersonaId) {
        S.debug("Launching ");
        joinflow.hidePopup(true);
        gamemanager.launchAndJoin(server, friendPersonaId);
    },hidePopup: function(conf) {
        if (conf) {
            S.debug("trying to hide install popup..");
            joinflow._deleteCurrentServer();
            $("#joinflow-popup-container").hide();
            $S("joinflow-popup").update({"show": 0});
        }
    },showPopup: function(name, state) {
        $S("joinflow-popup").update({"show": 1,"name": name,"state": state});
        $("#joinflow-popup-container").show();
        $("#joinflow-popup .common-popup-close").click(function() {
            joinflow.hidePopup(true);
        });
    },showPasswordPromptPopup: function(server, callback) {
        joinflow.showPopup("passwordPrompt", {"server": server});
        $("#joinflow-passwordprompt-serverpassword").val("").focus();
        var onSubmitClick = function() {
            var pass = $("#joinflow-passwordprompt-serverpassword").val();
            launcher.verifyPassword(server.game, server.guid, pass, function(passwordOk) {
                if (passwordOk) {
                    S.globalContext["session"]["serverPassword"] = $("#joinflow-passwordprompt-serverpassword").val();
                    $(".common-popup-close").trigger("click");
                    callback();
                } else {
                    base.showReceipt("Wrong password!", "skull");
                    $("#joinflow-passwordprompt-serverpassword").val("").focus();
                }
            });
        };
        $("#joinflow-passwordprompt-submit").click(onSubmitClick);
        $("#joinflow-passwordprompt-serverpassword").bind("keypress", function(e) {
            if (e.keyCode == 13) {
                onSubmitClick();
            }
        });
    },showJoinPartyInsteadPopup: function(data, callback) {
        popup.render("joinpartygame", data);
        $(".chat-party-create-join-button").bind("click", callback);
    },showNotValidPersonaPopup: function(server, friendPersonaId, callback) {
        S.debug("Show showNotValidPersonaPopup :");
        S.debug(server);
        var section = S.globalContext["realm"]["section"];
        var sections = S.globalContext.staticContext.sections;
        joinflow.showPopup("notvalidpersona", {server: server,notCorrectSection: section == sections.ALL});
        joinflow._saveCurrentServerCookie(server, friendPersonaId);
        $("#joinflow-pluginpopup-continuebutton").click(function() {
            joinflow.hidePopup(true);
            if (server) {
                joinflow._joinServer(server, friendPersonaId);
            }
            if (typeof (callback) == "function") {
                S.debug("Doing popup callback..");
                callback();
            }
        });
        $("#base-header-personacontainer").click();
    },showPersonaPopup: function(server, friendPersonaId) {
        var setCurrentPersona = function(personaId, personaName, clanTag, platform) {
            joinflow.showLoadingPopup(server);
            $.ajax({type: "POST",url: "/all/profile/updatepersonas",data: {personaId: personaId,gameId: server.game},complete: base.onComplete(function(success, response) {
                    if (success) {
                        S.globalContext["session"]["currentPersona"] = {personaId: personaId,personaName: personaName,clanTag: clanTag,platform: S.globalContext.staticContext["platforms"]["PC"]};
                    } else {
                        base.showMessageBoxFromResponse(success, response);
                    }
                    joinflow._joinServer(server, friendPersonaId);
                }, false)});
        };
        var onSelectClick = function() {
            var personaId = parseInt($("#joinflow-personapopup-selectbox").val());
            var personaName = $("#joinflow-personapopup-selectbox :selected").text();
            var clanTag = $("#joinflow-personapopup-clantag").val();
            setCurrentPersona(personaId, personaName, clanTag, S.globalContext.staticContext["platforms"]["PC"]);
        };
        joinflow.showLoadingPopup(server);
    },showLoadingPopup: function(server) {
        joinflow.showPopup("loading", {server: server});
    },showGroupJoinPopup: function(server, friendPersonaId, callback) {
        joinflow.showPopup("groupjoin", {server: server});
        $("#joinflow-groupjoin-continuebutton").click(function() {
            joinflow.hidePopup(true);
            if (server) {
                $("#gamemanager-invite-cancel").click();
                gamemanager.inviteState = {};
                gamemanager.saveLocalStorage();
                joinflow._joinServer(server, friendPersonaId);
            }
            if (typeof (callback) == "function") {
                S.debug("Doing popup callback..");
                callback();
            }
        });
    },showPluginPopup: function(server, friendPersonaId, callback) {
        gamemanager.resetPluginGameManager();
        joinflow.showPopup("plugin", {server: server});
        $("#joinflow-show-gamemanager").click(function() {
            gamemanager.show();
        });
        $("#joinflow-pluginpopup-continuebutton").click(function() {
            joinflow.hidePopup(true);
            if (server) {
                joinflow._joinServer(server, friendPersonaId);
            }
            if (typeof (callback) == "function") {
                S.debug("Doing popup callback..");
                callback();
            }
        });
    },showPatcherPopup: function(server, friendPersonaId, callback) {
        gamemanager.resetPluginGameManager();
        joinflow.showPopup("patcher", {server: server});
        $("#joinflow-show-gamemanager").click(function() {
            gamemanager.show();
        });
        $("#joinflow-pluginpopup-continuebutton").click(function() {
            joinflow.hidePopup(true);
            if (server) {
                joinflow._joinServer(server, friendPersonaId);
            }
            if (typeof (callback) == "function") {
                S.debug("Doing popup callback..");
                callback();
            }
        });
    },showBFBC2ExePopup: function(server) {
        joinflow.showPopup("bfbc2exe", {server: server});
        $("#joinflow-bfbc2exepopup-continuebutton").click(function() {
            joinflow._joinServer(server);
        });
    },showBC2PatchingNeededPopup: function() {
        var checkGameVersion = function() {
            launcher.checkForPatchAvailable(games.BFBC2, gameTypes.MP, function(game, wasUpToDate) {
                if (wasUpToDate) {
                    joinflow.showPopup("exesuccess", {});
                    $("#joinflow-exesuccesspopup-continuebutton").click(function() {
                        if (!joinflow._joinCurrentServer()) {
                            joinflow.hidePopup(1);
                        }
                    });
                }
            });
        };
        var popupState = $S("joinflow-popup").getState();
        if (popupState.name != "bfbc2patching") {
            joinflow.showPopup("bfbc2patching", {});
        }
        setTimeout(checkGameVersion, 1000);
    },showInstallGameButton: function(server, friendPersonaId, callback) {
        gamemanager.resetPluginGameManager();
        joinflow.showPopup("install", {});
        $("#joinflow-show-gamemanager").click(function() {
            gamemanager.show();
        });
        $("#joinflow-pluginpopup-continuebutton").click(function() {
            joinflow.hidePopup(true);
            if (server) {
                joinflow._joinServer(server, friendPersonaId);
            }
            if (typeof (callback) == "function") {
                S.debug("Doing popup callback..");
                callback();
            }
        });
    },showPatchSuccessPopup: function(server) {
        joinflow.showPopup("exesuccess", {server: server});
        $("#joinflow-exesuccesspopup-continuebutton").click(function() {
            joinflow._joinServer(server);
        });
    },showLoginPopup: function(server, friendPersonaId) {
        joinflow.showPopup("login", {server: server});
        $("#joinflow-email").focus();
        $("#joinflow-loginpopup-form input[type=submit]").click(function() {
            var form = $("#joinflow-loginpopup-form");
            $.ajax({url: form.attr("action"),dataType: "json",type: "POST",data: form.serialize(),complete: base.onComplete(function(success, response) {
                    if (success) {
                        joinflow._saveCurrentServerCookie(server, friendPersonaId);
                        window.location.reload();
                    } else {
                        base.showMessageBoxFromResponse(success, response);
                        joinflow.showLoginPopup(server, friendPersonaId);
                    }
                }, false)});
            joinflow.showLoadingPopup(server);
        });
    },showPurchaseGameButton: function() {
        $S("gameStatus").update({state: "buygame",statePrettyName: "Buy game",patcherButton: "purchase"});
        $("#patcherButton-purchase").click(function() {
            joinflow.showBuyView(this);
        });
    },showBuyPopup: function(server) {
        joinflow.showPopup("buy", {server: server});
        $("#buy-game-button").show().click(function() {
            joinflow.showBuyView(this);
        });
    },showBuyView: function(element) {
        var url = $(element).attr("action");
        $.ajax({url: url,dataType: "json",success: function(response) {
                $.each(response.data.urls, function(locale, url) {
                    window.open(url);
                    return false;
                });
            },error: function() {
                alert("No store URLs found");
                S.debug("No store URLs found");
            },complete: null});
    },_saveCurrentServerCookie: function(server, friendPersonaId) {
        S.debug("Not saving server cookie for now");
        return false;
        server.friendPersonaId = friendPersonaId;
        S.debug("Saved server cookie!");
        Surface.cookieSet("joinflow.savedServerCookie", S.encodeJSON(server), 0.007);
    },_saveCurrentServer: function(serverGame, serverGuid, friendPersonaId) {
        joinflow.currentServerInfo = {guid: serverGuid,game: serverGame,friendPersonaId: friendPersonaId};
        $.jStorage.set("joinflow.savedServer", joinflow.currentServerInfo);
    },_joinCurrentServer: function() {
        var server = joinflow._getCurrentServer();
        if (server.guid && server.game) {
            var gameUrl = "/" + base.gameToSection(server.game) + "/serverguide/show/" + server.guid;
            joinflow.joinServerByUrl(gameUrl, server.friendPersonaId, function(foundServer) {
                if (!foundServer) {
                    joinflow._deleteCurrentServer();
                }
            });
            return true;
        }
        return false;
    },_getCurrentServer: function() {
        var server = {};
        if (joinflow.currentServerInfo != null) {
            server = joinflow.currentServerInfo;
        } else {
            var savedServer = $.jStorage.get("joinflow.savedServer", null);
            if (savedServer != null) {
                server = savedServer;
            }
        }
        return server;
    },_deleteCurrentServer: function() {
        joinflow.currentServerInfo = null;
        $.jStorage.deleteKey("joinflow.savedServer");
    }};