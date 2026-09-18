"""Import only explicitly selected, uncommented current revisions from the review site.

Run with the bundled Pillow Python runtime. --dry-run never writes files.
The input is vyber.json from a download ZIP or a saved-review API export
with projectId='legii-2044'. No review text or private file paths are published.
"""
from pathlib import Path
import argparse
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
SELECTOR = ROOT.parents[1] / 'vizualizacni-proces-vybiraci'
MASTERS = Path('/Users/frantisekdron/Documents/Codex/visualization-assets-legii-2044/higgsfield-r4/publish-media')

ROOMS = {'living':'Obývací pokoj s kuchyní','bedroom':'Ložnice','bathroom':'Koupelna','kitchen-detail':'Kuchyně · druhý pohled','hall':'Předsíň'}
SHARED_TITLES = {'parking':'Parkování','entry':'Zadní vstup','garden':'Zahrada','bike-room':'Kolárna','cellar':'Sklepní kóje','staircase':'Schodiště','workshop':'Dílna'}

def public_title(scene):
    sid=scene['id']
    if sid.startswith('typ'):
        kind,room=sid[3:5],sid[6:]
        label='Ložnice s arkýřem' if sid=='typ02-bedroom' else ROOMS[room]
        return f'Byt · typ {int(kind)} · {label}'
    if sid.startswith('shop'):
        number=int(sid[4:6]);kind=sid[7:]
        labels={'cafe':'Kavárna','showroom':'Showroom','boutique':'Butik','office':'Kancelář','beauty':'Kosmetické studio','atelier':'Ateliér'}
        return f'Obchod {number} · {labels.get(kind,scene["title"])}'
    return SHARED_TITLES.get(sid,scene['title'])

def resolve_download(asset,selector,masters,media_manifest):
    if asset.get('downloadPending'):
        raise ValueError('Master se ve výběrovém webu ještě připravuje.')
    url=asset.get('download','')
    if url.startswith('/api/media/'):
        key=url.removeprefix('/api/media/');entry=media_manifest.get(key)
        if len(key)!=69 or not key.endswith('.webp') or not entry or f"{entry.get('sha256','')}.webp"!=key or entry.get('mime')!='image/webp':raise ValueError(f'R2 master není v důvěryhodném manifestu: {key}')
        source=masters/key
        if not source.is_file():raise ValueError(f'R2 master není lokálně dostupný: {source}')
        data=source.read_bytes()
        if len(data)!=entry.get('size') or hashlib.sha256(data).hexdigest()!=entry['sha256']:raise ValueError(f'R2 master neodpovídá manifestu: {key}')
        return source
    source=selector/'public'/url.lstrip('/')
    if not source.is_file():raise ValueError(f'Statický master není dostupný: {source}')
    return source

