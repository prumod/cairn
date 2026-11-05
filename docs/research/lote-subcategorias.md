# Alvará subcategorias per lote in DR Parte L empreitada anúncios

**Research date:** 2026-11-05
**Issue:** prumod/cairn#165
**Scope:** Série II, Parte L anúncios of Empreitada de Obras Públicas, procedure types Concurso público and Concurso limitado por prévia qualificação, issues 089 to 164 (8 May to 25 August 2026). Only section 12 (Documentos de habilitação) is studied. The question is what Cairn can read there, and what the bidder must hold.

## Finding

1. **What Cairn can find (observed).** Section 12 names alvará subcategorias in 258 of 473 notices (54.5%). The text is written per anúncio, not per lote. Section 12 is one text per anúncio, so it cannot separate lots. Of the 43 lot notices, 19 name subcategorias (44.2%). Most other notices defer to the programa de procedimento instead (78 notices, 16.5%). No subcategoria and no class is named in 54 more (11.4%).
2. **CPV route (not measured).** No official map from CPV codes to annex I subcategorias was found. The CPV codes in these notices are mostly generic works codes. The "exactly one subcategoria" rate cannot be computed without a map. Building one would be a judgment, not a source-based count.
3. **Who holds what (from the law).** The bidder must present an alvará or certificado that contains the habilitações needed for the works (CCP art. 81.º n.º 2; Portaria 372/2017 art. 3.º n.º 1). The company responsible for the works must hold a subcategoria in a class that covers the global value (Lei 41/2015 art. 8.º; Portaria 372/2017 art. 6.º n.º 2 for groups). Specialised parts may be covered by a subcontractor's alvará, if the subcontractor signs a declaration (Portaria 372/2017 art. 3.º n.º 2).

## Sample and method

- **Frame.** The 16 weekly issues are the same as in the prior branch: folders 2026/05/089 to 2026/08/164, one every five issue numbers from 089. The census probes every notice id in each issue's id window with an HTTP HEAD request to `files.diariodarepublica.pt`. The probe found 1,933 Parte L notices (16,392 probes). Each was downloaded and converted to text with `pdftotext -layout`.
- **Empreitada filter.** A notice is in the frame if its Tipo de Contrato Principal is Empreitada de Obras Públicas and its Tipo de Procedimento is Concurso público (468) or Concurso limitado por prévia qualificação (5). That gives 473 notices. The prior branch had 474. The extra one there is a Concurso público simplificado notice (id 419966513). This branch excludes it by exact match. The prior count probably included it through a substring match. This is not confirmed.
- **Excluded.** Ten notices have no contract type. Each one is a sale of movable goods (alienação de bens móveis, for example a Hasta Pública for scrap). None is a works contract.
- **Coding.** Each section 12 text was coded as one of: names a subcategoria by ordinal (for example "4.ª subcategoria da 1.ª categoria") or by annex I name; names a subcategoria word only; class only; defers to the programa de procedimento or peças; silent; no alvará requirement (Não); no section 12 text. The coder was a script (regular expressions). It is not hand-coded. The annex I list used for name matching is the 59 subcategorias in `docs/research/lei-41-2015-anexo-i.md` on branch `research/lei-41-2015-anexo-i`.
- **Sample type.** The frame is a census of 16 issues. It is not a random draw from all Parte L notices. The Wilson intervals below treat it as a sample. They are approximate.

## Counts (Wilson 95% CI)

Denominator for Q1 is 473 empreitada notices.

| Section 12 coding                                      | Count | Share (Wilson 95% CI)  |
| ------------------------------------------------------ | ----- | ---------------------- |
| Names a subcategoria (ordinal or annex name)           | 258   | 54.5% (50.0% to 59.0%) |
| Names a subcategoria word only, no ordinal or name     | 5     | 1.1% (0.5% to 2.5%)    |
| Class only, no subcategoria                            | 4     | 0.8% (0.3% to 2.2%)    |
| Defers to peças or programa de procedimento            | 78    | 16.5% (13.4% to 20.1%) |
| Silent (alvará or documents, no subcategoria or class) | 54    | 11.4% (8.9% to 14.6%)  |
| No alvará requirement (Não)                            | 72    | 15.2% (12.3% to 18.7%) |
| No section 12 text                                     | 2     | 0.4% (0.1% to 1.5%)    |

**Lot notices (43 notices, 137 lot blocks).**

