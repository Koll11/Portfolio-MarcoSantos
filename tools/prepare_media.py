"""Create homepage derivatives; originals are never modified.
Requires Pillow and imageio-ffmpeg (optionally installed into .tools).
"""
from pathlib import Path
import sys, subprocess
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / '.tools'))
from PIL import Image, ImageOps, ImageDraw
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/media'
OUT.mkdir(parents=True, exist_ok=True)
FF = imageio_ffmpeg.get_ffmpeg_exe()
sources = {
    'nocturne': ('NocturneBattlegrounds/NocturneBGClip1.mp4', 8),
    'cyber': ('CyberEngineer/CyberEngineer (3).gif', 1),
    'save-state': ('SaveState/SaveStateGameplay (2).gif', 1),
    'lusiada': ('Lusiada-1/LusiadaGameplay (3).gif', 1),
}
def run(*args):
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', *map(str,args)], check=True)

for name, (source, start) in sources.items():
    width = 480 if name == 'cyber' else 1280
    run('-ss',start,'-i',ROOT/source,'-frames:v','1','-vf',f'scale={width}:-2',OUT/f'{name}.webp')
    width = 360 if name == 'cyber' else 720
    run('-ss',start,'-i',ROOT/source,'-t','5','-an','-vf',f'fps=20,scale={width}:-2','-c:v','libx264','-crf','32','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',OUT/f'{name}.mp4')
    with Image.open(OUT/f'{name}.webp') as im:
        im.thumbnail((560,350))
        im.save(OUT/f'{name}-small.webp',quality=75)
with Image.open(ROOT/'Fotos/MarcoFoto.png') as im:
    im.thumbnail((640,800))
    im.convert('RGB').save(OUT/'marco.webp',quality=80)

# Compositions preserve the proportions of the original gameplay material.
for name, source, width in [
    ('cyber-upgrades', 'CyberEngineer/CyberEngineer (5).gif', 420),
    ('cyber-encounter', 'CyberEngineer/CyberEngineer (7).gif', 420),
    ('save-detail-1', 'SaveState/SaveStateGameplay (3).gif', 720),
    ('save-detail-2', 'SaveState/SaveStateGameplay (4).gif', 720),
    ('lusiada-world', 'Lusiada-1/LusiadaGameplay (1).gif', 1440),
]:
    run('-ss', 1, '-i', ROOT/source, '-frames:v', 1, '-vf', f'scale={width}:-2', OUT/f'{name}.webp')
with Image.open(ROOT/'NocturneBattlegrounds/RobloxScreenShot20260905_170611850.png') as im:
    im.convert('RGB').save(OUT/'nocturne-world.webp', quality=85)
for name in sources:
    with Image.open(OUT/f'{name}.webp') as im:
        im.thumbnail((800,500))
        im.save(OUT/f'{name}-hero.webp', quality=80)

sheet = Image.new('RGB',(1000,640),'#161616')
draw=ImageDraw.Draw(sheet)
for i,name in enumerate(sources):
    with Image.open(OUT/f'{name}.webp') as im:
        im=ImageOps.contain(im,(490,285))
        x=(i%2)*500; y=(i//2)*320
        sheet.paste(im,(x,y+25));draw.text((x+10,y+5),name,fill='white')
(ROOT/'.preview').mkdir(exist_ok=True)
sheet.save(ROOT/'.preview/media-sheet.jpg')
for f in OUT.iterdir():
    print(f.name, round(f.stat().st_size/1024), 'KB')
