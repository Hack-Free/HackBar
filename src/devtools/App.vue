<script setup lang="ts">
import { ref } from 'vue';
import { useHackBar } from '../composables/useHackBar';
import { toolMenus, toolTabs, type MenuLeaf } from './menu';

const focusedTa = ref<HTMLTextAreaElement | null>(null);

const {
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
  setActiveField,
  loadUrl,
  splitUrl,
  execute,
  onMenu,
  onKeydown,
  addHeaderRow,
  removeHeaderRow,
  clearAll,
} = useHackBar(() => focusedTa.value);

function onTaFocus(e: FocusEvent, field: Parameters<typeof setActiveField>[0]) {
  const t = e.target;
  if (t instanceof HTMLTextAreaElement) {
    focusedTa.value = t;
  }
  setActiveField(field);
}

function runMenu(action: string, val?: string) {
  onMenu(action, val);
}

function onToolDetailsToggle(ev: Event) {
  const el = ev.target as HTMLDetailsElement;
  if (!el.open) return;
  const root = el.closest('.panel-root');
  root?.querySelectorAll('details.tool-dropdown').forEach((d) => {
    if (d !== el) (d as HTMLDetailsElement).open = false;
  });
}

function runMenuLeaf(leaf: MenuLeaf, ev: MouseEvent) {
  if (leaf.kind === 'payload') {
    runMenu(leaf.channel, leaf.payload);
  } else {
    runMenu(leaf.id);
  }
  const details = (ev.currentTarget as HTMLElement).closest('details');
  if (details) details.open = false;
}
</script>

<template>
  <div class="panel-root" @keydown="onKeydown">
    <header class="action-bar" role="toolbar" aria-label="Main actions">
      <button type="button" class="btn btn-secondary" @click="loadUrl()">
        Load URL
      </button>
      <button type="button" class="btn btn-secondary" @click="splitUrl()">
        Split URL
      </button>
      <button type="button" class="btn btn-primary" @click="execute()">
        Execute
      </button>
      <span class="action-bar-divider" aria-hidden="true" />
      <div class="action-bar-tools" role="presentation">
        <details
          v-for="tab in toolTabs"
          :key="tab.id"
          class="tool-dropdown"
          name="hackbar-tool-menus"
          @toggle="onToolDetailsToggle($event)"
        >
          <summary class="tool-dropdown-summary">
            {{ tab.label }}
          </summary>
          <div class="tool-dropdown-panel" role="menu">
            <template v-for="(section, si) in toolMenus[tab.id]" :key="si">
              <div
                v-if="section.title"
                class="menu-section-title"
                role="presentation"
              >
                {{ section.title }}
              </div>
              <button
                v-for="(leaf, li) in section.items"
                :key="`${si}-${li}`"
                type="button"
                class="menu-item-btn"
                role="menuitem"
                @click="runMenuLeaf(leaf, $event)"
              >
                {{ leaf.label }}
              </button>
            </template>
          </div>
        </details>
      </div>
    </header>

    <div class="url-headers-row">
      <section class="card panel-section url-headers-col" aria-labelledby="url-heading">
        <h2 id="url-heading" class="card-title">URL</h2>
        <textarea
          id="url"
          v-model="urlField"
          class="field-url field-url-inline"
          @focus="(e) => onTaFocus(e, 'url')"
        />
      </section>

      <section
        class="card panel-section url-headers-col"
        aria-labelledby="headers-heading"
      >
        <h2 id="headers-heading" class="card-title">Custom headers</h2>
        <div class="row-actions">
          <button type="button" class="btn btn-secondary" @click="addHeaderRow()">
            Add Header
          </button>
          <button type="button" class="btn btn-secondary" @click="clearAll()">
            Clear All
          </button>
        </div>
        <div class="header-lines">
          <div
            v-for="(_line, idx) in customHeaderLines"
            :key="idx"
            class="header-line-row"
          >
            <input
              v-model="customHeaderLines[idx]"
              type="text"
              placeholder="Header-Name: value"
              class="header-line-input"
            />
            <button
              type="button"
              class="btn btn-secondary btn-header-remove"
              title="Remove this line"
              aria-label="Remove this header line"
              @click="removeHeaderRow(idx)"
            >
              ×
            </button>
          </div>
        </div>
      </section>
    </div>

    <section class="card panel-section http-request-card" aria-labelledby="http-heading">
      <h2 id="http-heading" class="card-title">HTTP request</h2>

      <div class="http-request-layout">
        <div class="http-block http-block-post">
          <label class="http-toggle">
            <input v-model="enablePost" type="checkbox" />
            <span class="http-toggle-label">POST body</span>
            <span class="http-toggle-hint">{{ postBodyHint }}</span>
          </label>
          <div v-show="enablePost" class="http-post-toolbar">
            <label class="http-format-label" for="post-body-format">Format</label>
            <select
              id="post-body-format"
              v-model="postBodyFormat"
              class="http-format-select"
              aria-label="POST body format"
            >
              <option value="urlencoded">
                application/x-www-form-urlencoded
              </option>
              <option value="json">application/json</option>
              <option value="raw">Raw (Content-Type personnalisé)</option>
            </select>
            <input
              v-show="postBodyFormat === 'raw'"
              v-model="postRawContentType"
              type="text"
              class="http-raw-mime-input"
              placeholder="Content-Type (ex. text/xml, application/xml)"
              aria-label="Content-Type pour le corps brut"
            />
          </div>
          <textarea
            v-show="enablePost"
            v-model="postDataField"
            class="http-field http-field-post"
            :placeholder="postBodyPlaceholder"
            @focus="(e) => onTaFocus(e, 'post')"
          />
        </div>

        <div class="http-block http-block-headers">
          <p class="http-block-subtitle">Browser headers</p>
          <div class="http-header-grid">
            <div class="http-header-cell">
              <label class="http-toggle">
                <input v-model="enableReferer" type="checkbox" />
                <span class="http-toggle-label">Referer</span>
              </label>
              <textarea
                v-show="enableReferer"
                v-model="refererField"
                class="http-field http-field-compact"
                placeholder="https://…"
                @focus="(e) => onTaFocus(e, 'referer')"
              />
            </div>
            <div class="http-header-cell">
              <label class="http-toggle">
                <input v-model="enableUserAgent" type="checkbox" />
                <span class="http-toggle-label">User-Agent</span>
              </label>
              <textarea
                v-show="enableUserAgent"
                v-model="userAgentField"
                class="http-field http-field-compact"
                placeholder="Mozilla/5.0 …"
                @focus="(e) => onTaFocus(e, 'userAgent')"
              />
            </div>
            <div class="http-header-cell http-header-cell-full">
              <label class="http-toggle">
                <input v-model="enableCookie" type="checkbox" />
                <span class="http-toggle-label">Cookie</span>
              </label>
              <textarea
                v-show="enableCookie"
                v-model="cookieField"
                class="http-field http-field-cookie"
                placeholder="name=value; other=…"
                @focus="(e) => onTaFocus(e, 'cookie')"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <p class="footer">
      HackBar v2 · Chewbaka
    </p>
  </div>
</template>
