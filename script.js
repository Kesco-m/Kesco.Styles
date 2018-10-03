var settingsServer="dione"
var kescoDomain = "";
var kescoParams_wsdl = "";
var paramWsdl = "";

var xmlhttpProgID = "Msxml2.XMLHTTP.3.0"
var DOMDocument_ProgID = "Msxml2.DOMDocument.3.0"

var isInDocView=false;

var kescoErrors = new Array(200);

if (!window.Silverlight) window.Silverlight = {}; Silverlight._silverlightCount = 0; Silverlight.__onSilverlightInstalledCalled = false; Silverlight.fwlinkRoot = "http://go2.microsoft.com/fwlink/?LinkID="; Silverlight.__installationEventFired = false; Silverlight.onGetSilverlight = null; Silverlight.onSilverlightInstalled = function () { window.location.reload(false) }; Silverlight.isInstalled = function (version) { if (version == undefined) version = null; var isVersionSupported = false; try { var tryOlderIE = false; try { var plugin = navigator.plugins["Silverlight Plug-In"]; if (plugin) if (version === null) isVersionSupported = true; else { var actualVer = plugin.description; if (actualVer === "1.0.30226.2") actualVer = "2.0.30226.2"; var actualVerArray = actualVer.split("."); while (actualVerArray.length > 3) actualVerArray.pop(); while (actualVerArray.length < 4) actualVerArray.push(0); var reqVerArray = version.split("."); while (reqVerArray.length > 4) reqVerArray.pop(); var requiredVersionPart, actualVersionPart, index = 0; do { requiredVersionPart = parseInt(reqVerArray[index]); actualVersionPart = parseInt(actualVerArray[index]); index++ } while (index < reqVerArray.length && requiredVersionPart === actualVersionPart); if (requiredVersionPart <= actualVersionPart && !isNaN(requiredVersionPart)) isVersionSupported = true } else tryOlderIE = true } catch (e) { tryOlderIE = true } if (tryOlderIE) { var control = new ActiveXObject("AgControl.AgControl"); if (version === null) isVersionSupported = true; else if (control.IsVersionSupported(version)) isVersionSupported = true; control = null } } catch (e) { isVersionSupported = false } return isVersionSupported }; Silverlight.WaitForInstallCompletion = function () { if (!Silverlight.isBrowserRestartRequired && Silverlight.onSilverlightInstalled) { try { navigator.plugins.refresh() } catch (e) { } if (Silverlight.isInstalled(null) && !Silverlight.__onSilverlightInstalledCalled) { Silverlight.onSilverlightInstalled(); Silverlight.__onSilverlightInstalledCalled = true } else setTimeout(Silverlight.WaitForInstallCompletion, 3000) } }; Silverlight.__startup = function () { navigator.plugins.refresh(); Silverlight.isBrowserRestartRequired = Silverlight.isInstalled(null); if (!Silverlight.isBrowserRestartRequired) { Silverlight.WaitForInstallCompletion(); if (!Silverlight.__installationEventFired) { Silverlight.onInstallRequired(); Silverlight.__installationEventFired = true } } else if (window.navigator.mimeTypes) { var mimeSL2 = navigator.mimeTypes["application/x-silverlight-2"], mimeSL2b2 = navigator.mimeTypes["application/x-silverlight-2-b2"], mimeSL2b1 = navigator.mimeTypes["application/x-silverlight-2-b1"], mimeHighestBeta = mimeSL2b1; if (mimeSL2b2) mimeHighestBeta = mimeSL2b2; if (!mimeSL2 && (mimeSL2b1 || mimeSL2b2)) { if (!Silverlight.__installationEventFired) { Silverlight.onUpgradeRequired(); Silverlight.__installationEventFired = true } } else if (mimeSL2 && mimeHighestBeta) if (mimeSL2.enabledPlugin && mimeHighestBeta.enabledPlugin) if (mimeSL2.enabledPlugin.description != mimeHighestBeta.enabledPlugin.description) if (!Silverlight.__installationEventFired) { Silverlight.onRestartRequired(); Silverlight.__installationEventFired = true } } if (!Silverlight.disableAutoStartup) if (window.removeEventListener) window.removeEventListener("load", Silverlight.__startup, false); else window.detachEvent("onload", Silverlight.__startup) }; if (!Silverlight.disableAutoStartup) if (window.addEventListener) window.addEventListener("load", Silverlight.__startup, false); else window.attachEvent("onload", Silverlight.__startup); Silverlight.createObject = function (source, parentElement, id, properties, events, initParams, userContext) { var slPluginHelper = {}, slProperties = properties, slEvents = events; slPluginHelper.version = slProperties.version; slProperties.source = source; slPluginHelper.alt = slProperties.alt; if (initParams) slProperties.initParams = initParams; if (slProperties.isWindowless && !slProperties.windowless) slProperties.windowless = slProperties.isWindowless; if (slProperties.framerate && !slProperties.maxFramerate) slProperties.maxFramerate = slProperties.framerate; if (id && !slProperties.id) slProperties.id = id; delete slProperties.ignoreBrowserVer; delete slProperties.inplaceInstallPrompt; delete slProperties.version; delete slProperties.isWindowless; delete slProperties.framerate; delete slProperties.data; delete slProperties.src; delete slProperties.alt; if (Silverlight.isInstalled(slPluginHelper.version)) { for (var name in slEvents) if (slEvents[name]) { if (name == "onLoad" && typeof slEvents[name] == "function" && slEvents[name].length != 1) { var onLoadHandler = slEvents[name]; slEvents[name] = function (sender) { return onLoadHandler(document.getElementById(id), userContext, sender) } } var handlerName = Silverlight.__getHandlerName(slEvents[name]); if (handlerName != null) { slProperties[name] = handlerName; slEvents[name] = null } else throw "typeof events." + name + " must be 'function' or 'string'" } slPluginHTML = Silverlight.buildHTML(slProperties) } else slPluginHTML = Silverlight.buildPromptHTML(slPluginHelper); if (parentElement) parentElement.innerHTML = slPluginHTML; else return slPluginHTML }; Silverlight.buildHTML = function (slProperties) { var htmlBuilder = []; htmlBuilder.push('<object type="application/x-silverlight" data="data:application/x-silverlight,"'); if (slProperties.id != null) htmlBuilder.push(' id="' + Silverlight.HtmlAttributeEncode(slProperties.id) + '"'); if (slProperties.width != null) htmlBuilder.push(' width="' + slProperties.width + '"'); if (slProperties.height != null) htmlBuilder.push(' height="' + slProperties.height + '"'); htmlBuilder.push(" >"); delete slProperties.id; delete slProperties.width; delete slProperties.height; for (var name in slProperties) if (slProperties[name]) htmlBuilder.push('<param name="' + Silverlight.HtmlAttributeEncode(name) + '" value="' + Silverlight.HtmlAttributeEncode(slProperties[name]) + '" />'); htmlBuilder.push("</object>"); return htmlBuilder.join("") }; Silverlight.createObjectEx = function (params) { var parameters = params, html = Silverlight.createObject(parameters.source, parameters.parentElement, parameters.id, parameters.properties, parameters.events, parameters.initParams, parameters.context); if (parameters.parentElement == null) return html }; Silverlight.buildPromptHTML = function (slPluginHelper) { var slPluginHTML = "", urlRoot = Silverlight.fwlinkRoot, version = slPluginHelper.version; if (slPluginHelper.alt) slPluginHTML = slPluginHelper.alt; else { if (!version) version = ""; slPluginHTML = "<a href='javascript:Silverlight.getSilverlight(\"{1}\");' style='text-decoration: none;'><img src='{2}' alt='Get Microsoft Silverlight' style='border-style: none'/></a>"; slPluginHTML = slPluginHTML.replace("{1}", version); slPluginHTML = slPluginHTML.replace("{2}", urlRoot + "161376") } return slPluginHTML }; Silverlight.getSilverlight = function (version) { if (Silverlight.onGetSilverlight) Silverlight.onGetSilverlight(); var shortVer = "", reqVerArray = String(version).split("."); if (reqVerArray.length > 1) { var majorNum = parseInt(reqVerArray[0]); if (isNaN(majorNum) || majorNum < 2) shortVer = "1.0"; else shortVer = reqVerArray[0] + "." + reqVerArray[1] } var verArg = ""; if (shortVer.match(/^\d+\056\d+$/)) verArg = "&v=" + shortVer; Silverlight.followFWLink("149156" + verArg) }; Silverlight.followFWLink = function (linkid) { top.location = Silverlight.fwlinkRoot + String(linkid) }; Silverlight.HtmlAttributeEncode = function (strInput) { var c, retVal = ""; if (strInput == null) return null; for (var cnt = 0; cnt < strInput.length; cnt++) { c = strInput.charCodeAt(cnt); if (c > 96 && c < 123 || c > 64 && c < 91 || c > 43 && c < 58 && c != 47 || c == 95) retVal = retVal + String.fromCharCode(c); else retVal = retVal + "&#" + c + ";" } return retVal }; Silverlight.default_error_handler = function (sender, args) { var iErrorCode, errorType = args.ErrorType; iErrorCode = args.ErrorCode; var errMsg = "\nSilverlight error message     \n"; errMsg += "ErrorCode: " + iErrorCode + "\n"; errMsg += "ErrorType: " + errorType + "       \n"; errMsg += "Message: " + args.ErrorMessage + "     \n"; if (errorType == "ParserError") { errMsg += "XamlFile: " + args.xamlFile + "     \n"; errMsg += "Line: " + args.lineNumber + "     \n"; errMsg += "Position: " + args.charPosition + "     \n" } else if (errorType == "RuntimeError") { if (args.lineNumber != 0) { errMsg += "Line: " + args.lineNumber + "     \n"; errMsg += "Position: " + args.charPosition + "     \n" } errMsg += "MethodName: " + args.methodName + "     \n" } alert(errMsg) }; Silverlight.__cleanup = function () { for (var i = Silverlight._silverlightCount - 1; i >= 0; i--) window["__slEvent" + i] = null; Silverlight._silverlightCount = 0; if (window.removeEventListener) window.removeEventListener("unload", Silverlight.__cleanup, false); else window.detachEvent("onunload", Silverlight.__cleanup) }; Silverlight.__getHandlerName = function (handler) { var handlerName = ""; if (typeof handler == "string") handlerName = handler; else if (typeof handler == "function") { if (Silverlight._silverlightCount == 0) if (window.addEventListener) window.addEventListener("unload", Silverlight.__cleanup, false); else window.attachEvent("onunload", Silverlight.__cleanup); var count = Silverlight._silverlightCount++; handlerName = "__slEvent" + count; window[handlerName] = handler } else handlerName = null; return handlerName }; Silverlight.onRequiredVersionAvailable = function () { }; Silverlight.onRestartRequired = function () { }; Silverlight.onUpgradeRequired = function () { }; Silverlight.onInstallRequired = function () { }; Silverlight.IsVersionAvailableOnError = function (sender, args) { var retVal = false; try { if (args.ErrorCode == 8001 && !Silverlight.__installationEventFired) { Silverlight.onUpgradeRequired(); Silverlight.__installationEventFired = true } else if (args.ErrorCode == 8002 && !Silverlight.__installationEventFired) { Silverlight.onRestartRequired(); Silverlight.__installationEventFired = true } else if (args.ErrorCode == 5014 || args.ErrorCode == 2106) { if (Silverlight.__verifySilverlight2UpgradeSuccess(args.getHost())) retVal = true } else retVal = true } catch (e) { } return retVal }; Silverlight.IsVersionAvailableOnLoad = function (sender) { var retVal = false; try { if (Silverlight.__verifySilverlight2UpgradeSuccess(sender.getHost())) retVal = true } catch (e) { } return retVal }; Silverlight.__verifySilverlight2UpgradeSuccess = function (host) { var retVal = false, version = "5.1.20125", installationEvent = null; try { if (host.IsVersionSupported(version + ".99")) { installationEvent = Silverlight.onRequiredVersionAvailable; retVal = true } else if (host.IsVersionSupported(version + ".0")) installationEvent = Silverlight.onRestartRequired; else installationEvent = Silverlight.onUpgradeRequired; if (installationEvent && !Silverlight.__installationEventFired) { installationEvent(); Silverlight.__installationEventFired = true; } } catch (e) { } return retVal; }

kescoErrors[21]='\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441 \u0441\u0435\u0440\u0432\u0438\u0441\u0443.';
kescoErrors[22]='\u041E\u0448\u0438\u0431\u043A\u0430 \u0432 \u043E\u0442\u0432\u0435\u0442\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u0430.';
kescoErrors[23]='\u041E\u0448\u0438\u0431\u043A\u0430 \u0432 \u0440\u0430\u0431\u043E\u0442\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u0430.';
kescoErrors[24]='\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442 \u0441\u0435\u0440\u0432\u0438\u0441\u0430.';

kescoErrors[101]='\u0414\u0430\u0442\u0430 \u0443\u043A\u0430\u0437\u0430\u043D\u0430 \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0434\u0435\u043D\u044C.';
kescoErrors[102]='\u0414\u0430\u0442\u0430 \u0443\u043A\u0430\u0437\u0430\u043D\u0430 \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043C\u0435\u0441\u044F\u0446.';
kescoErrors[103]='\u0414\u0430\u0442\u0430 \u0443\u043A\u0430\u0437\u0430\u043D\u0430 \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0433\u043E\u0434.';
kescoErrors[104]='\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0432\u043E\u0434\u0430.\n\u041F\u0440\u0435\u0434\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u0432\u0432\u043E\u0434 \u0434\u0430\u0442\u044B, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 DD.MM.YY';

kescoErrors[111]='\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0432\u043E\u0434\u0430.\n\u041F\u0440\u0435\u0434\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u0432\u0432\u043E\u0434 \u0446\u0435\u043B\u043E\u0433\u043E \u0447\u0438\u0441\u043B\u0430';

kescoErrors[121]='\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0432\u043E\u0434\u0430.\n\u041F\u0440\u0435\u0434\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u0432\u0432\u043E\u0434 \u0432\u0435\u0449\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u0447\u0438\u0441\u043B\u0430';

kescoErrors[131]='\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0432\u043E\u0434\u0430.\n\u041F\u043E\u0434\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C\u043E\u0433\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u043D\u0435\u0442 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435.';

kescoErrors[141]='\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0432\u043E\u0434\u0430.\n\u041F\u0440\u0435\u0434\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u0432\u0432\u043E\u0434 bool';

kescoErrors[151]='\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0432\u043E\u0434\u0430.\n\u041F\u0440\u0435\u0434\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u0432\u0432\u043E\u0434 \u043A\u043E\u0434\u0430 \u043E\u0431\u044A\u0435\u043A\u0442\u0430 (int)';




var kesco;	

var root = docProcGetRoot();

window.attachEvent("onerror",kescoWindow_onerror);

window.attachEvent("onload",docProc);
window.attachEvent("onbeforeprint",IPrintView_onbeforeprint);
window.attachEvent("onafterprint",IPrintView_onafterprint);

window.attachEvent("onunload",kescoWindow_onbeforeunload);
document.attachEvent("onkeydown",kescoWindow_onkeydown);


_timeBegin_ = new Date();


function logMessage(message)
{
	var z=new Date();
	
	var _ss = printDate(difference(_timeBegin_,z))+' '+message+'\n';
	
	return _ss;
}
var startupLog='';
docProcAddStyle("styles.css");

function kescoParseUrl(href) {

    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);

    return match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
}

function setKescoDomain() {
    kescoDomain = "kescom.com";
    var href = window.location.href;
    var x = kescoParseUrl(href);
    var hostName = x.hostname;
    if (hostName.match("[^0-9.]")) {
        var arr = hostName.split(".");
        if (arr.length > 1) {
            kescoDomain = "";
            for (var i = arr.length - 1; i >= 0; i--) {
                if (i < arr.length - 2) break;
                kescoDomain = arr[i] + ((kescoDomain.length > 0) ? "." : "") + kescoDomain;
            }
        }
    }
}

function docProc() {

    setKescoDomain();
    kescoParams_wsdl = (RegExp('^https', 'ig').test(document.location.href) ? 'https' : 'http') + '://' + settingsServer + '.' + kescoDomain + '/settings/srv.asmx';
    paramWsdl = kescoParams_wsdl;

	startupLog=logMessage('\u043D\u0430\u0447\u0430\u043B\u043E \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438');
	try {
       
		var arr=document.getElementsByTagName('UTCZONE');
		startupLog+=logMessage('\u043D\u0430\u0439\u0434\u0435\u043D\u043E UTCZONE - '+arr.length);
		for(var i=0;i<arr.length;i++)
			arr[i].innerHTML=kescoTime_utc2loc(arr[i].innerHTML);
		startupLog+=logMessage('\u043F\u0440\u0438\u043C\u0435\u043D\u0438\u043B\u0438 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435 utc');
	}
	catch(e){window.status='\u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F utc: '+e.description}
	
	
	var i;
	var tagIndex;
	var kescoControls = new Array();
	var kescoElements;
	var kescoTags = new Array("INPUT","IMG","TABLE");
	
		
	for(tagIndex=0;tagIndex<kescoTags.length;tagIndex++)
	{
		kescoElements=document.getElementsByTagName(kescoTags[tagIndex]);
		for(i=0;i<kescoElements.length;i++)
		{
			if (kescoElements[i].kescoType!=null && kescoElements[i].kescoType!='autoButtons'&& kescoElements[i].kescoType!='personal') kescoControls.push(kescoElements[i]);
			switch (kescoElements[i].tagName)
			{
				case 'IMG': 
					if (kescoElements[i].src0!=null)kescoElements[i].src=root+kescoElements[i].src0;
					break;
				default:
					if (kescoElements[i].kescoType=='autoButtons') kescoAutoButtons(kescoElements[i]);
					break;
			}
		}
	}
	startupLog+=logMessage('\u043F\u0440\u043E\u0431\u0435\u0436\u0430\u043B\u0438\u0441\u044C \u043F\u043E \u0442\u044D\u0433\u0430\u043C INPUT,IMG,TABLE');
	
	
	for(i=0;i<kescoControls.length;i++) kescoControl(kescoControls[i]);
	startupLog+=logMessage('\u043F\u043E\u0441\u0442\u0440\u043E\u0438\u043B\u0438 kescoControls');

	if (document.useParameters!=false) kescoParams_load();
	startupLog+=logMessage('\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0438 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B');
	
	if (document.AfterParametersLoaded!=null) document.AfterParametersLoaded();
	startupLog+=logMessage('AfterParametersLoaded');

	for(i=0;i<kescoControls.length;i++)	kescoControl_init(kescoControls[i]);
	startupLog+=logMessage('\u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043B\u0438 kescoControl_init');

	try
	{
		init();
		startupLog+=logMessage('\u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043B\u0438 init \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435');
	}
	catch(e)
	{
		startupLog+=logMessage('ERROR: '+e.description);
		
	}
	
}


function docProc11()
{
	startupLog=logMessage('\u043D\u0430\u0447\u0430\u043B\u043E \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438');
	try
	{
		var arr=document.getElementsByTagName('UTCZONE');
		startupLog+=logMessage('\u043D\u0430\u0439\u0434\u0435\u043D\u043E UTCZONE - '+arr.length);
		for(var i=0;i<arr.length;i++)
			arr[i].innerHTML=kescoTime_utc2loc(arr[i].innerHTML);
		startupLog+=logMessage('\u043F\u0440\u0438\u043C\u0435\u043D\u0438\u043B\u0438 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435 utc');
	}
	catch(e){window.status='\u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F utc: '+e.description}
	
	
	var i;
	var tagIndex;
	var kescoControls = new Array();
	var kescoElements;
	var kescoTags = new Array("INPUT","IMG","TABLE");
	
		
	for(tagIndex=0;tagIndex<kescoTags.length;tagIndex++)
	{
		kescoElements=document.getElementsByTagName(kescoTags[tagIndex]);
		for(i=0;i<kescoElements.length;i++)
		{
			if (kescoElements[i].kescoType!=null && kescoElements[i].kescoType!='autoButtons'&& kescoElements[i].kescoType!='personal') kescoControls.push(kescoElements[i]);
			switch (kescoElements[i].tagName)
			{
				case 'IMG': 
					if (kescoElements[i].src0!=null)kescoElements[i].src=root+kescoElements[i].src0;
					break;
				default:
					if (kescoElements[i].kescoType=='autoButtons') kescoAutoButtons(kescoElements[i]);
					break;
			}
		}
	}
	startupLog+=logMessage('\u043F\u0440\u043E\u0431\u0435\u0436\u0430\u043B\u0438\u0441\u044C \u043F\u043E \u0442\u044D\u0433\u0430\u043C INPUT,IMG,TABLE');
	
	if (document.useParameters!=false) window.setTimeout(function(){kescoParams_load(document.AfterParametersLoaded)},0);
	startupLog+=logMessage('\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0438 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B');
	
	
	
	
	
	
	
	for(i=0;i<kescoControls.length;i++)	buildControl(kescoControls[i]);
	startupLog+=logMessage('\u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043B\u0438 kescoControl_init');

	try
	{
		init();
		startupLog+=logMessage('\u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043B\u0438 init \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435');
	}
	catch(e)
	{
		startupLog+=logMessage('ERROR: '+e.description);
		
	}
	
}

