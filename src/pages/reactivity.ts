import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoCounter, DemoComputed, DemoEffect, DemoBatch, DemoWatch, DemoUntrack } from '../components/demos';

export function ReactivityPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Reactivity</h2>
      <p class="page-sub">Three primitives power everything: <code>signal</code>, <code>effect</code>, and <code>html</code>. Everything else is built on top.</p>

      <div class="cards">
        <div class="card"><span class="card-ic">📡</span><div class="card-t">signal(value)</div><div class="card-d">A reactive container. Reading it inside an effect creates a subscription automatically.</div></div>
        <div class="card"><span class="card-ic">🔄</span><div class="card-t">computed(fn)</div><div class="card-d">Derived value: lazily cached and recalculated only when dependencies change.</div></div>
        <div class="card"><span class="card-ic">⚡</span><div class="card-t">effect(fn)</div><div class="card-d">Runs immediately, re-runs when signals read inside it change. Returns a dispose function.</div></div>
        <div class="card"><span class="card-ic">📦</span><div class="card-t">batch(fn)</div><div class="card-d">Groups multiple signal writes into a single effect flush for performance.</div></div>
        <div class="card"><span class="card-ic">👁</span><div class="card-t">watch(src, cb)</div><div class="card-d">Observes a source with old+new values. Does not run on init (unlike effect).</div></div>
        <div class="card"><span class="card-ic">🚫</span><div class="card-t">untrack(fn)</div><div class="card-d">Read signals without creating subscriptions — no effect re-runs for that signal.</div></div>
      </div>

      <div class="tbl">
        <table>
          <tr><th>API</th><th>Returns</th><th>Description</th></tr>
          <tr><td><code>signal(initial)</code></td><td>Signal&lt;T&gt;</td><td>Create a reactive value</td></tr>
          <tr><td><code>computed(fn)</code></td><td>Signal&lt;T&gt; (readonly)</td><td>Derived value, lazily cached</td></tr>
          <tr><td><code>effect(fn)</code></td><td>dispose: () =&gt; void</td><td>Run and auto re-run on signal reads</td></tr>
          <tr><td><code>batch(fn)</code></td><td>void</td><td>Flush multiple writes as one update</td></tr>
          <tr><td><code>watch(src, cb, opts?)</code></td><td>dispose: () =&gt; void</td><td>Observe changes with old+new values</td></tr>
          <tr><td><code>untrack(fn)</code></td><td>T</td><td>Read signals without subscribing</td></tr>
          <tr><td><code>nextTick(fn?)</code></td><td>Promise&lt;void&gt;</td><td>Await post-DOM-update microtask</td></tr>
        </table>
      </div>


      <h3>signal() — Reactive Container</h3>
      <p>The core primitive. Uses <code>Object.is</code> equality — setting the same value is a no-op.</p>
      ${new CodeBlock(S.signal_fn)}

      <h3>computed() — Derived Value</h3>
      <p>Returns a read-only <code>Signal&lt;T&gt;</code> that recalculates lazily when dependencies change.</p>
      ${new CodeBlock(S.computed_fn)}

      <h3>effect() — Side Effects</h3>
      <p>Runs immediately, re-runs on signal changes. Returns a <code>dispose()</code> function. Supports cleanup via return value.</p>
      ${new CodeBlock(S.effect_fn)}

      <h3>batch() — Grouped Updates</h3>
      <p>Without <code>batch()</code>, each signal write triggers effects individually. Inside a batch, effects flush once at the end.</p>
      ${new CodeBlock(S.batch_fn)}

      <h3>watch() — Observe Changes</h3>
      <p>Unlike <code>effect()</code>, <code>watch()</code> does NOT run on initialization. It receives <code>(newValue, oldValue)</code>.</p>
      ${new CodeBlock(S.watch_fn)}

      <div class="tbl">
        <table>
          <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
          <tr><td><code>immediate</code></td><td>boolean</td><td>false</td><td>Run callback immediately with current value</td></tr>
          <tr><td><code>once</code></td><td>boolean</td><td>false</td><td>Auto-dispose after first invocation</td></tr>
        </table>
      </div>

      <h3>untrack() — Read Without Subscribing</h3>
      <p>Reads signals inside <code>fn</code> without creating subscriptions. The current effect won't re-run when those signals change.</p>
      ${new CodeBlock(S.untrack_fn)}

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Each interpolation inside <code>html\`\`</code> creates at most one <code>effect()</code>. When a signal changes, only the DOM nodes bound to that signal are updated.</p></div>

      <h3>Live Demos</h3>
      <div class="demo">
        <div class="demo-lbl">All demos are live Nix.js function components</div>
        <div class="demo-grid">
          ${DemoCounter()}
          ${DemoComputed()}
          ${DemoEffect()}
          ${DemoBatch()}
          ${DemoWatch()}
          ${DemoUntrack()}
        </div>
      </div>
    </div>
  `;
}
