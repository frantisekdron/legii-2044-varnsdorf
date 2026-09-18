'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, Images, Image as ImageIcon} from 'lucide-react';
import {Photo} from './photo';
import imageIndex from './image-index.json';

export type GalleryPhoto = {src: string; thumb?: string; caption?: string; alt?: string; group?: string};

export function PhotoGallery({photos, title, index, onChange}: {
  photos: GalleryPhoto[]; title: string; index: number; onChange: (index: number) => void;
}) {
  const [overview, setOverview] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const touch = useRef<{x: number; y: number} | null>(null);
  const active = Math.min(index, Math.max(0, photos.length - 1));
  const current = photos[active];
  const caption = (photo: GalleryPhoto, i: number) => photo.caption || photo.alt || photo.group || `${title} · pohled ${i + 1}`;
  const step = (delta: number) => onChange((active + delta + photos.length) % photos.length);

  useEffect(() => {
    const strip = rail.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({left: thumb.offsetLeft - strip.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2, behavior: 'instant'});
  }, [active, overview]);

  useEffect(() => {
    if (photos.length < 2) return;
    const entries = imageIndex as Record<string, {srcSet: string; preview: string}>;
    const neighbors = [...new Set([(active + 1) % photos.length, (active - 1 + photos.length) % photos.length])];
    neighbors.forEach(i => {
      const photo = photos[i];
      const entry = entries[photo.src];
      const image = new window.Image();
      if (entry) { image.sizes = '(max-width: 760px) 100vw, 90vw'; image.srcset = entry.srcSet; }
      image.src = entry?.preview || photo.src;
    });
  }, [active, photos]);

  if (!current) return <p className="photo-empty">Fotografie připravujeme.</p>;

  return <div className="photo-viewer" role="region" aria-label={`Fotogalerie: ${title}`} onKeyDown={e => {
    if (overview || photos.length < 2) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1);
    }
  }}>
    {overview ? <div className="photo-overview" aria-label="Přehled všech fotografií">
      {photos.map((photo, i) => <button key={`${photo.src}-${i}`} aria-label={`Zobrazit fotografii ${i + 1}: ${caption(photo, i)}`} onClick={() => {onChange(i); setOverview(false);}}>
        <Photo src={photo.thumb || photo.src} sizes="(max-width: 760px) 45vw, 25vw" alt=""/>
        <span><b>{String(i + 1).padStart(2, '0')}</b>{caption(photo, i)}</span>
      </button>)}
    </div> : <div className="photo-canvas" tabIndex={0} aria-label="Fotografie. Použijte šipky vlevo a vpravo."
      onTouchStart={e => {touch.current = e.touches.length === 1 ? {x: e.touches[0].clientX, y: e.touches[0].clientY} : null;}}
      onTouchEnd={e => {
        if (!touch.current || !e.changedTouches.length || photos.length < 2) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
      }} onTouchCancel={() => {touch.current = null;}}>
      <Photo key={current.src} src={current.src} sizes="(max-width: 760px) 100vw, 90vw" alt={caption(current, active)} loading="eager" draggable={false}/>
      {photos.length > 1 && <><button className="photo-arrow photo-arrow-prev" onClick={() => step(-1)} aria-label="Předchozí fotografie"><ArrowLeft size={21}/></button><button className="photo-arrow photo-arrow-next" onClick={() => step(1)} aria-label="Další fotografie"><ArrowRight size={21}/></button></>}
    </div>}
    <div className="photo-toolbar">
      <div className="photo-current" role="status" aria-live="polite" aria-atomic="true"><span className="photo-number">{String(active + 1).padStart(2, '0')}<i>/ {String(photos.length).padStart(2, '0')}</i></span><p>{caption(current, active)}</p></div>
      <div className="photo-tools">
        {photos.length > 1 && <button onClick={() => setOverview(!overview)} aria-pressed={overview} aria-label={overview ? 'Zpět na fotografii' : 'Přehled všech fotografií'}>{overview ? <ImageIcon size={17}/> : <Images size={17}/>}<span>{overview ? 'Fotografie' : 'Přehled'}</span></button>}
        <a href={current.src} target="_blank" rel="noreferrer" aria-label="Otevřít fotografii v plné velikosti"><ArrowUpRight size={18}/><span>Plná velikost</span></a>
      </div>
    </div>
    {!overview && photos.length > 1 && <div className="photo-filmstrip" ref={rail} aria-label="Náhledy fotografií">
      {photos.map((photo, i) => <button key={`${photo.src}-${i}`} className={i === active ? 'is-current' : ''} onClick={() => onChange(i)} aria-label={`Fotografie ${i + 1}: ${caption(photo, i)}`} aria-pressed={i === active}>
        <Photo sizes="112px" src={photo.thumb || photo.src} alt=""/><span>{String(i + 1).padStart(2, '0')}</span>
      </button>)}
    </div>}
  </div>;
}
