import type { ToolTab } from "./types";

export const toolTabs: { id: ToolTab; label: string }[] = [
  { id: "encryption", label: "Encryption" },
  { id: "encoding", label: "Encoding" },
  { id: "sql", label: "SQL" },
  { id: "xss", label: "XSS" },
  { id: "lfi", label: "LFI" },
  { id: "rfi", label: "RFI" },
  { id: "xxe", label: "XXE" },
  { id: "csrf", label: "CSRF" },
  { id: "cmd", label: "Cmd" },
  { id: "ssti", label: "SSTI" },
  { id: "injection", label: "Injection" },
  { id: "other", label: "Other" },
];
