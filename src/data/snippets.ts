export const S: Record<string, string> = {};

S.intro_hello = `
import { signal, html, mount } from '@deijose/nix-js';

function App() {
  const count = signal(0);
  
  return html\`
    <button @click=\${() => count.value++}>
      Count: \${() => count.value}
    </button>
  \`;
}

mount(App(), '#app');`.trim();
S.signal_fn = `
function Counter() {
  const count = signal(0);

  count.value;               // get → 0
  count.value = 5;           // set
  count.update(n => n + 1); // update
  count.peek();              // peek
  count.dispose();           // dispose

  count.value = 5; // skipped if already 5

  return html\`<p>\${() => count.value}</p>\`;
}`.trim();

S.computed_fn = `
function PriceCalculator() {
  const price    = signal(10);
  const quantity = signal(3);

  const subtotal = computed(() => price.value * quantity.value);
  const tax      = computed(() => subtotal.value * 0.16);
  const total    = computed(() => subtotal.value + tax.value);

  // total.value = 99; // ❌ throws TypeError

  return html\`
    <div>
      <p>Subtotal: \${() => subtotal.value}</p>
      <p>Tax (16%): \${() => tax.value.toFixed(2)}</p>
      <p>Total:     \${() => total.value.toFixed(2)}</p>
      <input type="range" min="1" max="100"
        value=\${() => price.value}
        @input=\${e => price.value = +e.target.value} />
    </div>
  \`;
}`.trim();

S.effect_class = `
class AutoSaveForm extends NixComponent {
  private draft = signal({ title: '', body: '' });
  private saved = signal(true);
  private _timer = 0;

  onMount() {
    const dispose = effect(() => {
      const _ = this.draft.value;
      this.saved.value = false;

      return () => clearTimeout(this._timer);
    });

    // Start the auto-save interval
    const id = setInterval(() => {
      if (!this.saved.value) {
        console.log('Saving draft…', this.draft.peek());
        this.saved.value = true;
      }
    }, 2000);

    // onMount cleanup: stop effect + interval
    return () => { dispose(); clearInterval(id); };
  }

  render() {
    return html\`
      <textarea
        @input=\${e => this.draft.update(d => ({ ...d, body: e.target.value }))}
      ></textarea>
      <span>\${() => this.saved.value ? '✓ Saved' : '● Unsaved'}</span>
    \`;
  }
}`.trim();

S.batch_fn = `
function UserProfileEditor() {
  const firstName = signal('Deiver');
  const lastName  = signal('José');
  const age       = signal(24);

  const updateAll = () => {
    batch(() => {
      firstName.value = 'María';
      lastName.value  = 'López';
      age.value       = 28;
    });
  };

  return html\`
    <p>\${() => firstName.value} \${() => lastName.value}, \${() => age.value}</p>
    <button @click=\${updateAll}>Update profile</button>
  \`;
}`.trim();

S.watch_fn = `
function ThemeWatcher() {
  const theme = signal('dark');

  const stopWatch = watch(theme, (next, prev) => {
    console.log(\`Theme: \${prev} → \${next}\`);
    document.body.dataset.theme = next;
  });

  watch(theme, val => applyTheme(val), {
    immediate: true,
    once:      true,
  });

  // Watch a computed expression (not just a signal)
  watch(
    () => theme.value === 'dark',
    isDark => toggleDarkClasses(isDark)
  );

  return html\`
    <button @click=\${() => theme.update(t => t === 'dark' ? 'light' : 'dark')}>
      Toggle theme (\${() => theme.value})
    </button>
  \`;
}`.trim();

S.untrack_fn = `
function SmartLogger() {
  const data     = signal({ items: [], page: 1 });
  const logLevel = signal('info');

  effect(() => {
    const items = data.value.items;
    const level = untrack(() => logLevel.value);

    if (level !== 'silent') {
      console.log(\`[\${level}] Loaded \${items.length} items\`);
    }
  });

  return html\`<div>\${() => data.value.items.length} items</div>\`;
}`.trim();

S.html_bindings = `
function LoginForm() {
  const email    = signal('');
  const password = signal('');
  const isValid  = computed(() => email.value.includes('@') && password.value.length >= 8);
  const error    = signal('');

  const submit = async () => {
    try {
      await api.login(email.peek(), password.peek());
    } catch (e) {
      error.value = e.message;
    }
  };

  return html\`
    <form @submit.prevent=\${submit}>
      <!-- Reactive attribute bindings -->
      <input
        type="email"
        value=\${() => email.value}
        @input=\${e => email.value = e.target.value}
        placeholder="Email"
      />
      <input
        type="password"
        value=\${() => password.value}
        @input=\${e => password.value = e.target.value}
        placeholder="Password (min 8 chars)"
      />

      <!-- null/false removes the attribute -->
      <button
        type="submit"
        disabled=\${() => !isValid.value || null}
        class=\${() => \`btn \${isValid.value ? 'btn--ready' : ''}\`}
      >
        Sign in
      </button>

      <!-- Conditional error message -->
      \${() => error.value
        ? html\`<p class="error">\${() => error.value}</p>\`
        : null
      }
    </form>
  \`;
}`.trim();

S.html_events = `
function InteractiveList() {
  const items = signal([]);
  const input = signal('');

  const add    = () => { if (input.value.trim()) { items.update(a => [...a, input.value.trim()]); input.value = ''; } };
  const remove = i  => items.update(a => a.filter((_,j) => j !== i));

  return html\`
    <div>
      <!-- Event modifiers chain with dots -->
      <form @submit.prevent=\${add}>
        <input
          value=\${() => input.value}
          @input=\${e => input.value = e.target.value}
          @keydown.escape=\${() => input.value = ''}
        />
        <!-- .stop prevents propagation, .once fires only once -->
        <button type="submit" @click.stop=\${add}>Add</button>
      </form>

      <ul>
        \${() => items.value.map((item, i) => html\`
          <li>
            \${item}
            <button @click=\${() => remove(i)}>✕</button>
          </li>
        \`)}
      </ul>
    </div>
  \`;
}`.trim();

S.html_repeat = `
function TodoList() {
  const todos = signal([
    { id: 1, text: 'Learn signals', done: false },
    { id: 2, text: 'Build an app', done: false },
  ]);
  let nextId = 3;

  const toggle = id => todos.update(list =>
    list.map(t => t.id === id ? { ...t, done: !t.done } : t)
  );
  const remove = id => todos.update(list => list.filter(t => t.id !== id));
  const add    = text => todos.update(list => [...list, { id: nextId++, text, done: false }]);

  return html\`
    <ul>
      <!-- repeat() keys DOM nodes — only changed items are touched -->
      \${() => repeat(
        todos.value,
        todo => todo.id,                  // unique key fn
        (todo, index) => html\`
          <li>
            <input type="checkbox"
              checked=\${() => todo.done || null}
              @change=\${() => toggle(todo.id)} />
            <span class=\${() => todo.done ? 'done' : ''}>\${todo.text}</span>
            <button @click=\${() => remove(todo.id)}>×</button>
          </li>
        \`
      )}
    </ul>
  \`;
}`.trim();

S.comp_fn = `
import type { NixTemplate } from '@deijose/nix-js';

// Function component: plain function → NixTemplate
// Best for: pages, display components, no lifecycle needed
function UserCard({ user }: { user: { name: string; role: string } }): NixTemplate {
  const expanded = signal(false);

  return html\`
    <div class="card">
      <h2>\${user.name}</h2>
      <p class="role">\${user.role}</p>

      <button @click=\${() => expanded.update(v => !v)}>
        \${() => expanded.value ? 'Hide details' : 'Show details'}
      </button>

      \${() => expanded.value
        ? html\`<div class="details">Additional info here</div>\`
        : null
      }
    </div>
  \`;
}

// Use in another component or mount directly
function App(): NixTemplate {
  const user = { name: 'Deiver José', role: 'developer' };
  return html\`
    <main>
      \${UserCard({ user })}
    </main>
  \`;
}

mount(App(), '#app');`.trim();

S.comp_class = `
class DataTable extends NixComponent {
  private rows    = signal<Row[]>([]);
  private loading = signal(true);
  private error   = signal('');
  private sortBy  = signal('name');

  private sorted = computed(() =>
    [...this.rows.value].sort((a, b) =>
      String(a[this.sortBy.value]).localeCompare(String(b[this.sortBy.value]))
    )
  );

  onInit() { /* provide context here */ }

  render() {
    return html\`
      <div class="table-wrapper">
        \${() => this.loading.value
          ? html\`<div class="spinner">Loading…</div>\`
          : this.error.value
            ? html\`<p class="error">\${() => this.error.value}</p>\`
            : html\`
                <table>
                  \${() => repeat(this.sorted.value, row => row.id, row => html\`
                    <tr>
                      <td>\${row.name}</td>
                      <td>\${row.value}</td>
                    </tr>
                  \`)}
                </table>
              \`
        }
      </div>
    \`;
  }

  onMount() {
    fetch('/api/rows')
      .then(r => r.json())
      .then(data => { this.rows.value = data; this.loading.value = false; })
      .catch(e  => { this.error.value = e.message; this.loading.value = false; });

    const id = setInterval(() => this.refresh(), 30_000);
    return () => clearInterval(id);
  }

  onUnmount() { console.log('DataTable unmounted'); }

  onError(err: unknown) {
    this.error.value = err instanceof Error ? err.message : String(err);
    this.loading.value = false;
  }

  private refresh() {
    fetch('/api/rows').then(r=>r.json()).then(d=>this.rows.value=d);
  }
}`.trim();

S.comp_slots = `
// Class component with default slot + named slots
class PageLayout extends NixComponent {
  render() {
    return html\`
      <div class="layout">
        <header class="layout-header">
          \${this.slot('header') ?? html\`<h1>Default Title</h1>\`}
        </header>

        <nav class="layout-nav">
          \${this.slot('nav')}
        </nav>

        <main class="layout-main">
          \${this.children}  <!-- default slot -->
        </main>

        <footer class="layout-footer">
          \${this.slot('footer') ?? html\`<small>© 2026</small>\`}
        </footer>
      </div>
    \`;
  }
}

// Usage: setSlot() + setChildren() are chainable
function DashboardPage(): NixTemplate {
  return html\`
    \${new PageLayout()
      .setSlot('header', html\`<h1>Dashboard</h1>\`)
      .setSlot('nav',    html\`<nav><a href="/">Home</a></nav>\`)
      .setChildren(      html\`<p>Main dashboard content here</p>\`)
      .setSlot('footer', html\`<small>Nix.js v2.5.3</small>\`)
    }
  \`;
}`.trim();

S.store_basic = `
import { createStore } from '@deijose/nix-js';

// Every key becomes a Signal automatically
const counterStore = createStore(
  { count: 0, step: 1 },
  { name: 'counter' }  // optional — used in error messages
);

// Read / write signals directly
counterStore.count.value;
counterStore.count.value++;
counterStore.step.value = 5;

// $state — reactive snapshot (creates subscription when read inside effect/computed)
counterStore.$state; // { count: 1, step: 5 }

// $snapshot() — passive snapshot, no reactive subscription (use in plugins, loggers)
counterStore.$snapshot(); // { count: 1, step: 5 }

// $patch — batch-update multiple keys at once
counterStore.$patch({ count: 0, step: 1 });

// $reset — restore ALL signals to initial values
counterStore.$reset();

// $watch — reactive subscription (same API as watch())
const stop = counterStore.$watch((next, prev) => {
  console.log('state changed', prev, '->', next);
});

// $dispose — cleanup store and all plugins
counterStore.$dispose();`.trim();

S.store_actions = `
interface CartItem { id: number; name: string; price: number; qty: number; }

const cartStore = createStore(
  {
    items:    [] as CartItem[],
    coupon:   '',
    discount: 0,
  },
  {
    name: 'cart',
    actions: (s) => ({
      addItem(item: CartItem) {
        const existing = s.items.value.find(i => i.id === item.id);
        if (existing) {
          s.items.value = s.items.value.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
        } else {
          s.items.value = [...s.items.value, { ...item, qty: 1 }];
        }
      },
      removeItem(id: number) {
        s.items.value = s.items.value.filter(i => i.id !== id);
      },
      applyCoupon(code: string) {
        s.coupon.value   = code;
        s.discount.value = code === 'NIX20' ? 20 : 0;
      },
      clearCart() { cartStore.$reset(); },
    }),
  }
);

function CartButton(): NixTemplate {
  const count = computed(() => cartStore.items.value.reduce((s, i) => s + i.qty, 0));
  return html\`
    <button @click=\${() => cartStore.addItem({ id: 1, name: 'Tee', price: 25, qty: 1 })}>
      Cart (\${() => count.value})
    </button>
  \`;
}`.trim();

