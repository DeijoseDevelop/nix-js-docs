import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function PortalsPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Portals</h2>
      <p class="page-sub">Render a component outside the current DOM tree — typically into <code>document.body</code>. Essential for modals, tooltips, dropdowns, and toasts.</p>

      <h3>Basic Usage</h3>
      ${new CodeBlock(S.portal_fn)}

      <h3>Reactive Portal</h3>
      <p>The portal is mounted and unmounted together with its controlling condition:</p>
      ${new CodeBlock(`const isOpen = signal(false);

html\`
  <button @click=\${() => { isOpen.value = true; }}>Open modal</button>

  \${() => isOpen.value
    ? portal(html\`
        <div class="overlay" @click=\${() => { isOpen.value = false; }}>
          <div class="modal" @click.stop=\${() => {}}>
            <h2>Modal title</h2>
            <button @click=\${() => { isOpen.value = false; }}>Close</button>
          </div>
        </div>
      \`)
    : null
  }
\``)}

      <h3>Outlet Patterns</h3>
      <div class="tbl">
        <table>
          <tr><th>Pattern</th><th>DOM access needed</th><th>Typed</th><th>Best for</th></tr>
          <tr><td><code>portal(content, "#selector")</code></td><td>Yes</td><td>No</td><td>Quick, direct targeting</td></tr>
          <tr><td><code>createPortalOutlet() + portalOutlet()</code></td><td>No</td><td>Yes</td><td>Shared layout anchors</td></tr>
          <tr><td><code>portal(content, ref)</code></td><td>No</td><td>Yes</td><td>Same-template targeting</td></tr>
          <tr><td><code>provideOutlet / injectOutlet</code></td><td>No</td><td>Yes</td><td>Deep trees, zero prop drilling</td></tr>
        </table>
      </div>

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Portals clean up automatically — when the parent template unmounts, all its portals are removed too. No manual cleanup needed.</p></div>
    </div>
  `;
}
