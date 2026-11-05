# Compare draft categoria with the categoria section 12 names. Usage: python3 -I agree.py <rules_dir> <frame.tsv>
import sys, re, collections
sys.path.insert(0, sys.argv[1]); from rules import RULES
def match(code):
    best=None
    for r in RULES:
        if code.startswith(r[0]) and (best is None or len(r[0])>len(best[0])): best=r
    return best
rows=[l.rstrip('\n').split('\t') for l in open(sys.argv[2],encoding='utf-8')][1:]
rows=[r for r in rows if len(r)>10]
ORD={'1':'1','2':'2','3':'3','4':'4','5':'5','primeira':'1','segunda':'2','terceira':'3','quarta':'4','quinta':'5'}
pat=re.compile(r'(\d)\s*[.ªa]*\s*ª?\s*(?:categoria|cat\.)',re.I)
pat2=re.compile(r'(primeira|segunda|terceira|quarta|quinta)\s+categoria',re.I)
stat=collections.Counter(); dis=collections.defaultdict(list); pc=collections.defaultdict(list)
for r in rows:
    code,s12,title=r[5],r[9],r[10].strip()
    cats=[m for m in pat.findall(s12)]+[ORD[m.lower()] for m in pat2.findall(s12)]
    m=match(code); cat=m[1]
    if not cats: stat['no s12 cat']+=1; continue
    first=cats[0]
    if cat=='PC': stat['PC, s12 names']+=1; pc[m[0]].append(first); continue
    if first==cat: stat['agree(first)']+=1
    elif cat in cats: stat['agree(any)']+=1
    else: stat['disagree']+=1; dis[m[0]].append((code,first,title[:60]))
print(stat)
for k,v in dis.items():
    print('DIS',k,len(v)); [print('   ',x) for x in v[:6]]
for k,v in pc.items(): print('PC',k,collections.Counter(v))
