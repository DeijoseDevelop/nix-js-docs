import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoRouter } from '../components/demos';

export function RouterPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Router</h2>
      <p class="page-sub">Client-side History API router with dynamic parameters, query strings, nested routes, guards, and reactive active-link styling.</p>

      <h3>Setup</h3>
      ${new CodeBlock(S.router_setup)}

      <h3>RouterView &amp; Link</h3>
      <p><code>RouterView</code> renders the matched component. <code>Link</code> creates a reactive anchor with active styling.</p>
      ${new CodeBlock(S.router_view)}

      <h3>Dynamic Params &amp; Query</h3>
      ${new CodeBlock(S.router_params)}

      <h3>Nested Routes</h3>
      <p>Define <code>children</code> on a route. The parent renders <code>new RouterView(1)</code> for the child slot.</p>
      ${new CodeBlock(S.router_nested)}

      ${new CodeBlock(S.router_guards)}

      <div class="tbl">
        <table>
          <tr><th>Property / Method</th><th>Type</th><th>Description</th></tr>
          <tr><td><code>router.current</code></td><td>Signal&lt;string&gt;</td><td>Active pathname (/users/42)</td></tr>
          <tr><td><code>router.params</code></td><td>Signal&lt;Record&lt;string,string&gt;&gt;</td><td>Dynamic route params ({ id: "42" })</td></tr>
          <tr><td><code>router.query</code></td><td>Signal&lt;Record&lt;string,string&gt;&gt;</td><td>Query string params ({ tab: "posts" })</td></tr>
          <tr><td><code>router.navigate(path, query?)</code></td><td>void</td><td>Navigate via pushState</td></tr>
          <tr><td><code>router.replace(path, query?)</code></td><td>void</td><td>Navigate via replaceState</td></tr>
          <tr><td><code>router.back() / forward() / go(n)</code></td><td>void</td><td>History navigation</td></tr>
          <tr><td><code>router.isActive(path, exact?)</code></td><td>boolean</td><td>Check if a path is active</td></tr>
          <tr><td><code>router.beforeEach(guard)</code></td><td>() =&gt; void</td><td>Global guard; returns removal fn</td></tr>
          <tr><td><code>router.afterEach(hook)</code></td><td>() =&gt; void</td><td>Post-navigation hook</td></tr>
        </table>
      </div>

      <div class="tbl">
        <table>
          <tr><th>Guard return value</th><th>Effect</th></tr>
          <tr><td><code>void / undefined</code></td><td>Allow navigation</td></tr>
          <tr><td><code>false</code></td><td>Cancel (URL unchanged)</td></tr>
          <tr><td><code>"string" path</code></td><td>Redirect to that path</td></tr>
          <tr><td><code>Promise&lt;...&gt;</code></td><td>Async guard semantics</td></tr>
        </table>
      </div>


      <h3>Live Demo</h3>
      <div class="demo">
        <div class="demo-lbl">Mini router — navigate, dynamic params, history</div>
        <div class="demo-grid">
          ${DemoRouter()}
        </div>
      </div>
    </div>
  `;
}
