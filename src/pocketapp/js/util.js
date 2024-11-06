function convertEmoji(e) {
    return e.replace(new RegExp(String.fromCharCode(55357, 56832), "g"), ":D").replace(new RegExp(String.fromCharCode(55357, 56836), "g"), ":D").replace(new RegExp(String.fromCharCode(55357, 56842), "g"), ":)").replace(new RegExp(String.fromCharCode(55357, 56898), "g"), ":)").replace(new RegExp(String.fromCharCode(55357, 56848), "g"), ":|").replace(new RegExp(String.fromCharCode(55357, 56883), "g"), ":-o").replace(new RegExp(String.fromCharCode(55357, 56853), "g"), ":S").replace(new RegExp(String.fromCharCode(55357, 56861), "g"), ":p").replace(new RegExp(String.fromCharCode(55357, 56859), "g"), ":p").replace(new RegExp(String.fromCharCode(55357, 56880), "g"), ":(").replace(new RegExp(String.fromCharCode(55357, 56871), "g"), ":@").replace(new RegExp(String.fromCharCode(55357, 56897), "g"), ":|").replace(new RegExp(String.fromCharCode(9785, 65039), "g"), ":(").replace(new RegExp(String.fromCharCode(55357, 56865), "g"), ":-o").replace(new RegExp(String.fromCharCode(55357, 56864), "g"), ":@").replace(new RegExp(String.fromCharCode(55357, 56880), "g"), "+o(").replace(new RegExp(String.fromCharCode(55357, 56846), "g"), "(h)").replace(new RegExp(String.fromCharCode(55358, 56595), "g"), "8-|").replace(new RegExp(String.fromCharCode(55357, 56864), "g"), "8o|").replace(new RegExp(String.fromCharCode(55357, 56841), "g"), ";)")
}

function checkPlugin(e) {
    return (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) && "browser" != ionic.Platform.device().platform && "undefined" != typeof cordova && "undefined" != typeof cordova.plugins && "undefined" != typeof cordova.plugins[e]
}

function getFilenameFromPath(e) {
    var t = e.lastIndexOf("/");
    return -1 != t ? e.substr(t + 1) : e
}

function getFilenameFromItem(e) {
    return "" != e.name && null != e.name ? e.name : e.path ? getFilenameFromPath(e.path) : e.type ? -1 != e.type.indexOf("jpeg") ? "attach.jpg" : -1 != e.type.indexOf("pdf") ? "attach.pdf" : -1 != e.type.indexOf("png") ? "attach.png" : -1 != e.type.indexOf("gif") ? "attach.gif" : -1 != e.type.indexOf("sheet") ? "attach.xlsx" : -1 != e.type.indexOf("document") ? "attach.docx" : -1 != e.type.indexOf("presentation") ? "attach.pptx" : -1 != e.type.indexOf("text") ? "attach.txt" : "attach.bin" : void 0
}

function parseQuery(e) {
    var t = e.split("?"),
        r = 2 == t.length ? t[1] : "",
        e = t[0];
    if ("string" != typeof r || 0 == r.length) return {
        uri: e,
        query: {}
    };
    for (var n, a, o, i = r.split("&"), s = i.length, l = {}, c = 0; s > c; c++) n = i[c].split("="), a = decodeURIComponent(n[0]), 0 != a.length && (o = decodeURIComponent(n[1]), "undefined" == typeof l[a] ? l[a] = o : l[a] instanceof Array ? l[a].push(o) : l[a] = [l[a], o]);
    return {
        query: l,
        uri: e
    }
}

function filenameFromMimeType(e) {
    var t = "default.bin";
    switch (e) {
    case "image/jpeg":
        t = "image.jpg";
        break;
    case "image/png":
        t = "image.png";
        break;
    case "image/gif":
        t = "image.gif";
        break;
    case "application/pdf":
        t = "doc.pdf";
        break;
    case "application/msword":
        t = "doc.pdf";
        break;
    case "application/vnd.ms-excel":
        t = "sheet.xls";
        break;
    case "text/plain":
        t = "doc.txt";
        break;
    case "text/xml":
        t = "doc.xml";
        break;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        t = "sheet.xlsx";
        break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        t = "doc.docx"
    }
    return t
}

function getLangCode() {
    switch (LocalStorage.getItem("language-locale", !0)) {
    case "nl-nl":
        return 1043;
    case "nl-be":
        return 2067;
    case "fr-fr":
        return 1036;
    case "de-de":
        return 1031;
    case "en-us":
        return 2057;
    default:
        return 1043
    }
}

function toFPLocale(e) {
    switch (e) {
    case "nl-nl":
        return "nl";
    case "nl-be":
        return "nl";
    case "fr-fr":
        return "fr";
    case "de-de":
        return "de";
    case "en-us":
        return "en_US";
    default:
        return "en_US"
    }
}

function toSpeechLocale(e) {
    switch (e) {
    case "nl-nl":
        return "nl-NL";
    case "nl-be":
        return "nl-BE";
    case "fr-fr":
        return "fr-FR";
    case "de-de":
        return "de-DE";
    case "en-us":
        return "en-US";
    default:
        return "en-US"
    }
}

function fromGMTDate(e) {
    return new Date(e.valueOf() + 6e4 * e.getTimezoneOffset())
}

function getGMTDate(e) {
    return new Date(e.valueOf() - 6e4 * e.getTimezoneOffset())
}

function setPlaceholder(e) {
    var t;
    for (t in e) e.hasOwnProperty(t) && "eob" != t && "custom" != t && "customZ10" != t && "attachments" != t && (e[t].label && e[t].enabled ? issearchfield(e[t].ctype) ? e[t].placeholder = atrans("generalplaceholdercode", "Typ code van {0} hier", e[t].label.toLowerCase()) : e[t].placeholder = atrans("generalplaceholder", "Typ {0} hier", e[t].label.toLowerCase()) : e[t].placeholder = "");
    for (t in e.custom) e.custom.hasOwnProperty(t) && "eob" != t && e.custom[t].label && (e.custom[t].placeholder = atrans("generalplaceholder", "Typ {0} hier", e.custom[t].label.toLowerCase()));
    for (t in e.customZ10) e.customZ10.hasOwnProperty(t) && "eob" != t && e.customZ10[t].label && (e.customZ10[t].placeholder = atrans("generalplaceholder", "Typ {0} hier", e.customZ10[t].label.toLowerCase()))
}

function showInfoOb(e) {
    return Object.keys(e).map(function (t) {
        return t + ": " + e[t]
    }).join("\r\n")
}

