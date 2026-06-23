import { signal, html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';

const frameworks = ['React', 'Vue', 'Svelte'] as const;
type Framework = typeof frameworks[number];

export function MigrationPage(): NixTemplate {
  const active = signal<Framework>('React');

  return html`
    <div>
      <h2 class="page-title">Migration Guides</h2>
      <p class="page-sub">Concept-by-concept comparisons from React, Vue, and Svelte to Nix.js.</p>

      <div class="tabbar">
        ${() => frameworks.map(f => html`
          <button class=${() => `tab${active.value === f ? ' on' : ''}`}
            @click=${() => (active.value = f)}>${f}</button>
        `)}
      </div>

      ${() => {
        const fw = active.value;
        if (fw === 'React') return ReactSection();
        if (fw === 'Vue') return VueSection();
        return SvelteSection();
      }}
    </div>
  `;
}

function ReactSection(): NixTemplate {
  return html`
    <div class="migrate-section">
      <h3>Component</h3>
      <div class="two-col">
        ${new CodeBlock(`function Counter({ initial }) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}`, 'jsx')}
        ${new CodeBlock(`function Counter({ initial }) {
  const count = signal(initial);
  return html\`
    <button @click=\${() => count.value++}>
      \${() => count.value}
    </button>
  \`;
}`, 'ts')}
      </div>

      <h3>Hooks</h3>
      <table class="migrate-table">
        <thead><tr><th>React</th><th>Nix.js</th></tr></thead>
        <tbody>
          <tr><td><code>useState</code></td><td><code>signal()</code></td></tr>
          <tr><td><code>useMemo</code></td><td><code>computed()</code></td></tr>
          <tr><td><code>useEffect</code></td><td><code>effect()</code></td></tr>
          <tr><td><code>useContext</code></td><td><code>provide()</code> / <code>inject()</code></td></tr>
          <tr><td><code>useRef</code></td><td><code>ref()</code></td></tr>
          <tr><td><code>useCallback</code></td><td>no needed; functions are stable</td></tr>
        </tbody>
      </table>

      <h3>Router</h3>
      <div class="two-col">
        ${new CodeBlock(`<Route path="/users/:id" element={<UserDetail />} />`, 'jsx')}
        ${new CodeBlock(`createRouter({
  routes: [
    { path: '/users/:id', component: UserDetail }
  ]
});`, 'ts')}
      </div>

      <h3>Lifecycle</h3>
      <table class="migrate-table">
        <thead><tr><th>React</th><th>Nix.js</th></tr></thead>
        <tbody>
          <tr><td><code>useEffect(() => ..., [])</code></td><td><code>effect(cb, { once: true })</code></td></tr>
          <tr><td><code>componentDidMount</code></td><td><code>onMount</code> in <code>NixComponent</code></td></tr>
          <tr><td><code>useEffect cleanup</code></td><td>return cleanup from <code>effect()</code></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function VueSection(): NixTemplate {
  return html`
    <div class="migrate-section">
      <h3>Single File Component</h3>
      <div class="two-col">
        ${new CodeBlock(`<template>
  <button @click="count++">{{ count }}</button>
</template>

<script setup>
const count = ref(0);
</script>`, 'vue')}
        ${new CodeBlock(`const count = signal(0);

function Counter() {
  return html\`
    <button @click=\${() => count.value++}>
      \${() => count.value}
    </button>
  \`;
}`, 'ts')}
      </div>

      <h3>Reactivity</h3>
      <table class="migrate-table">
        <thead><tr><th>Vue</th><th>Nix.js</th></tr></thead>
        <tbody>
          <tr><td><code>ref()</code></td><td><code>signal()</code></td></tr>
          <tr><td><code>computed()</code></td><td><code>computed()</code></td></tr>
          <tr><td><code>watch()</code></td><td><code>watch()</code> / <code>effect()</code></td></tr>
          <tr><td><code>provide()</code> / <code>inject()</code></td><td><code>provide()</code> / <code>inject()</code></td></tr>
          <tr><td><code>onMounted</code></td><td><code>onMount</code> in <code>NixComponent</code></td></tr>
        </tbody>
      </table>

      <h3>Slots</h3>
      <div class="two-col">
        ${new CodeBlock(`<slot name="header" />`, 'vue')}
        ${new CodeBlock(`function Card({ children }) {
  return html\`<div class="card">\${children}</div>\`;
}`, 'ts')}
      </div>
    </div>
  `;
}

function SvelteSection(): NixTemplate {
  return html`
    <div class="migrate-section">
      <h3>Reactive script</h3>
      <div class="two-col">
        ${new CodeBlock(`<script>
  let count = 0;
  $: double = count * 2;
</script>

<button on:click={() => count++}>
  {count} / {double}
</button>`, 'svelte')}
        ${new CodeBlock(`const count = signal(0);
const double = computed(() => count.value * 2);

function Counter() {
  return html\`
    <button @click=\${() => count.value++}>
      \${() => count.value} / \${() => double.value}
    </button>
  \`;
}`, 'ts')}
      </div>

      <h3>Stores</h3>
      <div class="two-col">
        ${new CodeBlock(`import { writable } from 'svelte/store';
const store = writable(0);`, 'js')}
        ${new CodeBlock(`import { createStore } from '@deijose/nix-js';
const store = createStore({ count: 0 });`, 'ts')}
      </div>

      <h3>Transitions</h3>
      <div class="two-col">
        ${new CodeBlock(`<div transition:fade>
  Content
</div>`, 'svelte')}
        ${new CodeBlock(`transition(show, (el, done) => {
  el.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 200 }
  ).onfinish = done;
});`, 'ts')}
      </div>
    </div>
  `;
}
