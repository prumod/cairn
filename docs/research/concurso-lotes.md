# Can one concurso put out several obras?

**Research date:** 2026-11-03
**Ticket:** [prumod/cairn#156](https://github.com/prumod/cairn/issues/156)
**Scope:** Empreitadas de obras públicas in Diário da República (DR) Série II Parte L. Sample of 16 weekly issues from 2026-05-08 to 2026-08-25. Procedures: concurso público and concurso limitado por prévia qualificação.

## Question

1. How often does one concurso cover several obras, through lotes with different locations or work types?
2. How does the anúncio express lotes: which fields, the base price per lote, the location, the deadlines, and the alvará or class requirement?

## Short answer

- About 9 in 100 empreitada concursos in the sample use lotes: 43 of 474 (9.07%, Wilson 95% CI 6.80% to 12.00%).
- A lot notice has 2 to 6 lotes. Lotes are split by location in 8 of 43 notices and by main CPV (work type) in 3 of 43. The other lotes do not show a difference in these fields, so they may still be several distinct works in one place.
- The anúncio gives each lote its own id (LOT-0001, LOT-0002, ...), description, base price without VAT, and main CPV. Location, alvará requirement and some deadlines are tied to lote ids in the notice sections. The notice also states the maximum number of lotes that one bidder can win.

## Method and sample

**Sources used.** All PDFs come from the DR file host, `files.diariodarepublica.pt`. The DR web pages are a JavaScript shell and could not be read as HTML.

**Sampling.** The frame is the set of Série II Parte L issues with a number that is a multiple of 5 counted from issue 084. That gives 16 issues, about one per week: 089 (08-05-2026), 094, 099, 104, 109, 114, 119, 124, 129, 134, 139, 144, 149, 154, 159 and 164 (25-08-2026). Every empreitada notice of the two procedure types in those issues is in the frame. Issue numbers were found by scanning document id ranges per issue. Each PDF was checked for its issue date.

**Counts.**

| Item | Count |
|---|---|
| Parsed announcements in the 16 issues | 1,942 |
| Excluded: not an empreitada | 1,467 |
| Excluded: another procedure type (for example urgent or simplified) | 1 |
| Frame: empreitada concurso notices | 474 (469 concurso público, 5 concurso limitado por prévia qualificação) |
| Frame with lotes | 43 (42 concurso público, 1 concurso limitado) |

**Share.** 43 of 474 is 9.07%. The Wilson 95% CI is 6.80% to 12.00%. The CI assumes a simple random sample. The frame is a systematic sample of issues, so treat the CI as a rough guide.

**Table.** The 40-row table below is a seeded random draw from the 474-notice frame (seed 20261103). It shows the method and gives one URL per notice. It contains 2 lot notices, which is consistent with the 9% share. The share above comes from the full frame, not from the 40 rows.

## Findings: how often

Table of 40 sampled announcements. Lots columns are filled only where the notice says "Yes".

| # | Date | Issue | Anúncio | Entity | Procedure | Lotes | Lots | Location differs | Work type differs | URL |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 08-05-2026 | 089 | 11853/2026 | Município de Arganil | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960407.pdf) |
| 2 | 08-05-2026 | 089 | 11966/2026 | Unidade Local de Saúde de Santa Maria, EPE | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960479.pdf) |
| 3 | 08-05-2026 | 089 | 11948/2026 | Cascais Envolvente - Gestão Social da Habitação | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960526.pdf) |
| 4 | 15-05-2026 | 094 | 12639/2026 | Casa Pia de Lisboa, IP | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/094/419960966.pdf) |
| 5 | 15-05-2026 | 094 | 12597/2026 | Águas do Tejo Atlântico, SA | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961208.pdf) |
| 6 | 15-05-2026 | 094 | 12625/2026 | Município de Vila Pouca de Aguiar | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961218.pdf) |
| 7 | 22-05-2026 | 099 | 13238/2026 | EPAL - Empresa Portuguesa das Águas Livres | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961613.pdf) |
| 8 | 22-05-2026 | 099 | 13264/2026 | Município de Ílhavo | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961761.pdf) |
| 9 | 22-05-2026 | 099 | 13230/2026 | Município de Barrancos | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961933.pdf) |
| 10 | 22-05-2026 | 099 | 13326/2026 | Município de Chaves | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961993.pdf) |
| 11 | 22-05-2026 | 099 | 13341/2026 | Gebalis - Gestão do Arrendamento da Habitação | CP | Yes | 4 | no | no | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962034.pdf) |
| 12 | 22-05-2026 | 099 | 13327/2026 | PACT - Parque do Alentejo de Ciência e Tecnologia | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962071.pdf) |
| 13 | 29-05-2026 | 104 | 14005/2026 | Serviços Municipalizados de Viseu | CP | Yes | 2 | no | no | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962319.pdf) |
| 14 | 29-05-2026 | 104 | 14144/2026 | Município de Oliveira de Frades | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962658.pdf) |
| 15 | 29-05-2026 | 104 | 14133/2026 | Município de Grândola | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962861.pdf) |
| 16 | 29-05-2026 | 104 | 14080/2026 | Município de Portalegre | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962903.pdf) |
| 17 | 08-06-2026 | 109 | 14847/2026 | Estado-Maior do Exército | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963745.pdf) |
| 18 | 08-06-2026 | 109 | 14848/2026 | Estado-Maior do Exército | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963746.pdf) |
| 19 | 16-06-2026 | 114 | 15395/2026 | Infraestruturas de Portugal, SA | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964236.pdf) |
| 20 | 16-06-2026 | 114 | 15420/2026 | Município de Oeiras | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964267.pdf) |
| 21 | 16-06-2026 | 114 | 15433/2026 | Município das Caldas da Rainha | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964398.pdf) |
| 22 | 30-06-2026 | 124 | 16676/2026 | Município de Viseu | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965750.pdf) |
| 23 | 30-06-2026 | 124 | 16737/2026 | CMPEAE - Empresa de Águas e Energia do Município | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965762.pdf) |
| 24 | 30-06-2026 | 124 | 16735/2026 | Centro de Solidariedade Social de Valdozende | CLPQ | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965846.pdf) |
| 25 | 07-07-2026 | 129 | 17333/2026 | Serviços Municipalizados de Águas e Saneamento | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966268.pdf) |
| 26 | 07-07-2026 | 129 | 17348/2026 | Município de Sintra | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966355.pdf) |
| 27 | 07-07-2026 | 129 | 17291/2026 | Município de Aguiar da Beira | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966457.pdf) |
| 28 | 07-07-2026 | 129 | 17375/2026 | Município de Chaves | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966481.pdf) |
| 29 | 07-07-2026 | 129 | 17365/2026 | Município de Melgaço | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966495.pdf) |
| 30 | 14-07-2026 | 134 | 18046/2026 | Município de Felgueiras | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967230.pdf) |
| 31 | 14-07-2026 | 134 | 18063/2026 | Município de Amarante | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967237.pdf) |
| 32 | 21-07-2026 | 139 | 18607/2026 | Município do Barreiro | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967640.pdf) |
| 33 | 21-07-2026 | 139 | 18664/2026 | Estado-Maior do Exército | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967997.pdf) |
| 34 | 28-07-2026 | 144 | 19258/2026 | Município de Portalegre | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968559.pdf) |
| 35 | 04-08-2026 | 149 | 19903/2026 | Município de Vila Nova de Gaia | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969048.pdf) |
| 36 | 04-08-2026 | 149 | 19906/2026 | Município de Braga | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969083.pdf) |
| 37 | 04-08-2026 | 149 | 19901/2026 | Município de Portalegre | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969273.pdf) |
| 38 | 11-08-2026 | 154 | 20461/2026 | AS - Empresa das Águas de Santarém, EM, SA | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969928.pdf) |
| 39 | 18-08-2026 | 159 | 20990/2026 | EPAL - Empresa Portuguesa das Águas Livres | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970357.pdf) |
| 40 | 18-08-2026 | 159 | 21057/2026 | Município de Vila Nova de Famalicão | CP | No | - | - | - | [link](https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970649.pdf) |