function buildControl(ctrl)
{
	var a;
	window.setTimeout(function(){
		kescoControl(ctrl);
		while(!kescoParams_Loaded)
			a=1;
		kescoControl_init(ctrl)},1);
}


function docProcGetRoot()
{
	var i;
	var s;
	var checkName = RegExp("script.js","gi");
	for(i=0;i<document.scripts.length;i++)
	{
		s=document.scripts[i].src;
		if (checkName.test(s))
			return s.replace(checkName,"");
	}
	return "";
}

function docProcAddStyle(filename)
{
	if (document.getElementsByTagName("HEAD").length==0) return;
	var link;
	link = document.createElement("LINK");
	link.href=root+filename;
	link.type="text/css";
	link.rel="stylesheet";
	document.getElementsByTagName("HEAD")[0].appendChild(link);
}

function difference(date1,date2)
{
	var ret = new Date(); 
	ret.setTime(Math.abs(date1.getTime() - date2.getTime()));
	return ret;
}


function printDate(date)
{
	return date.getMinutes()+" \u043C\u0438\u043D:"+date.getSeconds()+"\u0441\u0435\u043A:"+date.getMilliseconds()+" \u043C\u0441.";
}


function printDate_alternative(date)
{
	timediff = date.getTime();
	
	weeks = Math.floor(timediff / (604800000));
	timediff -= weeks * (604800000);
	
	days = Math.floor(timediff / (86400000));
	timediff -= days * (86400000);
	
	hours = Math.floor(timediff / (3600000));
	timediff -= hours * (3600000);
	
	mins = Math.floor(timediff / (60000));
	timediff -= mins * (60000);
	
	secs = Math.floor(timediff / 1000);
	timediff -= secs * 1000;
	

	return weeks + " \u043D\u0435\u0434\u0435\u043B\u0438, " + days + " \u0434\u043D\u0438, " + hours + " \u0447\u0430\u0441\u044B, " + mins + " \u043C\u0438\u043D\u0443\u0442\u044B " + secs + " \u0441\u0435\u043A\u0443\u043D\u0434\u044B "+timediff+" \u043C\u0438\u043B\u043B\u0438\u0441\u0435\u043A\u0443\u043D\u0434\u044B";
}

var kescoParams_xml;
var kescoParams_Loaded = false;


function kescoParams_load(obj)
{
  var nds;	
  var p;	
  var i;	
  var pair; 
  var key;  
  var keys; 
  
  
  kescoParams_xml = new ActiveXObject(DOMDocument_ProgID);
  kescoParams_xml.appendChild(kescoParams_xml.createElement('r'));
  
  
  var arr=document.location.search.substring(1).split('&');
  for(i=0;i<arr.length;i++)
  {
	pair = arr[i].split('=');
  	if (pair.length!=2) continue;
	key=(pair[0].charAt(0)=='_')?pair[0].substring(1):pair[0];
	if (key.length==0) continue;
	p=kescoParams_getP(key);
	try
	{
		p.setAttribute('qs',decodeURIComponent(pair[1]));
	}
	catch(e)	
	{
		alert('\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 '+pair[0]+'='+pair[1]+' \u043F\u0435\u0440\u0435\u0434\u0430\u044F\u0435\u0442\u0441\u044F \u0432 \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0439 \u043A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0435:\n'+e.description);
		p.setAttribute('qs','');
	}
	
	if (key==pair[0]) p.setAttribute('fx','1');
  }
  
  
  p = kescoParams_getP('clid');
  if (p.getAttribute('qs')==null) p.setAttribute('qs','0');
  p.setAttribute('fx','1');
  var clid = p.getAttribute('qs');

	if (window.parent==window)
		if (clid!='0'&window.dialogWidth!=null&window.dialogHeight!=null)
		{
			p=kescoParams_getP('width');
			p.setAttribute('def',window.dialogWidth.replace('px',''));
			
			p=kescoParams_getP('height');
			p.setAttribute('def',window.dialogHeight.replace('px',''));
		}
  
  var params = document.getElementsByTagName('parameter');
  for(i=0;i<params.length;i++)
  {
	p=kescoParams_getP(params[i].paramKey);
	p.setAttribute('def',params[i].value);
	}
  
  
  
  

  var keys='';
  nds = kescoParams_xml.selectNodes('r/p[not(@fx)]');
  if (nds.length>0)
  {	
		for(i=0;i<nds.length;i++)
		{
			keys+=(keys.length==0?'':',')+nds[i].getAttribute('k');
			nds[i].setAttribute('la','1');
		}
		var rez = wsdirect(paramWsdl,'GetParameters', new Array('clid',clid,'uid',0,'keys',keys));
		if (!rez.error)
		{
			var doc = new ActiveXObject(DOMDocument_ProgID);
			doc.loadXML(rez.value);
			nds=doc.selectNodes('PARAMETERS/PARAMETER');
			for(i=0;i<nds.length;i++)
			{
				p=kescoParams_getP(nds[i].getAttribute('key'));
				p.setAttribute('db',nds[i].getAttribute('value'));
			}
		}
	}	
	kescoParams_Loaded = true;

	if (obj != null)
		obj();
	startupLog+=logMessage('AfterParametersLoaded');

	
	
	var arr
	if (arr=kescoParams_get('docview')) isInDocView=(new RegExp('^yes$','ig')).test(arr[2]);
	
	if (window.parent==window)
	{
		if (clid!='0'&window.dialogWidth!=null&window.dialogHeight!=null)
		{
			var w=kescoParams_get('width')[2]+'px';
			var h=kescoParams_get('height')[2]+'px';
			if (window.dialogWidth!=w) window.dialogWidth=w;
			if (window.dialogHeight!=h) window.dialogHeight=h;
		}
	
		if (arr=kescoParams_get('title')) document.title=arr[2];
		if(!isInDocView&&window.parent==window) window.focus(); 
	}
	
	
}



function kescoParams_save()
{
	
	if (kescoParams_xml==null) return; 
		
	var values='';
	var clid = kescoParams_get('clid')[2];
	
	if (window.parent==window)
	{
		if (clid!='0'&window.dialogWidth!=null&window.dialogHeight!=null)
		{
			kescoParams_set('width',window.dialogWidth.replace('px',''));
			kescoParams_set('height',window.dialogHeight.replace('px',''));
		}
	}
	
	
	var nds = kescoParams_xml.selectNodes('r/p[(not(@fx) and @new and (not(@db) or not(@new=@db)))]');
	if (nds.length==0) return;
	for(i=0;i<nds.length;i++)
		values+=(values.length==0?'':'|')+nds[i].getAttribute('k')+'='+nds[i].getAttribute('new');


	var obj=wsdirect(paramWsdl,'SaveParameters',
				new Array(
					'clid',clid,
					'uid',0,
					'values',values));
	
	return -1;	
}
function kescoParams_getP(key)
{
	key=key.toLowerCase();
	var p=kescoParams_xml.selectSingleNode('r/p[@k="'+key+'"]');
	if (p==null) 
	{
		p=kescoParams_xml.createElement('p');
		kescoParams_xml.firstChild.appendChild(p);
		p.setAttribute('k',key);
	}
	return p;
}
function kescoParams_get(key,mode)
{
	
	var p = kescoParams_getP(key);
	switch(mode)
	{
		
		case 1: return p.getAttribute('qs')==null?null: new Array(p.getAttribute('fx')=='1',p.getAttribute('fx')!='1',p.getAttribute('qs'));
		
		
	}
	
	var def;
	if (p.getAttribute('new')!=null) return new Array(false,true,p.getAttribute('new'));
	
	if (p.getAttribute('fx')=='1') return new Array(true,false,p.getAttribute('qs'));
	if (p.getAttribute('db')!=null)	return new Array(false,true,p.getAttribute('db')); 
	if (p.getAttribute('qs')!=null) return new Array(false,true,p.getAttribute('qs')); 
	
	
	
	if (!(new RegExp('search|return|clid|docview|title','ig')).test(key) && p.getAttribute('la')!='1' )
	{
		var clid = kescoParams_getP('clid').getAttribute('qs');
		var sRez=wsdirect(paramWsdl,"GetParameter",	new Array("clid",clid,"uid",0,"key",key));
		if (!sRez.error && sRez.value!='')
		{
			p.setAttribute('db',sRez.value);
			return new Array(false,true,sRez.value);
		}
		p.setAttribute('la','1');
	}
		
	def=p.getAttribute('def');
	if (def!=null) return new Array(false,true,def);
		
	return null; 
}
function kescoParams_set(key,value)
{
	value=kescoString_trim(value);
	var p = kescoParams_getP(key);
	p.setAttribute('new',value);
}









function kescoParams_appendUrl(url,key,value,paramsOnly)
{
	var arr;
	url=kescoString_trim(url);
	key=kescoString_trim(key);
	paramsOnly=paramsOnly?true:false;	
	
	var s=(value==null)?'':key+'='+encodeURI(value);
	if (key=='') return url;
	
	var r = new RegExp('(?:\\?|&|^)('+key+'=[^&]{0,})(?:&|$)','ig');
	
	if (arr = r.exec(url)) return url.replace(arr[1],s);
	if (value==null) return url;
	
	var delimiter='';
	if (url.length>0)
		if (paramsOnly || url.indexOf('?')>0) delimiter = '&';
		else delimiter = '?';
		
	return url+delimiter+s;
}
function kescoParams_appendUrlAll(url)
{
	var key;
	var arr;
	var nds = kescoParams_xml.selectNodes('r/p');
	if (nds.length==0) return;
	for(i=0;i<nds.length;i++)
	{	
		key=nds[i].getAttribute('k');
		if (arr=kescoParams_get(key))
			url=kescoParams_appendUrl(url,key,arr[2]);
	}
	return url;
}













function ReadParameter(uid,key,clid)
{
	try
	{		
		sendMail('use kescoParams_get(key)\ninsteadof ReadParameter(uid,key,clid)');
		return kescoParams_get(key);
	}
	catch(e)
	{
		alert("\u041F\u0440\u0438 \u0447\u0442\u0435\u043D\u0438\u0438 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430 "+key+" \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430:\n" + e.description);
		return -1;    
	}	
}



function SaveParameter(clid,uid,key,value)
{
	sendMail('use kescoParams_set(key,value)\ninsteadof SaveParameter(clid,uid,key,value)');
	kescoParams_set(key,value);
}



function oncloseSave()
{
	
	if (_parametersForSave == "") return;
	
	SaveParameters(null,_parametersForSave);
}

function oncloseFrameSet()
{	 
	_pForSave = "";
	for(i=0;i<document.frames.length;i++)
		if (document.frames[i].document.readyState == 'complete' && document.frames[i].oncloseSave != null)
			if (document.frames[i]._parametersForSave != "")
			{
				if (_pForSave == "")
					_pForSave = document.frames[i]._parametersForSave;
				else
					_pForSave = _pForSave + String.fromCharCode(29) + document.frames[i]._parametersForSave;
			}
			
	
	if (_pForSave == "") return;
	
	
	SaveParameters(null,_pForSave);
}

function SaveParameters(uid,values)
{
	
	var clid = GetQParameter("clid");
	if (clid == null) clid ="0";
	var re = new RegExp(String.fromCharCode(29)+'','g');
	values = values.replace(re,'|');
	
	var obj=wsdirect(paramWsdl,'SaveParameters',
				new Array(
					'clid',clid,
					'uid',0,
					'values',values));
	if (obj.error)
		alert("\u041F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043E\u0432 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430:\n"+obj.errorMsg);
	return -1;
}















var _queryString =''; 
var parameterPattern = "";

var _parametersForSave = "";



var _parameterPattern = "(^|" +String.fromCharCode(29)+ ")(<keyName>=([^" +String.fromCharCode(29)+ "]{0,})(" +String.fromCharCode(29)+ "|$))";
var _queryAReg = new RegExp("[a-z]{1,}=.{1,}(?:" +String.fromCharCode(29)+ "|$)","ig");

var _testKey = new RegExp("^[a-z0-9_]{1,}$","i");
var _errKey = String("Check <name> parameter :");














function SetParameter(obj, key, value)
{
	sendMail('use [?] instead of [SetParameter]');
	
	if (value != null)
	{
		if (_testKey.test(key))
		{
			parameterPattern = _parameterPattern.replace("<keyName>",key);
			_queryPReg = new RegExp(parameterPattern,"i");
			if (_queryPReg.test(obj))
			{			
				obj = obj.replace(_queryPReg, function(a,b,c,d,e)
																	{
																		return b+ key + "="+  value + e;
																	});
			}
			else
			{
					if (obj == null || obj == "")
						obj = key + "=" + value;
					else
						obj = obj + String.fromCharCode(29) + key + "=" + value;
			}
		}
		else
			throw _errKey  + _testKey.source;
	}
	else
		obj = ClearParameter(obj, key);
	
	return obj;
}

function GetParameter(obj, key)
{
	sendMail('use [?] instead of [GetParameter]');
	ret = null;
	if (_testKey.test(key))
	{
		parameterPattern = _parameterPattern.replace("<keyName>",key);
		_queryPReg = new RegExp(parameterPattern,"i");
		if (_queryPReg.test(obj))
			ret = _queryPReg.exec(obj)[3];
	}
	else
		throw new Error(_errKey  + _testKey.source);

	return ret;
	
}

function ClearParameter(obj, key)
{	
	sendMail('use [?] instead of [ClearParameter]');
	if (key == null)
		obj = null;
	else
	{
		if (_testKey.test(key))
		{
			parameterPattern = _parameterPattern.replace("<keyName>",key);
			_queryPReg = new RegExp(parameterPattern,"i");
			if (_queryPReg.test(obj))
			{
				obj = obj.replace(_queryPReg, function(a,b,c,d,e)
																{
																	if (b == String.fromCharCode(29) && e == String.fromCharCode(29))
																		ret = String.fromCharCode(29);
																	else
																		ret = "";
																	return ret;
																}
					);
			
			}
		}
		else
			throw new Error(_errKey  + _testKey.source);
	}
	
	return obj;
}





function CreatePArray(qString)
{
	sendMail('use [?] instead of [CreatePArray]');
	if (qString != null)
	{
		if (_queryArray.length > 0) _queryArray = new Array();
		arr = _queryAReg.exec(qString);
		while (arr != null)
		{
			_queryArray = _queryArray.concat(arr);
			arr = _queryAReg.exec(qString);
		}
	}
}

function GetQueryFromHref()
{
	sendMail('use [?] instead of [GetQueryFromHref]');
	ret = null;
	var _querySReg = new RegExp("\\?(.{1,})","i");
	var rep = new RegExp("&","ig");
	if (_querySReg.test(location.href))
	{
		ret = _querySReg.exec(location.href)[1];
		ret = ret.replace(rep,String.fromCharCode(29));
	}
	return ret;
}



function GetHref(queryString)
{
	sendMail('use [?] instead of [GetHref]');
	if (queryString != null)
		return location.href.split('?')[0] + "?" + queryString;
	else
		return location.href.split('?')[0];
}

function SendParameters(url)
{
	sendMail('use [?] instead of [SendParameters]');
	var rep = new RegExp(String.fromCharCode(29),"ig");
	return url + "?" + _queryString.replace(rep,"&");
}





function GetCurrentHref()
{
	sendMail('use [?] instead of [GetCurrentHref]');
	var rep = new RegExp(String.fromCharCode(29),"ig");
	if (_queryString != null)
		return location.href.split('?')[0] + "?" + _queryString.replace(rep,"&");
	else
		return location.href.split('?')[0];
}


function ClearQParameter(key)
{
	sendMail('use [?] instead of [ClearQParameter]');
	try
	{
		_queryString = ClearParameter(_queryString,key);
	}
	catch(e)
	{
		alert("\u041F\u0440\u0438 \u043E\u0447\u0438\u0441\u0442\u043A\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043E\u0432 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430:\n" + e.description);
	}
	
}


function SetQParameter(key, value)
{
	sendMail('use [?] instead of [SetQParameter]');
	_ret = false;
	try
	{
		_queryString = SetParameter(_queryString, key, value);
		_ret = true;
	}
	catch(e)
	{
		alert("\u041F\u0440\u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430 "+key+" \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430:\n" +  e.description);
	}
	
	return _ret;
}


function GetQParameter(key)
{
	sendMail('use [?] instead of [GetQParameter]');
	ret = null;

	try
	{
		ret = GetParameter(_queryString,key);
	}
	catch(e)
	{
		alert("\u041F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430 "+key+" \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430:\n" + e.description);
	}

	return ret;
}

function SetXORRecordQParameter(key,value)
{
	sendMail('use [kescoString_list] instead of [SetXORRecordQParameter]');
	var _str = new String();
	_str = GetQParameter(key);
	if (_str=="" || _str==null)
	{	
		SetQParameter(key, value);
	}
	else
	{
		var r = new RegExp("(^|" +String.fromCharCode(30)+ ")" + value + "($|" +String.fromCharCode(30)+ ")");
		if (r.test(_str))
		{	
			_str = _str.replace(r,function(a,b,c)
									{	
										if ((b == String.fromCharCode(30)) && (c == String.fromCharCode(30))) 
										{
											ret = String.fromCharCode(30);
										}
										else 
											ret = ''; 
										return ret;
									});
			if (_str == "")
				ClearQParameter(key);
			else
				SetQParameter(key,_str);
		}
		else
			SetQParameter(key, _str+String.fromCharCode(30)+value);
	}
	
}STATE_NORMAL = 1,
STATE_PRINT = 2,
STATE_READONLY = 4,
STATE_DISABLED = 8,
STATE_HIDDEN = 16,

BGCOLOR_NORMAL="window",
BGCOLOR_EDIT="#ffffaa",

DISPLAY_INLINE = "inline",
DISPLAY_NONE = "none"


