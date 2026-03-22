import { lfiSamples } from "../../lib/payloads";
import type { MenuSection } from "./types";

export const lfiMenu: MenuSection[] = [
  {
    title: "Path traversal",
    items: lfiSamples.slice(0, 8).map((s) => ({
      kind: "payload" as const,
      channel: "LFI" as const,
      label: s.label,
      payload: s.value,
    })),
  },
  {
    title: "Wrappers & protocols",
    items: lfiSamples.slice(8).map((s) => ({
      kind: "payload" as const,
      channel: "LFI" as const,
      label: s.label,
      payload: s.value,
    })),
  },
];
