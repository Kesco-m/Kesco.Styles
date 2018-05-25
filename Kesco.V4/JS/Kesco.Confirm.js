/*Переменная подтверждение при удалении*/
var v4_isConfirmDelete = false;
/*Переменная активный элемент на странице*/
var active;
/*Переменная ширина диалогового окна по умолчанию*/
var defaultWidth = 550;
/*Переменная высота диалогового окна по умолчанию*/
var defaultHeight = 100;
/*Переменная локализованное сообщение: Нет активного звонка*/
var msgNotActiveCall;
/*Переменная локализованное сообщение: Соединение*/
var msgConnecting;
/*Переменная локализованное сообщение: Звонок*/
var msgCall;
/*Глобальный объект, необходимый для сохранения размеров и координат диалоговых окон*/
/*Формат: itemsParam = [[id, x, y, height, width]]*/
var itemsParam = [[]];
/*Массив текущенго диалогового окна*/
var curItemParam = [];
/*Функция устанавливает текущий массив для запоминания положения и размера текущего диалогового окна*/
/*id - идентификатор диалогового окна*/
function SetCurItemParam(id) {
    for (var i = 0; i < itemsParam.length; i++) {
        if (itemsParam[i] != null && itemsParam[i][0] == '|' + id) {
            curItemParam = itemsParam[i];
        }
    }
}
/*Функция обновляет или добавляет в двухмерный массив положения и размера текущего диалогового окна*/
/*id - идентификатор диалогового окна*/
function SetItemParam(id) {
    var updated = false;
    curItemParam[0] = '|' + id;
    for (var i = 0; i < itemsParam.length; i++) {
        if (itemsParam[i] != null && itemsParam[i][0] == curItemParam[0]) {
            itemsParam[i] = curItemParam;
            updated = true;
        }
    }
    if (!updated) {
        itemsParam.push(curItemParam);
    }
    curItemParam = [];
}
/*Функция диалогового окна, заменяющая стандартный алерт*/
function CustomAlert() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: dialog - Сообщение, title - Заголовок*/
    this.render = function (dialog, title, ctrlFocus) {
        SetCurItemParam('Alert');
	
	if (document.activeElement) active = document.activeElement.id;
        if (title == undefined) title = '';
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = "<button id='btnOK' class='v4btnWidth70' onclick='Alert.ok(\"" + (ctrlFocus != null && ctrlFocus != "" ? ctrlFocus : "") + "\");'>OK</button>";
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки ОК*/
    this.ok = function(ctrlFocus) {
        SetItemParam('Alert');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        if (ctrlFocus != "") {
            var ctrl = document.getElementById(ctrlFocus);
            if (ctrl != null) ctrl.focus();
        }
        else if (active) {
            document.getElementById(active).focus();
        }
    };
}
/*Функция показывающая пользователю период ожидания*/
function CustomWait() {
    /*Функция отрисовки диалогового окна*/
    this.render = function (show) {
        if (show == false) {
            var objDiaolgOverlay = document.getElementById('v4_divDialogOverlay');
            if (!objDiaolgOverlay) return;

            objDiaolgOverlay.style.display = "none";
            if (active) {
                var active_obj = document.getElementById(active);
                if (active_obj) active_obj.focus();
            }
            return;
        }
        if (document.activeElement)
            active = document.activeElement.id;
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        if (v4_divDialogOverlay) {
            v4_divDialogOverlay.style.display = "block";
            v4_divDialogOverlay.style.height = winH + "px";
            v4_divDialogOverlay.style.cursor = 'wait';
        }
    };
}
/*Инициализация диалоговых окон*/