function kescoControl(obj)
{
	var i;
	if (obj.isCreated==true) return;
	obj.isCreated=true;
	
	
	obj.tuneStateCounter	= 0;
	obj.userMustChooseValue	= false;
	
	obj.paramKey = obj.getAttribute('paramKey');
	obj.cbIsUsed   = (obj.checkbox == null)?false:true;
	obj.runHandlers = true;
	
	var atr;
	atr=obj.getAttribute('allownulls');
	obj.allownulls = !((atr==null)||((''+atr).toLowerCase()=='false'));
	
	
	
	
	
	if(obj.searchParams==null && obj.paramSearch!=null) obj.searchParams=obj.paramSearch;
	
	
	obj.setPrintView		= kescoControl_setPrintView;
	obj.resetPrintView		= kescoControl_resetPrintView;
	obj.isChanged			= kescoControl_isChanged;
	
	obj.setFocus			= kescoControl_setFocus;
	
	
	
	
		
	
	obj.printView	= false;
	obj.disabled	= false;
	obj.disabled0	= false; 
	



		
	obj.value		= kescoControl_formalizeStringAttribute(obj.value);
	obj.valueText	= kescoControl_formalizeStringAttribute(obj.valueText);
	obj.value0		= obj.value;
	
	
	
	

	obj.label=document.createElement("SPAN");
	obj.label.dispaly='none';
	obj.parentNode.insertBefore(obj.label,obj);
	
			
	
	
	switch(obj.kescoType)
	{
		case 'string': 
			kescoControl_appendTable(obj);
			kescoString(obj); 
			break;
		case 'text': 
			kescoControl_appendTable(obj);
			kescoText(obj); 
			break;
		
		case 'int': 
			kescoControl_appendTable(obj);
			kescoInt(obj); 
			break;
		
		case 'float': 
			kescoControl_appendTable(obj);
			kescoFloat(obj); 
			break;
		
		case 'date': 
			kescoControl_appendTable(obj);
			kescoDate(obj); 
			break;
		
		
		case 'month': 
			kescoControl_appendTable(obj);
			kescoMonth(obj); 
			break;
		
		
		case 'list': 
			kescoControl_appendTable(obj);
			kescoList(obj); 
			break;
	
		case 'select': 
			kescoControl_appendTable(obj);
			
			kescoSelect(obj); 
			break;
		
		
		case 'flag': 
			kescoControl_appendTable(obj);
			kescoFlag(obj); 
			break;
		
		case 'mselect': 
			kescoMSelect(obj); 
			break;
		
		case 'time': 
			kescoControl_appendTable(obj);
			kescoTime(obj);
			break;		
		
		case 'label': kescoLabel(obj); break;	
		case 'grid': kescoGrid(obj); break;		
	}

}
function kescoControl_init(obj)
{
	var e;
	var arr;
	
	if(obj.paramKey!=null)
		if((arr=kescoParams_get(obj.paramKey))!=null)
			if(obj.setValue(arr[2],null,false)==0)
			{
				if (obj.cbIsUsed)
				{
					obj.setCheckBox(obj.cbIsUsed,arr[0]&((obj.allownulls)|(obj.value!='')),false);
					obj.setState(arr[1]?obj.state:STATE_DISABLED,false);
				}
				obj.tuneState();
				obj.value0=obj.value;
				return;
			}
	
	obj.setValue(obj.value,obj.valueText==''?null:obj.valueText,false); 
	var r = new RegExp('^on$','ig');
	obj.setCheckBox(obj.cbIsUsed,r.test(obj.checkbox)&(obj.allownulls)|(obj.value!=''),false);
	obj.setState(obj.state,false);
	obj.tuneState();
	obj.value0=obj.value;
	
	if (obj.tbl != null && obj.tbl.tagName == "DIV" && obj.getAttribute('kescoType') == "select")
	{
		alert(obj.tbl.parentElement.tagName + "-->" + obj.tbl.parentElement.clientWidth + "DIV"+obj.id +"-->" + obj.btn.clientWidth)
		if (obj.tbl.parentElement.clientWidth != 0)
			obj.inp.style.width=(obj.tbl.parentElement.clientWidth -obj.btn.clientWidth) + "px";
		
		alert("AFTER:" +obj.tbl.parentElement.tagName + "-->" + obj.tbl.parentElement.clientWidth + "DIV"+obj.id +"-->" + obj.btn.clientWidth + "-->" + obj.inp.style.width);
	}
}

function kescoControl_appendTable(obj)
{

	
	obj.setPrintView		= kescoControl_setPrintView2;
	obj.resetPrintView		= kescoControl_resetPrintView2;
	
	
	
	obj.tbl=document.createElement("TABLE");
	obj.tbl.width = obj.style.width;
	obj.tbl.border=0;
	obj.tbl.style.display='inline';
	
	obj.tbl.style.verticalAlign='bottom';
	
	
	obj.tbl.cellSpacing=0;
	obj.tbl.cellPadding=0;
	obj.parentNode.insertBefore(obj.tbl,obj);
	
	
	
	
	obj.cb = document.createElement("INPUT");
	obj.cb.type="checkbox";
	obj.cb.title=(obj.cbTip!=null?obj.cbTip:"")
	obj.cb.name=obj.cb.id=obj.id+'cb';
	obj.cb.onpropertychange	= kescoControl_cb_onpropertychange;
	obj.cb.hinp=obj;

	
		
	
	obj.row = obj.tbl.insertRow(-1); 
	obj.cbCell=obj.row.insertCell();
	obj.cbCell.width=20;
	obj.cbCell.appendChild(obj.cb);
	
	obj.inpCell=obj.row.insertCell();
	
}

function kescoControl_appendDIV(obj)
{
	
	obj.setPrintView		= kescoControl_setPrintView2;
	obj.resetPrintView		= kescoControl_resetPrintView2;
	
	
	
	obj.tbl=document.createElement("DIV");
	obj.tbl.width = obj.style.width;
	
	
	obj.tbl.style.display='inline';
	obj.tbl.style.whiteSpace='nowrap';
	
	obj.tbl.style.verticalAlign='bottom';
	obj.parentNode.insertBefore(obj.tbl,obj);
	
	
	
	
	obj.cb = document.createElement("INPUT");
	obj.cb.type="checkbox";
	obj.cb.title=(obj.cbTip!=null?obj.cbTip:"")
	obj.cb.name=obj.cb.id=obj.id+'cb';
	obj.cb.onpropertychange	= kescoControl_cb_onpropertychange;
	obj.cb.hinp=obj;

	
		
	
	obj.row = obj.tbl; 
	
	obj.cbCell=obj.tbl; 
	
	obj.cbCell.appendChild(obj.cb);
	
	
	obj.inpCell=obj.tbl;
	
	
	
	
}

function kescoControl_NotifyOnPropertyAssignment(obj,prop)
{
	sendMail('\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435!\n \u041F\u0440\u044F\u043C\u043E\u0435 \u043F\u0440\u0438\u0441\u0432\u043E\u0435\u043D\u0438\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0430 '+prop+' \u043E\u0431\u044A\u0435\u043A\u0442\u0443 '+obj.id+' \u0442\u0438\u043F\u0430 '+obj.kescoType+'\n \u0420\u0410\u0411\u041E\u0422\u0410\u0422\u042C \u041D\u0415 \u0411\u0423\u0414\u0415\u0422!\n\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435');
}

function kescoControl_onpropertychange()
{
	
	var ret;
	if (this.onpropertychange0!=null) ret=this.onpropertychange0();
	
	var f=false;
	switch(event.propertyName)
	{
		case "disabled": 	this.disabled=false; break;
		case "disabled0":	f=true; break;
		case "value":		
			
			
			f=true; 
			if (this.onChangeValue!=null)		
			this.onChangeValue();
			break;
		case "valueText": 	if (this.label!=null)	this.label.innerHTML=this.valueText;
							f=true; if(this.onChangeValueText!=null)	this.onChangeValueText();	break;
		case "readOnly": 	f=true; if(this.onChangeReadOnly!=null)		this.onChangeReadOnly();	break;
		case "printView": 	f=true; if(this.onChangePrintView!=null)	this.onChangePrintView();	break;
		
		case "allownulls": 	f=true; if(this.onChangeAllowNulls!=null)	this.onChangeAllowNulls();	break;
		case "paramValue":	
			if(this.onChangeParamValue!=null)			
				this.onChangeParamValue();	
			break;
		case "list":		
			if(this.onChangeList!=null)					
				this.onChangeList();		
			break;
	}
	
	return ret;
}




function kescoControl_formalizeBoolAttribute(val)
{
	
	var r_true = new RegExp('true','ig');
	var r_false = new RegExp('false','ig');
	
	
	if (val==null) return false;
	if ((val==1)||(val==true)||r_true.test(val))  return true;
	if ((val==0)||(val==false)||r_false.test(val))  return false;
	
	
	return true;
}
function kescoControl_formalizeStringAttribute(val)
{
	if(val==null) return '';
	return ''+val;
}

function kescoControl_setFocus()
{
	if (this.onSetFocus!=null) this.onSetFocus();
}
function kescoControl_isChanged()
{
	return (this.value!=this.value0);
}

function kescoControl_setPrintView()
{
	this.printView=true;
	if (this.tuneState!=null) this.tuneState();
}
function kescoControl_resetPrintView()
{	
	this.printView=false;
	if (this.tuneState!=null) this.tuneState();	
}
function kescoControl_setPrintView2()
{
	this.state0=this.state;
	this.setState(STATE_PRINT);
}
function kescoControl_resetPrintView2()
{	
	this.setState(this.state0);
}




function kescoControl_setState(newState,tuneState)
{
	tuneState=(tuneState==null)?true:tuneState;
	switch((''+newState).toUpperCase())
	{
		case ''+STATE_PRINT   :case 'STATE_PRINT'   :case 'PRINT'   : this.state=STATE_PRINT;break;
		case ''+STATE_READONLY:case 'STATE_READONLY':case 'READONLY': this.state=STATE_READONLY;break;
		case ''+STATE_DISABLED:case 'STATE_DISABLED':case 'DISABLED': this.state=STATE_DISABLED;break;
		case ''+STATE_HIDDEN  :case 'STATE_HIDDEN'  :case 'HIDDEN'  : this.state=STATE_HIDDEN;break;
		default: this.state=STATE_NORMAL;break;
	}
	
	if(tuneState) this.tuneState();
}

function kescoControl_setValue(newValue,newValueText)
{
	newValue=this.normalize(newValue);
	if (newValue==null) return;
	this.value=newValue;
	this.valueText=
	this.inp.value=
	this.label.innerText=((newValueText!=null)?newValueText:this.getValueText());
	
	this.tuneState();
}


function kescoControl_setCheckBox(visible,checked,tuneState)
{
	this.runHandlers=false;
	
	visible=(visible==null)?false:visible;
	checked=(checked==null)?false:checked;
	tuneState=(tuneState==null)?true:tuneState;
	
	this.cbIsUsed = visible;
	
	if (!visible)
	{
		if(tuneState) this.tuneState();
		this.runHandlers=true;
		return;
	}
	
	if(this.cb.checked!=checked) this.cb.checked=checked;
	
	this.userMustChooseValue=(this.cb.checked&&!this.allownulls);
	
	if (this.cb.checked)
	{
		this.tuneState();
		this.inp.value=this.inp.value;
		this.inp.setActive();
	}
	else
	{
		switch(this.inp.tagName)
		{
			case 'TEXTAREA':
			case 'INPUT':this.inp.value=this.valueText; break;
			case 'SELECT':this.inp.value=this.value; break;
		}
		
	}
	
	if(tuneState) this.tuneState();
	this.runHandlers=true;
}
function kescoControl_setEmpty()
{
	sendMail('use [setValue] instead of [setEmpty]');
	return this.setValue('',null,tuneState);
}
function kescoControl_tuneState(obj)
{
	
	obj.tuneStateCounter=obj.tuneStateCounter+1;
	
	var pre = document.getElementById("debug_pre");
	if (pre!=null)
	pre.innerText="\nid:"+obj.id+
	"\nstate:"+obj.state+
	"\nvalue:"+obj.value+
	"\nvalueText:"+obj.valueText+
	"\ninp.value:"+obj.inp.value+
	"\ntuneStateCounter:"+obj.tuneStateCounter+
	"\ncbIsUsed:"+obj.cbIsUsed+
	"\nallownulls:"+obj.allownulls+
	"\nuserMustChooseValue:"+obj.userMustChooseValue;
	
	
	obj.cb.style.display =(	(obj.state&(STATE_NORMAL|STATE_DISABLED|STATE_PRINT|STATE_READONLY))&&
										(obj.cbIsUsed)
									)?DISPLAY_INLINE:DISPLAY_NONE;
	
	if (obj.cbCell.tagName == "TD")
		obj.cbCell.style.display=obj.cb.style.display;
	
	obj.cb.disabled = (obj.state&(STATE_DISABLED|STATE_PRINT|STATE_READONLY));
	
	obj.inp.disabled =	(obj.state==STATE_DISABLED)||
						(obj.state==STATE_NORMAL&&obj.cbIsUsed&&!obj.cb.checked);
	
	obj.inp.style.display = (obj.state&(STATE_NORMAL|STATE_DISABLED))
								?DISPLAY_INLINE:DISPLAY_NONE;
	
	obj.inp.style.backgroundColor = (obj.userMustChooseValue&&obj.value=="")||
									 (obj.inp.value!=obj.valueText)
								?BGCOLOR_EDIT:BGCOLOR_NORMAL;
	
	obj.label.style.display = (obj.state&(STATE_PRINT|STATE_READONLY))?DISPLAY_INLINE:DISPLAY_NONE;
	if (obj.label.style.display==DISPLAY_INLINE) obj.label.innerText=obj.valueText;
}



function kescoControl_cb_onpropertychange()
{
	if(!this.hinp.runHandlers) return;
	switch(event.propertyName)
	{
		case "checked": 
		this.hinp.setCheckBox(true,this.checked); break;
	}
}
function kescoControl_inp_onpropertychange()
{
	if(!this.hinp.runHandlers) return;
	switch(event.propertyName)
	{
		case 'value': this.hinp.tuneState(); break;
	}
}
function kescoControl_inp_onkeydown()
{
	if(!this.hinp.runHandlers) return;
	if (event.keyCode==27)  {this.value=this.hinp.valueText;event.returnValue=false;}
	if(event.keyCode==13) event.keyCode=9;
}
function kescoControl_all_onbeforedeactivate() 
{  
	if(!this.hinp.runHandlers) return;
	var e;
	if (event.toElement!=null&&event.toElement.hinp==this.hinp) return;

	
	var e=this.hinp.setValue(this.hinp.inp.value,null,false);
	if(e!=0)
	{
		alert(kescoErrors[e]);
		event.returnValue=false;
		return;
	}
	
	if(this.hinp.cbIsUsed)
		if(!this.hinp.allownulls)
			if (this.hinp.cb.checked)
				if (this.hinp.value=='')
					this.hinp.setCheckBox(true,false,false);
	
	this.hinp.tuneState();
}
function kescoControl_all_onbeforedeactivate2() 
{  
	if(!this.hinp.runHandlers) return;
	if (event.toElement!=null&&event.toElement.hinp==this.hinp) return;

	
	
	if(this.hinp.cbIsUsed)
		if(!this.hinp.allownulls)
			if (this.hinp.cb.checked)
				if (this.hinp.value=='')
					this.hinp.setCheckBox(true,false,false);
	
	this.hinp.tuneState();
}




function kescoControl_getNext()
{
	var i;
	var obj;
	var ret;
	var f=0;
	
	for(i=0;i<document.all.length;i++)
	{
		obj=document.all[i];
		
		if (obj.setFocus==null) continue;
		if (this==obj){f=1; continue;}
		
		
		if (f==1)
		{ ret=obj;	
		  f=0;}
	}
	
	return ret;
}

function kescoSelect(obj)
{
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	
	obj.setValue = kescoSelect_setValue;
	obj.setFocus = kescoSelect_setFocus;
	obj.tuneState = kescoSelect_tuneState;
	obj.loadCaption = kescoSelect_loadCaption;
	
		
	
	if (obj.urlForm=='')     obj.urlForm=null;
	if (obj.wsdl=='')	     obj.wsdl=null;
	if (obj.url=='')		 obj.url=null;
	if (obj.paramKey=='')	 obj.paramKey=null;
	



	obj.locked					= false;
	obj.lock					= kescoSelect_lock;
	obj.unlock					= kescoSelect_unlock;
	

	

	obj.showInfoWindow			= kescoSelect_showInfoWindow
	obj.isDocViewUsed			= kescoSelect_isDocViewUsed;
	obj.getNext					= kescoControl_getNext;
		
	

	
	
	obj.cb.onbeforedeactivate = kescoSelect_all_onbeforedeactivate;
	
	
	var inp;
	obj.inp = document.createElement("INPUT");
	obj.inp.type="text";
	obj.inp.id=obj.id+'inp';
	obj.inp.hinp=obj;
	obj.inp.size=obj.size;
	obj.inp.maxLength=obj.maxLength;
	
	
	
		obj.inp.style.width='100%';
	
	
	
	obj.inp.onkeydown=kescoSelect_inp_onkeydown;
	obj.inp.onbeforedeactivate = kescoSelect_all_onbeforedeactivate;
	obj.inp.onpropertychange = kescoControl_inp_onpropertychange;
	
	
	
	obj.label = document.createElement("SPAN");
	
	
	
	if (obj.row.tagName == "TR")
		obj.btnCell=obj.row.insertCell();
	else
		
		obj.btnCell=obj.tbl;
	obj.btnCell.width=24;
	
	
	obj.btn = document.createElement("INPUT");
	obj.btn.type="button";
	obj.btn.id=obj.id+'btn';
	obj.btn.value="...";
	obj.btn.hinp=obj;
	obj.btn.style.width="24px";
	obj.btn.onclick=kescoSelect_btn_onclick;
	obj.btn.onbeforedeactivate = kescoSelect_all_onbeforedeactivate;
	obj.btn.onkeydown=kescoSelect_btn_onkeydown;
	
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);
	obj.btnCell.appendChild(obj.btn);

	
	



	obj.popupShow=function(){}
	obj.popupMoveNext=function(){}
	obj.popupMovePrevious=function(){}

	
	
	
	obj.getSearchParams=function()
	{
		return this.searchParams;
	}
	
	obj.getDialogUrl=function()
	{
		
	}
}


function kescoSelect_setValue(value, text, tuneState)
{
	if(popup.isOpen) popup.hide();
	this.runHandlers=false;
	var e;
	var oldValue=this.value;
	var oldValueText=this.valueText;
	
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;
	
	if (value=='') 
	{	
		this.value='';
		this.inp.value=this.valueText='';
	}
	else
	{
		try
		{
			if(isNaN(parseInt(value))) throw new Error(151,kescoErrors[151]);
			this.value=value;
			if (text==null) this.loadCaption();
			else this.inp.value=this.valueText=kescoString_trim(text);
			
		}
		catch(e)
		{
			this.runHandlers=true;
			return e.number;
		}
	}		
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.onchanged!=null) this.onchanged(this); 
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}

	this.runHandlers=true;
	return 0;
}
function kescoSelect_setFocus()
{
	this.inp.focus();
}
function kescoSelect_tuneState()
{
	kescoControl_tuneState(this);	
	
	if (this.inp.value=='\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430...') 
		this.inp.style.backgroundColor =BGCOLOR_NORMAL;
	
	this.btn.mode=(
		(this.value!='')&&
		(this.inp.value==this.valueText)&&
		(this.urlForm!=null)
				  )?1:0;
				 
	
		
	switch(this.btn.mode)
	{
		case 1:  
			
			this.btn.disabled=false;
			this.btn.style.display=this.inp.style.display;
			if (this.state&(STATE_READONLY)) this.btn.style.display=DISPLAY_INLINE;
			this.btn.style.background='url('+root+'detail.gif) buttonface no-repeat center center';
			this.btn.title='\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440';
			this.btn.value='';
			break;
		default: 
			this.btn.disabled=this.inp.disabled;
			this.btn.style.display=this.inp.style.display;		
			this.btn.style.background='buttonface';
			this.btn.title=(this.btnTip!=null?this.btnTip:"");
			this.btn.value='...';
			
			break;
	}
}





function kescoSelect_inp_onkeydown()
{
	var tr;
	if(!this.hinp.runHandlers) return;
	switch(event.keyCode)
	{
		case 9:
		case 13: 
			if (this.hinp.inp.value!=this.hinp.valueText)
			{
				if (popup.isOpen&&popup.document.searchText==this.hinp.inp.value)
				{
					if (popup.document.rowIndex>=0) 
						popup.document.tr_select(popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift]);
					else
						return; 
				}
				else
				try
				{
					var arr = kescoSelect_identifyValue(this.hinp,this.hinp.inp.value,true);
					if (arr==null) return; 
					var r=this.hinp.setValue(arr[0],arr[1],false);
					if(r!=0) throw new Error(r,kescoErrors[r]);
		
				}
				catch(e)
				{
					alert(e.description);
					event.returnValue=false;
					return;
				}
			}
			else
			{
				if(popup.isOpen) popup.hide();
			}
			
			
			if(this.hinp.cbIsUsed)
				if(!this.hinp.allownulls)
					if (this.hinp.cb.checked)
						if (this.hinp.value=='')
							this.hinp.setCheckBox(true,false,false);
			
			this.hinp.tuneState();
			
			try
			{
				this.hinp.getNext().setFocus();
			}
			catch(e)
			{}
			return false;
			
			break;
			
		case 27:  
			this.value = this.hinp.valueText;
			this.hinp.tuneState();
			
			if(this.hinp.cbIsUsed)
				if(!this.hinp.allownulls)
					if (this.hinp.cb.checked)
						if (this.hinp.value=='')
							this.hinp.setCheckBox(true,false,false);
			break;
		
		case 38: 
			if(!popup.isOpen) return;
			
			
			if (popup.document.rowIndex>=0)
			{	
				tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
				tr.style.background='#e4e4e4';
				tr.style.cursor='default';
			}
		
			popup.document.rowIndex--;
				
			if (popup.document.rowIndex<0)popup.document.rowIndex=popup.document.rowCount-1;
			tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
				tr.style.background='gold';
				tr.style.cursor='pointer';
				
			break;
		case 40: 
			if(!popup.isOpen) return;
				if (popup.document.rowIndex>=0)
				{	
					tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
					tr.style.background='#e4e4e4';
					tr.style.cursor='default';
				}
				popup.document.rowIndex++;
			
				if (popup.document.rowIndex>=popup.document.rowCount) popup.document.rowIndex=0;
				
				
				
				tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
				tr.style.background='gold';
				tr.style.cursor='pointer';
			
				
			break;
	}
}
function kescoSelect_btn_onkeydown()
{
	var tr;
	if(!this.hinp.runHandlers) return;
	switch(event.keyCode)
	{
		case 13:  
			if (popup.isOpen)
			{
					if (popup.document.rowIndex>=0) 
					{
						popup.document.tr_select(popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift]);
					}
					else
					{
						return; 
					}
				}
		
		case 38: 
			if(!popup.isOpen) return;
			
			
			if (popup.document.rowIndex>=0)
			{	
				tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
				tr.style.background='#e4e4e4';
				tr.style.cursor='default';
			}
		
			popup.document.rowIndex--;
				
			if (popup.document.rowIndex<0)popup.document.rowIndex=popup.document.rowCount-1;
			tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
				tr.style.background='gold';
				tr.style.cursor='pointer';
				
			break;
		case 40: 
			if(!popup.isOpen) return;
				if (popup.document.rowIndex>=0)
				{	
					tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
					tr.style.background='#e4e4e4';
					tr.style.cursor='default';
				}
				popup.document.rowIndex++;
			
				if (popup.document.rowIndex>=popup.document.rowCount) popup.document.rowIndex=0;
				
				
				
				tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
				tr.style.background='gold';
				tr.style.cursor='pointer';
			
				
			break;
	}

}

