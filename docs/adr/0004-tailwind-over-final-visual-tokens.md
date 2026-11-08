# Production styles final-visual with Tailwind over its tokens

## Status

Accepted

## Context

`apps/web/references/final-visual/` fixes the look of Now, in light and dark ([Which final-visual conflicts change the UI?](https://github.com/prumod/cairn/issues/149)). It is one HTML file with about 1 400 lines of hand-written CSS over 15 colour tokens (CSS custom properties). Production must replicate it exactly, and three junior developers will write and maintain the components.

## Decision

Production writes Tailwind v4 utilities in each component's `className`, over final-visual's tokens ([How does production replicate the final visual's look?](https://github.com/prumod/cairn/issues/202), user's choice after a prototype):

- The tokens are copied unchanged into `apps/web/src/style.css`, light on `:root` and dark under `data-theme="dark"` or the system preference, with final-visual's selectors.
- `@theme inline` maps each token to a Tailwind colour and removes Tailwind's default palette, so components use only final-visual's colours. Dark mode switches token values; components use no `dark:` classes.
- Final-visual's off-scale font sizes become named theme values; the fonts (Inter, IBM Plex Mono) are self-hosted theme fonts.

## Considered options

- **CSS Modules over the same tokens** (the agent's recommendation). Final-visual's rules port almost verbatim into one `.module.css` per component, and Vite scopes the names. Rejected by the user in favour of Tailwind.
- **Plain global CSS over the same tokens.** Ports verbatim, but class names are global, and juniors must keep them unique by convention.

## Consequences

- Each final-visual rule is translated into utilities by hand when its component is built; screenshots against final-visual catch drift.
- A component's look lives in its own file; there are no class names to invent and no per-component stylesheets.
- Changing approach later means rewriting every component's `className`.
