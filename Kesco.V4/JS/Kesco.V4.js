/*Глобальный объект, задающий домен приложения для возврата значений через cookie*/
var v4_domain = "";
/*Глобальный xml-объект, через который осуществляется обмен данными между клиентов и сервером*/
var v4_xml = null;
/*Глобальный объект типа XMLHttpRequest, используется для отправки запросов с клиента на сервер без перезагрузки страницы*/
var v4_xmlHTTP = null;
/*Обязательная для переопределения на станице клиенте ссылка на справку по текущей странице */
var v4_helpURL = null;
/*Глобальный параметр, указывающей странице, что необходимо устновить постоянное содинение с сервером*/
var v4_isComet = true;
/*Ссылка с параметрами на хендлер Comet*/
var v4CometUrl_Template = "";
/*Глобальное свойство отменяющее потерю фокуса элементом управления*/
var v4_isStopBlur = false;
/*Глобальное свойство, определяющее элемент управления, на который надо установить фокус, после потери фокуса текущим контролом*/
var v4_setBlur = '';
/*Глобальная переменная для фиксации времени последнего обращения к серверу*/
var v4_timeOfLastRequest = new Date();

/*Глобальный объект всплывающего popup-окна, одномоментно существовать на странице может только один такой объект */
var v4s_popup = null;
/*Глобальное свойство, определяющее: открыт ли popup-объект на странице, влияет на своевременное закрытия popup-div*/
var v4s_isPopupOpen = false;
/*Последний активный контрол типа Select*/
var v4_lastActiveCtrlSelect = null;
/*Глобальное свойство, определяющее: открыт ли popup-объект на странице, влияет на своевременное закрытия popup-div*/
var v4f_isPopupOpen = false;
/*Глобальное свойство, определяющее: приложение открыто в старом браузере IE*/
var isIE8 = false;
/*Глобальное свойство, определяющее: запрашивать ли подтверждение у пользователя при закрытии/уходе страницы при несохраненных данных*/
var isAsk = false;
/*Глобальное свойство, определяющее: данные на страницы были изменены пользователем*/
var isChanged = false;
/*Глобальное свойство, определяющее: данные на странице корректны*/
var isValidate = false;
/*Глобальное свойство, определяющее: Необходимость выполнения дополнительных скриптов при загрузке страницы*/
var isAddFunc = false;
/*Глобальное свойство, определяющее: Дополнительные параметры*/
var paramAddFunc = 0;
/*Глобальное перечень иконок jquery ui*/
var v4_buttonIcons = {
    Add: "ui-icon-plus",
    Edit: "ui-icon-pencil",
    Ok: "ui-icon-check",
    Save: "ui-icon-disk",
    Run: "ui-icon-triangle-1-e",
    Cancel: "ui-icon-closethick",
    Search: "ui-icon-search",
    Settings: "ui-icon-gear",
    Refresh: "ui-icon-refresh",
    Close: "ui-icon-arrowthick-1-e",
    Copy: "ui-icon-copy",
    Delete: "ui-icon-trash",
    Document: "ui-icon-document",
    Help: "ui-icon-help"
}
/*Иконки статусов диалоговых сообщений */
var v4_messageStatusIcons = {
        Warning: "Warning.gif",
        Error: "Error.gif",
        Attention: "Attention.gif",
        Help: "Help.gif",
        Information: "Information.gif"
}

//Для опредения смещения при открытии div-ов
var v4_top = 0;
var v4_left = 0;

/*Глобальный объект, нербходимый для опеделения текущего броузера*/
var browser = navigator.userAgent;
var chrome = browser.indexOf('Chrome') > -1;
var safari = browser.indexOf("Safari") > -1;
if ((chrome) && (safari)) safari = false;

function v4_evalHref(id) {
    
    if (!safari) {
        $('#' + id)[0].click();
        return;
    }
    var link = document.getElementById(id);
    if (link == null) return;
    var event = document.createEvent('MouseEvent');
    event = new CustomEvent('click');
    link.dispatchEvent(event);
}

(function() {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    if (CustomEvent && CustomEvent.prototype && window.Event) {
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    }
})();


/*Название клиентского компьютера*/
var v4_clientName = '';

/*Добавляем свойство indexOf для массивов*/
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}