S.store_getters = `
const counterStore = createStore(
  { count: 0, items: [] as string[] },
  {
    actions: (s) => ({
      increment: () => s.count.value++,
      addItem: (name: string) => s.items.value = [...s.items.value, name],
    }),
    getters: (s) => ({
      double: computed(() => s.count.value * 2),
      total:  computed(() => s.items.value.length),
    }),
  }
);

counterStore.increment();
counterStore.double.value; // 2  — ReadonlySignal, throws on write
counterStore.total.value;  // items length
`.trim();

S.store_watch = `
const store = createStore({ count: 0, theme: 'dark' });

// $watch — same API as watch() from reactivity
const stop = store.$watch((next, prev) => {
  console.log('state changed', prev?.count, '->', next.count);

  // Persist full snapshot on every change
  localStorage.setItem('app-store', JSON.stringify(next));
});

store.count.value++;
store.$patch({ theme: 'light' });

// Later (cleanup)
stop();
`.trim();

S.store_plugins = `
import { persistPlugin, loggerPlugin, guardPlugin } from '@deijose/nix-js/store';

interface RiderState {
  nickname: string;
  kmTotal:  number;
  isOnline: boolean;
}

export const riderStore = createStore<RiderState>(
  { nickname: 'Rider', kmTotal: 0, isOnline: false },
  {
    name: 'rider',
    actions: (s) => ({
      addKm:     (km: number)  => { s.kmTotal.value += km; },
      setOnline: (v: boolean)  => { s.isOnline.value = v; },
    }),
    plugins: [
      // Hydrates from localStorage on init, persists on every change
      persistPlugin<RiderState>('ib:rider', { exclude: ['isOnline'] }),

      // Logs diffs to console (dev only)
      loggerPlugin<RiderState>({ collapsed: true }),

      // Validates BEFORE mutations — can transform or throw
      guardPlugin<RiderState>([
        (next, current) => {
          if ('kmTotal' in next && (next.kmTotal as number) < 0)
            throw new Error('kmTotal cannot be negative.');
          if ('nickname' in next) {
            const n = next.nickname as string;
            if (n.length < 3) throw new Error('Nickname too short.');
            return { ...next, nickname: n.toUpperCase() }; // transform
          }
        },
      ]),
    ],
  }
);
`.trim();

S.store_bridge = `
import { bridgePlugin } from '@deijose/nix-js/store';
import { authStore }    from './auth.store';

// When authStore changes → sync data into riderStore automatically
export const riderStore = createStore<RiderState>(
  { nickname: 'Rider', kmTotal: 0, isOnline: false },
  {
    name: 'rider',
    plugins: [
      bridgePlugin<RiderState, AuthState>(
        authStore,
        (auth, rider) => {
          if (auth.isAuthenticated && auth.username) {
            rider.$patch({ nickname: auth.username, isOnline: true });
          }
          if (!auth.isAuthenticated) {
            rider.$patch({ nickname: 'Rider', isOnline: false });
          }
        }
      ),
    ],
  }
);

// Usage — no manual wiring needed:
authStore.login('u_123', 'DEIVER', 'token_xxx');
// → riderStore.nickname.value === 'DEIVER'
// → riderStore.isOnline.value === true
`.trim();

S.router_setup = `
import { createRouter, RouterView, Link, nixRouter } from '@deijose/nix-js';

const router = createRouter([
  { name: 'home',        path: '/',          component: () => HomePage()       },
  { name: 'about',       path: '/about',     component: () => AboutPage()      },
  { name: 'users',       path: '/users',     component: () => UsersPage()      },
  { name: 'user-detail', path: '/users/:id', component: () => UserDetailPage() },
  { path: '*',           component: () => NotFoundPage()   },
]);

function App(): NixTemplate {
  return html\`
    <div class="app">
      <nav>
        \${new Link('/',      'Home')}
        \${new Link('/about', 'About')}
        \${new Link('/users', 'Users')}
      </nav>
      <main>
        \${new RouterView()}
      </main>
    </div>
  \`;
}

mount(App(), '#app', { router });`.trim();

S.router_named = `
const router = createRouter([
  { name: 'home',        path: '/',          component: () => HomePage() },
  { name: 'user-detail', path: '/users/:id', component: () => UserDetailPage() },
  { name: 'search',      path: '/search',    component: () => SearchPage() },
]);

router.navigate({ name: 'user-detail', params: { id: 42 } });
router.navigate({ name: 'search', query: { q: 'nix', page: 1 } });
router.replace({ name: 'user-detail', params: { id: '99' } });

// query merge with second argument
router.navigate(
  { name: 'search', query: { q: 'nix' } },
  { page: 2, from: 'navbar' }
);

// String paths still work (non-breaking)
router.navigate('/users/42');
`.trim();

S.router_params = `
function UserDetailPage(): NixTemplate {
  const router = nixRouter();

  const userId = computed(() => router.params.value.id);
  const tab    = computed(() => router.query.value.tab ?? 'overview');

  return html\`
    <div class="user-detail">
      <h1>User #\${() => userId.value}</h1>

      <nav class="tabs">
        \${['overview', 'posts', 'settings'].map(t => html\`
          <button
            class=\${() => tab.value === t ? 'tab active' : 'tab'}
            @click=\${() => router.navigate('/users/' + userId.value, { tab: t })}
          >\${t}</button>
        \`)}
      </nav>

      \${() => tab.value === 'overview'  ? html\`<UserOverview  id=\${userId.value} />\` : null}
      \${() => tab.value === 'posts'     ? html\`<UserPosts     id=\${userId.value} />\` : null}
      \${() => tab.value === 'settings'  ? html\`<UserSettings  id=\${userId.value} />\` : null}
    </div>
  \`;
}`.trim();

S.router_guards = `
const router = createRouter([...]);

// Global guard — return: void=allow  false=cancel  string=redirect
const stopAuth = router.beforeEach(async (to, from) => {
  const pub = ['/', '/login', '/register', '/about'];
  if (pub.includes(to)) return;

  const ok = await authService.checkSession();
  if (!ok) return '/login';
});

createRouter([
  {
    path: '/admin',
    component: () => AdminPage(),
    beforeEnter: (to, from) => {
      if (!userStore.isAdmin.value) return '/';
    },
  },
]);

router.afterEach((to, from) => {
  analytics.pageView(to);
  window.scrollTo(0, 0);
});`.trim();

S.router_meta = `
const router = createRouter([
  { path: '/', component: () => HomePage() },
  { path: '/admin', component: () => AdminPage(), meta: { auth: true } },
  { path: '/login', component: () => LoginPage() },
]);

const stop = router.beforeEach((to) => {
  const m = router.resolve(to);
  if (m.route?.meta?.auth) return '/login';
});

// resolve() returns:
// {
//   matched: boolean,
//   params: Record<string, string>,
//   route: RouteRecord | undefined // includes route.meta when matched
// }
`.trim();

S.router_scroll = `
const router = createRouter(routes, {
  scrollBehavior(to, from, saved) {
    // back/forward: restore previous position
    if (saved) return saved;

    // regular navigate/replace: start at top
    return { left: 0, top: 0 };
  },
});

// Router stores positions in history.state automatically.
// Default behavior (without callback):
// - navigate/replace => scroll to top
// - back/forward => restore saved position when available
`.trim();

S.router_mode = `
const router = createRouter(routes, {
  mode: 'hash', // default is 'history'
});

// URL examples in hash mode:
// #/
// #/users/42
// #/search?q=nix

// Router listens to "hashchange" in this mode.
`.trim();

S.router_nested = `
createRouter([
  {
    path: '/dashboard',
    component: () => DashboardLayout(),
    children: [
      { path: '/overview',  component: () => OverviewPage()  },
      { path: '/analytics', component: () => AnalyticsPage() },
      { path: '/settings',  component: () => SettingsPage()  },
    ],
  },
]);

function DashboardLayout(): NixTemplate {
  return html\`
    <div class="dashboard">
      <aside class="sidebar">
        \${new Link('/dashboard/overview',  'Overview')}
        \${new Link('/dashboard/analytics', 'Analytics')}
        \${new Link('/dashboard/settings',  'Settings')}
      </aside>
      <main class="content">
        \${new RouterView(1)}
      </main>
    </div>
  \`;
}`.trim();

S.forms_create = `
import { createForm, required, email, minLength, max } from '@deijose/nix-js';

function RegisterForm(): NixTemplate {
  const form = createForm(
    { name: '', email: '', password: '', age: 0 },
    {
      validators: {
        name:     [required(), minLength(2, 'At least 2 characters')],
        email:    [required(), email('Invalid email address')],
        password: [required(), minLength(8, 'At least 8 characters')],
        age:      [required(), max(120, 'Invalid age')],
      },
      validateOn: 'blur',
    }
  );

  const onSubmit = async (values: typeof form.values.value) => {
    await api.register(values);
    router.navigate('/dashboard');
  };

  return html\`
    <form @submit=\${form.handleSubmit(onSubmit)}>
      <div class="field">
        <label>Name</label>
        <input
          value=\${() => form.fields.name.value.value}
          @input=\${form.fields.name.onInput}
          @blur=\${form.fields.name.onBlur}
        />
        \${() => form.fields.name.error.value
          ? html\`<span class="err">\${form.fields.name.error.value}</span>\`
          : null}
      </div>

      <button type="submit" disabled=\${() => form.isSubmitting.value}>
        \${() => form.isSubmitting.value ? 'Creating account…' : 'Register'}
      </button>

      <p>Attempts: \${() => form.submitCount.value}</p>
    </form>
  \`;
}`.trim();

S.forms_nested = `
import { createForm, required } from '@deijose/nix-js';

function ShippingForm(): NixTemplate {
  const form = createForm(
    {
      fullName: '',
      address: {
        city: '',
        zip: '',
      },
    },
    {
      validators: {
        fullName: [required()],
        'address.city': [required('City is required')],
      },
    }
  );

  return html\`
    <form @submit=\${form.handleSubmit(async (values) => {
      await api.saveAddress(values);
    })}>
      <input
        placeholder="City"
        value=\${() => String(form.fields['address.city'].value.value ?? '')}
        @input=\${form.fields['address.city'].onInput}
        @blur=\${form.fields['address.city'].onBlur}
      />

      \${() => form.fields['address.city'].error.value
        ? html\`<span class="err">\${form.fields['address.city'].error.value}</span>\`
        : null}

      <button type="button" @click=\${() => {
        form.setErrors({ 'address.city': 'City is required' });
      }}>
        Inject server error
      </button>

      <pre>\${() => JSON.stringify(form.values.value, null, 2)}</pre>
    </form>
  \`;
}`.trim();

S.forms_cross_field = `
import { createForm, required } from '@deijose/nix-js';

function PasswordForm(): NixTemplate {
  const form = createForm(
    { pass: '', confirm: '' },
    {
      validateOn: 'input',
      validators: {
        pass: [required()],
        confirm: [
          required(),
          (value, values) => value !== values?.pass ? 'Must match' : null,
        ],
      },
    }
  );

  return html\`
    <form>
      <input type="password"
        placeholder="Password"
        value=\${() => String(form.fields.pass.value.value ?? '')}
        @input=\${form.fields.pass.onInput}
        @blur=\${form.fields.pass.onBlur}
      />

      <input type="password"
        placeholder="Confirm password"
        value=\${() => String(form.fields.confirm.value.value ?? '')}
        @input=\${form.fields.confirm.onInput}
        @blur=\${form.fields.confirm.onBlur}
      />

      \${() => form.fields.confirm.error.value
        ? html\`<span class="err">\${form.fields.confirm.error.value}</span>\`
        : null}
    </form>
  \`;
}`.trim();

