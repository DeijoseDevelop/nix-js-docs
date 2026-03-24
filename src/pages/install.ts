import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';

export function InstallPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Installation</h2>
      <p class="page-sub">Get started in seconds — no bundler required for CDN usage.</p>

      <h3>Package Manager</h3>
      ${new CodeBlock('npm install @deijose/nix-js\n\n# bun\nbun add @deijose/nix-js', 'bash')}

      <h3>CDN / Import Map</h3>
      <p>Zero npm install, zero bundler. Works directly in any modern browser with ES modules.</p>
      ${new CodeBlock(`<!-- Add to your HTML head -->
<script type="importmap">
  {
    "imports": {
      "@deijose/nix-js": "https://cdn.jsdelivr.net/npm/@deijose/nix-js@1.7.9/+esm"
    }
  }
</script>

<script type="module">
  import { signal, html, mount } from "@deijose/nix-js";

  function App() {
    const count = signal(0);
    return html\`
      <div>
        <h1>Count: \${() => count.value}</h1>
        <button @click=\${() => count.value++}>Increment</button>
      </div>
    \`;
  }

  mount(App(), '#app');
</script>`, 'html')}

      <h3>TypeScript + Vite (Recommended)</h3>
      ${new CodeBlock(`# Create project
npm create vite@latest my-app -- --template vanilla-ts
cd my-app
npm install @deijose/nix-js
npm run dev`, 'bash')}

      <h3>Project Structure</h3>
      ${new CodeBlock(`src/
  main.ts              — entry point, calls mount()
  components/
    Header.ts          — function or class components
    Footer.ts
  pages/
    Home.ts            — route-level components
    UserDetail.ts
  stores/
    cart.ts            — createStore() singletons
    auth.ts
  router.ts            — createRouter() setup
index.html`, 'text')}

      <h3>Importing APIs</h3>
      ${new CodeBlock(`// Import only what you need — tree-shakeable
import {
  // Reactivity
  signal, computed, effect, batch, watch, untrack, nextTick,

  // Templates
  html, repeat, ref,

  // Components
  NixComponent, mount,

  // State
  createStore, createRouter, createForm,

  // Advanced
  useField, useFieldArray, suspend, lazy,
  createQuery, invalidateQueries,
  provide, inject, createInjectionKey,
  portal, transition, createErrorBoundary,
  RouterView, Link, useRouter,
} from "@deijose/nix-js";`)}

      <div class="cl cl-t"><span class="cl-ic">💡</span><p>Nix.js ships a single entry point. All exports are tree-shakeable — your bundler only includes what you import.</p></div>
    </div>
  `;
}
