import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function HMRPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Vite Plugin</h2>
      <p class="page-sub">
        Official Vite plugin for Nix.js that adds Hot Module Replacement with full state, scroll, and focus preservation. No manual <code>import.meta.hot</code> wrapping needed.
      </p>

      <h3>Requirements</h3>
      <div class="ul">
        <ul>
          <li>Vite <code>^8.0.0</code></li>
          <li><code>@deijose/nix-js</code> <code>^2.5.3</code></li>
        </ul>
      </div>

      <h3>Installation</h3>
      ${new CodeBlock('npm install -D @deijose/vite-plugin-nix-js', 'bash')}

      <h3>Configuration</h3>
      <p>Add the plugin to your <code>vite.config.ts</code>. Zero configuration is required for the defaults.</p>
      ${new CodeBlock(S.vite_plugin_options)}

      <h4>Options</h4>
      <div class="tbl">
        <table>
          <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
          <tr><td><code>preserveState</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Preserve module-scoped signals, stores, routers, and forms across HMR updates.</td></tr>
          <tr><td><code>preserveDOM</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Preserve scroll position and the currently focused element across updates.</td></tr>
          <tr><td><code>devtools</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Inject the Nix devtools client for debugging.</td></tr>
        </table>
      </div>

      <h3>What it does</h3>
      <div class="ul">
        <ul>
          <li><strong>Hot-reloads</strong> components without a full page refresh.</li>
          <li><strong>Preserves state</strong> of module-scoped stores, routers, forms, and signals.</li>
          <li><strong>Preserves scroll position</strong> and the currently focused element.</li>
          <li><strong>Works automatically</strong> — no manual <code>import.meta.hot</code> wrapping needed.</li>
        </ul>
      </div>

      <h3>How it works</h3>
      <p>
        The plugin transforms source files at build time using Babel. It detects module-scoped declarations of <code>signal</code>, <code>createForm</code>, <code>createStore</code>, <code>createRouter</code>, and <code>mount</code>, and wraps them with a small runtime that reuses existing instances across reloads.
      </p>

      <div class="tbl">
        <table>
          <tr><th>Call</th><th>Wrapped to</th></tr>
          <tr><td><code>signal(...)</code></td><td><code>__nixGetOrCreateSignal(id, factory)</code></td></tr>
          <tr><td><code>createForm(...)</code></td><td><code>__nixGetOrCreateForm(id, factory)</code></td></tr>
          <tr><td><code>createStore(...)</code></td><td><code>__nixGetOrCreateStore(id, factory)</code></td></tr>
          <tr><td><code>createRouter(...)</code></td><td><code>__nixGetOrCreateRouter(id, factory)</code></td></tr>
          <tr><td><code>mount(...)</code></td><td><code>__nixMount(id, factory, ...)</code></td></tr>
        </table>
      </div>

      <h4>Before & After</h4>
      <p>
        Here is what the plugin does under the hood. You write normal code; the plugin transforms it automatically at build time.
      </p>
      ${new CodeBlock(S.vite_plugin_before_after)}

      <h3>Supported cases</h3>
      <div class="ul">
        <ul>
          <li><strong>Multiple mount points</strong> in the same file.</li>
          <li><strong>Mount assigned to a variable</strong> (<code>const handle = mount(...)</code>) as well as bare <code>mount(...)</code> statements.</li>
          <li><strong>Module-scoped signals, forms, stores, and routers</strong>.</li>
          <li><strong>Named exports</strong> and <strong>aliased imports</strong>.</li>
          <li><strong>TypeScript</strong> annotations, <code>as</code>, <code>satisfies</code> and parenthesized expressions.</li>
          <li><strong>Async components</strong> (<code>mount(await loadApp(), "#app")</code>).</li>
        </ul>
      </div>

      <p>
        Signals, forms, stores, and routers declared <strong>inside functions</strong> are intentionally left untouched, so they still produce a fresh instance on each call.
      </p>

      <h3>Common patterns</h3>

      <h4>Keep state at module scope</h4>
      <p>
        Declare state at module scope so it is preserved across updates. The component re-mounts but the signal keeps its value.
      </p>
      ${new CodeBlock(S.vite_plugin_good_pattern)}

      <h4>Avoid state inside components</h4>
      <p>
        Declarations inside functions are recreated on every call and reset on every HMR update.
      </p>
      ${new CodeBlock(S.vite_plugin_bad_pattern)}

      <h4>Class components</h4>
      <p>
        For class components, store shared state in a module-scoped <code>createStore</code> or <code>signal</code>. Private properties set in <code>onInit</code> / <code>onMount</code> are not preserved.
      </p>

      <h3>What is preserved</h3>
      <div class="cards">
        <div class="card"><span class="card-ic">⚡</span><div class="card-t">Signals</div><div class="card-d">Top-level <code>signal()</code> declarations keep their current values.</div></div>
        <div class="card"><span class="card-ic">📦</span><div class="card-t">Stores</div><div class="card-d"><code>createStore()</code> instances are reused and re-patched after reload.</div></div>
        <div class="card"><span class="card-ic">🔀</span><div class="card-t">Router</div><div class="card-d">Path, params, query, and history stack survive the update.</div></div>
        <div class="card"><span class="card-ic">📋</span><div class="card-t">Forms</div><div class="card-d"><code>createForm()</code> values, touched, dirty, and errors are kept.</div></div>
        <div class="card"><span class="card-ic">📜</span><div class="card-t">Scroll & Focus</div><div class="card-d">Scroll position and the focused element are restored after reload.</div></div>
      </div>

      <h3>Known limitations</h3>
      <div class="ul">
        <ul>
          <li><strong>Module scope only:</strong> declarations inside functions are left untouched and recreated on every call.</li>
          <li><strong>Class component state:</strong> private properties set in <code>NixComponent</code> <code>onInit</code> / <code>onMount</code> are not preserved across HMR updates.</li>
          <li><strong>Module-granular:</strong> when a file changes, every <code>mount()</code> point declared in that file is re-mounted.</li>
          <li><strong>Tracked calls only:</strong> only module-scoped <code>signal</code>, <code>createForm</code>, <code>createStore</code>, <code>createRouter</code>, and <code>mount</code> are transformed.</li>
        </ul>
      </div>

      <h3>Quick example</h3>
      <p>Declare state at module scope. When the file reloads, the component re-mounts but the signal stays the same.</p>
      ${new CodeBlock(`import { signal, html, mount } from '@deijose/nix-js';

// Preserved across HMR
const count = signal(0);

function Counter() {
  return html\`
    <button @click=\${() => count.value++}>
      Count: \${() => count.value}
    </button>
  \`;
}

mount(Counter, '#app');`, 'ts')}

      <div class="cl cl-i"><span class="cl-ic">ℹ️</span><p>Move shared state to module scope and use signals/stores to survive HMR without touching the core. The plugin handles everything automatically.</p></div>
    </div>
  `;
}
