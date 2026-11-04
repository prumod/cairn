# CAOP2025 match rate for DR section 9 place names

**Issue:** prumod/cairn#162
**Research date:** 2026-11-04
**Scope:** 519 empreitada anúncios from 18 issues of the Diário da República 2.ª série, Parte L, published 2026-04-30 to 2026-09-15. Measures how often section 9 concelho and freguesia names match CAOP2025 after the decided cleanup.

## Answer

After the decided cleanup, section 9 concelho names match CAOP2025 in 99.7% of blocos (688 of 690; 95% Wilson CI 98.9–99.9). Freguesia names match in 97.0% of blocos (581 of 599; 95% Wilson CI 95.3–98.1). Per notice, the rates are 99.6% for concelho (503 of 505; CI 98.6–99.9) and 95.8% for freguesia (411 of 429; CI 93.5–97.3).

Of the 20 blocos that miss, 16 name two or more parishes in one value, such as «A e B». For 13 of them, CAOP2025 lists each parish separately. A union-split rule alone would lift freguesia to 99.2% (594 of 599). It is not in the baseline because Cairn must first decide which point a union name gets.

**Recommendation:** keep freguesia precision, with the concelho point as fallback. See [Recommendation](#recommendation).

## Method and cleanup rules

**Source.** Each anúncio is a PDF at `https://files.diariodarepublica.pt/cp_hora/YYYY/MM/NNN/<id>.pdf`. The folder month is the publication month, and NNN is the issue number. The DR website is a JavaScript shell with no listing or feed, so IDs were found by probing with 2 parallel workers and a 0.5 s pause. PDFs were converted with `pdftotext -layout`.

**Parsing.**
- Section 9 starts at `9 - LOCAL DA EXECUÇÃO DO CONTRATO` and ends at the next all-caps numbered heading. Section 10 is missing in 20 texts, so the end is not fixed to it.
- A bloco starts at `Identificador do Lote:` (lote) or at `LOCAL DA EXECUÇÃO DO CONTRATO (PROCEDIMENTO)`.
- Each bloco has the fields País, NUT III, Localidade, Distrito, Concelho and Freguesia.
- Block choice in the matcher: use the lote blocos when the notice has at least one lote bloco with fields. Otherwise use the procedimento blocos.
- The date is parsed from the PDF text.

**Matching (decided baseline).**
- Names are normalised: accents removed, lower case, spaces collapsed, apostrophes unified.
- Concelho key: distrito plus name, matched to `Areas_Municipio_CAOP2025.csv` (`distrito_ilha_dsg`, `município_dsg`).
- Azores and Madeira: the notice names the region (`Região Autónoma dos Açores`, `Região Autónoma da Madeira`), not the island. The concelho name is matched inside that region's `nuts1_dsg`.
- Freguesia key: within the matched concelho, the name is matched to `freguesia_dsg` in `Areas_Freguesia_CAOP2025.csv`. CAOP writes unions as «União das freguesias de A e B», so the same prefix strip is applied to the CAOP names.
- Stripped prefixes: «Freguesia de/da/do/dos/das», «União das Freguesias de/da/do/dos/das», «U.F. de/da/do/dos/das». A trailing « - <concelho>» is stripped only when it equals the concelho.
- «Todos» (concelho) and «Todas» (freguesia) are counted separately. They are neither a match nor a miss.
- A País other than Portugal would be a separate category. The sample has none.

**Denominators.**
- Primary unit, bloco. Concelho denominator: blocos with a concrete concelho. Freguesia denominator: blocos with a concrete freguesia and a concrete concelho.
- Secondary unit, notice. A notice enters a denominator when it has at least one bloco in it. It matches when all of those blocos match.
- Intervals are Wilson 95%, z = 1.959964.

**Scripts.** The parser, matcher and report scripts are in the run's scratch folder and are not committed.

## Sample

- **Size:** 519 anúncios with `Tipo de Contrato Principal` = `Empreitada de Obras Públicas` (all 519), giving 711 blocos. All 519 have section 9, a date and an anúncio number in the parsed output.
- **Procedure type:** 513 «Concurso público», 5 «Concurso limitado por prévia qualificação», 1 «Concurso público simplificado».
- **Issues:** 18 Parte L issues. Notices per issue, shown as folder NNN (count):
  - April: 084 (28).
  - May: 089 (42), 094 (23), 099 (36), 104 (39).
  - June: 109 (22), 114 (26), 119 (25), 124 (37).
  - July: 129 (44), 134 (34), 139 (24), 144 (25).
  - August: 149 (32), 154 (18), 159 (25), 164 (23).
  - September: 179 (16).
  - Issue 084 is dated 2026-04-30 and issue 179 is dated 2026-09-15.
- **Not covered:** January to March 2026 and October 2026. See [Unverified](#unverified).
- **Azores and Madeira:** 25 blocos in 21 notices. Açores: 14 blocos, all with a matched concelho; freguesia matched in 12 and is «Todas» in 2. Madeira: 11 blocos; freguesia matched in 4, «Todas» in 6, and 1 miss (Funchal, see the miss table).

## Counts with Wilson 95% CI

Baseline rules:

| Level | Measure | Matched | Denominator | Rate (95% Wilson CI) |
|---|---|---:|---:|---|
| Bloco | Concelho | 688 | 690 | 99.7% (98.9–99.9) |
| Bloco | Freguesia | 581 | 599 | 97.0% (95.3–98.1) |
| Notice | Concelho | 503 | 505 | 99.6% (98.6–99.9) |
| Notice | Freguesia | 411 | 429 | 95.8% (93.5–97.3) |

**Counted separately, outside the rates:**
- «Todos» as concelho: 21 blocos in 14 notices.
- «Todas» as freguesia: 89 blocos in 75 notices, with a concrete concelho that matched. Two more blocos have «Todas» with a concelho miss (Santa Marta de Penaguião, see the miss table).
- Foreign País: 0 blocos. Absent concelho or freguesia: 0 blocos. The matcher output has no category for either.

## Miss table

Baseline rules: 20 blocos in 20 notices, 17 distinct values. Value text is as written in the notice.

Cause categories:
- **A.** Two or more parishes in one value, and each parish is a separate CAOP2025 freguesia in that concelho. The matcher's union-split test confirms this for these 13 blocos (see Verified, item 3).
- **B.** Two or more parishes in one value, and at least one part differs from its CAOP2025 name.
- **C.** Concelho abbreviation «Sta» for «Santa».
- **D.** Separator «-» written as « - ».
- **E.** Parenthesis order is reversed.

| Blocos | Level | Concelho | Distrito | Value in notice | Cause |
|---:|---|---|---|---|---|
| 2 | Freguesia | Póvoa de Varzim | Porto | União das Freguesias da Póvoa de Varzim, Beiriz e Argivai | A |
| 2 | Freguesia | Ferreira do Alentejo | Beja | União das Freguesias de Ferreira do Alentejo e Canhestros | A |
| 2 | Concelho | Sta Marta de Penaguião | Vila Real | Concelho «Sta Marta de Penaguião»; freguesia «Todas» | C |
| 1 | Freguesia | Alcácer do Sal | Setúbal | União das Freguesias de Alcácer do Sal (Santa Maria do Castelo e Santiago) e Santa Susana | B |
| 1 | Freguesia | Seixal | Setúbal | União das Freguesias do Seixal, Arrentela e Aldeia de Paio Pires | B |
| 1 | Freguesia | Sintra | Lisboa | União das Freguesias de Almargem do Bispo, Pêro Pinheiro e Montelavar | A |
| 1 | Freguesia | Figueira da Foz | Coimbra | Freguesia de Buarcos e São Julião | B |
| 1 | Freguesia | Águeda | Aveiro | União das Freguesias de Águeda e Borralha | A |
| 1 | Freguesia | Lagos | Faro | União das Freguesias de Bensafrim e Barão de São João | A |
| 1 | Freguesia | Cabeceiras de Basto | Braga | União das Freguesias de Refojos de Basto, Outeiro e Painzela | A |
| 1 | Freguesia | Matosinhos | Porto | União das Freguesias de Perafita, Lavra e Santa Cruz do Bispo | A |
| 1 | Freguesia | Mealhada | Aveiro | União das Freguesias da Mealhada, Ventosa do Bairro e Antes | A |
| 1 | Freguesia | Montemor-o-Novo | Évora | União das Freguesias de Nossa Senhora da Vila, Nossa Senhora do Bispo e Silveiras | A |
| 1 | Freguesia | Matosinhos | Porto | União das Freguesias de São Mamede de Infesta e Senhora da Hora | A |
| 1 | Freguesia | Marco de Canaveses | Porto | Freguesia de Penha Longa e Paços de Gaiolo | A |
| 1 | Freguesia | Oleiros | Castelo Branco | Freguesia de Oleiros - Amieira | D |
| 1 | Freguesia | Funchal | Região Autónoma da Madeira | Freguesia de Sé (Funchal) | E |

**Top causes.**
1. Two or more parishes in one value: 16 blocos (13 in category A, 3 in category B).
2. Concelho abbreviation «Sta»: 2 blocos.
3. Separator (D) and parenthesis order (E): 1 bloco each.

## Cleanup addition

These candidates were run as a separate variant, not in the baseline. A rule is listed only if it is generic. Counts are blocos rescued.

| Candidate rule | Blocos rescued | Notices | Decision |
|---|---:|---:|---|
| Split a value written as «A, B e C» into its parts. Match when every part is a CAOP2025 freguesia in the same concelho. The point is the first part. | 13 | 13 | Candidate. It is generic, but it chooses one of several points, so Cairn must decide the point for a union. |
| Expand «Sta» and «Sto» to «Santa» and «Santo» in concelho and freguesia names. | 2 | 2 | Candidate, generic abbreviation rule. |
| Treat « - » and «-» as the same separator. | 1 | 1 | Candidate, low impact. |
| Strip «União de Freguesias de» as a prefix (not in the decided list). | 0 | 0 | Not added. No effect in the sample. |
| Reverse parentheses («Sé (Funchal)» to «Funchal (Sé)»). Shorten names («Aldeia de Paio Pires», «São Julião»). | 0 | 0 | Not added. Each needs a name-specific rule, which would be over-fitting. |

**Result with the three candidate rules (union split, Sta/Sto expansion, separator):**

| Level | Measure | Matched | Denominator | Rate (95% Wilson CI) |
|---|---|---:|---:|---|
| Bloco | Concelho | 690 | 690 | 100.0% (99.4–100.0) |
| Bloco | Freguesia | 595 | 599 | 99.3% (98.3–99.7) |
| Notice | Concelho | 505 | 505 | 100.0% (99.2–100.0) |
| Notice | Freguesia | 425 | 429 | 99.1% (97.6–99.6) |

The four freguesia misses that remain are the reversed parenthesis («Sé (Funchal)»), the two name shortenings («Aldeia de Paio Pires», «São Julião») and the Alcácer do Sal value with a parenthetical part.

## Recommendation

Keep freguesia precision, with the concelho point as fallback when the freguesia name does not match. Freguesia matches 97.0% of blocos, and 16 of the 20 misses are union names. Concelho matches 99.7%, so the fallback costs little. The union split alone would add about 2.2 points, but Cairn must first decide which point a union name gets.

## CAOP editions

**How often DGT publishes.** The DGT CAOP page says editions have been published annually since 2001. It lists editions 2008.0, 2008.1, 2009.0, 2012.0, 2012.1 and 2024.1 without explaining the sub-versions. Source: [DGT CAOP page](https://www.dgterritorio.gov.pt/atividades/cartografia/cartografia-tematica/caop). This is read from a summary of the page, not the raw text. See [Unverified](#unverified).

**Extraordinary versions exist.** Yes, CAOP2024.1.
- The DGT change document for CAOP2024.1 covers changes from 1 January to 15 March 2025, under Lei 2/2025, Lei 3/2025 and Lei 25-A/2025. Freguesias altered by Lei 25-A/2025 received new DTMNFR codes from INE. Source: [CAOP 2024.1 changes (DGT PDF)](https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/alteracoes_CAOP2024.1.pdf). Read as extracted text.
- The DGT CAOP2024.1 page labels it «Versão extraordinária» and gives an approval date of 11 June 2025. Source: [CAOP 2024.1 page](https://www.dgterritorio.gov.pt/carta-administrativa-oficial-de-portugal-caop-20241). This is from a summary, not raw text.
- CAOP2025 covers changes from 16 March to 31 December 2025, approved on 28 January 2026. Source: the DGT CAOP page summary. Unverified.

## Verified

Checked against source text or program output in this run. Scratch files are not in the repository; they are listed so the run can be traced. The scratch root is `/tmp/claude-1000/-home-tiago--t3-worktrees-cairn-web-t3-915d8220/0be7de37-140c-409b-bfc2-f039e071ae6c/scratchpad`.

1. **Sample size, months and fields.** 519 notices with `Tipo de Contrato Principal` = `Empreitada de Obras Públicas` (all 519), 711 blocos, 18 issues, dates 2026-04-30 to 2026-09-15. All 519 have section 9, date and anúncio number. Per-issue counts and the procedure-type counts come from `work/rows-all.json`. Status counts (410 matched, 75 matched with «Todas», 14 matched with «Todos», 18 freguesia misses, 2 concelho misses) come from the report output for `work/match-all.json`.
2. **Rates.** The four baseline rates and the four candidate rates were re-printed by `scripts/report.py` from `work/match-all.json` and `work/match-all-extra.json`. The Wilson intervals are computed from the same counts. The union-split-only figure (594 of 599 = 99.2%) is arithmetic on the baseline counts: 581 plus the 13 union blocos.
3. **Union parts and name variants in `Areas_Freguesia_CAOP2025.csv`.** Source: DGT Areas ZIP, `https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/Areas_Freg_Mun_Dist_Pais_CAOP2025.zip`. Copied from an earlier download; the retrieval date is not recorded in this run. Line numbers:
   - Ferreira do Alentejo parts: Canhestros (line 215) and Ferreira do Alentejo (line 216).
   - Évora: «União das freguesias de Malagueira e Horta das Figueiras» (line 1177). The prefix is stripped on both sides by the matcher.
   - Figueira da Foz: Buarcos (line 1052) and «São Julião da Figueira da Foz» (line 1055). The notice's «São Julião» differs from this name.
   - Seixal: «Paio Pires» (line 2344). The notice writes «Aldeia de Paio Pires».
   - Alcácer do Sal: «Alcácer do Sal (Santa Maria do Castelo)» (line 2299), «Alcácer do Sal (Santiago)» (line 2300), «Santa Susana» (line 2301).
   - Marco de Canaveses: «Paços de Gaiolo» (line 1979) and «Penha Longa» (line 1980).
   - Oleiros: «Oleiros-Amieira» (line 954). The notice writes «Oleiros - Amieira».
   - Funchal: «Funchal (Sé)» (line 3073). The notice writes «Sé (Funchal)».
4. **Union-split test.** `scripts/match.py`, function `resolve_freguesia`, lines 146–160: a value matches only when every comma or «e» part is a CAOP2025 freguesia in the same concelho. The extra run matched 13 blocos this way, which are the 13 category-A blocos.
5. **Santa Marta de Penaguião.** `Areas_Municipio_CAOP2025.csv` line 252: concelho «Santa Marta de Penaguião», Vila Real.
6. **CAOP2025 counts.** `Areas_Freg_Mun_Dist_Pais_CAOP2025_Notas.txt`, table lines 19–21: Freguesias 3259, Municípios 308, Distritos/Ilhas 29. Note 2 (line 29) says the Corvo parish is counted for statistics although it does not legally exist. The file is ISO-8859 with CRLF endings.
7. **CAOP2024.1 scope and legal acts.** Changes from 1 January to 15 March 2025, under Lei 2/2025, Lei 3/2025 and Lei 25-A/2025; new DTMNFR codes for altered freguesias, assigned by INE. Source: `https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/alteracoes_CAOP2024.1.pdf`, text lines 5–18 of the extracted file `work/caop-editions/alteracoes_CAOP2024.1.txt`.
8. **October 2026 scan aborted.** The coarse probe found 0 hits in 53 probes for folder `2026/10/200`, window 419974450–419975750 (`work/scan-2026-10-200.log`, lines 1–2). A one-off probe of 51 IDs from 419972000 to 419982000, every 200, returned HTTP 301 for `https://files.diariodarepublica.pt/cp_hora/2026/10/200/<id>.pdf`. That probe was not saved to a file.
9. **September issue 179.** 90 PDFs downloaded (`downloads/2026-09-179/manifest.json`). 16 empreitada notices in the parsed output (`work/rows-all.json`).
10. **Azores and Madeira.** 25 blocos in 21 notices (`work/match-all.json`): Açores 14 (12 freguesia matched, 2 «Todas»); Madeira 11 (4 matched, 6 «Todas», 1 miss).

## Unverified

Not checked, or checked only through a summary or an inference.

1. **Completeness of each issue.** The scan windows were set from an estimate of ID ranges. In an earlier run, three PDFs in issue 104 (IDs 419961954, 419962031, 419962046) lay below the window's low edge and returned HTTP 200. Whether they are in the sample was not checked. The sample is every anúncio the scan windows returned. It is not verified as complete for any issue.
2. **Why the union names miss.** The label «pre-2025 union» is an inference. The DGT change PDF says Lei 25-A/2025 altered freguesias and that INE holds tables of «Freguesias repostas em 2025» (`https://smi.ine.pt/Versao/Download/10698`). I did not open that INE table. So I have not confirmed that each union in the notices was split by that law.
3. **Cause categories.** Categories A to E were assigned by hand from the CAOP names in this run. No second reader checked them.
4. **Parser accuracy.** There was no manual audit of the 711 blocos. The parser was checked only by field presence and count consistency (all 519 notices have section 9, date and anúncio number).
5. **DGT page claims.** These come from summaries of the DGT pages, not the raw HTML: the annual publication since 2001 and the sub-version list; CAOP2025 approval on 28 January 2026, published in DR 2.ª série n.º 34 on 18 February 2026 (Aviso n.º 3502/2026/2), covering changes from 16 March to 31 December 2025; the «Versão extraordinária» label and the 11 June 2025 approval of CAOP2024.1. The DR publication date was not checked on the DR site.
6. **Issue 179 coverage.** The 16 empreitada notices are counted, but the issue's full ID range was not checked against an independent count.
7. **Months not reached.** January to March 2026 were not scanned in this run. The October 2026 coarse probe found no Parte L IDs in its window, so the run aborted. The window was not corrected.
8. **Union split point.** Whether the first part, the concelho point or another point is right for a union name is a product decision for Cairn. It was not tested.
9. **Fallback cost.** The claim that the concelho fallback costs little rests on the baseline rates. It was not tested on a second sample.
10. **CAOP CSV retrieval date.** The CSVs were copied from an earlier download (scratch file date 2026-01-30). The retrieval date is not recorded in this run.

## Appendix: sampled anúncios

One row per empreitada anúncio, in date order. "Blocos" gives the bloco count and the kind used (lote or procedimento). "Estado" is the status: matched, miss, or matched with «Todas» or «Todos» flags. Dates are parsed from the PDF text.

| Data | Anúncio | Issue folder | URL | Blocos | Estado |
|---|---|---|---|---|---|
| 2026-04-30 | 11142/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959532.pdf | 1 procedimento | matched + Todos |
| 2026-04-30 | 11143/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959565.pdf | 1 procedimento | matched + Todos |
| 2026-04-30 | 11145/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959458.pdf | 1 procedimento | matched + Todas |
| 2026-04-30 | 11146/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959536.pdf | 1 procedimento | matched |
| 2026-04-30 | 11148/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959656.pdf | 1 procedimento | matched |
| 2026-04-30 | 11158/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959671.pdf | 1 procedimento | miss: freguesia |
| 2026-04-30 | 11171/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959301.pdf | 1 procedimento | matched |
| 2026-04-30 | 11178/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959343.pdf | 1 procedimento | matched |
| 2026-04-30 | 11210/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959527.pdf | 1 procedimento | matched |
| 2026-04-30 | 11213/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959684.pdf | 1 procedimento | matched |
| 2026-04-30 | 11224/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959624.pdf | 1 procedimento | matched |
| 2026-04-30 | 11225/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959621.pdf | 1 procedimento | matched |
| 2026-04-30 | 11234/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959729.pdf | 1 procedimento | matched |
| 2026-04-30 | 11235/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959721.pdf | 1 procedimento | matched |
| 2026-04-30 | 11237/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959707.pdf | 1 procedimento | matched + Todas |
| 2026-04-30 | 11239/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959663.pdf | 1 procedimento | matched |
| 2026-04-30 | 11240/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959732.pdf | 1 procedimento | matched |
| 2026-04-30 | 11241/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959661.pdf | 1 procedimento | matched |
| 2026-04-30 | 11242/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959733.pdf | 1 procedimento | matched |
| 2026-04-30 | 11248/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959686.pdf | 1 procedimento | matched |
| 2026-04-30 | 11253/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959652.pdf | 1 procedimento | matched |
| 2026-04-30 | 11254/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959552.pdf | 1 procedimento | matched |
| 2026-04-30 | 11260/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959730.pdf | 1 procedimento | matched |
| 2026-04-30 | 11263/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959745.pdf | 1 procedimento | matched |
| 2026-04-30 | 11264/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959714.pdf | 1 procedimento | matched |
| 2026-04-30 | 11265/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959746.pdf | 1 procedimento | matched |
| 2026-04-30 | 11269/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959766.pdf | 4 lote | matched |
| 2026-04-30 | 11270/2026 | 2026-04-084 | https://files.diariodarepublica.pt/cp_hora/2026/04/084/419959756.pdf | 18 lote | matched |
| 2026-05-08 | 11831/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960394.pdf | 1 procedimento | matched |
| 2026-05-08 | 11832/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960277.pdf | 1 procedimento | matched |
| 2026-05-08 | 11834/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960349.pdf | 1 procedimento | matched |
| 2026-05-08 | 11835/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960425.pdf | 1 procedimento | matched |
| 2026-05-08 | 11837/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960410.pdf | 1 procedimento | matched |
| 2026-05-08 | 11841/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960408.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 11842/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960397.pdf | 1 lote | matched + Todos |
| 2026-05-08 | 11843/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960323.pdf | 1 procedimento | matched |
| 2026-05-08 | 11844/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960379.pdf | 1 procedimento | matched |
| 2026-05-08 | 11850/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960378.pdf | 1 procedimento | matched |
| 2026-05-08 | 11853/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960407.pdf | 1 procedimento | matched |
| 2026-05-08 | 11855/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960432.pdf | 1 procedimento | miss: freguesia |
| 2026-05-08 | 11856/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960353.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 11861/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960022.pdf | 1 procedimento | matched |
| 2026-05-08 | 11862/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960029.pdf | 1 procedimento | matched |
| 2026-05-08 | 11878/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960156.pdf | 1 procedimento | matched |
| 2026-05-08 | 11915/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960521.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 11918/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960386.pdf | 1 procedimento | matched |
| 2026-05-08 | 11919/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960374.pdf | 1 procedimento | matched |
| 2026-05-08 | 11921/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960464.pdf | 1 procedimento | matched |
| 2026-05-08 | 11926/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960246.pdf | 1 procedimento | matched |
| 2026-05-08 | 11927/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960486.pdf | 1 procedimento | matched |
| 2026-05-08 | 11930/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960417.pdf | 1 procedimento | matched |
| 2026-05-08 | 11943/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960445.pdf | 1 procedimento | matched |
| 2026-05-08 | 11947/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960525.pdf | 1 procedimento | matched |
| 2026-05-08 | 11948/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960526.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 11951/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960453.pdf | 1 procedimento | matched |
| 2026-05-08 | 11952/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960443.pdf | 1 procedimento | matched |
| 2026-05-08 | 11953/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960510.pdf | 1 procedimento | miss: freguesia |
| 2026-05-08 | 11954/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960476.pdf | 1 procedimento | matched |
| 2026-05-08 | 11958/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960519.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 11961/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960473.pdf | 1 procedimento | matched |
| 2026-05-08 | 11963/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960513.pdf | 1 procedimento | matched |
| 2026-05-08 | 11966/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960479.pdf | 1 procedimento | matched |
| 2026-05-08 | 11981/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960530.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 11982/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960501.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 11983/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960532.pdf | 1 procedimento | matched |
| 2026-05-08 | 11984/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960494.pdf | 1 procedimento | matched |
| 2026-05-08 | 11987/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960511.pdf | 1 procedimento | matched |
| 2026-05-08 | 11995/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960578.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 11999/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960583.pdf | 1 procedimento | matched + Todas |
| 2026-05-08 | 12003/2026 | 2026-05-089 | https://files.diariodarepublica.pt/cp_hora/2026/05/089/419960091.pdf | 1 procedimento | matched |
| 2026-05-15 | 12514/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961158.pdf | 1 lote | matched + Todas |
| 2026-05-15 | 12515/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419960903.pdf | 1 procedimento | matched |
| 2026-05-15 | 12516/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961114.pdf | 1 procedimento | matched |
| 2026-05-15 | 12517/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961139.pdf | 1 procedimento | matched |
| 2026-05-15 | 12524/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961060.pdf | 1 procedimento | matched |
| 2026-05-15 | 12525/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961049.pdf | 1 procedimento | matched |
| 2026-05-15 | 12536/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419960677.pdf | 1 procedimento | matched |
| 2026-05-15 | 12586/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961192.pdf | 1 procedimento | matched |
| 2026-05-15 | 12587/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961191.pdf | 1 procedimento | matched |
| 2026-05-15 | 12588/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419960906.pdf | 1 procedimento | matched |
| 2026-05-15 | 12593/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961118.pdf | 1 procedimento | matched + Todas |
| 2026-05-15 | 12596/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961123.pdf | 1 procedimento | matched + Todas |
| 2026-05-15 | 12597/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961208.pdf | 1 procedimento | matched |
| 2026-05-15 | 12598/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961200.pdf | 1 procedimento | matched |
| 2026-05-15 | 12607/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961238.pdf | 1 procedimento | matched |
| 2026-05-15 | 12615/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961187.pdf | 1 procedimento | matched + Todos |
| 2026-05-15 | 12616/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961213.pdf | 1 procedimento | matched |
| 2026-05-15 | 12621/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961137.pdf | 1 procedimento | matched |
| 2026-05-15 | 12625/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961218.pdf | 1 procedimento | matched |
| 2026-05-15 | 12626/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961257.pdf | 1 procedimento | matched |
| 2026-05-15 | 12636/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961254.pdf | 1 procedimento | matched |
| 2026-05-15 | 12637/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419961227.pdf | 1 procedimento | matched |
| 2026-05-15 | 12639/2026 | 2026-05-094 | https://files.diariodarepublica.pt/cp_hora/2026/05/094/419960966.pdf | 1 procedimento | matched |
| 2026-05-22 | 13209/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961961.pdf | 1 procedimento | matched |
| 2026-05-22 | 13213/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961871.pdf | 1 procedimento | matched |
| 2026-05-22 | 13230/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961933.pdf | 1 procedimento | matched |
| 2026-05-22 | 13238/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961613.pdf | 1 procedimento | matched + Todas |
| 2026-05-22 | 13244/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961681.pdf | 1 lote | matched |
| 2026-05-22 | 13260/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961482.pdf | 1 procedimento | matched |
| 2026-05-22 | 13261/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961480.pdf | 1 procedimento | matched |
| 2026-05-22 | 13264/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961761.pdf | 1 procedimento | matched |
| 2026-05-22 | 13267/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961633.pdf | 1 procedimento | matched |
| 2026-05-22 | 13268/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961992.pdf | 33 lote | matched |
| 2026-05-22 | 13272/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961881.pdf | 1 procedimento | matched |
| 2026-05-22 | 13273/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961635.pdf | 1 procedimento | matched |
| 2026-05-22 | 13274/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961641.pdf | 1 procedimento | matched |
| 2026-05-22 | 13279/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961928.pdf | 1 procedimento | matched |
| 2026-05-22 | 13285/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961964.pdf | 1 procedimento | matched + Todos |
| 2026-05-22 | 13286/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962025.pdf | 1 procedimento | matched |
| 2026-05-22 | 13288/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961966.pdf | 1 procedimento | matched + Todas |
| 2026-05-22 | 13289/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961864.pdf | 1 procedimento | matched + Todas |
| 2026-05-22 | 13290/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961996.pdf | 1 procedimento | matched |
| 2026-05-22 | 13292/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961839.pdf | 1 procedimento | matched |
| 2026-05-22 | 13293/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961886.pdf | 1 procedimento | matched |
| 2026-05-22 | 13294/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961893.pdf | 1 procedimento | matched |
| 2026-05-22 | 13299/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962000.pdf | 3 lote | matched |
| 2026-05-22 | 13313/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961969.pdf | 1 procedimento | matched |
| 2026-05-22 | 13315/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962052.pdf | 1 procedimento | matched |
| 2026-05-22 | 13325/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961989.pdf | 1 procedimento | matched |
| 2026-05-22 | 13326/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961993.pdf | 1 procedimento | matched + Todas |
| 2026-05-22 | 13327/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962071.pdf | 1 procedimento | matched |
| 2026-05-22 | 13328/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962072.pdf | 1 procedimento | miss: freguesia |
| 2026-05-22 | 13329/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961791.pdf | 1 procedimento | matched + Todas |
| 2026-05-22 | 13330/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962007.pdf | 1 procedimento | matched |
| 2026-05-22 | 13333/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962064.pdf | 1 procedimento | matched |
| 2026-05-22 | 13340/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961938.pdf | 1 procedimento | matched + Todas |
| 2026-05-22 | 13341/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419962034.pdf | 4 lote | matched + Todas |
| 2026-05-22 | 13347/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961540.pdf | 1 procedimento | matched |
| 2026-05-22 | 13352/2026 | 2026-05-099 | https://files.diariodarepublica.pt/cp_hora/2026/05/099/419961873.pdf | 1 procedimento | miss: freguesia |
| 2026-05-29 | 13983/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962376.pdf | 1 procedimento | matched |
| 2026-05-29 | 13984/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962333.pdf | 1 procedimento | matched + Todas |
| 2026-05-29 | 13986/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962696.pdf | 1 procedimento | matched |
| 2026-05-29 | 13991/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962843.pdf | 1 lote | matched |
| 2026-05-29 | 13992/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962764.pdf | 1 procedimento | matched |
| 2026-05-29 | 13993/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962773.pdf | 1 procedimento | matched |
| 2026-05-29 | 13994/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962798.pdf | 1 procedimento | matched |
| 2026-05-29 | 13996/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962831.pdf | 1 procedimento | matched |
| 2026-05-29 | 13998/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962504.pdf | 1 procedimento | matched |
| 2026-05-29 | 14005/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962319.pdf | 1 lote | matched + Todas |
| 2026-05-29 | 14006/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962316.pdf | 1 procedimento | matched + Todas |
| 2026-05-29 | 14008/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962031.pdf | 1 procedimento | matched |
| 2026-05-29 | 14017/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962046.pdf | 1 procedimento | matched + Todos |
| 2026-05-29 | 14018/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962480.pdf | 1 procedimento | miss: freguesia |
| 2026-05-29 | 14055/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962680.pdf | 1 procedimento | matched |
| 2026-05-29 | 14059/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962869.pdf | 1 procedimento | matched |
| 2026-05-29 | 14063/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962501.pdf | 1 procedimento | matched |
| 2026-05-29 | 14068/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962882.pdf | 1 procedimento | matched |
| 2026-05-29 | 14072/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962906.pdf | 4 lote | matched |
| 2026-05-29 | 14075/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962828.pdf | 1 procedimento | matched |
| 2026-05-29 | 14076/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962845.pdf | 1 procedimento | miss: freguesia |
| 2026-05-29 | 14077/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962891.pdf | 1 procedimento | matched + Todos |
| 2026-05-29 | 14079/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962824.pdf | 1 procedimento | matched |
| 2026-05-29 | 14080/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962903.pdf | 1 procedimento | matched |
| 2026-05-29 | 14084/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962915.pdf | 1 procedimento | matched |
| 2026-05-29 | 14088/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962917.pdf | 1 procedimento | matched |
| 2026-05-29 | 14097/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962927.pdf | 1 procedimento | matched |
| 2026-05-29 | 14099/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962815.pdf | 1 procedimento | matched |
| 2026-05-29 | 14100/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962623.pdf | 1 procedimento | matched |
| 2026-05-29 | 14101/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962909.pdf | 1 procedimento | matched |
| 2026-05-29 | 14104/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962934.pdf | 1 procedimento | matched |
| 2026-05-29 | 14105/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962933.pdf | 1 procedimento | matched |
| 2026-05-29 | 14106/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962932.pdf | 1 procedimento | matched |
| 2026-05-29 | 14123/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962762.pdf | 1 procedimento | matched |
| 2026-05-29 | 14127/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962912.pdf | 1 procedimento | matched + Todas |
| 2026-05-29 | 14129/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962883.pdf | 1 procedimento | matched |
| 2026-05-29 | 14130/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962880.pdf | 1 procedimento | matched |
| 2026-05-29 | 14133/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962861.pdf | 1 procedimento | matched |
| 2026-05-29 | 14144/2026 | 2026-05-104 | https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962658.pdf | 1 procedimento | matched |
| 2026-06-08 | 14778/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963480.pdf | 1 procedimento | matched |
| 2026-06-08 | 14792/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963587.pdf | 1 procedimento | matched |
| 2026-06-08 | 14801/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963573.pdf | 1 procedimento | matched + Todas |
| 2026-06-08 | 14804/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963496.pdf | 1 procedimento | matched + Todas |
| 2026-06-08 | 14809/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963623.pdf | 1 procedimento | matched |
| 2026-06-08 | 14819/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963710.pdf | 1 procedimento | matched |
| 2026-06-08 | 14820/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963730.pdf | 1 procedimento | matched |
| 2026-06-08 | 14822/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963624.pdf | 1 procedimento | matched + Todas |
| 2026-06-08 | 14827/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963721.pdf | 1 procedimento | matched |
| 2026-06-08 | 14828/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963706.pdf | 1 procedimento | matched |
| 2026-06-08 | 14835/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963630.pdf | 1 procedimento | matched + Todas |
| 2026-06-08 | 14836/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963631.pdf | 1 procedimento | matched |
| 2026-06-08 | 14843/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963737.pdf | 1 procedimento | matched + Todas |
| 2026-06-08 | 14844/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963726.pdf | 6 lote | matched + Todas |
| 2026-06-08 | 14845/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963711.pdf | 1 procedimento | matched |
| 2026-06-08 | 14846/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963744.pdf | 1 procedimento | matched |
| 2026-06-08 | 14847/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963745.pdf | 1 procedimento | matched + Todos |
| 2026-06-08 | 14848/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963746.pdf | 1 procedimento | matched |
| 2026-06-08 | 14849/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963747.pdf | 1 procedimento | matched |
| 2026-06-08 | 14853/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963734.pdf | 1 procedimento | matched + Todas |
| 2026-06-08 | 14854/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963701.pdf | 1 procedimento | miss: freguesia |
| 2026-06-08 | 14861/2026 | 2026-06-109 | https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963585.pdf | 1 lote | matched + Todas |
| 2026-06-16 | 15391/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964358.pdf | 4 lote | matched |
| 2026-06-16 | 15395/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964236.pdf | 1 procedimento | matched |
| 2026-06-16 | 15406/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964127.pdf | 1 procedimento | matched |
| 2026-06-16 | 15419/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964343.pdf | 1 lote | matched |
| 2026-06-16 | 15420/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964267.pdf | 1 procedimento | matched |
| 2026-06-16 | 15429/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964346.pdf | 1 procedimento | miss: freguesia |
| 2026-06-16 | 15433/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964398.pdf | 1 procedimento | matched |
| 2026-06-16 | 15434/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964206.pdf | 1 procedimento | miss: freguesia |
| 2026-06-16 | 15435/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964366.pdf | 1 procedimento | matched |
| 2026-06-16 | 15443/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964439.pdf | 1 procedimento | matched |
| 2026-06-16 | 15447/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964413.pdf | 1 procedimento | matched |
| 2026-06-16 | 15448/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964409.pdf | 1 procedimento | matched |
| 2026-06-16 | 15452/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964299.pdf | 1 procedimento | matched |
| 2026-06-16 | 15453/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964305.pdf | 1 procedimento | miss: freguesia |
| 2026-06-16 | 15454/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964402.pdf | 1 procedimento | matched |
| 2026-06-16 | 15455/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964239.pdf | 1 procedimento | matched |
| 2026-06-16 | 15456/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964451.pdf | 1 procedimento | matched |
| 2026-06-16 | 15467/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964426.pdf | 1 procedimento | matched |
| 2026-06-16 | 15469/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964432.pdf | 1 procedimento | matched + Todas |
| 2026-06-16 | 15471/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964443.pdf | 1 procedimento | matched |
| 2026-06-16 | 15472/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964416.pdf | 1 procedimento | matched |
| 2026-06-16 | 15473/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964468.pdf | 1 procedimento | matched |
| 2026-06-16 | 15484/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964408.pdf | 1 procedimento | matched |
| 2026-06-16 | 15486/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964445.pdf | 1 procedimento | miss: freguesia |
| 2026-06-16 | 15487/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964420.pdf | 1 procedimento | matched |
| 2026-06-16 | 15495/2026 | 2026-06-114 | https://files.diariodarepublica.pt/cp_hora/2026/06/114/419964470.pdf | 1 procedimento | matched |
| 2026-06-23 | 16006/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419964834.pdf | 2 lote | matched |
| 2026-06-23 | 16023/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965072.pdf | 1 procedimento | matched |
| 2026-06-23 | 16035/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965017.pdf | 1 procedimento | matched |
| 2026-06-23 | 16038/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965065.pdf | 1 procedimento | matched |
| 2026-06-23 | 16040/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965064.pdf | 1 procedimento | matched |
| 2026-06-23 | 16043/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419964988.pdf | 1 lote | matched |
| 2026-06-23 | 16046/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965085.pdf | 1 procedimento | matched |
| 2026-06-23 | 16047/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965094.pdf | 1 procedimento | matched |
| 2026-06-23 | 16057/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965129.pdf | 1 procedimento | matched + Todas |
| 2026-06-23 | 16064/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965084.pdf | 1 procedimento | matched |
| 2026-06-23 | 16065/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965088.pdf | 1 procedimento | matched + Todas |
| 2026-06-23 | 16066/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965082.pdf | 1 procedimento | matched |
| 2026-06-23 | 16067/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965089.pdf | 1 procedimento | matched |
| 2026-06-23 | 16068/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965134.pdf | 1 procedimento | matched |
| 2026-06-23 | 16069/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965120.pdf | 1 procedimento | matched |
| 2026-06-23 | 16072/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965121.pdf | 1 procedimento | matched |
| 2026-06-23 | 16073/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965157.pdf | 1 procedimento | matched + Todas |
| 2026-06-23 | 16080/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965153.pdf | 1 lote | matched + Todas |
| 2026-06-23 | 16083/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965073.pdf | 1 procedimento | matched |
| 2026-06-23 | 16085/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965151.pdf | 1 procedimento | matched |
| 2026-06-23 | 16096/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965168.pdf | 1 procedimento | matched |
| 2026-06-23 | 16098/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419964844.pdf | 1 procedimento | miss: freguesia |
| 2026-06-23 | 16102/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965152.pdf | 1 procedimento | matched |
| 2026-06-23 | 16106/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965087.pdf | 1 procedimento | matched |
| 2026-06-23 | 16109/2026 | 2026-06-119 | https://files.diariodarepublica.pt/cp_hora/2026/06/119/419965172.pdf | 1 procedimento | matched |
| 2026-06-30 | 16645/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965625.pdf | 1 lote | matched |
| 2026-06-30 | 16646/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965285.pdf | 1 procedimento | matched |
| 2026-06-30 | 16648/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965696.pdf | 1 procedimento | matched |
| 2026-06-30 | 16651/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965658.pdf | 1 procedimento | matched |
| 2026-06-30 | 16666/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965535.pdf | 6 lote | matched + Todos |
| 2026-06-30 | 16676/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965750.pdf | 1 procedimento | matched |
| 2026-06-30 | 16680/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965584.pdf | 1 procedimento | matched |
| 2026-06-30 | 16685/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965617.pdf | 1 procedimento | matched |
| 2026-06-30 | 16686/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965781.pdf | 1 procedimento | matched |
| 2026-06-30 | 16687/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965767.pdf | 1 procedimento | matched |
| 2026-06-30 | 16693/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965797.pdf | 1 procedimento | matched + Todas |
| 2026-06-30 | 16694/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965722.pdf | 1 procedimento | matched |
| 2026-06-30 | 16704/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965570.pdf | 1 procedimento | matched |
| 2026-06-30 | 16707/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965770.pdf | 1 procedimento | matched |
| 2026-06-30 | 16711/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965773.pdf | 1 procedimento | matched |
| 2026-06-30 | 16713/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965655.pdf | 1 procedimento | matched |
| 2026-06-30 | 16715/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965496.pdf | 1 procedimento | matched |
| 2026-06-30 | 16717/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965804.pdf | 1 procedimento | matched |
| 2026-06-30 | 16718/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965741.pdf | 1 procedimento | matched |
| 2026-06-30 | 16726/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965744.pdf | 1 procedimento | miss: freguesia |
| 2026-06-30 | 16728/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965714.pdf | 1 procedimento | matched |
| 2026-06-30 | 16735/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965846.pdf | 1 procedimento | matched |
| 2026-06-30 | 16736/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965809.pdf | 2 lote | matched |
| 2026-06-30 | 16737/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965762.pdf | 1 procedimento | matched + Todas |
| 2026-06-30 | 16738/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965619.pdf | 1 procedimento | matched |
| 2026-06-30 | 16739/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965748.pdf | 1 procedimento | matched |
| 2026-06-30 | 16743/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965645.pdf | 1 procedimento | matched |
| 2026-06-30 | 16744/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965830.pdf | 1 procedimento | matched |
| 2026-06-30 | 16747/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965828.pdf | 1 procedimento | miss: freguesia |
| 2026-06-30 | 16748/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965810.pdf | 1 lote | matched |
| 2026-06-30 | 16749/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965775.pdf | 1 procedimento | matched + Todas |
| 2026-06-30 | 16751/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965772.pdf | 1 procedimento | matched |
| 2026-06-30 | 16753/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965782.pdf | 1 procedimento | miss: freguesia |
| 2026-06-30 | 16756/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965858.pdf | 1 procedimento | matched |
| 2026-06-30 | 16760/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965812.pdf | 1 lote | matched + Todas |
| 2026-06-30 | 16763/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965855.pdf | 1 procedimento | matched |
| 2026-06-30 | 16769/2026 | 2026-06-124 | https://files.diariodarepublica.pt/cp_hora/2026/06/124/419965746.pdf | 9 lote | miss: freguesia |
| 2026-07-07 | 17287/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966329.pdf | 1 procedimento | matched |
| 2026-07-07 | 17288/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966434.pdf | 1 procedimento | matched + Todos |
| 2026-07-07 | 17289/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966274.pdf | 1 procedimento | matched |
| 2026-07-07 | 17291/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966457.pdf | 1 procedimento | matched + Todas |
| 2026-07-07 | 17299/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966082.pdf | 1 procedimento | matched |
| 2026-07-07 | 17301/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966060.pdf | 1 procedimento | matched |
| 2026-07-07 | 17308/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966109.pdf | 1 procedimento | matched + Todos |
| 2026-07-07 | 17313/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966177.pdf | 52 lote | matched |
| 2026-07-07 | 17317/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966110.pdf | 1 procedimento | matched + Todos |
| 2026-07-07 | 17333/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966268.pdf | 1 procedimento | matched |
| 2026-07-07 | 17336/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966361.pdf | 1 procedimento | matched |
| 2026-07-07 | 17340/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966478.pdf | 1 procedimento | matched |
| 2026-07-07 | 17342/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966502.pdf | 1 lote | matched + Todas |
| 2026-07-07 | 17345/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966413.pdf | 1 procedimento | matched |
| 2026-07-07 | 17347/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966504.pdf | 1 procedimento | matched |
| 2026-07-07 | 17348/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966355.pdf | 1 procedimento | matched |
| 2026-07-07 | 17349/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966338.pdf | 1 procedimento | matched |
| 2026-07-07 | 17352/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966218.pdf | 1 procedimento | matched |
| 2026-07-07 | 17353/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966392.pdf | 1 procedimento | matched |
| 2026-07-07 | 17361/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966511.pdf | 1 procedimento | matched + Todas |
| 2026-07-07 | 17363/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966523.pdf | 1 lote | matched + Todas |
| 2026-07-07 | 17364/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966537.pdf | 1 procedimento | matched |
| 2026-07-07 | 17365/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966495.pdf | 1 procedimento | matched |
| 2026-07-07 | 17366/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966540.pdf | 1 lote | matched |
| 2026-07-07 | 17367/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966513.pdf | 1 procedimento | matched |
| 2026-07-07 | 17368/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966451.pdf | 1 procedimento | matched |
| 2026-07-07 | 17369/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966402.pdf | 1 lote | matched |
| 2026-07-07 | 17370/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966471.pdf | 1 procedimento | matched + Todas |
| 2026-07-07 | 17375/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966481.pdf | 1 procedimento | matched |
| 2026-07-07 | 17377/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966563.pdf | 1 procedimento | matched |
| 2026-07-07 | 17385/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966571.pdf | 1 procedimento | matched |
| 2026-07-07 | 17386/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966548.pdf | 1 procedimento | matched |
| 2026-07-07 | 17390/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966549.pdf | 1 procedimento | matched |
| 2026-07-07 | 17392/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966536.pdf | 1 procedimento | matched |
| 2026-07-07 | 17393/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966535.pdf | 1 procedimento | matched |
| 2026-07-07 | 17394/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966501.pdf | 1 procedimento | matched |
| 2026-07-07 | 17395/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966530.pdf | 1 procedimento | matched + Todas |
| 2026-07-07 | 17398/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966553.pdf | 1 procedimento | matched |
| 2026-07-07 | 17400/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966560.pdf | 1 procedimento | matched + Todas |
| 2026-07-07 | 17401/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966566.pdf | 1 procedimento | matched |
| 2026-07-07 | 17404/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966578.pdf | 1 procedimento | matched + Todas |
| 2026-07-07 | 17405/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966572.pdf | 1 procedimento | matched |
| 2026-07-07 | 17406/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966573.pdf | 1 procedimento | matched |
| 2026-07-07 | 17411/2026 | 2026-07-129 | https://files.diariodarepublica.pt/cp_hora/2026/07/129/419966527.pdf | 1 procedimento | matched |
| 2026-07-14 | 17968/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419966976.pdf | 1 procedimento | matched |
| 2026-07-14 | 17974/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967094.pdf | 1 procedimento | matched |
| 2026-07-14 | 17981/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967078.pdf | 1 procedimento | matched |
| 2026-07-14 | 17986/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419966949.pdf | 35 lote | matched |
| 2026-07-14 | 17988/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419966989.pdf | 1 procedimento | matched |
| 2026-07-14 | 17989/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419966997.pdf | 1 procedimento | matched |
| 2026-07-14 | 17997/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967038.pdf | 1 procedimento | matched |
| 2026-07-14 | 18004/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419966848.pdf | 1 procedimento | matched |
| 2026-07-14 | 18011/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967218.pdf | 1 procedimento | matched |
| 2026-07-14 | 18016/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967156.pdf | 1 procedimento | matched |
| 2026-07-14 | 18017/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967231.pdf | 1 procedimento | matched |
| 2026-07-14 | 18018/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967253.pdf | 1 procedimento | matched |
| 2026-07-14 | 18023/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967246.pdf | 1 procedimento | matched + Todas |
| 2026-07-14 | 18026/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967202.pdf | 1 procedimento | matched |
| 2026-07-14 | 18028/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967198.pdf | 1 procedimento | matched |
| 2026-07-14 | 18030/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967216.pdf | 1 procedimento | matched |
| 2026-07-14 | 18031/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967224.pdf | 1 procedimento | matched |
| 2026-07-14 | 18034/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967254.pdf | 1 procedimento | matched |
| 2026-07-14 | 18038/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967196.pdf | 1 procedimento | matched |
| 2026-07-14 | 18039/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967280.pdf | 1 procedimento | matched |
| 2026-07-14 | 18045/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967057.pdf | 1 procedimento | matched + Todas |
| 2026-07-14 | 18046/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967230.pdf | 1 procedimento | matched |
| 2026-07-14 | 18053/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967245.pdf | 1 procedimento | matched + Todas |
| 2026-07-14 | 18056/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967241.pdf | 2 lote | matched |
| 2026-07-14 | 18058/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967238.pdf | 1 procedimento | matched |
| 2026-07-14 | 18063/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967237.pdf | 1 procedimento | matched |
| 2026-07-14 | 18065/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967296.pdf | 1 procedimento | matched |
| 2026-07-14 | 18066/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967186.pdf | 1 procedimento | matched |
| 2026-07-14 | 18069/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967283.pdf | 1 procedimento | matched + Todas |
| 2026-07-14 | 18074/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967126.pdf | 1 procedimento | matched |
| 2026-07-14 | 18075/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967146.pdf | 1 procedimento | matched |
| 2026-07-14 | 18076/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967155.pdf | 1 procedimento | matched |
| 2026-07-14 | 18077/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967165.pdf | 1 procedimento | matched |
| 2026-07-14 | 18078/2026 | 2026-07-134 | https://files.diariodarepublica.pt/cp_hora/2026/07/134/419967109.pdf | 1 procedimento | matched |
| 2026-07-21 | 18589/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967884.pdf | 1 procedimento | matched |
| 2026-07-21 | 18596/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967898.pdf | 2 lote | matched + Todas |
| 2026-07-21 | 18606/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967621.pdf | 1 procedimento | matched |
| 2026-07-21 | 18607/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967640.pdf | 1 procedimento | matched |
| 2026-07-21 | 18609/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967663.pdf | 1 procedimento | matched |
| 2026-07-21 | 18615/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967691.pdf | 1 procedimento | matched |
| 2026-07-21 | 18629/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967597.pdf | 1 procedimento | matched |
| 2026-07-21 | 18630/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967832.pdf | 1 procedimento | matched + Todas |
| 2026-07-21 | 18634/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967913.pdf | 1 procedimento | matched + Todas |
| 2026-07-21 | 18640/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967944.pdf | 1 procedimento | matched |
| 2026-07-21 | 18641/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967949.pdf | 1 procedimento | matched |
| 2026-07-21 | 18646/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967919.pdf | 1 procedimento | matched |
| 2026-07-21 | 18660/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967881.pdf | 1 procedimento | matched + Todas |
| 2026-07-21 | 18664/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967997.pdf | 1 procedimento | matched |
| 2026-07-21 | 18666/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967979.pdf | 1 procedimento | matched |
| 2026-07-21 | 18667/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967971.pdf | 1 procedimento | matched |
| 2026-07-21 | 18672/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967984.pdf | 3 lote | matched |
| 2026-07-21 | 18674/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967939.pdf | 1 procedimento | matched |
| 2026-07-21 | 18679/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967874.pdf | 1 procedimento | matched |
| 2026-07-21 | 18681/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419968001.pdf | 1 procedimento | matched |
| 2026-07-21 | 18682/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967784.pdf | 1 procedimento | matched |
| 2026-07-21 | 18683/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967723.pdf | 1 procedimento | matched |
| 2026-07-21 | 18686/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419967793.pdf | 1 procedimento | matched |
| 2026-07-21 | 18693/2026 | 2026-07-139 | https://files.diariodarepublica.pt/cp_hora/2026/07/139/419968004.pdf | 1 procedimento | matched |
| 2026-07-28 | 19207/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968509.pdf | 1 procedimento | matched |
| 2026-07-28 | 19208/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968514.pdf | 1 procedimento | matched |
| 2026-07-28 | 19209/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968536.pdf | 1 procedimento | matched |
| 2026-07-28 | 19212/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968529.pdf | 1 lote | matched + Todas |
| 2026-07-28 | 19215/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968497.pdf | 1 lote | matched |
| 2026-07-28 | 19216/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968590.pdf | 1 lote | matched |
| 2026-07-28 | 19219/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968316.pdf | 1 procedimento | matched |
| 2026-07-28 | 19236/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968328.pdf | 1 procedimento | matched |
| 2026-07-28 | 19242/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968438.pdf | 1 procedimento | matched |
| 2026-07-28 | 19243/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968616.pdf | 1 procedimento | matched |
| 2026-07-28 | 19252/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968615.pdf | 1 procedimento | matched |
| 2026-07-28 | 19258/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968559.pdf | 1 procedimento | matched |
| 2026-07-28 | 19281/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968674.pdf | 2 lote | matched |
| 2026-07-28 | 19283/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968680.pdf | 1 procedimento | matched |
| 2026-07-28 | 19287/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968639.pdf | 1 procedimento | matched |
| 2026-07-28 | 19291/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968614.pdf | 4 lote | matched + Todas |
| 2026-07-28 | 19292/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968576.pdf | 1 procedimento | matched |
| 2026-07-28 | 19293/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968671.pdf | 1 procedimento | matched |
| 2026-07-28 | 19297/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968640.pdf | 1 procedimento | matched + Todas |
| 2026-07-28 | 19306/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968716.pdf | 1 procedimento | matched |
| 2026-07-28 | 19310/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968721.pdf | 1 procedimento | matched |
| 2026-07-28 | 19311/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968585.pdf | 8 lote | matched |
| 2026-07-28 | 19312/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968611.pdf | 1 procedimento | matched |
| 2026-07-28 | 19317/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968593.pdf | 1 procedimento | matched |
| 2026-07-28 | 19327/2026 | 2026-07-144 | https://files.diariodarepublica.pt/cp_hora/2026/07/144/419968651.pdf | 1 procedimento | matched |
| 2026-08-04 | 19850/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969266.pdf | 1 procedimento | matched |
| 2026-08-04 | 19851/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969270.pdf | 1 procedimento | matched |
| 2026-08-04 | 19853/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969280.pdf | 1 procedimento | matched |
| 2026-08-04 | 19854/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969239.pdf | 1 procedimento | matched |
| 2026-08-04 | 19867/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969031.pdf | 1 procedimento | matched + Todas |
| 2026-08-04 | 19868/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969033.pdf | 1 procedimento | matched |
| 2026-08-04 | 19879/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969089.pdf | 1 procedimento | matched + Todas |
| 2026-08-04 | 19882/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969121.pdf | 1 procedimento | matched |
| 2026-08-04 | 19883/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969124.pdf | 1 procedimento | matched |
| 2026-08-04 | 19886/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969149.pdf | 1 procedimento | matched |
| 2026-08-04 | 19892/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969171.pdf | 1 procedimento | matched |
| 2026-08-04 | 19894/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969279.pdf | 1 procedimento | miss: concelho |
| 2026-08-04 | 19895/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969295.pdf | 1 procedimento | miss: concelho |
| 2026-08-04 | 19896/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969305.pdf | 1 procedimento | matched |
| 2026-08-04 | 19901/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969273.pdf | 1 procedimento | matched |
| 2026-08-04 | 19902/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969331.pdf | 1 procedimento | matched |
| 2026-08-04 | 19903/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969048.pdf | 1 procedimento | matched |
| 2026-08-04 | 19904/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969133.pdf | 1 procedimento | matched |
| 2026-08-04 | 19906/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969083.pdf | 1 procedimento | matched |
| 2026-08-04 | 19913/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969347.pdf | 1 procedimento | matched |
| 2026-08-04 | 19914/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969368.pdf | 1 procedimento | matched |
| 2026-08-04 | 19920/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969354.pdf | 1 procedimento | miss: freguesia |
| 2026-08-04 | 19922/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969320.pdf | 1 procedimento | matched |
| 2026-08-04 | 19928/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969329.pdf | 1 procedimento | matched |
| 2026-08-04 | 19929/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969334.pdf | 1 procedimento | matched |
| 2026-08-04 | 19930/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969352.pdf | 1 lote | matched |
| 2026-08-04 | 19937/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969359.pdf | 1 procedimento | matched |
| 2026-08-04 | 19945/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969396.pdf | 1 procedimento | matched |
| 2026-08-04 | 19946/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969376.pdf | 1 procedimento | matched |
| 2026-08-04 | 19953/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969318.pdf | 1 procedimento | matched |
| 2026-08-04 | 19956/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969403.pdf | 1 procedimento | matched |
| 2026-08-04 | 19959/2026 | 2026-08-149 | https://files.diariodarepublica.pt/cp_hora/2026/08/149/419969317.pdf | 1 procedimento | matched |
| 2026-08-11 | 20440/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969726.pdf | 1 procedimento | matched |
| 2026-08-11 | 20448/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969788.pdf | 1 procedimento | matched |
| 2026-08-11 | 20450/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969921.pdf | 1 procedimento | matched |
| 2026-08-11 | 20451/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969923.pdf | 1 procedimento | matched |
| 2026-08-11 | 20454/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969881.pdf | 1 procedimento | matched |
| 2026-08-11 | 20455/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969934.pdf | 1 procedimento | matched |
| 2026-08-11 | 20458/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969877.pdf | 1 procedimento | matched |
| 2026-08-11 | 20459/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969924.pdf | 1 procedimento | matched |
| 2026-08-11 | 20461/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969928.pdf | 1 procedimento | matched |
| 2026-08-11 | 20476/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969884.pdf | 1 procedimento | matched |
| 2026-08-11 | 20477/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969948.pdf | 1 procedimento | matched |
| 2026-08-11 | 20480/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969993.pdf | 1 procedimento | matched |
| 2026-08-11 | 20486/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969979.pdf | 1 procedimento | matched |
| 2026-08-11 | 20493/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419970008.pdf | 1 procedimento | matched |
| 2026-08-11 | 20503/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419970019.pdf | 1 procedimento | matched |
| 2026-08-11 | 20505/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969981.pdf | 1 procedimento | matched |
| 2026-08-11 | 20512/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419970027.pdf | 1 lote | matched + Todas |
| 2026-08-11 | 20515/2026 | 2026-08-154 | https://files.diariodarepublica.pt/cp_hora/2026/08/154/419969897.pdf | 1 procedimento | matched |
| 2026-08-18 | 20971/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970529.pdf | 1 procedimento | matched |
| 2026-08-18 | 20972/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970284.pdf | 1 lote | matched |
| 2026-08-18 | 20974/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970542.pdf | 1 procedimento | matched + Todas |
| 2026-08-18 | 20975/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970493.pdf | 1 procedimento | matched + Todas |
| 2026-08-18 | 20976/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970504.pdf | 1 procedimento | matched + Todas |
| 2026-08-18 | 20979/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970559.pdf | 1 procedimento | matched |
| 2026-08-18 | 20981/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970534.pdf | 1 procedimento | matched |
| 2026-08-18 | 20989/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970342.pdf | 3 lote | matched + Todos |
| 2026-08-18 | 20990/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970357.pdf | 1 procedimento | matched + Todas |
| 2026-08-18 | 21015/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970594.pdf | 1 procedimento | matched |
| 2026-08-18 | 21025/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970488.pdf | 1 procedimento | matched |
| 2026-08-18 | 21031/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970608.pdf | 1 procedimento | matched |
| 2026-08-18 | 21032/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970625.pdf | 1 procedimento | matched |
| 2026-08-18 | 21033/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970201.pdf | 1 procedimento | matched |
| 2026-08-18 | 21035/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970605.pdf | 1 procedimento | matched |
| 2026-08-18 | 21041/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970645.pdf | 1 procedimento | matched + Todas |
| 2026-08-18 | 21042/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970546.pdf | 1 procedimento | matched |
| 2026-08-18 | 21043/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970629.pdf | 1 procedimento | matched |
| 2026-08-18 | 21044/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970580.pdf | 1 lote | matched + Todas |
| 2026-08-18 | 21049/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970565.pdf | 1 procedimento | matched + Todas |
| 2026-08-18 | 21051/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970606.pdf | 1 procedimento | matched |
| 2026-08-18 | 21053/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970624.pdf | 1 procedimento | matched |
| 2026-08-18 | 21055/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970536.pdf | 1 procedimento | matched |
| 2026-08-18 | 21057/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970649.pdf | 1 procedimento | matched |
| 2026-08-18 | 21058/2026 | 2026-08-159 | https://files.diariodarepublica.pt/cp_hora/2026/08/159/419970652.pdf | 1 procedimento | matched |
| 2026-08-25 | 21485/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419970704.pdf | 1 procedimento | matched |
| 2026-08-25 | 21494/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971169.pdf | 1 procedimento | matched |
| 2026-08-25 | 21495/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971173.pdf | 1 procedimento | matched |
| 2026-08-25 | 21496/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419970964.pdf | 1 procedimento | matched |
| 2026-08-25 | 21497/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419970960.pdf | 1 procedimento | matched |
| 2026-08-25 | 21503/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971042.pdf | 1 procedimento | matched |
| 2026-08-25 | 21509/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419970914.pdf | 1 procedimento | matched |
| 2026-08-25 | 21511/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971124.pdf | 1 procedimento | matched |
| 2026-08-25 | 21514/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971183.pdf | 1 procedimento | matched |
| 2026-08-25 | 21516/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971078.pdf | 1 lote | matched + Todas |
| 2026-08-25 | 21517/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971212.pdf | 1 procedimento | matched |
| 2026-08-25 | 21518/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971226.pdf | 1 procedimento | matched |
| 2026-08-25 | 21528/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971249.pdf | 1 procedimento | matched |
| 2026-08-25 | 21534/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419970840.pdf | 1 procedimento | matched |
| 2026-08-25 | 21535/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971248.pdf | 1 procedimento | matched + Todas |
| 2026-08-25 | 21542/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971191.pdf | 1 procedimento | matched |
| 2026-08-25 | 21548/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971250.pdf | 1 procedimento | matched |
| 2026-08-25 | 21551/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971234.pdf | 1 procedimento | matched |
| 2026-08-25 | 21557/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971274.pdf | 1 procedimento | matched |
| 2026-08-25 | 21560/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971230.pdf | 1 procedimento | matched |
| 2026-08-25 | 21561/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971291.pdf | 1 procedimento | matched |
| 2026-08-25 | 21563/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971245.pdf | 1 procedimento | matched + Todos |
| 2026-08-25 | 21566/2026 | 2026-08-164 | https://files.diariodarepublica.pt/cp_hora/2026/08/164/419971298.pdf | 1 procedimento | matched |
| 2026-09-15 | 22902/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972595.pdf | 1 procedimento | matched |
| 2026-09-15 | 22909/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972566.pdf | 1 lote | matched + Todas |
| 2026-09-15 | 22912/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972626.pdf | 1 procedimento | matched |
| 2026-09-15 | 22923/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972666.pdf | 1 procedimento | matched |
| 2026-09-15 | 22925/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972727.pdf | 8 lote | matched + Todas |
| 2026-09-15 | 22932/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972724.pdf | 1 procedimento | matched |
| 2026-09-15 | 22933/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972716.pdf | 1 procedimento | matched |
| 2026-09-15 | 22934/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972736.pdf | 1 procedimento | matched |
| 2026-09-15 | 22935/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972730.pdf | 1 procedimento | matched |
| 2026-09-15 | 22938/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972803.pdf | 1 procedimento | matched |
| 2026-09-15 | 22942/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972798.pdf | 1 procedimento | matched |
| 2026-09-15 | 22962/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972832.pdf | 1 procedimento | matched |
| 2026-09-15 | 22966/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972594.pdf | 1 procedimento | matched |
| 2026-09-15 | 22967/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972858.pdf | 1 procedimento | matched |
| 2026-09-15 | 22974/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972810.pdf | 1 procedimento | matched |
| 2026-09-15 | 22976/2026 | 2026-09-179 | https://files.diariodarepublica.pt/cp_hora/2026/09/179/419972804.pdf | 1 procedimento | matched |