| Measure                                        | Count     | Share (Wilson 95% CI)  |
| ---------------------------------------------- | --------- | ---------------------- |
| Lot notices that name a subcategoria           | 19 of 43  | 44.2% (30.4% to 58.9%) |
| Lot blocks in notices that name a subcategoria | 58 of 137 | 42.3% (34.4% to 50.7%) |
| Lot notices whose section 12 mentions "lote"   | 7 of 43   | not computed           |

**Among the 258 notices that name a subcategoria.**

| Measure                                                                            | Count | Share (Wilson 95% CI)  |
| ---------------------------------------------------------------------------------- | ----- | ---------------------- |
| Exactly one distinct subcategoria named                                            | 117   | 45.3% (39.4% to 51.4%) |
| Text has main-value wording (valor global, total or da proposta)                   | 202   | 78.3% (72.9% to 82.9%) |
| Text has specialised-part wording (partes da obra, respeitem, valor dos trabalhos) | 102   | 39.5% (33.8% to 45.6%) |
| Both kinds of wording in the same notice                                           | 92    | 35.7% (30.1% to 41.7%) |

The main and specialised flags are keyword hits on the whole section 12 of a notice. They are not per subcategoria. They are coarse.

**CPV.** All 473 frame notices have a main CPV in division 45 (construction). The lot blocks use 33 distinct CPV codes. Of the 137 lot blocks, 8 (5.8%, 3.0% to 11.1%) use a group or division code (ending in 00000). For example 45453100 "Obras de recuperação" appears 36 times in the frame text. These facts do not answer the CPV question.

## Law

Each reading below is from the text file named. The web pages were not fetched successfully (see Unverified).

