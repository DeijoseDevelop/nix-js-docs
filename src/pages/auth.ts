import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function AuthPage(): NixTemplate {
    return html`
        <div>
            <h2 class="page-title">
                Nix.js Auth
            </h2>
            <p class="page-sub">
                Authentication and authorization library for Nix.js built entirely on reactive signals. Agnostic by design — bring your own driver, user model, and authorization rules.
            </p>

            <h3>
                Features
            </h3>
            <div class="ul">
                <ul>
                    <li><strong>Signal-based state</strong> — <code>auth.user</code>, <code>auth.isAuthenticated</code>, <code>auth.can(...)</code> are reactive signals.</li>
                    <li><strong>Driver-based core</strong> — connect JWT, session cookies, API keys, OIDC, or any custom backend.</li>
                    <li><strong>Custom user model</strong> — no forced <code>roles</code> or <code>permissions</code> fields; use identity mapping or custom policies.</li>
                    <li><strong>Policy engine</strong> — compose authorization rules with <code>createPolicy</code>, <code>rbacPolicy</code>, and helpers.</li>
                    <li><strong>Router integration</strong> — declarative <code>meta.auth</code> DSL and standalone guards.</li>
                    <li><strong>Multiple providers</strong> — email/password, API keys, OIDC, and other strategies in the same app.</li>
                    <li><strong>Auto-refresh</strong> — automatically refresh tokens before expiry with custom schedules.</li>
                    <li><strong>Storage adapters</strong> — localStorage, sessionStorage, cookies, and memory.</li>
                    <li><strong>Auth manager</strong> — <code>createAuthManager</code> for multi-context or multi-tenant apps.</li>
                    <li><strong>SSR seeds</strong> — <code>seed</code> option for server-side rendering.</li>
                    <li><strong>TypeScript-first</strong> — full generic support for <code>Session</code>, <code>User</code>, and <code>Credentials</code>.</li>
                </ul>
            </div>

            <h3>
                Installation
            </h3>
            <p>
                <code>@deijose/nix-js</code> is a peer dependency.
            </p>
            ${new CodeBlock('npm install @deijose/nix-js @deijose/nix-js-auth', 'bash')}

            <h3>
                Quick Start
            </h3>
            <p>
                Create an auth instance with a driver, storage, and optional policies. All state is exposed as reactive signals that templates and components can read directly.
            </p>
            ${new CodeBlock(S.auth_quick_start)}

            <h3>
                Core API
            </h3>
            <p>
                <code>createAuth(options)</code> returns a reactive <code>AuthInstance</code>. The instance exposes signals for the current session and user, plus methods to log in, log out, refresh, and evaluate policies.
            </p>
            ${new CodeBlock(S.auth_create)}

            <h4>Signals</h4>
            <div class="tbl">
                <table>
                    <tr><th>Signal</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>auth.session</code></td><td><code>Signal&lt;Session | null&gt;</code></td><td>Raw session data returned by the driver.</td></tr>
                    <tr><td><code>auth.user</code></td><td><code>Signal&lt;User | null&gt;</code></td><td>User object derived from the session via <code>driver.toUser</code>.</td></tr>
                    <tr><td><code>auth.token</code></td><td><code>Signal&lt;string | null&gt;</code></td><td>Token extracted from the session.</td></tr>
                    <tr><td><code>auth.isAuthenticated</code></td><td><code>Signal&lt;boolean&gt;</code></td><td><code>true</code> when <code>user</code> is not null.</td></tr>
                    <tr><td><code>auth.isAnonymous</code></td><td><code>Signal&lt;boolean&gt;</code></td><td><code>true</code> when <code>user</code> is null.</td></tr>
                    <tr><td><code>auth.isReady</code></td><td><code>Signal&lt;boolean&gt;</code></td><td><code>true</code> after the initial storage hydration completes.</td></tr>
                    <tr><td><code>auth.isLoading</code></td><td><code>Signal&lt;boolean&gt;</code></td><td><code>true</code> during login, logout, or refresh.</td></tr>
                    <tr><td><code>auth.error</code></td><td><code>Signal&lt;unknown&gt;</code></td><td>Last error encountered.</td></tr>
                    <tr><td><code>auth.activeProvider</code></td><td><code>Signal&lt;string | null&gt;</code></td><td>Current provider name when providers are used.</td></tr>
                    <tr><td><code>auth.name</code></td><td><code>string</code></td><td>Read-only instance identifier. Useful when managing multiple auth contexts.</td></tr>
                </table>
            </div>

            <h4>Methods</h4>
            <div class="tbl">
                <table>
                    <tr><th>Method</th><th>Description</th></tr>
                    <tr><td><code>await auth.login(credentials)</code></td><td>Authenticate with the active driver.</td></tr>
                    <tr><td><code>await auth.login("provider", credentials)</code></td><td>Authenticate with a named provider.</td></tr>
                    <tr><td><code>await auth.logout()</code></td><td>Clear the session and call driver logout.</td></tr>
                    <tr><td><code>await auth.refresh()</code></td><td>Refresh the session using <code>driver.refresh</code>.</td></tr>
                    <tr><td><code>await auth.ready()</code></td><td>Wait for initial storage hydration.</td></tr>
                    <tr><td><code>auth.setSession(session)</code></td><td>Manually set the session.</td></tr>
                    <tr><td><code>auth.clearSession()</code></td><td>Clear the session without calling driver logout.</td></tr>
                    <tr><td><code>auth.attachPolicy(policy)</code></td><td>Attach an authorization policy. Returns a detach function.</td></tr>
                    <tr><td><code>auth.detachPolicy(policy)</code></td><td>Remove a previously attached policy.</td></tr>
                    <tr><td><code>auth.can(action, context?)</code></td><td>Reactive signal that evaluates policies for an action.</td></tr>
                    <tr><td><code>auth.authorize(action, context?)</code></td><td>Like <code>can</code> but returns <code>{ allow, redirect? }</code>.</td></tr>
                    <tr><td><code>auth.hasRole(role)</code></td><td>Reactive boolean signal.</td></tr>
                    <tr><td><code>auth.hasPermission(permission)</code></td><td>Reactive boolean signal.</td></tr>
                    <tr><td><code>auth.hasScope(scope)</code></td><td>Reactive boolean signal.</td></tr>
                    <tr><td><code>auth.hasAnyRole(roles)</code></td><td>Reactive boolean signal.</td></tr>
                    <tr><td><code>auth.hasAllPermissions(permissions)</code></td><td>Reactive boolean signal.</td></tr>
                </table>
            </div>

            <h4>Callbacks</h4>
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Description</th></tr>
                    <tr><td><code>onChange(session)</code></td><td>Called whenever the session changes (login, logout, refresh, set, clear).</td></tr>
                    <tr><td><code>onError(error, event)</code></td><td>Called when any auth operation fails. <code>event</code> is the operation name: <code>"login"</code>, <code>"logout"</code>, <code>"refresh"</code>, <code>"hydrate"</code>, <code>"setSession"</code>, <code>"clearSession"</code>.</td></tr>
                </table>
            </div>
            ${new CodeBlock(S.auth_events)}

            <h4>Identity Mapping</h4>
            <p>
                The <code>identity</code> option maps helper methods to your user fields. If no mapping is provided, the helpers fall back to <code>user.roles</code>, <code>user.permissions</code>, and <code>user.scopes</code>.
            </p>
            ${new CodeBlock(S.auth_identity)}

            <h3>
                Drivers
            </h3>
            <p>
                A driver implements the <code>AuthDriver</code> interface. It is the only place where HTTP calls, OAuth redirects, or biometric flows live. The core does not assume any transport.
            </p>

            <h4>JWT Driver</h4>
            <p>
                Standard JWT / Bearer token flow with optional refresh.
            </p>
            ${new CodeBlock(S.auth_jwt_driver)}

            <h4>Session Cookie Driver</h4>
            <p>
                For backends that use <code>httpOnly</code> session cookies. The browser sends the cookie automatically with <code>credentials: "include"</code>.
            </p>
            ${new CodeBlock(S.auth_session_cookie_driver)}

            <h4>Mock Driver</h4>
            <p>
                Useful for tests and prototypes.
            </p>
            ${new CodeBlock(S.auth_mock_driver)}

            <h4>Custom Driver</h4>
            <p>
                Implement the <code>AuthDriver</code> interface for any backend protocol. Only <code>name</code>, <code>login</code>, and <code>logout</code> are required. Everything else is optional and enables advanced features.
            </p>
            ${new CodeBlock(S.auth_custom_driver)}

            <h4>AuthDriver Interface</h4>
            <div class="tbl">
                <table>
                    <tr><th>Property / Method</th><th>Required</th><th>Description</th></tr>
                    <tr><td><code>name</code></td><td>Yes</td><td>Driver identifier.</td></tr>
                    <tr><td><code>login(credentials)</code></td><td>Yes</td><td>Authenticate and return a session.</td></tr>
                    <tr><td><code>logout(session)</code></td><td>Yes</td><td>Revoke the session on the server.</td></tr>
                    <tr><td><code>hydrate(raw)</code></td><td>No</td><td>Validate or re-fetch a session recovered from storage on startup.</td></tr>
                    <tr><td><code>refresh(session)</code></td><td>No</td><td>Refresh an expiring session. Enables <code>autoRefresh</code>.</td></tr>
                    <tr><td><code>getExpiry(session)</code></td><td>No</td><td>Return expiry timestamp (ms). Enables <code>autoRefresh</code> scheduling.</td></tr>
                    <tr><td><code>toUser(session)</code></td><td>No</td><td>Extract the user object from the session.</td></tr>
                    <tr><td><code>getToken(session)</code></td><td>No</td><td>Extract the auth token from the session.</td></tr>
                    <tr><td><code>isValid(session)</code></td><td>No</td><td>Lightweight sync check before <code>hydrate</code> runs.</td></tr>
                </table>
            </div>

            <h3>
                Providers
            </h3>
            <p>
                A provider is a named driver. This is useful when an app supports multiple authentication mechanisms simultaneously.
            </p>

            <h4>Credentials Provider</h4>
            ${new CodeBlock(S.auth_credentials_provider)}

            <h4>API Key Provider</h4>
            ${new CodeBlock(S.auth_apikey_provider)}

            <h4>OIDC Provider</h4>
            <p>
                Basic OIDC provider with PKCE. Discovers endpoints from the issuer's <code>/.well-known/openid-configuration</code>.
            </p>
            ${new CodeBlock(S.auth_oidc_provider)}

            <h4>Creating a Custom Provider</h4>
            <p>
                A provider is just an <code>AuthDriver</code> with a <code>name</code>. You can implement one from scratch for any backend: Firebase Auth, Supabase, AWS Cognito, Azure AD, or an internal corporate API. The example below shows a complete Supabase driver.
            </p>
            ${new CodeBlock(S.auth_custom_provider_guide)}

            <h3>
                Storage Adapters
            </h3>
            <p>
                Storage adapters persist the session between reloads. All adapters implement the <code>AuthStorage&lt;Session&gt;</code> interface.
            </p>
            ${new CodeBlock(S.auth_storage)}

            <div class="tbl">
                <table>
                    <tr><th>Adapter</th><th>Description</th></tr>
                    <tr><td><code>localStorageAdapter({ key })</code></td><td>Persists to <code>localStorage</code>. Falls back to memory if unavailable.</td></tr>
                    <tr><td><code>sessionStorageAdapter({ key })</code></td><td>Persists to <code>sessionStorage</code>.</td></tr>
                    <tr><td><code>cookieAdapter({ key })</code></td><td>Persists to <code>document.cookie</code>. Supports <code>days</code>, <code>path</code>, <code>secure</code>, and <code>sameSite</code>.</td></tr>
                    <tr><td><code>memoryAdapter()</code></td><td>In-memory only. Useful for tests and SSR seeds.</td></tr>
                </table>
            </div>

            <h4>Custom Storage Adapter</h4>
            <p>
                Any object that implements <code>AuthStorage&lt;Session&gt;</code> works. This is the escape hatch for IndexedDB, Capacitor Preferences, React Native AsyncStorage, or any persistence layer. You only need three methods: <code>get</code>, <code>set</code>, and <code>remove</code>. All three can be async.
            </p>
            ${new CodeBlock(S.auth_custom_storage)}

            <h4>Mobile / Native Storage (Capacitor)</h4>
            <p>
                When building with <strong>Nix Ionic</strong> or Capacitor, <code>localStorage</code> may be wiped by the OS. Use <code>@capacitor/preferences</code> instead:
            </p>
            ${new CodeBlock(S.auth_capacitor_storage)}

            <h3>
                Auth Manager
            </h3>
            <p>
                For apps that need multiple auth instances — multi-context, multi-tenant, or admin + customer portals.
            </p>
            ${new CodeBlock(S.auth_manager)}

            <h4>Named Instances Without Manager</h4>
            <p>
                You don't need <code>createAuthManager</code> for simple cases. Export multiple instances directly and import them where needed. This avoids passing <code>auth</code> through props or DI entirely.
            </p>
            ${new CodeBlock(S.auth_named_instances)}

            <h3>
                SSR Seeds
            </h3>
            <p>
                When rendering on the server, pass the initial session so the first client render is hydrated immediately.
            </p>
            ${new CodeBlock(S.auth_ssr_seed)}

            <h3>
                Policy Engine
            </h3>
            <p>
                Policies are pure functions that receive the user, the action, the context, and the session. <code>auth.can(action, context?)</code> returns a reactive signal that re-evaluates when the user or the attached policies change.
            </p>
            ${new CodeBlock(S.auth_policy)}

            <h4>Policy Helpers</h4>
            <p>
                Compose authorization rules with built-in combinators.
            </p>
            ${new CodeBlock(S.auth_policy_helpers)}

            <h4>RBAC Policy</h4>
            <p>
                Convenience policy for role-based and permission-based access control. Supports tenant-aware resolvers.
            </p>
            ${new CodeBlock(S.auth_rbac_policy)}

            <h3>
                Router Integration
            </h3>
            <p>
                <code>authRouterPlugin</code> reads the <code>meta.auth</code> field of each route and decides whether to allow navigation, redirect to login, or redirect to an unauthorized page.
            </p>
            ${new CodeBlock(S.auth_router)}

            <h4>meta.auth DSL</h4>
            <p>
                The <code>meta.auth</code> field accepts:
            </p>
            <div class="ul">
                <ul>
                    <li><code>"public"</code> or <code>false</code> — allow anyone.</li>
                    <li><code>"optional"</code> — allow the route, but auth is optional.</li>
                    <li><code>string</code> — action passed to <code>auth.can(action)</code>.</li>
                    <li><code>string[]</code> — any of the actions must be allowed.</li>
                    <li><strong>object</strong> — <code>can</code>, <code>context</code>, <code>role</code>, <code>roles</code>, <code>permission</code>, <code>permissions</code>, <code>provider</code>, <code>redirect</code>, <code>allow</code>.</li>
                    <li><strong>function</strong> — full custom guard <code>(to, from, auth) => NavigationGuardResult</code>.</li>
                </ul>
            </div>

            <h4>Dynamic Context in Routes</h4>
            ${new CodeBlock(S.auth_router_meta)}

            <h4>Standalone Guards</h4>
            ${new CodeBlock(S.auth_router_guards)}

            <h4>Custom Meta Interpreter</h4>
            <p>
                Replace the default <code>meta.auth</code> interpreter for domain-specific guard logic. The example below gates routes by subscription tier instead of roles or permissions.
            </p>
            ${new CodeBlock(S.auth_custom_meta_interpreter)}

            <h3>
                Optional Provide / Inject
            </h3>
            <p>
                The library is fully usable without <code>provide/inject</code> if you prefer to export the instance directly.
            </p>
            ${new CodeBlock(S.auth_inject)}

            <h3>
                Multi-Provider
            </h3>
            <p>
                Support email/password, API keys, OIDC, and other strategies in the same app.
            </p>
            ${new CodeBlock(S.auth_multi_provider)}

            <h3>
                Auto-Refresh
            </h3>
            <p>
                When a driver provides <code>getExpiry</code>, the library can refresh the session before it expires.
            </p>
            ${new CodeBlock(S.auth_auto_refresh)}

            <h3>
                Error Handling & Resilience
            </h3>
            <p>
                Drivers should throw descriptive errors. The auth instance catches them and exposes them via <code>auth.error</code> and the <code>onError</code> callback. This is where you map backend errors to user-friendly messages.
            </p>
            ${new CodeBlock(S.auth_error_handling)}

            <h3>
                Advanced Driver Patterns
            </h3>

            <h4>Validation with <code>hydrate()</code></h4>
            <p>
                <code>hydrate()</code> runs when the auth instance recovers a session from storage on startup. Use it to validate the stored token against your backend, merge server-side updates, or detect revoked sessions.
            </p>
            ${new CodeBlock(S.auth_hydrate_advanced)}

            <h4>Sync Pre-Check with <code>isValid()</code></h4>
            <p>
                <code>isValid()</code> is a lightweight synchronous check used <em>before</em> <code>hydrate()</code> runs. If it returns <code>false</code>, the stored session is discarded immediately without a network call. Use it for quick expiry checks.
            </p>
            ${new CodeBlock(S.auth_driver_isvalid)}

            <h3>
                Backend Integration Example
            </h3>
            <p>
                A complete real-world pattern: custom driver for a non-standard backend (badge ID + PIN, session IDs, TTL-based expiry). This template applies to Firebase, AWS Cognito, Azure AD, or any internal API with its own auth flow.
            </p>
            ${new CodeBlock(S.auth_backend_integration)}

            <h3>
                Optional Nix Query Integration
            </h3>
            <p>
                <code>@deijose/nix-query</code> is an optional peer dependency. Import from <code>@deijose/nix-js-auth/command</code> to wrap auth-aware commands.
            </p>
            ${new CodeBlock(S.auth_nix_query)}

            <h3>
                Testing
            </h3>
            <p>
                <code>mockDriver</code> makes the library easy to test without a real backend.
            </p>
            ${new CodeBlock(S.auth_testing)}

            <h3>
                TypeScript
            </h3>
            <p>
                <code>createAuth</code> accepts generics for <code>Session</code>, <code>User</code>, and <code>Credentials</code>. The returned <code>AuthInstance</code> is typed accordingly.
            </p>
            ${new CodeBlock(S.auth_typescript)}

            <h3>
                API Overview
            </h3>

            <h4>Core</h4>
            <div class="ul">
                <ul>
                    <li><code>createAuth(options)</code> — reactive auth instance. Options include <code>name</code>, <code>driver</code>, <code>providers</code>, <code>defaultProvider</code>, <code>storage</code>, <code>autoRefresh</code>, <code>seed</code>, <code>identity</code>, <code>onChange</code>, <code>onError</code>.</li>
                    <li><code>createAuthManager()</code> — manage multiple named auth instances. Methods: <code>create(name, options)</code>, <code>get(name)</code>, <code>list()</code>, <code>remove(name)</code>.</li>
                    <li><code>auth.login(credentials)</code> / <code>auth.login("provider", credentials)</code></li>
                    <li><code>auth.logout()</code> / <code>auth.refresh()</code> / <code>auth.ready()</code></li>
                    <li><code>auth.session</code>, <code>auth.user</code>, <code>auth.token</code>, <code>auth.isAuthenticated</code>, <code>auth.isReady</code>, <code>auth.isLoading</code>, <code>auth.error</code>, <code>auth.name</code></li>
                    <li><code>auth.setSession(session)</code>, <code>auth.clearSession()</code></li>
                    <li><code>auth.attachPolicy(policy)</code>, <code>auth.detachPolicy(policy)</code></li>
                    <li><code>auth.can(action, context?)</code>, <code>auth.authorize(action, context?)</code></li>
                    <li><code>auth.hasRole(role)</code>, <code>auth.hasPermission(permission)</code>, <code>auth.hasScope(scope)</code></li>
                    <li><code>auth.hasAnyRole(roles)</code>, <code>auth.hasAllPermissions(permissions)</code></li>
                </ul>
            </div>

            <h4>Drivers</h4>
            <div class="ul">
                <ul>
                    <li><code>jwtDriver(options)</code> — JWT / Bearer token flow.</li>
                    <li><code>sessionCookieDriver(options)</code> — <code>httpOnly</code> session cookie flow.</li>
                    <li><code>mockDriver(options)</code> — testing and prototyping.</li>
                    <li>Custom driver via <code>AuthDriver</code> interface.</li>
                </ul>
            </div>

            <h4>Providers</h4>
            <div class="ul">
                <ul>
                    <li><code>credentialsProvider(options)</code> — email/password or custom credentials.</li>
                    <li><code>apiKeyProvider(options)</code> — API-key authentication.</li>
                    <li><code>oidcProvider(options)</code> — OIDC with PKCE.</li>
                </ul>
            </div>

            <h4>Storage Adapters</h4>
            <div class="ul">
                <ul>
                    <li><code>localStorageAdapter({ key })</code>, <code>sessionStorageAdapter({ key })</code>, <code>cookieAdapter({ key })</code>, <code>memoryAdapter()</code>.</li>
                    <li>Custom via <code>AuthStorage&lt;Session&gt;</code> interface — <code>get()</code>, <code>set(session)</code>, <code>remove()</code>. All methods can be async.</li>
                </ul>
            </div>

            <h4>Policy Engine</h4>
            <div class="ul">
                <ul>
                    <li><code>createPolicy(evaluator)</code></li>
                    <li><code>rbacPolicy(options)</code> — supports tenant-aware resolvers.</li>
                    <li><code>hasRole</code>, <code>hasPermission</code>, <code>hasScope</code>, <code>isOwner</code>, <code>all</code>, <code>any</code>, <code>not</code>.</li>
                </ul>
            </div>

            <h4>Router</h4>
            <div class="ul">
                <ul>
                    <li><code>authRouterPlugin(auth, router, options)</code></li>
                    <li><code>requireAuth</code>, <code>requireRole</code>, <code>requirePermission</code>, <code>requireProvider</code>, <code>requirePolicy</code>.</li>
                </ul>
            </div>

            <h4>Command Integration</h4>
            <p>
                From <code>@deijose/nix-js-auth/command</code>:
            </p>
            <div class="ul">
                <ul>
                    <li><code>authCommand(auth, commandKey, executeFn, options?)</code></li>
                    <li><code>createLoginCommand(auth, commandKey, options?)</code></li>
                    <li><code>createLogoutCommand(auth, commandKey, options?)</code></li>
                    <li><code>authHeaders(auth)</code></li>
                </ul>
            </div>

            <h3>
                Best Practices
            </h3>
            <div class="ul">
                <ul>
                    <li><strong>Keep the core unopinionated</strong> — do not put backend-specific logic outside the driver.</li>
                    <li><strong>Use <code>toUser</code></strong> — always implement <code>toUser</code> if your session object wraps the user.</li>
                    <li><strong>Prefer <code>can()</code> in templates</strong> — <code>auth.can("post:edit").value</code> is reactive and efficient.</li>
                    <li><strong>Separate policies</strong> — split domain-specific rules into multiple policies instead of one giant function.</li>
                    <li><strong>Custom redirect</strong> — use <code>redirect</code> in <code>meta.auth</code> or a custom <code>interpretMeta</code> for route-specific behavior.</li>
                    <li><strong>Do not store tokens in plain localStorage for production</strong> — use <code>httpOnly</code> cookies when possible. Provide a <code>sessionCookieDriver</code> or custom driver that reads the cookie.</li>
                    <li><strong>Hydrate safely</strong> — implement <code>hydrate</code> in the driver to validate the stored session on startup.</li>
                    <li><strong>Throw descriptive errors from the driver</strong> — map HTTP status codes to semantic error strings, then handle them in <code>onError</code>.</li>
                    <li><strong>Use <code>isValid</code> for quick expiry checks</strong> — avoids unnecessary network calls on startup.</li>
                    <li><strong>Implement <code>getExpiry</code> + <code>refresh</code> together</code> — auto-refresh only works when both are present.</li>
                    <li><strong>Use custom storage for mobile</strong> — Capacitor Preferences or React Native AsyncStorage instead of <code>localStorage</code>.</li>
                    <li><strong>Build providers as named drivers</strong> — wrap any backend (Firebase, Supabase, Cognito) in an <code>AuthDriver</code> and use it directly or inside <code>providers</code>.</li>
                </ul>
            </div>

            <div class="cl cl-i">
                <span class="cl-ic">📐</span>
                <p>
                    <strong>License:</strong> MIT — <code>@deijose/nix-js-auth</code> is open source and free to use in any project.
                </p>
            </div>
        </div>
    `;
}