S.forms_custom = `
function PasswordForm(): NixTemplate {
  const noSpaces  = (v: string) => /\s/.test(v) ? 'No spaces allowed' : null;
  const hasUpper  = (v: string) => /[A-Z]/.test(v) ? null : 'Must include an uppercase letter';
  const hasNumber = (v: string) => /\d/.test(v)    ? null : 'Must include a number';

  const password = nixField('', [required(), minLength(8), noSpaces, hasUpper, hasNumber], 'input');
  const confirm  = nixField('', [
    required(),
    (v: string) => v === password.value.peek() ? null : 'Passwords must match',
  ], 'blur');

  const strength = computed(() => {
    const p = password.value.value;
    return [p.length >= 8, /[A-Z]/.test(p), /\d/.test(p), /\W/.test(p)].filter(Boolean).length;
  });

  return html\`
    <div>
      <input type="password"
        value=\${() => password.value.value}
        @input=\${password.onInput}
        @blur=\${password.onBlur} />

      <div class="strength-bar">
        \${[1,2,3,4].map(i => html\`
          <div class=\${() => strength.value >= i ? 'bar filled' : 'bar'}></div>
        \`)}
      </div>

      \${() => password.error.value
        ? html\`<p class="err">\${password.error.value}</p>\` : null}
    </div>
  \`;
}`.trim();

S.forms_zod = `
import { z } from 'zod';

const RegisterSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
  email:    z.string().email(),
  password: z.string().min(8),
  age:      z.number().int().min(18).max(120),
});

function RegisterForm(): NixTemplate {
  const form = createForm(
    { username: '', email: '', password: '', age: 0 },
    {
      validate(values) {
        const result = RegisterSchema.safeParse(values);
        if (result.success) return null;

        const flat = result.error.flatten().fieldErrors;
        return Object.fromEntries(
          Object.entries(flat).map(([k, v]) => [k, v?.[0] ?? null])
        );
      },
    }
  );

  return html\`
    <form @submit=\${form.handleSubmit(async values => {
      await api.register(values);
    })}>
      <!-- fields here -->
    </form>
  \`;
}`.trim();

S.forms_array = `
function GuestListForm(): NixTemplate {
  const guestList = nixFieldArray(
    [{ name: '', email: '' }],
    { name: [required(), minLength(2)], email: [required(), email()] }
  );

  return html\`
    <div>
      \${() => repeat(
        guestList.fields.value,
        (_, i) => i,
        (group, i) => html\`
          <div class="guest-row">
            <input
              placeholder="Name"
              value=\${() => group.name.value.value}
              @input=\${group.name.onInput}
              @blur=\${group.name.onBlur}
            />
            <input
              placeholder="Email"
              value=\${() => group.email.value.value}
              @input=\${group.email.onInput}
            />
            <button type="button" @click=\${() => guestList.remove(i)}>Remove</button>
          </div>
        \`
      )}

      <button type="button" @click=\${() => guestList.append({ name: '', email: '' })}>
        + Add guest
      </button>
      <p>Total guests: \${() => guestList.length.value}</p>
    </div>
  \`;
}`.trim();

S.suspend_fn = `
function ProductsPage(): NixTemplate {
  const refresh = signal(0);

  return html\`
    <div>
      \${suspend(
        () => fetch('/api/products').then(r => r.json()),
        (products: Product[]) => html\`
          <ul>
            \${products.map(p => html\`<li>\${p.name} — $\${p.price}</li>\`)}
          </ul>
        \`,
        {
          fallback:       html\`<div class="spinner">Loading products…</div>\`,
          errorFallback:  err => html\`<p class="error">Failed: \${String(err)}</p>\`,
          invalidate:     refresh,
          cacheKey:       'products',
          staleTime:      30_000,
          resetOnRefresh: false,
        }
      )}

      <button @click=\${async () => {
        await api.syncProducts();
        refresh.update(n => n + 1);
      }}>Sync</button>
    </div>
  \`;
}`.trim();



S.di_fn = `
import { createInjectionKey, provide, inject } from '@deijose/nix-js';

export const THEME_KEY  = createInjectionKey<Signal<'dark' | 'light'>>('theme');
export const LOCALE_KEY = createInjectionKey<Signal<string>>('locale');
export const AUTH_KEY   = createInjectionKey<AuthService>('auth');

class AppRoot extends NixComponent {
  private theme  = signal<'dark' | 'light'>('dark');
  private locale = signal('en');
  private auth   = new AuthService();

  onInit() {
    provide(THEME_KEY,  this.theme);
    provide(LOCALE_KEY, this.locale);
    provide(AUTH_KEY,   this.auth);
  }

  render() { return html\`\${new AppRouter()}\`; }
}

class ThemedCard extends NixComponent {
  private theme = inject(THEME_KEY);
  private auth  = inject(AUTH_KEY);

  render() {
    return html\`
      <div class=\${() => \`card card--\${this.theme?.value ?? 'dark'}\`}>
        <p>User: \${() => this.auth?.currentUser?.name ?? 'Guest'}</p>
        \${this.children}
      </div>
    \`;
  }
}`.trim();

S.portal_fn = `
import { portal, createPortalOutlet, portalOutlet } from '@deijose/nix-js';

function ConfirmDialog(): NixTemplate {
  const open    = signal(false);
  const loading = signal(false);

  const confirm = async () => {
    loading.value = true;
    await api.deleteItem();
    open.value    = false;
    loading.value = false;
  };

  return html\`
    <button @click=\${() => open.value = true}>Delete item</button>

    \${() => open.value
      ? portal(html\`
          <div class="overlay" @click.self=\${() => open.value = false}>
            <div class="dialog">
              <h2>Confirm deletion</h2>
              <p>This action cannot be undone.</p>
              <div class="dialog-actions">
                <button @click=\${() => open.value = false}>Cancel</button>
                <button class="btn-danger" @click=\${confirm} disabled=\${() => loading.value}>
                  \${() => loading.value ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        \`)
      : null
    }
  \`;
}`.trim();

S.transition_fn = `
function FadeToggle(): NixTemplate {
  const visible = signal(true);

  return html\`
    <div>
      <button @click=\${() => visible.update(v => !v)}>Toggle</button>

      \${transition(
        () => visible.value
          ? html\`<div class="content">Hello, world!</div>\`
          : null,
        { name: 'fade', appear: true }
      )}
    </div>
  \`;
}

// Required CSS:
// .fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
// .fade-enter-from,  .fade-leave-to      { opacity: 0; }`.trim();

S.errors_fn = `
import { createErrorBoundary } from '@deijose/nix-js';

function SafeDashboard(): NixTemplate {
  return html\`
    \${createErrorBoundary(
      new DataWidget(),
      err => html\`
        <div class="error-card">
          <h3>Widget unavailable</h3>
          <pre>\${err instanceof Error ? err.message : String(err)}</pre>
          <button @click=\${() => location.reload()}>Retry</button>
        </div>
      \`
    )}
  \`;
}

class DataWidget extends NixComponent {
  private data = signal(null);

  onInit() {
    if (!featureFlag.enabled) throw new Error('Feature not available');
  }

  render() {
    return html\`<div>\${() => this.data.value}</div>\`;
  }

  onMount() {
    effect(() => {
      if (this.data.value === 'bad') throw new Error('Invalid data');
    });
  }
}`.trim();

// ── Aliases & missing snippets used by pages ──────────────────

S.effect_fn = `
function LogTracker() {
  const count = signal(0);
  const label = signal('anonymous');

  const dispose = effect(() => {
    console.log(\`[\${label.value}] count = \${count.value}\`);
    return () => console.log('cleaning up');
  });

  dispose();

  return html\`
    <button @click=\${() => count.value++}>Increment</button>
  \`;
}`.trim();

S.tpl_basic = `
function Greeting(): NixTemplate {
  const name = signal('World');

  return html\`
    <div>
      <h1>Nix.js</h1>
      <p>Hello, \${() => name.value}!</p>

      <input
        value=\${() => name.value}
        @input=\${(e: Event) => name.value = (e.target as HTMLInputElement).value}
        placeholder="Your name"
      />
    </div>
  \`;
}`.trim();

S.tpl_attrs = S.html_bindings;

S.tpl_events = S.html_events;

S.tpl_repeat = S.html_repeat;

S.tpl_ref = `
import { ref } from '@deijose/nix-js';

function AutoFocusInput(): NixTemplate {
  const inputRef = ref<HTMLInputElement>();

  return html\`
    <input ref=\${inputRef} />
  \`;
}

class Canvas extends NixComponent {
  private canvasRef = ref<HTMLCanvasElement>();

  render() {
    return html\`<canvas ref=\${this.canvasRef} width="400" height="300"></canvas>\`;
  }

  onMount() {
    const ctx = this.canvasRef.el?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#a78bfa';
      ctx.fillRect(10, 10, 100, 80);
    }
  }
}`.trim();

S.comp_mount = `
import { mount, html, signal } from '@deijose/nix-js';

function App(): NixTemplate {
  const count = signal(0);
  return html\`
    <div>
      <h1>Count: \${() => count.value}</h1>
      <button @click=\${() => count.value++}>+1</button>
    </div>
  \`;
}

const handle = mount(App(), '#app');
handle.unmount();`.trim();

S.form_field = S.forms_custom;
S.form_create = S.forms_create;
S.form_nested = S.forms_nested;
S.form_cross_field = S.forms_cross_field;
S.form_zod = S.forms_zod;
S.form_array = S.forms_array;

S.router_view = `
function App(): NixTemplate {
  return html\`
    <div class="app">
      <nav>
        \${new Link('/',      'Home')}
        \${new Link('/about', 'About')}
        \${new Link('/users', 'Users')}
      </nav>
      <main>
        \${new RouterView()}
      </main>
    </div>
  \`;
}

// Link adds "active" class automatically when route matches`.trim();

S.async_suspend = S.suspend_fn;
// createQuery moved to @deijose/nix-query — see Async & Lazy page

S.async_invalidate = `
function ProductList(): NixTemplate {
  const refresh = signal(0);

  return html\`
    <div>
      \${suspend(
        () => fetch('/api/products').then(r => r.json()),
        (products: Product[]) => html\`
          <ul>
            \${products.map(p => html\`<li>\${p.name} — $\${p.price}</li>\`)}
          </ul>
        \`,
        {
          invalidate: refresh,       // bump to refetch
          cacheKey:   'products',    // reuse between mounts
          staleTime:  30_000,        // fresh for 30s
          resetOnRefresh: false,     // keep old UI while refetching
          fallback: html\`<p>Loading…</p>\`,
          errorFallback: err => html\`<p class="error">\${String(err)}</p>\`,
        }
      )}

      <button @click=\${() => refresh.update(n => n + 1)}>
        ↻ Refresh
      </button>
    </div>
  \`;
}`.trim();

S.async_lazy = `
import { lazy } from '@deijose/nix-js';

const AdminPage = lazy(
  () => import('./pages/AdminPage'),
  html\`<div class="spinner">Loading…</div>\`
);

// Use inside routes:
createRouter([
  { path: '/admin', component: AdminPage },
]);

// Or inline:
function App(): NixTemplate {
  return html\`
    <div>\${AdminPage()}</div>
  \`;
}`.trim();

S.show_fn = `
function TogglePanel(): NixTemplate {
  const open    = signal(false);
  const loading = signal(false);

  return html\`
    </button>

    <div show=\${() => open.value} class="panel">
      <input placeholder="Your text is saved when hidden!" />
      <p>This panel preserves all state on toggle.</p>
    </div>

    <!-- hide is the inverse of show -->
    <form hide=\${() => loading.value}>
      <input name="email" />
      <button type="submit">Submit</button>
    </form>
    <div show=\${() => loading.value}>
      ⏳ Submitting, please wait…
    </div>
  \`;
}`.trim();

S.store_custom_plugin = `
import type { NixPlugin } from '@deijose/nix-js';

// A plugin is just a function: (store) => cleanup | void
// Use watch(), computed(), or wrap methods — no special hooks.

function analyticsPlugin<T extends Record<string, unknown>>(
  eventName: string,
): NixPlugin<T> {
  return (store) => {
    // watch() fires once per flush, regardless of how many signals changed
    return store.$watch((next, prev) => {
      if (!prev) return; // skip initial fire

      const changed = Object.keys(next).filter(
        k => !Object.is(next[k as keyof T], prev[k as keyof T])
      );
      analytics.track(eventName, { changed, state: next });
    });
    // returning the stop fn = cleanup on store.$dispose()
  };
}

// Usage — drop it in plugins array, done
const userStore = createStore(
  { name: '', email: '', plan: 'free' },
  {
    name: 'user',
    plugins: [
      analyticsPlugin('user_state_change'),
      // Example of native v2.5.3 persistence with debounce and custom adapter
      persistPlugin('nix_user', {
        debounce: 300,
        storage: sessionStorage, // or any item with getItem/setItem
      })
    ],
  }
);
`.trim();

