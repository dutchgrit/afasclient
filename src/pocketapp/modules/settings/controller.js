angular.module("settings.controller", []).controller("SettingsController", ["$scope", "$rootScope", "$window", "$state", "$ionicModal", "$ionicPopover", "LoginService", "LocalStorageService", "DocumentSessionService", "UserService", "question", "RefreshService", "ConfigService", function (e, o, n, t, i, r, a, c, l, s, m, g, f) {
    e.pageTitle = atrans("settings", "Instellingen"), e.form = {}, e.logout = function () {
        m(atrans("confirmlogout", "Weet je zeker dat je wilt uitloggen? Je moet dan opnieuw de app activeren.")).then(function (o) {
            o && a.logout(e)
        })
    }, c.getItem("appUID").then(function (o) {
        e.appUID = o
    }), c.getItem("positionallowed").then(function (o) {
        e.form.positionallowed = "1" == o
    }), e.refreshConfig = function () {
        l.removeSession(), s.refresh()["finally"](function () {
            g.refresh(e), n.location.href = "index.html?t=" + (new Date).getTime()
        })
    }, e.goToPinChange = function () {
        t.go("changepin", {}, {
            reload: !0
        })
    }, e.showEnvs = function () {
        t.go("menu.envs", {}, {
            reload: !0
        })
    }, e.$on("$ionicView.enter", function () {
        e.form.speech = null != LocalStorage.getItem("speech"), c.getItem("token").then(function (o) {
            e.user = "" != o && null != o
        })
    }), e.toggleSpeech = function () {
        e.form.speech ? (LocalStorage.setItem("speech", !0), window.plugins && window.plugins.speechRecognition && window.plugins.speechRecognition.requestPermission(function (e) {
            o.startSpeech && o.startSpeech()
        })) : (o.stopSpeech && o.stopSpeech(), LocalStorage.removeItem("speech"))
    }, r.fromTemplateUrl("modules/app/lang.html", {
        scope: e
    }).then(function (o) {
        e.popover = o
    }), e.openPopover = function (o) {
        e.popover.show(o)
    }, e.closePopover = function () {
        e.popover.hide()
    }, e.toggleLocation = function () {
        c.setItem("positionallowed", e.form.positionallowed ? 1 : 0), e.form.positionallowed && SessionStorage.removeItem("lastTimeChecked")
    }, e.switchLanguage = function (o) {
        e.closePopover(), atransSwitchLanguage(o), e.refreshConfig()
    }, i.fromTemplateUrl("modules/settings/info_modal.html", {
        scope: e,
        animation: "slide-in-up"
    }).then(function (n) {
        e.modal = n, o.currentModal = n
    }), e.qrscan = function () {
        e.gotoPage("menu.portal")
    }, e.openModal = function (o) {
        e.logs = lines;
        var n = {};
        n.ip = sessionStorage.getItem("client-ip"), n.platform = ionic.Platform.platform(), "undefined" != typeof window.device && (n.devicemodel = window.device.model, n.devicemanufacturer = window.device.manufacturer), n.appbuildversion = appbuildversion, n.latestconfig = LocalStorage.getItem("latestconfig"), c.getItem("config").then(function (o) {
            c.getItem("loginkey").then(function (t) {
                c.getItem("appUID").then(function (i) {
                    c.getItem("userid").then(function (r) {
                        if (n.userid = r, isNotEmpty(t) && (n.loginkey = t.toUpperCase()), e.only2FAMode ? n.appUID = "PMO-MODE" : n.appUID = i, isNotEmpty(o)) {
                            var a = JSON.parse(o);
                            n.profitversion = a.techversion, n.biologin = a.biologin
                        }
                    })["finally"](function () {
                        Object.keys(n).forEach(function (o) {
                            e[o] = n[o]
                        }), e.logsbody = escape(showInfoOb(n) + "\r\n\r\n" + lines.join("\r\n"))
                    })
                })
            })
        }), e.modal.show(), ionic.Platform.isIOS() && (e.isIOS = !0)
    }, e.closeModal = function () {
        e.modal.hide(), o.currentModal = null
    }
}]).controller("EnvsController", ["$scope", "$window", "LocalStorageService", "UserService", "question", "LoginService", function (e, o, n, t, i, r) {
    e.pageTitle = atrans("myprofitenvs", "Mijn Profit omgevingen"), e.$on("$ionicView.enter", function () {
        e.envs = LocalStoragePrefixes, e.envsel = LocalStoragePrefixes[CurrentPrefix]
    }), e.addEnv = function () {
        i(atrans("confirmaddenv", "Weet je zeker dat je een nieuwe omgeving wilt toevoegen? Je moet dan opnieuw activeren voor deze omgeving.")).then(function (e) {
            e && n.getItem("loginkey").then(function (e) {
                t.getUser().then(function (n) {
                    checkLocalStoragePrefix(n, e), addLocalStorage(), SessionStorage.setItem("loginactive", "1"), o.location.href = "index.html?t=" + (new Date).getTime()
                })
            })
        })
    }, e.selectEnv = function (e) {
        for (var n = 0; n < LocalStoragePrefixes.length; n++)
            if (e.id == LocalStoragePrefixes[n].id) {
                n != CurrentPrefix && (switchLocalStorage(n), o.location.href = "index.html?t=" + (new Date).getTime());
                break
            }
    }, e.deleteEnv = function (e) {
        if (e && 1 != e.id) {
            for (var t = -1, a = 0; a < LocalStoragePrefixes.length; a++)
                if (e.id == LocalStoragePrefixes[a].id) {
                    t = a;
                    break
                } - 1 != t && i(atrans("confirmdelenv", "Weet je zeker dat je omgeving '" + e.name + "' wilt verwijderen uit AFAS Pocket?")).then(function (e) {
                    e && (CurrentPrefix = t, r.removeEnvironment(function () {
                        n.removeItem("token"), n.removeItem("messages"), n.removeItem("user"), n.removeItem("userid"), n.removeItem("appUID"), n.removeItem("config"), n.removeItem("envconfig"), n.removeItem("pincode"), n.removeItem("loginkey"), n.removeItem("latestconfig"), n.removeItem("DocSession"), n.removeItem("lastTimeCheckedDocSession"), n.removeItem("lastTimeCheckedConfig"), n.removeItem("lastTimeCheckedEnvConfig"), n.removeItem("lastTimeCheckedUser");
                        var e = n.getLocalStorageServiceNonEncrypted();
                        e.clearUsageData(), deleteLocalStorage(t), o.location.href = "index.html?t=" + (new Date).getTime()
                    }))
                })
        }
    }
}]);