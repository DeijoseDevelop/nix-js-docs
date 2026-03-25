# ❄️ Nix.js Documentation Site

The official documentation and live examples for the **Nix.js** micro-framework. Built 100% with Nix.js, demonstrating the power of signals and tagged templates for real-world applications.

> **[Visit Live Documentation →](https://nix-js.dev/)**

---

## 🏗 Project Essence

This documentation site avoids "documentation generators" and is instead built as a standard Nix.js application. It leverages:

- **Signal Reactivity**: Fine-grained DOM updates without a Virtual DOM.
- **Dynamic Routing**: Built-in Nix.js History API router.
- **Code Splitting**: Native `lazy()` loading for pages.
- **Advanced State**: Form validation and global stores.
- **Custom Components**: Clean, reusable `NixComponent` classes.

## 🚀 Development

This project uses **Vite** and **TypeScript** for the development server and build process.

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

- `src/main.ts`: Application entry point, router initialization, and layout.
- `src/pages/`: Documentation content as Nix.js components/templates.
- `src/components/`: Reusable UI elements (CodeBlock, Sidebar, etc.).
- `src/components/demos.ts`: Interactive, reactive code demonstrations.
- `src/data/`: Static snippets, page metadata, and navigation configuration.
- `src/style.css`: Modern, glassmorphic documentation styles.

## 🔗 Links of Interest

- **[Framework Core →](https://www.npmjs.com/package/@deijose/nix-js)**: The `@deijose/nix-js` package on NPM.
- **[Main Repository →](https://github.com/DeijoseDevelop/nix-js)**: Source code for the micro-framework.
- **[Nix.js + Ionic →](https://github.com/DeijoseDevelop/nix-ionic)**: Build native mobile apps with Nix.js reactivity and Ionic components.
- **[Performance Benchmark →](https://github.com/DeijoseDevelop/nix-js-framework-benchmark)**: Real-world stress testing results.
- **[Nix CLI →](https://github.com/DeijoseDevelop/create-nix-app)**: Scaffold new projects instantly.

---

*Built with passion by [Deiver Vasquez](https://github.com/DeijoseDevelop).*
*Nix.js v1.7.9*
