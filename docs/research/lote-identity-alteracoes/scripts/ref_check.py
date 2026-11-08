"""Procedure-level identifiers: own anúncio number, Número de referência interna, and their stability along alteração pairs.

Usage: python3 -I ref_check.py <scratch_dir>
"""
import collections
import csv
import glob
import os
import re
import sys

S = sys.argv[1]
OWN = re.compile(r"Anúncio de procedimento n\.º (\d+/\d{4})")
REF = re.compile(r"Número de referência interna:[ \t]*([^\n]*?)[ \t]*\n")
ALT = re.compile(r"Alteração do Anúncio de procedimento n\.º (\d+/\d{4}), de (\d{4}-\d{2}-\d{2}), com o ID (\d+)")


def read(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        return f.read()


info = {}
for p in glob.glob(os.path.join(S, "text", "*.txt")) + glob.glob(os.path.join(S, "text-originals", "*.txt")):
    doc = os.path.basename(p)[:-4]
    t = read(p)
    own = OWN.search(t)
    ref = REF.search(t)
    alt = ALT.search(t)
    info[doc] = {
        "own": own.group(1) if own else None,
        "ref": ref.group(1) if ref else None,
        "alt_of_number": alt.group(1) if alt else None,
        "alt_of_id": alt.group(3) if alt else None,
    }
docs = {r["id"]: r for r in csv.DictReader(open(os.path.join(S, "work", "docs.tsv"), encoding="utf-8"), delimiter="\t")}
lote_docs = [d for d, r in docs.items() if r["lotes_flag"] == "Sim"]

print("documents with own anúncio number:", sum(1 for d in info.values() if d["own"]), "of", len(info))
print("documents with Número de referência interna:", sum(1 for d in info.values() if d["ref"]), "of", len(info))
refs = collections.defaultdict(set)
for d, v in info.items():
    if v["ref"]:
        refs[v["ref"]].add(d)
print("distinct reference numbers:", len(refs), "| reference numbers shared by >1 document:", sum(1 for v in refs.values() if len(v) > 1))
own_dup = collections.defaultdict(set)
for d, v in info.items():
    if v["own"]:
        own_dup[v["own"]].add(d)
print("distinct own anúncio numbers:", len(own_dup), "| shared by >1 document:", sum(1 for v in own_dup.values() if len(v) > 1))
print("lote-bearing docs:", len(lote_docs), "with own number:", sum(1 for d in lote_docs if info.get(d, {}).get("own")),
      "with reference:", sum(1 for d in lote_docs if info.get(d, {}).get("ref")))

pairs = list(csv.DictReader(open(os.path.join(S, "work", "lote_pairs.tsv"), encoding="utf-8"), delimiter="\t"))
print("== lote-bearing alteração pairs: reference equal? own-number link (alt's 'de' number == orig's own)?")
for p in pairs:
    if p["flag_A"] != "Sim":
        continue
    a, o = info[p["alt_id"]], info[p["orig_id"]]
    print(p["alt_id"], p["orig_id"], "ref", a["ref"], o["ref"], "same" if a["ref"] == o["ref"] else "DIFF",
          "| own", a["own"], o["own"], "| alt_of_number", a["alt_of_number"], "== orig own" if a["alt_of_number"] == o["own"] else "!= orig own",
          "| alt_of_id==orig", "yes" if a["alt_of_id"] == p["orig_id"] else "no")
allp = [p for p in pairs]
same = sum(1 for p in allp if info[p["alt_id"]]["ref"] and info[p["alt_id"]]["ref"] == info[p["orig_id"]]["ref"])
diff = sum(1 for p in allp if info[p["alt_id"]]["ref"] and info[p["orig_id"]]["ref"] and info[p["alt_id"]]["ref"] != info[p["orig_id"]]["ref"])
numlink = sum(1 for p in allp if info[p["alt_id"]]["alt_of_number"] == info[p["orig_id"]]["own"])
comp = {}
par = {}
def find(x):
    while par.setdefault(x, x) != x:
        x = par[x]
    return x
for p in pairs:
    par[find(p["alt_id"])] = find(p["orig_id"])
ref_lineages = collections.defaultdict(set)
for d, v in info.items():
    if v["ref"]:
        ref_lineages[v["ref"]].add(find(d))
shared_across = {k: v for k, v in ref_lineages.items() if len(v) > 1}
print("reference values used by more than one lineage (pairs only):", len(shared_across), list(shared_across)[:5])
print("all 109 pairs: reference same:", same, "different:", diff, "| alt_of_number equals orig own number:", numlink)
