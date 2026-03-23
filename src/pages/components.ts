import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function ComponentsPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Components</h2>
      <p class="page-sub">Two styles: <strong>function components</strong> (NixTemplate) for simplicity, <strong>class components</strong> (NixComponent) when you need lifecycle hooks.</p>

      <h3>Function Components (Recommended)</h3>
      <p>A plain function that returns <code>html\`\`</code>. No class boilerplate — signals close over the function scope. This is the recommended pattern for pages and display components.</p>
      ${new CodeBlock(S.comp_fn)}

      <h3>Class Components — NixComponent</h3>
      <p>Extend <code>NixComponent</code> only when you need lifecycle hooks (<code>onInit</code>, <code>onMount</code>, <code>onUnmount</code>, <code>onError</code>). Common cases: timers, data fetching, external subscriptions, cleanup.</p>
      ${new CodeBlock(S.comp_class)}

      <h3>Lifecycle Order</h3>
      <div class="tbl">
        <table>
          <tr><th>Hook</th><th>When</th><th>Notes</th></tr>
          <tr><td><code>onInit()</code></td><td>Before render, no DOM</td><td>Setup signals, call provide(). Synchronous.</td></tr>
          <tr><td><code>render()</code></td><td>Once — required</td><td>Returns the NixTemplate. Called only once.</td></tr>
          <tr><td><code>[DOM inserted]</code></td><td>—</td><td>Template is mounted into the real DOM.</td></tr>
          <tr><td><code>onMount()</code></td><td>After DOM inserted</td><td>DOM reads, subscriptions, timers. Return fn = cleanup.</td></tr>
          <tr><td><code>onUnmount()</code></td><td>Before DOM removed</td><td>DOM still accessible here.</td></tr>
          <tr><td><code>[cleanup runs]</code></td><td>After onUnmount</td><td>Cleanup function returned from onMount() is called.</td></tr>
          <tr><td><code>onError(err)</code></td><td>onInit/onMount throws</td><td>Errors re-thrown if hook not implemented.</td></tr>
        </table>
      </div>

      <h3>Children & Named Slots</h3>
      <p>Pass content into a component from the outside — no compiler magic needed.</p>
      ${new CodeBlock(S.comp_slots)}

      <div class="tbl">
        <table>
          <tr><th>Method</th><th>Returns</th><th>Notes</th></tr>
          <tr><td><code>setChildren(content)</code></td><td>this (chainable)</td><td>Set the default slot content</td></tr>
          <tr><td><code>setSlot(name, content)</code></td><td>this (chainable)</td><td>Set a named slot</td></tr>
          <tr><td><code>this.children</code></td><td>NixChildren</td><td>Access default slot in render()</td></tr>
          <tr><td><code>this.slot(name)</code></td><td>NixChildren | undefined</td><td>Access named slot; returns undefined if empty</td></tr>
        </table>
      </div>

      <h3>mount()</h3>
      <p>The entry point for any application or component tree.</p>
      ${new CodeBlock(`
// Function component
const handle = mount(App(), '#app');

// Class component
const handle = mount(new DataTable(), document.getElementById('app')!);

// Unmount: disposes all effects, calls onUnmount(), removes DOM
handle.unmount();`)}

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Use function components for pages, display components, and anything that doesn't need lifecycle hooks. Use class components only when you need <code>onMount</code>, <code>onUnmount</code>, or <code>onError</code>.</p></div>
    </div>
  `;
}
