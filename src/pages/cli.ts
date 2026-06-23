import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';

export function CLIPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">CLI</h2>
      <p class="page-sub">Scaffold projects and generate code with the official Nix.js CLIs.</p>

      <h3>create-nix-app — new projects</h3>
      <p>Creates a complete project with Vite, HMR, and tests pre-configured.</p>
      ${new CodeBlock(`npx create-nix-app my-app

# or with a template
npx create-nix-app my-app --template vite-ts

# available templates
# vanilla-js, vite-ts, vite-ts-nix-ui, nix-ionic, nix-ionic-tabs`, 'bash')}

      <h3>@deijose/nix-cli — code generation</h3>
      <p>Run this inside an existing project to generate components, pages, stores, and services.</p>
      ${new CodeBlock(`npx nixjs add component Button
npx nixjs add page users/[id]
npx nixjs add store auth
npx nixjs add service api

# run project commands
npx nixjs dev
npx nixjs build
npx nixjs test`, 'bash')}

      <h3>Auto-detection</h3>
      <p>The CLI detects whether your project uses <code>@deijose/nix-js</code> or <code>@deijose/nix-ionic</code> and picks the matching template.</p>
      <div class="cards">
        <div class="card"><span class="card-ic">🌐</span><div class="card-t">Nix.js base</div><div class="card-d">Generates plain function components that return <code>html\\\`...\\\`</code>.</div></div>
        <div class="card"><span class="card-ic">📱</span><div class="card-t">Nix Ionic</div><div class="card-d">Generates <code>NixComponent</code> classes and pages with <code>ion-page</code>.</div></div>
      </div>

      <h3>Generated component example</h3>
      ${new CodeBlock(`npx nixjs add component Button`, 'bash')}
      ${new CodeBlock(`import { html } from '@deijose/nix-js';

export function Button() {
  return html\`
    <button class="btn">Click me</button>
  \`;
}`, 'ts')}
    </div>
  `;
}
