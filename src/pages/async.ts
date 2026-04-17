import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoAsync } from '../components/demos';

export function AsyncPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Async &amp; Lazy Loading</h2>
      <p class="page-sub">Async data fetching with <code>suspend()</code> and code splitting with <code>lazy()</code>. For shared multi-component caching, see <a href="https://www.npmjs.com/package/@deijose/nix-query" target="_blank" rel="noopener">@deijose/nix-query</a>.</p>

      <h3>suspend() — Async Suspense</h3>
      <p>Runs an async function and renders different UIs depending on its state: pending, resolved, or error.</p>
      ${new CodeBlock(S.async_suspend)}

      <div class="tbl">
        <table>
          <tr><th>Option</th><th>Type</th><th>Description</th></tr>
          <tr><td><code>fallback</code></td><td>NixTemplate</td><td>Rendered during load</td></tr>
          <tr><td><code>errorFallback</code></td><td>(err: any) =&gt; NixTemplate</td><td>Rendered on rejection</td></tr>
          <tr><td><code>invalidate</code></td><td>Signal&lt;any&gt;</td><td>Bump to trigger re-fetch</td></tr>
          <tr><td><code>cacheKey</code></td><td>string</td><td>Reuse data across mounts (stale-while-revalidate)</td></tr>
          <tr><td><code>staleTime</code></td><td>number (ms)</td><td>How long cached data is considered fresh</td></tr>
          <tr><td><code>resetOnRefresh</code></td><td>boolean</td><td>Show fallback again on re-fetch (default: false)</td></tr>
        </table>
      </div>

      <h3>Re-fetching with invalidate</h3>
      <p>When data comes from an external source and you need to refresh after mutations, pass an <code>invalidate</code> signal. The DOM is reused — no destroy/recreate cycle.</p>
      ${new CodeBlock(S.async_invalidate)}

      <h3>lazy() — Code Splitting</h3>
      <p>Wraps a dynamic <code>import()</code> for code splitting. The module chunk is loaded once and cached. Works inside routes or inline.</p>
      ${new CodeBlock(S.async_lazy)}

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Need multiple components sharing the same data source with global cache invalidation? Install <code>@deijose/nix-query</code> — it provides <code>createQuery()</code> and <code>invalidateQueries()</code> as a dedicated package.</p></div>

      <div class="tbl">
        <table>
          <tr><th>Scenario</th><th>Use</th></tr>
          <tr><td>Single component owns the data + refresh trigger</td><td><code>suspend()</code> + <code>invalidate</code></td></tr>
          <tr><td>Multiple components share the same data source</td><td><code>@deijose/nix-query</code></td></tr>
          <tr><td>One-shot data (no refresh needed)</td><td><code>suspend()</code> without options</td></tr>
          <tr><td>Code splitting / lazy page loads</td><td><code>lazy()</code></td></tr>
        </table>
      </div>

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
