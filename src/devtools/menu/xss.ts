import { xssStaticMenu } from "../../lib/payloads";
import type { MenuSection } from "./types";

export const xssMenu: MenuSection[] = [
  {
    title: "Transforms",
    items: [
      {
        kind: "action",
        id: "xss_string_from_charcode",
        label: "String.fromCharCode",
      },
      { kind: "action", id: "xss_html_characters", label: "HTML Characters" },
      { kind: "action", id: "xss_alert", label: "XSS Alert" },
    ],
  },
  {
    title: "Snippets",
    items: xssStaticMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
];
