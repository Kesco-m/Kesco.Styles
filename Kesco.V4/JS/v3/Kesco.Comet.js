var v4Comet_clientLocalization = {};
v4_cometSetUsersList.form = null;

// Обработка сообщений, принятых с сервера
function v4_processResponseComet(data) {

    if (v4_isJSON(data)) {
        eval("var d=" + data + ";");

        //если соединение закрыто
        if (d.status == 1 && idp == d.guid) {
            // если соединение потеряно, по причине перезапуска служб IIS
            if (d.reload == 1) {
               location.reload(true);
            }
            return;
        }
        else if (d.status == 2 && idp == d.guid) {
            alert(data.message);
            if (data.reload == 1) {
                setTimeout(function() {
                    location.reload(true);
                }, 5000);
            }
            return;
        }


        if (d.isV4Script == 1) {
            v4_xml = v4_string2Xml(d.message);
            v4_xmlProcessing(v4_xml);
        }
    } else {
        v4_xml = v4_string2Xml(data);
        v4_xmlProcessing(v4_xml);
    }
    // После отображения результатов запроса - снова циклично делаем запрос.
    v4_connectComet('reconnect');
}


// Посылает lonp poll - запрос серверу
function v4_connectComet(cmd) {
    
    if (window.idp == null) return;
    if (v4_cometUrl == null || v4CometUrl_Template == null) return;
    
    var url = v4CometUrl_Template + "&cmd=" + cmd;
    var xhr =
        $.ajax({
            async: true,
            type: "POST",
            url: url,
            timeout: 600000,
            cache:false,
            // Если запрос завершился успехом, значит сервер сообщил о новых событиях
            // обрабатываем их
            success: function(data) {
                xhr.abort();
                v4_processResponseComet(data);
            },
            // При ошибке (например таймауте), снова рекурсивно посылаем запрос
            // обеспечивая тем самым непрерывный процесс прослушки серверных событий
            error: function (data) {
                xhr.abort();
                v4_updateStateComet(data, 1);
            }
        });
}

//Обновление соединения
function v4_updateStateComet(data, inx) {
    if (inx == null) inx = 1;
    if (inx > 3) {
        v4_showMessage("Не удалось установить соединение с сервером. Обновите страницу, нажав F5.", "Ошибка", 3);
        return;
    }
    
    var url = v4CometUrl_Template + "&cmd=update";

    $.ajax({
        async: true,
        type: "POST",
        url: url,
        cache: false,
        success: function() {
            v4_connectComet('reconnect');
        },
        error: function (data) {
            //inx++
            setTimeout(function() {
                v4_updateStateComet(data, inx);
            }, 3000);
        }
    });
}

// Разрегистрируемся на сервере
function v4_unregisterComet() {
    var url = v4CometUrl_Template + "&cmd=unregister";
    $.ajax({
        async: false,
        type: "POST",
        cache: false,
        url: url
    });
}

// Отправить тестовое сообщение
function v4_cometSendMessage(message) {
    if (message == "") return;
    var url = v4CometUrl_Template + "&cmd=send";
    $.ajax({
        async: true,
        type: "POST",
        cache: false,
        data: "{ 'message': '" + escape(message) + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url
    });
}

//======================Обработка сообщений



//======================Контрол Comet

function v4_cometGetAndSendMessage() {
    v4_cometSendMessage($("#v4_cometMessage").val());
    $("#v4_cometMessage").val("");
    $("#v4_cometMessage").focus();
}

function v4_cometSetMessage(message) {
    
    if (null == v4_cometSetUsersList.form) 
        v4_cometSetUsersList(true);

    $("#v4_cometDivChat").html($("#v4_cometDivChat").html() + message);
    v4_setToolTip();
    v4_cometSetScrollChat();
    v4_msgTimeToLocal();
}

function v4_msgTimeToLocal() {
    $(".v4CometMsgTime:not([lt])").each(function() {
        var lt = Kesco_toLocalTime($(this).html());
        $(this).html(lt);
        $(this).attr("lt", "true");
    });

}

function v4_cometShowList() {
    v4_cometShowImgMsg(0) 
    v4_cometSetUsersList();
}

function v4_cometShowImgMsg(show) {
    if (show == 0)
        $("#v4_imgCometNewMessage").hide();
    else {
        if (null != v4_cometSetUsersList.form && v4_cometSetUsersList.form.dialog('isOpen') === true)
            $("#v4_imgCometNewMessage").hide();
        else
            $("#v4_imgCometNewMessage").show();
    }
}

function v4_cometSetScrollChat() {
    if ($('#v4_cometDivChat')[0])
        $('#v4_cometDivChat').scrollTop($('#v4_cometDivChat')[0].scrollHeight);
}


function v4_cometSetUsersList(create) {

    if (null == v4_cometSetUsersList.form) {
    
        var title = v4Comet_clientLocalization.COMET_Title;
        var width = 300;
        var height = 350;
        var onOpen = function (event, ui) {
             $("#v4_cometMessage").focus();
        };
        
        var dialogPostion = { my: "right bottom", at: "left top", of: $('#v4_cometUsersList_0') };
        v4_cometSetUsersList.form = v4_dialog("v4_cometUsersList_1", $("#v4_cometUsersList_1"), title, width, height, onOpen, null, null, dialogPostion, false);

        $('<div/>').attr({ id: 'v4_cometDivMessage', style: "margin-left:5px;vertical-align: middle;" }).insertAfter("#v4_cometUsersList_1");
        $('#v4_cometDivMessage').append(
			$('<div/>').attr({ id: 'v4_cometDivChat', style: "margin-left:5px;margin-right:10px;margin-bottom:5px;height:180px;overflow:auto;background:whitesmoke;" }));

        $('<label/>').attr({ id: 'v4_cometLabelChat', style: "margin-left:5px;" }).html("<b>" + v4Comet_clientLocalization.lblChat + ":</b>").insertBefore("#v4_cometDivChat");
        $('<img/>').attr({ id: 'v4_cometImgMessage', style: "vertical-align: middle;", src: "/styles/Notes.gif", title: v4Comet_clientLocalization.lblWriteMessage}).insertAfter("#v4_cometDivChat");
        $('<textarea/>').attr({ id: 'v4_cometMessage', style: "margin-left:10px; width:60%; display: inline-block; vertical-align: middle;"}).insertAfter("#v4_cometImgMessage");
        $('<input/>').attr({ id: 'v4_cometBtnSendMessage', type: "image", src: "/styles/PageNextActive.gif", style: "vertical-align: middle;", title: v4Comet_clientLocalization.cmdSendMessage }).insertAfter("#v4_cometMessage");

        $("#v4_cometBtnSendMessage").click(function(event) {
            v4_cometGetAndSendMessage();
        });

        $("#v4_cometBtnSendMessage").bind("keydown", function(event) {
            var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
            if (keycode == 13 || keycode == 10) {
                v4_cometGetAndSendMessage();
                return false;
            } else {
                return true;
            }
        });

        $("#v4_cometMessage").bind("keydown", function (event) {
            var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
            if ((event.ctrlKey || event.metaKey) && (keycode == 13 || keycode == 10)) {
                v4_cometGetAndSendMessage();
                return false;
            }
            else {
                return true;
            }
        });
    };

    if (null == create) {
        v4_cometSetUsersList.form.dialog("open");
        v4_cometSetScrollChat();
    }
}

function v4_cometCloseUsersList() {
    if (null != v4_cometSetUsersList.form)
        v4_cometSetUsersList.form.dialog("close");
}