"""Fetch the original anúncios that alterações name but the census does not contain.

Usage: python3 -I fetch_originals.py <targets.tsv> <downloads_dir> <out_locate.tsv>

targets.tsv: altered_id <TAB> date (YYYY-MM-DD, the date the alteração gives for the altered anúncio).
The DR path is files.diariodarepublica.pt/cp_hora/YYYY/MM/NNN/ID.pdf. The issue number is estimated
from the weekday count since issue 089 (2026-05-08), then searched outward by distance; a body counts
only when it starts with the PDF signature, because the DR answers 200 with an HTML shell for misses.
"""
import csv
import datetime as dt
import os
import sys
import time
import urllib.error
import urllib.request

targets_path, dl_dir, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
BASE = "https://files.diariodarepublica.pt/cp_hora/{y}/{m}/{n:03d}/{id}.pdf"
ANCHOR = dt.date(2026, 5, 8)  # issue 089
ANCHOR_N = 89
UA = "cairn-research/1.0 (lote identity study; read-only)"


def get(url):
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


def weekdays_between(a, b):
    """Weekdays in [a, b) when b >= a, negative when b < a."""
    if b >= a:
        return sum(1 for i in range((b - a).days) if (a + dt.timedelta(i)).weekday() < 5)
    return -weekdays_between(b, a)


def estimate(day):
    return ANCHOR_N + weekdays_between(ANCHOR, day)


rows = []
with open(targets_path, encoding="utf-8") as f:
    for line in f:
        cols = line.rstrip("\n").split("\t")
        if len(cols) >= 2 and cols[0].isdigit():
            rows.append((cols[0], dt.date.fromisoformat(cols[1])))

out = []
for aid, day in rows:
    est = estimate(day)
    year = day.year
    months = [day.month, day.month - 1 if day.month > 1 else 12, day.month + 1 if day.month < 12 else 1]
    body = None
    found = None
    probes = 0
    for off in [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 9, -9, 10, -10, 11, -11, 12, -12]:
        n = est + off
        if n < 1:
            continue
        for mm in months:
            probes += 1
            body = get(BASE.format(y=year, m=f"{mm:02d}", n=n, id=aid))
            if body is not None:
                found = (n, mm)
                break
        if found:
            break
        if probes >= 80:
            break
    if found is None:
        out.append((aid, day.isoformat(), est, "", "", "NOT_FOUND", probes))
        print(aid, day, "est", est, "NOT_FOUND", probes, flush=True)
        continue
    n, mm = found
    dest = os.path.join(dl_dir, aid + ".pdf")
    with open(dest, "wb") as fh:
        fh.write(body)
    out.append((aid, day.isoformat(), est, f"{n:03d}", f"{mm:02d}", f"{len(body)}", probes))
    print(aid, day, "est", est, "->", f"{n:03d}", f"{mm:02d}", len(body), "probes", probes, flush=True)
    time.sleep(0.2)

with open(out_path, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f, delimiter="\t", lineterminator="\n")
    w.writerow(["altered_id", "date", "est_issue", "issue", "month", "bytes_or_status", "probes"])
    w.writerows(out)
print("total", len(out), "found", sum(1 for r in out if r[5] != "NOT_FOUND"))
