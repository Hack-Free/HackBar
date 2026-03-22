import {
  ldapMenu,
  nosqlMenu,
  redirectMenu,
  ssrfMenu,
  xpathMenu,
} from "../../lib/payloads";
import type { MenuSection } from "./types";

export const injectionMenu: MenuSection[] = [
  {
    title: "LDAP",
    items: ldapMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
  {
    title: "XPath",
    items: xpathMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
  {
    title: "NoSQL",
    items: nosqlMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
  {
    title: "SSRF",
    items: ssrfMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
  {
    title: "Open redirect",
    items: redirectMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
];
