/*Скрипт описывающий клиентское поведение контрола Меню */

var v4_menuInstance = function () {
    var t = 15, z = 9999, s = 6, a;
    var curTimeOutElement = null;
    function dd(n) { this.n = n; this.h = []; this.c = [] }
    dd.prototype.init = function (p, c) {
        a = c; var w = document.getElementById(p), s = w.getElementsByTagName('ul'), l = s.length, i = 0;
        for (i; i < l; i++) {
            var h = s[i].parentNode; this.h[i] = h; this.c[i] = s[i];
            h.onmouseover = new Function(this.n + '.st(' + i + ',true)');           
            h.onmouseout = new Function(this.n + '.st(' + i + ')');
        }
    }

    dd.prototype.st = function (x, f) {
        var c = this.c[x], h = this.h[x], p = h.getElementsByTagName('a')[0];

        clearTimeout(c.t);
        if (curTimeOutElement != null && h.className == 'parentmenu') { clearTimeout(curTimeOutElement); sl(curTimeOutElement, -1); }
        c.style.overflow = 'hidden';

        if (f) {
            p.className += ' ' + a;
            if (!c.mh) {
                c.style.display = 'block'; c.style.height = ''; c.mh = c.offsetHeight; c.style.height = 0;

                if (c.parentElement.className == 'childmenu')
                    c.style.left = c.parentElement.offsetWidth - 1 + 'px';
            }

            if (c.mh == c.offsetHeight) {
                c.style.overflow = 'visible';
            }
            else {
                c.style.zIndex = z;
                z++;
                c.t = sl(c, 1);
            }
        }
        else {
            p.className = p.className.replace(a, '');
            curTimeOutElement = c;
            c.t = setTimeout(function () { sl(c, -1); }, 500);
        }
    }

    function sl(c, f) {
        c.style.opacity = (f == 1) ? 1 : 0;
        c.style.filter = (f == 1) ? '' : 'alpha(opacity=0)';
        c.style.height = ((f == 1) ? c.mh : 0) + 'px';
        if (f == 1) c.style.overflow = 'visible';
        curTimeOutElement = null;
    }
    return { dd: dd }
}();

var v4_menu = new v4_menuInstance.dd('v4_menu');


var maxWidth = 0;
$(document).ready(function () {
    $('.parentmenu').each(function (i, elem) {
        maxWidth = 0;
        $(this).find('.iImg').each(function (j, sp) {
            var imgWidth = $(this).get(0).naturalWidth;

            if (imgWidth > maxWidth) {
                maxWidth = imgWidth;
            }
        });

        $(this).find('.sImg').each(function (j, sp) {
            $(this).css('width', maxWidth);
        });

    });

    //закрытие меню
    //$('*').on('click', this, function () {
    //    $('.parentmenu').each(function (i, elem) {
    //        $(this).find('UL').each(function (j, sp) {
    //            $(this).css('opacity', '0');
    //            $(this).filter('alpha').css('opacity', '0');
    //            $(this).css('height', '0');
    //            $(this).css('overflow', 'hidden');
    //        });
    //    });
    //});

});

