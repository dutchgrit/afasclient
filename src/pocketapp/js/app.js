function changelinks(e, t) {
    if (t[0]) {
        for (var n = t[0].getElementsByTagName("a"), o = 0; o < n.length; o++)(n[o].getAttribute("data-url") || n[o].getAttribute("href")) && (n[o].onclick = function () {
            var e = this.getAttribute("data-url");
            (null == e || "" == e) && (e = this.getAttribute("href")), openUrlGlobal(e)
        });
        for (var l = t[0].getElementsByTagName("img"), o = 0; o < l.length; o++) l[o].getAttribute("data-url") && (l[o].onclick = function (t) {
            var n = t.currentTarget;
            e.showImage(n.getAttribute("data-url"))
        });
        for (var a = t[0].getElementsByTagName("button"), o = 0; o < a.length; o++) a[o].getAttribute("data-url") && (a[o].onclick = openUrlGlobal)
    }
}

function openUrlGlobal(e) {
    if ("string" != typeof e) var e = this.getAttribute("data-url");
    isNotEmpty(e) && (0 == e.indexOf("//") && (e = "https:" + e), latestWindow = window.cordova ? cordova.InAppBrowser.open(e, 0 == e.indexOf("file:") ? "_blank" : "_system", "location=no,closebuttoncaption=" + atrans("back", "Terug") + ",EnableViewPortScale=yes") : window.open(e), null != latestWindow && latestWindow.addEventListener("exit", function () {
        latestWindow = null
    }))
}
var smileyRegexp = new RegExp(/(:\))|(:-\))|(:\()|(:-\()|(;\))|(;-\))|(:-O)|(:-o)|(8-\|)|(:P)|(:p)|(:D)|(:d)|(:\|)|(:S)|(:s)|(:\$)|(:@)|(8o\|)|(\+o\()|(\(H\))|(\(h\))|(\(C\))|(\(c\))|(\(\?\))/g),
    deeplinkfuncs = [],
    fingerprintIsBusy = !1,
    appinfo = {},
    app = angular.module("pocket", ["ionic", "AfasServices", "app.controller", "home.controller", "tasks.controller", "signals.controller", "businesscard.controller", "contacts.controller", "absence.controller", "login.controller", "subjects.controller", "agenda.controller", "search.controller", "settings.controller", "availability.controller", "messages.controller", "afasevents.controller", "employees.controller", "declarations.controller", "illness.controller", "salary.controller", "timesheets.controller", "documents.controller", "positions.controller", "pockettalk.controller", "portal.controller", "qrscan.controller", "mycompany.controller", "qlik.controller", "projects.controller", "placement.controller", "dossier.controller", "flexdeclaration.controller", "reservation.controller", "uiGmapgoogle-maps", "ngIOS9UIWebViewPatch", "ngSanitize", "ionic-timepicker", "ionic-datepicker"]).constant("maxMessages", 500).run(["$ionicPlatform", "$ionicPopup", "$window", "$locale", "$state", "$rootScope", "$ionicActionSheet", "$ionicHistory", "$ionicPopover", "$ionicLoading", "$timeout", "$ionicModal", "ConnectorService", "ConnectionService", "LoginService", "LongOperationService", "ConfigService", "UserService", "LocalStorageService", "maxMessages", "$interval", "FileFromOsService", function (e, t, n, o, l, a, r, i, s, c, u, d, m, p, g, f, h, v, w, b, y, S) {
        function k(e) {
            a.$broadcast("keyboardOpenEvent")
        }

        function A() {
            return log("auth received 2FA"), void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), u(function () {
                a.blocker && (a.blocker.style.display = "none")
            }, 10), a.confirming || a.only2FAMode || "1" == SessionStorage.getItem("hasEnteredPin") ? void (a.showingConfirm || (a.showingConfirm = !0, d.fromTemplateUrl("modules/app/aucore.html", {
                scope: a,
                animation: "slide-in-up"
            }).then(function (e) {
                e.show(), e.scope.$on("modal.hidden", function (t) {
                    a.confirming = !1, a.showingConfirm = !1, a.pindelayed && (a.pindelayed = !1, B()), a.homedelayed && (a.homedelayed = !1, C()), e.remove(), a.confirmModal = null
                }), a.confirmModal = e
            }))) : void deeplinkfuncs.push(function () {
                a.homedelayed = !0, A()
            })
        }

        function C() {
            log("go home");
            var e = n.innerWidth > 896 && !a.hasNotch ? "menu.split-tasks.tasklist" : "menu.home";
            l.go(e, {}, {
                reload: !0
            })
        }

        function M() {
            log("enter PMO mode"), a.only2FAMode = !0, deeplinkfuncs.length > 0 && deeplinkfuncs.pop()(), l.go("menu.home", {}, {
                reload: !0
            })
        }

        function B() {
            void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), u(function () {
                a.blocker && (a.blocker.style.display = "none")
            }, 10), log("askforpin");
            var e = "1" == SessionStorage.getItem("loginactive");
            w.getBaseItem("pincode").then(function (t) {
                w.getItem("loginkey").then(function (n) {
                    w.getItem("userid").then(function (o) {
                        w.getItem("token").then(function (a) {
                            w.getBaseItem("pausedOn").then(function (r) {
                                !isNotEmpty(n) || null != a && "" != a && "undefined" != a ? null != n && "" != n || null != a && "" != a ? null == t || "" == t ? l.go("createpin", {}, {
                                    reload: !0
                                }) : "1" != SessionStorage.getItem("hasEnteredPin") || isNotEmpty(r) && I() ? "1" != SessionStorage.getItem("hasEnteredPin") || Date.now() - parseInt(r, 10) > timeoutPausePin ? (SessionStorage.setItem("hasEnteredPin", "0"), l.go("pin", {}, {
                                    reload: !0
                                }), w.removeBaseItem("pausedOn")) : deeplinkfuncs.length > 0 ? deeplinkfuncs.pop()() : l.current && "" != l.current.name || C() : deeplinkfuncs.length > 0 ? deeplinkfuncs.pop()() : (!l.current || "" == l.current.name || "1" == SessionStorage.getItem("hasEnteredPin") && "pin" == l.current.name) && C() : w.getBaseItem("qrregs").then(function (t) {
                                    "1" != t || e ? checkPlugin("Aucoresdk") ? cordova.plugins.Aucoresdk.getTemplates().then(function (t) {
                                        null == t || null == t.templates || 0 == t.templates.length || e ? l.go("login", {}, {
                                            reload: !0
                                        }) : w.setBaseItem("qrregs", "1").then(function () {
                                            M()
                                        })
                                    }, function (e) {
                                        log(e), l.go("login", {}, {
                                            reload: !0
                                        })
                                    }) : l.go("login", {}, {
                                        reload: !0
                                    }) : M()
                                }) : isNotEmpty(o) ? l.go("login-otp", {}, {
                                    reload: !0
                                }) : w.getBaseItem("qrregs").then(function (t) {
                                    "1" != t || e ? l.go("login", {}, {
                                        reload: !0
                                    }) : M()
                                })
                            })
                        })
                    })
                })
            })
        }

        function U() {
            function e() {
                p.testConnectionStart().then(function () {
                    log("connection start " + a.confirming), a.confirming ? a.pindelayed = !0 : B()
                }, function (e) {
                    void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), a.blocker.style.display = "none", checkPlugin("Aucoresdk") ? cordova.plugins.Aucoresdk.getTemplates().then(function (t) {
                        null == t || null == t.templates || 0 == t.templates.length ? l.go("noconnection", {
                            type: e
                        }, {
                            reload: !0
                        }) : M()
                    }, function (e) {
                        log(e)
                    }) : l.go("noconnection", {
                        type: e
                    }, {
                        reload: !0
                    })
                })
            }
            checkPlugin("http") ? (cordova.plugins.http.setRequestTimeout(20), cordova.plugins.http.enableSSLPinning(!0, function () {
                log("ssl pinning active"), e()
            }, function () {
                log("ssl pinning not active"), e()
            })) : e()
        }

        function I() {
            return "login" == i.currentStateName() || "login-otp" == i.currentStateName() || "changepin" == i.currentStateName() || "createpin" == i.currentStateName() || "pinconfirm" == i.currentStateName() || "pin" == i.currentStateName() ? !1 : !0
        }
        log("run"), a.nodeviceregistered = !0, a.confirming = -1 != window.location.href.indexOf("2FA"), a.showingConfirm = !1, a.pindelayed = !1, a.pushPermission = !1, a.editBusy = !1, a.delayTimeout = null, a.hasNotch = !1, a.blocker = document.getElementById("blocker"), a.setDelayPinTimeout = function () {
            null == a.delayTimeout && (a.delayTimeout = u(function () {
                a.delayTimeout = null, a.confirming = !1, a.showingConfirm || a.pindelayed && (a.pindelayed = !1, B())
            }, 2e3))
        }, a.confirming && a.setDelayPinTimeout(), document.addEventListener("deviceready", function () {
            if (window.Keyboard) try {
                window.Keyboard.hideFormAccessoryBar(!1)
            } catch (e) { }
            if (ionic.Platform.isIOS()) {
                var n = !1;
                "undefined" != typeof window.device && (n = window.device.model && -1 != window.device.model.indexOf("iPhone10") || -1 != window.device.model.indexOf("iPhone11") || -1 != window.device.model.indexOf("iPhone12")), a.hasNotch = n
            }
            appinfo = {},
                appinfo.ip = SessionStorage.getItem("client-ip"),
                appinfo.platform = ionic.Platform.platform(), 
                "undefined" != typeof window.device && (appinfo.devicemodel = window.device.model, appinfo.devicemanufacturer = window.device.manufacturer), 
                appinfo.appbuildversion = appbuildversion, 
                w.getItem("config").then(function (e) {
                    w.getItem("loginkey").then(function (t) {
                        w.getItem("appUID").then(function (n) {
                            w.getItem("userid").then(function (o) {
                                if (appinfo.userid = o, isNotEmpty(t) && (appinfo.loginkey = t.toUpperCase()), appinfo.appUID = n, isNotEmpty(e)) {
                                    var l = JSON.parse(e);
                                    appinfo.profitversion = l.techversion
                                }
                            })
                        })
                    })
                }), log("device ready"), checkPlugin("Aucoresdk") && (log("aucore init"), cordova.plugins.Aucoresdk.setAuthCallback(A), log("aucore authcallback"), cordova.plugins.Aucoresdk.setConfirmCallback(function () { }), cordova.plugins.Aucoresdk.refresh().then(function () {
                    log("aucore refreshed")
                }, function (e) {
                    log(e)
                })), a.startup = U, "undefined" != typeof PushNotification && (PushNotification.hasPermission(function (e) {
                    a.pushPermission = e.isEnabled
                }), a.push = PushNotification.init({
                    android: {
                        clearBadge: !0,
                        clearNotifications: !0,
                        icon: "ic_stat_name",
                        iconColor: "#2c6cbf"
                    },
                    ios: {
                        alert: "true",
                        badge: !0,
                        sound: "true",
                        clearBadge: !0,
                        categories: {
                            accept2FA: {
                                yes: {
                                    callback: "accept2FACallback",
                                    title: atrans("accept", "Accepteren"),
                                    foreground: !1,
                                    destructive: !1,
                                    authenticationRequired: !0
                                },
                                no: {
                                    callback: "reject2FACallback",
                                    title: atrans("reject", "Weigeren"),
                                    foreground: !1,
                                    destructive: !0,
                                    authenticationRequired: !0
                                }
                            }
                        }
                    }
                }), a.push && (a.push.on("registration", function (e) {
                    a.nodeviceregistered = !1, w.getBaseItem("push-token").then(function (t) {
                        ("" == t || null == t || t != e.registrationId) && v.refresh(), log("pushreg " + e.registrationId), w.setBaseItem("push-token", e.registrationId)
                    })
                }), a.push.on("notification", function (e) {
                    log("notification"), e.additionalData && "AOL2FA" == e.additionalData.source && (log("notification 2FA"), a.confirming = !0, a.setDelayPinTimeout(), checkPlugin("Aucoresdk") && (cordova.plugins.Aucoresdk.setAuthCallback(A), cordova.plugins.Aucoresdk.refresh().then(function () { }, function (e) {
                        log(e)
                    })));
                    var t = [];
                    w.getItem("appUID").then(function (n) {
                        w.getItem("messages").then(function (e) {
                            isNotEmpty(e) && (t = JSON.parse(e), t.length > b && (t = t.splice(t.length - b)))
                        })["finally"](function () {
                            if (e.additionalData && e.additionalData.AppUID == n && null != n) {
                                for (var o = !0, l = 0; l < t.length; l++) {
                                    if (t[l].Data && t[l].Data.additionalData && t[l].Data.additionalData.Guid == e.additionalData.Guid) {
                                        o = !1;
                                        break
                                    } - 1 != message[l].Data.message.indexOf("__COMMA__") && (message[l].Data.message = message[l].Data.message.replace(/__COMMA__/g, ","))
                                }
                                if (o) {
                                    var r = new Date(Date.parse(e.additionalData.Timestamp));
                                    r = getGMTDate(r), t.push({
                                        Data: e,
                                        Read: !1,
                                        SendMessage: !1,
                                        Date: r
                                    })
                                }
                                w.setItem("messages", JSON.stringify(t))["finally"](function () {
                                    a.refreshMessages && a.refreshMessages(), a.refreshSenders && a.refreshSenders()
                                })
                            }
                            a.push.finish && a.push.finish(function () { }, function () { }, e.additionalData.notId)
                        })
                    })
                }), window.accept2FACallback = function (e) {
                    log("accept 2FA Callback"), checkPlugin("Aucoresdk") && (cordova.plugins.Aucoresdk.setAuthCallback(function () {
                        u(function () {
                            cordova.plugins.Aucoresdk.confirm(!0).then(function (e) {
                                log("true confirmation sent " + e)
                            }), cordova.plugins.Aucoresdk.setAuthCallback(A)
                        }, 10)
                    }), cordova.plugins.Aucoresdk.refresh())
                }, window.accept2FA = function (e) {
                    log("accept 2FA"), window.accept2FACallback(e)
                }, window.reject2FACallback = function (e) {
                    log("reject 2FA Callback"), checkPlugin("Aucoresdk") && (cordova.plugins.Aucoresdk.setAuthCallback(function () {
                        u(function () {
                            cordova.plugins.Aucoresdk.confirm(!1).then(function (e) {
                                log("false confirmation sent " + e)
                            })
                        }, 10)
                    }), cordova.plugins.Aucoresdk.refresh())
                }, window.reject2FA = function (e) {
                    log("reject 2FA"), window.reject2FACallback(e)
                }, a.push.on("reject2FACallback", window.reject2FACallback), a.push.on("accept2FACallback", window.accept2FACallback))), (ionic.Platform.isAndroid || ionic.Platform.isIOS) && (cordova && cordova.openwith && (cordova.openwith.init(function () { }, function (e) { }), cordova.openwith.addHandler(function (e) {
                    log("openwith handler called"), e.items.length > 0 ? cordova.openwith.load(e.items[0], function (e, t) {
                        var n = getFilenameFromItem(t);
                        "" != n && null != n && (S.add(e, t.type, t.text, n), w.getItem("appUID").then(function (e) {
                            "undefined" != typeof e && isNotEmpty(e) ? h.getConfig().then(function (e) {
                                null != e && -1 != e.modules.indexOf(4) ? (deeplinkfuncs.push(function () {
                                    l.go("menu.home", {}, {
                                        reload: !0
                                    }), u(function () {
                                        a.showingConfirmFile || (a.showingConfirmFile = !0, d.fromTemplateUrl("modules/app/filefromos.html", {
                                            scope: a,
                                            animation: "slide-in-up"
                                        }).then(function (e) {
                                            e.show(), e.scope.$on("modal.hidden", function (t) {
                                                a.showingConfirmFile = !1, a.fileConfirmModal = null, e.remove()
                                            }), a.fileConfirmModal = e
                                        }))
                                    }, 100)
                                }), U()) : C()
                            }) : l.go("login", {}, {
                                reload: !0
                            })
                        }))
                    }) : e.exit && cordova.openwith.exit()
                })), "undefined" != typeof IonicDeeplink && IonicDeeplink.route({
                    "/subject/:subjectId": {
                        target: "subject"
                    },
                    "/document/:documentId": {
                        target: "document"
                    },
                    "/contact/:contactId": {
                        target: "contact"
                    },
                    "/register/:loginKey/:userId": {
                        target: "key"
                    },
                    "/enterotp/:otp": {
                        target: "otp"
                    },
                    "/2FA": {
                        target: "2FA"
                    },
                    "/flexdeclaration/:taskId": {
                        target: "flexdeclaration"
                    }
                }, function (e) {
                    function n(e, n, o) {
                        w.getItem("loginkey").then(function (a) {
                            w.getItem("appUID").then(function (r) {
                                "undefined" != typeof r && isNotEmpty(r) ? LocalStoragePrefixes.length > 1 && e.$link.queryString && a.toLowerCase() != e.$link.queryString.toLowerCase() ? (deeplinkfuncs.push(function () {
                                    l.go("menu.home", {}, {
                                        reload: !0
                                    }), t.alert({
                                        title: atrans("error", "Foutmelding"),
                                        template: atrans("switchenvitem", "Dit item kan niet worden geopend in deze omgeving. Wissel eerst naar de juiste omgeving.")
                                    })
                                }), U()) : h.getConfig().then(function (e) {
                                    null != e && -1 != e.modules.indexOf(n) ? (deeplinkfuncs.push(function () {
                                        l.go("menu.home", {}, {
                                            reload: !0
                                        }), u(o, 500)
                                    }), U()) : U()
                                }) : l.go("login", {}, {
                                    reload: !0
                                })
                            })
                        })
                    }
                    switch (e.$route.target) {
                        case "2FA":
                            a.confirming = !0, a.setDelayPinTimeout();
                            break;
                        case "key":
                            w.getItem("token").then(function (t) {
                                var n = decodeURIComponent(e.$args.userId),
                                    o = decodeURIComponent(e.$args.loginKey);
                                (null == t || "" == t) && "" != n && "" != o && (w.setItem("loginkey", o), w.setItem("userid", n), m.requestOTP(n.trim(), o.trim()).then(function () {
                                    l.go("login-otp", {}, {
                                        reload: !0
                                    })
                                }))
                            });
                            break;
                        case "otp":
                            SessionStorage.setItem("otp", e.$args.otp), l.go("login", {}, {
                                reload: !0
                            });
                            break;
                        case "subject":
                            n(e, 12, function () {
                                l.go("menu.subject", {
                                    subjectId: e.$args.subjectId,
                                    from: "home"
                                }, {
                                    reload: !0
                                })
                            });
                            break;
                        case "contact":
                            n(e, 3, function () {
                                l.go("menu.contact", {
                                    contactId: e.$args.contactId
                                }, {
                                    reload: !0
                                })
                            });
                            break;
                        case "document":
                            n(e, 12, function () {
                                l.go("menu.document", {
                                    id: e.$args.documentId,
                                    personal: 0
                                }, {
                                    reload: !0
                                })
                            });
                            break;
                        case "flexdeclaration":
                            n(e, 24, function () {
                                l.go("menu.flexdeclaration", {
                                    id: e.$args.taskId,
                                    fromTask: !0
                                }, {
                                    reload: !0
                                })
                            })
                    }
                }, function (e) {
                    e.$link && log(e.$link.url)
                }))
        }), document.addEventListener("pause", function () {
            log("pause"), fingerprintIsBusy = !1, null != latestWindow && (latestWindow.close(), latestWindow = null), w.setBaseItem("pausedOn", Date.now() + (a.editBusy ? timeoutBusyEdit : 0)), a.refreshInt && (y.cancel(a.refreshInt), a.refreshInt = null), a.currentModal && (a.currentModal.remove(), a.currentModal), a.fileConfirmModal && (a.fileConfirmModal.remove(), a.fileConfirmModal = null), a.confirmModal && (a.confirmModal.remove(), a.confirmModal = null), a.stopSpeech && a.stopSpeech(), void 0 !== navigator.splashscreen && navigator.splashscreen.show(), a.blockTimeOut && (u.cancel(a.blockTimeOut), a.blockTimeOut = null), a.blockTimeOut = u(function () {
                a.blocker && (a.blocker.style.display = "")
            }, 30)
        }), document.addEventListener("online", function () {
            navigator.connection.getInfo(function (e) {
                navigator.connection.type = e
            })
        }), document.addEventListener("offline", function () {
            navigator.connection.getInfo(function (e) {
                navigator.connection.type = e
            })
        }), document.addEventListener("resume", function () {
            log("from resume"), navigator.connection.getInfo(function (e) {
                navigator.connection.type = e
            }), checkPlugin("Aucoresdk") && (log("aucore resume"), cordova.plugins.Aucoresdk.setAuthCallback(A), cordova.plugins.Aucoresdk.refresh().then(function () {
                log("aucore refreshed resume")
            }, function (e) {
                log(e)
            })), "1" != SessionStorage.getItem("qrscannerprepare") ? U() : (void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), a.blockTimeOut && (u.cancel(a.blockTimeOut), a.blockTimeOut = null), u(function () {
                a.blocker && (a.blocker.style.display = "none")
            }, 10)), a.restartSpeech && a.restartSpeech()
        }), a.envsel = LocalStoragePrefixes[CurrentPrefix], a.envs = LocalStoragePrefixes, a.multipleenv = LocalStoragePrefixes.length > 1, a.changeEnv = function (e) {
            a.envsel = e;
            for (var t = 0; t < LocalStoragePrefixes.length; t++)
                if (LocalStoragePrefixes[t].id == a.envsel.id) return void (t != CurrentPrefix && (switchLocalStorage(t), n.location.href = "index.html?t=" + (new Date).getTime()))
        }, a.openEnvPopover = function (e) {
            s.fromTemplateUrl("modules/app/popoverenvs.html", {
                scope: a
            }).then(function (t) {
                t.show(e)
            })
        }, void 0 != LocalStorage.getItem("language-locale", !0) && angular.copy(locales[window.currentLanguage], o), window.addEventListener("native.keyboardshow", k), a.gotoNewSubject = function () {
            a.showingConfirmFile = !1, a.fileConfirmModal && (a.fileConfirmModal.remove(), a.fileConfirmModal = null), l.go("menu.newsubjects", {}, {
                reload: !0
            })
        }, a.gotoNewDeclaration = function () {
            a.showingConfirmFile = !1, a.fileConfirmModal && (a.fileConfirmModal.remove(), a.fileConfirmModal = null), l.go("menu.declarations", {}, {
                reload: !0
            })
        }, a.confirmAucore = function (e) {
            a.showingConfirm = !1, checkPlugin("Aucoresdk") && cordova.plugins.Aucoresdk.confirm(e), a.confirmModal && (a.confirmModal.remove(), a.confirmModal = null), a.confirming = !1, a.pindelayed && (a.pindelayed = !1, B()), a.homedelayed && (a.homedelayed = !1, C())
        }, log("before ready"), e.ready(function () {
            log("ready"), "undefined" != typeof cordova && "undefined" != typeof StatusBar && (ionic.Platform.isAndroid() ? StatusBar.backgroundColorByHexString("#2c6cbf") : StatusBar.backgroundColorByHexString("#2c6cbf")), null == window.currentLanguage && ("undefined" != typeof navigator.globalization ? navigator.globalization.getLocaleName(function (e) {
                switch (e.value) {
                    case "en_US":
                    case "en_UK":
                        window.currentLanguage = "en-us";
                        break;
                    case "fr_FR":
                    case "fr_BE":
                        window.currentLanguage = "fr-fr";
                        break;
                    case "nl_BE":
                        window.currentLanguage = "nl-be";
                        break;
                    default:
                        window.currentLanguage = "nl-nl"
                }
                LocalStorage.setItem("language-locale", window.currentLanguage, !0), angular.copy(locales[window.currentLanguage], o)
            }, function () {
                window.currentLanguage = "nl-nl", LocalStorage.setItem("language-locale", window.currentLanguage, !0), angular.copy(locales[window.currentLanguage], o)
            }) : (window.currentLanguage = "nl-nl", LocalStorage.setItem("language-locale", window.currentLanguage, !0), angular.copy(locales[window.currentLanguage], o))), a.language = window.currentLanguage, log("connection test"), U()
        }), a.$on("$stateChangeStart", function (e, n, o, r, s) {
            return w.getItem("loginkey").then(function (o) {
                return w.getItem("userid").then(function (r) {
                    return w.getItem("token").then(function (s) {
                        if (a.editBusy = n.editState, n.mustBeAuthenticated) return v.getUser().then(function (e) {
                            if ("undefined" == typeof e || null == e) {
                                var n = {
                                    title: atrans("error", "Foutmelding"),
                                    cssClass: "afaserrorpopup",
                                    buttons: [{
                                        text: atrans("gotosettings", "Ga naar instellingen"),
                                        type: "button-positive",
                                        onTap: function (e) {
                                            i.clearHistory(), l.go("menu.settings", {}, {
                                                reload: !0
                                            })
                                        }
                                    }],
                                    template: atrans("nouserdatafound", "Geen actuele gebruiker gegevens gevonden, je hebt nu enkel toegang tot de instellingen.")
                                };
                                t.show(n)
                            }
                        }), isNotEmpty(o) && null != s && "undefined" != s && "" != s ? !0 : (e.preventDefault(), !1);
                        if (n.mustHaveRequested) return null != r && null != o ? !0 : (e.preventDefault(), !1);
                        if ("undefined" != typeof n.configModule) {
                            var c;
                            h.getConfig().then(function (t) {
                                return c = t, null == c || -1 == c.modules.indexOf(n.configModule) ? (e.preventDefault(), !1) : void 0
                            })
                        }
                        return !0
                    })
                })
            })
        })
    }]).config(["$stateProvider", "$compileProvider", "$ionicConfigProvider", "uiGmapGoogleMapApiProvider", "$provide", "LocalStorageServiceProvider", "ionicTimePickerProvider", "ionicDatePickerProvider", "$sceDelegateProvider", function (e, t, n, o, l, a, r, i, s) {
        s.resourceUrlWhitelist(["self", "https://sense-demo.qlik.com/**"]), t.imgSrcSanitizationWhitelist(/^\s*(https?|file|content|blob|ms-appx|ms-appx-web|x-wmapp0|ionic):|data:image\/|data:application\/octet-stream/), t.aHrefSanitizationWhitelist(/^\s*(https?|mailto|tel|file|ionic|sms|geo):/), n.backButton.previousTitleText(!1), n.backButton.text(atrans("Back", "Terug"));
        var c = {
            format: 24,
            step: 1,
            setLabel: atrans("ok", "OK"),
            closeLabel: atrans("cancel", "Annuleren")
        };
        r.configTimePicker(c);
        var u = {
            setLabel: atrans("ok", "OK"),
            todayLabel: atrans("today", "vandaag"),
            closeLabel: atrans("cancel", "Annuleren"),
            mondayFirst: !0,
            weeksList: [atrans("SundayShort", "~AppZondagKort~Z"), atrans("MondayShort", "~AppMaandagKort~M"), atrans("TuesdayShort", "~AppDinsdagKort~D"), atrans("WednesdayShort", "~AppWoensdagKort~W"), atrans("ThursdayShort", "~AppDonderdagKort~D"), atrans("FridayShort", "~AppVrijdagKort~V"), atrans("SaturdayShort", "~AppZaterdagKort~Z")],
            monthsList: [atrans("january", "januari"), atrans("february", "februari"), atrans("march", "maart"), atrans("april", "april"), atrans("may", "mei"), atrans("june", "juni"), atrans("july", "juli"), atrans("augustus", "augustus"), atrans("september", "september"), atrans("october", "oktober"), atrans("november", "november"), atrans("december", "december")],
            templateType: "popup",
            dateFormat: "dd MMMM yyyy",
            closeOnSelect: !0
        };
        i.configDatePicker(u), ionic.Platform.ready(function () {
            var e = a.$get();
            e.getItem("config").then(function (e) {
                if (isNotEmpty(e)) {
                    var t = JSON.parse(e);
                    o.configure({
                        libraries: "places",
                        key: t.googlemapikey,
                        language: window.currentLanguage
                    })
                } else o.configure({
                    libraries: "places",
                    language: window.currentLanguage
                })
            })
        }), n.views.forwardCache(!1), ionic.Platform.isIOS() ? n.views.transition("ios") : n.views.transition("android"), e.state("menu", {
            url: "/menu",
            "abstract": !0,
            templateUrl: "modules/app/menu.html",
            controller: "AppController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.home", {
            url: "/home",
            templateUrl: "modules/home/home.html",
            controller: "HomeController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("noconnection", {
            url: "/noconnection/:type",
            templateUrl: "modules/app/noconnection.html",
            controller: "NoconnectionController",
            mustBeAuthenticated: !1,
            editState: !1
        }).state("menu.mycompany", {
            url: "/mycompany",
            templateUrl: "modules/mycompany/mycompany.html",
            controller: "MyCompanyController",
            mustBeAuthenticated: !0,
            configModule: 16,
            editState: !1
        }).state("menu.messages", {
            url: "/messages",
            templateUrl: "modules/messages/messages.html",
            controller: "MessagesController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.newmessage", {
            url: "/newmessage",
            templateUrl: "modules/messages/newmessage.html",
            controller: "NewMessageController",
            mustBeAuthenticated: !0,
            editState: !0
        }).state("menu.messageboard", {
            url: "/messageboard",
            params: {
                sender: null
            },
            templateUrl: "modules/messages/messageboard.html",
            controller: "MessageBoardController",
            mustBeAuthenticated: !0,
            editState: !0
        }).state("menu.signallist", {
            url: "/signallist",
            templateUrl: "modules/signals/signals.html",
            controller: "SignalsController",
            mustBeAuthenticated: !0,
            configModule: 2,
            editState: !1
        }).state("menu.contactlist", {
            url: "/contactlist",
            templateUrl: "modules/contacts/contacts.html",
            controller: "ContactsController",
            mustBeAuthenticated: !0,
            configModule: 3,
            editState: !1
        }).state("menu.contact", {
            url: "/contact/:contactId",
            templateUrl: "modules/contacts/contact.html",
            controller: "ContactController",
            mustBeAuthenticated: !0,
            configModule: 3,
            editState: !1
        }).state("menu.split-contacts", {
            url: "/splitview",
            templateUrl: "modules/contacts/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-contacts.contactlist", {
            url: "/contactlist",
            views: {
                "contacts-master": {
                    templateUrl: "modules/contacts/contacts.html",
                    controller: "ContactsController",
                    mustBeAuthenticated: !0,
                    configModule: 3,
                    editState: !1
                },
                "contacts-detail": {
                    templateUrl: "modules/contacts/contact.html",
                    controller: "ContactController",
                    mustBeAuthenticated: !0,
                    configModule: 3,
                    editState: !1
                }
            }
        }).state("menu.search", {
            url: "/search",
            templateUrl: "modules/search/search.html",
            controller: "SearchController",
            mustBeAuthenticated: !0,
            configModule: 13,
            editState: !0
        }).state("menu.illness", {
            url: "/illness",
            template: "<ion-nav-view></ion-nav-view>",
            mustBeAuthenticated: !0,
            configModule: 6,
            editState: !0
        }).state("menu.illness.overview", {
            url: "/overview",
            params: {
                manager: !1
            },
            templateUrl: "modules/illness/illness.html",
            controller: "IllnessController",
            mustBeAuthenticated: !0,
            configModule: 6,
            editState: !0
        }).state("menu.illnessmanager", {
            url: "/manager",
            templateUrl: "modules/illness/illnessmanager.html",
            controller: "IllnessManagerController",
            mustBeAuthenticated: !0,
            configModule: 20,
            editState: !1
        }).state("menu.illnessmanagerdetails", {
            url: "/details",
            params: {
                illness: null
            },
            templateUrl: "modules/illness/illnessdetails.html",
            controller: "IllnessDetailsController",
            mustBeAuthenticated: !0,
            configModule: 20,
            editState: !0
        }).state("menu.absence", {
            url: "/absence",
            templateUrl: "modules/absence/absence.html",
            controller: "AbsenceController",
            mustBeAuthenticated: !0,
            configModule: 5
        }).state("menu.absencedetails", {
            url: "/absencedetails/:subjectid/:recordnumber",
            templateUrl: "modules/absence/absencedetails.html",
            controller: "AbsenceDetailsController",
            mustBeAuthenticated: !0,
            configModule: 5,
            editState: !1
        }).state("menu.newabsence", {
            url: "/absence/newabsence",
            params: {
                leaveprofile: null
            },
            templateUrl: "modules/absence/newabsence.html",
            controller: "NewAbsenceController",
            mustBeAuthenticated: !0,
            configModule: 5,
            editState: !0
        }).state("menu.declarations", {
            url: "/declarations",
            templateUrl: "modules/declarations/declarations.html",
            controller: "DeclarationsController",
            mustBeAuthenticated: !0,
            configModule: 7,
            editState: !1
        }).state("menu.declarationdetails", {
            url: "/declarationdetails/:subjectId",
            templateUrl: "modules/declarations/declarationdetails.html",
            controller: "DeclarationDetailsController",
            mustBeAuthenticated: !0,
            configModule: 7,
            editState: !1
        }).state("menu.newdeclaration", {
            url: "/declarations/new/:type/:distance/:from/:to/:retour",
            params: {
                declprofile: null
            },
            templateUrl: "modules/declarations/neweditdeclaration.html",
            controller: "NewEditDeclarationController",
            mustBeAuthenticated: !0,
            cache: !1,
            configModule: 7,
            editState: !0
        }).state("menu.editdeclaration", {
            url: "declarations/edit",
            params: {
                subjectId: 0
            },
            templateUrl: "modules/declarations/neweditdeclaration.html",
            controller: "NewEditDeclarationController",
            mustBeAuthenticated: !0,
            cache: !1,
            configModule: 7,
            editState: !0
        }).state("menu.availability", {
            url: "/availability",
            params: {
                availability: null,
                index: 0
            },
            templateUrl: "modules/availability/availability.html",
            controller: "AvailabilityController",
            mustBeAuthenticated: !0,
            configModule: 10,
            editState: !1
        }).state("menu.dossier", {
            url: "/dossier",
            templateUrl: "modules/dossier/dossier.html",
            controller: "DossierController",
            mustBeAuthenticated: !0,
            configModule: 23,
            editState: !1
        }).state("menu.split-dossier", {
            url: "/splitview",
            templateUrl: "modules/dossier/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-dossier.dossier", {
            url: "/dossier",
            views: {
                "dossier-master": {
                    templateUrl: "modules/dossier/dossier.html",
                    controller: "DossierController",
                    mustBeAuthenticated: !0,
                    configModule: 23,
                    editState: !1
                },
                "dossier-detail": {
                    templateUrl: "modules/subjects/subject.html",
                    controller: "SubjectController",
                    mustBeAuthenticated: !0,
                    configModule: 4,
                    editState: !1
                }
            }
        }).state("menu.placements", {
            url: "/placements",
            templateUrl: "modules/placements/placements.html",
            controller: "PlacementsController",
            mustBeAuthenticated: !0,
            configModule: 22,
            editState: !1
        }).state("menu.placement", {
            url: "/placement",
            params: {
                placementId: null,
                mode: 0
            },
            templateUrl: "modules/placements/placement.html",
            controller: "PlacementController",
            mustBeAuthenticated: !0,
            configModule: 22,
            editState: !1
        }).state("menu.split-placements", {
            url: "/splitview",
            templateUrl: "modules/placements/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-placements.placements", {
            url: "/placements",
            views: {
                "placements-master": {
                    templateUrl: "modules/placements/placements.html",
                    controller: "PlacementsController",
                    mustBeAuthenticated: !0,
                    configModule: 22,
                    editState: !1
                },
                "placements-detail": {
                    templateUrl: "modules/placements/placement.html",
                    controller: "PlacementController",
                    params: {
                        placementId: null,
                        mode: 0
                    },
                    mustBeAuthenticated: !0,
                    configModule: 22,
                    editState: !1
                }
            }
        }).state("menu.flexdeclarations", {
            url: "/flexdeclarations",
            templateUrl: "modules/flexdeclarations/flexdeclarations.html",
            controller: "FlexdeclarationsController",
            mustBeAuthenticated: !0,
            configModule: 24,
            editState: !1
        }).state("menu.flexdeclaration", {
            url: "/flexdeclaration",
            params: {
                id: null,
                code: null,
                mode: 0,
                year: 0,
                period: 0,
                periodtable: 0,
                editmode: !1,
                readonly: !1,
                placement: null,
                action: null,
                fromTask: !1
            },
            templateUrl: "modules/flexdeclarations/flexdeclaration.html",
            controller: "FlexdeclarationRearowsController",
            mustBeAuthenticated: !0,
            configModule: 24,
            editState: !1
        }).state("menu.split-flexdeclarations", {
            url: "/splitview",
            templateUrl: "modules/flexdeclarations/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-flexdeclarations.flexdeclarations", {
            url: "/flexdeclarations",
            views: {
                "flexdeclarations-master": {
                    templateUrl: "modules/flexdeclarations/flexdeclarations.html",
                    controller: "FlexdeclarationsController",
                    mustBeAuthenticated: !0,
                    configModule: 24,
                    editState: !1
                },
                "flexdeclarations-detail": {
                    templateUrl: "modules/flexdeclarations/flexdeclaration.html",
                    params: {
                        id: null,
                        mode: 0,
                        year: 0,
                        period: 0,
                        editmode: !1,
                        readonly: !1,
                        placement: null
                    },
                    controller: "FlexdeclarationRearowsController",
                    mustBeAuthenticated: !0,
                    configModule: 24,
                    editState: !1
                }
            }
        }).state("menu.reservations", {
            url: "/reservations",
            templateUrl: "modules/reservations/reservations.html",
            controller: "ReservationsController",
            mustBeAuthenticated: !0,
            configModule: 25,
            editState: !1
        }).state("menu.employees", {
            url: "/employees",
            templateUrl: "modules/employees/whoiswho.html",
            controller: "EmployeesController",
            mustBeAuthenticated: !0,
            configModule: 11,
            editState: !1
        }).state("menu.team", {
            url: "/team/:id",
            templateUrl: "modules/employees/team.html",
            controller: "TeamController",
            mustBeAuthenticated: !0,
            configModule: 11,
            editState: !1
        }).state("menu.split-team-employees", {
            url: "/team-splitview",
            templateUrl: "modules/employees/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-team-employees.employees", {
            url: "/employees/:id",
            views: {
                "employees-master": {
                    templateUrl: "modules/employees/team.html",
                    controller: "TeamController",
                    mustBeAuthenticated: !0,
                    configModule: 11,
                    editState: !1
                },
                "employees-detail": {
                    templateUrl: "modules/employees/employee.html",
                    controller: "EmployeeController",
                    mustBeAuthenticated: !0,
                    configModule: 11,
                    editState: !1
                }
            }
        }).state("menu.employee", {
            url: "/employee/:id",
            templateUrl: "modules/employees/employee.html",
            controller: "EmployeeController",
            mustBeAuthenticated: !0,
            configModule: 11,
            editState: !1
        }).state("menu.split-employees", {
            url: "/splitview",
            templateUrl: "modules/employees/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-employees.employees", {
            url: "/employees",
            views: {
                "employees-master": {
                    templateUrl: "modules/employees/whoiswho.html",
                    controller: "EmployeesController",
                    mustBeAuthenticated: !0,
                    configModule: 11,
                    editState: !1
                },
                "employees-detail": {
                    templateUrl: "modules/employees/employee.html",
                    controller: "EmployeeController",
                    mustBeAuthenticated: !0,
                    configModule: 11,
                    editState: !1
                }
            }
        }).state("menu.afasevents", {
            url: "/afasevents",
            templateUrl: "modules/afasevents/afasevents.html",
            controller: "AfasEventsController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.afas", {
            url: "/afas",
            templateUrl: "modules/afasevents/afas.html",
            controller: "AfasController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.qlik", {
            url: "/qlik",
            templateUrl: "modules/qlik/qlik.html",
            controller: "QlikController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.pockettalk", {
            url: "/pockettalk",
            templateUrl: "modules/pockettalk/pockettalk.html",
            controller: "PocketTalkController",
            mustBeAuthenticated: !0,
            editState: !0
        }).state("menu.pockettalkdetails", {
            url: "/pockettalkdetails",
            params: {
                chat: null
            },
            templateUrl: "modules/pockettalk/pockettalkdetails.html",
            controller: "PocketTalkDetailsController",
            mustBeAuthenticated: !0,
            editState: !0
        }).state("menu.afasliveanizer", {
            url: "/afasliveanizer/:step/:genre",
            templateUrl: "modules/afasevents/afasliveanizer.html",
            controller: "AfasLiveAnizerController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.afasevent", {
            url: "/afasevent/:courseCode/:eventCode/:sessionCode",
            templateUrl: "modules/afasevents/afasevent.html",
            controller: "AfasEventController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.salary", {
            url: "/salary",
            templateUrl: "modules/salary/salary.html",
            controller: "SalaryController",
            mustBeAuthenticated: !0,
            configModule: 8,
            editState: !1
        }).state("menu.proforma", {
            url: "/proforma",
            templateUrl: "modules/salary/proforma.html",
            controller: "ProformaController",
            mustBeAuthenticated: !0,
            configModule: 17,
            editState: !1
        }).state("menu.timesheetsweek", {
            url: "/timesheets/week",
            params: {
                selection: null
            },
            templateUrl: "modules/timesheets/weekview.html",
            controller: "TimesheetsWeekController",
            mustBeAuthenticated: !0,
            configModule: 9,
            editState: !1
        }).state("menu.timesheetsday", {
            url: "/timesheets/day",
            params: {
                selection: null
            },
            templateUrl: "modules/timesheets/dayview.html",
            controller: "TimesheetsDayController",
            mustBeAuthenticated: !0,
            configModule: 9,
            editState: !0
        }).state("menu.timesheetswizard", {
            url: "/timesheets/wizard",
            params: {
                selection: null
            },
            templateUrl: "modules/timesheets/wizard.html",
            controller: "TimesheetsWizardController",
            mustBeAuthenticated: !0,
            configModule: 9,
            cache: !1,
            editState: !0
        }).state("menu.timesheetdetail", {
            url: "/timesheets/detail/:guid",
            templateUrl: "modules/timesheets/detailview.html",
            controller: "TimesheetsDetailController",
            mustBeAuthenticated: !0,
            configModule: 9,
            editState: !0
        }).state("menu.subjectactions", {
            url: "/subjectactions/:subjectId/:actionId",
            templateUrl: "modules/subjects/subjectactions.html",
            controller: "SubjectActionController",
            mustBeAuthenticated: !0,
            cache: !1,
            configModule: 1,
            editState: !0
        }).state("menu.subjectsign", {
            url: "/subjectsign/:subjectId/:actionId",
            templateUrl: "modules/subjects/subjectsign.html",
            controller: "SubjectSignController",
            mustBeAuthenticated: !0,
            cache: !1,
            configModule: 1,
            editState: !0
        }).state("menu.tasklist", {
            url: "/tasklist",
            templateUrl: "modules/tasks/tasks.html",
            controller: "TasksController",
            mustBeAuthenticated: !0,
            configModule: 1,
            editState: !1
        }).state("menu.split-tasks", {
            url: "/splitview",
            templateUrl: "modules/tasks/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-tasks.tasklist", {
            url: "/tasklist",
            views: {
                "tasks-master": {
                    templateUrl: "modules/tasks/tasks.html",
                    controller: "TasksController",
                    mustBeAuthenticated: !0,
                    configModule: 1,
                    editState: !1
                },
                "tasks-detail": {
                    templateUrl: "modules/subjects/subject.html",
                    controller: "SubjectController",
                    mustBeAuthenticated: !0,
                    configModule: 4,
                    editState: !1
                }
            }
        }).state("menu.subject", {
            url: "/subject/:subjectId/:from",
            templateUrl: "modules/subjects/subject.html",
            controller: "SubjectController",
            mustBeAuthenticated: !0,
            configModule: 4,
            editState: !1
        }).state("menu.newsubject", {
            url: "/newsubject",
            params: {
                subjectProfile: null,
                fillInData: null
            },
            templateUrl: "modules/subjects/newsubject.html",
            controller: "NewSubjectController",
            mustBeAuthenticated: !0,
            configModule: 4,
            editState: !0
        }).state("menu.newsubjects", {
            url: "/newsubjects",
            params: {
                fillInData: null
            },
            templateUrl: "modules/subjects/newsubjects.html",
            controller: "NewSubjectsController",
            mustBeAuthenticated: !0,
            configModule: 4,
            editState: !0
        }).state("menu.newreaction", {
            url: "/subject/:subjectId/newreaction",
            templateUrl: "modules/subjects/newreaction.html",
            controller: "SubjectReactionController",
            mustBeAuthenticated: !0,
            cache: !1,
            configModule: 4,
            editState: !0
        }).state("menu.agenda", {
            url: "/agenda",
            templateUrl: "modules/agenda/agenda.html",
            controller: "AgendaController",
            mustBeAuthenticated: !0,
            configModule: 14,
            editState: !0
        }).state("menu.split-agenda", {
            url: "/splitview",
            templateUrl: "modules/agenda/splitview.html",
            "abstract": !0,
            editState: !0
        }).state("menu.split-agenda.agenda", {
            url: "/agenda",
            views: {
                "agenda-master": {
                    templateUrl: "modules/agenda/agenda.html",
                    controller: "AgendaController",
                    mustBeAuthenticated: !0,
                    configModule: 14,
                    editState: !0
                },
                "agenda-detail": {
                    templateUrl: "modules/agenda/appointment.html",
                    controller: "AppointmentController",
                    mustBeAuthenticated: !0,
                    configModule: 14,
                    editState: !0
                }
            }
        }).state("menu.appointment", {
            url: "/appointment",
            params: {
                appointment: null
            },
            templateUrl: "modules/agenda/appointment.html",
            controller: "AppointmentController",
            mustBeAuthenticated: !0,
            configmodule: 14,
            editState: !0
        }).state("menu.documents", {
            url: "/documents",
            templateUrl: "modules/documents/documents.html",
            controller: "DocumentsController",
            mustBeAuthenticated: !0,
            configModule: 12,
            editState: !1
        }).state("menu.newdocreaction", {
            url: "/documents/newreaction/:id/:pageId/:personal",
            templateUrl: "modules/documents/newreaction.html",
            controller: "DocumentReactionController",
            mustBeAuthenticated: !0,
            cache: !1,
            configModule: 12,
            editState: !0
        }).state("menu.document", {
            url: "/documents/document/:id/:personal/:showreactions",
            templateUrl: "modules/documents/document.html",
            controller: "DocumentController",
            mustBeAuthenticated: !0,
            configModule: 12,
            editState: !0
        }).state("menu.split-documents", {
            url: "/splitview",
            templateUrl: "modules/documents/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-documents.documents", {
            url: "/documents",
            views: {
                "documents-master": {
                    templateUrl: "modules/documents/documents.html",
                    controller: "DocumentsController",
                    mustBeAuthenticated: !0,
                    configModule: 12,
                    editState: !0
                },
                "documents-detail": {
                    templateUrl: "modules/documents/document.html",
                    controller: "DocumentController",
                    mustBeAuthenticated: !0,
                    configModule: 12,
                    editState: !0
                }
            }
        }).state("menu.businesscard", {
            url: "/businesscard",
            templateUrl: "modules/businesscard/businesscard.html",
            controller: "BusinesscardController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.empmut", {
            url: "/businesscard/empmut",
            params: {
                mutprofile: null,
                action: null,
                imageUrl: null
            },
            templateUrl: "modules/businesscard/edit.html",
            controller: "EmpMutController",
            mustBeAuthenticated: !0,
            editState: !0
        }).state("menu.positions", {
            url: "/positions",
            templateUrl: "modules/positions/positions.html",
            controller: "PositionsController",
            mustBeAuthenticated: !0,
            editState: !1
        }).state("menu.portal", {
            url: "/portal",
            templateUrl: "modules/portal/portal.html",
            controller: "PortalController",
            mustBeAuthenticated: !1,
            editState: !1
        }).state("menu.qrscan", {
            url: "/qrscan",
            templateUrl: "modules/qrscan/qrscan.html",
            controller: "QRScanController",
            mustBeAuthenticated: !1,
            editState: !0
        }).state("pin", {
            url: "/login/pin",
            templateUrl: "modules/login/pin.html",
            controller: "LoginPinController",
            mustBeAuthenticated: !1,
            cache: !1,
            mustHaveRequested: !0,
            editState: !1
        }).state("createpin", {
            url: "/login/createpin",
            templateUrl: "modules/login/pin.html",
            controller: "CreatePinController",
            mustBeAuthenticated: !1,
            cache: !1,
            mustHaveRequested: !0,
            editState: !0
        }).state("changepin", {
            url: "/login/changepin",
            templateUrl: "modules/login/pin.html",
            controller: "LoginPinController",
            mustBeAuthenticated: !0,
            cache: !1,
            mustHaveRequested: !0,
            editState: !0
        }).state("login", {
            url: "/login",
            templateUrl: "modules/login/login.html",
            controller: "LoginController",
            cache: !1,
            mustBeAuthenticated: !1,
            editState: !1
        }).state("deeplink", {
            url: "/deeplink/:target/:targetId",
            controller: "DeepLinkController",
            cache: !1,
            mustBeAuthenticated: !1,
            editState: !1
        }).state("login-otp", {
            url: "/login-otp",
            templateUrl: "modules/login/login-otp.html",
            controller: "LoginController",
            mustBeAuthenticated: !1,
            cache: !1,
            mustHaveRequested: !0,
            editState: !0
        }).state("menu.settings", {
            url: "/settings",
            templateUrl: "modules/settings/settings.html",
            controller: "SettingsController",
            cache: !1,
            mustBeAuthenticated: !1,
            editState: !1
        }).state("menu.envs", {
            url: "/settings/envs",
            templateUrl: "modules/settings/envs.html",
            controller: "EnvsController",
            cache: !1,
            mustBeAuthenticated: !1,
            editState: !1
        }).state("menu.projects", {
            url: "/projects",
            templateUrl: "modules/projects/projects.html",
            controller: "ProjectsController",
            mustBeAuthenticated: !0,
            configModule: 21,
            editState: !1
        }).state("menu.project", {
            url: "/project/:projectId/:projectName",
            templateUrl: "modules/projects/project.html",
            controller: "ProjectController",
            mustBeAuthenticated: !0,
            configModule: 21,
            editState: !1
        }).state("menu.newproject", {
            url: "/newproject",
            params: {
                projectProfile: null
            },
            templateUrl: "modules/projects/newproject.html",
            controller: "NewProjectController",
            mustBeAuthenticated: !0,
            configModule: 21,
            editState: !0
        }).state("menu.split-projects", {
            url: "/splitview",
            templateUrl: "modules/projects/splitview.html",
            "abstract": !0,
            editState: !1
        }).state("menu.split-projects.projects", {
            url: "/projects",
            views: {
                "projects-master": {
                    templateUrl: "modules/projects/projects.html",
                    controller: "ProjectsController",
                    mustBeAuthenticated: !0,
                    configModule: 21,
                    editState: !1
                },
                "projects-detail": {
                    templateUrl: "modules/projects/project.html",
                    controller: "ProjectController",
                    mustBeAuthenticated: !0,
                    configModule: 21,
                    editState: !1
                }
            }
        })
    }]);
app.directive("repeatdone", function () {
    return function (e, t, n) {
        e.$last && e.$eval(n.repeatdone)
    }
}), app.directive("htmldoc", ["$timeout", function (e) {
    return {
        restrict: "A",
        replace: !1,
        scope: {
            htmldoc: "="
        },
        link: function (e, t, n) {
            t.html(e.htmldoc), changelinks(e, t), e.$watch("htmldoc", function (n, o) {
                n !== o && (t.html(n), changelinks(e.$parent, t))
            })
        }
    }
}]), app.directive("linkclick", ["$timeout", function (e) {
    return function (t, n, o) {
        e(function () {
            changelinks(t, n)
        }, 300)
    }
}]), app.directive("atrans", ["$sanitize", function (e) {
    return function (t, n, o) {
        var l = n.html(),
            a = atrans(o.atrans, l);
        l !== a && n.html(e(a))
    }
}]), app.directive("postRender", ["$timeout", function (e) {
    var t = {
        restrict: "A",
        link: function (t, n, o) {
            t.$last && e(t.postRender, 0)
        }
    };
    return t
}]), app.directive("multipleViewsSupport", ["$state", function (e) {
    function t(e) {
        for (var t = angular.element(document.body).find("ion-nav-view"), n = 0; n < t.length; n++) {
            var o = angular.element(t[n]);
            if (o.attr("name") === e) return o
        }
        return !1
    }
    return {
        restrict: "E",
        scope: {
            width: "@"
        },
        link: function (n, o, l) {
            var a = e.current.views;
            if (a) {
                var r = Object.keys(e.current.views);
                if (r.length > 1) {
                    var i = o.parent(),
                        s = i.parent(),
                        c = r.indexOf(s.attr("name"));
                    if (c > 0) {
                        for (var u = 0, d = 0; c > d; d++) {
                            var m = t(r[d]),
                                p = angular.element(m[0].querySelector("multiple-views-support"));
                            u += parseInt(p.attr("width").replace("%", ""), 10)
                        }
                        i.css("left", u + "%"), i.css("box-shadow", "-1px 0px 1px rgba(0, 0, 0, 0.2), 1px 0px 1px rgba(0, 0, 0, 0.2)")
                    }
                    i.css("width", n.width)
                }
            }
        }
    }
}]), app.factory("MultipleViewsManager", ["$state", function (e) {
    var t, n = {},
        o = [];
    return {
        updateView: function (e, t) {
            if (!this.isActive()) throw "Cannot use updateView in a single view layout. Please make sure that you are in a multiple views layout using ViewManager.isActive()";
            var l = n[e];
            l ? l(t) : o.push({
                viewName: e,
                params: t
            })
        },
        setScope: function (e) {
            t = e
        },
        getScope: function () {
            return t
        },
        isActive: function () {
            return e.current.views && Object.keys(e.current.views).length > 1
        },
        updated: function (e, t) {
            n[e] = t;
            for (var l = 0; l < o.length; l++) {
                var a = o[l];
                if (a.viewName === e) return t(a.params), void o.splice(l, 1)
            }
        }
    }
}]), app.factory("$exceptionHandler", ["$injector", function (e) {
    var t = !1;
    return function (n) {
        function o() {
            return LocalStorageService = e.get("LocalStorageService"), LocalStorageService.getItem("appUID").then(function (e) {
                var t = e;
                if (null == t || "" == t) {
                    var n = SessionStorage.getItem("client-ip");
                    null != n && (t = "A-" + n)
                }
                return null == t || "" == t ? "" : "<label>" + atrans("errappuid", "Support Code: ") + '</label><input readonly value="' + t + '">'
            })
        }
        try {
            var l = atrans("unexpecterr", "Er is een onverwachte fout opgetreden"),
                a = atrans("error", "Foutmelding"),
                r = "",
                i = !0,
                s = !0;
            o().then(function (o) {
                if (n instanceof ConnectorException) {
                    switch (l = JSON.stringify(n.data), n.data.externalMessage && -1 == n.data.externalMessage.indexOf("Unexpected backend error") ? (l = n.data.externalMessage, a = atrans("errorValidation", "Controle"), i = !1) : n.data.refineryLogReference && (l = atrans("unexpecterrserver", "Foutmelding! Er is een onverwachte server fout geconstateerd."), r = o + "<br><label>" + atrans("proflogref", "Refinery log referentie: ") + '<input readonly value="' + n.data.refineryLogReference + '"></label>'), n.code) {
                        case ConnectorError_UnAuthorized:
                        case ConnectorError_NoEmployee:
                            s = !1
                    }
                    n.code == ConnectorError_Backend && ("" == r && i && (r = o), "string" == typeof n.data && -1 != n.data.indexOf("Logon failed") && (l = atrans("failedlogon", "Inloggen mislukt")), "object" == typeof n.data && "string" == typeof n.data.externalMessage && -1 != n.data.externalMessage.indexOf("Login") && (l = atrans("failedlogon", "Inloggen mislukt"))), log(l)
                } else if (n instanceof FriendlyException) l = n.message, a = n.title ? n.title : atrans("errorValidation", "Controle"), i = !1, log(l);
                else {
                    if (n instanceof SkippedException) return;
                    l = n.message + '<br><textarea cols="40" rows="10" readonly>' + n.stack + "</textarea>", log(n.message + " " + n.stack)
                }
                if (!l.indexOf || -1 == l.indexOf("$digest already in progress")) {
                    $ionicPopup = e.get("$ionicPopup"), $ionicHistory = e.get("$ionicHistory");
                    var c = {
                        title: a,
                        cssClass: "afaserrorpopup",
                        buttons: [],
                        template: l + "<br>" + r
                    };
                    i && c.buttons.push({
                        text: atrans("gotosettings", "Ga naar instellingen"),
                        type: "button-positive",
                        onTap: function (t) {
                            $state = e.get("$state"), $ionicHistory.clearHistory(), $state.go("menu.settings", {}, {
                                reload: !0
                            })
                        }
                    }), c.buttons.push({
                        text: atrans("sendlog", "Verstuur log"),
                        type: "button-positive",
                        onTap: function (e) {
                            openUrlGlobal("mailto:?subject=Log&body=" + encodeURIComponent(showInfoOb(appinfo) + "\r\n\r\n" + lines.join("\r\n")))
                        }
                    }), s && c.buttons.push({
                        text: atrans("ok", "OK"),
                        type: "button-positive"
                    }), t || (t = !0, $ionicPopup.show(c)["finally"](function () {
                        t = !1
                    }))
                }
            })
        } catch (c) { }
    }
}]), app.filter("showTimeFromMinutes", function () {
    return function (e) {
        var t = Math.floor(e / 60),
            n = e % 60;
        return t + ":" + (10 > n ? "0" : "") + n
    }
}), app.filter("link2inappbrowser", ["$sce", "$sanitize", function (e, t) {
    return function (n) {
        var o = /href="([^"]+)"/g,
            l = t(n).replace(o, 'style="cursor: pointer" data-url="$1" onclick="openUrlGlobal()"');
        return e.trustAsHtml(l)
    }
}]), app.filter("mdparse", ["$sanitize", function (e) {
    var t = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)[^\r\n\t\f "]*[^\s.;,(){}<>"\u201d\u2019]/i,
        n = angular.isString;
    return function (o) {
        function l(e) {
            e && d.push(mdRender(e))
        }

        function a(e, t, n) {
            d.push("<a "), d.push('href="', e.replace(/"/g, "&quot;"), '">'), d.push(t), d.push("</a>"), n && d.push("&nbsp;")
        }
        if (null == o || "" === o) return o;
        if (!n(o)) return "";
        for (var r, i, s, c, u = o, d = []; r = u.match(t);) {
            i = r[0], s = r[2] || r[4] ? i : (r[3] ? "//" : "mailto:") + i, c = r.index, l(u.substr(0, c));
            var m = 10 == u.substr(0, c).charCodeAt(c - 1) || 13 == u.substr(0, c).charCodeAt(c - 1) || 32 == u.substr(0, c).charCodeAt(c - 1);
            a(s, i, m), u = u.substring(c + r[0].length)
        }
        return l(u), e(d.join(""))
    }
}]), app.filter("unsafelink2inappbrowser", ["$sce", "$sanitize", function (e, t) {
    return function (t) {
        var n = /href="([\S]+)"/g,
            o = t.replace(n, 'style="cursor: pointer" data-url="$1" onclick="openUrlGlobal()"');
        return e.trustAsHtml(o)
    }
}]), app.filter("removeredudantzero", ["$sce", "$sanitize", function (e, t) {
    return function (t) {
        return t && (t = t.replace(/,0/g, "").replace(/.0/g, "")), e.trustAsHtml(t)
    }
}]), app.filter("insitesmilies", ["$sce", "$sanitize", function (e, t) {
    return function (t) {
        var n, o = ["relaxed", "relaxed", "worried", "worried", "wink", "wink", "open_mouth", "open_mouth", "running", "stuck_out_tongue", "stuck_out_tongue", "smiley", "smiley", "neutral_face", "confused", "confused", "hushed", "angry", "running_shirt_with_sash", "cold_sweat", "sunglasses", "sunglasses", "coffee", "coffee", "question"];
        if (t) {
            for (var l = t.toString(); null != (n = smileyRegexp.exec(l));)
                for (var a = 1; a < n.length; a++)
                    if ("undefined" != typeof n[a]) {
                        var r = !1;
                        if (":" == n[a][0]) {
                            var i = l.substring(Math.max(0, smileyRegexp.lastIndex - n[a].length - 6), smileyRegexp.lastIndex - n[a].length).toLowerCase();
                            (-1 != i.indexOf("http") || -1 != i.indexOf("mailto") || -1 != i.indexOf("ftp")) && (r = !0)
                        }
                        r || (l = l.substring(0, smileyRegexp.lastIndex - n[a].length) + '<i class="emoji emoji_' + o[a - 1] + '"></i>' + l.substring(smileyRegexp.lastIndex))
                    } return e.trustAsHtml(l)
        }
    }
}]), app.filter("stripTimezone", function () {
    return function (e) {
        return e.substring(0, 19)
    }
}), app.filter("time", ["$sce", "$sanitize", function (e, t) {
    return function (t) {
        return e.trustAsHtml(getTimeString(t))
    }
}]), app.filter("totimefromrea", ["$sce", "$sanitize", function (e, t) {
    return function (t) {
        if ("undefined" != typeof t) {
            var n = Math.round(60 * t),
                o = Math.floor(n / 60).toString();
            1 == o.length && (o = "0" + o);
            var l = Math.round(n % 60).toString();
            return 1 == l.length && (l = "0" + l), e.trustAsHtml(o + ":" + l)
        }
        return e.trustAsHtml("00:00")
    }
}]), app.filter("tocostfromrea", ["$sce", "$sanitize", function (e, t) {
    return function (t) {
        if ("undefined" != typeof t) {
            var n = parseFloat(t);
            return e.trustAsHtml("€ " + Math.round(100 * n) / 100)
        }
        return e.trustAsHtml("€ 0.00")
    }
}]), app.filter("timecontrol", ["$sce", "$sanitize", function (e, t) {
    return function (t) {
        if ("undefined" != typeof t) {
            var n = Math.floor(t / 60).toString();
            1 == n.length && (n = "0" + n);
            var o = Math.round(t % 60).toString();
            return 1 == o.length && (o = "0" + o), e.trustAsHtml(n + ":" + o)
        }
        return e.trustAsHtml("00:00")
    }
}]), app.filter("orderObjectBy", function () {
    return function (e, t, n) {
        var o = [];
        return angular.forEach(e, function (e, n) {
            e[t] && (e._key = n, o.push(e))
        }), o.sort(function (e, n) {
            var o = e[t],
                l = n[t];
            return "string" == typeof e[t] && (o = e[t].toLowerCase()), "string" == typeof n[t] && (l = n[t].toLowerCase()), o > l ? 1 : -1
        }), n && o.reverse(), o
    }
}), app.filter("hours", function () {
    return function (e) {
        if (e) {
            e = e.toString();
            var t, n, o;
            return n = e.split(".")[0], null != e.split(".")[1] ? (o = e.split(".")[1], 1 == o.length && (o += "0"), o.length > 2 && (o = o.slice(0, 2)), o = Math.round(o / 100 * 60), t = n + ":" + format_two_digits(o)) : t = n + ":00", t
        }
        return "00:00"
    }
}), app.filter("truncateLabel", function () {
    return function (e, t) {
        return e.length <= t + 1 ? e : e.substring(0, t).trim() + "."
    }
}), app.filter("truncateLabelShort", function () {
    return function (e, t) {
        return e.length <= t + 1 ? e : e.substring(0, t).trim()
    }
}), app.filter("displayAsControl", ["$filter", function (e) {
    return function (t, n) {
        if (null == t) return "-";
        switch (parseInt(n)) {
            case 2:
                return t ? atrans("yes", "Ja") : atrans("no", "Nee");
            case 4:
                return e("date")(t, "mediumDate", "+0000")
        }
        return t
    }
}]);
var latestWindow = null;