S.store_plugin_intercept = `
import type { NixPlugin } from '@deijose/nix-js';

// Plugins can also wrap $patch / $reset to intercept mutations
function readonlyPlugin<T extends Record<string, unknown>>(): NixPlugin<T> {
  return (store) => {
    const original = store.$patch.bind(store);

    store.$patch = (partial) => {
      console.warn('[store] $patch called with', partial);
      original(partial);
    };

    // Cleanup: restore original method on dispose
    return () => {
      store.$patch = original;
    };
  };
}
`.trim();

S.auth_quick_start = `
import { createAuth, jwtDriver, localStorageAdapter, createPolicy } from "@deijose/nix-js-auth";

const auth = createAuth({
  driver: jwtDriver({
    loginUrl: "/api/login",
    refreshUrl: "/api/refresh",
  }),
  storage: localStorageAdapter({ key: "app:session" }),
  identity: {
    roles: "roles",
    permissions: "permissions",
  },
});

auth.attachPolicy(
  createPolicy((user, action, context) => {
    if (!user) return false;
    if (action === "post:edit") {
      return user.permissions?.includes("post:edit") || user.id === context.authorId;
    }
    return false;
  }),
);

await auth.login({ email: "deiver@example.com", password: "secret" });

console.log(auth.isAuthenticated.value); // true
console.log(auth.can("post:edit", { authorId: "42" }).value); // true | false
`.trim();

S.auth_create = `
const auth = createAuth({
  driver: jwtDriver({ loginUrl: "/api/login", refreshUrl: "/api/refresh" }),
  storage: localStorageAdapter({ key: "app:session" }),
  autoRefresh: true,
  seed: serverSession,
  identity: { roles: "roles", permissions: "permissions", scopes: "scopes" },
  onChange: (session) => console.log("session changed", session),
  onError: (err, event) => console.error(event, err),
});
`.trim();

S.auth_identity = `
const auth = createAuth({
  driver,
  identity: {
    roles: "myRoles",
    permissions: (user) => user.claims,
    scopes: (user) => user.oauthScopes,
  },
});
`.trim();

S.auth_jwt_driver = `
import { jwtDriver } from "@deijose/nix-js-auth";

const auth = createAuth({
  driver: jwtDriver({
    loginUrl: "/api/login",
    logoutUrl: "/api/logout",
    refreshUrl: "/api/refresh",
    headers: { "x-api-version": "v2" },
  }),
});
`.trim();

S.auth_session_cookie_driver = `
import { sessionCookieDriver, cookieAdapter } from "@deijose/nix-js-auth";

const auth = createAuth({
  driver: sessionCookieDriver({
    loginUrl: "/api/login",
    logoutUrl: "/api/logout",
    sessionUrl: "/api/session",
  }),
  storage: cookieAdapter({ key: "app:session" }),
});
`.trim();

S.auth_mock_driver = `
import { mockDriver } from "@deijose/nix-js-auth";

const auth = createAuth({
  driver: mockDriver({
    name: "fake",
    login: async (creds) => ({ user: { id: "1", roles: ["admin"] }, token: "abc" }),
    toUser: (session) => session.user,
    getToken: (session) => session.token,
  }),
});
`.trim();

S.auth_custom_driver = `
const legacyDriver = {
  name: "legacy",
  async login(credentials) {
    const res = await fetch("/legacy/auth", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  async logout(session) {
    await fetch("/legacy/auth", {
      headers: { "X-Legacy-Token": session.token },
    });
  },
  toUser(session) { return session.employee; },
  getToken(session) { return session.token; },
  getExpiry(session) { return session.expiresAt; },
};

const auth = createAuth({ driver: legacyDriver });
`.trim();

S.auth_credentials_provider = `
import { credentialsProvider } from "@deijose/nix-js-auth";

const auth = createAuth({
  providers: {
    credentials: credentialsProvider({
      login: async (creds) => {
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify(creds),
        });
        return res.json();
      },
    }),
  },
  defaultProvider: "credentials",
});

await auth.login("credentials", { email, password });
`.trim();

S.auth_apikey_provider = `
import { apiKeyProvider } from "@deijose/nix-js-auth";

const auth = createAuth({
  providers: {
    apiKey: apiKeyProvider({
      validate: async (key) => {
        const res = await fetch("/api/validate-key", {
          headers: { "x-api-key": key },
        });
        return res.json();
      },
    }),
  },
  defaultProvider: "apiKey",
});

await auth.login("apiKey", { key: "secret" });
`.trim();

S.auth_oidc_provider = `
import { oidcProvider } from "@deijose/nix-js-auth";

const provider = oidcProvider({
  authority: "https://idp.example.com",
  clientId: "client-id",
  redirectUri: "https://app.example.com/callback",
  postLogoutRedirectUri: "https://app.example.com",
  scope: "openid profile email",
});

const auth = createAuth({ driver: provider });

// 1. Start login
const loginUrl = await provider.buildLoginUrl();
window.location.href = loginUrl.url;

// 2. After callback
const params = new URLSearchParams(window.location.search);
const session = await auth.login({
  code: params.get("code")!,
  codeVerifier: savedCodeVerifier,
  state: params.get("state")!,
  nonce: savedNonce,
});

// 3. Logout redirect
const logoutUrl = await provider.buildLogoutUrl(session.idToken);
window.location.href = logoutUrl;
`.trim();

S.auth_storage = `
import {
  localStorageAdapter,
  sessionStorageAdapter,
  cookieAdapter,
  memoryAdapter,
} from "@deijose/nix-js-auth";

const auth = createAuth({
  driver,
  storage: localStorageAdapter({ key: "app:session" }),
});

// Cookie adapter with options
const auth2 = createAuth({
  driver,
  storage: cookieAdapter({ key: "app:session", days: 7, sameSite: "lax" }),
});
`.trim();

S.auth_manager = `
import { createAuthManager, jwtDriver, localStorageAdapter } from "@deijose/nix-js-auth";

const manager = createAuthManager();

const customer = manager.create("customer", {
  driver: jwtDriver({ loginUrl: "/api/customer/login" }),
  storage: localStorageAdapter({ key: "customer:session" }),
});

const admin = manager.create("admin", {
  driver: jwtDriver({ loginUrl: "/api/admin/login" }),
  storage: localStorageAdapter({ key: "admin:session" }),
});

console.log(manager.list()); // ["customer", "admin"]
console.log(manager.get("admin")); // AuthInstance

manager.remove("customer");
`.trim();

S.auth_ssr_seed = `
const auth = createAuth({
  driver,
  seed: serverSession,
});

// Or with a function
const auth2 = createAuth({
  driver,
  seed: () => readSessionFromRequest(request),
});
`.trim();

S.auth_policy = `
import { createPolicy } from "@deijose/nix-js-auth";

auth.attachPolicy(
  createPolicy((user, action, context, session) => {
    if (!user) return false;
    if (action === "admin:dashboard") {
      return user.isAdmin === true;
    }
    if (action === "post:edit") {
      return user.permissions?.includes("post:edit") || user.id === context.authorId;
    }
    return false;
  }),
);

// Reactive check
const allowed = auth.can("post:edit", { id: "42" }).value;
const decision = auth.authorize("post:edit", { id: "42" }).value; // { allow, redirect? }
`.trim();

S.auth_policy_helpers = `
import { hasRole, hasPermission, hasScope, isOwner, all, any, not } from "@deijose/nix-js-auth";

auth.attachPolicy(
  createPolicy((user, action, context) => {
    if (!user) return false;

    if (action === "admin:dashboard") {
      return hasRole("admin")(user, context);
    }
    if (action === "post:edit") {
      return any(
        hasPermission("post:edit"),
        isOwner("post", context.id),
      )(user, context);
    }
    if (action === "post:delete") {
      return all(
        hasRole("admin"),
        not(isOwner("post", context.id)),
      )(user, context);
    }
    return false;
  }),
);
`.trim();

S.auth_rbac_policy = `
import { rbacPolicy } from "@deijose/nix-js-auth";

auth.attachPolicy(
  rbacPolicy({
    resolveRoles: (user) => user.roles,
    resolvePermissions: (user) => user.permissions,
  }),
);

auth.can("role:admin").value;
auth.can("permission:post:edit").value;

// Tenant-aware
auth.attachPolicy(
  rbacPolicy({
    resolveRoles: (user, tenant) => (tenant ? user.rolesByTenant[tenant] : user.roles),
    resolvePermissions: (user, tenant) => (tenant ? user.permissionsByTenant[tenant] : user.permissions),
  }),
);

auth.can("role:admin", { tenant: "acme" }).value;
`.trim();

S.auth_router = `
import { createRouter } from "@deijose/nix-js";
import { authRouterPlugin, requireAuth } from "@deijose/nix-js-auth";

const router = createRouter([
  { path: "/login", component: LoginPage, meta: { auth: "public" } },
  { path: "/admin", component: AdminPage, meta: { auth: { can: "admin:dashboard" } } },
  { path: "/post/:id/edit", component: EditPost, meta: { auth: { can: "post:edit" } } },
  { path: "/public", component: PublicPage, meta: { auth: false } },
  { path: "/profile", component: ProfilePage, meta: { auth: "optional" } },
]);

router.beforeEach(
  authRouterPlugin(auth, router, {
    public: ["/login", "/register"],
    defaultRedirect: "/login",
    fallbackRedirect: "/unauthorized",
  }),
);
`.trim();

S.auth_router_meta = `
const router = createRouter([
  {
    path: "/post/:id/edit",
    component: EditPost,
    meta: {
      auth: {
        can: "post:edit",
        context: () => ({ id: router.params.value.id }),
      },
    },
  },
]);
`.trim();

S.auth_router_guards = `
import { requireAuth, requireRole, requirePermission, requireProvider, requirePolicy } from "@deijose/nix-js-auth";

router.beforeEach(requireAuth(auth, "/login"));
router.beforeEach(requireRole(auth, "admin", "/unauthorized"));
router.beforeEach(requirePermission(auth, "post:edit", "/unauthorized"));
router.beforeEach(requireProvider(auth, "apiKey", "/login"));
router.beforeEach(requirePolicy(auth, (to, from) => auth.can("custom:action", { path: to }).value));
`.trim();

S.auth_inject = `
import { provide } from "@deijose/nix-js";
import { AuthKey, useAuth } from "@deijose/nix-js-auth";

provide(AuthKey, auth);

// In a descendant component:
const auth = useAuth();
if (auth) {
  console.log(auth.isAuthenticated.value);
}
`.trim();

S.auth_multi_provider = `
const auth = createAuth({
  providers: {
    credentials: credentialsProvider({
      login: async (creds) => {
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify(creds),
        });
        return res.json();
      },
    }),
    apiKey: mockDriver({
      name: "apiKey",
      login: async (creds) => ({ user: { id: "2" }, token: creds.key }),
    }),
  },
  defaultProvider: "credentials",
  storage: localStorageAdapter({ key: "app:session" }),
});

await auth.login("credentials", { email, password });
await auth.login("apiKey", { key: "secret" });

console.log(auth.activeProvider.value); // "apiKey"
`.trim();

S.auth_auto_refresh = `
const auth = createAuth({
  driver: jwtDriver({
    loginUrl: "/api/login",
    refreshUrl: "/api/refresh",
  }),
  autoRefresh: true, // default: 60 seconds before expiry
});

// Custom schedule
const auth2 = createAuth({
  driver,
  autoRefresh: {
    beforeExpirySeconds: 120,
    schedule(session, refresh) {
      const d = driver.getExpiry?.(session);
      if (!d) return () => {};
      const delay = Math.max(0, d - Date.now() - 120_000);
      const timer = setTimeout(() => void refresh(), delay);
      return () => clearTimeout(timer);
    },
  },
});
`.trim();

S.auth_nix_query = `
import { authCommand, createLoginCommand, createLogoutCommand, authHeaders } from "@deijose/nix-js-auth/command";

const savePost = authCommand(auth, "post/save", async (payload, ctx) => {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      ...authHeaders(auth),
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: ctx.signal,
  });
  return res.json();
});

const login = createLoginCommand(auth, "auth/login");
const logout = createLogoutCommand(auth, "auth/logout");
`.trim();

