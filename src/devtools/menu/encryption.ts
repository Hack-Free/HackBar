import type { MenuSection } from "./types";

export const encryptionMenu: MenuSection[] = [
  {
    items: [
      { kind: "action", id: "md5", label: "MD5" },
      { kind: "action", id: "sha1", label: "SHA-1" },
      { kind: "action", id: "sha256", label: "SHA-256" },
      { kind: "action", id: "sha384", label: "SHA-384" },
      { kind: "action", id: "sha512", label: "SHA-512" },
      { kind: "action", id: "rot13", label: "ROT13" },
    ],
  },
];
