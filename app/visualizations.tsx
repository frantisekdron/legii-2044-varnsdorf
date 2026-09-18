'use client';
import {useState} from 'react';
import {Maximize2,Columns2} from 'lucide-react';
import {Photo} from './photo';
import {AiBadge} from './ai-badge';
import manifest from './visualizations-data.json';
export type Visualization={id:string;sceneId:string;title:string;category:'bydleni'|'venku'|'zazemi'|'podkrovi'|'obchody';variant:string;revision:number;unitIds:string[];original:string;src:string;thumb:string;srcSet:string;caption:string};
export const visualizations=manifest.items as Visualization[];
export function VisualizationGallery({items,onGallery}:{items:Visualization[];onGallery:(title:string,photos:{src:string;caption?:string;visualization?:boolean}[])=>void}){
 const [active,setActive]=useState(items[0]?.id),[mode,setMode]=useState('navrh');
 const item=items.find(x=>x.id===active)||items[0];
 if(!item)return null;
 const gallery=(original=false)=>{const photos=[{src:item.src,caption:item.caption,visualization:true},{src:item.original,caption:'Skutečná fotografie současného stavu.'}];onGallery(item.title,original?photos.reverse():photos);};
 return <div className="viz-gallery"><div className="viz-heading"><div><h3>{item.title}</h3><p>{item.caption}</p></div><div className="viz-switch" role="group" aria-label="Zobrazení prostoru"><button aria-pressed={mode==='stav'} onClick={()=>setMode('stav')}>Současný stav</button><button aria-pressed={mode==='navrh'} onClick={()=>setMode('navrh')}>Vizualizace</button><button aria-pressed={mode==='srovnani'} onClick={()=>setMode('srovnani')}><Columns2 size={16}/>Srovnat</button></div></div><div className={'viz-images '+(mode==='srovnani'?'viz-split':'')}>
 {mode!=='navrh'&&<button onClick={()=>gallery(true)} aria-label={'Zvětšit současný stav: '+item.title}><Photo src={item.original} sizes={mode==='srovnani'?'(max-width:760px) 86vw, 43vw':'86vw'} alt={item.title+' — skutečný současný stav'}/><span>Současný stav</span><Maximize2 size={18}/></button>}
 {mode!=='stav'&&<button onClick={()=>gallery()} aria-label={'Zvětšit vizualizaci: '+item.title}><img src={item.thumb} srcSet={item.srcSet} sizes={mode==='srovnani'?'(max-width:760px) 86vw, 43vw':'86vw'} alt={item.title+' — návrh vybavení'} loading="lazy" decoding="async"/><span>{item.category==='podkrovi'?'Studie podkroví':'Vizualizace vybavení'}</span><AiBadge/><Maximize2 size={18}/></button>}
 </div>{items.length>1&&<div className="viz-thumbs" aria-label="Výběr vizualizace">{items.map(p=><button key={p.id} aria-pressed={p.id===item.id} onClick={()=>setActive(p.id)}><img src={p.thumb} alt="" loading="lazy"/><AiBadge className="ai-badge-thumb"/><span>{p.title}{items.some(other=>other.sceneId===p.sceneId&&other.id!==p.id)?` · ${p.variant}`:null}</span></button>)}</div>}</div>;
}
