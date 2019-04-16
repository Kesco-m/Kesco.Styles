var orderBy = 'L';
var searchText = '';
var searchParam = '';
var stateLoad = false;
var hasSearched = false;

var v4_trees = {};

v4_treeViewItemEdit_dialogShow.form = null;
function v4_treeViewItemEdit_dialogShow(ctrlId, gridCmdListnerIndex, title, oktext, canceltext, type) {
    var idContainer = "divEditNode_" + ctrlId;
    if (null == v4_treeViewItemEdit_dialogShow.form) {
        var width = 455;
        var height = 150;
        var onOpen = function () { v4_treeViewOpenEditForm(); };
        var onClose = function () { v4_treeViewCloseEditForm(); };
        var buttons = [
            {
                id: "btn_Apply_" + ctrlId,
                text: oktext,
                icons: {
                    primary: v4_buttonIcons.Ok
                },
                click: function () { cmdasync('cmd', 'Listener', 'ctrlId', gridCmdListnerIndex, 'cmdName', 'SetTreeViewItem', 'type', type); }
            },
            {
                id: "btn_Cancel_" + ctrlId,
                text: canceltext,
                icons: {
                    primary: v4_buttonIcons.Cancel
                },
                click: v4_treeViewCloseEditForm
            }
        ];

        v4_treeViewItemEdit_dialogShow.form = v4_dialog(idContainer, $("#" + idContainer), title, width, height, onOpen, onClose, buttons);
    }

    $("#" + idContainer).dialog("option", "title", title);
    v4_treeViewItemEdit_dialogShow.form.dialog("open");
}

// Функция закрытия окна редактирования узла
function v4_treeViewCloseEditForm() {
    if (null != v4_treeViewItemEdit_dialogShow.form) {
        v4_treeViewItemEdit_dialogShow.form.dialog("close");
        v4_treeViewItemEdit_dialogShow.form = null;
    }
}

// Функция открытия окна редактирования узла
function v4_treeViewOpenEditForm() {
    if (null != v4_treeViewItemEdit_dialogShow.form) {

    }
}

// Функция задания высоты дерева в пикселах
function v4_treeViewSetHeight(ctrlId, height) {
    $('#divTreeView_' + ctrlId).css({ 'height': height + 'px' });
}

// Функция установки State (не используется!!!)
function v4_treeViewSetState(ctrlId, treeView) {
    $.ajax({
        async: true,
        type: "POST",
        url: v4_trees[ctrlId].uri_getState,
        cache: false,
        success: function (postdata) {
            if (postdata != '') {
                var state = JSON.parse(postdata);
                treeView.instance.set_state(state);
                
                var selected = 0;
                try {
                    selected = JSON.parse(postdata).core.selected;
                } catch (e) {
                }
                if (selected != 0) {
                    $("#"+selected+"_anchor").focus();
                    setTimeout("$('#"+selected+"_anchor').focus();", 1000);
                }
            }
        }
    });
}



// Функция сохранения State
function v4_treeViewSaveState(ctrlId, treeView) {
    var err = false;
    var opened;
    try
    {
        var state = treeView.instance.get_state();
        opened = state.core.open;
    }
    catch (e) {
        err = true;
    }

    if (err) return;

    var opened = state.core.open;
    if (opened != undefined)
    {
        opened.forEach(function (item, i, opened) {
            var childrenList = $('#divTreeView_' + ctrlId).jstree().get_node(item).children;
            if (childrenList == '')
            {
                $('#divTreeView_' + ctrlId).jstree().close_node(item);
            }
        });
    }

    var state = treeView.instance.get_state();
    //alert(JSON.stringify(state));
    $.ajax({
        async: true,
        type: "POST", data: {state : JSON.stringify(state)},
        url: v4_trees[ctrlId].uri_saveState,
        cache: false
    });
}

// Функция получения массива ID всех отмеченных узлов
function v4_treeViewGetCheckedNodesIds(ctrlId) {
	var ids = $('#divTreeView_' + ctrlId).jstree().get_checked();
	return ids;
}