S.auth_testing = `
import { describe, it, expect } from "vitest";
import { createAuth, mockDriver } from "@deijose/nix-js-auth";

describe("auth", () => {
  it("logs in", async () => {
    const auth = createAuth({
      driver: mockDriver({
        login: () => Promise.resolve({ user: { id: "1", roles: ["admin"] }, token: "abc" }),
        toUser: (s) => s.user,
        getToken: (s) => s.token,
      }),
    });

    await auth.login({ email: "test@example.com", password: "secret" });

    expect(auth.isAuthenticated.value).toBe(true);
    expect(auth.user.value).toEqual({ id: "1", roles: ["admin"] });
    expect(auth.token.value).toBe("abc");
  });
});
`.trim();

S.auth_typescript = `
interface MySession {
  user: MyUser;
  token: string;
  expiresAt: number;
}

interface MyUser {
  id: string;
  roles: string[];
  permissions: string[];
}

interface MyCredentials {
  email: string;
  password: string;
}

const auth = createAuth<MySession, MyUser, MyCredentials>({
  driver: myDriver,
});
`.trim();

S.auth_custom_storage = `
import type { AuthStorage } from "@deijose/nix-js-auth";

// A storage adapter only needs three methods: get, set, remove
function indexedDBAdapter<Session>(dbName: string, storeName: string): AuthStorage<Session> {
  const db = openDB(dbName, 1, {
    upgrade(db) { db.createObjectStore(storeName); },
  });

  return {
    async get() {
      const database = await db;
      return database.get(storeName, "session") as Session | null;
    },
    async set(session) {
      const database = await db;
      const tx = database.transaction(storeName, "readwrite");
      if (session === null) {
        tx.objectStore(storeName).delete("session");
      } else {
        tx.objectStore(storeName).put(session, "session");
      }
      await tx.done;
    },
    async remove() {
      const database = await db;
      const tx = database.transaction(storeName, "readwrite");
      tx.objectStore(storeName).delete("session");
      await tx.done;
    },
  };
}

const auth = createAuth({
  driver,
  storage: indexedDBAdapter("my-app", "auth"),
});
`.trim();

S.auth_capacitor_storage = `
import { Preferences } from "@capacitor/preferences";
import type { AuthStorage } from "@deijose/nix-js-auth";

function capacitorStorageAdapter<Session>(key: string): AuthStorage<Session> {
  return {
    async get() {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) as Session : null;
    },
    async set(session) {
      if (session === null) {
        await Preferences.remove({ key });
      } else {
        await Preferences.set({ key, value: JSON.stringify(session) });
      }
    },
    async remove() {
      await Preferences.remove({ key });
    },
  };
}

const auth = createAuth({
  driver,
  storage: capacitorStorageAdapter("app:session"),
});
`.trim();

S.auth_custom_provider_guide = `
import type { AuthDriver } from "@deijose/nix-js-auth";

// A provider IS a driver with a name. Implement AuthDriver from scratch
// for any backend protocol: Firebase Auth, Supabase Auth, AWS Cognito, etc.

interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  user: { id: string; email: string };
  expires_at: number;
}

interface SupabaseCredentials {
  email: string;
  password: string;
}

function supabaseAuthDriver(
  supabaseUrl: string,
  supabaseKey: string,
): AuthDriver<SupabaseSession, SupabaseSession["user"], SupabaseCredentials> {
  const api = (path: string, body: unknown) =>
    fetch(\`\${supabaseUrl}/auth/v1\${path}\`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

  return {
    name: "supabase",

    async login(credentials) {
      const res = await api("/token?grant_type=password", {
        email: credentials.email,
        password: credentials.password,
      });
      if (!res.ok) throw new Error("Supabase login failed");
      return res.json();
    },

    async logout(session) {
      await fetch(\`\${supabaseUrl}/auth/v1/logout\`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "authorization": \`Bearer \${session.access_token}\`,
        },
      });
    },

    async refresh(session) {
      const res = await api("/token?grant_type=refresh_token", {
        refresh_token: session.refresh_token,
      });
      if (!res.ok) throw new Error("Supabase refresh failed");
      return res.json();
    },

    toUser(session) { return session.user; },
    getToken(session) { return session.access_token; },
    getExpiry(session) { return session.expires_at * 1000; },
  };
}

const auth = createAuth({
  driver: supabaseAuthDriver("https://xyz.supabase.co", "public-anon-key"),
});
`.trim();

S.auth_hydrate_advanced = `
// hydrate() runs when the auth instance recovers a session from storage.
// Use it to validate tokens against your backend on app startup.

const driver = {
  name: "jwt-validated",

  async login(credentials) { /* ... */ },
  async logout(session) { /* ... */ },
  async refresh(session) { /* ... */ },

  async hydrate(raw) {
    if (!raw || !(raw as any).token) return null;
    const session = raw as MySession;

    // Validate the stored token against the server
    const res = await fetch("/api/session/validate", {
      headers: { Authorization: \`Bearer \${session.token}\` },
    });

    if (!res.ok) {
      console.warn("[auth] Stored session is invalid, clearing.");
      return null;
    }

    // Optionally merge server-side updates into the session
    const serverData = await res.json();
    return { ...session, ...serverData };
  },

  toUser(session) { return session.user; },
  getToken(session) { return session.token; },
  getExpiry(session) { return session.expiresAt; },
};
`.trim();

S.auth_driver_isvalid = `
// isValid() is a lightweight synchronous check used during hydration
// BEFORE hydrate() is called. Return false to skip hydrate entirely.

const driver = {
  name: "jwt",

  // ... login, logout, refresh ...

  isValid(session) {
    if (!session.expiresAt) return true;
    // Already expired? Don't even try to hydrate
    return session.expiresAt > Date.now();
  },

  async hydrate(raw) {
    // Only called if isValid() returned true (or isValid is undefined)
    // Re-fetch user data from the server
    const res = await fetch("/api/me", {
      headers: { Authorization: \`Bearer \${(raw as any).token}\` },
    });
    return res.ok ? raw as Session : null;
  },
};
`.trim();

S.auth_custom_meta_interpreter = `
// Replace the default meta.auth interpreter for full control.

import { createRouter } from "@deijose/nix-js";
import { authRouterPlugin } from "@deijose/nix-js-auth";

const router = createRouter([
  { path: "/", component: HomePage, meta: { auth: "public" } },
  { path: "/admin", component: AdminPage, meta: { auth: { tier: "pro" } } },
  { path: "/super", component: SuperPage, meta: { auth: { tier: "enterprise" } } },
]);

router.beforeEach(
  authRouterPlugin(auth, router, {
    public: ["/"],
    defaultRedirect: "/login",
    fallbackRedirect: "/upgrade",
    async interpretMeta(meta, auth, to, from) {
      if (!meta || meta === "public") return undefined;

      // Custom rule: check subscription tier
      if (meta && typeof meta === "object" && "tier" in meta) {
        const user = auth.user.value as any;
        const userTier = user?.subscriptionTier ?? "free";
        const required = (meta as any).tier;
        const tiers = ["free", "pro", "enterprise"];
        const allowed = tiers.indexOf(userTier) >= tiers.indexOf(required);
        return allowed ? undefined : "/upgrade";
      }

      // Fallback to default behavior
      return undefined;
    },
  }),
);
`.trim();

S.auth_error_handling = `
// Drivers should throw descriptive errors. The auth instance catches them
// and exposes them via auth.error plus onError callbacks.

const driver = {
  name: "my-api",
  async login(credentials) {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (res.status === 401) {
      throw new Error("INVALID_CREDENTIALS");
    }
    if (res.status === 429) {
      throw new Error("RATE_LIMITED");
    }
    if (!res.ok) {
      throw new Error(\`LOGIN_FAILED:\${res.status}\`);
    }

    return res.json();
  },

  // ... other methods
};

const auth = createAuth({
  driver,
  onError(err, event) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "INVALID_CREDENTIALS") {
      showToast("Email or password is incorrect.");
    } else if (message === "RATE_LIMITED") {
      showToast("Too many attempts. Please wait a moment.");
    } else {
      console.error(\`[auth] \${event} failed:\`, err);
    }
  },
});
`.trim();

S.auth_backend_integration = `
// Full example: custom driver for a backend that uses a non-standard auth flow.
// This pattern applies to Firebase, AWS Cognito, Azure AD, or any internal API.

interface InternalSession {
  sessionId: string;
  employee: { id: string; dept: string; clearance: string[] };
  issuedAt: number;
  ttl: number;
}

interface InternalCredentials {
  badgeId: string;
  pin: string;
}

function internalAuthDriver(baseUrl: string) {
  return {
    name: "internal",

    async login(credentials: InternalCredentials): Promise<InternalSession> {
      const res = await fetch(\`\${baseUrl}/auth/badge\`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error(\`Badge auth failed: \${res.status}\`);
      return res.json();
    },

    async logout(session: InternalSession): Promise<void> {
      await fetch(\`\${baseUrl}/auth/revoke\`, {
        method: "POST",
        headers: { "x-session-id": session.sessionId },
      });
    },

    // Optional: server-side validation on startup
    async hydrate(raw: unknown): Promise<InternalSession | null> {
      if (!raw || !(raw as InternalSession).sessionId) return null;
      const session = raw as InternalSession;
      const res = await fetch(\`\${baseUrl}/auth/validate\`, {
        headers: { "x-session-id": session.sessionId },
      });
      return res.ok ? session : null;
    },

    // Optional: refresh before TTL expires
    async refresh(session: InternalSession): Promise<InternalSession> {
      const res = await fetch(\`\${baseUrl}/auth/refresh\`, {
        method: "POST",
        headers: { "x-session-id": session.sessionId },
      });
      if (!res.ok) throw new Error("Refresh failed");
      return res.json();
    },

    toUser(session: InternalSession) { return session.employee; },
    getToken(session: InternalSession) { return session.sessionId; },
    getExpiry(session: InternalSession) { return session.issuedAt + session.ttl; },
    isValid(session: InternalSession) { return Date.now() < session.issuedAt + session.ttl; },
  };
}

const auth = createAuth({
  driver: internalAuthDriver("https://api.company.internal"),
  storage: localStorageAdapter({ key: "internal:session" }),
  autoRefresh: true,
});
`.trim();

S.auth_named_instances = `
// Using named instances without the manager — useful when you want
// direct imports without passing auth through props or DI.

// auth.ts
import { createAuth, jwtDriver, localStorageAdapter } from "@deijose/nix-js-auth";

export const userAuth = createAuth({
  driver: jwtDriver({ loginUrl: "/api/login" }),
  storage: localStorageAdapter({ key: "user:session" }),
});

export const adminAuth = createAuth({
  driver: jwtDriver({ loginUrl: "/api/admin/login" }),
  storage: localStorageAdapter({ key: "admin:session" }),
});

// Any component:
import { userAuth } from "./auth";
const isLoggedIn = userAuth.isAuthenticated.value;
`.trim();

S.auth_name_property = `
// Every instance has a readonly name for identification
const auth = createAuth({ driver, name: "customer" });
console.log(auth.name); // "customer"
`.trim();

S.auth_events = `
// AuthEvent values passed to onError:
// "login" | "logout" | "refresh" | "hydrate" | "setSession" | "clearSession"

const auth = createAuth({
  driver,
  onError(err, event) {
    // event is an AuthEvent — tells you which operation failed
    console.error(\`[auth] \${event} failed:\`, err);
  },
});
`.trim();

S.i18n_quick_start = `
import { createI18n } from "@deijose/nix-i18n";
import { html } from "@deijose/nix-js";

const i18n = createI18n({
  locale: "es",
  fallbackLocale: "en",
  messages: {
    es: { hello: "Hola {name}" },
    en: { hello: "Hello {name}" },
  },
});

function App() {
  return html\`
    <h1>\${i18n.t("hello", { name: "Deiver" })}</h1>
    <button @click=\${() => i18n.setLocale("en")}>English</button>
  \`;
}
`.trim();

