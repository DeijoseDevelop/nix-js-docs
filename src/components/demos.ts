import { signal, computed, html, repeat, watch, effect, batch, untrack } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';

export function DemoCounter(): NixTemplate {
  const count = signal(0);
  const double = computed(() => count.value * 2);
  return html`
    <div class="dbox">
      <div class="dbox-lbl">Counter — signal() + computed()</div>
      <div class="big-n">${() => count.value}</div>
      <div style="font-family:var(--mono);font-size:12px;color:var(--tx3);margin-top:4px">
        doubled: <span style="color:var(--ac2)">${() => double.value}</span>
      </div>
      <div class="row">
        <button class="ibtn" @click=${() => count.value--}>−</button>
        <button class="ibtn" @click=${() => count.value++}>+</button>
        <button class="ibtn" @click=${() => (count.value = 0)} title="Reset">↺</button>
        <span style="font-size:18px">${() => count.value > 0 ? '😀' : count.value < 0 ? '😬' : '😐'}</span>
      </div>
    </div>
  `;
}

export function DemoComputed(): NixTemplate {
  const price = signal(25);
  const qty = signal(3);
  const total = computed(() => price.value * qty.value);
  const tax = computed(() => total.value * 0.16);

  return html`
    <div class="dbox">
      <div class="dbox-lbl">computed() — reactive calculator</div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:3px">
          <span>Price ($)</span><span style="color:var(--ac2)">${() => price.value}</span>
        </div>
        <input type="range" min="1" max="100" value=${() => price.value}
          @input=${(e: Event) => (price.value = +(e.target as HTMLInputElement).value)}
          style="width:100%;accent-color:var(--ac2)"/>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:3px">
          <span>Quantity</span><span style="color:var(--ac2)">${() => qty.value}</span>
        </div>
        <input type="range" min="1" max="20" value=${() => qty.value}
          @input=${(e: Event) => (qty.value = +(e.target as HTMLInputElement).value)}
          style="width:100%;accent-color:var(--ac2)"/>
      </div>
      <div style="border-top:1px solid var(--bd);padding-top:10px;font-family:var(--mono);font-size:12px">
        <div style="display:flex;justify-content:space-between;color:var(--tx2);margin-bottom:3px">
          <span>Subtotal</span><span>$${() => total.value.toFixed(2)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;color:var(--tx2);margin-bottom:5px">
          <span>Tax 16%</span><span>$${() => tax.value.toFixed(2)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;border-top:1px solid var(--bd);padding-top:5px">
          <span style="color:var(--tx)">Total</span>
          <span style="color:var(--ac2)">$${() => (total.value + tax.value).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

export function DemoEffect(): NixTemplate {
  const active = signal(false);
  const ticks = signal(0);
  const log = signal<{ t: string; c: string }[]>([]);
  let dispose_: (() => void) | null = null;

  const toggle = () => {
    if (active.value) {
      active.value = false;
      if (dispose_) { dispose_(); dispose_ = null; }
      log.update(l => [...l, { t: 'effect disposed ✓', c: 'var(--red)' }].slice(-7));
    } else {
      active.value = true;
      ticks.value = 0;
      log.update(l => [...l, { t: 'effect() started', c: 'var(--green)' }].slice(-7));
      let n = 0;
      dispose_ = effect(() => {
        const id = setInterval(() => {
          n++; ticks.value = n;
          log.update(l => [...l, { t: `  tick ${n}`, c: 'var(--ac2)' }].slice(-7));
        }, 900);
        return () => clearInterval(id);
      });
    }
  };

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">effect() — start / stop with cleanup</div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="flex:0 0 auto">
          <div class="big-n" style="font-size:42px;margin-bottom:8px">${() => ticks.value}</div>
          <div style="font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:10px">
            status: <span style=${() => `color:${active.value ? 'var(--green)' : 'var(--red)'}`}>${() => active.value ? 'running' : 'stopped'}</span>
          </div>
          <button class=${() => 'btn btn-sm ' + (active.value ? 'btn-o' : 'btn-p')} @click=${toggle}>
            ${() => active.value ? '⏹ Stop' : '▶ Start'}
          </button>
        </div>
        <div class="log-box" style="flex:1;min-height:100px">
          ${() => log.value.length === 0
            ? html`<span style="color:var(--tx3)">Press Start…</span>`
            : repeat(log.value, (_, i) => i, e => html`
                <div class="log-row"><span style=${`color:${e.c}`}>${e.t}</span></div>
              `)
          }
        </div>
      </div>
    </div>
  `;
}

