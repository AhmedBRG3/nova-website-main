// ─────────────────────────────────────────
//  useMagnet
//  Buttons drift toward the cursor while
//  it's inside their bounds, then spring
//  back on mouse leave. Skipped on mobile.
//
//  Usage:
//    const ref = useMagnet();
//    <a ref={ref} className="btn-p">Click me</a>
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';

export default function useMagnet({ strengthX = 0.22, strengthY = 0.28 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(max-width:768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * strengthX}px, ${y * strengthY}px)`;
    };
    const onLeave = () => { el.style.transform = ''; };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strengthX, strengthY]);

  return ref;
}
