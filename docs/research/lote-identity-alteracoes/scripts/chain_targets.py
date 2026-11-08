"""Chain alterações: alterações (outside the census) that alter an anúncio not yet in the corpus.
Writes work/alteracoes_chain.tsv (all chain alterações) and work/chain_targets.tsv (targets to fetch)."""
import csv, glob, os, re, sys
SCR = sys.argv[1]
HDR = re.compile(r"Alteração do Anúncio de procedimento n\.º (\d+/\d{4}), de (\d{4}-\d{2}-\d{2}), com o ID (\d+)")
in_tsv = {l.split("\t")[0] for l in open(os.path.join(SCR, "work", "alteracoes.tsv"), encoding="utf-8") if l.strip()}
corpus = set()
for p in glob.glob(os.path.join(SCR, "text", "*.txt")) + glob.glob(os.path.join(SCR, "text-originals", "*.txt")):
    corpus.add(os.path.basename(p)[:-4])
rows = []
for p in sorted(glob.glob(os.path.join(SCR, "text-originals", "*.txt"))):
    aid = os.path.basename(p)[:-4]
    if aid in in_tsv:
        continue
    m = HDR.search("\n".join(open(p, encoding="utf-8").read().split("\n")))
    if m:
        rows.append((aid, m.group(3), m.group(2), m.group(1)))
print("chain alterações:", len(rows))
with open(os.path.join(SCR, "work", "alteracoes_chain.tsv"), "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f, delimiter="\t", lineterminator="\n")
    w.writerow(["alteracao_id", "altered_id", "date", "number"])
    w.writerows(rows)
targets = sorted({(r[1], r[2]) for r in rows if r[1] not in corpus})
print("targets not in corpus:", len(targets))
with open(os.path.join(SCR, "work", "chain_targets.tsv"), "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f, delimiter="\t", lineterminator="\n")
    w.writerows(targets)