function kescoSelect_all_onbeforedeactivate()
{
	
	if(!this.hinp.runHandlers) return;
	if (event.toElement!=null&&event.toElement.hinp==this.hinp) return;
	
	
	if (this.hinp.inp.value!='\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430...') 
		if (this.hinp.inp.value!=this.hinp.valueText)
		try
		{
			var arr = kescoSelect_identifyValue(this.hinp,this.hinp.inp.value,true);
			if (arr==null)	
			{	
				arr= new Array(this.hinp.value,this.hinp.valueText);
				if(popup.isOpen) popup.hide();
			}
			
			
			var r=this.hinp.setValue(arr[0],arr[1],false);
			if(r!=0) throw new Error(r,kescoErrors[r]);
		}
		catch(e)
		{
			alert(e.description);
			event.returnValue=false;
			return;
		}

	if(this.hinp.cbIsUsed)
		if(!this.hinp.allownulls)
			if (this.hinp.cb.checked)
				if (this.hinp.value=='')
					this.hinp.setCheckBox(true,false,false);
	
	this.hinp.tuneState();
}


function kescoSelect_btn_onclick()
{
	if(!this.hinp.runHandlers) return;
	switch(this.mode)
	{
		case 1:  this.hinp.showInfoWindow(); break;
		default:  
			if (this.hinp.quickSearch=='true')
			{
				var arr = kescoSelect_identifyValue(this.hinp,this.hinp.inp.value,true,true)
				if (arr!=null)	this.hinp.setValue(arr[0],arr[1]);
			}
			else
			{
				var arr = kescoSelect_showSearchWindow(this.hinp,this.hinp.inp.value); 
				if (arr!=null) this.hinp.setValue(arr[0],arr[1]);
			}
			break;
	}
}






function kescoSelect_identifyValue(obj,s,showSearchWindow, force)
{
	s=kescoString_trim(s);
	if (force==null) force=false;
	if (!force)
		if(s=='')
		{
			if(popup.isOpen) popup.Hide();
			return new Array(null,null);
		}
	
	var e;
	var wsdl = obj.wsdl;
	var funcCount = obj.funcCount;
	
	showSearchWindow=(showSearchWindow==null)?true:showSearchWindow;
	var searchParams;
	if (obj.BeforeParamSearchApply!=null) 
	{
		sendMail('Do not use [BeforeParamSearchApply] use [getSearchParams]');
		obj.BeforeParamSearchApply();
	}
	if (obj.getSearchParams!=null) searchParams=kescoString_trim(obj.getSearchParams());
	else searchParams=kescoString_trim(obj.searchParams);
	
	
	
	var sRet=wsdirect(wsdl,funcCount,new Array('searchText',s,'searchParams',searchParams));	
	if (!sRet.error)
	{
		
		var count = parseInt(sRet.value);
		if (isNaN(count))
		{
			
			
			var doc = new ActiveXObject(DOMDocument_ProgID);
			doc.loadXML(sRet.value);
			
			
			var cols = doc.selectNodes('SearchResult/Column');
			var rows = doc.selectNodes('SearchResult/Row');
			
			
			popup.document.searchText=s;
			popup.document.rowShift=0;
			popup.document.hinp=obj;
			
			var el;
			
			
			if(doc.documentElement.getAttribute('showAdvancedSearchRow')==null||doc.documentElement.getAttribute('showAdvancedSearchRow')!='true')
				if(rows.length==1)
					return new Array(parseInt(rows[0].getAttribute('ID')),null);
			
			if(rows.length>0) 
			{
				var s = '<div style="width:100%;height:100%;overflow:auto;">';
				s +='<table style="font-size:8pt;font-family:Verdana;width:100%" id="tbl1" cellpadding="0" cellspacing="0">\n';
				
				if(doc.documentElement.getAttribute('caption')!=null)
				{
					popup.document.rowShift++;
					s +='<tr><td colspan="'+cols.length+'"><i>'+doc.documentElement.getAttribute('caption')+'</i></td></tr>\n';
				}
				if(doc.documentElement.getAttribute('showColumnNames')=='true')
				{
					popup.document.rowShift++;
					s+='<tr style="background:#b4b4b4;">';
					for(var j=0;j<cols.length;j++)
						s+='<td>'+cols[j].getAttribute('caption')+'</td>';
					s+='</tr>\n';
				}
				
				
				
				
				for(var i=0;i<rows.length;i++)
				{
					s +='<tr id="row'+i+'">';
					
					for(var j=0;j<cols.length;j++)
						s+='<td'+(cols[j].getAttribute('width')!=null?' width="'+cols[j].getAttribute('width')+'"':'')+
						'>'+rows[i].getAttribute(cols[j].getAttribute('name'))+'</td>';
					s+='</tr>\n';
				}
				
				if(doc.documentElement.getAttribute('showAdvancedSearchRow')!=null&&doc.documentElement.getAttribute('showAdvancedSearchRow')=='true')
				{
					s +='<tr id="trAdvSearch"><td colspan="'+cols.length+'" align="center" ><i>\u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u0438\u0441\u043A</i></td></tr>\n';
				}
			
				
				s += "</table></div>";
				
				var tr;
				popup.document.body.innerHTML=s;
				
				for(var i=0;i<rows.length;i++)
				{
					tr=popup.document.getElementById("row"+i);
					tr.objID = parseInt(rows[i].getAttribute('ID'));
					
					tr.onclick=function(){popup.document.tr_select(this);};
					tr.onmouseenter=function(){popup.document.tr_onmouseenter(this);};
					tr.onmouseleave=function(){popup.document.tr_onmouseleave(this);};
				}
				
				
				popup.document.rowCount=rows.length;
				if(doc.documentElement.getAttribute('showAdvancedSearchRow')!=null&&doc.documentElement.getAttribute('showAdvancedSearchRow')=='true')
				{
					popup.document.rowCount++;
					tr=popup.document.getElementById('trAdvSearch');
					
					tr.onclick=function(){popup.document.tr_select(this);};
					tr.onmouseenter=function(){popup.document.tr_onmouseenter(this);};
					tr.onmouseleave=function(){popup.document.tr_onmouseleave(this);};
				}
				
				
				
				
				
				popup.document.rowIndex=-1;
				
				
				popup.show(0, obj.tbl.offsetHeight, Math.max(obj.tbl.offsetWidth,400), (rows.length+popup.document.rowShift+1)* 14 ,obj.tbl);
				
				return null;
			}
		}
		else
		{
			
			if (count==1) return new Array(sRet.id,null);
		}
	}
	
	
	
	
	if (showSearchWindow) return kescoSelect_showSearchWindow(obj,s,sRet.descr);
	
	
	
	return new Array(obj.value,obj.valueText);
}



var popup=window.createPopup();
popup.document.body.style.backgroundColor = "#e4e4e4";
popup.document.body.style.border = "solid black 1px";

popup.document.tr_select=function(tr)
{
	if(tr.id=='trAdvSearch')
	{
		parent.popup.hide();
		
		var arr = kescoSelect_showSearchWindow(popup.document.hinp,popup.document.hinp.inp.value); 
		popup.document.hinp.setValue(arr[0],arr[1]);
	}
	else
	{
		popup.document.hinp.setValue(parseInt(tr.objID),null);
		try
		{	
			popup.document.hinp.getNext().setFocus();
		}
		catch(e)
		{};
		parent.popup.hide();
	}
	
}

popup.document.tr_onmouseenter=function(tr)
{
	if (popup.document.rowIndex>=0)
	{
		var _tr=popup.document.getElementById('tbl1').rows[popup.document.rowIndex+popup.document.rowShift];
		_tr.style.background='#e4e4e4';
		_tr.style.cursor='arrow';
	}	
	
							
	popup.document.rowIndex=tr.rowIndex-popup.document.rowShift;
							
	tr.style.background='gold';
	tr.style.cursor='pointer';
}

popup.document.tr_onmouseleave=function(tr)
{
	popup.document.rowIndex=-1;
	tr.style.background='#e4e4e4';
	tr.style.cursor='arrow';
};

popup.document.keydown = function(keyCode)
{

}






function kescoSelect_showSearchWindow(obj,s,descr)
{
	var width_height = (obj.dialogWidth!=null?'dialogWidth:'+obj.dialogWidth+';':'')+
					   (obj.dialogHeight!=null?'dialogHeight:'+obj.dialogHeight+';':'');
	
	var url = obj.url+(RegExp('\\?').test(obj.url)?'&':'?');
	if (obj.BeforeParamSearchApply!=null) 
	{
		sendMail('Do not use [BeforeParamSearchApply] use [getSearchParams]');
		obj.BeforeParamSearchApply();
	}
	if (obj.getSearchParams!=null)
	{
		url+='&'+kescoString_trim(obj.getSearchParams());
	}
	else url+='&'+kescoString_trim(obj.searchParams);
	url+="&search="+encodeURI(kescoString_trim(s));
	url+="&descr="+kescoString_trim(descr);
	
	if (url.indexOf('title=')==-1)
		if (obj.caption!=null&&obj.caption.length>0) url+=  "&title="+kescoString_trim(obj.caption);
	
	url=kescoString_normalizeUrl(url);
	
	
	if (obj.isDocViewUsed())
	{
		srv4js("SEARCH",url.replace(new RegExp('[^\\?]{0,}[?]'),''),kescoSelect_searchResult,obj);
		
		return new Array(obj.value,obj.valueText); 
	}
	
	DialogPageOpen(url, width_height);
		
	if (GetDlgRez()==1)
		if(GetRetVal()!=null)
		{
			arr = GetRetVal().split(String.fromCharCode(31));
			return new Array(arr[0],(arr.length>1&&obj.loadCaption!=kescoSelect_loadCaptionGag)?arr[1]:null);
		}
	return new Array(obj.value,obj.valueText);
}

function kescoSelect_searchResult(rez,obj)
{
	 
	if(!rez.error)
		switch(rez.value)
		{
			case '-1': alert('\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0441 \u0430\u0440\u0445\u0438\u0432\u043E\u043C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432!'); break;
			case '0': break;
			default:  
				obj.setValue(rez.value);
				break;
		}
	else
		alert(rez.errorMsg);
}


function kescoSelect_isDocViewUsed()
{
	var r = new RegExp("/docs/srv.asmx$","gi");
	return r.test(this.wsdl)
}















	






























	








function kescoSelect_showInfoWindow()
{
	if (this.isDocViewUsed())
	{
		srv4js("OPENDOC","id="+this.value+"&newwindow=1",kescoSelect_opendocResult,this);return;
	}
	kescoSelect_showInfoWindowEnd(this);
}
function kescoSelect_opendocResult(rez,obj)
{
	if (rez.error) kescoSelect_showInfoWindowEnd(obj);
}
function kescoSelect_showInfoWindowEnd(obj)
{
	window.open(kescoParams_appendUrl(obj.urlForm,'id',obj.value),'_blank');
}






function kescoSelect_lock()
{
	if (this.locked) return;
	
	this.locked=true;
	this.inp.readOnly0=this.inp.readOnly;
	this.inp.readOnly=true;
}

function kescoSelect_unlock()
{
	if (!this.locked) return;
	
	this.locked=false;
	this.inp.readOnly=this.inp.readOnly0;
}









function kescoSelect_loadCaptionGag()
{
	this.inp.value=this.valueText;
}

function kescoSelect_loadCaption()
{
	this.runHandlers=false;
	this.inp.value="\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430...";
	
	
	wsdirect(this.wsdl,this.funcCaption,new Array('id',this.value),kescoSelect_loadCaptionEnd,this);
}
function kescoSelect_loadCaptionEnd(rez,obj)
{
	if (!rez.error)
	{
		obj.valueText=obj.inp.value=rez.value;
	}
	else
	{
		obj.valueText=obj.inp.value="#"+obj.value;
	}
	obj.tuneState();
	obj.runHandlers=true;
}
function kescoMSelect(obj)
{
	obj.setState0 = kescoControl_setState;
	obj.setState = kescoMSelect_setState;
	obj.setCheckBox = kescoMSelect_setCheckBox;
	obj.setValue = kescoMSelect_setValue;
	obj.setEmpty = kescoControl_setEmpty;	
	obj.setFocus = kescoMSelect_setFocus;
	obj.tuneState = kescoMSelect_tuneState;

	obj.setSearchParams = function(val)
	{
		this.searchParams=val;
		if(this.tbl!=null)
			if(this.tbl.rows!=null)
				for(i=0;i<this.tbl.rows.length;i++)
				{
					
					inp=this.tbl.rows[i].cells[0].children[2];
					inp.searchParams=val;
				}
	}	



	obj.appendRow	= kescoMSelect_appendRow;
	obj.allownulls=true;
	
	
	obj.tbl = document.createElement("TABLE");
	obj.tbl.border=0;
	obj.tbl.width = obj.style.width;
	obj.tbl.cellPadding=0;
	obj.tbl.cellSpacing=0;
	obj.tbl.style.borderRightWidth="0px";
	obj.tbl.style.borderRightStyle="solid";
	obj.parentNode.insertBefore(obj.tbl,obj);
	
	obj.tbl.hinp=obj;
	
}

function kescoMSelect_setState(newState,tuneState)
{
	this.setState0(newState,false);
}
function kescoMSelect_setCheckBox(visible,checked,tunestate)
{
	
}
function kescoMSelect_setValue(value,text,tuneState)
{
	while (this.tbl.rows.length>0) this.tbl.deleteRow();
	
	this.value=value;
	var i;
	var inp;
	var arr=value.split(',');
	
	var r=RegExp('^\\d+$')
	for(i=0;i<arr.length;i++)  
	{
		if (!r.test(arr[i])) continue;
		this.appendRow(arr[i]);
	}	
	this.appendRow('');
}
function kescoMSelect_setFocus()
{

}
function kescoMSelect_tuneState()
{
var i;
	var inp;
	if(this.tbl!=null)
		if(this.tbl.rows!=null)
			for(i=0;i<this.tbl.rows.length;i++)
			{
				inp=this.tbl.rows[i].cells[0].children[1];
				inp.readOnly=this.readOnly;
				this.tbl.rows[i].style.display = ((inp.value=='')&&(inp.readOnly))?'none':'block';
			}
}






function kescoMSelect_appendRow(val)
{
	
	var inp = document.createElement("INPUT");
	inp.type		= 'hidden';
	inp.kescoType	= 'select'
	inp.value		= val;
	inp.hinp		= this;
	
	inp.url			= this.url;
	inp.wsdl		= this.wsdl;
	inp.urlForm		= this.urlForm;
	inp.funcCount	= this.funcCount;
	inp.funcCaption	= this.funcCaption;
	inp.searchParams= this.searchParams;
	
	
	
	inp.state		= this.state;
	inp.allownulls	= true;
	
	inp.size		= this.size;
	inp.maxLength	= this.maxLength;
	inp.style.width	= '100%';
	
	
	
	inp.AfterValueChanged=kescoMSelect_inp_AfterValueChanged;
	
	var row=this.tbl.insertRow(-1);
	row.inp=inp;
	var cell=row.insertCell(-1);
	cell.appendChild(inp);

	kescoControl(inp);
	kescoControl_init(inp);
}





function kescoMSelect_inp_BeforeParamSearchApply()
{
	if (this.hinp.BeforeParamSearchApply!=null) this.hinp.BeforeParamSearchApply();
	this.paramSearch=this.hinp.paramSearch;
}
function kescoMSelect_inp_AfterValueChanged(obj)
{
	var i;
	var oldValue=this.hinp.value;
	var row=obj.parentElement.parentElement;
	
	var index = -1;
	
	for(i=0;i<obj.hinp.tbl.rows.length;i++)
		if (row==obj.hinp.tbl.rows[i]) index=i;
	
	if (index==-1) return;
	
	var isLastRow = (index==(obj.hinp.tbl.rows.length-1));
	
	if (obj.value=='')
	{	if(!isLastRow) obj.hinp.tbl.deleteRow(index);}
	else
	{	if(isLastRow) obj.hinp.appendRow('');}
	
	
	var s='';
	var val;
	for(i=0;i<obj.hinp.tbl.rows.length-1;i++)
	{
		val=obj.hinp.tbl.rows[i].inp.value;
		if (val==null) continue;
		if (val=='') continue;
		s+=(i==0?'':',')+val;
	}
	this.hinp.value=s;
	if (this.hinp.AfterValueChanged!=null) this.hinp.AfterValueChanged(this.hinp,oldValue,'')
}function kescoGrid(obj)
{	
	obj.setState = function(){};
	obj.setCheckBox = function(){};
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = function(){};
	obj.setFocus =  function(){};
	obj.tuneState = function(){};

	
	
	
	
	obj.cellspacing=0;
	obj.cellpadding=0;
	obj.border=0;
	obj.className='grid8';

	var i,j;
	
	for(i=0;i<obj.rows.length;i++)
	{
		if (obj.rows[i].className=='header') 
		{
			obj.rows[i].className='gridHeader';
			continue;
		}
		if (obj.rows[i].className=='pager')
		{
			obj.rows[i].className='gridPaging';
			continue;
		 }
		if (obj.rows[i].className=='footer')
		{
			obj.rows[i].className='gridFooter';
			 continue;
		 }
		
		
		obj.rows[i].onmouseover=kescoGrid_row_onmouseover;
		obj.rows[i].onmouseout=kescoGrid_row_onmouseout;
		
		for(j=0;j<obj.rows[i].cells.length;j++)
		{
			obj.rows[i].cells[j].className=(i&1>0)?"gridItemA":"gridItem";
			obj.rows[i].cells[j].style.backgroundColor0=obj.rows[i].cells[j].style.backgroundColor;
			
		}
	}
	
}
function kescoGrid_row_onmouseover()
{	
	var j;
	for(j=0;j<this.cells.length;j++)
	{
		this.cells[j].style.backgroundColor='#ddddff';
	}
}
function kescoGrid_row_onmouseout()
{	
	var j;
	for(j=0;j<this.cells.length;j++)
	{
		this.cells[j].style.backgroundColor=this.cells[j].style.backgroundColor0;
	}
}function kescoAutoButtons(obj)
{	
	autoGenerateButtons(obj);
}
function autoGenerateButtons(destObj)
{
	var pat = new RegExp("(?:&|\\?)btn_([^&]{1,})=([^&]{1,})","ig");
	arrStr=document.location.search;	
	while(arr = pat.exec(arrStr))
		destObj.innerHTML =destObj.innerHTML + "<input type=button value='" + decodeURIComponent(arr[1]) + "' onclick='fnSetRetValue(\"" + arr[2] + "\");'>" + "&nbsp;"; 
}

function kescoInt(obj)
{	
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = kescoInt_setValue;
	obj.setFocus = kescoInt_setFocus;
	obj.tuneState = kescoInt_tuneState;
	
	
	
	
	
	
	
	
	
	
	
	obj.cb.onbeforedeactivate = kescoControl_all_onbeforedeactivate;
	
	
	obj.inp = document.createElement("INPUT");
	obj.inp.type="text";
	obj.inp.id=obj.id+'inp';
	obj.inp.hinp=obj;
	obj.inp.style.textAlign='right';
	obj.inp.style.width=obj.tbl.width==null|obj.tbl.width==''?'136px':'100%';
	
	obj.inp.onkeydown=kescoControl_inp_onkeydown;
	obj.inp.onbeforedeactivate = kescoControl_all_onbeforedeactivate;
	obj.inp.onpropertychange = kescoControl_inp_onpropertychange; 
	




	
	
	
	obj.label = document.createElement("SPAN");
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);
	
	
	
	
}


