'use client';

import {Photo as ResponsivePhoto} from './photo';
import {useState} from 'react';
import {ArrowUpRight, Columns2, Maximize2} from 'lucide-react';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent} from '@/components/ui/accordion';
import data from './data.json';

type Photo = {src: string; thumb?: string};
const chapters = [
  {id: 'strecha', name: 'Střecha', title: 'Obnova začíná nahoře.', text: 'Opravená střecha chrání vše, co se skrývá pod ní. Práce zahrnovaly krytinu, oplechování, žlaby, svody a hromosvod.', before: '/media/reko-img-8110.webp', after: '/media/roof-today.webp', beforeLabel: 'Před opravou', beforeAlt: 'Archivní stav střechy se střešní nástavbou a původním povrchem', afterAlt: 'Současný stav opravené střechy a stejné střešní nástavby', position: '50% 65%', note: 'Stejná část střechy; současný snímek je pořízený z menší vzdálenosti a jiného úhlu.'},
  {id: 'kolarna', name: 'Kolárna', title: 'Zázemí, které znovu slouží.', text: 'Z původního vstupu do suterénu vzniklo upravené zázemí pro kola. Nové dveře, podlaha a přístup ze dvora usnadňují každodenní používání.', before: '/media/reko-puvodni-vjezd-kolarna.webp', after: '/media/14-kolarna-a-vychod-ven-1.webp', beforeLabel: 'Původní stav', beforeAlt: 'Původní dřevěné dveře a přístup do kolárny v suterénu', afterAlt: 'Dokončená kolárna s novými dveřmi a podlahou', position: '50% 20%', note: 'Vstup do kolárny před obnovou a dnes. Fotografie zachycují prostor z různých stanovišť.'},
  {id: 'bydleni', name: 'Obytná patra', title: 'Z rozestavěných prostorů domov.', text: 'Bourací práce a změny dispozic vystřídaly nové omítky, podlahy, kuchyně a koupelny. Ve třech obytných patrech je dnes devět dokončených bytů.', before: '/media/reko-montaz-osb-desek2.webp', after: '/media/05-byt-5-3.webp', beforeLabel: 'V průběhu prací', beforeAlt: 'Pokoj s arkýřem a stejnými okny v průběhu pokládky OSB podlah', afterAlt: 'Dokončený pokoj s arkýřem v bytě 05, shodná čelní a boční okna', position: '50% 0%', note: 'Stejný arkýř, členění oken i výhled na protější dům. Vlevo pokládka podlah, vpravo dokončený pokoj.'},
  {id: 'sklepy', name: 'Sklepy', title: 'Praktický prostor navíc.', text: 'Suterén prošel obnovou a získal novou betonovou podlahu. Dvanáct sklepních kójí a samostatný sklad doplňují kolárnu a prostornou dílnu.', before: '/media/reko-puvodni-sklep.webp', after: '/media/20-sklep-09-1.webp', beforeLabel: 'Původní stav', beforeAlt: 'Původní sklepní prostor před vybudováním kójí', afterAlt: 'Dokončená sklepní kóje s betonovou podlahou a obnoveným zdivem', position: '50% 50%', note: 'Proměna sklepního zázemí. Záběry dokumentují původní prostor a jednu z dnešních kójí, nikoli shodný kout.'},
];
const technical = [
  {title: 'Konstrukce a podlahy', text: 'Stropní trámy byly zesíleny příložkami a ošetřeny. Nové mezibytové příčky spočívají na ocelových průvlacích. Skladba podlah zahrnuje kročejovou izolaci, OSB desky a vinylovou krytinu.', group: 'Podlahy'},
  {title: 'Rozvody a vytápění', text: 'Nová elektroinstalace a domovní přípojka z roku 2024, vodovod, stoupačky a kanalizace. V bytech jsou samostatné kotle Bosch, bojlery Dražice, termostaty a radiátory Korado.', group: 'Stoupačky'},
  {title: 'Fasáda, okna a dveře', text: 'Fasáda byla kompletně opravena v roce 2025 se zachováním historických prvků na uliční straně. Dům má nová okna, dveře a výlohy obchodních prostor.', group: ''},
];

