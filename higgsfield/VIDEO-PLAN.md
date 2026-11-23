# Higgsfield video plan

Two realistic videos made from Doug's own before/after photos. Each plays forward and backward as the visitor scrolls. They are built here first and only moved into the main website once they look right.

- `scroll-video.html` is the test page. Open it in a browser. Until a video exists it shows a placeholder.
- `reference/` holds the before and after photos the videos are made from.
- The finished videos go in this folder (file names are below).

## Status

- [x] Reference photos: house wash and patio, before and after (2026-11-23)
- [ ] Credits added in Higgsfield (two drafts need 90 credits; the account had 2.2 on 2026-11-23)
- [ ] Photos uploaded to Higgsfield (blocked from this workspace's network on 2026-11-23; see "Uploading" below)
- [ ] 480p drafts generated: house wash and patio
- [ ] Drafts approved by Doug
- [ ] Drafts upgraded to 1080p
- [ ] Videos converted for smooth scrubbing (see below) and dropped in this folder
- [ ] Tested in `scroll-video.html`
- [ ] Moved into the main website

## How the videos are made

Each video is told to **start exactly on the "before" photo and end exactly on the "after" photo**. Higgsfield invents the cleaning in between. Using real photos for both ends keeps the house and patio true to the real job instead of a made-up one.

Both pairs of photos are tall (3:4), so the videos will be tall too. That fits the main site, where the picture sits beside the text on a computer and fills the screen on a phone.

| Video | Starts on | Ends on | File name when finished |
| ----- | --------- | ------- | ----------------------- |
| House wash | `reference/house-before.jpg` (mold streaks on the cream siding) | `reference/house-after.jpg` (clean siding) | `house-wash.mp4` |
| Patio | `reference/patio-before.jpg` (dark, grimy bluestone under leaves) | `reference/patio-after-cropped.jpg` (clean bluestone) | `patio.mp4` |

`patio-after-cropped.jpg` is `patio-after.jpg` with Doug's hand and boots cropped off the bottom. The video must end exactly on this frame, so the crop keeps them out of the last shot.

**Rules for both videos:** one continuous take with no cuts, slow steady camera motion and steady brightness. The page shows any frame as a still whenever the visitor stops scrolling, and plays the clip backward when they scroll up.

## Prompts

### House wash

> Realistic footage of the back corner of a two-story house with cream vinyl lap siding, white trim and white windows, a grey air conditioner on the lawn and a black hammock stand. At the start, green-grey mold streaks run down the siding. One continuous, slow, steady camera move with no cuts and no shake: the camera gently pulls back and tilts up until the full height of the house and the upper gable are in view. A power washing technician in a navy work shirt and dark cap pre-rinses the siding with plain water, sprays white foam on from the ground up, then rinses from the roofline down. The foam and mold sheet off and the siding underneath turns bright and clean. Bright summer daylight, steady exposure, realistic water spray and run-off, minimal motion blur. Everything else in the yard stays where it is. No on-screen text, logos or watermarks.

### Patio

> Realistic footage of a backyard bluestone patio surrounded by a weathered wooden stockade fence, two bright blue Adirondack chairs and a dark wooden storage bench. At the start, the stone is dark and grimy with leaves and dirt across it, in dappled tree shade. One continuous, slow, steady camera move with no cuts and no shake: the camera drifts slowly forward across the patio. A power washing technician in a navy work shirt and dark cap clears the leaves, then runs a round surface cleaner back and forth over the stone, leaving clean, light blue-grey and tan bluestone behind it, then rinses the joints clean. The shade softens into even daylight as it finishes. Steady exposure, realistic water and spray, minimal motion blur. No on-screen text, logos or watermarks.

## Settings and cost

| Setting | Value |
| ------- | ----- |
| Model | Seedance 2.5 (`seedance_2_5`) |
| Mode | `omni_reference` |
| Photos | before photo as `start_image`, after photo as `end_image` |
| Length | 15 seconds |
| Shape | `auto` (follows the photos: tall, 3:4) |
| Sound | Off |
| Draft | `draft: true` makes a 480p preview that can be upgraded to full quality within 7 days without re-rolling |

**Draft cost: 45 credits per video, so 90 for both** (quoted 2026-11-23). Full quality was quoted at 240 credits per video for 15 seconds at 1080p. If a draft looks good, it's upgraded from that same draft (`draft_job_id`), so the motion stays the same.

## Uploading the photos

On 2026-11-23 this workspace's network blocked Higgsfield's upload server (`upload.higgsfield.ai`). Two ways around it:

1. Higgsfield's upload box: Doug picks the four files from `reference/`.
2. Allow `upload.higgsfield.ai` in this workspace's network settings, then upload from here.

## After the video is generated

To scrub smoothly, the video needs a keyframe every few frames. A normal export only has one every few seconds, which makes scrolling jump. Convert it like this (desktop version, then a lighter phone version, then the poster):

```bash
ffmpeg -i raw.mp4 -an -c:v libx264 -pix_fmt yuv420p -crf 20 -g 8 -sc_threshold 0 -movflags +faststart house-wash.mp4
```

```bash
ffmpeg -i raw.mp4 -an -vf "scale=-2:720" -c:v libx264 -pix_fmt yuv420p -crf 23 -g 4 -sc_threshold 0 -movflags +faststart house-wash-mobile.mp4
```

```bash
ffmpeg -i house-wash.mp4 -frames:v 1 -q:v 3 house-wash-poster.jpg
```

Do the same for `patio.mp4`. Keep each desktop file under about 30 MB and each phone file under about 15 MB.

## Moving it into the website (later)

Planned approach: the house wash video plays in the house wash section and the patio video in the patio section, in place of the 3D scene there. The clickable 3D house stays as the way to pick a service. We'll decide this once we've seen the videos.
