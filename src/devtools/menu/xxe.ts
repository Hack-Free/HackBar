import type { MenuSection } from "./types";

export const xxeMenu: MenuSection[] = [
  {
    title: "Exploitation",
    items: [
      { kind: "action", id: "xxe_lfi", label: "XXE LFI Test" },
      { kind: "action", id: "xxe_blind", label: "XXE Blind LFI" },
      { kind: "action", id: "xxe_load_resource", label: "XXE Access Control" },
      { kind: "action", id: "xxe_ssrf", label: "XXE SSRF" },
      { kind: "action", id: "xxe_rce", label: "XXE RCE" },
    ],
  },
  {
    title: "DOS & encoding",
    items: [
      { kind: "action", id: "xxe_xee_local", label: "XXE XEE DOS (local)" },
      {
        kind: "action",
        id: "xxe_xee_remove",
        label: "XXE XEE DOS (remote)",
      },
      { kind: "action", id: "xxe_utf7", label: "XXE UTF-7" },
    ],
  },
];
