import type {ImgHTMLAttributes} from 'react';
import index from './image-index.json';

type Entry = {width:number;height:number;srcSet:string;preview:string};
export function Photo({src, sizes='(max-width:760px) 92vw, 940px', loading='lazy', decoding='async', ...props}: ImgHTMLAttributes<HTMLImageElement> & {src:string}) {
  const key=src.replace(/-thumb\.webp$/,'.webp');
  const entry=(index as Record<string,Entry>)[key];
  return <img {...props} src={entry?.preview||src} srcSet={entry?.srcSet} sizes={entry?sizes:undefined} width={entry?.width||props.width} height={entry?.height||props.height} loading={loading} decoding={decoding}/>;
}
