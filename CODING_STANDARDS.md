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

## Comments

A comment records what the code cannot express; delete any comment a reader could write from the code next to it. Follow [Code comments](docs/reference/code-comments.md) for interface, data-structure, implementation, and cross-module comments, and for writing interface comments before the implementation.

## Documentation

Follow [Documentation maintenance](docs/agents/documentation.md) when a change affects a documented contract. Keep these standards current when an agreed coding convention changes.
