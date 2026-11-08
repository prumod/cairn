"""Check whether the two place changes differ only in NUT III codes (PTxxx), and where each code's name appears."""
import csv, glob, os, re, sys
SCR = sys.argv[1]
rows = list(csv.DictReader(open(os.path.join(SCR, "work", "lote_entries.tsv"), encoding="utf-8"), delimiter="\t"))
code = re.compile(r"^PT[0-9A-Z]{3}$")
def toks(s):
    return [t.strip() for t in (s or "").split(" / ") if t.strip()]
def strip_codes(s):
    out = []
    for t in toks(s):
        head = t.split(" - ")[0].strip()
        if code.match(head):
            continue
        out.append(head)
    return sorted(out)
for alt, orig in [("419966402", "419964514"), ("419966438", "419963843")]:
    A = {r["nid"]: r for r in rows if r["doc"] == alt}
    O = {r["nid"]: r for r in rows if r["doc"] == orig}
    for nid in sorted(set(A) & set(O)):
        a, o = A[nid]["place"], O[nid]["place"]
        print(alt, "<-", orig, nid, "codes-only difference:", strip_codes(a) == strip_codes(o),
              "| NUT codes O:", sorted({t.split(' - ')[0] for t in toks(o) if code.match(t.split(' - ')[0])}),
              "A:", sorted({t.split(' - ')[0] for t in toks(a) if code.match(t.split(' - ')[0])}))
        break
# name for each code in the corpus texts
texts = glob.glob(os.path.join(SCR, "text", "*.txt")) + glob.glob(os.path.join(SCR, "text-originals", "*.txt"))
for c in ["PT16E", "PT192", "PT184", "PT1C2"]:
    names = {}
    for p in texts:
        for m in re.finditer(re.escape(c) + r" - ([^\n/]{3,40})", open(p, encoding="utf-8").read()):
            names[m.group(1).strip()] = names.get(m.group(1).strip(), 0) + 1
    print(c, dict(sorted(names.items(), key=lambda kv: -kv[1])[:3]))
