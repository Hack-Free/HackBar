import CryptoJS from "crypto-js";

export const Encrypt = {
  md5(str: string): string {
    return CryptoJS.MD5(str).toString();
  },

  rot13(str: string): string {
    return str.replace(/[a-zA-Z]/g, (ch) => {
      const c = ch.charCodeAt(0);
      const base = c <= 90 ? 65 : 97;
      const r = ((c - base + 13) % 26) + base;
      return String.fromCharCode(r);
    });
  },

  sha1(str: string): string {
    return CryptoJS.SHA1(str).toString();
  },

  sha2(str: string): string {
    return CryptoJS.SHA256(str).toString();
  },

  sha384(str: string): string {
    return CryptoJS.SHA384(str).toString();
  },

  sha512(str: string): string {
    return CryptoJS.SHA512(str).toString();
  },

  base64Encode(str: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
  },

  base64Decode(str: string): string {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(str));
  },

  strToHex(str: string): string {
    return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(str));
  },

  hexToStr(str: string): string {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(str));
  },
};
