/*Скрипт описывающий клиентское поведение контрола Меню */

//Функция вызывается после отрисовки меню и активирует серверные методы меню
function activateMenuScriptPart()
{
	/* Функция названчани на MouseEnter эллемента открытого списка открытие вложенного списка*/
    $('.v4menuTRopener').on('mouseenter', 
		function() {
			if($(this).children('td').length == 2 && $(this).children('td')[1].style.display == 'none'){ 
				$('#'+$(this).children('td')[1].id)[0].style.display = 'block';
			};
	});

	/* Функция названчани на MouseLeave эллемента открытого списка закрытие вложенного списка*/
$('.v4menuTRopener').on('mouseleave', 
		function() {if($(this).children('td').length == 2) {
			$('#'+$(this).children('td')[1].id)[0].style.display = 'none';
		};
	});
	  
	/* Функция названчани на MouseEnter эллемента кнопки меню 1-его ряда открытие вложенного списка*/
$('.v4firstMenuButtonDiv').on('mouseenter', 
		function() {if($(this).children('table').length == 1 && $(this).children('table')[0].style.display == 'none'){ 
			$(this).children('table')[0].style.display = 'block';
		};
	});

	/* Функция названчани на MouseEnter эллемента кнопки меню 1-его ряда закрытие вложенного списка*/
$('.v4firstMenuButtonDiv').on('mouseleave', function () {
		if($(this).children('table').length == 1) {
			$(this).children('table')[0].style.display = 'none';
		};
	});
	
	/*Ункция назначает переопределяет нажатие кнопок Enter(13), ArrowDown(40), Space(32), KeyUp(38) для кнопок первой линии с дочерними списками */
	$('.v4MenuButtonFirstLineOpener').keydown(function(e) {
		//ArrowDown
		if(e.which == 40) {
			if($(this).siblings("table").length == 1 && $(this).siblings("table")[0].style.display == 'none'){
				$(this).siblings("table")[0].style.display = 'block';
			}
			else if($(this).siblings("table").length == 1)
			{
				$(this).siblings("table").find('button')[0].focus();
			}
			
		}
		
		//ArrowUp
		if(e.which == 38) {
			if($(this).siblings("table").length == 1 && $(this).siblings("table")[0].style.display == 'block'){
				$(this).siblings("table")[0].style.display = 'none';
			}

		}
		
		//Enter, Space
		if(e.which == 13 || e.which == 32) {
			if($(this).siblings("table").length == 1 && $(this).siblings("table")[0].style.display == 'none'){
				$(this).siblings("table")[0].style.display = 'block';
			}
			else if($(this).siblings("table").length == 1 && $(this).siblings("table")[0].style.display == 'block'){
				$(this).siblings("table")[0].style.display = 'none';
			}
		}
		
		//ErrowRight
		if(e.which == 39)
		{
			if($(this).parent().next().length == 1 && $(this).parent().next().next().length == 1)
			{
				$(this).parent().next().next().children('button').focus();
				if($(this).siblings("table").length == 1 && $(this).siblings("table")[0].style.display == 'block'){
					$(this).siblings("table")[0].style.display = 'none';
				}
			}
		}
		
		//ErrowLeft
		if(e.which == 37)
		{
			if($(this).parent().prev().length == 1 && $(this).parent().prev().prev().length == 1)
			{
				$(this).parent().prev().prev().children('button').focus();
				if($(this).siblings("table").length == 1 && $(this).siblings("table")[0].style.display == 'block'){
					$(this).siblings("table")[0].style.display = 'none';
				}
			}
		}

	});

	$('.v4menuButtonLineOpener').keydown(function(e) {
		//ArrowDown
		if(e.which == 40) {
		    if ($(this).closest('.v4menuTRopener').next('.v4menuTRopener').length == 1)
			{
			    $(this).closest('.v4menuTRopener').next('.v4menuTRopener').find('button')[0].focus();
			}
			else
			{
			    $(this).closest('.v4firstMenuButtonDiv').children('button')[0].focus();
			}
			
		}
		
		//ArrowUp
		if(e.which == 38) {
		    if ($(this).closest('.v4menuTRopener').prev('.v4menuTRopener').length == 1)
			{
			    $(this).closest('.v4menuTRopener').prev('.v4menuTRopener').find('button')[0].focus();
			}
			else
			{
			    $(this).closest('.v4firstMenuButtonDiv').children('button')[0].focus();
			}
			
		}
		
		//ErrowLeft
		if(e.which == 37)
		{
		    if ($(this).closest('.v4firstMenuButtonDiv').prev().prev().length == 1)
			{
			    $(this).closest('.v4firstMenuButtonDiv').prev().prev().children('button')[0].focus();
			    $(this).closest('.v4menuTable')[0].style.display = 'none';
			}
		}
		
		//ErrowRight
		if(e.which == 39)
		{
		    if ($(this).closest('.v4firstMenuButtonDiv').next().next().length == 1)
			{
			    $(this).closest('.v4firstMenuButtonDiv').next().next().children('button')[0].focus();
			    $(this).closest('.v4menuTable')[0].style.display = 'none';
			}
		}
	});
	
	
	$('.v4menuButton').on('click', function() {
		$(this).focus();
	});

}


          