- **Bidder presents alvará.** CCP art. 81.º n.º 1 says the adjudicatário must present habilitação documents. n.º 2 says the alvará and certificado de empreiteiro, and how they are shown, follow a portaria. Source: [CCP, consolidated copy, 2022](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf).
- **Subcontracting needs prior check.** CCP art. 318.º n.º 3 a) says subcontracting needs the prior presentation of the habilitação documents of the potential subcontractor that the main contractor had to present. Source: same CCP copy.
- **Company responsible for the works.** Lei 41/2015 art. 8.º says the construction company responsible for the works must hold a habilitação with a subcategoria in a class that covers the global value, for the most expressive works. It must also hold other classes and subcategorias for the other works. Source: [DR, Lei 41/2015](https://diariodarepublica.pt/dr/detalhe/lei/41-2015-67377968).
- **Subcontractor's habilitações.** Lei 41/2015 art. 20.º n.º 3 says the subcontracting company uses the habilitações held by its subcontractors. Source: same Lei page.
- **Alvará content.** Portaria 372/2017 art. 3.º n.º 1 says the alvará or certificado must contain the habilitações needed for the works. n.º 2 lets the bidder use a subcontractor's alvará, if the subcontractor declares it will do the matching works. Art. 2.º n.º 5 says the bidder must also present any other documents that the convite or programa requires. Source: [Portaria 372/2017, PDF copy](https://poseur.portugal2020.pt/media/40741/portaria-372_2017.pdf). Official page: [DR, Portaria 372/2017](https://diariodarepublica.pt/dr/detalhe/portaria/372-2017-114350958).
- **Groups.** Portaria 372/2017 art. 6.º n.º 2 says, for an empreitada by a group, each construction member holds an alvará or certificado. The company responsible for the works holds a subcategoria in a class that covers the global value. Art. 6.º n.º 3 applies arts. 2.º n.º 4 and 3.º n.º 4 to group members. Source: same Portaria copy.

## Answers to the three questions

**Per lote or per anúncio.** Section 12 is written per anúncio. The sources read do not say that a lot's own value changes the test. Only 7 of 43 lot notices mention "lote" in section 12. For the other 36, Cairn cannot match a subcategoria to a single lot from section 12.

**Can Cairn find it.** Cairn can read a named subcategoria in 54.5% of notices (258 of 473). Cairn reads a class without a subcategoria in 0.8% (4 of 473). In 16.5% (78), the requirement is only in the programa or peças. Cairn must read those documents, which this study did not do.

**Must the bidder hold it.** From the sources: the bidder must hold, or present through a subcontractor's declaration, the alvará and subcategorias that the works need. The company responsible for the works must hold the subcategoria in the class that covers the global value (Lei 41/2015 art. 8.º; Portaria 372/2017 art. 6.º n.º 2). Specialised parts can be covered by a subcontractor's alvará (Portaria 372/2017 art. 3.º n.º 2).

## Recommendations

- For Cairn, treat section 12 as the first source only. Where section 12 defers to the programa, read the programa. Then match the subcategoria to the anúncio, not to a lot.
- Do not build the CPV-to-subcategoria route until a labelled map is agreed. A map from CPV to annex I would be a judgment, not an official source.

## Unverified

- **Official text of the CCP and the portaria.** The CCP text is a 2022 consolidated copy hosted at Instituto Superior Técnico (not the DR). The web page of Portaria 372/2017 returned only a script shell to the fetch tool. The portaria text comes from a PDF copy on poseur.portugal2020.pt. Both need checking against the DR before use in code.
- **Lot-level test.** Whether a multi-lot anúncio tests the global value of each lot, or of the whole anúncio, is not stated in the sources read.
- **Coding accuracy.** The coding is a script. The main and specialised flags are notice-level. Eight named notices were spot-checked against the raw text; all eight matched. Thirty-five ordinal mentions had no categoria number within 160 characters, or a number outside annex I. They were not checked by hand.
- **Completeness of the census.** Only ids inside the 16 windows were probed. Notices outside those windows are not in the frame.
- **CPV map.** No official map was found in one search. This was not re-checked in this study.
- **Two REN notices.** Two Sistema de Qualificação notices (419962046, 419966109) have no section 12. They are counted as "no section 12 text".

## Follow-up: main CPV of lots

Unit: lot blocks in the 43 lot notices (137 lots). Code: the first "Vocabulário Principal" in each lot block. Prefix buckets are 4-digit groups of division 45.

**(1) Lots by 4-digit prefix (Wilson 95% CI).**

| Prefix                                   | Lots   | Share (95% CI)           |
| ---------------------------------------- | ------ | ------------------------ |
| 4523 (roads, railways, pipelines, sport) | 50     | 36.5% (28.9% to 44.8%)   |
| 4545 (other finishing works)             | 36     | 26.3% (19.6% to 34.2%)   |
| 4526 (roofing and other specialised)     | 10     | 7.3% (4.0% to 12.9%)     |
| 4543 (floor and wall covering)           | 9      | 6.6% (3.5% to 12.0%)     |
| 4531 (electrical installation)           | 5      | 3.6% (1.6% to 8.3%)      |
| 4511, 4522, 4533                         | 4 each | 2.9% each (1.1% to 7.3%) |
| 4540                                     | 3      | 2.2% (0.7% to 6.2%)      |
| 4500, 4521, 4534, 4542                   | 2 each | 1.5% each (0.4% to 5.2%) |
| 4525                                     | 1      | 0.7% (0.1% to 4.0%)      |
| 4510, 4524, 4532, 4535, 4541, 4544       | 0      | 0.0% (upper bound 2.7%)  |
| other (only 45200000)                    | 3      | 2.2% (0.7% to 6.2%)      |

The 45 division is the only division in the lots. Exact codes that matter: 45453100 "Obras de recuperação" (26 lots, 19.0%, 13.3% to 26.4%); 45233200 "Obras diversas de pavimentação" (15, 10.9%, 6.7% to 17.3%).

**(2) Codes that name no kind of works.**

- 45000000 "Construção": 2 lots, 1.5% (0.4% to 5.2%), in 1 notice.
- 45200000 "Obras de construção total ou parcial e de engenharia civil": 3 lots, 2.2% (0.7% to 6.2%), in 1 notice.
- Together: 5 lots, 3.6% (1.6% to 8.3%).
- Codes outside division 45: none.
- Judgment call (not counted above): 45453100 "Obras de recuperação" names an intervention type but not a trade. Counting it too gives 31 lots, 22.6% (16.4% to 30.3%).

**(3) Section 12 for the generic-code lots.** Both notices with 45000000 or 45200000 name no subcategoria: one defers to the peças ("Conforme Peças do Procedimento"), one says "Não" (no alvará requirement). So section 12 cannot supply the categoria for these lots. For the 26 lots coded 45453100, 3 of 26 are in notices that name a subcategoria. For 45233200, 6 of 15 are.

**Scope note.** These are census counts from 43 notices. The Wilson intervals are wide for small counts.

## Sources checked

- DR, Lei 41/2015: https://diariodarepublica.pt/dr/detalhe/lei/41-2015-67377968
- DR, Portaria 372/2017 (official page, not readable by fetch): https://diariodarepublica.pt/dr/detalhe/portaria/372-2017-114350958
- Portaria 372/2017, PDF copy: https://poseur.portugal2020.pt/media/40741/portaria-372_2017.pdf
- CCP, consolidated 2022 copy: https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf
- Census of Parte L notices: files at `https://files.diariodarepublica.pt/cp_hora/YYYY/MM/ISSUE/ID.pdf` (the 16 issue folders and the probe results are in the working scratchpad, not in the repo)
