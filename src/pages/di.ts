import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoDI } from '../components/demos';

export function DIPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Dependency Injection</h2>
      <p class="page-sub">Vue-style <code>provide</code>/<code>inject</code> — pass values down the component tree without prop drilling. Fully typed with Symbol keys.</p>

      <h3>Usage</h3>
      ${new CodeBlock(S.di_fn)}

      <div class="tbl">
        <table>
          <tr><th>Function</th><th>When to call</th><th>Description</th></tr>
          <tr><td><code>createInjectionKey&lt;T&gt;(desc?)</code></td><td>Module scope</td><td>Create a typed, globally unique Symbol key</td></tr>
          <tr><td><code>provide(key, value)</code></td><td>Inside onInit()</td><td>Register a value for ALL descendant components</td></tr>
          <tr><td><code>inject(key)</code></td><td>Inside onInit() or constructor</td><td>Retrieve the nearest ancestor's provided value</td></tr>
        </table>
      </div>

      <div class="cl cl-w"><span class="cl-ic">⚠️</span><p><code>provide()</code> must be called inside <code>onInit()</code>, never at module scope. Calling <code>inject()</code> outside a component context returns <code>undefined</code> silently.</p></div>

      <ul class="list">
        <li>The <strong>nearest</strong> ancestor wins — multiple providers for the same key are fine (inner overrides outer)</li>
        <li>Provide <strong>reactive signals</strong> so consumers get live updates when the signal changes</li>
        <li>Typed keys prevent mismatches between providers and consumers at compile time</li>
        <li>Works across any depth of nesting — no prop drilling through intermediate components</li>
      </ul>

      <h3>Live Demo</h3>
      <div class="demo">
        <div class="demo-lbl">Theme + i18n context — provide() at root, inject() in consumer</div>
        <div class="demo-grid">
          ${DemoDI()}
        </div>
      </div>
    </div>
  `;
}
