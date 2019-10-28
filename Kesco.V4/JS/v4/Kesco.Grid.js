v4_columnSettingsForm.form = null;
function v4_columnSettingsForm(ctrlId, gridCmdListnerIndex, positionElementId, className, columnId, title) {

    var width = 310;
    var height = 350;
    var onOpen = function () { };
    var buttons = [
        {
            id: "btnClmnSettings_Apply_" + ctrlId,
            text: grid_clientLocalization.ok_button,
            icons: {
                primary: v4_buttonIcons.Ok
            },
            click: function () { v4_getColumnValuesFilter(gridCmdListnerIndex, className, columnId); }
        },
        {
            id: "btnClmnSettings_Cancel_" + ctrlId,
            text: grid_clientLocalization.cancel_button,
            icons: {
                primary: v4_buttonIcons.Cancel
            },
            width: 75,
            click: v4_closeColumnSettingsForm
        }
    ];
    
    var dialogPostion = { my: "left top+12", at: "left", of: $("#" + positionElementId) };
    v4_columnSettingsForm.form = v4_dialog("divColumnSettingsForm_" + ctrlId, $("#divColumnSettingsForm_" + ctrlId), title, width, height, onOpen, null, buttons, dialogPostion);

    v4_columnSettingsForm.form.dialog({
        resize: function (event, ui) {
            var x = $('#btnClmnSettings_Apply_' + ctrlId).offset().top - $("#divColumnSettingsForm_Values_" + ctrlId).offset().top - 20;
            $("#divColumnSettingsForm_Values_" + ctrlId).height(x);
        }
    });

    v4_columnSettingsForm.form.dialog("open");

}

function v4_closeColumnSettingsForm() {
   
    if (null != v4_columnSettingsForm.form)
        v4_columnSettingsForm.form.dialog("close");

}


v4_columnSettingsUserFilterForm.form = null;
function v4_columnSettingsUserFilterForm(ctrlId, gridCmdListnerIndex, filterId, columnId, title) {

    var width = 300;
    var height = 150;
    var onOpen = function () { };
    var buttons = [
        {
            id: "btnUFilter_Apply_" + ctrlId,
            text: grid_clientLocalization.ok_button,
            icons: {
                primary: v4_buttonIcons.Ok
            },
            click: function () { v4_setFilterColumnByUser(ctrlId, gridCmdListnerIndex, columnId); }
        },
        {
            id: "btnUFilter_Cancel_" + ctrlId,
            text: grid_clientLocalization.cancel_button,
            icons: {
                primary: v4_buttonIcons.Cancel
            },
            width: 75,
            click: v4_closeColumnSettingsUserFilterForm
        }
    ];


        v4_columnSettingsUserFilterForm.form = v4_dialog("divColumnSettingsUserFilterForm_" + ctrlId, $("#divColumnSettingsUserFilterForm_" + ctrlId), title, width, height, onOpen, null, buttons);

    v4_columnSettingsUserFilterForm.form.dialog("open");
}

function v4_closeColumnSettingsUserFilterForm() {
    
    if (null != v4_columnSettingsUserFilterForm.form)
        v4_columnSettingsUserFilterForm.form.dialog("close");
}

function v4_columnValuesChecked(chk, className) {
    var chkState = 'checked';
    if (chk)
        chkState = 'unchecked';

    var selector = "." + className + ":checkbox:" + chkState;

    $(selector).each(function () {
        this.checked = chk;
    });
}

/*Получение состояния(значения) поля записи*/
function v4_setStateCheckAllValues(idAll, className) {

    var selector0 = "." + className + ":checkbox:checked";
    var selector1 = "." + className + ":checkbox:unchecked";
    var existCheck = $(selector0).length;
    var existUnCheck = $(selector1).length;
    //$('.myCheckbox').is(':checked');

    if (existCheck > 0 && existUnCheck > 0)
        $('#' + idAll).prop('indeterminate', true);
    else if (existCheck > 0) {
        $('#' + idAll).prop('indeterminate', false);
        $('#' + idAll).prop('checked', true);
    } else {
        $('#' + idAll).prop('indeterminate', false);
        $('#' + idAll).prop('checked', false);
    }
}

/*Отправка на сервер команды по сортировке указанной колоки*/
function v4_setOrderByColumnValues(gridCmdListnerIndex, columnId, direction) {
    setTimeout(v4_closeColumnSettingsForm, 10);
    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetOrderByColumnValues', 'ColumnId', columnId, 'Direction', direction);
}

