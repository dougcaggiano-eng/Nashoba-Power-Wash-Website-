import { useEffect, useRef, useState } from 'react';
import type { PartId } from '../data/services';
import { useSite } from '../lib/store';

/**
 * Realistic cleaning clip (made with Higgsfield) for the selected part of the house.
 * Drop clips at public/video/parts/<part>.mp4: siding, patio, deck, fence, walkway, driveway.
 * See docs/higgsfield-part-videos.md. If a clip is missing, the 3D model simply stays on screen.
 */
const available = new Map<PartId, boolean>();

async function clipExists(part: PartId) {
  if (available.has(part)) return available.get(part)!;
  try {
    const r = await fetch(`video/parts/${part}.mp4`, { method: 'HEAD' });
    const ok = r.ok && (r.headers.get('content-type') ?? '').startsWith('video');
    available.set(part, ok);
    return ok;
  } catch {
    available.set(part, false);
    return false;
  }
}

export default function PartVideo() {
  const selected = useSite((s) => s.selected);
  const [src, setSrc] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let live = true;
    setHidden(false);
    if (!selected || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSrc(null);
      return;
    }
    clipExists(selected).then((ok) => live && setSrc(ok ? `video/parts/${selected}.mp4` : null));
    return () => {
      live = false;
    };
  }, [selected]);

  if (!src) return null;
  return (
    <div className={`part-video ${hidden ? 'is-hidden' : ''}`}>
      <video
        ref={ref}
        key={src}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label="Video of this part of the house being cleaned"
        onError={() => setSrc(null)}
      />
      <button type="button" className="part-video-toggle" onClick={() => setHidden((h) => !h)}>
        {hidden ? 'Show real video' : 'Show 3D model'}
      </button>
    </div>
  );
}
