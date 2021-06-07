var v4_grid = {

    //сделать коллекцию (контрол, ширина)
    originalWidth: null,

    setWidth: function (ctrlId) {

        if (v4_grid.originalWidth == null)
            v4_grid.originalWidth = $("#" + ctrlId).width();

        $("#" + ctrlId).width(v4_grid.originalWidth);
    },

    columnSettingsForm: {
        form: null
    },

    columnSettingsUserFilterForm: {
        form: null
    },

    columnsFieldForm: {
        form: null
    },

    columnsFilterForm: {
        form: null
    },

    clientEditSettings: [],

    clientDetailSettings: [],

    indexSort: 0,

    sortBefore: "",

    /*фиксация заголовка таблицы*/
    fixedHeader: function (ctrlId) {

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
        
        var $grid = $("#table_" + ctrlId);
        $grid.floatThead({
            scrollContainer: function ($table) {
            
                return $table.closest('#' + ctrlId);
            }
        });

    },

    /*отмена фиксации заголовка таблицы*/
    fixedHeaderDestroy: function(ctrlId) {
        if (ctrlId == null) {
            $("table.grid").floatThead("destroy");
            $("table.gridGroup").floatThead("destroy");
            return;
        }

        $("#table_" + ctrlId).floatThead("destroy");
       
    },

    fixedHeaderReflow: function (ctrlId) {
       
        if (ctrlId == null) {
            $("table.grid").trigger("reflow");
            $("table.gridGroup").trigger("reflow");
            return;
        }

        $("#table_" + ctrlId).trigger("reflow");
        
    },

    /*открытие формы с настройками*/
    columnSettingsForm: function (ctrlId, gridCmdListnerIndex, positionElementId, className, columnId, title, clientHeight, changeFilter) {
        var width = 310;
        var height = clientHeight ? clientHeight : 350;
        var onOpen = function() { };
        var buttons = [
            {
                id: "btnClmnSettings_Apply_" + ctrlId,
                text: grid_clientLocalization.apply_button,
                icons: {
                    primary: v4_buttonIcons.Ok
                },
                click: function () { v4_grid.getColumnValuesFilter(ctrlId, gridCmdListnerIndex, className, columnId, null, changeFilter); }
            },
            {
                id: "btnClmnSettings_Cancel_" + ctrlId,
                text: grid_clientLocalization.cancel_button,
                icons: {
                    primary: v4_buttonIcons.Cancel
                },
                width: 75,
                click: v4_grid.closeColumnSettingsForm
            }
        ];


        var topPos = 12;
        var dialogPostion = null;
        if ($("#" + positionElementId).offset() != undefined) {
            if ($("#" + positionElementId).offset().top - 350 < 0) topPos = 0;
            dialogPostion = { my: "left top+" + topPos, at: "left", of: $("#" + positionElementId) };
        }

        v4_grid.columnSettingsForm.form = v4_dialog("divColumnSettingsForm_" + ctrlId, $("#divColumnSettingsForm_" + ctrlId), title, width, height, onOpen, null, buttons, dialogPostion);

        v4_grid.columnSettingsForm.form.dialog({
            resize: function(event, ui) {
                var x = $('#btnClmnSettings_Apply_' + ctrlId).offset().top - $("#divColumnSettingsForm_Values_" + ctrlId).offset().top - 20;
                $("#divColumnSettingsForm_Values_" + ctrlId).height(x);
            }
        });

        v4_grid.columnSettingsForm.form.dialog("open");
    },

    /*открытие формы с пользовательским фильтром*/
    columnSettingsUserFilterForm: function(ctrlId, gridCmdListnerIndex, filterId, columnId, title, changeFilter) {

        var width = 300;
        var height = 150;
        var onOpen = function() { };
        var buttons = [
            {
                id: "btnUFilter_Apply_" + ctrlId,
                text: grid_clientLocalization.apply_button,
                icons: {
                    primary: v4_buttonIcons.Ok
                },
                click: function () { v4_grid.setFilterColumnByUser(ctrlId, gridCmdListnerIndex, columnId, changeFilter); }
            },
            {
                id: "btnUFilter_Cancel_" + ctrlId,
                text: grid_clientLocalization.cancel_button,
                icons: {
                    primary: v4_buttonIcons.Cancel
                },
                width: 75,
                click: v4_grid.closeColumnSettingsUserFilterForm
            }
        ];


        v4_grid.columnSettingsUserFilterForm.form = v4_dialog("divColumnSettingsUserFilterForm_" + ctrlId, $("#divColumnSettingsUserFilterForm_" + ctrlId), title, width, height, onOpen, null, buttons);

        v4_grid.columnSettingsUserFilterForm.form.dialog("open");

    },

    /*закрытие формы с пользовательским фильтром*/
    closeColumnSettingsUserFilterForm: function() {

        if (null != v4_grid.columnSettingsUserFilterForm.form)
            v4_grid.columnSettingsUserFilterForm.form.dialog("close");
    },

    /*закрытие формы с настройками*/
    closeColumnSettingsForm: function() {
        if (null != v4_grid.columnSettingsForm.form)
            v4_grid.columnSettingsForm.form.dialog("close");
    },

    columnValuesChecked: function(chk, className) {
        var chkState = 'checked';
        if (chk)
            chkState = 'unchecked';

        var selector = "." + className + ":checkbox:" + chkState;

        $(selector).each(function() {
            this.checked = chk;
        });
    },

    /*получение состояния(значения) поля записи*/
    setStateCheckAllValues: function(ctrlId, idAll, className) {
        var selector0 = "#divColumnSettingsForm_" + ctrlId + " ." + className + ":checkbox:checked";
        var selector1 = "#divColumnSettingsForm_" + ctrlId + " ." + className + ":checkbox:unchecked";
        var existCheck = $(selector0).length;
        var existUnCheck = $(selector1).length;

        if (existCheck > 0 && existUnCheck > 0)
            $('#divColumnSettingsForm_' + ctrlId).find('#' + idAll).prop('indeterminate', true);
        else if (existCheck > 0) {
            $('#divColumnSettingsForm_' + ctrlId).find('#' + idAll).prop('indeterminate', false);
            $('#divColumnSettingsForm_' + ctrlId).find('#' + idAll).prop('checked', true);
        } else {
            $('#divColumnSettingsForm_' + ctrlId).find('#' + idAll).prop('indeterminate', false);
            $('#divColumnSettingsForm_' + ctrlId).find('#' + idAll).prop('checked', false);
        }
    },

    /*получение значений фильтра для фильтра по значениям*/
    getColumnValuesFilter: function (ctrlId, gridCmdListnerIndex, className, columnId, direction, changeFilter) {
        var selector = "#divColumnSettingsForm_" + ctrlId + " ." + className + ":checkbox";
        var selector0 = "#divColumnSettingsForm_" + ctrlId + " ." + className + ":checkbox:checked";
        var selector1 = "#divColumnSettingsForm_" + ctrlId + " ." + className + ":checkbox:unchecked";
        var checkboxs = $(selector).length;
        var checkboxsCheck = $(selector0).length;
        var checkboxsUnCheck = $(selector1).length;

        if (direction == undefined) direction = '';

        if (direction != null) {
            setTimeout(v4_grid.closeColumnSettingsForm, 10);
        }

        if (checkboxs == checkboxsCheck) {
            setTimeout(v4_grid.closeColumnSettingsForm, 10);
            cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterByColumnValues', 'ColumnId', columnId, 'Data', 'All', 'Direction', direction, 'ChangeFilter', changeFilter);
            return;
        }
        if (checkboxs == checkboxsUnCheck) {
            setTimeout(v4_grid.closeColumnSettingsForm, 10);
            cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterByColumnValues', 'ColumnId', columnId, 'Data', '', 'Direction', direction, 'ChangeFilter', changeFilter);
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
        $(selector).each(function(index, item) {
            values += (values.length > 0 ? ',' : '') + parseInt($(item).attr("data-id"));
        });

        setTimeout(v4_grid.closeColumnSettingsForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterByColumnValues', 'ColumnId', columnId, 'Data', values, 'Equals', filterCheck ? 1 : 0, 'Direction', direction, 'ChangeFilter', changeFilter);

    },

    /*отправка на сервер команды по сортировке указанной колоки*/
    setOrderByColumnValues: function(gridCmdListnerIndex, columnId, direction) {
        setTimeout(v4_grid.closeColumnSettingsForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetOrderByColumnValues', 'ColumnId', columnId, 'Direction', direction);
    },

    /*отправка на сервер команды об очистке сортирвки указанной колонки*/
    clearOrderByColumnValues: function(gridCmdListnerIndex, columnId) {
        setTimeout(v4_grid.closeColumnSettingsForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ClearOrderByColumnValues', 'ColumnId', columnId);
    },

    /*установка пользовательского фильтра и открытие формы пользовательского фильтра без открытия формы настроек*/
    openUserFilterForm: function(menuItem, gridCmdListnerIndex) {
        if (menuItem.attr('data-columnId') == null) return;

        var columnId = menuItem.attr('data-columnId');
        var filterId = menuItem.attr('data-filterId');


        if (v4_isInt(filterId) && parseInt(filterId) <= 1) {
            setTimeout(v4_grid.closeColumnSettingsForm, 10);
            cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterColumnByUser', 'ColumnId', columnId, "FilterId", filterId);
        } else
            v4_grid.openUserFilterFormCmd(gridCmdListnerIndex, columnId, filterId, 0);
    },

    /*отправка на сервер команды на открытие формы пользовательского фильтра*/
    openUserFilterFormCmd: function(gridCmdListnerIndex, columnId, filterId, setValue) {
        setTimeout(v4_grid.closeColumnSettingsForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'OpenUserFilterForm', 'ColumnId', columnId, 'FilterId', filterId, 'SetValue', setValue);
    },

    /*отправка на сервер команды на открытие формы пользовательского фильтра для настроек фильтрации*/
    openUserFilterFormForSettingCmd: function (gridCmdListnerIndex, columnId, filterId, setValue) {
        //setTimeout(v4_grid.closeColumnSettingsForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'OpenUserFilterForm', 'ColumnId', columnId, 'FilterId', filterId, 'SetValue', setValue, 'ChangeFilter', 'False');
    },

    /*отправка на сервер команды на открытие формы пользовательского фильтра без закрытия ColumnSettingsForm*/
    openUserFilterFormNCCmd: function(gridCmdListnerIndex, columnId, filterId, setValue) {
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'OpenUserFilterForm', 'ColumnId', columnId, 'FilterId', filterId, 'SetValue', setValue);
    },

    /*отправка на сервер команды на установку фильтра по значениям*/
    changeFilterUserClause: function (gridId, obj, intervalValue, className) {
        var val;

        if (obj != null)
            val = $(obj).find(":selected").val();
        else
            val = $("#v4_selectFilterUserClause_" + gridId + " option:selected").val();

        if (val == intervalValue) {
            $("." + className).show();
            $(".v4ClauseNeedTop").addClass("v4PaddingTop");
        } else {
            $("." + className).hide();
            $(".v4ClauseNeedTop").removeClass("v4PaddingTop");
        }

        if (val == 0 || val == 1) {
            $("#v4_ctrlFilterClause_" + gridId + "_1_0").hide();
            setTimeout(function() {
                $("#v4_ctrlFilterClause_" + gridId + "_1_1").hide();
            }, 10);
        } else {
            $("#v4_ctrlFilterClause_" + gridId + "_1_0").show();
            $("#v4_ctrlFilterClause_" + gridId + "_1_1").show();
            $("#v4_ctrlFilterClause_" + gridId + "_1_0").focus();
        }
    },

    /*отправка на сервер команды на установку пользовательского фильтра*/
    setFilterColumnByUser: function(gridId, gridCmdListnerIndex, columnId, changeFilter) {

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

        setTimeout(v4_grid.closeColumnSettingsUserFilterForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterColumnByUser', 'ColumnId', columnId, "FilterId", filterId, "ChangeFilter", changeFilter);
    },

    /*отправка на сервер команды на очистку фильтра по значениям*/
    clearFilterColumnValues: function(gridCmdListnerIndex, columnId) {

        setTimeout(v4_grid.closeColumnSettingsForm, 10);
        setTimeout(v4_grid.closeColumnSettingsUserFilterForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ClearFilterColumnValues', 'ColumnId', columnId);
    },

    /*отправка на сервер команды на очистку всего фильтра*/
    clearFilterAllValues: function(gridCmdListnerIndex) {
        setTimeout(v4_grid.closeColumnSettingsForm, 10);
        setTimeout(v4_grid.closeColumnSettingsUserFilterForm, 10);
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ClearFilterAllValues');
    },

    /*отправка на сервер команды очистки пользовательского фильтра*/
    clearDataFilter: function(gridCmdListnerIndex) {
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ClearDataFilter');
    },

    /*отправка колонок группировки на сервер gridGrouping*/
    grouping: function(gridId, gridCmdListnerIndex, list) {
        var columns = list.find('div[column-id]');
        var ids = ""
        columns.each(function(index) {
            if (ids.length > 0) ids += ",";
            ids += $(this).attr("column-id");

        });

        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'GroupingGridData', 'ColumnIds', ids);
    },

    /*установка контролу необходимых свойств для перетаскивания колонок, по которым будет группировка и изменение порядка в таблице gridEnableSortable*/
    sortable: function(gridId, gridCmdListnerIndex) {
        $("#thead_" + gridId).disableSelection();
       
        $(".v4DropPanel_" + gridId).droppable({

            drop: function(event, ui) {

                if ($(this).attr("id") == "divFilteringPanel_" + gridId || $(this).attr("id") == "divTitle_" + gridId) {
                    var columnId = ui.draggable.find("div[column-id]").attr("column-id");
                    v4_grid.openUserFilterFormNCCmd(gridCmdListnerIndex, columnId, -1, 0, false);
                    return false;
                }

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
                        v4_grid.grouping(gridId, gridCmdListnerIndex, list);
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

                v4_grid.grouping(gridId, gridCmdListnerIndex, list);
            }
        });

    },

    columnDragDrop: function (gridId, gridCmdListnerIndex, columnId) {

        Kesco.globals.dragDrop.dragElement = "column"
        Kesco.globals.dragDrop.containerId = gridId;
        Kesco.globals.dragDrop.cmdListnerIndex = gridCmdListnerIndex;
        Kesco.globals.dragDrop.data = columnId;
        Kesco.globals.dragDrop.dropClass = 'v4DropPanel_' + gridId;
        Kesco.globals.dragDrop.dropIds = ['v4form'];
        
        Kesco.globals.dragDrop.dropFunction = v4_grid.columnDrop;
    },

    columnDrop: function () {

        if (Kesco.globals.dragDrop.targetType === "TH" && Kesco.globals.dragDrop.targetId != "") {
            cmdasync('cmd', 'Listener', 'ctrlId', Kesco.globals.dragDrop.cmdListnerIndex, 'cmdName', 'MoveColumn', 'DropColumn', Kesco.globals.dragDrop.data, 'TargetColumn', Kesco.globals.dragDrop.targetId);
        }
        else {
            v4_grid.openUserFilterFormNCCmd(Kesco.globals.dragDrop.cmdListnerIndex, Kesco.globals.dragDrop.data, -1, 0, false);
        }
    },

    stopSortResort: function (gridSortControl) {
        var i = 0;
        $('#ReorderFieldTable_' + gridSortControl + ' #tdNumOrder').each(function (item) {
            $(this).attr("onmouseenter", "v4_grid.fnTblMouseEnter('gridControl',"+i+")");
            $(this).attr("onmouseleave", "v4_grid.fnTblMouseLeave('gridControl'," + i +")");
            i++;
        });
    },

    /*сообщение на сервер о развернутой группе gridGroupingExpandColumn*/
    groupingExpandColumn: function(gridId, gridCmdListnerIndex, columnId) {
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'GroupingExpandColumn', 'ColumnId', columnId);
    },

    /*удаление колонки из списка группировки gridGroupingRemoveColumn*/
    groupingRemoveColumn: function(gridId, gridCmdListnerIndex, columnId) {
        $("li").has("div[column-id=" + columnId + "]").remove();
        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'GroupingRemoveColumn', 'ColumnId', columnId);
    },

    /*установка ширины панели группировки*/
    setWidthGroupingPanel: function(gridId) {
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
            setTimeout(function() {
                $("#divGroupingPanel_" + gridId).css("min-width", wMin);
                $("#divGroupingPanel_" + gridId).css("max-width", wMin);
            }, 10);
        }
    },

    /*управление видимостью групп указанного уровня gridDisplayGroupByIndex*/
    displayGroupByIndex: function(gridId, gridCmdListnerIndex, inx) {

        var trs = $("#" + gridId + " tr[group-id]").filter(function() {
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
            var v = v4_grid.displayGroupById(gridId, gridCmdListnerIndex, groupId, null, groupVisible, recursionId);
            if (inxVisible[groupInx] == null)
                inxVisible[groupInx] = v;

            recursionId = i;
        }
    },

    /*управление видимостью указанной группы gridDisplayGroupById*/
    displayGroupById: function(gridId, gridCmdListnerIndex, groupId, focusId, isVisible, recursionId) {
        var x = $("#" + gridId + " tr[group-parent=" + groupId + "]");
        if (x.length == 0) return;
        var iconSpan = "v4sp_" + groupId;

        if (isVisible == null)
            isVisible = $(x).is(":visible");

        if (isVisible) {
            for (var i = 0; i < x.length; i++) {
                var groupValue = $(x[i]).attr("group-id");
                if (groupValue == null || groupValue == "") break;
                v4_grid.displayGroupById(gridId, gridCmdListnerIndex, groupValue, focusId, isVisible, i);
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
            v4_grid.fixedHeader(gridId);
            if (focusId != null) {
                $("#" + focusId + "_" + groupId).focus();
                $("#" + gridId).scrollTop(st);
            }
        }

        return isVisible;
    },

    checkedAll: function(gridId, gridCmdListnerIndex, chk, allCheck) {
        $("#" + gridId + " .v4GridCheckbox").prop('checked', chk);
        if (allCheck)
            $("#allCheck_" + gridId).prop('checked', chk);
    },
        
    getChecked: function(gridId, gridCmdListnerIndex) {
        var chks = $("#" + gridId + " .v4GridCheckbox:checkbox:checked");
        var retValue = "";
        for (var i = 0; i < chks.length; i++)
            retValue += (retValue.length > 0 ? String.fromCharCode(30) : "") + $(chks[i]).attr("data-id");

        return retValue;
    },
        
    multiWinEditable: function(gridId, dialogId, isDetail, id, addParam) {

        var grid_clientSettings = null;
        if (isDetail) {
            $.each(v4_grid.clientDetailSettings,
                function(i, item) {
                    if (gridId == item.Grid) {
                        grid_clientSettings = item.Data;
                        return;
                    }
                });
        } else {
            $.each(v4_grid.clientEditSettings,
                function(i, item) {
                    if (gridId == item.Grid) {
                        grid_clientSettings = item.Data;
                        return;
                    }
                });
        }
        if (id == undefined) id = '0';

        if (!$("div").is("#divEntityAddContainer_" + gridId)) {
            var multiWinContainer = document.createElement('div');
            multiWinContainer.setAttribute('id', 'divEntityAddContainer_' + gridId);
            multiWinContainer.setAttribute('class', 'EntityAddContainer');
            document.body.appendChild(multiWinContainer);
        }

        var divEntityAddContainer = document.getElementById('divEntityAddContainer_' + gridId);

        var hasDiv = document.getElementById('divEntityAdd_' + dialogId);

        if (hasDiv == null) {

            var dialog_div = document.createElement('div');
            dialog_div.setAttribute('id', 'divEntityAdd_' + dialogId);
            dialog_div.setAttribute('style', 'display: none; padding: 0 0 0 0;');
            dialog_div.setAttribute('class', gridId);
            divEntityAddContainer.appendChild(dialog_div);

            // Waiter
            var progrDivTable = document.createElement('div');
            progrDivTable.setAttribute('id', v4_pageLoad_Progess_IdPart + '_' + dialogId);
            progrDivTable.setAttribute('style', 'display: none; height: 100%; position: absolute; width: 100%;');
            progrDivTable.setAttribute('class', 'v4DivTable');
            dialog_div.appendChild(progrDivTable);

            var progrDivTableRow = document.createElement('div');
            progrDivTableRow.setAttribute('class', 'v4DivTableRow');
            progrDivTable.appendChild(progrDivTableRow);

            var progrDivTableCell = document.createElement('div');
            progrDivTableCell.setAttribute('class', 'v4DivTableCell');
            progrDivTableRow.appendChild(progrDivTableCell);

            var progrImg = document.createElement('img');
            progrImg.setAttribute('src', '/styles/ProgressBar.gif');
            progrImg.setAttribute('alt', 'wait');
            progrDivTableCell.appendChild(progrImg);
            progrDivTableCell.appendChild(document.createElement('br'));
            progrDivTableCell.innerHTML = progrDivTableCell.innerHTML + grid_clientSettings.Waiter;

            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            var fragment_DF = document.createDocumentFragment();
            var fragment_IF = document.createDocumentFragment();


            var div_frame = document.createElement('div');
            div_frame.setAttribute('id', 'divFrame_' + dialogId);

            fragment_DF.appendChild(div_frame);

            var iframe = document.createElement('iframe');
            iframe.setAttribute('id', 'ifrEntity_' + dialogId);
            iframe.setAttribute('noresize', 'noresize');
            iframe.setAttribute('style', 'width: 300px');

            $("#" + "divEntityAdd_" + dialogId).attr('tabindex', '-1');
            $("#" + "divEntityAdd_" + dialogId).focusin(function() {
                this.previousElementSibling.style.background = 'ActiveCaption';
                this.previousElementSibling.style.color = 'CaptionText';
                $("#divEntityAdd_" + dialogId).dialog("moveToTop");
            });

            $("#" + "divEntityAdd_" + dialogId).focusout(function() {
                this.previousElementSibling.style.background = '';
                this.previousElementSibling.style.color = '';
            });

            fragment_IF.appendChild(iframe);
            div_frame.appendChild(fragment_IF);
            dialog_div.appendChild(fragment_DF);
        }

        v4_grid.recordAdd(gridId, id, grid_clientSettings, dialogId, addParam);
    },
        
    recordAdd: function(gridId, Id, grid_clientSettings, dialogId, addParam) {
        if (addParam == undefined) addParam = '';

        title = grid_clientSettings.Title;

        var idContainer = "divEntityAdd_" + dialogId;
        var idFrame = "ifrEntity_" + dialogId;

        var width = grid_clientSettings.Width;
        var height = grid_clientSettings.Height;

        if ($("#ifrEntity_" + dialogId).attr('src') == undefined) {
            var onOpen = function() {
                var ids = Id.split(String.fromCharCode(31));
                Id = "&id=" + ids[0];
                for (var i = 1; i < ids.length; i++)
                    Id += "&id" + i + "=" + ids[i];

                $("#ifrEntity_" + dialogId).attr('src', grid_clientSettings.Source + "?idpp=" + idp + Id + addParam + "&dialogId=" + dialogId + grid_clientSettings.Param);
            };
            var onClose = function() { v4_grid.recordClose(dialogId); };
            var buttons = null;

            var positions = null;

            if ($("." + gridId).length > 0 && $("." + gridId).is(":visible")) {
                positions = { my: "left+12 top-7", at: "left top", of: $("." + gridId).last() };
            }

            v4_dialog(idContainer, $("#" + idContainer), title, width, height, onOpen, onClose, buttons, positions, false);

            $("#" + v4_pageLoad_Progess_IdPart + '_' + dialogId).show();
        }

        $("#" + idContainer).dialog("option", "title", title);

        $("#" + idContainer).dialog({
            resize: function(event, ui) {
                v4_setDialogFrameSize(idFrame, idContainer);
            }
        });
        $("#" + idContainer).dialog("open");
        v4_setDialogFrameSize(idFrame, idContainer);

        var idHeader = 'divEntityAddHeader_' + dialogId;

        document.getElementById(idContainer).previousSibling.setAttribute('id', idHeader);
        $("#" + idHeader).removeClass('ui-corner-all');
    },
        
    recordClose: function(dialogId, ifr_idp) {
        var idContainer = "divEntityAdd_" + dialogId;
        if (dialogId == "") return;
        if (null == $("#" + idContainer)) return;

        var entity_idp = ifr_idp;
        if (null == entity_idp)
            entity_idp = $("#ifrEntity_" + dialogId)[0].contentWindow.idp;

        v4_closeIFrameSrc("ifrEntity_" + dialogId, entity_idp);
        $("#" + idContainer).dialog("close");
        $("#" + idContainer).remove();
    },
        
    recordsCloseAll: function(gridId) {
        var dialogList = v4_grid.getOpenDialogIds(gridId);
        dialogList.split(',').forEach(function(item) {
            v4_grid.recordClose(item.replace('divEntityAdd_', ''));
        });
    },
        
    getOpenDialogIds: function(gridId) {
        var dialogList = "";
        $("." + gridId).each(function() {
            if (dialogList.length > 0) dialogList = dialogList + ",";
            dialogList = dialogList + $(this).attr('id');
        });
        return dialogList;
    },
       
    keydown: function(event, element) {
        var key = v4_getKeyCode(event);
        if (key == 13 || key == 32) {
            event.preventDefault();
            element.click();
        }
    },

    columnsFieldForm: function(ctrlId, gridCmdListnerIndex, positionElementId, title, clientHeight) {

        var width = 310;
        var height = clientHeight ? clientHeight : 350;
        var onOpen = function() { };
        var buttons = [
            {
                id: "btnClmnsField_Apply_" + ctrlId,
                text: grid_clientLocalization.apply_button,
                icons: {
                    primary: v4_buttonIcons.Ok
                },
                click: function() {
                    var ids = "";
                    var ar_sort = new Array();
                    var idsVisible = "";
                    var tbl = $("#ReorderFieldTable_"+ ctrlId);
                    if (tbl == null) return;

                    tbl.find('tr').each(function (i) {
                        if (ids.length > 0) ids += ",";
                        ids += $(this).attr("column-id");

                        if ($(this).find('input:checkbox:first').is(':checked')) {
                            if (idsVisible.length > 0) idsVisible += ",";
                            idsVisible += $(this).attr("column-id");
                        }

                        var fieldsTable = document.getElementById('ReorderFieldTable_' + ctrlId);
                        var src = fieldsTable.rows[i];

                        var numSort = parseInt(src.cells[2].innerText);
                        
                        if (!isNaN(numSort)) {
                            var imgSort = $(this).find('img').attr("src");
                            var AscDesc = (imgSort.indexOf('scrollupenabled.gif') > 0) ? " asc" : " desc";
                            ar_sort[numSort - 1] = $(this).attr("column-id") + AscDesc;
                        }
                    });

                    if (ids.length == 0) return;
                    v4_grid.closeColumnsFieldForm();
                    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'ReorderColumns', 'ColumnIds', ids, 'ColumnVisibleIds', idsVisible, 'ColumnSortIds', ar_sort.toString());
                }
            },
            {
                id: "btnClmnsField_Cancel_" + ctrlId,
                text: grid_clientLocalization.cancel_button,
                icons: {
                    primary: v4_buttonIcons.Cancel
                },
                width: 75,
                click: v4_grid.closeColumnsFieldForm
            }
        ];


        var topPos = 12;
        if ($("#" + positionElementId).offset().top - 350 < 0) topPos = 0;

        var dialogPostion = { my: "left top+" + topPos, at: "left", of: $("#" + positionElementId) };
        v4_grid.columnsFieldForm.form = v4_dialog("divColumnsFieldForm_" + ctrlId, $("#divColumnsFieldForm_" + ctrlId), title, width, height, onOpen, null, buttons, dialogPostion);

        v4_grid.columnsFieldForm.form.dialog({
            resize: function(event, ui) {
                var x = $('#btnClmnsField_Apply_' + ctrlId).offset().top - $("#divColumnsFieldForm_Values_" + ctrlId).offset().top - 20;
                $("#divColumnsFieldForm_Values_" + ctrlId).height(x);
            }
        });

        v4_grid.columnsFieldForm.form.dialog("open");

    },

    closeColumnsFieldForm: function() {

        if (null != v4_grid.columnsFieldForm.form)
            v4_grid.columnsFieldForm.form.dialog("close");

    },

    columnsFilterForm: function (ctrlId, gridCmdListnerIndex, positionElementId, title, clientHeight) {

        var width = 310;
        var height = clientHeight ? clientHeight : 350;
        var onOpen = function () { };
        var buttons = [
            {
                id: "btnClmnsFilter_Apply_" + ctrlId,
                text: grid_clientLocalization.ok_button,
                icons: {
                    primary: v4_buttonIcons.Ok
                },
                click: function () {
                    var ids = "";
                    //var ar_sort = new Array();
                    var tbl = $("#FilterFieldTable_" + ctrlId);
                    if (tbl == null) return;

                    tbl.find('tr').each(function (i) {
                        if (ids.length > 0) ids += ",";
                        ids += $(this).attr("column-id");
                    });

                    if (ids.length == 0) return;
                    v4_grid.closeColumnsFilterForm();
                    cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetFilterColumns', 'ColumnIds', ids );
                }
            },
            {
                id: "btnClmnsFilter_Cancel_" + ctrlId,
                text: grid_clientLocalization.cancel_button,
                icons: {
                    primary: v4_buttonIcons.Cancel
                },
                width: 75,
                click: v4_grid.closeColumnsFilterForm
            }
        ];


        var topPos = 12;
        if ($("#" + positionElementId).offset().top - 350 < 0) topPos = 0;

        var dialogPostion = { my: "left top+" + topPos, at: "left", of: $("#" + positionElementId) };
        v4_grid.columnsFilterForm.form = v4_dialog("divColumnsFilterForm_" + ctrlId, $("#divColumnsFilterForm_" + ctrlId), title, width, height, onOpen, null, buttons, dialogPostion);
        
        v4_grid.columnsFilterForm.form.dialog("open");

    },

    closeColumnsFilterForm: function () {

        if (null != v4_grid.columnsFilterForm.form)
            v4_grid.columnsFilterForm.form.dialog("close");

    },

    fixSortableWithHelper: function (e, ui) {
        ui.children().each(function () {
            $(this).width($(this).width());
        });
        return ui;
    },

    rec_edit: function (idElement, opener) {        
        var copy = event.ctrlKey ? '&cp=1' : '';
        var itemForm = $('.v4Grid').attr('ItemsForm');
        var uri = "";
        if (itemForm.slice(-1) == "=") {
            itemForm += encodeURIComponent(idElement) + copy;
            uri = itemForm;
        } else {
            itemForm += itemForm.indexOf("?") == -1 ? "?" : "&";
            uri = itemForm + "id=" + encodeURIComponent(idElement) + copy;
        }
        var target = !isNaN(idElement) ? "Inv" + idElement : "_blank";
        Kesco.windowOpen(uri, target, null, opener == null || opener=="" ? "gEdit" : opener);
    },

    rec_add: function () {
        var newForm = $('.v4Grid').attr('ItemsAddForm');
        var keys = document.URL.split('?')[1].split('&');
        var rez = '';
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf('id=') == -1)
                rez += (rez == '' ? "?" : "&") + encodeURIComponent(keys[i]);
        }
        Kesco.windowOpen(newForm + rez, null, null, 'gNew');
    },

    rec_del: function (id) {
        cmdasync('cmd', 'Listener', 'ctrlId', 0, 'cmdName', 'Delete', 'RecId', id);
    },

    fnSortOrderClick: function(img) {
        if (img.tagName != 'IMG') return;
        if (img.src.indexOf("scrolldownenabled.gif") > 0) {
            img.src = "/styles/scrollupenabled.gif";
            img.title = grid_clientLocalization.sort_min_max_value;
        }
        else {
            img.src = "/styles/scrolldownenabled.gif";
            img.title = grid_clientLocalization.sort_max_min_value;
        }
        return;
    },

    fnTblMouseLeave: function(ctrlId, i) {
        var fieldsTable = document.getElementById('ReorderFieldTable_' + ctrlId);
        var src = fieldsTable.rows[i];
        if (src.cells[2].getElementsByTagName('INPUT').length > 0) {
            src.cells[2].innerHTML = ""; //уберем кнопочку
            if (v4_grid.sortBefore != "")
                src.cells[2].innerText = v4_grid.sortBefore;
        }
    },

    fnTblMouseEnter: function(ctrlId, i) {
        var fieldsTable = document.getElementById('ReorderFieldTable_' + ctrlId);
        if (v4_grid.indexSort == 5) return;
        var num = "";
        var src = fieldsTable.rows[i];
        if (src.cells[2].getElementsByTagName('B').length > 0)
            num = src.cells[2].getElementsByTagName('B')[0].innerText;
        else
            num = src.cells[2].innerText;

        if (isNaN(parseInt(num)) || v4_grid.indexSort == 0) {
            v4_grid.sortBefore = num;
            src.cells[2].innerHTML = "<input type='button' style='padding: 1px 1px;' onclick='v4_grid.setSort(\"" + ctrlId + "\",this.parentElement);' value='" + (v4_grid.indexSort + 1) + "'>";
        }
    },

    setSort: function(ctrlId, td) {
        if (v4_grid.indexSort == 0) v4_grid.ClearSort(ctrlId);
        v4_grid.indexSort++;
        td.innerHTML = "<b>" + v4_grid.indexSort + "</b>";
        td.parentElement.cells[1].innerHTML = "<img src='/styles/scrollupenabled.gif' border='0' style='cursor:pointer;' title='" + grid_clientLocalization.sort_min_max_value + "' onclick='v4_grid.fnSortOrderClick(this);'>";
        v4_grid.sortBefore = "";
    },

    ClearSort: function(ctrlId) {
        var fieldsTable = document.getElementById('ReorderFieldTable_' + ctrlId);
        var r = fieldsTable.rows;
        for (var i = 0; i < r.length; i++) {
            r[i].cells[1].innerHTML = '';
            r[i].cells[2].innerHTML = '';
        }
        v4_grid.indexSort = 0;
    },

    changeDataFiterCurrentDate: function (gridCmdListnerIndex, columnId, filterId, setValue, isCurrentDate, changeFilter) {

        cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'RefreshUserFilterForm', 'ColumnId', columnId, 'FilterId', filterId, 'SetValue', setValue, 'IsCurrentDate', isCurrentDate, 'ChangeFilter', changeFilter);
    }
}

// ToDo: Удалить после изменения функции в других приложениях
function refresh() {
    cmdasync('cmd', 'Listener', 'ctrlId', 0, 'cmdName', 'RefreshGridData');
}




