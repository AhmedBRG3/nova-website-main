// ─────────────────────────────────────────
//  useTilt
//  3D magnetic tilt on mouse move, with an
//  optional specular shine element that
//  tracks the cursor position inside the card.
//
//  Usage:
//    const ref = useTilt({ maxX: 16, maxY: 13 });
//    <div ref={ref} className="tilt">
//      <div className="card-shine" />
//      …
//    </div>
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';

export default function useTilt({ maxX = 16, maxY = 13, depth = 8 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    if (window.matchMedia('(max-width:768px)').matches) return;

    const shine = card.querySelector('.card-shine');

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateY(${x * maxX}deg) rotateX(${-y * maxY}deg) translateZ(${depth}px)`;
      if (shine) {
        shine.style.background =
          `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,.13), transparent 62%)`;
        shine.style.opacity = '1';
      }
    };
    const onLeave = () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
      if (shine) shine.style.opacity = '0';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [maxX, maxY, depth]);

  return ref;
}
