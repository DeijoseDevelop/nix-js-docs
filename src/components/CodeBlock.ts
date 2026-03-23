import { NixComponent, html, signal, ref } from '@deijose/nix-js';
import { highlight } from '../utils/highlighter';

const noHlLangs = new Set(['html', 'css', 'bash', 'text', 'json', 'sh']);
const esc = (s: string) => {
  if (typeof s !== 'string' || !s) return ''; // Safety check for esc
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export class CodeBlock extends NixComponent {
  private code: string;
  private lang: string;
  private copied = signal(false);
  private preRef = ref<HTMLPreElement>();

  constructor(code: string, lang = 'typescript') {
    super();
    this.code = code;
    this.lang = lang;
  }

  render() {
    return html`
      <div class="cb">
        <div class="cb-head">
          <span class="cb-lang">${this.lang}</span>
          <button class=${() => `cb-copy${this.copied.value ? ' ok' : ''}`}
            @click=${() => {
              navigator.clipboard?.writeText(this.code).catch(() => {});
              this.copied.value = true;
              setTimeout(() => (this.copied.value = false), 1600);
            }}>
            ${() => this.copied.value ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre ref=${this.preRef}></pre>
      </div>
    `;
  }

  onMount() {
    if (this.preRef.el) {
      const content = this.code || '// No content available';
      this.preRef.el.innerHTML = noHlLangs.has(this.lang)
        ? esc(content)
        : highlight(content);
    }
  }
}
