// ─────────────────────────────────────────
//  useReveal
//  Adds 'in' class to the element when it
//  scrolls into view — pair with .rv / .rv-l /
//  .rv-r / .rv-scale / .rv-clip classes from
//  the shared stylesheet for different entrance
//  styles (fade-up, slide from side, scale, clip).
//
//  Usage:
//    const ref = useReveal();
//    <div ref={ref} className="rv"> … </div>
//    <div ref={ref} className="rv-l"> … </div>   // slides from left
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';

export default function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px', ...options },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}