**Lot notices in the frame (all 43)** have these patterns:

- Lotes per notice: 2 (18 notices), 3 (11), 4 (6), 5 (4), 6 (4). Total 137 lotes.
- Location differs across lotes: 8 notices. Examples: [419963726](https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963726.pdf) (Gebalis, 6 lotes, split by freguesia); [419964358](https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964358.pdf) (IHRU, lotes in Barreiro and Cascais); [419965746](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965746.pdf) (Município de Marco de Canaveses, split by freguesia); [419967898](https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967898.pdf) (Portos dos Açores); [419967984](https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967984.pdf) (Município de Penamacor); [419968585](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968585.pdf) (Município de Baião); [419968614](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968614.pdf) (AR Madeira); [419968674](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968674.pdf) (Marinha).
- Work type (main CPV) differs across lotes: 3 notices. Example: [419962843](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962843.pdf) (Universidade de Aveiro, 4 lotes, CPVs 45232200, 45315300, 45315600, 45331230). Others: [419964343](https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964343.pdf) (Águas do Norte) and [419964834](https://files.diariodarepublica.pt/cp_hora/2026/06/119/419964834.pdf) (Município de Benavente).
- Maximum lotes one bidder can win (stated in the notice): 1 (12 notices), 2 (15), 3 (8), 4 (4), 5 (3), 6 (1).
- Alvará appears in the documents section of 32 of 43 lot notices. This is a notice-level field in the parse, not a per-lote field.
- Execution period: 7 of 43 lot notices list more than one value. The others list one value for all lotes.

## Findings: how the anúncio expresses lotes

The notice follows the announcement model in Portaria 318-A/2023 (per secondary sources; primary text not read, see Verified and unverified). The fields below come from the sample notice [419969352](https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969352.pdf), Município de Lisboa, Anúncio n.º 19930/2026, issue 149 (04-08-2026). Line numbers refer to the local text extract `sample-149-352.txt` of that PDF, in the scratchpad folder.

1. **Lote switch.** "Procedimento com lotes? Sim" (line 45). "Nº Máx. de Lotes Autorizado: 2" (line 46).
2. **Lote cap per bidder.** "Número máximo de lotes que podem ser adjudicados a um concorrente: 1" (line 47). This matches CCP art. 46.º-A n.º 4.
3. **Lote list and CPV.** Each lote has "Nº: LOT-0001" and a "Descrição do Lote" (lines 81–82, 88–89). Each lote has its own "Vocabulário Principal" CPV code (lines 78, 87, 95).
4. **Base price per lote.** "Preço base s/IVA" appears inside each lote block. Example: LOT-0001 at 370.000,00 EUR without VAT.
5. **Location per lote.** Section 9 "LOCAL DA EXECUÇÃO DO CONTRATO (LOTE)" has "Identificador do Lote: LOT-0001; LOT-0002" (line 116) followed by the district, municipality and freguesia fields.
6. **Lote ids in other sections.** The same "Identificador do Lote" label appears in section 11 (EU funds), section 12 (documents, line 146), section 20 (other requirements) and section 21 (award criteria, line 172). This shows which lotes each rule applies to.
7. **Execution period.** "Prazo de execução do contrato: 365 DIAS" (line 142). Section 10 holds it. In this notice it is one value for both lotes.
8. **Alvará.** Section 12 has "Habilitação para o exercício da atividade profissional: Sim", "Tipo: Alvará", "Descrição: Empreiteiro de Obras Publicas" (lines 149–151), linked to the lote ids in line 146.
9. **Deadline for proposals.** "Prazo para apresentação das propostas: 25-08-2026 23:59" (line 158). This is one deadline for the whole procedure.
10. **Award criterion by lote.** "O Critério de adjudicação é diferenciado por lote? Não" (line 176).

**Legal basis (CCP, DL 18/2008).** Source: the unofficial consolidated copy (see Sources, item 1).

- Art. 46.º-A n.º 1: the contracting entity may provide for adjudicação por lotes in the procedure documents.
- Art. 46.º-A n.º 2: for empreitadas de obras públicas above EUR 500 000, a decision not to use lotes must be justified. The listed grounds are technical or functional inseparability and efficiency of a single contract.
- Art. 46.º-A n.º 4: the entity may cap the number of lotes that one bidder can win. The cap and the objective criteria for choosing lotes must be stated in the invitation or programme.
- Art. 46.º-A n.º 5: the entity may allow contracts that combine several or all lotes, if the procedure documents say so and the combination rules are set in advance.
- Art. 130.º n.º 1: the concurso público is published in DR through an anúncio that follows a model set by portaria. Art. 167.º n.º 1 says the same for the concurso limitado por prévia qualificação.
- Art. 46.º-A n.º 2 applies to the threshold above. Notices below EUR 500 000 are not covered by the justification duty. This research did not check the threshold of each notice.

## Implications for Cairn

These are recommendations from the findings above. They are not decided.

1. **One concurso can map to several obras.** About 9% of empreitada concursos have lotes. In that group, lotes can differ by place (8 of 43) or by work type (3 of 43). Model the procedure as a parent record with one child record per lote. Do not assume one concurso means one obra.
2. **Store these fields per lote:** lote id (for example LOT-0001), description, base price without VAT, main CPV, execution location (distrito, concelho, freguesia), alvará or class requirement, and the notice-level deadline.
3. **Store these fields per procedure:** the lotes flag, the authorised maximum of lotes, the maximum lotes per bidder, the award criterion flag by lote, and the proposal deadline.
4. **Expect a lote to have several locations.** Some lotes span several freguesias (for example [419963726](https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963726.pdf), LOT-0006 "Todas"). A lote record needs a list of locations, not one.
5. **Lote-to-rule links matter.** Alvará, execution period and award criteria are tied to lote ids in some notices but not all. The parser for these fields must read the "Identificador do Lote" lines, not assume the notice-level value applies to every lote.

## Verified and unverified

**Verified (from files read in this research):**

- The 16 sampled issues, their dates and the 474-notice frame. Issue dates were checked from the first page of each PDF.
- Counts, the share (43 of 474), and the Wilson CI. Computed from the parsed fields.
- The notice fields and line numbers in notice 419969352.
- CCP art. 46.º-A n.º 1 to 5, art. 130.º n.º 1 and art. 167.º n.º 1, from the 2022 unofficial copy.
- DL 66/2025 art. 2.º amends art. 318.º and does not change art. 46.º-A, 130.º or 167.º.

**Unverified:**

- **Portaria 318-A/2023 (announcement model).** The primary text could not be read. The base.gov.pt PDF failed the TLS certificate check, and the research did not turn off TLS verification. The model fields above come from notices, not from the portaria.
- **Revocation of the earlier model.** Secondary sources say Portaria 318-A/2023 replaces Portaria 371/2017. The 2022 CCP copy lists Portaria 371/2017 (as amended by Portaria 30/2022) as the announcement model under the art. 130.º heading (local text `downloads/ccp-tecnico-2022.txt`, lines 4204–4216). One secondary note says 317/2017 instead of 371/2017. This was not resolved.
- **Current consolidated CCP.** Only a 2022 unofficial copy was read, plus DL 66/2025. Later amendments may exist.
- **Sampling period.** September and October 2026 were not sampled. The frame covers 8 May to 25 August 2026.
- **Sample design.** The frame is every fifth issue number, not a random draw of all notices. The CI is approximate.
- **Lotes with the same work type and location.** The fields do not show whether lotes with the same CPV and location are separate obras. This needs reading the object description in each notice, which was not done for all 43.
- **Lote-level execution period and alvará.** The parser links these to lote ids only at the notice level. Per-lote values were not verified for all notices.
- **DL 66/2025 source URL.** The URL was not recorded in the research notes. The local copy was read.

## Sources

1. CCP unofficial consolidated copy (2022), art. 46.º-A (around the text "Artigo 46.º-A Adjudicação por lotes"), art. 130.º and art. 167.º: https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf (local text: `downloads/ccp-tecnico-2022.txt`, lines 2275–2300, 4204–4216, 4820–4830).
2. DL 66/2025, art. 2.º (amends art. 318.º only): local copy `downloads/dl66/DL_66_2025.pdf` (source URL not recorded).
3. Portaria 318-A/2023: not read. Attempted source: base.gov.pt (TLS failure). Portaria 371/2017 model note: local CCP copy `downloads/ccp-tecnico-2022.txt`, lines 4204–4216. The 317/2017 variant is from a secondary note that was not saved to a file.
4. DR notice PDFs: each table row URL above, plus [419969352](https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969352.pdf) for the field structure.
5. Lot examples: [419963726](https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963726.pdf), [419964358](https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964358.pdf), [419965746](https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965746.pdf), [419962843](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962843.pdf), [419964343](https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964343.pdf), [419964834](https://files.diariodarepublica.pt/cp_hora/2026/06/119/419964834.pdf), [419967898](https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967898.pdf), [419967984](https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967984.pdf), [419968585](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968585.pdf), [419968614](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968614.pdf), [419968674](https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968674.pdf).
6. Working files (not in the repo): the frame, the 43 lot rows and the parser are in the scratchpad folder `/tmp/claude-1000/-home-tiago--t3-worktrees-cairn-web-t3-daa06717/ebe7b264-0c5a-40d5-9cdb-0b99dd24b3d4/scratchpad/concurso-lotes/`.
