import browser from "webextension-polyfill";
import type { StoredHeaders } from "../types/messages";

type ModifyHeaderInfo = {
  header: string;
  operation: "set" | "append" | "remove";
  value?: string;
};

interface CapturedHeaders {
  referer?: string;
  user_agent?: string;
  cookie?: string;
  custom: Record<string, string>;
}

const currentPostData: Record<number, string | undefined> = {};
const pendingHeaders: Record<number, StoredHeaders | undefined> = {};
const currentHeadersCaptured: Record<number, CapturedHeaders | undefined> = {};

let ruleIdSeq = 1;
const sessionRuleIdsByTab = new Map<number, number[]>();

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function clearSessionRulesForTab(tabId: number): Promise<void> {
  const ids = sessionRuleIdsByTab.get(tabId);
  if (ids?.length) {
    await browser.declarativeNetRequest.updateSessionRules({ removeRuleIds: ids });
    sessionRuleIdsByTab.delete(tabId);
  }
}

function buildModifyHeaders(h: StoredHeaders): ModifyHeaderInfo[] {
  const requestHeaders: ModifyHeaderInfo[] = [];
  if (h.referer) {
    requestHeaders.push({ header: "Referer", operation: "set", value: h.referer });
  }
  if (h.user_agent) {
    requestHeaders.push({ header: "User-Agent", operation: "set", value: h.user_agent });
  }
  if (h.cookie) {
    requestHeaders.push({ header: "Cookie", operation: "set", value: h.cookie });
  }
  if (h.custom) {
    for (const [name, value] of Object.entries(h.custom)) {
      requestHeaders.push({ header: name, operation: "set", value });
    }
  }
  return requestHeaders;
}

async function applyDnrForNextNavigation(tabId: number, targetUrl: string): Promise<void> {
  const h = pendingHeaders[tabId];
  if (!h) return;

  const requestHeaders = buildModifyHeaders(h);
  if (requestHeaders.length === 0) {
    await clearSessionRulesForTab(tabId);
    return;
  }

  await clearSessionRulesForTab(tabId);

  const ruleId = ruleIdSeq++;
  const list = sessionRuleIdsByTab.get(tabId) ?? [];
  list.push(ruleId);
  sessionRuleIdsByTab.set(tabId, list);

  await browser.declarativeNetRequest.updateSessionRules({
    addRules: [
      {
        id: ruleId,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders,
        },
        condition: {
          regexFilter: `^${escapeRegex(targetUrl)}$`,
          resourceTypes: ["main_frame"],
        },
      },
    ],
  });
}

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method !== "POST" || !details.requestBody?.formData) {
      return;
    }
    const rawData = details.requestBody.formData;
    const postDataArray: string[] = [];
    for (const key of Object.keys(rawData)) {
      const vals = rawData[key];
      for (const v of vals) {
        postDataArray.push(`${key}=${v}`);
      }
    }
    const tabId = details.tabId;
    if (tabId >= 0) {
      currentPostData[tabId] = postDataArray.join("&");
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["requestBody"]
);

browser.webRequest.onSendHeaders.addListener(
  (details) => {
    const tabId = details.tabId;
    if (tabId < 0) {
      return;
    }
    const captured: CapturedHeaders = { custom: {} };
    for (const head of details.requestHeaders ?? []) {
      const n = head.name.toLowerCase();
      if (n === "referer") {
        captured.referer = head.value;
      } else if (n === "user-agent") {
        captured.user_agent = head.value;
      } else if (n === "cookie") {
        captured.cookie = head.value;
      } else {
        captured.custom[head.name] = head.value ?? "";
      }
    }
    currentHeadersCaptured[tabId] = captured;
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["requestHeaders"]
);

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    void clearSessionRulesForTab(tabId);
  }
});

function isFromOurPanel(sender: { url?: string }): boolean {
  const url = sender.url;
  if (!url) {
    return false;
  }
  return (
    url.startsWith(browser.runtime.getURL("")) &&
    url.includes("src/devtools/panel.html")
  );
}

type PanelMessage =
  | { tabId: number; action: "load_url"; data?: null }
  | {
      tabId: number;
      action: "send_requests";
      data: { headers: StoredHeaders; targetUrl?: string };
    };

// webextension-polyfill types expect `true` only; async sendResponse needs `true`.
browser.runtime.onMessage.addListener(
  (
    request: unknown,
    sender: { url?: string },
    sendResponse: (r: unknown) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polyfill OnMessageListener typing is narrower than runtime
  ): any => {
    if (!isFromOurPanel(sender)) {
      return;
    }

    const msg = request as PanelMessage;
    const tabId = msg.tabId;
    const action = msg.action;

    if (action === "load_url") {
      void browser.tabs.get(tabId).then((tab) => {
        sendResponse({
          url: tab.url,
          data: currentPostData[tabId],
          headers: currentHeadersCaptured[tabId],
        });
      });
      return true;
    }

    if (action === "send_requests" && msg.data?.headers) {
      pendingHeaders[tabId] = msg.data.headers;
      const targetUrl = msg.data.targetUrl?.replace(/[\n\r]/g, "").trim();
      if (targetUrl) {
        void applyDnrForNextNavigation(tabId, targetUrl).then(() => {
          sendResponse({ status: true });
        });
      } else {
        sendResponse({ status: true });
      }
      return true;
    }

    return;
  }
);
