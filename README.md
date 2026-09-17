# Legií 2044, Varnsdorf

Real-estate presentation of one complete apartment building. Czech content, nine apartments, two retail spaces, one attic. No individual-unit sales, reservation workflow, database or admin system.

## Content

`app/data.json` is the shared unit and media registry. Photographs are from the owner's supplied material; technical drawings are cropped from the supplied project PDFs. Areas are labeled as project-plan figures, not a current measurement.

Designs are selected with `?design=1` through `?design=5`. `?navrhy=1` opens the comparison. Detail links use `#jednotka-byt-1`, `#jednotka-obchod-1`, or `#jednotka-puda`.

## Future media

Set `heroVideo` in `app/site-config.ts` to the approved final video URL. The component supports muted looping playback, poster and error fallback, pause control, and reduced-motion preferences. It currently shows the real building photograph.

Replace each unit's `plan` with the owner's separate unit plan when supplied. Current details are correctly labeled as whole-floor project plans. The supplied attic plan depicts existing space; do not treat it as an approved two-apartment layout. Integrate future visualizations only after the intended layouts are provided; label them as visualizations.

## Running

Use the Sites building and hosting workflow. `npm run dev` starts the local preview. `npm run build` produces the Worker. `.openai/hosting.json` contains this site's persistent identity; reuse it for all later changes.
