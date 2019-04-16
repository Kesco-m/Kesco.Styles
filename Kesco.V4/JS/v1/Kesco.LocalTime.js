function Kesco_toLocalTime(utcDateTime) {
    var notDateTime = new RegExp("[^0-9 :\./-]");
    var notDigit = new RegExp("[^0-9]");

    if (notDateTime.test(utcDateTime))
        return utcDateTime;

    var existDate = false, existTime = false, existMS = false;
    var yearLen = 0, monthLen = 0, dayLen = 0, hourLen = 0, minuteLen = 0, secondLen = 0, milsecLen = 0;
    var year = 1900, month = 1, monthday = 1, hour = 0, minute = 0, second = 0, milsec = 0;
    var result;

    var parts = utcDateTime.split(" ");
    for (var i = 0; i < parts.length; i++) {
        result = parts[i].match(/(\d+)/ig);
        if (parts[i].match(/[\.\/-]/ig)) {
            if (result != null && parts[i].match(/[\.]/ig)) {
                if (result.length > 0) { dayLen = result[0].length; monthday = result[0]; }
                if (result.length > 1) { monthLen = result[1].length; month = result[1]; }
                if (result.length > 2) { yearLen = result[2].length; year = result[2]; }
                existDate = true;
            }
            if (!existDate) {
                if (result != null && parts[i].match(/(\/)/ig)) {
                    if (result.length > 0) { monthLen = result[0].length; month = result[0]; }
                    if (result.length > 1) { dayLen = result[1].length; monthday = result[1]; }
                    if (result.length > 2) { yearLen = result[2].length; year = result[2]; }
                    existDate = true;
                }
            }
            if (!existDate) {
                if (result != null && parts[i].match(/(-)/ig)) {
                    if (result.length > 0) { yearLen = result[0].length; year = result[0]; }
                    if (result.length > 1) { monthLen = result[1].length; month = result[1]; }
                    if (result.length > 2) { dayLen = result[2].length; monthday = result[2]; }
                    existDate = true;
                }
            }

            if (yearLen == 2) year = 2000 + parseInt(year);
        }
        else if (parts[i].match(/[:]/ig)) {
            if (result != null && parts[i].match(/(:)/ig)) {
                if (result.length > 0) { hourLen = result[0].length; hour = result[0]; }
                if (result.length > 1) { minuteLen = result[1].length; minute = result[1]; }
                if (result.length > 2) { secondLen = result[2].length; second = result[2]; }
               
               existTime = true;
            }
            
        }
       else if (parts[i].length == 3 && !notDigit.test(parts[i])) {

            milsecLen = 3; milsec= parts[i];
            existMS = true;
        }
    }
    
    var newDate = new Date(year, month-1, monthday, hour, minute, second, milsec);
    if (newDate != "Invalid Date") {
        var localDateTime = "";
        newDate = new Date(newDate.valueOf() - (newDate.getTimezoneOffset() * 60 * 1000));
        
        if (existDate) {
            localDateTime += ('0' + newDate.getDate()).slice(-dayLen);
            localDateTime += '.' + ('0' + (newDate.getMonth() + 1)).slice(-monthLen);
            if (yearLen > 0) localDateTime += '.' + ('' + newDate.getFullYear()).slice(-yearLen);
        }
        if (localDateTime.length > 0 && existTime) localDateTime += '&nbsp;';

        if (existTime) {
            localDateTime += ('0' + newDate.getHours()).slice(-hourLen);
            localDateTime += ':' + ('0' + newDate.getMinutes()).slice(-minuteLen);
            if (secondLen > 0) localDateTime += ':' + ('0' + newDate.getSeconds()).slice(-secondLen);
            if (existMS)
                localDateTime += '&nbsp;' + ('00' + newDate.getMilliseconds()).slice(-milsecLen);    
        }
        
        return localDateTime;
    }
    
    
    return utcDateTime;
}
