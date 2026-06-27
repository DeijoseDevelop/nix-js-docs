import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function IonicPage(): NixTemplate {
    return html`
        <div>
            <h2 class="page-title">Nix.js Ionic</h2>
            <p class="page-sub">
                Ionic bridge for Nix.js. Build mobile apps with native navigation, view caching, page transitions, and iOS swipe-back — all powered by the official <code>ion-router-outlet</code> API. Supports class and function pages, bottom tabs, route guards, and Capacitor-native builds for iOS and Android.
            </p>

            <h3>How it works</h3>
            <div class="ul">
                <ul>
                    <li>Each route is registered as a <strong>Custom Element</strong> (<code>nix-page-home</code>, <code>nix-page-detail</code>, etc.)</li>
                    <li><code>ion-router-outlet</code> activates the correct custom element based on the URL</li>
                    <li>View cache, page transitions, back button, and iOS swipe back are all <strong>native</strong> — zero custom code</li>
                    <li><code>connectedCallback</code> mounts the Nix component inside the custom element</li>
                    <li><code>ionRouteWillChange</code> / <code>ionRouteDidChange</code> drive the Nix lifecycle hooks</li>
                </ul>
            </div>
            <p>
                This gives you the same integration depth as <code>@ionic/angular</code> and <code>@ionic/react</code>, using only the public <code>ion-router</code> API.
            </p>

            <h3>Installation</h3>
            <p>
                Requires <code>@deijose/nix-js</code> 2.1+ and <code>@ionic/core</code>. Add Capacitor for native iOS/Android builds.
            </p>
            ${new CodeBlock(S.ionic_install, 'bash')}

            <h3>Quick start — main.ts</h3>
            <p>
                A complete entry point: styles, setup, router, app component, and bootstrap.
            </p>
            ${new CodeBlock(S.ionic_main)}

            <h3>Modular component loading</h3>
            <p>
                Starting with v1.0.0, <code>setupNixIonic()</code> only registers <strong>6 minimal core components</strong>. Everything else is loaded on demand. Three strategies:
            </p>
            ${new CodeBlock(S.ionic_modular)}

            <h4>Available bundles</h4>
            <div class="tbl">
                <table>
                    <tr><th>Bundle</th><th>Import path</th><th>Components</th></tr>
                    <tr><td><code>layout</code></td><td><code>@deijose/nix-ionic/bundles/layout</code></td><td>header, toolbar, title, content, footer, buttons</td></tr>
                    <tr><td><code>navigation</code></td><td><code>@deijose/nix-ionic/bundles/navigation</code></td><td>menu, menu-button, tabs, tab, tab-bar, tab-button, label</td></tr>
                    <tr><td><code>forms</code></td><td><code>@deijose/nix-ionic/bundles/forms</code></td><td>input, textarea, checkbox, toggle, select, select-option, radio, radio-group, range, searchbar</td></tr>
                    <tr><td><code>lists</code></td><td><code>@deijose/nix-ionic/bundles/lists</code></td><td>list, list-header, item, item-divider, item-sliding, item-options, item-option, label, note, card, card-header, card-title, card-subtitle, card-content</td></tr>
                    <tr><td><code>feedback</code></td><td><code>@deijose/nix-ionic/bundles/feedback</code></td><td>spinner, progress-bar, skeleton-text, badge, avatar, thumbnail</td></tr>
                    <tr><td><code>buttons</code></td><td><code>@deijose/nix-ionic/bundles/buttons</code></td><td>button, fab, fab-button, fab-list, ripple-effect</td></tr>
                    <tr><td><code>overlays</code></td><td><code>@deijose/nix-ionic/bundles/overlays</code></td><td>modal, popover, toast, alert</td></tr>
                    <tr><td><code>all</code></td><td><code>@deijose/nix-ionic/bundles/all</code></td><td>All of the above</td></tr>
                </table>
            </div>

            <div class="cl cl-i"><span class="cl-ic">ℹ️</span><p>v0.2.x users: pass <code>allComponents</code> to <code>setupNixIonic</code> for backward-compatible behavior, or better yet, import only the bundles you use.</p></div>

            <h3>Pages</h3>
            <p>
                Pages can be class-based (extend <code>IonPage</code>) or function-based (use composables). Class pages are recommended when you need lifecycle hooks. Function pages are lighter for static content.
            </p>

            <h4>Class component — IonPage</h4>
            <p>
                Extend <code>IonPage</code> and implement hooks. The constructor receives <code>PageContext</code> with lifecycle signals and route params.
            </p>
            ${new CodeBlock(S.ionic_page_class)}

            <h4>Function component — composables</h4>
            <p>
                Use <code>useIonViewWillEnter</code> and friends with a <code>PageContext</code> for function-based pages.
            </p>
            ${new CodeBlock(S.ionic_page_function)}

            <h3>Navigation — nixRouter()</h3>
            <p>
                Access the router singleton from anywhere. It exposes navigation methods and reactive signals.
            </p>
            ${new CodeBlock(S.ionic_router)}

            <h3>Tabs — createBottomTabBar()</h3>
            <p>
                Build a bottom tab bar without manual route listeners. The active state is computed from <code>nixRouter().current</code> directly. Tab switches use <code>direction: "none"</code> for the native Ionic feel.
            </p>
            ${new CodeBlock(S.ionic_tabs)}

            <h4>BottomTabBarOptions</h4>
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
                    <tr><td><code>slot</code></td><td><code>"top" | "bottom"</code></td><td><code>"bottom"</code></td><td>Tab bar position.</td></tr>
                    <tr><td><code>className</code></td><td><code>string</code></td><td><code>"nix-ion-tab-bar"</code></td><td>CSS class on the tab bar.</td></tr>
                    <tr><td><code>activeClassName</code></td><td><code>string</code></td><td><code>"tab-selected"</code></td><td>Class added to the active tab button.</td></tr>
                    <tr><td><code>hiddenPaths</code></td><td><code>string[]</code></td><td></td><td>Paths where the tab bar is hidden. Supports <code>"/prefix/*"</code> wildcards.</td></tr>
                    <tr><td><code>navigationDirection</code></td><td><code>NavigationDirection</code></td><td><code>"none"</code></td><td>Router direction on tab change. No animation by default.</td></tr>
                    <tr><td><code>hideWhen</code></td><td><code>(path) => boolean</code></td><td></td><td>Custom hide predicate.</td></tr>
                </table>
            </div>

            <h3>IonBackButton</h3>
            <p>
                Lightweight wrapper around <code>&lt;ion-back-button&gt;</code> that works with the Nix router stack. Hidden when <code>canGoBack</code> is false.
            </p>
            ${new CodeBlock(S.ionic_back_button)}

            <h3>Lifecycle hooks</h3>
            <p>
                All hooks are optional. For class components, implement the methods directly. For function components, use the composables.
            </p>
            <div class="tbl">
                <table>
                    <tr><th>Hook</th><th>When it fires</th></tr>
                    <tr><td><code>ionViewWillEnter</code></td><td>Before the view becomes visible (every activation)</td></tr>
                    <tr><td><code>ionViewDidEnter</code></td><td>After the view is fully visible</td></tr>
                    <tr><td><code>ionViewWillLeave</code></td><td>Before the view is hidden (stays in cache)</td></tr>
                    <tr><td><code>ionViewDidLeave</code></td><td>After the view is hidden</td></tr>
                </table>
            </div>

            <div class="cl cl-w"><span class="cl-ic">⚠️</span><p><code>onMount</code> and <code>onInit</code> from Nix.js only fire <strong>once</strong> when the component is first created. Ionic caches views in the stack — when the user returns to a cached view, <code>onMount</code> does <strong>NOT</strong> run again. Use <code>ionViewWillEnter</code> for anything that needs to refresh on every visit.</p></div>

            <h3>Route guards</h3>
            <p>
                Guards are defined per route in <code>IonRouterOutlet</code>. They receive the route params and can redirect, cancel, or allow navigation.
            </p>
            ${new CodeBlock(S.ionic_guards)}

            <h4>Guard return values</h4>
            <div class="tbl">
                <table>
                    <tr><th>Return value</th><th>Effect</th></tr>
                    <tr><td><code>void</code> / <code>undefined</code></td><td>Allow navigation</td></tr>
                    <tr><td><code>false</code></td><td>Cancel — stay on current view</td></tr>
                    <tr><td><code>"string" path</code></td><td>Redirect to that path</td></tr>
                    <tr><td><code>{ redirect: string }</code></td><td>Redirect to the given path</td></tr>
                </table>
            </div>

            <h3>PageContext</h3>
            <p>
                Every route factory receives a <code>PageContext</code>:
            </p>
            <div class="tbl">
                <table>
                    <tr><th>Property</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>lc</code></td><td><code>PageLifecycle</code></td><td>Navigation lifecycle signals (willEnter, didEnter, willLeave, didLeave)</td></tr>
                    <tr><td><code>params</code></td><td><code>Record&lt;string, string&gt;</code></td><td>Dynamic route segments, e.g. <code>/detail/:id</code> → <code>{ id: "42" }</code></td></tr>
                </table>
            </div>

            <h3>Per-tab navigation stacks</h3>
            <p>
                Pass <code>tabs</code> to <code>IonRouterOutlet</code> to preserve each tab's deep view history across switches. When the user returns to a tab, they land on the same sub-page they left.
            </p>
            ${new CodeBlock(`const outlet = new IonRouterOutlet(
  [
    { path: "/", component: (ctx) => new HomePage(ctx) },
    { path: "/map", component: (ctx) => new MapPage(ctx) },
    { path: "/map/route/:id", component: (ctx) => new RouteDetailPage(ctx) },
    { path: "/profile", component: (ctx) => new ProfilePage(ctx) },
  ],
  { tabs: ["/", "/map", "/profile"] }
);`)}

            <h3>Complete app example</h3>
            <p>
                A full working app with auth guards, tabs, login flow, and logout. Copy-paste ready.
            </p>
            ${new CodeBlock(S.ionic_complete_app)}

            <h3>Prerequisites</h3>
            <div class="tbl">
                <table>
                    <tr><th>Tool</th><th>Version</th><th>Install</th></tr>
                    <tr><td>Node.js</td><td>≥ 18</td><td><a href="https://nodejs.org" target="_blank">nodejs.org</a></td></tr>
                    <tr><td>npm</td><td>≥ 9</td><td>included with Node</td></tr>
                    <tr><td>Capacitor CLI</td><td>latest</td><td><code>npm i -g @capacitor/cli</code></td></tr>
                    <tr><td>Android Studio</td><td>latest</td><td><a href="https://developer.android.com/studio" target="_blank">developer.android.com/studio</a></td></tr>
                    <tr><td>Xcode</td><td>≥ 14</td><td>Mac App Store</td></tr>
                </table>
            </div>

            <h3>Create a new project</h3>
            ${new CodeBlock(`# 1. Scaffold a Vite + TypeScript project
npm create vite@latest my-app -- --template vanilla-ts
cd my-app

# 2. Install dependencies
npm install

# 3. Install Nix.js + Ionic + nix-ionic
npm install @deijose/nix-js @ionic/core @deijose/nix-ionic

# 4. Install Capacitor (for native iOS / Android)
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios`, 'bash')}

            <h3>Project setup</h3>

            <h4>Recommended folder structure</h4>
            ${new CodeBlock(`my-app/
├── android/                      ← generated by Capacitor
├── ios/                          ← generated by Capacitor
├── public/
├── src/
│   ├── pages/                    ← one file per screen
│   ├── components/               ← reusable UI components
│   ├── stores/                   ← global state via createStore()
│   ├── services/                 ← API calls, business logic
│   ├── style.css                 ← global styles + Ionic CSS imports
│   └── main.ts                   ← app entry point
├── index.html
├── capacitor.config.ts
├── package.json
├── tsconfig.json
└── vite.config.ts`, 'text')}

            <h4>index.html</h4>
            ${new CodeBlock(S.ionic_index_html, 'html')}

            <h4>capacitor.config.ts</h4>
            ${new CodeBlock(S.ionic_capacitor_config)}

            <h4>vite.config.ts</h4>
            <p>
                Exclude <code>@ionic/core</code> from dependency optimization to prevent pre-bundling issues.
            </p>
            ${new CodeBlock(S.ionic_vite_config)}

            <h3>Development commands</h3>

            <h4>Web</h4>
            ${new CodeBlock(`npm run dev          # Start dev server (hot reload)
npx tsc --noEmit     # Type check
npm run build        # Production build
npm run preview      # Preview production build`, 'bash')}

            <h4>Android</h4>
            ${new CodeBlock(S.ionic_android_workflow, 'bash')}

            <h4>iOS</h4>
            ${new CodeBlock(S.ionic_ios_workflow, 'bash')}

            <h3>Capacitor plugins</h3>
            <p>
                Add any official Capacitor plugin the same way: install, sync, and use.
            </p>
            ${new CodeBlock(`# Camera
npm install @capacitor/camera
npx cap sync

# Filesystem
npm install @capacitor/filesystem
npx cap sync

# Push notifications
npm install @capacitor/push-notifications
npx cap sync`, 'bash')}
            ${new CodeBlock(S.ionic_capacitor)}

            <h3>Page template</h3>
            <p>
                Copy this as a starting point for any new page.
            </p>
            ${new CodeBlock(S.ionic_page_template)}
            <p>
                Register it in <code>main.ts</code>:
            </p>
            ${new CodeBlock(`{ path: "/my/:id", component: (ctx) => new MyPage(ctx) }`, 'ts')}

            <h3>Build for production</h3>
            ${new CodeBlock(`# Web PWA
npm run build
# Output in dist/ — deploy to any static host

# Android APK / AAB
npm run build
npx cap sync android
npx cap open android
# In Android Studio: Build → Generate Signed Bundle/APK

# iOS IPA
npm run build
npx cap sync ios
npx cap open ios
# In Xcode: Product → Archive`, 'bash')}

            <h3>API Reference</h3>

            <h4>setupNixIonic(options?)</h4>
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>iconAssetPath</code></td><td><code>string</code></td><td>Base URL for Ionicons SVG assets. Defaults to unpkg CDN.</td></tr>
                    <tr><td><code>components</code></td><td><code>ComponentDefiner[]</code></td><td>Register only the Ionic elements your app needs.</td></tr>
                    <tr><td><code>icons</code></td><td><code>Record&lt;string, string&gt;</code></td><td>Register custom Ionicons once during bootstrap.</td></tr>
                </table>
            </div>

            <h4>IonRouterOutlet</h4>
            <div class="tbl">
                <table>
                    <tr><th>Constructor</th><th>Description</th></tr>
                    <tr><td><code>new IonRouterOutlet(routes, options?)</code></td><td>Mounts ion-router + ion-router-outlet. Registers a custom element per route.</td></tr>
                </table>
            </div>

            <h4>IonRouterOutletOptions</h4>
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>tabs</code></td><td><code>string[]</code></td><td>Root paths for per-tab navigation stacks.</td></tr>
                </table>
            </div>

            <h4>IonRouterOutlet cache methods</h4>
            <div class="tbl">
                <table>
                    <tr><th>Method</th><th>Description</th></tr>
                    <tr><td><code>outlet.invalidateCache()</code></td><td>Mark cached views as stale so they re-render on next activation.</td></tr>
                    <tr><td><code>outlet.clearCache()</code></td><td>Remove all cached views from the stack. Forces fresh renders.</td></tr>
                </table>
            </div>

            <h4>IonPage</h4>
            <div class="tbl">
                <table>
                    <tr><th>Method</th><th>When</th></tr>
                    <tr><td><code>ionViewWillEnter()</code></td><td>Before the view becomes visible (every activation)</td></tr>
                    <tr><td><code>ionViewDidEnter()</code></td><td>After the view is fully visible</td></tr>
                    <tr><td><code>ionViewWillLeave()</code></td><td>Before the view is hidden</td></tr>
                    <tr><td><code>ionViewDidLeave()</code></td><td>After the view is hidden</td></tr>
                </table>
            </div>

            <h4>Composables</h4>
            <div class="tbl">
                <table>
                    <tr><th>Function</th><th>Signature</th></tr>
                    <tr><td><code>useIonViewWillEnter</code></td><td><code>(lc, fn) => void</code></td></tr>
                    <tr><td><code>useIonViewDidEnter</code></td><td><code>(lc, fn) => void</code></td></tr>
                    <tr><td><code>useIonViewWillLeave</code></td><td><code>(lc, fn) => void</code></td></tr>
                    <tr><td><code>useIonViewDidLeave</code></td><td><code>(lc, fn) => void</code></td></tr>
                </table>
            </div>

            <h4>createBottomTabBar(tabs, options?)</h4>
            <div class="tbl">
                <table>
                    <tr><th>Param</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>tabs</code></td><td><code>BottomTabItem[]</code></td><td>Array of tab definitions.</td></tr>
                    <tr><td><code>options</code></td><td><code>BottomTabBarOptions</code></td><td>Slot, classes, hidden paths, direction.</td></tr>
                </table>
            </div>

            <h4>BottomTabItem</h4>
            <div class="tbl">
                <table>
                    <tr><th>Property</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>path</code></td><td><code>string</code></td><td>Route path for this tab.</td></tr>
                    <tr><td><code>label</code></td><td><code>string</code></td><td>Tab label text.</td></tr>
                    <tr><td><code>icon</code></td><td><code>string</code></td><td>Ionicons name (inactive state).</td></tr>
                    <tr><td><code>activeIcon</code></td><td><code>string</code></td><td>Ionicons name (active state). Optional.</td></tr>
                    <tr><td><code>exact</code></td><td><code>boolean</code></td><td>Exact match for active state. Default false.</td></tr>
                    <tr><td><code>tabId</code></td><td><code>string</code></td><td>Custom tab identifier. Optional.</td></tr>
                </table>
            </div>

            <h4>Re-exports from @deijose/nix-js</h4>
            <p>
                <code>@deijose/nix-ionic</code> re-exports the core router so you don't need a second import:
            </p>
            <div class="ul">
                <ul>
                    <li><code>nixRouter()</code></li>
                    <li><code>Router</code>, <code>NavigationIntent</code>, <code>NavigationDirection</code>, <code>NavigationAction</code>, <code>NavigateOptions</code></li>
                </ul>
            </div>

            <h3>Comparison with other frameworks</h3>
            <div class="tbl">
                <table>
                    <tr><th>Feature</th><th>@ionic/angular</th><th>@ionic/react</th><th>@deijose/nix-ionic</th></tr>
                    <tr><td>Router integration</td><td>Angular Router</td><td>React Router</td><td>ion-router (vanilla)</td></tr>
                    <tr><td>View cache</td><td>✅</td><td>✅</td><td>✅ native</td></tr>
                    <tr><td>Page transitions</td><td>✅</td><td>✅</td><td>✅ native</td></tr>
                    <tr><td>iOS swipe back</td><td>✅</td><td>✅</td><td>✅ native</td></tr>
                    <tr><td>ion-back-button</td><td>native</td><td>wrapper</td><td>wrapper</td></tr>
                    <tr><td>Lifecycle hooks</td><td>directive</td><td>hooks</td><td>IonPage / composables</td></tr>
                    <tr><td>Navigation API</td><td>NavController</td><td>useHistory</td><td>nixRouter()</td></tr>
                    <tr><td>Modular loading</td><td>❌</td><td>❌</td><td>✅ tree-shakeable</td></tr>
                </table>
            </div>

            <h3>Migration from v1.x to v2</h3>
            <div class="tbl">
                <table>
                    <tr><th>v1</th><th>v2</th></tr>
                    <tr><td><code>nixIonicRouter()</code></td><td><code>nixRouter()</code> from <code>@deijose/nix-js</code></td></tr>
                    <tr><td><code>r.path.value</code></td><td><code>r.current.value</code></td></tr>
                    <tr><td><code>r.navigate("/x", "forward")</code></td><td><code>r.navigate("/x", { direction: "forward" })</code></td></tr>
                    <tr><td><code>new IonRouterOutlet(routes)</code></td><td>Same constructor; add <code>{ tabs: [...] }</code> for per-tab stacks</td></tr>
                    <tr><td><code>setupNixIonic()</code></td><td>Same signature; smaller default bundle</td></tr>
                </table>
            </div>

            <h3>Testing</h3>
            <p>
                <code>@deijose/nix-ionic</code> uses Vitest with <code>happy-dom</code> and <code>@deijose/nix-js-testing</code>.
            </p>
            ${new CodeBlock(`npm run test            # Run tests
npm run test:coverage   # Run with coverage`, 'bash')}
            <div class="ul">
                <ul>
                    <li><strong>Vitest</strong> — test runner and assertions.</li>
                    <li><strong>happy-dom</strong> — lightweight DOM for component tests.</li>
                    <li><strong>@deijose/nix-js-testing</strong> — render, cleanup, fireEvent, screen, waitFor.</li>
                    <li><strong>Mock Ionic components</strong> — simulate ion-router-outlet and ion-back-button without loading the full bundle.</li>
                </ul>
            </div>

            <h3>Best practices</h3>
            <div class="ul">
                <ul>
                    <li><strong>Use <code>ionViewWillEnter</code></strong> for data fetching, not <code>onMount</code> — cached views won't re-trigger onMount.</li>
                    <li><strong>Use modular component loading</strong> — import only bundles you need to keep the bundle small.</li>
                    <li><strong>Use <code>hideWhen</code></strong> on tabs to hide the bar on login, detail, or any non-tab page.</li>
                    <li><strong>Use <code>beforeEnter</code> guards</strong> for auth gates instead of checking inside every page.</li>
                    <li><strong>Use <code>router.replace</code></strong> after login/logout to avoid back-button returning to auth screens.</li>
                    <li><strong>Implement <code>ionViewWillLeave</code></strong> to pause timers and subscriptions when the view is hidden.</li>
                    <li><strong>Use per-tab stacks</strong> — pass <code>tabs: [...]</code> to <code>IonRouterOutlet</code> so each tab remembers its deep history.</li>
                    <li><strong>Call <code>npx cap sync</code></strong> after every web build before testing on device.</li>
                </ul>
            </div>

            <div class="cl cl-i"><span class="cl-ic">📐</span><p><strong>License:</strong> MIT — <code>@deijose/nix-ionic</code> is open source and free to use in any project.</p></div>
        </div>
    `;
}
