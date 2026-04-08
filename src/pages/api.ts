import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';

export function APIPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">API Reference</h2>
      <p class="page-sub">Complete public API — every export with signature, return type, and description.</p>

      <h3>Reactivity</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Returns</th><th>Description</th></tr>
        <tr><td><code>signal&lt;T&gt;(initial)</code></td><td>Signal&lt;T&gt;</td><td>Create a reactive value container</td></tr>
        <tr><td><code>computed&lt;T&gt;(fn)</code></td><td>Signal&lt;T&gt; (readonly)</td><td>Derived reactive value, lazily cached</td></tr>
        <tr><td><code>effect(fn)</code></td><td>dispose: () =&gt; void</td><td>Run and auto re-run on signal changes</td></tr>
        <tr><td><code>batch(fn)</code></td><td>void</td><td>Flush multiple writes as one update</td></tr>
        <tr><td><code>watch(src, cb, opts?)</code></td><td>dispose: () =&gt; void</td><td>Observe a source with old+new values</td></tr>
        <tr><td><code>untrack&lt;T&gt;(fn)</code></td><td>T</td><td>Read signals without creating subscriptions</td></tr>
        <tr><td><code>nextTick(fn?)</code></td><td>Promise&lt;void&gt;</td><td>Await post-DOM-update microtask</td></tr>
      </table></div>

      <h3>Signal Methods</h3>
      <div class="tbl"><table>
        <tr><th>Method</th><th>Description</th></tr>
        <tr><td><code>.value</code> (get)</td><td>Read and subscribe if inside an effect</td></tr>
        <tr><td><code>.value = x</code> (set)</td><td>Write; notify subscribers if changed (Object.is)</td></tr>
        <tr><td><code>.update(fn)</code></td><td>Atomic updater — fn(current) → next</td></tr>
        <tr><td><code>.peek()</code></td><td>Read without subscribing</td></tr>
        <tr><td><code>.dispose()</code></td><td>Clear all subscribers permanently</td></tr>
      </table></div>

      <h3>Templates</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Description</th></tr>
        <tr><td><code>html\`\`</code></td><td>Tagged template → NixTemplate</td></tr>
        <tr><td><code>repeat(items, keyFn, renderFn)</code></td><td>Keyed list with efficient DOM reuse</td></tr>
        <tr><td><code>ref&lt;T&gt;()</code></td><td>Create a ref for direct DOM access after mount</td></tr>
      </table></div>

      <h3>Components</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Description</th></tr>
        <tr><td><code>NixComponent</code></td><td>Base class with onInit/render/onMount/onUnmount/onError</td></tr>
        <tr><td><code>mount(component, container, options?)</code></td><td>Mount template or component; optional DI options (for example: <code>{ router }</code>)</td></tr>
        <tr><td><code>.setChildren(content)</code></td><td>Pass default slot content (chainable)</td></tr>
        <tr><td><code>.setSlot(name, content)</code></td><td>Pass named slot content (chainable)</td></tr>
      </table></div>

      <h3>Router</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Description</th></tr>
        <tr><td><code>createRouter(routes)</code></td><td>Initialize router singleton; call once at startup</td></tr>
        <tr><td><code>useRouter()</code></td><td>Access the active router from any component</td></tr>
        <tr><td><code>RouterKey</code></td><td>Injection key used when mounting with <code>{ router }</code></td></tr>
        <tr><td><code>RouterView(depth?)</code></td><td>Renders matched route at given nesting depth</td></tr>
        <tr><td><code>Link(path, label)</code></td><td>Reactive anchor with automatic active styling</td></tr>
        <tr><td><code>router.navigate(location, q?)</code></td><td>Navigate via history.pushState (string path or named route location)</td></tr>
        <tr><td><code>router.replace(location, q?)</code></td><td>Navigate via history.replaceState (string path or named route location)</td></tr>
        <tr><td><code>router.resolve(path)</code></td><td>Inspect match result ({ matched, params, route }) including route meta</td></tr>
        <tr><td><code>createRouter(routes, { mode: "hash" })</code></td><td>Enable hash-based routing strategy</td></tr>
        <tr><td><code>createRouter(routes, { scrollBehavior })</code></td><td>Customize scroll restoration using saved back/forward positions</td></tr>
        <tr><td><code>router.beforeEach(guard)</code></td><td>Register global guard; returns removal fn</td></tr>
        <tr><td><code>RouteRecord.name?</code></td><td>Optional named route identifier for typed navigation</td></tr>
        <tr><td><code>RouteRecord.meta?</code></td><td>Optional metadata object available on matched route</td></tr>
      </table></div>

      <h3>Stores</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Description</th></tr>
        <tr><td><code>createStore(state, actions?, getters?)</code></td><td>Create a reactive global store with optional actions and computed getters</td></tr>
        <tr><td><code>store.$state</code></td><td>Reactive read-only snapshot of all values</td></tr>
        <tr><td><code>store.$reset()</code></td><td>Restore all signals to initial values</td></tr>
        <tr><td><code>store.$patch(partial)</code></td><td>Batch-update multiple signals at once</td></tr>
        <tr><td><code>store.$subscribe((key, newVal, oldVal) =&gt; ...)</code></td><td>Subscribe to all state key changes; returns unsubscribe</td></tr>
      </table></div>

      <h3>Async</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Description</th></tr>
        <tr><td><code>suspend(asyncFn, renderFn, opts?)</code></td><td>Async data with suspense, invalidate, and cache</td></tr>
        <tr><td><code>createQuery(key, asyncFn, renderFn, opts?)</code></td><td>Key-based query with global shared cache</td></tr>
        <tr><td><code>invalidateQueries(key)</code></td><td>Clear cache + force active instances to refetch</td></tr>
        <tr><td><code>lazy(importFn, fallback?)</code></td><td>Dynamic import with caching for code splitting</td></tr>
      </table></div>

      <h3>Forms</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Description</th></tr>
        <tr><td><code>createForm(state, opts?)</code></td><td>Manage a full form with validation and submission (supports nested dot-path fields)</td></tr>
        <tr><td><code>useField(initial, validators?, mode?)</code></td><td>Manage a single reactive field</td></tr>
        <tr><td><code>useFieldArray(items, validators?)</code></td><td>Dynamic list of field groups</td></tr>
        <tr><td><code>Validator&lt;T, AllValues&gt;</code></td><td>Validator signature: <code>(value, allValues?) =&gt; string | null | undefined</code></td></tr>
        <tr><td><code>required() / minLength() / email() / ...</code></td><td>Built-in validators</td></tr>
      </table></div>

      <h3>Dependency Injection</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Description</th></tr>
        <tr><td><code>createInjectionKey&lt;T&gt;(desc?)</code></td><td>Create typed globally unique Symbol key</td></tr>
        <tr><td><code>provide(key, value)</code></td><td>Register value for descendants (call in onInit)</td></tr>
        <tr><td><code>inject(key)</code></td><td>Retrieve nearest ancestor's provided value</td></tr>
      </table></div>

      <h3>UI Primitives</h3>
      <div class="tbl"><table>
        <tr><th>Export</th><th>Description</th></tr>
        <tr><td><code>portal(content, target?)</code></td><td>Render content outside current DOM tree</td></tr>
        <tr><td><code>createPortalOutlet()</code></td><td>Create typed anchor token</td></tr>
        <tr><td><code>transition(content, opts?)</code></td><td>CSS class-based enter/leave animations</td></tr>
        <tr><td><code>createErrorBoundary(content, fallback)</code></td><td>Error-catching subtree wrapper</td></tr>
        <tr><td><code>showWhen(el, condition)</code></td><td>Imperative show/hide via style.display</td></tr>
      </table></div>
    </div>
  `;
}
