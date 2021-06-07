/*Расширения контрола qTip для работы звонилки с контролами лиц*/
(function ($) {
    $.fn.initToolTip = function (source, $container) {
        $.fn.qtip.zindex = 99998;
        return this.each(function (index, element) {
            var domElement = this;
            initToolTip(domElement, source, $container);
        });
    };

    function initToolTip(element, source, $container) {
        var uri = '';
        if (typeof source === "string") uri = source;
        if ($.isFunction(source)) uri = source.apply(element);
        var $element = $(element);
		var timer;
		//т.к. в IE8 и Opera 12 не работает jQuery .is(":hover") (проверка, наведена ли мышь на эллемент), состояние hover пишем в переменную hovering
		$element.hover(function() {
				$(this).data('hovering', true);
			}, function() {
		//В IE8 при большом кол-ве эллементов с тултипом запись состояния false может запаздывать, и срабатывать ранее чем состояние true, вызываем запись с задержкой
				var t = setTimeout(function() {setToolTipHoverOff($element, timer)},100);
			});

        var $span = $("<span style='style: absolute; left: 0px; top: 0px; height: 18px;'><span style='style: relative;'></span></span>");
        if ($container)
            $container.prepend($span);
        else
            $element.parent().prepend($span);

        var pos = {
            target: $element,
            container: $span.find(':first'),
            my: 'middle left',
            at: 'middle left',
            viewport: $(window),
            adjust: { method: 'shift' }
        };

        if ($element.is(':input')) {
            pos.my = 'bottom left';
            pos.at = 'top left';
        }
        $.support.cors = true;
        var options = {
            content: {
                text: '&nbsp;',
                ajax: {
                    url: uri,					
                    once: false,
                    crossDomain: true,					
                    xhrFields: { withCredentials: true },
                    beforeSend: function (xhr) {
                        $element.css('cursor', "wait");
                        this.set('content.text', "");						
                        //this.set('content.title.text', "");
                    },
                    success: function (data) {
                        //this.set('content.text', data);
						
						var container = $("body");
                        var width = Math.floor(container.width() / 10) * 6;
                        var height = Math.floor(container.height() / 10) * 8;
                        var content = "<div style='margin:0px; overflow: auto; min-width: 200px; max-width2: " + width + "px; max-height:" + height + "px;'>" + data + "</div>";
                        //content = data;
                        this.set('content.text', content);
						
                    },
                    error: function (xhr, status, errorThrown) {
                        if (status == "parsererror") {
                            this.set('content.text', xhr.responseText);
                        }
                        else if (status == "error") {
                            this.set('content.text', errorThrown);
                        }
                    },
                    complete: function (data) {
                        $element.css('cursor', "default");
                        this.set('content.title.text', "");
                    }
                }
            },
            position: pos,
			events: {
                visible: function (ev, api) {
					//В случае, если текущий тултип вызываеется из тултипа
					if($element.parents('.qtip').length != 0)
					{
						//Находим и записываем все родительски тултипы родительского тултипа
						var qtipParents = [];
						if($element.parents('.qtip').data('parentQtips') != undefined)
						{
							qtipParents = $element.parents('.qtip').data('parentQtips');
						}
						else
						{
							qtipParents.push("#"+$element.parents('.qtip')[0].id);
						}
                        //Добавляем к коллекции тултипов тултип из которого был вызван текущий тултип
						qtipParents.push("#"+api.elements.tooltip[0].id);
						//Записываем полученную коллекцию в переменную текущего тултипа
						$("#"+api.elements.tooltip[0].id).data('parentQtips',qtipParents);
						//Прячем все тултипы кроме текущего и родительских
						$(".qtip").not(qtipParents.join(',')).qtip('hide');	
					}
					else
					{
						//Прячем все тултипы кроме текущего
						$(".qtip").not("#"+api.elements.tooltip[0].id).qtip('hide');			
					} 
                },
				show : function(event, api){
					if(!$element.data('hovering'))
					{
						$element.data('qtipBeginShow', false);
						event.originalEvent = null;
						return false;
					}
					else
					{
						//Т.к. delay на событии show тултипа отрабатывает в IE8 с ошибками, устанавливаем собственный таймер
						//При первом срабатывании события show устанавливаем флаг qtipBeginShow true, отменяем все последующие события и устанавливаем таймер на вызов показа тултипа через 1 секунду
						if(!$element.data('qtipBeginShow'))
						{
							event.originalEvent = null
							$element.data('qtipBeginShow', true);
							timer = setTimeout(function() {tryShowToolTip($element)},1000);
							return false;
						}
						//Если фалаг qtipBeginShow = true, срабатывание события произошло уже после задержки. Устанавливаем флаг qtipBeginShow = false и продолжаем отрисовывать тултип
						else
						{
							$element.data('qtipBeginShow', false);
						}
					}
				},
				hidden: function (event, api) {
					api.destroy(true);
					var t = setTimeout(function() {
					    if ($element[0].classList.contains("v4_callerControl"))
						{
							$element.initToolTip(v4_tooltipCaller, $(document.body));
						}

					},10);

				}
            },
			prerender: true,
            show: { event: 'mouseenter', solo: false},
            hide: { event: 'mouseleave click', delay: 500, fixed: true },
            style: { classes: 'ui-widget-content', widget: false },
            overwrite: true
        };
        $element.qtip(options);
		
    }
	
	
	
} (jQuery));


//В случае, если на эллемент наведен курсор мыши, вызываем тултип
function tryShowToolTip(elementTip) { 
	if(elementTip.data('hovering'))
	{
		elementTip.qtip('show');
	}
} 

//Установка переменной эллемента, указывающего, что курсор мыши наведен на эллемент, в false, отменяем отсчет секунды до вызова тултипа, устанваливаем переменную эллемента qtipBeginShow = false
function setToolTipHoverOff(elementTip, timeout) { 
	 elementTip.data('hovering', false);
	 clearTimeout(timeout);
	 elementTip.data('qtipBeginShow', false);
} 

function ShowFotoToolTip(setCheck, userPhoto, id, path) {
    if (setCheck)
        gi('cbShowFoto_' + id).checked = !gi('cbShowFoto_' + id).checked;
    if (gi('cbShowFoto_' + id).checked) {
        gi('dFoto_' + id).innerHTML = "<img width=\"120px\" onclick=\"ShowFotoToolTip(true, '', " + id + ");\" src=\"" + userPhoto + "?id=" + id + "&w=120\" \>";
        SetCookieTc(path, true);
    } else {
        gi('dFoto_' + id).innerHTML = "";
        SetCookieTc(path, false);
    }
}

function SetCookieTc(path, id) {
    var url = path + "?savePhoto=1&photo=" + id;
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: url,
        crossDomain: true,
        xhrFields: { withCredentials: true }
    });
}

