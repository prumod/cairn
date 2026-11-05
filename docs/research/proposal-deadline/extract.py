import sys, re, csv, os
frame, txtdir, out = sys.argv[1], sys.argv[2], sys.argv[3]
SEC = re.compile(r'^\s*(\d{1,2})\s*-\s+[A-ZÇÃÕÉÍÓÚÂÊÔÀ ]{4,}')
rows = []
with open(frame, encoding='utf-8') as f:
    hdr = f.readline().rstrip('\n').split('\t')
    ci, pi = hdr.index('contract_type'), hdr.index('procedure')
    ids = []
    for line in f:
        c = line.rstrip('\n').split('\t')
        if len(c) > 1: ids.append((c[0], c[ci], c[pi]))
for aid, ctype, proc in ids:
    p = os.path.join(txtdir, aid + '.txt')
    lines = open(p, encoding='utf-8', errors='replace').read().splitlines()
    # locate section 13 header
    start = None
    for i, l in enumerate(lines):
        if re.match(r'^\s*13\s*-\s*CONDI', l):
            start = i; break
    if start is None:
        rows.append((aid, ctype, proc, 'SEC13_HEADER_MISSING', '', 0, '')); continue
    end = len(lines)
    for j in range(start+1, len(lines)):
        if SEC.match(lines[j]):
            end = j; break
    block = lines[start+1:end]
    hits = [k for k, l in enumerate(block) if re.match(r'^\s*Prazo para apresenta[çc][ãa]o das propostas\s*:', l)]
    if not hits:
        rows.append((aid, ctype, proc, 'FIELD_ABSENT', '', 0, ' | '.join(x for x in block if x.strip())[:300])); continue
    vals = []
    for k in hits:
        v = re.sub(r'^\s*Prazo para apresenta[çc][ãa]o das propostas\s*:\s*', '', block[k]).strip()
        # continuation lines: following non-field lines until next "Label:" line
        m = k+1
        while m < len(block) and block[m].strip() and not re.match(r'^[^:]{3,120}:', block[m]):
            v += ' / ' + block[m].strip(); m += 1
        vals.append(v)
    rows.append((aid, ctype, proc, 'FOUND', ' || '.join(vals), len(hits), ''))
with open(out, 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['id','contract_type','procedure','status','raw_value','n_hits','section13_context_if_absent'])
    w.writerows(rows)
print(len(rows))