def plan_import(payload, catalog):
    if payload.get('projectId') != catalog['id'] or catalog['id'] != 'legii-2044':
        raise ValueError('Export nepatří projektu Legií 2044.')
    if payload.get('saved') is not True:
        raise ValueError('Export obsahuje neuložené změny. Nejprve uložte výběr na výběrovém webu.')
    scenes = {s['id']: s for s in catalog['scenes']}
    planned, skipped, seen = [], [], set()
    for review in payload['reviews']:
        sid = review['sceneId']
        if sid in seen or sid not in scenes:
            raise ValueError(f'Neplatná nebo opakovaná scéna: {sid}')
        seen.add(sid)
        scene = scenes[sid]
        if review['revision'] != scene['revision']:
            raise ValueError(f'Scéna {sid}: revize exportu neodpovídá aktuálnímu návrhu.')
        choice = review['choice']
        if choice not in ['A','B','C','both','pending','rework']:
            raise ValueError(f'Scéna {sid}: neplatná volba.')
        if choice in ['pending','rework']:
            continue
        if review.get('note', '').strip():
            skipped.append(sid)
            continue
        for variant in (['A','B'] if choice == 'both' else [choice]):
            asset = scene.get('variants',{}).get(variant)
            if not asset:
                raise ValueError(f'Chybí obrázek: {sid}/{variant}')
            if asset.get('downloadPending'):
                raise ValueError(f'Master se ještě připravuje: {sid}/{variant}')
            unit_ids = list(scene.get('unitIds') or [])
            if sid.startswith('typ'):
                if not unit_ids:
                    kind = int(sid[3:5])
                    if kind not in [1,2,3]:raise ValueError(f'Neznámý typ bytu: {sid}')
                    unit_ids = [f'byt-{n}' for n in [kind,kind+3,kind+6]]
                    if sid == 'typ02-bedroom':unit_ids.remove('byt-8')  # The top-floor middle unit has no bay window.
            if sid.startswith('attic'):
                unit_ids=unit_ids or ['puda']
            if sid.startswith('shop') and not unit_ids:unit_ids=[f'obchod-{int(sid[4:6])}']
            source_category=scene.get('category')
            category='podkrovi' if source_category=='podkrovi' or sid.startswith('attic') else 'obchody' if source_category=='obchody' or sid.startswith('shop') else 'bydleni' if source_category=='byty' or unit_ids else 'zazemi' if sid in ['bike-room','cellar','staircase','workshop'] else 'venku'
            planned.append(dict(scene=scene,variant=variant,asset=asset,unitIds=unit_ids,category=category))
    if seen != set(scenes):
        raise ValueError('Export není úplný. Načtěte uložený výběr všech aktuálních scén.')
    return planned, skipped

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('reviews',type=Path)
    parser.add_argument('--selector',type=Path,default=SELECTOR)
    parser.add_argument('--masters',type=Path,default=MASTERS,help='Local verified copies of private R2 masters.')
    parser.add_argument('--revision',type=int,help='Explicitly approved historical revision; defaults to the current catalog.')
    parser.add_argument('--dry-run',action='store_true')
    args=parser.parse_args()
    catalog=json.loads((args.selector/'app/catalog.json').read_text())
    if args.revision is not None and args.revision!=catalog.get('revision',1):
        history=json.loads((args.selector/'app/catalog-history.json').read_text())
        catalog=next((c for c in history if c.get('revision',1)==args.revision),None)
        if catalog is None:raise ValueError('Požadovaná revize není v historii.')
    planned,skipped=plan_import(json.loads(args.reviews.read_text()),catalog)
    media_manifest=json.loads((args.selector/'app/media-manifest.json').read_text()) if (args.selector/'app/media-manifest.json').exists() else {}
    print(json.dumps({'selected':len(planned),'awaiting_edits':skipped,
        'items':[{'scene':p['scene']['id'],'variant':p['variant'],'units':p['unitIds']} for p in planned]},ensure_ascii=False,indent=2))
    if args.dry_run:
        return
    if not planned:
        raise ValueError('Žádná schválená varianta bez připomínek. Stávající publikovaný výběr zůstává beze změny.')
    from PIL import Image
    out=ROOT/'public/visualizations';out.mkdir(exist_ok=True)
    items=[]
    index_path=ROOT/'app/image-index.json'
    image_index=json.loads(index_path.read_text())
    for p in planned:
        scene,asset,variant=p['scene'],p['asset'],p['variant']
        # All paths come from the local controlled catalog, never from notes.
        source=resolve_download(asset,args.selector,args.masters,media_manifest)
        digest=hashlib.sha256(source.read_bytes()).hexdigest()[:10]
        stem=f"{scene['id']}-r{scene['revision']}-{variant}-{digest}"
        image=Image.open(source).convert('RGB')
        generated=[]
        for width,quality in [(640,79),(1280,84),(1920,88)]:
            resized=image.copy();resized.thumbnail((width,width*2))
            target=out/f'{stem}-{resized.width}.webp'
            if not target.exists():resized.save(target,'WEBP',quality=quality,method=5)
            generated.append((target,resized.width))
        original_source=args.selector/'public'/scene['original'].lstrip('/')
        original=out/original_source.name
        if not original.exists():shutil.copyfile(original_source,original)
        title=public_title(scene)
        caption='Návrh možného vybavení.'
        if scene['id'].startswith('typ'):caption='Typový návrh vybavení; skutečný stav a výhledy se liší podle jednotky.'
        if scene['id'].startswith('attic'):caption='Dispoziční studie možného dokončení půdy, nikoli schválený projekt. Dispozici, denní osvětlení a instalace musí ověřit projektant.' if scene['revision']>=2 else 'Interiérový koncept možného dokončení půdy, nikoli schválený projekt dvou bytů.'
        if scene['id']=='parking':caption='Koncepční uspořádání parkování. Kapacita závisí na skutečných rozměrech a průjezdu.'
        src='/visualizations/'+generated[-1][0].name
        src_set=', '.join(f'/visualizations/{file.name} {width}w' for file,width in dict(generated).items())
        image_index[src]=dict(width=resized.width,height=resized.height,srcSet=src_set,preview='/visualizations/'+generated[1][0].name)
        items.append(dict(id=stem,sceneId=scene['id'],title=title,category=p['category'],variant=variant,
            revision=scene['revision'],unitIds=p['unitIds'],original='/visualizations/'+original.name,
            src=src,thumb='/visualizations/'+generated[0][0].name,srcSet=src_set,caption=caption))
    manifest=ROOT/'app/visualizations-data.json'
    temporary=manifest.with_suffix('.tmp')
    temporary.write_text(json.dumps({'projectId':catalog['id'],'items':items},ensure_ascii=False,indent=2)+'\n')
    temporary.replace(manifest)
    index_path.write_text(json.dumps(image_index,ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__':
    main()
