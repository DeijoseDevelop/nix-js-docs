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
      .setSlot('footer', html\`<small>Nix.js v1.9.0</small>\`)
    }
  \`;
}`.trim();

S.store_basic = `
import { createStore } from '@deijose/nix-js';

// Every key becomes a Signal automatically
const counterStore = createStore({ count: 0, step: 1 });

// Read / write signals directly
counterStore.count.value;
counterStore.count.value++;
counterStore.step.value = 5;

// $state — reactive snapshot of all values
counterStore.$state; // { count: 1, step: 5 }

// $patch — batch-update multiple keys at once
counterStore.$patch({ count: 0, step: 1 });

// $reset — restore ALL signals to initial values
counterStore.$reset();`.trim();

S.store_actions = `
interface CartItem { id: number; name: string; price: number; qty: number; }

const cartStore = createStore(
  {
    items:    [] as CartItem[],
    coupon:   '',
    discount: 0,
  },
  (s) => ({
    addItem(item: CartItem) {
      s.items.update(arr => {
        const existing = arr.find(i => i.id === item.id);
        if (existing) return arr.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
        return [...arr, { ...item, qty: 1 }];
      });
    },
    removeItem(id: number) {
      s.items.update(arr => arr.filter(i => i.id !== id));
    },
    applyCoupon(code: string) {
      s.coupon.value   = code;
      s.discount.value = code === 'NIX20' ? 20 : 0;
    },
    clearCart() { cartStore.$reset(); },
  })
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
  (s) => ({
    increment: () => s.count.value++,
    addItem: (name: string) => s.items.value = [...s.items.value, name],
  }),
  (s) => ({
    double: computed(() => s.count.value * 2),
    total: computed(() => s.items.value.length),
  }),
);

counterStore.increment();
counterStore.double.value; // 2
counterStore.total.value;  // items length
`.trim();

S.store_subscribe = `
const store = createStore({ count: 0, theme: 'dark' });

const unsubscribe = store.$subscribe((key, newVal, oldVal) => {
  console.log('[store]', key, oldVal, '->', newVal);

  // Persist full snapshot (middleware pattern)
  localStorage.setItem('app-store', JSON.stringify(store.$state));
});

store.count.value++;
store.$patch({ theme: 'light' });

// Later (cleanup)
unsubscribe();
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

S.query_fn = `
import { createQuery, invalidateQueries } from '@deijose/nix-js';

function OrdersTable(): NixTemplate {
  return html\`
    \${createQuery(
      'orders',
      () => fetch('/api/orders').then(r => r.json()),
      (orders: Order[]) => html\`
        <table>
          \${orders.map(o => html\`
            <tr>
              <td>\${o.id}</td>
              <td>\${o.customer}</td>
              <td>$\${o.total}</td>
            </tr>
          \`)}
        </table>
      \`,
      { fallback: html\`<p>Loading orders…</p>\`, staleTime: 60_000, refetchOnMount: 'stale' }
    )}
  \`;
}

function NewOrderButton(): NixTemplate {
  const submitting = signal(false);

  const createOrder = async () => {
    submitting.value = true;
    await api.createOrder({ /* ... */ });
    invalidateQueries('orders');
    submitting.value = false;
  };

  return html\`
    <button @click=\${createOrder} disabled=\${() => submitting.value}>
      \${() => submitting.value ? 'Creating…' : 'New Order'}
    </button>
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
S.async_query = S.query_fn;

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