function isVersionOrHigher(e, t) {
    var r = !1,
        n = "undefined" != typeof e.techversion && null != e.techversion && "none" != e.techversion,
        a = n && "2.9.800.4" != e.techversion && "2.9.800.5" != e.techversion && "2.9.800.6" != e.techversion && "2.9.900.1" != e.techversion && "2.9.900.2" != e.techversion && "2.9.900.3" != e.techversion && "2.9.900.4" != e.techversion && "2.9.1000.1" != e.techversion;
    switch (t) {
    case "2016B2PU8":
        r = "undefined" != typeof e.profitversion && null != e.profitversion && "2016.2.6" != e.profitversion;
        break;
    case "2016B2PU10":
        r = "undefined" != typeof e.profitversion && null != e.profitversion && "2016.2.6" != e.profitversion && "2016.2.8" != e.profitversion;
        break;
    case "2016B2PU12":
        r = "undefined" != typeof e.profitversion && null != e.profitversion && "2016.2.6" != e.profitversion && "2016.2.8" != e.profitversion && "2016.2.10" != e.profitversion;
        break;
    case "2018B1PU2":
        r = "undefined" != typeof e.profitversion && null != e.profitversion && ("3." == e.profitversion.substring(0, 2) || "2018." == e.profitversion.substring(0, 5));
        break;
    case "Profit4":
        r = n;
        break;
    case "Profit5":
        r = n && "2.9.800.4" != e.techversion;
        break;
    case "Profit6":
        r = n && "2.9.800.4" != e.techversion && "2.9.800.5" != e.techversion;
        break;
    case "Profit7":
        r = n && "2.9.800.4" != e.techversion && "2.9.800.5" != e.techversion && "2.9.800.6" != e.techversion;
        break;
    case "Profit8":
        r = n && "2.9.800.4" != e.techversion && "2.9.800.5" != e.techversion && "2.9.800.6" != e.techversion && "2.9.900.1" != e.techversion;
        break;
    case "Profit9":
        r = n && "2.9.800.4" != e.techversion && "2.9.800.5" != e.techversion && "2.9.800.6" != e.techversion && "2.9.900.1" != e.techversion && "2.9.900.2" != e.techversion;
        break;
    case "Profit10":
        r = n && "2.9.800.4" != e.techversion && "2.9.800.5" != e.techversion && "2.9.800.6" != e.techversion && "2.9.900.1" != e.techversion && "2.9.900.2" != e.techversion && "2.9.900.3" != e.techversion;
        break;
    case "Profit11":
        r = n && "2.9.800.4" != e.techversion && "2.9.800.5" != e.techversion && "2.9.800.6" != e.techversion && "2.9.900.1" != e.techversion && "2.9.900.2" != e.techversion && "2.9.900.3" != e.techversion && "2.9.900.4" != e.techversion;
        break;
    case "Profit12":
        r = n && "2.9.800.4" != e.techversion && "2.9.800.5" != e.techversion && "2.9.800.6" != e.techversion && "2.9.900.1" != e.techversion && "2.9.900.2" != e.techversion && "2.9.900.3" != e.techversion && "2.9.900.4" != e.techversion && "2.9.1000.1" != e.techversion;
        break;
    case "Profit14":
        r = a && "2.9.1000.2" != e.techversion;
        break;
    case "Profit15":
        r = a && "2.9.1000.2" != e.techversion && "2.9.1000.3" != e.techversion
    }
    return versionsActive[t] = r, r
}

function datediffbyday(e, t) {
    return "undefined" == typeof e || "undefined" == typeof t ? !0 : new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0, 0).valueOf() != new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0).valueOf()
}

function parseDateISOLocal(e) {
    var t = e.split(/\D/);
    return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
}

function parseDateString2(e) {
    var t = {},
        r = e.split("-");
    if (r.length > 0 && (t.day = parseInt(r[0], 10)), r.length > 1 && (t.month = parseInt(r[1], 10) - 1), r.length > 2) {
        var n = r[2].split(" ");
        t.year = parseInt(n[0], 10)
    }
    if (t.hours = 0, t.minutes = 0, n.length > 1) {
        var a = n[1].split(":");
        t.hours = a[0], t.minutes = a[1]
    }
    var o = new Date(t.year, t.month, t.day, t.hours, t.minutes);
    return new Date(o.valueOf() - 6e4 * o.getTimezoneOffset())
}

function parseDateStringFuzzy(e) {
    if (isNotEmpty(e)) {
        var t = e.split("-");
        return t[0].length > 2 ? parseDateString(e) : parseDateString2(e)
    }
    return new Date
}

function parseDateString(e) {
    if (null != e) {
        var t = {},
            r = e.split("-");
        if (r.length > 2 && (t.year = r[0], t.month = r[1] - 1, r[2])) {
            var n = r[2].split("T");
            if (t.day = n[0], n[1]) {
                var a = n[1].split(":");
                t.hours = a[0], a[1] ? t.minutes = a[1] : t.minutes = 0
            } else t.hours = 0, t.minutes = 0
        }
        var o = new Date(t.year, t.month, t.day, t.hours, t.minutes);
        return new Date(o.valueOf() - 6e4 * o.getTimezoneOffset())
    }
    return new Date
}

function formatDate(e, t) {
    var r = new Array,
        n = new Array;
    return r[0] = atrans("sunday", "zondag"), r[1] = atrans("monday", "maandag"), r[2] = atrans("tuesday", "dinsdag"), r[3] = atrans("wednesday", "woensdag"), r[4] = atrans("thursday", "donderdag"), r[5] = atrans("friday", "vrijdag"), r[6] = atrans("saturday", "zaterdag"), n[0] = atrans("january", "januari"), n[1] = atrans("february", "februari"), n[2] = atrans("march", "maart"), n[3] = atrans("april", "april"), n[4] = atrans("may", "mei"), n[5] = atrans("june", "juni"), n[6] = atrans("july", "juli"), n[7] = atrans("august", "augustus"), n[8] = atrans("september", "september"), n[9] = atrans("october", "oktober"), n[10] = atrans("november", "november"), n[11] = atrans("december", "december"), void 0 == t ? r[e.getDay()].toLowerCase() + " " + e.getDate() + " " + n[e.getMonth()].toLowerCase() + " " + e.getFullYear() : e.getDate() + " " + n[e.getMonth()].toLowerCase() + " " + e.getFullYear()
}

function format_two_digits(e) {
    return 10 > e ? "0" + e : e
}

function getDateString(e) {
    var t = "";
    t += 1 == e.getDate().toString().length ? "0" + e.getDate() : e.getDate(), t += "-";
    var r = e.getMonth() + 1;
    return t += 1 == r.toString().length ? "0" + r : r, t += "-", t += e.getFullYear()
}

function getTimeString(e) {
    var t = "";
    return t += 1 == e.getHours().toString().length ? "0" + e.getHours() : e.getHours(), t += ":", t += 1 == e.getMinutes().toString().length ? "0" + e.getMinutes() : e.getMinutes()
}

function inlineDocType(e) {
    if (isNotEmpty(e)) {
        var t = e.toLowerCase().substring(e.lastIndexOf("."));
        if (-1 != ".pdf.doc.docx.ppt.pptx.xls.xlsx".indexOf(t)) switch (t) {
        case ".pdf":
            return {
                Type: "application/pdf", Label: atrans("pdfdoc", "PDF bestand")
            };
        case ".docx":
            return {
                Type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", Label: atrans("worddoc", "Word bestand")
            };
        case ".doc":
            return {
                Type: "application/msword", Label: atrans("worddoc", "Word bestand")
            };
        case ".xlsx":
            return {
                Type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Label: atrans("exceldoc", "Excel bestand")
            };
        case ".xls":
            return {
                Type: "application/vnd.ms-excel", Label: atrans("exceldoc", "Excel bestand")
            };
        case ".pptx":
            return {
                Type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", Label: atrans("worddoc", "Word bestand")
            };
        case ".ppt":
            return {
                Type: "application/vnd.ms-powerpoint", Label: atrans("worddoc", "Word bestand")
            }
        }
        return {
            Type: "application/octet-stream",
            Label: atrans("file", "Bestand")
        }
    }
    return null
}

