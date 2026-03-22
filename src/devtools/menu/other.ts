import type { MenuSection } from "./types";

export const otherMenu: MenuSection[] = [
  {
    items: [
      { kind: "action", id: "jsonify", label: "Jsonify" },
      { kind: "action", id: "uppercase", label: "Uppercase" },
      { kind: "action", id: "lowercase", label: "Lowercase" },
    ],
  },
];