var Alert = new CustomAlert();
var Wait = new CustomWait();
var ConfirmNumber = new CustomConfirmNumber();
var ConfirmMultipleSigner = new CustomConfirmMultipleSigner();
var ConfirmChanged = new CustomConfirmChanged();
var ConfirmDeleteSign = new CustomConfirmDeleteSign();
var ConfirmSetBaseDoc = new CustomConfirmSetBaseDoc();
var BreakBaseDoc = new CustomBreakBaseDoc();
var ConfirmExit = new CustomConfirmExit();
var ConfirmReload = new CustomConfirmReload();
var ConfirmRecalc = new CustomConfirmRecalc();
var ConfirmPhone = new CustomConfirmPhone();
var CustomConfirmChangedTwoButtons = new CustomConfirmChangedTwoButtons();



/*Функция диалогового окна, подтверждения номера документа*/
function CustomConfirmNumber() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: dialog - Сообщение, op - Тип подписи, focus - признак переведа фокуса на элемент ввода номера документа, open - признак открытия нового окна,
    url - путь открытия нового окна, oldTitle - локализованное сообщение (Документ в старой версии), title - Заголовок диалогового окна, 
    btn1 - Надпись кнопки (У документа нет номера), btn2 - Надпись кнопки (Да! Номер документа:), btn3 - Надпись кнопки (Исправить номер документа)*/
    this.render = function (dialog, op, focus, open, url, oldTitle, title, btn1, btn2, btn3) {
        SetCurItemParam('ConfirmNumber');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            if(curItemParam[3] != undefined) v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            if(curItemParam[4] != undefined)v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = defaultWidth + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth125" onclick="ConfirmNumber.noNumber(\'' + op + '\')">' + btn1 +
            '</button> <button class="v4btnWidth150" onclick="ConfirmNumber.yes(\'' + op + '\')">' + btn2 +
            '</button> <button class="v4btnWidth125" onclick="ConfirmNumber.fix(\'' + focus + '\', \'' + open + '\', \'' + url + '\', \'' + oldTitle + '\')">' + btn3 + '</button>';
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "Да! Номер документа:"*/
    this.yes = function (op) {
        SetItemParam('ConfirmNumber');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        if (op == '') {
            cmd('cmd', 'Save', 'isNumberCorrect', '1');
        } else {
            cmd('cmd', 'AddSign', 'type', op, 'isNumberCorrect', '1');
        }
    };
    /*Функция обработки нажатия кнопки "У документа нет номера"*/
    this.noNumber = function (op) {
        SetItemParam('ConfirmNumber');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', 'DocNumberClear', 'SignType', op);
    };
    /*Функция обработки нажатия кнопки "Исправить номер документа"*/
    this.fix = function (focus, open, url, oldTitle) {
        SetItemParam('ConfirmNumber');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        if (document.getElementById('docNumberInp_0') && focus) {
            document.getElementById('docNumberInp_0').focus();
        }
        else if (open) {
            v4_windowOpen(url, oldTitle);
        }
    };
}
/*Функция диалогового окна, сохранения документа*/
function CustomConfirmChanged() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, btn1 - Надпись кнопки (Сохранить), btn2 - Надпись кнопки (Отмена), 
    btn3 - Надпись кнопки (Посмотреть текущее состояние электронной формы в архиве), id - Код документа*/
    this.render = function (title, dialog, btn1, btn2, btn3, id) {
        SetCurItemParam('ConfirmChanged');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = defaultWidth + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth150" onclick="ConfirmChanged.save()">' + btn1 +
            '</button> <button class="v4btnWidth100" onclick="ConfirmChanged.cancel()">' + btn2 +
            '</button> <button class="v4btnWidth270" onclick="ConfirmChanged.show(' + id + ')">' + btn3 + '</button>';
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "Сохранить"*/
    this.save = function () {
        SetItemParam('ConfirmChanged');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', 'continueSave');
    };
    /*Функция обработки нажатия кнопки "Отмена"*/
    this.cancel = function () {
        SetItemParam('ConfirmChanged');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
    };
    /*Функция обработки нажатия кнопки "Посмотреть текущее состояние электронной формы в архиве"*/
    this.show = function (id) {
        SetItemParam('ConfirmChanged');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        srv4js('OPENDOC', 'id=' + id + '&newwindow=1', function (rez, obj) { if (rez.error) {
                Alert.render(rez.errorMsg);
            } 
        }, null);
    };
}
/*Функция диалогового окна, сохранения документа*/
function CustomConfirmChangedTwoButtons() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, btn1 - Надпись кнопки (Сохранить), btn2 - Надпись кнопки (Отмена), 
    btn1Command - Код команды на сервер*/
    this.render = function (title, dialog, btn1, btn2, btn1Command) {
        SetCurItemParam('ConfirmChangedTwoButtons');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = defaultWidth + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth100" onclick="CustomConfirmChangedTwoButtons.save(\'' + btn1Command + '\')">' + btn1 +
            '</button> <button class="v4btnWidth100"id="btnDialogCancel"  onclick="CustomConfirmChangedTwoButtons.cancel()">' + btn2 + '</button>';
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "Сохранить"*/
    this.save = function (btn1Command) {
        SetItemParam('ConfirmChangedTwoButtons');
	    document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', btn1Command);
    };
    /*Функция обработки нажатия кнопки "Отмена"*/
    this.cancel = function () {
        SetItemParam('ConfirmChangedTwoButtons');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
    };
}
/*Функция диалогового окна, удаления подписи*/
function CustomConfirmDeleteSign() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, btnYes - Надпись кнопки (Да), btnNo - Надпись кнопки (Нет), 
    idSign - Код подписи*/
    this.render = function (title, dialog, btnYes, btnNo, idSign) {
        SetCurItemParam('ConfirmDeleteSign');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = defaultWidth + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth100" onclick="ConfirmDeleteSign.yes(' + idSign + ')">' + btnYes +
            '</button> <button class="v4btnWidth100" onclick="ConfirmDeleteSign.no()">' + btnNo + '</button>';
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "Да"*/
    this.yes = function (idSign) {
        SetItemParam('ConfirmDeleteSign');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', 'RemoveSign', 'IdSign', idSign, 'ask', '0');
    };
    /*Функция обработки нажатия кнопки "Нет"*/
    this.no = function () {
        SetItemParam('ConfirmDeleteSign');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
    };
}
/*Функция диалогового окна, выбора подписанта*/
function CustomConfirmMultipleSigner() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, foot - футер диалогового окна, width - Ширина диалогового окна в зависимости от контента*/
    this.render = function (title, dialog, foot, width) {
        SetCurItemParam('ConfirmMultipleSigner');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = width;
        }
        v4_divDialogBox.style.display = "block";
        v4_divDialogBox.style.verticalAlign = "top";

        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = foot;
    };
    /*Функция обработки нажатия кнопки "Подписать"*/
    this.sign = function (id, type, isNumberCorrect) {
        SetItemParam('ConfirmMultipleSigner');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', 'AddSign', 'type', type, 'isNumberCorrect', isNumberCorrect, 'id', id, 'SendMessage', this.sendMessage);
    };
    /*Функция обработки нажатия кнопки "Отмена"*/
    this.cancel = function () {
        SetItemParam('ConfirmMultipleSigner');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
    };
    /*Функция обработки нажатия чекбокса "СМС"*/
    this.sms = function (val) {
        SetItemParam('ConfirmMultipleSigner');
        this.sendMessage = val;
    };
    this.sendMessage = false;
}
/*Функция диалогового окна, установки документа основания*/
function CustomConfirmSetBaseDoc() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, btnYes - Надпись кнопки (Да), btnNo - Надпись кнопки (Нет), 
    newId - Новый ID, oldId - Старый ID*/
    this.render = function (title, dialog, btnYes, btnNo, newId, oldId) {
        SetCurItemParam('ConfirmSetBaseDoc');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = defaultWidth + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth100" onclick="ConfirmSetBaseDoc.post(' + newId + ', 1)">' + btnYes +
            '</button> <button class="v4btnWidth100" onclick="ConfirmSetBaseDoc.post(' + oldId + ', 0)">' + btnNo + '</button>';
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "Да" и "Нет", в зависимости от выбора передается новый или старый ID документа основания*/
    this.post = function (id, yes) {
        SetItemParam('ConfirmSetBaseDoc');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', 'DocumentBaseInfoSet', 'id', id, 'yes', yes);
    };
}
/*Функция диалогового окна, удаления документа основания*/
function CustomBreakBaseDoc() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, btn - Надпись кнопки (ОК), oldId - Старый ID*/
    this.render = function (title, dialog, btn, oldId) {
        SetCurItemParam('BreakBaseDoc');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = defaultWidth + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth100" onclick="BreakBaseDoc.post(' + oldId + ', 0)">' + btn + '</button>';
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "OK"*/
    this.post = function (id, yes) {
        SetItemParam('BreakBaseDoc');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', 'DocumentBaseInfoSet', 'id', id, 'yes', yes);
    };
}
/*Функция диалогового окна, открытия модального окна*/
function openDialog(url, id) {
    var params = 'center:yes;status:no;help:no;resizable:yes;dialogHeight:600px;dialogWidth:1200px;';
    var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
    var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
    var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
    v4_divDialogOverlay.style.display = "block";
    v4_divDialogOverlay.style.height = winH + "px";
    var retval = window.showModalDialog(url, null, params);
    v4_divDialogOverlay.style.display = "none";
    if (retval != undefined) {
        cmd('ctrl', id, 'vn', retval, 'next', 1);
    }
}
/*Функция диалогового окна, выхода из редактирования документа*/
function CustomConfirmExit() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, btnYes - Надпись кнопки (Да), btnNo - Надпись кнопки (Нет)*/
    this.render = function (title, dialog, btnYes, btnNo) {
        SetCurItemParam('ConfirmExit');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = defaultWidth + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth100" onclick="ConfirmExit.yes()">' + btnYes +
            '</button> <button class="v4btnWidth100" onclick="ConfirmExit.no()">' + btnNo + '</button>';
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "Да"*/
    this.yes = function () {
        SetItemParam('ConfirmExit');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        v4_dropWindow();
    };
    /*Функция обработки нажатия кнопки "Нет"*/
    this.no = function () {
        SetItemParam('ConfirmExit');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
    };
}
/*Функция диалогового окна, перезагрузки документа*/
function CustomConfirmReload() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, btnYes - Надпись кнопки (Да), btnNo - Надпись кнопки (Нет), 
    isDocView - Признак работы в архиве документов*/
    this.render = function (title, dialog, btnYes, btnNo, isDocView) {
        SetCurItemParam('ConfirmReload');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;        
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = defaultWidth + "px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth100" onclick="ConfirmReload.yes()">' + btnYes + '</button>';
        
        if (isDocView == 'false') {
            document.getElementById('v4_divDialogBoxFoot').innerHTML += '<button class="v4btnWidth100" onclick="ConfirmReload.no()">' + btnNo + '</button>';
        }
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "Да"*/
    this.yes = function () {
        SetItemParam('ConfirmReload');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        v4_isConfirmDelete = false;        
        location.href = location.href;
    };
    /*Функция обработки нажатия кнопки "Нет"*/
    this.no = function () {
        SetItemParam('ConfirmReload');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        var ver = parseFloat(navigator.appVersion.split('MSIE')[1]);
        if (ver < 7) parent.window.opener = this;
        else parent.window.open('', '_parent', '');
        parent.window.close();
    };
}
/*Функция диалогового окна, пересчета*/
function CustomConfirmRecalc() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: title - Заголовок диалогового окна, dialog - Сообщение, btnYes - Надпись кнопки (Да), btnNo - Надпись кнопки (Нет)*/
    this.render = function (title, dialog, btnYes, btnNo) {
        SetCurItemParam('ConfirmRecalc');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = "250px";
        }
        v4_divDialogBox.style.display = "block";
        document.getElementById('v4_divDialogBoxHead').innerHTML = title;
        document.getElementById('v4_divDialogBoxBody').innerHTML = dialog;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = '<button id="btnOK" class="v4btnWidth100" onclick="ConfirmRecalc.yes()">' + btnYes + '</button>';
        document.getElementById('v4_divDialogBoxFoot').innerHTML += '<button class="v4btnWidth100" onclick="ConfirmRecalc.no()">' + btnNo + '</button>';
        var js = "document.getElementById('btnOK').focus()";
        window.setTimeout(js, 100);
    };
    /*Функция обработки нажатия кнопки "Да"*/
    this.yes = function () {
        SetItemParam('ConfirmRecalc');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', 'SetVAT', 'val', '1');
    };
    /*Функция обработки нажатия кнопки "Нет"*/
    this.no = function () {
        SetItemParam('ConfirmRecalc');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        cmd('cmd', 'SetVAT', 'val', '0');
    };
}
/*Инициализация*/
var breakCall;
var path;
var tempHeadCaption;
/*Функция получения положения диалогового окна в пределах видимости браузера*/
function GetValue(param, win) {
    if (param > win)
        return win - 30;
    else
        return param;
}
/*Функция диалогового окна, звонилка*/
function CustomConfirmPhone() {
    /*Функция отрисовки диалогового окна*/
    /*Параметры: (number - Номер телефона, inter - Международный номер, valCookie - Сохраненный телефон по умолчанию, url - путь для вызова звонка*/
    this.render = function (number, inter, valCookie, url) {
        SetCurItemParam('Phone');
        var winW = window.innerWidth == undefined ? document.body.clientWidth : window.innerWidth;
        var winH = window.innerHeight == undefined ? document.body.clientHeight : window.innerHeight;
        var v4_divDialogOverlay = document.getElementById('v4_divDialogOverlay');
        var v4_divDialogBox = document.getElementById('v4_divDialogBox');
        var v4_divDialogContainer = document.getElementById('v4_divDialogContainer');
        v4_divDialogOverlay.style.display = "block";
        
        v4_divDialogOverlay.style.height = winH + "px";
        if (curItemParam.length > 0) {
            if(curItemParam[1] != undefined)v4_divDialogBox.style.left = GetValue(curItemParam[1], winW) + "px";
            if(curItemParam[2] != undefined)v4_divDialogBox.style.top = GetValue(curItemParam[2], winH) + "px";
            if(curItemParam[3] != undefined)v4_divDialogContainer.style.height = v4_divDialogBox.style.height = curItemParam[3] + "px";
            if(curItemParam[4] != undefined)v4_divDialogContainer.style.width = v4_divDialogBox.style.width = curItemParam[4] + "px";
        }
        else {
            v4_divDialogBox.style.left = (winW / 2) - (defaultWidth * .5) + "px";
            v4_divDialogBox.style.top = defaultHeight + "px";
            v4_divDialogBox.style.width = "800px";
        }
        v4_divDialogBox.style.minWidth = v4_divDialogContainer.style.minWidth = "500px";
        v4_divDialogBox.style.minHeight = v4_divDialogContainer.style.minHeight = "150px";
        v4_divDialogBox.style.display = "block";
        v4_divDialogBox.style.verticalAlign = "top";
        di('v4_divDialogBoxHead');
        document.getElementById('v4_divDialogBoxHead').innerHTML = document.getElementById('v4_inpTitleToolTip').value + ' ' + number;
        document.getElementById('v4_divDialogBoxBody').innerHTML = document.getElementById('v4_inpDialogToolTip').value;
        document.getElementById('v4_divDialogBoxFoot').innerHTML = document.getElementById('v4_inpFootToolTip').value.replace('tempnumber', number).replace('tempinter', inter);
        if (document.getElementById('btnOK')) {
            var js = "document.getElementById('btnOK').focus()";
            window.setTimeout(js, 100);
        }

        this.cookieDefaultPhone = valCookie != '';
        this.setDefaultPhoneID = valCookie;
        this.callurl = path = url;

        if (this.cookieDefaultPhone) {
            SendRequestContact(number, inter, this.setDefaultPhoneID, this.callurl);
        }
    };
    /*Функция обработки нажатия кнопки "Позвонить"*/
    this.call = function (number, inter) {
        SetCookie(this.cookieDefaultPhone, this.setDefaultPhoneID);
        SendRequestContact(number, inter, this.setDefaultPhoneID, this.callurl);
    };
    /*Функция обработки нажатия кнопки "Отмена"*/
    this.cancel = function () {
        SetItemParam('Phone');
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        SetCookie(this.cookieDefaultPhone, this.setDefaultPhoneID);
        breakCall = true;
    };
    /*Функция обработки события выбора телефона*/
    this.rbl = function (val) {
        this.setDefaultPhoneID = val.getAttribute('data-id');
        if (document.getElementById('btnOK'))
            document.getElementById('btnOK').disabled = false;
    };
    /*Функция обработки события выбора телефона*/
    this.setRadio = function (val) {
        this.setDefaultPhoneID = val.getAttribute('data-id');
        var arr = document.getElementsByName('rbl');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].getAttribute('data-id') == this.setDefaultPhoneID) {
                arr[i].checked = true;
            }
        }
        if (document.getElementById('btnOK'))
            document.getElementById('btnOK').disabled = false;
    };
    /*Функция обработки события выбора телефона*/
    this.setDefaultPhone = function (val) {
        this.cookieDefaultPhone = val;
    };
    /*Функция обработки нажатия кнопки "Список телефонов"*/
    this.showPhones = function () {
        di('btnOK');
        hi('btnSelect');
        hi('btnClose');
        document.getElementById('v4_divDialogBoxHead').innerHTML = tempHeadCaption;
        di('tdCheckBox');
        document.getElementById('v4_divDialogBoxBody').innerHTML = document.getElementById('v4_inpDialogToolTip').value;
        setCheckBox(this.setDefaultPhoneID);
        breakCall = true;
        SendRequestCancel(callurltemp);
    };
    /*Функция обработки нажатия кнопки "Отмена"*/
    this.close = function () {
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
        breakCall = true;
        SetCookie(this.cookieDefaultPhone, this.setDefaultPhoneID);
        SendRequestCancel(callurltemp);
    };
}
/*Функция установки телефона по умолчанию*/
/*Параметр: id - телефон в списке доступных телефонов*/
function setCheckBox(id) {
    var arr = document.getElementsByName('rbl');
    for (var i = 0; arr.length > i; i++) {
        if (arr[i].getAttribute('data-id') == id) {
            arr[i].checked = true;
        }
    }
}
/*Функция записи куки*/
/*Параметры: isCookie - признак выбора телефона по умолчанию, id - телефон по умолчанию*/
function SetCookie(isCookie, id) {
    if (!isCookie) id = '';
    var url = path + "?save=1&phone=" + id;
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: url,
        crossDomain: true,
        xhrFields: { withCredentials: true }
    });
}