S.i18n_pluralization = `
const i18n = createI18n({
  locale: "en",
  messages: {
    en: { items: "No items | One item | {count} items" },
  },
});

i18n.t("items", { count: 5 }); // "5 items"
i18n.t("items", { count: 1 }); // "One item"
i18n.t("items", { count: 0 }); // "No items"
`.trim();

S.i18n_nested_fallback = `
const i18n = createI18n({
  locale: "es",
  nestedFallback: true,
  messages: {
    es: {
      auth: { login: "Acceder" },
    },
  },
});

i18n.t("auth.login.title"); // "Acceder" — falls back to "auth.login"
`.trim();

S.i18n_namespaces = `
const i18n = createI18n({
  locale: "es",
  backend: jsonBackend({ baseUrl: "/locales", namespaces: ["common", "auth"] }),
});

// Using namespace API
const authNs = i18n.useNamespace("auth");
authNs.t("login.title"); // resolves "auth:login.title"

// Or use the key directly
i18n.t("auth:login.title");

// Load a namespace on demand
await i18n.loadNamespace("dashboard");
`.trim();

S.i18n_json_backend = `
import { jsonBackend } from "@deijose/nix-i18n/backends/json";

const i18n = createI18n({
  locale: "es",
  backend: jsonBackend({
    baseUrl: "/locales",
    namespaces: ["common", "auth"],
  }),
});

// Loads /locales/es/common.json, /locales/en/common.json, etc.
`.trim();

S.i18n_api_backend = `
import { apiBackend } from "@deijose/nix-i18n/backends/api";

const i18n = createI18n({
  locale: "es",
  backend: apiBackend({
    url: "/api/translations",
    headers: { Authorization: "Bearer ..." },
    method: "GET",
  }),
});
`.trim();

S.i18n_object_backend = `
import { objectBackend } from "@deijose/nix-i18n/backends/object";

const i18n = createI18n({
  locale: "es",
  backend: objectBackend({
    es: { hello: "Hola" },
    en: { hello: "Hello" },
  }),
});
`.trim();

S.i18n_custom_backend = `
import type { I18nBackend } from "@deijose/nix-i18n";

// A backend only needs a load() method.
// It receives locale and namespace, and returns messages.

const firestoreBackend: I18nBackend = {
  supportsNamespaces: true,
  async load(locale: string, namespace: string) {
    const snapshot = await db
      .collection("translations")
      .doc(\`\${locale}_\${namespace}\`)
      .get();
    return snapshot.exists ? snapshot.data() as Record<string, string> : {};
  },
};

const i18n = createI18n({
  locale: "es",
  backend: firestoreBackend,
  namespaces: ["common", "auth"],
});
`.trim();

S.i18n_formatters = `
i18n.d(new Date(), { dateStyle: "long" });        // "June 26, 2026"
i18n.nFormat(1234.5, { maximumFractionDigits: 2 }); // "1,234.50"
i18n.c(99.9, "USD");                              // "$99.90"
i18n.rt(-1, "day");                               // "1 day ago"
i18n.list(["a", "b", "c"], { type: "conjunction" }); // "a, b, and c"
`.trim();

S.i18n_persist_plugin = `
import { persistLocalePlugin } from "@deijose/nix-i18n/plugins/persist";

persistLocalePlugin(i18n, { key: "app-locale" });
`.trim();

S.i18n_detect_plugin = `
import { detectLocalePlugin } from "@deijose/nix-i18n/plugins/detect";

detectLocalePlugin(i18n, {
  order: ["localStorage", "navigator", "fallback"],
  storageKey: "app-locale",
  urlParam: "lang",
  pathPrefix: false,
});
`.trim();

S.i18n_router_plugin = `
import { routerLocalePlugin } from "@deijose/nix-i18n/plugins/router";

routerLocalePlugin(i18n, router, { mode: "query", param: "lang" });

// Or prefix mode:
routerLocalePlugin(i18n, router, { mode: "prefix" });
// Syncs locale with URL path like /es/page or /en/page
`.trim();

S.i18n_head_plugin = `
import { headPlugin } from "@deijose/nix-i18n/plugins/head";

headPlugin(i18n, {
  lang: true,      // updates <html lang="">
  dir: "auto",     // auto-detects RTL for ar/he/fa/ur
  meta: [
    { name: "description", content: (locale) => descriptions[locale] },
  ],
});
`.trim();

S.i18n_sync_plugin = `
import { syncLocalePlugin } from "@deijose/nix-i18n/plugins/sync";

// Syncs locale across browser tabs via BroadcastChannel
syncLocalePlugin(i18n, { channelName: "my-app-locale" });
`.trim();

S.i18n_form_plugin = `
import { formValidationPlugin } from "@deijose/nix-i18n/plugins/forms";

const validators = formValidationPlugin(i18n, {
  required: () => (value) => value ? undefined : "required",
  minLength: (n) => (value) => String(value).length < n ? "minLength" : undefined,
}, { keyPrefix: "errors" });

// Usage in a form:
// validators.minLength(5) returns a translated validator function
`.trim();

S.i18n_icu_plugin = `
import { icuPluralizePlugin } from "@deijose/nix-i18n/plugins/icuPluralize";

icuPluralizePlugin(i18n);

const messages = {
  en: { items: "{count, plural, one {# item} other {# items}}" },
};

i18n.t("items", { count: 5 }); // "5 items"
`.trim();

S.i18n_dev_overlay = `
import { devOverlayPlugin } from "@deijose/nix-i18n/plugins/devOverlay";

devOverlayPlugin(i18n, { log: true, overlay: true });
// Logs missing keys to console and shows a red overlay in development
`.trim();

S.i18n_cli_extract = `
npx nix-i18n-extract src --output extracted-keys.json
`.trim();

S.i18n_cli_generate = `
npx nix-i18n-generate src --locales es,en --output translations.json
`.trim();

S.i18n_typescript = `
const i18n = createI18n({
  locale: "es",
  messages: {
    es: { hello: "Hola {name}" },
  },
});

i18n.t("hello", { name: "Deiver" }); // OK
i18n.t("helo");                       // Type error: unknown key
i18n.t("hello");                      // Type error: missing parameter 'name'
`.trim();

S.i18n_inject = `
import { provide } from "@deijose/nix-js";
import { useI18n } from "@deijose/nix-i18n";

provide(I18nInjectionKey, i18n);

// In a descendant component:
const i18n = useI18n();
if (i18n) {
  console.log(i18n.t("hello"));
}
`.trim();

S.i18n_store_signals = `
// The i18n instance IS a Nix.js store with reactive signals.

i18n.locale.value;           // Current locale
i18n.messages.value;         // All loaded messages
i18n.isLoading.value;        // Loading state (backend fetching)
i18n.loadedNamespaces.value; // Loaded namespace names

i18n.currentMessages.value;  // Messages for the current locale (getter)
i18n.fallbackMessages.value; // Messages for the fallback locale (getter)

// All store methods are available:
i18n.setLocale("en");
i18n.setMessages("en", { hello: "Hello" });
await i18n.loadNamespace("dashboard");
`.trim();

S.i18n_reactive_template = `
import { html } from "@deijose/nix-js";

function LocaleSwitcher() {
  return html\`
    <div>
      <p>\${() => i18n.t("hello", { name: "Deiver" })}</p>
      <select @change=\${e => i18n.setLocale(e.target.value)}>
        <option value="es" \${() => i18n.locale.value === "es" ? "selected" : ""}>Español</option>
        <option value="en" \${() => i18n.locale.value === "en" ? "selected" : ""}>English</option>
      </select>
    </div>
  \`;
}
`.trim();

S.i18n_create_shorthand = `
// Shorthand: pass persist / detect directly to createI18n
// instead of calling the plugins manually.

const i18n = createI18n({
  locale: "es",
  fallbackLocale: "en",
  messages: { /* ... */ },
  persist: true,              // same as persistLocalePlugin(i18n)
  detect: {                   // same as detectLocalePlugin(i18n, options)
    order: ["localStorage", "navigator", "fallback"],
  },
  nestedFallback: true,
});
`.trim();

S.i18n_reactive_interpolation = `
// Interpolation values can be reactive:
// - Signals are unwrapped automatically
// - Functions are called on every render

import { signal } from "@deijose/nix-js";

const name = signal("Deiver");
const count = signal(5);

// Signal values are read automatically
i18n.t("hello", { name });           // reads name.value
i18n.t("items", { count });        // reads count.value

// Functions are re-evaluated each time
i18n.t("greeting", { name: () => getUserName() });
`.trim();

S.i18n_create_validator = `
import { createI18nValidator } from "@deijose/nix-i18n/plugins/forms";

// Create a single translated validator for a specific key
const requiredValidator = createI18nValidator(i18n, "errors.required", "This field is required");

// Usage in a Nix.js form
const form = createForm({
  fields: {
    email: { validators: [requiredValidator] },
  },
});
`.trim();

S.i18n_inject_import = `
import { provide } from "@deijose/nix-js";
import { I18nInjectionKey, useI18n } from "@deijose/nix-i18n";

provide(I18nInjectionKey, i18n);

// In a descendant component:
const i18n = useI18n();
if (i18n) {
  console.log(i18n.t("hello"));
}
`.trim();

S.vite_plugin_options = `
import { defineConfig } from "vite";
import nix from "@deijose/vite-plugin-nix-js";

export default defineConfig({
  plugins: [
    nix({
      preserveState: true,  // preserve signals, stores, routers, forms
      preserveDOM: true,    // preserve scroll position and focused element
      devtools: false,        // inject Nix devtools client
    }),
  ],
});
`.trim();

S.vite_plugin_before_after = `
// Developer-written code (before transform)
import { signal } from "@deijose/nix-js";
import { createForm } from "@deijose/nix-js/form";

const count = signal(0);
const form = createForm({ name: "" });
const cart = createStore({ items: [] }, { name: "cart" });
const router = createRouter(routes);
mount(App(), "#app", { router });

// Transformed code at build time (after transform)
import {
  __nixGetOrCreateSignal,
  __nixGetOrCreateForm,
  __nixGetOrCreateStore,
  __nixGetOrCreateRouter,
  __nixMount,
  __nixHmrAccept,
} from "@deijose/vite-plugin-nix-js/runtime";

const count = __nixGetOrCreateSignal("src/main.ts:count", () => signal(0));
const form = __nixGetOrCreateForm("src/main.ts:form", () => createForm({ name: "" }));
const cart = __nixGetOrCreateStore("src/main.ts:cart", () => createStore({ items: [] }, { name: "cart" }));
const router = __nixGetOrCreateRouter("src/main.ts:router", () => createRouter(routes));
__nixMount("src/main.ts", () => App(), "#app", { router });

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    __nixHmrAccept(newModule, "src/main.ts");
  });
}
`.trim();

S.vite_plugin_good_pattern = `
import { signal, html } from "@deijose/nix-js";

// ✅ Preserved across HMR — declared at module scope
const count = signal(0);

function Counter() {
  return html\`
    <button @click=\${() => count.update((v) => v + 1)}>
      \${() => count.value}
    </button>
  \`;
}
`.trim();

S.vite_plugin_bad_pattern = `
import { signal, html } from "@deijose/nix-js";

function Counter() {
  // ❌ Reset on every update — declared inside the component
  const count = signal(0);
  return html\`
    <button @click=\${() => count.update((v) => v + 1)}>
      \${() => count.value}
    </button>
  \`;
}
`.trim();

S.cli_create_nix_app = `
# Create a new project
npx create-nix-app my-app

# With a specific template
npx create-nix-app my-app --template vite-ts

# Available templates
# vanilla-js, vite-ts, vite-ts-nix-ui, nix-ionic, nix-ionic-tabs
`.trim();

S.cli_add_commands = `
# Generate code inside an existing project
npx nixjs add component Button
npx nixjs add page Login
npx nixjs add page users/[id]
npx nixjs add store auth
npx nixjs add service api
`.trim();

S.cli_run_commands = `
# Development, build, and test wrappers
# These detect your package.json scripts and fall back to Vite/Vitest

npx nixjs dev   # → npm run dev → vite
npx nixjs build # → npm run build → vite build
npx nixjs test  # → npm run test → vitest
`.trim();

S.cli_generated_component = `
# npx nixjs add component Button

import { html } from "@deijose/nix-js";

export function Button() {
  return html\`
    <button class="btn">Click me</button>
  \`;
}
`.trim();

