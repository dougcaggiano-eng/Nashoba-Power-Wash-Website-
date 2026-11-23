# Higgsfield video plan

One realistic video of a whole house, like the 3D house on the website, where every service gets done as the camera travels around the property. It plays forward and backward as the visitor scrolls. It's built here first and only moved into the main website once it looks right.

- `scroll-video.html` is the test page. Open it in a browser. Until the video exists it shows a placeholder.
- `reference/` holds Doug's before and after photos from real jobs. They set the look (siding, stone, fence, the kind of mold and grime) but are **not** frames in the video.
- The finished video goes in this folder as `house-tour.mp4`.

## Status

- [x] Reference photos: house wash and patio, before and after (2026-11-23)
- [x] Credits added (Starter plan)
- [x] Photos uploaded to Higgsfield by Doug
- [x] First version generated (2026-11-23), see "What was actually made" below
- [x] Converted for smooth scrubbing: `house-tour.mp4` (12 MB), `house-tour-mobile.mp4` (5.7 MB), plus posters
- [x] Tested in `scroll-video.html`: each chapter scrubs its own shot, with a fade at the cuts
- [ ] Approved by Doug
- [ ] Moved into the main website

## What was actually made (2026-11-23)

Seedance 2.5, the model planned below, needs a Higgsfield **Plus** plan, and the account is on **Starter**. So this first version uses **MiniMax H3 Max**: 15 seconds at 768p (1344×768), 16:9, 37.5 credits, with the four photos as references. Higgsfield job: `f866b11f-a78b-4d9e-a8b0-8a964a8c8a29`.

The model **ignored "no cuts"** and made four shots. The test page turns that into a strength: each service chapter scrubs only its own shot, and the video fades out and back in at the three cuts, so there is never a jump mid-scroll.

| Shot | Video time | Chapters on the page |
| ---- | ---------- | -------------------- |
| Siding wash on the side of the house | 0–3.5s | intro, 01 House wash |
| Patio from above, surface cleaner | 3.5–7.0s | 02 Patio |
| Deck and fence | 7.0–11.7s | 03 Deck, 04 Fence |
| Back at the house, walkway and driveway | 11.7–15.1s | 05 Walkway & stairs, 06 Any other surface |

**Known weaknesses:**
- The siding is only lightly dirty at the start, so the house wash shows less of a before-and-after than the patio does.
- The deck and fence share one shot.
- The walkway and driveway are barely cleaned on screen.

