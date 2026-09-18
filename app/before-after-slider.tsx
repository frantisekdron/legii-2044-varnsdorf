'use client';

import {useState, type CSSProperties} from 'react';
import {Photo} from './photo';
import {AiBadge} from './ai-badge';

export function BeforeAfterSlider({before,after,title,className=''}:{before:string;after:string;title:string;className?:string}){
 const [position,setPosition]=useState(50);
 return <div className={`before-after ${className}`.trim()} style={{'--reveal':`${position}%`} as CSSProperties}>
  <Photo className="before-after-before" src={before} sizes="(max-width:760px) 96vw, 86vw" alt={`${title} — současný stav`}/>
  <div className="before-after-after"><Photo src={after} sizes="(max-width:760px) 96vw, 86vw" alt={`${title} — vizualizace`}/></div>
  <span className="before-after-label before-after-label-before">Před</span>
  <span className="before-after-label before-after-label-after">Vizualizace</span>
  <AiBadge className="ai-badge-slider"/>
  <span className="before-after-line" aria-hidden="true"><i>↔</i></span>
  <input type="range" min="0" max="100" value={position} onChange={e=>setPosition(Number(e.target.value))} aria-label={`Porovnání před a po: ${title}`} />
 </div>;
}
