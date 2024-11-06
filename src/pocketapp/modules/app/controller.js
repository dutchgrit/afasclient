angular.module("app.controller", []).controller("AppController", ["$scope", "$window", "$state", "$ionicPopover", "$timeout", "$q", "$ionicPopup", "$ionicSideMenuDelegate", "$ionicActionSheet", "$ionicHistory", "$ionicPlatform", "$ionicModal", "$ionicSlideBoxDelegate", "$ionicScrollDelegate", "PictureService", "LocalStorageService", "ConnectorService", "ConnectionService", "AvailabilityService", "ConfigService", "EnvConfigService", "DocumentSessionService", "UserService", "DeclarationServiceFactory", "SubjectServiceFactory", "AbsenceServiceFactory", "$sce", "maxMessages", "IllnessServiceFactory", "DocumentsServiceFactory", "$rootScope", "ContactServiceFactory", "MyCompanyService", "TimesheetServiceFactory", "ProjectServiceFactory", "TaskService", "sharedConn", "maxListTake", "EmployeeServiceFactory", "DatePickerService", "FileFromOsService", function (e, t, a, n, o, i, s, r, l, c, d, m, u, f, p, g, h, v, y, k, D, I, b, S, w, P, T, x, O, N, A, _, E, C, L, M, F, $, U, B, V) {
    function j(e, t) {
        if (isNotEmpty(e.JumpTo)) switch (parseInt(e.JumpTo)) {
        case 3:
            isNotEmpty(e.JumpToParam) && ee.getContact(e.JumpToParam).then(function (a) {
                a && (t.jumpToData || (t.jumpToData = {}), t.jumpToData[e.JumpTo] || (t.jumpToData[e.JumpTo] = {}), t.jumpToData[e.JumpTo][e.JumpToParam] || (t.jumpToData[e.JumpTo][e.JumpToParam] = a, "PER" != a.type && "ORG" != a.type || !a.image_id ? "PRS" == a.type && (a.image_id_person ? h.getImageData(a.image_id_person, 2).then(function (a) {
                    t.jumpToData[e.JumpTo][e.JumpToParam].imageUrl = a.url
                }) : a.image_person_guid && a.image_person_filename && h.getFileData(a, "image_person_guid", "image_person_filename").then(function (a) {
                    t.jumpToData[e.JumpTo][e.JumpToParam].imageUrl = "data:" + a.mimetype + ";base64," + a.filedata
                })) : h.getImageData(a.image_id, 2).then(function (a) {
                    t.jumpToData[e.JumpTo][e.JumpToParam].imageUrl = a.url
                })))
            })
        }
    }

    function R() {
        (e.wasLandScape != e.isLandscape() || e.lastWidth != t.innerWidth) && (e.wasLandScape = e.isLandscape(), e.lastWidth = t.innerWidth, c.clearCache(), e.isLandscape() && "menu.home" == c.currentStateName() ? e.gotoPage("menu.tasklist") : -1 != c.currentStateName().indexOf("tasklist") ? (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.tasklist")) : -1 != c.currentStateName().indexOf("contactlist") ? (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.contactlist")) : -1 != c.currentStateName().indexOf("employees") ? (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.employees")) : -1 != c.currentStateName().indexOf("documents") ? (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.documents")) : -1 != c.currentStateName().indexOf("agenda") ? (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.agenda")) : -1 != c.currentStateName().indexOf("placements") ? (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.placements")) : -1 != c.currentStateName().indexOf("dossier") ? (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.dossier")) : -1 != c.currentStateName().indexOf("flexdeclarations") ? (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.flexdeclarations")) : -1 != c.currentStateName().indexOf("reservations") && (c.nextViewOptions({
            disableBack: !0,
            disableAnimate: !0
        }), e.gotoPage("menu.reservations")))
    }

    function H(e) {
        null != c.backView() && c.backView().stateName == e ? c.goBack() : a.go(e, {}, {
            reload: !0
        })
    }

    function J(e) {
        for (var t = {}, a = 0; a < e.length; a++) e[a].Data && e[a].Data.additionalData && e[a].Data.additionalData.Guid && (t[e[a].Data.additionalData.Guid] = 1);
        return g.getItem("appUID").then(function (a) {
            return h.getMessages().then(function (n) {
                if ("undefined" != typeof n && null != n)
                    for (var o = 0; o < n.length; o++)
                        if (1 != t[n[o].Guid] && n[o].AppUid == a) {
                            var i = {};
                            i.message = n[o].Message, i.additionalData = n[o];
                            var s = new Date(Date.parse(i.additionalData.Timestamp));
                            s = getGMTDate(s), e.push({
                                Data: i,
                                Read: !1,
                                SendMessage: !1,
                                Date: s
                            })
                        }
            })
        })
    }

    function G(t) {
        e.unreadmessages = 0;
        for (var a = 0; a < t.length; a++) e.unreadmessages += t[a].Read ? 0 : 1
    }

    function z(e) {
        e.speech && window.plugins.speechRecognition.startListening(function (t) {
            var a;
            if (t && t.length > 0) {
                var n = [];
                for (a = 0; a < t.length; a++)
                    for (var i = t[a].split(" "), s = 0; s < i.length; s++) n.push(i[s]);
                o(function () {
                    e.speechText = n.join(" ")
                }, 100);
                var r;
                switch (currentLanguage) {
                case "nl-nl":
                case "nl-be":
                    r = re;
                    break;
                case "en-en":
                    r = le
                }
                var l = !1;
                for (a = Z; a < n.length; a++) {
                    var c = r[n[a].toLowerCase()];
                    if (c && ce[c]) {
                        ce[c](e, n), Z++, l = !0;
                        break
                    }
                }(n.length > 3 || l) && (o(function () {
                    A.stopSpeech()
                }, 200), o(function () {
                    A.restartSpeech()
                }, 800))
            }
        }, function (e) {
            log(e), o(function () {
                A.restartSpeech()
            }, 800)
        }, {
            language: toSpeechLocale(currentLanguage),
            matches: 3,
            showPopup: !0,
            showPartial: !0
        })
    }

    function q() {
        if (TTS && W && W.length > 0) {
            var e = W.shift();
            TTS.speak({
                text: e,
                rate: 1.5,
                locale: toSpeechLocale(currentLanguage)
            }, function () {
                o(q, 500)
            }, function () {})
        }
    }
    e.child = {}, e.modules = {}, e.mdEdit = {}, e.mdText = {};
    var W, Q, K = !1,
        Z = 0,
        Y = O.getInstance(),
        X = N.getInstance(),
        ee = _.getInstance(),
        te = S.getInstance(),
        ae = w.getInstance(),
        ne = P.getInstance(),
        oe = U.getInstance(),
        ie = L.getInstance(),
        se = C.getInstance();
    e.tasksAvailable = !1, e.documentsAvailable = !1, e.signalsAvailable = !1, e.appointmentsAvailable = !1, e.afasgroep = !1, e.speechSupport = !1, e.speech = !1, A.searchfieldform = {}, A.pocketChatLoggedIn = !1, e.isLandscape = function () {
        return t.innerWidth > 896 && !A.hasNotch
    }, e.hasNotch = A.hasNotch, e.wasLandScape = e.isLandscape(), e.lastWidth = t.innerWidth, window.addEventListener("orientationchange", function () {
        R()
    }), window.addEventListener("resize", function () {
        R()
    }), e.deleteMessages = function (t) {
        var a = [];
        g.getItem("messages").then(function (e) {
            isNotEmpty(e) && (a = JSON.parse(e), a.length > x && (a = a.splice(a.length - x)))
        })["finally"](function () {
            for (var n = a.length; n--;)(a[n].ToTeamId == t || a[n].ToEmployeeId == t || a[n].Data && a[n].Data.additionalData && !a[n].Data.additionalData.FromTeamId && a[n].Data.additionalData.FromEmployeeId == t || a[n].Data && a[n].Data.additionalData && a[n].Data.additionalData.FromTeamId == t || "__Profit__" == t && !a[n].ToEmployeeId && a[n].Data && a[n].Data.additionalData && !a[n].Data.additionalData.FromEmployeeId && !a[n].Data.additionalData.FromTeamId) && a.splice(n, 1);
            return g.setItem("messages", JSON.stringify(a)), h.getMessages(t)["finally"](function () {
                e.refreshMessages(), e.refreshSenders()
            })
        })
    }, e.refreshMessages = function () {
        function t(t, a) {
            e.messages = [], t = t.sort(function (e, t) {
                var a = e.Date,
                    n = t.Date;
                return "string" == typeof a && (a = Date.parse(a)), "string" == typeof n && (n = Date.parse(n)), a.valueOf() - n.valueOf()
            });
            for (var n = 0; n < t.length; n++) t[n].SendMessage ? (t[n].ToTeamId && t[n].ToTeamId == a && (e.messages.push(t[n]), t[n].Read = !0), t[n].ToEmployeeId == a && (e.messages.push(t[n]), t[n].Read = !0)) : null == t[n].Data || null == t[n].Data.additionalData || (t[n].Data.additionalData.FromTeamId || t[n].Data.additionalData.FromEmployeeId != a) && t[n].Data.additionalData.FromTeamId != a ? "__Profit__" != a || t[n].ToEmployeeId || !t[n].Data || !t[n].Data.additionalData || t[n].Data.additionalData.FromEmployeeId || t[n].Data.additionalData.FromTeamId || (e.messages.push(t[n]), t[n].Read = !0) : (e.messages.push(t[n]), t[n].Read = !0), null != t[n].Data && null != t[n].Data.additionalData && "" != t[n].Data.additionalData.JumpTo && j(t[n].Data.additionalData, e);
            o(function () {
                f.$getByHandle("messages").scrollBottom()
            }, 10)
        }
        if (!K && "menu.messageboard" == c.currentStateName() && a.params && a.params.sender) {
            K = !0;
            var n = [],
                i = a.params.sender.Id;
            g.getItem("messages").then(function (e) {
                isNotEmpty(e) && (n = JSON.parse(e), n.length > x && (n = n.splice(n.length - x)))
            })["finally"](function () {
                t(n, i), J(n)["finally"](function () {
                    t(n, i), e.$broadcast("scroll.refreshComplete"), g.setItem("messages", JSON.stringify(n))["finally"](function () {
                        G(n), o(function () {
                            f.$getByHandle("messages").scrollBottom()
                        }, 500), K = !1
                    })
                })
            })
        }
    }, e.speakItems = function (e) {
        if (e) {
            Q = [];
            for (var t = 0; t < e.length; t++) Q.push(e[t])
        }
    }, e.refreshSenders = function () {
        function t(t) {
            var a = {},
                n = {};
            if (e.senders)
                for (var o = 0; o < e.senders.length; o++) e.senders[o].image && (a[e.senders[o].ImageId] = e.senders[o].image);
            e.senders = [], t = t.sort(function (e, t) {
                var a = e.Date,
                    n = t.Date;
                return "string" == typeof a && (a = Date.parse(a)), "string" == typeof n && (n = Date.parse(n)), a.valueOf() - n.valueOf()
            });
            for (var i = t.length - 1; i >= 0; i--) {
                var s = {
                    Unread: 0
                };
                t[i].SendMessage ? t[i].ToTeamId ? (s.TeamId = t[i].ToTeamId, s.Id = s.TeamId, s.DisplayId = "(" + s.Id + ")", s.Name = t[i].ToTeamName) : (s.EmployeeId = t[i].ToEmployeeId, s.Id = s.EmployeeId, s.DisplayId = "(" + s.Id + ")", s.Name = t[i].ToEmployeeName, s.ImageId = t[i].ToEmployeeImageId) : null != t[i].Data && null != t[i].Data.additionalData && (t[i].Data.additionalData.FromEmployeeId || t[i].Data.additionalData.FromTeamId) ? t[i].Data.additionalData.FromTeamId ? (s.TeamId = t[i].Data.additionalData.FromTeamId, s.Id = s.TeamId, s.DisplayId = "(" + s.Id + ")", s.Name = t[i].Data.additionalData.FromTeamName) : (s.EmployeeId = t[i].Data.additionalData.FromEmployeeId, s.Id = s.EmployeeId, s.DisplayId = "(" + s.Id + ")", s.Name = t[i].Data.additionalData.FromEmployeeName, s.ImageId = t[i].Data.additionalData.FromEmployeeImageId) : (s.Id = "__Profit__", s.Name = "Profit", s.image = "img/home/AFAS40.png"), t[i].Data && (s.LastMessage = t[i].Data.message), null == n[s.Id] && (n[s.Id] = s, "__Profit__" == s.Id ? e.senders.unshift(s) : (e.senders.push(s), a[s.ImageId] ? s.image = a[s.ImageId] : s.ImageId && h.getImageData(s.ImageId, 1).then(function (t) {
                    if (t.url)
                        for (var a = 0; a < e.senders.length; a++) e.senders[a].ImageId == t.key && (e.senders[a].image = t.url)
                }))), t[i].Read || t[i].SendMessage || n[s.Id].Unread++
            }
        }
        var a = [];
        K || g.getItem("messages").then(function (e) {
            isNotEmpty(e) && (a = JSON.parse(e), a.length > x && (a = a.splice(a.length - x)))
        })["finally"](function () {
            t(a), J(a)["finally"](function () {
                t(a), g.setItem("messages", JSON.stringify(a)), G(a), e.$broadcast("scroll.refreshComplete")
            })
        })
    }, A.refreshMessages = e.refreshMessages, A.refreshSenders = e.refreshSenders, !ionic.Platform.isAndroid() && window.plugins && window.plugins.speechRecognition && window.plugins.speechRecognition.isRecognitionAvailable(function (t) {
        window.plugins.speechRecognition.hasPermission(function (t) {
            e.speech && (z(e), A.restartSpeech = function () {
                Z = 0, z(e)
            }, A.stopSpeech = function () {
                window.plugins.speechRecognition.stopListening()
            })
        })
    }), e.checkkmdecl = function (t) {
        return isNotEmpty(e.kmcostid) && t.costid == e.kmcostid || t.from || t.to || t.distance > 0
    }, e._typeof = function (e) {
        return typeof e
    }, e.findlabel = function (e, t) {
        if (e.fields)
            for (var a = 0; a < e.fields.length; a++)
                if (e.fields[a].defname == t) return e.fields[a].name;
        return t
    }, e.refreshHomeBullets = function () {
        return "undefined" != typeof cordova && "undefined" != typeof cordova.plugins && checkPlugin("Aucoresdk") && (e.aucoreactive = !0, cordova.plugins.Aucoresdk.refresh(), cordova.plugins.Aucoresdk.getTemplates().then(function (t) {
            null == t || null == t.templates || 0 == t.templates.length || A.loginActive ? (g.setBaseItem("qrregs", "0"), e.qrregs = !1) : (g.setBaseItem("qrregs", "1"), e.qrregs = !0)
        })), e.internetActive = !0, v.testConnection()["finally"](function () {
            e.internetActive = A.internetActive
        }), A.only2FAMode ? void(e.only2FAMode = !0) : (e.only2FAMode = !1, k.getConfig().then(function (t) {
            if (isVersionOrHigher(t, "Profit7")) {
                e.newsubject = !0;
                var a = isVersionOrHigher(t, "Profit11") && (null == LocalStorage.getItem("MutProfiles_4") || null == LocalStorage.getItem("MutProfiles_5") || null == LocalStorage.getItem("MutProfiles_13")),
                    n = -1 != t.modules.indexOf(7) && null == LocalStorage.getItem("DeclProfiles"),
                    o = -1 != t.modules.indexOf(4) && null == LocalStorage.getItem("SubjectProfiles"),
                    i = -1 != t.modules.indexOf(5) && null == LocalStorage.getItem("LeaveProfiles"),
                    s = isVersionOrHigher(t, "Profit12") && null == LocalStorage.getItem("ProjectProfiles"),
                    r = isVersionOrHigher(t, "Profit12") && null == LocalStorage.getItem("EntryLayouts_timesheet"),
                    l = -1 != t.modules.indexOf(5) && null == LocalStorage.getItem("LeaveWithdrawProfiles");
                (n || o || i || a || s || r) && D.getEnvConfig().then(function (e) {
                    e && (e.profileinfo[11] && e.profileinfo[11] > 0 && i && ne.searchProfiles("", 0, $, "leave"), e.profileinfo[62] && e.profileinfo[62] > 0 && l && ne.searchProfiles("", 0, $, "withdraw"), e.profileinfo[27] && e.profileinfo[27] > 0 && n && te.searchProfiles("", 0, $), e.profileinfo[57] && e.profileinfo[57] > 0 && o && ae.getSubjectProfiles(!0, 0, $), e.profileinfo[4] && e.profileinfo[4] > 0 && a && oe.searchProfiles("", 0, $, 4), e.profileinfo[5] && e.profileinfo[5] > 0 && a && oe.searchProfiles("", 0, $, 5), e.profileinfo[13] && e.profileinfo[13] > 0 && a && oe.searchProfiles("", 0, $, 13), e.profileinfo[18] && e.profileinfo[18] > 0 && s && ie.searchProfiles("", 0, $), e.entrylayoutinfo && e.entrylayoutinfo[168] && e.entrylayoutinfo[168] > 0 && r && se.fetchEntryLayouts())
                })
            }
            e.modules = {};
            for (var c = 0; c < t.modules.length; c++) e.modules[t.modules[c]] = !0;
            g.getItem("mycompanysubject").then(function (a) {
                e.employername = a, b.getUser().then(function (a) {
                    e.user = a, ("" == e.employername || null == e.employername) && (e.employername = e.user.employer), e.user.employer_image_id && h.getImageData(e.user.employer_image_id, 1).then(function (t) {
                        e.employerImageUrl = t.url
                    }), F.login(t.pocketChatUser, "private.chat.afaspocket.nl", t.pocketChatToken, function () {
                        A.pocketChatLoggedIn = !0
                    });
                    var n = LocalStorage.getItem("tasksortfield") || "submitdate",
                        o = parseInt(LocalStorage.getItem("tasksortdir") || "-1", 10);
                    (-1 != t.modules.indexOf(1) || -1 != t.modules.indexOf(24)) && (M.clearAllCache(), M.searchTasks("", 0, 76, n, o).then(function (a) {
                        if (e.tasksAvailable = null != a && a.length > 0, isVersionOrHigher(t, "Profit7") && (e.unreadTasks = 0, e.totalTasks = 0, e.flexdectasks = 0, null != a && a.length > 0)) {
                            for (var n = 0; n < a.length && 75 > n; n++) a[n].flex_declaration_id && "BF3F7698210B448CA7BF3E406DCF4CB9" == a[n].guid_task && e.flexdectasks++, a[n].opened || e.unreadTasks++, e.totalTasks++;
                            e.aboveMax = a.length > 75
                        }
                    }))
                })
            }), -1 != t.modules.indexOf(2) && h.executeGet("Pocket_Signals", {
                "static": {
                    fields: "language",
                    values: getLangCode()
                }
            }, 0, 76).then(function (a) {
                e.signalsAvailable = null != a && a.length > 0, isVersionOrHigher(t, "Profit7") && null != a && (e.unreadSignals = Math.min(a.length, 75), e.aboveMaxSignals = a.length > 75)
            }), g.getItem("loginkey").then(function (t) {
                k.getConfig().then(function (a) {
                    if (e.afasgroep = "1" == a.afasgroep && null != t && "L9ZHDJ" == t.toUpperCase() && null != e.user, e.afasgroep) {
                        var n = new Date;
                        n.setHours(0), n.setMinutes(0), n.setSeconds(0);
                        var o = new Date;
                        o.setDate(o.getDate() + 14), o.setHours(23), o.setMinutes(59), o.setSeconds(0);
                        var i = {
                            dynamic: {
                                fields: "Medewerkercode,CursusDatum,CursusDatum",
                                values: e.user.code + "," + getJSONDate(n) + "," + getJSONDate(o),
                                operatortypes: "1,2,3"
                            }
                        };
                        return h.executeGet("Pocket_AFASGROEP_Event_Participants", i, 0, 1).then(function (t) {
                            e.afaseventsAvailable = null != t && t.length > 0
                        })
                    }
                })
            })
        }), void k.getConfig().then(function (t) {
            var a;
            if (e.kmcostid = t.kmcostid, isVersionOrHigher(t, "2016B2PU12") && -1 != t.modules.indexOf(11)) {
                var n = new Date;
                a = {
                    dynamic: {
                        fields: "birth_month,birth_day",
                        values: n.getMonth() + 1 + "," + n.getDate(),
                        operatortypes: "1"
                    }
                }, h.executeGet("Pocket_Employees", a, 0, 1).then(function (a) {
                    var n = !isVersionOrHigher(t, "Profit11") || -1 != t.modules.indexOf(18);
                    e.birthdaytoday = n && null != a && a.length > 0
                })
            }
            if (isVersionOrHigher(t, "2016B2PU10") && -1 != t.modules.indexOf(12) && (e.documentManagementActive = !0, X.getDocuments(1, 0, 76).then(function (a) {
                    e.documentsAvailable = null != a && a.length > 0, isVersionOrHigher(t, "Profit7") && (e.unreadDocs = Math.min(a.length, 75), e.aboveMaxDocs = a.length > 75)
                })), isVersionOrHigher(t, "2018B1PU2") && -1 != t.modules.indexOf(14)) {
                var o = new Date;
                o.setHours(0), o.setMinutes(0);
                var i = new Date;
                i.setHours(23), i.setMinutes(59), a = {
                    dynamic: {
                        fields: "start_datetime,end_datetime",
                        values: getJSONDate(o) + "," + getJSONDate(i),
                        operatortypes: "2,3"
                    }
                }, h.executeGet("Pocket_Appointments", a, 0, 1).then(function (t) {
                    e.appointmentsAvailable = null != t && t.length > 0, window.plugins && window.plugins.calendar && window.plugins.calendar.findEvent(void 0, void 0, void 0, o, i, function (t) {
                        e.appointmentsAvailable |= null != t && t.length > 0
                    })
                })
            } - 1 != t.modules.indexOf(6) && Y.getIllnesses().then(function (t) {
                null != t && t.length > 0 && !t[0].end_datetime ? e.hasIllness = !0 : e.hasIllness = !1
            })
        }))
    }, e.isLandscape() && e.refreshHomeBullets(), e.mayEditAtTask = function (e, t, a) {
        if (t) {
            if (-104 == t.subjecttype && t.flex_declaration_id && t.edittask) return !0;
            if (null != t.profileid && null != t.profiletype && isVersionOrHigher(e, "Profit11")) switch (t.profiletype) {
            case 4:
            case 5:
            case 13:
                return t.submitter == a.person;
            case 27:
                return !0
            }
        }
        return !1
    }, e.doEditAction = function (e) {
        if (e)
            if (e.task && -104 == e.task.subjecttype && e.task.flex_declaration_id && e.task.edittask) a.go("menu.flexdeclaration", {
                action: e,
                fromTask: !0,
                id: e.task.flex_declaration_id
            }, {
                reload: !0
            });
            else switch (e.profiletype) {
            case 4:
            case 5:
            case 13:
                a.go("menu.empmut", {
                    action: e
                }, {
                    reload: !0
                });
                break;
            case 27:
                a.go("menu.editdeclaration", {
                    subjectId: e.subjectid
                }, {
                    reload: !0
                })
            }
    }, e.checkPage = function (t) {
        var a = i.defer();
        return A.only2FAMode ? ("menu.home" == t || "menu.portal" == t || "menu.settings" == t ? a.resolve(t) : a.reject(), a.promise) : "menu.settings" == t ? (a.resolve("menu.settings"), a.promise) : k.getConfig().then(function (a) {
            e.isLandscape() && "menu.home" == t && (t = "menu.tasklist");
            var n = ["menu.tasklist", "menu.signallist", "menu.documents", "menu.agenda", "menu.employees", "menu.availability", "menu.absence", "menu.illness", "menu.placements", "menu.flexdeclarations", "menu.reservations", "menu.dossier", "menu.declarations", "menu.salary"],
                o = {
                    "menu.tasklist": 1,
                    "menu.signallist": 2,
                    "menu.contactlist": 3,
                    "menu.subject": 4,
                    "menu.absence": 5,
                    "menu.illness": 6,
                    "menu.declarations": 7,
                    "menu.salary": 8,
                    "menu.timesheetsweek": 9,
                    "menu.availability": 10,
                    "menu.employees": 11,
                    "menu.documents": 12,
                    "menu.search": 13,
                    "menu.agenda": 14,
                    "menu.illnessmanager": 20,
                    "menu.placements": 22,
                    "menu.dossier": 23,
                    "menu.flexdeclarations": 24,
                    "menu.reservations": 25
                };
            if (!o[t]) return t;
            if (-1 != a.modules.indexOf(o[t])) return t;
            for (var i = 0; i < n.length; i++)
                if (-1 != a.modules.indexOf(o[n[i]])) return n[i];
            return "menu.settings"
        })
    }, e.gotoPage = function (t, n) {
        n || (n = {}), e.$parent && e.$parent.menumode && r.toggleLeft(!1), log("going to page " + t), e.checkPage(t).then(function (i) {
            if (e.isLandscape()) switch (c.nextViewOptions({
                disableAnimate: !0
            }), i) {
            case "menu.home":
            case "menu.tasklist":
                i = "menu.split-tasks.tasklist";
                break;
            case "menu.contactlist":
                i = "menu.split-contacts.contactlist";
                break;
            case "menu.employees":
                i = "menu.split-employees.employees";
                break;
            case "menu.placements":
                i = "menu.split-placements.placements";
                break;
            case "menu.dossier":
                i = "menu.split-dossier.dossier";
                break;
            case "menu.team":
                i = "menu.split-team-employees.employees";
                break;
            case "menu.documents":
                i = "menu.split-documents.documents";
                break;
            case "menu.agenda":
                i = "menu.split-agenda.agenda";
                break;
            case "menu.projects":
                i = "menu.split-projects.projects";
                break;
            case "menu.flexdeclarations":
                i = "menu.split-flexdeclarations.flexdeclarations"
            }
            "menu.home" == t && o(function () {
                c.clearHistory(), c.clearCache()
            }, 100), a.go(i, n, {
                reload: !0
            })
        })
    }, e.showAvailabilityPopup = function (t, a, n, o) {
        function i() {
            e.availPopup = s.alert({
                templateUrl: "modules/app/availabilityPopup.html",
                title: atrans("availability", "Bezetting"),
                scope: e,
                cssClass: "avail-popup"
            })
        }
        "undefined" == typeof e.availability || datediffbyday(a, e.lastAvailStartDate) || datediffbyday(n, e.lastAvailEndDate) || o != e.lastEmployeeId || t != e.lastAvailmode ? (e.lastAvailStartDate = new Date(a.getTime()), e.lastAvailEndDate = new Date(n.getTime()), e.lastEmployeeId = o, e.lastAvailMode = t, y.getAvailability(t, a, n, o).then(function (t) {
            e.availability = t, i()
        })) : i()
    }, e.gotoAvailability = function (t, n) {
        e.availPopup && (e.availPopup.close(), e.availPopup = null), a.go("menu.availability", {
            availability: n,
            index: t
        }, {
            reload: !1
        })
    }, e.toggleMenu = function () {
        r.toggleLeft(), e.menuExposed = r.isOpen()
    }, e.multipledays = function (e, t) {
        return "string" == typeof e && (e = parseDateString(e)), "string" == typeof t && (t = parseDateString(t)), datediffbyday(e, t)
    }, d.registerBackButtonAction(function (t) {
        "menu.home" == c.currentStateName() || "pin" == c.currentStateName() || "login" == c.currentStateName() || "noconnection" == c.currentStateName() ? navigator.app.exitApp() : "pin" == c.backView().stateName ? navigator.app.exitApp() : "createpin" != c.currentStateName() && e.previousPage()
    }, 101), e.previousPage = function () {
        null == c.backView() ? H("menu.home") : null != c.backView() && "menu.search" == c.backView().stateName ? H("menu.search") : "menu.subject" == c.currentStateName() && null != c.backView() && "menu.contact" != c.backView().stateName && "menu.split-contacts.contactlist" != c.backView().stateName && "menu.absence" != c.backView().stateName && "menu.newsubjects" != c.backView().stateName && "menu.declarations" != c.backView().stateName && "menu.dossier" != c.backView().stateName && "menu.project" != c.backView().stateName && "menu.split-projects.projects" != c.backView().stateName ? H("menu.tasklist") : "createpin" == c.backView().stateName ? H("menu.home") : "deeplink" == c.backView().stateName ? H("menu.home") : "menu.tasklist" == c.currentStateName() ? H("menu.home") : "menu.agenda" == c.currentStateName() ? H("menu.home") : "intro" == c.currentStateName() ? H("menu.home") : "menu.declarations" == c.currentStateName() ? H("menu.home") : "menu.documents" == c.currentStateName() ? H("menu.home") : "menu.timesheetsweek" == c.currentStateName() ? H("menu.home") : "menu.absence" == c.currentStateName() ? H("menu.home") : "menu.document" == c.currentStateName() ? H("menu.documents") : c.goBack()
    }, hideKeyboard = function () {
        window.cordova && window.cordova.plugins.Keyboard && cordova.plugins.Keyboard.close()
    }, n.fromTemplateUrl("modules/app/lang.html", {
        scope: e
    }).then(function (t) {
        e.popover = t
    }), g.getItem("messages").then(function (e) {
        if (isNotEmpty(e)) {
            var t = JSON.parse(e);
            t.length > x && (t = t.splice(t.length - x)), J(t)["finally"](function () {
                g.setItem("messages", JSON.stringify(t)), G(t)
            })
        }
    }), e.mdfocus = function (t) {
        e.mdEdit = {}, t && (e.mdEdit[t] = !0)
    }, e.mdedit = function (t, a, n) {
        e.mdText[a] = t[a], e.mdEdit = {}, e.mdEdit[a] = !0
    }, e.mdblur = function (t, a, n) {
        e.mdEdit[a] && (t[a] = n.target.value, t[a] ? e.mdText[a] = mdRender(t[a]) : e.mdText[a] = "", e.mdEdit = {}, t.errorfld && (t.errorfld[a] = ""))
    }, n.fromTemplateUrl("modules/app/popoverfields.html", {
        scope: A
    }).then(function (e) {
        A.popoverFields = e
    }), A.picksearchfield = function (e, t) {
        null == A.searchfieldform.searchfield ? (LocalStorage.removeItem("searchfield_" + A.searchfields.extraParam.fieldId), A.searchfieldform.searchfieldname = null, A.pickModal.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving")) : (LocalStorage.setItem("searchfield_" + A.searchfields.extraParam.fieldId, A.searchfieldform.searchfield), A.searchfieldform.searchfieldname = t.name, A.pickModal.searchPlaceholder = atrans("searchgen", "Zoek op {0}", A.searchfieldform.searchfieldname)), A.closePopoverQueryField()
    }, e.preventTabKeyPress = function (e, t) {
        t && 9 === e.keyCode && e.preventDefault()
    }, e.openPopoverQueryField = function (e, t) {
        A.searchfieldform.searchfield = LocalStorage.getItem("searchfield_" + A.searchfields.extraParam.fieldId), A.pickModal = t, A.popoverFields.show(e)
    }, A.closePopoverQueryField = function () {
        A.popoverFields.hide()
    }, e.openPopover = function (t) {
        e.popover.show(t)
    }, e.closePopover = function () {
        e.popover.hide()
    }, e.switchLanguage = function (n) {
        atransSwitchLanguage(n), e.closePopover(), a.go(a.current, {}, {
            reload: !0
        }), t.location.href = "index.html?t=" + (new Date).getTime()
    }, e.headerClickCount = 0, e.klingon = !1, e.clickHeader = function () {
        e.headerClickCount++, e.headerClickCount > 3 && (e.klingon = !0)
    }, e.openNumpad = function (t) {
        m.fromTemplateUrl("modules/app/numpad_modal.html", {
            scope: e
        }).then(function (a) {
            e.numpad = a, e.numpad.element = t, e.numpad.show()
        })
    }, e.closeNumpad = function () {
        e.numpad.hide(), e.numpad.remove()
    }, e.addNumber = function (t) {
        var a = "" + e.child.form[e.numpad.element];
        "0" == a && (a = ""), a += t, e.child.form[e.numpad.element] = a
    }, e.addPeriod = function () {
        var t = "" + e.child.form[e.numpad.element]; - 1 == t.indexOf(".") && (t += "."), e.child.form[e.numpad.element] = t
    }, e.gotoContact = function (e, t) {
        "undefined" != typeof e && k.getConfig().then(function (n) {
            "undefined" != typeof t ? -1 != n.modules.indexOf(11) && a.go("menu.employee", {
                id: t
            }, {
                reload: !0
            }) : oe.getEmployeeByContact(e).then(function (e) {
                t = e.employee_id
            })["finally"](function () {
                "undefined" == typeof t ? -1 != n.modules.indexOf(3) && a.go("menu.contact", {
                    contactId: e
                }, {
                    reload: !0
                }) : -1 != n.modules.indexOf(11) && a.go("menu.employee", {
                    id: t
                }, {
                    reload: !0
                })
            })
        })
    }, e.removeNumber = function () {
        var t = "" + e.child.form[e.numpad.element],
            a = t.slice(0, -1);
        "" == a && (a = "0"), e.child.form[e.numpad.element] = a
    }, e.showAndLoadImage = function (t, a) {
        h.getImageData(t, a).then(function (t) {
            e.showImage(t.url)
        })
    }, e.showImage = function (t, a) {
        void 0 != t && m.fromTemplateUrl("modules/app/imagezoom.html", {
            scope: e
        }).then(function (n) {
            e.modal = n, A.currentModal = n, e.modal.show(), e.modal.img = t.replace(/(\r\n|\n|\r)/gm, ""), "qr" == a && (e.modal.msg = atrans("qr_message", "Je kunt deze QR-code scannen met een app, zoals:"), ionic.Platform.isAndroid() && (e.modal.url = "https://play.google.com/store/apps/details?id=com.google.zxing.client.android", e.modal.urlname = "Barcode Scanner"), ionic.Platform.isIOS() ? (e.modal.url = "https://itunes.apple.com/us/app/quick-scan-qr-code-reader/id483336864", e.modal.urlname = "Quick Scan - QR Code Reader") : e.modal.msg = "")
        })
    }, e.closeModal = function () {
        A.currentModal = null, e.modal.hide(), e.modal.remove()
    }, e.updateSlideStatus = function () {
        var t = f.$getByHandle("imagezoomScroll").getScrollPosition().zoom;
        t == e.zoomMin ? u.enableSlide(!0) : u.enableSlide(!1)
    }, e.$on("$destroy", function () {
        "undefined" != typeof e.modal && (e.modal.remove(), A.currentModal = null)
    }), e.$on("modal.hidden", function () {}), e.$on("modal.removed", function () {}), e.openUrl = function (e) {
        -1 == e.indexOf(":") && (e = "https://" + e), window.cordova ? cordova.InAppBrowser.open(e, "_system", "location=yes") : t.open(e)
    }, k.getConfig().then(function (t) {
        isVersionOrHigher(t, "2016B2PU12") && (e.messageActive = !0);
        for (var a = 0; a < t.modules.length; a++) e.modules[t.modules[a]] = !0
    }), e.openDoc = function (e, t) {
        k.getConfig().then(function (a) {
            var n = inlineDocType(t.filename);
            return null != n ? e ? h.downloadFile(t, "fileguid", "filename", function () {
                return I.getSession()
            }, !0) : h.downloadFile(t, "fileguid", "filename", void 0, !0) : void 0
        })
    }, e.openTwitter = function (t) {
        t = t.slice(1, t.length);
        var a = "https://twitter.com/" + t;
        e.openUrl(a)
    }, e.hoursText = function (e) {
        return e ? 1 == e ? atrans("hour", "uur") : atrans("hours", "uur") : void 0
    }, e.percentageText = function (e) {
        return "undefined" != typeof e ? e + "%" : void 0
    }, e.percentageColor = function (e) {
        return "undefined" != typeof e ? 34 > e ? "availRed" : 67 > e ? "availYellow" : "availGreen" : void 0
    }, e.percentageColorText = function (e) {
        return "undefined" != typeof e ? 34 > e ? "assertive" : 67 > e ? "energized" : "balanced" : void 0
    }, e.showFileActionsGeneric = function (e, t, a) {
        function n(e) {
            p.getPicture(e).then(function (t) {
                t && -1 != t.indexOf(";base64") ? i(t, t) : (1 == e && checkPlugin("imagesaver") && cordova.plugins.imagesaver.saveImageToGallery(t, function () {
                    log("img saved to gallery")
                }, function (e) {
                    log(e)
                }), window.resolveLocalFileSystemURL(t, function (e) {
                    e.file(function (e) {
                        var a = new FileReader;
                        a.onload = function () {
                            i(t, a.result)
                        }, a.readAsDataURL(e)
                    })
                }))
            })
        }

        function i(n, o) {
            t.form.attachments ? (t.multipleattach || (t.form.attachments = []), t.form.attachments.push({
                src: o,
                type: "img",
                filename: "camera.jpg",
                fileURI: n,
                fileDataUrl: o
            })) : (t.form.fileURI = n, t.form.fileDataUrl = o, t.attachment_type = "img", document.getElementById(e).src = n), document.getElementById("fileBrowser").form.reset(), t.file_attached = !0, a && a()
        }
        if (ionic.Platform.isAndroid()) {
            var s = new Array;
            s.push({
                text: "<i class='icon iconHide'></i>" + atrans("takephoto", "Maak een foto") + "</span>"
            }), s.push({
                text: "<i class='icon iconHide'></i>" + atrans("choosefile", "Kies bestand") + "</span>"
            }), o(function () {
                if (document.body.lastChild && document.body.lastChild.firstChild) {
                    var e = window.getComputedStyle(document.body.lastChild.firstChild);
                    "matrix(1, 0, 0, 1, 0, 0)" != e["-webkit-transform"] && (document.body.lastChild.firstChild.style["-webkit-transform"] = "matrix(1, 0, 0, 1, 0, 0)")
                }
            }, 500), l.show({
                buttons: s,
                titleText: atrans("uploadfoto", "Upload foto"),
                cancelText: atrans("cancel", "Annuleren"),
                cancel: function () {},
                buttonClicked: function (e) {
                    if (0 == e) n(1);
                    else if (1 == e)
                        if (ionic.Platform.isAndroid() && "undefined" != typeof device && checkDeviceVersionLowerThan(6)) n(0);
                        else {
                            var t = document.getElementById("fileBrowser");
                            t.click()
                        } return !0
                }
            })
        } else "undefined" != typeof device && "undefined" != typeof device.model && null != device.model && (device.model.startsWith("iPhone5") || device.model.startsWith("iPhone4")) && checkDeviceVersionLowerThan(9) ? n(1) : document.getElementById("fileBrowser").click()
    }, e.downloadQR = function (t, a, n) {
        e.downloadUrl(serviceUrl + "/qrcode-url?url=" + encodeURIComponent(t[a]), t[n] + ".png")
    }, e.downloadUrl = function (e, t) {
        h.downloadUrl(e, t, !1)
    }, e.dtypenumeric = function (e) {
        return isdtypenumeric(e.dtype)
    }, e.hasValue = function (e, t) {
        return 17 == t.ctype ? e.attachments && 0 != e.attachments.length : isNotEmpty(e[t._key])
    }, e.oneIsVisible = function (e, t) {
        for (var a = 0; a < t.length; a++)
            if (e && e[t[a]] && e[t[a]].visible) return !0;
        return !1
    }, e.checkForOSAttachments = function (e) {
        null != A.attachment && null != e && (e.attachments = [], null == A.attachment.dataURL ? e.attachments.push({
            src: A.attachment.src,
            type: "img",
            filename: A.attachment.filename,
            fileURI: A.attachment.src
        }) : e.attachments.push({
            src: A.attachment.src,
            type: "file",
            filename: A.attachment.filename,
            fileURI: A.attachment.dataURL
        }), e.Ds && (e.Ds = A.attachment.text))
    }, e.change = function (e, t, a) {
        e && (t && t[a] && t[a].inputcorrection && (e[a] = fixInput(e[a], t[a].inputcorrection)), e.screenview && "function" == typeof e.screenview && e.screenview(a, !0), e.errorfld && (e.errorfld[a] = ""))
    }, e.pickDate = function (t, a) {
        var n = e,
            o = null == t[a] ? new Date : t[a];
        B.pickDate(o).then(function (e) {
            t[a] = e, n.change(t, null, a)
        })
    }, e.changeTimeSpan = function (t, a, n) {
        var o = new Date,
            i = e;
        o.setHours(0, t[a] ? t[a] : 0), B.pickTime(getGMTDate(o)).then(function (e) {
            e = fromGMTDate(e), t[a] = 60 * e.getHours() + e.getMinutes(), n && (t[n] = e.getHours() + e.getMinutes() / 60), i.change(t, null, a)
        })
    }, e.pickTime = function (e, t) {
        e[t] = null == e[t] ? getGMTDate(new Date) : e[t], B.pickTime(e[t]).then(function (a) {
            null == e[t] && (e[t] = a), e[t].setHours(fromGMTDate(a).getHours(), fromGMTDate(a).getMinutes()), e[t] = getGMTDate(e[t]), e.screenview && "function" == typeof e.screenview && e.screenview(t, !0)
        })
    }, e.filePickedGeneric = function (e, t, a) {
        function n(e) {
            var n = new FileReader;
            n.onload = function (n) {
                var o = n.target.result;
                a.form.fileDataUrl = o, checkPlugin("imagesaver") && ionic.Platform.isIOS() && cordova.plugins.imagesaver.saveImageToGallery(o, function () {
                    log("img saved to gallery")
                }, function (e) {
                    log(e)
                }), "data:image" == o.split("/")[0] ? (a.file_attached = !0, a.form.attachments ? (a.multipleattach || (a.form.attachments = []), a.form.attachments.push({
                    src: o,
                    type: "img",
                    filename: e.name,
                    file: e
                })) : (document.getElementById(t).src = n.target.result, a.attachment_type = "img"), "$apply" != a.$root.$$phase && "$digest" != a.$root.$$phase && a.$apply()) : (a.file_attached = !0, a.form.attachments ? (a.multipleattach || (a.form.attachments = []), a.form.attachments.push({
                    src: "img/file.png",
                    type: "file",
                    filename: e.name,
                    file: e
                })) : (document.getElementById(t).src = "img/file.png", a.attachment_type = "file"), "$apply" != a.$root.$$phase && "$digest" != a.$root.$$phase && a.$apply())
            }, n.readAsDataURL(e)
        }
        for (var o = 0; o < e.target.files.length; o++) null != e.target.files[o] && n(e.target.files[o])
    };
    var re = {
            taken: "tasks",
            terug: "back",
            home: "home",
            insturen: "submit",
            lees: "read",
            open: "open",
            stop: "stop"
        },
        le = {
            tasks: "tasks",
            back: "back",
            home: "home",
            submit: "submit",
            read: "read",
            open: "open",
            stop: "stop"
        },
        ce = {
            tasks: function (e) {
                W = [], e.gotoPage("menu.tasklist")
            },
            back: function (e) {
                W = [], e.previousPage()
            },
            open: function (e, t) {
                var a, n = [];
                for (a = 1; a < t.length; a++) n.push(t[a].toLowerCase());
                if (Q)
                    for (a = 0; a < Q.length; a++)
                        if (-1 != Q[a].title.toLowerCase().indexOf(n.join(" "))) {
                            Q[a]["goto"](Q[a].param);
                            break
                        }
            },
            stop: function (e) {
                W = []
            },
            home: function (e) {
                W = [], e.gotoPage("menu.home")
            },
            submit: function (e) {
                W = [], e.gotoPage("menu.newsubjects")
            },
            read: function (e) {
                W = [];
                for (var t = 0; t < Q.length; t++) W.push(Q[t].title);
                q()
            }
        }
}]).controller("NoconnectionController", ["$scope", "$stateParams", "$rootScope", "$timeout", function (e, t, a, n) {
    var o = t.type;
    switch (e.connecting = !0, e.updating = !1, o) {
    case "nointernet":
        e.text = atrans("disconnectedText", "Er is geen verbinding met het internet");
        break;
    case "noservices":
        e.text = atrans("noServiceText", "Op dit moment wordt er onderhoud gepleegd aan de services.");
        break;
    case "mustupdate":
        e.connecting = !1, e.updating = ionic.Platform.isAndroid() || ionic.Platform.isIOS(), e.text = appbuildversion + ": " + atrans("mustupdate", "Deze versie van de Pocket App wordt niet meer ondersteund. Installeer de laatste versie.");
        break;
    case "errorssl":
        e.text = atrans("errorSSL", "SSL fout bij benaderen van de services.");
        break;
    case "errorservice":
        e.text = atrans("errorService", "Fout bij benaderen van de services.");
        break;
    default:
        e.text = atrans("errorUnknown", "Onbekende fout bij verbinding")
    }
    e.refresh = function () {
        window.location.replace("index.html?t=" + Date.now())
    }, e.gotoStore = function () {
        ionic.Platform.isAndroid() ? openUrlGlobal("https://play.google.com/store/apps/details?id=nl.afas.pocket2") : ionic.Platform.isIOS() && openUrlGlobal("https://itunes.apple.com/nl/app/afas-pocket-2/id1028433924?mt=8")
    }, void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), n(function () {
        a.blocker && (a.blocker.style.display = "none")
    }, 10)
}]).controller("DeepLinkController", ["$state", "$scope", "$stateParams", "LocalStorageService", "$ionicHistory", "$timeout", "ConfigService", function (e, t, a, n, o, i, s) {
    function r() {
        e.go("menu.home", {}, {
            reload: !0
        })
    }

    function l() {
        n.getBaseItem("pausedOn").then(function (t) {
            ("1" != SessionStorage.getItem("hasEnteredPin") || isNotEmpty(t) && c()) && ("1" != SessionStorage.getItem("hasEnteredPin") || Date.now() - parseInt(t, 10) > timeoutPausePin) ? (SessionStorage.setItem("hasEnteredPin", "0"), e.go("pin", {}, {
                reload: !0
            }), n.removeBaseItem("pausedOn")) : deeplinkfuncs.length > 0 ? deeplinkfuncs.pop()() : r()
        })
    }

    function c() {
        return "login" == o.currentStateName() || "login-otp" == o.currentStateName() || "changepin" == o.currentStateName() || "createpin" == o.currentStateName() || "pinconfirm" == o.currentStateName() || "pin" == o.currentStateName() ? !1 : !0
    }
    switch (a.target) {
    case "subject":
        n.getItem("appUID").then(function (t) {
            "undefined" != typeof t && isNotEmpty(t) ? s.getConfig().then(function (t) {
                null != t && -1 != t.modules.indexOf(1) ? (deeplinkfuncs.push(function () {
                    e.go("menu.home", {}, {
                        reload: !0
                    }), i(function () {
                        e.go("menu.subject", {
                            subjectId: a.targetId,
                            from: "home"
                        }, {
                            reload: !0
                        })
                    }, 500)
                }), l()) : r()
            }) : e.go("login", {}, {
                reload: !0
            })
        });
        break;
    case "contact":
        n.getItem("appUID").then(function (t) {
            "undefined" != typeof t && isNotEmpty(t) ? s.getConfig().then(function (t) {
                null != t && -1 != t.modules.indexOf(3) ? (deeplinkfuncs.push(function () {
                    e.go("menu.home", {}, {
                        reload: !0
                    }), i(function () {
                        e.go("menu.contact", {
                            contactId: a.targetId
                        }, {
                            reload: !0
                        })
                    }, 500)
                }), l()) : r()
            }) : e.go("login", {}, {
                reload: !0
            })
        });
        break;
    case "document":
        n.getItem("appUID").then(function (t) {
            "undefined" != typeof t && isNotEmpty(t) ? s.getConfig().then(function (t) {
                null != t && -1 != t.modules.indexOf(12) ? (deeplinkfuncs.push(function () {
                    e.go("menu.home", {}, {
                        reload: !0
                    }), i(function () {
                        e.go("menu.document", {
                            id: a.targetId,
                            personal: 0
                        }, {
                            reload: !0
                        })
                    }, 500)
                }), l()) : r()
            }) : e.go("login", {}, {
                reload: !0
            })
        })
    }
}]);