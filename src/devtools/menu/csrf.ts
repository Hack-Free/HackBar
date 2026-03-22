import { csrfMenu } from "../../lib/payloads";
import type { MenuSection } from "./types";

export const csrfMenuSections: MenuSection[] = [
  {
    items: csrfMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
];
