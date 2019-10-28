var v4_kescoHub = null;
var v4_tryingToReconnect = false;
var v4_signalTrace = false;
var v4_signalStatus = "connection to server lost...";

$(document).ready(function () {
    /*
     $.signalR.connectionState {connecting: 0, connected: 1, reconnecting: 2, disconnected: 4}
     */
    //if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {

    var v4_signalTrace = v4_getQSParamValue("signalTrace") == "1";

    v4_kescoHub = $.connection.kescoSignalHub;
    v4_registerClientMethods();
    
    $.connection.hub.connectionSlow = function() {
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Медленное подключение");
    };

    $.connection.hub.reconnecting(function () {
        v4_tryingToReconnect = true;
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Восстановление подключения"); 
        window.status = v4_signalStatus;
        setTimeout(v4_brokenConnection, 15000);
    });

    $.connection.hub.reconnected(function () {
        v4_tryingToReconnect = false;
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Подключение восстановлено");
        v4_kescoHub.server.onPageRegistered(idp, v4_clientName, v4_userId, v4_userName, v4_userNameLat, v4_ItemId, v4_ItemName, v4_EntityName, v4_isEditable, v4_isChanged);
        window.status = "";
    });
    
    $.connection.hub.disconnected(function () {
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Подключение потеряно");
        if ($.connection.hub.lastError) {
            if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Ошибка:" + $.connection.hub.lastError.message);
        } 

        if (!v4_tryingToReconnect) {
            setTimeout(function () {
                $.connection.hub.start().done(function () {
                    if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Попытка восстановления подключения");
                }).fail(function() {
                     if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Ошибка при попытке восстановления подключения");
                });

            }, 10); 
        }
    });

    $.connection.hub.stateChanged = function() {
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Изменение состояние подключения")
    };

    if (v4_signalTrace) $.connection.hub.logging = true;

    $.connection.hub.start().done(function () {
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Подключение установлено"); 
    }).fail(function() {
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Ошибка установке подключения"); 
    });

   // }
});


function v4_hubImpossibleConnect() {
    location.href = location.href;
}

function v4_registerClientMethods() {

    v4_kescoHub.client.onPageConnected = function () {
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Регестрируемся");
        v4_kescoHub.server.onPageRegistered(idp, v4_clientName, v4_userId, v4_userName, v4_userNameLat, v4_ItemId, v4_ItemName, v4_EntityName, v4_isEditable, v4_isChanged);
    }

    v4_kescoHub.client.onReconnected = function () {
        if (v4_signalTrace) console.log("[" + (new Date()).toLocaleTimeString() + "] KescoHub Не можем восстановить подключение");
        v4_brokenConnection();
    }

    v4_kescoHub.client.brokenConnection = v4_brokenConnection;
    v4_kescoHub.client.hubImpossibleConnect = v4_hubImpossibleConnect;

    v4_kescoHub.client.receiveSignalMessage = function (data) {
       
        if (data.IsV4Script == true) {
           
            v4_xml = v4_string2Xml(data.Message);
            v4_xmlProcessing(v4_xml);
        }
    }
    
    v4_kescoHub.client.refreshActivePagesInfo = function(pages) {

        v4_activePages = pages.length;
        var contentActive = "";
        var showControl = false;
        var ps = {};

        $.each(pages,
            function () {
                if (!showControl && this.UserId != v4_userId) showControl = true;
                if (this.UserId == v4_userId) return;
                if (ps[this.UserId]) {
                    var p = ps[this.UserId];
                    if (!p.IsEditable && this.IsEditable)
                        ps[this.UserId] = this;
                } else
                    ps[this.UserId] = this;
            });

       
        $.each(ps,
            function () {
                
                var link = "<a";
                link += " href='javascript:void(0);'";
                link += " class='v4_callerControl'";
                link += " style='cursor:pointer;'";
                link += " data-id='" + this.UserId + "'";
                link += " caller-type='2'";
                link += " onclick=\"v4_openSignalUser('" + this.UserId + "');\"";
                link += ">"
                link += (v4_userLang != "ru" ? this.UserNameLat : this.UserName);
                link +="</a>"
                contentActive += "<div>" + link + " - " + this.EntityState + "</div>";
            });

        if (!showControl) {
            v4_signalCloseUsersList();
            $("#v4_signalUsersList_0").hide();
        } else
            $("#v4_signalUsersList_0").show();

        $("#v4_signalUsersList_1_Body").html(contentActive)
        v4_setToolTip();
    }
}

function v4_brokenConnection() {
    if (window.status == v4_signalStatus)
    {
        v4_tryingToReconnect = true;
        $.connection.hub.stop();
        v4_hubImpossibleConnect();
    }
}

//======================Контрол Signal

