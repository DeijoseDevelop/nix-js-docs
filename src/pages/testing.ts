import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';

export function TestingPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Testing</h2>
      <p class="page-sub">Test Nix.js components in the real DOM with helpers built for signals and templates.</p>

      <h3>Install</h3>
      ${new CodeBlock('npm install -D @deijose/nix-js-testing vitest happy-dom', 'bash')}

      <h3>Configure Vitest</h3>
      ${new CodeBlock(`import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});`, 'ts')}

      <h3>Basic test</h3>
      ${new CodeBlock(`import { describe, it, expect } from 'vitest';
import { signal, html } from '@deijose/nix-js';
import { render, fireEvent, screen, waitFor } from '@deijose/nix-js/testing';

function Counter() {
  const count = signal(0);
  return html\`
    <button @click=\${() => count.value++}>
      \${() => count.value}
    </button>
  \`;
}

describe('Counter', () => {
  it('increments on click', async () => {
    render(Counter());
    const btn = screen.getByText('0');

    fireEvent.click(btn);
    await waitFor(() => expect(screen.getByText('1')).toBeTruthy());
  });
});`, 'ts')}

      <h3>API</h3>
      <div class="cards">
        <div class="card"><span class="card-ic">🖥️</span><div class="card-t">render()</div><div class="card-d">Mount a component into a container and return queries.</div></div>
        <div class="card"><span class="card-ic">🔥</span><div class="card-t">fireEvent</div><div class="card-d">Simulate click, input, submit, focus, blur, and keydown.</div></div>
        <div class="card"><span class="card-ic">🔍</span><div class="card-t">screen</div><div class="card-d">Global DOM queries: <code>getByText</code>, <code>getByRole</code>, <code>getByTestId</code>.</div></div>
        <div class="card"><span class="card-ic">⏳</span><div class="card-t">waitFor</div><div class="card-d">Assert asynchronous updates without explicit sleeps.</div></div>
      </div>

      <h3>Cleanup</h3>
      <p>Each test gets a fresh container. <code>render()</code> returns an <code>unmount</code> function if you need to clean up manually.</p>
      ${new CodeBlock(`const { unmount } = render(Counter());
// ...
unmount();`, 'ts')}
    </div>
  `;
}
