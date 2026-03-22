export const SQL = {
  selectionToSQLChar(dbEngine: string, txt: string): string {
    const charStringArray: number[] = [];
    for (let c = 0; c < txt.length; c++) {
      charStringArray.push(txt.charCodeAt(c));
    }
    let charString = "";
    switch (dbEngine) {
      case "mysql":
        charString = "CHAR(" + charStringArray.join(", ") + ")";
        break;
      case "mssql":
        charString = " CHAR(" + charStringArray.join(") + CHAR(") + ")";
        break;
      case "oracle":
        charString = " CHR(" + charStringArray.join(") || CHR(") + ")";
        break;
      case "postgres":
        charString = charStringArray.map((n) => "CHR(" + n + ")").join("||");
        break;
      case "sqlite":
        charString = "CHAR(" + charStringArray.join(", ") + ")";
        break;
      default:
        charString = "";
    }
    return charString;
  },

  selectionToUnionSelect(columns: string): string {
    const n = Math.min(1000, parseInt(columns, 10));
    const colArray: number[] = [];
    for (let i = 0; i < n; i++) {
      colArray.push(i + 1);
    }
    return "UNION SELECT " + colArray.join(",");
  },

  selectionToUnionAllSelect(columns: string): string {
    const n = Math.min(1000, parseInt(columns, 10));
    const colArray: number[] = [];
    for (let i = 0; i < n; i++) {
      colArray.push(i + 1);
    }
    return "UNION ALL SELECT " + colArray.join(",");
  },

  selectionToUnionAllSelectNULL(columns: string): string {
    const n = Math.min(1000, parseInt(columns, 10));
    const colArray: string[] = [];
    for (let i = 0; i < n; i++) {
      colArray.push("NULL");
    }
    return "UNION ALL SELECT " + colArray.join(",");
  },

  selectionToInlineComments(txt: string): string {
    return txt.replace(/ /g, "/**/");
  },
};
