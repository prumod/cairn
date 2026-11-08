"""Facts for the four #212 bullets, computed from the parsed lote records.

Usage: python3 -I lote_facts.py <scratch_dir>
Needs the output of lote_compare.py (work/lote_pairs.tsv) and reuses its parser.
"""
import collections
import csv
import glob
import importlib.util
import os
import re
import sys

SCR = sys.argv[1]
sys.argv = ["lote_compare.py", SCR]
spec = importlib.util.spec_from_file_location("lc", os.path.join(SCR, "scripts", "lote_compare.py"))
lc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lc)

census = sorted(glob.glob(os.path.join(SCR, "text", "*.txt")))
originals = sorted(glob.glob(os.path.join(SCR, "text-originals", "*.txt")))
docs_paths = census + originals
labels = lc.discover_labels([lc.read_lines(p) for p in docs_paths])
hc = collections.Counter()
for p in docs_paths:
    hc.update(set(lc.clean(x) for x in lc.read_lines(p) if lc.SECTION.match(lc.clean(x))))
heads = {k for k, v in hc.items() if v >= 20 and lc.SECTION.match(k)}

docs = {}
for p in docs_paths:
    d = lc.analyse(p, labels, heads)
    d["source"] = "census" if p in census else "original-outside-census"
    docs[d["id"]] = d

multi = {k: d for k, d in docs.items() if d["flag"] == "Sim"}
print("== scope")
print("documents:", len(docs), "alterações:", sum(1 for d in docs.values() if d["is_alt"]),
      "lote-flag Sim:", len(multi), "(census", sum(1 for d in multi.values() if d["source"] == "census"),
      "originals", sum(1 for d in multi.values() if d["source"] != "census") , ")")
alt_multi = [k for k, d in multi.items() if d["is_alt"]]
print("alterações with lotes:", len(alt_multi), sorted(alt_multi))
print("lote counts across multi docs:", sorted(collections.Counter(len(d["ents"]) for d in multi.values()).items()))

print("== bullet 4: ordering and numbering in all lote-bearing documents")
asc = [k for k, d in multi.items() if [e["nid"] for e in d["ents"]] == sorted(e["nid"] for e in d["ents"])]
seq_ok = [k for k, d in multi.items() if [e["nid"] for e in d["ents"]] == ["LOT-%04d" % (i + 1) for i in range(len(d["ents"]))]]
rev = [k for k, d in multi.items() if [e["nid"] for e in d["ents"]] == sorted((e["nid"] for e in d["ents"]), reverse=True) and len(d["ents"]) > 1]
gaps = [k for k, d in multi.items() if sorted(int(e["nid"][4:]) for e in d["ents"] if e["nid"]) != list(range(1, len(d["ents"]) + 1))]
print("docs:", len(multi), "list ascending:", len(asc), "ids exactly LOT-0001..n in list order:", len(seq_ok),
      "list fully descending:", len(rev), "non-contiguous ids:", len(gaps))
print("non-contiguous examples:", gaps[:10])
print("LOT-0001 appears in", sum(1 for d in docs.values() if any(e["nid"] == "LOT-0001" for e in d["ents"])),
      "anúncio/alteração versions; LOT-0001 in multi-lote versions only")

pair_order_changed = []
pairs_rows = list(csv.DictReader(open(os.path.join(SCR, "work", "lote_pairs.tsv"), encoding="utf-8"), delimiter="\t"))
for r in pairs_rows:
    if r["flag_O"] == "Sim" or r["flag_A"] == "Sim":
        if r["nids_O"] != r["nids_A"]:
            pair_order_changed.append((r["alt_id"], r["orig_id"], r["nids_O"], r["nids_A"]))
print("pairs with lotes whose list order differs (same ids):", len(pair_order_changed))
for x in pair_order_changed:
    print("   alt", x[0], "orig", x[1], "O:", x[2], "A:", x[3])

print("== bullet 2 and 1: restatement and changes in the 10 lote-bearing alterações")
rest_lots = 0
fields_restated = collections.Counter()
for r in pairs_rows:
    if r["flag_A"] != "Sim":
        continue
    A = docs[r["alt_id"]]
    rest_lots += len(A["ents"])
    for e in A["ents"]:
        for f in ("desc", "valor", "cpv", "place", "prazo"):
            if e[f]:
                fields_restated[f] += 1
print("lotes restated in those alterações:", rest_lots, "fields present:", dict(fields_restated))
free_text_mentions_lote = sum(1 for r in pairs_rows if re.search(r"lote", r["descricao"] or "", re.I))
print("alterações (all pairs) whose 'Descrição das Alterações' mentions 'lote':", free_text_mentions_lote)
print("alterações (all pairs) whose 'Descrição das Alterações' is present:",
      sum(1 for r in pairs_rows if r["descricao"]))

print("== bullet 3: identifiers beyond the number")
ids = collections.Counter()
for k, d in docs.items():
    for f in d["fields"]:
        if f["label"] == "Identificador do Lote":
            ids["Identificador do Lote"] += 1
print("'Identificador do Lote' occurrences:", ids["Identificador do Lote"])
dup_desc = []
for k, d in multi.items():
    c = collections.Counter(lc.norm(e["desc"]) for e in d["ents"] if e["desc"])
    if any(v > 1 for v in c.values()):
        dup_desc.append(k)
print("lote-bearing versions where two lotes share the same Descrição text:", len(dup_desc), sorted(dup_desc))
for k in dup_desc:
    d = docs[k]
    seen = collections.defaultdict(list)
    for e in d["ents"]:
        seen[lc.norm(e["desc"])].append(e)
    for key, es in seen.items():
        if len(es) > 1:
            print("   ", k, [(e["nid"], e["valor"], lc.norm_place(e["place"])[:60] if e["place"] else None) for e in es])
            break

print("== other procedure-level references (not per lote)")
ref_vals = collections.Counter()
for k, d in multi.items():
    v = lc.field_value(d["fields"], "Número de referência interna")
    ref_vals[bool(v)] += 1
print("multi-lote versions with 'Número de referência interna':", ref_vals[True], "of", len(multi))
