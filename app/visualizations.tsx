'use client';
import {useState} from 'react';
import {ArrowUpRight,Maximize2,Columns2} from 'lucide-react';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import {Photo} from './photo';
import manifest from './visualizations-data.json';
export type Visualization={id:string;sceneId:string;title:string;category:'bydleni'|'venku'|'zazemi';variant:string;revision:number;unitIds:string[];original:string;src:string;thumb:string;srcSet:string;caption:string};
export const visualizations=manifest.items as Visualization[];
const categories=[{id:'bydleni',label:'Bydlení'},{id:'venku',label:'Dvůr a zahrada'},{id:'zazemi',label:'Zázemí domu'}];
export function VisualizationGallery({items,onGallery}:{items:Visualization[];onGallery:(title:string,photos:{src:string;caption?:string}[])=>void}){
 const [active,setActive]=useState(items[0]?.id),[mode,setMode]=useState('navrh');
 const item=items.find(x=>x.id===active)||items[0];
 if(!item)return null;
 const gallery=(original=false)=>{const photos=[{src:item.src,caption:item.caption},{src:item.original,caption:'Skutečná fotografie současného stavu.'}];onGallery(item.title,original?photos.reverse():photos);};
 return <div className="viz-gallery"><div className="viz-heading"><div><h3>{item.title}</h3><p>{item.caption}</p></div><div className="viz-switch" role="group" aria-label="Zobrazení prostoru"><button aria-pressed={mode==='stav'} onClick={()=>setMode('stav')}>Současný stav</button><button aria-pressed={mode==='navrh'} onClick={()=>setMode('navrh')}>Vizualizace</button><button aria-pressed={mode==='srovnani'} onClick={()=>setMode('srovnani')}><Columns2 size={16}/>Srovnat</button></div></div><div className={'viz-images '+(mode==='srovnani'?'viz-split':'')}>
 {mode!=='navrh'&&<button onClick={()=>gallery(true)} aria-label={'Zvětšit současný stav: '+item.title}><Photo src={item.original} sizes={mode==='srovnani'?'(max-width:760px) 86vw, 43vw':'86vw'} alt={item.title+' — skutečný současný stav'}/><span>Současný stav</span><Maximize2 size={18}/></button>}
 {mode!=='stav'&&<button onClick={()=>gallery()} aria-label={'Zvětšit vizualizaci: '+item.title}><img src={item.thumb} srcSet={item.srcSet} sizes={mode==='srovnani'?'(max-width:760px) 86vw, 43vw':'86vw'} alt={item.title+' — návrh vybavení'} loading="lazy" decoding="async"/><span>Vizualizace vybavení</span><Maximize2 size={18}/></button>}
 </div>{items.length>1&&<div className="viz-thumbs" aria-label="Výběr vizualizace">{items.map(p=><button key={p.id} aria-pressed={p.id===item.id} onClick={()=>setActive(p.id)}><img src={p.thumb} alt="" loading="lazy"/><span>{p.title}</span></button>)}</div>}</div>;
}
export function Visualizations({onGallery}:{onGallery:(title:string,photos:{src:string;caption?:string}[])=>void}){
 const available=categories.filter(c=>visualizations.some(v=>v.category===c.id));
 return <section id="vizualizace" className="section vision-section" aria-labelledby="vision-title"><div className="section-head"><div><p className="eyebrow">DALŠÍ PODOBA KAŽDODENNOSTI</p><h2 id="vision-title">Prostor pro<br/><em>vaše představy.</em></h2></div><p>{visualizations.length?'Jak mohou hotové interiéry a společné prostory sloužit novému životu. Prohlédněte si návrhy vybavení spolu se skutečnými fotografiemi.':'Světlé byty, vlastní zahrada a praktické zázemí. Tři stránky domu, které si nový majitel může dotvořit podle svých představ.'}</p></div>
 {visualizations.length?<><Tabs defaultValue={available[0].id}><TabsList className="chapter-tabs" aria-label="Vizualizace prostorů">{available.map(c=><TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>)}</TabsList>{available.map(c=><TabsContent key={c.id} value={c.id}><VisualizationGallery items={visualizations.filter(v=>v.category===c.id)} onGallery={onGallery}/></TabsContent>)}</Tabs><p className="data-note">Vizualizace představují návrh možného vybavení, nikoli současný stav nebo součást sjednaného prodeje. V bytech jde o typové návrhy; konkrétní podobu jednotky ukazují její fotografie.</p></>:<><div className="vision-editorial">{[
 {title:'Místo, kde se zabydlíte.',text:'Tři typy bytů. Prostor pro osobní styl, přírodní materiály a klidné bydlení.',image:'/media/01-byt-1-3.webp',label:'BYDLENÍ',href:'#jednotky'},
 {title:'Život pokračuje venku.',text:'Zahrada a dvůr s možností posezení, zeleně i drobného dětského koutku.',image:'/media/16-dvur-parkoviste-a-zelen-9.webp',label:'DVŮR A ZAHRADA',href:'#kontakt'},
 {title:'Každá věc na svém místě.',text:'Kolárna a sklepní kóje jako přirozené zázemí každého dne.',image:'/media/14-kolarna-a-vychod-ven-2.webp',label:'ZÁZEMÍ DOMU',href:'#kontakt'}
 ].map((x,i)=><article className={i===0?'vision-feature':''} key={x.label}><button onClick={()=>onGallery(x.title,[{src:x.image,caption:'Skutečná fotografie současného stavu.'}])} aria-label={'Prohlédnout současný stav: '+x.title}><Photo src={x.image} sizes={i===0?'(max-width:760px) 86vw, 45vw':'(max-width:760px) 86vw, 38vw'} alt={x.title+' — současný stav'}/><span>Současný stav</span><Maximize2 size={17}/></button><div><p className="eyebrow">{x.label}</p><h3>{x.title}</h3><p>{x.text}</p>{i===0&&<a href={x.href}>Prohlédnout byty <ArrowUpRight size={17}/></a>}</div></article>)}</div><p className="vision-note">Vizualizace možného vybavení připravujeme. Fotografie v této části zachycují skutečný současný stav.</p></>}
 </section>;
}
