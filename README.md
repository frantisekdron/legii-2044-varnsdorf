# Legií 2044, Varnsdorf

Real-estate presentation of one complete apartment building. Czech content, nine apartments, two retail spaces, one attic. No individual-unit sales, reservation workflow, database or admin system.

## Content

`app/data.json` is the shared unit and media registry. Photographs are from the owner's supplied material; technical drawings are cropped from the supplied project PDFs. Areas are labeled as project-plan figures, not a current measurement.

Designs are selected with `?design=1` through `?design=5`. `?navrhy=1` opens the comparison. Detail links use `#jednotka-byt-1`, `#jednotka-obchod-1`, or `#jednotka-puda`.

## Future media

Set `heroVideo` in `app/site-config.ts` to the approved final video URL. The component supports muted looping playback, poster and error fallback, pause control, and reduced-motion preferences. It currently shows the real building photograph.

Replace each unit's `plan` with the owner's separate unit plan when supplied. Current details are correctly labeled as whole-floor project plans. The supplied attic plan depicts existing space; do not treat it as an approved two-apartment layout. Integrate future visualizations only after the intended layouts are provided; label them as visualizations.

## Approved visualization section

`#vizualizace` is the public-facing inspiration section. Until a selection is approved it shows only clearly labeled real photographs. `app/visualizations-data.json` contains the approved publication set; the client never reads private review notes. Selected images support current-state / visualization / side-by-side views and appear in the matching unit's extra tab.

Read saved decisions from the separate review site, or use `vyber.json` inside its ZIP download. Run `scripts/import-selected-visualizations.py /absolute/path/vyber.json --dry-run` with the bundled Pillow Python first. Remove `--dry-run` to generate responsive WebP assets and replace the approved manifest, then use the usual Sites build and deployment workflow. The script rejects unsaved exports and revision mismatches, omits pending/rework decisions, and leaves scenes with notes for revision. It never publishes notes. Resolve notes before importing a new final selection. An empty import cannot silently clear the existing approved set; old image files remain available.

Apartment types map 1→1/4/7, 2→2/5/8, 3→3/6/9. The bay-window bedroom of type 2 must never be assigned to unit 8. Original photo and staged image always come from the same scene. Approval on the review site is not an automatic deployment; the next authorized iteration imports the selected images and publishes the main site.

## Running

Use the Sites building and hosting workflow. `npm run dev` starts the local preview. `npm run build` produces the Worker. `.openai/hosting.json` contains this site's persistent identity; reuse it for all later changes.
