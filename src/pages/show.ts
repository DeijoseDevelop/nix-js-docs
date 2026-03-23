import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoShowHide } from '../components/demos';

export function ShowPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Show / Hide</h2>
      <p class="page-sub">Toggle element visibility without removing from the DOM. State, input values, event listeners, and child components are all preserved.</p>

      <h3>Usage</h3>
      ${new CodeBlock(S.show_fn)}

      <h3>show vs conditional rendering</h3>
      <div class="tbl">
        <table>
          <tr><th></th><th>show / hide</th><th>Conditional (? : null)</th></tr>
          <tr><td>DOM node kept</td><td>✓ always</td><td>✗ destroyed when hidden</td></tr>
          <tr><td>Child state preserved</td><td>✓</td><td>✗ reset on re-mount</td></tr>
          <tr><td>Event listeners</td><td>✓ kept</td><td>✗ re-attached on re-mount</td></tr>
          <tr><td>onMount on toggle</td><td>Not called</td><td>Called every toggle</td></tr>
          <tr><td>CSS transitions</td><td>Easy — element stays</td><td>Requires transition()</td></tr>
          <tr><td>Best for</td><td>Tabs, drawers, frequent toggles</td><td>Auth gates, exclusive branches</td></tr>
        </table>
      </div>

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Use <code>show/hide</code> when state inside the element must survive the toggle (e.g. form inputs, scroll position). Use conditional rendering for mutually exclusive branches.</p></div>

      <h3>Live Demo</h3>
      <div class="demo">
        <div class="demo-lbl">Toggle panels — notice input values survive show/hide</div>
        <div class="demo-grid">
          ${DemoShowHide()}
        </div>
      </div>
    </div>
  `;
}