function getDayString(e) {
    var t;
    switch (e) {
    case 0:
        t = atrans("cmonday", "~Cap~Maandag");
        break;
    case 1:
        t = atrans("ctuesday", "~Cap~Dinsdag");
        break;
    case 2:
        t = atrans("cwednesday", "~Cap~Woensdag");
        break;
    case 3:
        t = atrans("cthursday", "~Cap~Donderdag");
        break;
    case 4:
        t = atrans("cfriday", "~Cap~Vrijdag");
        break;
    case 5:
        t = atrans("csaturday", "~Cap~Zaterdag");
        break;
    case 6:
        t = atrans("csunday", "~Cap~Zondag");
        break;
    default:
        throw "illegal weekday " + e
    }
    return t
}

function getMonthString(e) {
    var t = "";
    return 0 == e && (t = atrans("cjanuary", "~Cap~Januari")), 1 == e && (t = atrans("cfebruary", "~Cap~Februari")), 2 == e && (t = atrans("cmarch", "~Cap~Maart")), 3 == e && (t = atrans("capril", "~Cap~April")), 4 == e && (t = atrans("cmay", "~Cap~Mei")), 5 == e && (t = atrans("cjune", "~Cap~Juni")), 6 == e && (t = atrans("cjuly", "~Cap~Juli")), 7 == e && (t = atrans("caugust", "~Cap~Augustus")), 8 == e && (t = atrans("cseptember", "~Cap~September")), 9 == e && (t = atrans("coctober", "~Cap~Oktober")), 10 == e && (t = atrans("cnovember", "~Cap~November")), 11 == e && (t = atrans("cdecember", "~Cap~December")), t
}

function formvalue(e, t) {
    if (null != e && "object" == typeof e && e.id) return e.id;
    if (t) {
        if (isNotEmpty(t.defaultvalue)) {
            var r = fixDefaultValue(t, toValue(t, t.value));
            return isNaN(r) && isdtypenumeric(t.dtype) || t.external ? t.defaultvalue : r
        }
        if (isNotEmpty(t.value)) return t.value
    }
    return e
}

function handleDateAdditions(e, t) {
    for (var r = e.split(","), n = 0; n < r.length; n++) 0 == r[n].indexOf("d") && t.setDate(t.getDate() + parseInt(r[n].substr(1), 10)), 0 == r[n].indexOf("w") && t.setDate(t.getDate() + 7 * parseInt(r[n].substr(1), 10)), 0 == r[n].indexOf("m") && t.setMonth(t.getMonth() + parseInt(r[n].substr(1), 10)), 0 == r[n].indexOf("y") && t.setFullYear(t.getFullYear() + parseInt(r[n].substr(1), 10))
}

function nowreplacer(e, t, r, n) {
    var a = new Date;
    return a.setHours(0, 0, 0, 0), handleDateAdditions(t, a), getJSONDate(a, !0)
}

function nowtimereplacer(e, t, r, n) {
    var a = new Date;
    return handleDateAdditions(t, a), getJSONDate(a, !1)
}

function beginweekreplacer(e, t, r, n) {
    var a = new Date,
        o = a.getDay() || 7;
    return 1 !== o && a.setHours(-24 * (o - 1)), handleDateAdditions(t, a), getJSONDate(a, !1)
}

function endweekreplacer(e, t, r, n) {
    var a = new Date,
        o = a.getDay() || 7;
    return 7 !== o && a.setHours(24 * (7 - o)), handleDateAdditions(t, a), getJSONDate(a, !1)
}

function beginmonthreplacer(e, t, r, n) {
    var a = new Date;
    return a.setDate(1), handleDateAdditions(t, a), getJSONDate(a, !1)
}

function endmonthreplacer(e, t, r, n) {
    var a = new Date;
    return a.setMonth(a.getMonth() + 1), a.setDate(0), handleDateAdditions(t, a), getJSONDate(a, !1)
}

function beginyearreplacer(e, t, r, n) {
    var a = new Date;
    return a.setMonth(0, 1), handleDateAdditions(t, a), getJSONDate(a, !1)
}

function endyearreplacer(e, t, r, n) {
    var a = new Date;
    return a.setFullYear(a.getFullYear() + 1, 0, 0), handleDateAdditions(t, a), getJSONDate(a, !1)
}

function yearreplacer(e, t, r, n) {
    for (var a = (new Date).getFullYear(), o = t.split(","), i = 0; i < o.length; i++) 0 == o[i].indexOf("y") && (a += parseInt(o[i].substr(1), 10));
    return a
}

function monthreplacer(e, t, r, n) {
    for (var a = (new Date).getMonth() + 1, o = t.split(","), i = 0; i < o.length; i++) 0 == o[i].indexOf("m") && (a += parseInt(o[i].substr(1), 10));
    return a
}

function replaceFieldVariable(e, t, r, n) {
    if ("string" != typeof e) return e;
    if (-1 == e.indexOf("~*")) return e;
    "undefined" == typeof r && (r = ""), "undefined" == typeof n && (n = "");
    var a = new RegExp(r + "~\\*NOW\\*~DD([dmyw\\,\\-0-9]*)@?" + n, "g"),
        o = new RegExp(r + "~\\*NOW\\*~TT([dmyw\\,\\-0-9]*)@?" + n, "g"),
        i = new RegExp(r + "~\\*NOW\\*~DT([dmyw\\,\\-0-9]*)@?" + n, "g"),
        s = new RegExp(r + "~\\*NOW\\*~SW([dmyw\\,\\-0-9]*)@?" + n, "g"),
        l = new RegExp(r + "~\\*NOW\\*~EW([dmyw\\,\\-0-9]*)@?" + n, "g"),
        c = new RegExp(r + "~\\*NOW\\*~SM([dmyw\\,\\-0-9]*)@?" + n, "g"),
        u = new RegExp(r + "~\\*NOW\\*~EM([dmyw\\,\\-0-9]*)@?" + n, "g"),
        f = new RegExp(r + "~\\*NOW\\*~SY([dmyw\\,\\-0-9]*)@?" + n, "g"),
        d = new RegExp(r + "~\\*NOW\\*~EY([dmyw\\,\\-0-9]*)@?" + n, "g"),
        p = new RegExp(r + "~\\*CURRYEAR\\*~([y\\,\\-0-9]*)@?" + n, "g"),
        g = new RegExp(r + "~\\*CURRMONTH\\*~([m\\,\\-0-9]*)@?" + n, "g");
    return a.test(e) && (e = e.replace(a, nowreplacer)), o.test(e) && (e = e.replace(o, nowtimereplacer)), i.test(e) && (e = e.replace(i, nowtimereplacer)), s.test(e) && (e = e.replace(s, beginweekreplacer)), l.test(e) && (e = e.replace(l, endweekreplacer)), c.test(e) && (e = e.replace(c, beginmonthreplacer)), u.test(e) && (e = e.replace(u, endmonthreplacer)), f.test(e) && (e = e.replace(f, beginyearreplacer)), d.test(e) && (e = e.replace(d, endyearreplacer)), p.test(e) && (e = e.replace(p, yearreplacer)), g.test(e) && (e = e.replace(g, monthreplacer)), e = e.replace(new RegExp(r + "~\\*CURRWEEKNR\\*~" + n, "g"), (new Date).getWeek()), e = e.replace(new RegExp(r + "~\\*CURRUNITID\\*~" + n, "g"), "1"), null != t && (e = e.replace(new RegExp(r + "~\\*USERID\\*~" + n, "g"), t.user), e = e.replace(new RegExp(r + "~\\*EMPID\\*~" + n, "g"), t.employee_id)), e
}