The patio photos were uploaded with a phone rotation tag (they're stored sideways). If the patio ever comes out wrong, re-upload upright copies.

The workspace network now allows Higgsfield's servers (`upload.higgsfield.ai`, `d2ol7oe51mr4n9.cloudfront.net`, `d8j0ntlcm91z4.cloudfront.net`), so future videos can be uploaded and downloaded from here.

## The shot

**One continuous 30-second take that circles the whole property once, with no cuts.** The house and yard start dirty. Each area is cleaned as the camera reaches it, in the same order as the services on the website, and the video ends on the whole property clean.

| Time | Website service | What happens |
| ---- | --------------- | ------------ |
| 0–2s | (opening) | High, wide view of the front of the house. Mold and grime on everything. |
| 2–7s | 01 House wash | The camera eases toward the front. The technician pre-rinses the siding, foams it from the ground up, then rinses from the roofline down. The cream siding comes up bright. |
| 7–11.5s | 02 Patio | The camera arcs around the side to the back yard. A round surface cleaner turns the dark, grimy bluestone patio back to light blue-grey and tan, and the joints are rinsed clean. |
| 11.5–16s | 03 Deck | The camera keeps circling to the composite deck. The boards are cleaned along the grain with controlled pressure, turning from dull and green-tinged to a warm brown. |
| 16–20.5s | 04 Fence | The camera passes along the back fence. The green and grime come off the weathered wooden stockade fence. |
| 20.5–25s | 05 Walkway & stairs | The camera comes back around to the front. The front walkway and steps go from green-stained to clean grey concrete. |
| 25–28.5s | 06 Any other surface | The driveway is cleaned with the surface cleaner, leaving a clean finish. |
| 28.5–30s | (closing) | The camera rises to the same high view as the opening, with the whole property clean. |

The first and last frames are the same view, dirty and then clean. That's the payoff of scrolling.

**Rules for the footage:**
- **One continuous camera move.** No cuts or jumps: the page shows any frame as a still whenever the visitor stops scrolling, and plays backward when they scroll up.
- **Slow and steady.** Constant speed, with gentle easing only at the very start and end. The visitor's scroll sets the pace.
- **Steady brightness and colour.** Any flicker shows up as shimmer when scrubbing.
- **Keep the house in the middle of the frame.** Phones crop the sides of a wide video.
- **No on-screen text, logos or watermarks.** All text is added by the page.

## How the photos are used

All five photos go in as **references**, so the house, materials and dirt look like Doug's real jobs:

| Photo | What it shows Higgsfield |
| ----- | ------------------------ |
| `reference/house-after.jpg` | The house style: two stories, cream vinyl lap siding, white trim and windows |
| `reference/house-before.jpg` | What the mold and grime on the siding look like before the wash |
| `reference/patio-after-cropped.jpg` | The clean bluestone patio, weathered stockade fence and blue Adirondack chairs |
| `reference/patio-before.jpg` | The dark, grimy patio under leaves and tree shade |

`patio-after-cropped.jpg` is `patio-after.jpg` with Doug's hand and boots cropped off the bottom.

There are no photos of a deck, walkway or driveway, so the prompt describes those.

**Note:** this house will look like the house in the photos (a two-story New England colonial), not like the single-story 3D house currently on the website. If the video goes into the site, the 3D house could be reshaped to match it.

## Prompt

> Realistic footage of a two-story New England colonial home with cream vinyl lap siding, white trim and white windows, matching the reference photos, on a suburban lot with a lawn and mature trees. In front: a concrete walkway and front steps and a paved driveway. In back: a bluestone patio with blue Adirondack chairs, a composite deck off the back of the house, and a weathered wooden stockade fence around the yard. At the start, everything is dirty, like the before reference photos: green-grey mold streaks on the siding, dark grime and leaves on the patio, green film on the deck, fence, walkway and driveway.
>
> One continuous, slow, steady camera move with no cuts and no shake: starting high and wide at the front, the camera makes one full circle around the property and returns to the same high front view. One power washing technician in a navy work shirt and dark cap cleans each area as the camera reaches it: first the front siding (rinse, white foam from the ground up, rinse from the roof down), then, around the back, the bluestone patio with a round surface cleaner, the composite deck along the grain, and the wooden fence; then, back at the front, the walkway and steps, and finally the driveway. Each area turns visibly clean and bright and stays clean. It ends on the whole property clean.
>
> Bright, even summer daylight, steady exposure and white balance, realistic water spray and run-off, minimal motion blur. No on-screen text, logos or watermarks.

## Settings and cost

| Setting | Value |
| ------- | ----- |
| Model | Seedance 2.5 (`seedance_2_5`) |
| Mode | `omni_reference` |
| Photos | all as `image_references` (not as the first or last frame) |
| Length | 30 seconds (the longest this model makes) |
| Shape | 16:9 (wide, to match the website; phones crop the sides) |
| Sound | Off |
| Draft | `draft: true` makes a 480p preview that can be upgraded to full quality within 7 days without re-rolling (`draft_job_id`), so the motion stays the same |

**Cost (quoted 2026-11-23): draft 90 credits; full quality (1080p) 480 credits.**

**If the draft can't fit everything in one take** (areas skipped, or the dirt coming back), fall back to six shorter clips, one per service. Each clip starts on the last frame of the one before, so they join without a jump. That costs more: six 15-second drafts at 45 credits each is 270 credits, plus the full-quality upgrades.

## Uploading the photos

On 2026-11-23 this workspace's network blocked Higgsfield's upload server (`upload.higgsfield.ai`). Two ways around it:

1. Higgsfield's upload box: Doug picks the files from `reference/`.
2. Allow `upload.higgsfield.ai` in this workspace's network settings, then upload from here.

## After the video is generated

To scrub smoothly, the video needs a keyframe every few frames. A normal export only has one every few seconds, which makes scrolling jump. Convert it like this (desktop version, then a lighter phone version, then the poster):

```bash
ffmpeg -i raw.mp4 -an -c:v libx264 -pix_fmt yuv420p -crf 20 -g 8 -sc_threshold 0 -movflags +faststart house-tour.mp4
```

```bash
ffmpeg -i raw.mp4 -an -vf "scale=-2:720" -c:v libx264 -pix_fmt yuv420p -crf 23 -g 4 -sc_threshold 0 -movflags +faststart house-tour-mobile.mp4
```

```bash
ffmpeg -i house-tour.mp4 -frames:v 1 -q:v 3 house-tour-poster.jpg
```

A 30-second video is about twice as big as a 15-second one. Aim for under about 40 MB on desktop and 20 MB on phones, and compress more (raise `-crf`) if it's over.

## Moving it into the website (later)

The video replaces the 3D scene, and each service section scrubs its own part of the video using the time ranges in the table above. When a visitor picks one service (the "Showing Patio" mode), scrolling plays only that service's part: 7–11.5s for the patio. We'll decide how picking works once we've seen the video, since the clickable 3D house would no longer be on screen.
