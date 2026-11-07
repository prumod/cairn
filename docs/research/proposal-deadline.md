# Proposal deadline in DR Parte L empreitada anúncios

**Research date:** 2026-11-05
**Issue:** prumod/cairn#173
**Scope:** The 473 Série II, Parte L anúncios of Empreitada de Obras Públicas in the census of [lote-subcategorias](https://github.com/prumod/cairn/blob/research/lote-subcategorias/docs/research/lote-subcategorias.md) (issues 089 to 164, 8 May to 25 August 2026). Only the line «Prazo para apresentação das propostas» in section «13 - CONDIÇÕES DE APRESENTAÇÃO» is studied.

## Finding

| Class                               | Anúncios    |
| ----------------------------------- | ----------- |
| Date and hour                       | 470 (99.4%) |
| Date only                           | 0           |
| Number of days                      | 0           |
| Defers to the platform or the peças | 0           |
| Field absent                        | 3 (0.6%)    |

1. **Concurso público (468).** Every one states the deadline as `DD-MM-AAAA HH:MM`, for example `419960022` «04-06-2026 17:00» and `419967109` «04-08-2026 23:59». Four give 00:00 or 00:59; they are kept as written.
2. **Concurso limitado por prévia qualificação (5).** Two state a proposal date (`31-12-2026 17:00`). Three (`419965082`, `419965846`, `419968590`) have no proposal line. They state only «Prazo para apresentação das candidaturas», because the proposal date is set after qualification. None of them points to the platform for it.
3. **Lotes.** Each anúncio has one proposal line. The 43 anúncios with lotes each have a single deadline for the whole concurso.

## Method

`extract.py` takes the section 13 line from the PDF text of each anúncio. `classify.py` sorts its value into the classes above and keeps the raw value. `classified.tsv` holds `id`, `procedure`, `class`, `raw_value` and `note` for all 473. The 3 absent cases were checked by hand in the PDF text.

## Files

- [`proposal-deadline/classified.tsv`](proposal-deadline/classified.tsv)
- [`proposal-deadline/extract.py`](proposal-deadline/extract.py) and [`proposal-deadline/classify.py`](proposal-deadline/classify.py) (run with `python3 -I`; they read the census text files, which are not committed)