// Функция снятия галочек со всех отмеченных узлов
function v4_treeViewDeselectAllNodes(ctrlId) {
	$('#divTreeView_' + ctrlId).jstree().deselect_all(true);
}

// Функция скрытия корневого узла дерева
function v4_treeViewHideRootNode(treeView, rootId) {
	var rootText = treeView.instance.get_node(rootId).text;
	$('.jstree-last .jstree-icon').first().hide();
	$('a:contains(' + rootText + ')').css('visibility', 'hidden');
	$('ul:contains(' + rootText + ')').css('position', 'relative');
	$('ul:contains(' + rootText + ')').css('top', '-20px');
	$('ul:contains(' + rootText + ')').css('left', '-20px');
}

// Функция скрытия галочки у корневого узла дерева
function v4_treeViewHideRootNodeCheck(treeView, rootId) {
    var rootText = treeView.instance.get_node(rootId).text;
    $('.jstree-checkbox').first().hide();
}

// Функция снятия галочек с узлов на других уровнях ветки, к которой относится текущий узел
// (при проставлении галочки на текущем узле у его родительских и дочерних узлов снимаются все галочки)
// параметр rootParentId - ID родителя для корневого узла (обычно #)
function v4_treeViewUncheckNodesAtOtherLevelsOfBranch(treeView, rootParentId, rootId) {
	var currentNodeId = treeView.node.id;
	if (currentNodeId != rootId) {
		var childrens = treeView.instance.get_json(currentNodeId, { flat: true });
		for (var i = 0; i < childrens.length; i++) {
			var childId = childrens[i].id;
			if (childId == currentNodeId)
				continue;
			treeView.instance.uncheck_node(childId);
		}
		var parentsIds = treeView.node.parents;
		for (var i = 0; i < parentsIds.length; i++) {
			var parentId = parentsIds[i];
			if (parentId == rootParentId || parentId == rootId || parentId == currentNodeId)
				continue;
			treeView.instance.uncheck_node(parentId);
		}
	}
}

// Функция задания ширины и высоты контейнера, включающего дерево
// параметр postfix - размерность (px, em, %)
function v4_treeViewContainerSetSize(ctrlId, width, height, postfix) {
    var tree = $('#divTreeView_' + ctrlId);
    tree.css('width', width + postfix);
    tree.css('height', height + postfix);
}

// Функция показа панели поиска
function v4_ShowSearchTreeView(ctrlId) {
    v4_trees[ctrlId].isSaveState = false;
	var tree = $('#divTreeView_' + ctrlId)
	var hTree = tree.height();
	var searchPanel = $('#divSearchTreeView_' + ctrlId);
    var menuPanel = $('#divMenuTreeView_' + ctrlId);
    var treeViewHeaderPanel = $('#divTreeViewHeader_' + ctrlId);

	var searchPanelVisible = (searchPanel.css("display") != "none");
	var menuPanelVisible = (menuPanel.css("display") != "none");
	searchPanel.show();
	searchPanel.find('input[type=text]').focus();

    /*
    if (!searchPanelVisible && menuPanelVisible)
    {
        var hSearchPanel = searchPanel.outerHeight(true);
        v4_treeViewSetHeight(ctrlId, hTree - hSearchPanel);
    }
    */

    v4_treeViewHandleResize(ctrlId);
}

// Функция скрытия панели поиска
function v4_HideSearchTreeView(ctrlId) {
    var tree = $('#divTreeView_' + ctrlId);
	var searchPanel = $('#divSearchTreeView_' + ctrlId);
	var hSearchPanel = searchPanel.outerHeight(true);
    searchPanel.hide();
    $('#divSearchCount_' + ctrlId).text('');
    $('#tbSearchText_' + ctrlId + '_0').val('');

    if (hasSearched) {
        var jsTree = tree.jstree(true);
        if (jsTree) { jsTree.destroy(); }
        v4_treeViewInit(ctrlId);
    }

    /*
    if (searchPanel.css("display") == "none")
	{
		var hTree = tree.height();
		v4_treeViewSetHeight(ctrlId, hTree + hSearchPanel);
    }
    */

    v4_treeViewHandleResize(ctrlId);
}

function v4_GetTextNode(nodeId) {
    return $("#" + nodeId).attr("text");
}