function Comparison({chapter, onGallery}: {chapter: (typeof chapters)[number]; onGallery: (title: string, photos: Photo[]) => void}) {
  const [mode, setMode] = useState<'both' | 'before' | 'after'>('both');
  return <>
    <div className="comparison-heading"><div><h3>{chapter.title}</h3><p>{chapter.text}</p></div><div className="compare-switch" role="group" aria-label="Zobrazení srovnání"><button onClick={() => setMode('before')} aria-pressed={mode === 'before'}>Před</button><button onClick={() => setMode('both')} aria-pressed={mode === 'both'}><Columns2 size={15}/>Vedle sebe</button><button onClick={() => setMode('after')} aria-pressed={mode === 'after'}>Po</button></div></div>
    <div className={'comparison-frame compare-' + mode}>
      {mode !== 'after' && <button className="comparison-image before-image" onClick={() => onGallery(chapter.name + ' — ' + chapter.beforeLabel.toLowerCase(), [{src: chapter.before}])} aria-label={'Zvětšit: ' + chapter.beforeAlt}><ResponsivePhoto sizes={mode === "both" ? "43vw" : "86vw"} src={chapter.before} alt={chapter.beforeAlt} style={{objectPosition: chapter.position}} loading="lazy"/><span className="comparison-label">{chapter.beforeLabel}</span><Maximize2 size={17}/></button>}
      {mode !== 'before' && <button className="comparison-image after-image" onClick={() => onGallery(chapter.name + ' — dnes', [{src: chapter.after}, ...(chapter.id === 'strecha' ? [{src: '/media/roof-panorama.webp'}, {src: '/media/roof-landscape.webp'}] : [])])} aria-label={'Zvětšit: ' + chapter.afterAlt}><ResponsivePhoto sizes={mode === "both" ? "43vw" : "86vw"} src={chapter.after} alt={chapter.afterAlt} loading="lazy"/><span className="comparison-label">Dnes</span><Maximize2 size={17}/></button>}
    </div>
    <p className="comparison-note">{chapter.note}</p>
  </>;
}

export function Renovation({onGallery}: {onGallery: (title: string, photos: Photo[]) => void}) {
  return <section id="pribeh" className="section renovation-section" aria-labelledby="renovation-title">
    <div className="section-head"><div><p className="eyebrow">PŘÍBĚH REKONSTRUKCE</p><h2 id="renovation-title">Proměna, kterou<br/><em>můžete vidět.</em></h2></div><p>Od původního stavu a stavebních prací po dnešní podobu. Skutečné fotografie jednoho domu, který prošel rozsáhlou obnovou.</p></div>
    <Tabs defaultValue="strecha" className="renovation-tabs"><TabsList className="chapter-tabs" aria-label="Část domu před a po rekonstrukci">{chapters.map(chapter => <TabsTrigger key={chapter.id} value={chapter.id}>{chapter.name}</TabsTrigger>)}</TabsList>{chapters.map(chapter => <TabsContent key={chapter.id} value={chapter.id}><Comparison chapter={chapter} onGallery={onGallery}/></TabsContent>)}</Tabs>
    <div className="renovation-depth"><div className="renovation-depth-heading"><p className="eyebrow">I TO, CO NENÍ VIDĚT</p><h3>Obnova šla<br/><em>pod povrch.</em></h3><p>Nová podoba stojí na práci, která zůstává skrytá ve stěnách, stropech a podlahách.</p><button className="text-link" onClick={() => onGallery('Průběh rekonstrukce', data.reconstruction)}>Prohlédnout archiv prací <ArrowUpRight size={17}/></button></div><Accordion type="single" collapsible className="technical-accordion" defaultValue="Konstrukce a podlahy">{technical.map(item => <AccordionItem value={item.title} key={item.title}><AccordionTrigger>{item.title}</AccordionTrigger><AccordionContent><p>{item.text}</p>{item.group && <button className="archive-link" onClick={() => onGallery(item.title + ' — průběh rekonstrukce', data.reconstruction.filter(p => p.group.normalize('NFC') === item.group.normalize('NFC')))}>Fotografie z průběhu prací <ArrowUpRight size={14}/></button>}</AccordionContent></AccordionItem>)}</Accordion></div>
    <div className="craft-details">{[{src: '/media/stair-detail.webp', title: 'Obnovené společné prostory'}, {src: '/media/kitchen-detail.webp', title: 'Dokončené kuchyně'}, {src: '/media/bathroom-detail.webp', title: 'Připravené koupelny'}].map(detail => <figure key={detail.src}><button onClick={() => onGallery(detail.title, [{src: detail.src}, {src: '/media/window-detail.webp'}])} aria-label={'Zvětšit: ' + detail.title}><ResponsivePhoto sizes="(max-width:760px) 86vw, 28vw" src={detail.src} alt={detail.title + ' — fotografie detailu'} loading="lazy"/><Maximize2 size={16}/></button><figcaption>{detail.title}</figcaption></figure>)}</div>
    <p className="data-note">Popis rekonstrukce vychází z podkladů majitele. Technická dokumentace je k dispozici při jednání o nemovitosti.</p>
  </section>;
}
