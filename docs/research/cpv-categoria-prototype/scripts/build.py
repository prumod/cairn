# Embed data.json into template.html. Usage: python3 -I build.py <dir>
import sys, json
S = sys.argv[1]
d = json.load(open(S + '/data.json', encoding='utf-8'))
t = open(S + '/template.html', encoding='utf-8').read().replace('__DATA__', json.dumps(d, ensure_ascii=False).replace('</', '<\\/'))
open(S + '/cpv-categoria.html', 'w', encoding='utf-8').write(t)
