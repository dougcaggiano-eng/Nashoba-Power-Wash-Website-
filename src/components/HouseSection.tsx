import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { services, type PartId } from '../data/services';
import { backToHouse, choosePart, hasWebGL, setState, useSite } from '../lib/store';
import PartPicker from './PartPicker';
import PartVideo from './PartVideo';
import ServiceProcess from './ServiceProcess';

const HouseScene = lazy(() => import('./HouseScene'));

/** Shown when WebGL isn't available: a flat illustration with the same clickable parts. */
function StaticHouse() {
  const hovered = useSite((s) => s.hovered);
  const zone = (id: PartId, label: string, el: JSX.Element) => (
    <g
      className={`svg-part ${hovered === id ? 'is-hover' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => choosePart(id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && choosePart(id)}
      onMouseEnter={() => setState({ hovered: id })}
      onMouseLeave={() => setState({ hovered: null })}
    >
      {el}
    </g>
  );
  return (
    <svg className="static-house" viewBox="0 0 400 260" role="group" aria-label="Illustration of a house. Choose a part.">
      <rect width="400" height="260" fill="#cfe2f3" />
      <rect y="190" width="400" height="70" fill="#5d8a3d" />
      {zone('fence', 'Fence: Fence Cleaning', <path d="M10 150h8v60h-8zM24 150h8v60h-8zM38 150h8v60h-8zM52 150h8v60h-8z" fill="#d9b991" />)}
      {zone('siding', 'Vinyl siding: House Wash', <rect x="140" y="95" width="150" height="100" fill="#f4f6f8" />)}
      <path d="M130 98 215 45 300 98z" fill="#3b3f45" />
      <rect x="160" y="115" width="24" height="30" fill="#2a3d55" />
      <rect x="246" y="115" width="24" height="30" fill="#2a3d55" />
      <rect x="204" y="150" width="22" height="45" fill="#1d2f4f" />
      {zone('deck', 'Composite deck: Composite Deck Cleaning', <rect x="80" y="160" width="60" height="12" fill="#9c8a76" />)}
      {zone('patio', 'Paver patio: Patio Cleaning & Restoration', <path d="M66 200h80l10 30H56z" fill="#d6c9b6" />)}
      {zone('walkway', 'Walkway and stairs: Walkway & Stair Cleaning', <path d="M205 195h20l8 65h-36z" fill="#c8c2b8" />)}
      {zone('driveway', 'Any other surface: Mold & Grime Removal', <path d="M300 195h50l30 65h-90z" fill="#8e9196" />)}
    </svg>
  );
}

export default function HouseSection() {
  const selected = useSite((s) => s.selected);
  const touched = useSite((s) => s.interested.length > 0);
  const [webgl] = useState(() => hasWebGL());
  const [showCanvas, setShowCanvas] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  // Lazy-load the 3D canvas once the section is close to the viewport.
  useEffect(() => {
    if (!webgl || !stage.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowCanvas(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(stage.current);
    return () => io.disconnect();
  }, [webgl]);

  return (
    <section id="house" className="house" aria-labelledby="house-title">
      <div className="house-stage" ref={stage}>
        <div className="house-canvas">
          {webgl ? (
            showCanvas ? (
              <Suspense fallback={<div className="canvas-loading">Loading the house…</div>}>
                <HouseScene />
              </Suspense>
            ) : (
              <div className="canvas-loading">Loading the house…</div>
            )
          ) : (
            <StaticHouse />
          )}
        </div>
        <PartVideo />
        {!touched && !selected && (
          <div className="stage-prompt" aria-hidden="true">
            <span className="pulse-dot" /> Pick a part of your home
          </div>
        )}
        {selected && (
          <button type="button" className="stage-back" onClick={backToHouse}>
            ← Back to the house
          </button>
        )}
      </div>

      <div className="house-flow">
        <div className="picker-intro">
          <p className="eyebrow">How it works</p>
          <h2 id="house-title">Pick a part of your home</h2>
          <p>
            Tap a part of the house, or choose from the list. Then scroll down to see exactly how I clean it, step by step.
          </p>
          <PartPicker />
        </div>
        {services.map((s) => (
          <ServiceProcess key={s.id} service={s} />
        ))}
      </div>
    </section>
  );
}
