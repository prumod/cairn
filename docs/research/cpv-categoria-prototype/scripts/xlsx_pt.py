# Extract CODE and PT columns of division 45 from the CPV 2008 xlsx. Usage: python3 -I xlsx_pt.py <xlsx> <out.tsv>
import sys, zipfile, re, xml.etree.ElementTree as ET
ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
z = zipfile.ZipFile(sys.argv[1])
ss = [''.join(t.text or '' for t in si.iter('{%s}t' % ns['m'])) for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', ns)]
sheet = sorted(n for n in z.namelist() if n.startswith('xl/worksheets/sheet'))[0]
rows = []
for r in ET.fromstring(z.read(sheet)).iter('{%s}row' % ns['m']):
    vals = {}
    for c in r.findall('m:c', ns):
        col = re.match(r'[A-Z]+', c.get('r')).group()
        v = c.find('m:v', ns)
        if v is None: continue
        vals[col] = ss[int(v.text)] if c.get('t') == 's' else v.text
    rows.append(vals)
hdr = rows[0]
ci = {v: k for k, v in hdr.items()}
code, pt = ci['CODE'], ci['PT']
with open(sys.argv[2], 'w', encoding='utf-8') as f:
    for r in rows[1:]:
        c = r.get(code, '')
        if c.startswith('45'):
            f.write(c.split('-')[0] + '\t' + r.get(pt, '') + '\n')