function lc(e) {
    return "string" == typeof e ? e.toLowerCase() : e
}

function checkFilter(e, t, r) {
    function n(e, t, r) {
        return e ? t || r : t && r
    }
    var a, o = !0,
        i = toValue(e, t);
    if (isNotEmpty(e.filter) && "string" == typeof e.filter) {
        var s = !e.filter.startsWith("#"),
            l = e.filter.startsWith("!");
        o = !s;
        var c = !s || l ? e.filter.substr(1) : e.filter;
        filters = c.split(";");
        for (var u = 0; u < filters.length; u++) {
            var f = filters[u]; - 1 != f.indexOf("[~") && (f = replaceFieldVariable(f, r, "\\[", "\\]")), a = f.split(">="), a.length > 1 ? o = n(s, o, lc(i) >= lc(toValue(e, a[1]))) : (a = f.split("<="), a.length > 1 ? o = n(s, o, lc(i) <= lc(toValue(e, a[1]))) : (a = f.split("!="), a.length > 1 ? o = n(s, o, lc(i) != lc(toValue(e, a[1]))) : (a = f.split("="), a.length > 1 ? o = n(s, o, lc(i) == lc(toValue(e, a[1]))) : (a = f.split(">"), a.length > 1 ? o = n(s, o, lc(i) > lc(toValue(e, a[1]))) : (a = f.split("<"), a.length > 1 ? o = n(s, o, lc(i) < lc(toValue(e, a[1]))) : (a = f.split(".."), a.length > 1 ? o = n(s, o, lc(i) >= lc(toValue(e, a[0])) && lc(i) <= lc(toValue(e, a[1]))) : "string" == typeof i ? (a = f.split("!"), a.length > 1 ? o = n(s, o, -1 == i.toLowerCase().indexOf(toValue(e, a[1]).toString().toLowerCase())) : (a = f.split("@"), a.length > 1 ? o = n(s, o, 0 == i.toLowerCase().indexOf(toValue(e, a[1]).toString().toLowerCase())) : (a = f.split("&"), o = a.length > 1 ? n(s, o, i.toLowerCase().indexOf(toValue(e, a[1]).toString().toLowerCase()) == toValue(e, a[1]).toLowerCase().length - i.toLowerCase().length) : n(s, o, -1 != i.toLowerCase().indexOf(toValue(e, f).toString().toLowerCase()))))) : (a = f.split("!"), o = a.length > 1 ? n(s, o, i != toValue(e, a[1])) : n(s, o, i == toValue(e, a[0])))))))))
        }
        if (l && (o = !o), !o && e.message) return e.message
    }
    return null
}

function fixDefaultValue(e, t, r, n) {
    if (!e) return t;
    if (e.defaultvalue && !n) {
        var a = replaceFieldVariable(e.defaultvalue, r);
        if ("string" == typeof a && -1 != a.indexOf("~*") && a == e.defaultvalue) return toValue(e, e.value);
        t = toValue(e, a)
    }
    return 8 == e.dtype && "number" == typeof t ? 7 == e.ctype ? getGMTDate(new Date(1970, 1, 1, Math.floor(t / 3600), Math.floor(t / 60) % 60, t % 60)) : new Date(t) : t
}

function toValue(e, t) {
    if (null == t) return null;
    if (issearchfield(e.ctype) && "object" == typeof t) return t.idext || t.id;
    switch (parseInt(e.dtype, 10)) {
    case 1:
        return "true" == t || "True" == t || "1" == t;
    case 8:
        return 7 === e.ctype ? toTimeValue(t) : 8 === e.ctype || 4 === e.ctype ? new Date("string" == typeof t ? parseDateStringFuzzy(t).valueOf() : t.valueOf()) : "string" == typeof t ? parseDateStringFuzzy(t).valueOf() : t.valueOf();
    case 9:
    case 11:
    case 12:
    case 13:
    case 16:
        var r = parseFloat(t.replace ? t.replace(",", ".") : t);
        return isNaN(r) ? t : r;
    case 3:
    case 6:
    case 7:
        var n = parseInt(t, 10);
        return isNaN(n) ? t : n
    }
    return t
}

function getMonday(e) {
    var t = new Date(e);
    return t.setDate(e.getDate() - (e.getDay() - 1)), t
}

function dateFromStateParams(e) {
    var t = new Date(e.slice(0, 4), e.slice(4, 6) - 1, e.slice(6, 8));
    return t
}

function getJSONDate(e, t, r) {
    var n = "";
    n += e.getFullYear(), n += "-";
    var a = e.getMonth() + 1;
    return n += 1 == a.toString().length ? "0" + a : a, n += "-", n += 1 == e.getDate().toString().length ? "0" + e.getDate() : e.getDate(), t || (n += "T", n += 1 == e.getHours().toString().length ? "0" + e.getHours() : e.getHours(), n += ":", n += 1 == e.getMinutes().toString().length ? "0" + e.getMinutes() : e.getMinutes(), n += ":00", 1 == r && (n += "Z")), n
}

function mdRender(e) {
    return window.markdownit ? ("undefined" == typeof md && (md = window.markdownit("default", {
        xhtmlOut: "/",
        breaks: !0
    }).use(window.markdownitIns).disable(["code", "fence", "hr", "html_block", "lheading", "reference", "autolink", "backticks", "entity", "html_inline", "image", "link", "blockquote", "table"]).enable(["heading", "list", "paragraph", "strikethrough", "emphasis"])), md.render(e)) : e
}

function FriendlyException(e) {
    this.message = e.message, this.title = e.title
}

function checkLocalStoragePrefix(e, t) {
    var r = e.employer,
        n = e.user,
        a = e.gender;
    ("" == r || null == r) && (r = -1 != n.indexOf(".") && -1 == n.indexOf("@") ? atrans("member", "Deelnemer") + " " + n.split(".")[0] : t), (LocalStoragePrefixes[CurrentPrefix].name != r || LocalStoragePrefixes[CurrentPrefix].gender != a || LocalStoragePrefixes[CurrentPrefix].username != n || LocalStoragePrefixes[CurrentPrefix].loginkey != t) && (LocalStoragePrefixes[CurrentPrefix].name = r, LocalStoragePrefixes[CurrentPrefix].username = n, LocalStoragePrefixes[CurrentPrefix].loginkey = t, LocalStoragePrefixes[CurrentPrefix].gender = a, localStorage.setItem("Prefixes", JSON.stringify(LocalStoragePrefixes)))
}

function switchLocalStorage(e) {
    CurrentPrefix = e, localStorage.setItem("CurrentPrefix", CurrentPrefix)
}

function deleteLocalStorage(e) {
    0 != e && (LocalStoragePrefixes.splice(e, 1), localStorage.setItem("Prefixes", JSON.stringify(LocalStoragePrefixes)), switchLocalStorage(0))
}

