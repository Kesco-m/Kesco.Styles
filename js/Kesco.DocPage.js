// -------------------------------------------------------------------------------------------------------
save_dialogShow.form = null;
var v4_docDescription;

$(document).ready(function() {
    v4_docDescription = $("#v4_txaDocDesc_0").val();
    $("#v4_txaDocDesc_0").on("input",
        function(e) {
            var input = $(this);
            v4_txaDocDesc_change(input, 0);
        });   
});


function v4_txaDocDesc_change(input, out) {
    var val = input.val();
    if (input.data("lastval") != val) {
        input.data("lastval", val);
        if (v4_docDescription != val)
            $("#v4_btnTxaDocDesc").show();
        else {
            $("#v4_btnTxaDocDesc").hide();
            if (out == 1) $("#btnRefresh").focus();
        }
    }
}

function v4_EditDocumentDescription() {
    $("#v4_txaDocDesc").show();
    $("#v4_txaDocDescRead").hide();
    $("#v4_btnTxaDocEdit").hide();
    $("#v4_btnTxaDocCancel").show();
}

function v4_CancelDocumentDescription() {
    $("#v4_txaDocDesc_0").val(v4_docDescription);
    $("#v4_btnTxaDocEdit").show();
    $("#v4_txaDocDesc").hide();
    $("#v4_txaDocDescRead").show();
    $("#v4_btnTxaDocDesc").hide();
    $("#v4_btnTxaDocCancel").hide();

}

function v4_SaveDocumentDescription() {
    v4_docDescription = $("#v4_txaDocDesc_0").val();
    $("#v4_txaDocDescRead_0").val(v4_docDescription);
    cmdasync('cmd', 'SaveDocumentDesription', 'Description', v4_docDescription);
    $("#v4_btnTxaDocEdit").show();
    $("#v4_txaDocDesc").hide();
    $("#v4_txaDocDescRead").show();
    $("#v4_btnTxaDocDesc").hide();
    $("#v4_btnTxaDocCancel").hide();
}

function save_dialogShow(title) {
    var idContainer = "v4_divSaveConfirm";
    if (null == save_dialogShow.form) {
        var width = 260;
        var height = 150;
        var onOpen = function () { v4_openSaveConfirmForm(); };
        var onClose = function () { v4_closeSaveConfirmForm(); };
        var buttons = [
            {
                id: "btn_Apply_SDS",
                text: "Ok",
                icons: {
                    primary: v4_buttonIcons.Ok
                },
                click: function () { cmd('cmd', 'SaveDocument', 'AfterSaveProcess', $("input[name='SaveConfirm']:checked").val()); }
            }
        ];
        save_dialogShow.form = v4_dialog(idContainer, $("#" + idContainer), title, width, height, onOpen, onClose, buttons);
    }

    $("#" + idContainer).dialog("option", "title", title);
    save_dialogShow.form.dialog("open");
}

function v4_closeSaveConfirmForm() {
    if (null != save_dialogShow.form) {
        save_dialogShow.form.dialog("close");
        save_dialogShow.form = null;
        $('#v4_divSaveConfirm').remove();
    }
}

function v4_openSaveConfirmForm() {
    if (null != save_dialogShow.form) {

    }
}

function v4_createDialogSaveContent(lblOpenInDocumentsArchive, lblContinueEditing) {

    var sbContent = "<div class='v4DivTable'>";

    sbContent += "<div class='v4DivTableRow' style='height:10px;'>&nbsp;</div>";

    sbContent += "<div class='v4DivTableRow'>";
        sbContent += "<div class='v4DivTableCell v4PaddingCell'>";
            sbContent += "<input type='radio' ID='v4_cbSC1' checked Name='SaveConfirm' Value='0'/>";
        sbContent += "</div>";
        sbContent += "<div class='v4DivTableCell'>";
        sbContent += "<span style='text-align: left'><label for='v4_cbSC1' style='margin-left: 5px;'>" + lblOpenInDocumentsArchive + "</label></span>";
        sbContent+="</div>";
        sbContent += "</div>";

        sbContent += "<div class='v4DivTableRow' style='height:10px;'>&nbsp;</div>";

    sbContent+="<div class='v4DivTableRow' >";
    sbContent +="<div class='v4DivTableCell v4PaddingCell'>";
            sbContent+="<input type='radio' ID='v4_cbSC2' Name='SaveConfirm' Value='1'/>";
        sbContent+="</div>";
        sbContent += "<div class='v4DivTableCell' style='text-align: left !important;'>";
        sbContent += "<span style='text-align: left'><label for='v4_cbSC2' style='margin-left: 5px;'>" + lblContinueEditing + "</label></span>";
        sbContent+="</div>";
    sbContent+="</div>";
    sbContent += "</div>";
    $('body').append("<div id='v4_divSaveConfirm'></div>"); $("#v4_divSaveConfirm").html(sbContent);
}

