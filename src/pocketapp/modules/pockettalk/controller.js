angular.module("pockettalk.controller", ["AfasServices"]).controller("PocketTalkController", ["$scope", "$rootScope", "$state", "Chats", function (e, t, o, r) {
    e.$on("$ionicView.beforeEnter", function () {
        t.pocketChatLoggedIn && (e.chats = r.allRoster()), e.remove = function (e) {
            r.removeRoster(e)
        }, e.chatDetails = function (e) {
            o.go("menu.pockettalkdetails", {
                chat: e
            }, {
                location: "replace",
                reload: !0
            })
        }, e.add = function (e) {
            r.addNewRosterContact(e)
        }
    })
}]).controller("PocketTalkDetailsController", ["$scope", "$state", "sharedConn", "$ionicScrollDelegate", "ConnectorService", function (e, t, o, r, a) {
    function i(e) {
        var t = {};
        t.text = e, t.isImage = !1, t.isDoc = !1;
        var o = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,
            r = e.match(o);
        if (r) {
            t.url = r[0];
            var a = r[0].toLowerCase().substring(r[0].lastIndexOf("."));
            (".jpg" == a || ".jpeg" == a || ".svg" == a || ".png" == a || ".gif" == a || ".bmp" == a) && (t.image = r[0], t.isImage = !0), -1 != ".pdf.doc.docx.ppt.pptx.xls.xlsx".indexOf(a) && (t.isDoc = !0)
        }
        return t
    }

    function n(e, t) {
        for (var o = 0; o < e.length; o++)
            if (e[o].id == t) return !0;
        return !1
    }
    e.$on("$ionicView.afterEnter", function () {
        r.scrollBottom(!0)
    }), e.$on("$ionicView.beforeEnter", function () {
        e.chat = t.params.chat, e.chatback = !0, e.form = {}, e.mdEdit = {}, e.mdText = {}, e.textplaceholder = atrans("messageplaceholder", "Typ uw bericht hier..."), e.chat && (e.messages = [], e.myId = Strophe.getBareJidFromJid(o.getConnectObj().jid), e.to_id = Strophe.getBareJidFromJid(e.chat.id), o.connection.mam.query(o.getBareJid(), {
            "with": e.to_id,
            onMessage: function (t) {
                var o = t.querySelector("forwarded message"),
                    r = t.querySelector("forwarded delay"),
                    a = o.querySelector("body");
                if (null != a) {
                    var s;
                    null != r && (s = parseDateString(r.getAttribute("stamp")));
                    var c = o.getAttribute("id"),
                        d = i(Strophe.getText(a));
                    n(e.messages, c) || e.messages.push({
                        userId: Strophe.getBareJidFromJid(o.getAttribute("from")),
                        text: d.text,
                        isImage: d.isImage,
                        isDoc: d.isDoc,
                        image: d.image,
                        url: d.url,
                        id: c,
                        date: s
                    })
                }
                return !0
            },
            onComplete: function (e) {}
        }))
    }), e.openUrl = function (e) {
        openUrlGlobal(e)
    }, e.addAttachment = function (t) {
        e.showFileActionsGeneric(t, e, function () {})
    }, e.setupFile = function (t) {
        document.getElementById("fileBrowser").onchange = function (o) {
            e.filePickedGeneric(o, t, e)
        }
    }, e.isToday = function (e) {
        var t = fromGMTDate(e),
            o = getGMTDate(new Date);
        return t.getDate() == o.getDate() && t.getMonth() == o.getMonth() && t.getFullYear() == o.getFullYear()
    }, e.sendMsg = function (e, t) {
        var r = Strophe.getBareJidFromJid(e),
            a = (new Date).getTime(),
            i = $msg({
                id: a,
                to: r,
                type: "chat"
            }).c("body").t(t);
        o.getConnectObj().send(i.tree())
    }, e.showSendMessage = function () {
        e.sendMsg(e.to_id, e.form.messageText);
        var t = getGMTDate(new Date);
        e.messages.push({
            id: "new",
            userId: e.myId,
            text: e.form.messageText,
            isImage: !1,
            isDoc: !1,
            date: t
        }), delete e.form.messageText, r.scrollBottom(!0)
    }, e.messageRecieve = function (t) {
        var o = Strophe.getBareJidFromJid(t.getAttribute("from")),
            a = t.getAttribute("type"),
            s = t.getElementsByTagName("body");
        if ("chat" == a && s.length > 0) {
            var c = s[0],
                d = Strophe.getText(c),
                g = t.getAttribute("id"),
                l = i(d);
            n(e.messages, g) || e.messages.push({
                id: g,
                userId: o,
                text: l.text,
                isImage: l.isImage,
                isDoc: l.isDoc,
                url: l.url,
                image: l.image,
                date: new Date
            }), r.scrollBottom(!0), e.$apply()
        }
    }, e.$on("msgRecievedBroadcast", function (t, o) {
        e.messageRecieve(o)
    }), e.inputUp = function () {
        isIOS && (e.data.keyboardHeight = 216), $timeout(function () {
            r.scrollBottom(!0)
        }, 300)
    }, e.inputDown = function () {
        isIOS && (e.data.keyboardHeight = 0), r.resize()
    }, e.closeKeyboard = function () {}
}]);