// Функция изменения размера дерева, в зависимости от видимости внутренних панелей и внешних отступов
// параметр hWithoutTree - высота внешних по отншению к дереву элементов в окне
function v4_treeViewHandleResize(ctrlId) {
	var hWithoutTree = $('#divTreeViewContainer_' + ctrlId).offset().top + 2;
	
    if (hWithoutTree == 0) hWithoutTree = HWithoutTree;
	var h = $(window).height();
	var dTopMenu = $('#divMenuTreeView_' + ctrlId);
	var hTopMenu = dTopMenu.outerHeight(true);
	var dSearchPanel = $('#divSearchTreeView_' + ctrlId);
	var hSearchPanel = dSearchPanel.outerHeight(true);
	var dBottomMenu = $('#divBottomMenuTreeView_' + ctrlId);
	var hBottomMenu = dBottomMenu.outerHeight(true);

	if (dTopMenu.css("display") == "none")
		hTopMenu = 0;

	if (dSearchPanel.css("display") == "none")
		hSearchPanel = 0;

	if (dBottomMenu.css("display") == "none")
		hBottomMenu = 0;

    v4_treeViewSetHeight(ctrlId, h - hTopMenu - hBottomMenu - hSearchPanel - hWithoutTree);
}

function v4_reloadOrderNode(ctrlId, order) {
    var tree = $('#divTreeView_' + ctrlId);
    var selectedNode = tree.jstree().get_selected("id");
    var nodeid = "0";
    if (selectedNode != null && selectedNode != "")
	    nodeid = selectedNode[0].id;
	
    if (nodeid != null && nodeid != undefined) {
        v4_dt = new Date().getTime();
        orderBy = order;
        tree.jstree(true).refresh(nodeid);
    }
}


function v4_treeViewLoadSelectedData(ctrlId, treeView) {
    var tree = $('#divTreeView_' + ctrlId);
    var nd = tree.jstree().get_selected("id")[0];
    if (nd == null || nd == undefined) return;
    var nodeid = tree.jstree().get_selected("id")[0].id;
    if (v4_trees[ctrlId].isLoadData) {
        Wait.render(true);
        cmdasync("cmd", "Listener", "ctrlId", v4_trees[ctrlId].cmdIndex, "cmdName", "LoadTreeViewData", "Id", nodeid);
    }
    $("#" + nodeid + "_anchor").focus();
    setTimeout("$('#" + nodeid + "_anchor').focus();", 1000);
}


function v4_reloadSearchNode(ctrlId, searchT, searchP) {
    hasSearched = true;
    var tree = $('#divTreeView_' + ctrlId);
    searchText = searchT;
    searchParam = searchP;

    var jsTree = tree.jstree(true);
    if (jsTree) { jsTree.destroy(); }
    v4_treeViewInit(ctrlId);
    v4_dt = new Date().getTime();
    tree.jstree(true).refresh();
}

// Функция обновления выбранного узла
function v4_reloadNode(ctrlId) {
    var tree = $('#divTreeView_' + ctrlId);
    var nd = tree.jstree().get_selected("id")[0];
    if (nd == null || nd == undefined) return;
    var nodeid = nd.id;
    v4_dt = new Date().getTime();
    tree.jstree(true).refresh_node(nodeid);
}

// Функция обновления родительского узла
function v4_reloadParentNode(ctrlId) {
    var tree = $('#divTreeView_' + ctrlId);
    var nd = tree.jstree().get_selected("id")[0];
    if (nd == null || nd == undefined) return;
    var nodeid = nd.id;
    //var parentnodeid = tree.jstree().get_node(nodeid).parent;

    var parentnodeid = $("#" + nodeid).attr("parentId");
	var childrens = tree.jstree().get_node(nodeid).children_d;

	if (childrens.length == 0) {
		v4_dt = new Date().getTime();
		tree.jstree(true).refresh_node(parentnodeid);
	}
	else {
		v4_dt = new Date().getTime();
		tree.jstree(true).refresh(parentnodeid);
	}
}

