(function ($, undefined) {

    var _timestamp = new Date().valueOf(); // используется для генерации имени окна
    var _windows = {};
    var _windowName = window.self.name ? window.self.name : ("Wnd" + _timestamp);
   
    $.v4_windowManager = {};

    $.extend($.v4_windowManager, {
        defaultSettings: {
            windowNameSuffix: null, 
            url: null,              
            callbackKey: null,
            callback: null,
            close: true
        },
        selectEntity: function (url, control, callbackKey, callbackFunction, isMultiReturn) {

            $.v4_windowManager.openPopupWindow(url, {
                type: 'GET'
            }, function (result) {
                if ($.isArray(result)) {
                    callbackFunction(control, callbackKey, result, isMultiReturn);
                }
            }, null, control);
        },

        openPopupWindow: function (url, context, callback, replaceOptions, control) {

            var uri = "" + url;
            var cxt = $.extend({ type: 'GET' }, context || {}, { url: url });

            if (cxt.type == 'POST') {
                uri = "";
            }

            var openOptions = $.extend({
                url: uri,
                callback: callback,
                context: cxt,
                close: true,
                control: control
            },
replaceOptions || {}
);
            return $.v4_windowManager.openWindow(openOptions);
        },

        openWindow: function (settings) {
            settings = $.extend({}, this.defaultSettings, settings || {});

            if (!settings.windowNameSuffix) settings.windowNameSuffix = "" + new Date().valueOf().toString();

          
            var results = new RegExp("^kescorun", "ig").exec(settings.url);
            if (results != null) {
                var id = v4_guid();
                $('body').append('<a id="' + id + '"></a>');
                $("#" + id).attr("href", settings.url);
                v4_evalHref(id);
                $('#' + id).remove();
                return null;
            }
            
            var wndName = this.generateWindowName(settings.windowNameSuffix);
            var wnd = Kesco.windowOpen(settings.url, wndName, null, settings.control);
            
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
            
        },

        closeDialog: function (windowNameSuffix, dialogResult) {
            var name = this.generateWindowName(windowNameSuffix);
            window.focus();            
            var wndInfo = _windows[name];
            if (wndInfo) {
                if (wndInfo.settings.callback && $.isFunction(wndInfo.settings.callback)) {
                    var result = dialogResult ? JSON.parse(dialogResult) : dialogResult;
                    wndInfo.settings.callback(result);
                }

                if (wndInfo.settings.close && !wndInfo.window.closed) {
                    wndInfo.window.close();
                }
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