var JSON_START = /^\[|^\{(?!\{)/;
var JSON_ENDS = {
    '[': /]$/,
    '{': /}$/
};
/*Определяем, передана ли строка в формате JSON*/
function v4_isJSON(str) {
    var jsonStart = str.match(JSON_START);
    return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
}

/*Глобальный объект, обеспечивающий кросс-броузерную подписку на события клиента*/
Event = (function () {
    var a = 0;

    function c(f) {
        f = f || window.event;
        if (f.isFixed) {
            return f;
        }
        f.isFixed = true;
        f.preventDefault = f.preventDefault || function () { this.returnValue = false; };
        f.stopPropagation = f.stopPropagaton || function () { this.cancelBubble = true; };
        if (!f.target) {
            f.target = f.srcElement;
        }
        if (!f.relatedTarget && f.fromElement) {
            f.relatedTarget = f.fromElement == f.target ? f.toElement : f.fromElement;
        }
        if (f.pageX == null && f.clientX != null) {
            var e = document.documentElement, d = document.body;
            f.pageX = f.clientX + (e && e.scrollLeft || d && d.scrollLeft || 0) - (e.clientLeft || 0);
            f.pageY = f.clientY + (e && e.scrollTop || d && d.scrollTop || 0) - (e.clientTop || 0);
        }
        if (!f.which && f.button) {
            f.which = (f.button & 1 ? 1 : (f.button & 2 ? 3 : (f.button & 4 ? 2 : 0)));
        }
        return f;
    }

    function b(i) {
        i = c(i);
        var d = this.events[i.type];
        for (var h in d) {
            var f = d[h];
            var e = f.call(this, i);
            if (e === false) {
                i.preventDefault();
                i.stopPropagation();
            }
        }
    }

	
    return {
        add: function (f, e, d) {
            if (f.setInterval && (f != window && !f.frameElement)) {
                f = window;
            }
            if (!d.guid) {
                d.guid = ++a;
            }
            if (!f.events) {
                f.events = {};
                f.handle = function (g) {
                    if (typeof Event !== "undefined") {
                        return b.call(f, g);
                    }
                };
            }
            if (!f.events[e]) {
                f.events[e] = {};
                if (f.addEventListener) {
                    f.addEventListener(e, f.handle, false);
                } else {
                    if (f.attachEvent) {
                        f.attachEvent("on" + e, f.handle);
                    }
                }
            }
            f.events[e][d.guid] = d;
        },
        remove: function (g, f, e) {
            var d = g.events && g.events[f];
            if (!d) {
                return;
            }
            delete d[e.guid];
            for (var h in d) {
                return;
            }
            if (g.removeEventListener) {
                g.removeEventListener(f, g.handle, false);
            } else {
                if (g.detachEvent) {
                    g.detachEvent("on" + f, g.handle);
                }
            }
            delete g.events[f];
            for (var h in g.events) {
                return;
            }
            delete g.handle;
            delete g.events;
        }
    };
} ());

/*Отмена стандартного поведения кнопки F1*/
Event.add(document, 'help', new Function("return false;"));
Event.add(window, 'help', new Function("return false;"));
/*Глобальный перехват некоторых кнопок: F1; UP и Down*/
Event.add(document, 'keydown', v4_keyDown);
/*Глобальный перехват изменения размеров окна*/
Event.add(window, 'resize', v4_checkPopUp);

/*================================== Общие функции. Исключения по именам в связи с частым использованием ==============================*/
function v4_showSaveData(event) {
    var ev = window.event || event;
    if (!ev) return 0;
    if (ev.ctrlKey && ev.altKey && ev.shiftKey) return 1;
}

/*Функция отправки синхронного запроса на сервер*/
function cmd() {
    var urlBase = window.location.pathname + "?idp=" + idp;
    var url = urlBase;
    for (var i = 0; i < arguments.length; i = i + 2) {
        url += '&' + arguments[i] + '=' + encodeURIComponent(arguments[i + 1]);
    }
    v4_xmlHTTP = v4_getXmlHTTP();
    if (url.length < 2000) {
        v4_xmlHTTP.open("GET", url, false);
        v4_xmlHTTP.send();
    } else {
        var data = new window.FormData();
        for (var i = 0; i < arguments.length; i = i + 2)
            data.append(arguments[i], arguments[i + 1]);
        v4_xmlHTTP.open("POST", urlBase, false);
        v4_xmlHTTP.send(data);
    }

    v4_timeOfLastRequest = new Date();

    if (v4_xmlHTTP.status == 200) {        
        v4_xml = v4_string2Xml(v4_xmlHTTP.responseText);
        v4_xmlProcessing(v4_xml);
    } else if (v4_xmlHTTP.status != 0) {
        var w = window.open();
        w.document.open();
        w.document.write(v4_xmlHTTP.responseText);
        w.document.close();
    }
}

/*Функция отправки асинхронного зароса на сервер*/
function cmdasync() {
    var urlBase = window.location.pathname + "?idp=" + idp;
    var url = urlBase;
    for (var i = 0; i < arguments.length; i = i + 2) {
        url += '&' + arguments[i] + '=' + encodeURIComponent(arguments[i + 1]);
    }
    url += '&wait=1';
    v4_xmlHTTP = v4_getXmlHTTP();
    v4_xmlHTTP.onreadystatechange = function () {
        if (v4_xmlHTTP.readyState == 4) {
            if (v4_xmlHTTP.status == 200) {
                v4_xml = v4_string2Xml(v4_xmlHTTP.responseText);
                v4_xmlProcessing(v4_xml);
            } else if (v4_xmlHTTP.status != 0) {
                var w = window.open();
                w.document.open();
                w.document.write(v4_xmlHTTP.responseText);
                w.document.close();
            }
        }        
    };

    v4_timeOfLastRequest = new Date();
    if (url.length < 2000) {
        v4_xmlHTTP.open("GET", url, true);
        v4_xmlHTTP.send();
    } else {
        var data = new window.FormData();
        for (var i = 0; i < arguments.length; i = i + 2)
            data.append(arguments[i], arguments[i + 1]);
        v4_xmlHTTP.open("POST", urlBase, true);
        v4_xmlHTTP.send(data);
    }
}

/*Аксессор к стандарной функции getElementById*/
function gi(i) {
    return document.getElementById(i);
}

/*Аксессор к стандарной функции createElement*/
function ce(t) {
    return document.createElement(t);
}

/*Аксессор к стандарной функции createTextNode*/
function ct(t) {
    return document.createTextNode(t);
}

/*Аксессор к стандарной функции getElementsByTagName*/
function gt(t, e) {
    e = e || document;
    return e.getElementsByTagName(t);
}

/*Функция-аксессор для добавления подчиненного элемента
e - родительский элемент
n - дочерний элемент
*/
function ac(n, e) {
    e = e || document.body;
    return e.appendChild(n);
}

/*Функция-аксессор для отображения элемента
i - идентификатор элемента, которому необходимо изменить аттрибут стиля display
n - новое значения аттрибута display
*/
function di(i, s) {
    try {
        gi(i).style.display = s == null ? '' : s;
    } catch (e) {
    }
}

/*Функция-аксессор для скрытия элемента
i - идентификатор элемента
*/
function hi(i) {
    try {
        gi(i).style.display = 'none';
    } catch (e) {
    }
}

/*Функция-аксессор для скрытия элемента. Значение присваивается для аттрибут
i - идентификатор элемента
*/
function shi(i) {
    gi(i).setAttribute("style", 'display:none');
}

/*Функция поиска подстроки, используется для замены аттрибутов у элементов
s - где ищем
с - что ищем
*/
function hc(s, c) {
    return ~(' ' + s + ' ').indexOf(' ' + c + ' ');
}

/*Функция-аксессор для замены одного класса стиелей на указанный
o- элемент
add - новый класс стилей
del - старый класс стилей
*/
function cc(o, add, del) {
    var o = o || {}, n = 'className', cN = (undefined != o[n]) ? o[n] : o, ok = 0;
    if ('string' !== typeof cN) return false;
    var re = new RegExp('(\\s+|^)' + del + '(\\s+|$)', 'g');
    if (add)
        if (!hc(cN, add)) {
            cN += ' ' + add;
            ok++;
        }
    if (del)
        if (hc(cN, del)) {
            cN = cN.replace(re, ' ');
            ok++;
        }
    if (!ok) return false;
    if ('object' == typeof o) o[n] = cN;
    else return cN;
}

/*=========================================================================================================================================*/
/*===========================================================Базовые функции V4============================================================*/

/*Функция, вызываемая при событии keydown на странице
event - текущее событие
*/
function v4_keyDown(event) {

    var key = v4_getKeyCode(event);

    if (v4_helpURL != null && key == 112) {
        if (browser.search(/msie/i) == -1) {
            event.stopPropagation();
            event.preventDefault();
        }
        v4_openHelp(idp);
    } else if (v4s_isPopupOpen && key == 38) {
        event.preventDefault();
        v4s_scrollContent(-10);
    } else if (v4s_isPopupOpen && key == 40) {
        event.preventDefault();
        v4s_scrollContent(10);
    } else if (v4s_isPopupOpen && key == 27) {
        v4s_hidePopup(true);
    }
}

/*Функция получения кода нажатой кнопки
event - текущее событие
*/
function v4_getKeyCode(event) {
    var ev = window.event || event;
    var key = ev.keyCode;
    return key;
}

/*Функция создания объета XMLHttpRequest для запуск обмена данными между клиентом и сервером без перезагрузки страницы*/
function v4_getXmlHTTP() {
    if (window.XMLHttpRequest)
        return new XMLHttpRequest();
    return new ActiveXObject("Microsoft.XMLHTTP");
}

/*Функция преобразования xml к строке
elem - xml-элемент
*/
function v4_xml2String(elem) {
    var serialized = "";
    try {
        var serializer = new XMLSerializer();
        serialized = serializer.serializeToString(elem);
    } catch (e) {
        try {
            serialized = elem.xml;
        } catch (ee) {
            alert('!!! \r\n' + ee.Message);
        }
    }
    return serialized;
}

/*Функция преобразования строки в xml
sXml - строкаЮ которую необходимо преобразовать
*/
function v4_string2Xml(sXml) {
    var oXml;
    if (window.ActiveXObject) {
        // ie         
        oXml = new ActiveXObject("Microsoft.XMLDOM");
        oXml.resolveExternals = false;
        oXml.async = false;
        oXml.loadXML(sXml);
    } else if (window.DOMParser) {
        var parser = new DOMParser();
        oXml = parser.parseFromString(sXml, "text/xml");
    }
    return oXml;
}

/*Функция удаления элемента по идентификатору
id-идентификатор элемента
*/
function v4_deleteElement(id) {
    if (id == '') return;
    var n = v4_getXmlNode(id);
    if (n == null) return;
    n.parentNode.removeChild(n);
}

/*Функция получения объекта их xml по идентификатору и типу
id - идентификатор объекта
nodeType - тип узла xml
xml - собственно сам объект типа xml
*/
function v4_getXmlNode(id, nodeType, xml) {
    xml == xml || v4_xml;
    nodeType = nodeType || 'c';
    var items = gt(nodeType, v4_xml);
    for (var i = 0; i < items.length; i++)
        if (items[i].getAttribute('i') == id)
            return items[i];
    return null;
}

/*Функция получения значения переданного аттрибута
attr - название аттрибута
*/
function v4_getAttibuteValue(attr) {
    var n = gt('el', v4_xml)[0];
    var a = n.getAttributeNode(attr);
    if (a != null)
        return a.value;
    return null;
}

/*Функция задания значения аттрибута, если аттрибута не существует, то он будет создан
attr - название аттрибута
val - значение аттрибута
*/
function v4_setAttibuteValue(attr, val) {
    var n = gt('el', v4_xml)[0];
    var a = n.getAttributeNode(attr);
    if (a == null) {
        a = v4_xml.createAttribute(attr);
        n.setAttributeNode(a);
    }
    a.value = val;
}

/*Функция обработки полученного с сервера xml. Задача получить из xml скриты и выполнить их на странице
xml - объект типа xml
*/
function v4_xmlProcessing(xml) {
    var ha = xml.getElementsByTagName("v4html");
    for (var i = ha.length - 1; i >= 0; i--) {
        var el = gi(ha[i].getAttribute('i'));
        if (el != null) {
            el.innerHTML = ha[i].firstChild.nodeValue;
            ha[i].parentNode.removeChild(ha[i]);
        }
    }

    var js = xml.getElementsByTagName("js")[0];

    if (js == null)
        js = xml.getElementsByTagName("script")[0];

    if (js != null) {
        var scr = js.textContent == undefined ? js.text : js.textContent;
        js.text = '';

        if (scr.length > 0) {
            //alert(scr);//для отладки скриптов
            eval(scr);
        }
    }
}

/*При использовании в приложении механизма вкладок - отправляет на сервер команду на проставление соответствующему контролу полученного из другого приложения значения
id - идентификатор элемента
val - значение
*/
function v4_tabSetCtrlValue(id, val) {
    if (curTabId == -1) return;
    var openerId = gi('f' + curTabId).getAttribute("openerId");
    var frame = gi('f' + openerId);
    if (frame != null) {
        try {
            frame.contentWindow.cmd('ctrl', id, 'vn', val, 'next', 1);
        } catch (x) {
        }
    }
}

/*Получение аттрибута из узла xml
Парметры:   idNode - идентификатор узла
attrName - имя аттрибута
*/
function v4_getXmlAttribute(idNode, attrName) {
    var n = v4_getXmlNode(idNode);
    return n.getAttribute(attrName);
}

/*Функция устновки фокуса на следующий контрол. Текущим является или имеющий переданный дентификатор или тот, на котором в данный момент установлен фокус
id-идентификатор элемента
*/
/*function v4_setFocus2NextCtrl(id) {
    var _this = id == null ? document.activeElement : gi(id);
    if (_this == null) return;
    var nc = _this.getAttribute('nc');
    if (nc != null) {
        var nctrl = gi(nc);
        if (nctrl != null) {
            if (nctrl.tagName == 'INPUT' || nctrl.tagName == 'SELECT' || nctrl.tagName == 'TEXTAREA' || nctrl.tagName == 'BUTTON') {
                if (nctrl.disabled || document.getElementById(nctrl.id).parentNode.style.display == 'none') {
                    v4_setFocus2NextCtrl(nctrl.id);
                } else {
                    nctrl.focus();
                }
                return;
            } else {
                var childSelect = nctrl.getElementsByTagName('SELECT');
                if (childSelect.length > 0) {
                    if (!childSelect[0].disabled) {
                        childSelect[0].focus();
                        return;
                    }
                }
                var child = nctrl.getElementsByTagName('INPUT');
                if (child.length > 0) {
                    for (var i = 0; i < child.length; i++) {
                        if (child[i].disabled) {
				if (child[i].tagName == 'INPUT' || child[i].tagName == 'SELECT' || child[i].tagName == 'TEXTAREA' || child[i].tagName == 'BUTTON') {
                            		v4_setFocus2NextCtrl(child[i].id); }
                        } else {
                            child[i].focus();
                            return;
                        }
                    }
                }
            }
        }
    }
}*/

function v4_setFocus2NextCtrl(id) {
    var _this = id == null ? document.activeElement : gi(id);
    if (_this == null) return;
    var nc = _this.getAttribute('nc');
    if (nc != null) {
        var nctrl = gi(nc);
        if (nctrl != null) {
            if (nctrl.tagName == 'INPUT' || nctrl.tagName == 'SELECT' || nctrl.tagName == 'TEXTAREA' || nctrl.tagName == 'BUTTON') {
                if (nctrl.disabled || document.getElementById(nctrl.id).parentNode.style.display == 'none') {
                    v4_setFocus2NextCtrl(nctrl.id);
                } else {
			if($('#'+nctrl.id).is(':visible')){
				nctrl.focus();
			}
			else
			{
				 v4_setFocus2NextCtrl(nctrl.id);
			}
                }
                return;
            } else {
                var childSelect = nctrl.getElementsByTagName('SELECT');
                if (childSelect.length > 0) {
                    if (!childSelect[0].disabled) {
                        childSelect[0].focus();
                        return;
                    }
                }
                var child = nctrl.getElementsByTagName('INPUT');
                if (child.length > 0) {
                    for (var i = 0; i < child.length; i++) {
                        if (child[i].disabled) {
                            v4_setFocus2NextCtrl(child[i].id);
                        } else {
				if($('#'+child[i].id).is(':visible')){
					child[i].focus();
				}
				else
				{
					 v4_setFocus2NextCtrl(child[i].id);
				}
                            return;
                        }
                    }
                }
            }
        }
    }
}

/*Функция отправки значения контрола с указанным идентификатором на сервер
id - идентификатор контрола
val - значение контрола
*/
function v4_setValue(id, val, text) {
    cmd('ctrl', id, 'vn', val, 'tn', text, 'next', 1);

}

function v4_setIdEntity(id, command) {
    cmd('setIdEntity', id, 'command', command);
}

/*Переопределение  вызова стандарной функции открытия окна. */
/*Будет изменеа для динамического приема параметров для передачи открываемому окну 
url - адрес страницы,
params - параметры окна
*/
function v4_windowOpen(uri, inx, params) {
    if (inx == null || inx == '') inx = "_blank";
    var results = new RegExp("^kescorun", "ig").exec(uri);
    if (results == null) {
        if (params == null) params = 'status=no,toolbar=no,menubar=no,location=no,resizable=yes,scrollbars=yes';
        window.open(uri, inx, params);
        return;
    }
    var id = v4_guid();
    $('body').append('<a id="' + id + '"></a>');
    $("#" + id).attr("href", uri);
    v4_evalHref(id);
    $('#' + id).remove();
}

/*Функция для динамической замены стилей у контрола
o - элемент
*/
function v4_replaceStyleRequired(o) {
    if (o.value == '' && o.getAttribute('isRequired') == 1) {
        cc(o, 'v4s_required', '');
    } else {
        cc(o, '', 'v4s_required');
    }
}

/*Функция преобразования строки в объект Date
str - строка, которую необходимо преобразовать
*/
function v4_string2Date(str) {
    var A = new Array(0, 0, 0);
    var j = 0;

    str = str.replace(RegExp('[^0-9]{1,}', 'ig'), ' ');
    str = str.replace(RegExp('^[ ]|[ ]$', 'ig'), '');
    if (str.length == 0) {
        v3DateCheckStatus = 0;
        return null;
    }

    var arr = str.split(' ');

    for (var i = 0; (j < 3) && (i < arr.length); i++) {
        if (j == 2) {
            A[j] = parseFloat(arr[i].substr(0, 4));
            if (A[j] != 0) j++;
        }

        switch (arr[i].length) {
            case 1:
            case 2:
                A[j] = parseFloat(arr[i]);
                if (A[j] != 0) j++;
                break;
            case 3:
                arr[i] = '0' + arr[i];
            case 4:
                A[j] = parseFloat(arr[i].substr(0, 2));
                if (A[j] != 0) j++;
                A[j] = parseFloat(arr[i].substr(2));
                if (A[j] != 0) j++;
                break;
            case 5:
                arr[i] = '0' + arr[i];
            case 6:
            case 8:
                A[j] = parseFloat(arr[i].substr(0, 2));
                if (A[j] != 0) j++;
                A[j] = parseFloat(arr[i].substr(2, 2));
                if (A[j] != 0) j++;
                A[j] = parseFloat(arr[i].substr(4));
                if (A[j] != 0) j++;
                break;
        }
    }
    var d = new Date();
    if (A[0] == 0) A[0] = d.getDate();
    if (A[1] == 0) A[1] = d.getMonth() + 1;
    if (A[2] == 0) A[2] = d.getFullYear();

    if (A[2] < 100) A[2] = (A[2] > 50) ? 1900 + A[2] : 2000 + A[2];
    if ((A[2] < 1900) || (A[2] > 2078)) {
        v3DateCheckStatus = -1;        
        return null;
    }
    if (A[1] > 12) {
        v3DateCheckStatus = -1;        
        return null;
    }
    d = new Date(A[2], A[1] - 1, A[0]);
    if (A[0] != d.getDate()) {
        v3DateCheckStatus = -1;        
        return null;
    }

    v3DateCheckStatus = 1;
    return new Date(A[2], A[1] - 1, A[0]);
}

/*Функция преобразования объекта типа Date к строке 
d - объект типа Date
*/
function v4_date2String(d) {
    if (d == null) return '';

    var dd = d.getDate();
    var MM = d.getMonth() + 1;
    var yyyy = d.getFullYear();
    dd = (dd < 10) ? '0' + dd : '' + dd;
    MM = (MM < 10) ? '0' + MM : '' + MM;
    return dd + '.' + MM + '.' + yyyy;
}

/*Функция преобразования строки даты в формат строки, используемый в контроле Date
str - строка, которую необходимо привести к необходимому формату
*/
function v4_dateFormat(str) {
    var d = v4_string2Date(str);
    if (d == null) return '';
    return v4_date2String(d);
}

/*Функция преобразования строки времени в формат (без секунд) строки
str - строка, которую необходимо привести к необходимому формату
*/
function v4_timeFormat(str) {
    if (str == '') return '00:00';
    var arr = str.split(':');
    var hh = '00';
    var mm = '00';
    if (arr.length > 0) {
        var h = parseInt(arr[0]);
        if (h < 24 && h >= 10)
            hh = h.toString();
        else if (h < 10 && h >= 0)
            hh = '0' + h;
    }
    if (arr.length > 1) {
        var m = parseInt(arr[1]);
        if (m <= 59 && m >= 10)
            mm = m.toString();
        else if (m < 10 && m >= 0)
            mm = '0' + m;
    }
    return hh + ':' + mm;
}

/*Функция преобразования строки времени в формат (с секундами) строки
str - строка, которую необходимо привести к необходимому формату
*/
function v4_timeFormatFull(str) {
    if (str == '') return '00:00:00';
    var arr = str.split(':');
    var hh = '00';
    var mm = '00';
    var ss = '00';
    if (arr.length > 0) {
        var h = parseInt(arr[0]);
        if (h < 24 && h >= 10)
            hh = h.toString();
        else if (h < 10 && h >= 0)
            hh = '0' + h;
    }
    if (arr.length > 1) {
        var m = parseInt(arr[1]);
        if (m <= 59 && m >= 10)
            mm = m.toString();
        else if (m < 10 && m >= 0)
            mm = '0' + m;
    }
    if (arr.length > 2) {
        var s = parseInt(arr[2]);
        if (s <= 59 && s >= 10)
            ss = s.toString();
        else if (s < 10 && s >= 0)
            ss = '0' + s;
    }
    return hh + ':' + mm + ':' + ss;
}

/*Функция выпонения необходимых скриптов после загрузки страницы
func - Функция, которую необходимо выполнить после загрузки страницы
*/
function v4_addLoadEvent(func) {
    var old = window.onload;
    if (typeof window.onload != 'function') window.onload = func;
    else
        window.onload = function () {
            old();
            func();
        };
}

/*Функция открытия страницы со справкой по текущей странице
idp - идентификатор страницы
*/
function v4_openHelp(idpage) {
	var url_params = "";
	var currentPage = idpage.replace(/-/g, "");
    v4_windowOpen(v4_helpURL + url_params, currentPage == null ? '_blank' : currentPage);
}

/*Функция отмены текущего события
e - текущее событие
*/
function v4_cancelEvent(e) {
    if (typeof e.stopPropagation != "undefined") {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

/*Функция восстановления постоянного соединения с сервером*/
function v4_keepAlive() {
    if (window.idp != null && new Date() - v4_timeOfLastRequest >= 60000)
        cmd();
}

/*Функция удаления из Application информации об странице с последующим закрытием ее в браузере*/
function v4_dropWindow() {
    if (window.idp != null && window.idp != 'undefined') {
        cmd('page', 'close');
    } else
        v4_closeWindow();
}

/*Функция закрытия окна в браузере*/
function v4_closeWindow() {
    var ver = parseFloat(navigator.appVersion.split('MSIE')[1]);
   
    if (parent.window != null) {
        var win = window.open('', '_self');
        window.close();
        win.close(); return false;
    } else {
        var win = window.open('', '_self');
        window.close();
        win.close(); return false;
    }
}

function v4_closeIFrameSrc(ifrControl, ifrIdp) {
    v4_closeWindowByIdp(ifrIdp, true);
    $("#" + ifrControl).attr('src', "about:blank");
}

function v4_closeWindowByIdp(widp, isframe) {
    if (!widp) return;
    var frameParams = isframe ? "&frame=true" : "";
    var url = v4_cometUrl + "/DialogResult.ashx?control=window&command=pageclose&callbackKey=" + widp + frameParams;
    $.ajax({
        async: false,
        type: "POST",
        url: url
    });
}

/*Функция инициализации страницы v4. Установка постоянного соеднинения с сервером, побработка входящего xml, инициализация контрлов*/
function v4_init() {
    if (window.innerWidth == undefined) {
        isIE8 = true;
    }
    if (isAsk)
        v4_onload();

    $(window).unload(function () {
        
        //для каждого iframe на форме отправляет post на отключение
        $("iframe").each(function () {
            var ifrObj = $(this);
            if (ifrObj.length == 0) return true;
            if (ifrObj[0].contentWindow == null) return true;

            var iframe_idp = ifrObj[0].contentWindow.idp;
            var iframe_id = $(this).attr("id");
            if (iframe_idp) {
                v4_closeIFrameSrc(iframe_id, iframe_idp );
            }
        });

        // При выгрузке страницы - запрашиваем сервер об отключении клиента
        if (window.self !== window.top) {
        //frame -- может чего вставим!!!!
        }
        else
            v4_closeWindowByIdp(idp, false);
        
    });

    v4s_init();
    if (isAddFunc) {
        SetInit(paramAddFunc);
    }
    if (gi('v3XML_init')) {
        var xml = gi('v3XML_init').value;
        v4_xml = v4_string2Xml(xml);
        v4_xmlProcessing(v4_xml);
    }
    if (document.addEventListener) {
        document.addEventListener("focus", v4_setActiveElement, true);
        document.addEventListener("blur", v4_clearActiveElement, true);
    }
    if (v4_isComet) {
        var _itemName = "&name="
        if (typeof v4_ItemName === 'undefined' || v4_ItemName === null) {
            _itemName = "";
        } else {
            _itemName += v4_ItemName;
        }

        v4CometUrl_Template = v4_cometUrl + "/comet.ashx?guid=" + idp + "&id=" + v4_ItemId + _itemName + "&editable=" + isEditable;
         v4_connectComet('connect');
    } else {
        window.setInterval("v4_keepAlive();", 60000);
    }

    $("#pageHeader button").button();
}

/*Функция проверки несохраненных изменений на странице и вызов очистки ресурсов при закрытии страницы*/
function v4_onload() {
    if (isIE8) {
        window.onbeforeunload = v4_checkDataBeforeCloseWindow;
    }
    else {
        window.onbeforeunload = function () {
            return v4_checkDataBeforeCloseWindow();
        };
    }
   
}

/*Функция скрывающая попап, если он открыт, при изменении размера окна*/
function v4_checkPopUp() {
    v4s_hidePopup(true);
}

function v4_docView_Show(id, idCtrl) {
    v4s_hidePopup(true);
    cmdasync('ctrl', idCtrl, 'cmd', 'OpenDocument', 'id', id);
}

/*Функция проверки несохраненных изменений на странице*/
function v4_checkDataBeforeCloseWindow() {
    try {
        if (isChanged && isValidate) {
            return 'Данные были изменены. Вы уверены, что хотите закрыть страницу?\nThe data has been changed. Are you sure you want to close the page?';
        }
    } catch (e) { }
}

/*Функция установки активного элента документа при получении им форкуса
event - текущее событие
*/
function v4_setActiveElement(event) {
    if (event && event.target) {
        document.activeElement =
            event.target == document ? null : event.target;
        if (document.activeElement && document.activeElement.id && document.activeElement.id != "") {
            var jqObj =$("#" + document.activeElement.id);
            if (jqObj.hasClass("v4si"))
                v4_lastActiveCtrlSelect = jqObj;
        }
    }
}

/*Функция сброса активного элента документа при потере им форкуса*/
function v4_clearActiveElement(event) {
    document.activeElement = null;
}

/*Функция вызова серверного обновления контрола
id - идентификатор контрола
*/
function v4_refresh(id) {
    cmdasync('ctrl', id, 'cmd', 'Refresh');
}

/*Функция получения значения параметра из строки запроса
key - идентификатор в строке запроса
*/
function v4_getQSParamValue(key) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == key) {
            return decodeURIComponent(pair[1]);
        }
    }
}

