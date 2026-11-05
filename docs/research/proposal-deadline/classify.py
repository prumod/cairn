import sys, re, csv, datetime
raw_path, out_path = sys.argv[1], sys.argv[2]
DT = re.compile(r'^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2})$')
D = re.compile(r'^(\d{2})-(\d{2})-(\d{4})$')
DAYS = re.compile(r'\d+\s*dias', re.I)
DEFER = re.compile(r'plataforma|pe[çc]as|procedimento|conforme|de acordo', re.I)
rows = list(csv.reader(open(raw_path, encoding='utf-8'), delimiter='\t'))
hdr, body = rows[0], rows[1:]
out = []
for r in body:
    aid, ctype, proc, status, raw, nhits, ctx = r
    note = ''
    if status == 'FIELD_ABSENT':
        cls = 'field absent'
        m = re.search(r'Prazo para apresenta[çc][ãa]o das candidaturas:\s*([^|]+)', ctx)
        if m: note = 'propostas line absent; candidaturas line present: ' + m.group(1).strip()
    else:
        v = raw.strip()
        m = DT.match(v); d = D.match(v)
        if m:
            cls = 'date and hour'
            dd, mm, yy, hh, mi = map(int, m.groups())
            try: datetime.date(yy, mm, dd)
            except ValueError: cls = 'other'; note = 'invalid date'
        elif d:
            cls = 'date only'
        elif DAYS.search(v):
            cls = 'number of days'
        elif DEFER.search(v):
            cls = 'defers to platform or pecas'
        else:
            cls = 'other'
    out.append([aid, ctype, proc, cls, raw, note])
with open(out_path, 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f, delimiter='\t', lineterminator='\n')
    w.writerow(['id','procedure','class','raw_value','note'])
    for o in out: w.writerow([o[0], o[2], o[3], o[4], o[5]])
from collections import Counter
c = Counter(o[3] for o in out)
print(len(out))
for k, v in c.most_common(): print(f'{k}\t{v}\t{100*v/len(out):.2f}%')
