import { describe, expect, it } from "vitest";
import { SQL } from "./sql";

describe("SQL.selectionToSQLChar", () => {
  it("mysql", () => {
    expect(SQL.selectionToSQLChar("mysql", "ab")).toBe("CHAR(97, 98)");
  });

  it("postgres", () => {
    expect(SQL.selectionToSQLChar("postgres", "ab")).toBe("CHR(97)||CHR(98)");
  });

  it("sqlite", () => {
    expect(SQL.selectionToSQLChar("sqlite", "ab")).toBe("CHAR(97, 98)");
  });

  it("oracle", () => {
    expect(SQL.selectionToSQLChar("oracle", "a")).toBe(" CHR(97)");
  });
});

describe("SQL union helpers", () => {
  it("selectionToUnionSelect", () => {
    expect(SQL.selectionToUnionSelect("3")).toBe("UNION SELECT 1,2,3");
  });

  it("selectionToUnionAllSelectNULL", () => {
    expect(SQL.selectionToUnionAllSelectNULL("2")).toBe("UNION ALL SELECT NULL,NULL");
  });

  it("selectionToInlineComments", () => {
    expect(SQL.selectionToInlineComments("a b c")).toBe("a/**/b/**/c");
  });
});
