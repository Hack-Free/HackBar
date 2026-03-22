import { describe, expect, it } from "vitest";
import { XSS } from "./xss";

describe("XSS.selectionToChar", () => {
  it("stringFromCharCode", () => {
    expect(XSS.selectionToChar("stringFromCharCode", "A")).toBe(
      "String.fromCharCode(65)"
    );
  });

  it("htmlChar", () => {
    expect(XSS.selectionToChar("htmlChar", "AB")).toBe("&#65;&#66;");
  });
});
