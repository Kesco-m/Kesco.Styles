$.datepicker.regional['ru'] = {
    applyText: 'Применить',
    closeText: 'Закрыть',
    prevText: 'Предыдущий месяц',
    nextText: 'Следующий месяц',
    currentText: 'Сегодня',
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    weekHeader: 'Неделя',
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};

$.datepicker.regional['et'] = {
    applyText: 'Применить',
    closeText: 'Sulge',
    prevText: 'Eelmine kuu',
    nextText: 'Järgmine kuu',
    currentText: 'Täna',
    monthNames: ['Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni', 'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'],
    monthNamesShort: ['Ja', 'Ve', 'Mä', 'Ap', 'Ma', 'Jn', 'Jl', 'Au', 'Se', 'Ok', 'No', 'De'],
    dayNames: ['Pühapäev', 'Esmaspäev', 'Teisipäev', 'Kolmapäev', 'Neljapäev', 'Reede', 'Laupäev'],
    dayNamesShort: ["Pü", "Es", "Te", "Ko", "Ne", "Re", "La"],
    dayNamesMin: ["Pü", "Es", "Te", "Ko", "Ne", "Re", "La"],
    weekHeader: 'Nädal',
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};

$.datepicker.regional['de'] = {
    applyText: 'Применить',
    closeText: 'Schließen',
    prevText: 'Vorheriger monat',
    nextText: 'Nächsten monat',
    currentText: 'Heute',
    monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    weekHeader: 'Woche',
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};

$.datepicker.regional['it'] = {
    applyText: 'Применить',
    closeText: 'Chiudi',
    prevText: 'Mese precedente',
    nextText: 'Il mese prossimo',
    currentText: 'Oggi',
    monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    dayNamesMin: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
    weekHeader: 'Settimana',
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};

var v4_Datepicker = new function () {
   
    this.init = function (ctrlId, culture, monthformat) {

        if (ctrlId == null || ctrlId == "") {
            alert("Не удалось инициализировать элемент управления v4_Datepicker. Не передан Id.")
            return;
        }
        var idContainer = ctrlId.substring(0, ctrlId.length - 2);

        $("#" + ctrlId)
            .datepicker({
            firstDay: 1,
            allowInputToggle: true,
            constrainInput: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            dateFormat: monthformat == 'True' ? "MM yy" : "dd.mm.yy",
            showOn: "button",
            buttonId: idContainer + '_1',
            buttonImage: "",
            buttonImageOnly: false,
            buttonText: "...",
            currentText: monthformat == 'True' ? $.datepicker.regional[culture].applyText : $.datepicker.regional[culture].currentText,
            beforeShowDay: function (date) {
                var isWeekend = ([0, 6].indexOf(date.getDay()) != -1);
                if (isWeekend)
                    return [true, 'ui-datepicker-weekend'];
                return [true];
            },
            beforeShow: function (date, inst) {
                if (monthformat == 'True') {
                    $(inst.dpDiv).addClass("v4_calendar-off");
                } else {
                    $(inst.dpDiv).removeClass("v4_calendar-off");
                }
            },
            onSelect: function (date) {
                if (monthformat != 'True') {
                    window.setTimeout("v4_ctrlChanged('" + idContainer + "',true, true);", 10);
                }
            }
        }).next(".ui-datepicker-trigger").addClass("v4s_btn");
        
        //установка идентификатора кнопке контрола
        var btnWithId = document.getElementById(idContainer + "_1");
        if (btnWithId == null) {
            $("#" + idContainer + " .ui-datepicker-trigger").attr("id", idContainer + "_1");
            btnWithId = document.getElementById(idContainer + "_1");
        }

        if (btnWithId != null)
            btnWithId.disabled = document.getElementById(idContainer + "_0").disabled;

        //переопределение нажатия кнопки Сегодня
        $.datepicker._gotoToday = function (id) {
            if ($(id).attr('ctrltype') == 'date') {
                $(id).datepicker('setDate', new Date()).datepicker('hide').blur();
                var idCurrent = id.substring(1, id.length - 2);
                window.setTimeout("v4_ctrlChanged('" + idCurrent + "',true, true);", 0);
            } else {
                var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                var date = new Date(year, month, 1);
                this._setDateDatepicker($(id), date);
                this._selectDate(id, this._getDateDatepicker($(id)));
            }
        };

        $.datepicker._setDateFromField = function (inst, noDefault) {
            if (inst.input.val() === inst.lastVal) {
                return;
            }

            var dateFormat = this._get(inst, "dateFormat"),
			dates = inst.lastVal = inst.input ? inst.input.val() : null,
			defaultDate = this._getDefaultDate(inst),
			date = defaultDate,
			settings = this._getFormatConfig(inst);

            if (dateFormat == "MM yy") {
                dateFormat = "dd MM yy";
                dates = "01 " + dates;
            }
            try {
                date = this.parseDate(dateFormat, dates, settings) || defaultDate;
            } catch (event) {
                dates = (noDefault ? "" : dates);
            }
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            inst.currentDay = (dates ? date.getDate() : 0);
            inst.currentMonth = (dates ? date.getMonth() : 0);
            inst.currentYear = (dates ? date.getFullYear() : 0);
            this._adjustInstDate(inst);
        }
        
        //локализация
        $.datepicker.setDefaults($.datepicker.regional[culture]);
        
    };
   
};
