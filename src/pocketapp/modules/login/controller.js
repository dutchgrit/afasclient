function vibrateOnce() {
    "android" == ionic.Platform.platform() && "undefined" != typeof navigator.vibrate && navigator.vibrate(50)
}
angular.module("login.controller", ["AfasServices"]).controller("LoginController", ["$scope", "$state", "$timeout", "$window", "$ionicPopover", "ConnectorService", "LoginService", "HelpService", "$ionicModal", "RefreshService", "UserService", "LocalStorageService", "popup", "$rootScope", function (e, n, o, t, i, a, r, s, g, c, l, p, d, u) {
    e.keyplaceholder = atrans("key", "Omgevingssleutel"), e.usernameplaceholder = atrans("usernameoremail", "Emailadres of gebruikersnaam"), e.actcodeplaceholder = atrans("activationcode", "Activatiecode");
    var m = 1;
    (null == SessionStorage.getItem("prelogin") || "" == SessionStorage.getItem("prelogin")) && SessionStorage.setItem("prelogin", "1"), checkPlugin("Aucoresdk") && (e.aucoreactive = !0), void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), o(function () {
        u.blocker && (u.blocker.style.display = "none")
    }, 10), ionic.Platform.isAndroid() || ionic.Platform.isIOS() ? e.newonboarding = null == sessionStorage.getItem("enrollPocket") : e.newonboarding = !1, e.$on("$ionicView.beforeEnter", function () {
        e.prelogin = "1" == SessionStorage.getItem("prelogin"), p.getBaseItem("pincode").then(function (o) {
            p.getItem("token").then(function (t) {
                p.getItem("userid").then(function (i) {
                    p.getItem("loginkey").then(function (a) {
                        "undefined" != typeof t && isNotEmpty(t) && (isNotEmpty(o) ? r.goToHome() : (SessionStorage.setItem("loginactive", "1"), n.go("createpin", {}, {
                            reload: !0
                        }))), "undefined" != typeof i && isNotEmpty(i) && "undefined" != typeof a && isNotEmpty(a) && (null == t || "" == t) && (e.prelogin = !1, SessionStorage.setItem("prelogin", "0"), SessionStorage.setItem("loginactive", "1"), "login-otp" != n.current.name && (SessionStorage.setItem("loginactive", "1"), n.go("login-otp", {}, {
                            reload: !0
                        }))), "undefined" != typeof i && null != i && "" != i || "undefined" == typeof a || !isNotEmpty(a) || (e.loginData.password = a, "login" != n.current.name && (SessionStorage.setItem("loginactive", "1"), n.go("login", {}, {
                            reload: !0
                        })))
                    })
                })
            })
        })
    }), e.$on("$ionicView.enter", function () {
        e.sending = !1;
        var n = SessionStorage.getItem("otp");
        isNotEmpty(n) && (e.loginData.otp = parseInt(n), o(function () {
            SessionStorage.setItem("otp", "")
        }, 2e3))
    }), e.loginData = {}, e.save = function () {
        p.setItem("userid", e.loginData.username), 
        p.setItem("loginkey", e.loginData.password)
    }, e.load = function () {}, e.gotoPortal = function () {
        "undefined" != typeof QRScanner ? QRScanner.prepare(function (t, i) {
            i.authorized && (e.prelogin = !1, SessionStorage.setItem("prelogin", "0"), SessionStorage.setItem("qrscannerprepare", "1"), o(function () {
                n.go("menu.portal", {}, {
                    reload: !0
                })
            }, 10))
        }) : (e.prelogin = !1, SessionStorage.setItem("prelogin", "0"), n.go("menu.portal", {}, {
            reload: !0
        }))
    }, e.doQR = function (t) {
        t ? (e.prelogin = !0, SessionStorage.setItem("prelogin", "1"), "undefined" != typeof QRScanner ? QRScanner.prepare(function (e, t) {
            t.authorized && (SessionStorage.setItem("qrscannerprepare", "1"), o(function () {
                n.go("menu.qrscan", {}, {
                    reload: !0
                })
            }, 10))
        }) : n.go("menu.qrscan", {}, {
            reload: !0
        })) : e.newonboarding = !1
    }, e.doPreLogin = function () {
        e.prelogin = !1, SessionStorage.setItem("prelogin", "0")
    }, e.doLogin = function () {
        "undefined" != typeof e.loginData.username && null !== e.loginData.username && "undefined" != typeof e.loginData.password && null !== e.loginData.password && "" !== e.loginData.username && "" !== e.loginData.password ? (e.save(), SessionStorage.removeItem("otp"), a.requestOTP(e.loginData.username.trim(), e.loginData.password.trim()).then(function () {
            n.go("login-otp", {}, {
                reload: !0
            })
        })) : ("" === e.loginData.username || "" === e.loginData.password || "undefined" == typeof e.loginData.username || "undefined" == typeof e.loginData.password) && ("" === e.loginData.username && "" === e.loginData.password || "undefined" == typeof e.loginData.username && "undefined" == typeof e.loginData.password ? d(atrans("errorlogin1", "Inloggegevens zijn onjuist of niet ingevuld. Je moet een geldige gebuikersnaam en de omgevingssleutel invullen.")) : "" === e.loginData.username || "undefined" == typeof e.loginData.username ? d(atrans("errorlogin2", "Je moet een gebruikersnaam invullen.")) : ("" === e.loginData.password || "undefined" == typeof e.loginData.password) && d(atrans("errorlogin3", "Je moet een omgeving sleutel invullen.")))
    }, e.enterOTP = function () {
        "undefined" != typeof e.loginData.otp && null !== e.loginData.otp && p.getItem("userid").then(function (o) {
            p.getItem("loginkey").then(function (i) {
                e.sending || (e.sending = !0, a.validateOTP(o, i, e.loginData.otp).then(function (o) {
                    null !== o && "undefined" != typeof o.token && (p.setItem("token", o.token), p.setItem("appUID", o.appUID), LocalStoragePrefixes.length > 1 ? (SessionStorage.setItem("hasEnteredPin", "1"), l.refresh()["finally"](function () {
                        c.refresh(e), t.location.href = "index.html?t=" + (new Date).getTime()
                    })) : (p.setBaseItem("showWelcome", "show"), n.go("createpin", {}, {
                        reload: !0
                    })))
                }, function (o) {
                    log(o), e.sending = !1, 3 > m ? (d(atrans("erroractivation1", "Activatiecode is niet goed. Probeer hem nog een keer.")), p.removeItem("token")) : m >= 3 && (d(atrans("erroractivation2", "Activatiecode is niet goed. Vraag hem opnieuw aan.")), p.removeItem("token"), p.removeItem("userid"), n.go("login", {}, {
                        reload: !0
                    })), m++
                }))
            })
        })
    }, e.modal = function () {
        s.init("modules/help/helplogin.html").then(function (e) {
            e.show()
        })
    }, e.modal2 = function () {
        s.init("modules/help/helplogin2.html").then(function (e) {
            e.show()
        })
    }, e.cancelOTP = function () {
        p.removeItem("userid").then(function () {
            e.loginData.otp = "", n.go("login", {}, {
                reload: !0
            })
        })
    }, i.fromTemplateUrl("modules/app/lang.html", {
        scope: e
    }).then(function (n) {
        e.popover = n
    }), e.openPopover = function (n) {
        e.popover.show(n)
    }, e.closePopover = function () {
        e.popover.hide()
    }, e.switchLanguage = function (o) {
        atransSwitchLanguage(o), e.closePopover(), n.go(n.current, {}, {
            reload: !0
        })
    }
}]).controller("LoginPinController", ["$scope", "$rootScope", "$state", "LoginService", "$ionicHistory", "LocalStorageService", "$timeout", "popup", "ConfigService", function (e, n, o, t, i, a, r, s, g) {
    e.pincode = "", e.pinstep = 1, e.showPin = !1;
    var c = 3,
        l = !1;
    void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), r(function () {
        n.blocker && (n.blocker.style.display = "none")
    }, 10), e.$on("$ionicView.beforeEnter", function (n) {
        g.getConfig().then(function (n) {
            e.pincode = "", e.msg = atrans("enterpin", "Enter je PIN code"), l = !1, "changepin" == i.currentStateName() ? (e.showCancelButton = !0, e.showPin = !0) : (e.showCancelButton = !1, "undefined" == typeof n.biologin || "0" != n.biologin ? ionic.Platform.isIOS() && window.plugins && window.plugins.touchid ? (log("fingerprint"), fingerprintIsBusy || (fingerprintIsBusy = !0, window.plugins.touchid.isAvailable(function () {
                log("fingerprint avail"), window.plugins.touchid.didFingerprintDatabaseChange(function (n) {
                    a.getBaseItem("fingerdatabasechanged").then(function (o) {
                        n || "1" == o ? (s("Fingerprint database change detected, please re-authenticate!"), a.setBaseItem("fingerdatabasechanged", "1"), fingerprintIsBusy = !1, r(function () {
                            e.showPin = !0
                        }, 10)) : window.plugins.touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(atrans("scanfinger", "Scan je vingerafdruk"), atrans("enterpin", "Enter je PIN code"), function () {
                            fingerprintIsBusy = !1, e.showPin = !1, SessionStorage.setItem("hasEnteredPin", "1"), log("fingerprint done");
                            var n = i.backView();
                            n && "menu.empmut" == n.stateName ? (SessionStorage.setItem("mutpin", "1"), i.goBack()) : n && "menu.subjectsign" == n.stateName ? (SessionStorage.setItem("signed", i.backView().stateParams.subjectId), i.goBack()) : t.goToHome()
                        }, function () {
                            fingerprintIsBusy = !1, r(function () {
                                e.showPin = !0
                            }, 10)
                        })
                    })
                })
            }, function () {
                fingerprintIsBusy = !1, r(function () {
                    e.showPin = !0
                }, 10)
            }))) : ionic.Platform.isAndroid() && window.FingerprintAuth ? fingerprintIsBusy || (log("fingerprint"), fingerprintIsBusy = !0, window.FingerprintAuth.isAvailable(function (n) {
                if (n.isHardwareDetected && n.hasEnrolledFingerprints) {
                    log("fingerprint avail");
                    var o = {
                        clientId: "AFAS Pocket 2",
                        locale: toFPLocale(window.currentLanguage),
                        disableBackup: !0
                    };
                    window.FingerprintAuth.encrypt(o, function () {
                        fingerprintIsBusy = !1, e.showPin = !1, SessionStorage.setItem("hasEnteredPin", "1"), log("fingerprint done");
                        var n = i.backView();
                        n && "menu.empmut" == n.stateName ? (SessionStorage.setItem("mutpin", "1"), i.goBack()) : n && "menu.subjectsign" == n.stateName ? (SessionStorage.setItem("signed", i.backView().stateParams.subjectId), i.goBack()) : t.goToHome()
                    }, function () {
                        fingerprintIsBusy = !1, r(function () {
                            e.showPin = !0
                        }, 10)
                    })
                } else fingerprintIsBusy = !1, r(function () {
                    e.showPin = !0
                }, 10)
            }, function () {
                fingerprintIsBusy = !1, r(function () {
                    e.showPin = !0
                }, 10)
            })) : r(function () {
                e.showPin = !0
            }, 10) : r(function () {
                e.showPin = !0
            }, 10))
        })
    }), e.add = function (n) {
        !l && e.pincode.length < 4 && (vibrateOnce(), e.pincode += n, 4 == e.pincode.length && a.getBaseItem("pincode").then(function (n) {
            if (e.pincode == n) {
                l = !0, SessionStorage.setItem("hasEnteredPin", "1");
                var r = i.backView();
                r && "menu.empmut" == r.stateName ? (SessionStorage.setItem("mutpin", "1"), i.goBack()) : r && "menu.subjectsign" == r.stateName ? (SessionStorage.setItem("signed", i.backView().stateParams.subjectId), i.goBack()) : "pin" == i.currentStateName() ? (a.setBaseItem("fingerdatabasechanged", "0"), t.goToHome()) : "changepin" == i.currentStateName() && o.go("createpin", {}, {
                    reload: !0
                })
            } else c--, c > 0 && (s(atrans("pincodeincorrect", "De ingevoerde pincode is niet correct. Probeer het opnieuw.")), firstAttempt = !1), SessionStorage.setItem("hasEnteredPin", "0"), e.msg = atrans("remainingpin", "Pogingen beschikbaar: ") + c, e.pincode = "", 0 >= c && (s(atrans("pincodeincorrectloggedout", "Het aantal pogingen is overschreden. Je bent nu uitgelogd en zult opnieuw moeten inloggen.")), l = !0, t.logout(e))
        }))
    }, e.deletePin = function () {
        vibrateOnce(), e.pincode = e.pincode.substring(0, e.pincode.length - 1)
    }, e.cancelPin = function () {
        "changepin" == i.currentStateName() && o.go("menu.settings", {}, {
            reload: !0
        })
    }
}]).controller("CreatePinController", ["$scope", "$timeout", "$rootScope", "LoginService", "LocalStorageService", function (e, n, o, t, i) {
    e.pincode = "", e.pincode_confirm = "", e.showCancelButton = !1, e.pinstep = 1, e.showPin = !0, e.$on("$ionicView.beforeEnter", function () {
        SessionStorage.setItem("loginactive", "1"), e.pinstep = 1, e.msg = atrans("enternewpin", "Voer uw nieuwe pincode in"), e.pincode = "", e.pincode_confirm = ""
    }), e.add = function (o) {
        vibrateOnce(), 1 == e.pinstep && e.pincode.length < 4 ? (e.pincode += o, 4 == e.pincode.length && (n(function () {
            e.pinstep = 2
        }, 1), newPincode = e.pincode, e.msg = atrans("repeatpin", "Herhaal uw pincode"))) : 2 == e.pinstep && (e.pincode_confirm += o, 4 == e.pincode_confirm.length && (e.pincode_confirm == e.pincode ? (e.msg = atrans("confirmpin", "Pincode is bevestigd"), i.setBaseItem("pincode", e.pincode_confirm), SessionStorage.setItem("hasEnteredPin", "1"), i.setBaseItem("pausedOn", Date.now()), t.goToHome(!0)) : (SessionStorage.setItem("hasEnteredPin", "0"), e.msg = atrans("wrongmatchpin", "Pincode komt niet overeen, probeer het opnieuw."), e.pincode = "", e.pincode_confirm = "", e.pinstep = 1)))
    }, e.deletePin = function () {
        vibrateOnce(), 1 == e.pinstep ? e.pincode = e.pincode.substring(0, e.pincode.length - 1) : 2 == e.pinstep && (e.pincode_confirm = e.pincode_confirm.substring(0, e.pincode_confirm.length - 1))
    }
}]);