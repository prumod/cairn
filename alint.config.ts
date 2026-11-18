import { defineConfig } from "@alint-js/cli";
import semanticPlugin from "@cairn/alint-plugin-semantic";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"],
    ignores: ["**/node_modules/**", "**/dist/**", "**/.alchemy/**", "**/.tanstack/**"],
    plugins: {
      semantic: semanticPlugin,
    },
    rules: {
      "semantic/file": "off",
      "semantic/function": "off",
      "semantic/document": "off",
    },
  },
]);
