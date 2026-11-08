import csv, os, sys
SCR = sys.argv[1]
docs = list(csv.DictReader(open(os.path.join(SCR, "work", "docs.tsv"), encoding="utf-8"), delimiter="\t"))
pairs = list(csv.DictReader(open(os.path.join(SCR, "work", "lote_pairs.tsv"), encoding="utf-8"), delimiter="\t"))
tsv = [l.rstrip("\n").split("\t") for l in open(os.path.join(SCR, "work", "alteracoes.tsv"), encoding="utf-8") if l.strip()]
alts = {d["id"]: d for d in docs if d["is_alteracao"] == "1"}
tsv_alt = {r[0] for r in tsv if len(r) >= 3 and r[0].isdigit()}
print("tsv rows:", len(tsv), "distinct alt ids in tsv:", len(tsv_alt))
print("alteração docs:", len(alts), "by source:", {s: sum(1 for d in alts.values() if d["source"] == s) for s in ("census", "original-outside-census")})
missing = sorted(set(alts) - tsv_alt)
print("alteração docs NOT in tsv:", len(missing))
for k in missing[:25]:
    d = alts[k]
    print("  ", k, d["source"], "flag", d["lotes_flag"], "alt_of", d["alt_of_id"], "nids", d["nids"][:60])
extra = sorted(tsv_alt - set(alts))
print("tsv alt ids that are not alteração docs:", extra[:10])
print("pairs flagged Sim on A or O:", sum(1 for p in pairs if p["flag_A"] == "Sim" or p["flag_O"] == "Sim"))
print("pairs with flag_A Sim:", sorted(p["alt_id"] for p in pairs if p["flag_A"] == "Sim"))
print("alteração docs with flag Sim (all):", sorted(k for k, d in alts.items() if d["lotes_flag"] == "Sim"))