function v4_openSignalUser(id) {

    var url = v4_userForm;
    url = url + (url.indexOf('?') > -1 ? "&" : "?") + "id=" + id;
    v4_windowOpen(url, '_blank', 'location=no, menubar=no, status=no, toolbar=no, resizable=yes, scrollbars=yes');

}

// Отправить тестовое сообщение
function v4_signalSendMessage(message) {
    alert("отправка сообщений пока не реализована!")
}

function v4_signalGetAndSendMessage() {
    v4_signalSendMessage($("#v4_signalMessage").val());
    $("#v4_signalMessage").val("");
    $("#v4_signalMessage").focus();
}

function v4_signalSetMessage(message) {

    if (null == v4_signalSetUsersList.form)
        v4_signalSetUsersList(true);

    $("#v4_signalDivChat").html($("#v4_signalDivChat").html() + message);
    v4_setToolTip();
    v4_signalSetScrollChat();
    v4_msgTimeToLocal();
}

function v4_msgTimeToLocal() {
    $(".v4SignalMsgTime:not([lt])").each(function () {
        var lt = Kesco_toLocalTime($(this).html());
        $(this).html(lt);
        $(this).attr("lt", "true");
    });

}

function v4_signalShowList() {
    v4_signalShowImgMsg(0)
    v4_signalSetUsersList();
}

function v4_signalShowImgMsg(show) {
    if (show == 0)
        $("#v4_imgSignalNewMessage").hide();
    else {
        if (null != v4_signalSetUsersList.form && v4_signalSetUsersList.form.dialog('isOpen') === true)
            $("#v4_imgSignalNewMessage").hide();
        else
            $("#v4_imgSignalNewMessage").show();
    }
}

function v4_signalSetScrollChat() {
    if ($('#v4_signalDivChat')[0])
        $('#v4_signalDivChat').scrollTop($('#v4_signalDivChat')[0].scrollHeight);
}


function v4_signalSetUsersList(create) {

    if (null == v4_signalSetUsersList.form) {
    
        var title = v4Signal_clientLocalization.COMET_Title;
        var width = 300;
        var height = 150;
        var onOpen = function (event, ui) {
             $("#v4_signalMessage").focus();
        };
        
        var dialogPostion = { my: "right bottom", at: "left top", of: $('#v4_signalUsersList_0') };
        v4_signalSetUsersList.form = v4_dialog("v4_signalUsersList_1", $("#v4_signalUsersList_1"), title, width, height, onOpen, null, null, dialogPostion, false);

		/*
        $('<div/>').attr({ id: 'v4_signalDivMessage', style: "margin-left:5px;vertical-align: middle;" }).insertAfter("#v4_signalUsersList_1");
        $('#v4_signalDivMessage').append(
			$('<div/>').attr({ id: 'v4_signalDivChat', style: "margin-left:5px;margin-right:10px;margin-bottom:5px;height:180px;overflow:auto;background:whitesmoke;" }));

        $('<label/>').attr({ id: 'v4_signalLabelChat', style: "margin-left:5px;" }).html("<b>" + v4Signal_clientLocalization.lblChat + ":</b>").insertBefore("#v4_signalDivChat");
        $('<img/>').attr({ id: 'v4_signalImgMessage', style: "vertical-align: middle;", src: "/styles/Notes.gif", title: v4Signal_clientLocalization.lblWriteMessage}).insertAfter("#v4_signalDivChat");
        $('<textarea/>').attr({ id: 'v4_signalMessage', style: "margin-left:10px; width:60%; display: inline-block; vertical-align: middle;"}).insertAfter("#v4_signalImgMessage");
        $('<input/>').attr({ id: 'v4_signalBtnSendMessage', type: "image", src: "/styles/PageNextActive.gif", style: "vertical-align: middle;", title: v4Signal_clientLocalization.cmdSendMessage }).insertAfter("#v4_signalMessage");

        $("#v4_signalBtnSendMessage").click(function(event) {
            v4_signalGetAndSendMessage();
        });

        $("#v4_signalBtnSendMessage").bind("keydown", function(event) {
            var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
            if (keycode == 13 || keycode == 10) {
                v4_signalGetAndSendMessage();
                return false;
            } else {
                return true;
            }
        });

        $("#v4_signalMessage").bind("keydown", function (event) {
            var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
            if ((event.ctrlKey || event.metaKey) && (keycode == 13 || keycode == 10)) {
                v4_signalGetAndSendMessage();
                return false;
            }
            else {
                return true;
            }
        });*/
    };

    if (null == create) {
        v4_signalSetUsersList.form.dialog("open");
        v4_signalSetScrollChat();
    }
}

function v4_signalCloseUsersList() {
    if (null != v4_signalSetUsersList.form)
        v4_signalSetUsersList.form.dialog("close");
}