S.cli_generated_ionic_component = `
# In a Nix-Ionic project:
# npx nixjs add component Button

import { html } from "@deijose/nix-js/template";
import { NixComponent } from "@deijose/nix-js/lifecycle";

export class Button extends NixComponent {
  override render() {
    return html\`
      <div class="button">
        <!-- Button component -->
      </div>
    \`;
  }
}
`.trim();

S.cli_generated_store = `
# npx nixjs add store auth

import { createStore } from "@deijose/nix-js";

export const useAuthStore = createStore(
  { user: null, isLoggedIn: false },
  {
    name: "auth",
    actions: (s) => ({
      login(user) {
        s.user.value = user;
        s.isLoggedIn.value = true;
      },
      logout() {
        s.user.value = null;
        s.isLoggedIn.value = false;
      },
    }),
  },
);
`.trim();

S.testing_install = `
# Core library (required peer)
npm install @deijose/nix-js

# Testing utilities and DOM environment
npm install -D @deijose/nix-js-testing vitest happy-dom
`.trim();

S.testing_vitest_config = `
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
  },
});
`.trim();

S.testing_basic = `
import { describe, it, expect } from "vitest";
import { signal, html } from "@deijose/nix-js";
import { render, fireEvent, screen, waitFor } from "@deijose/nix-js-testing";

function Counter() {
  const count = signal(0);
  return html\`
    <button @click=\${() => count.value++}>
      \${() => count.value}
    </button>
  \`;
}

describe("Counter", () => {
  it("increments on click", async () => {
    render(Counter());
    const btn = screen.getByText("0");

    fireEvent.click(btn);
    await waitFor(() => expect(screen.getByText("1")).toBeTruthy());
  });
});
`.trim();

S.testing_render_options = `
import { render } from "@deijose/nix-js-testing";

// Custom container
const { container, unmount } = render(MyComponent(), {
  container: document.createElement("section"),
});

// Do not attach to document.body
const { getByText } = render(MyComponent(), { attach: false });
`.trim();

S.testing_queries = `
import { render, screen } from "@deijose/nix-js-testing";

render(MyComponent());

// By text (exact or partial match)
screen.getByText("Submit");
screen.getByText(/submit/i);
screen.queryByText("Not found"); // returns null if absent
screen.getAllByText("Item");     // returns array

// By role (button, heading, etc.)
screen.getByRole("button");
screen.getAllByRole("listitem");

// By test id
screen.getByTestId("counter-value");

// By label, placeholder, or input value
screen.getByLabelText("Email");
screen.getByPlaceholderText("Search...");
screen.getByDisplayValue("hello@example.com");
`.trim();

S.testing_fire_event = `
import { fireEvent } from "@deijose/nix-js-testing";

// Shorthand helpers
fireEvent.click(button);
fireEvent.dblClick(button);
fireEvent.input(input, { target: { value: "hello" } });
fireEvent.change(select, { target: { value: "es" } });
fireEvent.submit(form);
fireEvent.focus(input);
fireEvent.blur(input);
fireEvent.keyDown(input, { key: "Enter" });
fireEvent.keyUp(input, { key: "Escape" });
fireEvent.mouseEnter(element);
fireEvent.mouseLeave(element);

// Generic dispatcher for any event
fireEvent(element, "custom-event", { detail: 42 });
`.trim();

S.testing_wait_for = `
import { waitFor } from "@deijose/nix-js-testing";

// Default: 1s timeout, 50ms polling interval
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});

// Custom timeout and interval
await waitFor(
  () => expect(screen.getByTestId("result")).toBeTruthy(),
  { timeout: 2000, interval: 100 }
);
`.trim();

S.testing_cleanup = `
import { cleanup } from "@deijose/nix-js-testing";
import { afterEach } from "vitest";

// Automatic cleanup after every test
afterEach(() => cleanup());

// Or manual cleanup
const { unmount } = render(Counter());
// ... assertions ...
unmount();
`.trim();

S.testing_form_example = `
import { createForm } from "@deijose/nix-js/form";
import { render, fireEvent, screen, waitFor } from "@deijose/nix-js-testing";

function LoginForm() {
  const form = createForm({
    fields: {
      email: { validators: [requiredValidator] },
      password: { validators: [minLengthValidator(6)] },
    },
  });

  return html\`
    <form @submit=\${form.submit}>
      <input data-testid="email" @input=\${e => form.setFieldValue("email", e.target.value)} />
      <input data-testid="password" type="password" @input=\${e => form.setFieldValue("password", e.target.value)} />
      <button type="submit">Login</button>
    </form>
  \`;
}

it("submits with valid data", async () => {
  render(LoginForm());

  fireEvent.input(screen.getByTestId("email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.input(screen.getByTestId("password"), {
    target: { value: "secret123" },
  });
  fireEvent.submit(screen.getByRole("button"));

  await waitFor(() => {
    expect(screen.getByText("Success")).toBeTruthy();
  });
});
`.trim();

S.testing_async_component = `
import { render, waitFor, screen } from "@deijose/nix-js-testing";

function UserList() {
  const users = signal([]);

  fetch("/api/users")
    .then(r => r.json())
    .then(data => { users.value = data; });

  return html\`
    <ul>
      \${() => users.value.map(u => html\`<li>\${u.name}</li>\`)}
    </ul>
  \`;
}

it("loads and displays users", async () => {
  render(UserList());

  await waitFor(() => {
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });
});
`.trim();

S.nix_query_install = `
npm install @deijose/nix-js @deijose/nix-query
`.trim();

S.nix_query_basic = `
import { createQuery } from "@deijose/nix-query";
import { html } from "@deijose/nix-js";

const posts = createQuery("posts", () =>
  fetch("/api/posts").then((r) => r.json())
);

function PostsPage() {
  return html\`
    <div>
      \${() => posts.status.value === "pending" && html\`<p>Loading...</p>\`}
      \${() => posts.status.value === "error" && html\`<p>Error loading posts</p>\`}
      \${() =>
        posts.status.value === "success" &&
        html\`<ul>
          \${() => posts.data.value?.map(p => html\`<li>\${p.title}</li>\`)}
        </ul>\`}
    </div>
  \`;
}
`.trim();

S.nix_query_options = `
const posts = createQuery("posts", () =>
  fetch("/api/posts").then((r) => r.json()),
  {
    staleTime: 30_000,           // data is fresh for 30 seconds
    refetchOnMount: "stale",     // only refetch when stale
  }
);
`.trim();

S.nix_query_cache = `
import { getQueryData, setQueryData, updateQueryData } from "@deijose/nix-query";

// Read current cached data
const users = getQueryData<{ id: number; name: string }[]>("users/list");

// Overwrite cache directly
setQueryData("users/list", [...(users ?? []), { id: 3, name: "Mia" }]);

// Atomically update from previous value
updateQueryData("users/list", (current = []) =>
  current.map((u) => (u.id === 3 ? { ...u, name: "Mia V2" } : u))
);
`.trim();

S.nix_query_invalidate = `
import { invalidateQueries, clearQueryCache, setQueryCacheTime } from "@deijose/nix-query";

// Force all active "posts" queries to re-fetch
invalidateQueries("posts");

// Remove one key from cache
clearQueryCache("posts");

// Remove ALL keys from cache
clearQueryCache();

// Set cache garbage collection time (default 5 minutes)
setQueryCacheTime(10 * 60 * 1000);  // 10 minutes
`.trim();

S.nix_command_basic = `
import { createCommand } from "@deijose/nix-query";

const saveProfile = createCommand(
  "profile/save",
  async (payload: { name: string }, { signal }) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });

    if (!res.ok) {
      const err = new Error("Request failed") as Error & { status?: number };
      err.status = res.status;
      throw err;
    }

    return (await res.json()) as { ok: true };
  },
  {
    mode: "latest",
    dedupeWindowMs: 300,
    invalidate: ["profile", "posts"],
    retry: (failureCount, error) => {
      const status = (error as { status?: number })?.status;
      const isTransient = status === undefined || status >= 500 || status === 429;
      return isTransient && failureCount < 3;
    },
    retryDelay: (failureCount) => Math.min(500 * 2 ** (failureCount - 1), 5000),
  }
);

// Fire-and-forget
saveProfile.execute({ name: "Deiver" });

// Wait for completion
await saveProfile.executeAsync({ name: "Deiver" });
`.trim();

S.nix_command_signals = `
// A command exposes reactive signals for the UI

saveProfile.status.value;      // "idle" | "pending" | "success" | "error" | "queued"
saveProfile.data.value;        // TResult | undefined
saveProfile.error.value;       // unknown
saveProfile.variables.value;   // TVariables | undefined
saveProfile.failureCount.value;// number of retry failures
saveProfile.inFlight.value;    // number of active executions
saveProfile.queuedCount.value; // number of items in offline queue

// Boolean helpers
saveProfile.isIdle.value;    // status === "idle"
saveProfile.isPending.value; // status === "pending"
saveProfile.isSuccess.value; // status === "success"
saveProfile.isError.value;   // status === "error"
saveProfile.isQueued.value;  // status === "queued"
`.trim();

S.nix_command_optimistic = `
import { createCommand, getQueryData, setQueryData } from "@deijose/nix-query";

type Item = { id: number; title: string };

const createItem = createCommand(
  "items/create",
  async (item: Item) => {
    // real request...
    const res = await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify(item),
    });
    return res.json();
  },
  {
    onMutate: (item) => {
      const previous = getQueryData<Item[]>("items/list") ?? [];
      setQueryData("items/list", [...previous, item]);
      return { previous };
    },
    onError: (_error, _item, context) => {
      setQueryData("items/list", context?.previous ?? []);
    },
    onSuccess: (data) => {
      // invalidate related queries
      invalidateQueries("items/list");
    },
  }
);
`.trim();

S.nix_command_modes = `
import { createCommand } from "@deijose/nix-query";

// latest — abort previous, keep only the last result (default)
const search = createCommand("search", fetchFn, { mode: "latest" });

// queue — serialize executions, run one after another
const checkout = createCommand("checkout", fetchFn, { mode: "queue" });

// parallel — allow multiple simultaneous executions
const uploadChunk = createCommand("upload/chunk", fetchFn, { mode: "parallel" });

// queueOffline — queue when offline, replay on reconnect
const createOrder = createCommand("orders/create", fetchFn, {
  mode: "queueOffline",
  offline: { /* adapter, isOnline, ... */ },
});
`.trim();

S.nix_command_offline = `
import {
  CommandQueuedError,
  createCommand,
  type CommandQueueAdapter,
  type OfflineCommandEntry,
} from "@deijose/nix-query";

type CreateOrderInput = { id: string; total: number };

// Implement your own adapter — any storage works:
// localStorage, IndexedDB, Capacitor Preferences, SQLite...
class LocalStorageQueueAdapter implements CommandQueueAdapter<CreateOrderInput> {
  private key = "nix-query:offline-commands";

  private read(): OfflineCommandEntry<CreateOrderInput>[] {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }

  private write(items: OfflineCommandEntry<CreateOrderInput>[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  enqueue(entry) {
    this.write([...this.read(), entry]);
  }

  list(commandKey?: string) {
    const all = this.read();
    return commandKey ? all.filter((i) => i.commandKey === commandKey) : all;
  }

  update(entry) {
    this.write(this.read().map((i) => (i.id === entry.id ? entry : i)));
  }

  remove(id: string) {
    this.write(this.read().filter((i) => i.id !== id));
  }
}

const createOrder = createCommand(
  "orders/create",
  async (payload: CreateOrderInput, { signal }) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok) throw new Error("order create failed");
    return await res.json();
  },
  {
    mode: "queueOffline",
    offline: {
      adapter: new LocalStorageQueueAdapter(),
      isOnline: () => navigator.onLine,
      replayOnReconnect: true,
      maxReplayAttempts: 5,
    },
  }
);

// When offline, executeAsync throws CommandQueuedError
try {
  await createOrder.executeAsync({ id: "A-100", total: 42 });
} catch (error) {
  if (error instanceof CommandQueuedError) {
    // queued successfully, will replay automatically when online
  }
}

// Manual controls
await createOrder.replayQueue();  // try replaying now
await createOrder.clearQueue();   // discard all queued items
`.trim();

S.nix_query_refetch = `
import { createQuery } from "@deijose/nix-query";

const posts = createQuery("posts", () =>
  fetch("/api/posts").then((r) => r.json())
);

// Imperative refetch (bypasses cache)
posts.refetch();
`.trim();

