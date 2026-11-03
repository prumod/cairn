# Município reference points for Cairn

**Research date:** 2026-11-03
**Issue:** prumod/cairn #151
**Scope:** Which official dataset gives one reference point per município (308), in what format, under which licence, and how to load it once.
**Status:** Research only. No data or scripts are committed. Downloads are in the scratch directory, not in the repository.

## Question and short answer

Question (from issue #151): which official dataset gives one reference point per Portuguese município, in what format, under which licence, and how is it loaded once into Cairn?

- The official source is DGT's CAOP2025 (Carta Administrativa Oficial de Portugal, version 2025). It is published as GeoPackage files. Its licence is CC BY 4.0, which requires attribution to the Direção-Geral do Território (DGT).
- CAOP gives municípios as polygons, not points. Its code for each município is `dtmn` (4 digits). Its name field is `municipio`.
- I found no official seat (sede de concelho) point layer in the public downloads I inspected. The CAOP data model defines a seat entity, but the Azores and Madeira files do not include it. The Continente file was not inspected.
- Recommendation: use a point inside each município polygon (a representative point), not the polygon centroid and not a seat. The centroid falls outside two Madeira municípios (Funchal and Santa Cruz).

## Sources table

| Source | Exact URL | Format and size | CRS | Geometry | Licence | Cadence and vintage | Code and name fields |
|---|---|---|---|---|---|---|---|
| CAOP2025, Continente | https://geo2.dgterritorio.gov.pt/caop/CAOP_Continente_2025-gpkg.zip | GPKG in ZIP, 111,647,845 bytes (HEAD `Content-Length`). **Not downloaded** (50 MB or larger). | Continente CRS is PT-TM06/ETRS89 in the 2024 metadata. Not verified for the 2025 file. | Not inspected. Expected MULTIPOLYGON, as in the other two files. | CC BY 4.0, see licence rows below | "Frequência mínima anual" (minimum annual update) per [Metadados CAOP2024, p. 2](https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/Metadados_CAOP2024.pdf). CAOP2025 approved 28 Jan 2026 and published in DR 2.ª série n.º 34 on 18 Feb 2026 ([CAOP page](https://www.dgterritorio.gov.pt/atividades/cartografia/cartografia-tematica/caop)). | Expected `dtmn`, `municipio`, `distrito_ilha`, `nuts3_cod`. Not inspected. |
| CAOP2025, Azores Central and Oriental (file `ArqAcores_GCentral_GOriental_CAOP2025.gpkg`) | https://geo2.dgterritorio.gov.pt/caop/CAOP_RAA_2025-gpkg.zip | GPKG in ZIP, 15,909,724 bytes. Downloaded. | EPSG:5015, PTRA08 / UTM zone 26N (GRS80). `gpkg_spatial_ref_sys` also lists EPSG:4326, but the layers use 5015. No WGS84 layer observed. | MULTIPOLYGON (`raa_cen_ori_municipios`, 16 rows) | CC BY 4.0 | Same as above. | `dtmn` (4 digits), `municipio`, `distrito_ilha`, `nuts3_cod`, `nuts3`, `nuts2`, `nuts1`, `area_ha`, `perimetro_km`, `n_freguesias` |
| CAOP2025, Azores Ocidental (file `ArqAcores_GOcidental_CAOP2025.gpkg`) | https://geo2.dgterritorio.gov.pt/caop/CAOP_RAA_2025-gpkg.zip (same ZIP) | Same ZIP as above | EPSG:5014, PTRA08 / UTM zone 25N | MULTIPOLYGON (`raa_oci_municipios`, 3 rows) | CC BY 4.0 | Same | Same fields |
| CAOP2025, Madeira | https://geo2.dgterritorio.gov.pt/caop/CAOP_RAM_2025-gpkg.zip | GPKG in ZIP, 15,235,290 bytes. Downloaded. | EPSG:5016, PTRA08 / UTM zone 28N | MULTIPOLYGON (`ram_municipios`, 11 rows) | CC BY 4.0 | Same | Same fields |
| CAOP2025 areas, with município names and codes (no geometry) | https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/Areas_Freg_Mun_Dist_Pais_CAOP2025.zip | ZIP, 387,732 bytes, containing `Areas_Municipio_CAOP2025.csv` (semicolon-separated, UTF-8) and an XLSX. Downloaded. | None | None | CC BY 4.0 (dataset level, see below) | Notes file dated DGT, 31-12-2025 | `dtmn`, `município_dsg`, `distrito_ilha_dsg`, `nuts1_dsg`, `nuts3_dsg`, `nuts3_cod`, `area_km2` |
| CAOP2025 on dados.gov.pt, Continente | https://dados.gov.pt/pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-continente | Dataset page. Resource file links are rendered by JavaScript and were not extracted. | n/a | n/a | "Creative Commons Attribution 4.0 - CC BY 4.0", publisher DGT, "Última atualização: 23 de outubro de 2026" | Same vintage | n/a |
| CAOP2025 on dados.gov.pt, RAA and RAM | https://dados.gov.pt/pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-raa and https://dados.gov.pt/pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-ram | Dataset pages | n/a | n/a | Same CC BY 4.0 statement | Same | n/a |
| CAOP metadata 2024 (the 2025 metadata URL did not return a PDF) | https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/Metadados_CAOP2024.pdf | PDF, 4 pages, 111,759 bytes | Continente: PT-TM06/ETRS89 (p. 2). Azores and Madeira: PTRA08-UTM/ITRF93 (pp. 2-4). | n/a | n/a | "Frequência de Actualização: Frequência mínima anual" (p. 2) | Lists "Formato(s) Disponível(eis): Shapefile (SHP)" (p. 2). Note that 2024 metadata says SHP; the 2025 download links offer GPKG. |
| CAOP entity catalogue (2023 version) | https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/catalogo_entidades_CAOP2023.pdf | PDF, 29 pages | n/a | Municipio is Multipolygon (p. 15-16) | n/a | n/a | Municipio fields: `DICO` (unique code), `Municipio`, `Distrito_Ilha`, `N_Freguesi`, `NUTIII_DSG`, `NUTII_DSG`, `NUTI_DSG` (p. 15-16) |
| CAOP data model (GitHub) | https://github.com/dgterritorio/caop (data model: https://github.com/dgterritorio/caop/blob/master/documentacao/docs/modelo_de_dados.md) | Markdown | n/a | Defines the `Sede Administrativa` entity with geometry, and the `Centroide EA` entity | n/a | n/a | Municípios: DICO or DTMN. Freguesias: DICOFRE or DTMNFR. |
| INE codes | No INE download page was verified. Freguesia codes (DTMNFR) are assigned by INE, per [dados.gov.pt CAOP2025 description](https://dados.gov.pt/pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-continente). | n/a | n/a | n/a | n/a | n/a | n/a |

**Licence (observed):** The DGT open-data page says the geographic information downloaded from its data centre is "sujeita a uma licença de utilização CC-BY 4.0", and that the only obligation is to state that the owner of the information is DGT ([DGT Dados abertos](https://www.dgterritorio.gov.pt/dados-abertos), section "Dados abertos"). The licence link is https://creativecommons.org/licenses/by/4.0/. The DGT "Condições de utilização" page does not state a data licence ([Condições de utilização](https://www.dgterritorio.gov.pt/Condicoes-de-utilizacao)).

**Municipality code:** `dtmn` is the 4-character municipality code. The DR deliberation search result describes it as a 4-character alphanumeric code (the search snippet only; not fetched). The 6-digit freguesia code is `dtmnfr` (DICOFRE or DTMNFR).

## Recommendation and reasoning

**Recommend:** For each of the 308 municípios, store one point that lies inside its CAOP2025 polygon. Use the representative point from the polygon, not the centroid.

Reasons, in order:

1. **Official and licensed.** CAOP2025 is published by DGT under CC BY 4.0, with a clear attribution rule.
2. **Covers all 308.** The Areas CSV lists 308 municípios (278 Continente, 19 Azores, 11 Madeira). The Azores and Madeira files match this list exactly (see verification).
3. **Centroid is unsafe.** The area-weighted centroid lies outside the município for **Funchal (dtmn 3103)** and **Santa Cruz (dtmn 3108)**, both in Madeira. Other Madeira and Azores municípios passed the check. Inside-point checks for the Continente were not run.
4. **Seats are not available from the verified files.** The data model has a "Sede Administrativa" point entity ([modelo_de_dados.md, section "Entidade `Sede Administrativa`"](https://github.com/dgterritorio/caop/blob/master/documentacao/docs/modelo_de_dados.md)), but no seat layer appears in the Azores or Madeira GeoPackages. The 2024 metadata lists only polygon and arc files. The Continente file was not inspected, so a seat layer may exist there.

**Trade-off:** A representative point is not the seat. Its distance from the seat was not measured. For large municípios, the difference could matter for distance results.

**Follow-up (not decided here):** If Cairn needs seats, check the Continente GeoPackage for a seat layer. If none exists, seats must come from another source, such as municipal websites, which was not researched.

## Seed method

Run this once, outside the repository. Keep the downloads and output in a new, empty scratch directory.

1. Create an empty working directory. Download the three GeoPackage ZIPs and the Areas ZIP with a generic User-Agent:

   ```
   curl -fSL -A "cairn-research/1.0" -o CAOP_RAA_2025-gpkg.zip https://geo2.dgterritorio.gov.pt/caop/CAOP_RAA_2025-gpkg.zip
   curl -fSL -A "cairn-research/1.0" -o CAOP_RAM_2025-gpkg.zip https://geo2.dgterritorio.gov.pt/caop/CAOP_RAM_2025-gpkg.zip
   curl -fSL -A "cairn-research/1.0" -o CAOP_Continente_2025-gpkg.zip https://geo2.dgterritorio.gov.pt/caop/CAOP_Continente_2025-gpkg.zip
   curl -fSL -A "cairn-research/1.0" -o Areas_Freg_Mun_Dist_Pais_CAOP2025.zip https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/Areas_Freg_Mun_Dist_Pais_CAOP2025.zip
   ```

   The Continente file is about 112 MB. Expect a larger download.

2. Extract each ZIP into its own subdirectory. Do not run anything from the extracted files.

3. For each GeoPackage, list the layers with `gpkg_contents`. Find the municipality layer: `raa_cen_ori_municipios`, `raa_oci_municipios`, `ram_municipios`, and the Continente equivalent (name not yet observed). Open the GeoPackage read-only (`sqlite3 -readonly` or `sqlite3.connect("file:...?mode=ro", uri=True)`).

4. Read each row's `dtmn`, `municipio`, `distrito_ilha`, `nuts1`, and `geom`. Decode `geom` with the GeoPackage header rule: 2-byte magic `GP`, flags byte (bits 1 to 3 give the envelope length), envelope, then standard WKB MultiPolygon. Shapely reads the WKB after the header is stripped.

5. Build a shapely geometry for each row. Then compute `geom.representative_point()`. Shapely documents this as a point guaranteed to lie within the geometry. Use the layer CRS from `gpkg_geometry_columns.srs_id` (5014, 5015, 5016, or the Continente value).

6. Reproject the point to WGS84 with pyproj: `Transformer.from_crs(<srs_id>, 4326, always_xy=True)`. Then `lon, lat = transformer.transform(x, y)`. Check which datum-shift pipeline pyproj selects for PTRA08 to WGS84. This was not checked.

7. Write a JSON seed with 308 objects: `code` (`dtmn`), `name` (`municipio`), `distrito_ilha`, `region` (`nuts1`), `lat`, `lon`, and `source` set to `CAOP2025`. Write it to the scratch directory. Do not commit it.

8. Validate before using the seed:
   - Exactly 308 objects.
   - `code` values are unique. The pair (`distrito_ilha`, `name`) is unique.
   - Region split is 278 / 19 / 11.
   - Every point is inside its own polygon.

**Working code in the scratch directory (not for commit):** The file `/tmp/claude-1000/-home-tiago--t3-worktrees-cairn-web-t3-827d52e8/36795b50-aa7e-46b6-ab20-e95529a61f74/scratchpad/scripts/rep_points.py` runs steps 3 to 5 for the three GeoPackages without pyproj or shapely. It hand-codes the UTM inverse and applies no datum shift. Its output for the 30 insular municípios is in `/tmp/claude-1000/-home-tiago--t3-worktrees-cairn-web-t3-827d52e8/36795b50-aa7e-46b6-ab20-e95529a61f74/scratchpad/scripts/rep_points_out.txt`. Use pyproj for the seed; use this script only as a cross-check.

## Name-matching pitfalls

**Match on code, not on name, where possible.** Build the key as (`distrito_ilha`, normalized name), and map to `dtmn`. A name-only match fails for "Lagoa".

**Verified duplicates and collisions (from the Areas CSV, 308 rows):**

- **Lagoa** appears twice: `0806` in distrito Faro (Continente) and `4201` in Ilha de São Miguel (Azores). This is the only duplicate among the 308 names (307 distinct names).
- **Calheta:** the ticket says it exists twice. The CSV does not show that. Madeira has **Calheta** (`3101`), and the Azores have **Calheta de São Jorge** (`4501`). The ticket's premise is wrong on this point. A name-only match on "Calheta" still returns only the Madeira município.
- **Ribeira Grande:** one entry only, `4205` in Ilha de São Miguel. There is no Continente or Madeira duplicate.
- **Prefix collisions.** Exact match is required. These names share a prefix with another município:
  - "Porto" (`1312`) vs "Porto Moniz" (`3106`), "Porto Santo" (`3201`), "Porto de Mós" (`1016`), "Vila do Porto" (`4101`).
  - "Vila Real" (`1714`) vs "Vila Real de Santo António" (`0816`).
  - "Santa Cruz" (`3108`, Madeira) vs "Santa Cruz da Graciosa" (`4401`) and "Santa Cruz das Flores" (`4802`).
  - "Calheta" (`3101`) vs "Calheta de São Jorge" (`4501`).

**Diacritics.** 82 of the 308 names contain diacritics. Examples: "Oliveira de Azeméis" (`0113`), "Águeda" (`0101`), "Vila Real de Santo António" (`0816`). Compare with accents stripped (Unicode NFKD), but keep the CAOP form as the stored name.

**Hyphenated connectors.** These six CAOP names use hyphens: "Albergaria-a-Velha", "Idanha-a-Nova", "Proença-a-Nova", "Condeixa-a-Nova", "Montemor-o-Velho", "Montemor-o-Novo". The DR print may drop or keep the hyphens. This was not checked, because the DR PDFs were not downloaded. Normalize hyphens to spaces before comparing.

**Lowercase connectors.** Names contain "de", "da", "do", "das", "dos", "a", and "à" (for example "Freixo de Espada à Cinta"). Keep them lowercase. Do not title-case them.

**Apostrophes.** No CAOP municipality name contains an apostrophe.

**Insular district names.** In CAOP, the `distrito_ilha` values for the islands are "Ilha da Madeira", "Ilha de Porto Santo", "Ilha de São Miguel", "Ilha Terceira", and similar. The Azores and Madeira are not themselves district values. Whether the DR print uses the island name or another form was not checked.

**Forms that match the ticket.** "Oliveira de Azeméis", "Vila Real de Santo António", "Ribeira Grande", and "Calheta" appear in CAOP exactly as in the ticket. Whether DR prints use the same case and accents was not checked.

## Verification performed

**Downloaded into** `/tmp/claude-1000/-home-tiago--t3-worktrees-cairn-web-t3-827d52e8/36795b50-aa7e-46b6-ab20-e95529a61f74/scratchpad/municipio-data` (new, empty directory; extracted into subdirectories):

| File | Size | Action |
|---|---|---|
| `CAOP_RAA_2025-gpkg.zip` | 15,909,724 bytes | Downloaded and extracted |
| `CAOP_RAM_2025-gpkg.zip` | 15,235,290 bytes | Downloaded and extracted |
| `Areas_Freg_Mun_Dist_Pais_CAOP2025.zip` | 387,732 bytes | Downloaded and extracted |
| `CAOP_Continente_2025-gpkg.zip` | 111,647,845 bytes (HEAD only) | **Not downloaded**: 50 MB or larger |

**Counts (observed):**

- Areas CSV: 308 rows, 308 distinct `dtmn`, 307 distinct names. Region split: Continente 278, Região Autónoma dos Açores 19, Região Autónoma da Madeira 11. Distrito/island values: 29.
- Azores GeoPackages: `raa_cen_ori_municipios` has 16 rows and `raa_oci_municipios` has 3 rows. All 19 matched the CSV by (`dtmn`, `municipio`).
- Madeira GeoPackage: `ram_municipios` has 11 rows. All 11 matched the CSV.
- Total verified: **30 of 30** insular municípios match the Areas CSV. The Continente count of **278** comes from the CSV, not from the GeoPackage.

**Point computation (observed, script output):** 30 insular points computed. 28 use the polygon centroid. 2 do not: Funchal (3103) and Santa Cruz (3108), whose centroids are outside the polygon. For those two, the script used the midpoint of the widest interior scanline. All 30 chosen points passed the inside check.

**Layer metadata (observed):** The GeoPackages store geometry in PTRA08 UTM zones 25N, 26N, and 28N (EPSG 5014, 5015, 5016). The freguesia layers carry `dtmnfr` (6 digits, for example `410101` for Almagreira).

**Not verified:**

- The Continente GeoPackage: CRS, layers, municipality names, seat layer, and point results. The Continente polygons were not downloaded.
- Whether the 2025 files ship a WGS84 layer. The Azores and Madeira files do not.
- The datum shift from PTRA08/ITRF93 to WGS84. Lat/lon values in this note were computed with no shift. The size of the error was not measured.
- The Metadados CAOP2025 PDF. Its URL returned an HTML page, not a PDF. The 2024 metadata was used instead.
- The dados.gov.pt resource file links. They are rendered by JavaScript.
- Licence statements on the individual files. The licence was taken from the DGT open-data page and dados.gov.pt.
- Diário da República print forms of municipality names. No DR PDF was downloaded.
- An INE download page for municipality codes. Only a search result was seen.
- Seat points. None found in the verified files.

## Sources consulted

- https://www.dgterritorio.gov.pt/ (redirects to https://point.dgterritorio.gov.pt/)
- https://www.dgterritorio.gov.pt/atividades/cartografia/cartografia-tematica/caop (CAOP page, CAOP2025 links)
- https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/Metadados_CAOP2024.pdf (metadata 2024, pp. 1-4)
- https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/Metadados_CAOP2025.pdf (returned HTML, not PDF)
- https://geo2.dgterritorio.gov.pt/caop/CAOP_Continente_2025-gpkg.zip (HEAD only)
- https://geo2.dgterritorio.gov.pt/caop/CAOP_RAA_2025-gpkg.zip (downloaded)
- https://geo2.dgterritorio.gov.pt/caop/CAOP_RAM_2025-gpkg.zip (downloaded)
- https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/Areas_Freg_Mun_Dist_Pais_CAOP2025.zip (downloaded)
- https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/catalogo_entidades_CAOP2023.pdf (pp. 6, 15-16)
- https://www.dgterritorio.gov.pt/dados-abertos (licence statement)
- https://www.dgterritorio.gov.pt/Condicoes-de-utilizacao (no data licence stated)
- https://creativecommons.org/licenses/by/4.0/ (licence link, not fetched)
- https://dados.gov.pt/pt/datasets/?q=CAOP (search listing)
- https://dados.gov.pt/pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-continente (licence CC BY 4.0, publisher, last update)
- https://dados.gov.pt/pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-raa
- https://dados.gov.pt/pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-ram
- https://dados.gov.pt/pt/datasets/unidades-administrativas (licence CC BY 4.0, no seat layer described)
- https://dados.gov.pt/en/datasets/concelhos-de-portugal/ (AMA; municipal boundary shapefiles, last update 17 Dec 2018, no seat layer described)
- https://github.com/dgterritorio/caop (repository, master branch)
- https://github.com/dgterritorio/caop/blob/master/documentacao/docs/modelo_de_dados.md (data model: `Sede Administrativa`, `Centroide EA`, DICO and DTMN)
- https://raw.githubusercontent.com/dgterritorio/caop/master/README.md
- Search snippets only, not fetched: DGT change list for CAOP2024.1 (https://www.dgterritorio.gov.pt/sites/default/files/ficheiros-cartografia/alteracoes_CAOP2024.1.pdf), and a Diário da República deliberation on DTMN structure (https://diariodarepublica.pt/dr/detalhe/deliberacao/660-2025-918700450).
