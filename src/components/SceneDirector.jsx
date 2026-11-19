// ─────────────────────────────────────────
//  SceneDirector
//  Cinematic scene-to-scene transitions,
//  driven by the shared scroll loop:
//    • entering: the scene fades up out of black
//      while a slow dolly pushes in (scale .93 → 1)
//    • leaving: it dips back to black while pushing
//      slightly past the lens (scale 1 → 1.05)
//  Layout positions are read from offsetTop (which
//  ignores transforms) so scaling never feeds back
//  into the measurement.
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';
import useScrollEngine from '../hooks/useScrollEngine';

// [selector, mode]  dolly = fade + scale, fade = opacity only
// (Services is deliberately excluded — it owns a sticky pin.)
const SCENES = [
  ['.iei-block', 'dolly'],
  ['.sms-block', 'dolly'],
  ['.ffw-block', 'dolly'],
  ['.ybe-block', 'dolly'],
  ['#about', 'dolly'],
  ['#portfolio', 'fade'],
  ['#clients', 'fade'],
  ['#contact', 'dolly'],
];

const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);

function absTop(el) {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
}

export default function SceneDirector() {
  const scenes = useRef([]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scenes.current = SCENES
      .map(([sel, mode]) => ({ el: document.querySelector(sel), mode }))
      .filter((s) => s.el);
    return () => {
      scenes.current.forEach(({ el }) => { el.style.opacity = ''; el.style.transform = ''; });
    };
  }, []);

  useScrollEngine(({ sy }) => {
    if (reduced.current) return;
    const vh = window.innerHeight;
    for (const { el, mode } of scenes.current) {
      const top = absTop(el) - sy;
      const bottom = top + el.offsetHeight;
      if (bottom < -vh * 0.2 || top > vh * 1.2) continue; // far off-screen

      const enter = smooth(clamp((1 - top / vh) / 0.75));
      const leave = smooth(clamp((1 - bottom / vh) / 0.75));
      const opacity = enter * (1 - leave);

      el.style.opacity = opacity.toFixed(3);
      if (mode === 'dolly') {
        const scale = (0.93 + 0.07 * enter) * (1 + 0.05 * leave);
        el.style.transform = `scale(${scale.toFixed(4)})`;
      }
    }
  });

  return null;
}
