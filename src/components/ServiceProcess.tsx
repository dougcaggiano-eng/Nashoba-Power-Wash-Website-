import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Service } from '../data/services';
import { backToHouse, getState, markInterested, setClean, setState } from '../lib/store';
import BeforeAfterSlider from './BeforeAfterSlider';

gsap.registerPlugin(ScrollTrigger);

/** One scroll-driven process section. Fed entirely by data from src/data/services.ts. */
export default function ServiceProcess({ service }: { service: Service }) {
  const root = useRef<HTMLElement>(null);
  const { part, steps } = service;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const stepEls = gsap.utils.toArray<HTMLElement>('.step', el);
      stepEls.forEach((stepEl, i) => {
        ScrollTrigger.create({
          trigger: stepEl,
          start: 'top 62%',
          end: 'bottom 62%',
          onToggle: (self) => {
            if (!self.isActive) return;
            stepEls.forEach((s, j) => s.classList.toggle('is-active', j === i));
            setState({ selected: part, effect: steps[i].effect });
            setClean(part, steps.length > 1 ? i / (steps.length - 1) : 1);
          },
        });
        if (!reduce) {
          gsap.from(stepEl, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: stepEl, start: 'top 85%' },
          });
        }
      });
      // Scrolled back up above this service: stop the spray.
      ScrollTrigger.create({
        trigger: el,
        start: 'top 62%',
        onLeaveBack: () => {
          if (getState().selected === part) setState({ effect: null });
        },
      });
    }, el);
    return () => ctx.revert();
  }, [part, steps]);

  return (
    <article className="process" id={`process-${part}`} ref={root} aria-labelledby={`title-${part}`}>
      <header className="process-head">
        <p className="eyebrow">{service.partLabel}</p>
        <h3 id={`title-${part}`}>{service.name}</h3>
        <p className="process-tagline">{service.tagline}</p>
        <p className="process-time">
          <span>Typical time</span> {service.typicalTime}
        </p>
      </header>

      <ol className="steps">
        {steps.map((step, i) => (
          <li className="step" key={step.title}>
            <span className="step-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {service.care.length > 0 && (
        <div className="care">
          <h4>How I protect your property</h4>
          <ul>
            {service.care.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      <BeforeAfterSlider {...service.beforeAfter} />

      <div className="process-actions">
        <a className="btn btn-primary" href="#quote" onClick={() => markInterested(part)}>
          Get your free quote
        </a>
        <button type="button" className="btn btn-ghost" onClick={backToHouse}>
          ↑ Back to the house
        </button>
      </div>
    </article>
  );
}
