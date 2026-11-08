"""Population table: every document in docs.tsv with its frame, issue, alteração flag, lote flag and pair status.

Usage: python3 -I population.py <scratch_dir>
"""
import collections
import csv
import os
import sys

SCR = sys.argv[1]
W = os.path.join(SCR, "work")


def rows(path, header=True):
    with open(path, encoding="utf-8") as f:
        if header:
            return list(csv.DictReader(f, delimiter="\t"))
        return [dict(zip(["id", "date"], line.rstrip("\n").split("\t")[:2])) for line in f if line.strip()]


docs = {r["id"]: r for r in rows(os.path.join(W, "docs.tsv"))}
issue = {}
date = {}
for r in rows(os.path.join(SCR, "locate.tsv")):
    issue[r["id"]] = (r["issue"], r["month"], "census")
for r in rows(os.path.join(W, "originals_locate.tsv")):
    if r["issue"].isdigit():
        issue[r["altered_id"]] = (r["issue"], r["month"], "outside")
        date[r["altered_id"]] = r["date"]
for r in rows(os.path.join(W, "chain_locate.tsv")):
    if r["issue"].isdigit():
        issue[r["altered_id"]] = (r["issue"], r["month"], "outside")
        date[r["altered_id"]] = r["date"]
issue["419905698"] = ("245", "12", "outside")  # 2025 probe: 2025/12/245
date["419905698"] = "2025-12-22"

pairs = rows(os.path.join(W, "lote_pairs.tsv"))
paired_alt = {p["alt_id"] for p in pairs}
paired_orig = {p["orig_id"] for p in pairs}
chain_alts = {r["alteracao_id"] for r in rows(os.path.join(W, "alteracoes_chain.tsv"))}

def frame(doc_id):
    if doc_id not in issue:
        return "no-issue"
    iss, month, src = issue[doc_id]
    year = date.get(doc_id, "")[:4]
    n = int(iss)
    if year == "2025" or (year == "2026" and n < 89):
        return "pre-window"
    if n > 164:
        return "post-window"
    return "window-census" if src == "census" else "window-outside"

print("docs in docs.tsv:", len(docs))
counts = collections.Counter()
lote_alt = collections.Counter()
unpaired = []
for d_id, d in docs.items():
    fr = frame(d_id)
    alt = d.get("is_alteracao") == "1"
    lot = d.get("lotes_flag") == "Sim"
    counts[(fr, "alteração" if alt else "anúncio", "lotes" if lot else "sem lotes")] += 1
    if alt and d_id not in paired_alt:
        unpaired.append((d_id, fr, lot, date.get(d_id, ""), issue.get(d_id, ("", "", ""))[0]))
for k in sorted(counts):
    print("  %-14s %-10s %-10s %d" % (k[0], k[1], k[2], counts[k]))
print("alterações with no pair as alt_id:", len(unpaired))
for u in unpaired:
    print("   ", u)
print("pairs:", len(pairs), "alt frames:", collections.Counter(p["frame"] for p in pairs))
print("lote-bearing pairs:", sum(1 for p in pairs if p["flag_A"] == "Sim"))
print("chain alterações (alteracoes_chain.tsv):", len(chain_alts))
