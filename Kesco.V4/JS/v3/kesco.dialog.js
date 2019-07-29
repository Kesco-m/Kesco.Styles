(function ($, undefined) {

    var _timestamp = new Date().valueOf(); // используется для генерации имени окна
    var _windows = {};
    var _windowName = window.self.name ? window.self.name : ("Wnd" + _timestamp);
    var _lastPositionX = 20;        //смещение по x окна относительно предыдущего открытого
    var _lastPositionY = 20;        //смещение по y окна относительно предыдущего открытого

    $.v4_windowManager = {};

    $.extend($.v4_windowManager, {
        defaultSettings: {
            centerBrowser: 0,       // center window over browser window? {1 (YES) or 0 (NO)}. overrides top and left
            centerScreen: 0,        // center window over entire screen? {1 (YES) or 0 (NO)}. overrides top and left
            height: 800,            // sets the height in pixels of the window.
            left: 0,                // left position when the window appears.
            location: 0,            // determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
            menubar: 0,             // determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
            resizable: 1,           // whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
            scrollbars: 1,          // determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
            status: 0,              // whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
            width: 600,             // sets the width in pixels of the window.
            windowNameSuffix: null, // name of window set from the name attribute of the element that invokes the click
            url: null,              // url used for the popup
            top: 0,                 // top position when the window appears.
            toolbar: 0,             // determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
            callbackKey: null,
            callback: null,
            close: true
        },
        selectEntity: function (url, control, callbackKey, width, height, callbackFunction, isMultiReturn) {

            $.v4_windowManager.openPopupWindow(url, {
                type: 'GET'
            }, function (result) {
                if ($.isArray(result)) {
//                    if (result.length > 0)
//                        callbackFunction(control, callbackKey, result, isMultiReturn);
                    callbackFunction(control, callbackKey, result, isMultiReturn);
                }
            }, width, height);
        },

        openPopupWindow: function (url, context, callback, width, height, replaceOptions) {

            var uri = "" + url;

            var cxt = $.extend({ type: 'GET' }, context || {}, { url: url });

            if (cxt.type == 'POST') {
                uri = "";
            }

            var openOptions = $.extend({
                url: uri,
                centerScreen: 0,
                resizable: 1,
                location: 0,
                width: width,
                height: height,
                callback: callback,
                context: cxt,
                close: true
            },
replaceOptions || {}
);
            return $.v4_windowManager.openWindow(openOptions);
        },

        openWindow: function (settings) {
            settings = $.extend({}, this.defaultSettings, settings || {});

            if (!settings.windowNameSuffix) settings.windowNameSuffix = "" + new Date().valueOf().toString();

            var windowFeatures =    'height=' + settings.height +
									',width=' + settings.width +
									',toolbar=' + settings.toolbar +
									',scrollbars=' + settings.scrollbars +
									',status=' + settings.status +
									',resizable=' + settings.resizable +
									',location=' + settings.location +
									',menuBar=' + settings.menubar;

            var results = new RegExp("^kescorun", "ig").exec(settings.url);
            if (results != null) {
                var id = v4_guid();
                $('body').append('<a id="' + id + '"></a>');
                $("#" + id).attr("href", settings.url);
                v4_evalHref(id);
                $('#' + id).remove();
                return null;
            }

            var centeredY, centeredX;
            var wnd;
            var wndName = this.generateWindowName(settings.windowNameSuffix);
            if (settings.centerBrowser) {
                if ($.browser.msie) {
                    centeredY = (window.screenTop - 120) + ((((document.documentElement.clientHeight + 120) / 2) - (settings.height / 2)));
                    centeredX = window.screenLeft + ((((document.body.offsetWidth + 20) / 2) - (settings.width / 2)));
                } else {
                    _lastPositionY = centeredY = window.screenY + (((window.outerHeight / 2) - (settings.height / 2)));
                    _lastPositionX = centeredX = window.screenX + (((window.outerWidth / 2) - (settings.width / 2)));
                }
                wnd = window.self.open(settings.url, wndName, windowFeatures + ',left=' + centeredX + ',top=' + centeredY);
            } else if (settings.centerScreen) {
                centeredY = (screen.height - settings.height) / 2;
                centeredX = (screen.width - settings.width) / 2;
                wnd = window.self.open(settings.url, wndName, windowFeatures + ',left=' + centeredX + ',top=' + centeredY);
            } else {
                _lastPositionX += 30;
                _lastPositionY += 30;
                if (_lastPositionX > ((screen.width - settings.width) / 2)) _lastPositionX = 20;
                if (_lastPositionY > ((screen.height - settings.height) / 2)) _lastPositionY = 20;
                _lastPositionX = settings.left || _lastPositionX;
                _lastPositionY = settings.top || _lastPositionY;
                //alert("url:"+settings.url+"\nname: "+wndName+"\nfeatures: "+windowFeatures+',left=' + _lastPositionX +',top=' + _lastPositionY);
                wnd = window.self.open(settings.url, wndName, windowFeatures + ',left=' + _lastPositionX + ',top=' + _lastPositionY);
            }

            var wndInfo = { window: wnd, settings: settings };

            _windows[wndName] = wndInfo;
            setTimeout(function () {
                wnd.focus();
            }, 500);
            return wndInfo;
        },

        getContext: function (wnd) {
            var name, wndInfo;

            for (var p in _windows) {
                if (_windows[p] && _windows[p].window == wnd) {
                    name = p, wndInfo = _windows[p];
                    break;
                }
            }
            if (wndInfo) {
                return {
                    url: wndInfo.settings.context.url,
                    type: wndInfo.settings.context.type,
                    context: JSON.stringify(wndInfo.settings.context)
                };
            }
            return {
                url: '',
                context: ''
            }
        },

        closeDialogEx: function (wnd, dialogResult) {
            var name = null, wndInfo = null;
            window.self.focus();

            for (var p in _windows) {
                if (_windows[p] && _windows[p].window == wnd) {
                    name = p, wndInfo = _windows[p];
                    break;
                }
            }

            if (wndInfo) {

                if (wndInfo.settings.callback && $.isFunction(wndInfo.settings.callback)) {
                    if (window.console) console.log(wndInfo.settings.callback);
                    var result = dialogResult ? JSON.parse(dialogResult) : dialogResult;
                    wndInfo.settings.callback(result);
                }

                //if (wndInfo.settings.close && !wndInfo.window.closed) {
                //wndInfo.window.close();
                //}


                delete _windows[name];
            }
            //window.self.focus();
        },

        closeDialog: function (windowNameSuffix, dialogResult) {
            var name = this.generateWindowName(windowNameSuffix);
            window.focus();
            alert("name: " + name + "; result: " + dialogResult);
            var wndInfo = _windows[name];
            if (wndInfo) {
                if (wndInfo.settings.callback && $.isFunction(wndInfo.settings.callback)) {
                    var result = dialogResult ? JSON.parse(dialogResult) : dialogResult;
                    wndInfo.settings.callback(result);
                }

                if (wndInfo.settings.close && !wndInfo.window.closed) {
                    wndInfo.window.close();
                }


                //_windows[name] = null;
            }
        },

        closeWindow: function (name) {
            var wndInfo = _windows[name];
            if (wndInfo && wndInfo.settings.close && !wndInfo.window.closed) {
                wndInfo.window.close();
                _windows[name] = null;
            }
        },

        generateWindowName: function (suffix) {
            return _windowName + "_childWnd" + suffix;
        },

        closeAll: function () {
            return; /*Раскомментировать если нужно при закрыти основного окна с контролами закрывать окна расширенного поиска*/
            for (var wndName in _windows) {
                var wndInfo = _windows[wndName];
                if (wndInfo && wndInfo.settings.close && !wndInfo.window.closed) {
                    wndInfo.window.close();
                    delete _windows[wndName];
                }
            }
        },

        debug: function () {
            if (!window.console) return;
            for (var wndName in _windows) {
                var wndInfo = _windows[wndName];
                console.log($.validator.format("Окно: {0}; {1}", wndName, wndInfo.settings.url));
            }
        },

        Windows: function () {
            return _windows;
        }

    });

    $(window).unload(function () {
        //$.v4_windowManager.closeAll();
    });

} (jQuery));

