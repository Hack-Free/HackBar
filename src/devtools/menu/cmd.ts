import { cmdMenu } from "../../lib/payloads";
import type { MenuSection } from "./types";

export const cmdMenuSections: MenuSection[] = [
  {
    items: cmdMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
];