function v4_prepareSignDocument(emplId, type, flagSend, warningText, labelMsgText, titleForm, signText, signInsteadOf, cancelBtnText ) {

    warningText = decodeURIComponent(warningText);
    labelMsgText = decodeURIComponent(labelMsgText);
    titleForm = decodeURIComponent(titleForm);
    signText = decodeURIComponent(signText);
    signInsteadOf = decodeURIComponent(signInsteadOf);
    cancelBtnText = decodeURIComponent(cancelBtnText);

    try {
        $.getJSON("CurrentEmployee.ashx",
                {
                    employeeId: emplId,
                    dt: new Date().getTime()
                })
            .success(function (data) { v4_addSignDocument(data, emplId, type, flagSend, warningText, labelMsgText, titleForm, signText, signInsteadOf, cancelBtnText) })
            .error(function (error) { alert(error.responseText); });
    } catch (e) {
    }
}

function v4_addSignDocument(data, emplId, type, flagSend, warningText, labelMsgText, titleForm, signText, signInsteadOf, cancelBtnText) {

    if (data.length > 1 || type == 1) {

        if (type != 1) {
            $("#v4_divSignFormWarning_0_0").html('');
            $("#v4_divSignFormWarning_0_1").html('');
            $("#v4_divSignFormWarning")
                .css('margin-bottom', 'none')
                .hide();
        } else {

            $("#v4_divSignFormWarning_0_0").html("<img src='/styles/Attention.gif' border='0'/>");
            $("#v4_divSignFormWarning_0_1").html(warningText.replace(/(\r\n|\n|\r)/gm, "<br/><br/>"));
            $("#v4_divSignFormWarning")
                .css('margin-bottom', '10px')
                .show();
        }

        $("#v4_divSignFormButtons").html('');
        $("#v4_divSignFormMsg").html('');

        var maxTab = -1;
        $('[tabindex]').attr('tabindex',
            function(a, b) {
                maxTab = Math.max(maxTab, +b);
            });
        if (maxTab == -1) maxTab = 1;

        for (var i = 0; i < data.length; i++) {

            var emplInsteadOfId = data[i].Code;

            $("#v4_divSignFormButtons").append("<div class='v4BtnSign' data-id='" +
                emplInsteadOfId +
                "' id='v4_divSignFormButtons" +
                emplInsteadOfId +
                "'>" +
                (emplInsteadOfId == emplId ? signText : signInsteadOf + " [" + data[i].Name + "]") +
                "</div>");

            $("#v4_divSignFormButtons" + emplInsteadOfId)
                .button()
                .css({ 'width': '100%' })
                .attr('tabindex', maxTab)
                .on("click",
                    function() {
                        var sendMsg = $("#v4_divSignFormMsg_0").prop("checked") ? 1 : 0;
                        cmdasync('cmd',
                            'AddDocumentSign',
                            'Type',
                            type,
                            'EmplId',
                            emplId,
                            'EmplInsteadOfId',
                            $(this).attr("data-id"),
                            'SendMessage',
                            sendMsg);

                        $("#v4_divSignFormButtonsCancel").click();
                    })
                .on("keyup",
                    function(event) {
                        if (event.keyCode == 13 || event.keyCode == 32) {
                            $(this).click();
                        }
                    });

            maxTab++;
        }

        $("#v4_divSignFormButtons")
            .append("<div class='v4BtnSign' id='v4_divSignFormButtonsCancel'>" + cancelBtnText + "</div>");
        $("#v4_divSignFormButtonsCancel")
            .button()
            .css({ 'width': '100%', 'margin-bottom': '10px' })
            .attr('tabindex', maxTab)
            .on("click",
                function() {
                    v4_document_SignDialogClose();
                })
            .on("keyup",
                function(event) {
                    if (event.keyCode == 13 || event.keyCode == 32) {
                        $(this).click();
                    }
                });

        $("#v4_divSignFormMsg").append("<input id='v4_divSignFormMsg_0' type='checkbox'/>");
        $("#v4_divSignFormMsg").append("<label for='v4_divSignFormMsg_0'>" + labelMsgText + "</label>")
        $("#v4_divSignFormMsg_0")
            .css({
                'margin': '0',
                'margin-right': '5px',
                'padding': '0',
                'vertical-align': 'bottom',
                'position': 'relative',
                'top': '-1px',
                '*overflow': 'hidden'
            })
            .attr('tabindex', ++maxTab);

        if (flagSend == 1)
            $("#v4_divSignFormMsg_0").prop('checked', true);
        else
            $("#v4_divSignFormMsg_0").prop('checked', false);

        var width = type == 1 ? 403 : 303;

        v4_document_SignDialog(titleForm, width);
    } else {
        cmdasync('cmd', 'AddDocumentSign',
            'Type', type,
            'EmplId', emplId,
            'EmplInsteadOfId', emplId,
            'SendMessage', 1);
    }
}

