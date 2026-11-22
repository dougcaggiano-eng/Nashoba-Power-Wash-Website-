import { useSyncExternalStore } from 'react';
import type { PartId, StepEffect } from '../data/services';
import { partOrder } from '../data/services';

/** Shared state between the 3D scene, the scroll process and the quote form. */
export interface SiteState {
  hovered: PartId | null;
  selected: PartId | null;
  /** 0 = grimy, 1 = fully clean, per part */
  clean: Record<PartId, number>;
  effect: StepEffect | null;
  /** Bumped on "Back to the house" so the camera resets */
  resetTick: number;
  /** Parts the visitor has shown interest in (pre-fills the quote form) */
  interested: PartId[];
}

const initialClean = Object.fromEntries(partOrder.map((p) => [p, 0])) as Record<PartId, number>;

let state: SiteState = {
  hovered: null,
  selected: null,
  clean: initialClean,
  effect: null,
  resetTick: 0,
  interested: [],
};

const listeners = new Set<() => void>();

export function getState() {
  return state;
}

export function setState(patch: Partial<SiteState> | ((s: SiteState) => Partial<SiteState>)) {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useSite<T>(selector: (s: SiteState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export function markInterested(part: PartId) {
  setState((s) => (s.interested.includes(part) ? {} : { interested: [...s.interested, part] }));
}

export function setClean(part: PartId, value: number) {
  setState((s) => ({ clean: { ...s.clean, [part]: Math.max(0, Math.min(1, value)) } }));
}

/** Pick a part: select it, remember it for the quote form, and scroll to its process. */
export function choosePart(part: PartId) {
  setState({ selected: part });
  markInterested(part);
  const el = document.getElementById(`process-${part}`);
  if (el) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}

export function backToHouse() {
  setState((s) => ({ selected: null, effect: null, resetTick: s.resetTick + 1 }));
  const el = document.getElementById('house');
  if (el) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