function kescoInt_setValue(value, text, tuneState)
{
	this.runHandlers=false;
	var e;
	var x;
	var oldValue=this.value;
	var oldValueText=this.valueText;
	
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;
	if (value=='') 
	{	
		this.value='';
		this.inp.value=this.valueText='';
	}
	else
	{
		try
		{
			x = kescoInt_parseInt(value);
			if (isNaN(x)) throw new Error(111,kescoErrors[111]);
			
			this.value=''+x;
			this.inp.value=this.valueText=kescoInt_toString(x);
		}
		catch(e)
		{
			this.runHandlers=true;
			return e.number;
		}
	}
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}
	this.runHandlers=true;
	return 0;
}
function kescoInt_setFocus()
{
	this.inp.focus();
}
function kescoInt_tuneState()
{
	kescoControl_tuneState(this);
}






function kescoInt_parseInt(s)
{
	var r=new RegExp('false','gi');
	s=s.replace(/[^-0-9]/g,'');
	s=s.replace(/^-/,'A');
	s=s.replace(/-/g,'');
	s=s.replace(/A/,'-');
	s=s.replace(/-$/,'');
	s=s.replace(/-[0]{1,}/,'-');
	if (s!='0')	s=s.replace(/^[0]{1,}/,'');
	
	return parseInt(s,10);
}
function kescoInt_toString(i)
{
	if (i==null) return '';
	
	return parseInt(i).toLocaleString().replace(/,[0-9]{0,}/g,'');
}


function kescoFloat(obj)
{	
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = kescoFloat_setValue;
	obj.setFocus = kescoFloat_setFocus;
	obj.tuneState = kescoFloat_tuneState;
	
	
	
	
	
	
	
	
	var r=new RegExp('^[0-9]$','ig');
	if (obj.scale==null) obj.scale=2;
	if (!r.test(obj.scale)) obj.scale=2;
	



	
	obj.cb.onbeforedeactivate = kescoControl_all_onbeforedeactivate;
	
	
	obj.inp = document.createElement("INPUT");
	obj.inp.type="text";
	obj.inp.id=obj.id+'inp';
	obj.inp.hinp=obj;
	obj.inp.style.width=obj.tbl.width==null|obj.tbl.width==''?'136px':'100%';
	obj.inp.style.textAlign='right';
	
	




	
	
	obj.inp.onkeydown=kescoFloat_inp_onkeydown;
	obj.inp.onbeforedeactivate = kescoControl_all_onbeforedeactivate;
	obj.inp.onpropertychange = kescoControl_inp_onpropertychange;
	
	
	obj.label = document.createElement("SPAN");
	
	
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);
	
	
	
}




function kescoFloat_setValue(value, text, tuneState)
{
	this.runHandlers=false;
	var e;
	var x;
	var oldValue=this.value;
	var oldValueText=this.valueText;
	
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;
	
	
	if (value=='') 
	{	
		this.value='';
		this.inp.value=this.valueText='';
	}
	else
	{
		try
		{
			x = kescoFloat_parseFloat(value,this.scale);
			if (isNaN(x)) throw new Error(121,kescoErrors[121]);
			
			this.value=''+x;
			this.inp.value=this.valueText=kescoFloat_toString(x,this.scale);
		}
		catch(e)
		{
			this.runHandlers=true;
			return e.number;
		}
	}
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}
	this.runHandlers=true;	
	return 0;
}
function kescoFloat_setFocus()
{
	this.inp.focus();
}
function kescoFloat_tuneState()
{
	kescoControl_tuneState(this);
}




function kescoFloat_inp_onkeydown()
{
	if(!this.hinp.runHandlers) return;
	switch(event.keyCode)
	{
		case 27:this.value=this.hinp.valueText;event.returnValue=false;break;
		case 13:event.keyCode=9; break;

	}
	
}







function kescoFloat_toString(f,scale)
{
	f=parseFloat(f);
	scale=parseInt(scale)
	scale=(isNaN(scale))?2:scale;
	if (isNaN(f)) throw new Error('\u041F\u0440\u0435\u0434\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u0430\u0440\u0433\u0443\u043C\u0435\u0442 \u0442\u0438\u043F\u0430 float');
	f=f.toFixed(scale).replace('.',',')
	
	var f0=f.substr(f.length-scale,scale);
	f=f.substring(0,f.length-scale);
	
	
	
	
	
	var br = new RegExp("(\\d)(\\d\\d\\d)(,|\\s|$)");
	var arr;
	while(arr = br.exec(f))
		f = RegExp.leftContext + RegExp.$1 + " " + RegExp.$2 + RegExp.$3 + RegExp.rightContext;
		
	return f+f0;
}

function kescoFloat_parseFloat(x)
{
	x=x.replace('.',',');  
    
    x=x.replace(/[^-0-9,]/,''); 
	
	x=x.replace(/^-/,'A');	
	x=x.replace(/-/g,'');	
	x=x.replace(/A/,'-');	


  	x=x.replace(/[,]/,'A');	
  	x=x.replace(/[,]/g,'');	
  	x=x.replace(/[A]/g,',');	


  	x=x.replace(/,$/,'');	
	x=x.replace(/-$/,'');	
	x=x.replace(',','.');
	x=x.replace(/[ ]+/g,'');
	
	return parseFloat(x);
}






function kescoFlag(obj)
{
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = kescoFlag_setValue;
	obj.setFocus = kescoFlag_setFocus;
	obj.tuneState = kescoFlag_tuneState;
	
	
	obj.cb.onbeforedeactivate = kescoFlag_all_onbeforedeactivate;
	
	
	
	obj.inp = document.createElement("INPUT");
	obj.inp.type="checkbox";
	obj.inp.id=obj.id+'inp';
	obj.inp.hinp=obj;
	obj.inp.onpropertychange	= kescoFlag_inp_onpropertychange;
	obj.inp.onbeforedeactivate	= kescoFlag_all_onbeforedeactivate;
	
	
	obj.label = document.createElement("SPAN");
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);
	
}

function kescoFlag_setValue(value, text, tuneState)
{
	this.runHandlers=false;
	var e;
	var x;
	var oldValue=this.value;
	var oldValueText=this.valueText;
	
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;
	if (value=='') 
	{	
		this.value='';
		this.valueText='';
		this.inp.checked=false;
	}
	else
	{
		try
		{
			x = parseInt(value);
			if (isNaN(x)) throw new Error(141,kescoErrors[141]);
			
			this.inp.checked=parseInt(value);
			
			this.value=parseInt(value)?'1':'0';
			this.valueText='';
		}
		catch(e)
		{
			this.runHandlers=true;
			return e.number;
		}
	}
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}	
	this.runHandlers=true;
	return 0;
}
function kescoFlag_setFocus()
{
	this.inp.focus();
}
function kescoFlag_tuneState()
{
	kescoControl_tuneState(this);
	this.inp.style.backgroundColor = '';
	this.label.innerHTML=this.inp.checked?'\u0434\u0430':'\u043D\u0435\u0442';
}


function kescoFlag_inp_onpropertychange()
{
	if(!this.hinp.runHandlers) return;
	switch(event.propertyName)
	{
		case 'checked': 
			this.hinp.setValue(this.checked?'1':'0');
	}
}
function kescoFlag_all_onbeforedeactivate()
{
	if(!this.hinp.runHandlers) return;
	if (event.toElement!=null&&event.toElement.hinp==this.hinp) return;
	
	
	var e=this.hinp.setValue(this.hinp.inp.checked?'1':'0',null,false);
	if(e!=0)
	{
		alert(kescoErrors[e]);
		event.returnValue=false;
		return;
	}
	
	if(this.hinp.cbIsUsed)
		if(!this.hinp.allownulls)
			if (this.hinp.cb.checked)
				if (this.hinp.value=='')
					this.hinp.setCheckBox(true,false,false);
	
	this.hinp.tuneState();
}


function kescoList(obj)
{	
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = kescoList_setValue;
	obj.setFocus = kescoList_setFocus;
	obj.tuneState = kescoList_tuneState;
	
	obj.setList = kescoList_setList;
	
	
	
	
	obj.cb.onbeforedeactivate = kescoControl_all_onbeforedeactivate2;
	
	
	obj.inp = document.createElement("SELECT");
	obj.inp.id=obj.id+'inp';
	
	obj.inp.hinp=obj;
	obj.inp.onchange=kescoList_inp_onchange;
	obj.inp.onbeforedeactivate=kescoControl_all_onbeforedeactivate2;
	obj.inp.onkeyup=kescoList_inp_onkeyup;
	if (obj.style.width!='') obj.inp.style.width='100%';	
	
	
	obj.label = document.createElement("SPAN");
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);

	obj.setList(obj.list);
}


function kescoList_setValue(value, text, tuneState)
{
	this.runHandlers=false;
	var oldValue=this.value;
	var oldValueText=this.valueText;
	
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;

	
	if (value=='') 
	{	
		this.value='';
		this.inp.value=this.valueText='';
	}
	else	
	{
		var i;
		for(i=0;i<this.inp.options.length;i++)
		{
			if (this.inp.options[i].value!=value) continue;
			this.value=this.inp.value=this.inp.options[i].value;
			this.valueText=this.inp.options[i].text;
		}
	}
	if (this.value!=value)
	{
		this.runHandlers=true;
		return 131;
	}
	
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}
	this.runHandlers=true;
	return 0;
}
function kescoList_setFocus()
{
	this.inp.focus();
}
function kescoList_tuneState()
{
	kescoControl_tuneState(this);
	this.inp.style.backgroundColor = BGCOLOR_NORMAL;
	
	
}



function kescoList_setList(s,tuneState)
{
	tuneState=(tuneState==null)?true:tuneState;
	
	
	var arr;
	var i=0;
	var opt;

	while(this.inp.options.length>0)this.inp.options.remove(0);
	
	if(s!=null)
	{
		var arr=s.split(';');
		for(;(i+1)<arr.length;)
		{
			opt=document.createElement("OPTION");
			
			opt.value=arr[i++];
			opt.text=arr[i++];
			this.inp.add(opt);
		}
	}
	
	this.setValue(this.value,null,false);
	if (tuneState) this.tuneState();
}




function kescoList_inp_onchange()
{
	this.hinp.setValue(this.value);
	if (this.hinp.onchange!=null) this.hinp.onchange();
}
function kescoList_inp_onkeyup()
{
	switch(event.keyCode)
	{
		case 8 :
		case 46: 
			this.hinp.setValue();
			if (this.hinp.onchange!=null) this.hinp.onchange();
			break; 
	}
}






function kescoLabel(obj)
{	
	obj.setFocus=	kescoLabel_setFocus;

	var span = document.createElement("SPAN");
	obj.parentNode.insertBefore(span,obj);
	span.style.width=obj.style.width;
	span.innerHTML=obj.value;
}

function kescoLabel_setFocus()
{
	
}
function kescoString(obj)
{	
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = kescoString_setValue;
	obj.setFocus = kescoString_setFocus;
	obj.tuneState = kescoString_tuneState;
	
	
	
	
	obj.cb.onbeforedeactivate = kescoControl_all_onbeforedeactivate;
	
	
	obj.inp = document.createElement("INPUT");
	obj.inp.type="text";
	obj.inp.id=obj.id +'inp';		
	obj.inp.hinp=obj;
	obj.inp.style.width=obj.tbl.width==null|obj.tbl.width==''?'136px':'100%';
	obj.inp.maxLength=obj.maxLength;
	
	obj.inp.onkeydown=kescoControl_inp_onkeydown;
	obj.inp.onbeforedeactivate=kescoControl_all_onbeforedeactivate;
	obj.inp.onpropertychange=kescoControl_inp_onpropertychange;
	
	
	obj.label = document.createElement("SPAN");
	
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);

}



function kescoString_setValue(value, text, tuneState)
{
	this.runHandlers=false;
	var oldValue=this.value;
	var oldValueText=this.valueText;
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;
	
	if (value=='') 
	{
		this.value=this.inp.value=this.valueText='';
	}
	else
	{
		this.value=this.inp.value=this.valueText=value;
	}
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}
	this.runHandlers=true;
	return 0;
}
function kescoString_setFocus()
{
	this.inp.focus();
}

function kescoString_tuneState()
{
	kescoControl_tuneState(this);
}









function kescoString_trim(s)
{
	var reTrim = new RegExp('^[ ]{1,}|[ ]{1,}$','ig');
	return (s==null)?'':(''+s).replace(reTrim,'');
}
function kescoString_list(list,value,action,delimiter)
{
	delimiter=(delimiter==null)?',':delimiter;
	var r = new RegExp('(^|['+delimiter+'])('+value+')($|['+delimiter+'])');
	var arr = r.exec(list);
	switch(action)
	{
		case 1: 
			if (arr==null) return list+(list.length>0?delimiter:'')+value;
			else return list; 
		case 2: 
			if (arr==null) return list;	
			else return list.replace(r,function(all,lt,val,rt){return (lt==delimiter&&rt==delimiter)?delimiter:''}); 
			
		case 3: 
			if (arr==null) return list+(list.length>0?delimiter:'')+value;
			else return list.replace(r,function(a,b,c){});
			
		default: 
			return (arr!=null);			
	}
}
function kescoString_normalizeUrl(url)
{
	var r=new RegExp('(^|\\?|&)([^=&]{1,}=)(&|$)','g');
	url=url.replace(r,function(all,lt,val,rt){return lt+rt;});
	url=url.replace(r,function(all,lt,val,rt){return lt+rt;});
	url=url.replace(new RegExp('[&]{1,}'),'&');
	url=url.replace('?&','?');
	url=url.replace(new RegExp('^[&]|[&]$'),'');
	return url;
}

function kescoText(obj)
{	
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = kescoText_setValue;
	obj.setFocus = kescoText_setFocus;
	obj.tuneState = kescoText_tuneState;
	
	
	obj.tbl.height=obj.style.height;
	
	
	obj.cbCell.vAlign='top';
	
	
	obj.cb.onbeforedeactivate = kescoControl_all_onbeforedeactivate;
	
	
	obj.inp = document.createElement("textarea");
	obj.inp.id=obj.id +'inp';		
	obj.inp.hinp=obj;
	obj.inp.style.width=obj.tbl.width==null|obj.tbl.width==''?'136px':'100%';;
	obj.inp.style.height=obj.tbl.height==null|obj.tbl.height==''?'54px':'100%';;

	obj.inp.onkeydown=kescoControl_inp_onkeydown;
	obj.inp.onbeforedeactivate=kescoControl_all_onbeforedeactivate;
	obj.inp.onpropertychange=kescoControl_inp_onpropertychange;
	
	
	obj.label = document.createElement("PRE");
	
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);
}

function kescoText_setValue(value, text, tuneState)
{
	this.runHandlers=false;
	
	var oldValue=this.value;
	var oldValueText=this.valueText;
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;
	
	if (value=='') 
	{	
		this.value=this.inp.value=this.valueText='';
	}
	else
	{
		this.value=this.inp.value=this.valueText=value;
	}	
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}	
	
	this.runHandlers=true;
	return 0;	
}

function kescoText_setFocus()
{
	this.inp.focus();
}

function kescoText_tuneState()
{
	kescoControl_tuneState(this);
	if(escape(this.inp.value).replace('%0D','')==escape(this.valueText).replace('%0D',''))
		this.inp.style.backgroundColor =BGCOLOR_NORMAL;
}








function kescoDate(obj)
{	
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = kescoDate_setValue;
	obj.setFocus = kescoDate_setFocus;
	obj.tuneState = kescoDate_tuneState;
		
	
	obj.cb.onbeforedeactivate = kescoControl_all_onbeforedeactivate;

	
	obj.inp = document.createElement("INPUT");
	obj.inp.type="text";
	obj.inp.id=obj.id +'inp';		
	obj.inp.hinp=obj;
	obj.inp.style.width="70px";
	obj.inp.maxLength=10;	
	
	obj.inp.onkeydown=kescoDate_inp_onkeydown;
	obj.inp.onbeforedeactivate=kescoControl_all_onbeforedeactivate;
	obj.inp.onpropertychange=kescoControl_inp_onpropertychange;

	
	obj.label = document.createElement("SPAN");

	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);
}



function kescoDate_setValue(value, text, tuneState)
{
	this.runHandlers=false;
	var d;
	var e;
	var oldValue=this.value;
	var oldValueText=this.valueText;
	
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;

	if (value=='') 
	{	
		this.value='';
		this.inp.value=this.valueText='';
	}
	else
	{
		try
		{
				d = kescoDate_parseDate(value);
				if (d==null) throw new Error(104,kescoErrors[104]);
				
				this.value=''+kescoDate_toString(d);
				this.inp.value=this.valueText=kescoDate_toString(d);
		}
		catch(e)
		{
			this.runHandlers=true;
			
			return e.number;
		}
	}	
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}
	this.runHandlers=true;
	return 0;
}
function kescoDate_setFocus()
{
	this.inp.focus();
}
function kescoDate_tuneState()
{
	kescoControl_tuneState(this);
}








	








function kescoDate_inp_onkeydown()
{	   
	if(!this.hinp.runHandlers) return;
	
	switch(event.keyCode)
	{
		case 27:
			this.hinp.inp.value=this.hinp.valueText;
			event.returnValue=false;
			break;
		case 13: 
			event.keyCode=9;
			break;
	}
	
}







function kescoDate_parseDate2(dateString)
{
	
	var _str;	
	var _p0;	
	var _p1;	
	
	
	var str;	
	var p0;		
	var p1;		
	var i0,i1,i2;
	var w0,w1,w2;
	
	var p;		
	var pmin=-10000
	var pmax=pmin;	
	
	var s='';	
	
	var dt=new Date();	
	var d0=dt.getDate();			
	var m0=dt.getMonth()+1;			
	var y0=dt.getFullYear();		
	
	
	_str=kescoString_trim(dateString).replace(RegExp('\\D','ig'),'.').replace(RegExp('[.]{1,}','ig'),'.');
	_p0=_str.indexOf('.');	
	_p1 = _p0>0?_str.indexOf('.',_p0+1)-1:-1;
	if (_p1>0&&_str.indexOf('.',_p1+2)>0)
	{
		throw new Error(104,kescoErrors[104]);
		return null;
	}
	
	
	
	
	function check(d,m,y,dp)
	{
		if (d==0) {d=d0;dp-=200;}
		if (m==0) {m=m0;dp-=100;}
		if (y==0)  y=y0; 
		if (y<100) y=(y<50?2000:1900)+y;
		if (y>2050||y<1950||m>12||d>31)return;
		if (pmax<(p+dp))
		{
			var t = new Date(y,m-1,d);
			if(t.getDate()==d)
			{
				pmax=p+dp;
				dt=t;		
			}
		}
		s+="\t"+d+"."+m+"."+y+"\t"+(p+dp)+"\t"+pmax+"\t"+t+"\n";
		
	}
	
	str=_str.replace(RegExp('[.]','ig'),'');
	if (str.length>8)
	{
		throw new Error(104,kescoErrors[104]);
		return null;
	}
	for(var i=str.length;i>=0;i--)
		for(var j=str.length;j>=0;j--)
			{
				p0=Math.min(i,j);
				p1=Math.max(i,j);
				
				w0=str.substring(0,p0);
				w1=str.substring(p0,p1);
				w2=str.substring(p1);
				s+=w0+"."+w1+"."+w2+"\n";	
				i0=w0.length==0?0:parseInt(w0);
				i1=w1.length==0?0:parseInt(w1);
				i2=w2.length==0?0:parseInt(w2);
					
				
				p=(i*str.length+j)*10+
					((p0==_p0?1:0)+(p1==_p1?1:0))*200+
					((w0.length==2?1:0)+(w1.length==2?1:0)+(w2.length==2||w2.length==4?1:0))*50;
			
				check(i0,i1,i2,0);
				check(i1,i0,i2,-1);
				check(i2,i0,i1,-2);
				check(i2,i1,i0,-3);
				check(i1,i2,i0,-4);
				check(i0,i2,i1,-5);
			}
	if (pmax==pmin)
	{
		throw new Error(104,kescoErrors[104]);
		return null;
	}
	return dt;
}




