'use client';
import {useState} from 'react';
import {AiBadge} from './ai-badge';
import {BeforeAfterSlider} from './before-after-slider';
import manifest from './visualizations-data.json';
export type Visualization={id:string;sceneId:string;title:string;category:'bydleni'|'venku'|'zazemi'|'podkrovi'|'obchody';variant:string;revision:number;unitIds:string[];original:string;src:string;thumb:string;srcSet:string;caption:string};
export const visualizations=manifest.items as Visualization[];
export function VisualizationGallery({items}:{items:Visualization[]}){
 const [active,setActive]=useState(items[0]?.id);
 const item=items.find(x=>x.id===active)||items[0];
 if(!item)return null;
 return <div className="viz-gallery"><div className="viz-heading"><div><h3>{item.title}</h3><p>{item.caption}</p></div><p className="viz-drag-hint">Tažením porovnejte současný stav a návrh</p></div><BeforeAfterSlider before={item.original} after={item.src} title={item.title}/>{items.length>1&&<div className="viz-thumbs" aria-label="Výběr vizualizace">{items.map(p=><button key={p.id} aria-pressed={p.id===item.id} onClick={()=>setActive(p.id)}><img src={p.thumb} alt="" loading="lazy"/><AiBadge className="ai-badge-thumb"/><span>{p.title}{items.some(other=>other.sceneId===p.sceneId&&other.id!==p.id)?` · ${p.variant}`:null}</span></button>)}</div>}</div>;
}