/*Функция получение чистого текста из HTML через использование внутренних свойств элемента div innerHTML->innerText*/
function v4_getTextFromHtml(html) {
    var d = ce('DIV');
    d.innerHTML = html;
    return d.innerText;
}

/*Приведение времени UTC к локальному времени клиента*/
function v4_toLocalTime(instr, format, lang, isLocal) {
    var re = /^([1][9]|[2][0-9])([0-9][0-9])(-([0][1-9]|[1][0-2]|[0-9]))(-([0-2][0-9]|[3][0-1]|[0-9]))( ([0-1][0-9]|[2][0-3]|[0-9]))(:([0-5][0-9]|[0-9]))(:([0-5][0-9]|[0-9]))$/i;
    if (re.test(instr)) { // проверка входной строки регулярным выражением
        var arrdatetime = instr.toString().split(' ');
        var d = new Date();

        if ((arrdatetime[0]) != null) {
            var arrdate = arrdatetime[0].split('-');
            if (isLocal) {
                d.setFullYear(arrdate[0], arrdate[1] - 1, arrdate[2]);
            } else {
                d.setUTCFullYear(arrdate[0], arrdate[1] - 1, arrdate[2]);
            }
        }

        if ((arrdatetime[1]) != null) {
            var arrtime = arrdatetime[1].split(':');
            if (isLocal) {
                d.setHours(arrtime[0], arrtime[1], arrtime[2]);
            } else {
                d.setUTCHours(arrtime[0], arrtime[1], arrtime[2]);
            }
        }

        var hours = d.getHours().toString();
        if (hours.length == 1) hours = '0' + hours;

        var minutes = d.getMinutes().toString();
        if (minutes.length == 1) minutes = '0' + minutes;

        var seconds = d.getSeconds().toString();
        if (seconds.length == 1) seconds = '0' + seconds;

        var day = d.getDate().toString();
        if (day.length == 1) day = '0' + day;

        var month = ((d.getMonth()) + 1).toString();
        if (month.length == 1) month = '0' + month;

        var dayofweek = d.getDay();

        format = format.replace(new RegExp('dd', 'g'), day);
        format = format.replace(new RegExp('mm', 'g'), month);
        format = format.replace(new RegExp('hh', 'g'), hours);
        format = format.replace(new RegExp('mi', 'g'), minutes);
        format = format.replace(new RegExp('ss', 'g'), seconds);


        if (d.getFullYear().toString().length > 2) {
            format = format.replace(new RegExp('yyyy', 'g'), d.getFullYear().toString());
            format = format.replace(new RegExp('yy', 'g'), d.getFullYear().toString().substring(2, 4));
        } else if (d.getFullYear().toString().length > 1) {
            format = format.replace(new RegExp('yyyy', 'g'), '19' + d.getFullYear().toString());
            format = format.replace(new RegExp('yy', 'g'), d.getFullYear().toString());
        } else {
            format = format.replace(new RegExp('yyyy', 'g'), '190' + d.getFullYear().toString());
            format = format.replace(new RegExp('yy', 'g'), '0' + d.getFullYear().toString());
        }

        var monthFull, monthShort, monthFullG;
        monthFullG = '';

        if (lang == 'en') {
            switch (month) {
                case '01':
                    monthFull = 'January';
                    monthFullG = 'January';
                    monthShort = 'Jan';
                    break;
                case '02':
                    monthFull = 'February';
                    monthFullG = 'February';
                    monthShort = 'Feb';
                    break;
                case '03':
                    monthFull = 'March';
                    monthFullG = 'March';
                    monthShort = 'Mar';
                    break;
                case '04':
                    monthFull = 'April';
                    monthFullG = 'April';
                    monthShort = 'Apr';
                    break;
                case '05':
                    monthFull = 'May';
                    monthFullG = 'May';
                    monthShort = 'May';
                    break;
                case '06':
                    monthFull = 'June';
                    monthFullG = 'June';
                    monthShort = 'Jun';
                    break;
                case '07':
                    monthFull = 'July';
                    monthFullG = 'July';
                    monthShort = 'Jul';
                    break;
                case '08':
                    monthFull = 'August';
                    monthFullG = 'August';
                    monthShort = 'Aug';
                    break;
                case '09':
                    monthFull = 'September';
                    monthFullG = 'September';
                    monthShort = 'Sept';
                    break;
                case '10':
                    monthFull = 'October';
                    monthFullG = 'October';
                    monthShort = 'Oct';
                    break;
                case '11':
                    monthFull = 'November';
                    monthFullG = 'November';
                    monthShort = 'Nov';
                    break;
                case '12':
                    monthFull = 'December';
                    monthFullG = 'December';
                    monthShort = 'Dec';
                    break;
            }
            switch (dayofweek) {
                case 0:
                    dayFull = 'Sunday';
                    dayShort = 'Sun';
                    break;
                case 1:
                    dayFull = 'Monday';
                    dayShort = 'Mon';
                    break;
                case 2:
                    dayFull = 'Tuesday';
                    dayShort = 'Tue';
                    break;
                case 3:
                    dayFull = 'Wednesday';
                    dayShort = 'Wed';
                    break;
                case 4:
                    dayFull = 'Thursday';
                    dayShort = 'Thu';
                    break;
                case 5:
                    dayFull = 'Friday';
                    dayShort = 'Fri';
                    break;
                case 6:
                    dayFull = 'Saturday';
                    dayShort = 'Sat';
                    break;
            }
        } else {
            switch (month) {
                case '01':
                    monthFull = 'Январь';
                    monthFullG = 'Января';
                    monthShort = 'Янв';
                    break;
                case '02':
                    monthFull = 'Февраль';
                    monthFullG = 'Февраля';
                    monthShort = 'Фев';
                    break;
                case '03':
                    monthFull = 'Март';
                    monthFullG = 'Марта';
                    monthShort = 'Мар';
                    break;
                case '04':
                    monthFull = 'Апрель';
                    monthFullG = 'Апреля';
                    monthShort = 'Апр';
                    break;
                case '05':
                    monthFull = 'Май';
                    monthFullG = 'Мая';
                    monthShort = 'Май';
                    break;
                case '06':
                    monthFull = 'Июнь';
                    monthFullG = 'Июня';
                    monthShort = 'Июн';
                    break;
                case '07':
                    monthFull = 'Июль';
                    monthFullG = 'Июля';
                    monthShort = 'Июл';
                    break;
                case '08':
                    monthFull = 'Август';
                    monthFullG = 'Августа';
                    monthShort = 'Авг';
                    break;
                case '09':
                    monthFull = 'Сентябрь';
                    monthFulGl = 'Сентября';
                    monthShort = 'Сент';
                    break;
                case '10':
                    monthFull = 'Октябрь';
                    monthFullG = 'Октября';
                    monthShort = 'Окт';
                    break;
                case '11':
                    monthFull = 'Ноябрь';
                    monthFullG = 'Ноября';
                    monthShort = 'Ноя';
                    break;
                case '12':
                    monthFull = 'Декабрь';
                    monthFullG = 'Декабря';
                    monthShort = 'Дек';
                    break;
            }
            switch (dayofweek) {
                case 0:
                    dayFull = 'Воскресенье';
                    dayShort = 'Вск';
                    break;
                case 1:
                    dayFull = 'Понедельник';
                    dayShort = 'Пн';
                    break;
                case 2:
                    dayFull = 'Вторник';
                    dayShort = 'Вт';
                    break;
                case 3:
                    dayFull = 'Среда';
                    dayShort = 'Ср';
                    break;
                case 4:
                    dayFull = 'Четверг';
                    dayShort = 'Чт';
                    break;
                case 5:
                    dayFull = 'Пятница';
                    dayShort = 'Пт';
                    break;
                case 6:
                    dayFull = 'Суббота';
                    dayShort = 'Сб';
                    break;
            }
        }

        format = format.replace(new RegExp('Monthg', 'g'), monthFullG);
        format = format.replace(new RegExp('monthg', 'g'), monthFullG.toLowerCase());

        format = format.replace(new RegExp('Month', 'g'), monthFull);
        format = format.replace(new RegExp('month', 'g'), monthFull.toLowerCase());

        format = format.replace(new RegExp('Mon', 'g'), monthShort);
        format = format.replace(new RegExp('mon', 'g'), monthShort.toLowerCase());

        format = format.replace(new RegExp('Dof', 'g'), dayShort);
        format = format.replace(new RegExp('dof', 'g'), dayShort.toLowerCase());

        format = format.replace(new RegExp('Dayofweek', 'g'), dayFull);
        format = format.replace(new RegExp('dayofweek', 'g'), dayFull.toLowerCase());

        return (format);
    }
    return 'Incorrect date format';
}


