/*Функция, вызывающая окно телефонного звонка */
function DoMakeCall(number, inter, phone, CallerAddress)
{
	/*Проверяем подключенный скрипт Kesco.Confirm, по функции, реализующей окно звонка*/
	if(typeof(CustomConfirmPhone) != "function")
		return;
	
	/*В случае, если объект окна звонка еще не создан, то создаем его*/
	if(typeof(this.ConfirmPhone) != "object" )
	{
		this.ConfirmPhone = new CustomConfirmPhone();
	}
	
	/*Отрисовываем окно звонка */
	this.ConfirmPhone.render(number, inter, phone, CallerAddress); 
}
