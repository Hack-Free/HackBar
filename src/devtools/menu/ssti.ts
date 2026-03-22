import { sstiMenu } from "../../lib/payloads";
import type { MenuSection } from "./types";

export const sstiMenuSections: MenuSection[] = [
  {
    items: sstiMenu.map((m) => ({
      kind: "action" as const,
      id: m.id,
      label: m.label,
    })),
  },
];