/*=========================================================================================================================================*/
/*===========================================================Функции контрола V4.SELECT====================================================*/
/*Функция инициализации всплывающего DIV для контрола select*/
function v4s_init() {
    var borderStyle = "1px solid darkgray";
    v4s_popup = ce("DIV");
    v4s_popup.id = "v4s_popup";
    v4s_popup.style.borderLeft = borderStyle;
    v4s_popup.style.borderRight = borderStyle;
    v4s_popup.style.borderBottom = borderStyle;
    v4s_popup.style.position = "absolute";
    v4s_popup.style.maxHeight = "250px";
    v4s_popup.style.overflow = "auto";
    v4s_popup.style.display = "none";
    v4s_popup.style.zIndex = "10000";
    v4s_isPopupOpen = false;
    v4f_isPopupOpen = false;

    Event.add(v4s_popup, 'mouseover', v4s_popupOver);
    Event.add(v4s_popup, 'mouseout', v4s_popupOut);
    Event.add(v4s_popup, 'mousedown', v4s_mouseDown);
    Event.add(v4s_popup, 'click', v4s_popupClick);
    

    v4s_popup.ids = '';
    ac(v4s_popup);
}

function v4s_mouseDown(event) {
    v4s_stopBlur(true);
}


/*Обработка события  выбора значения с помощью мыши в всплывающем окне конрола SELECT
event - текущее событие
rowIndex - индекс ряда в таблице с результати поиска
*/
function v4s_popupClick(event, rowIndex) {
    event = window.event || event;
    var o = null;
    if (rowIndex != null) {
        var t = v4s_popup.getElementsByTagName("TABLE")[0];
        o = t.rows[rowIndex];
    } else {
        o = event.target || event.srcElement;
        while (o.tagName != 'TR' && o != v4s_popup)
            o = o.parentNode;
    }
    var id = v4s_popup.ids;
    if (o.tagName != 'TR') return;
    if (o.getAttribute('cmd') == null) return;

    if (o.getAttribute('cmd') == 'select') {
        var vn = o.getAttribute('idItem');
        var text = o.getAttribute('textItem');
        v4s_hidePopup();
        cmdasync('ctrl', id, 'vn', vn, 'tn', text, 'next', 1);
        var ele = gi(id + '_0');
        if (ele != null) {
            v4_isStopBlur = true;
            v4_setBlur = id + '_0';
            ele.focus();
        }
    } else if (o.getAttribute('cmd') == 'new') {
        var tn = gi(id + '_0').value;
        v4s_hidePopup();
        cmd('ctrl', id, 'cmd', 'new', 'tn', tn);
    } else if (o.getAttribute('cmd') == 'search') {
        var ele = gi(id + '_0');
        if (ele != null) {
            ele.value = '';
        }
        v4s_hidePopup();
        cmd('ctrl', id, 'cmd', 'search');
    } else if (o.getAttribute('cmd') == 'create') {
        v4s_hidePopup();
        var idUrl = o.getAttribute('idUrl');
        if (idUrl == null || idUrl == '') {
            alert('Ошибка! Не задана ссылка на создание!');
            return;
        }
        cmd('ctrl', id, 'cmd', 'create', 'idUrl', idUrl);
    } else if (o.getAttribute('cmd') == 'setHead') {
        v4s_hidePopup();
        cmd('ctrl', id, 'cmd', 'setHead', 'val', o.getAttribute('idItem'));
        var element = gi(id + '_0');
        if (element == null) element = gi(id + 'Number_0');
        if (element != null) {
            v4_isStopBlur = true;
            v4_setBlur = id + '_0';
            element.focus();
        }
    }
}