/*Отправка на сервер команды об очистке сортирвки указанной колонки*/
function v4_clearOrderByColumnValues(gridCmdListnerIndex, columnId) {
    setTimeout(v4_closeColumnSettingsForm, 10);
    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ClearOrderByColumnValues', 'ColumnId', columnId);
}

/*Получение значений фильтра для фильтра по значениям*/
function v4_getColumnValuesFilter(gridCmdListnerIndex, className, columnId) {

    var selector = "." + className + ":checkbox";
    var selector0 = "." + className + ":checkbox:checked";
    var selector1 = "." + className + ":checkbox:unchecked";
    var checkboxs = $(selector).length;
    var checkboxsCheck = $(selector0).length;
    var checkboxsUnCheck = $(selector1).length;


    if (checkboxs == checkboxsCheck) {
        setTimeout(v4_closeColumnSettingsForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterByColumnValues', 'ColumnId', columnId, 'Data', 'All');
        return;
    }
    if (checkboxs == checkboxsUnCheck) {
        setTimeout(v4_closeColumnSettingsForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterByColumnValues', 'ColumnId', columnId, 'Data', '');
        return;
    }

    var filterCheck = true;
    if (checkboxsCheck <= checkboxsUnCheck) {
        selector = selector0;
    } else {
        selector = selector1;
        filterCheck = false;
    }

    var values = "";
    $(selector).each(function (index, item) {
        values += (values.length > 0 ? ',' : '') + parseInt($(item).attr("data-id"));
    });

    setTimeout(v4_closeColumnSettingsForm, 10);
    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterByColumnValues', 'ColumnId', columnId, 'Data', values, 'Equals', filterCheck ? 1 : 0);
}

/*Установка пользовательского фильтра и открытие формы пользовательского фильтра без открытия формы настроек*/
function v4_openUserFilterForm(menuItem, gridCmdListnerIndex) {

    if (menuItem.attr('data-columnId') == null) return;

    var columnId = menuItem.attr('data-columnId');
    var filterId = menuItem.attr('data-filterId');


    if (v4_isInt(filterId) && parseInt(filterId) <= 1) {
        setTimeout(v4_closeColumnSettingsForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterColumnByUser', 'ColumnId', columnId, "FilterId", filterId);
    } else
        v4_OpenUserFilterFormCmd(gridCmdListnerIndex, columnId, filterId, 0);
}

/*Отправка на сервер команды на открытие формы пользовательского фильтра*/
function v4_OpenUserFilterFormCmd(gridCmdListnerIndex, columnId, filterId, setValue) {
    setTimeout(v4_closeColumnSettingsForm, 10);
    cmd('cmd', 'Listener', 'ctrlId',  gridCmdListnerIndex, 'cmdName', 'OpenUserFilterForm', 'ColumnId', columnId, 'FilterId', filterId, 'SetValue', setValue);
}

/*Отправка на сервер команды на установку фильтра по значениям*/
function v4_selectFilterUserClause_OnChange(gridId, obj, intervalValue, className) {
    var val;

    if (obj != null)
        val = $(obj).find(":selected").val();
    else
        val = $("#v4_selectFilterUserClause_" + gridId +" option:selected").val();

    if (val == intervalValue) {
        $("." + className).show();
        $(".v4ClauseNeedTop").addClass("v4PaddingTop");
    } else {
        $("." + className).hide();
        $(".v4ClauseNeedTop").removeClass("v4PaddingTop");
    }

    if (val == 0 || val == 1) {
        $("#v4_ctrlFilterClause_" + gridId + "_1_0").hide();
        setTimeout(function () {
            $("#v4_ctrlFilterClause_" + gridId + "_1_1").hide();
        }, 10);
    } else {
        $("#v4_ctrlFilterClause_" + gridId + "_1_0").show();
        $("#v4_ctrlFilterClause_" + gridId + "_1_1").show();
        $("#v4_ctrlFilterClause_" + gridId + "_1_0").focus();
    }
}

/*Отправка на сервер команды на установку пользовательского фильтра*/
function v4_setFilterColumnByUser(gridId, gridCmdListnerIndex, columnId) {

    var filterId = $("#v4_selectFilterUserClause_" + gridId + " option:selected").val();
    var val_field1 = $("#v4_ctrlFilterClause_" + gridId + "_1_0").attr("t");
    var val_field2 = $("#v4_ctrlFilterClause_" + gridId + "_2_0").attr("t");

    if (filterId > 1) {
        if ((val_field1 == null || val_field1.length == 0)
            || ((filterId == 150) && (val_field2 == null || val_field2.length == 0))) {
            alert(grid_clientLocalization.empty_filter_value);
            $("#v4_ctrlFilterClause_" + gridId + "_1_0").focus();
            return;
        }
    }
    
    setTimeout(v4_closeColumnSettingsUserFilterForm, 10);

    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterColumnByUser', 'ColumnId', columnId, "FilterId", filterId);

}

/*Отправка на сервер команды на очистку фильтра по значениям*/
function v4_clearFilterColumnValues(gridCmdListnerIndex, columnId) {

    setTimeout(v4_closeColumnSettingsForm, 10);
    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ClearFilterColumnValues', 'ColumnId', columnId);
}

/*Отправка на сервер команды очистки пользовательского фильтра*/
function v4_clearDataFilter(gridCmdListnerIndex) {
    cmd('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ClearDataFilter');
}

/*Фиксация заголовка таблицы*/
function v4_fixedHeader(ctrlId) {
   
    if (ctrlId == null) {
        $("table.grid").floatThead({
            position: "absolute",
            scrollContainer: true
        });
        $("table.gridGroup").floatThead({
            position: "absolute",
            scrollContainer: true
        });

        return;
    }

    $("#table_" + ctrlId).floatThead({
        position: "absolute",
        scrollContainer: true
    });

}

/*Отмена фиксации заголовка таблицы*/
function v4_fixedHeaderDestroy(ctrlId) {

    if (ctrlId == null) {
        $("table.grid").floatThead("destroy");
        $("table.gridGroup").floatThead("destroy");
        return;
    }

    $("#table_" + ctrlId).floatThead("destroy");

}

/*Установка ширины панели группировки*/
function v4_setWidthGroupingPanel(gridId) {

    $("#divGroupingPanel_" + gridId).show();
    
    return;

    var wMin = $("#table_" + gridId).css("min-width");
    var wMinPanel = $("#divGroupingPanel_" + gridId).css("min-width");

    if (wMin == null) {
        wMin = $("#table_" + gridId).width();
        if (wMin == null) {
            wMin = $("#table_" + gridId).outerWidth();
        }
    }
    
    if (wMin != null && wMin > wMinPanel) {
        setTimeout(function () {
            $("#divGroupingPanel_" + gridId).css("min-width", wMin);
            $("#divGroupingPanel_" + gridId).css("max-width", wMin);
        }, 10);
    }

}

/*Установка контролу необходимых свойсств для перетаскивания колонок, по которым будет группировка и изменение порядка в таблице*/
function v4_gridEnableGrouping(gridId, gridCmdListnerIndex) {

    $("#thead_" + gridId).sortable({
        zIndex: 10000,
        delay: 100,
        items: "> th",
        appendTo: ".v4GroupingPanel_" + gridId,
        helper: "clone",
        placeholder: "ui-state-highlight",
        connectWith: ".v4DropPanel_" + gridId,
        //opacity: 0.8,
        cursor: 'pointer',
        start: function(event, ui) {
            ui.helper.css('background-color', '#E9E9E9');
            ui.helper.css('border', '1px solid #999999');
            ui.helper.css('width', 'auto');
        },
        update: function (event, ui) {
            var ids = "";
            var tr = $(ui.item).parent();
            if (tr.length == 0) return;

            tr.find("div[column-id]").each(function() {
                if (ids.length > 0) ids += ",";
                ids += $(this).attr("column-id");
            });
            if (ids.length == 0) return;
            
            cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ReorderColumns', 'ColumnIds', ids);
        },

        cursorAt: { left: 8, top: 10 }

    });

    $("#thead_" + gridId).disableSelection();

    $(".v4DropPanel_" + gridId).droppable({
        drop: function(event, ui) {
            var list = $(this).find('ul');
            if (list.length == 0)
                list = $(this).append('<ul class="v4GridListGroup"></ul>').find('ul')
            var newElement = ui.draggable.html();
            list.append("<li>" + newElement + "</li>");

            list.sortable({
                zIndex: 10000,
                delay: 100,
                axis: "x",
                cursor: 'pointer',
                start: function(event, ui) {
                    $(".v4DropPanel_" + gridId).droppable("disable");
                    ui.helper.css('width', 'auto');
                },
                stop: function(event, ui) {
                    $(".v4DropPanel_" + gridId).droppable("enable");
                    
                    var list = $(".v4DropPanel_" + gridId).find('ul');
                    v4_gridGrouping(gridId, gridCmdListnerIndex, list);
                },
                cursorAt: { left: 8, top: 10 }
            });
            list.disableSelection();
            list.data("ui-sortable").floating = true;

            var expButtons = $(this).find('.v4ExpandColumn');
            if (expButtons.length > 0) expButtons.show();

            var delButtons = $(this).find('.v4DeleteColumn');
            if (delButtons.length > 0) delButtons.show();

            $("#spanGroupingPanelEmpty_" + gridId).hide();

            v4_gridGrouping(gridId, gridCmdListnerIndex, list);
        }
    });
 }

/*Удаление колонки из списка группировки*/
function v4_gridGroupingRemoveColumn(gridId, gridCmdListnerIndex, columnId) {

    $("li").has("div[column-id=" + columnId + "]").remove();
    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'GroupingRemoveColumn', 'ColumnId', columnId);
}

/*Сообщение на сервер о развернутой группе*/
function v4_gridGroupingExpandColumn(gridId, gridCmdListnerIndex, columnId) {
    
    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'GroupingExpandColumn', 'ColumnId', columnId);
}

/*Отправка колонок группировки на сервер*/
function v4_gridGrouping(gridId, gridCmdListnerIndex, list) {

    var columns = list.find('div[column-id]');
    var ids = ""
    columns.each(function(index) {
        if (ids.length > 0) ids += ",";
        ids += $(this).attr("column-id");

    });

    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'GroupingGridData', 'ColumnIds', ids);
}

