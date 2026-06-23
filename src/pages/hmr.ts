import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';

export function HMRPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Hot Module Replacement</h2>
      <p class="page-sub">Keep your state while you edit. The Vite plugin preserves signals, stores, routers, and forms across updates.</p>

      <h3>Install</h3>
      ${new CodeBlock('npm install -D @deijose/vite-plugin-nix-js', 'bash')}

      <h3>Configure Vite</h3>
      ${new CodeBlock(`import { defineConfig } from 'vite';
import nix from '@deijose/vite-plugin-nix-js';

export default defineConfig({
  plugins: [nix()],
});`, 'ts')}

      <h3>What is preserved</h3>
      <div class="cards">
        <div class="card"><span class="card-ic">⚡</span><div class="card-t">Signals</div><div class="card-d">Top-level <code>signal()</code> declarations keep their current values.</div></div>
        <div class="card"><span class="card-ic">📦</span><div class="card-t">Stores</div><div class="card-d"><code>createStore()</code> instances are reused and re-patched after reload.</div></div>
        <div class="card"><span class="card-ic">🔀</span><div class="card-t">Router</div><div class="card-d">Path, params, query, and history stack survive the update.</div></div>
        <div class="card"><span class="card-ic">📋</span><div class="card-t">Forms</div><div class="card-d"><code>createForm()</code> values, touched, dirty, and errors are kept.</div></div>
      </div>

      <h3>Example</h3>
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

      <h3>Limitations</h3>
      <ul class="bullet-list">
        <li><strong>Module scope only:</strong> signals, stores, routers, and forms declared inside functions are recreated on every call.</li>
        <li><strong>Class component state:</strong> private properties set in <code>NixComponent</code> <code>onInit</code>/<code>onMount</code> are reset.</li>
        <li><strong>Module-granular:</strong> when a file changes, all <code>mount()</code> points in that file are re-mounted.</li>
      </ul>

      <div class="cl cl-i"><span class="cl-ic">ℹ️</span><p>Move shared state to module scope and use signals/stores to survive HMR without touching the core.</p></div>
    </div>
  `;
}
