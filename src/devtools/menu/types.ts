export type ToolTab =
  | "encryption"
  | "encoding"
  | "sql"
  | "xss"
  | "lfi"
  | "rfi"
  | "xxe"
  | "csrf"
  | "cmd"
  | "ssti"
  | "injection"
  | "other";

export type MenuLeaf =
  | { kind: "action"; id: string; label: string }
  | {
      kind: "payload";
      channel: "LFI" | "RFI";
      label: string;
      payload: string;
    };

export type MenuSection = { title?: string; items: MenuLeaf[] };
