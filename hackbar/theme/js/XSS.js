XSS = {
    selectionToChar: function (dbEngine, txt) {
        var charStringArray = [];
        var decimal;
        for (var c = 0; c < txt.length; c++) {
            decimal = txt.charCodeAt(c);
            charStringArray.push(decimal);
        }

        var charString = '';

        switch (dbEngine) {
            case "stringFromCharCode":
                charString = 'String.fromCharCode(' + charStringArray.join(', ') + ')';
                break;
            case "htmlChar":
                charString = '&#' + charStringArray.join(';&#') + ';';
                break;
        }
        return charString;
    }
};