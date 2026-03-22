import { describe, expect, it } from "vitest";
import { Encrypt } from "./encrypt";

describe("Encrypt", () => {
  it("md5", () => {
    expect(Encrypt.md5("hello")).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  it("rot13 roundtrip for letters", () => {
    expect(Encrypt.rot13("abc")).toBe("nop");
    expect(Encrypt.rot13("nop")).toBe("abc");
  });

  it("base64 encode/decode roundtrip", () => {
    const s = "café";
    expect(Encrypt.base64Decode(Encrypt.base64Encode(s))).toBe(s);
  });

  it("hex encode/decode roundtrip", () => {
    const s = "test";
    expect(Encrypt.hexToStr(Encrypt.strToHex(s))).toBe(s);
  });

  it("sha256 is hex lowercase", () => {
    expect(Encrypt.sha2("")).toMatch(/^[a-f0-9]{64}$/);
  });
});