// Функция обновления дерева
function v4_refreshNode(ctrlId) {
    var tree = $('#divTreeView_' + ctrlId);
    var nd = tree.jstree().get_selected("id")[0];
    if (nd == null || nd == undefined) return;
    var nodeid = nd.id;
	v4_dt = new Date().getTime();
    tree.jstree().refresh(nodeid);
}

// Функция сохранения state при unload страницы
function v4_SrvSendTreeViewState(ctrlId, data) {
    var tree = $('#divTreeView_' + ctrlId);
    window.removeEventListener('beforeunload', v4_SrvSendTreeViewState, false);
    v4_treeViewSaveState(ctrlId, data);
}


//======================================= Инициализация =======================================

function v4_treeViewInit(ctrlId) {
    var tree = $("#divTreeView_" + ctrlId);
    if (v4_trees[ctrlId].isSaveState) {
        stateLoad = true;
    }
    $(tree).jstree({
        'plugins': ["contextmenu", "crrm", "search", "dnd", v4_trees[ctrlId].pluginCheckBox],
        'contextmenu': v4_trees[ctrlId].contextMenu,
        'checkbox': v4_trees[ctrlId].behaviorCheckBox,
        'dnd': {
            "is_draggable": v4_trees[ctrlId].isDraggable
        },
        'core': {
            'themes': { 'icons': false, 'responsive': false },
            'multiple': v4_trees[ctrlId].checkboxMultiple,
            'data': {
                'url': v4_trees[ctrlId].jsonData,
                'data': function (node) {
                    return {
                        'nodeid': node.id,
                        'dt': v4_dt,
                        'return': v4_trees[ctrlId].returnData,
                        'returnType': v4_trees[ctrlId].returnType,
                        'loadId': v4_trees[ctrlId].loadId,
                        'orderBy': orderBy,
                        'searchText': searchText,
                        'searchParam': searchParam,
                        'stateLoad': stateLoad,
                        'idpage': v4_trees[ctrlId].pageId,
                        'ctrlid': ctrlId
                    };
                }
            },

            'check_callback': function (op, nodeSource, nodeDestination, pos, more) {
                if (op == "edit") { return false; }
                if (orderBy != 'L') { return false; }
                if ((op === "move_node" || op === "copy_node") && more && more.core) {
                    if (nodeSource.type && nodeSource.type == "root") return false;
                    if (nodeDestination.parent == null) return false;
                    //var arrSource = nodeSource.text.split("&nbsp;");
                    //var arrDestination = nodeDestination.text.split("&nbsp;");
                    //var nodeSourceName = (arrSource.length == 1) ? arrSource[0] : (arrSource[arrSource.length - 1]);
                    //var nodeDestinationName = (arrDestination.length == 1) ? arrDestination[0] : (arrDestination[arrDestination.length - 1]);

                    var nodeSourceName = $("#" + nodeSource.id).attr("text");
                    var nodeDestinationName = $("#" + nodeDestination.id).attr("text");

                    if (nodeSource.parent == nodeDestination.id) {
                        /* Вы уверены что хотите изменить порядок расположений в рамках одной группы*/
                        if (!confirm(v4_trees[ctrlId].message1 + " [" + nodeDestinationName + "]?"))
                            return false;
                    } else {
                        /* Вы уверены что хотите сделать расположение*/
                        /* дочерним по отношению к расположению*/
                        if (!confirm(v4_trees[ctrlId].message2 + " [" + nodeSourceName + "] " + v4_trees[ctrlId].message3 + " [" + nodeDestinationName + "]?"))
                            return false;
                    }
                }
                return true;
            }
        }
    });

    v4_treeViewEventBind(ctrlId);
}