var callurltemp;
var callID;
var anime;
/*Функция осуществления звонка*/
/*Параметры: number - Номер телефона, inter - Международный номер, phone - телефон с которого осуществляется звонок, callurl - путь для вызова звонка*/
function SendRequestContact(number, inter, phone, callurl) {
    breakCall = false;
    SetItemParam('Phone');
    var url = callurl + "?number=" + encodeURIComponent(number) + "&inter=" + encodeURIComponent(inter) + "&phone=" + encodeURIComponent(phone);
    callurltemp = url;
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: url,
        crossDomain: true,
        xhrFields: { withCredentials: true },
        global: true,
        success: ProcessResponseContact,
        error: ProcessResponseContact
    });
}
/*Функция отображения списка доступных телефонов*/
/*Параметр: transport - ответ сервера*/
function ProcessResponseContact(transport) {
    var arr = transport.split('|');
    callID = arr[0];
    anime = arr[1];
    if (callID == 'error') {
        ErrorTransportContact(anime);
        return;
    }
    hi('btnOK');
    di('btnSelect');
    di('btnClose');
    tempHeadCaption = document.getElementById('v4_divDialogBoxHead').innerHTML;
    document.getElementById('v4_divDialogBoxHead').innerHTML = '&nbsp;';
    hi('tdCheckBox');
    document.getElementById('v4_divDialogBoxBody').innerHTML = anime;
    var js = "SendRequestCheck(callurltemp)";
    window.setTimeout(js, 500);
}
/*Функция проверки состояния звонка*/
/*Параметр: transport - ответ сервера*/
function ProcessResponseCheck(transport) {
    var arr = transport.split(';');
    var active = arr[0];
    var state = arr[1];
    if (!active) {
        breakCall = true;
        SendRequestCancel(callurltemp);
        document.getElementById('v4_divDialogBox').style.display = "none";
        document.getElementById('v4_divDialogOverlay').style.display = "none";
    } else {
        if (state == '-1') {
            hi('PhoneCalling_Dialog_ProgressBar');
            document.getElementById('PhoneCalling_Dialog_ProgressMessage').innerHTML = msgNotActiveCall;
            document.getElementById('phoneOut').src = '/styles/PhoneOff.gif';
            document.getElementById('phoneIn').src = '/styles/PhoneOff.gif';
            breakCall = true;
            SendRequestCancel(callurltemp);
            document.getElementById('v4_divDialogBox').style.display = "none";
            document.getElementById('v4_divDialogOverlay').style.display = "none";
        }
        if (state == '0') {
            di('PhoneCalling_Dialog_ProgressBar');
            document.getElementById('PhoneCalling_Dialog_ProgressMessage').innerHTML = msgConnecting;
            document.getElementById('phoneOut').src = '/styles/PhoneOn.gif';
            document.getElementById('phoneIn').src = '/styles/PhoneIncome.gif';
        }
        if (state == '1') {
            di('PhoneCalling_Dialog_ProgressBar');
            document.getElementById('PhoneCalling_Dialog_ProgressMessage').innerHTML = msgCall;
            document.getElementById('phoneOut').src = '/styles/PhoneOn.gif';
            document.getElementById('phoneIn').src = '/styles/PhoneOn.gif';
        }
    }

    var js = "SendRequestCheck(callurltemp)";
    window.setTimeout(js, 2000);
}
/*Функция обработки ошибки при звонке*/
/*Параметр: msgError - Сообщение об ошибке*/
function ErrorTransportContact(msgError) {
    breakCall = true;
    alert(msgError);
}
/*Функция запрос о состоянии звонка*/
/*Параметр: callurl - путь к приложению Контакты*/
function SendRequestCheck(callurl) {
    if (breakCall) return;
    var url = callurl + "&check=1&callID=" + callID;
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: url,
        crossDomain: true,
        xhrFields: { withCredentials: true },
        global: true,
        success: ProcessResponseCheck,
        error: ProcessResponseCheck
    });
}
/*Функция отмены звонка*/
/*Параметр: callurl - путь к приложению Контакты*/
function SendRequestCancel(callurl) {
    SetItemParam('Phone');
    var url = callurl + "&cancel=1&callID=" + callID;
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: url,
        crossDomain: true,
        xhrFields: { withCredentials: true },
        global: true,
        success: ProcessResponseCancel,
        error: ProcessResponseCancel
    });
}
/*Функция обработки ошибки при отмене звонка*/
/*Параметр: msgStatus - Результат отмены звонка*/
function ProcessResponseCancel(msgStatus) {
    if (msgStatus != '1') {
        alert('Ошибка при отмене звонка./An error occurred while canceling the call.');
    }
}