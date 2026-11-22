# Hero video (Higgsfield)

The site's hero plays `public/video/hero.mp4` as a muted, looping background. If that file is missing, the hero shows a blue gradient instead, so nothing breaks.

The video couldn't be generated when the site was built: the Higgsfield account had 2.2 credits, and the cheapest option (Seedance 2.0, fast, 480p, 4 s) costs 4. The prompt below priced at 56 credits (Seedance 2.5, 8 s, 16:9, 720p).

## Prompt

> Cinematic slow dolly shot of a white vinyl-sided New England colonial home on a sunny summer morning in Massachusetts. A professional power washer sweeps a steady fan of high-pressure water across green, mold-streaked siding, revealing bright clean white siding in a crisp line behind the spray. Fine mist catches the sunlight, water droplets sparkle, lush green lawn and maple trees in the background, paver patio in the foreground. Realistic, natural light, shallow depth of field, premium commercial look, no text, no logos.

Settings: model `seedance_2_5`, 16:9, 8 seconds, 720p, audio off.

## After generating

1. Download the MP4 and save it as `public/video/hero.mp4`. Keep it under about 6 MB. To shrink it:
   `ffmpeg -i in.mp4 -vf scale=1280:-2 -an -c:v libx264 -crf 28 -preset slow -movflags +faststart public/video/hero.mp4`
2. Optional: export one frame as `public/video/hero-poster.webp` and add `poster="/video/hero-poster.webp"` to the `<video>` in `src/App.tsx`.

Note: the business profile asks for a site that feels local and not AI-made. Real footage of you washing a house, filmed on a phone, would work even better in this same slot.