function kescoDate_parseDate(str)
{
	var A=new Array(0,0,0);
	var j=0;
	
	str=str.replace(RegExp('[^0-9]{1,}','ig'),' ');
	str=str.replace(RegExp('^[ ]|[ ]$','ig'),'');
	if (str.length==0)  return null;
	
	var arr=str.split(' ');
	
	for(var i=0;(j<3)&&(i<arr.length);i++)
	{
		if (j==2) 
		{
			A[j]=parseFloat(arr[i].substr(0,4)); 
			if (A[j]!=0) j++;
		}
		
		switch (arr[i].length)
		{
			case 1: 
			case 2:
					A[j]=parseFloat(arr[i]);
					if (A[j]!=0) j++; 
					break;
			case 3:
					arr[i]='0'+arr[i];
			case 4:
					
					A[j]=parseFloat(arr[i].substr(0,2)); 
					if (A[j]!=0) j++;
					A[j]=parseFloat(arr[i].substr(2)); 
					if (A[j]!=0) j++;
					break;
			case 5:
					arr[i]='0'+arr[i];
			case 6:
					
					A[j]=parseFloat(arr[i].substr(0,2)); 
					if (A[j]!=0) j++;
					A[j]=parseFloat(arr[i].substr(2,2)); 
					if (A[j]!=0) j++;
					A[j]=parseFloat(arr[i].substr(4)); 
					if (A[j]!=0) j++;
					break;
		}
	}
	var d = new Date();
	if (A[0]==0) A[0]=d.getDate();
	if (A[1]==0) A[1]=d.getMonth()+1;
	if (A[2]==0) A[2]=d.getFullYear();
	
	
	if (A[2]<100) A[2]=(A[2]>50)?1900+A[2]:2000+A[2];
	if ((A[2]<1900)||(A[2]>2078)) 
	{
		throw new Error(103,kescoErrors[103]);
		return null;
	}
	if (A[1]>12)  
	{	
		throw new Error(102,kescoErrors[102]);
		return null;
	}
	d=new Date(A[2], A[1]-1, A[0]);
	if (A[0]!=d.getDate()) 
	{	
		throw new Error(101,kescoErrors[101]);
		return null;
	}
	
	return new Date(A[2], A[1]-1, A[0]);
}
function kescoDate_toString(d)
{
	if (d==null) return '';
	
	var dd=d.getDate();
	var MM=d.getMonth()+1;
	var yyyy=d.getFullYear();
	dd=(dd<10)?'0'+dd:''+dd;
	MM=(MM<10)?'0'+MM:''+MM;
	return dd+'.'+MM+'.'+yyyy;
}
function kescoMonth(obj)
{	
	obj.setState = kescoControl_setState;
	obj.setCheckBox = kescoControl_setCheckBox;
	obj.setEmpty = kescoControl_setEmpty;	
	
	obj.setValue = kescoMonth_setValue;
	obj.setFocus = kescoMonth_setFocus;
	obj.tuneState = kescoMonth_tuneState;
	
	
	obj.add=kescoMonth_add;
	
	
	obj.cb.onbeforedeactivate = kescoControl_all_onbeforedeactivate2;
		
	
	obj.inp=document.createElement("INPUT");
	obj.inp.type="text";
	obj.inp.id=obj.id+'inp';
	obj.inp.readOnly=true;
	obj.inp.hinp=obj;
	obj.inp.style.width='100%';
	
	obj.inp.onkeyup=kescoMonth_inp_onkeyup;
	obj.inp.onfocus=kescoMonth_inp_oncontrolselect;
	obj.inp.onbeforedeactivate=kescoControl_all_onbeforedeactivate2;
	
	
	
	obj.label = document.createElement("SPAN");
	
	
	
	obj.btnUp=document.createElement("INPUT");
	obj.btnUp.type="button";
	obj.btnUp.id=obj.id+'btnUp';
	obj.btnUp.style.background='url('+root+'ScrollUpEnabled.gif) buttonface no-repeat center center';
	obj.btnUp.style.height='100%';
	obj.btnUp.tabIndex=-1;
	obj.btnUp.hinp=obj;
	obj.btnUp.onmouseup=kescoMonth_btnUp_onmouseup;
	obj.btnUp.onbeforedeactivate=kescoControl_all_onbeforedeactivate2;
	
	
	obj.btnDown=document.createElement("INPUT");
	obj.btnDown.type="button";
	obj.btnDown.id=obj.id+'btnDown';
	obj.btnDown.style.background='url('+root+'ScrollDownEnabled.gif) buttonface no-repeat center center';
	obj.btnDown.style.height='100%';
	obj.btnDown.tabIndex=-1;
	obj.btnDown.hinp=obj;
	obj.btnDown.onmouseup=kescoMonth_btnDown_onmouseup;
	obj.btnDown.onbeforedeactivate=kescoControl_all_onbeforedeactivate2;
	
	
	
	
	
	
	obj.row1=obj.tbl.insertRow(-1);
	obj.btnUpCell=obj.row.insertCell();
	obj.btnUpCell.height='50%';
	obj.btnDownCell=obj.row1.insertCell();
	obj.btnDownCell.height='50%';
	obj.cbCell.rowSpan=2;
	obj.inpCell.rowSpan=2;
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);
	obj.btnUpCell.appendChild(obj.btnUp);
	obj.btnDownCell.appendChild(obj.btnDown);
	
	
	



	
	
	

}


function kescoMonth_setValue(value, text, tuneState)
{
	this.runHandlers=false;
	var e;
	var d;
	var oldValue=this.value;
	var oldValueText=this.valueText;
	
	value=kescoString_trim(value);
	tuneState=(tuneState==null)?true:tuneState;
	
	if (value=='') 
	{	
		this.value='';
		this.inp.value=this.valueText='';
	}
	else
	{
		try
		{
			d = kescoDate_parseDate(value);
			d.setDate(1);
			this.value=kescoDate_toString(d);
			this.inp.value=this.valueText=kescoMonth_toString(d);
		}
		catch(e)
		{
			this.runHandlers=true;
			return e.number;
		}
	}
	
	if (tuneState) this.tuneState();
	if (oldValue!=this.value)
	{
		if (this.paramKey!=null) kescoParams_set(this.paramKey,this.value);
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	}
	this.runHandlers=true;
	return 0;
}
function kescoMonth_setFocus()
{
	this.inp.focus();
}
function kescoMonth_tuneState()
{
	kescoControl_tuneState(this);
	
	this.btnUp.style.display = this.inp.style.display;
	this.btnDown.style.display = this.inp.style.display;
	
	this.btnUp.disabled = this.inp.disabled;
	this.btnDown.disabled = this.inp.disabled;
}









function kescoMonth_inp_oncontrolselect()
{
	if(!this.hinp.runHandlers) return;
	var tr = this.hinp.inp.createTextRange();
	tr.moveStart("character", 0 );
	tr.moveEnd("character", this.hinp.inp.value.length  );
	tr.select();
}
function kescoMonth_inp_onkeyup()
{
	if(!this.hinp.runHandlers) return;
	switch(event.keyCode)
	{
		case 40: this.hinp.add(-1);break;
		case 39: this.hinp.add(12);break;
		case 38: this.hinp.add(1);break;
		case 37: this.hinp.add(-12);break;
		case 8 :
		case 46: this.hinp.setValue();break; 
	}
	var tr=this.hinp.inp.createTextRange();
	tr.moveStart("character", 0 );
	tr.moveEnd("character", this.hinp.inp.value.length  );
	tr.select();
}
function kescoMonth_btnUp_onmouseup()
{
	if(!this.hinp.runHandlers) return;
	this.hinp.add(1);
	this.hinp.inp.setActive();
	var tr = this.hinp.inp.createTextRange();
	tr.moveStart("character", 0 );
	tr.moveEnd("character", this.hinp.inp.value.length  );
	tr.select();
}
function kescoMonth_btnDown_onmouseup()
{
	if(!this.hinp.runHandlers) return;
	this.hinp.add(-1);
	this.hinp.inp.setActive();
	var tr = this.hinp.inp.createTextRange();
	tr.moveStart("character", 0 );
	tr.moveEnd("character", this.hinp.inp.value.length  );
	tr.select();
}

function kescoMonth_add(i)
{
	var d=kescoDate_parseDate(this.value);
	if (d==null) 
	{
		this.setValue(kescoDate_toString(new Date()));
		return;
	}
	var m=d.getMonth();
	var y=d.getFullYear();
	var z=y*12+m;
	z=z+i;
	if (z<1900*12) z=2050*12;
	if (z>2050*12) z=1900*12;

	m=z%12;
	y=(z-m)/12;
	d = new Date(y,m,1);
	this.setValue(kescoDate_toString(d));
}



var kescoMonth_names = new Array('\u044F\u043D\u0432\u0430\u0440\u044C','\u0444\u0435\u0432\u0440\u0430\u043B\u044C','\u043C\u0430\u0440\u0442','\u0430\u043F\u0440\u0435\u043B\u044C',
					'\u043C\u0430\u0439','\u0438\u044E\u043D\u044C','\u0438\u044E\u043B\u044C','\u0430\u0432\u0433\u0443\u0441\u0442',
					'\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044C','\u043E\u043A\u0442\u044F\u0431\u0440\u044C','\u043D\u043E\u044F\u0431\u0440\u044C','\u0434\u0435\u043A\u0430\u0431\u0440\u044C');

function kescoMonth_toString(d)
{
	if (d==null) return '';
	
	
	var m=d.getMonth();
	var y=d.getFullYear();
	
	
	return kescoMonth_names[m]+' '+y;
}
function kescoTime(obj)
{

	obj.setState = kescoControl_setState;
	obj.setCheckBox= kescoControl_setCheckBox;
	obj.setEmpty= kescoControl_setEmpty;
	
	obj.setValue= kescoTime_setValue;
	obj.setFocus= kescoTime_setFocus;
	obj.tuneState= kescoTime_tuneState;
	
	obj.checkValue= kescoTime_checkValue;
	
	
	obj.cb.onbeforedeactivate = kescoControl_all_onbeforedeactivate;
	
	
	
	obj.inp = document.createElement("INPUT");
	obj.inp.type="text";
	obj.inp.id=obj.id+'inp';
	obj.inp.hinp=obj;
	obj.inp.style.width=obj.tbl.width==null|obj.tbl.width==''?'60px':'100%';
	obj.inp.maxLength=8;
	
	
	obj.inp.onkeydown=kescoDate_inp_onkeydown;
	obj.inp.onpropertychange=kescoControl_inp_onpropertychange;
	obj.inp.onbeforedeactivate=kescoControl_all_onbeforedeactivate;
	
	
	obj.inp.attachEvent("oncontextmenu",t_CancelEvent);
	obj.inp.attachEvent("ondrag",t_CancelEvent);
	obj.inp.attachEvent("oncut",t_CancelEvent);
	obj.inp.attachEvent("onpaste",t_beforepaste);
	obj.inp.attachEvent("onkeydown",t_keydown);
			
			

	if(obj.value=='')	obj.setValue("00:00:00");
	
	
	
	
	obj.inpCell.appendChild(obj.inp);
	obj.inpCell.appendChild(obj.label);
	
}



function kescoTime_setValue(val)
{
	this.runHandlers=false;
	var oldVal=this.value;
	
	this.inp.value0=
	this.inp.value=
	this.valueText=
	this.value=val;
	
	if (this.value!=oldVal)
		if (this.AfterValueChanged!=null) this.AfterValueChanged(this,oldValue,oldValueText);
	
	this.runHandlers=true;
	return 0;
}


function kescoTime_resetValue()
{
	if (this.value=="") this.setEmpty();
	else this.setValue(this.value,this.inp.value0);
}

function kescoTime_inp_onbeforedeactivate()
{
	this.hinp.setValue(this.value);
	return this.onbeforedeactivate2();
}







function kescoTime_inp_onbeforedeactivate()
{
	this.hinp.setValue(this.value);

}


function kescoTime_inp_onkeydown()
{
	
	
	
}



function kescoTime_checkValue()
{
	return 0;
	
	
}
function kescoTime_utc2loc(s) 
{
	var test = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([.]\d*)?F(\d)(\d)/g;    
	return(s.replace
		(test,
		function($0,$1,$2,$3,$4,$5,$6,$7,$8,$9){
	
		var d=new Date(Date.UTC($1,$2-1,$3,$4,$5,$6));
		
		var yyyy='0000'+d.getFullYear(); yyyy=yyyy.substr(yyyy.length-4);
		var yy=yyyy.substr(yyyy.length-2);
		var MM='00'+(d.getMonth()+1); MM=MM.substr(MM.length-2);
		var dd='00'+d.getDate(); dd=dd.substr(dd.length-2);
		
		var HH='00'+d.getHours(); HH=HH.substr(HH.length-2);
		var mm='00'+d.getMinutes(); mm=mm.substr(mm.length-2);
		var ss='00'+d.getSeconds(); ss=ss.substr(ss.length-2);
		
		
		var dt;
		switch($8)
		{
			case '1': dt=dd+'.'+MM+'.'+yyyy; break;
			case '2': dt=dd+'.'+MM+'.'+yy; break;
			default: dt=''; break;
		}
		var tm;
		switch($9)
		{
			case '1': tm=HH+':'+mm+':'+ss; break;
			case '2': tm=HH+':'+mm; break;
			default: tm=''; break;
		}
		
		return(dt+(dt.length>0&&tm.length>0?' ':'')+tm);
		}
		)
	); 
}

function kescoTime_setFocus()
{
	this.inp.focus();
}
function kescoTime_tuneState()
{
	kescoControl_tuneState(this);
}









function t_change()
{
	if (event.keyCode==27)
			event.returnValue=false;
}

function t_beforepaste()
{
	var el=event.srcElement;
	var textToPaste=window.clipboardData.getData("Text");
	
	
	var tr2=document.selection.createRange().duplicate();
	tr2.collapse();
	tr2.moveStart("sentence",-1);
	var text1=tr2.text;
	
	
	tr2=document.selection.createRange().duplicate();
	tr2.collapse(false);
	tr2.moveEnd("sentence",1);
	var text2=tr2.text;
	
	var rez=text1+textToPaste+text2;
	if (rez.length!=8) 
	{
		alert("\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435");
		event.returnValue=false;
		return;
	}
	
	var hours=parseInt(rez.substr(0,2),10);
	var minutes=parseInt(rez.substr(3,2),10);
	var seconds=parseInt(rez.substr(6,2),10);

	if(hours>=0 && hours<24 && minutes>=0 && minutes<60 && seconds>=0 && seconds<60)
	{
	}	
	else
	{
		alert("\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435");
		event.returnValue=false;
	}
}
function t_keydown()
{
	var el=event.srcElement;
	var tr1=document.selection.createRange();

	
	var tr2=document.selection.createRange().duplicate();
	tr2.collapse();
	tr2.moveStart("sentence",-1);
	var pos=tr2.text.length;
	

	if((event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105)  )
	{
		event.returnValue=false;

		
		if(tr1.text.length>0)
		{
			var tr3=document.selection.createRange().duplicate();
			re=/[1-9]/g;
			tr1.text=tr1.text.replace(re,"0");
			tr1.setEndPoint("EndToStart",tr3);
			tr1.collapse();
			tr1.select();
		}
		
		
		
		tr1.moveEnd("character",1);
		if(tr1.text=="") return;
		if(tr1.text==":") 
		{
			pos++;
			tr1.moveStart("character",1);
			tr1.select();
			tr1.moveEnd("character",1);
		}
		
		var char_input=String.fromCharCode(event.keyCode>57?event.keyCode-48:event.keyCode);

		switch(pos)
		{
			case 0:
				var hours=parseInt(char_input+el.value.substr(1,1),10);
				if (hours>23) return;
				break;
			case 1:
				var hours=parseInt(el.value.substr(0,1)+char_input,10);
				if (hours>23) return;
				break;
			break;

			case 3:
				var minutes=parseInt(char_input+el.value.substr(4,1),10);
				if (minutes>59) return;
				break;
			case 4:
				var minutes=parseInt(el.value.substr(3,1)+char_input,10);
				if (minutes>59) return;
				break;
			break;

			case 6:
				var seconds=parseInt(char_input+el.value.substr(7,1),10);
				if (seconds>59) return;
				break;
			case 7:
				var seconds=parseInt(el.value.substr(6,1)+char_input,10);
				if (seconds>59) return;
				break;
			break;
		}
		
		tr1.text=char_input;
	}
	else if(event.keyCode==8) 
	{
		event.returnValue=false;

		
		if(tr1.text.length>0)
		{
			var tr3=document.selection.createRange().duplicate();
			re=/[1-9]/g;
			tr1.text=tr1.text.replace(re,"0");
			tr1.setEndPoint("EndToStart",tr3);
			tr1.collapse();
			tr1.select();
			return;
		}

		tr1.moveStart("character",-1);
		if(tr1.text=="") return;
		if(tr1.text==":") 
		{
			tr1.move("character",-1);
			tr1.select();
			tr1.moveEnd("character",1);
		}
		tr1.text='0';
		tr1.move("character",-1);
		tr1.select();
		
	}
	else if(event.keyCode==46) 
	{
		event.returnValue=false;

		
		if(tr1.text.length>0)
		{
			re=/[1-9]/g;
			tr1.text=tr1.text.replace(re,"0");
			tr1.collapse();
			tr1.select();
			return;
		}
		
		tr1.moveEnd("character",1);
		if(tr1.text=="") return;
		if(tr1.text==":") 
		{
			tr1.moveStart("character",1);
			tr1.select();
			tr1.moveEnd("character",1);
		}
		tr1.text='0';
	}
	else if(event.keyCode==38 || event.keyCode==40) 
	{
		switch(pos)
		{
			case 0:
			case 1:
			case 2:
				var hours=parseInt(el.value.substr(0,2),10);
				
				if(event.keyCode==38) {if (hours>=23) return; hours++;}
				else {if (hours<=0) return; hours--;}
				
				var tr1=el.createTextRange();
				tr1.collapse();
				tr1.moveEnd("character",2);
				tr1.text=hours>9?hours:('0'+hours);
				break;
			break;

			case 3:
			case 4:
			case 5:
				var minutes=parseInt(el.value.substr(3,2),10);

				if(event.keyCode==38) {if (minutes>=59) return; minutes++;}
				else {if (minutes<=0) return; minutes--;}

				var tr1=el.createTextRange();
				tr1.moveStart("character",3);
				tr1.collapse();
				tr1.moveEnd("character",2);
				tr1.text=minutes>9?minutes:('0'+minutes);
				break;
			break;

			case 6:
			case 7:
			case 8:
				var seconds=parseInt(el.value.substr(6,2),10);

				if(event.keyCode==38) {if (seconds>=59) return; seconds++;}
				else {if (seconds<=0) return; seconds--;}

				var tr1=el.createTextRange();
				tr1.moveStart("character",6);
				tr1.collapse();
				tr1.moveEnd("character",2);
				tr1.text=seconds>9?seconds:('0'+seconds);
				break;
		}
	}
	else if(event.keyCode==32) 
	{
		event.returnValue=false;
	}
	else if(event.keyCode<48){} 
	else
		event.returnValue=false;

}

function t_CancelEvent()
{
	event.returnValue=false;
}


var kescoTree_selectedID = "";

function kescoTree_NodeClick()
{

	var pNode = tView.getTreeNode(event.srcElement.clickedNodeIndex);
	var id = pNode.findAttribute('ID');
	var text = pNode.getAttribute('text');
	
	text = kescoString_trim(text);
	
	if (_treeTemplateName == 'ThemeTreeTemplate')
	{
		if (id != 0)
			DialogPageOpen("UsersbyTheme.aspx?clid=12&id=" + id + "&title=" + text,'dialogHeight:600px;dialogWidth:600px;center:yes;status:no;help:no;resizable:yes;');
		else
			kescoTree_ChildrenCheck(pNode.getChildren(), true); 
			
		return;
	}

	
	if (!(val = kescoParams_get("return"))) return;

	val = val[2];
	
	if (val == 1) {
		var _mvc = kescoParams_get("mvc");

		_mvc = (_mvc == null) ? 0 : 1;

		if (_mvc) {
			var result = [];

			result[0] = { 
				value: id,
				label: text
			};
			
			returnMvcDialogResult(result, _mvc[2]!="1");
		} else { // возврат значения через cookie
		DialogPageReturn(id+String.fromCharCode(31)+text,0);
		}
	}
	else
	{
		var pNode = tView.getTreeNode(event.srcElement.clickedNodeIndex);
		if (pNode.getParent() == null)
			kescoTree_ChildrenCheck(pNode.getChildren(), true);
	}
}

