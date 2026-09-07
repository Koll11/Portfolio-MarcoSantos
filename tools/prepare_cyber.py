"""Native-size Cyber Engineer derivatives. Preserve the original portrait framing."""
from pathlib import Path
import subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'.tools'))
from PIL import Image
import imageio_ffmpeg
OUT=ROOT/'assets/media/cyber-case'
OUT.mkdir(parents=True,exist_ok=True)
ff=imageio_ffmpeg.get_ffmpeg_exe()
for name,n in [('arena',3),('upgrades',5),('waves',7)]:
    source=ROOT/f'CyberEngineer/CyberEngineer ({n}).gif'
    subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-i',str(source),'-an','-vf','fps=15','-c:v','libx264','-crf','30','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/f'{name}.mp4')],check=True)
    for time in (1,6):
        subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss',str(time),'-i',str(source),'-frames:v','1',str(OUT/f'{name}-{time}.webp')],check=True)
with Image.open(ROOT/'CyberEngineer/engineer.png') as im:
    im.thumbnail((320,400)); im.save(OUT/'engineer.webp',quality=85)
for p in OUT.iterdir(): print(p.name,p.stat().st_size)

