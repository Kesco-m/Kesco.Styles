(function($) {
    //создаем плагин
    $.fn.sticker = function(options) {
        //устанавливаем параметры
        var settings = $.extend({
            speed: 300
            , stickingZone: 30
        }, options||{});
        //получаем текущий элемент
        var element = $(this);
        //делаем его перемещаемым (тут используется jQuery UI)
        //element.draggable({ containment: 'parent' });
        element.draggable({ containment: 'document' });
        //создаем обработчик события dragstop, которое возникает после того,
        //как пользователь отпустит элемент
        element.bind('dragstop', function(event, ui) {
            //определяем расстояния до краев страницы
            var rightDistance = $(window).width() - ui.position.left - element.width();
            var leftDistance = ui.position.left;
            //проверяем положение элемента и если нужно перемещаем его к
            //ближайшему краю страницы
            if (leftDistance < settings.stickingZone) {
                element.animate({left : "0"}, settings.speed);
            }
            if (rightDistance < settings.stickingZone) {
                var leftCorner = $(window).width() - element.width();
                element.animate({left : leftCorner + "px"}, settings.speed);
            }
        });
        //возвращаем текущий элемент (нужно для работы цепочечных вызовов)
        return element;
    }
})(jQuery);