# Do DR alterações identify a lote beyond its number?

Research for [#212](https://github.com/prumod/cairn/issues/212), input to [#205](https://github.com/prumod/cairn/issues/205). Written 2026-11-08. This note gives facts. The lote key is for #205 to decide.

Terms: an **anúncio** is a Diário da República (DR) notice. An **alteração** is an amended anúncio. It republishes the whole anúncio and names the version it changes. A **lote** is one lot of a procedure, printed as `LOT-000k`. The DR id (`IdIncm`) is the number in the PDF URL.

## Answers

1. **Changes.** In the 12 lote-bearing alterações, the lote count, lote numbers, descriptions, valor and prazo did not change. The CPV code did not change either; a name was added in 3 of them. The place code changed in 2 alterações. Place labels changed in 2 more. See [1. Changes](#1-changes-bullet-1).
2. **Restatement.** Yes. The 12 lote-bearing alterações repeat their full lote lists: 42 lote entries in total, each with description, valor, CPV, place and prazo. The lote entries do not mark what changed. The free-text «Descrição das Alterações» names no lote in any of the 100 paired alterações that have it. See [2. Restatement](#2-restatement-bullet-2).
3. **Identifiers beyond the number.** At lote level, no. The DR text gives only `LOT-000k`, and the same number recurs in every version and across procedures. `LOT-0001` is in all 55 lote-bearing versions. At procedure level, «Número de referência interna» is printed in all 566 documents and is the same across all 109 pairs. It is not unique: 5 values belong to more than one procedure. See [3. Identifiers](#3-identifiers-bullet-3).
4. **Renumbering.** Not in this sample. 0 of 109 pairs renumber, add or drop a lote. In 5 of the 12 lote-bearing pairs, the list order differs from the anúncio it changes. The numbers stay the same. See [4. Renumbering](#4-renumbering-bullet-4).

Read the counts as what we found, not as all alterações in the window. See [Population](#population).

## Population

| Frame                                                    | Documents | Anúncios | Alterações | Lote-bearing anúncios | Lote-bearing alterações |
| -------------------------------------------------------- | --------: | -------: | ---------: | --------------------: | ----------------------: |
| Census: 16 issues, 089, 094 … 164 (8 May to 25 Aug 2026) |       473 |      382 |         91 |                    33 |                      10 |
| Other documents in the same dates (outside census)       |        67 |       49 |         18 |                     9 |                       2 |
| Before 8 May 2026, or 2025                               |        26 |       22 |          4 |                     1 |                       0 |
| **Total**                                                |   **566** |  **453** |    **113** |                **43** |                  **12** |

- [`proposal-deadline.md`](proposal-deadline.md), line 5, gives the scope as «issues 089 to 164». The census uses 16 of those issues, every fifth one from 089. [`data/census_locate.tsv`](lote-identity-alteracoes/data/census_locate.tsv) maps each census document to its issue.
- Out-of-census documents were found by following «Alteração do Anúncio» links, not by listing an issue. Each census alteração names the anúncio it changes. If that anúncio is outside the census, it is fetched ([`fetch_originals.py`](lote-identity-alteracoes/scripts/fetch_originals.py)). Alterações outside the census that name such anúncios are fetched in turn ([`chain_targets.py`](lote-identity-alteracoes/scripts/chain_targets.py)). Some chains reach back to 2025: [419956928](https://files.diariodarepublica.pt/cp_hora/2026/04/070/419956928.pdf) changes 419905698, a 2025 anúncio found by a separate probe. So the 93 out-of-census documents are a link-followed set, not a sample.
- Of the 113 alterações, 109 pair with the anúncio they change. The 4 that do not pair are in the window: [419961691](https://files.diariodarepublica.pt/cp_hora/2026/05/097/419961691.pdf), [419962898](https://files.diariodarepublica.pt/cp_hora/2026/06/105/419962898.pdf), [419963111](https://files.diariodarepublica.pt/cp_hora/2026/06/107/419963111.pdf) and [419967113](https://files.diariodarepublica.pt/cp_hora/2026/07/135/419967113.pdf). Each names an anúncio that is not in the corpus. None has lotes.
- We did not search unsampled issues for alterações of census anúncios. A missing alteração would not appear in any count here, so the in-window counts are minimums.

## 1. Changes (bullet 1)

The table lists the 12 lote-bearing alterações. Each row compares its lote entries with the anúncio it changes.

| Alteração                                                                         | Frame          | Changes anúncio                                                                   | Lotes | Lote change found                                                                | Declared sections                            |
| --------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------- | ----: | -------------------------------------------------------------------------------- | -------------------------------------------- |
| [419961681](https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961681.pdf) | census         | [419958563](https://files.diariodarepublica.pt/cp_hora/2026/04/079/419958563.pdf) |     5 | list order reversed                                                              | Condições de Apresentação                    |
| [419965535](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965535.pdf) | census         | [419963577](https://files.diariodarepublica.pt/cp_hora/2026/06/110/419963577.pdf) |     6 | list order reversed; CPV name added (6); place label gained a name (6)           | Condições de Apresentação                    |
| [419964834](https://files.diariodarepublica.pt/cp_hora/2026/06/119/419964834.pdf) | census         | [419962544](https://files.diariodarepublica.pt/cp_hora/2026/06/106/419962544.pdf) |     2 | CPV name added (2); place label changed (2)                                      | Condições de Apresentação                    |
| [419965812](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965812.pdf) | census         | [419964668](https://files.diariodarepublica.pt/cp_hora/2026/06/117/419964668.pdf) |     2 | none                                                                             | Condições de Apresentação; Outros Requisitos |
| [419965809](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965809.pdf) | census         | [419964787](https://files.diariodarepublica.pt/cp_hora/2026/06/118/419964787.pdf) |     2 | none                                                                             | Condições de Apresentação                    |
| [419966402](https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966402.pdf) | census         | [419964514](https://files.diariodarepublica.pt/cp_hora/2026/06/115/419964514.pdf) |     2 | place code PT16E → PT192 (2)                                                     | Condições de Apresentação; Alteração         |
| [419966949](https://files.diariodarepublica.pt/cp_hora/2026/07/134/419966949.pdf) | census         | [419966438](https://files.diariodarepublica.pt/cp_hora/2026/07/131/419966438.pdf) |     5 | list order reversed                                                              | Condições de Apresentação                    |
| [419967898](https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967898.pdf) | census         | [419966405](https://files.diariodarepublica.pt/cp_hora/2026/07/128/419966405.pdf) |     2 | none                                                                             | Condições de Apresentação                    |
| [419970580](https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970580.pdf) | census         | [419969179](https://files.diariodarepublica.pt/cp_hora/2026/08/148/419969179.pdf) |     2 | none                                                                             | Condições de Apresentação                    |
| [419970342](https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970342.pdf) | census         | [419967303](https://files.diariodarepublica.pt/cp_hora/2026/07/137/419967303.pdf) |     3 | list order reversed                                                              | Condições de Apresentação                    |
| [419963577](https://files.diariodarepublica.pt/cp_hora/2026/06/110/419963577.pdf) | outside census | [419960426](https://files.diariodarepublica.pt/cp_hora/2026/05/090/419960426.pdf) |     6 | list order reversed                                                              | Condições de Apresentação                    |
| [419966438](https://files.diariodarepublica.pt/cp_hora/2026/07/131/419966438.pdf) | outside census | [419963843](https://files.diariodarepublica.pt/cp_hora/2026/06/111/419963843.pdf) |     5 | place code PT184 → PT1C2; place rows 10 → 7 on each lote (5); CPV name added (5) | Condições de Apresentação                    |

Summary by field, for the 12 alterações:

- **Count:** no change.
- **Numbers:** no change. The same `LOT-000k` set appears in each pair.
- **Description:** no change after normalising whitespace.
- **Valor:** no change.
- **Prazo de execução:** no change.
- **CPV:** the code did not change in any of the 12. In 3 alterações (419965535, 419964834, 419966438) the code gained a name, for example `45233141` → `45233141 - Manutenção de estradas`. That is 13 lote values.
- **Place:** the code changed in 2 alterações. In 419966402 it changed on 2 lotes. In 419966438 it changed on 5 lotes. On each, the place list fell from 10 rows to 7, so three locations are missing. Two more alterações (419965535, 419964834) changed the place label only, without a code change.
- **List order:** 5 pairs differ. 3 alterações list the lotes in descending order (419961681, 419966949, 419963577). 2 list them in ascending order (419965535, 419970342).
- **Proposal deadline:** not a lote field. «Prazo para apresentação das propostas» (section 13, «Condições de Apresentação») sits once per anúncio, outside the lote blocks. 50 of 55 lote-bearing versions have one such line. 4 alterações have a second line in «Descrição das Alterações» that repeats the date (419963577, 419965535, 419966438, 419966949). One lote-bearing version has none (419968590).

## 2. Restatement (bullet 2)

- Each lote-bearing alteração restates every lote: 42 lote entries in 12 alterações. All five fields (description, valor, CPV, place, prazo) are present for all 42.
- The lote entries do not mark what changed. A reader learns of a change from the header fields «Motivo da Alteração», «Identificador das Secções Alteradas do Anúncio Anterior» and «Descrição das Alterações».
- «Descrição das Alterações» is present in 100 of the 109 paired alterações. It names no lote in any of them. Examples: [419966438](https://files.diariodarepublica.pt/cp_hora/2026/07/131/419966438.pdf), «Prazo para apresentação das propostas: 15-07-2026 17:00»; [419970580](https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970580.pdf), «Modificação do prazo para a apresentação de propostas».
- Declared sections: all 12 lote-bearing alterações declare «Condições de Apresentação». [419965812](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965812.pdf) also declares «Outros Requisitos». [419966402](https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966402.pdf) also declares «Alteração».
- Section 9, «Local da execução do contrato», is declared by one alteração in all 109 pairs: [419967038](https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967038.pdf). It has no lote blocks.
- So a place change can happen without a section 9 declaration. That is the case for 419966402 and 419966438.

## 3. Identifiers (bullet 3)

**Lote level.** The only lote identifier is `LOT-000k`. The DR text prints «Identificador do Lote: LOT-000k» 697 times, and each time it repeats the number. It adds no identity.

- The same number appears in every version of a procedure and across procedures. `LOT-0001` appears in all 55 lote-bearing versions.
- Two lotes can share a description. This happens in 4 versions: [419966405](https://files.diariodarepublica.pt/cp_hora/2026/07/128/419966405.pdf), [419967898](https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967898.pdf), [419968614](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968614.pdf) and [419968674](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968674.pdf). In each, the valor or place tells the lotes apart.
- Some descriptions contain the number. In [419965746](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965746.pdf), LOT-0001 reads «… 2026 Lote 1» and LOT-0003 reads «… 2026 Lote 3».
- The DR text has no Portal BASE reference. The only «BASE» matches are «Base Aérea».

**Procedure level.** These are printed in the document and can link versions.

- **«Número de referência interna»** is in all 566 documents and in all 55 lote-bearing versions. The value is free text. Examples: «Empreitada 46/Gebalis/2026» in [419965809](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965809.pdf), and «2226001780» in [419969179](https://files.diariodarepublica.pt/cp_hora/2026/08/148/419969179.pdf), the anúncio that [419970580](https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970580.pdf) changes. It is the same in all 109 pairs.
- It is not unique. Across the 109 pairs, 5 values belong to more than one procedure. One is «40/2026»: [419968616](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968616.pdf) (Pedrógão Grande) and [419965151](https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965151.pdf) (Ribeira Brava). Another is «2026/300.10.001/14»: [419960349](https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960349.pdf) (Ribeira Grande), [419962623](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962623.pdf) (Ribeira Grande) and [419962828](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962828.pdf) (Lagos). The 5-value count covers pairs only. Across all 566 documents, 92 reference values appear on more than one document, mostly versions of one procedure.
- **«Anúncio de procedimento n.º N/YYYY»** is different in every version: all 566 are distinct. Each alteração names the version it changes. For example, [419965535](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965535.pdf) reads «Alteração do Anúncio de procedimento n.º 14899/2026, de 2026-06-09, com o ID 419963577». The number and the id match the paired anúncio in 109 of 109 pairs. So this chains versions. It does not identify a procedure.
- **DR id** (`IdIncm`): unique per version.
- **Not examined:** the NIPC of the entidade adjudicante, which [#209](https://github.com/prumod/cairn/issues/209) uses, and Cairn's platform ids. In this sample, the printed reference number and anúncio number do not identify a procedure on their own.

## 4. Renumbering (bullet 4)

- 0 of 109 pairs renumber a lote, add one or drop one.
- In 5 of the 12 lote-bearing pairs the list order differs from the anúncio it changes. The numbers stay the same (see [1. Changes](#1-changes-bullet-1)).
- One version has a gap: [419965746](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965746.pdf) lists LOT-0001 and LOT-0003, with no LOT-0002. Its procedure description reads «… - 2026 - Lote 1 e 3». No alteração of 419965746 is in our corpus, so we cannot say whether a lote was removed or a number was skipped.

## What matching lotes by number gets wrong

Number matching is correct for all 12 lote-bearing alterações, because the numbers never change. It fails in these cases:

1. **Across procedures.** `LOT-0001` is in every lote-bearing version, so a number-only key merges lotes from different procedures. The key needs a procedure identity. The printed reference number is not unique (see [3. Identifiers](#3-identifiers-bullet-3)), so #205 must choose another printed field or accept a risk here.
2. **Position matching.** Matching by list position pairs the wrong lotes in the 5 reordered pairs. Matching by number avoids this.
3. **Place changes.** Number matching keeps a lote's identity but says nothing about its place. In 419966402 and 419966438 the place changed, and neither alteração declares section 9. A check that compares numbers and counts reports «no lote change». That is the conclusion of M36.
4. **Repeated descriptions.** In 4 versions two lotes share a description. Matching by description pairs them at random. Valor or place is needed.
5. **Number reuse.** If a number were later given to a different lote, the DR text would show nothing. Not observed here (0 of 109). It cannot be detected from DR text alone.
6. **Number gaps.** A version can skip a number (419965746). Number matching cannot tell a removed lote from a skipped number without an earlier version.

## M36 and #182

- [#182 comment](https://github.com/prumod/cairn/issues/182#issuecomment-6668593131) says: «in 16 obras alterations … No alteration changed the preço base, lotes, location (section 9) or CPV.»
- [`docs/product/maybe/funcionalidades.md`](../product/maybe/funcionalidades.md), line 46 (M36), says: «Nenhuma de 16 alterações de anúncios de empreitadas mudou os lotes», and «os lotes associam-se pelo número».
- The 16 alterações are not listed by id. The three examples that #182 links are from issues 012 to 043 of 2026 (January to March), before our window. None of their ids is in our corpus: [419948076](https://files.diariodarepublica.pt/cp_hora/2026/01/012/419948076.pdf), [419949347](https://files.diariodarepublica.pt/cp_hora/2026/01/021/419949347.pdf), [419949623](https://files.diariodarepublica.pt/cp_hora/2026/01/021/419949623.pdf), [419950539](https://files.diariodarepublica.pt/cp_hora/2026/02/027/419950539.pdf), [419952616](https://files.diariodarepublica.pt/cp_hora/2026/03/043/419952616.pdf) and [419952852](https://files.diariodarepublica.pt/cp_hora/2026/03/043/419952852.pdf). All six links resolve to PDFs. So #182's population is probably not ours, but we cannot confirm it.
- In our window, the lote count, numbers, valor, prazo and CPV code did not change, which matches the claim. The place changed in 2 of 12, which would contradict «location (section 9)» if those two were among the 16.
- Recommendation: after #205 settles the key, name the changed fields in M36 instead of «mudou os lotes».

## Method and reproduction

- **Downloads.** PDFs come from `https://files.diariodarepublica.pt/cp_hora/YYYY/MM/NNN/<IdIncm>.pdf`, where `NNN` is the 3-digit issue. A missing PDF returns HTTP 200 with a ~2 KB HTML shell, so a download counts only if its body starts with `%PDF`. The check uses GET, because HEAD returned 405.
- **Text.** `pdftotext -layout`. [`lote_compare.py`](lote-identity-alteracoes/scripts/lote_compare.py) reads the «Nº: LOT» lists, the numbered section headings and the «Alteração do Anúncio» headers.
- **Validation.** 0 mismatches between the lote lists and the «Nº: LOT» lines. All 113 alteração headers parse. 109 match a pair in the table; the other 4 are listed under [Population](#population).
- **Pairs.** 109 pairs: 91 census alterações and 18 chain alterações. Each pairs with the anúncio named in its «com o ID» field. The number check agrees in 109 of 109 pairs.
- **Committed:** the scripts in [`scripts/`](lote-identity-alteracoes/scripts/) and the outputs in [`data/`](lote-identity-alteracoes/data/), both under `docs/research/lote-identity-alteracoes/`. Not committed: the PDFs and extracted text.
- **Rerun.** The scripts expect the scratch layout used for the run (`downloads/`, `text/`, `text-originals/`, `work/`). A rerun needs the PDFs fetched again.

Scripts (in `docs/research/lote-identity-alteracoes/scripts/`):

- [`lote_compare.py`](lote-identity-alteracoes/scripts/lote_compare.py): parser and pair comparison.
- [`lote_facts.py`](lote-identity-alteracoes/scripts/lote_facts.py): facts for the four bullets. Output in [`facts_run.log`](lote-identity-alteracoes/data/facts_run.log).
- [`population.py`](lote-identity-alteracoes/scripts/population.py): frame table. Output in [`population_run.log`](lote-identity-alteracoes/data/population_run.log).
- [`ref_check.py`](lote-identity-alteracoes/scripts/ref_check.py): procedure-level identifiers. Output in [`ref_check_run.log`](lote-identity-alteracoes/data/ref_check_run.log).
- [`locate_fetch.py`](lote-identity-alteracoes/scripts/locate_fetch.py), [`fetch_originals.py`](lote-identity-alteracoes/scripts/fetch_originals.py), [`chain_targets.py`](lote-identity-alteracoes/scripts/chain_targets.py), [`probe_2025.py`](lote-identity-alteracoes/scripts/probe_2025.py): population fetch and location.
- [`reconcile.py`](lote-identity-alteracoes/scripts/reconcile.py), [`pairs_view.py`](lote-identity-alteracoes/scripts/pairs_view.py), [`place_codes.py`](lote-identity-alteracoes/scripts/place_codes.py): checks.

Data (in `docs/research/lote-identity-alteracoes/data/`):

- [`lote_pairs.tsv`](lote-identity-alteracoes/data/lote_pairs.tsv): 109 pairs with per-field change counts.
- [`lote_entries.tsv`](lote-identity-alteracoes/data/lote_entries.tsv): every lote entry with its full text.
- [`docs.tsv`](lote-identity-alteracoes/data/docs.tsv): every document with its flags.
- [`census_locate.tsv`](lote-identity-alteracoes/data/census_locate.tsv), [`originals_locate.tsv`](lote-identity-alteracoes/data/originals_locate.tsv), [`chain_locate.tsv`](lote-identity-alteracoes/data/chain_locate.tsv): issue of each document.

## Caveats and unverified

- **`apps/collector` is absent.** `ls apps` lists only `web`, and no tracked file has «collector» in its name. [#194](https://github.com/prumod/cairn/issues/194) plans a `collector` app, so it is not yet written. The collector's DR parsing code and fixtures, which #212 asked us to read, were not available. The lote logic here comes from the PDFs alone.
- **Branch name.** The worktree was on `t3/research-lote-identity-alteracoes`. `origin` had no `research/lote-identity-alteracoes`, so this branch was created from `origin/main`.
- **Census is a sample.** See [Population](#population).
- **Place labels.** Place comparison normalises whitespace. A name added to a code counts as a label change, not a code change.
- **Platform and Portal BASE data** were not examined beyond the DR text. The NIPC from #209 was not checked.
- **M36's «16»** is not reproduced. See [M36 and #182](#m36-and-182).
