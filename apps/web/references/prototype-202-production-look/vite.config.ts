import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: import.meta.dirname,
  base: "./",
  plugins: [tailwindcss(), viteReact()],
  build: { outDir: "dist", emptyOutDir: true, assetsInlineLimit: 100_000_000, cssCodeSplit: false },
});
