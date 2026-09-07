"""Save State: preserve native gameplay framing, load motion only on request."""
from pathlib import Path
import subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'.tools'))
import imageio_ffmpeg
OUT=ROOT/'assets/media/save-case'
OUT.mkdir(parents=True,exist_ok=True)
ff=imageio_ffmpeg.get_ffmpeg_exe()
for name,source in [('assembly','SaveStateGameplay (2).gif'),('placement','SaveStateGameplay (3).gif'),('delivery','SaveStateGameplay (4).gif')]:
    source=ROOT/'SaveState'/source
    subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-i',str(source),'-an','-vf','fps=15','-c:v','libx264','-crf','27','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/f'{name}.mp4')],check=True)
    subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss','1','-i',str(source),'-frames:v','1',str(OUT/f'{name}.webp')],check=True)
for p in OUT.iterdir(): print(p.name,p.stat().st_size)
