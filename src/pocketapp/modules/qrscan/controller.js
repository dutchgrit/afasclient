var portalKeysUsed = {};
angular.module("qrscan.controller", ["AfasServices"]).controller("QRScanController", ["$scope", "ConfigService", "$ionicPopup", "$ionicActionSheet", "$interval", "$state", "LocalStorageService", "question", "ConnectorService", "$rootScope", "$ionicHistory", "$window", "$ionicModal", "$timeout", function (e, n, t, o, r, a, l, i, c, s, u, d, g, m) {
    e.scannerActive = !1, e.qrscanner = !1, void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), m(function () {
        s.blocker && (s.blocker.style.display = "none")
    }, 10), e.$on("$ionicView.enter", function () {
        e.startScanner()
    }), e.startScanner = function () {
        e.scansuccess = !1, e.nobackview = null == u.backView() || null == u.backView().backViewId, checkPlugin("Aucoresdk") && "undefined" != typeof QRScanner && QRScanner.prepare(function (n, o) {
            if (n) throw n;
            o.authorized ? l.getItem("token").then(function (n) {
                l.getItem("push-token").then(function (o) {
                    e.scannerActive = !0, e.hideUI(), log("scanning qr"), QRScanner.scan(function (r, a) {
                        if (SessionStorage.removeItem("qrscannerprepare"), r) t.alert({
                            title: atrans("error", "Foutmelding"),
                            template: null != r && "string" != typeof r ? r.message : r
                        });
                        else if (log("qr code received"), 0 == a.indexOf("https://www.afaspocket.nl/store?json=") && (a = a.substr(37), a = decodeURIComponent(a)), 0 == a.indexOf("{")) {
                            var l = JSON.parse(a);
                            "2" == l.v ? "1" != portalKeysUsed[l.k] ? (portalKeysUsed[l.k] = "1", c.getPortalQR(l.k).then(function (r) {
                                "" != r && null != r ? e.preRegisterQR(r, n, o) : t.alert({
                                    title: atrans("error", "Foutmelding"),
                                    template: "Empty QR data received from refinery"
                                })
                            })) : (log("qr already scanned"), e.removeScanner()) : e.preRegisterQR(l, n, o)
                        } else e.enrollQR(a, "unknown", n, o, "")
                    }), QRScanner.show()
                })
            }) : o.denied ? t.alert({
                title: atrans("error", "Foutmelding"),
                template: atrans("cameraauth", "Camera toegang is nodig om de QR code te scannen. Pas uw app-autorisatie aan in de instellingen.")
            }) : t.alert({
                title: atrans("error", "Foutmelding"),
                template: atrans("qriniterr", "Onverwachte fout bij initialiseren QR code scanner")
            })
        })
    }, e.preRegisterQR = function (n, t, o) {
        var r = "",
            a = "",
            i = n.TwoFactorRegisterCode;
        n.PocketCode ? (sessionStorage.setItem("enrollPocket", "1"), a = n.PocketCode, (null == t || "" == t) && l.setItem("loginkey", a), log("found key: " + a)) : (null == t || "" == t) && l.setItem("loginkey", ""), n.Email && (r = n.Email, (null == t || "" == t) && (l.setItem("userid", n.Email), e.qrsuccessmessage = atrans("checkemail", "Controleer je e-mail"))), e.enrollQR(i, r, t, o, a)
    }, e.removeScanner = function () {
        e.scannerActive = !1, QRScanner.destroy(), e.showUI()
    }, e.enrollQR = function (n, o, r, i, s) {
        "" != n && null != n && "" != o ? (log("enroll pushreg " + i), checkPlugin("Aucoresdk") && cordova.plugins.Aucoresdk.enrollQr(n, i, o).then(function () {
            log("Aucoresdk enroll success"), e.scansuccess = !0, m(function () {
                e.removeScanner(), SessionStorage.setItem("prelogin", "0"), l.setItem("qrregs", "1").then(function () {
                    "" == s || "" != r && null != r ? m(function () {
                        d.location.href = "index.html?t=" + (new Date).getTime()
                    }) : "" != o ? m(function () {
                        c.requestOTP(o.trim(), s.trim()).then(function () {
                            a.go("login-otp", {}, {
                                reload: !0
                            })
                        })
                    }, 2e3) : m(function () {
                        a.go("login", {}, {
                            reload: !0
                        })
                    }, 2e3)
                })
            }, 100)
        }, function (n) {
            log("Aucoresdk enroll failure (" + (null != n && "string" != typeof n ? n.message : n) + ")"), e.removeScanner(), t.alert({
                title: atrans("error", "Foutmelding"),
                template: null != n && "string" != typeof n ? n.message : n
            }).then(function () {
                e.startScanner()
            })
        })) : (e.scansuccess = !0, m(function () {
            e.showUI(), e.scannerActive = !1, QRScanner.destroy(), "" == s || "" != r && null != r ? (e.scansuccess = !1, e.startScanner(), null == r || "" == r ? t.alert({
                title: atrans("error", "Foutmelding"),
                template: atrans("alreadyinstalled", "AFAS Pocket App al geinstalleerd!")
            }) : t.alert({
                title: atrans("error", "Foutmelding"),
                template: atrans("alreadyregistered", "Al aangemeld voor de AFAS Pocket App!")
            })) : (SessionStorage.setItem("prelogin", "0"), "" != o ? m(function () {
                c.requestOTP(o.trim(), s.trim()).then(function () {
                    a.go("login-otp", {}, {
                        reload: !0
                    })
                })
            }, 2e3) : m(function () {
                a.go("login", {}, {
                    reload: !0
                })
            }, 2e3))
        }, 100))
    }, e.goBackQr = function () {
        "undefined" != typeof QRScanner && e.scannerActive && (e.scannerActive = !1, QRScanner.destroy(), e.showUI()), l.getItem("qrregs").then(function (e) {
            if ("1" == e) a.go("menu.home", {}, {
                reload: !0
            });
            else {
                var t = !1;
                n.getConfig().then(function (e) {
                    t = !0
                })["finally"](function () {
                    t ? a.go("menu.portal", {}, {
                        reload: !0
                    }) : a.go("login", {}, {
                        reload: !0
                    })
                })
            }
        })
    }, e.hideUI = function () {
        var e, n = document.querySelectorAll("html, .pane, .view, ion-content, .view-container");
        for (e = 0; e < n.length; e++) n[e].style.backgroundColor = "transparent";
        for (n = document.querySelectorAll(".menu"), e = 0; e < n.length; e++) n[e].style.display = "none"
    }, e.showUI = function () {
        var e, n = document.querySelectorAll("html, .pane, .view, ion-content, .view-container");
        for (e = 0; e < n.length; e++) n[e].style.backgroundColor = "";
        for (n = document.querySelectorAll(".menu"), e = 0; e < n.length; e++) n[e].style.display = ""
    }, e.$on("$ionicView.leave", function () {
        "undefined" != typeof QRScanner && e.scannerActive && (e.scannerActive = !1, QRScanner.destroy(), e.showUI())
    })
}]);