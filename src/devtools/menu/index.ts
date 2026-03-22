import type { MenuSection, ToolTab } from "./types";
import { cmdMenuSections } from "./cmd";
import { csrfMenuSections } from "./csrf";
import { encodingMenu } from "./encoding";
import { encryptionMenu } from "./encryption";
import { injectionMenu } from "./injection";
import { lfiMenu } from "./lfi";
import { otherMenu } from "./other";
import { rfiMenu } from "./rfi";
import { sqlMenu } from "./sql";
import { sstiMenuSections } from "./ssti";
import { toolTabs } from "./tabs";
import { xssMenu } from "./xss";
import { xxeMenu } from "./xxe";

export type { MenuLeaf, MenuSection, ToolTab } from "./types";

export { toolTabs };

export const toolMenus: Record<ToolTab, MenuSection[]> = {
  encryption: encryptionMenu,
  encoding: encodingMenu,
  sql: sqlMenu,
  xss: xssMenu,
  lfi: lfiMenu,
  rfi: rfiMenu,
  xxe: xxeMenu,
  csrf: csrfMenuSections,
  cmd: cmdMenuSections,
  ssti: sstiMenuSections,
  injection: injectionMenu,
  other: otherMenu,
};
