import { html } from '@deijose/nix-js';
import type { NixTemplate } from '@deijose/nix-js';
import { CodeBlock } from '../components/CodeBlock';
import { S } from '../data/snippets';
import { DemoForm } from '../components/demos';

export function FormsPage(): NixTemplate {
  return html`
    <div>
      <h2 class="page-title">Forms</h2>
      <p class="page-sub">Built-in form management with <code>createForm()</code> and <code>nixField()</code>. Validation,
        Zod integration, dynamic field arrays — zero extra dependencies.</p>
    
      <h3>nixField() — Single Field</h3>
      ${new CodeBlock(S.form_field)}
    
      <h3>createForm() — Full Form</h3>
      ${new CodeBlock(S.form_create)}
    
      <h3>Nested Fields (dot-path)</h3>
      <p>Use dot-path keys for nested objects, for example <code>address.city</code>. This works in <code>validators</code>,
        <code>fields</code>, and <code>setErrors()</code>.</p>
      ${new CodeBlock(S.form_nested)}
    
      <h3>Cross-Field Validation</h3>
      <p>Validators can receive full form values as a second argument: <code>(value, allValues?)</code>. Use this for
        password confirmation, date ranges, or conditional required fields.</p>
      ${new CodeBlock(S.form_cross_field)}
    
      <div class="tbl">
        <table>
          <tr>
            <th>Property / Method</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
          <tr>
            <td><code>fields.name.value</code> / <code>fields['address.city'].value</code></td>
            <td>Signal&lt;T&gt;</td>
            <td>Current field value — read/write (top-level and nested)</td>
          </tr>
          <tr>
            <td><code>fields.name.error</code></td>
            <td>Signal&lt;string|null&gt;</td>
            <td>Validator error (reactive)</td>
          </tr>
          <tr>
            <td><code>fields.name.touched</code></td>
            <td>Signal&lt;boolean&gt;</td>
            <td>True after first blur</td>
          </tr>
          <tr>
            <td><code>fields.name.dirty</code></td>
            <td>Signal&lt;boolean&gt;</td>
            <td>True after first input</td>
          </tr>
          <tr>
            <td><code>fields.name.onInput</code></td>
            <td>EventHandler</td>
            <td>Attach to @input</td>
          </tr>
          <tr>
            <td><code>fields.name.onBlur</code></td>
            <td>EventHandler</td>
            <td>Attach to @blur</td>
          </tr>
          <tr>
            <td><code>form.values</code></td>
            <td>Signal&lt;T&gt;</td>
            <td>Reactive snapshot of all values</td>
          </tr>
          <tr>
            <td><code>form.valid</code></td>
            <td>Signal&lt;boolean&gt;</td>
            <td>True if no visible errors</td>
          </tr>
          <tr>
            <td><code>form.isSubmitting</code></td>
            <td>Signal&lt;boolean&gt;</td>
            <td>True while async handleSubmit runs</td>
          </tr>
          <tr>
            <td><code>form.submitCount</code></td>
            <td>Signal&lt;number&gt;</td>
            <td>Number of submit attempts</td>
          </tr>
          <tr>
            <td><code>form.handleSubmit(fn)</code></td>
            <td>EventHandler</td>
            <td>Validates then calls fn(values)</td>
          </tr>
          <tr>
            <td><code>form.setErrors(map)</code></td>
            <td>void</td>
            <td>Inject server-side errors (supports dot-path keys)</td>
          </tr>
          <tr>
            <td><code>form.setValue(path, value, opts?)</code></td>
            <td>void</td>
            <td>Set one field by top-level or dot-path. Options: <code>shouldDirty</code>, <code>shouldTouch</code>, <code>shouldValidate</code></td>
          </tr>
          <tr>
            <td><code>form.setValues(values, opts?)</code></td>
            <td>void</td>
            <td>Set multiple fields at once. Options: <code>keepDirty</code>, <code>keepTouched</code>, <code>keepErrors</code></td>
          </tr>
          <tr>
            <td><code>form.reset(newValues?)</code></td>
            <td>void</td>
            <td>Restore initial values. When given an argument, it becomes the new baseline</td>
          </tr>
        </table>
      </div>

      <h3>Programmatic Value Manipulation</h3>
      <p>Load data after fetching, pre-fill forms, or reset to a new baseline without touching every field manually.</p>
      ${new CodeBlock(S.forms_programmatic)}

      <h3>Built-in Validators</h3>
      <div class="tbl">
        <table>
          <tr>
            <th>Validator</th>
            <th>Signature</th>
            <th>Description</th>
          </tr>
          <tr>
            <td><code>required()</code></td>
            <td>(msg?)</td>
            <td>Non-empty value</td>
          </tr>
          <tr>
            <td><code>minLength(n)</code></td>
            <td>(n, msg?)</td>
            <td>String length ≥ n</td>
          </tr>
          <tr>
            <td><code>maxLength(n)</code></td>
            <td>(n, msg?)</td>
            <td>String length ≤ n</td>
          </tr>
          <tr>
            <td><code>email()</code></td>
            <td>(msg?)</td>
            <td>Valid email format</td>
          </tr>
          <tr>
            <td><code>pattern(re)</code></td>
            <td>(regex, msg?)</td>
            <td>Matches RegExp</td>
          </tr>
          <tr>
            <td><code>min(n)</code></td>
            <td>(n, msg?)</td>
            <td>Number ≥ n</td>
          </tr>
          <tr>
            <td><code>max(n)</code></td>
            <td>(n, msg?)</td>
            <td>Number ≤ n</td>
          </tr>
        </table>
      </div>
    
      <h3>Zod / Valibot Interop</h3>
      <p>Use the <code>validate</code> option in <code>createForm()</code> to plug in any schema library.</p>
      ${new CodeBlock(S.form_zod)}
    
      <h3>Dynamic Field Arrays</h3>
      <p>Manage dynamic lists of field groups with <code>nixFieldArray()</code>.</p>
      ${new CodeBlock(S.form_array)}

      <h3>Array Value Manipulation</h3>
      <p>Replace, patch, or reset the whole array without rebuilding the template manually.</p>
      ${new CodeBlock(S.forms_array_programmatic)}

      <div class="cl cl-t"><span class="cl-ic">💡</span>
        <p>Custom validators are simple functions: <code>(value: T, allValues?: FormValues) =&gt; string | null</code>.
          Returning <code>null</code> means valid, a string is the error message.</p>
      </div>
    
      <h3>Live Demo</h3>
      <div class="demo">
        <div class="demo-lbl">Registration form — live validation + computed strength</div>
        <div class="demo-grid">
          ${DemoForm()}
        </div>
      </div>
    </div>
  `;
}
