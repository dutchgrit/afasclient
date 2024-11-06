angular.module("tasks.controller", ["AfasServices"]).controller("TasksController", ["$scope", "$templateCache", "TaskService", "ListServiceFactory", "SearchService", "UserService", "$ionicSlideBoxDelegate", "$ionicPopover", "$ionicActionSheet", "$timeout", "$state", "$ionicScrollDelegate", "maxListTake", "$q", "MultipleViewsManager", "SubjectServiceFactory", "ConfigService", function (e, t, o, a, s, r, n, i, d, c, l, f, u, g, h, m, p) {
    function k() {
        var t = !1;
        if ("" != SessionStorage.getItem("lastTaskChanged")) {
            if (e.tasks)
                for (var o = 0; o < e.tasks.length; o++) e.tasks[o].guid == SessionStorage.getItem("lastTaskChanged") && (e.tasks[o].refreshing = !0);
            t = !0
        }
        e.refreshTasks(t)
    }

    function v(t, a) {
        var r = g.defer();
        return e.loadingMore ? (r.reject(), r.promise) : (e.loadingMore = !0, o.searchTasks(e.fetchData.query, t, a, e.form.sortfield, e.form.sortdir).then(function (t) {
            return e.showmore = t.length >= u, (null == t || 0 == t.length) && (e.searched = "" != e.fetchData.query), s.setSearchHistory(e.fetchData.query, "Tasks"), e.HideRecentSearches(), window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard && cordova.plugins.Keyboard.close(), t
        })["finally"](function () {
            e.$broadcast("scroll.refreshComplete"), e.$broadcast("scroll.infiniteScrollComplete"), e.loadingMore = !1
        }))
    }

    function S(t, o) {
        switch (e.form.sortfield) {
        case "submitdate":
        case "startdate":
        case "enddate":
            return e.form.sortdir * (parseDateString(t[e.form.sortfield]).getTime() - parseDateString(o[e.form.sortfield]).getTime());
        case "title":
        case "task":
            return -1 == e.form.sortdir ? o[e.form.sortfield].toLowerCase() < t[e.form.sortfield].toLowerCase() ? -1 : 1 : o[e.form.sortfield].toLowerCase() < t[e.form.sortfield].toLowerCase() ? 1 : -1
        }
    }

    function I(t) {
        for (var o = !1, a = !1, s = !1, r = !1, n = !1, i = {}, d = new Date, c = 0; c < t.length; c++) "DIVIDER" == t[c].lineType && t.splice(c, 1);
        switch (t = t.sort(S), e.form.sortfield) {
        case "submitdate":
        case "startdate":
        case "enddate":
            for (var c = 0; c < t.length; c++)
                if (!t[c].divider) {
                    var l = new Date(Date.parse(t[c][e.form.sortfield])),
                        f = Math.round(Math.abs(+d - l) / 864e5);
                    null != t[c][e.form.sortfield] || n ? 0 != f || o ? 1 != f || r ? f > 1 && 7 >= f && !a ? (t.splice(c, 0, {
                        lineType: "DIVIDER",
                        divider: atrans("lastweek", "Afgelopen week")
                    }), a = !0) : f > 7 && !s && (t.splice(c, 0, {
                        lineType: "DIVIDER",
                        divider: atrans("earlier", "~App~Eerder")
                    }), s = !0) : (t.splice(c, 0, {
                        lineType: "DIVIDER",
                        divider: atrans("yesterday", "Gisteren")
                    }), r = !0) : (t.splice(c, 0, {
                        lineType: "DIVIDER",
                        divider: atrans("todayCap", "Vandaag")
                    }), o = !0) : (t.splice(c, 0, {
                        lineType: "DIVIDER",
                        divider: atrans("nodate", "Geen datum")
                    }), n = !0)
                } break;
        case "task":
            for (var c = 0; c < t.length; c++) t[c].divider || i[t[c].task] || (i[t[c].task] = !0, t.splice(c, 0, {
                lineType: "DIVIDER",
                divider: t[c].task
            }))
        }
        return t
    }
    var w = a.getInstance(),
        T = m.getInstance(),
        y = 0,
        b = LocalStorage.getItem("tasksortfield") || "submitdate",
        C = parseInt(LocalStorage.getItem("tasksortdir") || "-1", 10);
    e.form = {
        sortfield: b,
        sortdir: C
    }, p.getConfig().then(function (t) {
        isVersionOrHigher(t, "Profit7") && (e.versionProfit7 = !0)
    }), e.searchplaceholder = atrans("taskSearchplaceholder", "Zoek op onderwerp of workflow"), e.refreshText = atrans("refreshtext", "Laat los om te verversen"), e.showmore = !1, t.put("modules/subjects/subject.html"), e.fetchData = {}, e.pageTitle = atrans("mytasks", "Mijn taken"), e.loadingmore = !1, e.canSlide = !0, e.$on("$ionicView.beforeEnter", function () {
        e.optionsMenu = [{
            text: atrans("sortOnSendDate", "Instuurdatum"),
            sortfield: "submitdate"
        }, {
            text: atrans("sortOnStartDate", "Begindatum"),
            sortfield: "startdate"
        }, {
            text: atrans("sortOnEndDate", "Einddatum"),
            sortfield: "enddate"
        }, {
            text: atrans("sortOnDescription", "Omschrijving"),
            sortfield: "title"
        }, {
            text: atrans("sortOnTask", "Taak"),
            sortfield: "task"
        }], k(), e.landScape = e.isLandscape()
    }), e.$on("$ionicView.enter", function () {}), i.fromTemplateUrl("popoverOptions.html", {
        scope: e
    }).then(function (t) {
        e.popover = t
    }), e.openPopover = function (t) {
        e.popover.show(t)
    }, e.closePopover = function () {
        e.popover.hide()
    }, e.$on("$destroy", function () {
        e.popover.remove()
    }), e.checkConfig = function () {
        p.getConfig().then(function (e) {
            -1 == e.modules.indexOf(1) && n.enableSlide(!1)
        })
    }, e.handleTask = function (t) {
        if (e.canSlide) {
            e.canSlide = !1;
            var a = t.guid;
            T.markRead(a, !0)["finally"](function () {
                t.markread = !1, e.refreshHomeBullets()
            }), e.form.workflowid = t.guid_workflow, e.form.taskid = t.guid_task, e.form.reactionType = {
                value: "I"
            }, r.getUser().then(function (s) {
                p.getConfig().then(function (r) {
                    T.getWorkflowActions(a).then(function (i) {
                        var f;
                        if (null != i && null != i.rows && i.rows.length > 0) {
                            for (f = 0; f < i.rows.length; f++)
                                if (-36 == t.subjecttype && 79 == i.rows[f].ActionTypeId) {
                                    i.rows.splice(f, 1);
                                    break
                                } var u = i.rows;
                            if (e.mayEditAtTask(r, t, s) && u.push({
                                    isEdit: !0,
                                    subjectid: a,
                                    Caption: atrans("edit", "Aanpassen"),
                                    profileid: t.profileid,
                                    profiletype: t.profiletype
                                }), 1 != u.length || "InSiteMandatory" == u[0].ReactionMandatoryType || u[0].UserRequiredOnHandle) {
                                for (var g = new Array, f = 0; f < u.length; f++) action = u[f], g.push({
                                    text: "<i class='icon iconHide'></i>" + action.Caption
                                });
                                c(function () {
                                    if (document.body.lastChild && document.body.lastChild.firstChild) {
                                        var e = window.getComputedStyle(document.body.lastChild.firstChild);
                                        "matrix(1, 0, 0, 1, 0, 0)" != e["-webkit-transform"] && (document.body.lastChild.firstChild.style["-webkit-transform"] = "matrix(1, 0, 0, 1, 0, 0)")
                                    }
                                }, 500), d.show({
                                    buttons: g,
                                    titleText: atrans("workflowactions", "Workflow acties"),
                                    cancelText: atrans("cancel", "Annuleren"),
                                    cancel: function () {
                                        n.slide(1), c(function () {
                                            e.canSlide = !0
                                        }, 100)
                                    },
                                    buttonClicked: function (t) {
                                        var s = u[t];
                                        return "InSiteMandatory" == s.ReactionMandatoryType || s.UserRequiredOnHandle ? (c(function () {
                                            e.canSlide = !0
                                        }, 100), l.go("menu.subjectactions", {
                                            subjectId: a,
                                            actionId: s.ActionId
                                        }, {
                                            reload: !0
                                        })) : (e.form.action = s, s.isEdit ? e.doEditAction(s) : 164 != s.ActionTypeId ? o.executeAction(a, null, e.form).then(function () {
                                            SessionStorage.setItem("lastTaskChanged", a), c(function () {
                                                e.canSlide = !0
                                            }, 100), k()
                                        }) : l.go("menu.subjectsign", {
                                            subjectId: a,
                                            actionId: s.ActionId
                                        }, {
                                            reload: !0
                                        })), !0
                                    }
                                })
                            } else e.form.action = u[0], u[0].isEdit ? e.doEditAction(u[0]) : 164 != u[0].ActionTypeId ? o.executeAction(a, null, e.form).then(function () {
                                SessionStorage.setItem("lastTaskChanged", a), n.enableSlide(!0), k()
                            }) : l.go("menu.subjectsign", {
                                subjectId: a,
                                actionId: u[0].ActionId
                            }, {
                                reload: !0
                            })
                        }
                    })
                })
            })
        } else n.slide(1), c(function () {
            e.canSlide = !0
        }, 100)
    }, e.clearTasks = function () {
        e.fetchData.query = "", e.refreshTasks(!0)
    }, e.refreshTasks = function (t) {
        f.$getByHandle("tasks").resize(), f.$getByHandle("tasks").scrollTop(!0), y = 0, t && o.clearAllCache(), v(0, u).then(function (t) {
            e.tasks = I(t);
            for (var o = [], a = 0; a < e.tasks.length; a++) e.tasks[a].refreshing = !1, o.push({
                title: e.tasks[a].title,
                param: e.tasks[a],
                "goto": e.gotoTask
            });
            if (e.speakItems && e.speakItems(o), h.isActive())
                if (null != SessionStorage.getItem("lastTaskReactionAdded")) {
                    var s = SessionStorage.getItem("lastTaskReactionAdded");
                    SessionStorage.removeItem("lastTaskReactionAdded"), e.selectedGuid = s, h.updateView("tasks-detail", {
                        subjectId: s
                    })
                } else {
                    for (var r = !1, a = 0; a < t.length; a++)
                        if (t[a].guid) {
                            e.selectedGuid = t[a].guid, h.updateView("tasks-detail", {
                                subjectId: t[a].guid
                            }), r = !0;
                            break
                        } r || (e.selectedGuid = void 0, h.updateView("tasks-detail", {}))
                } SessionStorage.setItem("lastTaskChanged", "")
        })
    }, w.getHREFCallback = function (e) {
        return "#/menu/subject/" + encodeURIComponent(e.guid) + "/"
    }, e.searchTasks = function () {
        y = 0, hideKeyboard(), e.HideRecentSearches(), o.clearAllCache(), v(0, u).then(function (t) {
            e.tasks = I(t)
        })
    }, e.pickdir = function (t) {
        e.form.sortdir = t, LocalStorage.setItem("tasksortdir", e.form.sortdir), e.refreshTasks(!0), e.closePopover()
    }, e.picksort = function () {
        LocalStorage.setItem("tasksortfield", e.form.sortfield), e.refreshTasks(!0), e.closePopover()
    }, e.loadMore = function () {
        if (1 != e.loadingmore) {
            e.loadingmore = !0;
            var t = e.tasks;
            y += u, v(y, u).then(function (o) {
                o.length >= u ? e.showmore = !0 : e.showmore = !1;
                for (var a = 0; a < o.length; a++) t.push(o[a]);
                e.tasks = I(t), e.loadingmore = !1, f.$getByHandle("tasks").resize()
            })
        }
    }, e.ShowRecentSearches = function () {
        s.getSearchHistory("Tasks").then(function (t) {
            e.recent = t
        })
    }, e.HideRecentSearches = function () {
        c(function () {
            e.recent = 0
        }, 100)
    }, e.clickRecent = function (t) {
        e.fetchData.query = t, e.searchTasks(), e.HideRecentSearches()
    }, e.removeItem = function (e, t) {
        e.preventDefault(), e.stopPropagation(), s.removeItem(t, "Tasks")
    }, e.goToTask = function (t) {
        t.refreshing || (h.isActive() ? (e.selectedGuid = t.guid, t.opened || (t.opened = !0, t.markread = !0), h.updateView("tasks-detail", {
            subjectId: t.guid
        })) : l.go("menu.subject", {
            subjectId: t.guid
        }))
    }
}]);