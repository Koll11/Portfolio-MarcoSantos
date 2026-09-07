"""Native-size Lusíada gameplay derivatives; originals are preserved."""
from pathlib import Path
import sys,subprocess
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'.tools'))
import imageio_ffmpeg
from PIL import Image,ImageDraw
ff=imageio_ffmpeg.get_ffmpeg_exe()
OUT=ROOT/'assets/media/lusiada-case'
OUT.mkdir(parents=True,exist_ok=True)
for name,n in [('nebula',1),('flight',2),('approach',3),('distance',4)]:
 source=ROOT/f'Lusiada-1/LusiadaGameplay ({n}).gif'
 subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-i',str(source),'-an','-vf','fps=15','-c:v','libx264','-crf','28','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/f'{name}.mp4')],check=True)
 subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss','1','-i',str(source),'-frames:v','1',str(OUT/f'{name}.webp')],check=True)
sheet=Image.new('RGB',(852,520),'#111')
for i,name in enumerate(['nebula','flight','approach','distance']):
 im=Image.open(OUT/f'{name}.webp'); im.thumbnail((426,240)); sheet.paste(im,((i%2)*426,(i//2)*260)); ImageDraw.Draw(sheet).text(((i%2)*426,(i//2)*260+240),name,fill='white')
sheet.save(ROOT/'.preview/lusiada-media.jpg')
for p in OUT.iterdir(): print(p.name,p.stat().st_size)