function addLocalStorage() {
    LocalStoragePrefixes.push({
        id: LocalStoragePrefixes.length + 1,
        prefix: "_" + (LocalStoragePrefixes.length + 1) + "_",
        name: atrans("notreg", "[Niet aangemeld]"),
        username: "",
        loginkey: ""
    }), localStorage.setItem("Prefixes", JSON.stringify(LocalStoragePrefixes)), switchLocalStorage(LocalStoragePrefixes.length - 1)
}

function SessionStorage() {
    this.fakeSessionStorage = !1;
    try {
        sessionStorage.setItem("test", "test"), sessionStorage.removeItem("test")
    } catch (e) {
        this.fakeSessionStorage = !0
    }
    this.items = {}
}

function log(e) {
    if ("object" == typeof e) try {
        e = JSON.stringify(e)
    } catch (t) {}
    var r = Date.now(),
        n = new Date(r);
    "undefined" == typeof t0 && (t0 = window.stats_t0, "undefined" == typeof t0 && (t0 = Date.now()), r = t0);
    var a = r - t0,
        o = null != e && -1 != e.toString().indexOf("finish") ? " " + (r - tlast) : "";
    tlast = r;
    var i = n.toISOString().substr(11) + ": " + a + " " + e.toString() + o;
    lines.push(i), lines = lines.slice(-400)
}

function alerta(e) {
    function t() {
        alertDiv.style.opacity = 0, alertDiv.style.webkitTransition = "opacity 5s", setTimeout(function () {
            alertDiv.style.display = "none"
        }, 5e3), fadeTimeout = null
    }
    var r = Date.now();
    null == alertDiv && (alertDiv = document.body.appendChild(document.createElement("div")), alertDiv.style.position = "absolute", alertDiv.style.top = "0px", alertDiv.style.left = "0px", alertDiv.style.backgroundColor = "yellow", alertDiv.style.padding = "10px", alertDiv.style.color = "black", alertDiv.style.zIndex = 10, void 0 !== navigator.splashscreen && navigator.splashscreen.hide(), document.getElementById("blocker").style.display = "none", t0 = window.stats_t0, r = t0), null != fadeTimeout && clearTimeout(fadeTimeout), fadeTimeout = setTimeout(t, 1e4), alertDiv.style.webkitTransition = "opacity 0s", alertDiv.style.opacity = 1, alertDiv.style.display = "";
    var n = r - t0,
        a = null != e && -1 != e.toString().indexOf("finish") ? " " + (r - tlast) : "";
    tlast = r, lines.push(n + " " + e.toString() + a), alertDiv.innerHTML = lines.slice(-15).join("<br/>")
}

function utf8_to_b64(e) {
    return window.btoa(unescape(encodeURIComponent(e)))
}

function b64_to_utf8(e) {
    return decodeURIComponent(escape(window.atob(e)))
}

function Uint8ToBase64(e) {
    for (var t, r = 32768, n = 0, a = e.length, o = ""; a > n;) t = e.subarray(n, Math.min(n + r, a)), o += String.fromCharCode.apply(null, t), n += r;
    return btoa(o)
}

function checkDvbDuplicates(e) {
    for (var t = {}, r = 0; r < e.length; r++) t[e[r].function_description] = (t[e[r].function_description] || 0) + 1;
    for (var r = 0; r < e.length; r++) t[e[r].function_description] > 1 && (e[r].function_description = e[r].orgunit_description);
    return e
}

function cloneAsObject(e) {
    if (null === e || !(e instanceof Object)) return e;
    var t = e instanceof Array ? [] : {};
    for (var r in e) t[r] = cloneAsObject(e[r]);
    return t
}

function boundsSerialize(e) {
    var t = '{"bounds":' + e.getBounds().toString() + ',"center":' + e.getCenter().toString() + "}";
    return t = t.replace(/\(/g, "[").replace(/\)/g, "]")
}

function boundsDeserialize(e, t, r) {
    t = JSON.parse(t), r ? e.setCenter(new google.maps.LatLng(t.center[0], t.center[1])) : e.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(t.bounds[0][0], t.bounds[0][1]), new google.maps.LatLng(t.bounds[1][0], t.bounds[1][1])))
}

function resetdefaults(e) {
    for (var t in e) e.hasOwnProperty(t) && "eob" != t && "custom" != t && "customZ10" != t && "attachments" != t && e[t].old && (e[t].defaultvalue = e[t].old.defaultvalue, e[t].value = e[t].old.value, e[t].mandatory = e[t].old.mandatory, e[t].enabled = e[t].old.enabled, e[t].visble = e[t].old.visble)
}

function parseInfo(e, t, r, n, a, o) {
    function i(e, t, r, n) {
        var o, i;
        if (t)
            for (o in t)
                if (t.hasOwnProperty(o) && "eob" != o) {
                    var s = !0;
                    t[o].sortindex || (t[o].sortindex = t[o].description);
                    for (i in t[o])
                        if (t[o].hasOwnProperty(i) && "eob" != i) {
                            if (issearchfield(t[o][i].ctype)) {
                                if (a && "" != t[o][i].defaultvalue && null != t[o][i].defaultvalue && -1 != t[o][i].defaultvalue.indexOf("~*")) {
                                    var l = fixDefaultValue(t[o][i], toValue(t[o][i], t[o][i].value), r, n);
                                    e[a] && e[a](l, i)
                                }
                                t[o][i].extvalue && "" != t[o][i].extvalue ? (e.form[i] = {
                                    id: t[o][i].extvalue,
                                    name: t[o][i].description
                                }, e.form[i + "_entry"] = t[o][i].extvalue) : t[o][i].value && "" != t[o][i].value && (e.form[i] = {
                                    id: t[o][i].value,
                                    name: t[o][i].description
                                }, e.form[i + "_entry"] = t[o][i].value)
                            } else(1 == t[o][i].dtype || t[o][i].value && "" != t[o][i].value) && (e.form[i] = fixDefaultValue(t[o][i], toValue(t[o][i], t[o][i].value), r, n));
                            (6 == t[o][i].ctype || 23 == t[o][i].ctype) && e.form[i] && (e.mdText[i] = mdRender(e.form[i])), s = s && !t[o][i].visible
                        } t[o].allhide = s
                }
    }
    var s, l;
    if (t)
        if (setPlaceholder(t), e.info = t, n) {
            for (s in t.custom)
                if (t.custom.hasOwnProperty(s) && "eob" != s) {
                    var c = !0;
                    for (l in t.custom[s]) t.custom[s].hasOwnProperty(l) && "eob" != l && (c = c && !(t.custom[s][l].visible && (2 == t.custom[s][l].ctype || "" !== t.custom[s][l].value))), t.custom[s][l].value = fixDefaultValue(t.custom[s][l], toValue(t.custom[s][l], t.custom[s][l].value), o);
                    t.custom[s].allhide = c
                } if (t.customZ10)
                for (s in t.customZ10)
                    if (t.customZ10.hasOwnProperty(s) && "eob" != s) {
                        var c = !0;
                        for (l in t.customZ10[s]) t.customZ10[s].hasOwnProperty(l) && "eob" != l && (c = c && !(t.customZ10[s][l].visible && (2 == t.customZ10[s][l].ctype || "" !== t.customZ10[s][l].value))), t.customZ10[s][l].value = fixDefaultValue(t.customZ10[s][l], toValue(t.customZ10[s][l], t.customZ10[s][l].value), r, o);
                        t.customZ10[s].allhide = c
                    }
        } else {
            for (l in t)
                if (t.hasOwnProperty(l) && "eob" != l && "custom" != l && "customZ10" != l && "attachments" != l) {
                    if (t[l]._key = l, issearchfield(t[l].ctype)) {
                        if (isNotEmpty(t[l].defaultvalue)) {
                            var u = fixDefaultValue(t[l], toValue(t[l], t[l].value), r, o);
                            isNaN(u) && isdtypenumeric(t[l].dtype) || t[l].external ? (e.form[l] = {
                                idext: t[l].defaultvalue,
                                name: ""
                            }, e.info[l].value = null) : (e.form[l] = {
                                id: u,
                                name: ""
                            }, isNotEmpty(u) && (e.info[l].value = null))
                        }
                        t[l].value && "" != t[l].value && (e.form[l] = {
                            id: t[l].value,
                            name: t[l].description,
                            idext: t[l].extvalue
                        }, e.form[l + "_entry"] = t[l].extvalue ? t[l].extvalue : t[l].value), e.form[l] && (isNotEmpty(e.form[l].id) || isNotEmpty(e.form[l].idext)) && !isNotEmpty(e.form[l].name) && e[a] && e[a](e.form[l].idext ? e.form[l].idext : e.form[l].id, l)
                    } else 1 == t[l].dtype || t[l].value && "" != t[l].value ? e.form[l] = fixDefaultValue(t[l], toValue(t[l], t[l].value), r, o) : e.form[l] = fixDefaultValue(t[l], toValue(t[l], t[l].value), r, o);
                    (6 == t[l].ctype || 23 == t[l].ctype) && e.form[l] && (e.mdText[l] = mdRender(e.form[l]))
                } i(e, t.custom, r, o), i(e, t.customZ10, r, o)
        }
}

