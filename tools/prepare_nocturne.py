"""Create case-study media derivatives without modifying original captures."""
from pathlib import Path
import sys, subprocess
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'.tools'))
from PIL import Image, ImageOps, ImageDraw
import imageio_ffmpeg
OUT = ROOT/'assets/media/nocturne-case'
OUT.mkdir(parents=True, exist_ok=True)
ff = imageio_ffmpeg.get_ffmpeg_exe()
def run(*args):
    subprocess.run([ff,'-hide_banner','-loglevel','error','-y',*map(str,args)],check=True)
for n in (1,2):
    source=ROOT/f'NocturneBattlegrounds/NocturneBGClip{n}.mp4'
    run('-i',source,'-an','-vf','fps=24,scale=960:-2','-c:v','libx264','-crf',29,'-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',OUT/f'combat-{n}.mp4')
    for t in (4,9,14):
        run('-ss',t,'-i',source,'-frames:v',1,'-vf','scale=1280:-2',OUT/f'combat-{n}-{t}.webp')
with Image.open(ROOT/'NocturneBattlegrounds/RobloxScreenShot20260905_170527716.png') as im:
    im.save(OUT/'town-day.webp',quality=84)
sheet=Image.new('RGB',(960,600),'#111111')
draw=ImageDraw.Draw(sheet)
for i,p in enumerate(sorted(OUT.glob('combat-*.webp'))):
    with Image.open(p) as im:
        thumb=ImageOps.contain(im,(470,170))
        x=(i%2)*480; y=(i//2)*200
        sheet.paste(thumb,(x,y+20)); draw.text((x+5,y+3),p.stem,fill='white')
(ROOT/'.preview').mkdir(exist_ok=True)
sheet.save(ROOT/'.preview/nocturne-case-contact.jpg')
for p in OUT.iterdir(): print(p.name,p.stat().st_size)
