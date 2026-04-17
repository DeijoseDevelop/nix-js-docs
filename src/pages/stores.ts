import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoStore } from '../components/demos';

export function StoresPage(): NixTemplate {
  return html`
        <div>
            <h2 class="page-title">
                Global Stores
            </h2>
            <p class="page-sub">
                Reactive global state with <code>createStore()</code>. Every property becomes a <code>Signal</code>. Actions, computed getters, plugins, and cross-store bridges — all in one unified options object.
            </p>

            <h3>
                Basic Store
            </h3>
            <p>
                Pass the initial state and an optional options object. No positional <code>undefined</code> needed — just include what you use.
            </p>
            ${new CodeBlock(S.store_basic)}

            <h3>
                Store with Actions
            </h3>
            <p>
                Define mutations inside <code>actions</code>. Actions receive the raw signals and can read/write them directly. They are the canonical way to encapsulate complex state changes.
            </p>
            ${new CodeBlock(S.store_actions)}

            <h3>
                Computed Getters
            </h3>
            <p>
                Use <code>getters</code> to expose derived values as <code>ReadonlySignal</code> instances. They are lazily computed, cached, and throw on write — the same guarantees as <code>computed()</code> but scoped to the store.
            </p>
            ${new CodeBlock(S.store_getters)}

            <h3>
                Watching State
            </h3>
            <p>
                <code>$watch</code> is the same primitive as <code>watch()</code> from reactivity — no new API to learn. It fires once per flush regardless of how many signals changed.
            </p>
            ${new CodeBlock(S.store_watch)}

            <h3>
                Plugin System
            </h3>
            <p>
                Plugins are functions that receive the assembled store and optionally return a cleanup function. They extend the signal graph directly using <code>watch()</code>, <code>computed()</code>, or method wrapping — no hooks needed. Built-in plugins: <code>persistPlugin</code>, <code>loggerPlugin</code>, <code>guardPlugin</code>.
            </p>
            ${new CodeBlock(S.store_plugins)}

            <h3>
                Cross-Store Bridge
            </h3>
            <p>
                <code>bridgePlugin</code> connects two stores reactively. When the source store changes, the <code>sync</code> callback fires and can patch the target. Both stores remain decoupled — no imports between store files.
            </p>
            ${new CodeBlock(S.store_bridge)}

            <h3>
                Creating a Custom Plugin
            </h3>
            <p>
                A plugin is just a function — <code>(store) =&gt; cleanup | void</code>. It receives the fully assembled store and can use any reactivity primitive: <code>watch()</code>, <code>computed()</code>, or method wrapping. No lifecycle hooks to learn.
            </p>
            ${new CodeBlock(S.store_custom_plugin)}

            <p>
                If you need to intercept mutations before they land — for logging, auditing, or rate-limiting — wrap <code>$patch</code> directly and restore it in the cleanup:
            </p>
            ${new CodeBlock(S.store_plugin_intercept)}

            <div class="cl cl-i">
                <span class="cl-ic">📐</span>
                <p>
                    Plugin contract: receive the store, optionally return a cleanup function. The cleanup runs when <code>store.$dispose()</code> is called. Everything else — what you observe, what you wrap, what you attach — is up to you.
                </p>
            </div>

            <div class="tbl">
                <table>
                    <tr>
                        <th>
                            API
                        </th>
                        <th>
                            Description
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <code>store.prop.value</code>
                        </td>
                        <td>
                            Read/write a signal property directly
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>store.$state</code>
                        </td>
                        <td>
                            Reactive read-only snapshot of all values
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>store.$stateSignal</code>
                        </td>
                        <td>
                            Underlying <code>ReadonlySignal&lt;T&gt;</code> for plugins and computed graphs
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>store.$id</code>
                        </td>
                        <td>
                            Store name (set via <code>options.name</code>)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>store.$reset()</code>
                        </td>
                        <td>
                            Restore all signals to initial values (batched)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>store.$patch(partial)</code>
                        </td>
                        <td>
                            Batch-update multiple signals at once
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>store.$watch(cb, opts?)</code>
                        </td>
                        <td>
                            Watch full state; fires once per flush. Returns stop function
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>store.$dispose()</code>
                        </td>
                        <td>
                            Dispose store, computed graph, and all plugin cleanups
                        </td>
                    </tr>
                </table>
            </div>

            <div class="tbl">
                <table>
                    <tr>
                        <th>
                            Option
                        </th>
                        <th>
                            Type
                        </th>
                        <th>
                            Description
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <code>name</code>
                        </td>
                        <td>
                            string
                        </td>
                        <td>
                            Store identifier — appears in error messages and devtools
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>actions</code>
                        </td>
                        <td>
                            (signals) =&gt; A
                        </td>
                        <td>
                            Factory for mutation methods
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>getters</code>
                        </td>
                        <td>
                            (signals) =&gt; G
                        </td>
                        <td>
                            Factory for computed <code>ReadonlySignal</code> values
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>plugins</code>
                        </td>
                        <td>
                            NixPlugin[]
                        </td>
                        <td>
                            Array of plugin functions; each can return a cleanup
                        </td>
                    </tr>
                </table>
            </div>

            <div class="cl cl-t">
                <span class="cl-ic">💡</span>
                <p>
                    One store file per domain (<code>cart.ts</code>, <code>auth.ts</code>, <code>rider.ts</code>). Export as module-level singletons — no context or DI required. Use <code>$dispose()</code> on logout or route teardown to clean up plugins and effects.
                </p>
            </div>

            <div class="ul">
                <ul>
                    <li>
                        Use <code>actions</code> for mutations involving multiple signals or business logic
                    </li>
                    <li>
                        Use <code>getters</code> for derived state that multiple components need to share
                    </li>
                    <li>
                        Use <code>$watch</code> (not <code>effect</code>) to react to full state changes — fires once per flush
                    </li>
                    <li>
                        Use <code>$patch()</code> for ad-hoc multi-key updates from outside the store
                    </li>
                    <li>
                        Use <code>persistPlugin</code> for localStorage sync — it handles SSR, private mode, and schema migrations
                    </li>
                    <li>
                        Use <code>guardPlugin</code> if you need validation or transformation before any mutation lands
                    </li>
                    <li>
                        Use <code>bridgePlugin</code> to sync two stores without coupling their files
                    </li>
                    <li>
                        Always call <code>$dispose()</code> on stores that are not module-level singletons
                    </li>
                </ul>
            </div>

            <h3>
                Live Demo
            </h3>
            <div class="demo">
                <div class="demo-lbl">
                    Shopping cart — createStore() with actions, getters, $watch and $patch
                </div>
                <div class="demo-grid">
                    ${DemoStore()}
                </div>
            </div>
        </div>
    `;
}
