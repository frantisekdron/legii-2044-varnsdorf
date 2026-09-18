import {Photo as ResponsivePhoto} from './photo';
import {ArrowUpRight, BookOpen, Mountain, Trees, Waves, TrainFront, Landmark, Maximize2} from 'lucide-react';

const benefits = [
  {title: 'Park v ulici Legií', label: 'ZELEŇ VE MĚSTĚ', text: 'Přímo v ulici je městský park. Město zde obnovilo zeleň a vysadilo okrasné třešně a javory.', icon: Trees, source: 'https://www.varnsdorf.cz/cz/aktuality/informace-z-mesta/park-ulici-legii-prochazi-rozsahlou-obnovou-zelene.html'},
  {title: 'Školy pro různé životní etapy', label: 'KAŽDODENNÍ ŽIVOT', text: 'Mateřské a základní školy, gymnázium, odborné školy i základní umělecká škola přímo ve Varnsdorfu.', icon: BookOpen, source: 'https://www.varnsdorf.cz/cz/o-varnsdorfu/data-fakta/skolstvi.html'},
  {title: 'Sport v každém ročním období', label: 'AKTIVNÍ ODPOČINEK', text: 'Plavecký bazén, sportovní hala, zimní stadion a tenisové kurty rozšiřují možnosti volného času.', icon: Waves, source: 'https://www.varnsdorf.cz/cz/o-varnsdorfu/'},
  {title: 'Divadlo, kino i knihovna', label: 'KULTURA', text: 'Městské divadlo s galerií, kino Centrum Panorama a knihovna tvoří zázemí pro kulturní život.', icon: Landmark, source: 'https://www.varnsdorf.cz/cz/o-varnsdorfu/'},
  {title: 'Přes hranici za dalšími možnostmi', label: 'ČESKO–NĚMECKÉ PŘÍHRANIČÍ', text: 'Poloha u Německa a železniční spojení směrem na Žitavu otevírají prostor pro výlety do sousedního regionu.', icon: TrainFront, source: 'https://www.varnsdorf.cz/cz/o-varnsdorfu/'},
  {title: 'Lužické hory na dosah', label: 'KRAJINA PRO VOLNÝ ČAS', text: 'Varnsdorf leží na úpatí Lužických hor. Jedlová, Tolštejn a okolní trasy nabízejí cíle pro pěší i cyklistické výlety.', icon: Mountain, source: 'https://www.varnsdorf.cz/cz/volny-cas/turistika/'},
];

export function Neighborhood({onGallery}: {onGallery: () => void}) {
  return <section id="lokalita" className="neighborhood section" aria-labelledby="neighborhood-title">
    <div className="section-head"><div><p className="eyebrow">VARNSDORF · LEGIÍ 2044</p><h2 id="neighborhood-title">Město pro každý den.<br/><em>Krajina pro sebe.</em></h2></div><div className="location-lead"><p>Život ve městě s vlastním kulturním a sportovním zázemím. K tomu Lužické hory a česko–německé příhraničí pro chvíle, kdy chcete vyrazit dál.</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Legi%C3%AD+2044+Varnsdorf" target="_blank" rel="noreferrer">Zobrazit adresu na mapě <ArrowUpRight size={17}/></a></div></div>
    <button className="neighborhood-panorama" onClick={onGallery}><ResponsivePhoto sizes="86vw" src="/media/17-okoli-a-mesto-10.webp" alt="Skutečný letecký pohled na Varnsdorf a okolní krajinu" loading="lazy"/><span className="panorama-caption"><span>VARNSDORF<small>Na úpatí Lužických hor</small></span><span>Fotografie okolí <Maximize2 size={17}/></span></span></button>
    <div className="location-benefits">{benefits.map(({title, label, text, icon: Icon, source}) => <article key={title}><Icon size={25} strokeWidth={1.25} aria-hidden="true"/><p className="benefit-label">{label}</p><h3>{title}</h3><p>{text}</p><a href={source} target="_blank" rel="noreferrer" aria-label={'Informace města: ' + title}>Informace města <ArrowUpRight size={13}/></a></article>)}</div>
  </section>;
}
