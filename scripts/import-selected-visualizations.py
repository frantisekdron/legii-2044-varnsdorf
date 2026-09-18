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
        if choice not in ['A','B','both','pending','rework']:
            raise ValueError(f'Scéna {sid}: neplatná volba.')
        if choice in ['pending','rework']:
            continue
        if review.get('note', '').strip():
            skipped.append(sid)
            continue
        for variant in (['A','B'] if choice == 'both' else [choice]):
            asset = scene['variants'][variant]
            if not asset:
                raise ValueError(f'Chybí obrázek: {sid}/{variant}')
            unit_ids = []
            if sid.startswith('typ'):
                kind = int(sid[3:5])
                if kind not in [1,2,3]:
                    raise ValueError(f'Neznámý typ bytu: {sid}')
                unit_ids = [f'byt-{n}' for n in [kind,kind+3,kind+6]]
                if sid == 'typ02-bedroom':
                    unit_ids.remove('byt-8')  # The top-floor middle unit has no bay window.
            planned.append(dict(scene=scene,variant=variant,asset=asset,unitIds=unit_ids,
                category='bydleni' if unit_ids else 'zazemi' if sid in ['bike-room','cellar'] else 'venku'))
    if seen != set(scenes):
        raise ValueError('Export není úplný. Načtěte uložený výběr všech aktuálních scén.')
    return planned, skipped

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('reviews',type=Path)
    parser.add_argument('--selector',type=Path,default=SELECTOR)
    parser.add_argument('--dry-run',action='store_true')
    args=parser.parse_args()
    catalog=json.loads((args.selector/'app/catalog.json').read_text())
    planned,skipped=plan_import(json.loads(args.reviews.read_text()),catalog)
    print(json.dumps({'selected':len(planned),'awaiting_edits':skipped,
        'items':[{'scene':p['scene']['id'],'variant':p['variant'],'units':p['unitIds']} for p in planned]},ensure_ascii=False,indent=2))
    if args.dry_run:
        return
    if not planned:
        raise ValueError('Žádná schválená varianta bez připomínek. Stávající publikovaný výběr zůstává beze změny.')
    from PIL import Image
    out=ROOT/'public/visualizations';out.mkdir(exist_ok=True)
    items=[]
    for p in planned:
        scene,asset,variant=p['scene'],p['asset'],p['variant']
        # All paths come from the local controlled catalog, never from notes.
        source=args.selector/'public'/asset['download'].lstrip('/')
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
        typical=scene['group'].replace('Byt · typ','Byt — typ')
        title=(typical+' · ' if p['unitIds'] else '')+scene['title']
        caption='Návrh možného vybavení.'
        if p['unitIds']:caption='Typový návrh vybavení; skutečný stav a výhledy se liší podle jednotky.'
        if scene['id']=='parking':caption='Koncepční uspořádání parkování. Kapacita závisí na skutečných rozměrech a průjezdu.'
        items.append(dict(id=stem,sceneId=scene['id'],title=title,category=p['category'],variant=variant,
            revision=scene['revision'],unitIds=p['unitIds'],original='/visualizations/'+original.name,
            src='/visualizations/'+generated[-1][0].name,thumb='/visualizations/'+generated[0][0].name,
            srcSet=', '.join(f'/visualizations/{file.name} {width}w' for file,width in dict(generated).items()),caption=caption))
    manifest=ROOT/'app/visualizations-data.json'
    temporary=manifest.with_suffix('.tmp')
    temporary.write_text(json.dumps({'projectId':catalog['id'],'items':items},ensure_ascii=False,indent=2)+'\n')
    temporary.replace(manifest)

if __name__=='__main__':
    main()
