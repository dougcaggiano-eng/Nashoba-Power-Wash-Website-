# Nashoba Power Wash Website

Interactive, scroll-driven site for Nashoba Power Wash (Westford, MA). Vite + React + TypeScript, with Three.js through React Three Fiber for the 3D house and GSAP ScrollTrigger for the step-by-step processes.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production files in dist/
```

## Where things live

| File | What it does |
|---|---|
| `src/data/services.ts` | **Every service, its steps, care notes and photos.** Edit text here. |
| `src/components/HouseModel.tsx` | The 3D house and its six clickable parts. Loads `public/models/house.glb` instead if you add one, with meshes named `siding`, `patio`, `deck`, `fence`, `walkway`, `driveway`. |
| `src/components/HouseScene.tsx` | Canvas, lights, camera moves, spray/foam/sand effects |
| `src/components/ServiceProcess.tsx` | One reusable scroll-driven process section per service |
| `src/components/BeforeAfterSlider.tsx` | Drag-to-compare slider labeled only "Before" / "After" |
| `src/components/QuoteForm.tsx` | Quote form, pre-filled with the parts the visitor clicked |
| `src/App.tsx` | Hero, highlight, about, service area, FAQ, footer |
| `scripts/optimize-photos.mjs` | Shrinks raw job photos to WebP and gives them neutral names |
| `docs/higgsfield-hero-video.md` | Prompt and steps for the hero video |

## Photos

1. Put the raw photos in a folder named `Before and afters/` at the repo root. The folder is git-ignored, because the file names contain customer names.
2. Edit the `MAP` in `scripts/optimize-photos.mjs`, then run `npm run photos`.
3. In `src/data/services.ts`, set `before` and `after` for each service, e.g. `before: '/images/patio-1-before.webp'`.

## Quote form

Set `VITE_QUOTE_ENDPOINT` to any form backend that accepts `multipart/form-data` (Formspree, Basin, Netlify Forms, your own API). Until it's set, the form tells visitors that online requests aren't switched on yet.