/*Управление видимостью групп указанного уровня*/
function v4_gridDisplayGroupByIndex(gridId, gridCmdListnerIndex, inx) {

    var trs = $("#" + gridId + " tr[group-id]").filter(function () {
        var _inx = $(this).attr("group-index");
        return _inx <= inx;
    });
    var recursionId;
    var prevInx = -1;
    var inxVisible = {};

    for (var i = 0; i < trs.length; i++) {
        var groupId = $(trs[i]).attr("group-id");
        var groupInx = $(trs[i]).attr("group-index");
        var groupVisible = groupInx < inx ? false : inxVisible[groupInx];
        var v = v4_gridDisplayGroupById(gridId, gridCmdListnerIndex, groupId, null, groupVisible, recursionId);
        if (inxVisible[groupInx] == null)
            inxVisible[groupInx] = v;

        recursionId = i;
    }
}

/*Управление видимостью указанной группы*/
function v4_gridDisplayGroupById(gridId, gridCmdListnerIndex, groupId, focusId, isVisible, recursionId) {

    var x = $("#" + gridId + " tr[group-parent=" + groupId + "]");
    if (x.length == 0) return;
    var iconSpan = "v4sp_" + groupId;
    
    if (isVisible == null) 
        isVisible = $(x).is(":visible");

    if (isVisible) {
        for (var i = 0; i < x.length; i++) {
            var groupValue = $(x[i]).attr("group-id");
            if (groupValue == null || groupValue == "") break;
            v4_gridDisplayGroupById(gridId, gridCmdListnerIndex, groupValue, focusId, isVisible, i);
        }

        if (iconSpan != null && $("#" + iconSpan).hasClass("ui-icon-triangle-1-se")) {
            $("#" + iconSpan).removeClass("ui-icon-triangle-1-se").addClass("ui-icon-triangle-1-e");
        }
        $(x).hide();
    } else {
        if (iconSpan != null && $("#" + iconSpan).hasClass("ui-icon-triangle-1-e")) {
            $("#" + iconSpan).removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-se");
        }
        $(x).show();
    }

    if (recursionId == null) {
        var st = $("#" + gridId).scrollTop();
        v4_fixedHeader(gridId);
        if (focusId != null) {
            $("#" + focusId + "_" + groupId).focus();
            $("#" + gridId).scrollTop(st);
        }
    }

    return isVisible;
}

function v4_gridCheckedAll(gridId, gridCmdListnerIndex, chk, allCheck) {
    $("#" + gridId + " .v4GridCheckbox").prop('checked', chk);

    if (allCheck)
        $("#allCheck_" + gridId).prop('checked', chk);
}

function v4_gridGetChecked(gridId, gridCmdListnerIndex) {
    var chks = $("#" + gridId + " .v4GridCheckbox:checkbox:checked");
    var retValue = "";
    for(var i=0; i< chks.length; i++)
        retValue += (retValue.length > 0 ? String.fromCharCode(30) : "") + $(chks[i]).attr("data-id");

    return retValue;
}