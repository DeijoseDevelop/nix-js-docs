import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoStore } from '../components/demos';

export function StoresPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Global Stores</h2>
      <p class="page-sub">Reactive global state with <code>createStore()</code>. Every property becomes a <code>Signal</code>. Optional typed actions, computed getters, and global subscriptions.</p>

      <h3>Basic Store</h3>
      ${new CodeBlock(S.store_basic)}

      <h3>Store with Actions</h3>
      ${new CodeBlock(S.store_actions)}

      <h3>Computed Getters (third argument)</h3>
      <p>Use the optional third factory to expose derived values as <code>computed()</code> signals on the store.</p>
      ${new CodeBlock(S.store_getters)}

      <h3>Subscriptions (middleware pattern)</h3>
      <p><code>$subscribe</code> listens to every state signal change and returns an unsubscribe function. Useful for persistence, devtools, and logging middleware.</p>
      ${new CodeBlock(S.store_subscribe)}

      <div class="tbl">
        <table>
          <tr><th>API</th><th>Description</th></tr>
          <tr><td><code>store.prop.value</code></td><td>Read/write a signal property</td></tr>
          <tr><td><code>store.$state</code></td><td>Reactive read-only snapshot of all values</td></tr>
          <tr><td><code>store.$reset()</code></td><td>Restore all signals to initial values</td></tr>
          <tr><td><code>store.$patch(partial)</code></td><td>Batch-update multiple signals at once</td></tr>
          <tr><td><code>store.$subscribe((key, newVal, oldVal) =&gt; ...)</code></td><td>Watch all state keys; returns unsubscribe</td></tr>
        </table>
      </div>

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Best practice: one store file per domain (cart.ts, auth.ts, theme.ts). Export the store as a module-level singleton so any component can import it directly.</p></div>

      <div class="ul">
        <ul>
          <li>Create one store file per domain (<code>cart.ts</code>, <code>user.ts</code>, <code>theme.ts</code>)</li>
          <li>Export stores as module-level singletons — no React Context or DI needed</li>
          <li>Use <code>$patch()</code> for updating multiple signals atomically</li>
          <li>Use actions for complex mutations involving multiple signals</li>
          <li>Use third-arg getters for derived state exposed as reusable computed signals</li>
          <li>Use <code>$subscribe()</code> for persistence/devtools middleware and always cleanup with unsubscribe</li>
          <li>Use <code>$reset()</code> on logout or to restore initial state</li>
          <li>Combine with <code>computed()</code> inside stores for derived state</li>
        </ul>
      </div>


      <h3>Live Demo</h3>
      <div class="demo">
        <div class="demo-lbl">Shopping cart — createStore() with computed totals</div>
        <div class="demo-grid">
          ${DemoStore()}
        </div>
      </div>
    </div>
  `;
}
