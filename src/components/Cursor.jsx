// ─────────────────────────────────────────
//  Cursor
//  Custom dot + lagging ring cursor with
//  mix-blend-mode:difference. Enlarges on
//  hoverable elements (class "hov" on body),
//  and morphs into a solid red "View" badge
//  when hovering a portfolio card (class
//  "cur-view" on body — see Portfolio.jsx).
//  Hidden entirely on touch/mobile.
//
//  Uses event delegation (mouseover/mouseout
//  on window, checked with .closest()) rather
//  than binding listeners to a querySelectorAll
//  snapshot taken at mount — this is a single-page
//  app with client-side routing, so a static
//  snapshot would miss every interactive element
//  on a page navigated to after first mount.
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';

const HOVERABLE_SELECTOR =
  'a, button, .iei-card, .svc-card, .about-card, .value-pill, .ybe-card, .ffw-scene-html, .client-name';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ cx: 0, cy: 0, rx: 0, ry: 0 });

  useEffect(() => {
    if (window.matchMedia('(max-width:768px)').matches) return;

    const dot = dotRef.current, ring = ringRef.current;

    const onMove = (e) => {
      pos.current.cx = e.clientX;
      pos.current.cy = e.clientY;
      if (dot) { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; }
    };
    window.addEventListener('mousemove', onMove);

    const onOver = (e) => { if (e.target.closest(HOVERABLE_SELECTOR)) document.body.classList.add('hov'); };
    const onOut = (e) => { if (e.target.closest(HOVERABLE_SELECTOR)) document.body.classList.remove('hov'); };
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);

    let rafId;
    const animate = () => {
      const p = pos.current;
      p.rx += (p.cx - p.rx) * 0.14;
      p.ry += (p.cy - p.ry) * 0.14;
      if (ring) { ring.style.left = p.rx + 'px'; ring.style.top = p.ry + 'px'; }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} id="cur" />
      <div ref={ringRef} id="cur-ring"><span id="cur-label">View</span></div>
    </>
  );
}
