export const XSS = {
  selectionToChar(dbEngine: string, txt: string): string {
    const charStringArray: number[] = [];
    for (let c = 0; c < txt.length; c++) {
      charStringArray.push(txt.charCodeAt(c));
    }
    let charString = "";
    switch (dbEngine) {
      case "stringFromCharCode":
        charString = "String.fromCharCode(" + charStringArray.join(", ") + ")";
        break;
      case "htmlChar":
        charString = "&#" + charStringArray.join(";&#") + ";";
        break;
      default:
        charString = "";
    }
    return charString;
  },
};
