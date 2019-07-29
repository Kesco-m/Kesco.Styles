var srv4js_ctrl = null;
var srv4js_func;
var srv4js_args;
var srv4js_callback;
var srv4js_obj;
var srv4js_rez;

function srv4js(func, args, callback, obj) {
    srv4js_func = func;
    srv4js_args = args;
    srv4js_callback = callback;
    srv4js_obj = obj;

    if (srv4js_ctrl == null) {
        if (!IsIE) return;

        var bodyTags = document.getElementsByTagName("body");
        if (bodyTags.length == 0) {
            alert("Не найден тэг BODY! Перезагрузите страницу!");
            return;
        }
        var body = bodyTags[0];
        var div = document.createElement("DIV");
        div.id = "kesco_silverHost";
        body.appendChild(div);

        var ip = "";

        try {
            ip = kesco_ip;
	    Silverlight.createObject(
			"/STYLES/Silver4JS.xap?v=1.0.0.2", 	// source
			kesco_silverHost, 			// parent element
			"silver4js_obj", 			// id for generated object element
			{width: "1px", height: "1px" },
			{ onLoad: srv4js_LoadCtrl },
			"ipAddress=" + ip,
			"context"						// context helper for onLoad handler.
		);
        }
        catch (e) { alert('Ошибка взаимодействия с архивом документов.'); }

        
    }
    else {
        srv4js_call();
    }
}

function srv4js_LoadCtrl(sender, args) {

    srv4js_ctrl = sender;
    srv4js_call();
}

function srv4js_call() {
    var obj = srv4js_ctrl.Content.SL2JS;

    srv4js_rez = new Object();
    srv4js_rez.error = 0;
    srv4js_rez.value = '';
    try {
        if (obj.wait == 1) throw new Error(10101, 'Сначала нобходимо выбрать один документ.\nНельзя одновременно выбирать несколько документов.');
        srv4js_rez.value = obj.Execute(srv4js_func, srv4js_args);

        srv4js_rez.error = obj.error;
        srv4js_rez.errorMsg = obj.errorMsg;

        if (srv4js_rez.value == 'WAIT') {
            window.setTimeout('srv4js_checkWait();', 250);
            return;
        }
    }
    catch (e) {
        srv4js_rez.error = 1;
        srv4js_rez.errorMsg = e.description;
    }
    if (srv4js_callback != null) srv4js_callback(srv4js_rez, srv4js_obj);
}

function srv4js_checkWait() {
    var obj = srv4js_ctrl.Content.SL2JS
    if (obj.wait == 1) {
        window.setTimeout('srv4js_checkWait();', 250);
        return;
    }
    srv4js_rez.value = obj.buffer;
    if (srv4js_callback != null) srv4js_callback(srv4js_rez, srv4js_obj);
    //if (frmXml && frmXml.documentElement.getAttribute('isInDocView') != 'True') window.focus();
}

function srv4js_start(fileName, args) {
    fileName = kescoString_trim(fileName);
    args = kescoString_trim(args);
    srv4js('RUN', 'fileName=' + encodeURI(fileName) + '&arguments=' + encodeURI(args));
}

function srv4js_startExt(fileName, args, wStyle) {
    fileName = kescoString_trim(fileName);
    args = kescoString_trim(args);
    wStyle = kescoString_trim(wStyle);
    srv4js('RUN', 'fileName=' + encodeURI(fileName) + '&arguments=' + encodeURI(args) + '&wStyle=' + encodeURI(wStyle));
}


function docView_show(id, idCtrl) {
    cmdasync('ctrl', idCtrl, 'cmd', 'OpenDoc', 'id', id);
}

function docView_showReplicate(id, idCtrl) {
    cmdasync('ctrl', idCtrl, 'cmd', 'OpenDocWithReplicate', 'id', id);
    //srv4js('OPENDOC','id='+id+'&newwindow=1&imageid=0',docView_show_result,null);
}


function docView_show_result(rez, obj) {
    if (rez.error) alert('Ошибка взаимодействия с архивом документов:\n' + rez.errorMsg);
}


function silverError(type, message) {
    v4_OnError(type, message, "", "");
}

$(document).ready(function () {
    if (typeof srv4js === "function")
        srv4js('GETCLIENTNAME', null, function(state, obj) { v4_clientName = state.value; }, null);
});

