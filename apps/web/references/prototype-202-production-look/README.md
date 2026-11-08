# PROTOTYPE — throwaway, never imported by `apps/web/src`

Question ([How does production replicate the final visual's look?](https://github.com/prumod/cairn/issues/202)):
how does production code express final-visual's look? One real component (the lote row,
with its prazo mark and selected state) is styled three ways, each in light and dark:

- `a-plain-css/` — tokens as CSS custom properties + one plain CSS file per component.
- `b-tailwind/` — the same tokens exposed to Tailwind v4 through `@theme`, utilities in JSX.
- `c-css-modules/` — the same tokens + a `.module.css` per component.

`tokens.css` is shared by all three: it is final-visual's `:root` block, unchanged.

Run from `apps/web`:

```sh
C=references/prototype-202-production-look/vite.config.ts
bun x vite build --config $C                                  # client build: the CSS
bun x vite build --config $C --ssr main.tsx --outDir dist-ssr # static markup
bun references/prototype-202-production-look/inline.ts        # writes dist/preview.html
```

Result: the three render identically in both themes. The verdict is in the ticket's resolution.
