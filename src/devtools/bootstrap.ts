import browser from 'webextension-polyfill'

function panelPathForCreate(): string {
  // Firefox : pagePath relatif au dossier de devtools_page → `panel.html`
  const r = browser.runtime as typeof browser.runtime & {
    getBrowserInfo?: () => Promise<{ name: string }>
  }
  if (typeof r.getBrowserInfo === 'function') {
    return 'panel.html'
  }
  // Chromium : chemin depuis la racine du paquet (slash initial requis)
  return '/src/devtools/panel.html'
}

async function registerPanel(): Promise<void> {
  try {
    await browser.devtools.panels.create('HackBar', '', panelPathForCreate())
  } catch (err) {
    console.error('[HackBar] devtools.panels.create :', err)
  }
}

void registerPanel()
