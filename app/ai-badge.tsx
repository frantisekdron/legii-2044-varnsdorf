export function AiBadge({className=''}:{className?:string}){
 return <span className={`ai-badge ${className}`.trim()} title="Vytvořeno pomocí AI"><img src="/brand/vytvoreno-ai.png" alt="Vytvořeno AI" loading="lazy" decoding="async"/></span>;
}
