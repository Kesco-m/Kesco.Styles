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

    $("#v4_txaDocDesc_0").focusout(function() {
        var input = $(this);
        v4_txaDocDesc_change(input, 1);
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

function v4_SaveDocumentDescription() {
    v4_docDescription = $("#v4_txaDocDesc_0").val();
    cmdasync('cmd', 'SaveDocumentDesription', 'Description', v4_docDescription);
    $("#v4_btnTxaDocDesc").hide();
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

    sbContent += "<div class='v4DivTableRow'>";
        sbContent += "<div class='v4DivTableCell v4PaddingCell'>";
            sbContent += "<input type='radio' ID='v4_cbSC1' checked Name='SaveConfirm' Value='0'/>";
        sbContent += "</div>";
        sbContent += "<div class='v4DivTableCell v4PaddingCell'>";
            sbContent += "<span style='text-align: left'><label style='margin-left: 5px;'>" + lblOpenInDocumentsArchive + "</label></span>";
        sbContent+="</div>";
    sbContent+="</div>";

    sbContent+="<div class='v4DivTableRow'>";
        sbContent+="<div class='v4DivTableCell v4PaddingCell'>";
            sbContent+="<input type='radio' ID='v4_cbSC2' Name='SaveConfirm' Value='1'/>";
        sbContent+="</div>";
        sbContent += "<div class='v4DivTableCell v4PaddingCell' style='text-align: left !important;'>";
            sbContent += "<span style='text-align: left'><label style='margin-left: 5px;'>" + lblContinueEditing + "</label></span>";
        sbContent+="</div>";
    sbContent+="</div>";
    sbContent += "</div>";
    $('body').append("<div id='v4_divSaveConfirm'></div>"); $("#v4_divSaveConfirm").html(sbContent);
}