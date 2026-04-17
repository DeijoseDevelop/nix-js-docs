import { signal, computed, html, mount, repeat } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { PAGES, type PageMeta } from './data/pages';
import './style.css';
import './style2.css';

// ── Page builders ──────────────────────────────────────────
import { IntroPage }       from './pages/intro';
import { InstallPage }     from './pages/install';
import { ReactivityPage }  from './pages/reactivity';
import { TemplatesPage }   from './pages/templates';
import { ComponentsPage }  from './pages/components';
import { StoresPage }      from './pages/stores';
import { RouterPage }      from './pages/router';
import { FormsPage }       from './pages/forms';
import { AsyncPage }       from './pages/async';
import { DIPage }          from './pages/di';
import { PortalsPage }     from './pages/portals';
import { TransitionsPage } from './pages/transitions';
import { ErrorsPage }      from './pages/errors';
import { ShowPage }        from './pages/show';
import { ComparisonPage }  from './pages/comparison';
import { APIPage }         from './pages/api';

const PAGE_MAP: Record<string, any> = {
  intro:       IntroPage,
  install:     InstallPage,
  reactivity:  ReactivityPage,
  templates:   TemplatesPage,
  components:  ComponentsPage,
  stores:      StoresPage,
  router:      RouterPage,
  forms:       FormsPage,
  async:       AsyncPage,
  di:          DIPage,
  portals:     PortalsPage,
  transitions: TransitionsPage,
  errors:      ErrorsPage,
  show:        ShowPage,
  comparison:  ComparisonPage,
  api:         APIPage,
};

// ── App Component ──────────────────────────────────────────
function App(): NixTemplate {
  const activePage = signal('intro');
  const searchQ    = signal('');
  const drawerOpen = signal(false);

  const filteredPages = computed((): PageMeta[] => {
    const q = searchQ.value.toLowerCase().trim();
    if (!q) return PAGES;
    return PAGES.filter(p =>
      p.label.toLowerCase().includes(q) ||
      p.grp.toLowerCase().includes(q) ||
      p.id.includes(q)
    );
  });

  function go(id: string) {
    activePage.value = id;
    drawerOpen.value = false;
    window.scrollTo({ top: 0 });
  }

  function NavItems(): NixTemplate {
    return html`
      ${() => {
        const fp = filteredPages.value;
        const groups: Record<string, PageMeta[]> = {};
        for (const p of PAGES) {
          if (!fp.some(f => f.id === p.id)) continue;
          (groups[p.grp] ??= []).push(p);
        }
        return Object.entries(groups).map(([grp, pages]) => html`
          <div class="nav-grp">${grp}</div>
          ${pages.map(p => html`
            <div class=${() => `nav-a${activePage.value === p.id ? ' on' : ''}`}
              @click=${() => go(p.id)}>
              <span class="nav-dot"></span>
              ${p.label}
            </div>
          `)}
        `);
      }}
    `;
  }

  return html`
    <div id="layout">

      <!-- ── SIDEBAR ── -->
      <aside id="sb">
        <div class="sb-top">
          <a href="/" class="sb-brand">
            <img src="/nix-js-logo.png" alt="Nix.js Logo" class="sb-logo-img">
            <div class="sb-logo">Nix<em>.</em>js</div>
          </a>
          <div class="sb-ver">v1.9.0 — documentation</div>
          <div class="sb-search">
            <span class="sb-search-ic">⌕</span>
            <input type="search" placeholder="Search… (⌘K)" autocomplete="off"
              @input=${(e: Event) => (searchQ.value = (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div id="sb-scroll">
          <nav>${NavItems()}</nav>
        </div>

        <div class="sb-foot">
          <a href="https://github.com/DeijoseDevelop/nix-js" target="_blank">⬡ GitHub</a>
        </div>
      </aside>

      <!-- ── MAIN CONTENT ── -->
      <div id="main">

        <!-- Mobile topbar -->
        <div id="mob-bar">
          <div class="logo">Nix<em>.</em>js</div>
          <button id="menu-btn" @click=${() => (drawerOpen.value = true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Desktop topbar -->
        <div id="topbar">
          <div class="tb-bc">
            ${() => {
              const p = PAGES.find(p => p.id === activePage.value);
              return p
                ? html`Nix.js <span class="sep">/</span> <span class="sep">${p.grp}</span> <span class="sep">/</span> <span class="cur">${p.label}</span>`
                : html`Nix.js`;
            }}
          </div>
          <div class="tb-right">
            <span class="tb-badge">v1.9.0</span>
            <a class="tb-badge" href="https://github.com/DeijoseDevelop/nix-js" target="_blank" style="text-decoration:none;cursor:pointer">GitHub ↗</a>
          </div>
        </div>

        <!-- Page content -->
        <div id="pages">
          ${() => repeat(
            [activePage.value],
            id => id,
            id => {
              const builder = PAGE_MAP[id];
              if (!builder) return html`<section class="page on"><p>Page not found</p></section>`;

              // If it's a class component (has render method in prototype)
              if (typeof builder === 'function' && builder.prototype?.render) {
                return html`<section class="page on" id=${id}>${new (builder as any)()}</section>`;
              }
              // Otherwise it's a NixTemplate function component
              return html`<section class="page on" id=${id}>${(builder as any)()}</section>`;
            }
          )}
        </div>

      </div><!-- /main -->
    </div><!-- /layout -->

    <!-- ── MOBILE DRAWER ── -->
    ${() => drawerOpen.value ? html`
      <div id="drawer" style="display:block">
        <div id="drawer-bg" @click=${() => (drawerOpen.value = false)}></div>
        <div id="drawer-panel">
          <div class="drawer-head">
            <div class="logo">Nix<em>.</em>js</div>
            <button @click=${() => (drawerOpen.value = false)}>✕</button>
          </div>
          <div style="padding:10px 18px;border-bottom:1px solid var(--bd)">
            <input type="search" placeholder="Search…"
              @input=${(e: Event) => (searchQ.value = (e.target as HTMLInputElement).value)}
              style="width:100%;background:var(--bg3);border:1px solid var(--bd);border-radius:7px;padding:7px 10px;color:var(--tx);font-family:var(--body);font-size:13px;outline:none"/>
          </div>
          <div id="drawer-scroll">
            <nav>${NavItems()}</nav>
          </div>
        </div>
      </div>
    ` : null}
  `;
}

// ── Bootstrap ──────────────────────────────────────────────
mount(App(), '#app');