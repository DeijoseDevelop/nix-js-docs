import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoAsync } from '../components/demos';

export function AsyncPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Async &amp; Lazy Loading</h2>
      <p class="page-sub">Async data fetching with <code>suspend()</code>, shared caching with <code>createQuery()</code>, and code splitting with <code>lazy()</code>.</p>

      <h3>suspend() — Async Suspense</h3>
      <p>Runs an async function and renders different UIs depending on its state: pending, resolved, or error.</p>
      ${new CodeBlock(S.async_suspend)}

      <div class="tbl">
        <table>
          <tr><th>Option</th><th>Type</th><th>Description</th></tr>
          <tr><td><code>pending</code></td><td>NixTemplate</td><td>Rendered during load</td></tr>
          <tr><td><code>resolved</code></td><td>(data: T) =&gt; NixTemplate</td><td>Rendered on success</td></tr>
          <tr><td><code>error</code></td><td>(err: any) =&gt; NixTemplate</td><td>Rendered on rejection</td></tr>
          <tr><td><code>invalidate</code></td><td>Signal&lt;any&gt;</td><td>Trigger re-fetch</td></tr>
          <tr><td><code>delay</code></td><td>number (ms)</td><td>Min pending time</td></tr>
          <tr><td><code>timeout</code></td><td>number (ms)</td><td>Max wait time</td></tr>
        </table>
      </div>


      <h3>Re-fetching with invalidate</h3>
      <p>When data comes from an external source and you need to refresh after mutations, pass an <code>invalidate</code> signal. The DOM is reused — no destroy/recreate cycle.</p>
      ${new CodeBlock(S.async_invalidate)}

      <h3>createQuery() — Shared Cache</h3>
      <p>For apps with multiple components sharing the same data source. Data is cached globally by key — when a component remounts, cached data renders instantly.</p>
      ${new CodeBlock(S.async_query)}

      <div class="tbl">
        <table>
          <tr><th>Scenario</th><th>Use</th></tr>
          <tr><td>Single component owns the data + refresh trigger</td><td><code>suspend()</code> + <code>invalidate</code></td></tr>
          <tr><td>Multiple components share the same data source</td><td><code>createQuery()</code> + <code>invalidateQueries()</code></td></tr>
          <tr><td>One-shot data (no refresh needed)</td><td><code>suspend()</code> without options</td></tr>
          <tr><td>Cached data across page navigations</td><td><code>createQuery()</code> with <code>staleTime</code></td></tr>
        </table>
      </div>

      <h3>lazy() — Code Splitting</h3>
      <p>Wraps a dynamic <code>import()</code> for code splitting. The module chunk is loaded once and cached.</p>
      ${new CodeBlock(S.async_lazy)}

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Use <code>createQuery()</code> with <code>staleTime</code> for data that doesn't change often. While fresh, no background refetch happens on mount.</p></div>

      <h3>Live Demo</h3>
      <div class="demo">
        <div class="demo-lbl">Async fetch simulation — pending / resolved / error states</div>
        <div class="demo-grid">
          ${DemoAsync()}
        </div>
      </div>
    </div>
  `;
}