S.nix_query_params = `
import { createQuery } from "@deijose/nix-query";
import { signal } from "@deijose/nix-js";

const search = signal("");
const page = signal(1);

const posts = createQuery(
  "posts",
  ({ q, page }) =>
    fetch(\`/api/posts?q=\${encodeURIComponent(q)}&page=\${page}\`).then((r) => r.json()),
  {
    params: () => ({ q: search.value, page: page.value }),
    staleTime: 30_000,
  }
);

// Changing any signal triggers an automatic refetch
search.value = "nix";
`.trim();

S.ionic_install = `
npm install @deijose/nix-ionic @deijose/nix-js @ionic/core

# For native iOS / Android
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
`.trim();

S.ionic_main = `
// 1. Core Styles (order matters)
import "@ionic/core/css/core.css";
import "@ionic/core/css/normalize.css";
import "@ionic/core/css/structure.css";
import "@ionic/core/css/typography.css";
import "@ionic/core/css/padding.css";
import "@ionic/core/css/flex-utils.css";
import "@ionic/core/css/display.css";
import "./style.css";

// 2. Framework Imports
import { NixComponent, html, mount } from "@deijose/nix-js";
import { setupNixIonic, IonRouterOutlet } from "@deijose/nix-ionic";
import { layoutComponents } from "@deijose/nix-ionic/bundles/layout";
import { navigationComponents } from "@deijose/nix-ionic/bundles/navigation";
import { defineIonButton } from "@deijose/nix-ionic/components";
import { home, homeOutline } from "ionicons/icons";

// 3. Pages
import { HomePage }   from "./pages/HomePage";
import { DetailPage } from "./pages/DetailPage";

// Configure and inject Ionic Core
setupNixIonic({
  components: [...layoutComponents, ...navigationComponents, defineIonButton],
  icons: {
    home,
    "home-outline": homeOutline,
  },
});

// 4. Router Configuration
const outlet = new IonRouterOutlet([
  { path: "/",           component: (ctx) => new HomePage(ctx)   },
  { path: "/detail/:id", component: (ctx) => new DetailPage(ctx) }
]);

// 5. App Component
class App extends NixComponent {
  override render() {
    return html\`<ion-app>\${outlet}</ion-app>\`;
  }
}

// 6. Bootstrap
mount(new App(), "#app");
`.trim();

S.ionic_modular = `
import { setupNixIonic } from "@deijose/nix-ionic";

// 1. Individual components (maximum tree-shaking)
import {
  defineIonHeader,
  defineIonToolbar,
  defineIonTitle,
  defineIonContent,
  defineIonButton,
} from "@deijose/nix-ionic/components";

setupNixIonic({
  components: [
    defineIonHeader,
    defineIonToolbar,
    defineIonTitle,
    defineIonContent,
    defineIonButton,
  ],
});

// 2. Category bundles (balanced approach)
import { layoutComponents } from "@deijose/nix-ionic/bundles/layout";
import { buttonComponents } from "@deijose/nix-ionic/bundles/buttons";
import { listComponents } from "@deijose/nix-ionic/bundles/lists";

setupNixIonic({
  components: [...layoutComponents, ...buttonComponents, ...listComponents],
});

// 3. All components (backward-compatible)
import { allComponents } from "@deijose/nix-ionic/bundles/all";

setupNixIonic({ components: allComponents });
`.trim();

S.ionic_page_class = `
import { html, signal, nixRouter } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { IonPage, IonBackButton } from "@deijose/nix-ionic";
import type { PageContext } from "@deijose/nix-ionic";

export class DetailPage extends IonPage {
  private post = signal<Post | null>(null);
  private _id: string;

  constructor({ lc, params }: PageContext) {
    super(lc);
    this._id = params["id"] ?? "1";
  }

  // Called on EVERY activation — even when returning from cached stack
  override ionViewWillEnter(): void {
    this._loadPost(this._id);
  }

  // Called when leaving the view (still in cache)
  override ionViewWillLeave(): void {
    // pause timers, subscriptions, etc.
  }

  override render(): NixTemplate {
    return html\`
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            \${IonBackButton()}
          </ion-buttons>
          <ion-title>Detail</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p>\${() => this.post.value?.title ?? ""}</p>
      </ion-content>
    \`;
  }
}
`.trim();

S.ionic_page_function = `
import { html, signal } from "@deijose/nix-js";
import { useIonViewWillEnter, useIonViewWillLeave, IonBackButton } from "@deijose/nix-ionic";
import type { NixTemplate } from "@deijose/nix-js";
import type { PageContext } from "@deijose/nix-ionic";

export function ProfilePage({ lc }: PageContext): NixTemplate {
  const visits = signal(0);

  useIonViewWillEnter(lc, () => {
    visits.update((n) => n + 1);
  });

  useIonViewWillLeave(lc, () => {
    console.log("leaving profile");
  });

  return html\`
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          \${IonBackButton()}
        </ion-buttons>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>Visits: \${() => visits.value}</p>
    </ion-content>
  \`;
}
`.trim();

S.ionic_router = `
import { nixRouter } from "@deijose/nix-js";

const router = nixRouter();

// Navigate forward
router.navigate("/detail/42");

// Navigate back
router.back();

// Replace current view (no history entry)
router.replace("/home");

// Reactive signals
router.canGoBack.value;   // boolean — true when back stack exists
router.params.value;      // { id: "42" } for /detail/:id
router.current.value;     // current pathname
`.trim();

S.ionic_tabs = `
import { html } from "@deijose/nix-js";
import { createBottomTabBar } from "@deijose/nix-ionic";

const tabs = createBottomTabBar(
  [
    { path: "/", label: "Home", icon: "home-outline", activeIcon: "home", exact: true },
    { path: "/map", label: "Map", icon: "map-outline", activeIcon: "map" },
    { path: "/profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
  ],
  {
    hiddenPaths: ["/login", "/auth/*"],
    navigationDirection: "root",
  }
);

// In your App component:
html\`<ion-app>\${outlet}\${tabs}</ion-app>\`;
`.trim();

S.ionic_back_button = `
import { IonBackButton } from "@deijose/nix-ionic";

// No arguments — uses ion-router-outlet stack
html\`
  <ion-buttons slot="start">
    \${IonBackButton()}
  </ion-buttons>
\`

// Optional default href when no back stack exists
html\`
  <ion-buttons slot="start">
    \${IonBackButton("/")}
  </ion-buttons>
\`
`.trim();

S.ionic_guards = `
const requireAuth = () => (isAuthenticated.value ? true : "/login");

const outlet = new IonRouterOutlet([
  { path: "/", component: (ctx) => new HomePage(ctx) },
  {
    path: "/admin",
    component: (ctx) => new AdminPage(ctx),
    beforeEnter: ({ params }) => {
      if (!isLoggedIn()) return "/login";  // redirect
      if (!isAdmin())    return false;     // cancel navigation
      // return void / undefined to allow
    },
  },
]);
`.trim();

S.ionic_complete_app = `
import { signal, NixComponent, html, mount } from "@deijose/nix-js";
import {
  setupNixIonic,
  IonRouterOutlet,
  createBottomTabBar,
  IonPage,
  IonBackButton,
  type PageContext,
} from "@deijose/nix-ionic";
import { nixRouter } from "@deijose/nix-js";
import { layoutComponents } from "@deijose/nix-ionic/bundles/layout";
import { navigationComponents } from "@deijose/nix-ionic/bundles/navigation";
import { listComponents } from "@deijose/nix-ionic/bundles/lists";
import { buttonComponents } from "@deijose/nix-ionic/bundles/buttons";
import { home, homeOutline, map, mapOutline, person, personOutline } from "ionicons/icons";

const isAuthenticated = signal(false);
const auth = {
  login: () => (isAuthenticated.value = true),
  logout: () => (isAuthenticated.value = false),
};

setupNixIonic({
  components: [...layoutComponents, ...navigationComponents, ...listComponents, ...buttonComponents],
  icons: { home, "home-outline": homeOutline, map, "map-outline": mapOutline, person, "person-outline": personOutline },
});

class LoginPage extends IonPage {
  constructor(ctx: PageContext) { super(ctx.lc); }
  override render() {
    const router = nixRouter();
    return html\`
      <ion-header><ion-toolbar><ion-title>Login</ion-title></ion-toolbar></ion-header>
      <ion-content class="ion-padding">
        <ion-button expand="block" @click=\${() => { auth.login(); router.replace("/"); }}>
          Sign in
        </ion-button>
      </ion-content>
    \`;
  }
}

class HomePage extends IonPage {
  constructor(ctx: PageContext) { super(ctx.lc); }
  override render() {
    return html\`<ion-content class="ion-padding">Home tab</ion-content>\`;
  }
}

class ProfilePage extends IonPage {
  constructor(ctx: PageContext) { super(ctx.lc); }
  override render() {
    const router = nixRouter();
    return html\`
      <ion-content class="ion-padding">
        <ion-button color="danger" @click=\${() => { auth.logout(); router.replace("/login"); }}>
          Sign out
        </ion-button>
      </ion-content>
    \`;
  }
}

const requireAuth = () => (isAuthenticated.value ? true : "/login");

const outlet = new IonRouterOutlet([
  { path: "/login", component: (ctx) => new LoginPage(ctx) },
  { path: "/", component: (ctx) => new HomePage(ctx), beforeEnter: requireAuth },
  { path: "/profile", component: (ctx) => new ProfilePage(ctx), beforeEnter: requireAuth },
]);

const tabs = createBottomTabBar(
  [
    { path: "/", label: "Home", icon: "home-outline", activeIcon: "home", exact: true },
    { path: "/profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
  ],
  { navigationDirection: "root", hideWhen: (path) => path === "/login" }
);

class App extends NixComponent {
  override render() { return html\`<ion-app>\${outlet}\${tabs}</ion-app>\`; }
}

mount(new App(), "#app");
`.trim();

S.ionic_capacitor = `
// src/services/camera.ts
import { Camera, CameraResultType } from "@capacitor/camera";

export async function takePhoto(): Promise<string> {
  const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
  });
  return photo.dataUrl ?? "";
}
`.trim();

S.ionic_page_template = `
import { html, signal, nixRouter } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { IonPage, IonBackButton } from "@deijose/nix-ionic";
import type { PageContext } from "@deijose/nix-ionic";

export class MyPage extends IonPage {
  private data = signal<string | null>(null);

  constructor({ lc, params }: PageContext) {
    super(lc);
    // params contains dynamic route segments
    // e.g. for /my/:id -> params["id"]
  }

  // Runs on EVERY visit (initial + returning from stack)
  override ionViewWillEnter(): void {
    this._load();
  }

  // Runs when navigating away (view stays cached)
  override ionViewWillLeave(): void {
    // pause subscriptions, timers, etc.
  }

  private async _load(): Promise<void> {
    // fetch data
  }

  override render(): NixTemplate {
    const router = nixRouter();

    return html\`
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            \${IonBackButton()}
          </ion-buttons>
          <ion-title>My Page</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <p>\${() => this.data.value ?? "Loading..."}</p>
        <ion-button @click=\${() => router.navigate("/other")}>
          Go somewhere
        </ion-button>
      </ion-content>
    \`;
  }
}
`.trim();

S.ionic_vite_config = `
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@ionic/core"],
  },
  build: {
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },
});
`.trim();

S.ionic_capacitor_config = `
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.myapp",
  appName: "My App",
  webDir: "dist",
};

export default config;
`.trim();

S.ionic_index_html = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="viewport-fit=cover, width=device-width, initial-scale=1.0,
               minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>My App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`.trim();

S.ionic_android_workflow = `
# First-time setup
npm run build
npx cap init "My App" "com.example.myapp" --web-dir dist
npx cap add android
npx cap sync android

# Daily workflow
npm run build
npx cap sync android
npx cap open android       # open Android Studio
npx cap run android        # run on device / emulator

# Live reload (dev)
npm run dev
npx cap run android --livereload --external
`.trim();

S.ionic_ios_workflow = `
# First-time setup
npm run build
npx cap add ios
npx cap sync ios

# Daily workflow
npm run build
npx cap sync ios
npx cap open ios           # open Xcode
npx cap run ios            # run on simulator

# Live reload (dev)
npm run dev
npx cap run ios --livereload --external
`.trim();