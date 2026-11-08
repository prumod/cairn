// PROTOTYPE — writes one static, self-contained dist/preview.html:
// the client build's CSS inlined, the SSR build's markup in #root, no script.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(import.meta.dirname, "dist");
const { render } = await import(join(import.meta.dirname, "dist-ssr", "main.js"));
let html = readFileSync(join(dist, "index.html"), "utf8");

html = html.replace(
  /<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/g,
  (_m, href: string) => `<style>${readFileSync(join(dist, href), "utf8")}</style>`,
);

html = html.replace(/<script type="module"[^>]*><\/script>/g, "");

html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

// The preview host owns :root; scope the tokens to the panels only.
html = html.replace(/:root,\s*\[data-theme=(["']?)light\1\]/g, "[data-theme=light]");

html = html.replace(
  /@media \(prefers-color-scheme:\s*dark\)\{:root:not\(\[data-theme=(["']?)light\1\]\)\{[^}]*\}\}/g,
  "",
);

writeFileSync(join(dist, "preview.html"), html);

console.log("wrote", join(dist, "preview.html"), html.length, "bytes");
