import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function ErrorsPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Error Boundaries</h2>
      <p class="page-sub">Catch rendering errors and show fallback UI without crashing the whole application.</p>

      <h3>Usage</h3>
      ${new CodeBlock(S.errors_fn)}

      <h3>What is and isn't caught</h3>
      <div class="tbl">
        <table>
          <tr><th>Scenario</th><th>Caught?</th></tr>
          <tr><td>Template expression throws during initial render</td><td>✓ Yes</td></tr>
          <tr><td>onInit() throws</td><td>✓ Yes</td></tr>
          <tr><td>render() throws</td><td>✓ Yes</td></tr>
          <tr><td>onMount() throws</td><td>✓ Yes</td></tr>
          <tr><td>Reactive effect throws after mount</td><td>✓ Yes</td></tr>
          <tr><td>Event handler throws</td><td>✗ No — use try/catch in the handler</td></tr>
          <tr><td>async / await / Promises reject</td><td>✗ No — use try/catch + signals</td></tr>
          <tr><td>Errors inside the fallback itself</td><td>✗ No — propagate to parent boundary</td></tr>
        </table>
      </div>

      <div class="cl cl-i"><span class="cl-ic">ℹ️</span><p>Once a boundary switches to fallback, all remaining effects from the failed subtree are automatically disposed — no memory leaks.</p></div>
      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Nest boundaries strategically — use widget-level boundaries for risky components and a root-level boundary as a last resort.</p></div>
    </div>
  `;
}
