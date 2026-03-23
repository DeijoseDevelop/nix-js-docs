const KW = new Set([
  'import', 'export', 'from', 'const', 'let', 'var', 'function', 'class',
  'extends', 'return', 'new', 'this', 'if', 'else', 'await', 'async',
  'true', 'false', 'null', 'undefined', 'typeof', 'void', 'default', 'of',
  'in', 'for', 'while', 'break', 'continue', 'type', 'interface', 'as',
  'static', 'private', 'public', 'protected', 'readonly', 'declare',
  'abstract', 'implements', 'instanceof', 'throw', 'try', 'catch', 'finally',
  'switch', 'case', 'delete', 'super', 'yield', 'get', 'set',
]);

const FN = new Set([
  'signal', 'computed', 'effect', 'batch', 'watch', 'untrack', 'nextTick',
  'html', 'repeat', 'ref', 'mount', 'createStore', 'createRouter', 'createForm',
  'useField', 'useFieldArray', 'createQuery', 'invalidateQueries',
  'clearQueryCache', 'suspend', 'lazy', 'provide', 'inject',
  'createInjectionKey', 'portal', 'transition', 'createErrorBoundary',
  'showWhen', 'RouterView', 'Link', 'useRouter', 'NixComponent', 'required',
  'minLength', 'maxLength', 'email', 'pattern', 'min', 'max',
  'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'fetch',
  'console', 'document', 'Object', 'Array', 'JSON', 'Math', 'Promise', 'Error',
  'render', 'onInit', 'onMount', 'onUnmount', 'onError', 'setChildren',
  'setSlot', 'createPortalOutlet', 'portalOutlet', 'provideOutlet',
  'injectOutlet', 'safeParse', 'flatten', 'navigate', 'replace', 'useRouter',
]);

const TOKS: [RegExp, string | null][] = [
  [/^(\/\/[^\n]*)/, 'c'],
  [/^(\/\*[\s\S]*?\*\/)/, 'c'],
  [/^(`(?:[^`\\]|\\[\s\S])*`)/, 't'],
  [/^("(?:[^"\\]|\\.)*")/, 's'],
  [/^('(?:[^'\\]|\\.)*')/, 's'],
  [/^(\d+(?:\.\d+)?(?:_\d+)*)/, 'n'],
  [/^([A-Za-z_$][A-Za-z0-9_$]*)/, null],
  [/^(=>)/, 'o'],
  [/^([\s\S])/, null],
];

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function highlight(raw: string): string {
  if (!raw) return '';
  let out = '';
  let src = raw;

  while (src.length) {
    let hit = false;
    for (const [rx, cls] of TOKS) {
      const m = src.match(rx);
      if (!m) continue;
      const tok = m[1];
      src = src.slice(tok.length);
      hit = true;

      if (cls === null && /^[A-Za-z_$]/.test(tok)) {
        if (KW.has(tok))      out += `<span class="k">${esc(tok)}</span>`;
        else if (FN.has(tok)) out += `<span class="f">${esc(tok)}</span>`;
        else                  out += esc(tok);
      } else if (cls) {
        out += `<span class="${cls}">${esc(tok)}</span>`;
      } else {
        out += esc(tok);
      }
      break;
    }
    if (!hit) { out += esc(src[0]); src = src.slice(1); }
  }
  return out;
}