export function DemoBatch(): NixTemplate {
  const runs = signal(0);
  const x = signal(0), y = signal(0), z = signal(0);
  effect(() => { x.value; y.value; z.value; runs.update(n => n + 1); });
  setTimeout(() => (runs.value = 0), 0);

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">batch() — effect flush counter</div>
      <div class="row" style="margin-bottom:12px;margin-top:0">
        <button class="btn btn-o btn-sm" @click=${() => { runs.value = 0; x.value++; y.value++; z.value++; }}>
          Without batch <span style="color:var(--red)">(3 flushes)</span>
        </button>
        <button class="btn btn-p btn-sm" @click=${() => { runs.value = 0; batch(() => { x.value++; y.value++; z.value++; }); }}>
          With batch() <span style="color:var(--green)">(1 flush)</span>
        </button>
      </div>
      <div class="sig-box">
        x=<span class="sig-v">${() => x.value}</span>　
        y=<span class="sig-v">${() => y.value}</span>　
        z=<span class="sig-v">${() => z.value}</span>　
        effect ran: <span style=${() => `color:${runs.value > 1 ? 'var(--red)' : 'var(--green)'};font-weight:700`}>${() => runs.value}×</span>
      </div>
    </div>
  `;
}

export function DemoWatch(): NixTemplate {
  const val = signal(5);
  const logs = signal<{ nv: number; ov: number | undefined; t: string }[]>([]);
  watch(val, (nv, ov) => {
    logs.update(a => [{ nv, ov, t: new Date().toLocaleTimeString('en', { hour12: false }) }, ...a].slice(0, 7));
  });

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">watch() — receives old + new value</div>
      <div class="row">
        <button class="ibtn" @click=${() => val.value--}>−</button>
        <span style="font-family:var(--head);font-size:28px;font-weight:900;color:var(--ac2);min-width:40px;text-align:center">${() => val.value}</span>
        <button class="ibtn" @click=${() => val.value++}>+</button>
        <span style="font-size:12px;color:var(--tx3);font-family:var(--mono)">← change to trigger watch()</span>
      </div>
      <div class="log-box">
        ${() => logs.value.length === 0
          ? html`<span style="color:var(--tx3)">No changes yet…</span>`
          : repeat(logs.value, (_, i) => i, e => html`
              <div class="log-row">
                <span style="color:var(--tx3)">${e.t}</span>　
                <span style="color:var(--tx2)">${e.ov ?? '?'}</span>
                <span style="color:var(--tx3)"> → </span>
                <span class="sig-v">${e.nv}</span>
              </div>
            `)
        }
      </div>
    </div>
  `;
}