function handleSearchFields(e, t, r, n) {
    if (t) {
        var a = t.fields;
        if (n.modal.fields = a, a.unshift({
                id: null,
                name: atrans("CodeOrDescription", "Code of omschrijving")
            }), e.searchfields = {
                fields: a,
                extraParam: r
            }, e.searchfieldform.searchfieldname = null, e.searchfieldform.searchfield = LocalStorage.getItem("searchfield_" + e.searchfields.extraParam.fieldId), null != e.searchfieldform.searchfield)
            for (var o = 0; o < t.fields.length; o++) t.fields[o].id == e.searchfieldform.searchfield && (e.searchfieldform.searchfieldname = t.fields[o].name);
        e.searchfieldform.searchfieldname && (n.modal.searchPlaceholder = atrans("searchgen", "Zoek op {0}", e.searchfieldform.searchfieldname))
    }
}

function fixInput(e, t) {
    if (e) switch (t) {
    case "1":
        return e.substring(0, 1).toUpperCase() + e.substring(1);
    case "2":
        return e.toUpperCase();
    case "3":
        return e.toLowerCase();
    case "4":
        for (var r = e.split(" "), n = 0; n < r.length; n++) r[n] = r[n].substring(0, 1).toUpperCase() + r[n].substring(1);
        return r.join(" ");
    case "5":
        return e = e.replace(/\./g, ""), e.replace(/([A-Za-z])/g, "$1.");
    case "6":
        return e = e.replace(/\./g, ""), e.replace(/([A-Za-z])/g, "$1.").toUpperCase();
    case "7":
        return e.replace(/\D/g, "");
    case "8":
        return e.replace(/\d/g, "")
    }
    return e
}

function isUpdatable(e, t, r) {
    return "undefined" != typeof e[r] && (e[r] || "boolean" == typeof e[r] || e[r] != t[r].value)
}

function isNotEmpty(e) {
    return "undefined" == typeof e ? !1 : "number" == typeof e ? null != e : "string" != typeof e ? null != e : null != e && "" != e
}

function isdtypenumeric(e) {
    return 3 == e || 6 == e || 7 == e || 9 == e || 11 == e || 12 == e || 13 == e || 15 == e || 16 == e
}

function issearchfield(e) {
    return 3 == e || 5 == e
}

function toTimeValue(e) {
    if ("string" == typeof e && e.match(/^[0-9]+:[0-9]+/)) {
        var t = e.split(":");
        return 3 == t.length ? 60 * parseInt(t[0], 10) * 60 + 60 * parseInt(t[1], 10) + parseInt(t[2], 10) : 2 == t.length ? 60 * parseInt(t[0], 10) * 60 + 60 * parseInt(t[1], 10) : parseInt(t[0], 10)
    }
    var r;
    return r = fromGMTDate("string" == typeof e ? parseDateStringFuzzy(e) : e), 60 * r.getHours() * 60 + 60 * r.getMinutes() + r.getSeconds()
}

function timeToDate(e) {
    var t = new Date;
    return t.setHours(0, 0, toTimeValue(e)), getGMTDate(t)
}

function fromSecondsToReaAmount(e) {
    return e / 3600
}

function fillHiddenByDefault(e, t, r) {
    if (!t[r].visible) {
        if (isNotEmpty(t[r].extvalue)) return issearchfield(t[r].ctype) ? e[r] = {
            id: t[r].extvalue
        } : e[r] = t[r].extvalue, !0;
        if (isNotEmpty(t[r].value)) return issearchfield(t[r].ctype) ? e[r] = {
            id: t[r].value
        } : e[r] = t[r].value, !0
    }
    return !1
}

function checkFormField(e, t, r, n) {
    var a = !1;
    if ("custom" == r) return !1;
    if (17 == t[r].ctype) return !t[r].mandatory || e.attachments && 0 != e.attachments.length ? !1 : (e.errorfld[r] = atrans("mandatory", "Verplicht veld '{0}' niet ingevuld", t[r].label), !0);
    if (isNotEmpty(e[r]) || fillHiddenByDefault(e, t, r) || 1 != t[r].dtype && t[r].mandatory && (e.errorfld[r] = atrans("mandatory", "Verplicht veld '{0}' niet ingevuld", t[r].label), a = !0), isNotEmpty(t[r].filter)) {
        var o = checkFilter(t[r], e[r], n);
        null != o && (e.errorfld[r] = o, a = !0)
    }
    return a
}

function showErrors(e, t, r, n, a, o, i) {
    function s(t) {
        for (ckey in t)
            if (t.hasOwnProperty(ckey) && "eob" != ckey && t[ckey][c] && !t[ckey][c].visible) {
                a.alert({
                    title: atrans("error", "Foutmelding"),
                    template: t[ckey][c].label + ": " + e.errorfld[c]
                });
                break
            }
    }

    function l(e, t) {
        n(function () {
            var n = document.getElementById("errfld-" + e);
            n && n.offsetParent && -1 != n.offsetParent.className.indexOf("item") ? (n = n.offsetParent, i.$getByHandle(r).scrollTo(0, n.offsetTop, !1)) : t && a.alert({
                title: atrans("error", "Foutmelding"),
                template: t
            })
        }, 10)
    }
    var c;
    for (c in e.errorfld) {
        if (t[c] && !t[c].visible) {
            a.alert({
                title: atrans("error", "Foutmelding"),
                template: t[c].label + ": " + e.errorfld[c]
            });
            break
        }
        t.custom && s(t.custom), t.customZ10 && s(t.customZ10)
    }
    for (c in e.errorfld)
        if (e.errorfld.hasOwnProperty(c)) {
            l(c, e.errorfld[c]);
            break
        }
}

