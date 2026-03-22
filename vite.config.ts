import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import webExtension from 'vite-plugin-web-extension'

const targetBrowser = (process.env.TARGET ?? 'chrome') as 'chrome' | 'firefox'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as {
  name: string
  version: string
  description: string
}

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    webExtension({
      browser: targetBrowser,
      htmlViteConfig: { base: './' },
      watchFilePaths: ['package.json'],
      manifest: () => ({
        manifest_version: 3,
        name: 'HackBar V2',
        version: pkg.version,
        description:
          pkg.description ||
          'HackBar for Firefox and Chromium (DevTools). WebExtension alternative to legacy XUL HackBar.',
        minimum_chrome_version: '110',
        icons: {
          48: 'icons/icon.png',
        },
        devtools_page: 'src/devtools/index.html',
        options_ui: {
          page: 'src/devtools/panel.html',
          open_in_tab: true,
        },
        '{{chrome}}.background': {
          service_worker: 'src/background/serviceWorker.ts',
        },
        '{{firefox}}.background': {
          scripts: ['src/background/serviceWorker.ts'],
        },
        permissions: ['tabs', 'activeTab', 'storage', 'webRequest', 'declarativeNetRequest'],
        host_permissions: ['<all_urls>'],
        browser_specific_settings: {
          gecko: {
            id: 'hackbar@chewbaka',
            strict_min_version: '109.0',
          },
        },
      }),
    }),
  ],
})
