# Higgsfield video plan

The goal is a realistic video of a house wash that plays forward and backward as the visitor scrolls. It is built here first and only moved into the main website once it looks right.

- `scroll-video.html` is the test page. Open it in a browser. Until the video exists it shows a placeholder.
- `house-wash.mp4` is the finished video. It doesn't exist yet. Put it in this folder with exactly this name.
- `house-wash-poster.jpg` is the first frame of the video, shown while the video loads.

## Status

- [ ] Reference photo from Doug (a real house, ideally one he has washed, shot straight on in daylight)
- [ ] Credits added in Higgsfield
- [ ] Cheap 480p draft generated and approved
- [ ] Full 1080p video generated
- [ ] Video converted for smooth scrubbing (see below) and dropped in this folder
- [ ] Tested in `scroll-video.html`
- [ ] Moved into the main website

## The shot

**One continuous 15-second take with no cuts.** The page shows any single frame as a still whenever the visitor stops scrolling, and plays the clip backward when they scroll up. So the shot needs one slow, steady camera move with the brightness held constant.

| Time | What happens |
| ---- | ------------ |
| 0–3s | Wide establishing shot of the house. Green mold and grey grime streak the lower half of the vinyl siding. |
| 3–6s | The camera drifts slowly closer and arcs a little to one side. The worker pre-rinses the siding with plain water. |
| 6–9s | White foam goes on from the ground up and clings to the siding. |
| 9–13s | The worker rinses from the roofline down. Clean, bright siding shows through as the foam and grime run off. |
| 13–15s | The camera settles on the finished house, now clean and bright. The worker stands back. |

The start and end must look clearly different (dirty, then clean). That difference is the payoff of scrolling.

## Draft prompt

The reference photo goes in as a **style/look reference** (`image_references`), **not** as the start frame. Used as the start frame, the page would sit on a frozen photo for the first second or two.

> Photorealistic exterior of a two-story New England home with horizontal vinyl lap siding, matching the reference photo's house, colors and setting. Late-morning daylight, soft and even, locked exposure and white balance. At the start, green mold and grey grime streak the lower half of the siding. One continuous, slow, steady camera move: a gentle push-in with a slight arc to the left, no cuts, no camera shake, no fast motion. A single power washing technician in a navy-blue work shirt and dark cap works along the front wall: first rinsing the siding with plain water, then applying thick white foam from the ground up with a foam cannon, then rinsing from the roofline down so the foam and grime sheet off and the siding underneath turns bright and clean. The shot ends on the whole front of the house fully clean, the technician standing back. Realistic water spray and run-off, minimal motion blur. No on-screen text, no logos, no watermarks.

This draft will be updated once the reference photo arrives (siding colour, house style, trim and doors).

## Settings and cost

| Setting | Value |
| ------- | ----- |
| Model | Seedance 2.5 (`seedance_2_5`), Higgsfield's default video model |
| Mode | `omni_reference` (the reference photo is an image reference) |
| Length | 15 seconds |
| Shape | 16:9 |
| Sound | Off (the page plays frames, not sound, and it's cheaper) |
| Draft first | `draft: true` makes a 480p preview that can be upgraded to full quality within 7 days without re-rolling |
| Final quality | 1080p |

**Quoted price: 240 credits for 15 seconds at 1080p** (checked 2026-11-23; the account had 2.2 credits at the time). Make the cheap draft first and only pay for 1080p once the motion looks right.

## After the video is generated

To scrub smoothly, the video needs a keyframe every few frames. A normal export only has one every few seconds, which makes scrolling jump. Convert it like this (desktop version, then a lighter phone version):

```bash
ffmpeg -i raw.mp4 -an -c:v libx264 -pix_fmt yuv420p -crf 20 -g 8 -sc_threshold 0 -movflags +faststart house-wash.mp4
```

```bash
ffmpeg -i raw.mp4 -an -vf "scale=-2:720" -c:v libx264 -pix_fmt yuv420p -crf 23 -g 4 -sc_threshold 0 -movflags +faststart house-wash-mobile.mp4
```

```bash
ffmpeg -i house-wash.mp4 -frames:v 1 -q:v 3 house-wash-poster.jpg
```

Keep the desktop file under about 30 MB and the phone file under about 15 MB.

## Moving it into the website (later)

Planned approach: the video replaces the 3D scene only in the **house wash** section, so the clickable 3D house stays as the way to pick a service. We'll decide this once we've seen the video.
