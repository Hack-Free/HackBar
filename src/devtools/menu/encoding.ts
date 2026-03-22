import type { MenuSection } from "./types";

export const encodingMenu: MenuSection[] = [
  {
    items: [
      { kind: "action", id: "base64_encode", label: "Base64 Encode" },
      { kind: "action", id: "base64_decode", label: "Base64 Decode" },
      { kind: "action", id: "url_encode", label: "URL Encode" },
      { kind: "action", id: "url_decode", label: "URL Decode" },
      { kind: "action", id: "hex_encode", label: "Hex Encode" },
      { kind: "action", id: "hex_decode", label: "Hex Decode" },
    ],
  },
];