function kescoTree_CheckBoxClick()
{

	var pNode = tView.getTreeNode(event.srcElement.clickedNodeIndex);

	var id = pNode.findAttribute('ID');
	var text = pNode.getAttribute('text');

	var rValue = kescoParams_get('return')[2];

	if(rValue == 1)
	{
		var r = new RegExp("(?:^[ ]{1,})|(?:[ ]{1,}$)","g")
		text = text.replace(r,"");
 
		DialogPageReturn(id+String.fromCharCode(31)+text,0);
		return;
	}

	var treeType = kescoParams_get('type');


	var cValue = pNode.getAttribute('Checked');

	
	objArr = pNode.getChildren();
	kescoTree_SetCBox(pNode, null);
	
	if(rValue == 2 || rValue == 4) 
	{

		cValue = cValue || pNode.getAttribute('Checked');

		if (cValue)
			kescoTree_ChildrenCheck(objArr, cValue);
		while(pNode = pNode.getParent())
		{	
			if (!cValue) 
			{
				var tt = new RegExp("ok.gif$","ig");
				if (tt.test(pNode.getAttribute('imageUrl')))
					cValue = true;
				else
					cValue = false;
			}

			if (cValue && pNode.getAttribute('Checked'))
				kescoTree_SetCBox(pNode, !cValue);
		}
		
    }
}

function kescoTree_Expand(action)
{

	var pNode = tView.getTreeNode(event.srcElement.clickedNodeIndex);
	var id = pNode.findAttribute('ID');
	
	reg = new RegExp("(?:,|^)" + id,"i");
	_clearReg = new RegExp("(?:^,|,$)", "i");
	_replaceReg = new RegExp(",,", "i");
	var s = new String();
	
	if (val = kescoParams_get(_treeTemplateName))
		s = val[2];
	else
		s = cExpNodesServer;
	
	s = s.replace(" ", "");
	if (id == 0)
	{
		pNode.setAttribute('expanded', 'true');
		nodeArray = pNode.getChildren();
		kescoTree_CollapseChildren(nodeArray);
		kescoParams_set(_treeTemplateName,' ');
	}
	else
	{
		if (action)
		{	
			if (s.match(reg) == null)
			{
				if (s.length ==0)
					s = id;
				else
					s = s + ',' + id;
			}
			
		}
		else
		{
			s = s.replace(s.match(reg),"");
			if (_replaceReg.test(s))
				s = s.replace(s.match(_replaceReg), ",");
			if (_clearReg.test(s))
				s = s.replace(s.match(_clearReg), "");
		}
		if (s.length == 0) s= ' ';
			
		kescoParams_set(_treeTemplateName,s);
	}
}


function kescoTree_ChildrenCheck(nodeArray, parentValue)
{
	for (var i = 0; i < nodeArray.length; i++)
	{
		if (nodeArray[i].getAttribute('Checked'))
			kescoTree_SetCBox(nodeArray[i], !parentValue);
		objArr = nodeArray[i].getChildren();
		if (objArr != null)
			kescoTree_ChildrenCheck(objArr, parentValue);
	}
}


function kescoTree_SetCBox(node,CBoxValue)
{

	var t = new RegExp("ok.gif$","ig");
	if (t.test(node.getAttribute('imageUrl')))
		cValue = true;
	else
		cValue = false;
	
	if (CBoxValue != null)
		node.setAttribute("checked",CBoxValue);
	else
		node.setAttribute("checked",!cValue);
	
	kescoTree_SaveBoxState(node.getAttribute('ID'), node.getAttribute('text'));
	
	t = new RegExp("(^|,)\\s{0,}" + node.getAttribute('ID')+ "\\s{0,}($|,)");
	
	if (CBoxValue == null)
		if (cValue)
		{	
			if (t.test(cNodesFromQString))
				node.setAttribute('imageUrl',delGif);
			else
				node.setAttribute('imageUrl',null);
		}
		else
			node.setAttribute('imageUrl',okGif);
	else
	{
		if (CBoxValue)
			node.setAttribute('imageUrl',okGif);
		else
		{	
			if (t.test(cNodesFromQString))
				node.setAttribute('imageUrl',delGif);
			else
				node.setAttribute('imageUrl',null);
		}
	}
}


/*
function kescoTree_Save()
{
	var _retval = "-1"+String.fromCharCode(31)+"";
	if (!(val = kescoParams_get("return"))) return;
	
	val = val[2];
	
	if (val == 1)
		DialogPageReturn(_retval,0);
	else
	{
		if (kescoTree_selectedID != "")
			_retval = kescoTree_selectedID;
		
	
		DialogPageReturn(_retval,0);
	}
	
}
*/

function kescoTree_Save()
{
	var _retval = "-1"+String.fromCharCode(31)+"";
	if (!(val = kescoParams_get("return"))) return;
	
	val = val[2];
	
	if (val != 1) {
		if (kescoTree_selectedID != "")
			_retval = kescoTree_selectedID;
	}

	var _mvc = kescoParams_get("mvc");
	_mvc = (_mvc == null)? 0 : 1;
	if (_mvc) {
		var result = [];
		if(_retval) {
			var parsed = (""+_retval).split(String.fromCharCode(30));
			for (var i=0; i<parsed.length; i++) {
				var item = parsed[i].split(String.fromCharCode(31));
				if (item[0] != "-1") {
					result[result.length] = { value: item[0], label:item[1]};
				}
			}
		}
		returnMvcDialogResult(result, _mvc[2]!="1");
	} else {
		DialogPageReturn(_retval,0);
	}
	
}


function XORValueInString(targetString,value)
{
	var tString = new String();
	tString = targetString;
	if (tString=="" || tString==null)
		tString = value;
	else
	{
		var r = new RegExp("(^|" +String.fromCharCode(30)+ ")" + value + "($|" +String.fromCharCode(30)+ ")");
		if (r.test(tString))
		{	
			tString = tString.replace(r,function(a,b,c)
									{	
										if ((b == String.fromCharCode(30)) && (c == String.fromCharCode(30))) 
										{
											ret = String.fromCharCode(30);
										}
										else 
											ret = ''; 
										return ret;
									});
		}
		else
			tString += String.fromCharCode(30)+value;
	}
	return tString;
}



function kescoTree_SaveBoxState(id, text)
{
	text = kescoString_trim(text);
	
	kescoTree_selectedID = XORValueInString(kescoTree_selectedID, id+String.fromCharCode(31)+text);
	
}



function kescoTree_CollapseChildren(nodeArray)
{

	for (var i = 0; i < nodeArray.length; i++)
		{	
			nodeArray[i].setAttribute('expanded', 'false');
			objArr = nodeArray[i].getChildren();
			if (objArr != null)
				kescoTree_CollapseChildren(objArr);
		}
}

function kescoTree_ExpandChildren(nodeArray)
{

	for (var i = 0; i < nodeArray.length; i++)
		{	
			nodeArray[i].setAttribute('expanded', 'true');
			objArr = nodeArray[i].getChildren();
			if (objArr != null)
				kescoTree_ExpandChildren(objArr);
		}
}


var _dlgRez=0;
var _parentAction=0;
var _retVal;




function fnSetRetValue(x)
{
		SetDlgRez(x);
		SetParentAction(0);	
		parent.window.opener = this;
		parent.window.close();	
}




function ReadCookieIds(s)
{

arr = new Array();
var ret= new String();
var pat = new RegExp("(?:^|%1E|" +String.fromCharCode(30) + ")([\\d]+)(?:" +String.fromCharCode(30) + "|" +String.fromCharCode(31) + "|%1E|%1F|$)","gi");
ret="";
while(arr = pat.exec(s))
{
	ret += "," + arr[1];
}
if (ret !="") ret=ret.substring(1);
return ret;
}


function DialogPageOpen(url,params)
{
	params='center:yes;status:no;help:no;resizable:yes;'
			+(params==null?'':params);
	
	
	var r;
	var x = new String();
	x=url;

	if (document.getElementById("divWait")!=null)	document.getElementById("divWait").style.visibility="visible";


	window.showModalDialog(url,null,params);
	
	
	_dlgRez=getCookie("DlgRez");
	_parentAction=getCookie("ParentAction");
	_retVal=getCookie("RetVal");

	
	SetDlgRez(0);
		
	
	
	

	
	
	
	
	if (_dlgRez>0)
	switch(GetParentAction())
	{
		case '1': 
			document.forms(0).submit();
			break;
		case '2': 
			window.opener=this;window.close();
			break;
	}
	if (document.getElementById("divWait")!=null)	document.getElementById("divWait").style.visibility="hidden";
}

function DialogPageReturn(retVal,parentAction)
{
	SetDlgRez(1);
	SetRetVal(retVal);
	SetParentAction(parentAction==null?0:parentAction);
	
	var version = parseFloat(navigator.appVersion.split('MSIE')[1]);
	if (version<7)
		window.opener=this;
	else
		window.open('','_parent','');
	
	window.close();
}

function getCookie(name)
{ 
	var bikky = document.cookie;
	var index = bikky.indexOf(name + "=");
	if (index == -1) return null;
	index = bikky.indexOf("=", index) + 1; 
	var endstr = bikky.indexOf(";", index);
	if (endstr == -1) endstr = bikky.length; 
	return unescape(bikky.substring(index, endstr));
}





function GetDlgRez()
{
	return _dlgRez;
}
function SetDlgRez(dlgRez) {
    document.cookie = 'DlgRez=' + dlgRez + ';domain=' + kescoDomain + ';path=/';
}


function GetParentAction()
{
	return _parentAction;
}
function SetParentAction(parentAction) {
    document.cookie = 'ParentAction=' + parentAction + ';domain=' + kescoDomain + ';path=/';
}


function GetRetVal()
{
	return _retVal;
}
function SetRetVal(retVal) {
 	var r = new RegExp("[^0-9a-z\\s"+ String.fromCharCode(160) +"]{1,}","ig"); 
	retVal = retVal.replace(r,function($1) {return escape($1);});
	document.cookie = 'RetVal=' + retVal + ';domain=' + kescoDomain + ';path=/';
}







function kescoWindow_Init()
{
	

	
}



function Document_OnKeyPress()
{
	switch(window.event.keyCode)
	{
		case 27: 
			if (window.dialogLeft == null) break;
			
			if (parent == null)
				window.close();
			else
				{
					parent.window.opener=this;
					parent.window.close();
				}
			break;
	}
}

function kescoWindow_onkeydown()
{
	switch(event.keyCode)
	{
		case 8: 
			if(isInDocView) 
			{	
				var inp=document.activeElement;
				window.event.returnValue=
				(
					inp!=null && 
					( 
						(inp.tagName=='INPUT' && inp.type=='text') ||
						(inp.tagName=='TEXTAREA')
					) &&
					inp.readOnly==false
				);
			}
		    return;
		case 27:
			event.returnValue=false;
		case 114:
			if (event.ctrlKey)	alert(kescoParams_xml.xml);
			break;
		default:
		
			break;
	}
}

function kescoWindow_onbeforeunload()
{
	if (document.useParameters!=false) kescoParams_save();
}


function kescoWindow_onerror(sMsg,sUrl,sLine)
{
	if(RegExp('https','ig').test(sUrl)) return;
	
	var i;
	var r = new RegExp("function[ ]{1,}([0-9a-z_]{1,})[^0-9a-z_]","i");
	var obj=arguments.caller;
	var s="";
	var m;
	var fbody=(obj!=null)?obj.callee:'';
	while(obj!=null)
	{
		args=''
		for(i=0;i<obj.length;i++)
			args+=(i>0?',':'')+obj[i];
		
		m=r.exec(obj.callee);
		s=(((m instanceof Array)&&(m.length>1))?m[1]:'?')+'('+args+')\n\t'+s
		
		
		obj=obj.caller;
	}
	sendMail('Error in '+sUrl+' at line '+sLine+'\nDescription:'+sMsg+'\n\nstack trace:\n\t'+s+'\n\n'+fbody);
	return false;
}

function silverError(type, message)
{
	kescoWindow_onerror(message)
}

function kescoWindow_navigate(url)
{
	var a = document.createElement('A');
	a.href=url;
	document.body.appendChild(a);
	a.click();
}
function replace4Like(param)
{
	param=param.replace("'","''");
	param=param.replace("[","[[]");
	param=param.replace("_","[_]");
	param=param.replace("%","[%]");
	param=param.replace(String.fromCharCode(9)," ");
	param=param.replace(String.fromCharCode(13)," ");
	param=param.replace(String.fromCharCode(10)," ");
	param=param.replace(String.fromCharCode(160)," ");
	
	var r =new RegExp("^[ ]+|[ ]+$","gi");
	param=param.replace(r,"");
	var r =new RegExp("[ ]{2,}","gi");
	param=param.replace(r," ");
	
	return param;
}

function checkNecessaryFields()
{
	var i;
	var obj;
	for(i=0;i<document.all.length;i++)
	{
		obj=document.all[i];
		if (obj.allownulls==false) 
			if ((''+obj.value)=='')
			{
				alert('\u041D\u0435\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u043F\u043E\u043B\u0435 \"'+ ((obj.caption==null)?obj.id:obj.caption)+'\" '+ obj.value+'!');
				try
				{
					obj.setFocus();
				}
				catch(e)
				{
					sendMail(e.description);
				}
				return false;
			}	
	}
	return true;
}



var wsdirectArr = new Array(50); 

var wsdirectArrIndex=0;
function wsdirectArrPush(obj)
{
	wsdirectArr[wsdirectArrIndex]=obj;
	wsdirectArrIndex++;
	if (wsdirectArrIndex>=wsdirectArr.length) wsdirectArrIndex=0;
}

function wsdirect(url,func,args,callback,obj)
{
   var i;
   var objHTTP = new ActiveXObject(xmlhttpProgID);
   var doc = new ActiveXObject(DOMDocument_ProgID);
   var envelopeElement = doc.createElement("SOAP-ENV:Envelope");
   envelopeElement.setAttribute("xmlns","");
   envelopeElement.setAttribute("xmlns:xsd","http://www.w3.org/2001/XMLSchema");
   envelopeElement.setAttribute("xmlns:http","http://schemas.xmlsoap.org/wsdl/http/");
   envelopeElement.setAttribute("xmlns:soap","http://schemas.xmlsoap.org/wsdl/soap/");
   envelopeElement.setAttribute("xmlns:s","http://www.w3.org/2001/XMLSchema");
   envelopeElement.setAttribute("xmlns:s0","http://tempuri.org/");
   envelopeElement.setAttribute("xmlns:soapenc","http://schemas.xmlsoap.org/soap/encoding/");
   envelopeElement.setAttribute("xmlns:tm","http://microsoft.com/wsdl/mime/textMatching/");
   envelopeElement.setAttribute("xmlns:mime","http://schemas.xmlsoap.org/wsdl/mime/");
   envelopeElement.setAttribute("xmlns:wsdl","http://schemas.xmlsoap.org/wsdl/");
   envelopeElement.setAttribute("xmlns:SOAP-ENV","http://schemas.xmlsoap.org/soap/envelope/");
   envelopeElement.setAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");

   var bodyElement = doc.createElement("SOAP-ENV:Body");
 
   var funcElement = doc.createElement(func);
   funcElement.setAttribute("xmlns","http://tempuri.org/");
   var argElement;
   
   if (args!=null)
		for(i=0;i<args.length;i=i+2)
		{
			argElement = doc.createElement(args[i]);
			argElement.text=args[i+1];
			funcElement.appendChild(argElement);
		}
	bodyElement.appendChild(funcElement);
	envelopeElement.appendChild(bodyElement);
	doc.appendChild(envelopeElement);
	
   try
   {
		objHTTP.open("POST", url, (callback!=null));
		objHTTP.setRequestHeader('soapaction','"http://tempuri.org/'+func+'"');
		objHTTP.setRequestHeader('Content-Type','text/xml; charset="UTF-8"');
		
		if (callback!=null) 
		{
			var x = new Object();
			x.objHTTP=objHTTP;
			x.request="<?xml version='1.0' encoding='utf-8'?>\n"+doc.xml;
			x.url=url;
			x.func=func;
			x.callback=callback;
			x.obj=obj;
		
			wsdirectArrPush(x);
			
			objHTTP.onreadystatechange=wsdirectResult;
		}
		
		objHTTP.send("<?xml version='1.0' encoding='utf-8'?>\n"+doc.xml);
		
		if (callback!=null) return null;
		else return wsdirectObj(objHTTP,func,url,"<?xml version='1.0' encoding='utf-8'?>\n"+doc.xml);
	}
	catch(e)		
	{
		
		wsdirect_registerError(21,url,doc.xml)
		
		var ret = new Object();
		ret.error=21;
        ret.errorMsg=kescoErrors[21];
		
		if (callback!=null) callback(ret,obj);
		else return ret;
	}
		
}



function wsdirectObj(objHTTP,func,url,request)
{
	var i;
	var ret=new Object();
  	
	var r=RegExp('200|500','gi');
	if (!r.test(objHTTP.status))
	{
			wsdirect_registerError(22,url,request,objHTTP)
			ret.error=22;
			ret.errorMsg=kescoErrors[22];
			return ret;
	}
		
	var objDoc = objHTTP.responseXML;
	var nd=objDoc.selectSingleNode('\u002A/\u002A/\u002A');
	
	if (nd==null)
	{
		wsdirect_registerError(22,url,request,objHTTP)
		ret.error=22;
		ret.errorMsg=kescoErrors[22];
		return ret;
	}
	
	
	if (nd.nodeName=='soap:Fault')
	{
			wsdirect_registerError(23,url,request,objHTTP)
			ret.error=23;
			ret.errorMsg=nd.childNodes[1].nodeTypedValue;
			return ret;
	}
	

	if (nd.nodeName==func+'Response')
	{
		
		ret.error=0;
		for(i=0;i<nd.childNodes.length;i++)
		{
			if (i==0) ret.value=nd.childNodes[i].nodeTypedValue;
			wsdirectSetParam(ret,nd.childNodes[i].nodeName,nd.childNodes[i].nodeTypedValue);
		}
		return ret;
	}	

	wsdirect_registerError(24,url,request,objHTTP)
	ret.error=24;
	ret.errorMsg=kescoErrors[24];
	return ret;
}

var wsdirectSetParamObj;
var wsdirectSetParamName;
var wsdirectSetParamValue;
function wsdirectSetParam(obj,name,value)
{
	wsdirectSetParamObj=obj;
	wsdirectSetParamName=name;
	wsdirectSetParamValue=value;
 	try
 	{
 		window.execScript('wsdirectSetParamObj.'+wsdirectSetParamName+'=wsdirectSetParamValue;',"javascript");
 	}
 	catch(e)
 	{
 		alert('\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u0438\u0441\u0432\u043E\u0438\u0442\u044C \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0443 ['+wsdirectSetParamName+
 		'] \u043E\u0431\u044A\u0435\u043A\u0442\u0430 ['+wsdirectSetParamObj+'] \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 ['+wsdirectSetParamValue+']\n'+
 		'\u0444\u0443\u043D\u043A\u0446\u0438\u044F: wsdirectSetParam\n'+e.description);
 	}
}
function wsdirectResult(arg)
{
	var i;
	for(i=0;i<wsdirectArr.length;i++)
	{
		
		
		if (wsdirectArr[i]==null) continue;
		if (wsdirectArr[i].objHTTP.readyState!=4) continue;
		if (wsdirectArr[i].callback==null) continue; 
		
		var url=wsdirectArr[i].url;
		var func=wsdirectArr[i].func;
		var objHTTP=wsdirectArr[i].objHTTP;
		var callback=wsdirectArr[i].callback;
		var request=wsdirectArr[i].request;
		var obj=wsdirectArr[i].obj;
		wsdirectArr[i]=null;
		
		var ret=wsdirectObj(objHTTP,func,url,request);
		callback(ret,obj)
	}
}


