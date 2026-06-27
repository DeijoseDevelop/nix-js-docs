import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function TestingPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Testing</h2>
      <p class="page-sub">
        Lightweight, tree-shakeable testing utilities for Nix.js. Test components in a real DOM environment (happy-dom, jsdom) with an API inspired by Testing Library.
      </p>

      <h3>Features</h3>
      <div class="ul">
        <ul>
          <li><strong>No bundled DOM environment</strong> — choose <code>happy-dom</code> or <code>jsdom</code>.</li>
          <li><strong>Tree-shakeable</strong> — import only what you need.</li>
          <li><strong>Zero production weight</strong> — dev dependency only.</li>
          <li><strong>Testing Library-style API</strong> — familiar queries and event helpers.</li>
          <li><strong>Signal-aware</strong> — handles reactive templates out of the box.</li>
        </ul>
      </div>

      <h3>Installation</h3>
      <p>
        <code>@deijose/nix-js</code> is a peer dependency. You also need a DOM environment and a test runner.
      </p>
      ${new CodeBlock(S.testing_install, 'bash')}

      <h3>Configure Vitest</h3>
      <p>
        Use <code>happy-dom</code> as the test environment. It is faster than jsdom and fully compatible.
      </p>
      ${new CodeBlock(S.testing_vitest_config)}

      <h3>Basic test</h3>
      <p>
        Import <code>render</code>, <code>screen</code>, <code>fireEvent</code>, and <code>waitFor</code> from <code>@deijose/nix-js-testing</code>. Render your component, query the DOM, fire events, and assert.
      </p>
      ${new CodeBlock(S.testing_basic)}

      <h3>render(component, options?)</h3>
      <p>
        Mounts a Nix.js component into a container and returns bound queries plus an <code>unmount</code> function. By default the container is appended to <code>document.body</code>.
      </p>
      ${new CodeBlock(S.testing_render_options)}

      <h4>RenderResult</h4>
      <div class="tbl">
        <table>
          <tr><th>Property</th><th>Type</th><th>Description</th></tr>
          <tr><td><code>container</code></td><td><code>HTMLElement</code></td><td>The DOM container where the component was mounted.</td></tr>
          <tr><td><code>unmount</code></td><td><code>() => void</code></td><td>Unmount the component and remove the container.</td></tr>
          <tr><td><code>getByText</code></td><td><code>(text, options?) => HTMLElement</code></td><td>Find an element by its text content. Throws if not found or if multiple match.</td></tr>
          <tr><td><code>queryByText</code></td><td><code>(text, options?) => HTMLElement | null</code></td><td>Same as <code>getByText</code> but returns <code>null</code> instead of throwing.</td></tr>
          <tr><td><code>getAllByText</code></td><td><code>(text, options?) => HTMLElement[]</code></td><td>Find all elements matching the text.</td></tr>
          <tr><td><code>getByRole</code></td><td><code>(role) => HTMLElement</code></td><td>Find by ARIA role or element tag name.</td></tr>
          <tr><td><code>getAllByRole</code></td><td><code>(role) => HTMLElement[]</code></td><td>Find all elements with a given role.</td></tr>
          <tr><td><code>queryByRole</code></td><td><code>(role) => HTMLElement | null</code></td><td>Query by role without throwing.</td></tr>
          <tr><td><code>getByTestId</code></td><td><code>(testId) => HTMLElement</code></td><td>Find by <code>data-testid</code> attribute.</td></tr>
          <tr><td><code>queryByTestId</code></td><td><code>(testId) => HTMLElement | null</code></td><td>Query by <code>data-testid</code> without throwing.</td></tr>
          <tr><td><code>getAllByTestId</code></td><td><code>(testId) => HTMLElement[]</code></td><td>Find all elements with the same <code>data-testid</code>.</td></tr>
          <tr><td><code>getByLabelText</code></td><td><code>(label) => HTMLElement</code></td><td>Find by <code>&lt;label&gt;</code> text or <code>aria-label</code>. Returns the associated control.</td></tr>
          <tr><td><code>getByPlaceholderText</code></td><td><code>(text) => HTMLElement</code></td><td>Find by <code>placeholder</code> attribute.</td></tr>
          <tr><td><code>getByDisplayValue</code></td><td><code>(value) => HTMLElement</code></td><td>Find input, textarea, or select by its current value.</td></tr>
        </table>
      </div>

      <h3>screen</h3>
      <p>
        Global queries bound to <code>document.body</code>. Useful when you don't want to destructure from <code>render</code> or when querying elements rendered by child components.
      </p>
      ${new CodeBlock(S.testing_queries)}

      <h4>getByText options</h4>
      <div class="tbl">
        <table>
          <tr><th>Option</th><th>Type</th><th>Description</th></tr>
          <tr><td><code>exact</code></td><td><code>boolean</code></td><td>Require an exact text match. Default <code>false</code> (partial match).</td></tr>
          <tr><td><code>selector</code></td><td><code>string</code></td><td>CSS selector to filter candidate elements. Default <code>"*"</code>.</td></tr>
        </table>
      </div>

      <h3>fireEvent</h3>
      <p>
        Simulates DOM events. Includes shorthand helpers for common events and a generic dispatcher for custom events. Automatically sets <code>target.value</code> and <code>target.checked</code> from the init object before dispatching.
      </p>
      ${new CodeBlock(S.testing_fire_event)}

      <h4>EventInit properties</h4>
      <div class="tbl">
        <table>
          <tr><th>Property</th><th>Description</th></tr>
          <tr><td><code>bubbles</code></td><td>Whether the event bubbles. Default <code>true</code>.</td></tr>
          <tr><td><code>cancelable</code></td><td>Whether the event is cancelable. Default <code>true</code>.</td></tr>
          <tr><td><code>composed</code></td><td>Whether the event crosses shadow boundaries. Default <code>true</code>.</td></tr>
          <tr><td><code>key</code> / <code>code</code> / <code>keyCode</code> / <code>which</code></td><td>Keyboard event details.</td></tr>
          <tr><td><code>target.value</code></td><td>Value to assign to the input element before dispatch.</td></tr>
          <tr><td><code>target.checked</code></td><td>Checked state to assign to a checkbox/radio before dispatch.</td></tr>
        </table>
      </div>

      <h3>waitFor(callback, options?)</h3>
      <p>
        Retries a callback until it passes or a timeout is reached. Essential for asserting asynchronous signal updates, fetch results, and transitions.
      </p>
      ${new CodeBlock(S.testing_wait_for)}

      <h4>WaitForOptions</h4>
      <div class="tbl">
        <table>
          <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
          <tr><td><code>timeout</code></td><td><code>number</code></td><td><code>1000</code></td><td>Maximum time to wait in milliseconds.</td></tr>
          <tr><td><code>interval</code></td><td><code>number</code></td><td><code>50</code></td><td>Polling interval between retries in milliseconds.</td></tr>
        </table>
      </div>

      <h3>Cleanup</h3>
      <p>
        Each call to <code>render</code> registers an <code>unmount</code> function for automatic cleanup. Use <code>cleanup()</code> in <code>afterEach</code> to guarantee a fresh DOM between tests, or call <code>unmount()</code> manually when needed.
      </p>
      ${new CodeBlock(S.testing_cleanup)}

      <h3>Examples</h3>

      <h4>Testing a form</h4>
      <p>
        Fill inputs, submit the form, and wait for validation or success messages.
      </p>
      ${new CodeBlock(S.testing_form_example)}

      <h4>Testing async data</h4>
      <p>
        Components that fetch data need <code>waitFor</code> to assert the rendered output once signals update.
      </p>
      ${new CodeBlock(S.testing_async_component)}

      <h3>Best practices</h3>
      <div class="ul">
        <ul>
          <li><strong>Use <code>data-testid</code></strong> when text or role queries are ambiguous or locale-dependent.</li>
          <li><strong>Always wrap async assertions in <code>waitFor</code></strong> — signals update asynchronously and DOM may not reflect changes immediately.</li>
          <li><strong>Call <code>cleanup()</code> in <code>afterEach</code></strong> to prevent state leakage between tests.</li>
          <li><strong>Prefer <code>getByRole</code> and <code>getByLabelText</code></strong> over <code>getByTestId</code> when possible — they test accessibility too.</li>
          <li><strong>Use <code>queryBy*</code></strong> when asserting that an element is <em>not</em> present.</li>
          <li><strong>Test behavior, not implementation</strong> — click the button, don't call the handler directly.</li>
        </ul>
      </div>

      <h3>API Overview</h3>

      <h4>Core</h4>
      <div class="ul">
        <ul>
          <li><code>render(component, options?)</code> — mount a component and return queries + unmount.</li>
          <li><code>cleanup()</code> — unmount all rendered components registered during the test.</li>
          <li><code>screen</code> — global queries bound to <code>document.body</code>.</li>
        </ul>
      </div>

      <h4>Queries</h4>
      <div class="ul">
        <ul>
          <li><code>getByText(text, options?)</code> / <code>queryByText</code> / <code>getAllByText</code></li>
          <li><code>getByRole(role)</code> / <code>getAllByRole</code> / <code>queryByRole</code></li>
          <li><code>getByTestId(testId)</code> / <code>queryByTestId</code> / <code>getAllByTestId</code></li>
          <li><code>getByLabelText(label)</code></li>
          <li><code>getByPlaceholderText(placeholder)</code></li>
          <li><code>getByDisplayValue(value)</code></li>
        </ul>
      </div>

      <h4>Events</h4>
      <div class="ul">
        <ul>
          <li><code>fireEvent(element, eventName, init?)</code> — generic dispatcher.</li>
          <li><code>fireEvent.click</code>, <code>dblClick</code>, <code>input</code>, <code>change</code>, <code>submit</code>, <code>focus</code>, <code>blur</code>, <code>keyDown</code>, <code>keyUp</code>, <code>mouseEnter</code>, <code>mouseLeave</code>.</li>
        </ul>
      </div>

      <h4>Async</h4>
      <div class="ul">
        <ul>
          <li><code>waitFor(callback, options?)</code> — retry callback with <code>timeout</code> and <code>interval</code> options.</li>
        </ul>
      </div>

      <div class="cl cl-i"><span class="cl-ic">ℹ️</span><p>All utilities are zero-weight in production. They are only imported in test files and tree-shaken from the app bundle.</p></div>
    </div>
  `;
}