function v4_treeViewEventBind(ctrlId) {
    var tree = $("#divTreeView_" + ctrlId);
	
	// Обработчик события выбора узла 
    $(tree).bind("select_node.jstree", function (e, data) {
        /*
        if (v4_trees[ctrlId].isSaveState && !v4_trees[ctrlId].isLoadById) {
            v4_treeViewSaveState(ctrlId, data);
        }
        */
        if (v4_trees[ctrlId].isLoadData) {
            Wait.render(true);
            cmdasync("cmd", "Listener", "ctrlId", v4_trees[ctrlId].cmdIndex, "cmdName", "LoadTreeViewData", "Id", data.node.id);
        }
    });

	// Обработчик события при наведении курсора на узел
    $(tree).bind("hover_node.jstree", function (e, data) {
        $("#" + data.node.id).attr("title", "[" + data.node.id + "]");
    });

	// Обработчик события перемещения узла 
    $(tree).bind("move_node.jstree", function (e, data) {
        cmdasync("cmd", "Listener", "ctrlId", v4_trees[ctrlId].cmdIndex, "cmdName", "MoveTreeViewItem", "Id", data.node.id, "old_parent", data.old_parent, "new_parent", data.parent, "old_position", data.old_position, "new_position", data.position);
    });

	// Обработчик события открытия узла 
    $(tree).bind("open_node.jstree", function (e, data) {
        searchText = '';
        if (data.node.text.indexOf("(" + v4_trees[ctrlId].filtered + ")") > -1) {
            data.node.state.loaded = false;
            $(tree).jstree(true).refresh_node(data.node.id);
        }
    });

    // Обработчик события закрытия узла 
    $(tree).bind("close_node.jstree", function (e, data) {
        var node_id = (data.node.id); // element id
        var childrens = data.node.children_d;
        var childArr = new Array()
        for (var i = 0; i < childrens.length; i++) {
            if (childArr.indexOf(childrens[i]) == -1 && childrens[i] != data.node.id)
                childArr.push(childrens[i]);
        }

        for (var i = 0; i < childArr.length; i++) {
            $('#divTreeView_' + ctrlId).jstree().close_node(childrens[i]);
        }
    });

	// Обработчик события после загрузки дерева
    $(tree).bind("loaded.jstree", function (e, data) {
        if (!v4_trees[ctrlId].rootVisible)
            v4_treeViewHideRootNode(data, '0');

        if (!v4_trees[ctrlId].rootCheckVisible)
            v4_treeViewHideRootNodeCheck(data, '0');

        if (v4_trees[ctrlId].docFill)
            v4_treeViewContainerSetSize(ctrlId, 100, 100, "%");
    });

	// Обработчик события обновления дерева 
    $(tree).bind('refresh.jstree', function (e, data) {
        if (!v4_trees[ctrlId].rootVisible)
            v4_treeViewHideRootNode(data, '0');

        if (!v4_trees[ctrlId].rootCheckVisible)
            v4_treeViewHideRootNodeCheck(data, '0');
    });

	// Обработчик события загрузки узла 
    $(tree).bind("load_node.jstree", function (e, data) {
        var currentNodeId = data.node.id;
        var state = data.instance.get_state();
        var strJson = JSON.stringify(state, ['checkbox']);
        if (strJson.indexOf('"' + currentNodeId + '"') > -1)
            data.instance.check_node(currentNodeId);
        if (searchText != null && searchText != "") {
            searchText = '';
            cmdasync("cmd", "Listener", "ctrlId", v4_trees[ctrlId].cmdIndex, "cmdName", "SetSearchCount");
        }

    });

	// Обработчик событий отметки/снятия галочек на узлах
    $(tree).on("check_node.jstree uncheck_node.jstree", function (e, data) {
        var isChecked = data.node.state.checked;
        if (v4_trees[ctrlId].checkboxMultiple && isChecked) {
            v4_treeViewUncheckNodesAtOtherLevelsOfBranch(data, '#', '0');
        }
        if (v4_trees[ctrlId].isSaveState && !v4_trees[ctrlId].isLoadById) {
            v4_treeViewSaveState(ctrlId, data);
        }
    });
    
	// Обработчик события готовности дерева
    $(tree).on('ready.jstree', function (e, data) {
        if (v4_trees[ctrlId].isSaveState) {
            //v4_treeViewSetState(ctrlId, data);
            if (v4_trees[ctrlId].isSaveState && !v4_trees[ctrlId].isLoadById) {
                window.addEventListener('beforeunload', function () { v4_SrvSendTreeViewState(ctrlId, data); });
            }
            stateLoad = false;
            v4_treeViewLoadSelectedData(ctrlId, data);
        }
    });

}