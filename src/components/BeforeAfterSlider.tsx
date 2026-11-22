import { useState } from 'react';
import type { BeforeAfter } from '../data/services';

/**
 * Drag (or use the arrow keys) to compare. Labels say only "Before" and "After".
 * Until real photos are added in src/data/services.ts, a styled placeholder shows instead.
 */
export default function BeforeAfterSlider({ before, after, alt }: BeforeAfter) {
  const [pos, setPos] = useState(50);
  const hasPhotos = Boolean(before && after);

  return (
    <figure className={`ba ${hasPhotos ? '' : 'ba--placeholder'}`}>
      <div className="ba-frame" style={{ ['--pos' as string]: `${pos}%` }}>
        {hasPhotos ? (
          <>
            <img className="ba-img" src={after} alt={`${alt}: after`} loading="lazy" decoding="async" />
            <img className="ba-img ba-before" src={before} alt={`${alt}: before`} loading="lazy" decoding="async" />
          </>
        ) : (
          <>
            {/* TODO(owner): add real before/after photos for this service (see README → Photos). */}
            <div className="ba-img ba-ph-after" aria-hidden="true" />
            <div className="ba-img ba-before ba-ph-before" aria-hidden="true" />
          </>
        )}
        <span className="ba-tag ba-tag-before">Before</span>
        <span className="ba-tag ba-tag-after">After</span>
        <div className="ba-handle" aria-hidden="true" />
        <input
          className="ba-range"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare before and after: ${alt}`}
        />
      </div>
      {!hasPhotos && <figcaption className="ba-note">Real job photos coming soon.</figcaption>}
    </figure>
  );
}
