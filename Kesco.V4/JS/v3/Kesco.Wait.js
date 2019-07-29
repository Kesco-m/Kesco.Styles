/*Отрисовка ожидания при асинхронном вызое */
var Wait = new CustomWait();

/*Функция показывающая пользователю период ожидания*/
function CustomWait() {
    /*Функция отрисовки диалогового окна*/
    this.render = function (show) {

        v4_stopAsyncEvent = show;
        if (show == false) {
            var objDiaolgOverlay = document.getElementById('v4_divDialogOverlay');
            if (!objDiaolgOverlay) return;

            objDiaolgOverlay.style.display = "none";
            if (active) {
                var active_obj = document.getElementById(active);
                if (active_obj) {
                    var nc = active_obj.getAttribute('nc');
                    if (nc == null) {
                        active_obj.focus();
                    }
                }
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