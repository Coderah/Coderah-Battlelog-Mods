var gamemanager = {debug: function(o) {
        if (typeof (o) == "string") {
            S.debug("GAMEMANAGER - " + o);
        } else {
            if (typeof (o) == "object") {
                S.debug("GAMEMANAGER - Object");
                S.debug(o);
            }
        }
    },onPageShow: function() {
    },updateCoopLobby: function(coopGame) {
        S.debug("got coop update!");
        S.debug(coopGame);
        gamemanager.coopState = coopGame;
        gamemanager.coopState.name = gamemanager.states.INVITE_STARTED;
        S.debug("Before save");
        S.debug(gamemanager.coopState);
        gamemanager.isHidden = false;
        gamemanager.saveLocalStorageAndUpdateUI(coopGame.game);
    },init: function(template) {
        Push.bind("CoopLobbyUpdate", function(e) {
            var coopGame = e.data;
            gamemanager.updateCoopLobby(coopGame);
        });
        Push.bind("GroupJoinUpdate", function(e) {
            S.debug("got update!");
            S.debug(e.data);
            gamemanager.inviteState = e.data;
            gamemanager.inviteState.name = gamemanager.states.INVITE_STARTED;
            S.debug("Before save");
            S.debug(gamemanager.inviteState);
            gamemanager.isHidden = false;
            gamemanager.saveLocalStorageAndUpdateUI();
        });
        Push.bind("GroupJoinKicked", function(e) {
            gamemanager.inviteState = {};
            gamemanager.saveLocalStorageAndUpdateUI();
            base.showReceipt("You were kicked from Party Join");
            return false;
        });
        Push.bind("VoiceKicked", function(e) {
            base.showReceipt(e.data);
            sonarui.leaveChannel();
            return false;
        });
        Push.bind("GroupJoinRemoved", function(e) {
            S.debug("got group");
            S.debug(e.data);
            gamemanager.inviteState = {};
            gamemanager.saveLocalStorageAndUpdateUI();
            base.showReceipt("Party Join was cancelled by host");
        });
        Push.bind("GroupJoinStart", function(e) {
            S.debug("got group start");
            S.debug(e.data);
            gamemanager.inviteState = {};
            gamemanager.saveLocalStorageAndUpdateUI();
            joinflow._joinServer(e.data.server, 0);
            base.showReceipt("Joining server with Party!");
        });
        Push.bind("GroupJoinReserveSlots", function(e) {
            var groupJoinLobby = e.data;
            S.debug("got GroupJoinReserveSlots slots");
            S.debug(groupJoinLobby);
            gamemanager.inviteState = {};
            gamemanager.saveLocalStorageAndUpdateUI(groupJoinLobby.game);
            var leaderPersona = {};
            var groupPersonaIdList = [];
            jQuery.each(groupJoinLobby.players, function(index, groupJoinLobbyUser) {
                if (groupJoinLobby.hostUserId == groupJoinLobbyUser.userId) {
                    leaderPersona.personaId = groupJoinLobbyUser.personaId;
                } else {
                    groupPersonaIdList.push(groupJoinLobbyUser.personaId);
                }
            });
            var server = groupJoinLobby.server;
            server.groupPersonaIdList = groupPersonaIdList;
            joinflow._joinServer(server, null);
            base.showReceipt("Joining server with Party!");
        });
        if (S.globalContext.flushStorage) {
            S.debug("flushed storage, since we found no cookie");
            $.jStorage.flush();
        }
        gamemanager.bindLaunchUpdates();
        Push.bind("CoopStartPublic", function(e) {
            gamemanager.debug("got CoopStartPublic!");
            var coopGame = e.data;
            gamemanager.debug(coopGame);
        });
        Push.bind("CoopHostIsInGame", function(e) {
            gamemanager.debug("got CoopHostIsInGame");
            var coopGameHost = e.data;
            gamemanager.debug(coopGameHost);
            gamemanager.launcherState = {currentGame: coopGameHost.coopGame.game,currentLevel: coopGameHost.coopGame.level,gameState: launcher.STATE.LOADING,gameStatePretty: "...",name: gamemanager.states.LAUNCH_INFO};
            gamemanager.debug("Start up this peer");
            launcher.joinPrivateCoOpServer(S.globalContext.session.currentPersona, coopGameHost.hostUserPresence.game, coopGameHost.coopGame.ownerPersonaId);
            coop.closeMission();
        });
        Push.bind("CoopStartAsHost", function(e) {
            gamemanager.debug("got CoopStartAsHost!");
            var coopGame = e.data;
            gamemanager.debug(coopGame);
            gamemanager.launcherState = {currentGame: coopGame.game,currentLevel: coopGame.level,gameState: launcher.STATE.LOADING,gameStatePretty: "...",name: gamemanager.states.LAUNCH_INFO};
            launcher.createPrivateCoOpServer(S.globalContext.session.currentPersona, coopGame.game, coopGame.level, coopGame.difficulty);
            coop.closeMission();
        });
        Push.bind("CoopLobbyDeclined", function(e) {
            S.debug("Got CoopLobbyDeclined");
            gamemanager.coopState = {};
            gamemanager.saveLocalStorageAndUpdateUI();
            base.showReceipt("CO-OP game invite was declined.");
        });
        Push.bind("CoopLobbyAborted", function(e) {
            S.debug("Got CoopLobbyAborted");
            gamemanager.coopState.type = "abort";
            gamemanager.updateGameStateUIFromState(gamemanager.getCurrentStateObject());
            gamemanager.coopState = {};
            gamemanager.saveLocalStorage();
            base.showReceipt("CO-OP game was cancelled.");
        });
        Push.bind("CoopLobbyCleanup", function(e) {
            S.debug("Got CoopLobbyCleanup");
            gamemanager.coopState.type = "";
            gamemanager.updateGameStateUIFromState(gamemanager.getCurrentStateObject());
            gamemanager.coopState = {};
            gamemanager.saveLocalStorage();
        });
        $("#gamemanager-plugin-download-again").live("click", function(e) {
            e.preventDefault();
            $("#gamemananger-pluginstate-missing-form").submit();
            return false;
        });
        $("#gamemanager-coop-cancel").live("click", function() {
            var url = $("#coopLeave-urlaction").val().replace("#COOPID#", $("#current-coopId").val());
            base.ajaxPostJson(url, function(s, r) {
                switch (r.message) {
                    case "NOT_FOUND":
                        base.showReceipt("CO-OP game not found.");
                        gamemanager.coopState = {};
                        gamemanager.saveLocalStorageAndUpdateUI();
                        break;
                }
            });
        });
        $(".gamemanager-coopstate-startjoin-form").live("submit", function(e) {
            e.preventDefault();
            var url = $(this).attr("action");
            $.ajax({url: url,dataType: "json",type: "POST",data: {"post-check-sum": S.globalContext.session.postChecksum},complete: base.onComplete(function(success, response) {
                    switch (response.message) {
                        case "CoopStarted":
                            comcenter.showReceipt("Starting CO-OP Host");
                            coop.closeMission();
                            break;
                        case "COOP_NOT_FOUND":
                            comcenter.showReceipt("Found no CO-OP game to launch.", receiptTypes.ERROR);
                            break;
                        case "GAME_NOT_READY":
                            comcenter.showReceipt("Invited friend left.", receiptTypes.ERROR);
                            break;
                    }
                }, false)});
        });
        launcher.registerForEvent("coop.public.ready", function(event, game, personaId, selectedMissionInfo) {
            gamemanager.coopState.level = selectedMissionInfo.levelName;
            gamemanager.coopState.difficulty = selectedMissionInfo.difficulty;
            if (selectedMissionInfo.isHost) {
            }
            gamemanager.saveLocalStorageAndUpdateUI(game);
        });
        launcher.registerForEvent("matchmake.success", function(event, reservation) {
            S.debug(reservation);
            gamemanager.launcherState = {server: reservation.gameServer,currentGame: reservation.game,currentLevel: reservation.gameServer.map,gameState: launcher.STATE.LOADING,gameStatePretty: "...",name: gamemanager.states.LAUNCH_INFO};
            gamemanager.saveLocalStorageAndUpdateUI(reservation.game);
            $.jStorage.deleteKey("matchmakeSession");
        });
        launcher.registerForEvent("matchmake.fail", function(event, reservationFail) {
            S.debug("Got matchmake.fail in gm");
            gamemanager.inviteState = {};
            gamemanager.saveLocalStorage();
            $.jStorage.deleteKey("matchmakeSession");
        });
        launcher.registerForEvent("groupjoin.fail", function(event, reservationFail) {
            S.debug("Got groupjoin.fail in gm");
            base.showReceipt("Host could not Party Join", "skull");
            gamemanager.inviteState = {};
            gamemanager.saveLocalStorageAndUpdateUI();
        });
        launcher.registerForEvent("reservation.ready", function(event, reservation) {
            gamemanager.debug("Got bf.launcher.reservation.ready");
            if (!gamemanager.isCurrentPersona(reservation.personaId)) {
                return;
            }
            if (!gamemanager.launcherState) {
                gamemanager.launcherState = {};
            }
            if (reservation.gameServer != undefined) {
                gamemanager.launcherState.server = reservation.gameServer;
            }
            gamemanager.reservation = reservation;
            if (gamemanager.checkboxes && gamemanager.checkboxes["gamemanager-launchstate-fullscreen"]) {
                gamemanager.saveLocalStorage();
                launcher.joinReservation(reservation);
            } else {
                var timeout_time = new Date();
                timeout_time.setSeconds(timeout_time.getSeconds() + reservation.expirationTimeout);
                gamemanager.launcherState.name = gamemanager.states.LAUNCH_READY_WITH_TIMER;
                gamemanager.launcherState.timeout_time = timeout_time;
                gamemanager.saveLocalStorageAndUpdateUI(reservation.game);
                $("#gamemanager-launchstate-timer-launchbutton").live("click", gamemanager.joinReservation);
                gamemanager.countdownTimer(function() {
                });
                gamemanager.show();
            }
        });
        $(".gamemanager-invitestate-player-kick").live("click", function() {
            var userId = $(this).parents(".gamemanager-invitestate-player:first").attr("rel");
            var url = $("#kickGroupJoin-urlaction").val().replace("#USERID#", userId);
            base.ajaxPostJson(url, function() {
                base.showReceipt("Player kicked from Party Join");
            });
        });
        $("body").delegate(".gamemanager-invitestate-startjoin-form input[type='button'], .gamemanager-launch-quickmatch", "click", function(e) {
            e.preventDefault();
            var game = S.globalContext["realm"]["game"];
            if (S.globalContext.componentName == "main") {
                omniture_click("", "quickMatchGameBanner_click");
            } else {
                if (S.globalContext.componentName == "serverguide") {
                    omniture_click("", "quickMatchServer_click");
                }
            }
            if (game == games.BFBC2) {
                var url = $(this).attr("url");
                base.ajaxPostJson(url, function(e, r) {
                    switch (r.message) {
                        case "SERVER_FOUND":
                            base.showReceipt("Joining a random server");
                            var serverName = Surface.Modifier.slugify(r.data.name);
                            var joinUrl = $("#serverJoinUrl").val().replace("#GUID#", r.data.guid).replace("#SLUG#", serverName);
                            joinflow.joinServerByUrl(joinUrl, null, function(foundServer) {
                                S.debug("joined server");
                            });
                            break;
                        default:
                            base.showReceipt("Could not find server to join.", "skull");
                            break;
                    }
                });
            }
            var leaderPersona = {};
            var waiting = 0;
            var groupPersonaIdList = [];
            leaderPersona.personaId = S.globalContext["session"]["currentPersona"]["personaId"];
            leaderPersona.personaName = S.globalContext["session"]["currentPersona"]["personaname"];
            for (var i in gamemanager.inviteState.players) {
                var u = gamemanager.inviteState.players[i];
                if (u.personaId != leaderPersona.personaId) {
                    groupPersonaIdList.push(u.personaId);
                }
                if (u.inviteStatus == gamemanager.states.INVITE_WAITING) {
                    waiting++;
                }
            }
            if (!groupPersonaIdList.length) {
                groupPersonaIdList = null;
            }
            $(".base-general-dropdown-area").hide();
            if (waiting > 0) {
                popup.prompt({"header": "Do you want to continue without everyone?","body": "Players who have not accepted will not be included."}, function() {
                    for (var i in gamemanager.inviteState.players) {
                        var u = gamemanager.inviteState.players[i];
                        if (u.inviteStatus == gamemanager.states.INVITE_WAITING) {
                            gamemanager.inviteState.players.splice(i, 1);
                        }
                    }
                    $(".gamemanager-invitestate-startjoin-form").find("input[type=button]:first").click();
                }, this);
                return false;
            }
            if ($("#gamemanager-groupjoin-current-guid").val() == "quickmatch" || $(e.target).hasClass("gamemanager-launch-quickmatch")) {
                if (joinflow.checkJoinGameRequirements(function(r) {
                    $(".gamemanager-launch-quickmatch:first").click();
                })) {
                    gamemanager.getMatchmakeRules(function(mpMatchMakeRules) {
                        launcher.startMpMatchmaking(leaderPersona, game, mpMatchMakeRules, groupPersonaIdList, function(matchmakingSessionId) {
                            $.jStorage.set("matchmakeSession", {"persona": leaderPersona,"game": game,"matchmakeSessionId": matchmakingSessionId});
                        });
                    });
                    gamemanager.show();
                }
                return false;
            }
            var action = $(".gamemanager-invitestate-startjoin-form").attr("action");
            base.ajaxPostJson(action, function() {
                S.debug("started OK!");
            });
            return false;
        });
        launcher.registerForEvent("queue.reservation", function(event, reservation) {
            gamemanager.debug("Got bf.launcher.queue.reservation");
            if (!gamemanager.isCurrentPersona(reservation.personaId)) {
                return;
            }
            gamemanager.reservation = reservation;
            if (gamemanager.launcherState) {
                gamemanager.launcherState.currentGame = reservation.game;
                gamemanager.launcherState.server = reservation.gameServer;
            }
            gamemanager.saveLocalStorageAndUpdateUI(reservation.game);
            gamemanager.show();
        });
        $("#gamemanager-coopstate-resend-invite-button").live("click", function(e) {
            S.debug("Send coop invite again");
            var coopId = $("#current-coopId").val();
            var url = $("#resendInviteCoopGame-urlaction").val().replace("#COOPID#", coopId);
            base.ajaxPostJson(url, function(e, r) {
                switch (r.message) {
                    case "OK":
                        base.showReceipt("Invite was resent!");
                        break;
                    default:
                        base.showReceipt("Could not resend the invite.", "skull");
                        break;
                }
            });
        });
        $("#gamemanager-taskbar-container, .comcenter-gamemanager-title").live("click", function() {
            if ($(this).parents("#gamemanager-taskbar:first").hasClass("active")) {
                gamemanager.hide();
            } else {
                gamemanager.show();
            }
            omniture_click("", "game_manager");
        });
        $("#gamemananger-pluginstate-cancel-installation").live("click", function() {
            gamemanager.pluginState = null;
            gamemanager.patcherState = null;
            gamemanager.gameState = null;
            gamemanager.updateGameStateUI();
            clearInterval(gamemanager.checkPluginInterval);
            clearInterval(gamemanager.checkPatcherInstallInterval);
            clearInterval(gamemanager.checkGameInstallInterval);
            clearInterval(gamemanager.checkGameUpToDateInterval);
            $("#comcenter").removeClass("popuptime");
            $(".comcenter-popup").hide();
        });
        $("#comcenter").delegate("#gamemananger-pluginstate-missing-form", "submit", function(e) {
            omniture_click("", "browserPluginDownload_click");
            gamemanager.debug("Downloading the missing plugin...");
            gamemanager.pluginState.name = gamemanager.states.PLUGIN_INSTALLING;
            gamemanager.saveLocalStorageAndUpdateUI();
            document.location = $(this).attr("action").split("?")[0];
            gamemanager.addPluginPollCheck();
        });
        $("#gamemanager-patcher-state-install").live("click", function(e) {
            omniture_click("", "originClientDownload_click");
            document.location.href = "http://www.origin.com/download";
            gamemanager.debug("Showing Link to patcher");
            gamemanager.patcherState.name = gamemanager.states.PATCHER_INSTALLING;
            gamemanager.updateGameStateUIFromState(gamemanager.getCurrentStateObject());
            gamemanager.checkPatcherInstallInterval = setInterval(function() {
                gamemanager.debug("Probing for installation complete... ");
                launcher.isPatcherInstalled("origin", function(isInstalled) {
                    if (isInstalled) {
                        if (!gamemanager.patcherState) {
                            gamemanager.patcherState = {};
                        }
                        gamemanager.patcherState.name = gamemanager.states.PATCHER_OK;
                        clearInterval(gamemanager.checkPatcherInstallInterval);
                        gamemanager.saveLocalStorageAndUpdateUI();
                    }
                });
            }, 2000);
            return false;
        });
        var updateOrInstallBuild = function() {
            $(this).attr("disabled", 1);
            gamemanager.gameState.name = gamemanager.states.GAME_INSTALLING;
            gamemanager.saveLocalStorageAndUpdateUI();
            launcher.showInPatcher(games.BF3, "origin", function(result) {
                gamemanager.debug("Got result from patcher: " + result);
            });
            gamemanager.checkGameInstallInterval = setInterval(function() {
                gamemanager.debug("Probing for game installation complete... ");
                launcher.checkForPatchAvailable(gamemanager.gameState.game, gameTypes.ALL, function(game, wasUpToDate) {
                    if (wasUpToDate) {
                        clearInterval(gamemanager.checkGameInstallInterval);
                        gamemanager.gameState = null;
                        gamemanager.updateGameStateUI();
                    }
                });
            }, 2000);
            return false;
        };
        $("#gamemanager-gamestate-update").live("click", updateOrInstallBuild);
        $("#gamemanager-gamestate-install").live("click", updateOrInstallBuild);
        $("#gamemanager-installstate-install").live("click", updateOrInstallBuild);
        $("#gamemanager-installstate-update").live("click", updateOrInstallBuild);
        $(".gamemanager-checkbox").live("change", function() {
            gamemanager._updateCheckboxesInLocalStorage($(this).attr("id"), $(this).attr("checked"));
        });
        $("#gamemanager-state-close").live("click", function(e) {
            gamemanager.clearLaunchState();
            gamemanager.hide();
        });
        $("#gamemanager-launch-cancel").live("click", function() {
            var data = {questionType: "GAMEMANAGER_CLOSE_GAME_QUESTION"};
            var continueCallback = function() {
                gamemanager.cancelGameLaunch(S.globalContext.realm.game);
            };
            popup.prompt(data, continueCallback);
        });
        $("#gamemanager-invite-cancel").live("click", function(e) {
            e.preventDefault();
            gamemanager.debug("Leaving Party Join...");
            base.ajaxPostJson($("#leaveGroupJoin-urlaction").val(), function() {
                gamemanager.debug("Left group!");
                gamemanager.inviteState = {};
                gamemanager.saveLocalStorageAndUpdateUI();
            });
            return false;
        });
        $("#gamemanager-launchstate-launchbutton").live("click", gamemanager.maximiseCurrentGame);
        $("#gamecontrol-game-leavequeuebutton").live("click", gamemanager.leaveQueue);
        if (gamemanager.launcherState && gamemanager.reservation) {
            $("#gamemanager-launchstate-timer-launchbutton").live("click", gamemanager.joinReservation);
        }
        gamemanager._updateFromLocalStorage();
        gamemanager.updateGameStateUI();
        if (gamemanager.pluginState && gamemanager.pluginState.name == gamemanager.states.PLUGIN_INSTALLING) {
            gamemanager.addPluginPollCheck();
        }
        if (gamemanager.gameState && gamemanager.gameState.name == gamemanager.states.GAME_INSTALLING) {
            gamemanager.startCheckForGameUpToDate();
        } else {
            if (gamemanager.gameState && gamemanager.gameState.name == gamemanager.states.GAME_CANT_PROBE) {
                gamemanager.debug("Doing an extra probe, recently installed the plugin?");
                gamemanager.gameState = null;
                gamemanager.updateGameStateUI();
            } else {
                var joinServer = Surface.cookieGet("joinflow.savedServerCookie");
                if (joinServer) {
                    S.debug("Got Server to join from login, but not doing it right now...");
                }
            }
        }
        launcher.registerForEvent("error.patcher", function(event, game, installState, sku, gameType, skuPatchInfo) {
            if (gamemanager.gameState.name == gamemanager.states.GAME_INSTALLING) {
                return gamemanager.debug("Ignoring errors from the patcher while installing game: " + game);
            }
            gamemanager.debug("error.patcher");
            gamemanager.debug("game:" + game + ", installState:" + installState + ", sku:" + sku + ", gameType:" + gameType + ", skuPatchInfo:" + skuPatchInfo + ", gamemanager.installState:" + gamemanager.installState + ", gamemanager.gameState:" + gamemanager.gameState);
            gamemanager.gameState.game = game;
            gamemanager.installState.name = installState;
            gamemanager.installState.sku = sku;
            gamemanager.installState.skuPatchInfo = skuPatchInfo;
            gamemanager.installState.gameType = gameType;
            switch (installState) {
                case launcher.INSTALL_STATE.OUT_OF_DATE:
                    gamemanager.debug("OUT_OF_DATE");
                    if (!gamemanager.gameState.name || (gamemanager.gameState.name && gamemanager.gameState.name != gamemanager.states.GAME_INSTALLING)) {
                        gamemanager.gameState.name = gamemanager.states.GAME_NOT_UPTODATE;
                        gamemanager.updateGameStateUI();
                    }
                    break;
                case launcher.INSTALL_STATE.ERR_VERSION_UNREADABLE:
                    gamemanager.debug("ERR_VERSION_UNREADBLE");
                    gamemanager.gameState.name = gamemanager.states.GAME_CANT_PROBE;
                    gamemanager.updateGameStateUI();
                    break;
                case launcher.INSTALL_STATE.ERR_NO_VERSION_FOUND:
                    gamemanager.debug("ERR_NO_VERSION_FOUND");
                    gamemanager.gameState.name = gamemanager.states.GAME_CANT_PROBE;
                    gamemanager.updateGameStateUI();
                    break;
                case launcher.INSTALL_STATE.ERR_GAME_NOT_FOUND:
                    gamemanager.debug("ERR_GAME_NOT_FOUND");
                    gamemanager.gameState.name = gamemanager.states.GAME_CANT_PROBE;
                    gamemanager.updateGameStateUI();
                    break;
            }
        });
        if (gamemanager.launcherState && gamemanager.launcherState.timeout_time) {
            gamemanager.countdownTimer(function() {
            });
        }
    },pluginState: null,patcherState: null,gameState: null,launcherState: null,inviteState: {},coopState: {},isHidden: true,checkboxes: {},installState: {},reservation: null,lastUIUpdate: null,states: {PLUGIN_MISSING: "plugin_missing",PLUGIN_INSTALLING: "plugin_installing",PLUGIN_OK: "plugin_ok",PATCHER_MISSING: "patcher_missing",PATCHER_INSTALLING: "patcher_installing",PATCHER_OK: "patcher_ok",PATCHER_CANT_PROBE: "patcher_cant_probe",GAME_CANT_PROBE: "game_cant_probe",GAME_NOT_OWNED: "game_not_owned",GAME_NOT_INSTALLED: "game_not_installed",GAME_NOT_UPTODATE: "game_not_uptodate",GAME_OK: "game_ok",GAME_INSTALLING: "game_install",LAUNCH_READY: "launch_ready",LAUNCH_READY_WITH_TIMER: "launch_ready_with_timer",LAUNCH_CLOSED_DOWN: "launch_closed_down",LAUNCH_ERROR: "launch_error",LAUNCH_INFO: "launch_info",LAUNCH_QUEUE: "launch_queue",LAUNCH_CANCELLING: "launch_cancelling",INVITE_STARTED: "invite_started",INVITE_STARTING: "invite_starting",INVITE_ACCEPTED: "invite_accepted",INVITE_DECLINED: "invite_declined",INVITE_WAITING: "invite_waiting"},resetPluginGameManager: function() {
        gamemanager.pluginState = null;
        gamemanager.patcherState = null;
        gamemanager.gameState = null;
        gamemanager.updateGameStateUI();
    },addPluginPollCheck: function() {
        gamemanager.show();
        $("#comcenter").addClass("popuptime");
        $(".comcenter-popup").show();
        $("body").bind("click.hideComCenterPopup", function(e) {
            if ($(e.target).parents(".gamemanager-plugin-help").length) {
                return true;
            }
            $("#comcenter").removeClass("popuptime");
            $(".comcenter-popup").hide();
            $("body").unbind("click.hideComCenterPopup");
        });
        gamemanager.checkPluginInterval = setInterval(function() {
            gamemanager.debug("Checking for plugin...");
            gamemanager.gameState = null;
            gamemanager.updateGameStateUI();
            if (gamemanager.pluginState && gamemanager.pluginState.name && gamemanager.pluginState.name == gamemanager.states.PLUGIN_OK) {
                gamemanager.debug("Clearing interval...");
                clearInterval(gamemanager.checkPluginInterval);
                sonarui.foundPlugin = true;
                $("#comcenter").removeClass("popuptime");
                $("#gamemanager-taskbar-bubble").hide();
                $(".comcenter-popup").hide();
            }
        }, 2000);
    },getMatchmakeRules: function(callback) {
        var serverguideFilter = {};
        if ($("#serverguide-filter-form").length) {
            serverguideFilter = $("#serverguide-filter-form").serializeObject();
            callback(gamemanager.processMatchmakeRules(serverguideFilter));
        } else {
            if (S.globalContext["session"]["currentPersona"]["personaId"].length) {
                var url = $("#getServerBrowserFilter").val();
                $.ajax({url: url,dataType: "json",type: "GET",complete: base.onComplete(function(success, response) {
                        if (response.message == "filter") {
                            var filterComponents = response.data.split("&");
                            var filterComponent = {};
                            $.each(filterComponents, function(key, value) {
                                filterComponent = value.split("=");
                                switch (filterComponent[0]) {
                                    case "gamemodes":
                                    case "maps":
                                    case "gameexpansions":
                                    case "gamepresets":
                                        serverguideFilter[filterComponent[0]] = filterComponent[1] || "";
                                }
                            });
                        }
                        callback(gamemanager.processMatchmakeRules(serverguideFilter));
                    }, false)});
            }
        }
    },processMatchmakeRules: function(serverguideFilter) {
        var matchmakeRules = {};
        var gamemodes = [];
        if ("gamemodes" in serverguideFilter && serverguideFilter["gamemodes"].length) {
            jQuery.each(serverguideFilter.gamemodes.split("|"), function(i, gameMode) {
                switch (gameMode) {
                    case "conquestlarge":
                        gamemodes.push("ConquestLarge");
                        break;
                    case "sqrush":
                        gamemodes.push("SquadRush");
                        break;
                    case "conquest":
                        gamemodes.push("ConquestSmall");
                        break;
                    case "rush":
                        gamemodes.push("RushLarge");
                        break;
                    case "sqdm":
                        gamemodes.push("SquadDeathMatch");
                        break;
                    case "teamdeathmatch":
                        gamemodes.push("TeamDeathMatch");
                        break;
                }
            });
        }
        if (!gamemodes.length) {
            gamemodes = ["ConquestSmall", "RushLarge", "TeamDeathMatch"];
        }
        matchmakeRules.gameModes = gamemodes;
        if ("maps" in serverguideFilter && serverguideFilter["maps"].length) {
            matchmakeRules.maps = serverguideFilter["maps"].split("|");
            if (matchmakeRules.maps[0] == "") {
                matchmakeRules.maps.splice(0, 1);
            }
        }
        if ("gameexpansions" in serverguideFilter && serverguideFilter["gameexpansions"].length) {
            matchmakeRules.gameExpansions = serverguideFilter["gameexpansions"].split("|");
            if (matchmakeRules.gameExpansions[0] == "") {
                matchmakeRules.gameExpansions.splice(0, 1);
            }
        } else {
            matchmakeRules.gameExpansions = ["DEFAULT"];
        }
        if ("gamepresets" in serverguideFilter && serverguideFilter["gamepresets"].length) {
            matchmakeRules.gamePresets = serverguideFilter["gamepresets"].split("|");
            if (matchmakeRules.gamePresets[0] == "") {
                matchmakeRules.gamePresets.splice(0, 1);
            }
        }
        return matchmakeRules;
    },startCheckForGameUpToDate: function() {
        gamemanager.checkGameUpToDateInterval = setInterval(function() {
            launcher.checkForPatchAvailable(S.globalContext["realm"]["game"], gameTypes.ALL, function(game, wasUpToDate) {
                gamemanager.debug("Probing for the latest game version...");
                if (wasUpToDate) {
                    clearInterval(gamemanager.checkGameUpToDateInterval);
                    gamemanager.installState = {};
                    gamemanager.gameState.name = gamemanager.states.GAME_OK;
                } else {
                }
                gamemanager.updateGameStateUI();
            });
        }, 2000);
    },updateGameStateUI: function() {
        gamemanager.getState(function(state) {
            if (state.pluginState) {
                gamemanager.pluginState = state.pluginState;
            }
            if (state.patcherState) {
                gamemanager.patcherState = state.patcherState;
            }
            if (state.gameState) {
                gamemanager.gameState = state.gameState;
            }
            if (state.launchState) {
                gamemanager.launcherState = state.launchState;
            }
            gamemanager.saveLocalStorageAndUpdateUI();
            if (S.globalContext.flushStorage && gamemanager.pluginState && gamemanager.pluginState.name == gamemanager.states.PLUGIN_MISSING) {
                $("#gamemanager-taskbar-bubble").show();
            }
        });
    },_updateCheckboxesInLocalStorage: function(name, value) {
        if (!gamemanager.checkboxes) {
            gamemanager.checkboxes = {};
        }
        gamemanager.debug("Got id: " + name + " val: " + value);
        if (!value) {
            delete gamemanager.checkboxes[name];
        } else {
            gamemanager.checkboxes[name] = value;
        }
        gamemanager.saveLocalStorage();
    },hide: function() {
        $("#gamemanager-taskbar:first").removeClass("active");
        $("#gamemanager-taskbar-state").html("");
        gamemanager.isHidden = true;
        gamemanager._checkOneTimeMessagesStatus();
        gamemanager.saveLocalStorageAndUpdateUI();
    },show: function() {
        if (comcenter.generalLoadingAjaxRequest) {
            comcenter.generalLoadingAjaxRequest.abort();
        }
        $("#gamemanager-taskbar-bubble").hide();
        comcenter.closePreviewAreas();
        gamemanager.isHidden = false;
        $(this).parents("#gamemanager-taskbar:first").addClass("active");
        gamemanager.updateGameStateUI();
        gamemanager._checkOneTimeMessagesStatus();
        gamemanager.saveLocalStorage();
    },_checkOneTimeMessagesStatus: function() {
    },setTooltip: function(text) {
        $("#comcenter-gamecontrol").attr("original-title", text);
    },clearTooltip: function() {
        gamemanager.setTooltip("");
    },updateGameStateUIFromState: function(state) {
        gamemanager.lastUIUpdate = new Date().getTime();
        $("#gamemanager-taskbar-state").html($S("gamemanager.state").render({states: gamemanager.states,state: state}));
        if (!state.isHidden && !$("#gamemanager-taskbar").hasClass("active")) {
            $("#gamemanager-taskbar").addClass("active");
        }
        var status = null;
        try {
            if (state.launcherState && state.launcherState.name == gamemanager.states.LAUNCH_READY) {
                status = "Game ready!";
            } else {
                if (state.launcherState && state.launcherState.name == gamemanager.states.LAUNCH_CANCELLING) {
                    status = "Cancelling ...";
                } else {
                    if (state.launcherState && state.launcherState.name == gamemanager.states.LAUNCH_READY_WITH_TIMER) {
                        status = "Game ready!";
                    } else {
                        if (state.launcherState && state.launcherState.name == gamemanager.states.LAUNCH_QUEUE) {
                            status = $(".gamemanager-queue-text").html();
                        } else {
                            if (state.launcherState && state.launcherState.name) {
                                status = state.launcherState.gameStatePretty;
                            } else {
                                if (state.inviteState && state.inviteState.name) {
                                    status = "Party Join";
                                } else {
                                    if (state.coopState && state.coopState.name) {
                                        status = "Coop Lobby";
                                    } else {
                                        if (state.gameState && state.gameState.name == gamemanager.states.GAME_NOT_UPTODATE || state.pluginState.name == gamemanager.states.PLUGIN_MISSING || state.patcherState.name == gamemanager.states.PATCHER_MISSING) {
                                            status = "notuptodate";
                                        } else {
                                            if (state.gameState && state.gameState.name == gamemanager.states.GAME_NOT_UPTODATE || state.pluginState.name == gamemanager.states.PLUGIN_INSTALLING) {
                                                status = "installing";
                                            } else {
                                                if (state.gameState && (state.gameState.name == gamemanager.states.GAME_NOT_INSTALLED || state.gameState.name == gamemanager.states.GAME_NOT_OWNED)) {
                                                    status = "foundnogame";
                                                } else {
                                                    if (state.gameState && state.gameState.name == gamemanager.states.GAME_OK && state.pluginState.name == gamemanager.states.PLUGIN_OK) {
                                                        status = "uptodate";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            S.error(e);
            status = "";
        }
        $S("gamemanager-taskbar-surface").update({"state": state,"status": status});
        if (state.launcherState && state.launcherState.logoShow) {
            S.debug("Adding logo changer timeout.");
            clearTimeout(gamemanager.logoShowTimeout);
            gamemanager.logoShowTimeout = setTimeout(function() {
                S.debug("Setting next logo");
                if (gamemanager.launcherState && gamemanager.launcherState.logoShow) {
                    gamemanager.launcherState.logoShow++;
                    if (gamemanager.launcherState.logoShow > 3) {
                        gamemanager.launcherState.logoShow = null;
                    }
                    gamemanager.saveLocalStorageAndUpdateUI();
                }
            }, 2500);
        }
    },_updateFromLocalStorage: function() {
        gamemanager.debug("Updating game manager from local storage");
        var section = "-section-" + S.globalContext.realm.section;
        var ls = $.jStorage.get("gamemanager" + section, {});
        var sitewide = $.jStorage.get("gamemanager-sitewide", {});
        if (sitewide.launcherState) {
            ls.launcherState = sitewide.launcherState;
        }
        if (sitewide.inviteState) {
            ls.inviteState = sitewide.inviteState;
        }
        if (sitewide.coopState) {
            ls.coopState = sitewide.coopState;
        }
        if (sitewide.checkboxes) {
            ls.checkboxes = sitewide.checkboxes;
        }
        if (sitewide.isHidden != undefined) {
            gamemanager.isHidden = sitewide.isHidden;
        }
        gamemanager.debug(ls);
        if (ls.launcherState) {
            gamemanager.launcherState = ls.launcherState;
        }
        if (ls.pluginState) {
            gamemanager.pluginState = ls.pluginState;
        }
        if (ls.patcherState) {
            gamemanager.patcherState = ls.patcherState;
        }
        if (ls.gameState) {
            gamemanager.gameState = ls.gameState;
        }
        if (ls.checkboxes) {
            gamemanager.checkboxes = ls.checkboxes;
        }
        if (ls.inviteState) {
            gamemanager.inviteState = ls.inviteState;
        }
        if (ls.coopState) {
            gamemanager.coopState = ls.coopState;
        }
        if (ls.installState) {
            gamemanager.installState = ls.installState;
        }
        if (ls.reservation) {
            gamemanager.reservation = ls.reservation;
        }
    },getCurrentStateObject: function() {
        var state = {};
        state.gameState = gamemanager.gameState;
        state.pluginState = gamemanager.pluginState;
        state.patcherState = gamemanager.patcherState;
        state.launcherState = gamemanager.launcherState;
        state.checkboxes = gamemanager.checkboxes;
        state.isHidden = gamemanager.isHidden;
        state.inviteState = gamemanager.inviteState;
        state.coopState = gamemanager.coopState;
        state.installState = gamemanager.installState;
        state.reservation = gamemanager.reservation;
        return state;
    },saveLocalStorage: function(game) {
        var section = game || S.globalContext.realm.section;
        section = "-section-" + section;
        gamemanager.debug("Save current state in ls... " + section);
        var s = gamemanager.getCurrentStateObject();
        gamemanager.debug(s);
        var sitewide = {coopState: s.coopState,inviteState: s.inviteState,checkboxes: s.checkboxes,isHidden: s.isHidden,launcherState: s.launcherState,installState: s.installState};
        delete s.coopState;
        delete s.inviteState;
        delete s.launcherState;
        delete s.isHidden;
        delete s.checkBoxes;
        if (!$.jStorage.set("gamemanager" + section, s)) {
            S.error("Could not set gamemanager in local storage...");
        }
        if (!$.jStorage.set("gamemanager-sitewide", sitewide)) {
            S.error("Could not set gamemanager sitewide in local storage...");
        }
    },createGroupJoinToServer: function(server) {
        var server = server || {};
        var url = $("#createGroupJoin-urlaction").val().replace("#GUID#", server.guid);
        base.ajaxPostJson(url, function(success, response) {
            if (success) {
                gamemanager.show();
            }
        });
    },clearLaunchState: function() {
        gamemanager.debug("Clearing launch state...");
        gamemanager.launcherState = {};
        gamemanager.saveLocalStorage();
    },saveLocalStorageAndUpdateUI: function(game) {
        gamemanager.saveLocalStorage(game);
        gamemanager.updateGameStateUIFromState(gamemanager.getCurrentStateObject());
    },getState: function(callback) {
        var launchState = gamemanager.launcherState;
        if (launchState && launchState.name != undefined) {
            callback({launchState: launchState});
        } else {
            gamemanager.getPluginState(function(pluginState) {
                gamemanager.getOriginState(function(patcherState) {
                    gamemanager.getGameState(function(gameState) {
                        callback({gameState: gameState,launchState: null,pluginState: pluginState,patcherState: patcherState});
                    });
                });
            });
        }
    },getPluginState: function(callback) {
        gamemanager.debug("Getting plugin state...");
        if (!gamemanager.pluginState) {
            gamemanager.pluginState = {};
        }
        if (gamemanager.verifyPlugin()) {
            gamemanager.pluginState.name = gamemanager.states.PLUGIN_OK;
        } else {
            if (!gamemanager.pluginState.name || gamemanager.pluginState.name != gamemanager.states.PLUGIN_INSTALLING) {
                gamemanager.pluginState.name = gamemanager.states.PLUGIN_MISSING;
            }
        }
        callback(gamemanager.pluginState);
    },getOriginState: function(callback) {
        var gm = gamemanager;
        gamemanager.debug("Getting origin state...");
        if (!gm.patcherState) {
            gm.patcherState = {};
        }
        if (gamemanager.pluginState.name != gamemanager.states.PLUGIN_OK) {
            gm.patcherState.name = gm.states.PATCHER_CANT_PROBE;
            return callback(gm.patcherState);
        } else {
            launcher.isPatcherInstalled("origin", function(isInstalled) {
                if (isInstalled) {
                    gm.patcherState.name = gm.states.PATCHER_OK;
                } else {
                    if (!gm.patcherState.name || gm.patcherState.name != gm.states.PATCHER_INSTALLING) {
                        gm.patcherState.name = gm.states.PATCHER_MISSING;
                    }
                }
                return callback(gm.patcherState);
            });
        }
    },getGameState: function(callback) {
        var gm = gamemanager;
        var game = S.globalContext.realm.section;
        if (game == S.globalContext.staticContext.sections.ALL) {
            gm.gameState = {name: null};
            callback(gm.gameState);
            return;
        }
        if (gm.gameState == null) {
            gamemanager.debug("Getting game state... game, ", game);
            if (gm.pluginState.name == gm.states.PLUGIN_MISSING) {
                gamemanager.debug("Returning n/a in game since we found no plugin");
                gm.gameState = {name: gm.states.GAME_CANT_PROBE,game: game};
                callback(gm.gameState);
                return;
            }
            if (base.ownsGame(game, S.globalContext.staticContext.platforms.PC)) {
                launcher.isGameInstalled(game, function(gameInstalled) {
                    if (!gm.gameState) {
                        gm.gameState = {};
                    }
                    if (gameInstalled) {
                        launcher.checkForPatchAvailable(game, gameTypes.ALL, function(game, wasUpToDate) {
                            if (wasUpToDate) {
                                gm.gameState = {name: gm.states.GAME_OK,game: game};
                                callback(gm.gameState);
                            }
                        });
                    } else {
                        gm.gameState = {name: gm.states.GAME_NOT_INSTALLED,game: game};
                        callback(gm.gameState);
                    }
                });
            } else {
                gm.gameState = {name: gm.states.GAME_NOT_OWNED,game: game};
                callback(gm.gameState);
            }
        } else {
            callback(gm.gameState);
        }
    },verifyPlugin: function() {
        var plugin = launcher.getInstance();
        if (!plugin) {
            gamemanager.debug("No launcher");
            return false;
        }
        var sonarOk = true;
        try {
            new SonarVoice("SONAR2|Sk0t0r", {expectedVersion: "" + S.globalContext.staticContext.voice.version});
        } catch (err) {
            if (err.name == "SonarPluginError" || err.name == "SonarOutdatedVersion") {
                gamemanager.debug("No sonar: " + err.name);
                sonarOk = false;
            }
        }
        if (!sonarOk) {
            return false;
        }
        if (!launcher.checkVersion()) {
            gamemanager.debug("Found Launcher but not the correct version");
            return false;
        }
        return true;
    },addToServerHistory: function(game, guid) {
        try {
            $S("gamemanager-add-history").update({"game": game,"guid": guid});
        } catch (e) {
            S.error(e);
            return S.log("Ignoring..");
        }
        var form = $("#gamemanager-add-history form");
        $.ajax({url: form.attr("action"),dataType: "json",type: "POST",data: form.serialize(),error: function(XMLHttpRequest, textStatus, errorThrown) {
                S.error("Game server not added to history: " + XMLHttpRequest.statusText);
            },complete: null});
    },inviteToCurrentServer: function(userId) {
        try {
            var guid = gamemanager.launcherState.server.guid;
        } catch (e) {
            base.showReceipt("Could not find server", "skull");
            return false;
        }
        var url = "/comcenter/inviteToServer/" + userId + "/" + guid;
        base.ajaxPostJson(url, function(success, response) {
            if (success) {
                S.debug(response);
            }
        });
    },launchAndJoin: function(server, friendPersonaId) {
        if (launcher.killGameTimeout) {
            S.debug("CLEARED KILLGAME TIMEOUT");
            clearTimeout(launcher.killGameTimeout);
        }
        var launchState = {"friendPersonaId": friendPersonaId,server: server,currentGame: server.game,currentLevel: server.map,gameState: launcher.STATE.LOADING,gameStatePretty: "...",name: gamemanager.states.LAUNCH_INFO,friendId: friendPersonaId,currentPersona: null,password: null,expansion: null};
        launchState.logoShow = 1;
        var currentPersona = S.globalContext["session"]["currentPersona"];
        if (!currentPersona) {
            UserMessageBox.showTop("You need to set an active soldier in your profile before joining.", UserMessageBox.MSG_INFORMATION);
            return false;
        }
        launchState.currentPersona = currentPersona;
        if (server.gameExpansion != null) {
            launchState.expansion = base.gameExpansionToString(server.gameExpansion);
        }
        if (S.globalContext["session"]["serverPassword"] != null) {
            launchState.password = S.globalContext["session"]["serverPassword"];
            S.globalContext["session"]["serverPassword"] = null;
        }
        gamemanager.addToServerHistory(server.game, server.guid);
        var joinOptions = {};
        if (launchState.password != null && launchState.password != undefined && launchState.password.length > 0) {
            joinOptions.password = launchState.password;
        }
        if (launchState.expansion != null && launchState.expansion != undefined && launchState.expansion.length > 0) {
            joinOptions.expansion = launchState.expansion;
        }
        if (server.game == games.BFBC2) {
            if (launchState.currentPersona.clanTag == null || launchState.currentPersona.clanTag == undefined || launchState.currentPersona.clanTag.length == 0) {
                launchState.currentPersona.clanTag = " ";
            } else {
                launchState.currentPersona.clanTag = $.trim(launchState.currentPersona.clanTag);
            }
            joinOptions.clanTag = launchState.currentPersona.clanTag;
        }
        joinOptions.putInSquad = true;
        var joinServer = function() {
            if (parseInt(friendPersonaId) > 0) {
                launcher.joinMpFriend(launchState.currentPersona, launchState.server.game, launchState.friendPersonaId, joinOptions, function(reservation) {
                    gamemanager.reservation = reservation;
                });
            } else {
                var groupPersonaIdList = server.groupPersonaIdList || null;
                launcher.joinMpServer(launchState.currentPersona, launchState.server.game, launchState.server.gameId, joinOptions, groupPersonaIdList, function(reservation) {
                    gamemanager.reservation = reservation;
                });
            }
        };
        if (gamemanager.reservation) {
            launcher.cancelReservation(gamemanager.reservation, function(wasCanceled) {
                joinServer();
            });
        } else {
            joinServer();
        }
        gamemanager.isHidden = false;
        gamemanager.launcherState = launchState;
        gamemanager.saveLocalStorageAndUpdateUI();
    },leaveQueue: function() {
        gamemanager.debug("LEAVE QUEUE");
        if (gamemanager.reservation) {
            launcher.leaveQueue({"personaId": gamemanager.reservation.personaId}, gamemanager.reservation.game, gamemanager.reservation.gameId);
            gamemanager.clearLaunchState();
        }
        return false;
    },bindLaunchUpdates: function() {
        launcher.registerForEvent("gameStatus", function(event, game, currentState, personaId) {
            gamemanager.debug("GOT GAMESTATUS - game: " + game + " , " + currentState + ": " + currentState);
            if (!gamemanager.isCurrentPersona(personaId)) {
                gamemanager.debug("Not current persona, ignoring: " + personaId);
                return;
            }
            if (currentState.indexOf("State_") != -1 && gamemanager.launcherState && (gamemanager.launcherState.name == gamemanager.states.LAUNCH_CLOSED_DOWN || gamemanager.launcherState.name == gamemanager.states.LAUNCH_CANCELLING || gamemanager.launcherState.name == gamemanager.states.LAUNCH_READY)) {
                gamemanager.debug("Not updating, since we are in state " + gamemanager.launcherState.name + " and State_* ...");
                return false;
            }
            if (currentState == launcher.STATE.READY || currentState == launcher.STATE.GAMEISGONE) {
                gamemanager.debug("Not updating. state:" + currentState);
                return false;
            }
            if (gamemanager.launcherState && gamemanager.launcherState.gameState && gamemanager.launcherState.gameState.indexOf("State_") !== -1 && currentState != launcher.STATE.GAMEISGONE && currentState.indexOf("State_") == -1) {
                gamemanager.debug("Not updating, since in State_* and got state: " + currentState);
                return false;
            }
            var currentLaunchState = gamemanager.states.LAUNCH_INFO;
            switch (currentState) {
                case launcher.STATE.ERROR:
                    currentLaunchState = gamemanager.states.LAUNCH_ERROR;
                    break;
            }
            if (!gamemanager.launcherState) {
                gamemanager.launcherState = {};
            }
            gamemanager.launcherState.name = currentLaunchState;
            gamemanager.launcherState.gameState = currentState;
            gamemanager.launcherState.gameStatePretty = gamemanager.gameStatePretty(currentState);
            gamemanager.saveLocalStorageAndUpdateUI(game);
            switch (currentState) {
                case launcher.STATE.GAMEISGONE:
                case launcher.STATE.ERROR:
                    gamemanager.clearLaunchState();
                    break;
            }
        });
        launcher.registerForEvent("gameReadyToPlay", function(event, game, personaId) {
            gamemanager.debug("GOT GAMESTATUS - bf.launcher.gameReadyToPlay");
            if (!gamemanager.isCurrentPersona(personaId)) {
                return;
            }
            if (gamemanager.launcherState) {
                if (gamemanager.reservation) {
                    gamemanager.reservation = null;
                    gamemanager.saveLocalStorage();
                }
                if (gamemanager.checkboxes && gamemanager.checkboxes["gamemanager-launchstate-fullscreen"]) {
                    gamemanager.maximiseCurrentGame();
                } else {
                    gamemanager.isHidden = false;
                    gamemanager.launcherState.name = gamemanager.states.LAUNCH_READY;
                    gamemanager.saveLocalStorageAndUpdateUI(game);
                    $.titleAlert("Game ready!", {requireBlur: true,stopOnFocus: true,duration: 10000,interval: 2000});
                }
            }
            return false;
        });
        launcher.registerForEvent("gameIsGone", function() {
            S.debug(gamemanager.launcherState);
            if ((gamemanager.launcherState == null && gamemanager.launcherState == undefined) || gamemanager.launcherState.name != gamemanager.states.LAUNCH_ERROR) {
                gamemanager.launcherState = {};
                gamemanager.hide();
            }
        });
        launcher.registerForEvent("serverQueuePosition", function(event, game, personaId, positionInQueue) {
            gamemanager.debug("Got bf.launcher.serverQueuePosition");
            if (!gamemanager.isCurrentPersona(personaId)) {
                return;
            }
            var beforeYou = (positionInQueue - 1);
            if (!gamemanager.launcherState) {
                gamemanager.launcherState = {};
            }
            gamemanager.launcherState.name = gamemanager.states.LAUNCH_QUEUE;
            gamemanager.launcherState.queue = {beforeYou: beforeYou};
            gamemanager.saveLocalStorageAndUpdateUI();
        });
        launcher.registerForEvent("leftServerQueue", function(event, game, personaId) {
            if (!gamemanager.isCurrentPersona(personaId)) {
                return;
            }
            gamemanager.debug("Got bf.launcher.leftServerQueue");
            gamemanager.debug("Got leftServerQueue...");
        });
        launcher.registerForEvent("error.anotherGameRunning", function(event, game, gameRunning) {
            gamemanager.showLoaderError("You are already running another Battlefield game, please exit this game first");
        });
        launcher.registerForEvent("error.gameNeedsManualKill", function(event, game) {
            gamemanager.showLoaderError("Game running in the background needs to be closed");
        });
        launcher.registerForEvent("error.patcherRunning", function(event) {
            gamemanager.showLoaderError("Not possible to start game while patcher is running");
        });
        launcher.registerForEvent("error.gameCrashed", function(event, game) {
            gamemanager.showLoaderError("Could not complete server join since game closed unexpectedly, please try again");
        });
        launcher.registerForEvent("error.generic", function(event, game, personaId, errorType, errorCode) {
            gamemanager.handleErrors(game, personaId, errorType, errorCode);
        });
        launcher.registerForEvent("warning.generic", function(event, game, personaId, warningType, warningCode) {
            gamemanager.handleWarnings(game, personaId, warningType, warningCode);
        });
        launcher.registerForEvent("error.pluginRequired", function(event) {
            gamemanager.showLoaderError("You need to install a plugin to be able to launch games from the web");
        });
        launcher.registerForEvent("error.gameUpdateRequired", function(event, game) {
            gamemanager.showLoaderError("You need to update your game client");
        });
        launcher.registerForEvent("error.gameNotLaunched", function(event, game) {
            gamemanager.showLoaderError("Could not launch game. Please make sure it's installed correctly.");
        });
        launcher.registerForEvent("error.gameNotResponding", function(event, game) {
            gamemanager.showLoaderError("Could not communicate with running game. Please make sure it was not launched outside of the web.");
        });
    },gameStatePretty: function(gameState) {
        var statePrettyName = gameState;
        switch (gameState) {
            case launcher.STATE.NA:
            case launcher.STATE.NONE:
                statePrettyName = "Idle";
                break;
            case launcher.STATE.READY:
                statePrettyName = "Initialized";
                break;
            case launcher.STATE.INIT:
            case launcher.STATE.PENDING:
                statePrettyName = "Initializing...";
                break;
            case launcher.STATE.GAMEISGONE:
                statePrettyName = "Closed Down";
                break;
            case launcher.STATE.STARTING:
                statePrettyName = "Starting...";
                break;
            case launcher.STATE.ERROR:
                statePrettyName = "Error";
                break;
            case launcher.STATE.MENU_READY:
                statePrettyName = "Idling";
                break;
            case launcher.STATE.MATCHMAKE_COOP:
            case launcher.STATE.MATCHMAKING:
                statePrettyName = "Matchmaking...";
                break;
            case launcher.STATE.CONNECT_TO_USERID:
                statePrettyName = "Joining Friend...";
                break;
            case launcher.STATE.CONNECT_TO_GAMEID:
                statePrettyName = "Joining Server...";
                break;
            case launcher.STATE.CONNECTING:
                statePrettyName = "Connecting...";
                break;
            case launcher.STATE.WAIT_FOR_LEVEL:
            case launcher.STATE.GAME_LOADING:
                statePrettyName = "Loading Level...";
                break;
            case launcher.STATE.GAME:
                statePrettyName = "Playing!";
                break;
            case launcher.STATE.NOT_LOGGED_IN:
                statePrettyName = "Logging in...";
                break;
            case launcher.STATE.GAME_LEAVING:
                statePrettyName = "Leaving Level...";
                break;
            case launcher.STATE.IN_QUEUE:
                statePrettyName = "Server Queue";
                break;
            case launcher.STATE.CREATE_COOP_PEER:
                statePrettyName = "Setting up host...";
                break;
            case launcher.STATE.WAIT_FOR_PEER_CLIENT:
                statePrettyName = "Waiting for other player...";
                break;
            case launcher.STATE.PEER_CLIENT_CONNECTED:
                statePrettyName = "Other player has joined";
                break;
            case launcher.STATE.MATCHMAKE_RESULT_HOST:
                statePrettyName = "Co-Op game found. You are hosting.";
                break;
            case launcher.STATE.MATCHMAKE_RESULT_JOIN:
                statePrettyName = "Co-Op game found. Joining the host.";
                break;
            case launcher.STATE.RESERVING_SLOT:
                statePrettyName = "Reserving a slot...";
                break;
            case launcher.STATE.CLAIM_RESERVATION:
                statePrettyName = "Claiming reservation...";
                break;
        }
        return statePrettyName;
    },maximiseCurrentGame: function() {
        gamemanager.debug("Showing game window...");
        gamemanager.launcherState.name = gamemanager.states.LAUNCH_INFO;
        gamemanager.launcherState.gameState = launcher.STATE.GAME;
        gamemanager.launcherState.gameStatePretty = "Playing!";
        gamemanager.saveLocalStorageAndUpdateUI();
        try {
            var game = gamemanager.launcherState.currentGame;
            launcher.restoreWindow(game);
        } catch (e) {
            S.error(e);
        }
    },cancelGameLaunch: function(game) {
        if (gamemanager.launcherState && gamemanager.launcherState.name && gamemanager.launcherState.name == gamemanager.states.LAUNCH_CANCELLING) {
            gamemanager.debug("Pressed second time on cancel!");
            return;
        }
        if (!gamemanager.launcherState) {
            return false;
        }
        gamemanager.inviteState = {};
        gamemanager.coopState = {};
        gamemanager.isHidden = true;
        gamemanager.launcherState = {};
        $("#gamemanager-taskbar:first").removeClass("active");
        gamemanager.launcherState.logoShow = null;
        gamemanager.launcherState.name = gamemanager.states.LAUNCH_CANCELLING;
        gamemanager.updateGameStateUIFromState(gamemanager.getCurrentStateObject());
        var matchmakeSession = $.jStorage.get("matchmakeSession", null);
        if (matchmakeSession != null) {
            launcher.cancelMpMatchmaking(matchmakeSession.persona, matchmakeSession.game, matchmakeSession.matchmakeSessionId, function(canceled) {
                $.jStorage.deleteKey("matchmakeSession");
                if (canceled) {
                    gamemanager.clearLaunchState();
                    gamemanager.updateGameStateUI();
                }
            });
        } else {
            var killGame = function() {
                if (gamemanager.launcherState.gameState == "State_Matchmaking") {
                    S.debug("Matchmaking.. no kill of game..");
                    gamemanager.clearLaunchState();
                    gamemanager.updateGameStateUI();
                    return;
                }
                launcher._killGame(game, 0, function(gameKilled) {
                    gamemanager.debug("Killing game: " + gameKilled);
                    if (gameKilled) {
                    }
                });
            };
            if (gamemanager.reservation) {
                launcher.cancelReservation(gamemanager.reservation, function(wasCanceled) {
                    gamemanager.reservation = null;
                    gamemanager.saveLocalStorage();
                    killGame();
                });
            } else {
                killGame();
            }
        }
    },isCurrentPersona: function(personaId) {
        if (personaId == undefined || personaId == "0" || personaId == "") {
            return true;
        }
        var currentPersona = S.globalContext["session"]["currentPersona"];
        if (!currentPersona) {
            gamemanager.debug("Could not find a currentPersona in session");
            return false;
        }
        return (parseInt(currentPersona.personaId) == parseInt(personaId));
    },handleErrors: function(game, personaId, errorType, errorCode) {
        if (!gamemanager.isCurrentPersona(personaId)) {
            return;
        }
        switch (errorType) {
            case launcher.ALERT.ERR_LOGIN_INVALIDTOKEN:
            case launcher.ALERT.ERR_LOGIN_EXPIREDTOKEN:
            case launcher.ALERT.ERR_LOGIN_ACCOUNT:
                gamemanager.showLoaderError("Your game session has expired, please log out and then log in again");
                break;
            case launcher.ALERT.ERR_LAUNCH_DISABLED:
                gamemanager.showLoaderError("Launching is currently disabled. Please try again later.");
                break;
            case launcher.ALERT.ERR_EMPTY_JOINSTATE:
                gamemanager.showLoaderError("Error when reserving slot in EA backend. Please try again.");
                break;
            case launcher.ALERT.ERR_FAILED_PERSONACALL:
                gamemanager.showLoaderError("Temporary problem fetching your soldier. Please try again.");
                break;
            case launcher.ALERT.ERR_BACKEND_HTTP:
                gamemanager.showLoaderError("Failed contact with EA-backend. Please try again later.");
                break;
            case launcher.ALERT.ERR_BACKEND_ROUTE:
                gamemanager.showLoaderError("No contact with EA backend. Please try again later.");
                break;
            case launcher.ALERT.ERR_LOGIN_PERSONA:
                gamemanager.showLoaderError("Please select a valid PC soldier");
                break;
            case launcher.ALERT.ERR_DISCONNECT_GAME_SERVERFULL:
            case launcher.ALERT.ERR_SERVERCONNECT_FULL:
                gamemanager.showLoaderError("Could not join server since it's full");
                break;
            case launcher.ALERT.ERR_SERVERCONNECT:
                gamemanager.showLoaderError("Server disconnected unexpectedly. Do you have the latest version of the game?");
                break;
            case launcher.ALERT.ERR_SERVERCONNECT_WRONGPASSWORD:
                var myss = {name: "apa",game: 1};
                joinflow.showPasswordPromptPopup(myss);
                gamemanager.showLoaderError("You've tried to connect to a password protected server and have entered the wrong password");
                break;
            case launcher.ALERT.ERR_DISCONNECT_GAME_KICKED:
            case launcher.ALERT.ERR_SERVER_KICKED:
                gamemanager.showLoaderError("You were kicked from the server by an administrator.");
                break;
            case launcher.ALERT.ERR_DISCONNECT_GAME_BANNED:
            case launcher.ALERT.ERR_SERVERCONNECT_BANNED:
                gamemanager.showLoaderError("You are banned from this server and may not enter.");
                break;
            case launcher.ALERT.ERR_SERVERCONNECT_INVALIDGAME:
            case launcher.ALERT.ERR_PARAM_INVALIDGAMEID:
                if (errorCode == launcher.ALERT.ERR_PLAYER_ACTION.LEAVING) {
                    gamemanager.showLoaderError("Couldn't remove you from the queue since you've already left.");
                } else {
                    gamemanager.showLoaderError("Could not join server since it couldn't be found.");
                }
                break;
            case launcher.ALERT.ERR_PARAM_INVALIDUSERID:
                if (errorCode == launcher.ALERT.ERR_PLAYER_ACTION.LEAVING) {
                    gamemanager.showLoaderError("Couldn't remove you from the queue since you've already left.");
                } else {
                    gamemanager.showLoaderError("Sorry, can't find friend to join them.");
                }
                break;
            case launcher.ALERT.ERR_PARAM_INVALIDMISSION:
                gamemanager.showLoaderError("Level not found.");
                break;
            case launcher.ALERT.ERR_SHOW_TOS:
                launcher.restoreWindow(game);
                break;
            case launcher.ALERT.ERR_CAMPAIGN_NOSAVE:
                gamemanager.showLoaderError("Can't resume Campaign, no savefile found.");
                break;
            case launcher.ALERT.ERR_CAMPAIGN_LOADSAVE:
                gamemanager.showLoaderError("Can't resume Campaign, savefile couldn't be loaded.");
                break;
            case launcher.ALERT.ERR_ALREADY_IN_QUEUE:
                gamemanager.showLoaderError("You are already in a queue to this server.");
                break;
            case launcher.ALERT.ERR_CONFIG_MISSMATCH:
                gamemanager.showLoaderError("Configuration missmatch on the web server, come back later. (" + errorCode + ")");
                break;
            case launcher.ALERT.ERR_RESERVATION_ALREADY_EXIST:
                gamemanager.showLoaderError("You have already reserved a slot on this server.");
                break;
            case launcher.ALERT.ERR_ALREADY_GAME_MEMBER:
                gamemanager.showLoaderError("You have already joined this server.");
                break;
            case launcher.ALERT.ERR_GENERIC:
                gamemanager.showLoaderError("A generic game error was reported, please try again. ( code: " + errorCode + " )");
                break;
            case launcher.ALERT.ERR_MATCHMAKE.SESSION_TIMED_OUT:
                gamemanager.showLoaderError("Found no game matching your filter settings. Please try again or change your filter.");
                break;
            case launcher.ALERT.ERR_GROUP_JOIN.FAILED_TO_RESERVE_SLOTS:
                gamemanager.showLoaderError("Host in Party Join failed to reserve slots, Party Join cancelled.");
                break;
            case launcher.ALERT.ERR_GROUP_JOIN.GAME_SERVER_NOT_FOUND:
                gamemanager.showLoaderError("Host tried to join a server that currently is unavailable. Party Join cancelled.");
                break;
            case launcher.ALERT.ERR_MATCHMAKE.START_MATCHMAKING_FAILED:
                gamemanager.showLoaderError("Could not start matchmaking, please try again.");
                break;
            case launcher.ALERT.ERR_MATCHMAKE.REQUIRED_FILTER_MISSING:
                gamemanager.showLoaderError("Missing required filters (Mode or Game), for Quick Match to find any games.");
                break;
            case launcher.ALERT.ERR_DISCONNECT_GAME_WRONGPROTOCOLVERSION:
                gamemanager.showLoaderError("Your game is out of date and can't join this server. Please update it.");
                break;
            case launcher.ALERT.ERR_DISCONNECT_GAME_NOREPLY:
                gamemanager.showLoaderError("Could not get a connection to the server.");
                break;
            case launcher.ALERT.ERR_DISCONNECT_GAME_TIMEDOUT:
                gamemanager.showLoaderError("Your connection to the server has timed out.");
                break;
            case launcher.ALERT.ERR_DISCONNECT_GAME:
                gamemanager.showLoaderError("You were disconnected from the server.");
                break;
            case launcher.ALERT.ERR_DISCONNECT_BLAZE:
                gamemanager.showLoaderError("You were disconnected from the login server.");
                break;
            case launcher.ALERT.ERR_DISCONNECT_GAME_BADCONTENT:
                gamemanager.showLoaderError("You are missing levels or expansion packs needed to join this server.");
                break;
            case launcher.ALERT.ERR_LOGIN_PERSONANOTFOUND:
                gamemanager.showLoaderError("Your soldier was not found, please choose another.");
                break;
            case launcher.ALERT.ERR_PARAM_MISSINGPERSONA:
                gamemanager.showLoaderError("Login information didn't reach the game, please check that Origin, your game and web plugin are up to date.");
                break;
            case launcher.ALERT.ERR_INVALID_GAME_STATE_ACTION:
                gamemanager.showLoaderError("Can't join, this server is changing map, please try again soon.");
                break;
            case launcher.ALERT.ERR_PING_PINGSITES:
                gamemanager.showLoaderError("Failed to ping closest servers, please try again. If this happens frequently, check your firewall settings.");
                break;
            case launcher.ALERT.ERR_NO_PINGSITE_LIST:
                gamemanager.showLoaderError("Failed to initialize matchmaking, please try again.");
                break;
            default:
                gamemanager.showLoaderError("Something strange happened, please report this issue: " + errorType);
                break;
        }
    },showLoaderError: function(errorMessage) {
        gamemanager.clearLaunchState();
        if (!gamemanager.launcherState) {
            gamemanager.launcherState = {};
        }
        gamemanager.debug("Showing error: " + errorMessage);
        gamemanager.launcherState.logoShow = null;
        gamemanager.launcherState.name = gamemanager.states.LAUNCH_ERROR;
        gamemanager.launcherState.gameStatePretty = "Not playing";
        gamemanager.launcherState.errorMessage = errorMessage;
        gamemanager.isHidden = false;
        gamemanager.saveLocalStorageAndUpdateUI();
    },handleWarnings: function(game, personaId, warningType, warningCode) {
        if (!gamemanager.isCurrentPersona(personaId)) {
            return;
        }
        switch (warningType) {
            case launcher.JOIN_STATE.GROUP_PARTIALLY_JOINED:
                gamemanager.showLoaderWarning("Some of the group members could not connect join the server. They're in the queue or got disconnected.");
                break;
            case launcher.ALERT.ERR_GENERIC:
                gamemanager.showLoaderError("Something went wrong when leaving queue. ( code: " + warningCode + " )");
                break;
        }
    },showLoaderWarning: function(message) {
        $S("game_manager_notifications").insert({"id": 0,"message": message});
    },launchCampaign: function(game) {
        var currentPersona = S.globalContext["session"]["currentPersona"];
        if (!currentPersona) {
            UserMessageBox.showTop("You need to set an active soldier in your profile before joining.", UserMessageBox.MSG_INFORMATION);
            return false;
        }
        gamemanager.launcherState = {currentGame: game,currentLevel: "SP_Menu",gameState: launcher.STATE.LOADING,gameStatePretty: "...",name: gamemanager.states.LAUNCH_INFO};
        gamemanager.show();
        launcher.launchCampaignMenu(currentPersona, game);
    },loadMission: function(game, level, difficulty) {
        var currentPersona = S.globalContext["session"]["currentPersona"];
        if (!currentPersona) {
            UserMessageBox.showTop("You need to set an active soldier in your profile before joining.", UserMessageBox.MSG_INFORMATION);
            return false;
        }
        gamemanager.launcherState = {currentGame: game,currentLevel: level,gameState: launcher.STATE.LOADING,gameStatePretty: "...",name: gamemanager.states.LAUNCH_INFO};
        gamemanager.show();
        launcher.loadMission(currentPersona, game, level, difficulty);
    },resumeMission: function(game, level) {
        var currentPersona = S.globalContext["session"]["currentPersona"];
        if (!currentPersona) {
            UserMessageBox.showTop("You need to set an active soldier in your profile before joining.", UserMessageBox.MSG_INFORMATION);
            return false;
        }
        gamemanager.launcherState = {currentGame: game,currentLevel: level,gameState: launcher.STATE.LOADING,gameStatePretty: "...",name: gamemanager.states.LAUNCH_INFO};
        gamemanager.show();
        launcher.resumeCampaign(currentPersona, game);
    },countdownTimer: function(callback) {
        if (!gamemanager.launcherState) {
            return;
        }
        var current_date = new Date();
        var timeout_time = new Date(gamemanager.launcherState.timeout_time);
        var time_left = Math.round((timeout_time - current_date) / 1000);
        if (time_left && (time_left > 0) && (time_left != "NaN")) {
            $(".gamemanager-currentstate .timer_time").html(Surface.Modifier.sectotime(time_left));
            var t = setTimeout(function() {
                gamemanager.countdownTimer(callback);
            }, 1000);
        } else {
            $(".gamemanager-currentstate .gamemanager-queue-text").html("Reservation timed out.");
            $("#gamemanager-launchstate-timer-launchbutton").remove();
            $(".gamemanager-state-close-hidden").show();
        }
    },joinReservation: function() {
        if (gamemanager.reservation) {
            gamemanager.inviteState = {};
            gamemanager.saveLocalStorageAndUpdateUI();
            if (!gamemanager.launcherState) {
                gamemanager.launcherState = {};
            }
            S.debug("Got join reservation, checking game requirements");
            if (gamemanager.reservation && gamemanager.reservation.gameServer) {
                var server = gamemanager.reservation.gameServer;
                S.debug("Found server!");
                S.debug(server);
                if (joinflow.checkJoinGameRequirements(function(r) {
                    gamemanager.joinReservation();
                })) {
                    S.debug("Game requirements met!");
                    if (server.hasPassword && (S.globalContext["session"]["serverPassword"] == null || typeof (S.globalContext["session"]["serverPassword"]) == "undefined")) {
                        joinflow.showPasswordPromptPopup(server, function() {
                            gamemanager.joinReservation();
                        });
                        return;
                    }
                    S.debug("Joining reservation...");
                    gamemanager.launcherState.logoShow = 1;
                    launcher.joinReservation(gamemanager.reservation);
                }
            } else {
                S.debug("Joining reservation without Server!");
                gamemanager.launcherState.logoShow = 1;
                launcher.joinReservation(gamemanager.reservation);
            }
        }
    },coopPublicStart: function(coopGame) {
        S.debug("got coopPublicStart!");
        gamemanager.updateCoopLobby(coopGame);
        var coopMatchmakeRules = {"mission": coopGame.level,"difficulty": coopGame.difficulty};
        launcher.startPublicCoOpMatchmaking(S.globalContext.session.currentPersona, coopGame.game, coopMatchmakeRules);
    }};