function getAttachmentsBySubjectId(e, t, r) {
    return t.getConfig().then(function (t) {
        var n = [],
            a = {
                guid: r
            };
        return e.getAttachments(a).then(function (e) {
            if (e.length > 0) {
                for (var r = 0; r < e.length; r++) {
                    var a = {};
                    a.type = "file", a.filename = e[r].file_name, a.guid = e[r].file_id, a.size = e[r].file_size, downloadAttachmentWithSubjectId(t, n, a), n.push(a)
                }
                return n
            }
        })
    })
}

function downloadAttachmentWithSubjectId(e, t, r) {
    var n = inlineDocType(r.filename);
    if (null != n && (r.showInlineContent = !0), r.size <= 5e4) {
        var a = r.filename.toLowerCase().substring(r.filename.lastIndexOf("."));
        (".jpg" == a || ".jpeg" == a || ".svg" == a || ".png" == a || ".gif" == a || ".bmp" == a) && (r.type = "img", ConnectorService.getFileData(r, "guid", "filename").then(function (e) {
            for (var r = 0; r < t.length; r++) e.guid == t[r].guid && (t[r].imageUrl = "data:" + e.mimetype + ";base64," + e.filedata)
        }))
    }
}

function rearound(e) {
    switch (e = Math.floor(e), e % 3) {
    case 0:
        return e;
    case 1:
        return e - 1;
    case 2:
        return e + 1
    }
}

function checkDeviceVersionLowerThan(e) {
    return device ? "string" == typeof device.version ? parseInt(device.version.split(".")[0], 10) < e : device.version < e : !0
}

function getOffsetLeft(e) {
    return null != e ? e.offsetLeft + getOffsetLeft(e.offsetParent) : 0
}

function getOffsetTop(e) {
    return null != e ? e.offsetTop + getOffsetTop(e.offsetParent) : 0
}

function delegateGetById(e, t) {
    var r = e._instances,
        n = null;
    for (var a in r) r[a].$element[0].id === t && (n = r[a]);
    return n
}

function uploadAttachmentsRecursive(e, t, r, n, a) {
    if (e < t.length) {
        var o = t[e];
        o.fileId ? uploadAttachmentsRecursive(e + 1, t, r, n, a) : o.file ? n.uploadFile(r, null, o.file).then(function (e) {
            o.fileId = e.fileids[0]
        })["finally"](function () {
            uploadAttachmentsRecursive(e + 1, t, r, n, a)
        }) : o.fileURI ? n.uploadFileByUrl(r, o.fileURI, o.filename).then(function (e) {
            o.fileId = e.fileids[0]
        })["finally"](function () {
            uploadAttachmentsRecursive(e + 1, t, r, n, a)
        }) : uploadAttachmentsRecursive(e + 1, t, r, n, a)
    } else a()
}

function AddSubObjectGeneric(e, t) {
    for (var r = 0; r < e.length; r++)
        if (e[r].hasOwnProperty(t)) return r;
    var n = {};
    n[t] = {
        Element: {
            Fields: {}
        }
    }, e.push(n);
    var a = e.length - 1;
    return a
}

function createExtraParam(e, t, r, n) {
    var a = {};
    a.fieldId = e, a.info = t.info, a.form = t.form, a.onlyId = !1;
    var o = getFieldFromInfo(e, t.info);
    o && (a.searchview = o.searchview, a.searchview.filter = o.filter, isNotEmpty(a.searchview.fieldId2) && (a.searchview.fromfieldId1 ? a.searchview.fieldValue2 = formvalue(t.form[a.searchview.fromfieldId1], t.info[a.searchview.fromfieldId1]) : t.form[a.searchview.fieldId2] && (a.searchview.fieldValue2 = formvalue(t.form[a.searchview.fieldId2], t.info[a.searchview.fieldId2]))), isNotEmpty(a.searchview.fieldId3) && (a.searchview.fromfieldId2 ? a.searchview.fieldValue3 = formvalue(t.form[a.searchview.fromfieldId2], t.info[a.searchview.fromfieldId2]) : t.form[a.searchview.fieldId3] && (a.searchview.fieldValue3 = formvalue(t.form[a.searchview.fieldId3], t.info[a.searchview.fieldId3])))), a[r] = n, t.extraParam = a
}

function addModalFunctionsToScope(e, t, r, n, a) {
    e.openModal = function (t) {
        r.openModal(e, t, e.extraParam)
    }, e.closeModal = function () {
        e.modal.hide()
    }, e.showhide = function () {
        e.hidden = !e.hidden
    }, e.search = function (t) {
        r.search(e, t, e.extraParam)
    }, e.clearSearch = function () {
        r.clearSearch(e)
    }, e.clickRecent = function (t) {
        e.modal.query = t, r.search(e, t, e.extraParam)
    }, e.ShowRecentSearches = function () {
        r.ShowRecentSearches(e)
    }, e.HideRecentSearches = function () {
        r.HideRecentSearches(e)
    }, e.selectTab = function (t) {
        e.modal && !e.modal.loading && (e.modal.showType = t)
    }, e.loadMore = function () {
        r.loadMore(e, e.extraParam)
    }, e.selectItem = function (r, n) {
        e.extraParam && (e.extraParam = null), e.form[r.fieldId] || (e.form[r.fieldId] = {}), e.form[r.fieldId] = {
            id: r._id,
            name: r._name
        }, e.form[r.fieldId + "_entry"] = r._id, t.setRecentlySelected(r, e.modalSearchServiceRecent + "_" + r.fieldId), e.form.errorfld[r.fieldId] = "";
        for (var a in r) r.hasOwnProperty(a) && -1 != a.indexOf("_fixed_") && (e.form[r.fieldId][a] = r[a]);
        e.screenview(), n && e.modal && e.modal.hide()
    }, e.openModalforField = function (t) {
        createExtraParam(t, e, n, a), r.openModal(e, e.modalSearchServiceFields, e.extraParam)
    }
}

function getFieldFromInfo(e, t) {
    if (t && t[e]) return t[e];
    if (t.custom)
        for (var r in t.custom)
            if (t.custom[r] && t.custom[r][e]) return t.custom[r][e]
}