function wsdirect_registerError(code,url,request,objHTTP)
{
	
	var body='Service error: '+code+'('+kescoErrors[code]+')';
	body+='\n\nurl '+kescoString_trim(url);
	
	if (request!=null)
	{
		body+='\n\rREQUEST:'
		body+='\n\r'+request;
	
	}
	if (objHTTP!=null)
	{
		body+='\n\rRESPONSE:'
		body+='\n\r'+objHTTP.status+' '+objHTTP.statusText;
		body+='\n\r'+objHTTP.getAllResponseHeaders();
		body+=objHTTP.responseText;
	}
		
	sendMail(body);
}
function wsdirectCollectValues()
{
	
	var doc=new ActiveXObject(DOMDocument_ProgID);
	var parameter;
	var i;
	var j;
	var arg;
	doc.appendChild(doc.createElement("Parameters"));
	
	for(i=0;i<document.all.length;i++)
	{
		if (document.all[i].getAttribute('value')==document.all[i].getAttribute('value0')) continue;
		
		parameter=doc.createElement("Parameter");
		for(j=0;j<arguments.length;j++)
		{
			arg=document.all[i].getAttribute(arguments[j]);
			if (arg==null) continue;
			parameter.setAttribute(arguments[j],arg);
		}
		if (parameter.attributes.length!=arguments.length) continue;
		doc.documentElement.appendChild(parameter);
	}
	return doc.xml;
}


function sendMail(body,subj)
{
	try {
	    
	    var url = 'http://' + settingsServer + '.' + kescoDomain + '/settings/SendMail.aspx';
		if(RegExp('https','ig').test(location.href))
		    url = 'https://' + settingsServer + '.' + kescoDomain + '/settings/SendMail.aspx';
		
		var e;
		subj=(subj==null)?document.location.href.replace(document.location.search,''):subj;
		body=(body==null)?'':kescoString_trim(body);
   		
		var objHTTP = new ActiveXObject(xmlhttpProgID);
		body = 'subject=' + subj
			+ '&body=' + body;
			
		objHTTP.open("POST", url, false);
		objHTTP.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=utf-8');
		//objHTTP.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		objHTTP.send(body);
	}
	catch(e)
	{
		window.status="error sendMail: "+e.description;
	}
	if(!RegExp('https','ig').test(url))
		document.execCommand("ClearAuthenticationCache");
}

function debug(obj)
{
	var doc = window.open().document;
	switch(obj.kescoType)
	{
		case 'main':	debug_kescoMain(doc,obj);	break;	
		case 'wsdls':	kescoQueueDebug(doc,obj);	break;	
		case 'param':	debug_Param(doc,obj);	break;	
	}
	doc.writeln("<hr size=1>");
	doc.writeln(new Date());
}
function debug_kescoMain(doc,obj)
{
	doc.writeln("<h3>kesco</h3><pre>");
	doc.writeln(".root: "+kesco.root); 
	
	doc.writeln(".wsdl: <a href='javascript:window.opener.debug(window.opener.top.kesco.wsdl);'>"+kesco.wsdl+"</a>");
	doc.writeln(".param: <a href='javascript:window.opener.debug(window.opener.top.kesco.param);'>"+kesco.param+"</a>");
	doc.writeln("</pre>");
	
}

function debug_Param(doc,obj)
{
	doc.writeln("<h3>kesco.param</h3>");
	doc.writeln("<pre>");
	doc.writeln(".wsdl: "+obj.wsdl);
	
	doc.writeln("</pre>");

}

function kescoQueueDebug(doc, obj)
{
	var i;
	doc.writeln("<h3>kesco.wsdl</h3>");
	doc.writeln("<pre>");
	doc.writeln(".wsdls.length()\t"+obj.wsdls.length());
	doc.writeln(".htcReady\t"+obj.htcReady);
	
	doc.writeln("<table>");
	for(i=0;i<obj.wsdls.arr.length;i++)
		kescoQueueDebugWSDL(doc, obj, i);
	doc.writeln("</table>");

	doc.writeln("</pre>");
}

function kescoQueueDebugWSDL(doc, obj, i)
{
	var wsdls = obj.wsdls;
	var wsdl = wsdls.arr[i];
	var index = obj.idByWsdl(wsdl);
	
	
	var state = obj.stArr[index];
	var cb = obj.cbArr[index];
	var style = (i<=wsdls.deIndex)?"color:green":"";
	
	doc.writeln("<tr>");
	doc.writeln("<td style='"+style+"'>"+wsdl+"<td>");
	doc.writeln("<td>"+index+"<td>");
	doc.writeln("<td>"+state+"<td>");
	doc.writeln("<td>");
	kescoQueueDebugCallBacks(doc,cb);
	doc.writeln("</td>");
	
	doc.writeln("</tr>");

}
function kescoQueueDebugCallBacks(doc, cb)
{
	var i;
	var style;
	var title;
	var r = new RegExp('"',"gi");
	
	for(i=0;i<cb.arr.length;i++)
	{
		style=(i<cb.deIndex)?"color:green":"";
		title=(new String(cb.arr[i][0])).replace(r,"&quot;");
		
		doc.write("<span style='"+style+"' title=\""+title+"\">["+i+"]</span>");
	}
		doc.write(" (");
		doc.write(cb.deIndex);
		doc.write("/");
		doc.write(cb.arr.length);
		doc.write(")");
}
function debug_function(doc,obj)
{
	var r = new RegExp('"',"gi");
	doc.writeln("<pre>");
	doc.writeln((new String(obj)).replace(r,"&quot;"));
	doc.writeln("</pre>");
}




function DivWaitShow()
{
	var div=document.createElement("DIV");
	div.id="kescoDivWait";
	div.style.position="absolute";
	div.style.top=10+document.body.scrollTop;
	div.style.left=10+document.body.scrollLeft;
	
	div.innerText="\u041F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435...";
	div.style.cursor="wait";
	document.body.insertBefore(div);
	
	document.body.style.visibility='hidden';
	div.style.visibility="visible";
	document.body.style.cursor='wait';
}

function DivWaitHide()
{
	document.body.style.visibility='visible';
	document.body.style.cursor='default';
	
	if (document.getElementById("kescoDivWait")!=null) document.body.removeChild(document.getElementById("kescoDivWait"));
}

var srv4js_ctrl = null;
var srv4js_func;
var srv4js_args;
var srv4js_callback;
var srv4js_obj;
var srv4js_rez;


function srv4js(func, args, callback, obj) {
    srv4js_func = func;
    srv4js_args = args;
    srv4js_callback = callback;
    srv4js_obj = obj;

    if (srv4js_ctrl == null) {
        var _bodyTags = document.getElementsByTagName("body");
        if (_bodyTags.length == 0) {
            alert("Не найден тэг BODY! Перезагрузите страницу!");
            return;
        }
        var _body = _bodyTags[0];
        var _div = document.createElement("DIV");
        _div.id = "kesco_silverHost";
        _body.appendChild(_div);

		var ip = "";

        try {
            ip = kesco_ip;
        }
        catch (e) { }
		
        Silverlight.createObject(
            "/styles/Silver4JS.xap?v=1.0.0.0", 	// source
            kesco_silverHost, 			// parent element
            "silver4js_obj", 			// id for generated object element
            {width: "1px", height: "1px" },
            { onLoad: srv4js_LoadCtrl },
            "ipAddress=" + ip,
            "context"						// context helper for onLoad handler.
        );
    }
    else
        srv4js_call();
}

function srv4js_LoadCtrl(sender, args) {

    srv4js_ctrl = sender;
    srv4js_call();
}


function srv4js_call()
{
    var obj = srv4js_ctrl.Content.SL2JS;
	var i;
	srv4js_rez = new Object();
	srv4js_rez.error=0;
	srv4js_rez.value="23";
	try
	{	
		if (obj.wait==1) throw new Error(10101,'\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043E\u0434\u0438\u043D \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442.\n\u041D\u0435\u043B\u044C\u0437\u044F \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u0432\u044B\u0431\u0438\u0440\u0430\u0442\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432.');
				
		srv4js_rez.value=obj.Execute(srv4js_func,srv4js_args);
				
		if (srv4js_rez.value == "WAIT")
		{ 
			window.setTimeout('srv4js_checkWait();', 250); 
			return;
		}
	}
	catch(e)
	{
		srv4js_rez.error=1
		srv4js_rez.errorMsg=e.description;
	}
	if (srv4js_callback!=null) srv4js_callback(srv4js_rez,srv4js_obj);
}
function srv4js_checkWait()
{
    var obj = srv4js_ctrl.Content.SL2JS;

	if (obj.wait==1) 
	{
		window.setTimeout('srv4js_checkWait();', 250);  
		return;
	}
		
	srv4js_rez.value=obj.buffer;
	if (srv4js_callback!=null) srv4js_callback(srv4js_rez,srv4js_obj);
	if(!isInDocView) window.focus();
}

function srv4js_start(fileName,args)
{
	fileName=kescoString_trim(fileName);
	args=kescoString_trim(args);
	srv4js('RUN','fileName='+encodeURI(fileName)+'&arguments='+encodeURI(args));
}

function srv4js_startExt(fileName,args,wStyle)
{
	fileName=kescoString_trim(fileName);
	args=kescoString_trim(args);
	wStyle=kescoString_trim(wStyle)
	srv4js('RUN','fileName='+encodeURI(fileName)+'&arguments='+encodeURI(args)+'&wStyle='+encodeURI(wStyle));
}

function docView_show(id)
{
	srv4js("OPENDOC","id="+id+"&newwindow=1",docView_show_result,null);
}
function docView_show_result(rez,obj)
{
	if (rez.error) alert(rez.errorMsg);
}function IPrintView_onbeforeprint()
{

	var i;
	for(i=0;i<document.all.length;i++)
	{
		obj=document.all[i];
		if (obj.setPrintView==null) continue;
		if (obj.resetPrintView==null) continue;
		obj.setPrintView();
	}
}
function IPrintView_onafterprint()
{
	var i;
	for(i=0;i<document.all.length;i++)
	{
		obj=document.all[i];
		if (obj.setPrintView==null) continue;
		if (obj.resetPrintView==null) continue;
		obj.resetPrintView();
	}
}


var hexcase = 0;  
var b64pad  = ""; 
var chrsz   = 16;  


function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }


function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}


function core_md5(x, len)
{
  
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}


function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}


function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}


function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}


function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}


function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}


function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}


function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}


function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

function Kesco_ClientToLocalTime(instr, format, lang)
{
  var re = /^([1][9]|[2][0-9])([0-9][0-9])(-([0][1-9]|[1][0-2]|[0-9]))(-([0-2][0-9]|[3][0-1]|[0-9]))( ([0-1][0-9]|[2][0-3]|[0-9]))(:([0-5][0-9]|[0-9]))(:([0-5][0-9]|[0-9]))$/i;

  if (re.test(instr)) { // проверка входной строки регулярным выражением
  	var arrdatetime = instr.toString().split(' ');
				var d = new Date();
  
			if ((arrdatetime[0])!=null)
			{
				var arrdate = arrdatetime[0].split('-');
				d.setYear(arrdate[0]);
				d.setUTCMonth(arrdate[1]-1);
				d.setUTCDate(arrdate[2]);
			}
  	
			if ((arrdatetime[1])!=null)
			{
				var arrtime = arrdatetime[1].split(':');
				d.setUTCHours(arrtime[0]);
				d.setUTCMinutes(arrtime[1]);
				d.setUTCSeconds(arrtime[2]);
			}

			var hours = d.getHours().toString();
			if ( hours.length == 1 ) hours = '0' + hours;

			var minutes = d.getMinutes().toString();
			if ( minutes.length == 1 ) minutes = '0' + minutes;

			var seconds = d.getSeconds().toString();
			if ( seconds.length == 1 ) seconds = '0' + seconds;

			var day = d.getDate().toString();
			if ( day.length == 1 ) day = '0' + day;

			var month = ((d.getMonth())+1).toString();
			if ( month.length == 1 ) month = '0' + month;

			var dayofweek = d.getDay();

			format = format.replace(new RegExp('dd','g'), day);
			format = format.replace(new RegExp('mm','g'), month);
			format = format.replace(new RegExp('hh','g'), hours);
			format = format.replace(new RegExp('mi','g'), minutes);
			format = format.replace(new RegExp('ss','g'), seconds);
		
		
			if (d.getYear().toString().length>2)     
			{
				format = format.replace(new RegExp('yyyy','g'), d.getYear().toString()); 
				format = format.replace(new RegExp('yy','g'), d.getYear().toString().substring(2,4));
			}
			else if (d.getYear().toString().length>1) 
			{
				format = format.replace(new RegExp('yyyy','g'), '19' + d.getYear().toString());
				format = format.replace(new RegExp('yy','g'), d.getYear().toString());
			}
			else 
			{
				format = format.replace(new RegExp('yyyy','g'), '190' + d.getYear().toString()); 
				format = format.replace(new RegExp('yy','g'), '0' + d.getYear().toString());
			} 
		
			var monthFull, monthShort, monthFullG;
			monthFullG = '';

			if ( lang == 'en' ) 
			{
				switch (month)
				{
					case '01':
						monthFull = 'January';
						monthFullG = 'January';
						monthShort = 'Jan';
						break
					case '02':
						monthFull = 'February';
						monthFullG = 'February';
						monthShort = 'Feb';
						break
					case '03':
						monthFull = 'March';
						monthFullG = 'March';
						monthShort = 'Mar';
						break
					case '04':
						monthFull = 'April';
						monthFullG = 'April';
						monthShort = 'Apr';
						break
					case '05':
						monthFull = 'May';
						monthFullG = 'May';
						monthShort = 'May';
						break
					case '06':
						monthFull = 'June';
						monthFullG = 'June';
						monthShort = 'Jun';
						break
					case '07':
						monthFull = 'July';
						monthFullG = 'July';
						monthShort = 'Jul';
						break
					case '08':
						monthFull = 'August';
						monthFullG = 'August';
						monthShort = 'Aug';
						break
					case '09':
						monthFull = 'September';
						monthFullG = 'September';
						monthShort = 'Sept';
						break
					case '10':
						monthFull = 'October';
						monthFullG = 'October';
						monthShort = 'Oct';
						break
					case '11':
						monthFull = 'November';
						monthFullG = 'November';
						monthShort = 'Nov';
						break
					case '12':
						monthFull = 'December';
						monthFullG = 'December';
						monthShort = 'Dec';
						break
						}
				switch (dayofweek)
				{
					case 0:
						dayFull = 'Sunday';
						dayShort = 'Sun';
						break
					case 1:
						dayFull = 'Monday';
						dayShort = 'Mon';
						break
					case 2:
						dayFull = 'Tuesday';
						dayShort = 'Tue';
						break
					case 3:
						dayFull = 'Wednesday';
						dayShort = 'Wed';
						break
					case 4:
						dayFull = 'Thursday';
						dayShort = 'Thu';
						break
					case 5:
						dayFull = 'Friday';
						dayShort = 'Fri';
						break
					case 6:
						dayFull = 'Saturday';
						dayShort = 'Sat';
						break
						}
			}
			else    
			{
				switch (month)
				{
					case '01':
						monthFull = 'Январь';
						monthFullG = 'Января';
						monthShort = 'Янв';
						break
					case '02':
						monthFull = 'Февраль';
						monthFullG = 'Февраля';
						monthShort = 'Фев';
						break
					case '03':
						monthFull = 'Март';
						monthFullG = 'Марта';
						monthShort = 'Мар';
						break
					case '04':
						monthFull = 'Апрель';
						monthFullG = 'Апреля';
						monthShort = 'Апр';
						break
					case '05':
						monthFull = 'Май';
						monthFullG = 'Мая';
						monthShort = 'Май';
						break
					case '06':
						monthFull = 'Июнь';
						monthFullG = 'Июня';
						monthShort = 'Июн';
						break
					case '07':
						monthFull = 'Июль';
						monthFullG = 'Июля';
						monthShort = 'Июл';
						break
					case '08':
						monthFull = 'Август';
						monthFullG = 'Августа';
						monthShort = 'Авг';
						break
					case '09':
						monthFull = 'Сентябрь';
						monthFulGl = 'Сентября';
						monthShort = 'Сент';
						break
					case '10':
						monthFull = 'Октябрь';
						monthFullG = 'Октября';
						monthShort = 'Окт';
						break
					case '11':
						monthFull = 'Ноябрь';
						monthFullG = 'Ноября';
						monthShort = 'Ноя';
						break
					case '12':
						monthFull = 'Декабрь';
						monthFullG = 'Декабря';
						monthShort = 'Дек';
						break
						}
				switch (dayofweek)
				{
					case 0:
						dayFull = 'Воскресенье';
						dayShort = 'Вск';
						break
					case 1:
						dayFull = 'Понедельник';
						dayShort = 'Пн';
						break
					case 2:
						dayFull = 'Вторник';
						dayShort = 'Вт';
						break
					case 3:
						dayFull = 'Среда';
						dayShort = 'Ср';
						break
					case 4:
						dayFull = 'Четверг';
						dayShort = 'Чт';
						break
					case 5:
						dayFull = 'Пятница';
						dayShort = 'Пт';
						break
					case 6:
						dayFull = 'Суббота';
						dayShort = 'Сб';
						break
						}
			}
  
			format = format.replace(new RegExp('Monthg','g'), monthFullG);
			format = format.replace(new RegExp('monthg','g'), monthFullG.toLowerCase());
    
			format = format.replace(new RegExp('Month','g'), monthFull);
			format = format.replace(new RegExp('month','g'), monthFull.toLowerCase());
    
			format = format.replace(new RegExp('Mon','g'), monthShort);
			format = format.replace(new RegExp('mon','g'), monthShort.toLowerCase());
    
			format = format.replace(new RegExp('Dof','g'), dayShort);
			format = format.replace(new RegExp('dof','g'), dayShort.toLowerCase());
    
			format = format.replace(new RegExp('Dayofweek','g'), dayFull);
			format = format.replace(new RegExp('dayofweek','g'), dayFull.toLowerCase());
  
			return(format);
		}
		return 'Incorrect date format';
	}


/* http://www.JSON.org/json2.js */
var JSON;
if (!JSON) {
	JSON = {};
}

(function () {
	"use strict";

	function f(n) {
		return n < 10 ? '0' + n : n;
	}

	if (typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function (key) {

			return isFinite(this.valueOf()) ?
				this.getUTCFullYear()	 + '-' +
				f(this.getUTCMonth() + 1) + '-' +
				f(this.getUTCDate())	  + 'T' +
				f(this.getUTCHours())	 + ':' +
				f(this.getUTCMinutes())   + ':' +
				f(this.getUTCSeconds())   + 'Z' : null;
		};

		String.prototype.toJSON	  =
			Number.prototype.toJSON  =
			Boolean.prototype.toJSON = function (key) {
				return this.valueOf();
			};
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap,
		indent,
		meta = {	// table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		rep;

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string' ? c :
				'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}

	function str(key, holder) {

		var i,		// The loop counter.
			k,		// The member key.
			v,		// The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

		if (value && typeof value === 'object' &&
				typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

		switch (typeof value) {
		case 'string':
			return quote(value);
		case 'number':
			return isFinite(value) ? String(value) : 'null';
		case 'boolean':
		case 'null':
			return String(value);
		case 'object':
			if (!value) {
				return 'null';
			}
			gap += indent;
			partial = [];
			if (Object.prototype.toString.apply(value) === '[object Array]') {
				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || 'null';
				}
				v = partial.length === 0 ? '[]' : gap ?
					'[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
					'[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}

			if (rep && typeof rep === 'object') {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					k = rep[i];
					if (typeof k === 'string') {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			} else {

				for (k in value) {
					if (Object.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			}

			v = partial.length === 0 ? '{}' : gap ?
				'{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
				'{' + partial.join(',') + '}';
			gap = mind;
			return v;
		}
	}

	if (typeof JSON.stringify !== 'function') {
		JSON.stringify = function (value, replacer, space) {

			var i;
			gap = '';
			indent = '';

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

			} else if (typeof space === 'string') {
				indent = space;
			}

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
					(typeof replacer !== 'object' ||
					typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

			return str('', {'': value});
		};
	}

	if (typeof JSON.parse !== 'function') {
		JSON.parse = function (text, reviver) {

			var j;

			function walk(holder, key) {

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}


			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

			if (/^[\],:{}\s]*$/
					.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
						.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
						.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

				j = eval('(' + text + ')');

				return typeof reviver === 'function' ?
					walk({'': j}, '') : j;
			}

			throw new SyntaxError('JSON.parse');
		};
	}
}());

(function() {
	var _origParse = JSON.parse;

	JSON.parse = function(text) {
		return _origParse(text, function(key, value) {
		var a;

		if (typeof value === 'string') {
			a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);

			if (a)
				return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));

			a = /^\/Date\((-?[0-9]+)([\+\-\d]+)?\)\/$/.exec(value);
			if (a) {
				return new Date(parseInt(a[1], 10));
			}

			if (value.slice(0, 5) === 'Date(' && value.slice(-1) === ')') {
				var d = new Date(value.slice(5, -1));

				if (d)
					return d;
			}
		}

		return value;
		});
	}
})();