export function DemoUntrack(): NixTemplate {
  const tracked = signal(0);
  const untracked_ = signal(0);
  const renders = signal(0);
  effect(() => {
    tracked.value;
    untrack(() => untracked_.value);
    renders.update(n => n + 1);
  });
  setTimeout(() => (renders.value = 0), 0);

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">untrack() — read without subscribing</div>
      <div class="row" style="margin-bottom:10px;margin-top:0">
        <button class="btn btn-p btn-sm" @click=${() => { renders.value = 0; tracked.update(n => n + 1); }}>
          tracked++ <span style="color:var(--green)">(triggers effect)</span>
        </button>
        <button class="btn btn-o btn-sm" @click=${() => { renders.value = 0; untracked_.update(n => n + 1); }}>
          untracked++ <span style="color:var(--gold)">(no effect re-run)</span>
        </button>
      </div>
      <div class="sig-box">
        tracked=<span class="sig-v">${() => tracked.value}</span>　
        untracked=<span class="sig-v">${() => untracked_.value}</span>　
        effect ran: <span style="color:var(--green);font-weight:700">${() => renders.value}×</span>
      </div>
    </div>
  `;
}

export function DemoTodo(): NixTemplate {
  interface Todo { id: number; text: string; done: boolean; }
  const todos = signal<Todo[]>([
    { id: 1, text: 'Learn Nix.js reactivity', done: false },
    { id: 2, text: 'Build a component', done: false },
    { id: 3, text: 'Ship to production', done: false },
  ]);
  const inp = signal('');
  const done = computed(() => todos.value.filter(t => t.done).length);
  let nid = 4;
  const add = () => { const t = inp.value.trim(); if (!t) return; todos.update(a => [...a, { id: nid++, text: t, done: false }]); inp.value = ''; };
  const toggle = (id: number) => todos.update(a => a.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const remove = (id: number) => todos.update(a => a.filter(i => i.id !== id));

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">repeat() — keyed reactive list</div>
      <div style="display:flex;gap:7px;margin-bottom:11px">
        <input class="inp" style="flex:1" placeholder="Add a task…"
          value=${() => inp.value}
          @input=${(e: Event) => (inp.value = (e.target as HTMLInputElement).value)}
          @keydown.enter=${add}/>
        <button class="btn btn-p btn-sm" @click=${add}>Add</button>
      </div>
      <div style="font-family:var(--mono);font-size:11px;color:var(--tx3);margin-bottom:8px">
        ${() => done.value} / ${() => todos.value.length} done
        <div class="prog"><div class="prog-f" style=${() => `width:${todos.value.length ? (done.value / todos.value.length * 100) : 0}%`}></div></div>
      </div>
      ${() => repeat(todos.value, t => t.id, (tInitial) => {
        const t = computed(() => todos.value.find(item => item.id === tInitial.id) || tInitial);

        return html`
          <div class="todo-row">
            <div 
              class=${() => 'tck' + (t.value.done ? ' on' : '')} 
              @click=${() => toggle(tInitial.id)}
            >
              ${() => t.value.done ? '✓' : ''}
            </div>
            
            <span style=${() => t.value.done ? 'text-decoration:line-through;color:var(--tx3);flex:1' : 'flex:1'}>
              ${tInitial.text}
            </span>
            
            <span class="tdel" @click=${() => remove(tInitial.id)}>×</span>
          </div>
        `;
      })}
    </div>
  `;
}

