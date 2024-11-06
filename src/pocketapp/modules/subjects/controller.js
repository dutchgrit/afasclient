angular.module("subjects.controller", ["AfasServices"]).controller("SubjectController", ["$scope", "$timeout", "$state", "$stateParams", "$ionicActionSheet", "$ionicHistory", "$ionicTabsDelegate", "$ionicScrollDelegate", "$templateCache", "ConnectorService", "TaskService", "SharedSubjectServiceFactory", "MultipleViewsManager", "AbsenceServiceFactory", "DeclarationServiceFactory", "IllnessServiceFactory", "ConfigService", "UserService", "ContactServiceFactory", "AvailabilityService", "DocumentsServiceFactory", "DocumentSessionService", "LocalStorageService", "question", "EmployeeServiceFactory", function (e, t, n, i, o, a, r, c, s, l, u, d, f, m, g, b, h, S, p, v, j, I, y, w, _) {
    function C() {
        S.getUser().then(function (n) {
            h.getConfig().then(function (i) {
                if (-1 == i.modules.indexOf(1) && -1 == i.modules.indexOf(23)) e.gotoPage("menu.home");
                else {
                    e.showShowDeclaration = isVersionOrHigher(i, "Profit15"), null == a.forwardView() && $();
                    var o = k();
                    o && u.clearCache(B), void 0 == B ? e.gotoPage("menu.tasklist") : u.getTaskBySubject(B, o).then(function (o) {
                        void 0 == o ? e.gotoPage("menu.tasklist") : void 0 == o.guid_task && SessionStorage.getItem("lastTaskChanged") == o.guid ? e.gotoPage("menu.tasklist") : (t(function () {
                            c.$getByHandle("subject").scrollTop(!0)
                        }, 10), e.subject = o, (!o.opened || o.markread) && isVersionOrHigher(i, "Profit7") && A.markRead(B, !0)["finally"](function () {
                            o.markread = !1, e.refreshHomeBullets()
                        }), e.reactions = [], e.subject.descriptionmailto = atrans("subjectitem", "Dossieritem") + " ", o.subjecttype_description && (e.pageTitle = o.subjecttype_description, e.subject.descriptionmailto += encodeURIComponent(" (" + o.subjecttype_description + ")")), e.subject.descriptionmailto += ": " + encodeURIComponent(o.title), y.getItem("loginkey").then(function (t) {
                            var n = "https://www.afaspocket.nl/subject/" + e.subject.guid + "?" + t;
                            e.subject.bodymailto = encodeURIComponent(atrans("openlink", "Open dit dossieritem door op de volgende link te klikken:") + "\r\n\r\n" + n + "\r\n\r\n" + atrans("noaccountemail", "Nog geen Afas Pocket account? Meld je dan aan met je profit gebruikersnaam en omgevingsleutel {0}.", t.toUpperCase())), e.subject.qrurl = n
                        }), D(o), F(i, o.subjecttype), e.subject.submitter_image_id && l.getImageData(e.subject.submitter_image_id, 2).then(function (t) {
                            t.url ? e.subject.submitter_image = t.url : e.subject.submitter_image = "img/man.png"
                        }), e.subject.responsible_image_id && l.getImageData(e.subject.responsible_image_id, 2).then(function (t) {
                            t.url ? e.subject.responsible_image = t.url : e.subject.responsible_image = "img/man.png"
                        }), e.subject.destination_organization_person_image_id && l.getImageData(e.subject.destination_organization_person_image_id, 2).then(function (t) {
                            t.url ? e.subject.destination_organization_person_image = t.url : e.subject.destination_organization_person_image = "img/man.png"
                        }), e.subject.destination_contact_image_id && l.getImageData(e.subject.destination_contact_image_id, 2).then(function (t) {
                            t.url ? e.subject.destination_contact_image = t.url : e.subject.destination_contact_image = "img/man.png"
                        }), o.guid_task && -1 != i.modules.indexOf(1) && A.getWorkflowActions(B).then(function (t) {
                            if (null != t && null != t.rows && t.rows.length > 0) {
                                for (var a = 0; a < t.rows.length; a++)
                                    if (-36 == e.subject.subjecttype && 79 == t.rows[a].ActionTypeId) {
                                        t.rows.splice(a, 1);
                                        break
                                    } e.actions = t.rows, e.mayEditAtTask(i, o, n) && e.actions.push({
                                    isEdit: !0,
                                    subjectid: B,
                                    Caption: atrans("edit", "Aanpassen"),
                                    profileid: o.profileid,
                                    profiletype: o.profiletype,
                                    task: o
                                })
                            }
                        }), -17 != e.subject.subjecttype && -19 != e.subject.subjecttype && -47 != e.subject.subjecttype && -36 != e.subject.subjecttype && isVersionOrHigher(i, "2016B2PU10") && A.getMutationBySubjectId(B).then(function (t) {
                            e.changes = t;
                            for (var n = 0; n < e.changes.length; n++)
                                if (e.changes[n].Changes)
                                    for (var i = 0; i < e.changes[n].Changes.length; i++)
                                        for (var o = 0; o < e.changes[n].Changes[i].ChangedFields.length; o++) {
                                            var a = e.changes[n].Changes[i].ChangedFields[o];
                                            a.IsImage && (a.Values && a.Values.Old && l.getImageData(parseInt(a.Values.Old.Value, 10), 1, function () {
                                                return I.getSession()
                                            }, {
                                                change: a
                                            }).then(function (e) {
                                                e && (e.state.change.Values.Old.ImageUrl = e.url)
                                            }), a.Values && a.Values.New && l.getImageData(parseInt(a.Values.New.Value, 10), 1, function () {
                                                return I.getSession()
                                            }, {
                                                change: a
                                            }, 1).then(function (e) {
                                                e && (e.state.change.Values.New.ImageUrl = e.url)
                                            }))
                                        }
                        }))
                    })["finally"](function () {
                        e.loadercount--, e.refreshReactions()
                    })
                }
            })
        })
    }

    function k() {
        switch (e.initialSlide = 0, i.from) {
        case "comments":
            r.$getByHandle("tabssubject").select(2), e.slider && t(function () {
                e.slider.slideTo(2, 0, !1)
            }, 1), e.initialSlide = 2;
            break;
        case "action":
            return !0
        }
        return !1
    }

    function $() {
        e.slider && (e.showType = "general", t(function () {
            e.slider.slideTo(0, 1, !1)
        }, 400), r.$getByHandle("tabssubject").select(0))
    }

    function D(e) {
        h.getConfig().then(function (t) {
            if (isVersionOrHigher(t, "2018B1PU2")) A.getAttachments(e).then(function (n) {
                if (n.length > 0) {
                    e.attachments = [];
                    for (var i = 0; i < n.length; i++) {
                        var o = {};
                        o.type = "file", o.filename = n[i].file_name, o.guid = n[i].file_id, o.size = n[i].file_size, T(t, e.attachments, o), e.attachments.push(o)
                    }
                } else e.attachments = void 0
            });
            else if (e.attachment_filename) {
                e.attachments = [];
                var n = {};
                n.type = "file", n.filename = e.attachment_filename, n.guid = e.attachment_guid, n.size = e.attachment_size, T(t, e.attachments, n), e.attachments.push(n)
            } else e.attachments = void 0
        })
    }

    function T(e, t, n) {
        var i = inlineDocType(n.filename);
        if (null != i && (n.showInlineContent = !0), n.size <= 5e4) {
            var o = n.filename.toLowerCase().substring(n.filename.lastIndexOf("."));
            (".jpg" == o || ".jpeg" == o || ".svg" == o || ".png" == o || ".gif" == o || ".bmp" == o) && (n.type = "img", l.getFileData(n, "guid", "filename").then(function (e) {
                for (var n = 0; n < t.length; n++) e.guid == t[n].guid && (t[n].imageUrl = "data:" + e.mimetype + ";base64," + e.filedata)
            }))
        }
    }

    function F(t, n) {
        switch (n) {
        case -17:
            e.loadercount++;
            var i = b.getInstance();
            i.getIllnessBySubjectId(B).then(function (t) {
                e.illness = t
            })["finally"](function () {
                e.loadercount--
            });
            break;
        case -19:
            e.loadercount++;
            var o = m.getInstance();
            o.getAbsenceBySubjectId(B).then(function (t) {
                e.absence = t, o.getEmployment(t.dvb).then(function (t) {
                    t && t.length > 0 && (e.absence["function"] = t[0].function_description, e.absence.orgunit_description = t[0].orgunit_description)
                })
            })["finally"](function () {
                e.loadercount--
            }), isVersionOrHigher(t, "Profit10") && (e.infoLoaded = !1, o.getDeclarationFreeTablBySubjectId(B).then(function (t) {
                parseInfo(e, t, null, !0)
            })["finally"](function () {
                e.infoLoaded = !0
            }));
            break;
        case -36:
            e.loadercount++;
            var a = j.getInstance();
            a.getDocumentBySubjectId(B).then(function (t) {
                e.documentId = t, a.getFullDocument(e.documentId, e)
            })["finally"](function () {
                e.loadercount--
            });
            break;
        case -47:
            e.loadercount++;
            var r = g.getInstance();
            r.getDeclarationBySubjectId(B).then(function (t) {
                e.declaration = t
            })["finally"](function () {
                e.loadercount--
            }), isVersionOrHigher(t, "Profit7") && (e.infoLoaded = !1, r.getDeclarationFreeTablBySubjectId(B).then(function (t) {
                parseInfo(e, t, null, !0)
            })["finally"](function () {
                e.infoLoaded = !0
            }));
            break;
        default:
            if (n >= 0 && isVersionOrHigher(t, "Profit7")) {
                var c = null;
                e.infoLoaded = !1, I.getSession().then(function (e) {
                    c = e.maininsite
                })["finally"](function () {
                    A.getSubjectFreeTablBySubjectId(B, null != c).then(function (t) {
                        parseInfo(e, t, null, !0)
                    })
                })["finally"](function () {
                    e.infoLoaded = !0
                })
            }
        }
    }
    s.put("modules/absence/parts/detail.html"), s.put("modules/declarations/parts/detail.html"), s.put("modules/subject/parts/general.html"), s.put("modules/subject/parts/details.html"), s.put("modules/subject/parts/comments.html"), e.actions = [], e.loading = {}, e.titleGeneral = atrans("general", "Algemeen"), e.titleDetails = atrans("details", "Details"), e.titleReactions = atrans("reactions", "Reacties"), e.refreshText = atrans("refreshtext", "Laat los om te verversen"), e.showType = "general", e.loadercount = 1, e.initialSlide = 0, e.showavailability = !1, e.hiddenAvailability = !0, e.showFullDocument = !1, e.activatedFab = !1;
    var B = i.subjectId;
    !B && f.isActive() && (e.showplaceholder = !0);
    var A = d.getSubjectService();
    _.getInstance();
    S.getUser().then(function (t) {
        e.userid = t.user, e.personid = t.person
    }), h.getConfig().then(function (t) {
        -1 != t.modules.indexOf(10) && (e.showavailability = !0)
    }), e.$on("$ionicSlides.sliderInitialized", function (t, n) {
        e.slider = n.slider
    }), e.$on("$ionicSlides.slideChangeStart", function (e, n) {
        t(function () {
            r.$getByHandle("tabssubject").select(n.slider.activeIndex)
        }, 1)
    }), f.updated("tasks-detail", function (t) {
        t.subjectId ? (i.subjectId = t.subjectId, B = t.subjectId, f.isActive() && (e.showplaceholder = !1), C(), e.showplaceholder = !1) : (e.subject = void 0, e.loadercount = 0, e.showplaceholder = !0)
    }), e.$on("$ionicView.enter", function (n) {
        e.infoLoaded = !0, h.getConfig().then(function (n) {
            -1 == n.modules.indexOf(1) && -1 == n.modules.indexOf(23) ? e.gotoPage("menu.home") : f.isActive() ? e.slider && t(function () {
                e.slider.onResize(!0)
            }, 400) : C()
        })
    }), e.$on("$ionicView.unloaded", function () {
        e.slider = void 0
    }), e.setUnread = function (t) {
        A.markRead(B, !1)["finally"](function () {
            e.previousPage()
        })
    }, e.isUsableValue = function (t) {
        if ("undefined" != typeof t) {
            t = e.getValue(t);
            var n = parseFloat(t.replace(/\./g, "").replace(",", "."));
            return isNaN(n) ? "" != t : n > 0
        }
        return !1
    }, e.getValue = function (e) {
        return "undefined" != typeof e ? "" != e.Description ? e.Description : "True" == e.Value ? atrans("yes", "Ja") : "False" == e.Value ? atrans("no", "Nee") : e.Value : void 0
    }, e.showDeclaration = function (e) {
        e.flex_declaration_id && n.go("menu.flexdeclaration", {
            id: e.flex_declaration_id,
            fromTask: !0,
            readonly: !0
        }, {
            reload: !0
        })
    }, e.showAvailPopup = function () {
        e.showAvailabilityPopup("2", parseDateString(e.absence.start_datetime), parseDateString(e.absence.end_datetime), e.absence.employee)
    }, e.downloadAttachment = function (t) {
        e.loading[t.guid] = !0, l.downloadFile(t, "guid", "filename")["finally"](function () {
            e.loading[t.guid] = !1
        })
    }, e.downloadDocumentAttachment = function (e) {
        l.downloadFile(e, "AttachmentGuid", "AttachmentFilename", function () {
            return I.getSession()
        })
    }, e.refreshReactions = function () {
        h.getConfig().then(function (t) {
            A.getReactionsBySubject(B).then(function (t) {
                var n;
                if (e.reactions && e.reactions.length > 0) {
                    for (n = 0; n < e.reactions.length; n++)
                        for (var i = 0; i < t.length; i++) {
                            if (!t[i].reaction_id) {
                                e.reactions = [];
                                break
                            }
                            if (t[i].reaction_id == e.reactions[n].reaction_id) {
                                t.splice(i, 1);
                                break
                            }
                        }
                    for (n = t.length - 1; n >= 0; n--) e.reactions.unshift(t[n])
                } else e.reactions = t;
                var o = {};
                for (n = 0; n < e.reactions.length; n++) null != e.reactions[n].image_id && (o[e.reactions[n].image_id] || (o[e.reactions[n].image_id] = !0, l.getImageData(e.reactions[n].image_id, 1).then(function (t) {
                    if (t.url)
                        for (var n = 0; n < e.reactions.length; n++) e.reactions[n].image_id == t.key && (e.reactions[n].image = t.url)
                }))), D(e.reactions[n]);
                e.$broadcast("scroll.refreshComplete")
            })
        })
    }, e.$on("$ionicSlides.slideChangeEnd", function (n, i) {
        t(function () {
            e.addFab = !1, e.changeFab = !1
        }, 1)
    }), e.show = function (t) {
        var n, i = e.showType;
        switch (t) {
        case 0:
            e.showType = "general";
            break;
        case 1:
            e.showType = "details";
            break;
        case 2:
            e.showType = "comments"
        }
        n = e.showType, void 0 != i && (hasFab(n) ? (e.activatedFab = !0, e.removeFab ? (e.removeFab = !1, e.addFab = !0) : e.changeFab = !0) : e.removeFab = !0), e.slider && e.slider.activeIndex != t && e.slider.slideTo(t)
    }, hasFab = function (e) {
        switch (e) {
        case "general":
            return !1;
        case "details":
            return !1;
        case "comments":
            return !0
        }
    }, e.scrollTop = function () {
        t(function () {
            c.$getByHandle("subject").scrollTop(!0)
        }, 10)
    }, e.goToNewReaction = function (e) {
        n.go("menu.newreaction", {
            subjectId: e
        }, {
            reload: !0
        })
    }, e.deleteReaction = function (t) {
        w(atrans("confirmdeletereaction", "Weet je zeker dat je de reactie wilt verwijderen?")).then(function (n) {
            n && A.deleteReaction(t.guid, t.reaction_id).then(function (n) {
                e.reactions.splice(e.reactions.indexOf(t), 1)
            })
        })
    }, e.showActions = function () {
        var i;
        if (1 == e.actions.length) i = e.actions[0], i.isEdit ? e.doEditAction(i) : 164 == i.ActionTypeId ? n.go("menu.subjectsign", {
            subjectId: B,
            actionId: i.ActionId
        }, {
            reload: !0
        }) : n.go("menu.subjectactions", {
            subjectId: B,
            actionId: i.ActionId
        }, {
            reload: !0
        });
        else {
            for (var a = new Array, r = 0; r < e.actions.length; r++) i = e.actions[r], a.push({
                text: "<i class='icon iconHide'></i>" + i.Caption
            });
            t(function () {
                if (document.body.lastChild && document.body.lastChild.firstChild) {
                    var e = window.getComputedStyle(document.body.lastChild.firstChild);
                    "matrix(1, 0, 0, 1, 0, 0)" != e["-webkit-transform"] && (document.body.lastChild.firstChild.style["-webkit-transform"] = "matrix(1, 0, 0, 1, 0, 0)")
                }
            }, 500), o.show({
                buttons: a,
                titleText: atrans("workflowactions", "Workflow acties"),
                cancelText: atrans("cancel", "Annuleren"),
                cancel: function () {},
                buttonClicked: function (t) {
                    var i = e.actions[t];
                    i.isEdit ? e.doEditAction(i) : 164 == i.ActionTypeId ? n.go("menu.subjectsign", {
                        subjectId: B,
                        actionId: i.ActionId
                    }, {
                        reload: !0
                    }) : n.go("menu.subjectactions", {
                        subjectId: B,
                        actionId: i.ActionId
                    }, {
                        reload: !0
                    })
                }
            })
        }
    }
}]).controller("SubjectSignController", ["$scope", "$stateParams", "$timeout", "$state", "$ionicHistory", "SharedSubjectServiceFactory", "ConfigService", "TaskService", function (e, t, n, i, o, a, r, c) {
    function s(e, t, n) {
        var i = inlineDocType(n.filename);
        if (null != i && (n.showInlineContent = !0), n.size <= 5e4) {
            var o = n.filename.toLowerCase().substring(n.filename.lastIndexOf("."));
            (".jpg" == o || ".jpeg" == o || ".svg" == o || ".png" == o || ".gif" == o || ".bmp" == o) && (n.type = "img", ConnectorService.getFileData(n, "guid", "filename").then(function (e) {
                for (var n = 0; n < t.length; n++) e.guid == t[n].guid && (t[n].imageUrl = "data:" + e.mimetype + ";base64," + e.filedata)
            }))
        }
    }

    function l(t) {
        r.getConfig().then(function (n) {
            u.getSignAttachments(t).then(function (i) {
                if (i.length > 0) {
                    t.attachments = [];
                    for (var o = 0, a = 0; a < i.length; a++) {
                        var r = {};
                        r.type = "file", r.filename = i[a].file_name, r.SignableFilesId = i[a].SignableFilesId, r.guid = i[a].file_id, r.size = i[a].file_size, "undefined" == typeof e.selected[r.guid] && (e.selected[r.guid] = !0), r.selected = e.selected[r.guid], r.mustConvert = i[a].mustConvert, r.selected && r.mustConvert && o++, s(n, t.attachments, r), t.attachments.push(r)
                    }
                    t.mustConvert = o > 0, e.checkJobs(d), e.subjectready = !0
                } else t.attachments = void 0, e.subjectready = !0
            })
        })
    }
    var u = a.getSubjectService(),
        d = t.subjectId,
        f = t.actionId;
    e.subjectready = !1, e.signCodePlaceholder = atrans("SMScode", "Voer SMS Code in"), e.selected = {};
    var m = null;
    e.$on("$ionicView.leave", function (e) {
        null != m && (n.cancel(m), m = null)
    }), e.$on("$ionicView.enter", function (t) {
        c.getTaskBySubject(d, !0).then(function (t) {
            e.subject = t, l(e.subject), u.getSignerVerificationData(e.subject).then(function (t) {
                e.info = t
            }), e.subject.sign = !1, e.subject.signed = !1, e.subject.aftersigned = !1, e.subject.signreqid = null, e.subject.signstatus = "", e.subject.signfinished = !1, e.subject.signcode = "", e.subject.waitingforsign = !1, e.subject.signfinishing = !1;
            var n = SessionStorage.getItem("signed");
            null != n && n == e.subject.guid && (e.subject.signreqid = SessionStorage.getItem("signreqid"), e.subject.waitingforsign = !0, e.checkJobs())
        })
    }), e.proceed = function () {
        e.info && e.info.AlreadySigned && i.go("menu.subjectactions", {
            subjectId: e.subject.guid,
            actionId: f
        }, {
            reload: !0
        })
    }, e.checkConvertStatus = function () {
        u.getConvertStatus(e.subject).then(function () {
            e.subject.mustConvert ? "Failed" != e.subject.convstatus && (null != m && (n.cancel(m), m = null), m = n(function () {
                e.checkJobs(e.subject.guid)
            }, 500)) : l(e.subject)
        })
    }, e.selectchange = function () {
        for (var t = 0, n = 0; n < e.subject.attachments.length; n++) e.selected[e.subject.attachments[n].guid] = e.subject.attachments[n].selected, e.subject.attachments[n].mustConvert && e.subject.attachments[n].selected && t++;
        e.subject.mustConvert = t > 0
    }, e.checkSignStatus = function () {
        u.getSignStatus(e.subject).then(function () {
            "Busy" == e.subject.signstatus && (null != m && (n.cancel(m), m = null), m = n(function () {
                e.checkJobs(e.subject.guid)
            }, 5e3))
        })
    }, e.checkSignStatus2 = function () {
        if (e.subject.signed) null != m && (n.cancel(m), m = null), u.getSignStatus2(e.subject).then(function () {
            "Busy" == e.subject.signstatus ? (null != m && (n.cancel(m), m = null), m = n(function () {
                e.checkJobs(e.subject.guid)
            }, 5e3)) : e.subject.signfinished && i.go("menu.subjectactions", {
                subjectId: e.subject.guid,
                actionId: f
            }, {
                reload: !0
            })
        });
        else {
            var t = SessionStorage.getItem("signed");
            null != t && t == e.subject.guid && (SessionStorage.removeItem("signed"), e.subject.signreqid = SessionStorage.getItem("signreqid"), SessionStorage.removeItem("signreqid"), e.subject.waitingforsign = !0, u.executeSign(e.subject).then(function () {})), null != m && (n.cancel(m), m = null), m = n(function () {
                e.checkJobs(e.subject.guid)
            }, 5e3)
        }
    }, e.sendAgain = function () {
        e.subject.signcode = "", u.sendAgain(e.subject)
    }, e.convertDocs = function () {
        u.convertDocs(e.subject).then(function () {
            e.checkJobs(e.subject.guid)
        })
    }, e.startSign = function () {
        e.subject.sign = !1, e.subject.signreqid = null, e.subject.signstatus = "", e.subject.signfinished = !1, e.subject.signed = !1, e.subject.signcode = "", e.subject.waitingforsign = !1, e.subject.signfinishing = !1, u.startSign(e.subject).then(function () {
            e.checkJobs(e.subject.guid)
        })
    }, e.executeSign = function () {
        u.excuteSign(e.subject).then(function () {
            e.checkJobs(e.subject.guid)
        })
    }, e.sendCode = function () {
        u.sendCode(e.subject).then(function () {
            e.subject.sign && (SessionStorage.setItem("signreqid", e.subject.signreqid), SessionStorage.setItem("hasEnteredPin", "0"), i.go("pin", {}, {
                reload: !0
            }), null != m && (n.cancel(m), m = null), m = n(function () {
                e.subject.waitingforsign = !0, e.checkJobs(e.subject.guid)
            }, 1e3))
        })
    }, e.checkJobs = function (t) {
        var n = LocalStorage.getItem("jobstore");
        isNotEmpty(n) && !e.subject.signreqid && (n = JSON.parse(n), n.guid == t && (e.subject.jobstore = n, e.checkConvertStatus())), n = LocalStorage.getItem("signjobstore"), isNotEmpty(n) && !e.subject.signreqid && (n = JSON.parse(n), n.guid == t && (e.subject.signjobstore = n, e.checkSignStatus())), e.subject.signreqid && e.checkSignStatus2()
    }
}]).controller("SubjectReactionController", ["$scope", "$stateParams", "$timeout", "$state", "$ionicHistory", "SharedSubjectServiceFactory", "TaskService", "$ionicActionSheet", "PictureService", function (e, t, n, i, o, a, r, c, s) {
    function l() {
        var t = !0;
        return void 0 == e.form.reactionText && (e.error[0] = atrans("noreactionspecified", "Vul een reactie in"), t = !1), t && (e.error = !1), t
    }
    var u = t.subjectId,
        d = a.getSubjectService(),
        f = document.getElementById("fileBrowser"),
        m = !1;
    e.file_attached = !1, e.form = {}, e.error = [], e.pageTitle = atrans("newreaction", "Nieuwe reactie"), e.attachment_type = "file", e.setupFile = function (t) {
        document.getElementById("fileBrowser").onchange = function (n) {
            e.filePickedGeneric(n, t, e)
        }
    }, e.$on("$ionicView.beforeEnter", function () {
        u && r.getTaskBySubject(u).then(function (t) {
            e.subject = t
        }), e.reactionTypes = [{
            caption: atrans("internalreaction", "Intern"),
            value: "I"
        }, {
            caption: atrans("inexternalreaction", "Intern en extern"),
            value: "EI"
        }], e.form.reactionType = e.reactionTypes[0], e.reactionplaceholder = atrans("reactionplaceholder", "Typ uw reactie hier...")
    }), e.showFileActions = function (t) {
        e.showFileActionsGeneric(t, e)
    }, e.showAttachment = function () {
        e.file_attached && "img" == e.attachment_type && e.showImage(document.getElementById("reaction_attachment").src)
    }, e.deleteAttachment = function () {
        "" != document.getElementById("reaction_attachment").src && e.file_attached && confirm(atrans("deletedeclarationphoto", "Wil je deze foto verwijderen?")) && (e.form.fileURI = void 0, document.getElementById("fileBrowser").form.reset(), document.getElementById("reaction_attachment").src = "", e.file_attached = !1)
    }, e.addReaction = function () {
        l() && !m && (m = !0, d.addReaction(u, f, e.form).then(function () {
            e.form.fileURI = void 0, document.getElementById("fileBrowser").form.reset(), document.getElementById("reaction_attachment").src = "", e.form = {}, SessionStorage.setItem("lastTaskReactionAdded", u), o.goBack()
        })["finally"](function () {
            m = !1
        }))
    }
}]).controller("SubjectActionController", ["$scope", "$rootScope", "$timeout", "$stateParams", "$state", "$ionicPopup", "TaskService", "SearchService", "ModalSearchService", "SharedSubjectServiceFactory", "UserService", "PictureService", "ConfigService", function (e, t, n, i, o, a, r, c, s, l, u, d, f) {
    function m() {
        var t = !0;
        return e.error = [], void 0 !== e.form.action ? void 0 !== e.form.action.UserRequiredOnHandle && e.form.action.UserRequiredOnHandle && void 0 == e.form.user && (e.error[0] = !0, t = !1) : t = !1, t && (e.error = !1), t
    }
    var g, b = i.subjectId,
        h = i.actionId,
        S = document.getElementById("fileBrowser"),
        p = !1;
    e.userPlaceholder = atrans("nouserspecified", "Kies een gebruiker"), e.form = {}, e.attachment_type = "file", e.form_modal = {}, e.pageTitle = atrans("subjectactionconfirm", "Bevestig workflowactie");
    var v = l.getSubjectService();
    e.$on("$ionicView.afterEnter", function () {
        e.stamped = !0
    }), e.setupFile = function (t) {
        document.getElementById("fileBrowser").onchange = function (n) {
            e.filePickedGeneric(n, t, e)
        }
    }, e.$on("$ionicView.beforeEnter", function () {
        e.stamped = !1, b && (r.getTaskBySubject(b).then(function (t) {
            f.getConfig().then(function (n) {
                e.subject = t, e.form.workflowid = t.guid_workflow, e.form.taskid = t.guid_task, -1 !== n.modules.indexOf(1) && v.getWorkflowActions(b).then(function (t) {
                    var n;
                    if (null != t && null != t.rows && t.rows.length > 0) {
                        for (n = 0; n < t.rows.length; n++)
                            if (-36 == e.subject.subjecttype && 79 == t.rows[n].ActionTypeId) {
                                t.rows.splice(n, 1);
                                break
                            } for (e.actions = t.rows, n = 0; n < e.actions.length; n++)
                            if (e.actions[n].ActionId == h) {
                                e.form.action = e.actions[n];
                                break
                            }
                    }
                })
            })
        }), e.form.reactionType = e.reactionTypes[0])
    }), e.$on("$ionicView.enter", function () {
        document.getElementById("actionComment").focus()
    }), e.reactionTypes = [{
        caption: atrans("internalreaction", "Intern"),
        value: "I"
    }, {
        caption: atrans("inexternalreaction", "Intern en extern"),
        value: "EI"
    }], e.reactionplaceholder = atrans("reactionplaceholder", "Typ uw reactie hier..."), e.userplaceholder = atrans("chooseuserplaceholder", "Kies gebruiker..."), u.getUser().then(function (t) {
        e.user = t
    }), e.showFileActions = function (t) {
        e.showFileActionsGeneric(t, e)
    }, e.showAttachment = function () {
        e.file_attached && "img" == e.attachment_type && e.showImage(document.getElementById("action_attachment").src)
    }, e.deleteAttachment = function () {
        "" != document.getElementById("action_attachment").src && e.file_attached && confirm(atrans("deletedeclarationphoto", "Wil je deze foto verwijderen?")) && (e.form.fileURI = void 0, document.getElementById("fileBrowser").form.reset(), document.getElementById("action_attachment").src = "", e.file_attached = !1)
    }, e.executeAction = function () {
        return 221 == e.form.action.ActionTypeId || 222 == e.form.action.ActionTypeId || 223 == e.form.action.ActionTypeId ? void a.alert({
            title: atrans("error", "Foutmelding"),
            template: atrans("actiontypenotsup", "Het afhandelen van deze actie is (nog) niet mogelijk met Pocket, gebruik hiervoor InSite.")
        }) : void(m() && !p && (p = !0, r.executeAction(b, S, e.form).then(function () {
            e.form = {}, e.form.fileURI = void 0, document.getElementById("fileBrowser").form.reset(), document.getElementById("action_attachment").src = "", SessionStorage.setItem("lastTaskChanged", b), v.getWorkflowActions(b).then(function (t) {
                null != t && null != t.rows && t.rows.length > 0 ? e.isLandscape() ? e.gotoPage("menu.tasklist") : o.go("menu.subject", {
                    subjectId: b,
                    from: "action"
                }, {
                    reload: !0
                }) : e.gotoPage("menu.tasklist")
            })
        })["finally"](function () {
            p = !1
        })))
    }, e.openModal = function (t) {
        s.openModal(e, t)
    }, e.closeModal = function () {
        t.currentModal = null, e.modal.hide()
    }, e.showhide = function () {
        e.hidden = !e.hidden
    }, e.search = function (t) {
        s.search(e, t)
    }, e.loadMore = function () {
        s.loadMore(e)
    }, e.clearSearch = function (t) {
        s.clearSearch(e)
    }, e.clickRecent = function (t) {
        e.modal.query = t, s.search(e, t)
    }, e.ShowRecentSearches = function () {
        s.ShowRecentSearches(e)
    }, e.HideRecentSearches = function () {
        s.HideRecentSearches(e)
    }, e.selectTab = function (t) {
        e.modal && !e.modal.loading && (e.modal.showType = t)
    }, e.validateEntry = function (t) {
        g && n.cancel(g), g = n(function () {
            e.form.user = null, t.length > 1 && (e.form.user = {
                username: t
            }, u.validateEntry(t).then(function (t) {
                e.selectUser(t)
            })), g = null
        }, 800)
    }, e.selectUser = function (t) {
        e.form.user = t, c.setRecentlySelected(t, "recent_users"), e.modal && e.modal.hide()
    }
}]).controller("NewSubjectController", ["$scope", "SharedSubjectServiceFactory", "$state", "$timeout", "SearchService", "ModalSearchService", "maxListTake", "UserService", "$ionicScrollDelegate", "question", function (e, t, n, i, o, a, r, c, s, l) {
    var u, d = t.getSubjectService(),
        f = n.params.subjectProfile,
        m = {
            SubjectService: d
        };
    e.pageTitle = atrans("chooseSubjectType", "Nieuw dossieritem"), e.attachment_type = "", e.setupFile = function (t) {
        document.getElementById("fileBrowser").onchange = function (n) {
            e.filePickedGeneric(n, t, e)
        }
    }, e.$on("$ionicView.beforeEnter", function () {
        s.$getByHandle("main").scrollTop(!0), f = n.params.subjectProfile, e.info = null, e.multipleattach = !0, e.form = {}, e.form.errorfld = {}, e.form.attachments = [], e.form.DtFr = null, e.form.DtTo = null, e.form.DtSt = null, e.infoLoaded = !1, null != f ? (s.resize(), e.title = f.Description, c.getUser().then(function (t) {
            d.getSubjectInfo(f.Id).then(function (i) {
                if (parseInfo(e, i, t, !1, "validateEntry"), !n.params.fillInData || "undefined" == typeof n.params.fillInData.S_Em && "undefined" == typeof n.params.fillInData.S_Bc || e.info.CrDe.visible && (e.form.CrDe = !0), e.screenview(), n.params.fillInData && "undefined" != typeof n.params.fillInData.S_Em) {
                    if (e.info.SfId.visible && e.info.SfIdView)
                        for (var o = 0; o < e.info.SfIdView.rows.length; o++) 2 == e.info.SfIdView.rows[o].id && (e.form.SfId = e.info.SfIdView.rows[o]);
                    e.screenview(), e.form.S_Em = n.params.fillInData.S_Em, e.form.S_Em_entry = n.params.fillInData.S_Em.id
                }
                if (n.params.fillInData && "undefined" != typeof n.params.fillInData.S_Bc) {
                    if (e.info.SfId.visible && e.info.SfIdView)
                        for (var o = 0; o < e.info.SfIdView.rows.length; o++) 3 == e.info.SfIdView.rows[o].id && (e.form.SfId = e.info.SfIdView.rows[o]);
                    e.screenview(), e.validateEntry(n.params.fillInData.S_Bc.id, "S_Bc", function () {
                        n.params.fillInData.S_Cd && e.validateEntry(n.params.fillInData.S_Cd.id, "S_Cd")
                    })
                }
                e.checkForOSAttachments(e.form)
            }, function () {
                e.previousPage()
            })["finally"](function () {
                e.infoLoaded = !0
            })
        })) : (e.infoLoaded = !0, e.previousPage())
    }), e.addAttachment = function (t) {
        e.showFileActionsGeneric(t, e)
    }, e.specialtransSFID = function (e, t) {
        switch (e) {
        case 2:
            return atrans("sfidemployee", "Medewerker");
        case 3:
            return atrans("sfidorgpers", "Organisatie/persoon");
        case 4:
            return atrans("sfidsalerelation", "Verkooprelatie");
        case 8:
            return atrans("sfidclientib", "Cliënt IB");
        case 9:
            return atrans("sfidclientvpb", "Cliënt VPB");
        case 10:
            return atrans("sfidemployer", "Werkgever");
        case 11:
            return atrans("sfidpurrelation", "Inkooprelatie");
        case 17:
            return atrans("sfidapplicant", "Sollicitant")
        }
        return t
    }, e.showAttachment = function (t) {
        "img" == t.type && e.showImage(t.src)
    }, e.deleteAttachment = function (t) {
        "" != t.src && e.file_attached && l(atrans("deletesubattach", "Wil je deze bijlage verwijderen?")).then(function (n) {
            if (n) {
                var i = e.form.attachments.indexOf(t); - 1 != i && e.form.attachments.splice(i, 1)
            }
        })
    }, e.openModalforField = function (t) {
        function n(e) {
            switch (e) {
            case "EmId":
                return "S_Em"
            }
            return e
        }
        if (m.fieldId = t, m.info = e.info, m.form = e.form, e.info[t]) {
            if (m.searchview = e.info[t].searchview, m.searchview.filter = e.info[t].filter, m.searchview.fromfieldId1) {
                var i = n(m.searchview.fromfieldId1);
                m.searchview.fieldValue2 = formvalue(e.form[i], e.info[i])
            } else e.form[m.searchview.fieldId2] && (m.searchview.fieldValue2 = formvalue(e.form[m.searchview.fieldId2], e.info[m.searchview.fieldId2]));
            if (m.searchview.fromfieldId2) {
                var o = n(m.searchview.fromfieldId2);
                m.searchview.fieldValue3 = formvalue(e.form[o], e.info[o])
            } else e.form[m.searchview.fieldId3] && (m.searchview.fieldValue3 = formvalue(e.form[m.searchview.fieldId3], e.info[m.searchview.fieldId3]))
        } else
            for (var r in e.info.custom)
                if (e.info.custom.hasOwnProperty(r) && e.info.custom[r][t]) {
                    m.searchview = e.info.custom[r][t].searchview;
                    break
                } a.openModal(e, "Pocket_SubjectFields", m)
    }, e.closeModal = function () {
        $rootScope.currentModal = null, e.modal.hide()
    }, e.search = function (t) {
        a.search(e, t, m)
    }, e.loadMore = function () {
        a.loadMore(e, m)
    }, e.clearSearch = function (t) {
        a.clearSearch(e)
    }, e.clickRecent = function (t) {
        e.modal.query = t, a.search(e, t, m)
    }, e.ShowRecentSearches = function () {
        a.ShowRecentSearches(e, m)
    }, e.HideRecentSearches = function () {
        a.HideRecentSearches(e)
    }, e.selectTab = function (t) {
        e.modal && !e.modal.loading && (e.modal.showType = t)
    }, e.validateEntryDelayed = function (t, n, o) {
        u && i.cancel(u), u = i(function () {
            u = null, e.validateEntry(t, n, o)
        }, o ? 100 : 800)
    }, e.validateEntry = function (t, n, i) {
        if (e.form[n] = null, "S_Bc" == n && e.info.S_Cd && (e.info.S_Cd.visible = !0), "string" != typeof t && (t = String(t)), t.length > 0) {
            if (e.form[n] = {
                    id: t
                }, m.fieldId = n, e.info[n]) m.searchview = e.info[n].searchview;
            else
                for (var o in e.info.custom)
                    if (e.info.custom.hasOwnProperty(o))
                        for (var a in e.info.custom[o]) e.info.custom[o].hasOwnProperty(a) && e.info.custom[o][a] && e.info.custom[o][a].searchview && (m.searchview = e.info.custom[o][a].searchview);
            m.info = e.info, m.form = e.form, m.onlyId = !0, d.searchForField(m, t, 0, r).then(function (n) {
                for (var i = n.rows, o = 0; o < i.length; o++)
                    if (i[o]._id == t) return void e.selectItem(i[o]);
                i && i.length > 0 && e.selectItem(i[0])
            })["finally"](function () {
                i && i()
            })
        } else i && i()
    }, e.validateEntry2Delayed = e.validateEntryDelayed, e.validateEntry2 = e.validateEntry, e.postSubject = function () {
        function t() {
            if (e.form.SfTp) switch (parseInt(e.form.SfTp.id, 10)) {
            case 2:
                if (n("S_Em"), e.form.S_Em) return {
                    id: e.form.S_Em.id
                };
                break;
            case 3:
                if (n("S_Bc"), e.form.S_Bc) return {
                    id: e.form.S_Bc._fixed_KnBcnBcId
                };
                break;
            case 4:
                if (n("S_Db"), e.form.S_Db) return {
                    id: e.form.S_Db.id
                };
                break;
            case 8:
                if (n("S_Cl"), e.form.S_Cl) return {
                    id: e.form.S_Cl.id
                };
                break;
            case 9:
                if (n("S_Cm"), e.form.S_Cm) return {
                    id: e.form.S_Cm.id
                };
                break;
            case 10:
                if (n("S_Er"), e.form.S_Er) return {
                    id: e.form.S_Er.id
                };
                break;
            case 11:
                if (n("S_Cr"), e.form.S_Cr) return {
                    id: e.form.S_Cr.id
                };
                break;
            case 17:
                if (n("S_Ap"), e.form.S_Ap) return {
                    id: e.form.S_Ap.id
                }
            }
            return null
        }

        function n(t) {
            e.info[t] && e.info[t].mandatory && (null == e.form[t] || "" == e.form[t].id) && (e.form.errorfld[t] = atrans("mandatory", "Verplicht veld '{0}' niet ingevuld ", e.info[t].label), e.haserror = !0)
        }
        if (e.form.errorfld = {}, e.haserror = !1, e.info.DoCRM = {
                element: "KnSubjectLink"
            }, e.form.DoCRM = e.form.CrDe, e.form.SfId || e.info.SfId) {
            null == e.form.SfId && e.info.SfId && e.info.SfId.value && (e.form.SfId = {
                id: e.info.SfId.value
            });
            var i = e.form.SfId;
            e.form.SfId && null != e.form.SfId.id && (e.form.SfTp = {
                id: e.form.SfId.id
            }, e.info.SfTp || (e.info.SfTp = {
                element: "KnSubjectLink"
            })), e.form.PostSfId = t(), e.info.PostSfId = {
                element: "KnSubjectLink"
            }, e.info.SfId && (e.info.SfId.element = ""), d.postSubject(e).then(function () {
                e.gotoPage("menu.home")
            })["finally"](function () {
                e.form.SfId = i
            })
        } else d.postSubject(e).then(function () {
            e.gotoPage("menu.home")
        })
    }, e.selectItem = function (t) {
        e.form[t.fieldId] = {
            id: t._id,
            name: t._name
        }, e.form[t.fieldId + "_entry"] = t._id, o.setRecentlySelected(t, "recent_subj_" + e.info.type + "_" + t.fieldId), e.form.errorfld[t.fieldId] = "";
        for (var n in t) t.hasOwnProperty(n) && -1 != n.indexOf("_fixed_") && (e.form[t.fieldId][n] = t[n]);
        "S_Cd" == t.fieldId && (e.info.CdId = {
            element: "KnSubjectLink"
        }, e.form.CdId = {
            id: t._id
        }), "S_Bc" == t.fieldId && e.info.S_Cd && ("PER" == t._fixed_KnBcnViKi ? (e.info.S_Cd.visible = !1, e.info.S_Cd.mandatory = !1) : (e.info.S_Cd.visible = !0, e.info.S_Cd.mandatory = 1 == e.info.sbfmandatory[16])), "S_Db" == t.fieldId && e.info.S_Cd && (e.info.S_Cd.visible = !0, e.info.S_Cd.mandatory = 1 == e.info.sbfmandatory[18]), "S_Cr" == t.fieldId && e.info.S_Cd && (e.info.S_Cd.visible = !0, e.info.S_Cd.mandatory = 1 == e.info.sbfmandatory[19]), e.modal && e.modal.hide()
    }, e.screenview = function () {
        function t(t, n, i) {
            e.info[t] && (e.info[t].visible = n, n && (e.info[t].enabled = !0), n || (e.form[t] = null, e.form[t + "_entry"] = ""), i ? e.info[t].mandatory = !0 : e.info[t].mandatory = !1)
        }
        if ("undefined" != typeof e.info.CrDe && e.info.CrDe.visible && t("SfId", e.form.CrDe), t("S_Em", !1), t("S_Bc", !1), t("S_Cd", !1), t("S_Db", !1), t("S_Cl", !1), t("S_Cm", !1), t("S_Er", !1), t("S_Cr", !1), t("S_Ap", !1), t("DvSn", !1), t("AbId", !1), t("Ou", !1), t("SiId", !1), t("SuNr", !1), t("PiUn", !1), t("Squ", !1), t("Sor", !1), t("Squ", !1), t("FiYe", !1), t("PlId", !1), t("PiId", !1), t("CoNo", !1), t("Por", !1), e.info.InputFvF1 && (e.info.InputFvF1.enabled = e.info.InputFvF1.visible), e.info.InputFvF2 && (e.info.InputFvF2.enabled = e.info.InputFvF2.visible), e.info.InputFvF3 && (e.info.InputFvF3.enabled = e.info.InputFvF3.visible), e.form.SfId) switch (parseInt(e.form.SfId.id, 10)) {
        case 2:
            t("S_Em", !0, !0), e.info.sbfenabled[37] && t("DvSn", !0), e.info.sbfenabled[38] && t("AbId", !0), e.info.sbfenabled[44] && t("Ou", !0);
            break;
        case 3:
            t("S_Bc", !0, !0), t("S_Cd", !0);
            break;
        case 4:
            t("S_Db", !0, !0), e.info.sbfenabled[13] && t("SiId", !0), e.info.sbfenabled[18] && t("S_Cd", !0), e.info.sbfenabled[36] && t("SuNr", !0), e.info.sbfenabled[39] && t("PiUn", !0), e.info.sbfenabled[49] && t("Squ", !0), e.info.sbfenabled[50] && t("Sor", !0);
            break;
        case 8:
            t("S_Cl", !0, !0), e.info.sbfenabled[14] && t("FiYe", !0);
            break;
        case 9:
            t("S_Cm", !0, !0), t("S_Cd", !0), e.info.sbfenabled[15] && t("FiYe", !0);
            break;
        case 10:
            t("S_Er", !0, !0), e.info.sbfenabled[24] && t("S_Cd", !0), e.info.sbfenabled[45] && t("PlId", !0);
            break;
        case 11:
            t("S_Cr", !0, !0), e.info.sbfenabled[12] && t("PiId", !0), e.info.sbfenabled[19] && t("S_Cd", !0), e.info.sbfenabled[42] && t("CoNo", !0), e.info.sbfenabled[48] && t("Por", !0);
            break;
        case 17:
            t("S_Ap", !0, !0)
        }
    }
}]).controller("NewSubjectsController", ["$scope", "$state", "$ionicScrollDelegate", "SharedSubjectServiceFactory", "MultipleViewsManager", "maxListTake", "$timeout", "$ionicTabsDelegate", "DocumentSessionService", function (e, t, n, i, o, a, r, c, s) {
    function l(i) {
        return d.getSubjectProfiles(i, f, a, t.params.fillInData).then(function (t) {
            var n;
            for (("undefined" == typeof e.subjectProfiles || 0 == e.subjectProfiles.length) && (e.subjectProfiles = []), e.showmore = t.length >= a, f += t.length, n = 0; n < t.length; n++) e.subjectProfiles.push(t[n]);
            var i = [];
            for (n = 0; n < e.subjectProfiles.length; n++) i.push({
                title: e.subjectProfiles[n].Description,
                param: e.subjectProfiles[n],
                "goto": e.create
            });
            e.speakItems && e.speakItems(i), e.$broadcast("scroll.infiniteScrollComplete")
        })["finally"](function () {
            e.loadingMore = !1, e.$broadcast("scroll.refreshComplete"), r(function () {
                n.$getByHandle("subjectProfiles").resize()
            }, 10)
        })
    }

    function u() {
        return d.getSubjectsSubmitted(m, a).then(function (t) {
            e.showmoreSent = t.length - m >= a, m = t.length, e.subjectsSubmitted = t, e.$broadcast("scroll.infiniteScrollComplete")
        })["finally"](function () {
            e.loadingMoreSent = !1, e.$broadcast("scroll.refreshComplete"), r(function () {
                n.$getByHandle("submittedSubjects").resize()
            }, 10)
        })
    }
    var d = i.getSubjectService();
    e.fetchData = {}, e.showMore = !1, e.loadingMore = !1, e.showMoreSent = !1, e.loadingMoreSent = !1;
    var f, m;
    e.pageTitle = atrans("submitdossier", "Insturen"), e.tabTitle0 = atrans("newsubject", "Dossieritem insturen"), e.tabTitle1 = atrans("subsent", "Ingestuurd"), e.$on("$ionicSlides.sliderInitialized", function (t, n) {
        e.slider = n.slider
    }), e.$on("$ionicSlides.slideChangeStart", function (e, t) {
        r(function () {
            c.$getByHandle("tabssubjects").select(t.slider.activeIndex)
        }, 1)
    }), e.$on("$ionicView.unloaded", function () {
        e.slider = void 0
    }), e.selectTab = function (t) {
        e.slider && e.slider.activeIndex != t && e.slider.slideTo(t)
    }, e.scrollTop = function () {
        r(function () {
            n.$getByHandle("main").scrollTop(!0)
        }, 10)
    }, e.$on("$ionicView.beforeEnter", function () {
        ("undefined" == typeof e.subjectProfiles || 0 == e.subjectProfiles.length) && (f = 0, l(!1)), ("undefined" == typeof e.subjectsSubmitted || 0 == e.subjectsSubmitted.length) && (m = 0, u())
    }), e.$on("$ionicView.enter", function () {}), e.scrollTop = function () {
        n.$getByHandle("subjectProfiles").scrollTop(!0)
    }, e.refresh = function () {
        f = 0, e.subjectProfiles = [], l(!0)
    }, e.refreshSent = function () {
        m = 0, e.loadingMoreSent = !0, u()
    }, e.loadMore = function () {
        e.loadingMore || (e.loadingMore = !0, l())
    }, e.loadMoreSent = function () {
        e.loadingMoreSent || (e.loadingMoreSent = !0, u())
    }, e.create = function (e) {
        t.go("menu.newsubject", {
            subjectProfile: e,
            fillInData: t.params.fillInData
        }, {
            reload: !0
        })
    }, e["goto"] = function (e) {
        t.go("menu.subject", {
            subjectId: e
        })
    }
}]);