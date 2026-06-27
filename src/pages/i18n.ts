import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function I18nPage(): NixTemplate {
    return html`
        <div>
            <h2 class="page-title">
                Nix.js I18n
            </h2>
            <p class="page-sub">
                Internationalization library for Nix.js built on signals and stores. Reactive translations, zero runtime dependencies (uses native <code>Intl</code>), type-safe keys, and a plugin ecosystem for persistence, detection, routing, and more.
            </p>

            <h3>
                Features
            </h3>
            <div class="ul">
                <ul>
                    <li><strong>Reactive translations</strong> — powered by Nix.js signals. Changing the locale updates the UI instantly.</li>
                    <li><strong>Zero runtime dependencies</strong> — uses the native <code>Intl</code> API for formatting.</li>
                    <li><strong>Type-safe keys</strong> — interpolation parameters are inferred from message strings at compile time.</li>
                    <li><strong>Multiple backends</strong> — inline objects, JSON files, or any custom API.</li>
                    <li><strong>Lazy-loaded namespaces</strong> — load translation bundles on demand.</li>
                    <li><strong>Pluralization</strong> — pipe syntax and ICU format support.</li>
                    <li><strong>Contexts</strong> — contextual keys for gender, formality, or any domain rule.</li>
                    <li><strong>Date, number, currency, relative time, list formatting</strong> — all via <code>Intl</code>, reactive to locale changes.</li>
                    <li><strong>Plugins</strong> — persistence, locale detection, router sync, head tags, cross-tab sync, form validation, ICU pluralization, and dev overlay.</li>
                    <li><strong>Optional provide/inject</strong> — for sub-trees and tenant isolation.</li>
                    <li><strong>CLI</strong> — extract keys from source and generate translation templates.</li>
                </ul>
            </div>

            <h3>
                Installation
            </h3>
            <p>
                <code>@deijose/nix-js</code> is a peer dependency.
            </p>
            ${new CodeBlock('npm install @deijose/nix-js @deijose/nix-i18n', 'bash')}

            <h3>
                Quick Start
            </h3>
            <p>
                Create an i18n instance with messages and a default locale. Use <code>i18n.t(key, params)</code> for translations and <code>i18n.setLocale(locale)</code> to switch languages reactively.
            </p>
            ${new CodeBlock(S.i18n_quick_start)}

            <h3>
                Core API
            </h3>

            <h4><code>createI18n(options)</code></h4>
            <p>
                Returns an <code>I18nInstance</code> that is also a Nix.js store. All store signals and methods are available directly.
            </p>
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>locale</code></td><td><code>string</code></td><td>Initial locale. Required.</td></tr>
                    <tr><td><code>fallbackLocale</code></td><td><code>string</code></td><td>Locale used when a key is missing in the current locale.</td></tr>
                    <tr><td><code>messages</code></td><td><code>Record&lt;string, Messages&gt;</code></td><td>Inline messages object.</td></tr>
                    <tr><td><code>backend</code></td><td><code>I18nBackend</code></td><td>External source for lazy-loaded translations.</td></tr>
                    <tr><td><code>namespaces</code></td><td><code>string[]</code></td><td>Namespace names to auto-load when a backend is present.</td></tr>
                    <tr><td><code>persist</code></td><td><code>boolean | PersistOptions</code></td><td>Enable locale persistence plugin.</td></tr>
                    <tr><td><code>detect</code></td><td><code>boolean | DetectOptions</code></td><td>Enable locale detection plugin.</td></tr>
                    <tr><td><code>nestedFallback</code></td><td><code>boolean</code></td><td>Enable nested key fallback (e.g. <code>"auth.login.title"</code> → <code>"auth.login"</code>).</td></tr>
                </table>
            </div>

            <h4>Instance Signals & Methods</h4>
            ${new CodeBlock(S.i18n_store_signals)}

            <h4>Persist & Detect Shorthand</h4>
            <p>
                Instead of calling plugins manually, you can pass <code>persist</code> and <code>detect</code> directly to <code>createI18n</code>. The library auto-applies the plugins during initialization.
            </p>
            ${new CodeBlock(S.i18n_create_shorthand)}

            <h4>Translation</h4>
            <div class="tbl">
                <table>
                    <tr><th>API</th><th>Description</th></tr>
                    <tr><td><code>i18n.t(key, params?, options?)</code></td><td>Translate a key with optional interpolation and context.</td></tr>
                    <tr><td><code>i18n.n(count, key, params?)</code></td><td>Plural-aware translation. Passes <code>count</code> as a param.</td></tr>
                    <tr><td><code>i18n.useNamespace(ns)</code></td><td>Returns a scoped API: <code>{ t, n }</code> that auto-prefixes the namespace.</td></tr>
                </table>
            </div>

            <h4>Interpolation</h4>
            <p>
                Messages use <code>{paramName}</code> syntax. Values can be strings, numbers, signals, or functions. Format specifiers like <code>{date:long}</code> are reserved for future use.
            </p>

            <h4>Reactive Interpolation</h4>
            <p>
                Interpolation parameters can be reactive. Pass a <code>Signal</code> and its value is read automatically. Pass a function and it is re-evaluated on every render. This is especially powerful inside Nix.js templates.
            </p>
            ${new CodeBlock(S.i18n_reactive_interpolation)}

            <h4>Contexts</h4>
            <p>
                Pass <code>{ context: "male" }</code> to resolve <code>greeting_male</code> instead of <code>greeting</code> when available. Falls back to the base key if the contextual variant is missing.
            </p>

            <h3>
                Pluralization
            </h3>
            <p>
                Use the pipe syntax for simple plural forms. The number of segments determines the behavior:
            </p>
            <div class="ul">
                <ul>
                    <li><strong>1 segment</strong> — no plural logic.</li>
                    <li><strong>2 segments</strong> — singular | plural.</li>
                    <li><strong>3 segments</strong> — zero | singular | plural.</li>
                    <li><strong>4+ segments</strong> — maps to <code>Intl.PluralRules</code> categories (zero, one, two, few, many, other).</li>
                </ul>
            </div>
            ${new CodeBlock(S.i18n_pluralization)}

            <h3>
                Nested Fallback
            </h3>
            <p>
                When <code>nestedFallback: true</code>, a missing key like <code>"auth.login.title"</code> falls back to <code>"auth.login"</code> if that exists. Useful for pages where most keys share a common parent.
            </p>
            ${new CodeBlock(S.i18n_nested_fallback)}

            <h3>
                Namespaces
            </h3>
            <p>
                Split translations into bundles (common, auth, dashboard) and load them lazily. The namespace API auto-prefixes keys so you don't repeat the namespace in every call.
            </p>
            ${new CodeBlock(S.i18n_namespaces)}

            <h3>
                Backends
            </h3>
            <p>
                Backends implement the <code>I18nBackend</code> interface with a single <code>load(locale, namespace)</code> method. Return messages as an object. Set <code>supportsNamespaces: true</code> if your backend handles namespaces.
            </p>

            <h4>JSON Backend</h4>
            <p>
                Loads <code>/locales/{locale}/{namespace}.json</code> files with built-in caching.
            </p>
            ${new CodeBlock(S.i18n_json_backend)}

            <h4>API Backend</h4>
            <p>
                Fetches translations from an endpoint. Supports GET/POST, custom headers, and request body builders.
            </p>
            ${new CodeBlock(S.i18n_api_backend)}

            <h4>Object Backend</h4>
            <p>
                Wraps an inline messages object as a backend. Useful for SSR or when messages are bundled at build time.
            </p>
            ${new CodeBlock(S.i18n_object_backend)}

            <h4>Custom Backend</h4>
            <p>
                Implement <code>I18nBackend</code> for any data source: Firestore, SQLite, GraphQL, etc. Only one method required.
            </p>
            ${new CodeBlock(S.i18n_custom_backend)}

            <h3>
                Formatters
            </h3>
            <p>
                All formatters use the native <code>Intl</code> API and react to locale changes automatically.
            </p>
            <div class="tbl">
                <table>
                    <tr><th>API</th><th>Description</th><th>Intl equivalent</th></tr>
                    <tr><td><code>i18n.d(value, options?)</code></td><td>Date / time formatting</td><td><code>Intl.DateTimeFormat</code></td></tr>
                    <tr><td><code>i18n.nFormat(value, options?)</code></td><td>Number formatting</td><td><code>Intl.NumberFormat</code></td></tr>
                    <tr><td><code>i18n.c(value, currency, options?)</code></td><td>Currency formatting</td><td><code>Intl.NumberFormat</code> with <code>style: "currency"</code></td></tr>
                    <tr><td><code>i18n.rt(value, unit, options?)</code></td><td>Relative time formatting</td><td><code>Intl.RelativeTimeFormat</code></td></tr>
                    <tr><td><code>i18n.list(values, options?)</code></td><td>List formatting</td><td><code>Intl.ListFormat</code></td></tr>
                </table>
            </div>
            ${new CodeBlock(S.i18n_formatters)}

            <h3>
                Plugins
            </h3>

            <h4>Persist Locale</h4>
            <p>
                Saves the active locale to <code>localStorage</code> and restores it on app startup.
            </p>
            ${new CodeBlock(S.i18n_persist_plugin)}
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>key</code></td><td><code>string</code></td><td>Storage key. Default: <code>"nix-i18n-locale"</code>.</td></tr>
                    <tr><td><code>storage</code></td><td><code>Storage</code></td><td>Custom storage object. Default: <code>localStorage</code>.</td></tr>
                </table>
            </div>

            <h4>Detect Locale</h4>
            <p>
                Detects the user's preferred locale from multiple sources in priority order. Falls back to the base language code if the full locale is unavailable.
            </p>
            ${new CodeBlock(S.i18n_detect_plugin)}
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>order</code></td><td><code>Array&lt;"localStorage" | "sessionStorage" | "navigator" | "url" | "path" | "fallback"&gt;</code></td><td>Detection priority order. Default: <code>["localStorage", "navigator", "fallback"]</code>.</td></tr>
                    <tr><td><code>storageKey</code></td><td><code>string</code></td><td>Key used for local/session storage lookup. Default: <code>"nix-i18n-locale"</code>.</td></tr>
                    <tr><td><code>urlParam</code></td><td><code>string</code></td><td>Query parameter name for URL detection. Default: <code>"lang"</code>.</td></tr>
                    <tr><td><code>pathPrefix</code></td><td><code>boolean | string</code></td><td>Enable path-based detection. Use a string to strip a base path prefix.</td></tr>
                </table>
            </div>
            <div class="tbl">
                <table>
                    <tr><th>Source</th><th>Description</th></tr>
                    <tr><td><code>localStorage</code></td><td>Reads previously persisted locale.</td></tr>
                    <tr><td><code>sessionStorage</code></td><td>Reads from <code>sessionStorage</code>.</td></tr>
                    <tr><td><code>navigator</code></td><td>Uses <code>navigator.language</code>.</td></tr>
                    <tr><td><code>url</code></td><td>Reads <code>?lang=</code> query param.</td></tr>
                    <tr><td><code>path</code></td><td>Reads the first path segment (e.g. <code>/es/page</code>).</td></tr>
                    <tr><td><code>fallback</code></td><td>Uses the configured fallback locale.</td></tr>
                </table>
            </div>

            <h4>Router Integration</h4>
            <p>
                Two-way sync between locale and the Nix.js router. Query mode keeps <code>?lang=</code> in sync. Prefix mode auto-prefixes routes like <code>/es/page</code>.
            </p>
            ${new CodeBlock(S.i18n_router_plugin)}

            <h4>Head Tags</h4>
            <p>
                Automatically updates <code>&lt;html lang&gt;</code>, <code>dir</code> (auto-detects RTL for ar/he/fa/ur), and custom meta tags when the locale changes.
            </p>
            ${new CodeBlock(S.i18n_head_plugin)}

            <h4>Cross-Tab Sync</h4>
            <p>
                Uses <code>BroadcastChannel</code> to keep the locale synchronized across all open tabs of the same origin.
            </p>
            ${new CodeBlock(S.i18n_sync_plugin)}

            <h4>Form Validation</h4>
            <p>
                Wraps validator factories so error messages are automatically translated. Supports <code>keyPrefix</code> and <code>keyMap</code> for custom message keys.
            </p>
            ${new CodeBlock(S.i18n_form_plugin)}

            <h4>createI18nValidator Helper</h4>
            <p>
                For one-off validators, use <code>createI18nValidator</code> instead of wrapping an entire validator set. It creates a single translated validator for a specific translation key.
            </p>
            ${new CodeBlock(S.i18n_create_validator)}

            <h4>ICU Pluralization</h4>
            <p>
                Replaces the default pipe syntax with full ICU MessageFormat plural support. Wraps <code>i18n.t</code> and processes <code>{count, plural, ...}</code> patterns.
            </p>
            ${new CodeBlock(S.i18n_icu_plugin)}

            <h4>Dev Overlay</h4>
            <p>
                Development-only plugin that logs missing translation keys to the console and optionally renders a red overlay listing all missing keys.
            </p>
            ${new CodeBlock(S.i18n_dev_overlay)}

            <h3>
                CLI
            </h3>
            <p>
                Two built-in CLI tools for managing translation keys.
            </p>

            <h4>Extract Keys</h4>
            <p>
                Scans source files for <code>t()</code>, <code>i18n.t()</code>, and <code>i18n.n()</code> calls and outputs a JSON array of discovered keys.
            </p>
            ${new CodeBlock(S.i18n_cli_extract, 'bash')}

            <h4>Generate Translation File</h4>
            <p>
                Extracts keys and generates a JSON file with empty values for every locale. Ready to hand off to translators.
            </p>
            ${new CodeBlock(S.i18n_cli_generate, 'bash')}

            <h3>
                Reactive Templates
            </h3>
            <p>
                Because <code>i18n.t()</code> reads reactive signals internally, wrap it in a function inside <code>html\`\`</code> templates for live updates when the locale changes.
            </p>
            ${new CodeBlock(S.i18n_reactive_template)}

            <h3>
                Optional Provide / Inject
            </h3>
            <p>
                Use Nix.js <code>provide/inject</code> to share the i18n instance down the component tree. Useful for tenant isolation or sub-applications. Import <code>I18nInjectionKey</code> from <code>@deijose/nix-i18n</code>.
            </p>
            ${new CodeBlock(S.i18n_inject_import)}

            <h3>
                TypeScript
            </h3>
            <p>
                Keys and interpolation parameters are fully typed. Missing keys and missing params are caught at compile time.
            </p>
            ${new CodeBlock(S.i18n_typescript)}

            <h3>
                API Overview
            </h3>

            <h4>Core</h4>
            <div class="ul">
                <ul>
                    <li><code>createI18n(options)</code> — reactive i18n instance backed by a store.</li>
                    <li><code>i18n.t(key, params?, options?)</code> — translate with interpolation and context.</li>
                    <li><code>i18n.n(count, key, params?)</code> — plural-aware translation.</li>
                    <li><code>i18n.useNamespace(namespace)</code> — scoped <code>{ t, n }</code> API.</li>
                    <li><code>i18n.setLocale(locale)</code>, <code>i18n.setMessages(locale, messages)</code>, <code>i18n.loadNamespace(ns)</code></li>
                    <li><code>i18n.locale</code>, <code>i18n.messages</code>, <code>i18n.isLoading</code>, <code>i18n.loadedNamespaces</code></li>
                    <li><code>i18n.currentMessages</code>, <code>i18n.fallbackMessages</code></li>
                    <li><code>i18n.d()</code>, <code>i18n.nFormat()</code>, <code>i18n.c()</code>, <code>i18n.rt()</code>, <code>i18n.list()</code></li>
                </ul>
            </div>

            <h4>Backends</h4>
            <div class="ul">
                <ul>
                    <li><code>jsonBackend({ baseUrl, namespaces? })</code> — load JSON files per locale/namespace.</li>
                    <li><code>apiBackend({ url, headers?, method?, body? })</code> — fetch from an API endpoint.</li>
                    <li><code>objectBackend(messages)</code> — wrap an inline object as a backend.</li>
                    <li>Custom via <code>I18nBackend</code> interface — <code>load(locale, namespace)</code> and optional <code>supportsNamespaces</code>.</li>
                </ul>
            </div>

            <h4>Plugins</h4>
            <div class="ul">
                <ul>
                    <li><code>persistLocalePlugin(i18n, options?)</code> — save/restore locale from storage.</li>
                    <li><code>detectLocalePlugin(i18n, options?)</code> — auto-detect locale from multiple sources.</li>
                    <li><code>routerLocalePlugin(i18n, router, options?)</code> — sync locale with router query or prefix.</li>
                    <li><code>headPlugin(i18n, options?)</code> — update <code>&lt;html lang&gt;</code>, <code>dir</code>, and meta tags.</li>
                    <li><code>syncLocalePlugin(i18n, options?)</code> — cross-tab sync via BroadcastChannel.</li>
                    <li><code>formValidationPlugin(i18n, validators, options?)</code> — translated form validators.</li>
                    <li><code>createI18nValidator(i18n, key, defaultMessage)</code> — single translated validator helper.</li>
                    <li><code>icuPluralizePlugin(i18n)</code> — ICU MessageFormat plural support.</li>
                    <li><code>devOverlayPlugin(i18n, options?)</code> — missing key logging and overlay.</li>
                </ul>
            </div>

            <h4>Provide / Inject</h4>
            <div class="ul">
                <ul>
                    <li><code>I18nInjectionKey</code> — injection key for provide/inject.</li>
                    <li><code>useI18n(fallback?)</code> — inject the i18n instance in descendant components.</li>
                </ul>
            </div>

            <h4>CLI</h4>
            <div class="ul">
                <ul>
                    <li><code>nix-i18n-extract &lt;paths...&gt; [--output &lt;file&gt;]</code> — scan source for translation keys.</li>
                    <li><code>nix-i18n-generate &lt;paths...&gt; --locales &lt;es,en&gt; [--output &lt;file&gt;]</code> — generate empty translation files.</li>
                </ul>
            </div>

            <h3>
                Best Practices
            </h3>
            <div class="ul">
                <ul>
                    <li><strong>Use namespaces</strong> — split translations by domain (common, auth, dashboard) and lazy-load them.</li>
                    <li><strong>Wrap <code>i18n.t()</code> in functions inside templates</strong> — this makes the translation reactive to locale changes.</li>
                    <li><strong>Enable <code>nestedFallback</code></strong> — reduces duplication when many keys share a common prefix.</li>
                    <li><strong>Use the detect + persist plugins together</strong> — detect on first visit, persist on change, restore on return.</li>
                    <li><strong>Use <code>Intl</code> formatters</strong> — <code>i18n.d</code>, <code>i18n.nFormat</code>, <code>i18n.c</code> instead of hard-coding formats in messages.</li>
                    <li><strong>Run the CLI in CI</strong> — <code>nix-i18n-extract</code> to ensure no orphaned keys and no missing translations.</li>
                    <li><strong>Use <code>devOverlayPlugin</code> in development</code> — catch missing keys before they reach production.</li>
                    <li><strong>Keep messages flat when possible</strong> — deeply nested objects are harder to maintain and type-infer.</li>
                </ul>
            </div>

            <div class="cl cl-i">
                <span class="cl-ic">📐</span>
                <p>
                    <strong>License:</strong> MIT — <code>@deijose/nix-i18n</code> is open source and free to use in any project.
                </p>
            </div>
        </div>
    `;
}