export function DemoForm(): NixTemplate {
  type FK = 'username' | 'email' | 'password';
  const fields = { username: signal(''), email: signal(''), password: signal('') };
  const touched = { username: signal(false), email: signal(false), password: signal(false) };
  const errors = {
    username: computed(() => { const v = fields.username.value; if (!v) return 'Required'; if (v.length < 3) return 'Min 3 chars'; return /\s/.test(v) ? 'No spaces' : null; }),
    email: computed(() => { const v = fields.email.value; if (!v) return 'Required'; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Invalid email'; }),
    password: computed(() => { const v = fields.password.value; if (!v) return 'Required'; return v.length < 8 ? 'At least 8 chars' : null; }),
  };
  const strength = computed(() => { const p = fields.password.value; return [p.length >= 8, /[A-Z]/.test(p), /\d/.test(p), /\W/.test(p)].filter(Boolean).length; });
  const isValid = computed(() => !errors.username.value && !errors.email.value && !errors.password.value);
  const success = signal(false);
  const strengthColors = ['', 'var(--red)', 'var(--gold)', 'var(--ac2)', 'var(--green)'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const submit = async () => {
    Object.values(touched).forEach(t => (t.value = true));
    if (!isValid.value) return;
    await new Promise(r => setTimeout(r, 900));
    success.value = true;
  };
  const reset = () => {
    success.value = false;
    Object.values(fields).forEach(f => (f.value = ''));
    Object.values(touched).forEach(t => (t.value = false));
  };

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">createForm() — live validation + computed state</div>
      ${() => success.value ? html`
        <div style="text-align:center;padding:20px">
          <div style="font-size:40px;margin-bottom:8px">🎉</div>
          <div style="font-family:var(--head);font-size:20px;color:var(--green)">Account created!</div>
          <button class="btn btn-o btn-sm" style="margin-top:12px" @click=${reset}>Reset</button>
        </div>
      ` : html`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div>
            ${(['username', 'email', 'password'] as FK[]).map(key => html`
              <div style="margin-bottom:12px">
                <div style="font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:4px">${key}</div>
                <input type=${key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} class="inp"
                  value=${() => fields[key].value}
                  @input=${(e: Event) => { fields[key].value = (e.target as HTMLInputElement).value; touched[key].value = true; }}
                  @blur=${() => { touched[key].value = true; }}
                  style=${() => `border-color:${touched[key].value && errors[key].value ? 'var(--red)' : ''}`}
                  placeholder=${`${key}…`}/>
                ${() => touched[key].value
                  ? errors[key].value
                    ? html`<div style="font-size:11px;color:var(--red);margin-top:3px;font-family:var(--mono)">✕ ${errors[key].value}</div>`
                    : html`<div style="font-size:11px;color:var(--green);margin-top:3px;font-family:var(--mono)">✓ Looks good</div>`
                  : null
                }
              </div>
            `)}
            ${() => fields.password.value ? html`
              <div style="margin-bottom:12px">
                <div style="display:flex;gap:4px;margin-bottom:3px">
                  ${[1,2,3,4].map(i => html`
                    <div style=${() => `height:4px;flex:1;border-radius:2px;background:${strength.value >= i ? strengthColors[strength.value] : 'var(--bd)'}`}></div>
                  `)}
                </div>
                <div style=${() => `font-size:11px;color:${strengthColors[strength.value]};font-family:var(--mono)`}>${() => strengthLabels[strength.value]}</div>
              </div>
            ` : null}
            <button class="btn btn-p" style="width:100%" @click=${submit}>Create account</button>
          </div>
          <div>
            <div style="font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:8px">LIVE STATE</div>
            <div class="sig-box">
              <div>username: <span class="sig-v">"${() => fields.username.value}"</span></div>
              <div>email: <span class="sig-v">"${() => fields.email.value}"</span></div>
              <div>valid: <span style=${() => `color:${isValid.value ? 'var(--green)' : 'var(--red)'}`}>${() => String(isValid.value)}</span></div>
              <div>strength: <span class="sig-v">${() => strength.value}/4</span></div>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

export function DemoRouter(): NixTemplate {
  const route = signal('/');
  const params = signal<Record<string, string>>({});
  const hist = signal<string[]>(['/']);

  interface Route { path: string; render: () => NixTemplate; }
  const routes: Route[] = [
    { path: '/', render: () => html`<div><h4 style="font-family:var(--head);font-size:16px;color:#fff;margin-bottom:6px">🏠 Home</h4><p style="color:var(--tx2);font-size:13px">Welcome! Use the nav links above.</p><div class="row"><button class="btn btn-p btn-sm" @click=${() => nav('/users/42')}>Go to User 42</button></div></div>` },
    { path: '/about', render: () => html`<div><h4 style="font-family:var(--head);font-size:16px;color:#fff;margin-bottom:6px">📄 About</h4><p style="color:var(--tx2);font-size:13px">Nix.js — a signal-based micro-framework. v1.7.9</p></div>` },
    { path: '/users/:id', render: () => html`<div><h4 style="font-family:var(--head);font-size:16px;color:#fff;margin-bottom:6px">👤 User <span style="color:var(--ac2)">#${() => params.value.id}</span></h4><div class="row">${[1,7,42,99].map(id => html`<button class="btn btn-o btn-sm" @click=${() => nav('/users/'+id)}>User ${id}</button>`)}</div></div>` },
  ];

  function matchRoute(path: string) {
    for (const r of routes) {
      if (r.path === path) return { r, p: {} as Record<string, string> };
      const rp = r.path.split('/'), pp = path.split('/');
      if (rp.length !== pp.length) continue;
      const p: Record<string, string> = {};
      if (rp.every((s, i) => { if (s.startsWith(':')) { p[s.slice(1)] = pp[i]; return true; } return s === pp[i]; })) return { r, p };
    }
    return { r: routes[0], p: {} };
  }

  function nav(path: string) {
    const m = matchRoute(path);
    route.value = path; params.value = m.p;
    hist.update(h => [path, ...h].slice(0, 5));
  }

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">Router — navigate, dynamic params, history</div>
      <div class="row" style="margin-bottom:12px;margin-top:0">
        ${routes.filter(r => !r.path.includes(':')).map(r => html`
          <button class=${() => 'btn btn-sm ' + (route.value === r.path ? 'btn-p' : 'btn-o')} @click=${() => nav(r.path)}>
            ${r.path === '/' ? 'Home' : r.path.replace('/', '')}
          </button>
        `)}
      </div>
      <div style="background:var(--bg);border:1px solid var(--bd);border-radius:8px;padding:16px;min-height:90px">
        ${() => matchRoute(route.value).r.render()}
      </div>
      <div style="margin-top:8px;font-family:var(--mono);font-size:11px;color:var(--tx3)">
        path: <span style="color:var(--ac2)">${() => route.value}</span>　history: ${() => hist.value.slice(0, 3).join(' → ')}
      </div>
    </div>
  `;
}

export function DemoStore(): NixTemplate {
  interface Product { id: number; name: string; price: number; }
  interface CartItem extends Product { qty: number; }
  const PRODUCTS: Product[] = [
    { id: 1, name: 'Nix.js Tee', price: 25 }, { id: 2, name: 'Signal Mug', price: 15 },
    { id: 3, name: 'Effect Hoodie', price: 45 }, { id: 4, name: 'Batch Sticker', price: 5 },
  ];
  const items = signal<CartItem[]>([]);
  const discount = signal(0);
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0));
  const total = computed(() => subtotal.value * (1 - discount.value / 100));
  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0));
  const add = (p: Product) => items.update(a => { const ex = a.find(i => i.id === p.id); return ex ? a.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...a, { ...p, qty: 1 }]; });
  const rem = (id: number) => items.update(a => a.filter(i => i.id !== id));

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">createStore() — shopping cart with computed</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <div style="font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:7px">PRODUCTS</div>
          ${PRODUCTS.map(p => html`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--bd)">
              <span style="font-size:13px;color:var(--tx2)">${p.name}</span>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-family:var(--mono);font-size:11px;color:var(--tx3)">$${p.price}</span>
                <button class="btn btn-p btn-sm" style="padding:3px 10px" @click=${() => add(p)}>+</button>
              </div>
            </div>
          `)}
        </div>
        <div>
          <div style="font-size:11px;color:var(--tx3);font-family:var(--mono);margin-bottom:7px">
            CART <span style="color:var(--ac2)">${() => count.value} items</span>
          </div>
          ${() => items.value.length === 0
            ? html`<div style="color:var(--tx3);font-size:13px">Empty — add products</div>`
            : html`
                ${() => repeat(items.value, i => i.id, i => html`
                  <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--bd);font-size:12px">
                    <span style="color:var(--tx2)">${i.name}×${i.qty}</span>
                    <div style="display:flex;gap:6px;align-items:center">
                      <span style="color:var(--ac2);font-family:var(--mono)">$${(i.price * i.qty).toFixed(2)}</span>
                      <span @click=${() => rem(i.id)} style="cursor:pointer;color:var(--red)">×</span>
                    </div>
                  </div>
                `)}
                <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:14px;font-weight:700;border-top:1px solid var(--bd);padding-top:7px;margin-top:7px">
                  <span>Total</span><span style="color:var(--ac2)">$${() => total.value.toFixed(2)}</span>
                </div>
                <button class="btn btn-o btn-sm" style="width:100%;margin-top:7px" @click=${() => { items.value = []; discount.value = 0; }}>Clear</button>
              `
          }
        </div>
      </div>
    </div>
  `;
}

export function DemoShowHide(): NixTemplate {
  const panels = signal({ a: true, b: false, c: true });
  const loading = signal(false);

  const toggle = (k: 'a' | 'b' | 'c') => panels.update(p => ({ ...p, [k]: !p[k] }));
  const sim = () => {
    if (loading.value) return;
    loading.value = true;
    setTimeout(() => (loading.value = false), 2200);
  };

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">show / hide — DOM stays, state preserved</div>
      <div class="row" style="margin-bottom:12px;margin-top:0">
        ${(['a', 'b', 'c'] as const).map(k => html`
          <button class=${() => 'btn btn-sm ' + (panels.value[k] ? 'btn-p' : 'btn-o')} @click=${() => toggle(k)}>
            Panel ${k.toUpperCase()} ${() => panels.value[k] ? '👁' : '🙈'}
          </button>
        `)}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
        ${(['a', 'b', 'c'] as const).map(k => html`
          <div show=${() => panels.value[k]}
               style="background:var(--bg);border:1px solid var(--bd);border-radius:6px;padding:10px">
            <div style="font-size:10px;color:var(--ac2);font-family:var(--mono);margin-bottom:5px">Panel ${k.toUpperCase()}</div>
            <input class="inp" placeholder="Type here — value survives toggle!"/>
          </div>
        `)}
      </div>
      <div style="border-top:1px solid var(--bd);padding-top:12px">
        <button class="btn btn-p btn-sm" @click=${sim} disabled=${() => loading.value}>
          ${() => loading.value ? 'Loading…' : 'Simulate load (2s)'}
        </button>
        <div show=${() => loading.value} style="height:12px;background:var(--bd2);border-radius:4px;animation:pulse 1.2s infinite;margin-top:8px"></div>
        <div hide=${() => loading.value} style="font-size:13px;color:var(--tx2);margin-top:8px">✓ Content loaded!</div>
      </div>
    </div>
  `;
}

export function DemoAsync(): NixTemplate {
  type State = 'idle' | 'loading' | 'success' | 'error';
  const state = signal<State>('idle');
  const data = signal<{ id: number; name: string; role: string }[] | null>(null);
  const errMsg = signal('');
  const fail = signal(false);

  const load = async () => {
    state.value = 'loading'; data.value = null;
    await new Promise(r => setTimeout(r, 1200));
    if (fail.value) { state.value = 'error'; errMsg.value = 'Network error: Failed to fetch /api/users'; return; }
    data.value = [
      { id: 1, name: 'Deiver José', role: 'Author' },
      { id: 2, name: 'Alice Smith', role: 'Contributor' },
      { id: 3, name: 'Bob Chen', role: 'Maintainer' },
    ];
    state.value = 'success';
  };

  const stc: Record<State, string> = { idle: 'var(--tx3)', loading: 'var(--gold)', success: 'var(--green)', error: 'var(--red)' };

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">suspend() — pending / resolved / error states</div>
      <div class="row" style="margin-bottom:12px;margin-top:0">
        <button class="btn btn-p btn-sm" @click=${load} disabled=${() => state.value === 'loading'}>
          ${() => state.value === 'loading' ? 'Fetching…' : 'Fetch /api/users'}
        </button>
        <label style="display:flex;align-items:center;gap:7px;font-size:13px;color:var(--tx2);cursor:pointer">
          <input type="checkbox" @change=${(e: Event) => (fail.value = (e.target as HTMLInputElement).checked)}/> Simulate error
        </label>
        <div style="font-family:var(--mono);font-size:11px;padding:3px 10px;border-radius:4px;border:1px solid var(--bd2)">
          state: <span style=${() => `color:${stc[state.value]}`}>${() => state.value}</span>
        </div>
      </div>
      <div style="min-height:80px;background:var(--bg);border:1px solid var(--bd);border-radius:8px;padding:14px">
        ${() => {
          switch (state.value) {
            case 'idle': return html`<div style="color:var(--tx3);font-size:13px">Press Fetch to load data…</div>`;
            case 'loading': return html`<div style="display:flex;gap:10px;align-items:center"><div style="width:15px;height:15px;border:2px solid var(--ac2);border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite"></div><span style="color:var(--tx2);font-size:13px">Fetching…</span></div>`;
            case 'error': return html`<div style="color:var(--red)"><div style="font-weight:600;margin-bottom:4px">✕ Error</div><div style="font-family:var(--mono);font-size:12px">${() => errMsg.value}</div><button class="btn btn-o btn-sm" style="margin-top:8px" @click=${load}>Retry</button></div>`;
            case 'success': return html`${() => repeat(data.value ?? [], u => u.id, u => html`
              <div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--bd)">
                <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--ac),var(--ac3));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff;flex-shrink:0">${u.name[0]}</div>
                <div><div style="font-size:13px;color:var(--tx)">${u.name}</div><div style="font-size:11px;color:var(--ac2);font-family:var(--mono)">${u.role}</div></div>
              </div>
            `)}`;
            default: return null;
          }
        }}
      </div>
    </div>
  `;
}

export function DemoDI(): NixTemplate {
  const theme = signal<'dark' | 'light' | 'purple'>('dark');
  const lang = signal<'en' | 'es' | 'fr'>('en');
  const tr = {
    en: { h: 'Hello', b: 'Click me', s: 'Logged in as' },
    es: { h: 'Hola', b: 'Haz clic', s: 'Conectado como' },
    fr: { h: 'Bonjour', b: 'Cliquez', s: 'Connecté en tant que' },
  };

  return html`
    <div class="dbox" style="grid-column:1/-1">
      <div class="dbox-lbl">provide() / inject() — theme + i18n context</div>
      <div style="display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap">
        <div>
          <div style="font-size:10px;color:var(--tx3);font-family:var(--mono);margin-bottom:5px">THEME</div>
          <div class="row" style="margin-top:0">
            ${(['dark', 'light', 'purple'] as const).map(t => html`
              <button class=${() => 'btn btn-sm ' + (theme.value === t ? 'btn-p' : 'btn-o')} @click=${() => (theme.value = t)}>${t}</button>
            `)}
          </div>
        </div>
        <div>
          <div style="font-size:10px;color:var(--tx3);font-family:var(--mono);margin-bottom:5px">LANGUAGE</div>
          <div class="row" style="margin-top:0">
            ${(['en', 'es', 'fr'] as const).map(l => html`
              <button class=${() => 'btn btn-sm ' + (lang.value === l ? 'btn-p' : 'btn-o')} @click=${() => (lang.value = l)}>${l}</button>
            `)}
          </div>
        </div>
      </div>
      <div style=${() => `padding:18px;border-radius:8px;border:1px solid var(--bd2);transition:background .3s;background:${theme.value === 'dark' ? '#09090f' : theme.value === 'light' ? '#f8f9fa' : '#1a0a2e'}`}>
        <div style="font-size:10px;color:var(--tx3);font-family:var(--mono);margin-bottom:10px">ThemedCard (injected theme + lang)</div>
        <div style=${() => `font-family:var(--head);font-size:20px;font-weight:700;margin-bottom:10px;color:${theme.value === 'light' ? '#1a1a2e' : theme.value === 'purple' ? 'var(--ac2)' : 'var(--tx)'}`}>
          ${() => tr[lang.value]?.h}!
        </div>
        <button style=${() => `padding:8px 18px;border-radius:7px;border:none;cursor:pointer;font-family:var(--body);font-size:14px;font-weight:600;background:${theme.value === 'purple' ? 'var(--ac)' : theme.value === 'light' ? '#1a1a2e' : 'var(--ac)'};color:#fff`}>
          ${() => tr[lang.value]?.b}
        </button>
      </div>
    </div>
  `;
}
