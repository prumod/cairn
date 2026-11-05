# Apply rules to the census. Usage: python3 -I apply.py <rules_dir> <frame.tsv> <cpv45_pt.tsv> <out.json>
import sys, json, collections, re
PAT=re.compile(r'(\d)\s*[.ªa]*\s*ª?\s*(?:categoria|cat\.)',re.I)
sys.path.insert(0, sys.argv[1]); from rules import RULES
labels = dict(l.rstrip('\n').split('\t', 1) for l in open(sys.argv[3], encoding='utf-8') if '\t' in l)
def match(code):
    best = None
    for r in RULES:
        if code.startswith(r[0]) and (best is None or len(r[0]) > len(best[0])): best = r
    return best
rows = [l.rstrip('\n').split('\t') for l in open(sys.argv[2], encoding='utf-8')][1:]
rows = [r for r in rows if len(r) > 10]
anuncios = collections.defaultdict(list); s12 = collections.defaultdict(collections.Counter); lotes = collections.Counter(); unmatched = []
for r in rows:
    code, title = r[5], r[10].strip()
    m = match(code)
    if m is None: unmatched.append(code); continue
    anuncios[m[0]].append((code, title)); c12=PAT.findall(r[9]); s12[m[0]][c12[0] if c12 else '-']+=1
    lc = [x.split('=')[1] for x in r[6].split(';') if '=' in x] if r[6] else [code]
    for c in lc:
        mm = match(c); lotes[mm[0] if mm else 'NONE'] += 1
out = []
for p, cat, flag, note in RULES:
    full = p.ljust(8, '0')
    codes = collections.Counter(c for c, _ in anuncios[p])
    out.append(dict(prefix=p, label=labels.get(full, ''), cat=cat, flag=flag, note=note, n=len(anuncios[p]), lotes=lotes[p],
        codes=[dict(code=c, label=labels.get(c, '?'), n=k) for c, k in codes.most_common()],
        titles=[t for _, t in anuncios[p]][:4], s12={k:v for k,v in s12[p].items() if k!='-'}))
json.dump(dict(total=len(rows), total_lotes=sum(lotes.values()), rules=out), open(sys.argv[4], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('anuncios', len(rows), 'unmatched', unmatched, 'lotes', sum(lotes.values()), 'lotes NONE', lotes['NONE'])
tot = collections.Counter(); totl = collections.Counter()
for o in out: tot[o['cat']] += o['n']; totl[o['cat']] += o['lotes']
for k in sorted(tot): print(k, tot[k], f"{100*tot[k]/len(rows):.1f}%", 'lotes', totl[k])
