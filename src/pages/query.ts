import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';

export function QueryPage(): NixTemplate {
    return html`
        <div>
            <h2 class="page-title">
                Nix.js Query
            </h2>
            <p class="page-sub">
                CQRS-style data utilities for Nix.js. Read with <code>createQuery</code>, write with <code>createCommand</code>. Key-based cache, automatic deduplication, retries, optimistic updates, and an offline-first command queue.
            </p>

            <h3>
                Features
            </h3>
            <div class="ul">
                <ul>
                    <li><strong>Signal-based queries</strong> — <code>status</code>, <code>data</code>, and <code>error</code> are reactive signals that update the UI automatically.</li>
                    <li><strong>Global key cache</strong> — queries share a global cache keyed by string. Mounting the same key reuses cached data instantly.</li>
                    <li><strong>Imperative cache manipulation</strong> — <code>getQueryData</code>, <code>setQueryData</code>, <code>updateQueryData</code>, and <code>invalidateQueries</code>.</li>
                    <li><strong>Commands with modes</strong> — <code>latest</code>, <code>queue</code>, <code>parallel</code>, and <code>queueOffline</code> for different concurrency strategies.</li>
                    <li><strong>Retry with backoff</strong> — configurable per command with custom delay functions.</li>
                    <li><strong>Optimistic rollback</strong> — <code>onMutate</code> / <code>onError</code> hooks for optimistic UI patterns.</li>
                    <li><strong>Offline-first queue</strong> — commands can be queued when offline and replayed automatically on reconnect via a custom adapter.</li>
                    <li><strong>Zero virtual DOM overhead</strong> — works directly with Nix.js signals, no extra rendering layer.</li>
                </ul>
            </div>

            <h3>
                Installation
            </h3>
            <p>
                <code>@deijose/nix-js</code> is a peer dependency.
            </p>
            ${new CodeBlock(S.nix_query_install, 'bash')}

            <h3>
                Queries (Read)
            </h3>
            <p>
                <code>createQuery(key, asyncFn, options?)</code> fetches data by key, caches it globally, and exposes reactive signals. Multiple components using the same key share the same cache entry and fetch de-duplication.
            </p>
            ${new CodeBlock(S.nix_query_basic)}

            <h4>QueryResult signals</h4>
            <div class="tbl">
                <table>
                    <tr><th>Signal</th><th>Type</th><th>Description</th></tr>
                    <tr><td><code>q.status</code></td><td><code>Signal&lt;"pending" | "success" | "error"&gt;</code></td><td>Current fetch status.</td></tr>
                    <tr><td><code>q.data</code></td><td><code>Signal&lt;T | undefined&gt;</code></td><td>Fetched data on success.</td></tr>
                    <tr><td><code>q.error</code></td><td><code>Signal&lt;unknown&gt;</code></td><td>Error if the fetch failed.</td></tr>
                </table>
            </div>

            <h4>QueryOptions</h4>
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
                    <tr><td><code>staleTime</code></td><td><code>number</code></td><td><code>0</code></td><td>Time in ms that cached data is considered fresh. While fresh, mounting does not trigger a background refetch.</td></tr>
                    <tr><td><code>refetchOnMount</code></td><td><code>"always" | "stale" | false</code></td><td><code>"always"</code></td><td>"always" — refetch every mount. "stale" — refetch only when staleTime exceeded. <code>false</code> — never refetch on mount.</td></tr>
                </table>
            </div>

            <h4>Refetching</h4>
            <p>
                Call <code>refetch()</code> to bypass the cache and fetch fresh data immediately.
            </p>
            ${new CodeBlock(S.nix_query_refetch)}

            <h3>
                Cache Manipulation
            </h3>
            <p>
                The query cache is a global singleton. You can read from it, write to it, or update it atomically — all changes sync to active query signals immediately.
            </p>
            ${new CodeBlock(S.nix_query_cache)}

            <h4>Cache utilities</h4>
            <div class="tbl">
                <table>
                    <tr><th>Function</th><th>Description</th></tr>
                    <tr><td><code>getQueryData&lt;T&gt;(key)</code></td><td>Read the current cached value for a key. Returns <code>undefined</code> if absent.</td></tr>
                    <tr><td><code>setQueryData(key, value)</code></td><td>Overwrite the cache entry and notify active queries.</td></tr>
                    <tr><td><code>updateQueryData(key, updater)</code></td><td>Atomically update from the previous value and notify active queries.</td></tr>
                    <tr><td><code>invalidateQueries(key)</code></td><td>Clear the cache for a key and force all active instances to re-fetch.</td></tr>
                    <tr><td><code>clearQueryCache(key?)</code></td><td>Remove one key (or all keys if no argument) from the cache.</td></tr>
                    <tr><td><code>setQueryCacheTime(ms)</code></td><td>Set how long zero-subscriber entries are kept. Default is 5 minutes. Pass <code>Infinity</code> to keep forever.</td></tr>
                </table>
            </div>
            ${new CodeBlock(S.nix_query_invalidate)}

            <h3>
                Commands (Write)
            </h3>
            <p>
                <code>createCommand(commandKey, executeFn, options?)</code> wraps a mutation function with reactive signals, retry logic, deduplication, cache invalidation, and lifecycle hooks.
            </p>
            ${new CodeBlock(S.nix_command_basic)}

            <h4>Command signals & computed helpers</h4>
            ${new CodeBlock(S.nix_command_signals)}

            <h4>Command methods</h4>
            <div class="tbl">
                <table>
                    <tr><th>Method</th><th>Description</th></tr>
                    <tr><td><code>cmd.execute(variables)</code></td><td>Fire-and-forget execution. Errors go to <code>cmd.error</code>.</td></tr>
                    <tr><td><code>await cmd.executeAsync(variables)</code></td><td>Return a promise that resolves with the result or rejects with the error.</td></tr>
                    <tr><td><code>cmd.reset()</code></td><td>Reset all signals to their initial state.</td></tr>
                    <tr><td><code>cmd.cancel()</code></td><td>Abort all in-flight executions.</td></tr>
                    <tr><td><code>await cmd.replayQueue()</code></td><td>Manually replay offline queued items (queueOffline mode only).</td></tr>
                    <tr><td><code>await cmd.clearQueue()</code></td><td>Discard all queued offline items (queueOffline mode only).</td></tr>
                </table>
            </div>

            <h4>CommandOptions</h4>
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
                    <tr><td><code>mode</code></td><td><code>"latest" | "queue" | "parallel" | "queueOffline"</code></td><td><code>"latest"</code></td><td>Concurrency strategy (see below).</td></tr>
                    <tr><td><code>dedupeWindowMs</code></td><td><code>number</code></td><td><code>0</code></td><td>Anti double-tap window. Re-executions within this window return the same promise.</td></tr>
                    <tr><td><code>retry</code></td><td><code>number | (failureCount, error) => boolean</code></td><td><code>false</code></td><td>Max retries or custom predicate. Default exponential backoff delay.</td></tr>
                    <tr><td><code>retryDelay</code></td><td><code>number | (failureCount, error) => number</code></td><td><code>exp. backoff</code></td><td>Delay between retries in ms.</td></tr>
                    <tr><td><code>serializeByKey</code></td><td><code>boolean</code></td><td><code>true</code></td><td>For <code>latest</code> and <code>queue</code> modes, serialize across all instances with the same command key.</td></tr>
                    <tr><td><code>invalidate</code></td><td><code>string[] | (data, variables) => string[]</code></td><td></td><td>Query keys to invalidate after a successful execution.</td></tr>
                    <tr><td><code>onMutate</code></td><td><code>(variables) => TContext</code></td><td></td><td>Called before execution. Use for optimistic updates. Return a context object for rollback.</td></tr>
                    <tr><td><code>onSuccess</code></td><td><code>(data, variables, context) => void</code></td><td></td><td>Called after successful execution.</td></tr>
                    <tr><td><code>onError</code></td><td><code>(error, variables, context) => void</code></td><td></td><td>Called after a failed execution. Use for rollback.</td></tr>
                    <tr><td><code>onSettled</code></td><td><code>(data, error, variables, context) => void</code></td><td></td><td>Called after execution regardless of outcome.</td></tr>
                </table>
            </div>

            <h3>
                Command Modes
            </h3>
            <p>
                The <code>mode</code> option controls how concurrent executions are handled.
            </p>
            ${new CodeBlock(S.nix_command_modes)}

            <div class="tbl">
                <table>
                    <tr><th>Mode</th><th>Behavior</th></tr>
                    <tr><td><code>"latest"</code></td><td>Abort the previous execution when a new one starts. Only the latest result is kept. Ideal for search, filters, or auto-save.</td></tr>
                    <tr><td><code>"queue"</code></td><td>Serialize executions for the same key. Run one after another. Ideal for checkout, order placement, or any action that must not overlap.</td></tr>
                    <tr><td><code>"parallel"</code></td><td>Allow multiple simultaneous executions. Each runs independently. Ideal for upload chunks or bulk operations.</td></tr>
                    <tr><td><code>"queueOffline"</code></td><td>When offline, queue the command instead of failing. Replay automatically when connectivity returns. See Offline First section below.</td></tr>
                </table>
            </div>

            <h3>
                Optimistic Updates
            </h3>
            <p>
                Use <code>onMutate</code> to update the cache optimistically before the request finishes. Return a context object from <code>onMutate</code> and use it in <code>onError</code> to roll back if the request fails.
            </p>
            ${new CodeBlock(S.nix_command_optimistic)}

            <h3>
                Offline First
            </h3>
            <p>
                The <code>queueOffline</code> mode is designed for applications that must work without a network connection. When the user is offline, commands are persisted in a queue instead of failing. They are replayed automatically when connectivity returns.
            </p>

            <h4>How it works</h4>
            <div class="ul">
                <ul>
                    <li>When online, commands execute normally.</li>
                    <li>When offline, <code>executeAsync</code> throws a <code>CommandQueuedError</code>. The command is persisted via your adapter.</li>
                    <li>On <code>online</code> event (or manual call), queued commands are replayed in order.</li>
                    <li>Failed replays are updated with attempt count and last error. The queue pauses at the first failure to preserve ordering.</li>
                    <li><code>maxReplayAttempts</code> caps retries per item.</li>
                </ul>
            </div>

            <h4>Queue Adapter Contract</h4>
            <p>
                You provide the storage. Any persistence layer works: <code>localStorage</code>, <code>IndexedDB</code>, <code>Capacitor Preferences</code>, <code>SQLite</code>, etc. The adapter only needs four methods.
            </p>
            <div class="tbl">
                <table>
                    <tr><th>Method</th><th>Description</th></tr>
                    <tr><td><code>enqueue(entry)</code></td><td>Add an entry to the queue.</td></tr>
                    <tr><td><code>list(commandKey?)</code></td><td>Return all entries, optionally filtered by command key.</td></tr>
                    <tr><td><code>update(entry)</code></td><td>Replace an existing entry (e.g. after a failed replay).</td></tr>
                    <tr><td><code>remove(id)</code></td><td>Remove an entry from the queue (e.g. after success).</td></tr>
                </table>
            </div>

            <h4>OfflineQueueOptions</h4>
            <div class="tbl">
                <table>
                    <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
                    <tr><td><code>adapter</code></td><td><code>CommandQueueAdapter&lt;T&gt;</code></td><td>required</td><td>Your storage adapter implementation.</td></tr>
                    <tr><td><code>isOnline</code></td><td><code>() => boolean</code></td><td><code>navigator.onLine</code></td><td>Custom online detector.</td></tr>
                    <tr><td><code>replayOnReconnect</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Auto-replay when browser emits <code>online</code> event.</td></tr>
                    <tr><td><code>maxReplayAttempts</code></td><td><code>number</code></td><td></td><td>Cap replay attempts before pausing the item.</td></tr>
                    <tr><td><code>shouldEnqueue</code></td><td><code>(error, variables) => boolean</code></td><td></td><td>Decide if a failed execution should be enqueued.</td></tr>
                    <tr><td><code>onEnqueue</code></td><td><code>(entry) => void</code></td><td></td><td>Called after an entry is queued.</td></tr>
                    <tr><td><code>onReplaySuccess</code></td><td><code>(data, entry) => void</code></td><td></td><td>Called after a queued command replays successfully.</td></tr>
                    <tr><td><code>onReplayError</code></td><td><code>(error, entry) => void</code></td><td></td><td>Called after a queued command fails replay.</td></tr>
                </table>
            </div>

            <h4>Complete offline example</h4>
            <p>
                Below is a complete example with a <code>localStorage</code> adapter, offline detection, and manual queue controls.
            </p>
            ${new CodeBlock(S.nix_command_offline)}

            <h4>Offline best practices</h4>
            <div class="ul">
                <ul>
                    <li><strong>Ensure server-side idempotency</strong> — use request IDs or idempotency keys so replayed commands don't duplicate data.</li>
                    <li><strong>Keep payloads serializable</strong> — no class instances, functions, or circular references.</li>
                    <li><strong>Define replay policy per command</strong> — set <code>maxReplayAttempts</code> and <code>shouldEnqueue</code> appropriate to each domain.</li>
                    <li><strong>Show queue state in the UI</strong> — bind to <code>cmd.queuedCount</code> and <code>cmd.isQueued</code> to inform the user.</li>
                    <li><strong>Test with network throttling</strong> — simulate offline in dev tools to verify queue behavior.</li>
                </ul>
            </div>

            <h3>
                Conventions
            </h3>
            <div class="ul">
                <ul>
                    <li><strong>Query keys</strong> by bounded context: <code>"events/list"</code>, <code>"profile/current"</code>, <code>"posts/detail/42"</code>.</li>
                    <li><strong>Command keys</strong> by action: <code>"events/create"</code>, <code>"profile/save"</code>, <code>"orders/cancel"</code>.</li>
                    <li><strong>Use <code>invalidate</code></strong> on commands to keep queries in sync after mutations.</li>
                    <li><strong>Use <code>onMutate</code> + <code>onError</code></strong> for optimistic UI that feels instant.</li>
                    <li><strong>Use <code>queueOffline</code></strong> for any command that must survive network interruptions.</li>
                </ul>
            </div>

            <h3>
                API Overview
            </h3>

            <h4>Queries</h4>
            <div class="ul">
                <ul>
                    <li><code>createQuery(key, asyncFn, options?)</code> — key-based async read with cache and signals.</li>
                    <li><code>invalidateQueries(key)</code> — force re-fetch for all active instances of a key.</li>
                    <li><code>clearQueryCache(key?)</code> — remove one or all entries from cache.</li>
                    <li><code>setQueryCacheTime(ms)</code> — configure garbage collection retention.</li>
                    <li><code>getQueryData(key)</code> — read cached data without creating a query.</li>
                    <li><code>setQueryData(key, value)</code> — write data to cache and sync signals.</li>
                    <li><code>updateQueryData(key, updater)</code> — atomically update cached data.</li>
                </ul>
            </div>

            <h4>Commands</h4>
            <div class="ul">
                <ul>
                    <li><code>createCommand(commandKey, executeFn, options?)</code> — mutation with signals, retry, and lifecycle hooks.</li>
                    <li><code>cmd.execute(variables)</code> — fire-and-forget.</li>
                    <li><code>cmd.executeAsync(variables)</code> — promise-based.</li>
                    <li><code>cmd.reset()</code> / <code>cmd.cancel()</code> / <code>cmd.replayQueue()</code> / <code>cmd.clearQueue()</code>.</li>
                    <li>Signals: <code>status</code>, <code>data</code>, <code>error</code>, <code>variables</code>, <code>failureCount</code>, <code>inFlight</code>, <code>queuedCount</code>.</li>
                    <li>Computed: <code>isIdle</code>, <code>isPending</code>, <code>isSuccess</code>, <code>isError</code>, <code>isQueued</code>.</li>
                    <li>Hooks: <code>onMutate</code>, <code>onSuccess</code>, <code>onError</code>, <code>onSettled</code>.</li>
                    <li>Offline: <code>CommandQueuedError</code>, <code>CommandQueueAdapter</code>, <code>OfflineCommandEntry</code>.</li>
                </ul>
            </div>

            <h3>
                Best Practices
            </h3>
            <div class="ul">
                <ul>
                    <li><strong>Keep query keys predictable</strong> — use a consistent naming scheme so invalidation works across the app.</li>
                    <li><strong>Use <code>staleTime</code></strong> — prevent unnecessary refetches for data that changes rarely.</li>
                    <li><strong>Use <code>dedupeWindowMs</code></strong> — avoid double-submits on fast button clicks.</li>
                    <li><strong>Prefer <code>executeAsync</code> in forms</code></strong> — await the result before showing success or navigating.</li>
                    <li><strong>Implement rollback for optimistic updates</strong> — always provide <code>onError</code> when using <code>onMutate</code>.</li>
                    <li><strong>Use offline queue for critical writes</strong> — any action that must not be lost (orders, messages, edits) should use <code>queueOffline</code>.</li>
                    <li><strong>Clean up with <code>cancel()</code></strong> — abort in-flight commands when a component unmounts or the user navigates away.</li>
                </ul>
            </div>

            <div class="cl cl-i">
                <span class="cl-ic">📐</span>
                <p>
                    <strong>License:</strong> MIT — <code>@deijose/nix-query</code> is open source and free to use in any project.
                </p>
            </div>
        </div>
    `;
}
