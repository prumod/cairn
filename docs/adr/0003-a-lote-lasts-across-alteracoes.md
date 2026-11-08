# A lote keeps one identity across alterações

## Status

Accepted

## Context

The Diário da República (DR) identifies a lote only inside one anúncio, as «Identificador do Lote: LOT-000k». An alteração republishes the whole anúncio with its own list of lotes, and nothing in it says which earlier lote each entry continues. Comments, citations, selection, a company's manual categoria, the assistant's data-change records and, later, proposals and contracts all refer to lotes. PRD #104 rule 11 says lotes, comments and selection stay after an alteração, and rule 13 says no collection replaces a manual categoria.

## Decision

A lote is one lote for the life of its concurso ([What does the Concurso aggregate protect during collection?](https://github.com/prumod/cairn/issues/205#issuecomment-6723174112)):

- It has a surrogate id that never changes, with a unique key on (concurso id, lote number). The lote number is the `k` of `LOT-000k`.
- Each alteração matches its lotes to the concurso's lotes by that number, never by list position, description or «Número de referência interna». A matched lote takes all its data from the current anúncio, place included.
- A new number adds a lote. A missing number keeps its lote with its last data. Either sets the concurso ⚠ «Lotes alterados no anúncio». Lotes are never deleted.
- Every reference keys on the lote id. The collector never writes the records that refer to it.

The evidence:

- In [Do DR alterações identify a lote beyond its number?](https://github.com/prumod/cairn/issues/212#issuecomment-6722785860), 0 of 109 alteração pairs renumber, add or drop a lote, and 5 pairs reorder the list.
- The [eForms guidance](https://docs.ted.europa.eu/eforms/latest/schema/procedure-lot-part-information.html#_introduction), which the DR models implement ([Portaria n.º 318-A/2023](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf#page=3)), says «the same Lot will have the same technical identifier from the start to the end of the procurement procedure».

## Considered options

- **A lote per anúncio, keyed (anúncio, number).** To keep rules 11 and 13, either the collector carries every reference forward by number, writing company-scoped records against [ADR 0002](0002-one-company-now-scoped-by-company.md), or references resolve on read by (concurso, number), which drops the stable id. It still needs the same number match.
- **One lasting lote plus its values in each anúncio.** Now never shows earlier values. This can be added later without changing the lote id, but only for alterações collected after it exists.

## Consequences

- A lote's values in an earlier anúncio are not kept. They stay reachable through that anúncio's DR link.
- An entidade that relabels lotes without changing their count cannot be detected from DR text. This has not been observed, and it is accepted as a rare case under PRD rule 14.
