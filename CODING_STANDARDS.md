# Coding standards

## Sources of truth

Formatting, linting, and compiler rules live in the native tool configuration and root `package.json`; use the existing checks instead of maintaining a second style guide. Custom lint rules are vendored in `tools/oxlint/anti-slop/` as repository-owned code; record their upstream source and local deviations in its `UPSTREAM.md`. `bun run lint` runs them; fix findings instead of suppressing them, and justify each type assertion with a `// SAFETY:` comment. Follow [Architecture](ARCHITECTURE.md) for system boundaries and [Testing](TESTING.md) for test contracts.

## Code and contracts

- Use names that expose intent. For domain vocabulary and architectural decisions, follow [Domain docs](docs/agents/domain.md).
- Match types to the runtime values and states the code supports. Validate external input at the boundary where it enters the application.
- Make failure behavior explicit; preserve useful error context rather than silently treating a failure as success.
- Keep changes scoped to the requested behavior. Add dependencies or abstractions for a concrete need, not a hypothetical one. For data-structure design, follow [Data structures](docs/agents/data-structures.md).
- When replacing a code path or interface, remove the obsolete implementation rather than retaining compatibility layers.

## Classes, pattern names and file names

The code uses plain object-oriented forms and only the pattern names a junior developer understands. Base: [Which tactical patterns and control styles does the design use?](https://github.com/prumod/cairn/issues/203#issuecomment-6719884889).

- **Class or function.** Use a class when several functions belong together, or when a value and a function that uses it belong together. Data with no behaviour is a TypeScript `type`. Otherwise, use a plain function.
- **Pattern names in use:** Entity, Value Object, Repository, Use Case (one action), Service (a rule that spans several entities), Filter, and Source or Client (adapters).
- **Pattern names not used in code:** Aggregate (say «`Concurso` owns its lotes»), Policy, Specification and Criterion (use a `Filter` or an entity method), Read Model and Query object (use a repository method), Bounded Context, Anti-Corruption Layer and Domain Event.
- **The pattern appears in the declaration and in the file name:** `class Concurso extends Entity` in `concurso.entity.ts`; `class Radius extends ValueObject` in `radius.valueObject.ts`; `interface ConcursoRepository` in `concurso.repository.ts`, implemented by `DrizzleConcursoRepository` in `concurso.repository.server.ts` and `InMemoryConcursoRepository` in `concurso.repository.fake.ts`; `class SetLoteCategoriaUseCase` in `setLoteCategoria.useCase.ts`; `class DistanceFilter implements LoteFilter` in `distance.filter.ts`.
- **`extends` only for `Entity` and `ValueObject`**, whose base classes share real behaviour (identity equality; content equality and immutability). Repositories, filters and adapters `implement` an interface. Use cases and services have no base class.

## Module shape and dependencies

Base: [What properties should the code have, and not have?](https://github.com/prumod/cairn/issues/206).

- **Deep modules.** A module has one small entry point with the behaviour behind it. For example, `ListLotesUseCase.execute(context, search)` applies the filters, distance, estado, sort and grouping; its internal classes are not exported.
- **A seam only where two adapters exist.** Declare an `interface` with swappable adapters only where two adapters really exist, such as a Drizzle and an in-memory repository, a real and a fake clock, or a real and a fake model. Elsewhere, use the class directly, and extract the interface when the second adapter arrives.
- **Constructor injection, wired by hand.** A class receives its dependencies through its constructor. One composition file per app builds the objects with plain `new`; there is no DI container. Only the composition file branches on environment or configuration: it takes a Zod-parsed, typed `env`, handles a choice with several values as a union in an exhaustive `switch`, and picks the adapters. Classes never read `process.env` or bindings. The web app composes inside the request handler with that request's `env`; an app with a single process composes once at start.
- **Who changes what.** An entity changes only through its own methods, and its repository saves it. A value object never changes. View state and the selection return a new value on each change.
- **Use case shape.** A use case class takes its dependencies in its constructor and has one `execute(context, input)` method. A view action returns `{ view, step }`. The context holds the company, the actor and the current time; no input carries the company. Base: [What is the program design inside each Now module?](https://github.com/prumod/cairn/issues/235#issuecomment-6726996956).
- **One write per request.** Repositories queue their writes on the request's `WriteBatch`, and the request commits it once, as one database batch. A read in the same request does not see the queued writes, so code uses what a use case returns, not a read back.
- **Imports between modules.** A use case or domain file imports another module only through that module's public, framework-free root file, or through `src/shared/actions`. It never imports another module's infra.
- **What tests reach.** High-value tests reach only a module's interface (its entry point and the adapters at its seams), with real collaborators and no mocks. A typical test may import a private file of its own module, colocated with it, only to check a technical detail faster or more precisely. See [Testing](TESTING.md).

## Styling

Production starts from `apps/web/references/initial-visual/` and changes its look where the PRD or the technical design needs it ([evolution method](docs/product/system/prototype.md#produção--parte-do-initial-visual)), with Tailwind v4 utilities over initial-visual's tokens. Base: [How does production replicate the final visual's look?](https://github.com/prumod/cairn/issues/202#issuecomment-6725983558).

- **One stylesheet.** `apps/web/src/style.css` holds `@import "tailwindcss"`, initial-visual's colour tokens (CSS custom properties, unchanged), the `@theme` block and the base rules. Do not add other `.css` files.
- **Colours and font sizes come only from the theme:** `bg-panel`, `text-muted`, `border-line`, `text-amber`. Tailwind's default palette is removed. When initial-visual uses a font size the theme lacks, add it to `@theme` instead of writing `text-[11.5px]`. Other one-off geometry may use a bracket value, such as `pl-[34px]`.
- **No `dark:` classes.** The tokens switch with `data-theme` on `<html>`; class names stay the same in both themes.
- **No `@apply` and no class-merging library.** Write a conditional class as a template string, and a set of variants as a plain object: `const dueTone = { soon: "text-amber font-semibold", past: "italic" }`. When the same class list repeats in three places, extract a React component.
- **Fonts** are Inter and IBM Plex Mono, self-hosted and declared only as the theme's `--font-sans` and `--font-mono`. The page makes no request to a font service.

## Comments

A comment records what the code cannot express; delete any comment a reader could write from the code next to it. Follow [Code comments](docs/reference/code-comments.md) for interface, data-structure, implementation, and cross-module comments, and for writing interface comments before the implementation.

## Documentation

Follow [Documentation maintenance](docs/agents/documentation.md) when a change affects a documented contract. Keep these standards current when an agreed coding convention changes.
