import { rfiSamples } from "../../lib/payloads";
import type { MenuSection } from "./types";

export const rfiMenu: MenuSection[] = [
  {
    title: "Remote include",
    items: rfiSamples.slice(0, 5).map((s) => ({
      kind: "payload" as const,
      channel: "RFI" as const,
      label: s.label,
      payload: s.value,
    })),
  },
  {
    title: "Variants",
    items: rfiSamples.slice(5).map((s) => ({
      kind: "payload" as const,
      channel: "RFI" as const,
      label: s.label,
      payload: s.value,
    })),
  },
];
