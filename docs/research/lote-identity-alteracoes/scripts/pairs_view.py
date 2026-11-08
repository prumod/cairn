import csv, sys, os
SCR = sys.argv[1]
rows = list(csv.DictReader(open(os.path.join(SCR, "work", "lote_pairs.tsv"), encoding="utf-8"), delimiter="\t"))
from collections import Counter
print("frame counts (all pairs):", Counter(r["frame"] for r in rows))
print("lote-bearing pairs by frame:", Counter(r["frame"] for r in rows if r["flag_O"] == "Sim" or r["flag_A"] == "Sim"))
print("pairs with any lote change by frame:", Counter(r["frame"] for r in rows if r["any_lote_change"] == "1"))
print("pairs with count/number change by frame:", Counter(r["frame"] for r in rows if r["count_changed"] == "1" or r["nid_set_changed"] == "1"))
print("place-only changes (num_place_differs>0) by frame:", Counter(r["frame"] for r in rows if int(r["num_place_differs"] or 0) > 0))
print()
for r in rows:
    if r["flag_O"] == "Sim" or r["flag_A"] == "Sim":
        print(r["frame"], r["alt_id"], "<-", r["orig_id"], "| n", r["n_O"], "->", r["n_A"],
              "| num_desc_diff", r["num_desc_differs"], "valor", r["num_valor_differs"], "cpv", r["num_cpv_differs"],
              "place", r["num_place_differs"], "prazo", r["num_prazo_differs"], "renum", r["desc_renumbered"],
              "dropped", r["desc_dropped"], "added", r["desc_added"], "| motivo:", r["motivo"][:40], "| secoes:", r["secoes"][:50])
