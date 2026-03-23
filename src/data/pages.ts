export interface PageMeta {
  id: string;
  label: string;
  grp: string;
}

export const PAGES: PageMeta[] = [
  { id: 'intro',      label: 'Introduction',        grp: 'Getting Started' },
  { id: 'install',    label: 'Installation',         grp: 'Getting Started' },
  { id: 'reactivity', label: 'Reactivity',           grp: 'Core' },
  { id: 'templates',  label: 'Templates',            grp: 'Core' },
  { id: 'components', label: 'Components',           grp: 'Core' },
  { id: 'stores',     label: 'Global Stores',        grp: 'State' },
  { id: 'router',     label: 'Router',               grp: 'State' },
  { id: 'forms',      label: 'Forms',                grp: 'State' },
  { id: 'async',      label: 'Async & Lazy',         grp: 'State' },
  { id: 'di',         label: 'Dependency Injection', grp: 'Advanced' },
  { id: 'portals',    label: 'Portals',              grp: 'Advanced' },
  { id: 'transitions',label: 'Transitions',          grp: 'Advanced' },
  { id: 'errors',     label: 'Error Boundaries',     grp: 'Advanced' },
  { id: 'show',       label: 'Show / Hide',          grp: 'Advanced' },
  { id: 'comparison', label: 'Comparison',           grp: 'Reference' },
  { id: 'api',        label: 'API Reference',        grp: 'Reference' },
];