/*Callback-функция, которая вызвается при получении значения из формы расширенного поиска сущности*/
function v4s_setSelectedValue(control, callbackKey, result, isMultiReturn) {
    if (isMultiReturn == 'True') {
        cmd('ctrl', control, 'cmd', 'clearSelectedItems');
    }

    if (typeof result === "object") {
        for (var i = 0; i < result.length; i++) {
            v4_setValue(control, result[i].value, result[i].label);
        }
    } else {
        v4_setValue(control, result, "");
    }
}

/*Callback-функция, которая вызывается при получении значения из формы расширенного поиска сущности*/
function v4s_setSelectedFullValue(control, callbackKey, result, isMultiReturn) {
    if (isMultiReturn == 'True') {
        cmd('ctrl', control, 'cmd', 'clearSelectedItems');
    }

    v4_setValue(control, JSON.stringify(result));
}

/*Функция управления полосой прокрутки, вызывается при открытом popup контрола select и нажатии кнопок вверх/вниз. 
x - на сколько сдвигать полосу прокрутки
*/
function v4s_scrollContent(x) {
    var element = gi('v4s_popup');
    var oldScroll = element.scrollTop;
    var newScroll = oldScroll + x;
    var r = v4s_getSelectedRowIndex();
    if (r == 0)
        newScroll = 0;
    else if (r == v4s_getPopupCountItems() - 1)
        newScroll = Math.max(document.body.scrollHeight, document.body.offsetHeight, element.clientHeight, element.scrollHeight, element.offsetHeight);
    element.scrollTop = newScroll;
}

/*Функция открытия popup для контрола Select
id - идентификатор контрола
fullResult - в всплывающем окне должны быть показаны все результаты поиска, поэтому выпадающему диву задается максимальная высота, 
при превышении которой появятся полосы прокрутки
*/
function v4s_showPopup(id, fullResult) {
    var el = gi(id);
    v4s_popup.el = el;
    var r = el.getBoundingClientRect();
    var top = r.top;

    var left = r.left;
    v4s_popup.style.display = 'block';
    v4s_isPopupOpen = true;
    v4f_isPopupOpen = false;
    
    var scrollTop = window.pageYOffset || el.scrollTop || document.body.scrollTop || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || el.scrollLeft || document.body.scrollLeft || document.documentElement.scrollLeft;

    v4s_popup.style.left = "" + (left + document.documentElement.scrollLeft) + "px";
    v4s_popup.style.top = "" + (r.bottom + scrollTop) + "px";
    var w = "";
    w = "" + (r.right - r.left - 2) + "px";
    v4s_popup.style.width = w;

    if (fullResult != null)
        v4s_popup.className = "v4s_p_fullResult";

    if (gi(id)) {
        gi(id).focus();
    }
}

/*Функция открытия popup для выбора условий фильтрации
id - идентификатор основного контрола
idHead - идентификатор контрола, относительно которого выпадает popup
*/
function v4f_showPopup(id, idHead) {
    var el = gi(id);
    var el2 = gi(idHead);
    v4s_popup.el = el;

    var r = el.getBoundingClientRect();
    var left = r.left;
    v4s_popup.style.display = 'block';
    v4s_isPopupOpen = true;
    v4f_isPopupOpen = true;

    var scrollTop = window.pageYOffset || el2.scrollTop || document.body.scrollTop || document.documentElement.scrollTop;

    v4s_popup.style.left = "" + (left + document.documentElement.scrollLeft) + "px";
    v4s_popup.style.top = "" + (el2.getBoundingClientRect().bottom + scrollTop) + "px";
    v4s_popup.style.width = 'auto';
}

/*Функция устанавливающая стиль кнопки открытия в контроле Select
id - идентификатор контрола select
*/
function v4s_btnStyle(id) {
    var inp = gi(id + '_0');
    var btn = gi(id + '_1');
    if (btn == null) return;
    
    if (inp.value != '' && inp.value == inp.getAttribute('t') && (btn.getAttribute('urlShowEntity') != null || btn.getAttribute('funcShowEntity') != null)) {
        if (inp.getAttribute('v') == inp.getAttribute('crp')) {
            v4s_btnStyle4Popup(btn, id);
            return;
        }
        btn.value = '';
        btn.style.backgroundImage = 'url(/styles/detail.gif)';
        btn.className = 'v4s_btnDetail';
        if (btn.getAttribute('urlShowEntity') != null)
            btn.onclick = function () { 
					var _urlShowEntity = btn.getAttribute('urlShowEntity');
					v4_windowOpen(_urlShowEntity + (_urlShowEntity.indexOf("?")>0 ? "&" : "?") + 'id=' + inp.getAttribute('v'), ''); 
			};
        if (btn.getAttribute('funcShowEntity') != null)
            btn.onclick = function () {
                var _scr = $.validator.format(btn.getAttribute('funcShowEntity'), inp.getAttribute('v'), id);
                eval(_scr);
            };
    } else {
            v4s_btnStyle4Popup(btn, id);
    }
}

function v4s_btnStyle4Popup(btn, id) {

        btn.value = '...';
        btn.style.backgroundImage = '';
        btn.className = 'v4s_btn';
        btn.onclick = function () { v4s_btnClick(id); };

}

/*Функция обработки события нажатия кнопки контрола select
id - идентификатор контрола select
*/
function v4s_btnClick(id) {
    var o = gi(id + '_0');
    if (o.value != null) {
        v4_isStopBlur = true;
        v4_setBlur = id + '_0';
        var searchText = (o.value != o.getAttribute('t')) ? o.value : "";
        var valueText = o.getAttribute('t');
        cmdasync('ctrl', id, 'tn', valueText, 'st', searchText, 'cmd', 'popup');
    } else {
        v4_setFocus2NextCtrl();
    }
}

/*Функция, определяющая выделенный ряд в открытом popup диве*/
function v4s_getSelectedRowIndex() {
    var t = v4s_popup.getElementsByTagName("TABLE")[0];
    if (t == null || t.rows.length == 0) return -1;

    for (var i = 0; i < t.rows.length; i++)
        if (t.rows[i].className == "v4s_p_highlight")
            return i;
    return -1;
}

/*Функция, возвращающая количество элементов в открытом popup диве*/
function v4s_getPopupCountItems() {
    var t = v4s_popup.getElementsByTagName("TABLE")[0];
    if (t == null) return 0;
    return t.rows.length;
}

function v4s_stopBlur(stop) {
    v4_isStopBlur = stop;

    if (v4_setBlur == '') return;
    var objFocus = gi(v4_setBlur)
    if (!objFocus) return;

    setTimeout(function() {
        objFocus.focus();
    }, 0);
}

/*Функция-обработчик события потери фокуса контрола Select*/
var v4s_onBlur = function (event) {

    if (v4_isStopBlur && v4s_isPopupOpen) {
        v4s_stopBlur(false);
        return;
    }

    event = window.event || event;
    var o = event.target || event.srcElement;
    if (o == null) return;

    var id = o.id.substring(0, o.id.length - 2);
    if (!v4s_isPopupOpen) {
        if (o.value != o.getAttribute('t')) {
            cmdasync('ctrl', id, 'tn', o.value);
        }
    } else {
        if (document.activeElement == null || document.activeElement.id !== id) {
            if (o.value != o.getAttribute('t')) o.value = '';
            v4_replaceStyleRequired(o);
            v4s_hidePopup();
        }
    }
};


/*Функция, закрывающая и очищающая открытый popup контрола Select*/
function v4s_hidePopup(force) {
    v4_setBlur = '';
    var target = document.activeElement;
    if (force == null && target != null && target.id == "v4s_popup")
        return;
    /*запусти в отдельтный поток, т.к. не всегда правильно отрабытывает последовательность событий*/
    setTimeout(function () {
        v4s_popup.style.display = 'none';
        v4s_isPopupOpen = false;
        v4f_isPopupOpen = false;
        v4s_popup.innerHTML = ''; 
    }, 0);
}

/*Функция-обработчик события изменения текста в контроле Select
event - текущее событие
id - идентификатор контрола
x- тип события: 0 - oninput; 1 - onpropertychange
*/
function v4s_textChange(event, id, x) {

    event = window.event || event;
    var e = event;
    var o = e.target || e.srcElement;
    var inp = gi(id + '_0');
    var btn = gi(id + '_1');
    if (o.value != null && (o.value.length == 0 || o.value != o.getAttribute('t'))) {
        if (btn != null) {
            v4s_btnStyle4Popup(btn, id);
        }
    }
    else if (o.value != null && o.value.length > 0 && o.value == o.getAttribute('t')) {
        if (btn != null && (btn.getAttribute('urlShowEntity') != null || btn.getAttribute('funcShowEntity') != null)) {
            btn.value = '';
            btn.style.backgroundImage = 'url(/styles/detail.gif)';
            btn.className = 'v4s_btnDetail';
            if (btn.getAttribute('urlShowEntity') != null)
                btn.onclick = function () { v4_windowOpen(btn.getAttribute('urlShowEntity') + '?id=' + o.getAttribute('v'), ''); };
            if (btn.getAttribute('funcShowEntity') != null)
                btn.onclick = function () {
                    var _scr = $.validator.format(btn.getAttribute('funcShowEntity'), inp.getAttribute('v'), id);
                    eval(_scr);
                };
        }
    }
            
    inp.setAttribute("stxt", o.value); 
}

/*Функция-обработчик события нажатия кнопки в конроле Select
event - текущее событие
*/
function v4s_keyDown(event) {
  
    event = window.event || event;
    var e = event;
    var o = e.target || e.srcElement;
    var id = o.id.substring(0, o.id.length - 2);

    if (v4s_isPopupOpen && e.keyCode != 13 && e.keyCode != 27) {
        var t = v4s_popup.getElementsByTagName("TABLE")[0];
        if (t == null || t.rows.length == 0) return;

        var r = v4s_getSelectedRowIndex();
        if (r >= 0) t.rows[r].className = '';

        if (e.keyCode == 40)
            for (var i = 0; i < t.rows.length; i++) {
                r++;
                if (r == t.rows.length) r = 0;

                if (t.rows[r].className == 'v4s_noselect') continue;
                t.rows[r].className = 'v4s_p_highlight';
                break;
            }
        else if (e.keyCode == 38)
            for (var i = 0; i < t.rows.length; i++) {
                if (r == 0 || r == -1) r = t.rows.length;
                r--;
                if (t.rows[r].className == 'v4s_noselect') continue;
                t.rows[r].className = 'v4s_p_highlight';
                break;
            }
    } else if (v4s_isPopupOpen && e.keyCode == 13) {
        var r = v4s_getSelectedRowIndex();
        if (r >= 0) {
            v4s_popupClick(null, r);
            var element = gi(id + '_0');
            if (element != null) {
                v4_isStopBlur = true;
                var nc = element.getAttribute('nc');
                if (nc != null) {
                    var elementNc = gi(nc);
                    if (elementNc != null) {
                        var nc2 = elementNc.getAttribute('nc');
                        if (elementNc && nc != nc2) {
                            v4_setBlur = '';
                            v4_setFocus2NextCtrl();
                        }
                    }
                }
            }
        } else {
            if (o.value != null && (o.value.length == 0 || o.value != o.getAttribute('t'))) {
                v4_isStopBlur = true;
                v4_setBlur = id + '_0';
                var searchText = (o.value != o.getAttribute('t')) ? o.value : "";
                var valueText = o.getAttribute('t');
                cmdasync('ctrl', id, 'tn', valueText, 'st', searchText, 'cmd', 'popup');
            } else {
                v4_setFocus2NextCtrl();
            }
        }
        v4s_hidePopup();
        return false;
    } 
    else if (!v4s_isPopupOpen && e.keyCode == 13) {
        if (o.value != null && (o.value.length == 0 || o.value != o.getAttribute('t'))) {
            v4_isStopBlur = true;
            v4_setBlur = id + '_0';
            var searchText = (o.value != o.getAttribute('t')) ? o.value : "";
            var valueText = o.getAttribute('t');
            cmdasync('ctrl', id, 'tn', o.value, 'st', searchText, 'cmd', 'popup');
        } else {
            v4_setFocus2NextCtrl();
        }
        return false;
    } else if (!v4s_isPopupOpen && e.keyCode == 27) {
        o.value = o.getAttribute('t');
        var inp = gi(id + '_0');
        var btn = gi(id + '_1');
        inp.setAttribute('stxt', '');
        v4_replaceStyleRequired(o);

        if (btn != null) {
            if ((btn.getAttribute('urlShowEntity') != null || btn.getAttribute('funcShowEntity') != null) && ((o != null && o.getAttribute('v') != "") || (inp != null && inp.getAttribute('v')!="")) ) {
                btn.value = '';
                btn.style.backgroundImage = 'url(/styles/detail.gif)';
                btn.className = 'v4s_btnDetail';
                if (btn.getAttribute('urlShowEntity') != null)
                    btn.onclick = function () { v4_windowOpen(btn.getAttribute('urlShowEntity') + '?id=' + o.getAttribute('v'), ''); };
                if (btn.getAttribute('funcShowEntity') != null)
                    btn.onclick = function () {
                        var _scr = $.validator.format(btn.getAttribute('funcShowEntity'), inp.getAttribute('v'), id);
                        eval(_scr);
                        };
            } else {
                v4s_btnStyle4Popup(btn, id);
            }
        }
        v4_setFocus2NextCtrl();
    }
}

