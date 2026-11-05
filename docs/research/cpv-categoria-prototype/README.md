# PROTOTYPE: CPV prefix → categoria (throwaway, never merged)

Primary source for [Which CPV prefixes map to which categoria?](https://github.com/prumod/cairn/issues/170). The approved table is in the ticket's resolution comment. This branch keeps only the evidence.

- `cpv-categoria.html`: the reaction page. Open it in a browser.
- `scripts/rules.py`: the approved prefix table (longest prefix wins; `PC` = «Por classificar»).
- `scripts/apply.py`, `scripts/build.py`: rebuild `data.json` and the page from `frame.tsv` (473-anúncio census) and `cpv45_pt.tsv` (CPV 2008 Portuguese labels, division 45).
- `scripts/agree.py`: compares the table with the categoria that section 12 names.

```sh
python3 -I scripts/apply.py scripts frame.tsv cpv45_pt.tsv data.json && python3 -I scripts/build.py .
```