v4_document_SignDialog.form = null;
function v4_document_SignDialog(titleForm, width) {

    var onOpen = function() {
        $("[aria-describedby='v4_divSignForm'] .ui-dialog-titlebar-close").css({ 'visibility': 'hidden' });
        var obj = $(".v4BtnSign").first();
        if (obj) setTimeout(function() { obj.focus(); }, 10);
    };

    v4_document_SignDialog.form = v4_dialog("v4_divSignForm", $("#v4_divSignForm"), titleForm, null, null, onOpen, null, null);
    v4_document_SignDialog.form.dialog("option", "width", width);
    v4_document_SignDialog.form.dialog("open");
}

function v4_document_SignDialogClose() {
    if (null != v4_document_SignDialog.form) {
        v4_document_SignDialog.form.dialog("close");
        v4_document_SignDialog.form = null;
    }
}

function v4_tryOpenDocumentInDocView(docId, signChanged, isfirstSign, tryDocview, sendMessage, signer, message) {

    if (Silverlight == null || (Silverlight != null && !Silverlight.isInstalled())) {

        if (signChanged && !isfirstSign) return;
        /*здесь выполнять только синхронно, т.к. сохранение докмумента
       идет асинхронно и повторная асинхронная команда не выполниться*/
        
        cmd("cmd", "RefreshDoc");
        return;
    }

    var needClose = false;
    var existError = false;
    if (tryDocview) {

        srv4js("OPENDOC",
            $.validator.format("id={0}&newwindow=1", docId),
            function(rez, obj) {

                if (!rez.error || (sendMessage && obj != null && !obj.error)) {
                    needClose = true;
                } else {
                    existError = true;
                    if (signChanged && !isfirstSign) return;
                }


                if (sendMessage && !existError) {
                    var params = $.validator.format("id={0}&userId={1}&message={2}&checkall=1", docId, signer, message);
                    srv4js("SENDMESSAGE",
                        params,
                        function(rez, obj) {

                            if (rez.error) {
                                existError = true;
                                console.log('Ошибка взаимодействия с архивом документов: ' + rez.errorMsg);
                            } else {
                                if (signChanged && !isfirstSign) return;
                                needClose = true;
                            }
                        },
                        rez);
                }
            },
            null);
    }

    if (needClose && !existError)
        v4_closeWindow();
    else {
        if (signChanged && !isfirstSign) return;
        /*здесь выполнять только синхронно, т.к. сохранение докмумента
         идет асинхронно и повторная асинхронная команда не выполниться*/
        cmd("cmd", "RefreshDoc");
    }
}