/*Функция-обработчик события наведения указателя мыши на открытый popup контрола Select
event - текущее событие
*/
function v4s_popupOver(event) {
    event = window.event || event;
    var target = event.target || event.srcElement;
    if (target.tagName == "TD" && target.parentElement.className != 'v4s_noselect') {
        v4_isStopBlur = true;
        var r = v4s_getSelectedRowIndex();
        if (r >= 0) target.parentElement.parentElement.rows[r].className = '';
        target.parentElement.className = 'v4s_p_highlight';        
    }
}

/*Функция-обработчик события увода указателя мыши с открытого popup контрола Select
event - текущее событие
*/
function v4s_popupOut(event) {
    event = window.event || event;
    var target = event.target || event.srcElement;
    if (target.tagName == "TD" && target.parentElement.className != 'v4s_noselect') {
        v4_isStopBlur = false;
        target.parentElement.className = '';
    }
}


/*=========================================================================================================================================*/

/*Функция-обработчик события изменения значения в контроле DatePicker
id - идентификатор контрола
goToNextControl - переводить ли фокус на следующий контрол
*/
function v4d_changed(id, goToNextControl) {
    
    v4d_format(id + '_0');
    var o = gi(id + '_0');
    v4_replaceStyleRequired(o);
    if (o.value != o.getAttribute('t')) {
        cmd('ctrl', id, 'v', o.value);
        if (goToNextControl) {
            v4_setFocus2NextCtrl(id + '_0');
        }
    } else if (goToNextControl) {
        v4_setFocus2NextCtrl(id + '_0');
    }
}


/*Функция-обработчик события изменения текста в контролах Textbox и TextArea
event-текущее событие
*/
function v4t_changed(event) {
    event = window.event || event;
    var o = event.target || event.srcElement;
    v4_replaceStyleRequired(o);
    var id = o.id.substring(0, o.id.length - 2);    
    cmdasync('ctrl', id, 'v', o.value);
}

/*===========================================================Функции контрола V4.Textbox===================================================*/


/*Функция-обработчик события нажатия кнопки в контролах Textbox и TextArea
event-текущее событие
*/
function v4t_keyDown(event) {
    event = window.event || event;
    var e = event;
    var o = e.target || e.srcElement;
    if (e.keyCode == 13 || e.keyCode == 9) {
        v4_setFocus2NextCtrl();
        return false;
    }
    v4_replaceStyleRequired(o);
}


/*=========================================================================================================================================*/
/*===========================================================Функции контрола V4.ComboBox==================================================*/

/*Функция установки значения контрола ComboBox
id - идентификатор контрола
val - значение
*/
function v4cb_setValue(id, val) {
    var o = gi(id + '_0');
    o.value = val;
    v4_replaceStyleRequired(o);
}

/*Функция установки значения контрола ComboBox, который находимя в нерадактируемом состоянии
id - идентификатор контрола
val - значение
*/
function v4cb_setValueReadOnly(id, val) {
    var o = gi(id);
    o.innerHTML = val;
}

/*Функция-обработчик события изменения значения контрола ComboBox
event - текущее событие
*/
function v4cb_changed(event) {
    event = window.event || event;
    var o = event.target || event.srcElement;
    v4_replaceStyleRequired(o);

    var id = o.id.substring(0, o.id.length - 2);    
    var vt = o.options.item(o.selectedIndex).text;

    cmd('ctrl', id, 'v', o.value, 't', vt);
}

/*Функция-обработчик события нажати кнопки на контроле ComboBox
event - текущее событие
*/
function v4cb_keyDown(event) {
    var e = window.event || event;
    var o = event.target || event.srcElement;
    if (e.keyCode == 13) {
        v4_cancelEvent(e);
        e.returnValue = 0;
        window.setTimeout("v4_setFocus2NextCtrl();", 200);
    } else if (e.keyCode == 27) {
        v4_setFocus2NextCtrl();
    }
}


/*=========================================================================================================================================*/
/*===========================================================Функции контрола V4.DatePicker================================================*/

/*Функция преобразования и представления введенной строки в необходимый формат в контроле DatePicker
id - идентификатор контрола
*/
function v4d_format(id) {
    var o = gi(id);
    if (o.value.length == 0) return;
    var isDateAndTime = o.getAttribute('showTime') == '1';

    if (isDateAndTime) {
        var ds = o.value.trim().split(' ');
        if (ds.length > 1)
            o.value = v4_dateFormat(ds[0]) + ' ' + v4_timeFormat(ds[1]);
        else if (ds.length == 1) {
            var currentDate = new Date();
            o.value = v4_dateFormat(o.value) + ' ' + v4_timeFormat(currentDate.toTimeString());
        }
    } else
        o.value = v4_dateFormat(o.value);

}

/*Функция-обработчик события изменения значения в контроле
id - идентификатор контрола
goToNextControl - переводить ли фокус на следующий контрол
*/
function v4_ctrlChanged(id, goToNextControl, isDatePicker) {

    if (isDatePicker) v4d_format(id + '_0');
    var o = gi(id + '_0');
    v4_replaceStyleRequired(o);
    if (o.value != o.getAttribute('t')) {
        cmd('ctrl', id, 'v', o.value);
        if (goToNextControl) {
            v4_setFocus2NextCtrl(id + '_0');
        }
    } else if (goToNextControl) {
        v4_setFocus2NextCtrl(id + '_0');
    }
}

/*Функция-обработчик события нажатия клавиш на контроле DatePicker
event - текущее событие
o - контрол
*/
function v4d_keyDown(event, o) {
    var e = window.event || event;
    if (e.keyCode == 27) {
        v4_setFocus2NextCtrl();
    } else if (e.keyCode == 13) {
        v4_setFocus2NextCtrl();
       
    }
}


/*=========================================================================================================================================*/
/*===========================================================Функции контрола V4.Time======================================================*/

/*Функция-обработчик события изменения значения в контроле Time
id - идентификатор контрола
fullFormat - приводить к полному формату времени
*/
function v4tm_changed(id, fullFormat) {
    var o = gi(id + '_0');
    if (o == null) return;
    if (o.value.length == 0) return;
    if (fullFormat != null)
        o.value = v4_timeFormatFull(o.value);
    v4_replaceStyleRequired(o);
    if (o.value != o.getAttribute('t')) {
        cmd('ctrl', id, 'v', o.value);
        o.setAttribute('t', o.value);
    }
}

/*Функция-обработчик события нажатия клавиш на контроле Time
event - текущее событие
isHHmmss - признак формата времени
*/
function v4tm_keyDown(event, isHHmmss) {
    var e = window.event || event;
    if (e.keyCode == 27 || e.keyCode == 13) {
        v4_setFocus2NextCtrl();
        return false;
    }
    var start = '';
    var end = '';
    var hours, minutes, seconds;
    var el = event.srcElement;
    //опредилим позицию курсора
    var pos = document.activeElement.selectionStart;
    //-------------------------
    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
        //проверка на допустимость значения
        var charInput = event.keyCode > 57 ? event.keyCode - 48 : event.keyCode;
        charInput = String.fromCharCode(charInput);
        if (pos == 2)
            pos = 3;
        if (pos > 4 && isHHmmss == 'False')
            return false;
        if (pos == 5)
            pos = 6;
        if (pos > 7)
            return false;
        switch (pos) {
            case 0:
                hours = parseInt(charInput + el.value.substr(1, 1), 10);
                if (hours > 23) return false;
                break;
            case 1:
                hours = parseInt(el.value.substr(0, 1) + charInput, 10);
                if (hours > 23) return false;
                break;
            case 3:
                minutes = parseInt(charInput + el.value.substr(4, 1), 10);
                if (minutes > 59) return false;
                break;
            case 4:
                minutes = parseInt(el.value.substr(3, 1) + charInput, 10);
                if (minutes > 59) return false;
                break;
            case 6:
                seconds = parseInt(charInput + el.value.substr(7, 1), 10);
                if (seconds > 59) return false;
                break;
            case 7:
                seconds = parseInt(el.value.substr(6, 1) + charInput, 10);
                if (seconds > 59) return false;
                break;
        }
        el.selectionStart = pos;
        el.selectionEnd = pos + 1;
        el.focus();
        return true;
    }
    else if (event.keyCode == 8 && pos > 0) //backspace
    {
        if (pos > 1)
            start = el.value.substring(0, pos - 1);
        if (pos < 8)
            end = el.value.substring(pos, 8);
        if (el.value.substring(pos - 1, pos) != ':')
            el.value = start + '0' + end;
        document.activeElement.selectionStart = pos - 1;
        document.activeElement.selectionEnd = pos - 1;
    }
    else if (event.keyCode == 46) //delete
    {
        start = el.value.substring(0, pos);
        if (pos < 8)
            end = el.value.substring(pos + 1, 8);
        if (el.value.substring(pos, pos + 1) != ':' && pos < 8)
            el.value = start + '0' + end;
        if (pos < 8) {
            document.activeElement.selectionStart = pos + 1;
            document.activeElement.selectionEnd = pos + 1;
        }
    }
    else if (event.keyCode == 38 || event.keyCode == 40) //стрелка вверх, вниз
    {
        switch (pos) {
            case 0:
            case 1:
            case 2:
                hours = parseInt(el.value.substr(0, 2), 10);

                if (event.keyCode == 38) {
                    if (hours >= 23)
                        return false;
                    hours++;
                }
                else {
                    if (hours <= 0)
                        return false;
                    hours--;
                }
                hours = hours > 9 ? hours : ('0' + hours);
                end = el.value.substring(2, 8);
                el.value = hours + end;
                document.activeElement.selectionStart = pos;
                document.activeElement.selectionEnd = pos;
                break;
            case 3:
            case 4:
            case 5:
                minutes = parseInt(el.value.substr(3, 2), 10);

                if (event.keyCode == 38) {
                    if (minutes >= 59)
                        return false;
                    minutes++;
                }
                else {
                    if (minutes <= 0)
                        return false;
                    minutes--;
                }
                minutes = minutes > 9 ? minutes : ('0' + minutes);
                start = el.value.substring(0, 3);
                end = el.value.substring(5, 8);
                el.value = start + minutes + end;
                document.activeElement.selectionStart = pos;
                document.activeElement.selectionEnd = pos;
                break;
            case 6:
            case 7:
            case 8:
                seconds = parseInt(el.value.substr(6, 2), 10);

                if (event.keyCode == 38) {
                    if (seconds >= 59)
                        return false;
                    seconds++;
                }
                else {
                    if (seconds <= 0)
                        return false;
                    seconds--;
                }
                seconds = seconds > 9 ? seconds : ('0' + seconds);
                start = el.value.substring(0, 6);
                el.value = start + seconds;
                document.activeElement.selectionStart = pos;
                document.activeElement.selectionEnd = pos;
                break;
        }
    }
    else if (event.keyCode == 32) { return false; } // пробел игнорируем
    else if (event.keyCode < 48) { return true; }  //Служебные команды выполняем
    return false;
}

