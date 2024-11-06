function ConnectorException(e, t) {
    this.code = e, this.data = t
}

function SkippedException(e) {
    this.error = e
}

function handleErrorResponse(e, t, n) {
    if (t) {
        log(e.status + " " + e.statusText);
        var o = e.statusText;
        throw e.data && e.data.externalMessage && (o = e.data.externalMessage), new SkippedException(o)
    }
    if (401 != e.status) throw null != e.data && null != e.data.refineryLogReference ? new ConnectorException(ConnectorError_Backend, e.data) : isNotEmpty(e.statusText) ? new ConnectorException(ConnectorError_Refinery, e.statusText) : new SkippedException;
    if (null == SessionStorage.getItem("shown_error")) throw SessionStorage.setItem("shown_error", "true"), new ConnectorException(ConnectorError_UnAuthorized, atrans("unauth", "Authenticatie mislukt, toegang geweigerd."));
    window.location.assign("#/menu/settings")
}
var serviceUrl = "https://refinery.afaspocket.nl",
    timeoutEnvConfig = 864e5,
    timeoutConfig = 18e5,
    timeoutDocSession = 288e5,
    timeoutUser = 432e5,
    timeoutProfiles = 1728e6,
    timeoutPausePin = 3e5,
    timeoutServiceStatus = 6e5,
    timeoutBusyEdit = 12e5,
    timeoutProjectAuth = 2592e6,
    _prefixLS = "___XXX___",
    DOMURL = window.URL || window.webkitURL,
    blobSupport = !0;
try {
    new Blob([1, 2, 3])
} catch (e) {
    blobSupport = !1
}
var ConnectorError_UnAuthorized = 1,
    ConnectorError_Refinery = 2,
    ConnectorError_General = 3,
    ConnectorError_Backend = 4,
    ConnectorError_NoEmployee = 5,
    ConnectorError_InvalidConfig = 6,
    ConnectorError_NoUser = 7,
    ConnectorError_CouldNotDelete = 8;
angular.module("AfasServices", []).constant("maxTakeContacts", 50).constant("maxListTake", 15).service("LocalStorageService", ["$q", function (e) {
    return {
        getItem: function (t, n) {
            var o = e.defer();
            return checkPlugin("SecureLocalStorage") ? (cordova.plugins.SecureLocalStorage.getItem((n ? "" : LocalStoragePrefixes[CurrentPrefix].prefix) + t).then(function (e) {
                o.resolve(e)
            }, function (e) {
                log(e), alert("error accessing secure localstorage")
            }), o.promise) : this.getLocalStorageServiceNonEncrypted().getItem(t, n)
        },
        setItem: function (t, n, o) {
            var r = e.defer();
            return checkPlugin("SecureLocalStorage") ? (cordova.plugins.SecureLocalStorage.setItem((o ? "" : LocalStoragePrefixes[CurrentPrefix].prefix) + t, n).then(function () {
                r.resolve()
            }, function (e) {
                log(e), alert("error accessing secure localstorage")
            }), r.promise) : this.getLocalStorageServiceNonEncrypted().setItem(t, n, o)
        },
        removeItem: function (t, n) {
            var o = e.defer();
            return checkPlugin("SecureLocalStorage") ? (cordova.plugins.SecureLocalStorage.removeItem((n ? "" : LocalStoragePrefixes[CurrentPrefix].prefix) + t).then(function () {
                o.resolve()
            }, function (e) {
                log(e), alert("error accessing secure localstorage")
            }), o.promise) : this.getLocalStorageServiceNonEncrypted().removeItem(t, n)
        },
        clear: function () {
            var t = e.defer();
            return checkPlugin("SecureLocalStorage") ? (cordova.plugins.SecureLocalStorage.clear().then(function () {
                t.resolve()
            }, function (e) {
                log(e), alert("error accessing secure localstorage")
            }), t.promise) : this.getLocalStorageServiceNonEncrypted().clear()
        },
        setBaseItem: function (e, t) {
            return this.setItem(e, t, !0)
        },
        getBaseItem: function (e) {
            return this.getItem(e, !0)
        },
        removeBaseItem: function (e) {
            return this.removeItem(e, !0)
        },
        getLocalStorageServiceNonEncrypted: function () {
            return {
                getItem: function (t, n) {
                    var o = e.defer(),
                        r = LocalStorage.getItem(t, n);
                    if (null != r)
                        if (0 == r.indexOf(_prefixLS)) try {
                            r = b64_to_utf8(r.substr(_prefixLS.length))
                        } catch (i) {} else LocalStorage.setItem(t, _prefixLS + utf8_to_b64(r), n);
                    return o.resolve(r), o.promise
                },
                setItem: function (t, n, o) {
                    var r = e.defer();
                    return null != n ? LocalStorage.setItem(t, _prefixLS + utf8_to_b64(n), o) : LocalStorage.removeItem(t, o), r.resolve(), r.promise
                },
                removeItem: function (t, n) {
                    var o = e.defer();
                    return LocalStorage.removeItem(t, n), o.resolve(), o.promise
                },
                clear: function () {
                    var t = e.defer();
                    return LocalStorage.clear(), t.resolve(), t.promise
                },
                clearUsageData: function () {
                    LocalStorage.removeItem("IllnessProfiles"), LocalStorage.removeItem("MutProfiles_4"), LocalStorage.removeItem("MutProfiles_5"), LocalStorage.removeItem("MutProfiles_13"), LocalStorage.removeItem("DeclProfiles"), LocalStorage.removeItem("EntryLayouts_timesheet"), LocalStorage.removeItem("selLayoutId_timesheet"), LocalStorage.removeItem("LeaveWithdrawProfiles"), LocalStorage.removeItem("SubjectProfiles"), LocalStorage.removeItem("LeaveProfiles"), LocalStorage.removeItem("ProjectAuth"), LocalStorage.removeItem("TimesheetMSSFieldInfo"), LocalStorage.removeItem("ProjectProfiles"), LocalStorage.removeItem("positions"), LocalStorage.removeItem("searchTerms"), LocalStorage.removeItemsByPrefix("recent_")
                }
            }
        }
    }
}]).service("LongOperationService", ["$rootScope", "$ionicLoading", function (e, t) {
    return e.showLoading = {}, {
        start: function (t) {
            e.showLoading[t] = !0
        },
        startN: function (t) {
            "undefined" == typeof e.showLoading[t] && (e.showLoading[t] = 0), e.showLoading[t]++
        },
        startBlock: function () {
            t.show({
                template: '<ion-spinner class="fullscreen-spinner"></ion-spinner>'
            })
        },
        end: function (t) {
            delete e.showLoading[t]
        },
        endN: function (t) {
            e.showLoading[t]--, 0 == e.showLoading[t] && delete e.showLoading[t]
        },
        endBlock: function () {
            t.hide()
        }
    }
}]).service("ProgressService", ["$ionicLoading", function (e) {
    return {
        start: function () {
            e.show({
                template: '<div><progress id="progress" max="100" min="0" value="0"></progress></div>'
            })
        },
        setProgress: function (e) {
            document.getElementById("progress").value = e
        },
        end: function () {
            e.hide()
        }
    }
}]).service("FileFromOsService", ["$rootScope", function (e) {
    return {
        add: function (t, n, o, r) {
            -1 != n.indexOf("image/") ? e.attachment = {
                filename: r,
                src: "data:" + n + ";base64," + t,
                dataURL: null,
                text: o
            } : e.attachment = {
                filename: r,
                src: "img/file.png",
                dataURL: "data:" + n + ";base64," + t,
                text: o
            }
        },
        remove: function () {
            e.attachment = null
        }
    }
}]).service("RefreshService", ["LocalStorageService", function (e) {
    return {
        refresh: function (t) {
            e.removeItem("lastTimeCheckedDocSession"), e.removeItem("lastTimeCheckedConfig"), e.removeItem("lastTimeCheckedEnvConfig"), e.removeItem("lastTimeCheckedUser"), e.removeItem("user"), sessionStorage.clear();
            var n = e.getLocalStorageServiceNonEncrypted();
            n.clearUsageData(), t && t.employerImageUrl && blobSupport && DOMURL && DOMURL.revokeObjectURL && DOMURL.revokeObjectURL(t.employerImageUrl)
        }
    }
}]).service("ConnectionService", ["$ionicPopup", "$state", "$rootScope", "$http", "$timeout", "$q", "LongOperationService", "LocalStorageService", "RefreshService", "PositionService", function (e, t, n, o, r, i, a, s, c, l) {
    function u() {
        var e = i.defer();
        return "undefined" != typeof navigator.connection && "unknown" != navigator.connection.type && "none" == navigator.connection.type ? (navigator.connection.getInfo(function (t) {
            navigator.connection.type = t, "unknown" != t && "none" == navigator.connection.type ? (n.internetActive = !1, e.reject("nointernet")) : (n.internetActive = !0, e.resolve())
        }, function () {
            n.internetActive = !1, e.reject("nointernet")
        }), e.promise) : (n.internetActive = !0, e.resolve(), e.promise)
    }

    function d(e, t, n) {
        log(JSON.stringify(n.data)), n.data.client && SessionStorage.setItem("client-ip", n.data.client);
        var o = LocalStorage.getItem("latestconfig");
        null != t && n.data.latestconfig && (null == o || parseInt(o, 10) < n.data.latestconfig) && (LocalStorage.setItem("latestconfig", n.data.latestconfig), r(function () {
            log("update to new config version " + o + " -> " + n.data.latestconfig), c.refresh()
        }, 10));
        var i = LocalStorage.getItem("authconfig");
        return null != t && n.data.authconfig && (null == i || parseInt(i, 10) < n.data.authconfig) && (LocalStorage.setItem("authconfig", n.data.authconfig), r(function () {
            log("update to new auth version " + i + " -> " + n.data.authconfig), LocalStorage.removeItem("ProjectAuth")
        }, 10)), "OK" != n.data.status ? "MUSTUPDATE" == n.data.status ? void e.reject("mustupdate") : void e.reject("noservices") : (SessionStorage.setItem("lastTimeChecked", Date.now()), void e.resolve())
    }

    function f(e, t, n, r, a, s) {
        var c = i.defer(),
            l = SessionStorage.getItem("lastTimeChecked");
        if (null == l || Date.now() - l > timeoutServiceStatus) {
            log("service check");
            var u = {
                AppVersion: String(appbuildversion)
            };
            if ("undefined" != typeof t && null != t && (u.EnvKey = t), "undefined" != typeof n && null != n && (u.AppPushToken = n), "undefined" != typeof r && null != r && (u.AppUID = r), "undefined" != typeof a && null != a && null != s) {
                try {
                    s = JSON.parse(s)
                } catch (f) {}
                var p = {
                    position: cloneAsObject(a),
                    userid: s ? s.user : ""
                };
                u.AppInfo = utf8_to_b64(JSON.stringify(p))
            }
            checkPlugin("http") ? cordova.plugins.http.get(serviceUrl + "/servicestatus", {
                t: Date.now()
            }, u, function (t) {
                try {
                    t.data = JSON.parse(t.data), log("certificate pin checked"), d(c, e, t)
                } catch (n) {
                    log("JSON parsing error"), c.reject("errorssl")
                }
            }, function (e) {
                log(e.error), c.reject("errorssl")
            }) : o.get(serviceUrl + "/servicestatus?t=" + Date.now(), {
                headers: u,
                timeout: 7e3
            }).then(function (t) {
                d(c, e, t)
            }, function (e) {
                log(JSON.stringify(e)), c.reject("errorservice")
            })
        } else c.resolve();
        return c.promise
    }
    var p;
    return {
        testConnectionStart: function () {
            return a.start("testConnection"), s.getItem("appUID").then(function (e) {
                return s.getBaseItem("push-token").then(function (t) {
                    return s.getItem("token").then(function (n) {
                        return s.getItem("loginkey").then(function (o) {
                            return s.getItem("user").then(function (r) {
                                return l.getPosition().then(function (i) {
                                    return u().then(function () {
                                        return f(n, o, t, e, i, r)
                                    })["finally"](function () {
                                        a.end("testConnection")
                                    })
                                })
                            })
                        })
                    })
                })
            })
        },
        testConnection: function () {
            return s.getItem("appUID").then(function (n) {
                return s.getBaseItem("push-token").then(function (o) {
                    return s.getItem("token").then(function (r) {
                        return s.getItem("loginkey").then(function (a) {
                            return s.getItem("user").then(function (s) {
                                return l.getPosition().then(function (c) {
                                    return u().then(function () {
                                        return f(r, a, o, n, c, s)["catch"](function (n) {
                                            switch (log("catch " + n), n) {
                                            case "noservices":
                                                p || (p = !0, e.alert({
                                                    title: atrans("error", "Foutmelding"),
                                                    template: atrans("noServiceText", "Op dit moment wordt er onderhoud gepleegd aan de services.")
                                                })["finally"](function () {
                                                    p = !1
                                                }));
                                                break;
                                            case "mustupdate":
                                                t.go("noconnection", {
                                                    type: n
                                                }, {
                                                    reload: !0
                                                });
                                                break;
                                            case "errorssl":
                                                p || (p = !0, e.alert({
                                                    title: atrans("error", "Foutmelding"),
                                                    template: atrans("errorSSL", "SSL fout bij benaderen van de services.")
                                                })["finally"](function () {
                                                    p = !1
                                                }));
                                                break;
                                            default:
                                                p || (p = !0, e.alert({
                                                    title: atrans("error", "Foutmelding"),
                                                    template: atrans("noServiceConn", "Services niet bereikbaar. Probeer het later opnieuw.")
                                                })["finally"](function () {
                                                    p = !1
                                                }))
                                            }
                                            return i(function (e, t) {
                                                t()
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }, function () {
                return p || (p = !0, e.alert({
                    title: atrans("error", "Foutmelding"),
                    template: atrans("disconnectedText", "Er is geen verbinding met het internet")
                })["finally"](function () {
                    p = !1
                })), i(function (e, t) {
                    t()
                })
            })
        }
    }
}]).service("HttpService", ["$http", "$q", function (e, t) {
    return checkPlugin("http") ? {
        get: function (n, o) {
            if ("json" == o.responseType) {
                var r = t.defer(),
                    i = parseQuery(n);
                return cordova.plugins.http.get(i.uri, i.query, o.headers, function (e) {
                    e.data = JSON.parse(e.data), r.resolve(e)
                }, function () {
                    r.reject.apply(r.resolve, arguments)
                }), r.promise
            }
            return e.get(n, o)
        },
        post: function () {
            return e.post.apply(e, arguments)
        },
        "delete": function () {
            return e["delete"].apply(e, arguments)
        },
        put: function () {
            return e.put.apply(e, arguments)
        }
    } : e
}]).service("ConnectorService", ["$q", "$timeout", "LongOperationService", "ConnectionService", "LocalStorageService", "HttpService", "$ionicPopup", function (e, t, n, o, r, i, a) {
    function s(e) {
        if (log(e), 1 == e.code) {
            var t = cordova.plugins.permissions;
            t ? t.requestPermission(t.WRITE_EXTERNAL_STORAGE, function (e) {
                e.hasPermission || a.alert({
                    title: atrans("error", "Foutmelding"),
                    template: atrans("checkpermis", "Opslaan in Download folder mislukt, check de App Machtiging voor Opslag")
                })
            }) : a.alert({
                title: atrans("error", "Foutmelding"),
                template: atrans("checkpermis", "Opslaan in Download folder mislukt, check de App Machtiging voor Opslag")
            })
        } else a.alert({
            title: atrans("error", "Foutmelding"),
            template: atrans("downloaderr", "Opslaan in Download folder mislukt. Code:") + e.code
        })
    }

    function c(e, t, n) {
        if ("undefined" == typeof window.cordova || !ionic.Platform.isIOS() && !ionic.Platform.isAndroid()) {
            var o = document.createElement("a");
            o.href = e, o.setAttribute("download", t), o.click()
        } else {
            var r = e.split("base64,"),
                i = r[0].split(":")[1].split(";")[0],
                c = Base64Binary.decodeArrayBuffer(r[1]),
                l = cordova.file.dataDirectory;
            window.resolveLocalFileSystemURL(l, function (e) {
                e.getFile(t, {
                    create: !0
                }, function (e) {
                    e.createWriter(function (o) {
                        o.onwriteend = function (o) {
                            if (!n || ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                                var r = !1;
                                ionic.Platform.isAndroid() && (checkDeviceVersionLowerThan(6) || !n) && (r = !0, window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (o) {
                                    var r = o.root.nativeURL + "Download";
                                    window.resolveLocalFileSystemURL(r, function (o) {
                                        e.moveTo(o, t, function (e) {
                                            n ? window.cordova.plugins.fileOpener2.open(decodeURI(e.nativeURL), i) : a.alert({
                                                title: atrans("download", "Download"),
                                                template: atrans("savedindownloaddir", "Opgeslagen in Download folder: ") + t
                                            })
                                        }, function (e) {
                                            s(e)
                                        })
                                    })
                                })), r || window.cordova.plugins.fileOpener2.open(ionic.Platform.isAndroid() ? decodeURI(e.nativeURL) : e.nativeURL, i)
                            } else openUrlGlobal(ionic.Platform.isAndroid() ? decodeURI(e.nativeURL) : e.nativeURL)
                        }, o.write(c)
                    })
                }, function (e) {
                    s(e)
                })
            })
        }
    }

    function l() {
        return r.getItem("loginkey").then(function (e) {
            return r.getItem("token").then(function (t) {
                return r.getItem("appUID").then(function (n) {
                    return r.getBaseItem("push-token").then(function (o) {
                        return r.getItem("user").then(function (r) {
                            var i;
                            if (r) try {
                                i = JSON.parse(r)
                            } catch (a) {}
                            return {
                                headers: {
                                    Authorization: "AfasKeyToken " + btoa(e + ":" + t),
                                    AppVersion: String(appbuildversion),
                                    AppUID: n,
                                    AppPushToken: o,
                                    UserId: i ? i.user : "",
                                    "Accept-Language": window.currentLanguage
                                },
                                reponseType: "json"
                            }
                        })
                    })
                })
            })
        })
    }

    function u(e) {
        switch (typeof e) {
        case "number":
        case "boolean":
            return String(e);
        case "string":
            return e;
        case "object":
            if (e instanceof Array) {
                for (var t = 0; t < e.length; t++) "undefined" != typeof e[t] && null != e[t] && (e[t] = e[t].toString().replace(/,/g, "__COMMA__"));
                return e.join(",")
            }
        }
        return "undefined"
    }
    var d = {};
    return {
        executeGet: function (e, t, r, a, s) {
            return n.start(e), o.testConnection().then(function () {
                return l().then(function (o) {
                    var c = "",
                        l = "";
                    return void 0 !== t && (void 0 !== t["static"] && void 0 !== t["static"].fields && (l = "/" + encodeURIComponent(u(t["static"].fields)) + "/" + encodeURIComponent(u(t["static"].values))), versionsActive.Profit8 && void 0 !== t.jsonFilter && (c = "?filterjson=" + encodeURIComponent(JSON.stringify(t.jsonFilter))), void 0 !== t.dynamic && void 0 !== t.dynamic.fields && (c = "?filterfieldids=" + encodeURIComponent(u(t.dynamic.fields)) + "&filtervalues=" + encodeURIComponent(u(t.dynamic.values)), void 0 !== t.dynamic.operatortypes && (c += "&operatortypes=" + encodeURIComponent(u(t.dynamic.operatortypes))))), void 0 !== r && (c += -1 != c.indexOf("?") ? "&" : "?", c += "skip=" + encodeURIComponent(r)), void 0 !== a && (c += -1 != c.indexOf("?") ? "&" : "?", c += "take=" + encodeURIComponent(a)), void 0 !== s && (c += -1 != c.indexOf("?") ? "&" : "?", c += "orderbyfieldids=" + encodeURIComponent(u(s))), log("get " + e), i.get(serviceUrl + "/connectors/" + encodeURIComponent(e) + l + c, o).then(function (e) {
                        return e.data.rows
                    }, function (e) {
                        handleErrorResponse(e)
                    })["finally"](function () {
                        log("retrieved " + e), n.end(e)
                    })
                })
            })
        },
        executeData: function (a, s, c, d, f) {
            function p(m, h) {
                e.defer();
                return n.start(a), o.testConnection().then(function () {
                    return l().then(function (o) {
                        "undefined" != typeof m && "" != m && (o.headers.OnlineSessionId = m), "undefined" != typeof d && (o.timeout = d.timeout);
                        var l = "";
                        return void 0 !== s && void 0 !== s.fields && void 0 !== s.values && (l = "?fieldids=" + encodeURIComponent(u(s.fields)) + "&values=" + encodeURIComponent(u(s.values))), log("get dataconnector " + a), i.get(serviceUrl + "/dataconnectors/" + encodeURIComponent(a) + l, o).then(function (e) {
                            if ("undefined" != typeof d && t.cancel(d.id), "undefined" != typeof d && d.expired) throw new SkippedException;
                            return e.data
                        }, function (n) {
                            if ("undefined" != typeof d && t.cancel(d.id), 0 == h && "function" == typeof c && null != n.data && "SessionError" == n.data.externalMessage) return r.removeItem("lastTimeCheckedDocSession").then(function () {
                                return c().then(function (t) {
                                    return p(t.sessionid, h + 1).then(function (t) {
                                        var n = e.defer();
                                        return n.resolve(t), n.promise
                                    })
                                })
                            });
                            if ("undefined" != typeof d && d.expired || f) throw new SkippedException;
                            handleErrorResponse(n)
                        })["finally"](function () {
                            log("retrieved dataconnector " + a), n.end(a)
                        })
                    })
                })
            }
            return "undefined" != typeof d && (d.expired = !1, d.id = t(function () {
                d.expired = !0, d.callback()
            }, d.timeout)), "function" == typeof c ? c().then(function (e) {
                return p(e.sessionid, 0)
            }) : p()
        },
        createSession: function () {
            return n.start("sessionconnector"), o.testConnection().then(function () {
                return l().then(function (e) {
                    return i.get(serviceUrl + "/documentsession", e).then(function (e) {
                        return e.data
                    }, function (e) {
                        handleErrorResponse(e)
                    })["finally"](function () {
                        n.end("sessionconnector")
                    })
                })
            })
        },
        removeSession: function (e) {
            return n.start("sessionconnector"), o.testConnection().then(function () {
                return l().then(function (t) {
                    return i["delete"](serviceUrl + "/documentsession/" + encodeURIComponent(e), t).then(function (e) {})["finally"](function () {
                        n.end("sessionconnector")
                    })
                })
            })
        },
        executeDoc: function (t, a) {
            function s(c, u) {
                var d;
                return c && (d = c.sessionid), n.start("docconnector"), o.testConnection().then(function () {
                    return l().then(function (o) {
                        return "undefined" != typeof d && "" != d && (o.headers.OnlineSessionId = d), i.get(serviceUrl + "/documentconnector/" + encodeURIComponent(t), o).then(function (e) {
                            return e.data.session = c, e.data
                        }, function (t) {
                            return 0 == u && "function" == typeof a && null != t.data && "SessionError" == t.data.externalMessage ? r.removeItem("lastTimeCheckedDocSession").then(function () {
                                return a().then(function (t) {
                                    return s(t.sessionid, u + 1).then(function (t) {
                                        var n = e.defer();
                                        return n.resolve(t), n.promise
                                    })
                                })
                            }) : void handleErrorResponse(t)
                        })["finally"](function () {
                            n.end("docconnector")
                        })
                    })
                })
            }
            return "function" == typeof a ? a().then(function (e) {
                return s(e, 0)
            }) : s()
        },
        getMessages: function (e) {
            return n.start("messages"), o.testConnection().then(function () {
                return l().then(function (t) {
                    return i.get(serviceUrl + "/messages" + (e ? "?delete=" + encodeURIComponent(e) : ""), t).then(function (e) {
                        return e.data.rows
                    }, function (e) {
                        handleErrorResponse(e)
                    })["finally"](function () {
                        n.end("messages")
                    })
                })
            })
        },
        getPositions: function (e, t, r, a) {
            return n.start("positions"), o.testConnection().then(function () {
                return l().then(function (o) {
                    return i.get(serviceUrl + "/positions?lat1=" + encodeURIComponent(e) + "&lat2=" + encodeURIComponent(t) + "&lon1=" + encodeURIComponent(r) + "&lon2=" + encodeURIComponent(a), o).then(function (e) {
                        return e.data.rows
                    }, function (e) {
                        handleErrorResponse(e)
                    })["finally"](function () {
                        n.end("positions")
                    })
                })
            })
        },
        executePost: function (e, t, r, a) {
            return r || n.startBlock(), n.start(e), o.testConnection().then(function () {
                return l().then(function (o) {
                    return i.post(serviceUrl + "/connectors/" + encodeURIComponent(e), t, o).then(function (e) {
                        return e.data
                    }, function (e) {
                        handleErrorResponse(e, a)
                    })["finally"](function () {
                        r || n.endBlock(), n.end(e)
                    })
                })
            })
        },
        executePut: function (e, t, r, a) {
            return r || n.startBlock(), n.start(e), o.testConnection().then(function () {
                return l().then(function (o) {
                    return i.put(serviceUrl + "/connectors/" + encodeURIComponent(e), t, o).then(function (e) {
                        return e.data
                    }, function (e) {
                        handleErrorResponse(e, a)
                    })["finally"](function () {
                        r || n.endBlock(), n.end(e)
                    })
                })
            })
        },
        executeDelete: function (e, t, r, a, s) {
            return s || n.startBlock(), n.start(e), o.testConnection().then(function () {
                return l().then(function (o) {
                    return i["delete"](serviceUrl + "/connectors/" + encodeURIComponent(e) + "/" + encodeURIComponent(t) + "/" + encodeURIComponent(r.join(",")) + "/" + encodeURIComponent(a.join(",")), o).then(function (e) {
                        return e.data
                    }, function (e) {
                        throw new FriendlyException({
                            title: atrans("error", "Foutmelding"),
                            message: atrans("couldnotdelete", "Kon de data niet verwijderen. {0}", e.data && e.data.externalMessage ? e.data.externalMessage : "")
                        })
                    })["finally"](function () {
                        s || n.endBlock(), n.end(e)
                    })
                })
            })
        },
        uploadFileByUrl: function (t, r, i) {
            return n.startBlock(), o.testConnection().then(function () {
                var n = e.defer();
                return l().then(function (e) {
                    if (-1 != r.indexOf("data:") && -1 != r.indexOf("base64,")) {
                        var o = new XMLHttpRequest,
                            a = r.split("base64,"),
                            s = new FormData;
                        if (null == i || "" == i) {
                            var c = a[0].split(":")[1].split(";")[0];
                            i = filenameFromMimeType(c)
                        }
                        s.append("FileBase64", a[1]), i = i.replace(/\+/g, "_"), o.open("POST", serviceUrl + "/fileconnector/" + encodeURIComponent(t) + "/" + encodeURIComponent(i), !0), Object.keys(e.headers).forEach(function (t) {
                            o.setRequestHeader(t, e.headers[t])
                        }), o.onload = function (e) {
                            try {
                                n.resolve(JSON.parse(e.target.response))
                            } catch (t) {
                                log(t), n.reject()
                            }
                        }, o.send(s)
                    } else window.resolveLocalFileSystemURL(r, function (o) {
                        o.file(function (o) {
                            var r = o.localURL,
                                i = decodeURIComponent(r.substr(r.lastIndexOf("/") + 1)),
                                a = new FileReader;
                            a.onloadend = function () {
                                if (blobSupport) {
                                    var r = new Blob([new Uint8Array(this.result)], {
                                            type: o.type
                                        }),
                                        a = new XMLHttpRequest,
                                        s = new FormData;
                                    s.append("file", r), i = i.replace(/\+/g, "_"), a.open("POST", serviceUrl + "/fileconnector/" + encodeURIComponent(t) + "/" + encodeURIComponent(i), !0), Object.keys(e.headers).forEach(function (t) {
                                        a.setRequestHeader(t, e.headers[t])
                                    }), a.onload = function (e) {
                                        n.resolve(JSON.parse(e.target.response))
                                    }, a.send(s)
                                } else {
                                    var a = new XMLHttpRequest,
                                        s = new FormData;
                                    s.append("FileBase64", Uint8ToBase64(new Uint8Array(this.result))), i = i.replace(/\+/g, "_"), a.open("POST", serviceUrl + "/fileconnector/" + encodeURIComponent(t) + "/" + encodeURIComponent(i), !0), Object.keys(e.headers).forEach(function (t) {
                                        a.setRequestHeader(t, e.headers[t])
                                    }), a.onload = function (e) {
                                        try {
                                            n.resolve(JSON.parse(e.target.response))
                                        } catch (t) {
                                            log(t), n.reject()
                                        }
                                    }, a.send(s)
                                }
                            }, a.readAsArrayBuffer(o)
                        }, function (e) {
                            log(e), n.reject()
                        })
                    }, function (e) {
                        log(e), n.reject()
                    });
                    return n.promise
                })
            })["finally"](function () {
                n.endBlock()
            })
        },
        uploadFile: function (e, t, r) {
            return n.startBlock(), o.testConnection().then(function () {
                return l().then(function (n) {
                    var o, a = new FormData;
                    return t ? (a.append("file", t.files[0]), o = t.files[0].name) : (a.append("file", r), o = r.name), o = o.replace(/\+/g, "_"), i.post(serviceUrl + "/fileconnector/" + encodeURIComponent(e) + "/" + encodeURIComponent(o), a, {
                        headers: {
                            "Content-Type": void 0,
                            Authorization: n.headers.Authorization,
                            AppVersion: String(appbuildversion),
                            AppUID: n.headers.AppUID
                        },
                        transformRequest: angular.identity
                    }).then(function (e) {
                        return e.data
                    }, function (e) {
                        handleErrorResponse(e)
                    })
                })["finally"](function () {
                    n.endBlock("fileConnector")
                })
            })
        },
        getPortalQR: function (e) {
            return o.testConnection().then(function () {
                return l().then(function (t) {
                    return n.start("PortalConnector"), i.get(serviceUrl + "/portalqrcode/" + encodeURIComponent(e), t).then(function (e) {
                        return e.data
                    }, function (e) {
                        handleErrorResponse(e)
                    })
                })["finally"](function () {
                    n.endBlock("PortalConnector")
                })
            })
        },
        getQrFileDataUrl: function (e) {
            return l().then(function (t) {
                n.start("QRConnector");
                var o = "",
                    r = "",
                    a = "",
                    s = "",
                    c = "";
                if (e.street_work) {
                    var l = encodeURIComponent(e.street_work + " " + e.house_number_work + (null != e.house_number_add_work ? " " + e.house_number_add_work : "") + (null != e.address_add_work ? ", " + e.address_add_work : "") + (null != e.postal_code_work ? ", " + e.postal_code_work : "") + (null != e.city_work ? ", " + e.city_work : "") + (null != e.country_work ? ", " + e.country_work : ""));
                    o = "&address=" + l
                }
                return (e.mobile || e.phone) && (e.mobile && (r = "&mobile=" + encodeURIComponent(e.mobile)), e.phone && (r += "&tel=" + encodeURIComponent(e.phone))), e["function"] && (s = "&function=" + encodeURIComponent(e["function"])), e.employer && (c = "&orgname=" + encodeURIComponent(e.employer)), e.email && (a = "&email=" + encodeURIComponent(e.email)), i.get(serviceUrl + "/qrcode-contact?format=2&name=" + encodeURIComponent(e.name) + o + r + a + s + c, t).then(function (e) {
                    return e.data ? "data:" + e.data.mimetype + ";base64," + e.data.filedata : void 0
                }, function (e) {
                    handleErrorResponse(e)
                })["finally"](function () {
                    n.end("QRConnector")
                })
            })
        },
        getFileData: function (t, o, a, s) {
            function c(u, d) {
                var f = e.defer();
                return "undefined" != typeof t[o] && "undefined" != typeof t[a] ? l().then(function (l) {
                    return "undefined" != typeof u && "" != u && (l.headers.OnlineSessionId = u), r.getItem("config").then(function (u) {
                        var f = {};
                        isNotEmpty(u) && (f = JSON.parse(u));
                        var p = "";
                        isVersionOrHigher(f, "2016B2PU10") && "undefined" != typeof sendAsBinary && sendAsBinary && blobSupport && (p += "&sendAsBinary=1", l.responseType = "arraybuffer"), n.start("fileConnector");
                        var m = encodeURIComponent(t[a]);
                        return -1 != m.indexOf("%26") || -1 != m.indexOf("%3F") ? (p += (-1 == p.indexOf("?") ? "?" : "&") + "filenameuri=" + m, m = "") : m = "?filenameuri=" + m, i.get(serviceUrl + "/fileconnector/" + encodeURIComponent(t[o]) + m + p, l).then(function (e) {
                            if (e.data.filedata) return e.data.guid = t[o], e.data;
                            if (blobSupport) {
                                var n = new Blob([e.data]);
                                return DOMURL.createObjectURL(n)
                            }
                            if (window.WebKitBlobBuilder) {
                                var r = new WebKitBlobBuilder;
                                return r.append(e.data), DOMURL.createObjectURL(r.getBlob())
                            }
                        }, function (n) {
                            var i = n.data;
                            return "arraybuffer" == n.config.responseType && (i = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(i)))), 0 == d && null != i && "SessionError" == i.externalMessage ? r.removeItem("lastTimeCheckedDocSession").then(function () {
                                return s().then(function (n) {
                                    return c(n.sessionid, d + 1).then(function (n) {
                                        var r = e.defer();
                                        return n.guid = t[o], r.resolve(n), r.promise
                                    })
                                })
                            }) : (t.error = !0, void handleErrorResponse(n, !0))
                        })["finally"](function () {
                            n.end("fileConnector")
                        })
                    })
                }) : (t.error = !0, f.reject(), f.promise)
            }
            return "function" == typeof s ? s().then(function (e) {
                return c(e.sessionid, 0)
            }) : c()
        },
        getImageData: function (t, o, a, s, c) {
            function u(f, p) {
                return r.getItem("config").then(function (m) {
                    var h = {};
                    isNotEmpty(m) && (h = JSON.parse(m));
                    var g = "";
                    return "undefined" != typeof t ? ("undefined" != typeof o && (g = "?format=" + encodeURIComponent(o)), isVersionOrHigher(h, "2016B2PU8") && blobSupport && (g += (-1 == g.indexOf("?") ? "?" : "&") + "sendAsBinary=1"), isVersionOrHigher(h, "Profit11") && c && (g += (-1 == g.indexOf("?") ? "?" : "&") + "dontcache=1"), l().then(function (c) {
                        var l = e.defer();
                        return g += (-1 == g.indexOf("?") ? "?" : "&") + "appuid=" + encodeURIComponent(c.headers.AppUID), "undefined" == typeof d[t] || "undefined" == typeof d[t][o] ? (isVersionOrHigher(h, "2016B2PU8") && blobSupport && (c.responseType = "arraybuffer"), "undefined" != typeof f && "" != f && (c.headers.OnlineSessionId = f), n.start("fileConnector"), i.get(serviceUrl + "/imageconnector/" + encodeURIComponent(t) + g, c).then(function (e) {
                            "undefined" == typeof d[t] && (d[t] = []);
                            var n;
                            if (e.data.filedata) n = "data:" + e.data.mimetype + ";base64," + e.data.filedata;
                            else if (blobSupport) {
                                var r = new Blob([e.data]);
                                n = DOMURL.createObjectURL(r)
                            } else if (window.WebKitBlobBuilder) {
                                var i = new WebKitBlobBuilder;
                                i.append(e.data), n = DOMURL.createObjectURL(i.getBlob())
                            }
                            return d[t][o] = n, {
                                key: t,
                                url: n,
                                state: s
                            }
                        }, function (t) {
                            var n = t.data;
                            return "arraybuffer" == t.config.responseType && (n = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(n)))), 0 == p && null != n && "SessionError" == n.externalMessage ? r.removeItem("lastTimeCheckedDocSession").then(function () {
                                return a().then(function (t) {
                                    return u(t.sessionid, p + 1).then(function (t) {
                                        var n = e.defer();
                                        return n.resolve(t), n.promise
                                    })
                                })
                            }) : void handleErrorResponse(t, !0)
                        })["finally"](function () {
                            n.end("fileConnector")
                        })) : (l.resolve({
                            key: t,
                            url: d[t][o],
                            state: s
                        }), l.promise)
                    })) : void 0
                })
            }
            return "function" == typeof a ? a().then(function (e) {
                return u(e.sessionid, 0)
            }, function () {
                u()
            }) : u()
        },
        downloadUrl: function (e, t, n) {
            var o = new XMLHttpRequest;
            o.open("GET", e, !0), o.responseType = "blob", o.onload = function () {
                var e = new FileReader;
                e.onload = function () {
                    c(e.result, t, n)
                }, e.readAsDataURL(o.response)
            }, o.send()
        },
        downloadFile: function (e, t, o, r, i, a) {
            return n.startBlock(), this.getFileData(e, t, o, r).then(function (e) {
                null != e && c("data:" + e.mimetype + ";base64," + e.filedata, a ? a : e.filename, i)
            })["finally"](function () {
                n.endBlock()
            })
        },
        requestOTP: function (e, t) {
            return n.startBlock(), o.testConnection().then(function () {
                var n = {
                        headers: {
                            Authorization: "AfasKey " + btoa(t),
                            AppVersion: String(appbuildversion)
                        }
                    },
                    o = {
                        userid: e
                    };
                return i.post(serviceUrl + "/otprequest", o, n).then(function (e) {
                    return e.data
                }, function (e) {
                    handleErrorResponse(e)
                })
            })["finally"](function () {
                n.endBlock()
            })
        },
        getConfig: function () {
            return n.start("config"), o.testConnection().then(function () {
                return l().then(function (e) {
                    return i.get(serviceUrl + "/config?t=" + Date.now(), e).then(function (e) {
                        return e.data
                    }, function (e) {
                        handleErrorResponse(e)
                    })["finally"](function () {
                        n.end("config")
                    })
                })
            })
        },
        getEnvConfig: function () {
            return n.start("envconfig"), o.testConnection().then(function () {
                return l().then(function (e) {
                    return i.get(serviceUrl + "/envconfig?t=" + Date.now(), e).then(function (e) {
                        return e.data
                    }, function (e) {
                        handleErrorResponse(e)
                    })["finally"](function () {
                        n.end("envconfig")
                    })
                })
            })
        },
        validateOTP: function (e, t, r) {
            return n.startBlock(), o.testConnection().then(function () {
                var n = {
                        headers: {
                            Authorization: "AfasKey " + btoa(t),
                            AppVersion: String(appbuildversion)
                        }
                    },
                    o = {
                        userid: e,
                        otp: r
                    };
                return i.post(serviceUrl + "/otpvalidation", o, n).then(function (e) {
                    return e.data
                }, function () {
                    throw new SkippedException
                })
            })["finally"](function () {
                n.endBlock()
            })
        }
    }
}]).service("ConfigService", ["$q", "$state", "ConnectorService", "LocalStorageService", function (e, t, n, o) {
    function r(e) {
        var t = JSON.parse(e);
        if (isVersionOrHigher(t, "Profit11")) {
            if (t.pocketChatTokenExpDate) {
                var n = parseDateString(t.pocketChatTokenExpDate);
                return Date.now() > fromGMTDate(n).valueOf()
            }
            return !0
        }
        return !1
    }
    var i = !1,
        a = [],
        s = !1;
    return {
        getConfig: function () {
            function c(e) {
                function t(e, t) {
                    var n = e.indexOf(t); - 1 != n && e.splice(n, 1)
                }
                var n = SessionStorage.getItem("user"),
                    o = !0;
                if (isNotEmpty(n)) {
                    var r = JSON.parse(n);
                    o = null == r.employee_id || "" == r.employee_id
                }
                o && (t(e.modules, 5), t(e.modules, 6), t(e.modules, 7), t(e.modules, 8), t(e.modules, 9), t(e.modules, 10), t(e.modules, 11), t(e.modules, 17), t(e.modules, 18), t(e.modules, 19), t(e.modules, 20)), versionsActive = {}, isVersionOrHigher(e, "Profit8"), isVersionOrHigher(e, "Profit11"), isVersionOrHigher(e, "Profit12")
            }
            var l = e.defer();
            return i ? (a.push({
                getConfig: this.getConfig,
                promise: l
            }), l.promise) : (i = !0, o.getItem("lastTimeCheckedConfig").then(function (i) {
                return o.getItem("config").then(function (a) {
                    var l = null;
                    if (null == a || "" == a || null == i || "" == i || Date.now() - i > timeoutConfig || r(a)) {
                        if (s || (s = !0, l = n.getConfig().then(function (e) {
                                if (log("config from network"), null == e || null == e.modules) throw new SkippedException;
                                return e.mustupdate ? t.go("noconnection", {
                                    type: "mustupdate"
                                }, {
                                    reload: !0
                                }) : o.setItem("lastTimeCheckedConfig", Date.now()), o.setItem("config", JSON.stringify(e)), c(e), e
                            })["finally"](function () {
                                promisBusy = !1
                            })), isNotEmpty(a)) {
                            var u = JSON.parse(a);
                            if (null != u && null != u.modules) return c(u), e(function (e, t) {
                                e(u)
                            })
                        }
                        if (null != l) return l;
                        throw new SkippedException
                    }
                    var u = JSON.parse(a);
                    if (null == u || null == u.modules) throw new ConnectorException(ConnectorError_InvalidConfig, atrans("invalidconfig", "Configuratie ongeldig."));
                    return c(u), e(function (e, t) {
                        e(u)
                    })
                })
            })["finally"](function () {
                if (i = !1, a.length > 0) {
                    var e = a.shift();
                    e.getConfig().then(function (t) {
                        e.promise.resolve(t)
                    })
                }
            }))
        }
    }
}]).service("EnvConfigService", ["$q", "$state", "ConnectorService", "LocalStorageService", "ConfigService", function (e, t, n, o, r) {
    var i = !1,
        a = [];
    return {
        getEnvConfig: function () {
            var t = e.defer();
            return i ? (a.push({
                getEnvConfig: this.getEnvConfig,
                promise: t
            }), t.promise) : (i = !0, r.getConfig().then(function (t) {
                return "undefined" != typeof t.profitversion && null != t.profitversion ? (log("envconfig prep"), o.getItem("lastTimeCheckedEnvConfig").then(function (t) {
                    return o.getItem("envconfig").then(function (r) {
                        return null == r || "" == r || null == t || "" == t || Date.now() - t > timeoutEnvConfig ? n.getEnvConfig().then(function (e) {
                            return log("envconfig network"), o.setItem("lastTimeCheckedEnvConfig", Date.now()), o.setItem("envconfig", JSON.stringify(e)), e
                        }) : (r = JSON.parse(r), e(function (e, t) {
                            e(r)
                        }))
                    })
                })) : e(function (e, t) {
                    e({})
                })
            })["finally"](function () {
                if (i = !1, a.length > 0) {
                    var e = a.shift();
                    e.getEnvConfig().then(function (t) {
                        e.promise.resolve(t)
                    })
                }
            }))
        }
    }
}]).service("DocumentSessionService", ["$q", "$state", "ConnectorService", "LocalStorageService", "$timeout", function (e, t, n, o, r) {
    function i() {
        return o.getItem("lastTimeCheckedDocSession").then(function (t) {
            return o.getItem("DocSession").then(function (i) {
                return null == i || "" == i || null == t || "" == t || Date.now() - t > timeoutDocSession ? (isNotEmpty(i) && (i = JSON.parse(i), o.removeItem("DocSession"), r(function () {
                    n.removeSession(i.sessionid)
                }, 500)), n.createSession().then(function (e) {
                    if (o.setItem("lastTimeCheckedDocSession", Date.now()), "undefined" == typeof e || null == e || "undefined" == typeof e.sessionid) throw new SkippedException;
                    return o.setItem("DocSession", JSON.stringify(e)), e
                })) : (i = JSON.parse(i), e(function (e, t) {
                    e(i)
                }))
            })
        })
    }
    var a = !1,
        s = [];
    return {
        getSession: function () {
            var t = e.defer();
            return a ? (s.push({
                getSession: this.getSession,
                promise: t
            }), t.promise) : (a = !0, i()["finally"](function () {
                if (a = !1, s.length > 0) {
                    var e = s.shift();
                    e.getSession().then(function (t) {
                        e.promise.resolve(t)
                    }, function () {
                        e.promise.reject()
                    })
                }
            }))
        },
        removeSession: function () {
            return o.getItem("DocSession").then(function (e) {
                isNotEmpty(e) && (e = JSON.parse(e), o.removeItem("DocSession"), n.removeSession(e.sessionid))
            })
        }
    }
}]).service("PositionService", ["$q", "LocalStorageService", function (e, t) {
    return {
        getPosition: function () {
            var n = e.defer();
            return t.getItem("positionallowed").then(function (e) {
                "1" == e && navigator.geolocation ? navigator.geolocation.getCurrentPosition(function (e) {
                    n.resolve(e)
                }, function () {
                    n.resolve({})
                }, {
                    maximumAge: 6e4,
                    timeout: 500,
                    enableHighAccuracy: !0
                }) : n.resolve({})
            }), n.promise
        },
        watchPosition: function (e) {
            t.setItem("positionwatched", e ? 1 : 0);
            var n = t.getLocalStorageServiceNonEncrypted();
            t.getItem("positionallowed").then(function (t) {
                if (e) {
                    if ("1" == t && navigator.geolocation) {
                        var o = SessionStorage.getItem("watchid");
                        null == o && (o = navigator.geolocation.watchPosition(function (e) {
                            n.getItem("positions").then(function (t) {
                                t = null == t ? [] : JSON.parse(t), t.push(cloneAsObject(e)), n.setItem("positions", JSON.stringify(t))
                            })
                        }, function (e) {
                            log(e)
                        }), SessionStorage.setItem("watchid", o))
                    }
                } else if (navigator.geolocation) {
                    var o = SessionStorage.getItem("watchid");
                    null != o && (navigator.geolocation.clearWatch(o), SessionStorage.removeItem("watchid")), n.removeItem("positions")
                }
            })
        }
    }
}]).service("FavoriteService", ["$q", "LocalStorageService", "$ionicPopup", function (e, t, n) {
    var o = t.getLocalStorageServiceNonEncrypted();
    return {
        clear: function () {
            o.clearUsageData()
        },
        setFavorite: function (e, t) {
            t = "fav_" + t;
            var r = 5;
            return o.getItem(t).then(function (i) {
                e.$$hashKey && delete e.$$hashKey;
                var a = null;
                "" != i && null != i && (a = JSON.parse(i)), null == a && (a = []);
                for (var s = 0; s < a.length; s++) JSON.stringify(a[s]) == JSON.stringify(e) && a.splice(s, 1);
                return a.unshift(e), a.length > r ? (n.alert({
                    title: atrans("error", "Foutmelding"),
                    template: atrans("favoriteLimitReached", "Maximaal {0} regels kunnen als favoriet worden ingesteld.", r)
                }), !1) : (o.setItem(t, JSON.stringify(a)), !0)
            })
        },
        getFavorites: function (e) {
            return e = "fav_" + e, o.getItem(e).then(function (e) {
                if ("" != e && null != e) var t = JSON.parse(e);
                return t
            })
        },
        removeFavorite: function (e, t) {
            return t = "fav_" + t, o.getItem(t).then(function (n) {
                if ("" != n && null != n) var r = JSON.parse(n);
                for (var i = 0; i < r.length; i++) r[i]._id == e._id && r.splice(i, 1);
                o.setItem(t, JSON.stringify(r))
            })
        }
    }
}]).service("SearchService", ["$q", "LocalStorageService", function (e, t) {
    var n = t.getLocalStorageServiceNonEncrypted();
    return {
        clear: function () {
            n.clearUsageData()
        },
        setRecentlySelected: function (e, t) {
            var o = 15;
            n.getItem(t).then(function (r) {
                e.$$hashKey && delete e.$$hashKey;
                var i = null;
                "" != r && null != r && (i = JSON.parse(r)), null == i && (i = []);
                for (var a = 0; a < i.length; a++) JSON.stringify(i[a]) == JSON.stringify(e) && i.splice(a, 1);
                i.unshift(e), i.length > o && i.pop(), n.setItem(t, JSON.stringify(i))
            })
        },
        getRecentlySelected: function (e) {
            return n.getItem(e).then(function (e) {
                if ("" != e && null != e) var t = JSON.parse(e);
                return t
            })
        },
        setSearchHistory: function (e, t) {
            var o, r = null;
            e && e.length > 0 && n.getItem("searchTerms").then(function (i) {
                if (r = i && "" != i ? JSON.parse(i) : {}, r[t] || (r[t] = new Array(15)), -1 == r[t].indexOf(e)) {
                    var a = new Array(15);
                    for (o = 0; 15 > o && (14 != o && void 0 != r[t][o]); o++) a[o + 1] = r[t][o];
                    a[0] = e, r[t] = a
                } else if (r[t].indexOf(e) > 0) {
                    var s = 0;
                    for (o = 0; 15 > o; o++)
                        if (r[t][o] == e) {
                            s = o;
                            break
                        } for (o = s + 1; 15 > o; o++) r[t][o - 1] = r[t][o];
                    var c = new Array(15);
                    for (o = 0; 15 > o; o++) 14 > o && (c[o + 1] = r[t][o]);
                    c[0] = e, r[t] = c
                }
                n.setItem("searchTerms", JSON.stringify(r))
            })
        },
        getSearchHistory: function (t) {
            var o = null;
            return n.getItem("searchTerms").then(function (n) {
                if (void 0 != n && "" != n && (o = JSON.parse(n), void 0 != o[t])) {
                    for (var r = o[t], i = new Array, a = 0, s = 0; s < r.length; s++) null != r[s] && (i[a] = r[s], a++);
                    if (a > 0) return e(function (e, t) {
                        e(i)
                    })
                }
                return e(function (e, t) {
                    t()
                })
            })
        },
        removeItem: function (e, t) {
            var o = null;
            n.getItem("searchTerms").then(function (r) {
                if (void 0 != r && "" != r && (o = JSON.parse(r), void 0 != o[t])) {
                    for (var i = o[t], a = i, s = 0, c = 0; c < i.length; c++) void 0 != i[c] && i[c] == e && (s = c);
                    for (var l = s; l < a.length && void 0 != i[l]; l++) a[l] = i[l + 1];
                    o[t] = a, n.setItem("searchTerms", JSON.stringify(o))
                }
            })
        }
    }
}]).service("LoginService", ["$state", "$window", "$ionicHistory", "HttpService", "ConnectorService", "LongOperationService", "LocalStorageService", "DocumentSessionService", "RefreshService", function (e, t, n, o, r, i, a, s, c) {
    return {
        logout: function (e) {
            sessionStorage.setItem("enrollPocket", "1"), a.getItem("appUID").then(function (n) {
                a.getBaseItem("qrregs").then(function (r) {
                    a.getItem("loginkey").then(function (i) {
                        a.getItem("token").then(function (l) {
                            a.getItem("userid").then(function (e) {
                                var t = {
                                    headers: {
                                        Authorization: "AfasKeyToken " + btoa(i + ":" + l),
                                        AppVersion: String(appbuildversion),
                                        AppUID: n
                                    }
                                };
                                return isNotEmpty(e) ? o.get(serviceUrl + "/removetoken/" + encodeURIComponent(e), t) : void 0
                            })["finally"](function () {
                                s.removeSession(), c.refresh(e), a.clear(), a.getLocalStorageServiceNonEncrypted().clear(), a.setItem("loginkey", i), a.setBaseItem("qrregs", r), SessionStorage.clear(), t.location.href = "index.html?t=" + (new Date).getTime()
                            })
                        })
                    })
                })
            })
        },
        removeEnvironment: function (e) {
            return a.getItem("appUID").then(function (t) {
                a.getBaseItem("qrregs").then(function (n) {
                    a.getItem("loginkey").then(function (n) {
                        a.getItem("token").then(function (r) {
                            a.getItem("userid").then(function (i) {
                                var a = {
                                    headers: {
                                        Authorization: "AfasKeyToken " + btoa(n + ":" + r),
                                        AppVersion: String(appbuildversion),
                                        AppUID: t
                                    }
                                };
                                isNotEmpty(i) ? o.get(serviceUrl + "/removetoken/" + encodeURIComponent(i), a)["finally"](e) : e()
                            })
                        })
                    })
                })
            })
        },
        goToHome: function (n) {
            SessionStorage.setItem("loginactive", "0"), a.getItem("lastTimeCheckedUser").then(function (r) {
                a.getItem("user").then(function (s) {
                    a.getItem("loginkey").then(function (c) {
                        a.getItem("token").then(function (l) {
                            a.getItem("appUID").then(function (u) {
                                function d() {
                                    deeplinkfuncs.length > 0 ? deeplinkfuncs.pop()() : n ? t.location.href = "index.html?t=" + (new Date).getTime() : e.go("menu.home", {}, {
                                        reload: !0
                                    })
                                }
                                if (null == s || "" == s || null == r || "" == r || Date.now() - r > timeoutUser) {
                                    isNotEmpty(s) && (SessionStorage.setItem("user", s), SessionStorage.setItem("lastTimeCheckedUser", Date.now()), a.removeItem("user"), d());
                                    var f = {
                                        headers: {
                                            Authorization: "AfasKeyToken " + btoa(c + ":" + l),
                                            AppVersion: String(appbuildversion),
                                            AppUID: u
                                        }
                                    };
                                    log("get pocket user"), i.startBlock(), o.get(serviceUrl + "/connectors/Pocket_Main_User", f).then(function (e) {
                                        if (log("retrieved main pocket user"), null != e.data) {
                                            var t = e.data.rows;
                                            if (!(null != t && t.length > 0)) throw new ConnectorException(ConnectorError_NoUser, atrans("Noprofituser", "Geen gebruiker gevonden"));
                                            o.get(serviceUrl + "/connectors/Pocket_User", f).then(function (e) {
                                                if (log("retrieved pocket user"), null != e.data) {
                                                    var n = e.data.rows;
                                                    if (null != n && n.length > 0)
                                                        for (var o in n[0]) n[0].hasOwnProperty(o) && "gender" != o && (t[0][o] = n[0][o])
                                                }
                                            })["finally"](function () {
                                                SessionStorage.setItem("user", JSON.stringify(t[0])), SessionStorage.setItem("lastTimeCheckedUser", Date.now()), checkLocalStoragePrefix(t[0], c), a.setItem("lastTimeCheckedUser", Date.now()), a.setItem("user", JSON.stringify(t[0])), (null == s || "" == s) && d()
                                            })
                                        }
                                    }, function () {
                                        o.get(serviceUrl + "/connectors/Pocket_User", f).then(function (e) {
                                            if (log("retrieved pocket user"), null != e.data) {
                                                var t = e.data.rows;
                                                if (!(null != t && t.length > 0)) throw new ConnectorException(ConnectorError_NoEmployee, atrans("Noprofitemployee", "Geen medewerker gevonden die gekoppeld is aan deze gebruiker"));
                                                SessionStorage.setItem("user", JSON.stringify(t[0])), SessionStorage.setItem("lastTimeCheckedUser", Date.now()), a.setItem("lastTimeCheckedUser", Date.now()), a.setItem("user", JSON.stringify(t[0])), (null == s || "" == s) && d()
                                            }
                                        }, function (e) {
                                            handleErrorResponse(e)
                                        })
                                    })["finally"](function () {
                                        i.endBlock("user")
                                    })
                                } else SessionStorage.setItem("user", s), SessionStorage.setItem("lastTimeCheckedUser", Date.now()), checkLocalStoragePrefix(JSON.parse(s), c), d()
                            })
                        })
                    })
                })
            })
        }
    }
}]).service("EmployeeServiceFactory", ["$q", "ConfigService", "ConnectorService", "UserService", "ContactServiceFactory", "DocumentSessionService", "LongOperationService", "$rootScope", "$timeout", "$ionicPosition", "$ionicScrollDelegate", "$ionicPopup", function (e, t, n, o, r, i, a, s, c, l, u, d) {
    function f() {
        var e, t;
        this._employeesDictionary = e, this._teamsDictionary = t, this._mutProfiles = []
    }

    function p(e, t) {
        for (var n = 0; n < e.length; n++)
            if (e[n].hasOwnProperty(t)) return n;
        var o = {};
        o[t] = {
            Element: {
                Fields: {}
            }
        }, e.push(o);
        var r = e.length - 1;
        return r
    }
    var m = r.getInstance();
    return f.prototype.searchManagerEmployees = function (e, t, o, r) {
        a.start("PocketEmployee");
        var i = {
            dynamic: {}
        };
        return "" != e && (i.dynamic.fields = "id" + (t ? "" : ";first_name_full"), i.dynamic.values = e + (t ? "" : ";" + e), i.dynamic.operatortypes = (t ? "1" : "6") + (t ? "" : ";6")), n.executeGet("Pocket_Emp_Manager", i, o, r, "first_name_full").then(function (e) {
            return e
        })["finally"](function () {
            a.end("PocketEmployee")
        })
    }, f.prototype.searchForField = function (e, t, o, r) {
        if (e.searchview) {
            var i = "";
            s.searchfieldform.searchfield && (i = s.searchfieldform.searchfield);
            var a = {
                    fields: ["Mode", "PocketGuid", "ViewFieldId", "ViewFieldId2", "ViewFieldId3", "ViewFieldValue2", "ViewFieldValue3", "ViewFieldIdDes", "Value1", "Value2", "Query", "Filter", "Skip", "Take", "OnlyId", "QueryFieldId"],
                    values: [3, e.searchview.guid, e.searchview.fieldId, e.searchview.fieldId2, e.searchview.fieldId3, e.searchview.fieldValue2, e.searchview.fieldValue3, e.searchview.fieldIdDes, e.searchview.value1, e.searchview.value2, t, e.searchview.filter, o, r, e.onlyId, i]
                },
                c = e.fieldId;
            return n.executeData("PocketEmpMut", a).then(function (e) {
                if (e && e.rows) {
                    for (var t = e.rows, n = 0; n < t.length; n++) t[n].fieldId = c;
                    return {
                        rows: t,
                        fields: e.fields
                    }
                }
            })
        }
    }, f.prototype.getMutationInfo = function (t, n, o) {
        var r = e.defer(),
            a = this,
            s = null;
        return i.getSession().then(function (e) {
            s = e.maininsite
        })["finally"](function () {
            a.getNewMutationInfo(t, null != s, n, o).then(function (e) {
                r.resolve(e)
            }, function () {
                r.reject()
            })
        }), r.promise
    }, f.prototype.getNewMutationInfo = function (e, t, o, r) {
        var a = {
            fields: ["Mode", "ProfileId", "UseSession", "Type", "SubjectId"],
            values: [2, e, t, o, r]
        };
        return t ? n.executeData("PocketEmpMut", a, function () {
            return i.getSession()
        }, void 0, !0) : n.executeData("PocketEmpMut", a, void 0, void 0, !0)
    }, f.prototype.getMutationFreeTablBySubjectId = function (e, t) {
        var o = {
            fields: ["Mode", "SubjectId", "Type"],
            values: [4, e, t]
        };
        return n.executeData("PocketEmpMut", o)
    }, f.prototype.queryProfiles = function (e, t, n, o, r) {
        var i = [];
        if (this._mutProfiles[r])
            for (var a = 0; a < this._mutProfiles[r].length; a++) !this._mutProfiles[r][a].info || "" != t && -1 == this._mutProfiles[r][a].Description.toLowerCase().indexOf(t.toLowerCase()) || i.push(this._mutProfiles[r][a]);
        e.resolve(i.slice(n, n + o))
    }, f.prototype.searchProfiles = function (t, o, r, a) {
        function s(e, t, n, o, r, i) {
            if (e < n.length) {
                var a = n[e];
                l.getNewMutationInfo(a.Id, o, i).then(function (e) {
                    a.info = e
                })["finally"](function () {
                    s(e + 1, t, n, o, r, i)
                })
            } else r()
        }
        var c = e.defer(),
            l = this,
            u = null;
        return i.getSession().then(function (e) {
            u = e.maininsite
        })["finally"](function () {
            if (null == l._mutProfiles[a]) {
                var e = LocalStorage.getItem("MutProfiles_" + a);
                null != e && 0 == e.indexOf(_prefixLS) && (l._mutProfiles[a] = JSON.parse(b64_to_utf8(e.substr(_prefixLS.length))))
            }
            var i = {},
                d = !0;
            if (null != l._mutProfiles[a])
                for (var f = 0; f < l._mutProfiles[a].length; f++)(!l._mutProfiles[a][f].info || l._mutProfiles[a][f].infoexpdate < (new Date).valueOf()) && (d = !1), i[l._mutProfiles[a][f].Id] = f;
            var p = !1;
            if (null != l._mutProfiles[a] && d && (p = !0, l.queryProfiles(c, "", o, r, a)), !p || null == l._mutProfiles[a] || l._mutProfiles[a].expdate < (new Date).valueOf()) {
                var m = {
                    fields: ["Mode", "Skip", "Take", "Type"],
                    values: [1, -1, -1, a]
                };
                n.executeData("PocketEmpMut", m).then(function (e) {
                    var n = e.rows;
                    n ? s(0, i, n, null != u, function () {
                        l._mutProfiles[a] = n, l._mutProfiles[a].expdate = (new Date).valueOf() + 864e5, LocalStorage.setItem("MutProfiles_" + a, _prefixLS + utf8_to_b64(JSON.stringify(l._mutProfiles[a]))), l.queryProfiles(c, t, o, r, a)
                    }, a) : c.reject()
                })
            }
        }), c.promise
    }, f.prototype.postMutation = function (r) {
        function i(e, o, r, a) {
            t.getConfig().then(function (t) {
                if (o < r.length) {
                    var s = r[o];
                    s.fileId && "HrEmpMutInsite" !== e ? i(e, o + 1, r, a) : s.file ? n.uploadFile(e, null, s.file).then(function (e) {
                        s.fileId = e.fileids[0]
                    })["finally"](function () {
                        i(e, o + 1, r, a)
                    }) : s.fileURI ? n.uploadFileByUrl(e, s.fileURI, s.filename).then(function (e) {
                        s.fileId = e.fileids[0]
                    })["finally"](function () {
                        i(e, o + 1, r, a)
                    }) : i(e, o + 1, r, a)
                } else a()
            })
        }
        return o.getUser().then(function (t) {
            function o(e, o, r) {
                var i, a, s, g = e.haserror,
                    y = {};
                if (y[o] = {
                        Element: {
                            Fields: {
                                ProfileId: e.profileId
                            },
                            Objects: []
                        }
                    }, e.subjectId && (y[o].Element.Fields.SubjectId = e.subjectId), 4 === e.type || 5 === e.type) {
                    if (e.info && e.info.Atta && e.info.Atta.mandatory && (!e.form.attachments || 0 == e.form.attachments.length)) e.error[2] = atrans("mandatoryfile", "Geen bestand bijgevoegd");
                    else if (e.form.attachments && e.form.attachments.length > 0 && (4 === e.type || 5 === e.type)) {
                        var v = p(y[o].Element.Objects, r);
                        y[o].Element.Objects[v][r].Element = [];
                        for (var a = 0; a < e.form.attachments.length; a++) e.form.attachments[a].fileId && y[o].Element.Objects[v][r].Element.push({
                            Fields: {
                                FileId: e.form.attachments[a].fileId
                            }
                        })
                    }
                } else 13 === e.type && (e.info && e.info.FiId && e.info.FiId.mandatory && (!e.form.attachment || 0 == e.form.attachment.length) && (e.error[2] = atrans("mandatoryfile", "Geen bestand bijgevoegd")), e.form.attachments && e.form.attachments.length > 0 && e.form.attachments[0].fileId && (y[o].Element.Fields.FileId = e.form.attachments[0].fileId));
                for (i in h)
                    if (h.hasOwnProperty(i) && "eob" != i && "custom" != i && "atta" != i && ("Img" != i ? g |= checkFormField(m, h, i, t) : !h[i].mandatory || "Img" != i || m.attachments && 0 != m.attachments.length || (e.form.errorfld.Img = atrans("mandatoryfile", "Geen bestand bijgevoegd"), g = !0), g || h[i].element != o || ("object" == typeof m[i] && m[i] && m[i].id ? y[o].Element.Fields[i] = m[i].idext ? m[i].idext : m[i].id : "object" == typeof m[i] && m[i] && m[i].getDate ? y[o].Element.Fields[i] = getJSONDate(fromGMTDate(m[i])) : 12 == h[i].dtype && m[i] ? y[o].Element.Fields[i] = m[i].toString().replace(",", ".") : "Img" == i && m.attachments && m.attachments.length > 0 && m.attachments[0].fileId ? y[o].Element.Fields.FileId = m.attachments[0].fileId : isUpdatable(m, h, i) && (y[o].Element.Fields[i] = m[i])), !g && "AfasEmployee" == h[i].element)) {
                        var v = p(y[o].Element.Objects, "AfasEmployee");
                        "object" == typeof m[i] && m[i] && m[i].id ? y[o].Element.Objects[v].AfasEmployee.Element.Fields[i] = m[i].idext ? m[i].idext : m[i].id : "object" == typeof m[i] && m[i] && m[i].getDate ? y[o].Element.Objects[v].AfasEmployee.Element.Fields[i] = getJSONDate(fromGMTDate(m[i])) : 12 == h[i].dtype && m[i] ? y[o].Element.Objects[v].AfasEmployee.Element.Fields[i] = m[i].toString().replace(",", ".") : isUpdatable(m, h, i) && (y[o].Element.Objects[v].AfasEmployee.Element.Fields[i] = m[i])
                    } if (h.custom)
                    for (s in h.custom)
                        if (h.custom.hasOwnProperty(s) && "eob" != s)
                            for (i in h.custom[s]) h.custom[s].hasOwnProperty(i) && "eob" != i && (g |= checkFormField(m, h.custom[s], i, t)), hasError || ("object" == typeof m[i] && m[i] && m[i].id ? (a = p(y[o].Element.Objects, h.custom[s][i].element), y[o].Element.Objects[a][h.custom[s][i].element].Element.Fields[i] = m[i].idext ? m[i].idext : m[i].id) : "object" == typeof m[i] && m[i] && m[i].getDate ? (a = p(y[o].Element.Objects, h.custom[s][i].element), y[o].Element.Objects[a][h.custom[s][i].element].Element.Fields[i] = getJSONDate(fromGMTDate(m[i]))) : 12 == h.custom[s][i].dtype && m[i] ? (a = p(y[o].Element.Objects, h.custom[s][i].element), y[o].Element.Objects[a][h.custom[s][i].element].Element.Fields[i] = m[i].toString().replace(",", ".")) : isUpdatable(m, h.custom[s], i) && (a = p(y[o].Element.Objects, h.custom[s][i].element), y[o].Element.Objects[a][h.custom[s][i].element].Element.Fields[i] = m[i]));
                if (h.customZ10)
                    for (s in h.customZ10)
                        if (h.customZ10.hasOwnProperty(s) && "eob" != s)
                            for (i in h.customZ10[s]) h.customZ10[s].hasOwnProperty(i) && "eob" != i && (g |= checkFormField(m, h.customZ10[s], i, t)), "object" == typeof m[i] && m[i] && m[i].id ? (a = p(y[o].Element.Objects, h.customZ10[s][i].element), y[o].Element.Objects[a][h.customZ10[s][i].element].Element.Fields[i] = m[i].idext ? m[i].idext : m[i].id) : "object" == typeof m[i] && m[i] && m[i].getDate ? (a = p(y[o].Element.Objects, h.customZ10[s][i].element), y[o].Element.Objects[a][h.customZ10[s][i].element].Element.Fields[i] = getJSONDate(fromGMTDate(m[i]))) : 12 == h.customZ10[s][i].dtype && m[i] ? (a = p(y[o].Element.Objects, h.customZ10[s][i].element), y[o].Element.Objects[a][h.customZ10[s][i].element].Element.Fields[i] = m[i].toString().replace(",", ".")) : isUpdatable(m, h.customZ10[s], i) && (a = p(y[o].Element.Objects, h.customZ10[s][i].element), y[o].Element.Objects[a][h.customZ10[s][i].element].Element.Fields[i] = m[i]);
                return !g && m.FileId, g ? (showErrors(m, h, "main", c, d, l, u), void f.reject()) : n.executePut(o, y).then(function (e) {
                    f.resolve(e)
                })
            }
            var a, s, f = e.defer(),
                m = r.form,
                h = r.info;
            switch (r.type) {
            case 4:
                a = "HrEmpBinMutInsite", s = "HrEmpBinMutInsiteAttachment";
                break;
            case 5:
                a = "HrEmpAdrMutInsite", s = "HrEmpAdrMutInsiteAttachment";
                break;
            case 13:
                a = "HrEmpMutInsite"
            }
            return m.attachments && m.attachments.length > 0 ? i(a, 0, m.attachments, function () {
                o(r, a, s)
            }) : o(r, a, s), f.promise
        })
    }, f.prototype.validateEntry = function (e, t, n) {
        if (!(n.length > 0)) throw new SkippedException;
        switch (e) {
        case 1:
            return m.getOtherEmployees(t, n).then(function (e) {
                if (1 == e.length) return e[0];
                throw new SkippedException
            });
        case 2:
            return this.searchManagerEmployees(n, !0).then(function (e) {
                if (1 == e.length) return e[0];
                throw new SkippedException
            })
        }
    }, f.prototype.getEmployeesList = function (e, t) {
        return n.executeGet("Pocket_Employees", {}, e, t, "name")
    }, f.prototype.getEmployeesByTeam = function (e, t, n) {
        return this._getEmployeesInternal({
            dynamic: {
                fields: "org_unit_id",
                values: e,
                operatortypes: "1"
            }
        }, t, n)
    }, f.prototype.getEmployees = function (e, t) {
        return this._getEmployeesInternal({}, e, t)
    }, f.prototype.getTeams = function (e, t) {
        return this._getTeamsInternal({
            "static": {
                fields: "contains_employees",
                values: !0
            }
        }, e, t)
    }, f.prototype.getBirthdayBoys = function (e) {
        var t = new Date,
            o = {
                dynamic: {
                    fields: ["birth_month", "birth_day"],
                    values: [t.getMonth() + 1, +t.getDate()],
                    operatortypes: ["1", "1"]
                }
            };
        return e && (o.dynamic.fields.push("org_unit_id"), o.dynamic.values.push(e), o.dynamic.operatortypes.push("1")), n.executeGet("Pocket_Employees", o).then(function (e) {
            for (var t = 0; t < e.length; t++)
                if (null == e[t].name) {
                    var n = null == e[t].calling_name ? e[t].first_name : e[t].calling_name;
                    if (e[t].name = null != n ? n : "", "" == e[t].name) {
                        var o = null;
                        "M" == e[t].gender && (o = e[t].titleMale), "V" == e[t].gender && (o = e[t].titleFemale), e[t].name += null != o ? o : ""
                    }
                    e[t].name += null != e[t].prefix ? " " + e[t].prefix : "", e[t].name += null != e[t].last_name ? " " + e[t].last_name : "", "" == e[t].name && (e[t].name = e[t].employee_id)
                } return e
        })
    }, f.prototype.getTeam = function (t) {
        var n = this;
        return "undefined" == typeof n._teamsDictionary || null == n._teamsDictionary || null == n._teamsDictionary[t] ? n._getTeamsInternal({
            dynamic: {
                fields: "team_id",
                values: t,
                operatortypes: "1"
            }
        }).then(function (e) {
            return e[0]
        }) : e(function (e, o) {
            e(n._teamsDictionary[t])
        })
    }, f.prototype.getEmployee = function (t) {
        var n = this;
        return "undefined" == typeof n._employeesDictionary || null == n._employeesDictionary || null == n._employeesDictionary[t] ? n._getEmployeesInternal({
            dynamic: {
                fields: "employee_id",
                values: t,
                operatortypes: "1"
            }
        }).then(function (e) {
            return e[0]
        }) : e(function (e, o) {
            e(n._employeesDictionary[t])
        })
    }, f.prototype.getEmployeeByContact = function (e) {
        return this._getEmployeesInternal({
            dynamic: {
                fields: "person_id",
                values: e,
                operatortypes: "1"
            }
        }).then(function (e) {
            if (e.length > 0) return e[0];
            throw new SkippedException
        })
    }, f.prototype.searchEmployees = function (e) {
        return this._getEmployeesInternal({
            dynamic: {
                fields: "user_id;first_name;full_name;name;job_description;employee_id",
                values: e
            }
        })
    }, f.prototype._getTeamsInternal = function (e, t, o) {
        var r = this;
        return "undefined" == typeof t ? t = 0 : 0 == t && (r._teamsDictionary = {}), "undefined" == typeof r._teamsDictionary && (r._teamsDictionary = {}), n.executeGet("Pocket_OrgUnits", e, t, o, "team_description").then(function (e) {
            if (e) {
                for (var n = 0; n < e.length; n++) r._teamsDictionary[e[n].team_id] = e[n];
                if (t > 0) {
                    e = [];
                    for (var o in r._teamsDictionary) r._teamsDictionary.hasOwnProperty(o) && e.push(r._teamsDictionary[o]);
                    return e.sort(function (e, t) {
                        return e.team_description.toUpperCase() < t.team_description.toUpperCase() ? -1 : e.team_description.toUpperCase() > t.team_description.toUpperCase() ? 1 : 0
                    })
                }
                return e
            }
            throw new SkippedException
        })
    }, f.prototype._getEmployeesInternal = function (e, t, o) {
        var r = this;
        return "undefined" == typeof t ? t = 0 : 0 == t && (r._employeesDictionary = {}), "undefined" == typeof r._employeesDictionary && (r._employeesDictionary = {}), n.executeGet("Pocket_Employees", e, t, o, "name").then(function (e) {
            for (var n = 0; n < e.length; n++) {
                if (null == e[n].name) {
                    var o = null == e[n].calling_name ? e[n].first_name : e[n].calling_name;
                    e[n].name = null != o ? o : "", e[n].name += null != e[n].prefix ? " " + e[n].prefix : "", e[n].name += null != e[n].last_name ? " " + e[n].last_name : "", "" == e[n].name && (e[n].name = e[n].employee_id)
                }
                var i = "";
                if (e[n].titleFemale || e[n].extraTitleFemale) {
                    var a = null,
                        s = null;
                    "M" == e[n].gender && (a = e[n].titleMale, s = e[n].extraTitleMale), "V" == e[n].gender && (a = e[n].titleFemale, s = e[n].extraTitleFemale), e[n].titleBehindName || (i += null != a ? a + " " : ""), e[n].extraTitleBehindName || (i += null != s ? s + " " : ""), i += e[n].name, e[n].titleBehindName && (i += null != a ? " " + a : ""), e[n].extraTitleBehindName && (i += null != s ? " " + s : ""), e[n].name = i
                }
                if (null == e[n].date_of_birth && null != e[n].birth_month && null != e[n].birth_day) switch (currentLanguage) {
                case "nl-nl":
                case "nl-be":
                    e[n].smalldob = e[n].birth_day + " " + locales["nl-nl"].DATETIME_FORMATS.MONTH[e[n].birth_month - 1];
                    break;
                case "en-us":
                    e[n].smalldob = e[n].birth_day + " " + locales["en-us"].DATETIME_FORMATS.MONTH[e[n].birth_month - 1];
                    break;
                case "fr-fr":
                    e[n].smalldob = e[n].birth_day + " " + locales["fr-fr"].DATETIME_FORMATS.MONTH[e[n].birth_month - 1];
                    break;
                case "de-de":
                    e[n].smalldob = e[n].birth_day + " " + locales["de-de"].DATETIME_FORMATS.MONTH[e[n].birth_month - 1]
                }
                "M" == e[n].gender ? e[n].image = "img/man.png" : e[n].image = "img/woman.png", r._employeesDictionary[e[n].employee_id] = e[n]
            }
            if (t > 0) {
                e = [];
                for (var c in r._employeesDictionary) r._employeesDictionary.hasOwnProperty(c) && e.push(r._employeesDictionary[c]);
                return e.sort(function (e, t) {
                    return e.name.toUpperCase() < t.name.toUpperCase() ? -1 : e.name.toUpperCase() > t.name.toUpperCase() ? 1 : 0
                })
            }
            return e
        })
    }, {
        getInstance: function () {
            return new f
        }
    }
}]).service("AFASEventServiceFactory", ["$q", "ConnectorService", "UserService", function (e, t, n) {
    function o() {
        var e = null;
        this._eventsDictionary = e
    }
    return o.prototype.getLiveEventsByGenre = function (e) {
        var o = new Date;
        o.setDate(o.getDate() - 1), o.setHours(0), o.setMinutes(0), o.setSeconds(0), this._eventsDictionary = {};
        var r = {
            dynamic: {
                fields: "Cursusdatum,Genre_ID",
                values: getJSONDate(o) + "," + e,
                operatortypes: "2,1"
            }
        };
        return n.getUser().then(function (e) {
            return t.executeGet("Pocket_AFASGROEP_Event_Participants", r, -1, -1, "Cursusdatum,Naam").then(function (t) {
                for (var n = {}, o = {}, r = 8, i = 0; i < t.length; i++) {
                    t[i].Begintijd && t[i].Eindtijd && (t[i].TimeSpan = t[i].Begintijd + " - " + t[i].Eindtijd);
                    var a = t[i].Cursuscode + "-" + t[i].Evenementcode + "-" + t[i].Sessiecode;
                    n[a] || (n[a] = 0), t[i].Medewerker && "I" == t[i].Statusdienstverband && n[a]++, t[i].Index = i, t[i].Medewerkercode == e.code ? t[i].UserAttended = !0 : o[a] && (t[i].UserAttended = o[a].UserAttended), o[a] = t[i]
                }
                return {
                    free: Object.keys(n).filter(function (e) {
                        return n[e] < r
                    }).map(function (e) {
                        return o[e].Medewerkers = n[e], o[e]
                    }),
                    occupied: Object.keys(n).filter(function (e) {
                        return n[e] >= r
                    }).map(function (e) {
                        return o[e].Medewerkers = n[e], o[e]
                    }),
                    afasevents: t
                }
            })
        })
    }, o.prototype.getEvent = function (t, n, o, r) {
        var i = this,
            a = t + "-" + n + "-" + o;
        return null == i._eventsDictionary || null == i._eventsDictionary[a] || r ? (null == i._eventsDictionary && (this._eventsDictionary = {}), null != i._eventsDictionary[a] && (i._eventsDictionary[a] = null), i._getEventsInternal({
            dynamic: {
                fields: "Cursuscode,Evenementcode,Sessiecode",
                values: [t, n, o],
                operatortypes: "1,1,1"
            }
        }, -1, -1).then(function (e) {
            if (null != e && 1 == e.afasevents.length) return e.afasevents[0];
            throw new SkippedException
        })) : e(function (e, t) {
            e(i._eventsDictionary[a])
        })
    }, o.prototype.searchEvents = function (e) {
        var t = {
            dynamic: {
                fields: "Evenement",
                values: e,
                operatortypes: "6"
            }
        };
        return this._eventsDictionary = {}, this._getEventsInternal(t, -1, -1).then(function (e) {
            return e
        })
    }, o.prototype.getEvents = function () {
        var e = new Date;
        e.setDate(e.getDate() - 1), e.setHours(0), e.setMinutes(0), e.setSeconds(0);
        var t = new Date;
        t.setDate(t.getDate() + 14), t.setHours(23), t.setMinutes(59), t.setSeconds(0), this._eventsDictionary = {};
        var n = {
            dynamic: {
                fields: "Cursusdatum,Cursusdatum",
                values: getJSONDate(e) + "," + getJSONDate(t),
                operatortypes: "2,3"
            }
        };
        return this._getEventsInternal(n, -1, -1).then(function (e) {
            return e
        })
    }, o.prototype._getEventsInternal = function (e, o, r) {
        var i = this;
        return n.getUser().then(function (n) {
            return t.executeGet("Pocket_AFASGROEP_Event_Participants", e, o, r, "Cursusdatum,Naam").then(function (e) {
                for (var t, o = [], r = [], a = [], s = [], c = [], l = [], u = 0; u < e.length; u++) {
                    t = e[u];
                    var d = t.Cursuscode + "-" + t.Evenementcode + "-" + t.Sessiecode;
                    if (null == i._eventsDictionary[d]) {
                        switch (i._eventsDictionary[d] = {
                            CheckedInTotal: 0,
                            Participants: 0,
                            ImageUrls: {},
                            UserAttended: !1,
                            Index: o.length,
                            Name: t.Evenement,
                            Date: t.Cursusdatum,
                            Employees: [],
                            Relations: [],
                            CourseCode: t.Cursuscode,
                            EventCode: t.Evenementcode,
                            SessionCode: t.Sessiecode
                        }, t.Begintijd && t.Eindtijd && (i._eventsDictionary[d].TimeSpan = t.Begintijd + " - " + t.Eindtijd), t.Locatie) {
                        case "AFAS-AZ":
                            i._eventsDictionary[d].ImageUrl = "img/az.png", i._eventsDictionary[d].Description = "Skybox", a.push(i._eventsDictionary[d]);
                            break;
                        case "AZ Kessler":
                            i._eventsDictionary[d].ImageUrl = "img/az.png", i._eventsDictionary[d].Description = "Kessler zaal", s.push(i._eventsDictionary[d]);
                            break;
                        case "LIVE":
                            i._eventsDictionary[d].ImageUrl = "img/afaslive.png", r.push(i._eventsDictionary[d]);
                            break;
                        case "1.TH":
                            i._eventsDictionary[d].ImageUrl = "img/davincy.png", i._eventsDictionary[d].Description = "Da Vinci Theater", c.push(i._eventsDictionary[d]);
                            break;
                        default:
                            i._eventsDictionary[d].ImageUrl = "img/AFAS.png", i._eventsDictionary[d].Description = "Overig", l.push(i._eventsDictionary[d])
                        }
                        o.push(i._eventsDictionary[d])
                    }
                    t.Medewerkercode == n.code && (i._eventsDictionary[d].UserAttended = !0), i._eventsDictionary[d].Participants++, t.Aanwezig && i._eventsDictionary[d].CheckedInTotal++, i._eventsDictionary[d].Percentage = Math.round(100 * i._eventsDictionary[d].CheckedInTotal / i._eventsDictionary[d].Participants), t.Medewerker && "I" == t.Statusdienstverband ? i._eventsDictionary[d].Employees.push({
                        Name: t.Naam,
                        Role: t.Rol,
                        Organisation: t.Organisatie,
                        PersonCode: t.CdId,
                        EmployeeId: t.Medewerkercode,
                        ImageId: t.AfbeeldingId,
                        CheckedIn: t.Aanwezig,
                        PersonId: t.BcId,
                        ContactId: t.CdId
                    }) : i._eventsDictionary[d].Relations.push({
                        Name: t.Naam,
                        Organisation: t.Organisatie,
                        PersonCode: t.CdId,
                        ImageId: t.AfbeeldingId,
                        CheckedIn: t.Aanwezig
                    })
                }
                return t = {}, t.afasliveevents = r, t.azevents = a, t.azevents2 = s, t.afasliveevents = r, t.afastheaterevents = c, t.afasevents = o, t.afasotherevents = l, t
            })
        })
    }, {
        getInstance: function () {
            return new o
        }
    }
}]).service("popup", ["$ionicPopup", function (e) {
    return function (t) {
        "undefined" != typeof window.cordova ? navigator.notification.alert(t, function () {}, atrans("message", "Melding"), atrans("ok", "OK")) : e.alert({
            title: atrans("message", "Melding"),
            template: t
        })
    }
}]).service("question", ["$ionicPopup", function (e) {
    return function (t) {
        if (window.device && "browser" == window.device.platform || "undefined" == typeof window.cordova || !ionic.Platform.isIOS() && !ionic.Platform.isAndroid()) {
            var n = e.confirm({
                title: atrans("message", "Melding"),
                template: t,
                cancelText: atrans("no", "Nee"),
                okText: atrans("yes", "Ja")
            });
            return n.then(function (e) {
                return e
            })
        }
        return new Promise(function (e, n) {
            function o(t) {
                e(1 === t)
            }
            navigator.notification.confirm(t, o, atrans("message", "Melding"), [atrans("yes", "Ja"), atrans("no", "Nee")])
        })
    }
}]).service("ContactServiceFactory", ["$q", "ConnectorService", "maxTakeContacts", "LongOperationService", "ConfigService", "popup", function (e, t, n, o, r, i) {
    function a() {
        var e = null,
            t = null;
        this._contactsDictionary = e, this._contactsByType = t
    }
    return a.prototype.getGoogleMapsLinkAndImage = function (e, t) {
        t && r.getConfig().then(function (n) {
            e.googleMapsLink = "https://maps.google.com/?q=" + encodeURIComponent(t.street) + "%20" + encodeURIComponent(t.house_number) + ",%20" + encodeURIComponent(t.city) + ",%20" + encodeURIComponent(t.country) + "&key=" + encodeURIComponent(n.googlemapikey), e.googleMapsLink = e.googleMapsLink.replace("'", "%27").replace('"', "%22"), n.googlemapikey && (e.googleMapsImage = "https://maps.googleapis.com/maps/api/staticmap?markers=" + encodeURIComponent(t.street) + "%20" + encodeURIComponent(t.house_number) + ",%20" + encodeURIComponent(t.city) + ",%20" + encodeURIComponent(t.country) + "&size=400x200&key=" + encodeURIComponent(n.googlemapikey), e.googleMapsImage = e.googleMapsImage.replace("'", "%27").replace('"', "%22"))
        })
    }, a.prototype.searchContacts = function (e, t, n) {
        function o(e) {
            return "nl-nl" == window.currentLanguage && 6 == e.length ? e.substr(0, 4) + " " + e.substr(4) : e
        }
        return this._getContactsInternal({
            dynamic: {
                fields: "contact;postal_code",
                values: e + ";" + o(e),
                operatorTypes: "6;10"
            }
        }, t, n)
    }, a.prototype.saveContact = function (e) {
        function t(e, t) {
            var a = navigator.contacts.create(),
                s = null == e.prefix || null != e.middle_name && "" != e.middle_name ? e.last_name : e.prefix + " " + e.last_name,
                c = n(e.nickname);
            "" == c && (c = n(e.first_name)), a.displayName = e.name, a.name = {
                givenName: c,
                middleName: e.middle_name,
                familyName: s
            };
            var l = [];
            if (l[0] = new ContactField("work", e.phone_work, !0), l[1] = new ContactField("mobile", e.mobile_work, !1), l[2] = new ContactField("home", e.phone_personal, !1), a.phoneNumbers = l, t) {
                var u = [];
                u[0] = new ContactField("image", t, !0), a.photos = u
            }
            var d = [];
            d[0] = new ContactField("work", e.email_work, !0), d[1] = new ContactField("home", e.email_personal, !1), a.emails = d;
            var f = [];
            f[0] = new ContactAddress(!0, "work", e.street + " " + e.house_number + ", " + e.postal_code + ", " + e.city + ", " + e.country), a.addresses = f, a.save(function (e) {
                i(o)
            }, function (e) {
                i(r)
            })
        }

        function n(e) {
            return null == e ? "" : e
        }
        var o = atrans("contactsaved", "De contactgegevens zijn opgeslagen"),
            r = atrans("contactsavefailed", "Er is iets fout gegaan bij het opslaan van de contactgegevens"),
            a = n(e.nickname);
        if ("" == a && (a = n(e.first_name)), ionic.Platform.isAndroid()) {
            var s = {
                displayName: n(e.name),
                firstName: a,
                lastName: n(e.last_name),
                phoneWork: n(e.phone_work),
                phoneHome: n(e.phone_personal),
                mobileWork: n(e.mobile_work),
                mobileHome: n(e.mobile_personal),
                emailWork: n(e.email_work),
                emailHome: n(e.email_personal),
                street: n(e.street),
                city: n(e.city),
                postCode: n(e.postal_code),
                houseNumber: n(e.house_number),
                country: n(e.country)
            };
            cordova.plugins.ContactCreator.addContact(s, function (e) {
                i(o)
            }, function (e) {
                i(r)
            })
        } else if (ionic.Platform.isIOS())
            if (e.imageUrl) {
                var c = new XMLHttpRequest;
                c.open("GET", e.imageUrl, !0), c.responseType = "blob", c.onload = function (n) {
                    if (200 == this.status) {
                        var o = new FileReader;
                        o.readAsDataURL(this.response), o.onloadend = function () {
                            t(e, o.result)
                        }
                    }
                }, c.send()
            } else t(e)
    }, a.prototype.loadContactImages = function (e) {
        for (var n = {}, o = 0; o < e.length; o++) {
            if (e[o].image_id) n[e[o].image_id] || (n[e[o].image_id] = !0, t.getImageData(e[o].image_id, 1).then(function (t) {
                if (t.url)
                    for (var n = 0; n < e.length; n++) e[n].image_id == t.key && (e[n].image = t.url), e[n].image_id_person == t.key && (e[n].image_person = t.url)
            }));
            else switch (e[o].type) {
            case "ORG":
                e[o].image = "img/org.png";
                break;
            case "PER":
                "M" == e[o].gender ? e[o].image = "img/man.png" : e[o].image = "img/woman.png";
                break;
            case "PRS":
                e[o].image = "img/org.png"
            }
            e[o].image_id_person && "PRS" == e[o].type ? n[e[o].image_id_person] || (n[e[o].image_id_person] = !0, t.getImageData(e[o].image_id_person, 1).then(function (t) {
                if (t.url)
                    for (var n = 0; n < e.length; n++) e[n].image_id == t.key && (e[n].image = t.url), e[n].image_id_person == t.key && (e[n].image_person = t.url)
            })) : "PRS" == e[o].type && e[o].image_person_guid && e[o].image_person_filename ? t.getFileData(e[o], "image_person_guid", "image_person_filename").then(function (t) {
                for (var n = 0; n < e.length; n++) e[n].image_person_guid == t.guid && (e[n].image_person = "data:" + t.mimetype + ";base64," + t.filedata)
            }) : "PRS" == e[o].type && ("M" == e[o].gender ? e[o].image_person = "img/man.png" : e[o].image_person = "img/woman.png")
        }
    }, a.prototype.searchRelatedContacts = function (e) {
        var t = "number_person",
            n = e.number_person;
        return "ORG" == e.type && (t = "organization_person_number", n = e.organization_person_number), this._getContactsInternal({
            "static": {
                fields: t,
                values: n
            },
            dynamic: {
                fields: "type",
                values: e.type,
                operatortypes: 7
            }
        })
    }, a.prototype.getRelatedPRS = function (e) {
        return this._getContactsInternal({
            "static": {
                fields: "organization_person_number;organization_person_number",
                values: e.organization_person_number + ";" + e.number_person
            },
            dynamic: {
                fields: "type",
                values: "PRS",
                operatortypes: 7
            }
        })
    }, a.prototype.getContactsByType = function (e) {
        var t, n = new Array;
        if ("PER" == e || "PRS" == e) {
            if (null != this._contactsByType && void 0 !== this._contactsByType.PER)
                for (t = 0; t < this._contactsByType.PER.length; t++) n.push(this._contactsDictionary[this._contactsByType.PER[t]]);
            if (null != this._contactsByType && void 0 !== this._contactsByType.PRS)
                for (t = 0; t < this._contactsByType.PRS.length; t++) n.push(this._contactsDictionary[this._contactsByType.PRS[t]])
        }
        if ("ORG" == e && null != this._contactsByType && void 0 !== this._contactsByType[e])
            for (t = 0; t < this._contactsByType.ORG.length; t++) n.push(this._contactsDictionary[this._contactsByType.ORG[t]]);
        return n
    }, a.prototype.getCachedContacts = function () {
        var e = new Array;
        for (var t in this._contactsDictionary) e.push(this._contactsDictionary[t]);
        return e
    }, a.prototype.searchCachedContacts = function (e, t) {
        var n = "number_person",
            o = e.number_person;
        "ORG" == e.type && (n = "organization_person_number", o = e.organization_person_number);
        var r = t + "," + e.type;
        return this._getContactsInternal({
            "static": {
                fields: n,
                values: o
            },
            dynamic: {
                fields: "contact,type",
                values: r,
                operatortypes: "6,7"
            }
        })
    }, a.prototype.searchByEmails = function (n) {
        for (var o = {
                dynamic: {
                    fields: "",
                    values: "",
                    operatortypes: "1"
                }
            }, r = {
                dynamic: {
                    fields: "",
                    values: "",
                    operatortypes: "1"
                }
            }, i = [], a = [], s = 0; s < n.length; s++) i.push("email_work"), a.push("email_personal");
        o.dynamic.fields = i.join(";"), o.dynamic.values = n.join(";"), r.dynamic.fields = a.join(";"), r.dynamic.values = n.join(";");
        var c = [],
            l = [t.executeGet("Pocket_Contacts", o).then(function (e) {
                c = c.concat(e)
            }), t.executeGet("Pocket_Contacts", r).then(function (e) {
                c = c.concat(e)
            })];
        return e.all(l).then(function () {
            return c
        })
    }, a.prototype.searchOtherEmployees = function (e, n, i, a) {
        return r.getConfig().then(function (r) {
            var s;
            return o.start("PocketEmployee"), isVersionOrHigher(r, "2016B2PU8") ? (s = {
                dynamic: {
                    fields: "employee_id",
                    values: n,
                    operatortypes: "7"
                }
            }, "" != e && (s.dynamic.fields = "employee_id;full_name," + s.dynamic.fields, s.dynamic.values = e + ";" + e + "," + s.dynamic.values, s.dynamic.operatortypes = "6;6," + s.dynamic.operatortypes), t.executeGet("Pocket_Employees", s, i, a, "name").then(function (e) {
                return e
            })["finally"](function () {
                o.end("PocketEmployee")
            })) : (s = {
                dynamic: {
                    fields: "employee_id,employee_id",
                    values: "," + n,
                    operatortypes: "9,7"
                }
            }, "" != e && (s.dynamic.fields = "contact," + s.dynamic.fields, s.dynamic.values = e + "," + s.dynamic.values, s.dynamic.operatortypes = "6," + s.dynamic.operatortypes), t.executeGet("Pocket_Contacts", s, i, a, "contact").then(function (e) {
                return e
            })["finally"](function () {
                o.end("PocketEmployee")
            }))
        })
    }, a.prototype.getOtherEmployees = function (e, n) {
        return r.getConfig().then(function (r) {
            o.start("PocketEmployee");
            var i = "undefined" != typeof n,
                a = e ? {
                    fields: "employee_id,employee_id" + (i ? ",employee_id" : ""),
                    values: "," + e + (i ? "," + n : ""),
                    operatortypes: "9,7" + (i ? ",1" : "")
                } : {
                    fields: i ? "employee_id" : "",
                    values: i ? n : "",
                    operatortypes: i ? "1" : ""
                };
            return isVersionOrHigher(r, "2016B2PU8") ? t.executeGet("Pocket_Employees", {
                dynamic: {
                    fields: "employee_id" + (i ? ",employee_id" : ""),
                    values: e + (i ? "," + n : ""),
                    operatortypes: "7" + (i ? ",1" : "")
                }
            }, -1, -1).then(function (e) {
                return e
            })["finally"](function () {
                o.end("PocketEmployee")
            }) : t.executeGet("Pocket_Contacts", {
                dynamic: a
            }, -1, -1, "contact").then(function (e) {
                return e
            })["finally"](function () {
                o.end("PocketEmployee")
            })
        })
    }, a.prototype.getContact = function (t) {
        var n = this;
        return null == n._contactsDictionary || null == n._contactsDictionary[t] ? n._getContactsInternal({
            "static": {
                fields: "guid",
                values: t
            }
        }).then(function (e) {
            return e[0]
        }) : e(function (e, o) {
            e(n._contactsDictionary[t])
        })
    }, a.prototype._getContactsInternal = function (e, o, r) {
        var i = this;
        return "undefined" == typeof o && (o = 0), "undefined" == typeof r && (r = n), t.executeGet("Pocket_Contacts", e, o, r, "person,contact").then(function (e) {
            0 == o && (i._contactsDictionary = {}, i._contactsByType = {});
            for (var t = 0; t < e.length; t++) "PRS" == e[t].type ? e[t].search_term = e[t].person : e[t].search_term = e[t].name, i._contactsDictionary[e[t].guid] = e[t], void 0 == i._contactsByType[e[t].type] && (i._contactsByType[e[t].type] = []), i._contactsByType[e[t].type].push(e[t].guid);
            if (o > 0) {
                e = [];
                for (var n in i._contactsDictionary) i._contactsDictionary.hasOwnProperty(n) && e.push(i._contactsDictionary[n]);
                return e
            }
            return e
        })
    }, {
        getInstance: function () {
            return new a
        }
    }
}]).service("LocaleService", ["$q", function (e) {
    var t;
    return {
        setLocale: function (e) {
            t = e
        },
        getLocale: function () {
            return t
        }
    }
}]).service("MyCompanyService", ["$q", "ConnectorService", "LocalStorageService", function (e, t, n) {
    return {
        getInfo: function (e) {
            return n.getItem("mycompanysubject").then(function (t) {
                var n = SessionStorage.getItem("mycompanyhtml");
                if ((isNotEmpty(n) || e) && isNotEmpty(t)) return {
                    html: n,
                    subject: t
                };
                throw new SkippedException
            })
        }
    }
}]).service("DatePickerService", ["$q", "ionicTimePicker", "ionicDatePicker", function (e, t, n) {
    function o(o, r, i) {
        r = new Date(r.valueOf() + 6e4 * r.getTimezoneOffset());
        var a = e.defer();
        if ("undefined" != typeof datePicker) datePicker.show({
            date: r,
            mode: o,
            is24Hour: !0,
            androidTheme: 7,
            locale: "time" == o ? "nl-nl" : LocalStorage.getItem("language-locale", !0),
            doneButtonLabel: atrans("doneButton", "OK"),
            cancelButtonLabel: atrans("cancelButton", "Annuleer")
        }, function (e) {
            "undefined" != typeof e ? (e = getGMTDate(e), a.resolve(e)) : a.reject()
        });
        else if ("date" == o) {
            var s = {
                callback: function (e) {
                    var t = new Date(e);
                    t = getGMTDate(t), a.resolve(t)
                },
                inputDate: r
            };
            n.openDatePicker(s)
        } else if ("time" == o) {
            var c = {
                callback: function (e) {
                    var t = new Date(r.valueOf());
                    t.setHours(Math.floor(e / 3600), Math.floor(e % 3600 / 60)), t = getGMTDate(t), a.resolve(t)
                },
                inputTime: 3600 * r.getHours() + 60 * r.getMinutes(),
                step: i ? i : 1
            };
            t.openTimePicker(c)
        } else a.reject();
        return a.promise
    }
    return {
        pickDate: function (e) {
            return o("date", e)
        },
        pickTime: function (e, t) {
            return o("time", e, t)
        }
    }
}]).service("UserService", ["$q", "ConnectorService", "LocalStorageService", "ConfigService", function (e, t, n, o) {
    function r() {
        this._user = null
    }
    var i = new r;
    return {
        refresh: function () {
            return i._user = null, SessionStorage.removeItem("user"), this.getUser()
        },
        getUsers: function (e, n) {
            return t.executeGet("Pocket_Users", -1, e, n)
        },
        getUser: function () {
            if (null == i._user) {
                var r = SessionStorage.getItem("user");
                null != r && (i._user = JSON.parse(r))
            }
            var a = SessionStorage.getItem("lastTimeCheckedUser");
            return null == i._user || null == a || Date.now() - a > 18e5 ? o.getConfig().then(function (e) {
                return isVersionOrHigher(e, "Profit7") ? t.executeGet("Pocket_Main_User").then(function (e) {
                    if (e && e.length > 0) return i._user = e[0], t.executeGet("Pocket_User").then(function (e) {
                        if (e && e.length > 0)
                            for (var t in e[0]) e[0].hasOwnProperty(t) && "gender" != t && (i._user[t] = e[0][t]);
                        return SessionStorage.setItem("user", JSON.stringify(i._user)), SessionStorage.setItem("lastTimeCheckedUser", Date.now()), n.setItem("lastTimeCheckedUser", Date.now()), n.setItem("user", JSON.stringify(i._user)), i._user
                    });
                    throw new SkippedException
                }) : t.executeGet("Pocket_User").then(function (e) {
                    return e && e.length > 0 ? (i._user = e[0], SessionStorage.setItem("user", JSON.stringify(i._user)), SessionStorage.setItem("lastTimeCheckedUser", Date.now()), n.setItem("lastTimeCheckedUser", Date.now()), n.setItem("user", JSON.stringify(i._user)), i._user) : void 0
                })
            }) : e(function (e, t) {
                e(i._user)
            })
        },
        validateEntry: function (e) {
            if (e.length > 0) {
                var n = {
                    dynamic: {
                        fields: "username",
                        values: e,
                        operatortypes: "10"
                    }
                };
                return t.executeGet("Pocket_Users", n).then(function (e) {
                    if (1 == e.length) return e[0];
                    throw new SkippedException
                })
            }
            throw new SkippedException
        },
        searchUsers: function (e, n, o) {
            var r = {
                dynamic: {
                    fields: "name;username",
                    values: e
                }
            };
            return t.executeGet("Pocket_Users", "" == e ? {} : r, n, o)
        }
    }
}]).factory("SharedSubjectServiceFactory", ["SubjectServiceFactory", function (e) {
    var t = e.getInstance();
    return {
        getSubjectService: function () {
            return t
        }
    }
}]).factory("SubjectServiceFactory", ["$q", "ConnectorService", "ConfigService", "maxListTake", "UserService", "FileFromOsService", "DocumentSessionService", "$ionicScrollDelegate", "$ionicPosition", "$timeout", "$ionicPopup", "$rootScope", function (e, t, n, o, r, i, a, s, c, l, u, d) {
    function f() {
        this._subjectsDictionary = null, this._subjectsSubmittedDictionary = null, this._subjectProfiles = null
    }

    function p(e, t) {
        for (var n = 0; n < e.length; n++)
            if (e[n].hasOwnProperty(t)) return n;
        var o = {};
        o[t] = {
            Element: {
                Fields: {}
            }
        }, e.push(o);
        var r = e.length - 1;
        return r
    }

    function m(e, t) {
        function n(e, t) {
            if ("undefined" != typeof e && null != e)
                for (var n = 0; n < e.length; n++)
                    if (e[n].id == t) return !0;
            return !1
        }
        return "undefined" != typeof e.S_Em ? (t.CrDe && t.CrDe.visible || t.SfId && t.SfId.visible) && t.SfIdView && n(t.SfIdView.rows, 2) || t.S_Em && t.S_Em.visible : "undefined" != typeof e.S_Bc || "undefined" != typeof e.S_Cd ? (t.CrDe && t.CrDe.visible || t.SfId && t.SfId.visible) && t.SfIdView && n(t.SfIdView.rows, 3) || t.S_Bc && t.S_Bc.visible || t.S_Cd && t.S_Cd.visible : !0
    }

    function h(e, n, o) {
        if (e < n.length) {
            var r = n[e];
            r.fileId ? h(e + 1, n, o) : r.file ? t.uploadFile("KnSubject", null, r.file).then(function (e) {
                e.fileids && (r.fileId = e.fileids[0])
            })["finally"](function () {
                h(e + 1, n, o)
            }) : r.fileURI ? t.uploadFileByUrl("KnSubject", r.fileURI, r.filename).then(function (e) {
                e.fileids && (r.fileId = e.fileids[0])
            })["finally"](function () {
                h(e + 1, n, o)
            }) : h(e + 1, n, o)
        } else o()
    }
    return f.prototype.getMutationBySubjectId = function (e) {
        return t.executeData("PocketSubjectMutation", {
            fields: ["SubjectId"],
            values: [e]
        })
    }, f.prototype.getSubjectInfo = function (t) {
        var n = e.defer(),
            o = this,
            r = {};
        if (null != this._subjectProfiles)
            for (var i = 0; i < this._subjectProfiles.length; i++) r[this._subjectProfiles[i].Id] = i;
        if ("undefined" != typeof r[t] && this._subjectProfiles[r[t]].info) n.resolve(cloneAsObject(this._subjectProfiles[r[t]].info));
        else {
            var s = null;
            a.getSession().then(function (e) {
                s = e.maininsite
            })["finally"](function () {
                o.getNewSubjectInfo(t, null != s).then(function (e) {
                    n.resolve(e)
                })
            })
        }
        return n.promise
    }, f.prototype.getNewSubjectInfo = function (e, n) {
        var o = {
            fields: ["Mode", "ProfileId", "UseSession"],
            values: [2, e.Id, n]
        };
        return n ? t.executeData("PocketSubjectItem", o, function () {
            return a.getSession()
        }) : t.executeData("PocketSubjectItem", o)
    }, f.prototype.searchForField = function (e, n, o, r) {
        var i = "";
        d.searchfieldform.searchfield && (i = d.searchfieldform.searchfield);
        var a = {
                fields: ["Mode", "PocketGuid", "ViewFieldId", "ViewFieldId2", "ViewFieldId3", "ViewFieldValue2", "ViewFieldValue3", "ViewFieldIdDes", "Value1", "Value2", "ExtraValue", "Query", "Filter", "Skip", "Take", "OnlyId", "QueryFieldId"],
                values: [3, e.searchview.guid, e.searchview.fieldId, e.searchview.fieldId2, e.searchview.fieldId3, e.searchview.fieldValue2, e.searchview.fieldValue3, e.searchview.fieldIdDes, e.searchview.value1, e.searchview.value2, "", n, e.searchview.filter, o, r, e.onlyId, i]
            },
            s = [],
            c = [];
        switch (e.fieldId) {
        case "S_Cd":
            e.form.S_Bc && e.info.S_Bc.visible && (a.values[5] = e.form.S_Bc._fixed_KnBcnBcId), e.form.S_Db && e.info.S_Db.visible && (a.values[5] = e.form.S_Db._fixed_KnSReBcId), e.form.S_Cr && e.info.S_Cr.visible && (a.values[5] = e.form.S_Cr._fixed_KnPReBcId);
            break;
        case "Ou":
            e.form.S_Em && e.info.S_Em.visible && (a.values[10] = e.form.S_Em.id);
            break;
        case "BiId":
            e.form.VaIt && e.info.VaIt.visible && (a.values[5] = e.form.VaIt._fixed_pkey_VaIi);
            break;
        case "InputFvF1":
        case "InputFvF2":
        case "InputFvF3":
            var l = "",
                u = "";
            switch (e.form.InputFvF1 && "object" == typeof e.form.InputFvF1 && (l = e.form.InputFvF1.id), e.form.InputFvF2 && "object" == typeof e.form.InputFvF2 && (u = e.form.InputFvF2.id), s.push("StId"), c.push(e.info.type), e.fieldId) {
            case "InputFvF2":
            case "InputFvF3":
                s.push("KnFeaFeId1"), c.push(l), "InputFvF3" == e.fieldId && (s.push("KnFeaFeId2"), c.push(u))
            }
        }
        s.length > 0 && c.length > 0 && (a.fields.push("ExtraFilterFields"), a.values.push(s.join("-FFF-")), a.fields.push("ExtraFilterValues"), a.values.push(c.join("-VVV-")));
        var f = e.fieldId;
        return t.executeData("PocketSubjectItem", a).then(function (e) {
            if (e && e.rows) {
                for (var t = e.rows, n = 0; n < t.length; n++) t[n].fieldId = f;
                return {
                    rows: t,
                    fields: e.fields
                }
            }
        })
    }, f.prototype.getSubjectFreeTablBySubjectId = function (e, n) {
        var o = {
            fields: ["Mode", "SubjectId"],
            values: [5, e]
        };
        return n ? t.executeData("PocketSubjectItem", o, function () {
            return a.getSession()
        }) : t.executeData("PocketSubjectItem", o)
    }, f.prototype.getSubjectsSubmitted = function (e, n) {
        var r = this;
        "undefined" == typeof e ? e = 0 : 0 == e && (r._subjectsSubmittedDictionary = {}), "undefined" == typeof n && (n = o), null == r._subjectsSubmittedDictionary && (r._subjectsSubmittedDictionary = {});
        var i = {
            fields: ["Mode", "Skip", "Take"],
            values: [4, e, n]
        };
        return t.executeData("PocketSubjectItem", i).then(function (t) {
            for (var n = t.rows, o = 0; o < n.length; o++) n[o].date = parseDateString(n[o].submitdate), r._subjectsSubmittedDictionary[n[o].subjectid] = n[o];
            if (e > 0) {
                n = [];
                for (var i in r._subjectsSubmittedDictionary) r._subjectsSubmittedDictionary.hasOwnProperty(i) && n.push(r._subjectsSubmittedDictionary[i]);
                return n.sort(function (e, t) {
                    return t.date.valueOf() - e.date.valueOf()
                })
            }
            return n.sort(function (e, t) {
                return t.date.valueOf() - e.date.valueOf()
            })
        })
    }, f.prototype.queryProfiles = function (e, t, n, o, r) {
        var i = [];
        if (this._subjectProfiles)
            for (var a = 0; a < this._subjectProfiles.length; a++) !this._subjectProfiles[a].info || "" != t && -1 == this._subjectProfiles[a].Description.toLowerCase().indexOf(t.toLowerCase()) || ("undefined" != typeof r && null != r ? m(r, this._subjectProfiles[a].info) && i.push(this._subjectProfiles[a]) : i.push(this._subjectProfiles[a]));
        e.resolve(i.slice(n, n + o))
    }, f.prototype.getSubjectProfiles = function (n, o, r, i) {
        function s(e, t, n, o, r) {
            if (e < n.length) {
                var i = n[e],
                    a = t[i.Id];
                "undefined" != typeof a && null != l._subjectProfiles[a] && l._subjectProfiles[a].infoexpdate > (new Date).valueOf() ? (l._subjectProfiles[a].info && (i.info = l._subjectProfiles[a].info), i.infoexpdate = l._subjectProfiles[a].infoexpdate, s(e + 1, t, n, o, r)) : l.getNewSubjectInfo(i, o).then(function (e) {
                    i.info = e
                })["finally"](function () {
                    i.infoexpdate = (new Date).valueOf() + timeoutProfiles, s(e + 1, t, n, o, r)
                })
            } else r()
        }
        var c = e.defer(),
            l = this,
            u = null;
        return a.getSession().then(function (e) {
            u = e.maininsite
        })["finally"](function () {
            if (null == l._subjectProfiles) {
                var e = LocalStorage.getItem("SubjectProfiles");
                null != e && (0 == e.indexOf(_prefixLS) ? l._subjectProfiles = JSON.parse(b64_to_utf8(e.substr(_prefixLS.length))) : l._subjectProfiles = JSON.parse(e))
            }
            var a = {},
                d = !0;
            if (null != l._subjectProfiles)
                for (var f = 0; f < l._subjectProfiles.length; f++)(!l._subjectProfiles[f].info || l._subjectProfiles[f].infoexpdate < (new Date).valueOf()) && (d = !1), a[l._subjectProfiles[f].Id] = f;
            var p = !1;
            if (null != l._subjectProfiles && d && !n && (p = !0, l.queryProfiles(c, "", o, r, i)), !p || null == l._subjectProfiles || l._subjectProfiles.expdate < (new Date).valueOf()) {
                var m = {
                    fields: ["Mode", "Skip", "Take"],
                    values: [1, -1, -1]
                };
                t.executeData("PocketSubjectItem", m).then(function (e) {
                    var t = e.rows;
                    t ? s(0, a, t, null != u, function () {
                        l._subjectProfiles = t, l._subjectProfiles.expdate = (new Date).valueOf() + 864e5, LocalStorage.setItem("SubjectProfiles", _prefixLS + utf8_to_b64(JSON.stringify(l._subjectProfiles))), p || l.queryProfiles(c, "", o, r, i)
                    }) : p || c.reject()
                })
            }
        }), c.promise
    }, f.prototype.fillBC = function (e, n, o) {
        var r = {
            fields: ["Mode", "SearchValue", "SfId"],
            values: [5, n, e]
        };
        return t.executeData("PocketSubjectItem", r)
    }, f.prototype.getSubject = function (t) {
        var o = this;
        return n.getConfig().then(function (n) {
            if (null == o._subjectsDictionary || null == o._subjectsDictionary[t]) {
                if (isVersionOrHigher(n, "Profit12")) {
                    var r = {
                        fields: ["Mode", "SubjectId"],
                        values: [10, t]
                    };
                    return o._getSubjectsInternal(null, -1, -1, r).then(function (e) {
                        return e.length > 0 ? (o._subjectsDictionary[t] = e[0], e[0]) : void 0
                    })
                }
                return o._getSubjectsInternal({
                    "static": {
                        fields: "guid",
                        values: t
                    }
                }).then(function (e) {
                    return e.length > 0 ? (o._subjectsDictionary[t] = e[0], e[0]) : void 0
                })
            }
            return e(function (e, n) {
                e(o._subjectsDictionary[t])
            })
        })
    }, f.prototype.postSubject = function (n) {
        function o(e) {
            r.getUser().then(function (n) {
                var o, r, i, m = e.haserror,
                    h = {
                        KnSubject: {
                            Element: {
                                Fields: {
                                    StId: d.type,
                                    UsId: n.user
                                },
                                Objects: [{
                                    KnSubjectLink: {
                                        Element: {
                                            Fields: {}
                                        }
                                    }
                                }]
                            }
                        }
                    };
                for (o in d) d.hasOwnProperty(o) && "eob" != o && "custom" != o && (m |= checkFormField(a, d, o, n), m || "KnSubject" != d[o].element || ("object" == typeof a[o] && a[o] && a[o].id ? h.KnSubject.Element.Fields[o.replace("InputFvF", "FvF")] = a[o].idext ? a[o].idext : a[o].id : "object" == typeof a[o] && a[o] && a[o].getDate ? h.KnSubject.Element.Fields[o] = getJSONDate(fromGMTDate(a[o])) : 12 == d[o].dtype && a[o] ? h.KnSubject.Element.Fields[o] = a[o].toString().replace(",", ".") : isUpdatable(a, d, o) && (h.KnSubject.Element.Fields[o] = a[o])), m || "KnSubjectLink" != d[o].element || ("object" == typeof a[o] && a[o] && a[o].id ? h.KnSubject.Element.Objects[0].KnSubjectLink.Element.Fields[o.replace("PostSfId", "SfId")] = a[o].idext ? a[o].idext : a[o].id : "object" == typeof a[o] && a[o] && a[o].getDate ? h.KnSubject.Element.Objects[0].KnSubjectLink.Element.Fields[o] = getJSONDate(fromGMTDate(a[o])) : 12 == d[o].dtype && a[o] ? h.KnSubject.Element.Objects[0].KnSubjectLink.Element.Fields[o] = a[o].toString().replace(",", ".") : isUpdatable(a, d, o) && (h.KnSubject.Element.Objects[0].KnSubjectLink.Element.Fields[o] = a[o])));
                if (d.custom)
                    for (i in d.custom)
                        if (d.custom.hasOwnProperty(i) && "eob" != i)
                            for (o in d.custom[i]) d.custom[i].hasOwnProperty(o) && "eob" != o && (m |= checkFormField(a, d.custom[i], o, n)), "object" == typeof a[o] && a[o] && a[o].id ? (r = p(h.KnSubject.Element.Objects, d.custom[i][o].element), h.KnSubject.Element.Objects[r][d.custom[i][o].element].Element.Fields[o] = a[o].idext ? a[o].idext : a[o].id) : "object" == typeof a[o] && a[o] && a[o].getDate ? (r = p(h.KnSubject.Element.Objects, d.custom[i][o].element), h.KnSubject.Element.Objects[r][d.custom[i][o].element].Element.Fields[o] = getJSONDate(fromGMTDate(a[o]))) : 12 == d.custom[i][o].dtype && a[o] ? (r = p(h.KnSubject.Element.Objects, d.custom[i][o].element), h.KnSubject.Element.Objects[r][d.custom[i][o].element].Element.Fields[o] = a[o].toString().replace(",", ".")) : isUpdatable(a, d.custom[i], o) && (r = p(h.KnSubject.Element.Objects, d.custom[i][o].element), h.KnSubject.Element.Objects[r][d.custom[i][o].element].Element.Fields[o] = a[o]);
                if (!m && a.attachments && a.attachments.length > 0) {
                    var g = p(h.KnSubject.Element.Objects, "KnSubjectAttachment");
                    for (h.KnSubject.Element.Objects[g].KnSubjectAttachment.Element = [], r = 0; r < a.attachments.length; r++) a.attachments[r].fileId && h.KnSubject.Element.Objects[g].KnSubjectAttachment.Element.push({
                        Fields: {
                            FileId: a.attachments[r].fileId
                        }
                    })
                }
                return m ? (showErrors(a, d, "main", l, u, c, s), void f.reject()) : t.executePost("KnSubject", h).then(function (e) {
                    f.resolve(e)
                })
            })
        }
        var a = n.form,
            d = n.info,
            f = e.defer();
        return a.attachments && a.attachments.length > 0 ? (i.remove(), h(0, a.attachments, function () {
            o(n)
        })) : o(n), f.promise
    }, f.prototype.markRead = function (e, n) {
        var o = {
            KnSubject: {
                Element: {
                    "@SbId": parseInt(e),
                    Fields: {
                        MarkOpened: n
                    }
                }
            }
        };
        return t.executePut("KnSubject", o).then(function (e) {
            return e
        })
    }, f.prototype.getProjects = function () {
        return t.executeGet("Pocket_Projects").then(function (e) {
            return e
        })
    }, f.prototype.getDestinations = function () {
        var e = {
            "static": {
                fields: "type",
                values: "ORG"
            }
        };
        return t.executeGet("Pocket_Contacts", e).then(function (e) {
            return e
        })
    }, f.prototype.getDestinationContacts = function (e) {
        var n = {
            dynamic: {
                fields: "name",
                values: e,
                operatortypes: "1"
            }
        };
        return t.executeGet("Pocket_Contacts", n).then(function (e) {
            return e
        })
    }, f.prototype.convertDocs = function (e) {
        for (var n = e.attachments, o = 1, r = {
                fields: ["SubjectId", "RequestType"],
                values: [e.guid, "2"]
            }, i = 0; i < n.length; i++) n[i].selected && n[i].mustConvert && (r.fields.push("FileId" + o++), r.values.push(n[i].guid));
        return o > 1 ? t.executeData("SignDocuments", r).then(function (t) {
            if (t.rows && t.rows.length > 0) {
                var n = {
                    jobId: t.rows[0].JobId,
                    guid: e.guid
                };
                e.jobstore = n, LocalStorage.setItem("jobstore", JSON.stringify(n))
            } else LocalStorage.removeItem("jobstore")
        }) : void 0
    }, f.prototype.getSignAttachments = function (o) {
        function r(e, n) {
            if (n) {
                var r = {
                        fields: ["SubjectId", "RequestType"],
                        values: [o.guid, "1"]
                    },
                    i = [];
                t.executeData("SignDocuments", r).then(function (e) {
                    if (e && e.rows)
                        for (var t = 0; t < e.rows.length; t++)
                            for (var o = 0; o < n.length; o++)
                                if (e.rows[t].FileId == n[o].file_id) {
                                    n[o].SignableFilesId = e.rows[t].SignableFilesId;
                                    var r = n[o].file_name,
                                        a = r.toLowerCase().substring(r.lastIndexOf("."));
                                    ".pdf" != a && -1 != ".doc.docx.ppt.pptx.xls.xlsx".indexOf(a) && (n[o].mustConvert = !0), i.push(n[o]);
                                    break
                                }
                })["finally"](function () {
                    e.resolve(i)
                })
            } else e.reject()
        }
        var i = e.defer();
        return n.getConfig().then(function (e) {
            var n;
            isVersionOrHigher(e, "Profit12") ? t.executeData("PocketSubjectAttachments", {
                fields: ["Mode", "SubjectId", "ReactionId", "Skip", "Take"],
                values: [6, o.guid, 0, -1, -1]
            }).then(function (e) {
                n = e.rows
            })["finally"](function () {
                r(i, n)
            }) : t.executeGet("Pocket_Subject_Attachments", {
                "static": {
                    fields: "subject_id",
                    values: o.guid
                }
            }, -1, -1, "attachment_id").then(function (e) {
                n = e
            })["finally"](function () {
                r(i, n)
            })
        }), i.promise
    }, f.prototype.getConvertStatus = function (e) {
        e.convstatus = "Checking";
        var n = {
            fields: ["RequestType", "JobId"],
            values: ["3", e.jobstore.jobId]
        };
        return t.executeData("SignDocuments", n).then(function (t) {
            var n = e.attachments;
            if (t.rows) {
                for (var o = 0; o < t.rows.length; o++) {
                    if (t.rows[o].ErrorReference) {
                        e.convstatus = "Failed";
                        break
                    }
                    if ("Busy" == t.rows[o].Status) {
                        e.convstatus = "Busy";
                        break
                    }
                    for (var r = 0; r < n.length; r++)
                        if (n[r].selected && n[r].mustConvert) {
                            if (t.rows[o].FileIdOrg == n[r].guid) {
                                n[r].NewFileId = t.rows[o].FileIdNew, n[r].NewFileName = t.rows[o].FileNameNew, n[r].convstatus = t.rows[o].Status;
                                break
                            }
                            if (t.rows[o].FileIdNew == n[r].guid) {
                                n[r].convstatus = t.rows[o].Status;
                                break
                            }
                        }
                }
                for (var i = !0, r = 0; r < n.length; r++) "Failed" == e.convstatus ? (n[r].convstatus = "Failed", i = !1) : "Busy" == e.convstatus ? (n[r].convstatus = "Busy", i = !1) : n[r].selected && n[r].mustConvert && "Ready" != n[r].convstatus && (i = !1, e.convstatus = "Busy");
                i && (LocalStorage.removeItem("jobstore"), e.convstatus = null, e.mustConvert = !1)
            }
            return t
        })
    }, f.prototype.getSignStatus = function (e) {
        var n = {
            fields: ["RequestType", "JobId"],
            values: ["6", e.signjobstore.jobId]
        };
        return t.executeData("SignDocuments", n).then(function (t) {
            if (t && t.rows && t.rows.length > 0) return e.signstatus = t.rows[0].Status, e.signreqid = t.rows[0].SignRequestId, log("SignStatus: " + t.rows[0].Status), log("SignErrRef: " + t.rows[0].ErrorReference), t;
            throw new SkippedException
        })
    }, f.prototype.getSignStatus2 = function (e) {
        var n = {
            fields: ["RequestType", "SignRequestId"],
            values: ["10", e.signreqid]
        };
        return t.executeData("SignDocuments", n).then(function (o) {
            if (o && o.rows && o.rows.length > 0) return e.signstatus = o.rows[0].Status, "Ready" != o.rows[0].Status || e.signfinishing || e.signfinished ? o : (n = {
                fields: ["RequestType", "SignRequestId"],
                values: ["11", e.signreqid]
            }, e.signfinishing = !0, t.executeData("SignDocuments", n).then(function (t) {
                t && t.rows && t.rows.length > 0 && "OK" == t.rows[0].Status && (e.signfinished = !0)
            })["finally"](function () {
                e.signfinishing = !1
            }));
            throw new SkippedException
        })
    }, f.prototype.getSignerVerificationData = function (e) {
        var n = {
            fields: ["SubjectId", "RequestType"],
            values: [e.guid, "4"]
        };
        return t.executeData("SignDocuments", n).then(function (e) {
            if (e.rows && e.rows.length > 0) return e.rows[0];
            throw new SkippedException
        })
    }, f.prototype.startSign = function (e) {
        for (var n = e.attachments, o = 1, r = {
                fields: ["SubjectId", "RequestType", "SignersLanguage", "IpAddress"],
                values: [e.guid, "5", getLangCode(), SessionStorage.getItem("client-ip")]
            }, i = 0; i < n.length; i++) n[i].selected && (r.fields.push("FileId" + o++), r.values.push(n[i].guid));
        return o > 1 ? t.executeData("SignDocuments", r).then(function (t) {
            if (t.rows && t.rows.length > 0) {
                var n = {
                    jobId: t.rows[0].JobId,
                    guid: e.guid
                };
                e.jobstore = n, LocalStorage.setItem("signjobstore", JSON.stringify(n))
            } else LocalStorage.removeItem("signjobstore")
        }) : void 0
    }, f.prototype.sendCode = function (e) {
        var n = {
            fields: ["SubjectId", "RequestType", "SignRequestId", "VerifyCode"],
            values: [e.guid, "8", e.signreqid, e.signcode]
        };
        return t.executeData("SignDocuments", n).then(function (t) {
            if (t && t.rows && t.rows.length > 0) {
                if ("OK" != t.rows[0].Status) throw new FriendlyException({
                    title: atrans("errortitle", "Fout"),
                    message: atrans("wrongcode", "foutieve code ingevoerd")
                });
                e.sign = !0
            }
        })
    }, f.prototype.sendAgain = function (e) {
        var n = {
            fields: ["RequestType", "SignRequestId"],
            values: ["7", e.signreqid]
        };
        return t.executeData("SignDocuments", n)
    }, f.prototype.executeSign = function (e) {
        var n = {
            fields: ["RequestType", "SignRequestId"],
            values: ["9", e.signreqid]
        };
        return t.executeData("SignDocuments", n).then(function (t) {
            t && t.rows && t.rows.length > 0 && "OK" == t.rows[0].Status && (e.signed = !0)
        })
    }, f.prototype.getAttachments = function (e) {
        return n.getConfig().then(function (n) {
            if (isVersionOrHigher(n, "Profit12")) {
                if (e.reaction_id) var o = 7,
                    r = e.subject,
                    i = e.reaction_id;
                else var o = 6,
                    r = e.guid,
                    i = 0;
                return t.executeData("PocketSubjectAttachments", {
                    fields: ["Mode", "SubjectId", "ReactionId", "Skip", "Take"],
                    values: [o, r, i, -1, -1]
                }).then(function (e) {
                    return e.rows
                })
            }
            return e.reaction_id ? t.executeGet("Pocket_Subject_Reaction_Attachments", {
                "static": {
                    fields: "reaction_id,subject_id",
                    values: [e.reaction_id, e.subject]
                }
            }, -1, -1, "attachment_id").then(function (e) {
                return e
            }) : t.executeGet("Pocket_Subject_Attachments", {
                "static": {
                    fields: "subject_id",
                    values: e.guid
                }
            }, -1, -1, "attachment_id").then(function (e) {
                return e
            })
        })
    }, f.prototype.getReactionsBySubject = function (e) {
        return n.getConfig().then(function (n) {
            if (isVersionOrHigher(n, "Profit12")) {
                var o = {
                    fields: ["Mode", "SubjectId", "SubjectReactionMode"],
                    values: [9, e, 1]
                };
                return t.executeData("PocketGetSubjectReactions", o).then(function (e) {
                    return e.rows
                })
            }
            return t.executeGet("Pocket_Subject_Reactions", {
                "static": {
                    fields: "subject",
                    values: e
                }
            }, -1, -1, "-submitdate").then(function (e) {
                return e
            })
        })
    }, f.prototype.getReactionsNewerThan = function (e, o) {
        return n.getConfig().then(function (n) {
            if (isVersionOrHigher(n, "Profit12")) {
                var r = {
                    fields: ["Mode", "SubjectId", "Date", "SubjectReactionMode"],
                    values: [9, e, o, 2]
                };
                return t.executeData("PocketGetSubjectReactions", r).then(function (e) {
                    return e.rows
                })
            }
            return t.executeGet("Pocket_Subject_Reactions", {
                dynamic: {
                    fields: "submitdate",
                    values: o,
                    operatortypes: "2"
                }
            }, -1, -1, "-submitdate").then(function (e) {
                return e
            })
        })
    }, f.prototype.searchSubjectsByContact = function (e, o) {
        return n.getConfig().then(function (n) {
            if (isVersionOrHigher(n, "Profit12")) {
                if ("undefined" != typeof o && "" != o) var r = {
                    fields: ["Mode", "ContactType", "Contact", "Query"],
                    values: [8, e.type, e.guid, o]
                };
                return t.executeData("PocketGetSubjects", r).then(function (e) {
                    return e.rows
                })
            }
            var i = {};
            return "undefined" != typeof o && "" != o ? ("ORG" == e.type && (i = {
                "static": {
                    fields: "destination_organization_person",
                    values: e.guid
                }
            }), "PER" == e.type && (i = {
                "static": {
                    fields: "destination_organization_person,destination_contact_source",
                    values: e.guid + "," + e.guid
                }
            }), "PRS" == e.type && (i = {
                "static": {
                    fields: "destination_contact",
                    values: e.guid
                }
            }), t.executeGet("Pocket_Subjects", i, -1, -1, "-submitdate").then(function (e) {
                return e
            })) : void 0
        })
    }, f.prototype.getSubjectsByProject = function (e, t, o, r) {
        var i = this;
        return n.getConfig().then(function (n) {
            var a = {
                fields: ["Mode", "ContactType", "ProjectId", "Query", "Skip", "Take"],
                values: [8, "PRJ", e, t, o, r]
            };
            return i._getSubjectsInternal("", o, r, a)
        })
    }, f.prototype.getSubjectsByContact = function (e, t, o, r) {
        var i = this;
        return n.getConfig().then(function (n) {
            if (isVersionOrHigher(n, "Profit12")) {
                var a = {
                    fields: ["Mode", "ContactType", "Contact", "Query", "Skip", "Take"],
                    values: [8, e.type, e.guid, t, o, r]
                };
                return i._getSubjectsInternal("", o, r, a)
            }
            var s = {};
            return "ORG" == e.type && (s = {
                "static": {
                    fields: "destination_organization_person",
                    values: e.guid
                }
            }), "PER" == e.type && (s = {
                "static": {
                    fields: "destination_organization_person,destination_contact_source",
                    values: e.guid + "," + e.guid
                }
            }), "PRS" == e.type && (s = {
                "static": {
                    fields: "destination_contact",
                    values: e.guid
                }
            }), void 0 != t && "" != t && (s.dynamic = {
                fields: "title;subjecttype_description",
                values: t + ";" + t,
                operatortypes: "6;6"
            }), i._getSubjectsInternal(s, o, r, null)
        })
    }, f.prototype.getWorkflowActions = function (e) {
        return t.executeData("GetWorkflowData", {
            fields: ["WorkflowDatatype", "SubjectId"],
            values: ["WorkflowContext", e]
        }).then(function (e) {
            var n = e.rows;
            if (n.length > 0) {
                var o = n[0];
                return o.InWorkflowForCurrentUser || o.InfotaskForCurrentUser ? t.executeData("GetWorkflowData", {
                    fields: ["WorkflowDatatype", "ActivityId"],
                    values: ["WorkflowActions", o.ActivityId]
                }) : {
                    rows: []
                }
            }
        })
    }, f.prototype.deleteReaction = function (e, o) {
        return n.getConfig().then(function (n) {
            return isVersionOrHigher(n, "2018B1PU2") ? t.executeDelete("KnSubjectReaction", "KnReaction", ["@Id", "SbId"], [o, e]).then(function (e) {
                return e
            }) : t.executeDelete("KnSubject", "KnSubject", ["@SbId"], [e]).then(function (e) {
                return e
            })
        })
    }, f.prototype.addReaction = function (e, o, r) {
        function i() {
            return n.getConfig().then(function (n) {
                void 0 == r.reactionText && (r.reactionText = "");
                var o = {
                    SbId: e,
                    Tx: convertEmoji(r.reactionText),
                    VaRe: r.reactionType.value
                };
                isVersionOrHigher(n, "2018B1PU2") || r.fileId && (o.FileId = r.fileId);
                var i = {
                    KnWorkflow: {
                        Element: {
                            Fields: o
                        }
                    }
                };
                return isVersionOrHigher(n, "2018B1PU2") && r.fileId && (i.KnWorkflow.Element.Objects = {
                    KnReactionAttachment: {
                        Element: {
                            Fields: {
                                FileId: r.fileId
                            }
                        }
                    }
                }), t.executePost("KnSubjectWorkflowReaction", i)
            })
        }
        return o && o.files && o.files.length > 0 ? t.uploadFile("KnSubjectWorkflowReaction", o).then(function (e) {
            return r.fileId = e.fileids[0], i()
        }) : r.fileURI ? t.uploadFileByUrl("KnSubjectWorkflowReaction", r.fileURI).then(function (e) {
            return r.fileId = e.fileids[0], i()
        }) : i()
    }, f.prototype.clearCache = function (e) {
        null != this._subjectsDictionary && void 0 !== this._subjectsDictionary[e] && delete this._subjectsDictionary[e]
    }, f.prototype._getSubjectsInternal = function (e, o, r, i) {
        var a = this;
        return n.getConfig().then(function (n) {
            return isVersionOrHigher(n, "Profit12") ? t.executeData("PocketGetSubjects", i).then(function (e) {
                a._subjectsDictionary = {};
                for (var t = 0; t < e.rows.length; t++) a._subjectsDictionary[e.rows[t].guid] = e.rows[t];
                return e.rows
            }) : t.executeGet("Pocket_Subjects", e, o, r, "-submitdate").then(function (e) {
                a._subjectsDictionary = {};
                for (var t = 0; t < e.length; t++) a._subjectsDictionary[e[t].guid] = e[t];
                return e
            })
        })
    }, {
        getInstance: function () {
            return new f
        }
    }
}]).factory("DossierServiceFactory", ["$q", "ConnectorService", "UserService", function (e, t, n) {
    function o() {
        var e = {};
        this._dossierDictionary = e
    }
    new o;
    return o.prototype.getDossier = function (e, o, r, i, a, s) {
        return n.getUser().then(function (n) {
            var c = r ? r.id : "",
                l = s ? s.id : "",
                u = {
                    fields: ["Mode", "ContactType", "Contact", "Query", "QueryFieldId", "OrderBy", "OrderByDir", "Skip", "Take"],
                    values: [8, "EMP", n.person, a, l, c, i, e, o]
                };
            return t.executeData("PocketGetSubjects", u).then(function (t) {
                if (t) {
                    ("undefined" == typeof _dossierDictionary || 0 == e) && (_dossierDictionary = {});
                    for (var n = 0; n < t.rows.length; n++) _dossierDictionary[t.rows[n]._id] || (_dossierDictionary[t.rows[n]._id] = t.rows[n]);
                    subjectItems = [];
                    for (subjectItem in _dossierDictionary) subjectItems.push(_dossierDictionary[subjectItem]);
                    return t.rows = subjectItems, r && r.defname && (t.rows = t.rows.sort(function (e, t) {
                        var n = "string" == typeof e[r.defname] ? e[r.defname].toLowerCase() : e[r.defname],
                            o = "string" == typeof t[r.defname] ? t[r.defname].toLowerCase() : t[r.defname];
                        return o > n ? 0 == i ? 1 : -1 : n > o ? 0 == i ? -1 : 1 : 0
                    })), t
                }
            })
        })
    }, o.prototype.clearCache = function () {
        this._dossierDictionary = {}, this._dossierCache = {}
    }, {
        getInstance: function () {
            return new o
        }
    }
}]).factory("TaskService", ["$q", "ConnectorService", "SubjectServiceFactory", "$timeout", function (e, t, n, o) {
    function r() {
        var e = {},
            t = [];
        this._tasksDictionary = e, this._tasksCache = t
    }
    var i = new r;
    return r.prototype.executeAction = function (e, n, o) {
        function r() {
            void 0 == o.reactionText && (o.reactionText = "");
            var n = {
                SbId: e,
                WfNm: o.workflowid,
                TkNm: o.taskid,
                AcNm: o.action.ActionName,
                VaRe: o.reactionType.value,
                Tx: convertEmoji(o.reactionText)
            };
            return o.user && (n.UsTa = o.user.username), o.fileId && (n.FileId = o.fileId), t.executePost("KnSubjectWorkflowReaction", {
                KnWorkflow: {
                    Element: {
                        Fields: n
                    }
                }
            })
        }
        return n && n.files && n.files.length > 0 ? t.uploadFile("KnSubjectWorkflowReaction", n).then(function (e) {
            return o.fileId = e.fileids[0], r()
        }) : o.fileURI ? t.uploadFileByUrl("KnSubjectWorkflowReaction", o.fileURI).then(function (e) {
            return o.fileId = e.fileids[0], r()
        }) : r()
    }, r.prototype.clearAllCache = function () {
        this._tasksDictionary = {}, this._tasksCache = []
    }, r.prototype.clearCache = function (e) {
        if (null != this._tasksDictionary && void 0 !== this._tasksDictionary[e] && delete this._tasksDictionary[e], null != this._tasksCache) {
            for (var t = -1, n = 0; n < this._tasksCache.length; n++)
                if (this._tasksCache[n] == e) {
                    t = n;
                    break
                } - 1 != t && this._tasksCache.splice(t, 1)
        }
    }, r.prototype._getTasksInternal = function (n, o, r, i, a) {
        var s = this,
            c = o,
            l = r,
            u = "-submitdate";
        if (i && a && (u = (-1 == a ? "-" : "") + i), s._tasksCache.length > 0 && null != s._tasksDictionary && -1 != o && -1 != r) {
            if (o + r <= s._tasksCache.length) {
                for (var d = [], f = o; o + r > f; f++) d.push(s._tasksDictionary[s._tasksCache[f]]);
                return e(function (e, t) {
                    e(d)
                })
            }
            r = o + r - s._tasksCache.length, o = s._tasksCache.length
        }
        return t.executeGet("Pocket_Tasks_Details", n, o, r, u).then(function (e) {
            if (e) {
                o = c, r = l;
                for (var t = 0; t < e.length; t++) s._tasksDictionary[e[t].guid] || (s._tasksDictionary[e[t].guid] = e[t], s._tasksCache.push(e[t].guid));
                for (var n = [], t = o; o + r > t; t++) s._tasksDictionary[s._tasksCache[t]] && n.push(s._tasksDictionary[s._tasksCache[t]]);
                return n
            }
            throw new SkippedException
        })
    }, {
        searchTasks: function (e, t, n, o, r) {
            return i._getTasksInternal(void 0 !== e ? {
                dynamic: {
                    fields: "title;subjecttype_description;workflow;task",
                    values: e
                }
            } : void 0, t, n, o, r)
        },
        executeAction: function (e, t, n) {
            return i.executeAction(e, t, n)
        },
        clearCache: function (e) {
            i.clearCache(e)
        },
        clearAllCache: function () {
            i.clearAllCache()
        },
        getTaskBySubject: function (t, o) {
            var r = i;
            return null == r._tasksDictionary || null == r._tasksDictionary[t] ? i._getTasksInternal({
                "static": {
                    fields: "guid",
                    values: t
                }
            }).then(function (e) {
                if (e.length > 0) return e[0];
                var r = n.getInstance();
                return r.clearCache(t), r.getSubject(t).then(function (e) {
                    if (!o && "undefined" == typeof e) throw new FriendlyException({
                        title: atrans("errortitle", "Fout"),
                        message: atrans("subjectnoaccess", "Geen toegang tot dossieritem")
                    });
                    return e
                })
            }) : e(function (e, n) {
                e(r._tasksDictionary[t])
            })
        }
    }
}]).factory("ProjectServiceFactory", ["$q", "ConnectorService", "DocumentSessionService", "$rootScope", "ConfigService", function (e, t, n, o, r) {
    function i() {
        this._projectsDictionary = null, this._projectProfiles = null, this._projectAuth = null
    }

    function a(e) {
        switch (e) {
        case "goodsreceived":
            return 7;
        case "subcontracting":
            return 8;
        case "receipt":
            return 9
        }
    }

    function s(e) {
        return e.filter(function (e) {
            switch (e.defname) {
            case "ordernumber":
            case "purchaserelation":
            case "purchaserelation_basiccontact_code":
            case "purchaserelation_basiccontact_name":
            case "purchaserelation_basiccontact_searchname":
            case "project":
            case "project_description":
            case "order_type":
            case "order_ordernumber":
            case "order_amount_total":
            case "monitoringcode":
            case "monitoringcode_description":
            case "monitoringcode_chapter":
            case "desired_deliverydate":
            case "order_status_description":
                return !0;
            default:
                return !1
            }
        })
    }

    function c(e, t) {
        t._purchaseOrders || (t._purchaseOrders = {});
        for (var n = 0; n < e.rows.length; n++) {
            var o = e.rows[n];
            t._purchaseOrders[o.ordernumber] ? l(o, t) && t._purchaseOrders[o.ordernumber].rows.push(o) : u(o, t)
        }
    }

    function l(e, t) {
        for (var n = 0; n < t._purchaseOrders[e.ordernumber].rows.length; n++)
            if (e.guid == t._purchaseOrders[e.ordernumber].rows[n].guid) return !1;
        return !0
    }

    function u(e, t) {
        var n = {
            ordernumber: e.ordernumber,
            purchaserelation: e.purchaserelation,
            purchaserelation_basiccontact_code: e.purchaserelation_basiccontact_code,
            purchaserelation_basiccontact_name: e.purchaserelation_basiccontact_name,
            purchaserelation_basiccontact_searchname: e.purchaserelation_basiccontact_searchname,
            project: e.project,
            project_description: e.project_description,
            order_type: e.order_type,
            order_ordernumber: e.order_ordernumber,
            order_amount_total: e.order_amount_total,
            order_attachment: e.order_attachment,
            order_subjectid: e.order_subjectid,
            monitoringcode: e.monitoringcode,
            monitoringcode_description: e.monitoringcode_description,
            monitoringcode_chapter: e.monitoringcode_chapter,
            desired_deliverydate: e.desired_deliverydate,
            order_status_code: e.order_status_code,
            order_status_description: e.order_status_description,
            rows: []
        };
        n.rows.push(e), t._purchaseOrders[e.ordernumber] = n
    }

    function d(e) {
        return {
            Fields: {
                VaIt: e.itemtype,
                ItCd: e.itemcode,
                QuUn: e.amount_to_report_received,
                SoGu: e.guid,
                PrId: e.project,
                Upri: e.price_per_unit,
                CoPr: e.costprice,
                SoOr: e.ordernumber
            }
        }
    }

    function f(e, t) {
        for (var n = 0; n < e.length; n++)
            if (e[n].FileType && "signature" == e[n].FileType) {
                e[n].fileId ? t.FbGoodsReceived.Element.Fields.SignatureFileId1 = e[n].fileId : (t.FbGoodsReceived.Element.Fields.SignatureFileName = atrans("signature", "handtekening") + ".jpg", t.FbGoodsReceived.Element.Fields.SignatureFileStream = e[n].FileStream), e.splice(n);
                break
            } if (e.length > 0) {
            var o = m(t.FbGoodsReceived.Element.Objects[1].FbGoodsReceivedSubject.Element.Objects, "FbGoodsReceivedSubjectAttachment");
            t.FbGoodsReceived.Element.Objects[1].FbGoodsReceivedSubject.Element.Objects[o].FbGoodsReceivedSubjectAttachment.Element = [];
            for (var n = 0; n < e.length; n++) e[n].fileId ? t.FbGoodsReceived.Element.Objects[1].FbGoodsReceivedSubject.Element.Objects[o].FbGoodsReceivedSubjectAttachment.Element.push({
                Fields: {
                    FileId: e[n].fileId
                }
            }) : e[n].FileName && e[n].FileStream && t.FbGoodsReceived.Element.Objects[1].FbGoodsReceivedSubject.Element.Objects[o].FbGoodsReceivedSubjectAttachment.Element.push({
                Fields: {
                    FileName: e[n].FileName,
                    FileStream: e[n].FileStream
                }
            })
        }
    }

    function p(e) {
        t.executeData("PocketProject", {
            fields: ["Mode"],
            values: [14]
        }).then(function (t) {
            LocalStorage.setItem("NewTeamMemberInfoObject", JSON.stringify(t)), e.resolve(t)
        })
    }

    function m(e, t) {
        for (var n = 0; n < e.length; n++)
            if (e[n].hasOwnProperty(t)) return n;
        var o = {};
        o[t] = {
            Element: {
                Fields: {}
            }
        }, e.push(o);
        var r = e.length - 1;
        return r
    }
    return i.prototype.searchForField = function (e, n, r, i) {
        var a = "";
        o.searchfieldform.searchfield && (a = o.searchfieldform.searchfield);
        var s = {
                fields: ["Mode", "PocketGuid", "ViewFieldId", "ViewFieldId2", "ViewFieldId3", "ViewFieldValue2", "ViewFieldValue3", "ViewFieldIdDes", "Value1", "Value2", "Query", "Filter", "Skip", "Take", "OnlyId", "QueryFieldId"],
                values: [3, e.searchview.guid, e.searchview.fieldId, e.searchview.fieldId2, e.searchview.fieldId3, e.searchview.fieldValue2, e.searchview.fieldValue3, e.searchview.fieldIdDes, e.searchview.value1, e.searchview.value2, n, e.searchview.filter, r, i, e.onlyId, a]
            },
            c = e.fieldId;
        return t.executeData("PocketProject", s).then(function (e) {
            if (e && e.rows) {
                for (var t = e.rows, n = 0; n < t.length; n++) t[n].fieldId = c;
                return {
                    rows: t,
                    fields: e.fields
                }
            }
        })
    }, i.prototype.getProjects = function (e, t, n, o, r, i, a) {
        return this._getProjectsInternal(e, t, n, o, r, i, a)
    }, i.prototype.getProject = function (n) {
        var o = this;
        if (null == o._projectsDictionary || null == o._projectsDictionary[n]) {
            null == o._projectsDictionary && (o._projectsDictionary = {});
            var r = {
                fields: ["Mode", "ProjectId"],
                values: [5, n]
            };
            return t.executeData("PocketProject", r).then(function (e) {
                if (e.rows && e.rows.length > 0) return o._projectsDictionary[e.rows[0]._id] = e.rows[0], e.rows[0];
                throw new SkippedException
            })
        }
        return e(function (e, t) {
            e(o._projectsDictionary[n])
        })
    }, i.prototype.getProjectProp = function (n) {
        var o = e.defer(),
            r = null;
        return this.getProject(n).then(function (e) {
            r = e
        })["finally"](function () {
            var e = {
                "static": {
                    fields: "project_id",
                    values: n
                }
            };
            t.executeGet("Pocket_Project_Prop", e).then(function (e) {
                e.length > 0 && (null != r ? e[0].TeamRole = r._fixed_KnTmbTmRl : e[0].TeamRole = null, o.resolve(e[0]))
            })
        }), o.promise
    }, i.prototype.getTeam = function (e) {
        var n = {
            "static": {
                fields: "project_id",
                values: e
            }
        };
        return t.executeGet("Pocket_Project_Team", n).then(function (e) {
            return e
        })
    }, i.prototype.updateWorkBudget = function (e) {
        var n = {
            PtConProjectForecast: {
                Element: {
                    "@PrId": e.project_id,
                    "@MoId": e.monitoring_code,
                    Fields: {
                        Date: getJSONDate(getGMTDate(new Date)),
                        PeRe: e.percentage_finished,
                        Adqu: e.amount_adjusted,
                        Re: "Afas Pocket"
                    }
                }
            }
        };
        return t.executePost("PtConProjectForecast", n, !0)
    }, i.prototype.getWorkBudgets = function (e, n, o) {
        var r = {
            "static": {
                fields: "project_id",
                values: e
            }
        };
        return t.executeGet("Pocket_Workbudget_Grouped", r, n, o, "monitoring_code").then(function (e) {
            return e
        })
    }, i.prototype.getProjectStages = function (e) {
        var n = {
            "static": {
                fields: "project_id",
                values: e
            }
        };
        return t.executeGet("Pocket_Project_Prop_Stages", n, null, null, "stage_level").then(function (e) {
            return e
        })
    }, i.prototype._getProjectsInternal = function (e, n, o, r, i, a, s) {
        var c = {
            fields: ["Mode", "Skip", "Take", "Query", "QueryFieldId"],
            values: [e, n, o, a, s]
        };
        r && i > -1 && (c.fields.push("orderBy", "orderByDir"), c.values.push(r, i));
        var l = this;
        return t.executeData("PocketProject", c).then(function (e) {
            if (l._projectsDictionary = {}, e.rows) {
                for (var t = 0; t < e.rows.length; t++) l._projectsDictionary[e.rows[t]._id] = e.rows[t];
                return e
            }
            throw new SkippedException
        })
    }, i.prototype.getTimesheetMSSFieldInfo = function () {
        var n = e.defer();
        if (null == this._timesheetMSSInfo) {
            var o = LocalStorage.getItem("TimesheetMSSFieldInfo");
            null != o && (this._timesheetMSSInfo = JSON.parse(b64_to_utf8(o.substr(_prefixLS.length))))
        }
        if (!(null != this._timesheetMSSInfo && this._timesheetMSSInfo.expdate > (new Date).valueOf())) {
            var r = {
                    fields: ["Mode"],
                    values: [16]
                },
                i = this;
            return t.executeData("PocketProject", r).then(function (e) {
                e.expdate = (new Date).valueOf() + timeoutProjectAuth, i._timesheetMSSInfo = e, LocalStorage.setItem("TimesheetMSSFieldInfo", _prefixLS + utf8_to_b64(JSON.stringify(i._timesheetMSSInfo))), n.resolve(e)
            })
        }
        return n.resolve(this._timesheetMSSInfo), n.promise
    }, i.prototype.getProjectAuth = function () {
        var n = e.defer();
        if (null == this._projectAuth) {
            var o = LocalStorage.getItem("ProjectAuth");
            null != o && (this._projectAuth = JSON.parse(b64_to_utf8(o.substr(_prefixLS.length))))
        }
        if (null != this._projectAuth && this._projectAuth.expdate > (new Date).valueOf()) n.resolve(this._projectAuth);
        else {
            var r = {
                    fields: ["Mode"],
                    values: [13]
                },
                i = this;
            t.executeData("PocketProject", r).then(function (e) {
                e.expdate = (new Date).valueOf() + timeoutProjectAuth, i._projectAuth = e, LocalStorage.setItem("ProjectAuth", _prefixLS + utf8_to_b64(JSON.stringify(i._projectAuth))), n.resolve(e)
            })
        }
        return n.promise
    }, i.prototype.getProjectInfo = function (t) {
        var o = e.defer(),
            r = this,
            i = {};
        if (null != this._projectProfiles)
            for (var a = 0; a < this._projectProfiles.length; a++) i[this._projectProfiles[a].Id] = a;
        if ("undefined" != typeof i[t] && this._projectProfiles[i[t]].info) o.resolve(this._projectProfiles[i[t]].info);
        else {
            var s = null;
            n.getSession().then(function (e) {
                s = e.maininsite
            })["finally"](function () {
                r.getNewprojectInfo(t, null != s).then(function (e) {
                    o.resolve(e)
                })
            })
        }
        return o.promise
    }, i.prototype.getNewProjectInfo = function (e, o) {
        var r = {
            fields: ["Mode", "ProfileId", "UseSession"],
            values: [2, e, o]
        };
        return t.executeData("PocketProject", r, o ? function () {
            return n.getSession()
        } : void 0, void 0, !0)
    }, i.prototype.queryProfiles = function (e, t, n, o) {
        var r = [];
        if (this._projectProfiles)
            for (var i = 0; i < this._projectProfiles.length; i++) !this._projectProfiles[i].info || "" != t && -1 == this._projectProfiles[i].Description.toLowerCase().indexOf(t.toLowerCase()) || r.push(this._projectProfiles[i]);
        e.resolve(r.slice(n, n + o))
    }, i.prototype.searchProfiles = function (o, r, i) {
        function a(e, t, n, o, r) {
            if (e < n.length) {
                var i = n[e];
                "undefined" != typeof t[i.Id] && null != c._projectProfiles[t[i.Id]] && c._projectProfiles[t[i.Id]].infoexpdate > (new Date).valueOf() ? (c._projectProfiles[t[i.Id]].info && (i.info = c._projectProfiles[t[i.Id]].info), i.infoexpdate = c._projectProfiles[t[i.Id]].infoexpdate, a(e + 1, t, n, o, r)) : c.getNewProjectInfo(i.Id, o).then(function (e) {
                    i.info = e
                })["finally"](function () {
                    i.infoexpdate = (new Date).valueOf() + timeoutProfiles, a(e + 1, t, n, o, r)
                })
            } else r()
        }
        var s = e.defer(),
            c = this,
            l = null;
        return n.getSession().then(function (e) {
            l = e.maininsite
        })["finally"](function () {
            if (null == c._projectProfiles) {
                var e = LocalStorage.getItem("ProjectProfiles");
                null != e && (0 == e.indexOf(_prefixLS) ? c._projectProfiles = JSON.parse(b64_to_utf8(e.substr(_prefixLS.length))) : c._projectProfiles = JSON.parse(e))
            }
            var n = {},
                u = !0;
            if (null != c._projectProfiles)
                for (var d = 0; d < c._projectProfiles.length; d++)(!c._projectProfiles[d].info || c._projectProfiles[d].infoexpdate < (new Date).valueOf()) && (u = !1), n[c._projectProfiles[d].Id] = d;
            var f = !1;
            c._projectProfiles && u && (f = !0, c.queryProfiles(s, o, r, i));
            var p = {
                fields: ["Mode", "Skip", "Take"],
                values: [1, -1, -1]
            };
            t.executeData("PocketProject", p).then(function (e) {
                var t = e.rows;
                t ? a(0, n, t, null != l, function () {
                    c._projectProfiles = t, LocalStorage.setItem("ProjectProfiles", _prefixLS + utf8_to_b64(JSON.stringify(c._projectProfiles))), f || c.queryProfiles(s, o, r, i)
                }) : f || s.reject()
            })
        }), s.promise
    }, i.prototype.getSubjectsPurchaseOrder = function (e) {
        var n = {
            fields: ["Mode", "ContactType", "Purchaseorder"],
            values: [8, "PUR", e.ordernumber]
        };
        return e.order_subjectid && e.order_subjectid > 0 && (n.fields.push("ExistingSbId"), n.values.push(e.order_subjectid)), t.executeData("PocketGetSubjects", n).then(function (e) {
            return e.rows
        })
    }, i.prototype.getSinglePurchaseOrder = function (e, n) {
        var o = this;
        n = a(n);
        var r = {
            fields: ["Mode", "Purchaseorder"],
            values: [n, e]
        };
        return t.executeData("PocketProject", r).then(function (t) {
            return o._purchaseOrders[e] && delete o._purchaseOrders[e], c(t, o), o._purchaseOrders[e]
        })
    }, i.prototype.getProjectStatuses = function (e) {
        return t.executeData("PocketProject", {
            fields: ["Mode", "ProjectId"],
            values: ["10", e]
        })
    }, i.prototype.setProjectStatus = function (e, n) {
        return e && n ? t.executeData("PocketProject", {
            fields: ["Mode", "ProjectId", "Status"],
            values: ["11", e, n.Code]
        }) : void 0
    }, i.prototype.getPurchaseorders = function (e, n, o, r, i, l, u) {
        var d = this;
        (0 == o || -1 == o) && (d._purchaseOrders = {}), i = a(i);
        var f = {
            fields: ["Mode", "Skip", "Take", "ProjectId", "Query", "SortField", "SortOrder"],
            values: [i, o, r, e, n, l, u]
        };
        return t.executeData("PocketProject", f).then(function (e) {
            e.fields = s(e.fields), d.fields = e.fields, c(e, d, o, r, i);
            var t = [];
            for (var n in d._purchaseOrders) t.push(d._purchaseOrders[n]);
            return e.rows = t.sort(function (e, t) {
                return e[l] < t[l] ? 0 == u ? -1 : 1 : e[l] > t[l] ? 0 == u ? 1 : -1 : 0
            }), e
        })
    }, i.prototype.registerGoodsReceived = function (n, o, i, a) {
        var s = e.defer();
        return r.getConfig().then(function (e) {
            function r(e, t) {
                if (e) {
                    if (!t || 0 == t.length) var t = [];
                    if ("undefined" != typeof e && null != e && -1 != e.indexOf(";base64,")) {
                        var n = (e.substring(0, e.indexOf(";base64,")), e.substring(e.indexOf(";base64,") + 8));
                        t.push({
                            FileName: "signature.jpg",
                            FileStream: n,
                            FileType: "signature"
                        })
                    }
                }
                return t
            }

            function c(e, n, o) {
                n && n.length > 0 && f(n, e), t.executePost("FbGoodsReceivedPocket", e).then(function (e) {
                    o.resolve(e)
                })
            }
            for (var l = {
                    FbGoodsReceived: {
                        Element: {
                            Fields: {
                                SoOr: n.ordernumber,
                                OrDa: new Date,
                                CrId: n.purchase_relation
                            },
                            Objects: [{
                                FbGoodsReceivedLines: {
                                    Element: []
                                }
                            }]
                        }
                    }
                }, u = 0; u < n.rows.length; u++) o[n.rows[u].guid] === !0 && l.FbGoodsReceived.Element.Objects[0].FbGoodsReceivedLines.Element.push(d(n.rows[u]));
            e.subjecttypeidgoodsreceived && "0" != e.subjecttypeidgoodsreceived && (i = r(a, i), l.FbGoodsReceived.Element.Objects.push({
                FbGoodsReceivedSubject: {
                    Element: {
                        Fields: {
                            BasicContact: n.purchaserelation_basiccontact_code,
                            ProjectId: n.project,
                            SubjectTypeId: e.subjecttypeidgoodsreceived
                        },
                        Objects: []
                    }
                }
            }), uploadAttachmentsRecursive(0, i, "FbGoodsReceivedPocket", t, function () {
                c(l, i, s)
            }))
        }), s.promise
    }, i.prototype.getNewReceiptInfo = function (e) {
        var n = {
            fields: ["Mode", "ProjectId"],
            values: [12, e]
        };
        return t.executeData("PocketProject", n)
    }, i.prototype.getNewTeamMemberInfo = function () {
        var t = e.defer(),
            n = LocalStorage.getItem("NewTeamMemberInfoObject");
        if (n && n.length > 0) {
            var o = JSON.parse(n);
            o && "object" == typeof o ? t.resolve(o) : p(t)
        } else p(t);
        return t.promise
    }, i.prototype.sendNewTeamMember = function (e, n, o, r) {
        var i = {
            KnTeamMember: {
                Element: {
                    Fields: {
                        Team: e.Team,
                        PrId: e.Project_Id,
                        Type: "employee" == r ? 1 : 2,
                        TmRl: n.TmRl_entry
                    }
                }
            }
        };
        return "employee" == r ? i.KnTeamMember.Element.Fields.EmId = n.EmId_entry : "contact" == r && (i.KnTeamMember.Element.Fields.CdId = n.CdId_entry), t.executePost("KnTeamMember", i)
    }, i.prototype.deleteTeamMember = function (e) {
        if (null != e.Employee_Code) var n = ["Type", "Team", "EmId"],
            o = [1, e.Team_Id, e.Employee_Code];
        else var n = ["Type", "Team", "CdId"],
            o = [2, e.Team_Id, e.Member_Contact_Id];
        return t.executeDelete("KnTeamMember", "KnTeamMember", n, o)
    }, i.prototype.editTeamMember = function (e, n) {
        var o = {
            KnTeamMember: {
                Element: {
                    Fields: {
                        Team: e.Team_Id,
                        PrId: e.Project_Id,
                        Type: null != e.Employee_Code ? 1 : 2,
                        TmRl: n
                    }
                }
            }
        };
        return null != e.Employee_Code ? o.KnTeamMember.Element.Fields.EmId = e.Employee_Code : o.KnTeamMember.Element.Fields.CdId = e.Member_Contact_Id, t.executePut("KnTeamMember", o)
    }, i.prototype.getTeamRoles = function () {
        return t.executeGet("Pocket_Teamrole")
    }, i.prototype.sendNewReceipt = function (e, n, o) {
        return r.getConfig().then(function (o) {
            var r = {
                FbGoodsReceived: {
                    Element: {
                        Fields: {
                            OrDa: new Date,
                            CrId: n.CrId_entry,
                            PrId: e
                        },
                        Objects: [{
                            FbGoodsReceivedLines: {
                                Element: {
                                    Fields: {
                                        VaIt: n.VaIt_entry,
                                        ItCd: "1" == o.costtypeisworkbudget ? n.MoId_entry : n.BiId_entry,
                                        MoId: n.MoId_entry,
                                        Ds: n.Ds,
                                        VaRc: n.VaRc_entry,
                                        QuUn: 1,
                                        Upri: n.CoPr,
                                        CoPr: n.CoPr
                                    }
                                }
                            }
                        }]
                    }
                }
            };
            return n.attachments && n.attachments.length > 0 && o.subjecttypeidgoodsreceived && "0" != o.subjecttypeidgoodsreceived && (r.FbGoodsReceived.Element.Objects.push({
                FbGoodsReceivedSubject: {
                    Element: {
                        Fields: {
                            BasicContact: n.CrId._fixed_KnPReBcId,
                            ProjectId: e,
                            SubjectTypeId: o.subjecttypeidgoodsreceived
                        },
                        Objects: []
                    }
                }
            }), f(n.attachments, r)), t.executePost("FbGoodsReceivedPocket", r).then(function (e) {
                return e
            })
        })
    }, {
        getInstance: function () {
            return new i
        }
    }
}]).factory("SignalServiceFactory", ["$q", "ConnectorService", function (e, t) {
    function n() {
        var e = null;
        this._signalsDictionary = e
    }
    return n.prototype.getSignals = function (e, t) {
        return this._getSignalsInternal({
            "static": {
                fields: "language",
                values: getLangCode()
            }
        }, e, t)
    }, n.prototype.getSignal = function (t) {
        var n = this;
        return null == n._signalsDictionary || null == n._signalsDictionary[t] ? n._getSignalsInternal({
            "static": {
                fields: "signal_id,language",
                values: t + "," + getLangCode()
            }
        }).then(function (e) {
            return e[0]
        }) : e(function (e, o) {
            e(n._signalsDictionary[t])
        })
    }, n.prototype.markAsRead = function (e) {
        return t.executeData("MarkSignalRead", {
            fields: "SignalId",
            values: e
        })
    }, n.prototype._getSignalsInternal = function (e, n, o) {
        var r = this;
        return t.executeGet("Pocket_Signals", e, n, o, "datetime").then(function (e) {
            if (r._signalsDictionary = {}, e) {
                for (var t = 0; t < e.length; t++) r._signalsDictionary[e[t].guid] = e[t];
                return e
            }
            throw new SkippedException
        })
    }, {
        getInstance: function () {
            return new n
        }
    }
}]).factory("IllnessServiceFactory", ["ConnectorService", "EnvConfigService", "ConfigService", "FileFromOsService", "$q", "maxListTake", "$rootScope", function (e, t, n, o, r, i, a) {
    function s() {
        var e = null;
        this._illnessesDictionary = e
    }

    function c(e) {
        switch (e) {
        case "ZW":
        case "A":
        case "P":
        case "ZZW":
        case "ZB":
        case "ZOD":
            return 1
        }
        return 0
    }

    function l(e, t) {
        for (var n = 0; n < e.length; n++)
            if (e[n].hasOwnProperty(t)) return n;
        var o = {};
        o[t] = {
            Element: {
                Fields: {}
            }
        }, e.push(o);
        var r = e.length - 1;
        return r
    }

    function u(e, t, n) {
        for (var o = [], r = 0; r < e.length; r++) t ? n && -10 == e[r].ProfileId ? o.push(e[r]) : n || -4 != e[r].ProfileId && -12 != e[r].ProfileId || o.push(e[r]) : n && -11 == e[r].ProfileId ? o.push(e[r]) : n || -9 != e[r].ProfileId && -13 != e[r].ProfileId || o.push(e[r]);
        return o
    }
    return s.prototype.getProfiles = function (t, n) {
        var o = LocalStorage.getItem("IllnessProfiles");
        if (o) {
            var i = JSON.parse(o);
            return r(function (e, o) {
                e(u(i, t, n))
            })
        }
        var a = {
            fields: ["Mode"],
            values: [2]
        };
        return e.executeData("PocketIllness", a).then(function (e) {
            return e || (e = []), LocalStorage.setItem("IllnessProfiles", JSON.stringify(e)), u(e, t, n)
        })
    }, s.prototype.getAddressFromPostalCode = function (t, n, o, r, i, a) {
        var s = {
            fields: ["Mode", "ZipCode", "HouseNumber", "CountryId", "Manager", "EmployeeId", "ProfileId"],
            values: [4, t, n, o, r, i, a]
        };
        return e.executeData("PocketIllness", s)
    }, s.prototype.getNewScreenWithProfile = function (t, n, o) {
        var r = {
            fields: ["Mode", "Manager", "EmployeeId", "ProfileId"],
            values: [1, t, n, o]
        };
        return e.executeData("PocketIllness", r)
    }, s.prototype.getIllnessesManager = function () {
        return e.executeGet("Pocket_Illness_Reports_MSS", {}, 0, 100, "-date_time_begin").then(function (e) {
            for (var t = 0; t < e.length; t++) e[t].date = parseDateString(e[t].date_time_begin), e[t].expenddate = parseDateString(e[t].exp_date_end), e[t].days = 1 == e[t].cont_days_illness ? atrans("daysillone", "1 dag") : atrans("daysill", "{0} dagen", e[t].cont_days_illness);
            return e
        })
    }, s.prototype.getIllnesses = function (e) {
        return this._getIllnessesInternal()
    }, s.prototype.getIllnessTypes = function () {
        return e.executeGet("Pocket_Illness_Types")
    }, s.prototype._getIllnessesInternal = function (t) {
        var n = this;
        return e.executeGet("Pocket_Illness_Status", t).then(function (e) {
            if (n._illnessesDictionary = {}, e) {
                for (var t = 0; t < e.length; t++) n._illnessesDictionary[e[t].guid] = e[t];
                return e
            }
        })
    }, s.prototype.getIllnessBySubjectId = function (e) {
        var t = this;
        return null == t._illnessesDictionary || null == t._illnessesDictionary[e] ? t._getIllnessesInternal({
            "static": {
                fields: "id",
                values: e
            }
        }).then(function (e) {
            return e.length > 0 ? e[0] : void 0
        }) : r(function (e, n) {
            e(t._illnessesDictionary[guid])
        })
    }, s.prototype.getReasons = function () {
        var t = new Array;
        return e.executeGet("Pocket_Illness_Reasons").then(function (e) {
            for (var n = 0; n < e.length; n++) t[n] = e[n];
            return t
        })
    }, s.prototype.getTimetable = function (t, n) {
        if (n) var o = {
                "static": {
                    fields: "start_date,employee_id",
                    values: t + "," + n
                }
            },
            r = "Pocket_Timetable_MSS";
        else var o = {
                "static": {
                    fields: "start_date",
                    values: t
                }
            },
            r = "Pocket_Timetable";
        return e.executeGet(r, o, 0, i, "start_time")
    }, s.prototype.getAddress = function (t, n, o, r, i, a) {
        var s = {
            fields: ["Mode", "Manager", "EmployeeId", "ProfileId", "Country", "Zipcode", "Housenumber"],
            values: [4, t, n, o, r, i, a]
        };
        return e.executeData("PocketIllness", s).then(function (e) {
            return e
        })
    }, s.prototype.reportRecovery = function (t, o, r, i) {
        return n.getConfig().then(function (n) {
            var a = "HrWellnessInSite",
                s = {
                    HrWellnessInSite: {
                        Element: {
                            Fields: {
                                AbId: t.id,
                                DaEn: getJSONDate(fromGMTDate(t.end_datetime)),
                                DMeE: getJSONDate(new Date),
                                ViRs: 1,
                                TPEn: 0
                            },
                            Objects: {
                                HrAbsIllnessProgress: {
                                    Element: {
                                        Fields: {
                                            ViWr: 1,
                                            ViRc: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
            return t.employeeId && (s.HrWellnessInSite.Element.Fields.EmId = t.employeeId), (o || r) && (s.HrWellnessInSite.Element.Fields.AlAb = !0), i && (s.HrWellnessInSite.Element.Fields.ProfileId = i.ProfileId), e.executePut(a, s)
        })
    }, s.prototype.sendIllnessWithProfile = function (t, i, a, s, u, d, f, p) {
        function m(e, t) {
            for (var n = {}, o = 0; o < t.length; o++) {
                var r = t[o].placement_code;
                e[r] && 1 == e[r] && (n[t[o].employee_id] ? n[t[o].employee_id].placements.push(t[o].placement_code) : n[t[o].employee_id] = {
                    placements: [t[o].placement_code]
                })
            }
            return n
        }

        function h(t, o, r) {
            n.getConfig().then(function (n) {
                var i = "HrIllnessInSite";
                if (t < o.length) {
                    var a = o[t];
                    a.fileId ? h(t + 1, o, r) : a.file ? e.uploadFile(i, null, a.file).then(function (e) {
                        a.fileId = e.fileids[0]
                    })["finally"](function () {
                        h(t + 1, o, r)
                    }) : a.fileURI ? e.uploadFileByUrl(i, a.fileURI, a.filename).then(function (e) {
                        a.fileId = e.fileids[0]
                    })["finally"](function () {
                        h(t + 1, o, r)
                    }) : h(t + 1, o, r)
                } else r()
            })
        }

        function g(t, n, o, r, u, d) {
            var f, p = !1,
                m = {
                    HrIllnessInSite: {
                        Element: {
                            Fields: {
                                EmId: u
                            },
                            Objects: [{
                                HrAbsIllnessProgress: {
                                    Element: {
                                        Fields: {},
                                        Objects: []
                                    }
                                }
                            }]
                        }
                    }
                };
            if (i.attachments && i.attachments.length > 0 && !r)
                if (isVersionOrHigher(t, "Profit15")) {
                    var h = l(m.HrIllnessInSite.Element.Objects, "HrIllnessAttachment");
                    m.HrIllnessInSite.Element.Objects[h].HrIllnessAttachment.Element = [];
                    for (var g = 0; g < i.attachments.length; g++) i.attachments[g].fileId && m.HrIllnessInSite.Element.Objects[h].HrIllnessAttachment.Element.push({
                        Fields: {
                            FileId: i.attachments[g].fileId
                        }
                    })
                } else if (isVersionOrHigher(t, "Profit8")) {
                var h = l(m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects, "HrAbsIllnessProgressAttachment");
                m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects[h].HrAbsIllnessProgressAttachment.Element = [];
                for (var g = 0; g < i.attachments.length; g++) i.attachments[g].fileId && m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects[h].HrAbsIllnessProgressAttachment.Element.push({
                    Fields: {
                        FileId: i.attachments[g].fileId
                    }
                })
            } else m.HrIllnessInSite.Element.Fields.FileId = i.attachments[0].fileId;
            if (r) {
                var v;
                if (v = i.fileDataUrl ? i.fileDataUrl : i.fileURI, "undefined" != typeof v && null != v && -1 != v.indexOf(";base64,")) {
                    var _ = v.substring(0, v.indexOf(";base64,")),
                        I = v.substring(v.indexOf(";base64,") + 8),
                        S = ".dat"; - 1 != _.indexOf("jpg") || -1 != _.indexOf("jpeg") ? S = ".jpg" : -1 != _.indexOf("png") ? S = ".png" : -1 != _.indexOf("pdf") && (S = ".pdf"), m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Fields.FileName = "attest" + S, m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Fields.FileStream = I
                }
            }
            for (f in a) {
                if ("HrIllnessInSite" == a[f].element) var b = m.HrIllnessInSite.Element;
                else if ("HrAbsIllnessProgress" == a[f].element) var b = m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element;
                else {
                    if ("KnBasicAddress" != a[f].element) break;
                    if (i[f]) {
                        if (!m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects[0] || !m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects[0].KnBasicAddress) {
                            l(m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects, "KnBasicAddress")
                        }
                        var b = m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects[0].KnBasicAddress.Element
                    }
                }
                a.hasOwnProperty(f) && "eob" != f && "custom" != f && "Placements" != f && "HasPlaatsingen" != f && ("undefined" != typeof b.Fields[f] && -1 == nonMandatoryFields.indexOf(f) && (p |= checkFormField(i, a, f, s)), p || ("object" == typeof i[f] && i[f] && i[f].id ? b.Fields[f] = i[f].idext ? i[f].idext : i[f].id : "object" == typeof i[f] && i[f] && i[f].getDate ? b.Fields[f] = getJSONDate(fromGMTDate(i[f])) : 12 == a[f].dtype && i[f] ? b.Fields[f] = i[f].toString().replace(",", ".") : isUpdatable(i, a, f) && (b.Fields[f] = i[f])))
            }
            if (a.custom)
                for (var P in a.custom)
                    if (a.custom.hasOwnProperty(P) && "eob" != P)
                        for (f in a.custom[P]) a.custom[P].hasOwnProperty(f) && "eob" != f && ("object" == typeof i[f] && i[f] && i[f].id ? b.Fields[f] = i[f].idext ? i[f].idext : i[f].id : "object" == typeof i[f] && i[f] && i[f].getDate ? b.Fields[f] = getJSONDate(fromGMTDate(i[f])) : 12 == a.custom[P][f].dtype && i[f] ? b.Fields[f] = i[f].toString().replace(",", ".") : isUpdatable(i, a.custom[P], f) && (b.Fields[f] = i[f]));
            if (n ? n && o && (m.HrIllnessInSite.Element.Fields.EnSe = o.employment) : m.HrIllnessInSite.Element.Fields.EnSe = o ? o.employment : s.employement_id, a.HasPlaatsingen && 1 == a.HasPlaatsingen.value) {
                d && 0 != d.length || (p = !0);
                var w = l(m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects, "HrPlacement");
                m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects[w].HrPlacement.Element = [];
                for (var g = 0; g < d.length; g++) m.HrIllnessInSite.Element.Objects[0].HrAbsIllnessProgress.Element.Objects[w].HrPlacement.Element.push({
                    Fields: {
                        PcCo: d[g]
                    }
                })
            }
            "undefined" != typeof m.HrIllnessInSite.Element.Fields.SfNt && "undefined" != typeof m.HrIllnessInSite.Element.Fields.ViIt && (m.HrIllnessInSite.Element.Fields.SfNt = c(m.HrIllnessInSite.Element.Fields.ViIt)), p ? (showErrors(i, a, "main", $timeout, $ionicPopup, $ionicPosition, $ionicScrollDelegate), y.reject()) : e.executePost("HrIllnessInSite", m).then(function (e) {
                y.resolve(e)
            })
        }
        var y = r.defer(),
            v = u ? u.id : s.code;
        if (i.attachments && i.attachments.length > 0 && !f) o.remove(), h(0, i.attachments, function () {
            if (a.HasPlaatsingen && 1 == a.HasPlaatsingen.value) {
                var e = m(i.PlacementSelection, p);
                for (var n in e) g(t, u, d, f, n, e[n].placements)
            } else g(t, u, d, f, v)
        });
        else if (a.HasPlaatsingen && 1 == a.HasPlaatsingen.value) {
            var _ = m(i.PlacementSelection, p);
            for (var I in _) g(t, u, d, f, I, _[I].placements)
        } else g(t, u, d, f, v);
        return y.promise
    }, s.prototype.sendIllness = function (o, r, i, a, s, l, u, d, f, p, m, h, g, y) {
        return t.getEnvConfig().then(function (t) {
            return n.getConfig().then(function (n) {
                var h = "HrIllnessInSite",
                    y = null != t && "undefined" != typeof t.illnesscode ? t.illnesscode : "Z";
                m && (y = m.code);
                var v = {
                    HrIllnessInSite: {
                        Element: {
                            Fields: {
                                EmId: g ? g.id : a.code,
                                DaBe: getJSONDate(fromGMTDate(o)),
                                DMeB: getJSONDate(new Date),
                                DaEs: getJSONDate(fromGMTDate(r), !0),
                                TPBe: 0,
                                ViIt: y,
                                RuAb: 0,
                                SfNt: c(m.int_code),
                                RtDa: 0,
                                RtDl: 0,
                                ExFr: 0,
                                ViIr: i
                            },
                            Objects: {
                                HrAbsIllnessProgress: {
                                    Element: {
                                        Fields: {
                                            DaTi: getJSONDate(fromGMTDate(new Date)),
                                            PsPc: 0,
                                            PsHr: 0,
                                            PsSp: 0,
                                            PsPa: 0,
                                            PsHa: 0
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                if ("undefined" != typeof s && null != s && (v.HrIllnessInSite.Element.Objects.HrAbsIllnessProgress.Element.Fields.SbId = s.employee_id), "undefined" != typeof l && (v.HrIllnessInSite.Element.Objects.HrAbsIllnessProgress.Element.Fields.LePe = l), "undefined" != typeof u && null != u && -1 != u.indexOf(";base64,")) {
                    var _ = u.substring(0, u.indexOf(";base64,")),
                        I = u.substring(u.indexOf(";base64,") + 8),
                        S = ".dat"; - 1 != _.indexOf("jpg") || -1 != _.indexOf("jpeg") ? S = ".jpg" : -1 != _.indexOf("png") ? S = ".png" : -1 != _.indexOf("pdf") && (S = ".pdf"), v.HrIllnessInSite.Element.Objects.HrAbsIllnessProgress.Element.Fields.FileName = "attest" + S, v.HrIllnessInSite.Element.Objects.HrAbsIllnessProgress.Element.Fields.FileStream = I
                }
                return "undefined" != typeof d && (v.HrIllnessInSite.Element.Objects.HrAbsIllnessProgress.Element.Fields.BeAt = getJSONDate(fromGMTDate(d), 1), v.HrIllnessInSite.Element.Objects.HrAbsIllnessProgress.Element.Fields.EnAt = getJSONDate(fromGMTDate(f), 1)), g ? g && p && (v.HrIllnessInSite.Element.Fields.EnSe = p.employment) : v.HrIllnessInSite.Element.Fields.EnSe = p ? p.employment : a.employement_id, e.executePost(h, v).then(function (e) {})
            })
        })
    }, s.prototype.searchForField = function (t, n, o, r) {
        var i = "";
        a.searchfieldform.searchfield && (i = a.searchfieldform.searchfield);
        var s = {
                fields: ["Mode", "PocketGuid", "ViewFieldId", "ViewFieldId2", "ViewFieldId3", "ViewFieldValue2", "ViewFieldValue3", "ViewFieldIdDes", "Value1", "Value2", "ExtraValue", "Query", "Filter", "Skip", "Take", "OnlyId", "QueryFieldId"],
                values: [3, t.searchview.guid, t.searchview.fieldId, t.searchview.fieldId2, t.searchview.fieldId3, t.searchview.fieldValue2, t.searchview.fieldValue3, t.searchview.fieldIdDes, t.searchview.value1, t.searchview.value2, t.extraValue, n, t.searchview.filter, o, r, t.onlyId, i]
            },
            c = t.fieldId;
        return e.executeData("PocketIllness", s).then(function (e) {
            if (e && e.rows) {
                for (var t = e.rows, n = 0; n < t.length; n++) t[n].fieldId = c;
                return {
                    rows: t,
                    fields: e.fields
                }
            }
        })
    }, s.prototype.getDvbs = function (t) {
        var n = {
            dynamic: {
                fields: "employee_id",
                values: t,
                operatortypes: "1"
            }
        };
        return e.executeGet("Pocket_Employee_Manager_Employment", n)
    }, {
        getInstance: function () {
            return new s
        }
    }
}]).factory("DeclarationServiceFactory", ["ConnectorService", "ConfigService", "$q", "DocumentSessionService", "$rootScope", "SubjectServiceFactory", "ConfigService", "FileFromOsService", function (e, t, n, o, r, i, t, a) {
    function s() {
        this._declarationsDictionary = null, this._declProfiles = null
    }

    function c(e, t) {
        for (var n = 0; n < e.length; n++)
            if (e[n].hasOwnProperty(t)) return n;
        var o = {};
        o[t] = {
            Element: {
                Fields: {}
            }
        }, e.push(o);
        var r = e.length - 1;
        return r
    }

    function l(n, o, r) {
        t.getConfig().then(function (t) {
            var i = "HrDeclarationInSite";
            if (n < o.length) {
                var a = o[n];
                a.fileId ? l(n + 1, o, r) : a.file ? e.uploadFile(i, null, a.file).then(function (e) {
                    a.fileId = e.fileids[0]
                })["finally"](function () {
                    l(n + 1, o, r)
                }) : a.fileURI ? e.uploadFileByUrl(i, a.fileURI, a.filename).then(function (e) {
                    a.fileId = e.fileids[0]
                })["finally"](function () {
                    l(n + 1, o, r)
                }) : l(n + 1, o, r)
            } else r()
        })
    }
    i.getInstance();
    return s.prototype.searchForField = function (t, n, o, i) {
        var a = "";
        r.searchfieldform.searchfield && (a = r.searchfieldform.searchfield);
        var s = {
                fields: ["Mode", "PocketGuid", "ViewFieldId", "ViewFieldId2", "ViewFieldId3", "ViewFieldValue2", "ViewFieldValue3", "ViewFieldIdDes", "Value1", "Value2", "Query", "Filter", "Skip", "Take", "OnlyId", "QueryFieldId"],
                values: [3, t.searchview.guid, t.searchview.fieldId, t.searchview.fieldId2, t.searchview.fieldId3, t.searchview.fieldValue2, t.searchview.fieldValue3, t.searchview.fieldIdDes, t.searchview.value1, t.searchview.value2, n, t.searchview.filter, o, i, t.onlyId, a]
            },
            c = t.fieldId;
        return e.executeData("PocketDeclaration", s).then(function (e) {
            if (e && e.rows) {
                for (var t = e.rows, n = 0; n < t.length; n++) t[n].fieldId = c;
                return {
                    rows: t,
                    fields: e.fields
                }
            }
        })
    }, s.prototype.getDeclarationInfo = function (e) {
        var t = n.defer(),
            r = this,
            i = {};
        if (null != this._declProfiles)
            for (var a = 0; a < this._declProfiles.length; a++) i[this._declProfiles[a].Id] = a;
        if ("undefined" != typeof i[e] && this._declProfiles[i[e]].info) t.resolve(this._declProfiles[i[e]].info);
        else {
            var s = null;
            o.getSession().then(function (e) {
                s = e.maininsite
            })["finally"](function () {
                r.getNewDeclarationInfo(e, null != s).then(function (e) {
                    t.resolve(e)
                })
            })
        }
        return t.promise
    }, s.prototype.getNewDeclarationInfo = function (t, n) {
        var r = {
            fields: ["Mode", "ProfileId", "UseSession"],
            values: [2, t, n]
        };
        return n ? e.executeData("PocketDeclaration", r, function () {
            return o.getSession()
        }, void 0, !0) : e.executeData("PocketDeclaration", r, void 0, void 0, !0)
    }, s.prototype.getEditDeclarationInfo = function (t) {
        var n = null;
        return o.getSession().then(function (r) {
            n = r.maininsite;
            var i = {
                fields: ["Mode", "subjectId", "UseSession"],
                values: [5, t, null != n]
            };
            return null != n ? e.executeData("PocketDeclaration", i, function () {
                return o.getSession()
            }, void 0, !1) : e.executeData("PocketDeclaration", i, void 0, void 0, !1)
        })
    }, s.prototype.getDeclarationFreeTablBySubjectId = function (t) {
        var n = {
            fields: ["Mode", "SubjectId"],
            values: [4, t]
        };
        return e.executeData("PocketDeclaration", n)
    }, s.prototype.queryProfiles = function (e, t, n, o) {
        var r = [];
        if (this._declProfiles)
            for (var i = 0; i < this._declProfiles.length; i++) !this._declProfiles[i].info || "" != t && -1 == this._declProfiles[i].Description.toLowerCase().indexOf(t.toLowerCase()) || r.push(this._declProfiles[i]);
        e.resolve(r.slice(n, n + o))
    }, s.prototype.searchProfiles = function (t, r, i) {
        function a(e, t, n, o, r) {
            if (e < n.length) {
                var i = n[e],
                    s = t[i.Id];
                "undefined" != typeof s && null != c._declProfiles[s] && c._declProfiles[s].infoexpdate > (new Date).valueOf() ? (c._declProfiles[s].info && (i.info = c._declProfiles[s].info), i.infoexpdate = c._declProfiles[s].infoexpdate, a(e + 1, t, n, o, r)) : c.getNewDeclarationInfo(i.Id, o).then(function (e) {
                    i.info = e
                })["finally"](function () {
                    i.infoexpdate = (new Date).valueOf() + timeoutProfiles, a(e + 1, t, n, o, r)
                })
            } else r()
        }
        var s = n.defer(),
            c = this,
            l = null;
        return o.getSession().then(function (e) {
            l = e.maininsite
        })["finally"](function () {
            if (null == c._declProfiles) {
                var n = LocalStorage.getItem("DeclProfiles");
                null != n && (0 == n.indexOf(_prefixLS) ? c._declProfiles = JSON.parse(b64_to_utf8(n.substr(_prefixLS.length))) : c._declProfiles = JSON.parse(n))
            }
            var o = {},
                u = !0;
            if (null != c._declProfiles)
                for (var d = 0; d < c._declProfiles.length; d++)(!c._declProfiles[d].info || c._declProfiles[d].infoexpdate < (new Date).valueOf()) && (u = !1), o[c._declProfiles[d].Id] = d;
            var f = !1;
            c._declProfiles && u && (f = !0, c.queryProfiles(s, t, r, i));
            var p = {
                fields: ["Mode", "Skip", "Take"],
                values: [1, -1, -1]
            };
            e.executeData("PocketDeclaration", p).then(function (e) {
                var n = e.rows;
                n ? a(0, o, n, null != l, function () {
                    c._declProfiles = n, LocalStorage.setItem("DeclProfiles", _prefixLS + utf8_to_b64(JSON.stringify(c._declProfiles))), f || c.queryProfiles(s, t, r, i)
                }) : f || s.reject()
            })
        }), s.promise
    }, s.prototype.getDeclarations = function (e, t) {
        var n = {
            dynamic: {
                fields: "user",
                values: e,
                operatortypes: "1"
            }
        };
        return t && (n.dynamic.fields += ",dvb", n.dynamic.values += "," + t, n.dynamic.operatortypes += ",1"), this._getDeclarationsInternal(n)
    }, s.prototype.validateEntry = function (n, o) {
        if (n.length > 0) {
            var r, i;
            return "project" == o ? (r = "Pocket_Projects", i = "project_id", operator = "10") : "type" == o && (r = "Pocket_ExpenseTypes", i = "id", operator = "10"), filter = {
                dynamic: {
                    fields: i,
                    values: n + "%",
                    operatortypes: operator
                }
            }, t.getConfig().then(function (t) {
                return e.executeGet(r, filter, 0, 2).then(function (e) {
                    if (1 == e.length && e[0].id != t.kmcostid) return e;
                    throw new SkippedException
                })
            })
        }
        throw new SkippedException;
    }, s.prototype.getDeclaration = function (e) {
        var t = this;
        return null == t._declarationsDictionary || null == t._declarationsDictionary[e] ? t._getDeclarationsInternal({
            "static": {
                fields: "guid",
                values: e
            }
        }).then(function (e) {
            return e.length > 0 ? e[0] : void 0
        }) : n(function (n, o) {
            n(t._declarationsDictionary[e])
        })
    }, s.prototype.getDeclarationBySubjectId = function (e) {
        var t = this;
        return null == t._declarationsDictionary || null == t._declarationsDictionary[e] ? t._getDeclarationsInternal({
            "static": {
                fields: "subjectId",
                values: e
            }
        }).then(function (e) {
            return e.length > 0 ? e[0] : void 0
        }) : n(function (e, n) {
            e(t._declarationsDictionary[guid])
        })
    }, s.prototype._getDeclarationsInternal = function (n) {
        var o = this;
        return t.getConfig().then(function (t) {
            return e.executeGet("Pocket_Declarations", n, -1, -1, "-date").then(function (e) {
                if (e) {
                    o._declarationsDictionary = {};
                    for (var n = 0; n < e.length; n++) e[n].costtype = e[n].costid == t.kmcostid ? "TRAVEL" : "OTHER", o._declarationsDictionary[e[n].guid] = e[n];
                    return e
                }
                throw new SkippedException
            })
        })
    }, s.prototype.getKmCostDigits = function (n) {
        return t.getConfig().then(function (t) {
            return e.executeGet("Pocket_ExpenseTypes", {
                "static": {
                    fields: "id",
                    values: n
                }
            }).then(function (e) {
                return e && e.length > 0 ? e[0].digits : void 0
            })
        })
    }, s.prototype.getTypes = function (n, o) {
        return t.getConfig().then(function (t) {
            return e.executeGet("Pocket_ExpenseTypes", void 0, n, o, "description").then(function (e) {
                for (var n = new Array, o = 0; o < e.length; o++) e[o].id != t.kmcostid && n.push(e[o]);
                return n
            })
        })
    }, s.prototype.searchTypes = function (n, o, r) {
        return t.getConfig().then(function (t) {
            var i = {};
            return void 0 != n && "" != n && (i = {
                dynamic: {
                    fields: "description;id",
                    values: n
                }
            }), e.executeGet("Pocket_ExpenseTypes", i, o, r, "description").then(function (e) {
                return e
            })
        })
    }, s.prototype.postDeclaration = function (t, o, r, i, s) {
        function u(t, n) {
            var i, a = "HrDeclarationInSite",
                l = {
                    HrDeclarationInSite: {
                        Element: {
                            Fields: {},
                            Objects: []
                        }
                    }
                };
            if (o.attachments && o.attachments.length > 0)
                if (isVersionOrHigher(t, "Profit8")) {
                    var u = c(l.HrDeclarationInSite.Element.Objects, "HrDeclarationInSiteAttachment");
                    l.HrDeclarationInSite.Element.Objects[u].HrDeclarationInSiteAttachment.Element = [];
                    for (var f = 0; f < o.attachments.length; f++) o.attachments[f].fileId && l.HrDeclarationInSite.Element.Objects[u].HrDeclarationInSiteAttachment.Element.push({
                        Fields: {
                            FileId: o.attachments[f].fileId
                        }
                    })
                } else l.HrDeclarationInSite.Element.Fields.FileId = o.attachments[0].fileId;
            for (i in r) r.hasOwnProperty(i) && "eob" != i && "custom" != i && "HrDeclarationInSite" == r[i].element && ("object" == typeof o[i] && o[i] && o[i].id ? l.HrDeclarationInSite.Element.Fields[i] = o[i].idext ? o[i].idext : o[i].id : "object" == typeof o[i] && o[i] && o[i].getDate ? l.HrDeclarationInSite.Element.Fields[i] = getJSONDate(fromGMTDate(o[i])) : 12 == r[i].dtype && o[i] ? l.HrDeclarationInSite.Element.Fields[i] = o[i].toString().replace(",", ".") : isUpdatable(o, r, i) && (l.HrDeclarationInSite.Element.Fields[i] = o[i]));
            if (r.custom)
                for (var p in r.custom)
                    if (r.custom.hasOwnProperty(p) && "eob" != p)
                        for (i in r.custom[p]) r.custom[p].hasOwnProperty(i) && "eob" != i && ("object" == typeof o[i] && o[i] && o[i].id ? l.HrDeclarationInSite.Element.Fields[i] = o[i].idext ? o[i].idext : o[i].id : "object" == typeof o[i] && o[i] && o[i].getDate ? l.HrDeclarationInSite.Element.Fields[i] = getJSONDate(fromGMTDate(o[i])) : 12 == r.custom[p][i].dtype && o[i] ? l.HrDeclarationInSite.Element.Fields[i] = o[i].toString().replace(",", ".") : isUpdatable(o, r.custom[p], i) && (l.HrDeclarationInSite.Element.Fields[i] = o[i]));
            o.projectstage && (l.HrDeclarationInSite.Element.Fields.PrSt = o.projectstage.projectstage_id), n && (l.HrDeclarationInSite.Element.Fields.SbId = s), n ? e.executePut(a, l).then(function (e) {
                d.resolve(e)
            }) : e.executePost(a, l).then(function (e) {
                d.resolve(e)
            })
        }
        var d = n.defer();
        return o.attachments && o.attachments.length > 0 ? (a.remove(), l(0, o.attachments, function () {
            u(t, i)
        })) : u(t, i), d.promise
    }, s.prototype.sendDeclaration = function (n, o, r) {
        function i(t) {
            var r = {
                DaTi: getJSONDate(o.date, 1),
                BiId: o.type.id,
                EmId: n.code,
                EnSe: o.dvbsel ? o.dvbsel.employment : n.employement_id,
                CoAm: o.amount,
                Ds: o.comments
            };
            return o.fileId && (r.FileId = o.fileId), o.project && (r.PrId = o.project.project_id, o.projectstage && (r.PrSt = o.projectstage.projectstage_id)), e.executePost(t, {
                HrDeclarationInSite: {
                    Element: {
                        Fields: r
                    }
                }
            })
        }
        return t.getConfig().then(function (t) {
            var n = "HrDeclarationInSite";
            return r && r.files && r.files.length > 0 ? e.uploadFile(n, r).then(function (e) {
                return o.fileId = e.fileids[0], i(n)
            }) : o.fileURI ? e.uploadFileByUrl(n, o.fileURI).then(function (e) {
                return o.fileId = e.fileids[0], i(n)
            }) : i(n)
        })
    }, s.prototype.sendDeclarationJourney = function (n, o) {
        return t.getConfig().then(function (t) {
            var r = "HrDeclarationInSite",
                i = o.distance;
            o.retour && (i *= 2);
            var a = {
                DaTi: getJSONDate(o.date),
                BiId: t.kmcostid,
                Qu: i,
                EmId: n.code,
                EnSe: o.dvbsel ? o.dvbsel.employment : n.employement_id,
                KmFr: o.from,
                KmTo: o.to,
                KmRt: o.retour,
                Ds: o.commentsJourney
            };
            return o.project && (a.PrId = o.project.project_id, o.projectstage && (a.PrSt = o.projectstage.projectstage_id)), e.executePost(r, {
                HrDeclarationInSite: {
                    Element: {
                        Fields: a
                    }
                }
            }).then(function (e) {})
        })
    }, {
        getInstance: function () {
            return new s
        }
    }
}]).factory("PersonServiceFactory", ["ConnectorService", "UserService", function (e, t) {
    function n() {}
    return n.prototype.updatePersonImage = function (n, o) {
        return e.uploadFileByUrl("KnPerson", o).then(function (o) {
            return e.executePost("KnPerson", {
                KnPerson: {
                    Element: {
                        Fields: {
                            FileId: o.fileids[0],
                            MatchPer: "0",
                            BcCo: n.person_code
                        }
                    }
                }
            }).then(function () {
                t.refresh()
            })
        })
    }, {
        getInstance: function () {
            return new n
        }
    }
}]).factory("AbsenceServiceFactory", ["$q", "ConnectorService", "ConfigService", "DocumentSessionService", "$rootScope", "maxListTake", "FileFromOsService", function (e, t, n, o, r, i, a) {
    function s() {
        this._leaveProfiles = null
    }

    function c(e, o) {
        return n.getConfig().then(function (n) {
            return isVersionOrHigher(n, "Profit15") ? t.executeGet("Pocket_Leave_Withdrawals", o, -1, -1).then(function (t) {
                if (t)
                    for (var n = 0; n < t.length; n++)
                        for (var o = 0; o < e.length; o++)
                            if (e[o].recordnumber === t[n].recordnumber) {
                                e[o].status_code = 5;
                                break
                            } return e
            }) : e
        })
    }

    function l(e, n, o, r) {
        var i = "HrAbsenceInSite";
        if (e < n.length) {
            var a = n[e];
            a.fileId ? l(e + 1, n, o, r) : a.file ? t.uploadFile(i, null, a.file).then(function (e) {
                a.fileId = e.fileids[0]
            })["finally"](function () {
                l(e + 1, n, o, r)
            }) : a.fileURI ? t.uploadFileByUrl(i, a.fileURI, a.filename).then(function (e) {
                a.fileId = e.fileids[0]
            }, function () {
                o.reject()
            })["finally"](function () {
                l(e + 1, n, o, r)
            }) : l(e + 1, n, o, r)
        } else r()
    }

    function u(e, t) {
        for (var n = 0; n < e.length; n++)
            if (e[n].hasOwnProperty(t)) return n;
        var o = {};
        o[t] = {
            Element: {
                Fields: {}
            }
        }, e.push(o);
        var r = e.length - 1;
        return r
    }
    return s.prototype.withdrawAbsence = function (e, n, o) {
        return t.executeDelete("HrAbsenceInSite", "HrAbsenceInSite", ["EmId", "LeId", "ProfileId"], [e, n, o])
    }, s.prototype.searchForField = function (e, n, o, i) {
        var a = "";
        r.searchfieldform.searchfield && (a = r.searchfieldform.searchfield);
        var s = {
                fields: ["Mode", "PocketGuid", "ViewFieldId", "ViewFieldId2", "ViewFieldId3", "ViewFieldValue2", "ViewFieldValue3", "ViewFieldIdDes", "Value1", "Value2", "ExtraValue", "Query", "Filter", "Skip", "Take", "OnlyId", "QueryFieldId"],
                values: [3, e.searchview.guid, e.searchview.fieldId, e.searchview.fieldId2, e.searchview.fieldId3, e.searchview.fieldValue2, e.searchview.fieldValue3, e.searchview.fieldIdDes, e.searchview.value1, e.searchview.value2, e.extraValue, n, e.searchview.filter, o, i, e.onlyId, a]
            },
            c = e.fieldId;
        return t.executeData("PocketLeave", s).then(function (e) {
            if (e && e.rows) {
                for (var t = e.rows, n = 0; n < t.length; n++) t[n].fieldId = c;
                return {
                    rows: t,
                    fields: e.fields
                }
            }
        })
    }, s.prototype.getLeaveInfo = function (t) {
        var n = e.defer(),
            r = this,
            i = {};
        if (null != this._leaveProfiles)
            for (var a = 0; a < this._leaveProfiles.length; a++) i[this._leaveProfiles[a].Id] = a;
        if ("undefined" != typeof i[t] && this._leaveProfiles[i[t]].info) n.resolve(this._leaveProfiles[i[t]].info);
        else {
            var s = null;
            o.getSession().then(function (e) {
                s = e.maininsite
            })["finally"](function () {
                r.getNewLeaveInfo(t, null != s).then(function (e) {
                    n.resolve(e)
                })
            })
        }
        return n.promise
    }, s.prototype.getNewLeaveInfo = function (e, n) {
        var r = {
            fields: ["Mode", "ProfileId", "UseSession"],
            values: [2, e, n]
        };
        return n ? t.executeData("PocketLeave", r, function () {
            return o.getSession()
        }, void 0, !0) : t.executeData("PocketLeave", r, void 0, void 0, !0)
    }, s.prototype.getDeclarationFreeTablBySubjectId = function (e) {
        var n = {
            fields: ["Mode", "SubjectId"],
            values: [4, e]
        };
        return t.executeData("PocketLeave", n)
    }, s.prototype.queryProfiles = function (e, t, n, o, r, i) {
        var a = [];
        if (this[r])
            for (var s = 0; s < this[r].length; s++) !this[r][s].info || "" != t && -1 == this[r][s].Description.toLowerCase().indexOf(t.toLowerCase()) || ("undefined" != typeof i && null != i ? checkFillInData(i, this[r][s].info) && a.push(this[r][s]) : a.push(this[r][s]));
        e.resolve(a.slice(n, n + o))
    }, s.prototype.searchProfiles = function (n, r, i, a) {
        function s(e, t, n, o, r, i) {
            if (e < n.length) {
                var a = n[e],
                    c = t[a.Id];
                "undefined" != typeof c && null != l[r][c] && l[r][c].infoexpdate > (new Date).valueOf() ? (l[r][c].info && (a.info = l[r][c].info), a.infoexpdate = l[r][c].infoexpdate, s(e + 1, t, n, o, r, i)) : l.getNewLeaveInfo(a.Id, o).then(function (e) {
                    a.info = e
                })["finally"](function () {
                    a.infoexpdate = (new Date).valueOf() + timeoutProfiles, s(e + 1, t, n, o, r, i)
                })
            } else i()
        }
        var c = e.defer(),
            l = this,
            u = null;
        switch (a) {
        case "leave":
            var d = "_leaveProfiles",
                f = "LeaveProfiles",
                p = 1,
                a = 11;
            break;
        case "withdraw":
            var d = "_leaveWithdrawProfiles",
                f = "LeaveWithdrawProfiles",
                p = 5,
                a = 62
        }
        return o.getSession().then(function (e) {
            u = e.maininsite
        })["finally"](function () {
            if (null == l[d]) {
                var e = LocalStorage.getItem(f);
                null != e && (0 == e.indexOf(_prefixLS) ? l[d] = JSON.parse(b64_to_utf8(e.substr(_prefixLS.length))) : l[d] = JSON.parse(e))
            }
            var o = {},
                a = !0;
            if (null != l[d])
                for (var m = 0; m < l[d].length; m++)(!l[d][m].info || l[d][m].infoexpdate < (new Date).valueOf()) && (a = !1), o[l[d][m].Id] = m;
            var h = !1;
            l[d] && a && (h = !0, l.queryProfiles(c, n, r, i, d));
            var g = {
                fields: ["Mode", "Skip", "Take"],
                values: [p, -1, -1]
            };
            t.executeData("PocketLeave", g).then(function (e) {
                var t = e.rows;
                t ? s(0, o, t, null != u, d, function () {
                    l[d] = t, LocalStorage.setItem("LeaveProfiles", _prefixLS + utf8_to_b64(JSON.stringify(l[d]))), h || l.queryProfiles(c, n, r, i, d)
                }) : h || c.reject()
            })
        }), c.promise
    }, s.prototype.getLeaveSaldo = function (e, n) {
        var o = {
            fields: "EmployeeId",
            values: e.employee_id
        };
        return e.multiple_employment && (o.fields += ",EmploymentSeqNo", n ? o.values += "," + n : o.values += "," + e.dvb), t.executeData("GetLeaveSaldo", o).then(function (e) {
            var t = e.rows;
            if (t.length > 0) return t[0];
            throw new FriendlyException({
                title: atrans("errortitle", "Fout"),
                message: atrans("saldonotfound", "Actueel saldo niet gevonden en/of niet leesbaar")
            })
        })
    }, s.prototype.PredictLeaveSaldoTime = function (e, n, o, r, i, a, s) {
        var c = {
            fields: "EmployeeId,DateBegin,DateEnd,TimeBegin,TimeEnd,DiffTimes",
            values: e.employee_id + "," + n + "," + o + "," + r + "," + i + ",true"
        };
        return "undefined" != typeof a && (c.fields += ",LeaveType", c.values += "," + a), e.multiple_employment && (c.fields += ",EmploymentSeqNo", s ? c.values += "," + s : c.values += "," + e.dvb), t.executeData("GetLeaveSaldo", c).then(function (e) {
            var t = e.rows;
            return t.length > 0 ? t[0] : void 0
        })
    }, s.prototype.PredictLeaveSaldo = function (e, n, o, r) {
        var i = {
            fields: "EmployeeId,DateBegin,DateEnd",
            values: e.employee_id + "," + n + "," + o
        };
        return "undefined" != typeof r && (i.fields += ",LeaveType", i.values += "," + r), e.multiple_employment && (i.fields += ",EmploymentSeqNo", dvb ? i.values += "," + dvb : i.values += "," + e.dvb), t.executeData("GetLeaveSaldo", i).then(function (e) {
            var t = e.rows;
            return t.length > 0 ? t[0] : void 0
        })
    }, s.prototype.getDvbs = function (e, n) {
        var o = SessionStorage.getItem("dvbsel");
        (null != o || "" != o) && (e.dvbsel = JSON.parse(o));
        var r;
        return t.executeGet("Pocket_Employee_Employment", r, -1, -1, "start_date").then(function (t) {
            for (var o = [], r = 0; r < t.length; r++) t[r].subdvb && n || (o.push(t[r]), e.dvbsel ? e.dvbsel.employment == t[r].employment && (e.dvbsel = t[r]) : t[r].maindvb && (e.dvbsel = t[r], SessionStorage.setItem("dvbsel", JSON.stringify(e.dvbsel))));
            return o
        })
    }, s.prototype.getEmployment = function (e) {
        var n = {
            "static": {
                fields: "employment",
                values: e
            }
        };
        return t.executeGet("Pocket_Employee_Employment", n)
    }, s.prototype.getAbsencesByUser = function (e, o, r, i) {
        var a = [],
            s = {};
        return n.getConfig().then(function (n) {
            var o = {
                dynamic: {
                    fields: n.maychooseleavetype ? "employee" : "employee,type",
                    values: n.maychooseleavetype ? e.code : "user.code,config.leavetypeid",
                    operatortypes: n.maychooseleavetype ? "1" : "1,1"
                }
            };
            e.multiple_employment && i && (o.dynamic.fields += ",dvb", i ? o.dynamic.values += "," + i : o.dynamic.values += "," + e.dvb, o.dynamic.operatortypes += ",1");
            var r = {
                dynamic: {
                    fields: "employee",
                    values: e.code,
                    operatortypes: "1"
                }
            };
            return e.multiple_employment && (r.dynamic.fields += ",dvb", i ? r.dynamic.values += "," + i : r.dynamic.values += "," + e.dvb, o.dynamic.operatortypes += ",1"), t.executeGet("Pocket_Leaves", o, -1, -1, "-start_datetime").then(function (e) {
                if (e) {
                    a = e;
                    for (var n = 0; n < a.length; n++) s[a[n].recordnumber] = 1, a[n].kind = "Leave", a[n].status_code = "0";
                    return t.executeGet("Pocket_Leave_Requests", r, -1, -1, "-start_datetime").then(function (e) {
                        var t;
                        if (e)
                            for (t = 0; t < e.length; t++) "0" != e[t].status_code && (e[t].kind = "Request", a.push(e[t]));
                        return c(a, r).then(function () {
                            for (a = a.sort(function (e, t) {
                                    return parseDateString(t.start_datetime).getTime() - parseDateString(e.start_datetime).getTime()
                                }), t = 0; t < a.length; t++) a[t].year = a[t].start_datetime.slice(0, 4);
                            return a
                        })
                    })
                }
                throw new SkippedException
            })
        })
    }, s.prototype.getRequestByRecordnumber = function (e) {
        var o = {
            "static": {
                fields: "recordnumber",
                values: e
            }
        };
        return t.executeGet("Pocket_Leave_Requests", o).then(function (e) {
            return e.length > 0 ? n.getConfig().then(function (n) {
                return isVersionOrHigher(n, "Profit15") ? t.executeGet("Pocket_Leave_Withdrawals", o).then(function (t) {
                    return t && t.length > 0 && (e[0].isWithdrawn = !0), e[0]
                }) : e[0]
            }) : void 0
        })
    }, s.prototype.getLeaveByRecordNumber = function (e) {
        var o = {
            "static": {
                fields: "recordnumber",
                values: e
            }
        };
        return t.executeGet("Pocket_Leaves", o).then(function (e) {
            return e.length > 0 ? n.getConfig().then(function (n) {
                return isVersionOrHigher(n, "Profit15") ? t.executeGet("Pocket_Leave_Withdrawals", o).then(function (t) {
                    return t && t.length > 0 && (e[0].isWithdrawn = !0), e[0]
                }) : e[0]
            }) : void 0
        })
    }, s.prototype.getAbsenceBySubjectId = function (e) {
        var n = {
            "static": {
                fields: "subjectid",
                values: e
            }
        };
        return t.executeGet("Pocket_Leave_Requests", n).then(function (e) {
            if (e.length > 0) return e[0];
            throw new FriendlyException({
                title: atrans("errortitle", "Fout"),
                message: atrans("leavenotfound", "Het is niet mogelijk deze verlofaanvraag te openen. Je hebt geen rechten om gegevens van deze medewerker te bekijken. Vraag je applicatiebeheerder de juiste rechten toe te kennen om de verlofaanvraag te kunnen bekijken.")
            })
        })
    }, s.prototype.getSchedule = function (n) {
        var o = e.defer();
        if ("undefined" == typeof this._schedules && (this._schedules = {}), this._schedules[n]) o.resolve(this._schedules[n]);
        else {
            if (n) var r = {
                "static": {
                    fields: "dvb",
                    values: n
                }
            };
            var i = this;
            t.executeGet("Pocket_Schedule", r).then(function (e) {
                e && e[0] ? (0 == e[0].hours_per_day && (e[0].hours_per_day = e[0].hours_per_week / e[0].days_per_week), i._schedules[n] = e, o.resolve(e)) : (i._schedules[n] = [], o.resolve([]))
            }, function () {
                o.reject()
            })
        }
        return o.promise
    }, s.prototype.getTimetable = function (n, o) {
        var r = e.defer();
        if ("undefined" == typeof this._timetables && (this._timetables = {}), this._timetables[n]) r.resolve(this._timetables[n]);
        else {
            var a = {
                "static": {
                    fields: "start_date",
                    values: n
                }
            };
            o && (a["static"].fields += ",dvb", a["static"].values += "," + o);
            var s = this;
            t.executeGet("Pocket_Timetable", a, 0, i, "start_time").then(function (e) {
                s._timetables[n] = e, r.resolve(e)
            }, function () {
                r.reject()
            })
        }
        return r.promise
    }, s.prototype.getTypes = function (e, o, r, i) {
        return n.getConfig().then(function (n) {
            if (isVersionOrHigher(n, "2016B2PU10")) {
                var a;
                return a = isVersionOrHigher(n, "Profit8") ? {
                    jsonFilter: {
                        Filters: {
                            Filter: [{
                                "@FilterId": "WorkReg 1",
                                Field: [{
                                    "@FieldId": "start_date",
                                    "@OperatorType": "3",
                                    "#text": e
                                }, {
                                    "@FieldId": "end_date",
                                    "@OperatorType": "2",
                                    "#text": o
                                }, {
                                    "@FieldId": "workreg_id",
                                    "@OperatorType": "1",
                                    "#text": r
                                }, {
                                    "@FieldId": "cworkreg_id",
                                    "@OperatorType": "1",
                                    "#text": i
                                }]
                            }, {
                                "@FilterId": "WorkReg 2",
                                Field: [{
                                    "@FieldId": "start_date",
                                    "@OperatorType": "3",
                                    "#text": e
                                }, {
                                    "@FieldId": "end_date",
                                    "@OperatorType": "8",
                                    "#text": ""
                                }, {
                                    "@FieldId": "workreg_id",
                                    "@OperatorType": "1",
                                    "#text": r
                                }, {
                                    "@FieldId": "cworkreg_id",
                                    "@OperatorType": "1",
                                    "#text": i
                                }]
                            }]
                        }
                    }
                } : {
                    dynamic: {
                        fields: "start_date,end_date;end_date,workreg_id,cworkreg_id",
                        values: e + "," + o + "," + r + "," + i,
                        operatortypes: "3,2;8,1,1"
                    }
                }, t.executeGet("Pocket_Work_Regulation_Leave", a).then(function (e) {
                    return t.executeGet("Pocket_Leave_Types").then(function (t) {
                        for (var n = [], o = 0; o < t.length; o++)
                            for (var r = 0; r < e.length; r++)
                                if (t[o].id == e[r].leave_type) {
                                    n.push(t[o]);
                                    break
                                } return n
                    })
                })
            }
            return t.executeGet("Pocket_Leave_Types")
        })
    }, s.prototype.getReasons = function () {
        return t.executeGet("Pocket_Leave_Reasons")
    }, s.prototype.getRequests = function () {
        return t.executeGet("Pocket_Leave_Requests")
    }, s.prototype.postAbsence = function (n, o, r, i) {
        function s(e, n, o, r) {
            var i, a = "HrAbsenceInSite";
            if (i = n ? {
                    HrAbsenceInSite: {
                        Element: {
                            Fields: {
                                EmId: e.EmId,
                                DuRa: Math.round(60 * e.DuRa),
                                ViAt: e.ViAt,
                                ViLr: e.ViLr,
                                DaBe: e.DaBe,
                                DaEn: e.DaEn,
                                LeDt: e.LeDt,
                                Re: e.Re
                            }
                        }
                    }
                } : {
                    HrAbsenceInSite: {
                        Element: {
                            Fields: {
                                EmId: e.EmId,
                                DuRa: Math.round(60 * e.DuRa),
                                ViAt: e.ViAt,
                                ViLr: e.ViLr,
                                DaBe: e.DaBe,
                                DaEn: e.DaEn,
                                LeDt: e.LeDt,
                                Re: e.Re
                            }
                        }
                    }
                }, "undefined" != typeof e.EmRp && (i.HrAbsenceInSite.Element.Fields.EmRp = e.EmRp), "undefined" != typeof o && (i.HrAbsenceInSite.Element.Fields.ProfileId = o), "undefined" != typeof e.EnSe && (i.HrAbsenceInSite.Element.Fields.EnSe = e.EnSe), r && r.length > 0) {
                i.HrAbsenceInSite.Element.Objects = [];
                var s = u(i.HrAbsenceInSite.Element.Objects, "HrAbsenceInSiteAttachment");
                i.HrAbsenceInSite.Element.Objects[s].HrAbsenceInSiteAttachment.Element = [];
                for (var l = 0; l < r.length; l++) r[l].fileId && i.HrAbsenceInSite.Element.Objects[s].HrAbsenceInSiteAttachment.Element.push({
                    Fields: {
                        FileId: r[l].fileId
                    }
                })
            }
            t.executePost(a, i).then(function (e) {
                c.resolve()
            }, function () {
                c.reject()
            })
        }
        var c = e.defer();
        return i && i.length > 0 ? (a.remove(), l(0, i, c, function () {
            s(n, o, r, i, c)
        })) : s(n, o, r, i, c), c.promise
    }, {
        getInstance: function () {
            return new s
        }
    }
}]).factory("TimesheetServiceFactory", ["$q", "$rootScope", "$timeout", "$ionicPopup", "$ionicPosition", "$ionicActionSheet", "$ionicScrollDelegate", "ConnectorService", "LongOperationService", "ConfigService", "EnvConfigService", "UserService", function (e, t, n, o, r, i, a, s, c, l, u, d) {
    function f() {
        this._entryLayouts = null, this._closedDates = {}
    }
    return f.prototype.searchForField = function (e, n, o, r) {
        if (e.searchview) {
            var i = "";
            t.searchfieldform.searchfield && (i = t.searchfieldform.searchfield);
            var a = {
                    fields: ["Mode", "PocketGuid", "ViewFieldId", "ViewFieldId2", "ViewFieldId3", "ViewFieldValue2", "ViewFieldValue3", "ViewFieldIdDes", "Value1", "Value2", "Query", "Filter", "Skip", "Take", "OnlyId", "QueryFieldId"],
                    values: [3, e.searchview.guid, e.searchview.fieldId, e.searchview.fieldId2, e.searchview.fieldId3, e.searchview.fieldValue2, e.searchview.fieldValue3, e.searchview.fieldIdDes, e.searchview.value1, e.searchview.value2, n, e.searchview.filter, o, r, e.onlyId, i]
                },
                c = e.fieldId;
            if (e && e.fields)
                for (key in e.fields) e.fields.hasOwnProperty(key) && (a.fields.push(key), a.values.push(e.fields[key]));
            return s.executeData("PocketReaGrid", a).then(function (e) {
                if (e && e.rows) {
                    for (var t = e.rows, n = 0; n < t.length; n++) {
                        t[n].fieldId = c;
                        for (var o in t[n]) t[n].hasOwnProperty(o) && "string" == typeof t[n][o] && -1 != t[n][o].indexOf("T00:00:00Z") && (t[n][o] = formatDate(parseDateString(t[n][o])))
                    }
                    return {
                        rows: t,
                        fields: e.fields
                    }
                }
            })
        }
        throw new SkippedException
    }, f.prototype.getValuesFromTriggerFields = function (e, t, n, o, r) {
        e.form.VaIt && (n.push("VaIt"), o.push(e.form.VaIt.id)), e.form.PcId && -1 == n.indexOf("PcId") && (n.push("PcId"), o.push(e.form.PcId.idext || e.form.PcId.id)), e.form.DaTi && -1 == n.indexOf("DaTi") && (n.push("DaTi"), o.push(getJSONDate(fromGMTDate(e.form.DaTi))));
        var i = {
            fields: ["Mode", "EntryLayoutId", "ResultFieldId", "TriggerFieldId", "TriggerValue"],
            values: [4, e.sel.selectedLayout.Id, t.join(":-:"), n.join(":-:"), o.join(":-:")]
        };
        e.form.Id && (i.fields.push("RowId"), i.values.push(e.form.Id)), s.executeData("PocketReaGrid", i).then(function (t) {
            for (var n in t)
                if (t.hasOwnProperty(n) && "eob" != n && "_flexcomptype" != n) {
                    e.sel.selectedLayout.info.detailFields[n] ? "Ds" != n && (e.sel.selectedLayout.info.detailFields[n].enabled = t[n].enabled) : e.sel.selectedLayout.info.detailFields[n] = t[n];
                    var o = e.sel.selectedLayout.info.detailFields[n].ctype;
                    issearchfield(o) ? isNotEmpty(t[n].value) && (e.pickedFields && (e.pickedFields[n] = !0), e.form[n] && e.form[n].id == t[n].value || (t[n].description ? (e.form[n] = {
                        id: t[n].value,
                        idext: t[n].extvalue,
                        name: t[n].description
                    }, e.form[n + "_entry"] = t[n].extvalue || t[n].value) : -1 == e.sel.selectedLayout.info.defaultTriggerFields.indexOf(n) && e.validateEntry2 && e.validateEntry2(t[n].value, n))) : isNotEmpty(t[n].value) && e.form[n] != t[n].value && (e.form[n] = t[n].value)
                } t._flexcomptype && (e.sel.selectedLayout.flexcomptype = t._flexcomptype), e.screenview()
        })["finally"](function () {
            r.resolve()
        })
    }, f.prototype.checkTriggerFields = function (t, n) {
        function o(e) {
            for (var t = 0; t < e.length; t++) switch (e[t]) {
            case "AmPy":
                -1 == c.indexOf("AmPy") && (s.push("UpFc"), s.push("AmCo"), s.push("AmFc"), -1 == c.indexOf("BiId") && (c.push("BiId"), l.push(n.form.BiId.idext || n.form.BiId.id)), c.push("AmPy"), l.push(n.form.AmPy))
            }
        }

        function r(e, t, o) {
            if (e)
                for (var i in e)
                    if (e.hasOwnProperty(i) && "eob" != i && e[i].TriggerFields)
                        for (var a = 0; a < t.length; a++) {
                            var u = e[i].TriggerFields.indexOf(t[a]),
                                d = n.sel.selectedLayout.info.defaultTriggerFields;
                            if ((-1 != u || d && -1 != d.indexOf(t[a])) && (!o || n.form[t[a]] && n.form[t[a]].id)) {
                                if (-1 != u && -1 == s.indexOf(i) && -1 == t.indexOf(i)) {
                                    s.push(i);
                                    var f = [];
                                    f.push(i), r(e, f)
                                } - 1 == c.indexOf(t[a]) && (c.push(t[a]), l.push(o ? n.form[t[a]].idext || n.form[t[a]].id : ""))
                            }
                        }
        }
        var i = e.defer(),
            a = this;
        if (n.sel.selectedLayout) {
            var s = [],
                c = [],
                l = [];
            r(n.sel.selectedLayout.info["fieldSetting_" + n.sel.type], t, !0), o(t), c.length > 0 ? a.getValuesFromTriggerFields(n, s, c, l, i) : i.resolve()
        } else i.resolve();
        return i.promise
    }, f.prototype.executeAction = function (e, t, n) {
        var o = {
            fields: ["Mode", "EntryLayoutId", "ActionId", "Date"],
            values: [6, e.sel.selectedLayout.Id, n.id, t]
        };
        return s.executeData("PocketReaGrid", o)
    }, f.prototype.checkClosed = function (t, n, o) {
        n += "T00:00:00Z";
        var r = this;
        if (o && (this._closedDates = {}), "undefined" != typeof this._closedDates[n]) {
            var i = e.defer();
            return i.resolve({
                closed: this._closedDates[n]
            }), i.promise
        }
        var a = {
            fields: ["Mode", "EntryLayoutId", "Date"],
            values: [7, t.sel.selectedLayout.Id, n]
        };
        return s.executeData("PocketReaGrid", a).then(function (e) {
            if (e) {
                for (var t in e) e.hasOwnProperty(t) && (r._closedDates[t] = e[t]);
                return {
                    closed: r._closedDates[n]
                }
            }
            return e
        })
    }, f.prototype.loadEntryLayouts = function (t, o, r, a) {
        function d(e, t, n) {
            if (e.sel.selectedLayout) {
                c.startBlock();
                var o = {
                    fields: ["Mode", "EntryLayoutId", "RowId", "FromLayoutFields"],
                    values: [5, e.sel.selectedLayout.Id, n, (e.sel.selectedLayout.info.fromLayoutFields || []).join(":-:")]
                };
                s.executeData("PocketReaGrid", o, void 0, void 0, !0).then(function (n) {
                    e.sel.selectedLayout.info.detailFields = n.detailFields, t.resolve()
                }, function () {
                    t.reject()
                })["finally"](function () {
                    c.endBlock()
                })
            } else t.reject()
        }

        function f(e, t, n, o, r, i) {
            if (1 == t.length) a = cloneAsObject(t[0]), n.sel = {
                selectedLayout: a,
                entryLayouts: t
            }, LocalStorage.setItem("selLayoutId_timesheet", a.Id), i ? d(n, e, i) : e.resolve();
            else {
                var a, s = LocalStorage.getItem("selLayoutId_timesheet"),
                    c = !1;
                if (isNotEmpty(s))
                    for (var l = 0; l < t.length; l++)
                        if (t[l].Id == s) {
                            a = cloneAsObject(t[l]), c = !0;
                            break
                        } if (!c || r)
                    if (o) {
                        for (var u = [], l = 0; l < t.length; l++) u.push({
                            text: (t[l].Id == s ? "<i class='icon ion-checkmark-circled'></i>" : "<i class='icon iconHide'></i>") + t[l].Description,
                            layout: t[l]
                        });
                        p(u, n, e, t, i)
                    } else e.resolve();
                else n.sel = {
                    selectedLayout: a,
                    entryLayouts: t
                }, i ? d(n, e, i) : e.resolve()
            }
        }

        function p(e, t, o, r, a) {
            n(function () {
                if (document.body.lastChild && document.body.lastChild.firstChild) {
                    var e = window.getComputedStyle(document.body.lastChild.firstChild);
                    "matrix(1, 0, 0, 1, 0, 0)" != e["-webkit-transform"] && (document.body.lastChild.firstChild.style["-webkit-transform"] = "matrix(1, 0, 0, 1, 0, 0)")
                }
            }, 500);
            var s = i.show({
                buttons: e,
                titleText: atrans("chooselayout", "Kies boekinglay-out"),
                cancelText: atrans("cancel", "Annuleren"),
                cancel: function () {
                    o.reject()
                },
                buttonClicked: function (n) {
                    selectedLayout = e[n].layout, t.sel = {
                        selectedLayout: selectedLayout,
                        entryLayouts: r
                    }, LocalStorage.setItem("selLayoutId_timesheet", selectedLayout.Id), s(), t.selectedLayoutChanged && t.selectedLayoutChanged(), a ? d(t, o, a) : o.resolve()
                }
            })
        }
        var m = e.defer(),
            h = this;
        return t.sel && t.sel.selectedLayout && !r ? a ? d(t, m, a) : m.resolve() : l.getConfig().then(function (e) {
            isVersionOrHigher(e, "Profit12") ? u.getEnvConfig().then(function (e) {
                e.entrylayoutinfo && e.entrylayoutinfo[168] > 0 ? h.fetchEntryLayouts().then(function (e) {
                    e && e.length > 0 ? f(m, e, t, o, r, a) : m.reject()
                }) : m.reject()
            }) : m.reject()
        }), m.promise
    }, f.prototype.getNewEntryLayoutInfo = function (e) {
        var t = {
            fields: ["Mode", "EntryLayoutId"],
            values: [2, e]
        };
        return s.executeData("PocketReaGrid", t, void 0, void 0, !0)
    }, f.prototype.queryEntryLayouts = function (e) {
        var t = [];
        if (this._entryLayouts)
            for (var n = 0; n < this._entryLayouts.length; n++) this._entryLayouts[n].info && t.push(this._entryLayouts[n]);
        e.resolve(t)
    }, f.prototype.fetchEntryLayouts = function () {
        function t(e, n, r, i) {
            if (e < r.length) {
                var a = r[e];
                "undefined" != typeof n[a.Id] && null != o._entryLayouts[n[a.Id]] && o._entryLayouts[n[a.Id]].infoexpdate > (new Date).valueOf() ? (o._entryLayouts[n[a.Id]].info && (a.info = o._entryLayouts[n[a.Id]].info), a.infoexpdate = o._entryLayouts[n[a.Id]].infoexpdate, t(e + 1, n, r, i)) : o.getNewEntryLayoutInfo(a.Id).then(function (e) {
                    for (var t = [], n = 0; n < e.actions.length; n++) e.actions[n].hide || t.push(e.actions[n]);
                    e.actions = t, a.info = e
                })["finally"](function () {
                    a.infoexpdate = (new Date).valueOf() + timeoutProfiles, t(e + 1, n, r, i)
                })
            } else i()
        }
        var n = e.defer(),
            o = this;
        if (null == o._entryLayouts) {
            var r = LocalStorage.getItem("EntryLayouts_timesheet");
            null != r && (0 == r.indexOf(_prefixLS) ? o._entryLayouts = JSON.parse(b64_to_utf8(r.substr(_prefixLS.length))) : o._entryLayouts = JSON.parse(r))
        }
        var i = {},
            a = !0;
        if (null != o._entryLayouts)
            for (var c = 0; c < o._entryLayouts.length; c++) o._entryLayouts[c].infoexpdate < (new Date).valueOf() && (a = !1), i[o._entryLayouts[c].Id] = c;
        var l = !1;
        o._entryLayouts && a && (l = !0, o.queryEntryLayouts(n));
        var u = {
            fields: ["Mode", "Skip", "Take"],
            values: [1, -1, -1]
        };
        return s.executeData("PocketReaGrid", u).then(function (e) {
            var r = e.rows;
            r ? t(0, i, r, function () {
                o._entryLayouts = r, LocalStorage.setItem("EntryLayouts_timesheet", _prefixLS + utf8_to_b64(JSON.stringify(o._entryLayouts))), l || o.queryEntryLayouts(n)
            }) : l || n.reject()
        }), n.promise
    }, f.prototype.postTimesheetByLayout = function (t, i) {
        return d.getUser().then(function (c) {
            function l(e) {
                if (e.sel.selectedLayout && e.sel.selectedLayout.info) {
                    var t, l = e.sel.selectedLayout.info.detailFields,
                        d = e.haserror,
                        m = {
                            PtRealization: {
                                Element: {
                                    Fields: {
                                        CreateDeclarations: !1
                                    }
                                }
                            }
                        },
                        h = ["Upri", "AmSe"];
                    "DU" == e.sel.selectedLayout.flexcomptype && (h.push("UpFc"), h.push("QuUn"), h.push("Qu")), m.PtRealization.Element.Fields.VaIt = p.VaIt.id, p.Id && (m.PtRealization.Element.Fields.Id = p.Id), p.BcId = null;
                    for (t in l) l.hasOwnProperty(t) && "eob" != t && "custom" != t && -1 == h.indexOf(t) && (-1 != e.sel.selectedLayout.info["layoutFields_" + e.sel.type].indexOf(t) && l[t].visible && (d |= checkFormField(p, l, t, c)), d || "PtRealization" != l[t].element || u(e, l, t) && ("object" == typeof p[t] && p[t] && p[t].id ? "BiId" == t ? m.PtRealization.Element.Fields.ItCd = p[t].idext : m.PtRealization.Element.Fields[t] = p[t].idext || p[t].id : "object" == typeof p[t] && p[t] && p[t].getDate ? m.PtRealization.Element.Fields[t] = getJSONDate(fromGMTDate(p[t])) : 12 == l[t].dtype && p[t] ? m.PtRealization.Element.Fields[t] = p[t].toString().replace(",", ".") : isUpdatable(p, l, t) && (m.PtRealization.Element.Fields[t] = p[t])));
                    if (!d && p.attachments && p.attachments.length > 0 && p.attachments[0].fileId && (m.PtRealization.Element.Fields.FileId = p.attachments[0].fileId), !d) return s[p.Id ? "executePut" : "executePost"]("PtRealization", m).then(function (e) {
                        var t;
                        e && e.results && e.results.PtRealization && (t = e.results.PtRealization.length ? e.results.PtRealization[0].Id : e.results.PtRealization.Id), f.resolve(t)
                    });
                    i || showErrors(p, l, "wizardmain", n, o, r, a), f.reject()
                } else f.reject()
            }

            function u(e, t, n) {
                return e.sel.selectedLayout.flexcomptype && -1 != ["QuUn", "AmPy", "EpFc", "AmCo", "AmFc"].indexOf(n) && !t[n].enabled ? !1 : !0
            }

            function d(e, t, n) {
                if (e < t.length) {
                    var o = t[e];
                    o.fileId ? d(e + 1, t, n) : o.file ? s.uploadFile("PtRealization", null, o.file).then(function (e) {
                        e.fileids && (o.fileId = e.fileids[0])
                    })["finally"](function () {
                        d(e + 1, t, n)
                    }) : o.fileURI ? s.uploadFileByUrl("PtRealization", o.fileURI, o.filename).then(function (e) {
                        e.fileids && (o.fileId = e.fileids[0])
                    })["finally"](function () {
                        d(e + 1, t, n)
                    }) : d(e + 1, t, n)
                } else n()
            }
            var f = e.defer(),
                p = t.form;
            return p.attachments && p.attachments.length > 0 ? d(0, p.attachments, function () {
                l(t)
            }) : l(t), f.promise
        })
    }, f.prototype.getTimesheets = function (e, t) {
        d1 = new Date(e.getTime()), d2 = new Date(t.getTime()), d1.setHours(0), d1.setMinutes(0), d2.setHours(23), d2.setMinutes(59);
        var n = {
            dynamic: {
                fields: "date,date",
                values: getJSONDate(d1) + "," + getJSONDate(d2),
                operatortypes: "2,3"
            }
        };
        return s.executeGet("Pocket_Timesheets", n, -1, -1)
    }, f.prototype.getProjectTimesheets = function (e, t, n) {
        d1 = new Date(e.getTime()), d2 = new Date(t.getTime()), d1.setHours(0), d1.setMinutes(0), d2.setHours(23), d2.setMinutes(59);
        var o = {
            fields: ["Mode", "ProjectId", "DateStart", "DateEnd"],
            values: [15, n, getJSONDate(d1), getJSONDate(d2)]
        };
        return s.executeData("PocketProject", o).then(function (e) {
            return e ? e.rows : void 0
        })
    }, f.prototype.getWeeks = function () {
        function t(e, a) {
            if (3 > a) {
                var s = new Date;
                s.setDate(s.getDate() - 7 + 7 * a);
                var c = new Date(s);
                c.setDate(c.getDate() - (c.getDay() - 1));
                var l = new Date(c);
                l.setDate(l.getDate() + 6), e.getTimesheets(c, l).then(function (r) {
                    for (var s = [], l = 0; 7 > l; l++) {
                        var u = new Date(c);
                        u.setDate(u.getDate() + l), s.push({
                            hours: n(r, u),
                            date: new Date(u),
                            dateString: getJSONDate(u),
                            day_num: u.getDate(),
                            day: getDayString(l),
                            month: getMonthString(u.getMonth()).substring(0, 3).toUpperCase()
                        })
                    }
                    i.push({
                        days: s,
                        total: o(s)
                    }), t(e, a + 1)
                })
            } else r.resolve(i)
        }

        function n(e, t) {
            for (var n = 0, o = 0; o < e.length; o++) {
                var r = fromGMTDate(new Date(Date.parse(e[o].date)));
                r.getDate() == t.getDate() && (n += e[o].quantity)
            }
            return n
        }

        function o(e) {
            for (var t = 0, n = 0; n < e.length; n++) t += e[n].hours;
            return Math.round(10 * t) / 10
        }
        var r = e.defer(),
            i = [];
        return t(this, 0), r.promise
    }, f.prototype.getSpecificTimesheet = function (e) {
        var t = {
            "static": {
                fields: "guid",
                values: e
            }
        };
        return s.executeGet("Pocket_timesheets", t)
    }, f.prototype.fetchRecent = function (e, t) {
        return s.executeGet(e, t).then(function (e) {
            return e
        })
    }, f.prototype.validateEntry = function (e, t, n) {
        if (e.length > 0) {
            var o, r, i, a;
            return "project" == t ? this.search("projects", e, n, 0, 2, !0).then(function (e) {
                if (1 == e.length) return e;
                throw new SkippedException
            }) : "activity" == t ? this.search("activities", e, n, 0, 2, !0).then(function (e) {
                if (1 == e.length) return e;
                throw new SkippedException
            }) : ("itemtype" == t ? (o = "Pocket_TimeTypes", r = "timetype", a = e, i = "1") : "project_stage" == t && (o = "Pocket_Project_Stages", r = "projectstage_id", a = e, i = "1"), filter = {
                dynamic: {
                    fields: r,
                    values: a,
                    operatortypes: i
                }
            }, s.executeGet(o, filter, 0, 2).then(function (e) {
                if (1 == e.length) return e;
                throw new SkippedException
            }))
        }
        throw new SkippedException
    }, f.prototype.search = function (e, t, n, o, r, i) {
        return c.start("PocketTimesheet"), l.getConfig().then(function (a) {
            var l, u = "",
                d = "",
                f = "";
            if ("projects" == e) {
                if (isVersionOrHigher(a, "Profit6")) {
                    if (l = {
                            fields: ["Skip", "Take", "Mode"],
                            values: [o, r, 1]
                        }, n && n.fields)
                        for (key in n.fields) n.fields.hasOwnProperty(key) && (l.fields.push(key), l.values.push(n.fields[key]));
                    return "" != t && (l.fields.push("SearchQuery"), l.values.push(t)), "undefined" != typeof i && (l.fields.push("OnlyId"), l.values.push(i)), s.executeData("PocketProjectValidityChecks", l).then(function (e) {
                        return e.rows
                    })["finally"](function () {
                        c.end("PocketTimesheet")
                    })
                }
                u = {
                    dynamic: {
                        fields: "project_name;project_id;contact_name",
                        values: t
                    }
                }, d = "Pocket_Projects", f = "project_name"
            }
            if ("activities" == e) {
                if (isVersionOrHigher(a, "Profit6")) {
                    if (l = {
                            fields: ["Skip", "Take", "Mode"],
                            values: [o, r, 2]
                        }, n && n.fields)
                        for (key in n.fields) n.fields.hasOwnProperty(key) && (l.fields.push(key), l.values.push(n.fields[key]));
                    return "" != t && (l.fields.push("SearchQuery"), l.values.push(t)), "undefined" != typeof i && (l.fields.push("OnlyId"), l.values.push(i)), s.executeData("PocketProjectValidityChecks", l).then(function (e) {
                        return e.rows
                    })["finally"](function () {
                        c.end("PocketTimesheet")
                    })
                }
                u = {
                    dynamic: {
                        fields: "description;id",
                        values: t
                    }
                }, d = "Pocket_Activities", f = "description"
            }
            return "itemtypes" == e && (u = {
                dynamic: {
                    fields: "description",
                    values: t
                }
            }, d = "Pocket_TimeTypes", f = "description"), s.executeGet(d, "" == t ? {} : u, o, r, f).then(function (e) {
                return e
            })["finally"](function () {
                "" != t && c.endBlock()
            })
        })
    }, f.prototype.checkForItemType = function (e) {
        return s.executeGet("Pocket_Activities", {
            "static": {
                fields: "id",
                values: e.id
            }
        }, 0, 1).then(function (e) {
            if (e && e.length > 0 && e[0].itemtype_id) return {
                timetype: e[0].itemtype_id,
                description: e[0].itemtype_description
            };
            throw new SkippedException
        })
    }, f.prototype.getActivities = function (e, t) {
        return s.executeGet("Pocket_Activities", -1, e, t, "description")
    }, f.prototype.getProjects = function (e, t, n) {
        return l.getConfig().then(function (o) {
            var r = isVersionOrHigher(o, "2016B2PU10") && "undefined" != typeof n ? {
                dynamic: {
                    fields: "start_date",
                    values: n,
                    operatortypes: 3
                }
            } : {};
            return s.executeGet("Pocket_Projects", r, e, t, "project_name")
        })
    }, f.prototype.getProjectById = function (e) {
        var t = {
            dynamic: {
                fields: "project_id",
                values: e,
                operatortypes: "1"
            }
        };
        return s.executeGet("Pocket_Projects", t).then(function (e) {
            return e
        })
    }, f.prototype.getProjectStages = function (e, t) {
        var n = {
            dynamic: {
                fields: "end_date;end_date,start_date;start_date,project_id",
                values: ";" + t + ",;" + t + "," + e,
                operatortypes: "8;4,8;3,1"
            }
        };
        return s.executeGet("Pocket_Project_Stages", n, -1, -1)
    }, f.prototype.postTimesheet = function (e, t, n) {
        return l.getConfig().then(function (o) {
            var r = {
                EmId: e.EmId,
                DaTi: e.DaTi,
                ItCd: e.ItCd,
                StId: e.StId,
                Qu: e.Qu,
                PrId: e.PrId,
                PrSt: e.PrSt
            };
            "undefined" != typeof e.Id && (r.Id = e.Id), "undefined" != typeof e.Ds && (r.Ds = e.Ds), "undefined" != typeof e.DsIn && (r.DsIn = e.DsIn), "undefined" != typeof e.DsEx && (r.DsEx = e.DsEx);
            var i = "PtRealization",
                a = {};
            return a[i] = {
                Element: {
                    Fields: r
                }
            }, "undefined" != typeof e.Id ? s.executePut(i, a, t, n).then(function (e) {
                return e
            }) : s.executePost(i, a, t, n).then(function (e) {
                return e
            })
        })
    }, f.prototype.postApproved = function (e, t, n) {
        return l.getConfig().then(function (o) {
            var r = "PtRealization",
                i = {};
            return i[r] = {
                Element: {
                    Fields: {
                        Id: e,
                        DaTi: t,
                        Ap: n
                    }
                }
            }, s.executePut(r, i).then(function (e) {
                return e
            })
        })
    }, f.prototype.remove = function (e, t) {
        return l.getConfig().then(function (n) {
            var o = "PtRealization";
            return s.executeDelete(o, o, ["Id", "DaTi", "Ap"], [e, t, !0]).then(function (e) {
                return e
            })
        })
    }, {
        getInstance: function () {
            return new f
        }
    }
}]).factory("PlacementServiceFactory", ["ConnectorService", "EnvConfigService", "ConfigService", "UserService", "$q", function (e, t, n, o, r) {
    function i() {}
    return i.prototype.getPlacements = function (e, t, n, o) {
        if (0 == n) {
            var r = o ? o : new Date,
                i = new Date(r);
            i.setDate(r.getDate() - 1), i.setMonth(i.getMonth() - 1);
            var a = {
                jsonFilter: {
                    Filters: {
                        Filter: [{
                            "@FilterId": "actual",
                            Field: [{
                                "@FieldId": "date_begin",
                                "@OperatorType": "3",
                                "#text": getJSONDate(r)
                            }, {
                                "@FieldId": "date_end",
                                "@OperatorType": "2",
                                "#text": getJSONDate(i)
                            }]
                        }, {
                            "@FilterId": "actual1",
                            Field: [{
                                "@FieldId": "date_begin",
                                "@OperatorType": "3",
                                "#text": getJSONDate(r)
                            }, {
                                "@FieldId": "date_end",
                                "@OperatorType": "8",
                                "#text": ""
                            }]
                        }]
                    }
                }
            }
        } else var a = {};
        return this._getPlacementsInternal(e, t, a, n)
    }, i.prototype.getPlacement = function (e, t) {
        var n = this;
        if ("undefined" == typeof n._placementDictionary || "undefined" == typeof n._placementDictionary[t] || null == n._placementDictionary[t] || null == n._placementDictionary[t][e]) {
            var o = {
                dynamic: {
                    fields: "placement_id",
                    values: e,
                    operatortypes: "1"
                }
            };
            return n._getPlacementsInternal(0, 1, o, t).then(function (e) {
                return 0 == e.length ? null : e[0]
            })
        }
        return r(function (o, r) {
            o(n._placementDictionary[t][e])
        })
    }, i.prototype._getPlacementsInternal = function (t, o, r, i) {
        function a(e) {
            for (var t = {
                    jsonFilter: {
                        Filters: {
                            Filter: []
                        }
                    }
                }, n = t.jsonFilter.Filters.Filter, o = 0; o < e.length; o++) n.push({
                "@FilterId": e[o].placement_id,
                Field: {
                    "@FieldId": "placement_id",
                    "@OperatorType": "1",
                    "#text": e[o].placement_id
                }
            });
            return t
        }

        function s(e, t) {
            for (var n = {}, o = 0; o < e.length; o++)
                if (!n[e[o].placement_id])
                    for (j = 0; j < t.length; j++)
                        if (t[j].placement_id === e[o].placement_id) {
                            e[o].hourlywage = t[j].hourlywage, e[o].grosshourlywage = t[j].grosshourlywage, n[e[o].placement_id] = e[o].placement_id;
                            break
                        }
        }

        function c(e, n) {
            for (var o = 0; o < e.length; o++) e[o].descriptionAndPlacement = e[o].description + " (" + e[o].placement_code.toString() + ")", n._placementDictionary[i][e[o].placement_id] = e[o];
            if (t > 0) {
                e = [];
                for (var r in n._placementDictionary[i]) n._placementDictionary[i].hasOwnProperty(r) && e.push(n._placementDictionary[i][r])
            }
            return 0 == i ? e.sort(function (e, t) {
                return e.placement_code < t.placement_code ? -1 : e.placement_code > t.placement_code ? 1 : e.date_begin < t.date_begin ? -1 : e.date_begin > t.date_begin ? 1 : 0
            }) : r && r[0] && e[0].organisation ? e.sort(function (e, t) {
                return e.organisation < t.organisation ? -1 : e.organisation > t.organisation ? 1 : e.date_begin < t.date_begin ? -1 : e.date_begin > t.date_begin ? 1 : 0
            }) : e.sort(function (e, t) {
                return e.project_id > t.project_id ? -1 : e.project_id < t.project_id ? 1 : e.date_begin < t.date_begin ? -1 : e.date_begin > t.date_begin ? 1 : 0
            })
        }
        var l = this;
        return 2 === i && (i = 1), n.getConfig().then(function (n) {
            if (-1 != n.modules.indexOf(22)) {
                "undefined" == typeof t && (t = 0), 0 == t && ("undefined" == typeof l._placementDictionary && (l._placementDictionary = {
                    0: {},
                    1: {}
                }), l._placementDictionary[i] = {}), "undefined" == typeof l._placementDictionary && (l._placementDictionary = {
                    0: {},
                    1: {}
                });
                var u = "Pocket_Placements";
                return isVersionOrHigher(n, "Profit14") && (u += "_2"), e.executeGet(u, r, t, o, "date_begin").then(function (t) {
                    var o = a(t);
                    return isVersionOrHigher(n, "Profit14") ? e.executeGet("Pocket_WageAgreement", o, -1, -1).then(function (e) {
                        return s(t, e), c(t, l)
                    }) : c(t, l)
                })
            }
        })
    }, {
        getInstance: function () {
            return new i
        }
    }
}]).factory("FlexdeclarationServiceFactory", ["ConnectorService", "EnvConfigService", "ConfigService", "UserService", "$q", function (e, t, n, o, r) {
    function a() {}

    function s(e, t, n, o, i) {
        rows = [];
        for (var a in n._reaRowsDictionary) {
            if ("1" == n._reaRowsDictionary[a].itemtype) {
                var s = Math.floor(n._reaRowsDictionary[a].amount),
                    l = parseFloat(n._reaRowsDictionary[a].amount % 1 * 60).toFixed(0),
                    u = new Date;
                u.setUTCHours(s), u.setUTCMinutes(l), n._reaRowsDictionary[a].amountDatetime = u, n._reaRowsDictionary[a].itemtype_desc = atrans("reahours", "Uren")
            } else "6" == n._reaRowsDictionary[a].itemtype && ("DI" === n._reaRowsDictionary[a].component_type || "EI" === n._reaRowsDictionary[a].component_type ? n._reaRowsDictionary[a].itemtype_desc = atrans("flexdeductions", "Inhoudingen") : n._reaRowsDictionary[a].itemtype_desc = atrans("reacosts", "Onkosten"));
            if (!o && n._reaRowsDictionary[a].year == e && n._reaRowsDictionary[a].period == t && n._reaRowsDictionary[a].placement_id == i && !n._reaRowsDictionary[a].declaration_id || o && n._reaRowsDictionary[a].declaration_id == o) {
                var d = {};
                for (var f in n._reaRowsDictionary[a]) d[f] = n._reaRowsDictionary[a][f];
                d.mayedit = c(n._reaRowsDictionary[a]), "string" == typeof d.description && !d.description.includes("%") && d.percentage && null != d.percentage ? d.descriptionwithpercentage = d.description + " (" + d.percentage + "%)" : d.descriptionwithpercentage = d.description, rows.push(d)
            }
        }
        return rows.sort(function (e, t) {
            return e.itemtype_desc < t.itemtype_desc ? 1 : e.itemtype_desc > t.itemtype_desc ? -1 : e.date < t.date ? 1 : e.date > t.date ? -1 : 0
        }), r(function (e, t) {
            e(rows)
        })
    }

    function c(e) {
        return "1" == e.itemtype ? "A" == e.auto_suggest || "LNU" == e.component_type && e.allowance_source ? !1 : !0 : "6" == e.itemtype ? !0 : void 0
    }

    function l(e, t, n, o) {
        var r = [];
        if (e) {
            for (("undefined" == typeof t._reaRowsDictionary || o) && (t._reaRowsDictionary = {}), i = 0; i < e.length; i++) t._reaRowsDictionary[e[i]._id] = e[i];
            if (e.length > 0)
                for (i = 0; i < e.length; i++) {
                    var a = !1;
                    for (j = 0; j < r.length; j++)
                        if (r[j].year == e[i].year && r[j].period == e[i].period && n == e[i].placement_id) {
                            a = !0, 1 == e[i].itemtype && (r[j].amount += e[i].amount), 6 == e[i].itemtype && ("DI" === e[i].component_type || "EI" === e[i].component_type ? (r[j].costpriceamount -= e[i].costpriceamount, r[j].wageprice -= e[i].wageprice) : (r[j].costpriceamount += e[i].costpriceamount, r[j].wageprice += e[i].wageprice));
                            break
                        } a || e[i].placement_id != n || r.push({
                        year: e[i].year,
                        period: e[i].period,
                        amount: 1 == e[i].itemtype ? e[i].amount : 0,
                        costpriceamount: 6 == e[i].itemtype ? e[i].costpriceamount : 0,
                        wageprice: 6 == e[i].itemtype ? e[i].wageprice : 0,
                        placement_id: e[i].placement_id,
                        periodtable: e[i].periodtable
                    })
                }
            for (i = 0; i < r.length; i++) r[i].durationstring = p(r[i].amount), r[i].costpriceamount = Math.round(100 * r[i].costpriceamount) / 100
        }
        return r
    }

    function u() {
        return []
    }

    function d() {
        return [{
            ctype: "5",
            defname: "project",
            dtype: "10",
            id: "project",
            name: atrans("flexproject", "Klantovereenkomst")
        }, {
            ctype: "4",
            defname: "date_booked",
            dtype: "8",
            id: "date_booked",
            name: atrans("bookingdate", "Boekingsdatum")
        }, {
            ctype: "5",
            defname: "period",
            dtype: "3",
            id: "period",
            name: atrans("period", "Periode")
        }]
    }

    function f(e) {
        var t = 0;
        return (e.date_booked || 2 == e.status) && (t = 1), 3 == e.status && (t = 2), 4 == e.status && (t = 3), "30" == e.status_payment && (t = 4), "40" == e.status_payment && (t = 5), t
    }

    function p(e) {
        var t = parseFloat(e % 1 * 60).toFixed(0),
            n = Math.floor(e) + ":" + ((10 > t ? "0" : "") + t);
        return n
    }

    function m() {
        return {
            jsonFilter: {
                Filters: {
                    Filter: [{
                        "@FilterId": "notpayed",
                        Field: [{
                            "@FieldId": "status_payment",
                            "@OperatorType": "7",
                            "#text": "40"
                        }]
                    }]
                }
            }
        }
    }
    return a.prototype.getFlexdeclarations = function (e, t, n, o, r, i, a, s) {
        return this._getFlexdeclarationsInternal(e, t, n, o, r, i, a, s)
    }, a.prototype.getSubjectIdFromDeclarationId = function (t) {
        var n = {
            dynamic: {
                fields: "flex_declaration_id",
                values: t,
                operatortypes: "1"
            }
        };
        return e.executeGet("Pocket_Tasks_Details", n, -1, -1)
    }, a.prototype.getReaRows = function (t, o, r, i, a, c) {
        var u = this;
        if (r && null != r && r > 0) {
            var d = {
                dynamic: {
                    fields: "declaration_id",
                    values: r,
                    operatortypes: "1"
                }
            };
            return e.executeGet("Pocket_Flexdeclarations_Rea", d, -1, -1, "-year,-period").then(function (t) {
                return t && 0 === t.length && c ? n.getConfig().then(function (t) {
                    return isVersionOrHigher(t, "Profit15") ? e.executeData("GetDeclarations", {
                        fields: ["Mode", "DeclarationId"],
                        values: ["2", r]
                    }).then(function (e) {
                        return l(e.rows, u, i, a), s(null, null, u, r, i)
                    }) : s(null, null, u, r, i)
                }) : (l(t, u, i, a), s(null, null, u, r, i))
            })
        }
        return a ? u.getReaDeclarations(0, i, a).then(function (e) {
            return s(t, o, u, null, i)
        }) : s(t, o, u, null, i)
    }, a.prototype.getSingleReaRow = function (e) {
        var t = this;
        return r(function (n, o) {
            n(t._reaRowsDictionary[e])
        })
    }, a.prototype.deleteSingleReaRow = function (t) {
        var n = this,
            o = t.date.replace(/:/g, ".");
        return e.executeDelete("PtRealization", "PtRealization", ["Id", "DaTi"], [t._id, o]).then(function (e) {
            return delete n._reaRowsDictionary[t._id], !0
        })
    }, a.prototype.submitDeclaration = function (t, n, r) {
        return o.getUser().then(function (o) {
            var i = {
                PtDeclaration: {
                    Element: {
                        Fields: {
                            EmId: o.employee_id,
                            Year: n,
                            PeId: r,
                            PlCo: t,
                            ApprovWorkflow: !0,
                            ReBi: !1
                        }
                    }
                }
            };
            return e.executePost("PtDeclaration", i)
        })
    }, a.prototype.getReaDeclarations = function (t, n, o) {
        var i = this;
        if (0 == t) {
            var a = {
                dynamic: {
                    fields: "declaration_id",
                    values: "",
                    operatortypes: "8"
                }
            };
            return e.executeGet("Pocket_Flexdeclarations_Rea", a, -1, -1, "-year,-period").then(function (e) {
                return l(e, i, n.placement_id, o)
            })
        }
        return r(function (e, t) {
            e([])
        })
    }, a.prototype.getFlexdeclaration = function (t, o, i) {
        var a = this;
        if ("undefined" == typeof a._flexdeclarationsDictionary || "undefined" == typeof a._flexdeclarationsDictionary[o] || null == a._flexdeclarationsDictionary[o] || null == a._flexdeclarationsDictionary[o][t]) {
            var s = {
                dynamic: {
                    fields: "_id",
                    values: t,
                    operatortypes: "1"
                }
            };
            return e.executeGet("Pocket_Flexdeclarations", s, 0, 1).then(function (o) {
                return 0 == o.length && i ? n.getConfig().then(function (n) {
                    return isVersionOrHigher(n, "Profit15") ? e.executeData("GetDeclarations", {
                        fields: ["Mode", "DeclarationId"],
                        values: ["1", t]
                    }).then(function (e) {
                        return e && e.rows ? e.rows[0] : null
                    }) : null
                }) : 0 != o.length || i ? o[0] : null
            })
        }
        return r(function (e, n) {
            e(a._flexdeclarationsDictionary[o][t])
        })
    }, a.prototype.getPeriodtable = function (t, n, o) {
        var r = {
            dynamic: {
                fields: "periodtable,year,period",
                values: t + "," + n + "," + o,
                operatortypes: "1,1,1"
            }
        };
        return e.executeGet("Pocket_Periodtable", r, 0, 1)
    }, a.prototype._getFlexdeclarationsInternal = function (t, o, r, a, s, c, l, h) {
        var g = this;
        return n.getConfig().then(function (n) {
            if (-1 != n.modules.indexOf(24)) {
                switch ("undefined" == typeof t && (t = 0), "undefined" == typeof g._flexdeclarationsDictionary && (g._flexdeclarationsDictionary = {
                    0: {},
                    1: {}
                }), 0 == t && (g._flexdeclarationsDictionary[r] = {}), r) {
                case 0:
                    var y = m();
                    if (c && l) {
                        var v = y.jsonFilter.Filters.Filter;
                        for (i = 0; i < v.length; i++)
                            if (4 == l.ctype && 8 == l.dtype) {
                                var _ = parseDateStringFuzzy(c),
                                    I = new Date(_.getFullYear(), _.getMonth(), _.getDate(), 0, 0, 0, 0),
                                    S = new Date(_.getFullYear(), _.getMonth(), _.getDate(), 23, 59, 59, 999);
                                v[i].Field.push({
                                    "@FieldId": l.id,
                                    "@OperatorType": "2",
                                    "#text": getJSONDate(I)
                                }), v[i].Field.push({
                                    "@FieldId": l.id,
                                    "@OperatorType": "3",
                                    "#text": getJSONDate(S)
                                })
                            } else v[i].Field.push({
                                "@FieldId": l.id,
                                "@OperatorType": "15",
                                "#text": toValue(l, c)
                            })
                    }
                    break;
                case 1:
                    var y = {
                        dynamic: {
                            fields: "status_payment",
                            values: "40",
                            operatortypes: "1"
                        }
                    };
                    c && l && (y.dynamic.fields += "," + l, y.dynamic.values += "," + getFilterValue(l, c), y.dynamic.operatortypes += "," + getFilterOperationType(l)), h && (y.dynamic.fields += ",placement_id", y.dynamic.values += "," + h.placement_id, y.dynamic.operatortypes += ",1")
                }
                var b = a ? a : "date_booked",
                    P = s ? s : 0,
                    w = 0 == P ? "-" + b : b;
                return e.executeGet("Pocket_Flexdeclarations", y, t, o, w).then(function (e) {
                    var n = {};
                    n.deffields = u(), n.fields = d();
                    for (var o = 0; o < e.length; o++) e[o].status = f(e[o]), e[o].durationstring = p(e[o].amount_hours), g._flexdeclarationsDictionary[r][e[o]._id] = e[o];
                    if (t > 0) {
                        e = [];
                        for (var i in g._flexdeclarationsDictionary[r]) g._flexdeclarationsDictionary[r].hasOwnProperty(i) && g._flexdeclarationsDictionary[r][i].placement_id == h.placement_id && e.push(g._flexdeclarationsDictionary[r][i]);
                        n.rows = e
                    } else n.rows = e.filter(function (e) {
                        return e.placement_id == h.placement_id
                    });
                    return n.rows.sort(function (e, t) {
                        return e[b] < t[b] ? 0 == P ? 1 : -1 : e[b] > t[b] ? 0 == P ? -1 : 1 : e.period < t.period ? 0 == P ? 1 : -1 : e.period > t.period ? 0 == P ? -1 : 1 : 0
                    }), n
                })
            }
        })
    }, {
        getInstance: function () {
            return new a
        }
    }
}]).factory("AvailabilityService", ["ConnectorService", function (e) {
    function t(t, o) {
        function r(e) {
            var t = {};
            switch (t.Type = e, e) {
            case l:
                t.Text = atrans("avail_available", "~avail~Aanwezig"), t.Color = "balanced", t.Icon = "ion-checkmark";
                break;
            case u:
                t.Text = atrans("avail_notavailable", "~avail~Afwezig"), t.Color = "assertive", t.Icon = "ion-minus";
                break;
            case d:
                t.Text = atrans("avail_leave", "~avail~Verlof"), t.Color = "positive", t.Icon = "ion-minus";
                break;
            case f:
                t.Text = atrans("avail_leaverequest", "~avail~Verlof aanvraag"), t.Color = "positive", t.Icon = "ion-minus";
                break;
            case p:
                t.Text = atrans("avail_holiday", "~avail~Feestdag"), t.Color = "positive", t.Icon = "ion-minus";
                break;
            case S:
                t.Text = atrans("avail_timecredit", "~avail~Tijdkrediet"), t.Color = "positive", t.Icon = "ion-minus";
                break;
            case m:
                t.Text = atrans("avail_illness", "~avail~Ziekte"), t.Color = "assertive", t.Icon = "ion-plus-circled";
                break;
            case h:
                t.Text = atrans("avail_illnessArbo", "~avail~Ziekte (ARBO)"), t.Color = "assertive", t.Icon = "ion-plus-circled";
                break;
            case g:
                t.Text = atrans("avail_illnessHoliday", "~avail~Ziekte (Feestdag)"), t.Color = "assertive", t.Icon = "ion-plus-circled";
                break;
            case y:
                t.Text = atrans("avail_schedule", "~avail~Rooster"), t.Color = "energized", t.Icon = "ion-minus-round";
                break;
            case v:
                t.Text = atrans("avail_scheduleAdjusted", "~avail~Rooster afwijking"), t.Color = "energized", t.Icon = "ion-minus-round";
                break;
            case _:
                t.Text = atrans("avail_scheduleAdjustedIllness", "~avail~Rooster afwijking ivm verzuim"), t.Color = "energized", t.Icon = "ion-minus-round";
                break;
            case I:
                t.Text = atrans("avail_noschedule", "~avail~Roostervrij"), t.Color = "stable", t.Icon = "ion-minus-round"
            }
            return t
        }

        function i(e) {
            return e != l && e != I && e != p
        }
        var a, s, c, l = "AN",
            u = "AF",
            d = "V",
            f = "VA",
            p = "F",
            m = "Z",
            h = "ZA",
            g = "ZF",
            y = "R",
            v = "RA",
            _ = "RAZ",
            I = "G",
            S = "K",
            b = {
                DaysSorted: [],
                Days: {},
                Departments: {},
                ImageUrls: {}
            },
            P = {},
            w = [];
        for (a = 0; a < t.length; a++) w.push(t[a].OrgUnitId);
        for (w = w.sort(), orgidskey = "ORGIDCOLL-" + w.join("-"), "undefined" == typeof b.ImageUrls[orgidskey] && (b.ImageUrls[orgidskey] = 1), a = 0; a < t.length; a++) {
            "undefined" == typeof b.Departments[t[a].OrgUnitId] && (b.Departments[t[a].OrgUnitId] = {
                Name: t[a].OrgUnitDescription,
                Employees: {},
                EmployeesSorted: []
            }), "undefined" == typeof b.Days[t[a].Date] && (b.Days[t[a].Date] = {
                empdeptable: {},
                DepartmentPercentage: {}
            }, b.DaysSorted.push(t[a].Date)), c = b.Days[t[a].Date], t[a].EmployeeImageId && "undefined" == typeof n[t[a].EmployeeImageId] && (n[t[a].EmployeeImageId] = 1, e.getImageData(t[a].EmployeeImageId, 1).then(function (e) {
                b.ImageUrls[e.key] = e.url, delete n[e.key]
            }));
            var k = t[a].EmployeeId + ";" + t[a].DVBSeqNo;
            if ("undefined" == typeof b.Departments[t[a].OrgUnitId].Employees[k] && (b.Departments[t[a].OrgUnitId].Employees[k] = 1, b.Departments[t[a].OrgUnitId].EmployeesSorted.push({
                    EmployeeKey: k,
                    Name: t[a].EmployeeName
                })), "undefined" == typeof c.empdeptable[t[a].OrgUnitId] && (c.empdeptable[t[a].OrgUnitId] = {}), s = r(t[a].LineType), t[a].Hours > 0 && (s.Hours = Math.floor(10 * t[a].Hours) / 10), "undefined" == typeof c.empdeptable[t[a].OrgUnitId][k] && (c.empdeptable[t[a].OrgUnitId][k] = {
                    Name: t[a].EmployeeName,
                    EmployeeId: t[a].EmployeeId,
                    DVBSeqNo: t[a].DVBSeqNo,
                    ImageId: t[a].EmployeeImageId,
                    NoSchedule: t[a].LineType == I,
                    TotalHoursAvailable: 0,
                    TotalHoursNotAvailable: 0,
                    Types: [],
                    ContainsOnlyNonCombinable: !0
                }), t[a].LineType == l || t[a].LineType == y ? c.empdeptable[t[a].OrgUnitId][k].TotalHoursAvailable += t[a].Hours : c.empdeptable[t[a].OrgUnitId][k].TotalHoursNotAvailable += t[a].Hours, 0 == c.empdeptable[t[a].OrgUnitId][k].Types.length) c.empdeptable[t[a].OrgUnitId][k].Blocks = [s];
            else if (i(t[a].LineType))
                if (c.empdeptable[t[a].OrgUnitId][k].Types.length > 0 && c.empdeptable[t[a].OrgUnitId][k].ContainsOnlyNonCombinable) c.empdeptable[t[a].OrgUnitId][k].Types = [], c.empdeptable[t[a].OrgUnitId][k].Blocks = [s];
                else if ("1" != o && "7" != o && t[a].LineType == u) c.empdeptable[t[a].OrgUnitId][k].TotalHoursNotAvailable > 0 && (s = c.empdeptable[t[a].OrgUnitId][k].Blocks[0], s.Hours = Math.floor(c.empdeptable[t[a].OrgUnitId][k].TotalHoursNotAvailable));
            else {
                for (var D = !0, j = 0; j < c.empdeptable[t[a].OrgUnitId][k].Types.length; j++) D &= c.empdeptable[t[a].OrgUnitId][k].Types[j] == t[a].LineType;
                D ? (c.empdeptable[t[a].OrgUnitId][k].Types = [], c.empdeptable[t[a].OrgUnitId][k].TotalHoursNotAvailable > 0 && (c.empdeptable[t[a].OrgUnitId][k].Blocks[0].Hours = Math.floor(c.empdeptable[t[a].OrgUnitId][k].TotalHoursNotAvailable))) : c.empdeptable[t[a].OrgUnitId][k].Blocks.push(s)
            } else c.empdeptable[t[a].OrgUnitId][k].ContainsOnlyNonCombinable && c.empdeptable[t[a].OrgUnitId][k].TotalHoursAvailable > 0 && (c.empdeptable[t[a].OrgUnitId][k].Blocks[0].Hours = Math.floor(c.empdeptable[t[a].OrgUnitId][k].TotalHoursAvailable));
            i(t[a].LineType) ? (c.empdeptable[t[a].OrgUnitId][k].Types.push(t[a].LineType), c.empdeptable[t[a].OrgUnitId][k].ContainsOnlyNonCombinable = !1) : c.empdeptable[t[a].OrgUnitId][k].ContainsOnlyNonCombinable && c.empdeptable[t[a].OrgUnitId][k].Types.push(t[a].LineType), "undefined" == typeof P[t[a].EmployeeId] && (P[t[a].EmployeeId] = {}), P[t[a].EmployeeId][t[a].EmployeeId.DVBSeqNo] = 1
        }
        b.DaysSorted = b.DaysSorted.sort();
        for (var F in b.Departments) b.Departments[F].EmployeesSorted = b.Departments[F].EmployeesSorted.sort(function (e, t) {
            return e.Name > t.Name
        });
        for (a = 0; a < b.DaysSorted.length; a++) {
            var E = {},
                O = {},
                C = {};
            c = b.Days[b.DaysSorted[a]];
            for (var x in c.empdeptable) {
                for (var T in c.empdeptable[x]) "undefined" == typeof E[x] && (E[x] = 0), "undefined" == typeof O[x] && (O[x] = 0), "undefined" == typeof C[x] && (C[x] = 0), E[x] += c.empdeptable[x][T].TotalHoursAvailable, O[x] += c.empdeptable[x][T].TotalHoursNotAvailable, c.empdeptable[x][T].TotalHoursAvailable > 0 && c.empdeptable[x][T].TotalHoursAvailable < 7 && 0 == c.empdeptable[x][T].TotalHoursNotAvailable && (O[x] += 8 - c.empdeptable[x][T].TotalHoursAvailable, E[x] += 8 - c.empdeptable[x][T].TotalHoursAvailable), c.empdeptable[x][T].NoSchedule && (c.empdeptable[x][T].TotalHoursNotAvailable > 0 && (O[x] -= c.empdeptable[x][T].TotalHoursNotAvailable), 0 == c.empdeptable[x][T].TotalHoursAvailable && C[x]++);
                if ("undefined" != typeof E[x] && E[x] > 0) {
                    var R = "undefined" != typeof O[x] ? O[x] : 0,
                        L = "undefined" != typeof C[x] ? C[x] : 0,
                        U = 0;
                    for (var A in c.empdeptable[x]) U++;
                    var M = E[x] / (U - L);
                    c.DepartmentPercentage[x] = Math.floor(Math.max(0, 100 * (E[x] - R) / (E[x] + L * M)))
                }
            }
        }
        return b
    }
    var n = {};
    return {
        getAvailabilityCalendar: function (n, o, r) {
            return e.executeData("GetAvailability", {
                fields: ["Mode", "DateBegin", "DateEnd", "EmployeeId"],
                values: ["3", getJSONDate(n, !0), getJSONDate(o, !0), r]
            }).then(function (e) {
                if ("undefined" == typeof e.rows) throw new SkippedException;
                return t(e.rows, 3)
            })
        },
        getAvailability: function (n, o, r, i) {
            return e.executeData("GetAvailability", {
                fields: ["Mode", "DateBegin", "DateEnd"],
                values: [n, getJSONDate(o, !0), getJSONDate(r, !0)]
            }).then(function (e) {
                if ("undefined" == typeof e && "undefined" == typeof e.rows) throw new SkippedException;
                return t(e.rows, n)
            })
        }
    }
}]).factory("SalaryServiceFactory", ["ConnectorService", "DocumentSessionService", function (e, t) {
    function n() {}
    return n.prototype.getPayslips = function () {
        return e.executeGet("Pocket_Payslips", {}, -1, -1, "-date")
    }, n.prototype.getProforma = function () {
        var n = {
            fields: ["dummy"],
            values: [""]
        };
        return e.executeData("PocketProforma", n, function () {
            return t.getSession()
        })
    }, {
        getInstance: function () {
            return new n
        }
    }
}]).factory("ReservationServiceFactory", ["ConnectorService", function (e) {
    function t() {}
    return t.prototype.getReservations = function () {
        function t(e) {
            var t = parseFloat(e % 1 * 60).toFixed(0),
                n = Math.floor(e) + ":" + ((10 > t ? "0" : "") + t);
            return n
        }
        return e.executeGet("Pocket_Reservations", {}, -1, -1).then(function (e) {
            for (var n = 0; n < e.length; n++) e[n].placement_id && (e[n].placement_description = (e[n].func_title ? e[n].func_title : e[n].func_title_default) + " (" + e[n].organisation + ")"), !e[n].hours && e[n].amount > 0 && e[n].hourlywage > 0 ? e[n].hours = e[n].amount / e[n].hourlywage : "9" === e[n].type_id && (e[n].hours = e[n].amount / e[n].hourlywage_reservation), e[n].hours ? e[n].durationstring = t(e[n].hours) : (e[n].hours = 0, e[n].durationstring = "0:00");
            return e.sort(function (e, t) {
                return e.placement_id < t.placement_id ? -1 : e.placement_id > t.placement_id ? 1 : e.employee_id < t.employee_id ? -1 : e.employee_id > t.employee_id ? 1 : 0
            })
        })
    }, {
        getInstance: function () {
            return new t
        }
    }
}]).service("SiteSearchService", ["ConnectorService", "DocumentSessionService", "$timeout", function (e, t, n) {
    return {
        search: function (n, o, r) {
            var i = {
                fields: ["Query"],
                values: [n]
            };
            return "undefined" != typeof o && (i.fields.push("MaxRows"), i.values.push(o)), e.executeData("PocketSearch", i, function () {
                return t.getSession()
            }, r).then(function (e) {
                if ("undefined" == typeof e.rows || 0 == e.rows.length) throw new SkippedException;
                return e.rows
            })
        }
    }
}]).factory("AgendaServiceFactory", ["ConfigService", "ConnectorService", "maxListTake", "DocumentSessionService", "UserService", "$filter", "$interpolate", "$q", "$sce", "$compile", function (e, t, n, o, r, i, a, s, c, l) {
    function u() {}
    return u.prototype.getAppointments = function (n, o) {
        return e.getConfig().then(function (e) {
            return r.getUser().then(function (r) {
                var i = {
                    dynamic: {
                        fields: "start_datetime,end_datetime,user_id",
                        values: getJSONDate(n) + "," + getJSONDate(o) + "," + r.user,
                        operatortypes: "2,3,1"
                    }
                };
                return t.executeGet("Pocket_Appointments_Attendees", i, -1, -1, "start_datetime").then(function (t) {
                    for (var n = [], o = 0; o < t.length; o++) {
                        switch (t[o].color = {
                            backgroundColor: "#" + parseInt(t[o].color_code).toString(16)
                        }, t[o].status_code) {
                        case 3:
                            t[o].icons = "ion-checkmark balanced";
                            break;
                        case 1:
                            t[o].icons = "ion-close assertive";
                            break;
                        case 2:
                            t[o].icons = "ion-close assertive";
                            break;
                        case 0:
                            t[o].icons = "ion-clock energized"
                        }
                        isVersionOrHigher(e, "Profit9") && "0" != t[o].personal_status && "3" != t[o].personal_status || n.push(t[o])
                    }
                    return n
                })
            })
        })
    }, u.prototype.getAttendees = function (e) {
        var n = {
            "static": {
                fields: "appointment_id",
                values: e
            }
        };
        return t.executeGet("Pocket_Appointments_Attendees", n)
    }, {
        getInstance: function () {
            return new u
        }
    }
}]).factory("DocumentsServiceFactory", ["ConfigService", "ConnectorService", "maxListTake", "DocumentSessionService", "UserService", "LocalStorageService", "$filter", "$interpolate", "$q", "$sce", "$compile", function (e, t, n, o, r, i, a, s, c, l, u) {
    function d() {}
    return d.prototype.getDocuments = function (e, t, n, o) {
        return this._getDocumentsInternal(null, t, n, e, o)
    }, d.prototype.getDocument = function (e, t) {
        var n = this;
        return "undefined" == typeof n._documentsDictionary || null == n._documentsDictionary || null == n._documentsDictionary[t] || null == n._documentsDictionary[t][e] ? n._getDocumentsInternal(e, 0, 1, t).then(function (e) {
            if (0 == e.length) throw new SkippedException;
            return e[0]
        }) : c(function (o, r) {
            o(n._documentsDictionary[t][e])
        })
    }, d.prototype.getDocumentActions = function (e) {
        return t.executeData("PocketDocuments", {
            fields: ["Mode", "DocId"],
            values: [6, e]
        }, function () {
            return o.getSession()
        })
    }, d.prototype.getDocumentReactions = function (e, n, r) {
        return t.executeData("PocketDocuments", {
            fields: ["Mode", "DocPageId", "Skip", "Take"],
            values: [9, e, n, r]
        }, function () {
            return o.getSession()
        }).then(function (e) {
            for (var n = {}, o = 0; o < e.rows.length; o++) n[e.rows[o].PersonImageId] || (n[e.rows[o].PersonImageId] = !0, t.getImageData(e.rows[o].PersonImageId, 1).then(function (t) {
                for (var n = 0; n < e.rows.length; n++) e.rows[n].PersonImageId == t.key && (e.rows[n].PersonImageUrl = t.url)
            }));
            return e.rows
        })
    }, d.prototype.deleteDocumentReaction = function (e, n) {
        return t.executeData("PocketDocuments", {
            fields: [, "DocId", "DocReactionId"],
            values: [11, e, n]
        }, function () {
            return o.getSession()
        })
    }, d.prototype.addDocumentReaction = function (e, n, r) {
        function i() {
            void 0 == r.reactionText && (r.reactionText = "");
            var n = {
                fields: ["Mode", "DocPageId", "Text"],
                values: ["10", e, r.reactionText]
            };
            return r.fileId && (n.fields.push("FileId"), n.values.push(r.fileId)), t.executeData("PocketDocuments", n, function () {
                return o.getSession()
            })
        }
        return n && n.files && n.files.length > 0 ? t.uploadFile("PocketAppAddReaction", n).then(function (e) {
            return r.fileId = e.fileids[0], i()
        }) : r.fileURI ? t.uploadFileByUrl("PocketAppAddReaction", r.fileURI).then(function (e) {
            return r.fileId = e.fileids[0], i()
        }) : i()
    }, d.prototype.executeDocumentAction = function (e, n) {
        return t.executeData("PocketDocuments", {
            fields: ["Mode", "DocId", "ActionId"],
            values: [7, e, n]
        }, function () {
            return o.getSession()
        })
    }, d.prototype.getFullDocument = function (n, c) {
        return t.executeDoc(n, function () {
            return o.getSession()
        }).then(function (l) {
            function d(e, t) {
                for (var n = 0; n < e.videos.length; n++) {
                    var o = e.videos[n];
                    t.videoClasses[o.id] = "picturepart", "right" == o.floating ? t.videoClasses[o.id] += " partfloatright" : "left" == o.floating ? t.videoClasses[o.id] += " partfloatleft" : t.videoClasses[o.id] += " afasclear", "center" == o.horizontalalign ? t.videoClasses[o.id] += " afascenter" : "left" == o.horizontalalign ? t.videoClasses[o.id] += " afasleft" : t.videoClasses[o.id] += " afasright";
                    var r = "//youtube.com/watch?v=" + e.videos[n].youtubeId;
                    t.videoHtml[o.id] = '<a class="videolink" style="cursor: pointer" data-url="' + r + '" onclick="openUrlGlobal()"><i class="icon ion-social-youtube-outline"></i><img src="https://img.youtube.com/vi/' + e.videos[n].youtubeId + '/0.jpg"/></a>'
                }
            }

            function f(e, t) {
                if (e.buttons)
                    for (var n = 0; n < e.buttons.length; n++) {
                        var o = e.buttons[n];
                        t.buttonClasses[o.id] = "picturepart", "right" == o.floating ? t.buttonClasses[o.id] += " partfloatright" : "left" == o.floating ? t.buttonClasses[o.id] += " partfloatleft" : t.buttonClasses[o.id] += " afasclear", "center" == o.horizontalalign ? t.buttonClasses[o.id] += " afascenter" : "left" == o.horizontalalign ? t.buttonClasses[o.id] += " afasleft" : t.buttonClasses[o.id] += " afasright";
                        var r = "";
                        o.url && (r = s(o.url)(t)), t.buttonHtml[o.id] = '<button class="button" data-url="' + r + '" onclick="openUrlGlobal()">' + o.buttonLabel + "</button>"
                    }
            }

            function p(e, n) {
                n.imageLinkUrls = {};
                var r, i, a = e.images.length;
                if (a > 0) {
                    for (r = 0; a > r; r++) {
                        i = e.images[r], i.url ? n.imageLinkUrls[i.id] = s(i.url)(n) : n.imageLinkUrls[i.id] = "", n.pictureClasses[i.id] = "picturepart", "right" == i.floating ? n.pictureClasses[i.id] += " partfloatright" : "left" == i.floating ? n.pictureClasses[i.id] += " partfloatleft" : n.pictureClasses[i.id] += " afasclear", "center" == i.horizontalalign ? n.pictureClasses[i.id] += " afascenter" : "left" == i.horizontalalign ? n.pictureClasses[i.id] += " afasleft" : n.pictureClasses[i.id] += " afasright";
                        var c = 50,
                            l = parseInt(i.width),
                            d = parseInt(i.height);
                        0 != l && (c = 100 * d / l), n.pictureHtml[i.id] = u('<div><div style="display: inline-block; max-width: 100%;"><div class="picturepartloading" style="padding-bottom:' + c + "%;width:" + i.width + 'px"><div class="imagespinner"><ion-spinner></ion-spinner></div></div></div></div>')(n).html()
                    }
                    for (r = 0; r < e.images.length; r++) i = e.images[r], t.getImageData(i.id, 2, function () {
                        return o.getSession()
                    }).then(function (e) {
                        if (n.pictureHtml[e.key] = '<img data-url="' + e.url + '" onclick="")" src="' + e.url + '" />', 0 == --a) {
                            var t = s(n.rawhtml)(n);
                            n.doc && (n.doc.html = t)
                        }
                    })
                }
            }

            function m(e, t) {
                t.antaFieldFullName = e.name + " ", t.antaFieldFirstName = e.first_name + " ", t.antaFieldCallingName = e.nickname + " ", t.antaFieldLastName = e.last_name + " ", t.antaFieldPrefixShort = ("M" == e.gender ? atrans("prefixmister", "dhr.") : atrans("prefixmiss", "mw.")) + " ", t.antaFieldPrefixLong = ("M" == e.gender ? atrans("prefixmisterl", "heer") : atrans("prefixmissl", "mevrouw")) + " ", t.antaFieldOrganizationName = e.employer + " ";
                var n = new Date,
                    o = n.getDate() + " " + getMonthString(n.getMonth());
                "en-us" == window.currentLanguage && (o = getMonthString(n.getMonth()) + " " + n.getDate()), t.antaFieldCurrentDateFull = getDayString((n.getDay() + 6) % 7) + " " + o + " " + n.getFullYear() + " ", o = n.getDate() + "-" + (n.getMonth() + 1), "en-us" == window.currentLanguage && (o = n.getMonth() + 1 + "-" + n.getDate()), t.antaFieldCurrentDateShort = o + "-" + n.getFullYear() + " ", t.antaFieldCurrentDateDay = n.getDate() + " ", t.antaFieldCurrentDateWeekDay = getDayString((n.getDay() + 6) % 7) + " ", t.antaFieldCurrentDateMonth = getMonthString(n.getMonth()) + " ", t.antaFieldCurrentDateMonthAbbrev = getMonthString(n.getMonth()).substr(0, 3) + ". ", t.antaFieldCurrentDateYear = getMonthString(n.getFullYear()) + " ", t.antaFieldCurrentTime = a("date")(n, "mediumTime") + " ", n.getHours() >= 6 && n.getHours() < 12 ? t.antaFieldBeginning = atrans("goodmorning", "Goedemorgen") + " " : n.getHours() >= 12 && n.getHours() < 18 ? t.antaFieldBeginning = atrans("goodday", "Goedemiddag") + " " : n.getHours() >= 18 && n.getHours() < 24 ? t.antaFieldBeginning = atrans("goodafternoon", "Goedenavond") + " " : t.antaFieldBeginning = atrans("goodnight", "Goedenacht") + " "
            }

            function h(e, n) {
                var r, i, a, c = {},
                    l = {},
                    d = {},
                    f = {},
                    p = {};
                for (r = 0; r < e.banners.length; r++) {
                    a = e.banners[r], n.bannerClasses[a.id] = "bannerpart", "right" == a.floating ? n.bannerClasses[a.id] += " partfloatright" : "left" == a.floating ? n.bannerClasses[a.id] += " partfloatleft" : n.bannerClasses[a.id] += " afasclear", "center" == a.horizontalalign ? n.bannerClasses[a.id] += " afascenter" : "left" == a.horizontalalign ? n.bannerClasses[a.id] += " afasleft" : n.bannerClasses[a.id] += " afasright";
                    var m = 50,
                        h = parseInt(a.width.replace("px", "")),
                        g = parseInt(a.height.replace("px", ""));
                    switch (0 != h && (m = 100 * g / h), n.bannerHtml[a.id] = u('<div><div style="display: inline-block; max-width: 100%;"><div class="bannerpartloading" style="padding-bottom:' + m + "%;width:" + a.width + '"><div class="imagespinner"><ion-spinner></ion-spinner></div></div></div></div>')(n).html(), a.source) {
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "8":
                        for (n.bannerHtml[a.id] = "", i = 0; i < a.Items.length; i++) {
                            var y = s(a.Items[i].Url)(n);
                            n.bannerHtml[a.id] += '<button class="button button-positive" data-url="' + y + '" onclick="openUrlGlobal()">' + a.Items[i].Text + "</button>"
                        }
                        break;
                    case "5":
                    case "6":
                    case "7":
                    case "9":
                        for (l[a.id] = {}, p[a.id] = {}, c[a.id] = {}, d[a.id] = a.Items, i = 0; i < a.Items.length; i++) c[a.id][a.Items[i].Image] = s(a.Items[i].Url)(n);
                        p[a.id] = a.height, f[a.id] = a.Items.length
                    }
                }
                for (r = 0; r < e.banners.length; r++)
                    for (a = e.banners[r], i = 0; i < a.Items.length; i++) {
                        var v = a.Items[i];
                        9 == a.source && t.getImageData(v.Image, 2, function () {
                            return o.getSession()
                        }, {
                            bannerId: a.id
                        }).then(function (e) {
                            if (l[e.state.bannerId][e.key] = '<img style="height:' + p[e.state.bannerId] + ';" class="bannerItemImage" ng-click="openUrlGlobal(\'' + c[e.state.bannerId][e.key] + '\')" src="' + e.url + '" />', 0 == --f[e.state.bannerId]) {
                                var t = d[e.state.bannerId];
                                n.bannerHtml[e.state.bannerId] = "";
                                for (var o = 0; o < t.length; o++) n.bannerHtml[e.state.bannerId] += l[e.state.bannerId][t[o].Image];
                                var r = s(n.rawhtml)(n);
                                n.doc && (n.doc.html = r)
                            }
                        })
                    }
            }
            r.getUser().then(function (t) {
                c.pictureHtml = {}, c.pictureClasses = {}, c.videoHtml = {}, c.videoClasses = {}, l.session && (c.mainInsite = l.session.maininsite), c.buttonHtml = {}, c.buttonClasses = {}, c.bannerHtml = {}, c.bannerClasses = {}, "undefined" == typeof c.doc && (c.doc = {}), c.rawhtml = l.html + '<div style="clear:both"></div>', p(l, c), d(l, c), f(l, c), h(l, c), m(t, c);
                var o = s(c.rawhtml)(c);
                c.doc.html = o, c.doc.Intro = l.Intro, c.doc.SubTitle = l.SubTitle, c.doc.Source = l.Source, c.doc.hasNoReactions = l.HasNoReactions, c.doc.AttachmentGuid = l.AttachmentGuid, c.doc.AttachmentFilename = l.AttachmentFilename, c.doc.descriptionmailto = atrans("document", "Document") + " ", c.doc.descriptionmailto += ": " + encodeURIComponent(l.Title), i.getItem("loginkey").then(function (e) {
                    var t = "https://www.afaspocket.nl/document/" + n + "?" + e;
                    c.doc.bodymailto = encodeURIComponent(atrans("openlinkdoc", "Open dit document door op de volgende link te klikken:") + "\r\n\r\n" + t + "\r\n\r\n" + atrans("noaccountemail", "Nog geen Afas Pocket account? Meld je dan aan met je profit gebruikersnaam en omgevingsleutel {0}.", e.toUpperCase())), c.doc.qrurl = t
                }), e.getConfig().then(function (e) {
                    var t = inlineDocType(l.AttachmentFilename);
                    null != t && (c.doc.showInlineContent = !0)
                }), c.doc.Description = l.Title, isNotEmpty(l.PubDate) && (c.doc.PublicationDate = parseDateString2(l.PubDate))
            })
        })
    }, d.prototype.getDocumentBySubjectId = function (e) {
        return t.executeData("PocketDocuments", {
            fields: ["Mode", "SubjectId"],
            values: [8, e]
        }).then(function (e) {
            return e.documentId
        })
    }, d.prototype._getDocumentsInternal = function (e, r, i, a, s) {
        var c = this;
        "undefined" == typeof r ? r = 0 : 0 == r && ("undefined" == typeof c._documentsDictionary && (c._documentsDictionary = {
            0: {},
            1: {}
        }), c._documentsDictionary[a] = {}), "undefined" == typeof i && (i = n), "undefined" == typeof c._documentsDictionary && (c._documentsDictionary = {
            0: {},
            1: {}
        });
        var l = {
            fields: ["Mode", "Skip", "Take", "PersonalList"],
            values: [3, r, i, "undefined" != typeof a ? a : 0]
        };
        return null != e && (l.fields.push("DocId"), l.values.push(e)), "undefined" != typeof s && (l.fields.push("SearchQuery"), l.values.push(s)), t.executeData("PocketDocuments", l, function () {
            return o.getSession()
        }).then(function (e) {
            var n = {};
            if (e) {
                var i = e.rows;
                if (null != i) {
                    for (var s = 0; s < i.length; s++) c._documentsDictionary[a][i[s].Id] = i[s], i[s].PublicationDate = parseDateString(i[s].PubDate), "undefined" != typeof i[s].ImageId && null != i[s].ImageId && (n[i[s].ImageId] || (n[i[s].ImageId] = !0, t.getImageData(i[s].ImageId, 2, function () {
                        return o.getSession()
                    }).then(function (e) {
                        for (var t = 0; t < i.length; t++) i[t].ImageId == e.key && (i[t].ImageUrl = e.url)
                    })));
                    if (r > 0) {
                        i = [];
                        for (var l in c._documentsDictionary[a]) c._documentsDictionary[a].hasOwnProperty(l) && i.push(c._documentsDictionary[a][l]);
                        return i
                    }
                    return i
                }
                return new SkippedException
            }
            return new SkippedException
        })
    }, {
        getInstance: function () {
            return new d
        }
    }
}]).service("PictureService", ["$q", "$rootScope", function (e, t) {
    return {
        getPicture: function (t) {
            function n() {
                navigator.camera ? navigator.camera.getPicture(function (e) {
                    o.resolve(e)
                }, function (e) {
                    log(e), o.reject(e)
                }, r) : o.reject("no camera")
            }
            var o = e.defer(),
                r = {
                    quality: 90,
                    destinationType: "undefined" != typeof Camera ? Camera.DestinationType.FILE_URI : "file://",
                    sourceType: t,
                    encodingType: 0,
                    correctOrientation: 1,
                    saveToPhotoAlbum: 0,
                    targetWidth: 1280,
                    targetHeight: 1280
                };
            if (checkPlugin("permissions")) {
                var i = cordova.plugins.permissions;
                i && i.hasPermission([i.CAMERA, i.WRITE_EXTERNAL_STORAGE], function (e) {
                    e.hasPermission ? n() : i.requestPermission(i.WRITE_EXTERNAL_STORAGE, function (e) {
                        e.hasPermission ? i.requestPermission(i.CAMERA, function (e) {
                            e.hasPermission ? n() : o.reject("no camera")
                        }, function () {
                            o.reject("no camera")
                        }) : o.reject("no camera")
                    }, function () {
                        o.reject("no camera")
                    })
                })
            }
            return o.promise
        }
    }
}]).service("ModalFilterService", ["$ionicModal", "$rootScope", function (e, t) {
    this.openModal = function (n, o, r, i, a) {
        e.fromTemplateUrl("modules/app/modalfilter.html", {
            scope: n,
            animation: "slide-in-up"
        }).then(function (e) {
            e.showType = 0, e.titleSearch = atrans("searchon", "Zoeken op"), e.titleSort = atrans("sortby", "Sorteren op"), e.fields = o, e.sortDir = r, e.searchList = i, e.sortList = a, e.show(), "undefined" != typeof n.modal && (n.modal.remove(), delete n.modal), n.modal = e, t.currentModal = e
        })
    }
}]).service("ModalSearchService", ["$ionicModal", "$rootScope", "$ionicTabsDelegate", "$ionicScrollDelegate", "$timeout", "SearchService", "UserService", "maxListTake", "TimesheetServiceFactory", "ContactServiceFactory", "EmployeeServiceFactory", function (e, t, n, o, r, i, a, s, c, l, u) {
    var d, f = c.getInstance(),
        p = l.getInstance(),
        m = u.getInstance(),
        h = this;
    this.openModal = function (o, a, s, c) {
        function l(e) {
            d = 0, e.showType = 0, e.type = a, e.titleRecent = atrans("recent", "Recent"), e.titleAll = atrans("all", "Alles"), e.hasSearchBar = !0, e.hasTabs = !0, e.show && e.show(), e.query = "", "undefined" != typeof o.modal && (o.modal.remove && o.modal.remove(), delete o.modal), e.loading = !0, o.modal = e, e.show && (t.currentModal = e), h.loadMore(o, s), hideKeyboard();
            var c;
            switch (a) {
            case "Pocket_DeclProfiles":
                e.title = atrans("choosedeclprofvalue", "Selecteer een declaratie soort"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_decl_profiles";
                break;
            case "Pocket_MutProfiles":
                e.title = atrans("choosemutprofvalue", "Selecteer een mutatie sort"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_mut_profiles";
                break;
            case "Pocket_LeaveProfiles":
                e.title = atrans("chooseleaveprofvalue", "Selecteer een verlof soort"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_leave_profiles";
                break;
            case "Pocket_ProjectStatus":
                e.title = atrans("chooseprojectstatus", "Selecteer een status"), e.searchPlaceholder = atrans("searchdescription", "Zoek op omschrijving"), c = "recent_projectstatus";
                break;
            case "Pocket_LeaveWithdrawProfiles":
                e.title = atrans("chooseleavedelprofvalue", "Selecteer een intrekkingsprofiel"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_leavewithdraw_profiles";
                break;
            case "Pocket_ProjectProfiles":
                e.title = atrans("chooseprojectprofvalue", "Selecteer een project soort"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_project_profiles";
                break;
            case "Pocket_ProjectFields":
                e.title = atrans("choosevalue", "Selecteer een waarde"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_proj_" + s.info.type + "_" + s.fieldId;
                break;
            case "Pocket_SubjectFields":
                e.title = atrans("choosevalue", "Selecteer een waarde"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_subj_" + s.info.type + "_" + s.fieldId;
                break;
            case "Pocket_MutationFields":
                e.title = atrans("choosevalue", "Selecteer een waarde"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_mut_" + s.info.type + "_" + s.fieldId;
                break;
            case "Pocket_TimesheetFields":
                e.title = atrans("choosevalue", "Selecteer een waarde"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_timesheet_" + s.info.Id + "_" + s.fieldId + "_" + ("PcId" != s.fieldId && o.form && o.form.PcId ? "_" + o.form.PcId.id : "");
                break;
            case "Pocket_IllnessFields":
                e.title = atrans("choosevalue", "Selecteer een waarde"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_illness_" + s.fieldId;
                break;
            case "Pocket_DeclarationFields":
                e.title = atrans("choosevalue", "Selecteer een waarde"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_decl_" + s.fieldId;
                break;
            case "Pocket_LeaveFields":
                e.title = atrans("choosevalue", "Selecteer een waarde"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_leave_" + s.fieldId;
                break;
            case "Pocket_ExpenseTypes":
                e.title = atrans("choosetype", "Selecteer een type"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_declaration_types";
                break;
            case "Pocket_Projects":
                e.title = atrans("chooseproject", "Selecteer een project"), e.searchPlaceholder = atrans("searchProjectCode", "Zoek op code, omschrijving of contact"), c = "recent_projects" + (o.sel ? o.sel.type : "") + (o.form && o.form.PcId ? "_" + o.form.PcId.id : "");
                break;
            case "Pocket_NewReceiptFields":
                e.title = atrans("choosevalue", "Selecteer een waarde"), e.searchPlaceholder = atrans("searchNewReceiptCode", "Zoek op code, omschrijving of contact"), c = "recent_newreceipts_" + s.form.PrId_entry + "_" + s.fieldId;
                break;
            case "Pocket_Activities":
                e.title = atrans("chooseactivity", "Selecteer een werksoort"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_activities" + (o.sel ? o.sel.type : "") + (o.form && o.form.PcId ? "_" + o.form.PcId.id : "");
                break;
            case "Pocket_ItemTypes":
                e.title = atrans("chooseitemtype", "Selecteer een urensoort"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving"), c = "recent_itemtypes";
                break;
            case "Pocket_Users":
                e.title = atrans("chooseuser", "Selecteer een gebruiker"), e.searchPlaceholder = atrans("searchNameOrCode", "Zoek op naam of gebruikerscode"), c = "recent_users";
                break;
            case "Pocket_Other_Employees":
                e.title = atrans("choosereplacement", "Selecteer een vervanger"), e.searchPlaceholder = atrans("searchNameOrCode", "Zoek op naam of gebruikerscode"), c = "recent_employees";
                break;
            case "Pocket_Manager_Employees":
                e.title = atrans("chooseemployee", "Selecteer een medewerker"), e.searchPlaceholder = atrans("searchNameOrCode", "Zoek op naam of gebruikerscode"), c = "recent_employees_manager";
                break;
            case "Pocket_SendTo_Other_Employees":
                e.title = atrans("choosereceiver", "Selecteer een ontvanger"), e.searchPlaceholder = atrans("searchNameOrCode", "Zoek op naam of gebruikerscode"), c = "recent_employees";
                break;
            case "Pocket_Project_Stages":
                e.title = atrans("chooseprojectstage", "Selecteer een projectfase"), e.searchPlaceholder = atrans("searchCodeOrDescription", "Zoek op code of omschrijving")
            }
            "Pocket_Project_Stages" === a ? (e.showType = 1, e.hasTabs = !1, e.hasSearchBar = !1) : i.getRecentlySelected(c).then(function (t) {
                e.recentItems = t, e.recentItems || (e.showType = 1, r(function () {
                    n.$getByHandle("modalSearchTabs").select(1)
                }, 200))
            })
        }
        if (this.extraParam = s, c) {
            var u = {
                wizard: !0
            };
            l(u)
        } else e.fromTemplateUrl("modules/app/modalsearch.html", {
            scope: o,
            animation: "slide-in-up"
        }).then(function (e) {
            l(e)
        })
    }, this.search = function (e, n, o) {
        e.showmore = !1, e.loaded = 0, hideKeyboard(), h.HideRecentSearches(e), "Pocket_SubjectFields" == e.modal.type && (i.setSearchHistory(n, "SubjectFields_" + o.fieldId), o.onlyId = !1, o.SubjectService.searchForField(o, n, 0, s).then(function (n) {
            n.fields && handleSearchFields(t, n, o, e), e.modal.items = n.rows, e.modal.noresults = 0 == e.modal.items.length, e.showmore = e.modal.items.length >= s
        })), "Pocket_ProjectFields" == e.modal.type && (i.setSearchHistory(n, "ProjectFields_" + o.fieldId), o.onlyId = !1, o.ProjectService.searchForField(o, n, 0, s).then(function (n) {
            n.fields && handleSearchFields(t, n, o, e), e.modal.items = n.rows, e.modal.noresults = 0 == e.modal.items.length, e.showmore = e.modal.items.length >= s
        })), "Pocket_MutationFields" == e.modal.type && (i.setSearchHistory(n, "MutationFields_" + o.fieldId), o.onlyId = !1, o.EmployeeService.searchForField(o, n, 0, s).then(function (n) {
            n.fields && handleSearchFields(t, n, o, e), e.modal.items = n.rows, e.modal.noresults = 0 == e.modal.items.length, e.showmore = e.modal.items.length >= s
        })), "Pocket_TimesheetFields" == e.modal.type && (i.setSearchHistory(n, "TimesheetFields_" + o.fieldId), o.onlyId = !1, o.TimesheetService.searchForField(o, n, 0, s).then(function (n) {
            n.fields && handleSearchFields(t, n, o, e), e.modal.items = n.rows, e.modal.noresults = 0 == e.modal.items.length, e.showmore = e.modal.items.length >= s
        })), "Pocket_IllnessFields" == e.modal.type && (i.setSearchHistory(n, "IllnessFields_" + o.fieldId), o.onlyId = !1, o.IllnessService.searchForField(o, n, 0, s).then(function (n) {
            n.fields && handleSearchFields(t, n, o, e), e.modal.items = n.rows, e.modal.noresults = 0 == e.modal.items.length, e.showmore = e.modal.items.length >= s
        })), "Pocket_DeclarationFields" == e.modal.type && (i.setSearchHistory(n, "DeclarationFields_" + o.fieldId), o.onlyId = !1, o.DeclarationService.searchForField(o, n, 0, s).then(function (n) {
            n.fields && handleSearchFields(t, n, o, e), e.modal.items = n.rows, e.modal.noresults = 0 == e.modal.items.length, e.showmore = e.modal.items.length >= s
        })), "Pocket_LeaveFields" == e.modal.type && (i.setSearchHistory(n, "LeaveFields_" + o.fieldId), o.onlyId = !1, o.AbsenceService.searchForField(o, n, 0, s).then(function (n) {
            n.fields && handleSearchFields(t, n, o, e), e.modal.items = n.rows, e.modal.noresults = 0 == e.modal.items.length, e.showmore = e.modal.items.length >= s
        })), "Pocket_NewReceiptFields" == e.modal.type && (i.setSearchHistory(n, "newreceiptfields_" + o.form.PrId_entry + "_" + o.fieldId), o.onlyId = !1, o.ProjectService.searchForField(o, n, 0, s).then(function (n) {
            n.fields && handleSearchFields(t, n, o, e), e.modal.items = n.rows, e.modal.noresults = 0 == e.modal.items.length, e.showmore = e.modal.items.length >= s
        })), "Pocket_Projects" == e.modal.type ? (i.setSearchHistory(n, "Projects"), f.search("projects", n, o, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_ExpenseTypes" == e.modal.type ? (i.setSearchHistory(n, "declaration_types"), o.DeclarationService.searchTypes(n, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_DeclProfiles" == e.modal.type ? (i.setSearchHistory(n, "declaration_profiles"), o.DeclarationService.searchProfiles(n, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_MutProfiles" == e.modal.type ? (i.setSearchHistory(n, "mutation_profiles"), o.EmployeeService.searchProfiles(n, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_LeaveProfiles" == e.modal.type ? (i.setSearchHistory(n, "leave_profiles"), o.AbsenceService.searchProfiles(n, 0, s, "leave").then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_ProjectStatus" == e.modal.type ? (i.setSearchHistory(n, "projectstatus"), e.modal.items = e.project.statuses.filter(function (e) {
            return e.Description.includes(n)
        }), e.modal.noresults = 0 == e.modal.items.length, e.showmore = !1) : "Pocket_LeaveWithdrawProfiles" == e.modal.type ? (i.setSearchHistory(n, "leavewithdraw_profiles"), o.AbsenceService.searchProfiles(n, 0, s, "withdraw").then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_ProjectProfiles" == e.modal.type ? (i.setSearchHistory(n, "project_profiles"), o.ProjectService.searchProfiles(n, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_Activities" == e.modal.type ? (i.setSearchHistory(n, "Activities"), f.search("activities", n, o, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_ItemTypes" == e.modal.type ? (i.setSearchHistory(n, "ItemTypes"), f.search("itemtypes", n, o, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_Users" == e.modal.type ? (i.setSearchHistory(n, "Users"), a.searchUsers(n, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_Other_Employees" == e.modal.type ? (i.setSearchHistory(n, "Employees"), a.getUser().then(function (t) {
            p.searchOtherEmployees(n, o ? o : t.employee_id, 0, s).then(function (t) {
                e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
            })
        })) : "Pocket_Manager_Employees" == e.modal.type ? (i.setSearchHistory(n, "EmployeesMan"), m.searchManagerEmployees(n, !1, 0, s).then(function (t) {
            e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
        })) : "Pocket_SendTo_Other_Employees" == e.modal.type && (i.setSearchHistory(n, "Employees"), a.getUser().then(function (t) {
            p.searchOtherEmployees(n, t.employee_id, 0, s).then(function (t) {
                e.modal.items = t, e.modal.noresults = 0 == t.length, e.showmore = e.modal.items.length >= s
            })
        }))
    }, this.clearSearch = function (e) {
        e.modal.query = "", hideKeyboard(), e.modal.noresults = !1, e.modal.loaded = 0, e.modal.items = defaultItems, e.showmore = e.modal.items.length >= s, o.resize()
    }, this.loadMore = function (e, n) {
        function i() {
            o.resize(), e.loadingMore[e.modal.type] = !1, e.modal.loading = !1, e.$broadcast("scroll.refreshComplete")
        }
        if (e.loadingMore || (e.loadingMore = {}, e.modal.loading = !0), e.loadingMore[e.modal.type]) r(function () {
            e.loadingMore[e.modal.type] = !1
        }, 5e3);
        else switch (e.loadingMore[e.modal.type] = !0, e.modal.type) {
        case "Pocket_ProjectFields":
            n.onlyId = !1, n.ProjectService.searchForField(n, e.modal.query, d, s).then(function (o) {
                "Pocket_ProjectFields" == e.modal.type && (o.fields && handleSearchFields(t, o, n, e), h.addNewItems(e, o.rows), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_SubjectFields":
            n.onlyId = !1, n.SubjectService.searchForField(n, e.modal.query, d, s).then(function (o) {
                "Pocket_SubjectFields" == e.modal.type && (o.fields && handleSearchFields(t, o, n, e), h.addNewItems(e, o.rows), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_MutationFields":
            n.onlyId = !1, n.EmployeeService.searchForField(n, e.modal.query, d, s).then(function (o) {
                "Pocket_MutationFields" == e.modal.type && (o.fields && handleSearchFields(t, o, n, e), h.addNewItems(e, o.rows), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_TimesheetFields":
            n.onlyId = !1, n.TimesheetService.searchForField(n, e.modal.query, d, s).then(function (o) {
                "Pocket_TimesheetFields" == e.modal.type && (o.fields && handleSearchFields(t, o, n, e), h.addNewItems(e, o.rows), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_IllnessFields":
            n.onlyId = !1, n.IllnessService.searchForField(n, e.modal.query, d, s).then(function (o) {
                "Pocket_IllnessFields" == e.modal.type && (o.fields && handleSearchFields(t, o, n, e), h.addNewItems(e, o.rows), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_LeaveFields":
            n.onlyId = !1, n.AbsenceService.searchForField(n, e.modal.query, d, s).then(function (o) {
                "Pocket_LeaveFields" == e.modal.type && (o.fields && handleSearchFields(t, o, n, e), h.addNewItems(e, o.rows), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_DeclarationFields":
            n.onlyId = !1, n.DeclarationService.searchForField(n, e.modal.query, d, s).then(function (o) {
                "Pocket_DeclarationFields" == e.modal.type && (o.fields && handleSearchFields(t, o, n, e), h.addNewItems(e, o.rows), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_Projects":
            f.search("projects", e.modal.query, n, d, s).then(function (t) {
                "Pocket_Projects" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_NewReceiptFields":
            n.ProjectService.searchForField(n, e.modal.query, d, s).then(function (t) {
                "Pocket_NewReceiptFields" == e.modal.type && (h.addNewItems(e, t.rows), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_DeclProfiles":
            n.DeclarationService.searchProfiles(e.modal.query, d, s).then(function (t) {
                "Pocket_DeclProfiles" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_MutProfiles":
            n.EmployeeService.searchProfiles(e.modal.query, d, s).then(function (t) {
                "Pocket_MutProfiles" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_LeaveProfiles":
            n.AbsenceService.searchProfiles(e.modal.query, d, s, "leave").then(function (t) {
                "Pocket_LeaveProfiles" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_ProjectStatus":
            e.modal.items = e.project.statuses, e.showmore = !1, e.$broadcast("scroll.infiniteScrollComplete"), i();
            break;
        case "Pocket_LeaveWithdrawProfiles":
            n.AbsenceService.searchProfiles(e.modal.query, d, s, "withdraw").then(function (t) {
                "Pocket_LeaveWithdrawProfiles" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_ProjectProfiles":
            n.ProjectService.searchProfiles(e.modal.query, d, s).then(function (t) {
                "Pocket_ProjectProfiles" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_ExpenseTypes":
            n.DeclarationService.searchTypes(e.modal.query, d, s).then(function (t) {
                "Pocket_ExpenseTypes" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_Activities":
            f.search("activities", e.modal.query, n, d, s).then(function (t) {
                "Pocket_Activities" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_ItemTypes":
            f.search("itemtypes", e.modal.query, n, d, s).then(function (t) {
                "Pocket_ItemTypes" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_Project_Stages":
            var c = e.form.startdate;
            null == c && (c = new Date), f.getProjectStages(e.form.project.project_id, getJSONDate(c)).then(function (t) {
                "Pocket_Project_Stages" == e.modal.type && (h.addNewItems(e, t), e.showmore = !1, e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_Users":
            a.searchUsers(e.modal.query, d, s).then(function (t) {
                "Pocket_Users" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_Other_Employees":
            a.getUser().then(function (t) {
                p.searchOtherEmployees(e.modal.query, n ? n : t.employee_id, d, s).then(function (t) {
                    "Pocket_Other_Employees" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
                })["finally"](function () {
                    i()
                })
            });
            break;
        case "Pocket_Manager_Employees":
            m.searchManagerEmployees(e.modal.query, !1, d, s).then(function (t) {
                "Pocket_Manager_Employees" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            });
            break;
        case "Pocket_SendTo_Other_Employees":
            a.getUser().then(function (t) {
                p.searchOtherEmployees(e.modal.query, t.employee_id, d, s).then(function (t) {
                    "Pocket_SendTo_Other_Employees" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
                })["finally"](function () {
                    i()
                })
            });
            break;
        case "Pocket_Placements":
            PlacementService.searchManagerEmployees(e.modal.query, !1, d, s).then(function (t) {
                "Pocket_Placements" == e.modal.type && (h.addNewItems(e, t), e.$broadcast("scroll.infiniteScrollComplete"))
            })["finally"](function () {
                i()
            })
        }
    }, this.addNewItems = function (e, t) {
        var n;
        e.showmore = t.length >= s, void 0 == e.modal.items ? (n = [], defaultItems = t) : n = e.modal.items;
        for (var o = 0; o < t.length; o++) n.push(t[o]);
        e.modal.items = n, d += s
    }, this.ShowRecentSearches = function (e, t) {
        var n, t = this.extraParam;
        switch (e.modal.type) {
        case "Pocket_SubjectFields":
            n = "SubjectFields_" + t.fieldId;
            break;
        case "Pocket_ProjectFields":
            n = "ProjectFields_" + t.fieldId;
            break;
        case "Pocket_MutationFields":
            n = "MutationFields_" + t.fieldId;
            break;
        case "Pocket_TimesheetFields":
            n = "TimesheetFields_" + t.fieldId;
            break;
        case "Pocket_IllnessFields":
            n = "IllnessFields_" + t.fieldId;
            break;
        case "Pocket_DeclarationFields":
            n = "DeclarationFields_" + t.fieldId;
            break;
        case "Pocket_Projects":
            n = "Projects";
            break;
        case "Pocket_ExpenseTypes":
            n = "declaration_types";
            break;
        case "Pocket_DeclProfiles":
            n = "declaration_profiles";
            break;
        case "Pocket_MutProfiles":
            n = "mutation_profiles";
            break;
        case "Pocket_LeaveProfiles":
            n = "leave_profiles";
            break;
        case "Pocket_ProjectStatus":
            n = "projectstatus";
            break;
        case "Pocket_LeaveWithdrawProfiles":
            n = "leavewithdraw_profiles";
            break;
        case "Pocket_ProjectProfiles":
            n = "project_profiles";
            break;
        case "Pocket_Activities":
            n = "Activities";
            break;
        case "Pocket_ItemTypes":
            n = "ItemTypes";
            break;
        case "Pocket_Users":
            n = "Users";
            break;
        case "Pocket_Other_Employees":
            n = "Employees";
            break;
        case "Pocket_Manager_Employees":
            n = "EmployeesMan";
            break;
        case "Pocket_SendTo_Other_Employees":
            n = "Employees";
            break;
        case "Pocket_Placements":
            n = "Placements";
            break;
        case "Pocket_NewReceiptFields":
            n = "newreceiptfields"
        }
        i.getSearchHistory(n).then(function (t) {
            e.recent = t
        })
    }, this.HideRecentSearches = function (e) {
        r(function () {
            e.showhint = !0, e.recent = 0
        }, 50)
    }
}]).service("HelpService", ["$ionicModal", function (e) {
    return {
        init: function (t) {
            var n;
            return n = e.fromTemplateUrl(t, {
                animation: "slide-in-up"
            }).then(function (e) {
                return e
            })
        }
    }
}]).service("ListServiceFactory", function () {
    function e() {
        this.itemHeight = "60", this.dividerHeight = "40", this.getHREFCallback = null
    }
    return e.prototype.divideList = function (e, t, n, o) {
        function r(e, t) {
            return "undefined" == typeof e[n] && "undefined" == typeof t[n] ? 0 : "undefined" == typeof e[n] ? -1 : "undefined" == typeof t[n] ? 1 : "string" == typeof e[n] ? e[n].localeCompare(t[n]) : "number" == typeof e[n] ? e[n] - t[n] : 0
        }
        var i, a;
        if (e) {
            for (i = 0; i < e.length; i++) "DIVIDER" == e[i].lineType && e.splice(i, 1);
            var s = new Array,
                c = "",
                l = e.sort(r);
            for (2 == o && (sortedItem = l.reverse()), i = 0; i < l.length; i++) {
                var u = null;
                switch (t) {
                case 1:
                    u = String(l[i][n]).trim().substring(0, 1).toUpperCase();
                    break;
                case 2:
                    u = String(l[i][n]).trim();
                    break;
                case 3:
                    a = new Date(Date.parse(l[i][n])), u = a.getFullYear();
                    break;
                case 4:
                    a = new Date(Date.parse(l[i][n])), u = getMonthString(a.getMonth()) + " " + a.getFullYear()
                }
                if (c != u && (s.push({
                        lineType: "DIVIDER",
                        divider: u,
                        itemHeight: this.dividerHeight
                    }), c = u), null != this.getHREFCallback) {
                    var d = this.getHREFCallback(l[i]);
                    "undefined" != typeof d ? (l[i].lineType = "HREF", l[i].HREF = d) : l[i].lineType = "NOHREF"
                } else l[i].lineType = "NOHREF";
                l[i].itemHeight = this.itemHeight, s.push(l[i])
            }
            return s
        }
    }, e.prototype.controlDataTypeAllowsHeader = function (e, t) {
        if (3 == t || 12 == t || 16 == t) return !1;
        switch (parseInt(e)) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 8:
            return !0;
        case 6:
        case 7:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 22:
        case 23:
            return !1;
        default:
            return !1
        }
    }, e.prototype.handleHeaders = function (e, t, n) {
        var o, r = null;
        n && (r = null == n[t.defname] ? atrans("empty", "leeg") : this.getHeader(n[t.defname], t.ctype));
        for (var i = 0; i < e.length; i++) o = null == e[i][t.defname] ? atrans("empty", "leeg") : this.getHeader(e[i][t.defname], t.ctype), r !== o && (r = o, e.splice(i, 0, {
            divider: o
        }));
        return e
    }, e.prototype.getHeader = function (e, t) {
        switch (parseInt(t)) {
        case 1:
            return e.substring(0, 1).toUpperCase();
        case 2:
            return e ? atrans("yes", "Ja") : atrans("no", "Nee");
        case 3:
        case 5:
            return e;
        case 4:
        case 8:
            var n = new Date,
                o = new Date(Date.parse(e)),
                r = Math.round((+n - o) / 864e5);
            if (-7 > r || r > 7) var i = n.getFullYear(),
                a = n.getMonth() + 1,
                s = o.getFullYear(),
                c = o.getMonth() + 1,
                l = [atrans("january", "januari"), atrans("february", "februari"), atrans("march", "maart"), atrans("april", "april"), atrans("may", "mei"), atrans("june", "juni"), atrans("july", "juli"), atrans("august", "augustus"), atrans("september", "september"), atrans("october", "oktober"), atrans("november", "november"), atrans("december", "december")];
            if (-7 > r) return i == s && a == c ? atrans("thismonthfuture", "Deze maand (toekomstig)") : i == s || a > 10 && i - 1 == s ? l[c - 1] + " " + s : s;
            if (-2 >= r) return atrans("upcommingweek", "Aankomende week");
            if (-2 == r) return atrans("dayaftertomorrow", "Overmorgen");
            if (-1 == r) return atrans("tomorrow", "Morgen");
            if (0 == r) return atrans("todayCap", "Vandaag");
            if (1 == r) return atrans("yesterday", "Gisteren");
            if (7 >= r) return atrans("lastweek", "Afgelopen week");
            if (r > 7) return i == s && a == c ? atrans("thismonth", "Deze maand") : i == s || 3 > a && i - 1 == s ? l[c - 1] + " " + s : s
        }
    }, {
        getInstance: function () {
            return new e
        }
    }
}).factory("Chats", ["sharedConn", "$rootScope", function (e, t) {
    return ChatsObj = {}, loadRoster = function () {
        var n = $iq({
            type: "get"
        }).c("query", {
            xmlns: "jabber:iq:roster"
        });
        return ChatsObj.roster = [], connection = e.getConnectObj(), connection.sendIQ(n, function (e) {
            e && 0 != e.length && t.$apply(function () {
                for (var t = e.querySelectorAll("item"), n = 0; n < t.length; n++) {
                    var o = angular.element(t[n]);
                    ChatsObj.roster.push({
                        id: o.attr("jid"),
                        name: o.attr("name") || o.attr("jid"),
                        lastText: void 0 == o.attr("subscribe") ? "Waiting to Accept" : "Available to Chat",
                        face: "img/man.png"
                    })
                }
            })
        }), connection.addHandler(function (e) {
            return !0
        }, null, "presence"), connection.send($pres()), connection.addHandler(function (e) {
            e && 0 != e.length && t.$apply(function () {
                for (var t = e.querySelectorAll("item"), n = 0; n < t.length; n++) {
                    var o = angular.element(t[n]);
                    "from" == o.attr("subscription") ? ChatsObj.roster.push({
                        id: o.attr("jid"),
                        name: o.attr("name") || o.attr("jid"),
                        lastText: "Available to Chat",
                        face: "img/man.png"
                    }) : void 0 == o.attr("subscription") && "subscribe" == o.attr("ask") ? ChatsObj.roster.push({
                        id: o.attr("jid"),
                        name: o.attr("name") || o.attr("jid"),
                        lastText: "Waiting to Accept",
                        face: "img/man.png"
                    }) : void 0 == o.attr("subscription") && ChatsObj.removeRoster(ChatsObj.getRoster(o.attr("jid")))
                }
            })
        }, "jabber:iq:roster", "iq", "set"), ChatsObj.roster
    }, ChatsObj.allRoster = function () {
        return loadRoster(), ChatsObj.roster
    }, ChatsObj.removeRoster = function (e) {
        ChatsObj.roster.splice(ChatsObj.roster.indexOf(e), 1)
    }, ChatsObj.getRoster = function (e) {
        for (var t = 0; t < ChatsObj.roster.length; t++)
            if (ChatsObj.roster[t].id == e) return ChatsObj.roster[t]
    }, ChatsObj.addNewRosterContact = function (e) {
        connection.send($pres({
            to: e,
            type: "subscribe"
        }))
    }, ChatsObj
}]).factory("sharedConn", ["$rootScope", "$ionicPopup", function (e, t) {
    function n(e) {
        return e in i ? !0 : !1
    }

    function o(e) {
        i[e] = !0
    }
    var r = {};
    r.SERVICEURL = "wss://chat.afaspocket.nl:5280/ws", r.connection = null, r.loggedIn = !1, r.getConnectObj = function () {
        return r.connection
    }, r.isLoggedIn = function () {
        return r.loggedIn
    }, r.getBareJid = function () {
        var e = r.connection.jid;
        return e = e.substring(0, e.indexOf("/"))
    }, r.login = function (e, t, n, o) {
        r.connectcallback = o, r.connection = new Strophe.Connection(r.SERVICEURL, {
            keepalive: !0
        }), r.connection.connect(e + "@" + t, n, r.onConnect)
    }, r.onConnect = function (e) {
        e == Strophe.Status.CONNECTING || e == Strophe.Status.CONNFAIL || e == Strophe.Status.DISCONNECTING || e == Strophe.Status.DISCONNECTED || e == Strophe.Status.CONNECTED && (r.connection.addHandler(r.onMessage, null, "message", null, null, null), r.connection.send($pres().tree()), r.loggedIn = !0, r.connection.addHandler(r.on_subscription_request, null, "presence", "subscribe"), r.connectcallback())
    }, r.onMessage = function (t) {
        return e.$broadcast("msgRecievedBroadcast", t), !0
    }, r.register = function (e, t, n) {}, r.logout = function () {
        r.connection.options.sync = !0, r.connection.flush(), r.connection.disconnect()
    };
    var i = {};
    return r.on_subscription_request = function (e) {
        return "subscribe" != e.getAttribute("type") || n(e.getAttribute("from")) ? void 0 : (r.connection.send($pres({
            to: e.getAttribute("from"),
            type: "subscribed"
        })), o(e.getAttribute("from")), !0)
    }, r
}]);