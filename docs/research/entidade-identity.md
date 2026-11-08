# What identifies an entidade adjudicante

**Research date:** 2026-11-08
**Issue:** [prumod/cairn#209](https://github.com/prumod/cairn/issues/209) (map [prumod/cairn#193](https://github.com/prumod/cairn/issues/193))
**Scope:** The structured identifier and the name of the entidade adjudicante on a Diário da República procurement anúncio (Série II, Parte L), and how the collector should key it. Decisions only; no implementation.

## Answer

The entidade adjudicante is identified by its **NIPC** (Número de Identificação de Pessoa Coletiva), a 9-digit number. Every anúncio prints it in section 1, field 1.3, under the designação. The Portaria makes this field mandatory for national publication.

- **Key:** the NIPC, stored once per entidade, unique and nullable.
- **URL id:** a surrogate id, created once per NIPC and never changed. `entidadeIds` from #199 carries it.
- **Fallback when the NIPC is missing or malformed:** keep the raw value, raise a flag, and create an entidade with no NIPC. Match it only by normalised name, and only against other rows with no NIPC.

## Recommendation

Each item answers one sub-question in #209.

1. **Key.** Read the NIPC from section 1, field 1.3 only. Strip spaces and any `PT` prefix, and keep the raw value beside it. Do not key on the name.
2. **URL id.** Use a surrogate id for the entidade, made once for each NIPC and never changed. This matches the surrogate policy for concurso and lote in #205. A corrected NIPC or a new name then does not change the URL.
3. **Table or column.** Use its own table, named `entidade_adjudicante` (the glossary term; see the naming note below). `concurso` references it through `entidade_adjudicante_id`. The collector writes it in the same `db.batch` as the concurso, as #205 requires. It is not part of the concurso aggregate, because one entidade has many concursos.
4. **Name.** Show the designação from the current anúncio, the one #205 uses for concurso data. Keep each designação seen as a dated alias. Collapse line-wrap whitespace before any comparison. Never use an alias as a key.
5. **Duplicates and conflicts.**
   - Same NIPC, different names: one entidade.
   - Same name, different NIPCs: two entidades.
   - Never merge by name when a NIPC exists.
6. **Missing or malformed NIPC.** Keep the raw value and raise a flag. Create an entidade with `nipc` NULL. Match it only by normalised designação against other NULL-NIPC rows, never against a row that has a NIPC. Do not reject the anúncio. A failed mod-11 check is also a flag, not a rejection, because the check rule is not verified for NIPC (see Unverified). The flag is a new reason; check whether the PRD needs a change entry.
7. **Filter options.** Offer the entidades that have at least one lote inside the company's radius. Do not narrow this list with the other filters, so that choosing one entidade cannot empty the list. This is a product choice; confirm it with the user.
8. **Joint procurement.** Section 7.2 («aquisição conjunta») repeats an NIPC and designação row for each co-buyer (7.2.1.1). So one concurso can have more than one entidade. None of the three sample anúncios has it (all say 7.2 «Não»). Start with one entidade from section 1. Add a child table only when a census shows joint procurements.

**Naming note.** [`GLOSSARY.md`](https://github.com/prumod/cairn/blob/main/GLOSSARY.md#L71-L74) lists «entidade» under «Evitar» for this concept. Use «entidade adjudicante» in prose. The id type and URL parameter stay as #199 set them: `EntidadeId` and `entidadeIds`.

## Findings

### F1. Section 1 has a mandatory NIPC field

Portaria n.º 318-A/2023, Anexo I (concurso público model), section 1:

- 1.2 Designação da entidade adjudicante: Texto, Obrigatório for national and international publication.
- 1.3 NIPC: Numérico, Obrigatório for national and international publication.

The NIPC row is on PDF page 5. The other anúncio annexes repeat these rows.

### F2. Three real anúncios carry a valid-looking NIPC in section 1

| Anúncio (DR)                                                                                                                  | Designação in section 1                                                   | NIPC      | Mod-11 check |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------- | ------------ |
| [Anúncio n.º 13991/2026](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962843.pdf), 2.ª série n.º 104, 29-05-2026 | Universidade de Aveiro                                                    | 501461108 | pass         |
| [Anúncio n.º 14844/2026](https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963726.pdf), 2.ª série n.º 109, 08-06-2026 | Gebalis - Gestão do Arrendamento da Habitação Municipal de Lisboa, EM, SA | 503541567 | pass         |
| [Anúncio n.º 26429/2026](https://files.diariodarepublica.pt/cp_hora/2026/11/213/419976724.pdf), 2.ª série n.º 213, 03-11-2026 | Município de Cascais                                                      | 505187531 | pass         |

In all three, the NIPC is the line after the designação, labelled «NIPC:». Every NIPC has 9 digits.

Section 27 (órgão de recursos) also names an entity, but it has no NIPC:

- Universidade de Aveiro: «Designação: Reitor da Universidade de Aveiro».
- Gebalis: «Designação: Conselho de Administração».
- Cascais: «Designação: Câmara Municipal de Cascais».

The parser must read section 1 only. The Cascais case shows that section 27 can name the same entity differently.

### F3. The name can wrap and vary

- Gebalis wraps its designação onto a second line («…EM,» / «SA»). Any parser that reads one line gets a truncated name.
- Cascais names the entity «Município de Cascais» in section 1 and «Câmara Municipal de Cascais» in section 27. This is a different field, not a conflict within section 1.

### F4. DL 129/98: the NIPC is sequential and assigned only by the RNPC

Quoted from a fetch summary of the consolidated text (arts. 13 to 15 of Decreto-Lei n.º 129/98). The quotes are not checked against the Diário da República text (see Method).

- Art. 13.º n.º 1: each entity registered in the FCPC receives its own identification number.
- Art. 13.º n.º 2: the NIPC is a sequential nine-digit number. The first digit is 5 to 9, excluding 7.
- Art. 14.º n.º 1: only the RNPC, or the designated registry services, may assign a NIPC. No other entity may assign a number that could be confused with it.
- Art. 15.º n.º 1 and n.º 3: an admissibility certificate comes with a provisional NIPC. The provisional NIPC lasts as long as its certificate.

The excerpt does not say whether a NIPC stays the same when the name, the seat or the legal form changes. It also does not cover transformation, merger or extinction.

### F5. The repo has no collector code, fixtures or NIPC data

- On `origin/main`, `git ls-tree` finds no `apps/collector` and no fixtures.
- The only DR parser is [`docs/research/proposal-deadline/extract.py`](proposal-deadline/extract.py). It reads section 13 («Prazo para apresentação das propostas») only.
- The 473-anúncio census in [`classified.tsv`](proposal-deadline/classified.tsv) has deadline classes only. Its PDF text is not committed, so NIPC prevalence cannot be measured from the repo.
- The ticket says «NIF». The form prints «NIPC». This note uses NIPC.

## Method

1. Read #209, the comments on #199 and #205, `README.md`, `AGENTS.md`, `GLOSSARY.md` and `docs/research/proposal-deadline.md` with its scripts. Searched `origin/main` for collector code and fixtures.
2. Downloaded the Portaria and the three anúncios into a new, empty directory. Treated them as untrusted and did not run anything from them. Extracted text with `pdftotext -layout` and read sections 1 and 27 by hand.
3. Ran the mod-11 check on the three NIPCs. The script ran outside the repo with `python3 -I` and is not committed.
4. Fetched DL 129/98 from its Diário da República page and from pgdlisboa, and fetched the IRN registry page. The Diário da República page returned an empty script shell, so the DL 129/98 text comes from the pgdlisboa fetch summary.

## Sources

- Portaria n.º 318-A/2023, DR 1.ª série n.º 207, 25-10-2023: [files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf). Used for Anexo I sections 1 and 7.2, PDF pages 5 and 7. SHA-256 `4049d22605eebf8971aa307b36e8ee73dae87d51819baaefaab8401a00127529`.
- Anúncios in F2: the three PDFs linked in the table. SHA-256 values in order:
  - `20ee266c05d9719373d69c4c9390296e4d693d747c2195ae5f3f95e7dc75ce6c`
  - `028a09cf63fa4a2cce6936509601b79602475811b42ba96e199ac48f32d2b20d`
  - `3b81298157ce9e38789aa94a74b18323a82dcc48cdf1ff51cf982342a34fec2e`
- Decreto-Lei n.º 129/98: [diariodarepublica.pt/dr/detalhe/decreto-lei/129-1998-522842](https://diariodarepublica.pt/dr/detalhe/decreto-lei/129-1998-522842) (empty shell when fetched). Text read through [pgdlisboa, articulado](https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?artigo_id=688A0017&nid=688&tabela=leis&pagina=1&ficha=1&nversao=), a partial excerpt covering arts. 12 to 21-A.
- [IRN, Registo Nacional de Pessoas Coletivas](https://irn.justica.gov.pt/Servicos/Empresas-e-outras-pessoas-coletivas/Registo-Nacional-de-Pessoas-Coletivas). First 100,000 of 123,889 characters read.
- Repo: [`GLOSSARY.md` lines 71–74](https://github.com/prumod/cairn/blob/main/GLOSSARY.md#L71-L74); [#199](https://github.com/prumod/cairn/issues/199) and [#205](https://github.com/prumod/cairn/issues/205) resolutions.

## Verified

- The Portaria makes the NIPC field (1.3) mandatory for national publication, and the designação field (1.2) too.
- Section 7.2.1.1 allows a repeated NIPC and designação row for each co-buyer.
- All three sample anúncios have a 9-digit NIPC directly under the section 1 designação. All three pass the mod-11 check.
- Section 27 names an entity without a NIPC, so a parser must read section 1 only.
- A designação can wrap onto a second line.
- The repo has no collector code or fixtures, and no NIPC data.

## Unverified

- **Permanence.** Whether a NIPC stays the same through a name, seat or legal-form change, a merger, or an extinction. The DL excerpt does not say, and arts. 1 to 11 and 22 to 92 were not read.
- **NIF equals NIPC.** Not confirmed in a primary source. The IRN page has a phrase about «efeitos fiscais» that I could not place.
- **Check digit.** The mod-11 rule is the NIF rule. All three samples pass it, but its application to NIPC is not confirmed. Treat it as a flag, not a rejection.
- **Prevalence.** Three anúncios is a small sample. Every one had a valid-looking NIPC, but the rate of missing or malformed NIPCs across the portal is unmeasured. Re-running section 1 extraction over the 473 census PDFs would measure it. Those PDFs are not in the repo.
- **Joint procurement.** How often section 7.2 is «Sim» is unknown.
- **Name variation.** How often one NIPC appears under several designações across anúncios is unknown.
- **DL 129/98 wording.** The quotes come from a fetch summary, not the official text.
- **IRN page.** Characters 100,000 to 123,889 were not read.
