'use client';

import {useState} from 'react';
import {ArrowUpRight, Maximize2} from 'lucide-react';
import data from './data.json';

type Unit = (typeof data.units)[number];
type Photo = {src: string; thumb?: string};
const groups = data.groups as Record<string, Photo[]>;
const floors = [5, 4, 3, 2, 1, 0];
const floorInfo: Record<number, {title: string; text: string; photos: Photo[]}> = {
  5: {title: 'Další kapitola pod střechou', text: 'Otevřená půda se záměrem vestavby dvou bytů. Prostor, jehož podobu může dotvořit nový majitel.', photos: data.units[11].gallery},
  4: {title: 'Třetí obytné patro', text: 'Byty 07, 08 a 09. Prostřední byt 08 je oproti bytům pod ním bez arkýře.', photos: data.units[7].gallery},
  3: {title: 'Bydlení nad městem', text: 'Byty 04, 05 a 06: dvě dispozice 2+kk a jeden byt 1+kk. Hotové interiéry, kuchyně i koupelny.', photos: data.units[4].gallery},
  2: {title: 'První obytné patro', text: 'Byty 01, 02 a 03. Dva byty 2+kk a jeden 1+kk, s charakteristickým arkýřem prostředního bytu.', photos: data.units[1].gallery},
  1: {title: 'Prostor pro podnikání', text: 'Dva samostatné obchodní prostory s výlohami do ulice. Každý s vlastní dispozicí a zázemím.', photos: [...data.units[9].gallery, ...data.units[10].gallery]},
  0: {title: 'Zázemí pro každodenní život', text: 'Dvanáct sklepních kójí, sklad, prostorná dílna a kolárna. Praktické zázemí celého domu.', photos: [...groups['20-sklep-01'], ...groups['14-kolarna-a-vychod-ven'], ...groups['13-dilna']]},
};

export function FloorExplorer({onUnit, onGallery}: {onUnit: (u: Unit) => void; onGallery: (title: string, photos: Photo[]) => void}) {
  const [active, setActive] = useState(2);
  const current = floorInfo[active];
  return <section className="building-section" aria-labelledby="building-title">
    <div className="section building-layout">
      <div className="building-intro">
        <p className="eyebrow">OD SKLEPA PO STŘECHU</p>
        <h2 id="building-title">Šest podlaží.<br/><em>Jeden celek.</em></h2>
        <p>Bydlení, podnikání i prostor pro další rozvoj. Poznejte dům patro po patře.</p>
        <button className="floor-photo" onClick={() => onGallery(current.title, current.photos)} aria-label={'Prohlédnout fotografie: ' + current.title}>
          <img key={active} src={current.photos[0].src} alt={current.title + ' — současný stav'} loading="lazy"/>
          <span className="floor-photo-label">{active === 0 ? '1. PP' : active + '. NP'}<Maximize2 size={16}/></span>
        </button>
        <div className="floor-description"><h3>{current.title}</h3><p>{current.text}</p></div>
      </div>
      <div className="building-drawing">
        <div className="building-drawing-heading"><span>PRŮŘEZ DOMEM</span><span>LEGIÍ 2044</span></div>
        <div className="building-levels">
          {floors.map(floor => {
            const floorUnits = data.units.filter(u => u.floor === floor).sort((a, b) => floor > 1 && floor < 5 ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
            const label = floor === 0 ? '1. PP' : floor + '. NP';
            return <div key={floor} className={'building-level level-' + floor + (active === floor ? ' is-active' : '')} onFocusCapture={() => setActive(floor)}>
              <button className="level-number" onClick={() => setActive(floor)} aria-pressed={active === floor} aria-label={'Zobrazit ' + label + ': ' + floorInfo[floor].title}><strong>{floor === 0 ? '−1' : floor}</strong><span>{floor === 0 ? 'PP' : 'NP'}</span></button>
              <div className="level-spaces">
                {floor === 0 ? <button className="level-unit basement-unit" onClick={() => onGallery(floorInfo[0].title, floorInfo[0].photos)}><span>Sklepy · kolárna · dílna</span><small>12 kójí a 1 sklad</small><ArrowUpRight size={17}/></button> : floorUnits.map(unit => <button key={unit.id} className="level-unit" onClick={() => onUnit(unit)} aria-label={'Prohlédnout ' + unit.title + ', ' + label + ', ' + unit.layout + ', ' + unit.area.toLocaleString('cs-CZ') + ' m²'}><span>{unit.title}</span><small>{unit.kind === 'byt' ? unit.layout : unit.kind === 'puda' ? 'Záměr 2 bytů' : 'Obchodní prostor'}</small><b>{unit.area.toLocaleString('cs-CZ')} <i>m²</i></b>{unit.kind === 'puda' && <span className="level-potential">BUDOUCÍ POTENCIÁL</span>}</button>)}
              </div>
            </div>;
          })}
        </div>
        <div className="building-ground"><span>1 podzemní + 5 nadzemních podlaží</span><span>9 bytů · 2 obchody · půda</span></div>
        <p className="building-note">Číslem vyberete patro, kliknutím na jednotku otevřete detail. Pořadí bytů odpovídá poloze v půdorysu zleva doprava. Schéma není v měřítku.</p>
      </div>
    </div>
  </section>;
}
