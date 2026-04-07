import { signal, html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';


export function IntroPage(): NixTemplate {
  const greeting = signal('World');
  const color = signal('#a78bfa');
  const size = signal(28);

  return html`
    <div>
      <div class="hero">
        <div class="eyebrow">Documentation · v1.7.9</div>
        <h1>Nix<em>.</em>js</h1>
        <p class="hero-desc">A signal-based micro-framework for building modern web UIs. No virtual DOM, no compiler, no build-time magic — just signals, tagged templates, and pure TypeScript.</p>
        <div class="hero-tags">
          <span class="badge"><span class="bdot" style="background:var(--green)"></span>413 tests passing</span>
          <span class="badge"><span class="bdot" style="background:var(--ac3)"></span>~10 KB gzipped</span>
          <span class="badge"><span class="bdot" style="background:var(--ac2)"></span>TypeScript-first</span>
          <span class="badge"><span class="bdot" style="background:var(--gold)"></span>Zero dependencies</span>
        </div>
        <div class="hero-acts">
          <a class="btn btn-p" href="https://www.npmjs.com/package/@deijose/nix-js" target="_blank">npm install</a>
          <a class="btn btn-o" href="https://github.com/DeijoseDevelop/nix-js" target="_blank">GitHub ↗</a>
        </div>
      </div>

      <h3>What is Nix.js?</h3>
      <p>Nix.js is a lightweight reactive framework. It uses <strong>fine-grained signals</strong> to update only the exact DOM nodes that changed — no component tree diffing, no virtual DOM overhead, no compiler step required.</p>
      ${new CodeBlock(S.intro_hello)}


      <div class="cards">
        <div class="card"><span class="card-ic">⚡</span><div class="card-t">Fine-Grained Reactivity</div><div class="card-d">Each binding creates at most one effect. Signal changes produce surgical DOM patches.</div></div>
        <div class="card"><span class="card-ic">🚫</span><div class="card-t">No Compiler Required</div><div class="card-d">Templates are standard JS tagged template literals. Zero build-time transforms needed.</div></div>
        <div class="card"><span class="card-ic">📦</span><div class="card-t">Zero Dependencies</div><div class="card-d">~10 KB gzipped. Router, forms, stores, DI, portals — all included in that budget.</div></div>
        <div class="card"><span class="card-ic">🔷</span><div class="card-t">TypeScript-First</div><div class="card-d">Every public API is fully typed. Typed injection keys, typed store signals, typed router params.</div></div>
        <div class="card"><span class="card-ic">🎯</span><div class="card-t">Surgical DOM Updates</div><div class="card-d">Each interpolation inside html creates at most one effect. One signal → one DOM node.</div></div>
        <div class="card"><span class="card-ic">🔄</span><div class="card-t">Batteries Included</div><div class="card-d">What React/Vue need 3–5 extra packages for, Nix.js ships out of the box.</div></div>
      </div>

      <h3>Architecture</h3>
      <div class="arch-wrap">
        <div class="arch-row"><div class="arch-title">Reactivity</div><div class="arch-items"><span>signal()</span><span>computed()</span><span>effect()</span><span>batch()</span><span>watch()</span><span>untrack()</span><span>nextTick()</span></div></div>
        <div class="arch-row"><div class="arch-title">Rendering</div><div class="arch-items"><span>html\`\`</span><span>repeat()</span><span>ref()</span><span>portal()</span><span>transition()</span><span>show/hide</span></div></div>
        <div class="arch-row"><div class="arch-title">Components</div><div class="arch-items"><span>NixTemplate (fn)</span><span>NixComponent (class)</span><span>mount()</span><span>children / slots</span></div></div>
        <div class="arch-row"><div class="arch-title">Application</div><div class="arch-items"><span>createRouter()</span><span>createStore()</span><span>createForm()</span><span>provide()/inject()</span><span>suspend()</span><span>lazy()</span></div></div>
      </div>

      <div class="cl cl-i"><span class="cl-ic">ℹ️</span><p>This documentation is itself built with Nix.js — every interactive demo below is a live running Nix.js component.</p></div>

      <h3>Live Demo</h3>
      <div class="demo">
        <div class="demo-lbl">Try it — edit the values and watch the DOM update</div>
        <div class="demo-grid">
          <div class="dbox" style="grid-column:1/-1">
            <div class="dbox-lbl">Reactive greeting — 3 signals, zero re-renders</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
              <div>
                <div style="margin-bottom:12px">
                  <div style="font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:4px">Name</div>
                  <input class="inp" value=${() => greeting.value} @input=${(e: Event) => (greeting.value = (e.target as HTMLInputElement).value)} placeholder="World"/>
                </div>
                <div style="margin-bottom:12px">
                  <div style="font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:4px">Color</div>
                  <div style="display:flex;gap:8px;align-items:center">
                    <input type="color" value=${() => color.value} @input=${(e: Event) => (color.value = (e.target as HTMLInputElement).value)} style="width:38px;height:34px;border:none;border-radius:6px;cursor:pointer;background:none"/>
                    <span style="font-family:var(--mono);font-size:12px;color:var(--tx2)">${() => color.value}</span>
                  </div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:4px">
                    <span>Font size</span><span style="color:var(--ac2)">${() => size.value}px</span>
                  </div>
                  <input type="range" min="14" max="52" value=${() => size.value} @input=${(e: Event) => (size.value = +(e.target as HTMLInputElement).value)} style="width:100%;accent-color:var(--ac2)"/>
                </div>
              </div>
              <div style="background:var(--bg);border:1px solid var(--bd);border-radius:8px;display:flex;align-items:center;justify-content:center;padding:20px;min-height:110px">
                <div style=${() => `font-family:var(--head);font-size:${size.value}px;font-weight:900;color:${color.value};text-align:center;word-break:break-word`}>
                  Hello, ${() => greeting.value || '…'}!
                </div>
              </div>
            </div>
            <div class="sig-box" style="margin-top:14px">
              <span style="color:var(--tx3)">// 3 signals, no parent re-render — only the bound DOM nodes update</span><br/>
              greeting=<span class="sig-v">"${() => greeting.value}"</span>　
              color=<span class="sig-v">${() => color.value}</span>　
              size=<span class="sig-v">${() => size.value}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
