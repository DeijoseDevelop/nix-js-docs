import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function TransitionsPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Transitions</h2>
      <p class="page-sub">CSS class-based enter/leave animations. Zero JS animation logic in your components.</p>

      <h3>Basic Usage</h3>
      ${new CodeBlock(S.transition_fn)}

      <h3>CSS Class Lifecycle</h3>
      <div class="tbl">
        <table>
          <tr><th>Phase</th><th>Step 1 (before rAF)</th><th>Step 2 (after rAF)</th><th>Step 3 (end)</th></tr>
          <tr><td>Enter</td><td>{n}-enter-from + {n}-enter-active</td><td>{n}-enter-to + {n}-enter-active</td><td>All classes removed</td></tr>
          <tr><td>Leave</td><td>{n}-leave-from + {n}-leave-active</td><td>{n}-leave-to + {n}-leave-active</td><td>All removed, DOM cleaned up</td></tr>
        </table>
      </div>

      <h3>Common CSS Recipes</h3>
      ${new CodeBlock(`.fade-enter-active,
.fade-leave-active  { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to      { opacity: 0; }

/* Slide up */
.slide-enter-active,
.slide-leave-active { transition: transform 0.25s ease, opacity 0.25s; }
.slide-enter-from,
.slide-leave-to     { transform: translateY(10px); opacity: 0; }

/* Scale */
.scale-enter-active,
.scale-leave-active { transition: transform 0.2s ease, opacity 0.2s; }
.scale-enter-from,
.scale-leave-to     { transform: scale(0.92); opacity: 0; }`, 'css')}

      <h3>TransitionOptions Reference</h3>
      <div class="tbl">
        <table>
          <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
          <tr><td><code>name</code></td><td>string</td><td>"nix"</td><td>Prefix for all CSS classes</td></tr>
          <tr><td><code>appear</code></td><td>boolean</td><td>false</td><td>Animate on first render</td></tr>
          <tr><td><code>duration</code></td><td>number</td><td>—</td><td>Fallback ms when no CSS transition found</td></tr>
          <tr><td><code>onBeforeEnter / onAfterEnter</code></td><td>(el) =&gt; void</td><td>—</td><td>JS hooks for enter phase</td></tr>
          <tr><td><code>onBeforeLeave / onAfterLeave</code></td><td>(el) =&gt; void</td><td>—</td><td>JS hooks for leave phase</td></tr>
        </table>
      </div>

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Set <code>appear: true</code> to animate even the first render. By default, the enter transition is skipped on initial mount.</p></div>
    </div>
  `;
}