/*=========================================================================================================================================*/
/*===========================================================Функции контрола V4.PeriodTimePicker==========================================*/

/*Функция-обработчик события наведения мыши на контрол PeriodTimePicker. Изменяет стиль кнопок*/
function v4ptp_mouseOver() {
    var btn = event.target || event.srcElement;
    btn.style.cursor = 'pointer';
}

/*Функция отправки на сервер текущей таймзоны клиента*/
function v4_sendTz() {
    var d = new Date();
    v4_xmlHTTP = v4_getXmlHTTP();
    var url = window.location.pathname + "?tz=" + d.getTimezoneOffset();
    v4_xmlHTTP.open("GET", url, false);
    v4_xmlHTTP.send();
}
/*=========================================================================================================================================*/

/*Регистрация события на после загрузки страницы*/
$(document).ready(function () {
    v4_init();
    v4_createToolTipElements();
    v4_createDialogElements();
    //cmdasync('page', 'clientname');
    if(typeof srv4js === "function") srv4js('GETCLIENTNAME', null, function (state, obj) { v4_clientName = state.value; }, null);
});

/*Обработчик закрытия popup-окна*/
//$(document).on("click", function (event) {
//    if (!v4s_isPopupOpen) return;
//    var sc = "v4_selectClause";
//    if (event.target.className != sc && (v4f_isPopupOpen || v4s_isPopupOpen)) {
//        //v4s_hidePopup(true);
//    }
//});

/*Функция перевода контрола select нередактируемый вид*/
function v4_setDisableSelect(id, disable) {
    if (disable) {
        gi(id + '_0').disabled = 1;
        gi(id + '_1').disabled = 1;
        if (window.innerWidth == undefined) {
            gi(id + '_0').style.backgroundColor = "gray";
        }
    }
    else {
        gi(id + '_0').disabled = null;
        gi(id + '_1').disabled = null;
        if (window.innerWidth == undefined) {
            gi(id + '_0').style.backgroundColor = "white";
        }
    }
}

/*Функция, возвращающая иконку в зависимости от статуса*/
function v4_getStatusIcon(status) {
    switch (status) {
        case 2:
            return v4_messageStatusIcons.Warning;
        case 3:
            return v4_messageStatusIcons.Error;
        case 4:
            return v4_messageStatusIcons.Attention;
        case 5:
            return v4_messageStatusIcons.Help;
        default:
            return v4_messageStatusIcons.Information;
    }
}

/*Функция генерации GUID*/
function v4_guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid;
}

/*Функции, поволяющая реализовывать полиморфизм(перегрузку с разным количеством параметров) функций*/
function v4_polymorph() {
    var len2func = [];
    for (var i = 0; i < arguments.length; i++)
        if (typeof (arguments[i]) == "function")
            len2func[arguments[i].length] = arguments[i];
    return function () {
        return len2func[arguments.length].apply(this, arguments);
    }
}

/*Базовая функция работы с диалоговыми окнами(преобразование/создание div-диалога)*/
var v4_dialog = v4_polymorph(

    function (dialogId, dialogDiv, title, width, height, onOpen, onClose, buttons) {
        return v4_dialog(dialogId, null, dialogDiv, title, null, width, height, onOpen, onClose, buttons, null, true, false, false, true);
    },

    function (dialogId, dialogDiv, title, width, height, onOpen, onClose, buttons, dialogPosition) {
        return v4_dialog(dialogId, null, dialogDiv, title, null, width, height, onOpen, onClose, buttons, dialogPosition, true, false, false, true);
    },

    function (dialogId, dialogDiv, title, width, height, onOpen, onClose, buttons, dialogPosition, modalView) {
        return v4_dialog(dialogId, null, dialogDiv, title, null, width, height, onOpen, onClose, buttons, dialogPosition, true, false, false, modalView);
    },

    function (id, htmlContent, dialogDiv, title, status, width, height, onOpen, onClose, buttons, dialogPosition, isForm, titleCloseButton, dialogConfirm) {
        return v4_dialog(id, htmlContent, dialogDiv, title, status, width, height, onOpen, onClose, buttons, dialogPosition, isForm, titleCloseButton, dialogConfirm, true);
    },

    function (id, htmlContent, dialogDiv, title, status, width, height, onOpen, onClose, buttons, dialogPosition, isForm, titleCloseButton, dialogConfirm, modalView) {
        var dialogObj;

        if (dialogDiv != null)
            dialogObj = dialogDiv;
        else
            dialogObj = $(document.createElement('div')).attr("id", id);

        var closeOnEscape = true;

        if (!isForm) {
            var img = (status == null && !isForm) ? "alf.gif" : v4_getStatusIcon(status);
            htmlContent = "<table><tr><td style='vertical-align: middle;text-align:left;padding-right:15px;'><img src='/styles/" + img + "' border=0/></td><td>" + htmlContent + "</td></tr></table>";
            dialogObj.html(htmlContent);
        } else
            closeOnEscape = false;

        var heightAuto = (height && v4_isInt(height) && height % 50 == 0);
        var widthAuto = (width && v4_isInt(width) && width % 50 == 0);

        dialogObj.dialog({
            autoOpen: false,
            resizable: !heightAuto && !widthAuto,
            closeOnEscape: closeOnEscape,
            modal: modalView,
            close: function () {
                if (dialogDiv == null) $(this).dialog('destroy').remove();
                v4s_hidePopup(true);
            }
        });

        if (title == null || title == "") title = "[Не указан заголовок диалогового окна]";
        dialogObj.dialog('option', 'title', title);

        if (width) {
            if (widthAuto) {
                dialogObj.dialog('option', 'width', 'auto');
            } else {
                dialogObj.dialog('option', 'width', width);
            }
            dialogObj.dialog('option', 'minWidth', width);
        }

        if (height) {
            if (heightAuto) {
                dialogObj.dialog('option', 'height', 'auto');
            } else {
                dialogObj.dialog('option', 'height', height);
            }

            dialogObj.dialog('option', 'minHeight', height);
        }

        var dialogClass = !titleCloseButton && !isForm ? "v4-dialog-noclose" : "";
        dialogClass += dialogConfirm ? " v4-dialog-confirm" : "";

        if (dialogClass != "")
            dialogObj.dialog('option', 'dialogClass', dialogClass.trim());

        if (buttons) {
            dialogObj.dialog("option", "buttons", [{}]);
            var buttonPane = dialogObj.parent().find('.ui-dialog-buttonset');
            $(buttonPane).empty();
            $.each(buttons, function (index, props) {
                $(buttonPane).append('<button id="' + props.id + '" ' + (props.width ? ' style="width:' + props.width + 'px;"' : "") + '>' + props.text + '</button>');
                var btn = $('#' + props.id);
                if (props.icons)
                    btn.button({ icons: props.icons });
                else
                    btn.button();


                btn.on('click', function () {
                    if (v4_lastActiveCtrlSelect && props.kescoCheck && props.kescoCheck==1) {
                        var v = v4_lastActiveCtrlSelect.attr("v");
                        var t = v4_lastActiveCtrlSelect.attr("t");
                        var stxt = v4_lastActiveCtrlSelect.attr("stxt");
                        if (v4_lastActiveCtrlSelect.val() == '') stxt = '';
                        if (stxt != "" && v == "" && t == "") {
                            v4_lastActiveCtrlSelect.focus();
                            return;
                        }
                        v4_lastActiveCtrlSelect.attr("stxt",'');
                    }
                    props.click.call();

                });
            });
        }

        if (dialogPosition != null) {
            dialogObj.dialog("option", "position", dialogPosition);
        }
        else {
            var rnd = Math.floor(Math.random() * 16) + 5;
            dialogObj.dialog({ position: { my: "center center", at: "center+" + rnd + " center + " + rnd, of: window} });
        }
        if (onOpen)
            dialogObj.bind("dialogopen", onOpen);

        if (onClose)
            dialogObj.bind("dialogclose", onClose);


        return dialogObj;
    }
);

// Проверка значения на Int
function v4_isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
}

/**
 * Простая функции запроса подтверждения действия пользователя.
 * @param {string} message - текст запроса подтверждения.
 * @param {string} title - заголовок диалога запроса.
 * @param {string} captionYes - текст кнопки Да.
 * @param {string} captionNo - текст кнопки Нет.
 * @callback fYes - функция вызываемая при нажатии кнопки Yes
 * @callback fNo - функция вызываемая при закрытии диалога иначе как кнопкой Yes
 */
function v4_confirmMsgBox(message, title, captionYes, captionNo, fYes, fNo) {
	var dialogObj;
	var closeCallback = fNo;
	var buttons = [
		{
			id: v4_guid() + '_yes',
			text: captionYes,
			icons: {
				primary: v4_buttonIcons.Ok
			},
			width: 75,
			click: function () {
				if (fYes) fYes();
				closeCallback = false;//Предотвращаем вызов из ondialogclose
				dialogObj.dialog("close");
			}
		},
		{
			id: v4_guid() + '_no',
			text: captionNo,
			icons: {
				primary: v4_buttonIcons.Cancel
			},
			width: 75,
			click: function () {
				if (fNo) fNo();
				closeCallback = false;//Предотвращаем вызов из ondialogclose
				dialogObj.dialog("close");
			}
		}
	];

	var dialogId = v4_guid();
	
	dialogObj = v4_dialog(dialogId, message, null, title, 5, null, null, null, null, buttons, null, false, false, true);
	$("#" + dialogId).on("dialogclose", function () { if (closeCallback) closeCallback(); v4s_hidePopup(true); });
	dialogObj.dialog("open");
}

