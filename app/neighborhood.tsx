import {Photo as ResponsivePhoto} from './photo';
import {ArrowUpRight, BookOpen, Mountain, Trees, Waves, TrainFront, Landmark, ArrowRight} from 'lucide-react';

const benefits = [
  {title: 'Park v ulici Legií', label: 'ZELEŇ VE MĚSTĚ', text: 'Přímo v ulici je městský park. Město zde obnovilo zeleň a vysadilo okrasné třešně a javory.', icon: Trees, source: 'https://www.varnsdorf.cz/cz/aktuality/informace-z-mesta/park-ulici-legii-prochazi-rozsahlou-obnovou-zelene.html'},
  {title: 'Školy pro různé životní etapy', label: 'KAŽDODENNÍ ŽIVOT', text: 'Mateřské a základní školy, gymnázium, odborné školy i základní umělecká škola přímo ve Varnsdorfu.', icon: BookOpen, source: 'https://www.varnsdorf.cz/cz/o-varnsdorfu/data-fakta/skolstvi.html'},
  {title: 'Sport v každém ročním období', label: 'AKTIVNÍ ODPOČINEK', text: 'Plavecký bazén, sportovní hala, zimní stadion a tenisové kurty rozšiřují možnosti volného času.', icon: Waves, source: 'https://www.varnsdorf.cz/cz/o-varnsdorfu/'},
  {title: 'Divadlo, kino i knihovna', label: 'KULTURA', text: 'Městské divadlo s galerií, kino Centrum Panorama a knihovna tvoří zázemí pro kulturní život.', icon: Landmark, source: 'https://www.varnsdorf.cz/cz/o-varnsdorfu/'},
  {title: 'Přes hranici za dalšími možnostmi', label: 'ČESKO–NĚMECKÉ PŘÍHRANIČÍ', text: 'Poloha u Německa a železniční spojení směrem na Žitavu otevírají prostor pro výlety do sousedního regionu.', icon: TrainFront, source: 'https://www.varnsdorf.cz/cz/o-varnsdorfu/'},
  {title: 'Lužické hory na dosah', label: 'KRAJINA PRO VOLNÝ ČAS', text: 'Varnsdorf leží na úpatí Lužických hor. Jedlová, Tolštejn a okolní trasy nabízejí cíle pro pěší i cyklistické výlety.', icon: Mountain, source: 'https://www.varnsdorf.cz/cz/volny-cas/turistika/'},
];

export const neighborhoodPhotos = [
  {number: 7, caption: 'Hrádek nad městem · sportovní areál v popředí'},
  {number: 9, caption: 'Hrádek v podvečerním světle'},
  {number: 1, caption: 'Zeleň, řeka a město z ptačí perspektivy'},
  {number: 4, caption: 'Historické centrum Varnsdorfu'},
  {number: 6, caption: 'Městská zástavba mezi zelení'},
  {number: 10, caption: 'Panorama Varnsdorfu a okolní krajiny'},
].map(({number, caption}) => ({src: `/media/17-okoli-a-mesto-${number}.webp`, thumb: `/media/17-okoli-a-mesto-${number}-thumb.webp`, caption}));

export function Neighborhood({onGallery}: {onGallery: (index: number) => void}) {
  return <section id="lokalita" className="neighborhood section" aria-labelledby="neighborhood-title">
    <div className="section-head"><div><p className="eyebrow">VARNSDORF · LEGIÍ 2044</p><h2 id="neighborhood-title">Město pro každý den.<br/><em>Krajina pro sebe.</em></h2></div><div className="location-lead"><p>Život ve městě s vlastním kulturním a sportovním zázemím. K tomu Lužické hory a česko–německé příhraničí pro chvíle, kdy chcete vyrazit dál.</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Legi%C3%AD+2044+Varnsdorf" target="_blank" rel="noreferrer">Zobrazit adresu na mapě <ArrowUpRight size={17}/></a></div></div>
    <div className="landscape-story">
      <div className="landscape-heading"><div><p className="eyebrow">MĚSTO MEZI KOPCI</p><h3>Na úpatí<br/><em>Lužických hor.</em></h3></div><button onClick={()=>onGallery(0)}>Prohlédnout okolí <span>06</span><ArrowRight size={20}/></button></div>
      <div className="landscape-diptych">
        <button className="landscape-wide" onClick={()=>onGallery(0)} aria-label="Prohlédnout Hrádek nad městem a sportovní areál"><ResponsivePhoto sizes="(max-width:760px) 86vw, 58vw" src={neighborhoodPhotos[0].src} alt={neighborhoodPhotos[0].caption}/><span><small>01 / MĚSTO A KRAJINA</small><ArrowUpRight size={23}/></span></button>
        <button className="landscape-portrait" onClick={()=>onGallery(1)} aria-label="Prohlédnout Hrádek v podvečerním světle"><ResponsivePhoto sizes="(max-width:760px) 57vw, 28vw" src={neighborhoodPhotos[1].src} alt={neighborhoodPhotos[1].caption}/><span><small>02 / PODVEČER NA HRÁDKU</small><ArrowUpRight size={23}/></span></button>
      </div>
      <p className="landscape-footnote">Varnsdorf a jeho okolí. Zachyceno z ptačí perspektivy.</p>
    </div>
    <div className="location-benefits">{benefits.map(({title, label, text, icon: Icon, source}) => <article key={title}><Icon size={25} strokeWidth={1.25} aria-hidden="true"/><p className="benefit-label">{label}</p><h3>{title}</h3><p>{text}</p><a href={source} target="_blank" rel="noreferrer" aria-label={'Informace města: ' + title}>Informace města <ArrowUpRight size={13}/></a></article>)}</div>
  </section>;
}
