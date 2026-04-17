import { html, signal, NixComponent } from '@deijose/nix-js';

export class ComparisonPage extends NixComponent {
  private showBars = signal(false);
  
  onMount() {
    setTimeout(() => { this.showBars.value = true; }, 100);
  }

  private frameworks = [
    ['Nix.js', 10, 'var(--ac2)'],
    ['Solid.js', 11, 'var(--ac3)'],
    ['Svelte 5', 18, 'var(--green)'],
    ['Vue 3', 33, 'var(--gold)'],
    ['React 19', 45, 'var(--red)'],
  ] as const;

  render() {
    return html`
    <div>
      <h2 class="page-title">Comparison</h2>
      <p class="page-sub">How Nix.js compares to other popular frameworks across runtime, architecture, and built-in feature set.</p>

      <h3>Bundle Size (min + gzip)</h3>
      <div class="demo">
        <div class="demo-lbl">Approximate minified + gzipped bundle sizes — Nix.js includes router, forms, and more.</div>
        <div style="padding:20px 16px">
          ${this.frameworks.map(([n, kb, c]) => html`
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <div style="width:75px;font-family:var(--mono);font-size:11px;color:var(--tx2);text-align:right;flex-shrink:0">${n}</div>
              <div style="flex:1;background:var(--bd);border-radius:4px;height:24px;overflow:hidden;position:relative">
                <div style=${() => `
                  height:100%;
                  width:${this.showBars.value ? (kb / 45 * 100).toFixed(1) : '0'}%;
                  background:${c};
                  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                  display:flex;
                  align-items:center;
                  padding-left:10px;
                  white-space:nowrap;
                `}>
                  <span style=${() => `
                    font-family:var(--mono);
                    font-size:10px;
                    color:#111;
                    font-weight:700;
                    opacity: ${this.showBars.value ? 1 : 0};
                    transition: opacity 0.5s 0.3s ease;
                  `}>~${kb} KB</span>
                </div>
              </div>
            </div>
          `)}
        </div>
      </div>

      <h3>Runtime & Architecture</h3>
      <div class="tbl">
        <table>
          <tr><th></th><th>Nix.js</th><th>React 19</th><th>Vue 3</th><th>Solid.js</th><th>Svelte 5</th></tr>
          <tr><td>Reactivity</td><td>Signals</td><td>State+VDOM</td><td>Refs+VDOM</td><td>Signals</td><td>Runes</td></tr>
          <tr><td>Virtual DOM</td><td>❌ No</td><td>✅ Yes</td><td>✅ Yes</td><td>❌ No</td><td>❌ No</td></tr>
          <tr><td>Compiler required</td><td>❌ No</td><td>JSX transform</td><td>SFC compiler</td><td>JSX transform</td><td>Svelte compiler</td></tr>
          <tr><td>Granularity</td><td>Signal-level</td><td>Component-level</td><td>Component-level</td><td>Signal-level</td><td>Statement-level</td></tr>
          <tr><td>TS Native</td><td>✅ Yes</td><td>Via types</td><td>Via SFC</td><td>✅ Yes</td><td>Via compiler</td></tr>
        </table>
      </div>

      <h3>Migration from React</h3>
      <div class="tbl">
        <table>
          <tr><th>React concept</th><th>Nix.js equivalent</th></tr>
          <tr><td><code>useState(x)</code></td><td><code>signal(x)</code></td></tr>
          <tr><td><code>useMemo(() => x)</code></td><td><code>computed(() => x)</code></td></tr>
          <tr><td><code>useEffect(fn, deps)</code></td><td><code>effect(fn)</code> — dependencies are auto-tracked</td></tr>
          <tr><td><code>useContext(Key)</code></td><td><code>inject(Key)</code></td></tr>
          <tr><td><code>React.memo()</code></td><td>Not needed — signals are granular by default</td></tr>
          <tr><td><code>&lt;Suspense&gt;</code></td><td><code>suspend() / nix-query</code></td></tr>
          <tr><td><code>React.lazy()</code></td><td><code>lazy()</code></td></tr>
          <tr><td><code>createPortal()</code></td><td><code>portal()</code></td></tr>
        </table>
      </div>

      <h3>Migration from Vue</h3>
      <div class="tbl">
        <table>
          <tr><th>Vue 3</th><th>Nix.js</th></tr>
          <tr><td><code>ref(x)</code> / <code>shallowRef</code></td><td><code>signal(x)</code></td></tr>
          <tr><td><code>computed(() => x)</code></td><td><code>computed(() => x)</code></td></tr>
          <tr><td><code>watch(src, cb)</code></td><td><code>watch(src, cb)</code></td></tr>
          <tr><td><code>provide / inject</code></td><td><code>provide / inject</code></td></tr>
          <tr><td><code>&lt;Teleport to="..."&gt;</code></td><td><code>portal(tpl, "#sel")</code></td></tr>
          <tr><td><code>v-if / v-show</code></td><td><code>? : null</code> / <code>showWhen</code></td></tr>
        </table>
      </div>

      <h3>Built-in Features</h3>
      <div class="tbl">
        <table>
          <tr><th>Feature</th><th>Nix.js</th><th>React</th><th>Vue</th><th>Solid</th><th>Svelte</th></tr>
          <tr><td>Router</td><td>✅ Built-in</td><td>react-router</td><td>vue-router</td><td>@solidjs/router</td><td>svelte-kit</td></tr>
          <tr><td>Form validation</td><td>✅ Built-in</td><td>react-hook-form</td><td>vee-validate</td><td>—</td><td>—</td></tr>
          <tr><td>Global stores</td><td>✅ Built-in</td><td>zustand/redux</td><td>pinia</td><td>✅ built-in</td><td>svelte/store</td></tr>
          <tr><td>DI</td><td>✅ Built-in</td><td>React Context</td><td>provide/inject</td><td>createContext</td><td>getContext</td></tr>
          <tr><td>Portals</td><td>✅ Built-in</td><td>createPortal</td><td>Teleport</td><td>Portal</td><td>—</td></tr>
          <tr><td>Error boundaries</td><td>✅ Built-in</td><td>ErrorBoundary</td><td>errorHandler</td><td>ErrorBoundary</td><td>—</td></tr>
          <tr><td>Transitions</td><td>✅ Built-in</td><td>—</td><td>Transition</td><td>—</td><td>transition:</td></tr>
          <tr><td>Async suspense</td><td>✅ Built-in</td><td>Suspense</td><td>Suspense</td><td>Suspense</td><td>—</td></tr>
          <tr><td>Query cache</td><td>✅ Built-in</td><td>TanStack Query</td><td>—</td><td>—</td><td>—</td></tr>
        </table>
      </div>

      <h3>When to Choose Nix.js</h3>
      <ul class="list">
        <li>You want a <strong>single-import</strong> framework — routing, forms, stores, DI, portals all included</li>
        <li>You prefer <strong>tagged template literals</strong> over JSX or SFC compilers</li>
        <li>You need <strong>fine-grained signal reactivity</strong> without virtual DOM overhead</li>
        <li>You're building <strong>small-to-medium apps</strong>, embedded widgets, or micro-frontends</li>
        <li>You want <strong>TypeScript-first</strong> DX without compiler configuration</li>
      </ul>

      <h3>Known Limitations</h3>
      <ul class="list">
        <li>No SSR / hydration — client-side only (planned for a future release)</li>
        <li>Partial attribute interpolation not supported</li>
        <li>Incompatible with React/Vue component libraries</li>
        <li>Best suited for small-to-medium projects</li>
      </ul>
    </div>
  `;
  }
}
