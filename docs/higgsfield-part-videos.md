# Realistic cleaning clips for each part of the house (Higgsfield)

When a visitor clicks a part of the 3D house, the website plays a realistic video of that part being cleaned. Visitors can switch back to the 3D model with the "Show 3D model" button. If a part has no clip yet, the 3D model stays on screen, so nothing breaks.

**Status:** not generated yet. The Higgsfield account has 2.2 credits. Each clip below costs about **12.5 credits** (Seedance 2.0, fast mode, 720p, 5 seconds, no sound), so all six cost about **75 credits**.

## Files

| Part | Start picture (from the 3D model) | Save the finished clip as |
|---|---|---|
| Vinyl siding | `docs/higgsfield-start-frames/siding.jpg` | `public/video/parts/siding.mp4` |
| Paver patio | `docs/higgsfield-start-frames/patio.jpg` | `public/video/parts/patio.mp4` |
| Composite deck | `docs/higgsfield-start-frames/deck.jpg` | `public/video/parts/deck.mp4` |
| Fence | `docs/higgsfield-start-frames/fence.jpg` | `public/video/parts/fence.mp4` |
| Walkway & stairs | `docs/higgsfield-start-frames/walkway.jpg` | `public/video/parts/walkway.mp4` |
| Driveway / any surface | `docs/higgsfield-start-frames/driveway.jpg` | `public/video/parts/driveway.mp4` |

## Settings for every clip

- Model: **Seedance 2.0** (`seedance_2_0`), mode `fast`, 720p, 16:9, 5 seconds, audio off
- Media: the start picture as an **image reference** (not a start frame), so Higgsfield keeps the camera angle and layout but makes it look like a real photo instead of a 3D render
- After downloading, shrink each clip: `ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 28 -movflags +faststart public/video/parts/<part>.mp4`

Every prompt ends with the same realism line:

> Photorealistic real-world footage, shot on a real camera, natural summer sunlight, Massachusetts suburb, no CGI look, no text, no logos, no visible faces.

## Prompts

**siding**
> Same camera angle and layout as the reference image, but a real two-story New England colonial home with white vinyl lap siding streaked with green mold and grime. A pressure washer wand enters from the edge of frame and rinses the siding from the top down, spraying almost parallel to the wall. A crisp line of bright clean white siding appears behind the spray as the grime runs off. Fine mist catches the sunlight.

**patio**
> Same camera angle and layout as the reference image, but a real backyard paver patio with dark mold in every joint and grime across the pavers. A round surface cleaner glides across the pavers, leaving bright, even, clean pavers behind it, with dirty water flowing off the edge. Near the end, fresh polymeric sand is swept into the clean joints with a push broom.

**deck**
> Same camera angle and layout as the reference image, but a real gray-brown composite deck with white railings, dull with grime and green mold. A pressure washer wand at gentle, low pressure cleans the boards one at a time along the grain, revealing a clean, even board color. Water beads and runs between the boards.

**fence**
> Same camera angle and layout as the reference image, but a real wooden privacy fence darkened by green mold and gray grime. A pressure washer with a spinning turbo nozzle cleans the pickets from top to bottom at a safe distance, revealing warm natural wood. Mist drifts in the sunlight over the green lawn.

**walkway**
> Same camera angle and layout as the reference image, but a real concrete front walkway and front steps darkened with mold and grime, leading to a navy front door on a white house. A surface cleaner moves down the walkway, leaving a bright clean path, then a pressure washer wand details the edges of the steps.

**driveway**
> Same camera angle and layout as the reference image, but a real driveway beside a white garage door, stained with grime and dark mold patches. A round surface cleaner moves across the driveway in overlapping passes, leaving bright clean stripes, while dirty water runs to the edge.

## How Claude will generate them once there are credits

1. Upload each start picture to Higgsfield (`media_upload` + `media_confirm`).
2. Price one clip with `estimate_video_cost`, then generate all six with `generate_video_batch`, using the settings and prompts above.
3. Download, shrink with ffmpeg, save to `public/video/parts/`, rebuild and republish.