function FieldFunctions() {}
var appbuildversion = 10522;
String.prototype.endsWith || (String.prototype.endsWith = function (e, t) {
    var r = this.toString();
    ("number" != typeof t || !isFinite(t) || Math.floor(t) !== t || t > r.length) && (t = r.length), t -= e.length;
    var n = r.lastIndexOf(e, t);
    return -1 !== n && n === t
}), Date.prototype.yyyymmdd = function () {
    var e = this.getFullYear().toString(),
        t = (this.getMonth() + 1).toString(),
        r = this.getDate().toString();
    return e + (t[1] ? t : "0" + t[0]) + (r[1] ? r : "0" + r[0])
}, Date.prototype.daysInMonth = function () {
    var e = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return e.getDate()
}, Date.prototype.getTimesheetYear = function () {
    if (1 == this.getWeek()) {
        var e = new Date(this);
        return e.setDate(this.getDate() + 6), e.getFullYear()
    }
    return this.getFullYear()
}, Date.prototype.equals = function (e) {
    return this.getFullYear() === e.getFullYear() && this.getMonth() === e.getMonth() && this.getDate() === e.getDate()
};
var versionsActive = {};
Date.prototype.getWeek = function () {
    var e, t = new Date(this.valueOf()),
        r = (this.getUTCDay() + 6) % 7;
    return t.setUTCDate(t.getUTCDate() - r + 3), e = t.valueOf(), t.setUTCMonth(0, 1), 4 !== t.getUTCDay() && t.setUTCMonth(0, 1 + (4 - t.getUTCDay() + 7) % 7), Math.ceil((e - t) / 6048e5) + 1
};
var md, LocalStoragePrefixes = [{
    id: 1,
    prefix: "",
    name: "",
    username: "",
    loginkey: ""
}];
if (null != localStorage.getItem("Prefixes")) try {
    LocalStoragePrefixes = JSON.parse(localStorage.getItem("Prefixes"))
} catch (e) {}
var CurrentPrefix = 0;
if (null != localStorage.getItem("CurrentPrefix")) try {
    CurrentPrefix = parseInt(localStorage.getItem("CurrentPrefix"), 10), CurrentPrefix > LocalStoragePrefixes.length && (CurrentPrefix = 0)
} catch (e) {}
var LocalStorage = {
    setItem: function (e, t, r) {
        localStorage.setItem((r ? "" : LocalStoragePrefixes[CurrentPrefix].prefix) + e, t)
    },
    getItem: function (e, t) {
        return localStorage.getItem((t ? "" : LocalStoragePrefixes[CurrentPrefix].prefix) + e)
    },
    removeItem: function (e, t) {
        localStorage.removeItem((t ? "" : LocalStoragePrefixes[CurrentPrefix].prefix) + e)
    },
    removeItemsByPrefix: function (e) {
        var t, r = [];
        for (t = 0; t < localStorage.length; t++) 0 == localStorage.key(t).indexOf(LocalStoragePrefixes[CurrentPrefix].prefix + e) && r.push(localStorage.key(t));
        for (t = 0; t < r.length; t++) localStorage.removeItem(r[t])
    },
    clear: function () {
        localStorage.clear()
    }
};
SessionStorage.prototype.setItem = function (e, t) {
    this.fakeSessionStorage ? this.items[LocalStoragePrefixes[CurrentPrefix].prefix + e] = t : sessionStorage.setItem(LocalStoragePrefixes[CurrentPrefix].prefix + e, t)
}, SessionStorage.prototype.getItem = function (e) {
    return this.fakeSessionStorage ? this.items[LocalStoragePrefixes[CurrentPrefix].prefix + e] : sessionStorage.getItem(LocalStoragePrefixes[CurrentPrefix].prefix + e)
}, SessionStorage.prototype.removeItem = function (e) {
    this.fakeSessionStorage ? delete this.items[LocalStoragePrefixes[CurrentPrefix].prefix + e] : sessionStorage.removeItem(LocalStoragePrefixes[CurrentPrefix].prefix + e)
}, SessionStorage.prototype.clear = function () {
    this.fakeSessionStorage ? this.items = {} : sessionStorage.clear()
}, window.SessionStorage = new SessionStorage;
var filePicked, alertDiv = null,
    lines = new Array,
    fadeTimeout = null,
    t0, tlast = 0,
    Base64Binary = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        decodeArrayBuffer: function (e) {
            var t = e.length / 4 * 3,
                r = new ArrayBuffer(t);
            return this.decode(e, r), r
        },
        removePaddingChars: function (e) {
            var t = this._keyStr.indexOf(e.charAt(e.length - 1));
            return 64 == t ? e.substring(0, e.length - 1) : e
        },
        decode: function (e, t) {
            e = this.removePaddingChars(e), e = this.removePaddingChars(e);
            var r, n, a, o, i, s, l, c, u = parseInt(e.length / 4 * 3, 10),
                f = 0,
                d = 0;
            for (r = t ? new Uint8Array(t) : new Uint8Array(u), e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""), f = 0; u > f; f += 3) i = this._keyStr.indexOf(e.charAt(d++)), s = this._keyStr.indexOf(e.charAt(d++)), l = this._keyStr.indexOf(e.charAt(d++)), c = this._keyStr.indexOf(e.charAt(d++)), n = i << 2 | s >> 4, a = (15 & s) << 4 | l >> 2, o = (3 & l) << 6 | c, r[f] = n, 64 != l && (r[f + 1] = a), 64 != c && (r[f + 2] = o);
            return r
        }
    };
Array.prototype.forEach || (Array.prototype.forEach = function (e) {
    var t, r;
    if (null == this) throw new TypeError("this is null or not defined");
    var n = Object(this),
        a = n.length >>> 0;
    if ("function" != typeof e) throw new TypeError(e + " is not a function");
    for (arguments.length > 1 && (t = arguments[1]), r = 0; a > r;) {
        var o;
        r in n && (o = n[r], e.call(t, o, r, n)), r++
    }
}), document.querySelectorAll || (document.querySelectorAll = function (e) {
    var t, r = document.createElement("style"),
        n = [];
    for (document.documentElement.firstChild.appendChild(r), document._qsa = [], r.styleSheet.cssText = e + "{x-qsa:expression(document._qsa && document._qsa.push(this))}", window.scrollBy(0, 0), r.parentNode.removeChild(r); document._qsa.length;) t = document._qsa.shift(), t.style.removeAttribute("x-qsa"), n.push(t);
    return document._qsa = null, n
}), document.querySelector || (document.querySelector = function (e) {
    var t = document.querySelectorAll(e);
    return t.length ? t[0] : null
}), String.prototype.startsWith || (String.prototype.startsWith = function (e, t) {
    return this.substr(!t || 0 > t ? 0 : +t, e.length) === e
}), Object.keys || (Object.keys = function () {
    "use strict";
    var e = Object.prototype.hasOwnProperty,
        t = !{
            toString: null
        }.propertyIsEnumerable("toString"),
        r = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
        n = r.length;
    return function (a) {
        if ("function" != typeof a && ("object" != typeof a || null === a)) throw new TypeError("Object.keys called on non-object");
        var o, i, s = [];
        for (o in a) e.call(a, o) && s.push(o);
        if (t)
            for (i = 0; n > i; i++) e.call(a, r[i]) && s.push(r[i]);
        return s
    }
}());
var fieldFunctions = new FieldFunctions;
FieldFunctions.prototype.setZeroIfEmptyOrClear = function (e, t, r, n) {
    for (var a = 0; a < n.length; a++) e[n[a]] && (t ? e[n[a]] = null : r && (isNotEmpty(e[n[a]]) || (e[n[a]] = 0)))
}, FieldFunctions.prototype.setVisibility = function (e, t, r) {
    for (var n = 0; n < r.length; n++) e[r[n]] && (e[r[n]].visible = t)
}, FieldFunctions.prototype.setMandatory = function (e, t, r) {
    for (var n = 0; n < r.length; n++) e[r[n]] && (e[r[n]].mandatory = t)
}, FieldFunctions.prototype.setEnabled = function (e, t, r) {
    for (var n = 0; n < r.length; n++) e[r[n]] && (e[r[n]].enabled = t)
};