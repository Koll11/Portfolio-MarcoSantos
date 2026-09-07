"""Check local HTML references and homepage media budgets without a build dependency."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

ROOT=Path(__file__).resolve().parents[1]
errors=[]
class Check(HTMLParser):
    def __init__(self,path):
        super().__init__(); self.path=path; self.ids=set(); self.fragments=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids: errors.append(f'{self.path.name}: duplicate id {a["id"]}')
            self.ids.add(a['id'])
        if tag=='html' and a.get('lang')!='en': errors.append(f'{self.path.name}: wrong language')
        for attr in ['src','href','poster','data-src','data-poster','data-clip']:
            value=a.get(attr,'')
            if not value: continue
            url=urlsplit(value)
            if url.scheme or url.netloc: continue
            if url.path and not (self.path.parent/unquote(url.path)).is_file(): errors.append(f'{self.path.name}: missing {value}')
            if not url.path and url.fragment: self.fragments.append(url.fragment)
        if self.path.name=='index.html' and tag=='video':
            if a.get('src') or a.get('preload')!='none' or 'autoplay' in a: errors.append('Homepage video downloads before play')
for path in ROOT.glob('*.html'):
    check=Check(path);check.feed(path.read_text(encoding='utf-8-sig'))
    errors.extend(f'{path.name}: missing #{frag}' for frag in check.fragments if frag not in check.ids)
previews=list((ROOT/'assets/media').glob('*.mp4'))
for path in previews:
    if path.stat().st_size>400_000: errors.append(f'{path.name}: exceeds 400 KB preview budget')
if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: five pages, local links/assets, fragment targets, language, opt-in homepage video loading.')
print(f'PASS: {len(previews)} preview videos, {sum(p.stat().st_size for p in previews):,} bytes combined.')
