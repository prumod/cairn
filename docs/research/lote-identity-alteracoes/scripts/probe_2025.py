"""Probe one 2025 anúncio: DR issue numbers restart each year, so 2025 issues are searched directly.
Usage: python3 -I probe_2025.py <id> <year> <month> <first_issue> <last_issue> <dest_dir>"""
import os, sys, urllib.request, urllib.error
aid, y, m, lo, hi, dl = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
UA = "cairn-research/1.0 (lote identity study; read-only)"
for n in range(lo, hi + 1):
    url = f"https://files.diariodarepublica.pt/cp_hora/{y}/{m}/{n:03d}/{aid}.pdf"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
            body = r.read()
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError):
        continue
    if body.startswith(b"%PDF"):
        with open(os.path.join(dl, aid + ".pdf"), "wb") as fh:
            fh.write(body)
        print("FOUND", aid, "issue", f"{n:03d}", len(body))
        break
else:
    print("NOT_FOUND", aid, lo, hi)
