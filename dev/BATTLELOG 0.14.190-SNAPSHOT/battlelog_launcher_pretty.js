var launcher = {onPageShow: function() {
    },killGameTimeout: null,init: function(template) {
        Push.bind("MatchmakeSuccessful", launcher._matchmakeSuccessful);
        Push.bind("MatchmakeFail", launcher._matchmakeFail);
        Push.bind("GroupReservationJoined", launcher._reservationReady);
        Push.bind("GroupReservationJoinFail", function(groupJoinFailEvent) {
            var groupJoinFail = groupJoinFailEvent.data;
            switch (groupJoinFail.reason) {
                case launcher.ALERT.ERR_GROUP_JOIN.GAME_SERVER_NOT_FOUND:
                    launcher._triggerEvent("error.generic", [groupJoinFail.game, groupJoinFail.personaId, groupJoinFail.reason]);
                    break;
                case launcher.ALERT.ERR_GROUP_JOIN.FAILED_TO_RESERVE_SLOTS:
                    launcher._triggerEvent("error.generic", [groupJoinFail.game, groupJoinFail.personaId, groupJoinFail.reason]);
                    break;
            }
            launcher._triggerEvent("groupjoin.fail", groupJoinFail);
        });
        Push.bind("ReservationJoinedFromQueue", launcher._reservationReady);
        Push.bind("ReservationQueueStatus", function(queueStatusEvent) {
            var queueStatus = queueStatusEvent.data;
            launcher._updateCurrentState(queueStatus.game, launcher.STATE.IN_QUEUE, launcher.STATE.READY, queueStatus.personaId);
            launcher._serverQueueUpdate(queueStatus.game, queueStatus.personaId, queueStatus.queuePosition);
        });
        Push.bind("ReservationPutInQueue", function(reservationEvent) {
            launcher._triggerEvent("queue.reservation", reservationEvent.data);
        });
    },instance: null,getExpectedVersion: function() {
        return S.globalContext.staticContext.pluginVersion;
    },getExpectedVersionHex: function() {
        var parts = launcher.getExpectedVersion().split(".");
        var hex = "";
        for (var i in parts) {
            if (typeof (parts[i]) == "function" || parts[i] == undefined) {
                continue;
            }
            var h = parseInt(parts[i]).toString(16);
            if (h.length == 1) {
                h = "0" + h;
            }
            hex += h;
        }
        return hex;
    },veniceProtocolVersion: "1",userSettings: {},pingSiteLatency: {},latestGameVersions: {},queryRequests: 0,currentState: "",currentStatePersonaId: "",targetState: "",STATE: {NONE: "NONE",READY: "READY",PENDING: "PENDING",GAMEISGONE: "GAMEISGONE",RESERVING_SLOT: "RESERVING_SLOT",NA: "State_NA",ERROR: "State_Error",STARTING: "State_Starting",INIT: "State_Init",NOT_LOGGED_IN: "State_NotLoggedIn",MENU_READY: "State_MenuReady",MATCHMAKING: "State_Matchmaking",MATCHMAKE_RESULT_HOST: "State_MatchmakeResultHost",MATCHMAKE_RESULT_JOIN: "State_MatchmakeResultJoin",CONNECT_TO_GAMEID: "State_ConnectToGameId",CONNECT_TO_USERID: "State_ConnectToUserId",CREATE_COOP_PEER: "State_CreateCoOpPeer",MATCHMAKE_COOP: "State_MatchmakeCoOp",RESUME_CAMPAIGN: "State_ResumeCampaign",LOAD_LEVEL: "State_LoadLevel",CONNECTING: "State_Connecting",WAIT_FOR_LEVEL: "State_WaitForLevel",GAME_LOADING: "State_GameLoading",GAME: "State_Game",GAME_LEAVING: "State_GameLeaving",IN_QUEUE: "State_InQueue",WAIT_FOR_PEER_CLIENT: "State_WaitForPeerClient",PEER_CLIENT_CONNECTED: "State_PeerClientConnected",CLAIM_RESERVATION: "State_ClaimReservation"},ALERT: {ERR_LOGIN_ACCOUNT: "ERR_LOGIN_ACCOUNT",ERR_LOGIN_PERSONA: "ERR_LOGIN_PERSONA",ERR_SERVERCONNECT: "ERR_SERVERCONNECT",ERR_SERVERCONNECT_FULL: "ERR_SERVERCONNECT_FULL",ERR_SERVERCONNECT_WRONGPASSWORD: "ERR_SERVERCONNECT_WRONGPASSWORD",ERR_SERVERCONNECT_INVALIDGAME: "ERR_SERVERCONNECT_INVALIDGAME",ERR_SERVER_KICKED: "ERR_SERVER_KICKED",ERR_SERVERCONNECT_BANNED: "ERR_SERVERCONNECT_BANNED",ERR_PARAM_MISSINGTOKEN: "ERR_PARAM_MISSINGTOKEN",ERR_PARAM_MISSINGPERSONA: "ERR_PARAM_MISSINGPERSONA",ERR_PARAM_INVALIDGAMEID: "ERR_PARAM_INVALIDGAMEID",ERR_PARAM_INVALIDUSERID: "ERR_PARAM_INVALIDUSERID",ERR_PARAM_INVALIDMISSION: "ERR_PARAM_INVALIDMISSION",ERR_SHOW_TOS: "ERR_SHOW_TOS",ERR_CAMPAIGN_NOSAVE: "ERR_CAMPAIGN_NOSAVE",ERR_CAMPAIGN_LOADSAVE: "ERR_CAMPAIGN_LOADSAVE",ERR_CONFIG_MISSMATCH: "ERR_CONFIG_MISSMATCH",ERR_ALREADY_IN_QUEUE: "ERR_ALREADY_IN_QUEUE",ERR_RESERVATION_ALREADY_EXIST: "ERR_RESERVATION_ALREADY_EXIST",ERR_MATCHMAKE_FAILED: "ERR_MATCHMAKE_FAILED",ERR_ALREADY_GAME_MEMBER: "ERR_ALREADY_GAME_MEMBER",ERR_DISCONNECT_GAME_WRONGPROTOCOLVERSION: "ERR_DISCONNECT_GAME_WRONGPROTOCOLVERSION",ERR_DISCONNECT_GAME_WRONGTITLEVERSION: "ERR_DISCONNECT_GAME_WRONGTITLEVERSION",ERR_DISCONNECT_GAME_SERVERFULL: "ERR_DISCONNECT_GAME_SERVERFULL",ERR_DISCONNECT_GAME_KICKED: "ERR_DISCONNECT_GAME_KICKED",ERR_DISCONNECT_GAME_DEMOOVER: "ERR_DISCONNECT_GAME_DEMOOVER",ERR_DISCONNECT_GAME_BANNED: "ERR_DISCONNECT_GAME_BANNED",ERR_DISCONNECT_GAME_TIMEDOUT: "ERR_DISCONNECT_GAME_TIMEDOUT",ERR_DISCONNECT_GAME_NOREPLY: "ERR_DISCONNECT_GAME_NOREPLY",ERR_DISCONNECT_GAME_BADCONTENT: "ERR_DISCONNECT_GAME_BADCONTENT",ERR_DISCONNECT_GAME: "ERR_DISCONNECT_GAME",ERR_DISCONNECT_BLAZE: "ERR_DISCONNECT_BLAZE",ERR_LOGIN_INVALIDTOKEN: "ERR_LOGIN_INVALIDTOKEN",ERR_LOGIN_EXPIREDTOKEN: "ERR_LOGIN_EXPIREDTOKEN",ERR_LOGIN_PERSONANOTFOUND: "ERR_LOGIN_PERSONANOTFOUND",ERR_INVALID_GAME_STATE_ACTION: "ERR_INVALID_GAME_STATE_ACTION",ERR_GENERIC: "ERR_GENERIC",ERR_LAUNCH_DISABLED: "ERR_LAUNCH_DISABLED",ERR_EMPTY_JOINSTATE: "ERR_EMPTY_JOINSTATE",ERR_BACKEND_ROUTE: "ERR_BACKEND_ROUTE",ERR_BACKEND_HTTP: "ERR_BACKEND_HTTP",ERR_FAILED_PERSONACALL: "ERR_FAILED_PERSONACALL",ERR_PING_PINGSITES: "ERR_PING_PINGSITES",ERR_NO_PINGSITE_LIST: "ERR_NO_PINGSITE_LIST",ERR_LOGIN_ACCOUNT_ERROR_CODE: {UNSPECIFIED_ERROR: 1,ACCOUNT_NOT_FOUND: 2,ACCOUNT_DISABLED: 3,ACCOUNT_BANNED: 4,ACCOUNT_PENDING: 5,ACCOUNT_NOT_ENTITLED: 6,INVALID_REG_CODE: 7,TOO_MANY_LOGIN_ATTEMPTS: 10,INVALID_PASSWORD: 11,INVALID_EMAIL: 12,NOT_REGISTERED: 13,SERVICE_FAILURE: 14,ACCOUNT_DEACTIVATED: 15,ACCOUNT_MERGED: 16},ERR_LOGIN_PERSONA_ERROR_CODE: {UNSPECIFIED_ERROR: 1,SERVICE_UNAVAILABLE: 25,PERSONA_DISABLED_BY_CSR: 30},ERR_CONFIG_MISSMATCH_ERROR_CODE: {GAME_PROTOCOL: 1},ERR_GENERIC_ERROR_CODE: {BACKEND: 1,UNKNOWN: 2,DEFAULT: 3,INTERNAL_SERVER_ERROR: 4,AJAX_ERROR: 5,MANGLED_RESPONSE: 6,SERVICE_UNAVAILABLE: 7},ERR_MATCHMAKE: {SESSION_TIMED_OUT: "SESSION_TIMED_OUT",SESSION_CANCELED: "SESSION_CANCELED",START_MATCHMAKING_FAILED: "START_MATCHMAKING_FAILED",REQUIRED_FILTER_MISSING: "REQUIRED_FILTER_MISSING"},ERR_PLAYER_ACTION: {JOINING: 1,LEAVING: 2},ERR_GROUP_JOIN: {GAME_SERVER_NOT_FOUND: "GAME_SERVER_NOT_FOUND",FAILED_TO_RESERVE_SLOTS: "FAILED_TO_RESERVE_SLOTS"}},INSTALL_STATE: {OK: "OK",OUT_OF_DATE: "OUT_OF_DATE",ERR_VERSION_UNREADABLE: "ERR_VERSION_UNREADABLE",ERR_NO_VERSION_FOUND: "ERR_NO_VERSION_FOUND",ERR_GAME_NOT_FOUND: "ERR_GAME_NOT_FOUND"},JOIN_STATE: {JOINED_GAME: "JOINED_GAME",IN_QUEUE: "IN_QUEUE",GROUP_PARTIALLY_JOINED: "GROUP_PARTIALLY_JOINED"},queryServer: function(server, callback) {
        var obj = launcher.getInstance();
        if (!obj) {
            callback({error: "NO_PLUGIN"});
            return;
        }
        var requestId = "" + launcher.queryRequests;
        launcher.queryRequests++;
        launcher.registerForEvent("queryResult", function(event, resultId, result) {
            if (resultId != requestId) {
                return;
            }
            var data;
            try {
                data = S.parseJSON(result);
                if (data.error == "SUCCESS") {
                    var team1 = data.teamInfo["2"].players;
                    var team2 = data.teamInfo["3"].players;
                    var players = [];
                    for (var i in team1) {
                        team1[i].personaId = parseInt(i);
                        players[players.length] = team1[i];
                    }
                    for (var j in team2) {
                        team2[j].personaId = parseInt(j);
                        players[players.length] = team2[j];
                    }
                }
                data.players = players;
            } catch (e) {
                data = {error: "INVALID_RESPONSE"};
            }
            callback(data);
        });
        var port = parseInt(server.port) + 1;
        if (server.ip == "10.20.108.220") {
            server.ip = "192.168.1.179";
        }
        launcher.debug("Querying " + server.ip + ":" + port);
        obj.queryServer(launcher._gameToPluginGame(server.game), requestId, "" + server.gameId, server.ip, port);
    },pingServers: function(serverIdList, ipList) {
        var obj = launcher.getInstance();
        if (!obj) {
            return;
        }
        launcher.debug("Pinging: " + serverIdList + " " + ipList);
        var result = obj.pingBatch(serverIdList.join(";"), ipList);
    },verifyPassword: function(game, gameServerGuid, plaintextPassword, callback) {
        if (game == games.BFBC2) {
            return callback(true);
        }
        var url = "/" + base.gameToSection(game) + "/launcher/verifypassword/" + gameServerGuid;
        var passwordInfo = {"post-check-sum": S.globalContext.session.postChecksum,"password": plaintextPassword};
        var ajaxOptions = {url: url,dataType: "json",type: "POST",data: S.encodeJSON(passwordInfo),contentType: "application/json;charset=utf-8",success: function(response) {
                callback(true);
            },error: function(jqXHR, textStatus, errorThrown) {
                callback(false);
            }};
        launcher._ajaxHelper(game, ajaxOptions);
    },joinMpServer: function(persona, game, gameId, options, groupPersonaIdList, callback) {
        if (game == games.BFBC2) {
            launcher._changeGameToState(persona, game, gameTypes.MP, launcher.STATE.CONNECT_TO_GAMEID, jQuery.extend(options, {gameId: gameId}));
        } else {
            launcher._updateCurrentState(game, launcher.STATE.RESERVING_SLOT, launcher.STATE.READY, persona.personaId);
            var url = "/" + base.gameToSection(game) + "/launcher/reserveslotbygameid/" + persona.personaId + "/" + gameId;
            launcher._reserveSlot(game, url, options, groupPersonaIdList, function(reservation, shouldJoinServer) {
                if (shouldJoinServer) {
                    launcher._updateCurrentState(game, launcher.STATE.CONNECT_TO_GAMEID, launcher.STATE.READY, persona.personaId);
                    launcher._claimReservation(reservation, options);
                }
                callback(reservation);
            });
        }
    },joinMpFriend: function(persona, game, friendPersonaId, options, callback) {
        if (game == games.BFBC2) {
            launcher._changeGameToState(persona, game, gameTypes.MP, launcher.STATE.CONNECT_TO_USERID, jQuery.extend(options, {friendPersonaId: friendPersonaId}));
        } else {
            launcher._updateCurrentState(game, launcher.STATE.RESERVING_SLOT, launcher.STATE.READY, persona.personaId);
            var url = "/" + base.gameToSection(game) + "/launcher/reserveslotbyfriendpersonaid/" + persona.personaId + "/" + friendPersonaId;
            launcher._reserveSlot(game, url, options, null, function(reservation, shouldJoinServer) {
                if (shouldJoinServer) {
                    launcher._updateCurrentState(game, launcher.STATE.CONNECT_TO_USERID, launcher.STATE.READY, persona.personaId);
                    launcher._claimReservation(reservation, options);
                }
                callback(reservation);
            });
        }
    },_reserveSlot: function(game, url, options, groupPersonaIdList, callback) {
        var data = {"post-check-sum": S.globalContext.session.postChecksum,"groupPersonaIdList": groupPersonaIdList};
        var ajaxOptions = {url: url,dataType: "json",type: "POST",data: S.encodeJSON(data),contentType: "application/json;charset=utf-8",success: function(response) {
                var reservation = response.data;
                switch (reservation.joinState) {
                    case launcher.JOIN_STATE.GROUP_PARTIALLY_JOINED:
                        launcher._triggerEvent("warning.generic", [game, reservation.personaId, launcher.JOIN_STATE.GROUP_PARTIALLY_JOINED]);
                        return callback(reservation, true);
                    case launcher.JOIN_STATE.JOINED_GAME:
                        return callback(reservation, true);
                    case launcher.JOIN_STATE.IN_QUEUE:
                        launcher._storeJoinOptions(game, reservation.personaId, reservation.gameId, options);
                        launcher._updateCurrentState(game, launcher.STATE.IN_QUEUE, launcher.STATE.READY, reservation.personaId);
                        return callback(reservation, false);
                    default:
                        launcher.debug("Join state not handled: " + reservation.joinState);
                        launcher._triggerEvent("error.generic", [game, reservation.personaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.MANGLED_RESPONSE]);
                        break;
                }
            },error: function(jqXHR, textStatus, errorThrown) {
                var errorResponse = S.parseJSON(jqXHR.responseText);
                launcher.debug(errorResponse.data);
                switch (errorResponse.message) {
                    case "WRONG_USER":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_LOGIN_PERSONA]);
                        break;
                    case "BACKEND_HTTP":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_BACKEND_HTTP]);
                        break;
                    case "FAILED_PERSONACALL":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_FAILED_PERSONACALL]);
                        break;
                    case "BACKEND_ROUTE":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_BACKEND_ROUTE]);
                        break;
                    case "LAUNCH_DISABLED":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_LAUNCH_DISABLED]);
                        break;
                    case "EMPTY_JOINSTATE":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_EMPTY_JOINSTATE]);
                        break;
                    case "INVALID_TOKEN":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_LOGIN_INVALIDTOKEN]);
                        break;
                    case "ALREADY_IN_QUEUE":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_ALREADY_IN_QUEUE]);
                        break;
                    case "GAME_PROTOCOL_MISSMATCH":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_CONFIG_MISSMATCH, launcher.ALERT.ERR_CONFIG_MISSMATCH_ERROR_CODE.GAME_PROTOCOL]);
                        break;
                    case "INVALID_GAME_ID":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_PARAM_INVALIDGAMEID, launcher.ALERT.ERR_PLAYER_ACTION.JOINING]);
                        break;
                    case "RESERVATION_ALREADY_EXIST":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_RESERVATION_ALREADY_EXIST]);
                        break;
                    case "GAME_FULL":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_SERVERCONNECT_FULL]);
                        break;
                    case "PLAYER_BANNED":
                    case "PLAYER_NOT_FOUND":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_PARAM_INVALIDUSERID, launcher.ALERT.ERR_PLAYER_ACTION.JOINING]);
                        break;
                    case "ALREADY_GAME_MEMBER":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_ALREADY_GAME_MEMBER]);
                        break;
                    case "INVALID_GAME_STATE_ACTION":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_INVALID_GAME_STATE_ACTION]);
                        break;
                    case "BACKEND":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.BACKEND]);
                        break;
                    case "UNKNOWN":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.UNKNOWN]);
                        break;
                    default:
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.DEFAULT]);
                        break;
                }
            }};
        launcher._ajaxHelper(game, ajaxOptions);
    },_claimReservation: function(reservation, options) {
        var extendedOptions = jQuery.extend(options, {gameId: reservation.gameId});
        if (reservation.invitePersona && parseInt(reservation.invitePersona.personaId) != NaN && reservation.invitePersona.personaName != null) {
            extendedOptions = jQuery.extend(extendedOptions, {"invitePersonaId": reservation.invitePersona.personaId,"invitePersonaName": reservation.invitePersona.personaName});
        }
        launcher._changeGameToState({"personaId": reservation.personaId}, reservation.game, gameTypes.MP, launcher.STATE.CLAIM_RESERVATION, extendedOptions);
    },_storeJoinOptions: function(game, personaId, gameId, options) {
        jQuery.jStorage.set("launcher.joinoptions." + game + "." + personaId + "." + gameId, options);
    },_retrieveJoinOptions: function(game, personaId, gameId) {
        return jQuery.jStorage.get("launcher.joinoptions." + game + "." + personaId + "." + gameId, {});
    },_deleteJoinOptions: function(game, personaId, gameId) {
        jQuery.jStorage.deleteKey("launcher.joinoptions." + game + "." + personaId + "." + gameId);
    },_reservationReady: function(reservationEvent) {
        var reservation = reservationEvent.data;
        launcher._triggerEvent("reservation.ready", reservation);
    },joinReservation: function(reservation) {
        var options = launcher._retrieveJoinOptions(reservation.game, reservation.personaId, reservation.gameId);
        launcher._updateCurrentState(reservation.game, launcher.STATE.CONNECT_TO_GAMEID, launcher.STATE.READY, reservation.personaId);
        launcher._claimReservation(reservation, options);
        launcher._deleteJoinOptions(reservation.game, reservation.personaId, reservation.gameId);
    },cancelReservation: function(reservation, callback) {
        var url = "/" + base.gameToSection(reservation.game) + "/launcher/mpleavegameserver/" + reservation.personaId + "/" + reservation.gameId;
        var ajaxOptions = {url: url,dataType: "json",type: "POST",data: {"post-check-sum": S.globalContext.session.postChecksum},success: function(response) {
                launcher.debug("Successfully canceled reservation");
                callback(true);
            },error: function(jqXHR, textStatus, errorThrown) {
                launcher.debug("Error when canceling reservation: " + jqXHR.responseText);
                callback(false);
            }};
        launcher._ajaxHelper(reservation.game, ajaxOptions);
    },createPrivateCoOpServer: function(persona, game, level, difficulty) {
        var startLevel = "Levels/" + level + "/" + level;
        S.debug("Create CoOp with persona: ");
        S.debug(persona);
        S.debug("Game " + game + ", level: " + startLevel + ", difficulty: " + difficulty);
        launcher._changeGameToState(persona, game, gameTypes.COOP, launcher.STATE.CREATE_COOP_PEER, {level: startLevel,difficulty: difficulty});
    },joinPrivateCoOpServer: function(persona, game, hostPersonaId) {
        S.debug("join CoOp with persona: ");
        S.debug(persona);
        S.debug("Game " + game + ", hostPersonaId: " + hostPersonaId);
        launcher._changeGameToState(persona, game, gameTypes.COOP, launcher.STATE.CONNECT_TO_USERID, {friendPersonaId: hostPersonaId});
    },startPublicCoOpMatchmaking: function(persona, game, matchmakeRules) {
        var options = matchmakeRules;
        var url = "/" + base.gameToSection(game) + "/coop/unlockedmissions/" + persona.personaId;
        var ajaxOptions = {url: url,dataType: "json",success: function(response) {
                var missionInfo = response.data;
                options = jQuery.extend(options, {"unlockedmissions": missionInfo.unlockedMissions});
                launcher._changeGameToState(persona, game, gameTypes.COOP, launcher.STATE.MATCHMAKE_COOP, options);
            },error: function(jqXHR, textStatus, errorThrown) {
                var errorResponse = S.parseJSON(jqXHR.responseText);
                switch (errorResponse.message) {
                }
            }};
        launcher._ajaxHelper(game, ajaxOptions);
    },startMpMatchmaking: function(persona, game, matchmakeRules, groupPersonaIdList, callback) {
        launcher._updateCurrentState(game, launcher.STATE.MATCHMAKING, launcher.STATE.READY, persona.personaId);
        launcher._getPingSiteLatency(game, function(pingSiteLatency) {
            var url = "/" + base.gameToSection(game) + "/launcher/mpstartmatchmaking/" + persona.personaId;
            var matchmakeRulesExtended = jQuery.extend({gameModes: null,gamePresets: null,maps: null,gameExpansions: null,groupPersonaIdList: null}, matchmakeRules, {groupPersonaIdList: groupPersonaIdList}, {pingSiteLatency: pingSiteLatency});
            matchmakeRulesExtended = jQuery.extend({"post-check-sum": S.globalContext.session.postChecksum}, matchmakeRulesExtended);
            var ajaxOptions = {url: url,dataType: "json",type: "POST",data: S.encodeJSON(matchmakeRulesExtended),contentType: "application/json;charset=utf-8",success: function(response) {
                    var matchmakingInProgress = response.data;
                    launcher.debug(matchmakingInProgress);
                    callback(matchmakingInProgress.matchmakingSessionId);
                },error: function(jqXHR, textStatus, errorThrown) {
                    var errorResponse = S.parseJSON(jqXHR.responseText);
                    launcher.debug(errorResponse.data);
                    switch (errorResponse.message) {
                        case "MATCHMAKING_REQUIRED_FILTER_MISSING":
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_MATCHMAKE.REQUIRED_FILTER_MISSING]);
                            break;
                        case "LAUNCH_DISABLED":
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_LAUNCH_DISABLED]);
                            break;
                        case "WRONG_USER":
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_LOGIN_PERSONA]);
                            break;
                        case "BACKEND_HTTP":
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_BACKEND_HTTP]);
                            break;
                        case "FAILED_PERSONACALL":
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_FAILED_PERSONACALL]);
                            break;
                        case "BACKEND_ROUTE":
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_BACKEND_ROUTE]);
                            break;
                        case "BACKEND":
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.BACKEND]);
                            break;
                        case "UNKNOWN":
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.UNKNOWN]);
                            break;
                        default:
                            launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.DEFAULT]);
                            break;
                    }
                },complete: null};
            launcher._ajaxHelper(game, ajaxOptions);
        });
    },cancelMpMatchmaking: function(persona, game, matchmakingSessionId, callback) {
        var url = "/" + base.gameToSection(game) + "/launcher/mpcancelmatchmaking/" + persona.personaId + "/" + matchmakingSessionId;
        var ajaxOptions = {url: url,dataType: "json",type: "POST",data: {"post-check-sum": S.globalContext.session.postChecksum},success: function(response) {
                callback(true);
            },error: function(jqXHR, textStatus, errorThrown) {
                var errorResponse = S.parseJSON(jqXHR.responseText);
                launcher.debug(errorResponse.data);
                switch (errorResponse.message) {
                    case "WRONG_USER":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_LOGIN_PERSONA]);
                        break;
                    case "BACKEND":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.BACKEND]);
                        break;
                    case "UNKNOWN":
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.UNKNOWN]);
                        break;
                    default:
                        launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.DEFAULT]);
                        break;
                }
                callback(false);
            }};
        launcher._ajaxHelper(game, ajaxOptions);
    },_matchmakeSuccessful: function(reservationEvent) {
        launcher._triggerEvent("matchmake.success", reservationEvent.data);
        launcher._reservationReady(reservationEvent);
    },_matchmakeFail: function(reservationFailEvent) {
        var reservationFail = reservationFailEvent.data;
        switch (reservationFail.reason) {
            case launcher.ALERT.ERR_MATCHMAKE.SESSION_TIMED_OUT:
                launcher._triggerEvent("error.generic", [reservationFail.game, reservationFail.personaId, reservationFail.reason]);
                break;
            case launcher.ALERT.ERR_MATCHMAKE.SESSION_CANCELED:
                launcher._updateCurrentState(reservationFail.game, launcher.STATE.GAMEISGONE, launcher.STATE.NA, reservationFail.personaId);
                break;
            case launcher.ALERT.ERR_MATCHMAKE.START_MATCHMAKING_FAILED:
                launcher._triggerEvent("error.generic", [reservationFail.game, reservationFail.personaId, reservationFail.reason]);
                break;
            default:
                S.warn("Unknown matchmaking error: " + reservationFail.reason);
        }
        launcher._triggerEvent("matchmake.fail", reservationFail);
    },launchCampaignMenu: function(persona, game) {
        launcher._changeGameToState(persona, game, gameTypes.SP, launcher.STATE.RESUME_CAMPAIGN, {});
    },leaveQueue: function(persona, game, gameId) {
        if (game == games.BFBC2) {
            launcher._changeGameToState(persona, game, gameTypes.MP, launcher.STATE.MENU_READY, {});
        } else {
            var url = "/" + base.gameToSection(game) + "/launcher/mpleavegameserver/" + persona.personaId + "/" + gameId;
            var ajaxOptions = {url: url,dataType: "json",type: "POST",data: {"post-check-sum": S.globalContext.session.postChecksum},success: function(response) {
                    launcher._updateCurrentState(game, launcher.STATE.GAMEISGONE, launcher.STATE.NA, persona.personaId);
                },error: function(jqXHR, textStatus, errorThrown) {
                    var errorResponse = S.parseJSON(jqXHR.responseText);
                    launcher.debug(errorResponse.data);
                    switch (errorResponse.message) {
                        case "INVALID_GAME_ID":
                            launcher._triggerEvent("error.generic", [game, persona.personaId, launcher.ALERT.ERR_PARAM_INVALIDGAMEID, launcher.ALERT.ERR_PLAYER_ACTION.LEAVING]);
                            break;
                        case "PLAYER_NOT_FOUND":
                            launcher._triggerEvent("error.generic", [game, persona.personaId, launcher.ALERT.ERR_PARAM_INVALIDUSERID, launcher.ALERT.ERR_PLAYER_ACTION.LEAVING]);
                            break;
                        case "WRONG_USER":
                            launcher._triggerEvent("error.generic", [game, persona.personaId, launcher.ALERT.ERR_LOGIN_PERSONA]);
                            break;
                        case "BACKEND":
                            launcher._triggerEvent("warning.generic", [game, persona.personaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.BACKEND]);
                            break;
                        case "UNKNOWN":
                            launcher._triggerEvent("warning.generic", [game, persona.personaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.UNKNOWN]);
                            break;
                        default:
                            launcher._triggerEvent("warning.generic", [game, persona.personaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.DEFAULT]);
                            break;
                    }
                }};
            launcher._ajaxHelper(game, ajaxOptions);
        }
    },checkForPatchAvailable: function(game, gameType, patchingDoneCallback) {
        launcher._getInstalledGameVersion(game, function(installState, installedGameBuild, sku) {
            if (installState != launcher.INSTALL_STATE.OK) {
                if (installState == launcher.INSTALL_STATE.ERR_NO_VERSION_FOUND) {
                    patchingDoneCallback(game, true);
                } else {
                    launcher._triggerEvent("error.patcher", [game, installState, sku, gameType]);
                    patchingDoneCallback(game, false);
                }
                return;
            }
            launcher._getLatestGameVersion(game, sku, function(installState, latestGameBuild) {
                if (installState != launcher.INSTALL_STATE.OK) {
                    launcher._triggerEvent("error.patcher", [game, installState, sku, gameType]);
                    patchingDoneCallback(game, false);
                    return;
                }
                var gameUpToDate = false;
                var installedGameBuildInt = parseInt(installedGameBuild);
                var latestGameBuildInt = parseInt(latestGameBuild);
                if (!isNaN(installedGameBuildInt) && !isNaN(latestGameBuildInt)) {
                    gameUpToDate = (installedGameBuildInt >= latestGameBuildInt);
                } else {
                    gameUpToDate = (installedGameBuild === latestGameBuild);
                }
                patchingDoneCallback(game, gameUpToDate);
                if (!gameUpToDate) {
                    var skuPatchInfo = {"build": latestGameBuild};
                    launcher._triggerEvent("error.patcher", [game, launcher.INSTALL_STATE.OUT_OF_DATE, sku, gameType, skuPatchInfo]);
                }
            });
        });
    },_getGameAttribute: function(game, attributeName, callback) {
        launcher.isGameInstalled(game, function(installed) {
            if (!installed) {
                callback("");
                return;
            }
            var obj = launcher.getInstance();
            callback(obj.getParameter(launcher._gameToPluginGame(game), attributeName));
        });
    },registerForEvent: function(event, callback) {
        jQuery("#esnlaunch_container").bind("bf.launcher." + event, callback);
    },unregisterForEvent: function(event, callback) {
        jQuery("#esnlaunch_container").unbind("bf.launcher." + event, callback);
    },_triggerEvent: function(event, data) {
        jQuery("#esnlaunch_container").triggerHandler("bf.launcher." + event, data);
    },_getInstalledGameVersion: function(game, callback) {
        launcher.isGameInstalled(game, function(installed) {
            if (!installed) {
                callback(launcher.INSTALL_STATE.ERR_GAME_NOT_FOUND);
            }
            var obj = launcher.getInstance();
            if (game != games.BFBC2) {
                try {
                    var version = S.parseJSON(obj.getVersion(launcher._gameToPluginGame(game)));
                    callback(launcher.INSTALL_STATE.OK, version.build, version.sku);
                } catch (e) {
                    S.warn("Failed to read local game version JSON: " + e);
                    callback(launcher.INSTALL_STATE.ERR_VERSION_UNREADABLE);
                }
            } else {
                var installationDataXmlString = obj.getParameter(launcher._gameToPluginGame(game), "INSTALLATION_DATA");
                if (installationDataXmlString == null || installationDataXmlString == "") {
                    callback(launcher.INSTALL_STATE.ERR_NO_VERSION_FOUND);
                    return;
                }
                var currentVersion = installationDataXmlString.match(/(?:CurrentVersion>)(\d+)(?:<\/CurrentVersion)/gi)[0].match(/\d+/)[0];
                callback(launcher.INSTALL_STATE.OK, currentVersion, "dice");
            }
        });
    },isPatcherInstalled: function(sku, callback) {
        if (!(sku.toUpperCase() in pluginSkus)) {
            launcher.debug("isPatcherInstalled: Unknown sku:" + sku + ", returning false");
            return callback(false);
        }
        var obj = launcher.getInstance();
        if (!obj) {
            launcher.debug("isPatcherInstalled: No plugin instance, returning false");
            return callback(false);
        }
        var pluginSku = pluginSkus[sku.toUpperCase()];
        var installed = obj.probe(pluginSku);
        launcher.debug("isPatcherInstalled: Probe result " + installed);
        callback(installed);
    },showInPatcher: function(game, sku, callback) {
        launcher.isPatcherInstalled(sku, function(installed) {
            if (installed) {
                var obj = launcher.getInstance("showInSku");
                switch (game) {
                    case games.BF3:
                        switch (sku) {
                            case "origin":
                                var launched = obj.launch(false, false, pluginSkus[sku.toUpperCase()], "library/71171", "", "", "", "");
                                return callback(launched);
                        }
                        break;
                        break;
                }
            }
            return callback(false);
        });
    },isGameInstalled: function(game, callback) {
        var obj = launcher.getInstance();
        if (!obj) {
            launcher.debug("isGameInstalled: No plugin instance, returning false");
            callback(false);
            return;
        }
        launcher.debug("isGameInstalled: Loading settings for " + game);
        launcher._getGameSettings(game, function(userSettings) {
            var params = userSettings["pluginParameters"] || {};
            var pluginGame = launcher._gameToPluginGame(game);
            jQuery.each(params, function(key, value) {
                launcher.debug("Settings " + key + " to " + value);
                obj.setParameter(pluginGame, key, value);
            });
            var installed = obj.probe(pluginGame);
            launcher.debug("isGameInstalled: Probe result " + installed);
            callback(installed);
        });
    },isGameRunning: function(game, callback) {
        launcher.isGameInstalled(game, function(installed) {
            if (!installed) {
                callback(false);
                return;
            }
            var obj = launcher.getInstance("isGameRunning");
            var running = obj.isGameRunning(launcher._gameToPluginGame(game));
            callback(running);
        });
    },getGamesInstalled: function() {
        var installed = [];
        var gameList = [games.BF3];
        jQuery.each(gameList, function(index, game) {
            launcher.isGameInstalled(game, function(gameInstalled) {
                if (gameInstalled) {
                    installed.push(game);
                }
            });
        });
        return installed;
    },getGamesRunning: function() {
        var running = {};
        var obj = launcher.getInstance("getGamesRunning");
        jQuery.each(launcher.getGamesInstalled(), function(index, game) {
            running[game] = obj.isGameRunning(launcher._gameToPluginGame(game));
        });
        return running;
    },_changeGameToState: function(persona, game, gameType, requestedState, args) {
        if (game == undefined) {
            launcher.debug("Game undefined");
            return;
        }
        var veniceRunning = false;
        var gameRunningList = launcher.getGamesRunning();
        jQuery.each(gameRunningList, function(gameRunning, isRunning) {
            if (gameRunning == games.BF3) {
                veniceRunning = isRunning;
            }
            if ((gameRunning != game) && (isRunning === true)) {
                launcher._triggerEvent("error.anotherGameRunning", [game, gameRunning]);
                launcher.debug("Want to run: " + game + ", other game running:" + gameRunning);
                return;
            }
        });
        if (launcher.currentState == launcher.STATE.ERROR || veniceRunning) {
            launcher._killGame(game, 0, function(gameKilled) {
                if (gameKilled) {
                    launcher._doChangeGameToState(persona, game, gameType, requestedState, args);
                } else {
                    launcher._triggerEvent("error.gameNeedsManualKill", game);
                    launcher.debug("Game in state error, couldn't kill");
                }
            });
        } else {
            launcher._doChangeGameToState(persona, game, gameType, requestedState, args);
        }
    },_doChangeGameToState: function(persona, game, gameType, requestedState, args) {
        launcher.debug("Requesting state change: " + requestedState);
        var currentLauncherGame = launcher._gameToPluginGame(game);
        var success = false;
        launcher.isGameInstalled(game, function(installed) {
            if (!installed) {
                launcher._triggerEvent("error.gameNotInstalled", game);
                return;
            }
            var additionalArgs = {};
            if (game == games.BFBC2) {
                additionalArgs["personaRef"] = launcher._escapePersonaName(persona.personaName);
            } else {
                additionalArgs["personaRef"] = persona.personaId;
            }
            switch (gameType) {
                case gameTypes.SP:
                    additionalArgs["levelMode"] = "sp";
                    break;
                case gameTypes.COOP:
                    additionalArgs["levelMode"] = "coop";
                    break;
                case gameTypes.MP:
                    additionalArgs["levelMode"] = "mp";
                    break;
                default:
                    S.warn("Trying to launch unknown gameType: " + gameType);
            }
            var requestStateParams = jQuery("<data></data>");
            var snowrollerParams = jQuery.extend({}, args, additionalArgs);
            jQuery.each(snowrollerParams, function(key, value) {
                if (value != null && value != undefined && (typeof value != "string" || (typeof value == "string" && value.length > 0))) {
                    requestStateParams.attr(key.toLowerCase(), value);
                }
            });
            jQuery("body").append('<div id="launcher-build-data" style="display:none;"></div>');
            var buildDataNode = jQuery("#launcher-build-data");
            var requestStateParamsXml = buildDataNode.html(requestStateParams).html();
            buildDataNode.remove();
            var obj = launcher.getInstance("doChangeGameToState");
            if (!obj.isGameRunning(currentLauncherGame)) {
                launcher.debug("Game is not running, looking up cmdline for launching in state: " + requestedState);
                launcher._getCommandLine(game, gameType, function(cmdline) {
                    launcher._getToken(game, function(token) {
                        cmdline += " -loginToken " + token;
                        cmdline += " -requestState " + requestedState;
                        requestStateParamsXml = requestStateParamsXml.replace(/"/g, '\\"');
                        cmdline += ' -requestStateParams "' + requestStateParamsXml + '"';
                        launcher.debug("Commandline: " + cmdline);
                        success = obj.launch(false, false, currentLauncherGame, cmdline, "", "", "", "");
                        launcher._updateCurrentState(game, launcher.STATE.PENDING, launcher.STATE.READY, persona.personaId);
                        if (!success) {
                            launcher._triggerEvent("error.gameNotLaunched", [game, persona.personaId]);
                        }
                    });
                });
            } else {
                var snowrollerCommand = requestedState + " " + requestStateParamsXml;
                launcher.debug("Requesting state: " + snowrollerCommand);
                success = obj.cmd(currentLauncherGame, "RequestState", snowrollerCommand, "", "");
                if (!success) {
                    launcher._triggerEvent("error.gameNotResponding", [game, persona.personaId]);
                }
            }
        });
        launcher.debug("Launch Success: " + success);
    },_eventHandler: function(pluginGame, cmd, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        if (typeof (launcher) == "undefined") {
            return;
        }
        if (cmd != "PingBatchResult") {
            launcher.debug("Callback from plugin/game (" + pluginGame + "): " + cmd + " [" + arg0 + "][" + arg1 + "][" + arg2 + "][" + arg3 + "]");
        }
        var game = 0;
        if (pluginGame != "") {
            game = launcher._pluginGameToGame(pluginGame);
        }
        switch (cmd) {
            case "StateChanged":
                launcher._updateCurrentState(game, arg0, arg1, arg2, arg3, arg4);
                break;
            case "GameWaiting":
                var personaId = launcher.currentStatePersonaId;
                if (parseInt(arg0) > 0) {
                    personaId = arg0;
                }
                launcher._triggerEvent("gameReadyToPlay", [game, personaId]);
                break;
            case "Alert":
                launcher._handleAlert(game, arg0, arg1);
                break;
            case "ServerQueue":
                launcher._serverQueueUpdate(game, launcher.currentStatePersonaId, parseInt(arg0) + 1);
                break;
            case "QueryServerResult":
                launcher._triggerEvent("queryResult", [arg0, arg1]);
                break;
            case "PingBatchResult":
                if (arg0 == "LOG_INSTEAD_OF_CALLBACK") {
                    S.log("PING RESULT: " + arg1);
                } else {
                    launcher._triggerEvent("pingResult", [arg0.split(";"), eval(arg1)]);
                }
                break;
            case "LogPrint":
                launcher.debug("Game (" + game + ") LogPrint: " + arg0);
                break;
            default:
                launcher.debug("Unknown state change: " + cmd);
                break;
        }
    },_updateCurrentState: function(game, newCurrentState, newTargetState, personaId, levelName, difficulty) {
        S.debug("CurrentState: " + newCurrentState + ", targetState: " + newTargetState);
        var statePrettyName = newCurrentState;
        switch (newCurrentState) {
            case launcher.STATE.GAME_LOADING:
                if (S.globalContext.staticContext.isOpenBeta) {
                    setTimeout(function() {
                        launcher._triggerEvent("gameReadyToPlay", [game, personaId]);
                    }, 7000);
                }
                break;
            case launcher.STATE.GAMEISGONE:
                launcher._triggerEvent("gameIsGone", game);
                break;
            case launcher.STATE.MATCHMAKE_RESULT_HOST:
            case launcher.STATE.MATCHMAKE_RESULT_JOIN:
                var isHost = (launcher.STATE.MATCHMAKE_RESULT_HOST == newCurrentState);
                launcher._triggerEvent("coop.public.ready", [game, personaId, {"levelName": levelName,"difficulty": difficulty,"isHost": isHost}]);
                break;
        }
        if (launcher.currentState == launcher.STATE.IN_QUEUE && newCurrentState != launcher.STATE.IN_QUEUE) {
            launcher._triggerEvent("leftServerQueue", [game, personaId]);
        }
        launcher._triggerEvent("gameStatus", [game, newCurrentState, personaId]);
        launcher.currentState = newCurrentState;
        launcher.currentStatePersonaId = personaId;
        launcher.targetState = newTargetState;
    },checkVersion: function() {
        var result = launcher.getInstance();
        if (!result) {
            return false;
        }
        result = launcher.getInstance().getAPIVersion();
        if (result != launcher.getExpectedVersion()) {
            launcher.debug("Plugin wrong version (" + result + ") expected (" + launcher.getExpectedVersion() + ")");
            return false;
        }
        launcher.debug("Plugin up to date, version " + result);
        return true;
    },_getGameSettings: function(game, callback) {
        if (game in launcher.userSettings) {
            return callback(launcher.userSettings[game]);
        }
        var gameSettings = jQuery.jStorage.get("gamesettings_" + game, null);
        if (gameSettings != null) {
            launcher.userSettings[game] = gameSettings;
            return callback(launcher.userSettings[game]);
        }
        var url = "/" + base.gameToSection(game) + "/launcher/settings/";
        var ajaxOptions = {url: url,dataType: "json",success: function(response) {
                launcher.userSettings[game] = response.data;
                jQuery.jStorage.set("gamesettings_" + game, response.data);
                return callback(launcher.userSettings[game]);
            },error: function() {
                launcher.debug("No gamesettings returned");
                return callback({});
            }};
        launcher._ajaxHelper(game, ajaxOptions);
    },_invalidateGameSetting: function(game) {
        jQuery.jStorage.deleteKey("gamesettings_" + game);
        if (game in launcher.userSettings) {
            delete launcher.userSettings[game];
        }
    },_getCommandLine: function(game, gameType, callback) {
        launcher._getGameSettings(game, function(gameSettings) {
            if ("commandLine" in gameSettings) {
                callback(gameSettings["commandLine"][gameType] || "");
            } else {
                launcher.debug("Commandline settings missing for game:" + game);
                return "";
            }
        });
    },_getPingSiteLatency: function(game, callback) {
        if (game in launcher.pingSiteLatency) {
            return callback(launcher.pingSiteLatency[game]);
        }
        var pingSiteLatency = jQuery.jStorage.get("pingsitelatency_" + game, null);
        if (pingSiteLatency != null) {
            launcher.pingSiteLatency[game] = pingSiteLatency;
            return callback(pingSiteLatency);
        }
        launcher._getGameSettings(game, function(gameSettings) {
            var pingSiteKeyValueList = gameSettings["pingSiteKeyValueList"];
            if (pingSiteKeyValueList == undefined || pingSiteKeyValueList == null) {
                S.error("Missing ping site configuration for game: " + game);
                launcher._invalidateGameSetting(game);
                return launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_NO_PINGSITE_LIST]);
            }
            var pingResult = function(event, serverIdList, serverLatencyObjectList) {
                launcher.unregisterForEvent("pingResult", pingResult);
                var pingSiteLatency = {};
                $.each(serverIdList, function(index, serverId) {
                    if (serverLatencyObjectList[index].roundTripMSEC >= 0) {
                        pingSiteLatency[serverId] = serverLatencyObjectList[index].roundTripMSEC;
                    }
                });
                if (jQuery.isEmptyObject(pingSiteLatency)) {
                    return launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_PING_PINGSITES]);
                }
                launcher.pingSiteLatency[game] = pingSiteLatency;
                jQuery.jStorage.set("pingsitelatency_" + game, pingSiteLatency);
                return callback(pingSiteLatency);
            };
            launcher.registerForEvent("pingResult", pingResult);
            launcher.pingServers(pingSiteKeyValueList[0], pingSiteKeyValueList[1]);
        });
    },_getToken: function(game, callback) {
        var url = "";
        if (S.globalContext.staticContext.sslAvailable) {
            url += S.globalContext.staticContext.currentHostSecure;
        } else {
            url += S.globalContext.staticContext.currentHost;
        }
        url += "/" + base.gameToSection(game) + "/launcher/token/";
        var ajaxOptions = {url: url,dataType: "jsonp",success: function(response) {
                callback(response.data);
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                launcher.debug("No game token returned, status: " + XMLHttpRequest.statusText);
            }};
        launcher._ajaxHelper(game, ajaxOptions);
    },_gameToPluginGame: function(game) {
        switch (+game) {
            case games.BFBC2:
                return pluginGames.ROME;
                break;
            case games.BF3:
                return pluginGames.VENICE;
                break;
            default:
                launcher.debug("Unknown game to convert plugin game: " + game);
        }
    },_pluginGameToGame: function(pluginGame) {
        switch (pluginGame) {
            case pluginGames.ROME:
                return games.BFBC2;
            case pluginGames.VENICE:
                return games.BF3;
            default:
                launcher.debug("Unknown plugin game to convert game: " + pluginGame);
        }
    },restoreWindow: function(game) {
        launcher.debug("Restoring window for game: " + game);
        var obj = launcher.getInstance("restoreWindow");
        var success = obj.cmd(launcher._gameToPluginGame(game), "RestoreWindow", "", "", "");
        launcher.debug("Restore window result: " + success);
    },_killGame: function(game, count, callback) {
        if (count > 10) {
            return callback(false);
        }
        launcher.isGameRunning(game, function(isRunning) {
            if (!isRunning) {
                return callback(true);
            }
        });
        launcher.debug("Killing game: " + game + ", try #" + count);
        var obj = launcher.getInstance("killGame");
        var success = obj.cmd(launcher._gameToPluginGame(game), "KillGame", "", "", "");
        launcher.debug("Kill game result: " + success);
        launcher.killGameTimeout = setTimeout(function() {
            if (success) {
                callback(success);
            } else {
                count++;
                launcher._killGame(game, count, callback);
            }
        }, 1000);
    },_handleAlert: function(game, alertType, errorCode) {
        launcher.debug("Handling alert: " + alertType + " error code: " + errorCode);
        switch (alertType) {
            case launcher.ALERT.ERR_PARAM_MISSINGTOKEN:
                launcher.debug("Faulty auth token sent to game client");
                break;
            case launcher.ALERT.ERR_MATCHMAKE_FAILED:
                launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_MATCHMAKE.SESSION_TIMED_OUT]);
                break;
            default:
                launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, alertType, errorCode]);
        }
    },_serverQueueUpdate: function(game, personaId, queuePosition) {
        launcher.debug("Handling game: " + game + ", server queue update for persona: " + personaId);
        if (launcher.currentState != launcher.STATE.IN_QUEUE) {
            launcher.debug("Game not in queue state, event ignored");
            return;
        }
        launcher._triggerEvent("serverQueuePosition", [game, personaId, queuePosition]);
    },_escapePersonaName: function(personaName) {
        return personaName.replace(/\s/g, "");
    },_getLatestGameVersion: function(game, sku, callback) {
        if (game in launcher.latestGameVersions) {
            return callback(launcher.INSTALL_STATE.OK, launcher.latestGameVersions[game]);
        }
        var latestGameVersion = jQuery.jStorage.get("latestgameversion_" + game, null);
        if (latestGameVersion != null) {
            launcher.latestGameVersions[game] = latestGameVersion;
            return callback(launcher.INSTALL_STATE.OK, latestGameVersion);
        }
        var url = "/" + base.gameToSection(game) + "/launcher/latestgameversion/" + sku;
        ajaxOptions = {url: url,dataType: "json",success: function(response) {
                launcher.latestGameVersions[game] = response.data;
                jQuery.jStorage.set("latestgameversion_" + game, response.data);
                callback(launcher.INSTALL_STATE.OK, response.data);
            },error: function() {
                callback(launcher.INSTALL_STATE.ERR_VERSION_UNREADABLE);
            }};
        launcher._ajaxHelper(game, ajaxOptions);
    },_ajaxHelper: function(game, ajaxOptions) {
        var oldErrorCallback = null;
        if ("error" in ajaxOptions) {
            oldErrorCallback = ajaxOptions.error;
        }
        ajaxOptions.error = function(jqXHR, textStatus, errorThrown) {
            switch (jqXHR.status) {
                case 302:
                case 401:
                case 403:
                    window.location.href = window.location.href;
                    return base.showReceipt("Your login session has expired.", receiptTypes.ERROR);
                case 500:
                    return launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.INTERNAL_SERVER_ERROR]);
                case 503:
                    return launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.SERVICE_UNAVAILABLE]);
                case 422:
                case 200:
                    break;
                default:
                    return launcher._triggerEvent("error.generic", [game, launcher.currentStatePersonaId, launcher.ALERT.ERR_GENERIC, launcher.ALERT.ERR_GENERIC_ERROR_CODE.AJAX_ERROR]);
            }
            if (oldErrorCallback != null) {
                oldErrorCallback(jqXHR, textStatus, errorThrown);
            }
        };
        ajaxOptions.complete = null;
        jQuery.ajax(ajaxOptions);
    },getInstance: function() {
        var isNPAPI = navigator.appName == "Opera" || navigator.appName == "Netscape";
        var isActiveX = navigator.appName == "Microsoft Internet Explorer";
        if (launcher.instance != null) {
            launcher.instance.setEventHandler("BOGUS", launcher._eventHandler);
            return launcher.instance;
        }
        var foundPlugin = false;
        if (isNPAPI) {
            navigator.plugins.refresh();
            for (var i in navigator.plugins) {
                if (navigator.plugins[i]) {
                    var plugin = navigator.plugins[i];
                    if (plugin.filename && plugin.filename.indexOf("npesnlaunch") != -1 && plugin.description == launcher.getExpectedVersion()) {
                        foundPlugin = true;
                    }
                }
            }
        } else {
            if (isActiveX) {
                foundPlugin = true;
            }
        }
        if (!foundPlugin) {
            launcher.debug("Did not find plugin...");
            return false;
        }
        var esnlaunchContainer = document.getElementById("esnlaunch_container");
        if (isNPAPI) {
            esnlaunchContainer.innerHTML = '<embed height="1" width="1" type="application/mozilla-plugin-esn-launch-' + launcher.getExpectedVersion() + '" pluginspage="/public/download/esnlaunch-browser-plugins-install_' + launcher.getExpectedVersion() + '.exe" id="esnlaunch">';
        } else {
            if (isActiveX) {
                esnlaunchContainer.innerHTML = '<object height="1" width="1" id="esnlaunch" classid="CLSID:7AEFE841-DCA1-4A95-80CB-BE935D' + launcher.getExpectedVersionHex() + '" type="application/x-oleobject"></object>';
            }
        }
        var obj = document.getElementById("esnlaunch");
        if (obj == null || typeof (obj.getAPIVersion) == "unknown" || typeof (obj.getAPIVersion) == "undefined") {
            return false;
        }
        launcher.debug("SETTING UP EVENTHANDLER IN GAME LAUNCHER");
        obj.setEventHandler("BOGUS", launcher._eventHandler);
        launcher.instance = obj;
        return obj;
    },debug: function(msg) {
        S.debug(msg);
    }};