# HackBar

HackBar browser extension for Firefox and Google Chrome, without license

## Firefox

[https://addons.mozilla.org/firefox/addon/hackbar-free/](https://addons.mozilla.org/firefox/addon/hackbar-free/)

# HackBar V2 (Vue 3 + MV3)

Browser extension (**Firefox** and **Chromium**) for developer tools (DevTools panel), rewritten with **Vue 3**, **Vite**, and [vite-plugin-web-extension](https://github.com/aklinker1/vite-plugin-web-extension) ([documentation](https://vite-plugin-web-extension.aklinker1.io)).

## Prerequisites

- Node.js 24+
- [pnpm](https://pnpm.io/) (or adapt the commands for npm)

## Install and build

```bash
pnpm install
pnpm run build           # default: TARGET=chrome (for the plugin dev tool)
pnpm run build:firefox   # same `dist/` output, `TARGET=firefox` if you use the plugin’s browser mode
```

The loadable package is in the `dist/` folder (load it via `about:debugging` in Firefox or “Extensions” → developer mode in Chrome). On Windows, `cross-env` is used to set `TARGET` (see [multibrowser](https://vite-plugin-web-extension.aklinker1.io/guide/supporting-multiple-browsers.html)).

## Development

```bash
pnpm run dev              # watch, Chrome by default (equivalent to TARGET=chrome)
pnpm run dev:firefox      # watch for Firefox
```

Runs a Vite build in watch mode (rebuilds the `dist` folder on each change). Reload the extension in the browser after each rebuild.

## Payload sources

Static entries follow patterns documented in security-testing literature (authorized pentest, lab, bug bounty). Main references:

| Source                   | Link                                                                                                                                                                | Role                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **OWASP**                | [owasp.org](https://owasp.org/)                                                                                                                                     | Testing framework and web security guidance.                                    |
| **PayloadsAllTheThings** | [github.com/swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) · [site](https://swisskyrepo.github.io/PayloadsAllTheThings/)    | Curated payloads by category (NoSQL, SSRF, SSTI, XSS, etc.).                    |
| **HackTricks**           | [book.hacktricks.wiki](https://book.hacktricks.wiki/)                                                                                                               | Practical notes (NoSQL, SSRF, cloud bypasses, etc.).                            |
| **SecLists**             | [github.com/danielmiessler/SecLists](https://github.com/danielmiessler/SecLists) ([Fuzzing](https://github.com/danielmiessler/SecLists/tree/master/Fuzzing) folder) | Wordlists and fuzzing payloads (XSS, etc.) — inspiration for targeted snippets. |
