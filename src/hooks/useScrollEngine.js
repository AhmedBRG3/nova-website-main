// ─────────────────────────────────────────
//  useScrollEngine
//  A single shared requestAnimationFrame loop
//  that every scroll-driven component taps into,
//  instead of each component running its own
//  raf + scroll listener. Also lerps the raw
//  scrollY so parallax reads buttery, not jittery.
//
//  Usage:
//    useScrollEngine(({ sy, syRaw }) => {
//      el.style.transform = `translateY(${sy * 0.2}px)`;
//    });
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';

// Module-level shared state so every hook instance
// reads the same lerped value without duplicating work.
const state = { syRaw: typeof window !== 'undefined' ? window.scrollY : 0, sy: 0 };
let rafId = null;
const listeners = new Set();

function tick() {
  state.sy += (state.syRaw - state.sy) * 0.1;
  listeners.forEach((fn) => fn(state));
  rafId = requestAnimationFrame(tick);
}

function ensureLoop() {
  if (rafId == null && typeof window !== 'undefined') {
    window.addEventListener('scroll', () => { state.syRaw = window.scrollY; }, { passive: true });
    rafId = requestAnimationFrame(tick);
  }
}

export default function useScrollEngine(callback) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    ensureLoop();
    const fn = (s) => cbRef.current(s);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
}