/*Функции вывода сообщений подтверждения*/
var v4_showConfirm_isOpen = false;
var v4_showConfirm = v4_polymorph(
    function (message, title, captionYes, captionNo, callbackYes, width) {
        v4_showConfirm(message, title, captionYes, captionNo, 75, 75, callbackYes, "", "", width, null)
    },

    function (message, title, captionYes, captionNo, callbackYes, callbackNo, width) {
        v4_showConfirm(message, title, captionYes, captionNo, 75, 75, callbackYes, callbackNo, "", "", width, null)
    },

    function (message, title, captionYes, captionNo, widthYes, widthNo, callbackYes, callbackNo, ctrlFocus, width, height) {
        if (v4_showConfirm_isOpen) return;
        v4_showConfirm_isOpen = true;
        var dialogId = v4_guid();
        var yesId = v4_guid() + '_yes';
        var noId = v4_guid() + '_no';
        var buttons = [
        {
            id: yesId,
            text: captionYes,
            icons: {
                primary: v4_buttonIcons.Ok
            },
            width: widthYes,
            click: function () {
                eval(callbackYes);
                $('#' + dialogId).dialog("close");
            }
        },
         {
             id: noId,
             text: captionNo,
             icons: {
                 primary: v4_buttonIcons.Cancel
             },
             width: widthNo,
             click: function () {
                 eval(callbackNo);
                 $('#' + dialogId).dialog("close");

             }
         }
    ];

        var onOpen = function () {
            setTimeout(function () {
                $("#" + noId).focus();
            });
        };
        var onClose = function () { if (ctrlFocus) $("#" + ctrlFocus).focus(); v4_showConfirm_isOpen = false; v4s_hidePopup(true); };

        var dialogObj = v4_dialog(dialogId, message, null, title, 5, width, height, onOpen, onClose, buttons, null, false, false, true);

        dialogObj.dialog("open");
    }

);

    /*Функции вывода сообщений пересчета*/
    var v4_showRecalc = v4_polymorph(
    function (message, title, caption1, caption2, caption3, caption4, callback1, callback2, callback3, callback4, width) {
        v4_showRecalc(message, title, caption1, caption2, caption3, caption4, 80, 80, 80, 80, callback1, callback2, callback3, callback4, "", width, null)
    },

    function (message, title, caption1, caption2, caption3, caption4, width1, width2, width3, width4, callback1, callback2, callback3, callback4, ctrlFocus, width, height) {
        var dialogId = v4_guid();
        var yesId1 = v4_guid() + '_yes1';
        var yesId2 = v4_guid() + '_yes2';
        var yesId3 = v4_guid() + '_yes3';
        var noId = v4_guid() + '_no';
        var buttons = [
        {
            id: yesId1,
            text: caption1,
            icons: {
                primary: v4_buttonIcons.Ok
            },
            width: width1,
            click: function () {
                eval(callback1);
                $('#' + dialogId).dialog("close");
            }
        },
        {
            id: yesId2,
            text: caption2,
            icons: {
                primary: v4_buttonIcons.Ok
            },
            width: width2,
            click: function () {
                eval(callback2);
                $('#' + dialogId).dialog("close");
            }
        },
        {
            id: noId,
            text: caption3,
            icons: {
                primary: v4_buttonIcons.Cancel
            },
            width: width3,
            click: function () {
                eval(callback3);
                $('#' + dialogId).dialog("close");

            }
        },
        {
            id: yesId3,
            text: caption4,
            icons: {
                primary: v4_buttonIcons.Ok
            },
            width: width4,
            click: function () {
                eval(callback4);
                $('#' + dialogId).dialog("close");
            }
        }
    ];

        var onOpen = function () {
            setTimeout(function () {
                $("#" + noId).focus();
            });
        };
        var onClose = function () { if (ctrlFocus) $("#" + ctrlFocus).focus(); v4s_hidePopup(true); };

        var dialogObj = v4_dialog(dialogId, message, null, title, 5, width, height, onOpen, onClose, buttons, null, false, false, true);

        dialogObj.dialog("open");
    }

);

//Функция вывода диалогового сообщения
var v4_showMessage_isOpen = false;
function v4_showMessage(message, title, status, ctrlFocus, width, height) {
    if (v4_showMessage_isOpen) return;
    v4_showMessage_isOpen = true;

    var dialogId = v4_guid();
    var okId = v4_guid() + "_ok";
    var buttons = [
        {
            id: okId,
            text: "OK",
//            icons: {
//                primary: v4_buttonIcons.Ok
//            },
            width: 75,
            click: function () {
                $('#' + dialogId).dialog("close");
                
            }
        }
    ];

    var onOpen = function () {
        setTimeout(function() {
            $("#" + okId).focus();
        });
    };
    var onClose = function () { if (ctrlFocus) $("#" + ctrlFocus).focus(); v4_showMessage_isOpen = false; v4s_hidePopup(true); };

    var dialogObj = v4_dialog(dialogId, message, null, title, status, width, height, onOpen, onClose, buttons, null, false, false, false);

    dialogObj.dialog("open");
}

/*Функция динамического создания диалоговых сообщений*/
function v4_createDialogElements() {
    var v4_DialogOL = gi('v4_divDialogOverlay');
    
    if (v4_DialogOL == null) {
        $('body').prepend("<div id='v4_divDialogOverlay' style='z-index: 20000'></div>");
        $('#v4_divDialogOverlay').append("<div id='v4_divDialogBox'></div>");
        $('#v4_divDialogBox').append("<div id='v4_divDialogContainer'></div>");
        $('#v4_divDialogContainer').append("<div id='v4_divDialogBoxHead'></div>");
        $('#v4_divDialogContainer').append("<div id='v4_divDialogBoxBody'></div>");
        $('#v4_divDialogContainer').append("<div id='v4_divDialogBoxFoot'></div>");


        $('#v4_divDialogBox').draggable({
            handle: $('#v4_divDialogBoxHead'),
            containment: 'window',
            stop: function(event, ui) {
                curItemParam[1] = Math.round($('#v4_divDialogBox').position().left);
                curItemParam[2] = Math.round($('#v4_divDialogBox').position().top);
            }
        });

        $('#v4_divDialogBox').resizable({
            alsoResize: "#v4_divDialogContainer",
            stop: function(event, ui) {
                curItemParam[3] = Math.round(ui.size.height);
                curItemParam[4] = Math.round(ui.size.width);
            }
        });
    }

}

/*Функция создания элементов для v4_tooltip*/
function v4_createToolTipElements() {
    $('<input>').attr('type', 'hidden').attr('id', 'v4_inpTitleToolTip').appendTo('body');
    $('<input>').attr('type', 'hidden').attr('id', 'v4_inpDialogToolTip').appendTo('body');
    $('<input>').attr('type', 'hidden').attr('id', 'v4_inpFootToolTip').appendTo('body');
}

/*Функция добавления tooltip*/
function v4_setToolTip() {
    $(".v4_callerControl").each(function () {
        if ($._data(this, "events") == null || typeof ($._data(this, "events").mouseover) != 'object') {
            $(this).one('mouseenter', v4_toolTipMouseEnter);
        }
    });

}

/*Функция добавления события для tooltip*/
function v4_toolTipMouseEnter() {
    var $this = $(this);
    var dataId = $(this)[0].getAttribute('data-id')
    if (dataId == null || dataId == '') return;
    $this.initToolTip(v4_tooltipCaller, $(document.body));
    setTimeout(function () {
        {
            $this.mouseenter();
        }
    }, 50);
}

/*Функция приводит даты в контролах типа label и span, с классом  localDT к локальному времени*/
function v4_setLocalDateTime(){
	$('.localDT').each(function () {
		var ltAttr = $(this).attr('localTime'); 
		if(ltAttr != 'true')
		{
			/*Дата для локализации*/
			var controlText = $(this).text();
			/*Формат возвращаемой даты*/
			var dtFormat = $(this).attr('dtformat');
			/*Локальная дата*/
			var localDT = 'Incorrect date format';
			if(dtFormat != undefined)
			{
				localDT = v4_toLocalTime(controlText, dtFormat);
				if(localDT == 'Incorrect date format')
				{
					localDT = v4_toLocalTime(controlText,'dd.mm.yyyy hh:mi:ss');
				}
			}
			else
			{
				localDT = v4_toLocalTime(controlText,'dd.mm.yyyy hh:mi:ss');
			}
							
			if(localDT != 'Incorrect date format')
			{
				$(this).text(localDT);
			}
			$(this).attr('localTime', true);
		}
	})
}

/*Удалить после замены на диалог jquery*/
jQuery.fn.center = function () {
    $(".v4_DivDialog").not(this).hide("slow");
    this.css("position", "absolute");
    var top = Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop());
    var left = Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft());
    if (top == v4_top) top = top + 10;
    if (left == v4_left) left = left + 10;
    v4_top = top;
    v4_left = left;
    this.css("top", top + "px");
    this.css("left", left + "px");
    return this;
}

/*Позиционирование заголовка страницы при скроллинге*/
$(window).scroll(function () {
    var pageHeader = $('#pageHeader');
    if (pageHeader) {
        scroll = $(window).scrollTop();
        if (scroll > 0) pageHeader.addClass('v4PageHeader');
        else pageHeader.removeClass('v4PageHeader');
    }
});

//Получает параметры запроса в виде ассоциативного массива
$.v4_urlParams = function (name) {
    var results = new RegExp("[\?&]" + name + "=([^&#]*)")
        .exec(window.location.href);

    if (results == null) return null;
    return results[1] || 0;
};

/*Возврат значений из приложений*/

function v4_returnValuePostForm(value, doEscape) {
    var form = document.getElementById("mvcDialogResult");
    if (!form) return;

    var callbackUrl = $.v4_urlParams("callbackUrl");
    var control = $.v4_urlParams("control");
    var multiReturn = $.v4_urlParams("return");

    if (callbackUrl == null) {
        alert("Отсутствует параметр callbackUrl. Выбрать значение невозможно!");
        return;
    }

    var val = JSON.stringify(value);
    form.action = decodeURIComponent(callbackUrl);
    form.elements["value"].value = doEscape ? escape(val) : val;
    form.elements["escaped"].value = doEscape ? "1" : "0";
    form.elements["control"].value = control;
    form.elements["multiReturn"].value = multiReturn;
    
    form.submit();
}

function v4_returnValueSetCookie(value) {

    try {
        window.returnValue = 1;
    } catch (e) {
    }
    document.cookie = "DlgRez=1;domain=" + v4_domain + ";path=/";

    var r = new RegExp("[^0-9a-z\\s" + String.fromCharCode(160) + "]{1,}", "ig");
    value = String(value).replace(r, function ($1) { return escape($1); });

    document.cookie = "RetVal=" + value + ";domain=" + v4_domain + ";path=/";
    document.cookie = "ParentAction=0;domain=" + v4_domain + ";path=/";

    v4_closeWindow();
}

function v4_returnValue(id, name) {
    var mvc = $.v4_urlParams("mvc");
    if (mvc == 1) {
        var result = [];

        result[0] = {
            value: id,
            label: name
        };

        v4_returnValuePostForm(result, true);
    } else {
        v4_returnValueSetCookie(id);
    }
}

function v4_returnValueArray(arr) {
    var mvc = $.v4_urlParams("mvc");
    if (mvc == 1)
        v4_returnValuePostForm(arr, true);
    else {

        var val = "";
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                val += (val != "" ? String.fromCharCode(30) : "") + arr[i].value + String.fromCharCode(31) + arr[i].label;
            }
        }
        v4_returnValueSetCookie(val);
    }
}

/*------------------------------*/