import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';

import { S } from '../data/snippets';

export function CLIPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">CLI</h2>
      <p class="page-sub">
        Official command-line tools for Nix.js. Scaffold new projects, generate components, pages, stores, and services, and run development, build, and test commands with zero configuration.
      </p>

      <h3>create-nix-app — new projects</h3>
      <p>
        Scaffolds a complete project with Vite, HMR, and tests pre-configured. No global installation required.
      </p>
      ${new CodeBlock(S.cli_create_nix_app, 'bash')}

      <h4>Available templates</h4>
      <div class="tbl">
        <table>
          <tr><th>Template</th><th>Description</th></tr>
          <tr><td><code>vanilla-js</code></td><td>Plain JavaScript project with Vite.</td></tr>
          <tr><td><code>vite-ts</code></td><td>TypeScript project with Vite and HMR.</td></tr>
          <tr><td><code>vite-ts-nix-ui</code></td><td>TypeScript + Nix UI component library.</td></tr>
          <tr><td><code>nix-ionic</code></td><td>Mobile app with Capacitor and Ionic components.</td></tr>
          <tr><td><code>nix-ionic-tabs</code></td><td>Ionic app with tab navigation pre-configured.</td></tr>
        </table>
      </div>

      <h3>@deijose/nix-cli — code generation</h3>
      <p>
        Run inside an existing project to generate components, pages, stores, and services. The CLI detects whether your project uses <code>@deijose/nix-js</code> or <code>@deijose/nix-ionic</code> and picks the matching template.
      </p>

      <h4><code>nixjs add &lt;type&gt; &lt;name&gt;</code></h4>
      <p>
        Generates a new file in the corresponding folder. Pages support dynamic routes.
      </p>
      ${new CodeBlock(S.cli_add_commands, 'bash')}

      <div class="tbl">
        <table>
          <tr><th>Type</th><th>Output folder</th><th>Example</th></tr>
          <tr><td><code>component</code></td><td><code>src/components/</code></td><td><code>npx nixjs add component Button</code></td></tr>
          <tr><td><code>page</code></td><td><code>src/pages/</code></td><td><code>npx nixjs add page Login</code></td></tr>
          <tr><td><code>store</code></td><td><code>src/stores/</code></td><td><code>npx nixjs add store auth</code></td></tr>
          <tr><td><code>service</code></td><td><code>src/services/</code></td><td><code>npx nixjs add service api</code></td></tr>
        </table>
      </div>

      <p>
        Dynamic routes are supported for pages:
      </p>
      ${new CodeBlock('npx nixjs add page users/[id]', 'bash')}
      <p>
        Generates <code>src/pages/users/[id].ts</code> ready for the Nix.js router.
      </p>

      <h4><code>nixjs dev / build / test</code></h4>
      <p>
        Project command wrappers that detect your <code>package.json</code> scripts and fall back to the corresponding binary automatically.
      </p>
      ${new CodeBlock(S.cli_run_commands, 'bash')}

      <div class="tbl">
        <table>
          <tr><th>Command</th><th>Priority 1</th><th>Priority 2 (fallback)</th></tr>
          <tr><td><code>nixjs dev</code></td><td><code>npm run dev</code></td><td><code>vite</code></td></tr>
          <tr><td><code>nixjs build</code></td><td><code>npm run build</code></td><td><code>vite build</code></td></tr>
          <tr><td><code>nixjs test</code></td><td><code>npm run test</code></td><td><code>vitest</code></td></tr>
        </table>
      </div>

      <h3>Auto-detection</h3>
      <p>
        The CLI inspects your <code>package.json</code> dependencies to decide which template to use.
      </p>
      <div class="cards">
        <div class="card"><span class="card-ic">🌐</span><div class="card-t">Nix.js base</div><div class="card-d">Generates plain function components that return <code>html\\\`...\\\`</code>.</div></div>
        <div class="card"><span class="card-ic">📱</span><div class="card-t">Nix Ionic</div><div class="card-d">Generates <code>NixComponent</code> classes and pages with <code>ion-page</code>.</div></div>
      </div>

      <h3>Generated examples</h3>

      <h4>Component (Nix.js base)</h4>
      ${new CodeBlock(S.cli_generated_component)}

      <h4>Component (Nix Ionic)</h4>
      <p>
        When the CLI detects <code>@deijose/nix-ionic</code>, it generates class-based components.
      </p>
      ${new CodeBlock(S.cli_generated_ionic_component)}

      <h4>Store</h4>
      ${new CodeBlock(S.cli_generated_store)}

      <h3>Requirements</h3>
      <div class="ul">
        <ul>
          <li>Node.js <code>>= 18.0.0</code></li>
          <li>A project that uses <code>@deijose/nix-js</code> or <code>@deijose/nix-ionic</code></li>
        </ul>
      </div>

      <div class="cl cl-i"><span class="cl-ic">ℹ️</span><p>No global installation is required. All commands work via <code>npx</code>.</p></div>
    </div>
  `;
}
