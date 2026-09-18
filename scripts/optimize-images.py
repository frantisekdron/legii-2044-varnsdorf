"""Build responsive WebP renditions; keep original galleries and plans intact."""
from pathlib import Path
from PIL import Image, ImageOps
from concurrent.futures import ThreadPoolExecutor
import hashlib,json
root=Path(__file__).resolve().parents[1]
media=root/'public/media'
hero=Path('/Users/frantisekdron/Desktop/bordel/Varnsdorf/FINAL FOTO/00 0 vsechny-fotky/DJI_20260915163221_0411_D.jpg')
if hero.exists():
 im=ImageOps.exif_transpose(Image.open(hero)).convert('RGB');im.thumbnail((2200,2200))
 im.save(media/'hero-varnsdorf-0411.webp','WEBP',quality=82,method=6)
out=media/'responsive';out.mkdir(exist_ok=True)
files=[p for p in media.glob('*.webp') if not p.stem.endswith('-thumb')]
def render(p):
 raw=p.read_bytes();digest=hashlib.sha256(raw).hexdigest()[:9]
 im=Image.open(p).convert('RGB');w,h=im.size
 candidates=[]
 for size in [320,768,1200]:
  if size>=w:continue
  target=out/f'{p.stem}-{digest}-{size}.webp'
  if not target.exists():
   resized=im.resize((size,round(h*size/w)),Image.Resampling.LANCZOS)
   resized.save(target,'WEBP',quality=76 if size<1200 else 79,method=5)
  candidates.append([f'/media/responsive/{target.name}',size])
 candidates.append(['/media/'+p.name,w])
 return '/media/'+p.name,{'width':w,'height':h,'srcSet':', '.join(f'{src} {width}w' for src,width in candidates),'preview':candidates[0][0]}
with ThreadPoolExecutor(max_workers=5) as pool: index=dict(pool.map(render,files))
(root/'app/image-index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':'))+'\n')
print('Optimized sources:',len(index),'responsive files:',len(list(out.glob('*.webp'))))
print('New hero bytes:',(media/'hero-varnsdorf-0411.webp').stat().st_size)
