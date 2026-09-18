'use client';

import {Photo as ResponsivePhoto} from './photo';
import {useEffect, useRef, useState, type PointerEvent} from 'react';
import {ArrowDown, ArrowUpRight, Pause, Play} from 'lucide-react';
import {siteConfig} from './site-config';
import {visualizations} from './visualizations';

const panorama = '/media/hero-varnsdorf-0411.webp';
const selectedLiving=visualizations.find(v=>v.sceneId==='typ03-living')||visualizations.find(v=>/^typ\d+-living$/.test(v.sceneId));
const selectedStaircase=visualizations.find(v=>v.sceneId==='staircase');
const highlights = [
  {src: '/media/15-dum-a-fasady-16.webp', alt: 'Obnovená fasáda domu Legií 2044', label: 'Legií 2044', className: 'facade'},
  {src: '/media/hero-living-visualization-typ03-a.webp', alt: 'Vizualizace obývacího pokoje s kuchyní ve skandinávském stylu', label: 'Prostor pro život', className: 'room', visualization: true, caption: 'Vizualizace možného vybavení · obývací pokoj s kuchyní, typ 3, varianta A. Nejde o fotografii současného stavu.'},
  {src: '/media/hero-staircase-staged-r5-a-1920.webp', alt: 'Vizualizace uklizeného schodiště s rostlinou a obrazem', label: 'Schodiště', className: 'detail', visualization: true, caption: 'Vizualizace úpravy schodiště · rostlina a obraz při zachování původního zábradlí a dispozice. Nejde o fotografii současného stavu.'},
].map(photo=>{
  const approved=photo.className==='room'?selectedLiving:photo.className==='detail'?selectedStaircase:undefined;
  return approved?{...photo,src:approved.src,alt:approved.title+' — vizualizace',visualization:true,caption:approved.caption}:photo;
});

function HeroBackdrop() {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!siteConfig.heroVideo || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.current?.play().catch(() => {});
  }, []);
  if (!siteConfig.heroVideo || failed) return <ResponsivePhoto className="hero-panorama" src={panorama} sizes="100vw" loading="eager" alt="Varnsdorf a okolní krajina z dronu" fetchPriority="high" />;
  return <>
    <video ref={video} className="hero-panorama" src={siteConfig.heroVideo} poster={panorama} muted loop playsInline preload="metadata" onError={() => setFailed(true)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Videoprohlídka domu Legií 2044" />
    <button className="video-toggle" onClick={() => {if (playing) video.current?.pause(); else video.current?.play().catch(() => setFailed(true));}} aria-label={playing ? 'Pozastavit video' : 'Přehrát video'}>{playing ? <Pause size={17}/> : <Play size={17}/>}</button>
  </>;
}

export function Hero({onGallery}: {onGallery: (title: string, photos: {src: string;caption?:string}[]) => void}) {
  const stack = useRef<HTMLDivElement>(null);
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    stack.current?.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - box.top) / box.height) * 5}deg`);
    stack.current?.style.setProperty('--tilt-y', `${((event.clientX - box.left) / box.width - 0.5) * 7}deg`);
  };
  const reset = () => {
    stack.current?.style.setProperty('--tilt-x', '0deg');
    stack.current?.style.setProperty('--tilt-y', '0deg');
  };
  return <section className="hero hero-collage">
    <HeroBackdrop/>
    <div className="hero-atmosphere"/>
    <div className="hero-composition">
      <div className="hero-copy">
        <p className="eyebrow">ČINŽOVNÍ DŮM NA PRODEJ · VARNSDORF</p>
        <h1>Silné základy.<br/><em>Nová kapitola.</em></h1>
        <p>Devět bytů, dva obchodní prostory a půda s potenciálem. Jeden dům po rozsáhlé rekonstrukci.</p>
        <a className="primary-link" href="#jednotky">Prohlédnout dům <ArrowDown size={17}/></a>
        <span className="hero-sale">Nemovitost se prodává jako celek.</span>
      </div>
      <div className="hero-photo-stage" onPointerMove={tilt} onPointerLeave={reset}>
        <div className="hero-photo-stack" ref={stack}>
          {highlights.map((photo, index) => <button key={photo.className} className={`hero-photo-card hero-photo-${photo.className}`} aria-label={`${photo.visualization?'Prohlédnout vizualizaci':'Prohlédnout fotografie'}: ${photo.label}`} onClick={() => onGallery('Dům a jeho interiéry', [...highlights.slice(index), ...highlights.slice(0, index)])}>
            <ResponsivePhoto sizes="(max-width:760px) 52vw, 30vw" loading="eager" src={photo.src} alt={photo.alt} width="1000" height="800" decoding="async"/>
            {photo.visualization&&<span className="hero-visualization-label">Vizualizace</span>}
            <span className="hero-photo-caption">{photo.label}<ArrowUpRight size={15}/></span>
          </button>)}
        </div>
      </div>
    </div>
    <div className="hero-foot"><span>LEGIÍ 2044, VARNSDORF</span><a href="#pribeh">Dům s příběhem <ArrowDown size={14}/></a></div>
  </section>;
}
