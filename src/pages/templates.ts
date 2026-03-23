import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoTodo } from '../components/demos';


export function TemplatesPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Templates</h2>
      <p class="page-sub"><code>html</code> is a tagged template literal that returns a <code>NixTemplate</code> — a live DOM fragment with reactive bindings.</p>

      <h3>Basic Usage</h3>
      ${new CodeBlock(S.tpl_basic)}

      <h3>Text Bindings</h3>
      <div class="tbl">
        <table>
          <tr><th>Syntax</th><th>Behavior</th></tr>
          <tr><td><code>\${value}</code></td><td>Static — inserted once as a text node</td></tr>
          <tr><td><code>\${() => expr}</code></td><td>Reactive — updates the text node whenever signals inside change</td></tr>
        </table>
      </div>

      <h3>Attribute Bindings</h3>
      <p>Static values are set once. Function values <code>() =&gt; value</code> are reactive via effect. <code>null</code>, <code>undefined</code>, or <code>false</code> removes the attribute.</p>
      ${new CodeBlock(S.tpl_attrs)}
      <div class="cl cl-w"><span class="cl-ic">⚠️</span><p>Each attribute binding must be a single interpolation covering the entire value. Partial interpolation (<code>class="item \${expr}"</code>) is not supported — use template literals inside one interpolation instead: <code>class=\${() => \`item \${active ? 'on' : ''}\`}</code>.</p></div>

      <h3>Event Bindings &amp; Modifiers</h3>
      <p>Events are bound with <code>@eventname=</code>. Modifiers are chained with <code>.</code></p>
      ${new CodeBlock(S.tpl_events)}

      <div class="tbl">
        <table>
          <tr><th>Modifier</th><th>Effect</th></tr>
          <tr><td><code>.prevent</code></td><td>e.preventDefault()</td></tr>
          <tr><td><code>.stop</code></td><td>e.stopPropagation()</td></tr>
          <tr><td><code>.once</code></td><td>Listener removed after first call</td></tr>
          <tr><td><code>.capture</code></td><td>useCapture = true</td></tr>
          <tr><td><code>.passive</code></td><td>passive: true (performance hint)</td></tr>
          <tr><td><code>.self</code></td><td>Handler runs only when target === currentTarget</td></tr>
          <tr><td><code>.enter</code></td><td>Only fires when Enter key is pressed</td></tr>
          <tr><td><code>.escape</code></td><td>Only fires on Escape</td></tr>
        </table>
      </div>

      <h3>Keyed Lists — repeat()</h3>
      <p>Efficient diffing: DOM nodes for unchanged keys are preserved — only added/removed/reordered items are touched.</p>
      ${new CodeBlock(S.tpl_repeat)}

      <h3>Live Demo</h3>
      <div class="demo">
        <div class="demo-lbl">repeat() — keyed reactive list built inside a function component</div>
        <div class="demo-grid">
          ${DemoTodo()}
        </div>
      </div>


      <h3>DOM Refs — ref()</h3>
      <p>Create a typed container filled with the actual DOM element after mount, and cleared on unmount.</p>
      ${new CodeBlock(S.tpl_ref)}

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Prefer <code>repeat()</code> for lists that change over time. For static lists, <code>.map()</code> is perfectly fine.</p></div>
    </div>
  `;
}
