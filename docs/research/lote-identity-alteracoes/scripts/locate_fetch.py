"""Locate and download the DR Parte L PDFs for the census ids.

Usage: python3 -I locate_fetch.py <ids.tsv> <downloads_dir> <out_locate.tsv>

The DR path is files.diariodarepublica.pt/cp_hora/YYYY/MM/NNN/ID.pdf, where NNN is the
Série II issue number (089..164 for 2026-05-08..2026-08-25). IDs grow with publication
date, so each id starts its search at the previous id's (issue, month) and walks forward.
"""
import csv
import os
import sys
import time
import urllib.error
import urllib.request

ids_path, dl_dir, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
BASE = "https://files.diariodarepublica.pt/cp_hora/2026/{m}/{n:03d}/{id}.pdf"
MONTHS = ["05", "06", "07", "08", "09"]
ISSUE_MIN, ISSUE_MAX = 89, 164
UA = "cairn-research/1.0 (lote identity study; read-only)"


def get(url):
    """Return the PDF body, or None. The DR answers 200 with an HTML shell for missing files,
    so a body counts only when it starts with the PDF signature."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read() if r.status == 200 else None
    except urllib.error.HTTPError as e:
        if e.code in (404, 403, 410):
            return None
        raise
    except urllib.error.URLError:
        return None
    if body is None or not body.startswith(b"%PDF"):
        return None
    return body


def save(data, path):
    with open(path, "wb") as f:
        f.write(data)
    return len(data)


ids = []
with open(ids_path, encoding="utf-8") as f:
    next(f)
    for line in f:
        cols = line.rstrip("\n").split("\t")
        if cols and cols[0].isdigit():
            ids.append(cols[0])
ids = sorted(set(ids))

results = []
cur_n, cur_m = ISSUE_MIN, MONTHS[0]
for aid in ids:
    found = None
    body = None
    n, mi = cur_n, MONTHS.index(cur_m)
    # walk: at issue n try current month, then the next month; advance issue on miss
    probes = 0
    body = None
    while body is None and n <= ISSUE_MAX and probes < 400:
        for mm in MONTHS[mi:mi + 2]:
            url = BASE.format(m=mm, n=n, id=aid)
            probes += 1
            body = get(url)
            if body is not None:
                found = (n, mm, body)
                break
        if body is None:
            n += 1
    if found is None:
        # fall back: full scan of all issues and months (ids that break monotonicity)
        for n2 in range(ISSUE_MIN, ISSUE_MAX + 1):
            for mm in MONTHS:
                probes += 1
                body = get(BASE.format(m=mm, n=n2, id=aid))
                if body is not None:
                    found = (n2, mm, body)
                    break
            if found:
                break
        if found:
            fallback = "fallback-scan"
        else:
            results.append((aid, "", "", "NOT_FOUND", probes))
            print(aid, "NOT_FOUND", flush=True)
            continue
    else:
        fallback = "walk"
    n, mm, body = found
    cur_n, cur_m = n, mm
    dest = os.path.join(dl_dir, aid + ".pdf")
    size = save(body, dest)
    results.append((aid, f"{n:03d}", mm, f"{fallback}:{size}", probes))
    print(aid, f"{n:03d}", mm, fallback, size, flush=True)
    time.sleep(0.2)

with open(out_path, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f, delimiter="\t", lineterminator="\n")
    w.writerow(["id", "issue", "month", "status", "probes"])
    w.writerows(results)
print("total", len(results), "found", sum(1 for r in results if r[3] != "NOT_FOUND"))
