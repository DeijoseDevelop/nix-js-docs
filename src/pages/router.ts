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

      <h3>Route Meta &amp; resolve()</h3>
      <p>Attach arbitrary metadata to routes with <code>meta</code>, then read it from the matched route via <code>router.resolve(to)</code> inside guards.</p>
      ${new CodeBlock(S.router_meta)}

      <h3>Scroll Restoration</h3>
      <p>The router saves scroll positions in <code>history.state</code>, restores them on back/forward, and lets you customize behavior via <code>scrollBehavior</code>.</p>
      ${new CodeBlock(S.router_scroll)}

      <h3>Hash Mode</h3>
      <p>Use <code>mode: "hash"</code> when your hosting environment cannot rewrite all routes to <code>index.html</code>. In this mode, the router reads from <code>location.hash</code> and listens to <code>hashchange</code>.</p>
      ${new CodeBlock(S.router_mode)}

      <h3>Named Routes</h3>
      <p>Define <code>name</code> in your routes and navigate with objects instead of hardcoded strings. This improves refactors and keeps dynamic params explicit.</p>
      ${new CodeBlock(S.router_named)}

      <div class="tbl">
        <table>
          <tr><th>Property / Method</th><th>Type</th><th>Description</th></tr>
          <tr><td><code>router.current</code></td><td>Signal&lt;string&gt;</td><td>Active pathname (/users/42)</td></tr>
          <tr><td><code>router.params</code></td><td>Signal&lt;Record&lt;string,string&gt;&gt;</td><td>Dynamic route params ({ id: "42" })</td></tr>
          <tr><td><code>router.query</code></td><td>Signal&lt;Record&lt;string,string&gt;&gt;</td><td>Query string params ({ tab: "posts" })</td></tr>
          <tr><td><code>router.navigate(location, query?)</code></td><td>void</td><td>Navigate via pushState using string path or named location</td></tr>
          <tr><td><code>router.replace(location, query?)</code></td><td>void</td><td>Navigate via replaceState using string path or named location</td></tr>
          <tr><td><code>router.back() / forward() / go(n)</code></td><td>void</td><td>History navigation</td></tr>
          <tr><td><code>router.isActive(path, exact?)</code></td><td>boolean</td><td>Check if a path is active</td></tr>
          <tr><td><code>router.resolve(path)</code></td><td>{ matched, params, route }</td><td>Inspect route match and access <code>route.meta</code></td></tr>
          <tr><td><code>options.mode</code></td><td><code>"history" | "hash"</code></td><td>URL strategy. <code>history</code> by default</td></tr>
          <tr><td><code>options.scrollBehavior(to, from, saved)</code></td><td>ScrollPosition | false | void</td><td>Customize navigation scroll behavior</td></tr>
          <tr><td><code>RouteRecord.name?</code></td><td>string</td><td>Optional stable route name used by named navigation</td></tr>
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
