import { services } from '../data/services';
import { choosePart, setState, useSite } from '../lib/store';

/** Plain button list of the same parts as the 3D model: keyboard, screen reader and no-WebGL friendly. */
export default function PartPicker() {
  const selected = useSite((s) => s.selected);
  return (
    <ul className="picker" aria-label="Parts of your home">
      {services.map((s) => (
        <li key={s.part}>
          <button
            type="button"
            className={`picker-btn ${selected === s.part ? 'is-on' : ''}`}
            aria-pressed={selected === s.part}
            onClick={() => choosePart(s.part)}
            onMouseEnter={() => setState({ hovered: s.part })}
            onMouseLeave={() => setState({ hovered: null })}
            onFocus={() => setState({ hovered: s.part })}
            onBlur={() => setState({ hovered: null })}
          >
            <span className="picker-part">{s.partLabel}</span>
            <span className="picker-service">{s.name}</span>
            <span className="picker-arrow" aria-hidden="true">→</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
