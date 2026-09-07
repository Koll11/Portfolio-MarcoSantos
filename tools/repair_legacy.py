"""Apply only baseline accessibility/content fixes to the existing project pages."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
for file,title in [('nocturne.html','Nocturne Battlegrounds'),('cyber.html','Cyber Engineer'),('savestate.html','Save State'),('lusiada1.html','Lusíada-1')]:
    path=ROOT/file
    text=path.read_text(encoding='utf-8-sig')
    text=text.replace('<html lang="pt">','<html lang="en">')
    text=text.replace('<title>Project Detail | Gameplay Programmer</title>',f'<title>{title} | Marco Santos</title>')
    text=text.replace("background-image: url('caminho/para/imagem_nocturne.jpg');",'background-image: none;')
    if 'legacy-accessibility.css' not in text:
        text=text.replace('</head>','    <link rel="stylesheet" href="assets/css/legacy-accessibility.css">\n    <script src="assets/js/legacy-accessibility.js" defer></script>\n</head>')
    text=text.replace('const lenis = new Lenis({',"const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');\n        const lenis = reducedMotion.matches ? null : new Lenis({")
    text=text.replace("lenis.on('scroll', ScrollTrigger.update);","lenis?.on('scroll', ScrollTrigger.update);\n        reducedMotion.addEventListener('change', e => { if (e.matches) lenis?.stop(); else lenis?.start(); });")
    text=text.replace('lenis.raf(time * 1000);','lenis?.raf(time * 1000);')
    text=text.replace('<div class="lightbox-close">CLOSE FEED [X]</div>','<button type="button" class="lightbox-close">Close preview ×</button>')
    text=text.replace('class="project-video" autoplay loop muted playsinline','class="project-video" loop muted playsinline preload="none" poster="assets/media/nocturne.webp"')
    text=re.sub(r'(<img\s+src="[^"\n]+"\s+class="project-video")',r'\1 loading="lazy"',text)
    path.write_text(text,encoding='utf-8')
