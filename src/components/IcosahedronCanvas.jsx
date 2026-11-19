// ─────────────────────────────────────────
//  IcosahedronCanvas
//  Drops the shared NOVA 3D motif into any
//  section as an absolutely-positioned backdrop.
//  Lazily creates the WebGL context only while
//  the canvas is actually in view, and fully
//  disposes it when scrolled away — with many
//  of these on one page, keeping a live context
//  per section would blow past the browser's
//  concurrent-WebGL-context limit.
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';
import initIcosahedronScene from '../three/icosahedronScene';

export default function IcosahedronCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const controlRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !controlRef.current) {
          controlRef.current = initIcosahedronScene(canvasRef.current);
        } else if (!entry.isIntersecting && controlRef.current) {
          controlRef.current.cleanup();
          controlRef.current = null;
        }
      },
      { rootMargin: '200px 0px' },
    );
    obs.observe(canvasRef.current);
    return () => { obs.disconnect(); controlRef.current?.cleanup(); };
  }, []);

  return <canvas ref={canvasRef} className={`ico-bg-canvas ${className}`} aria-hidden="true" />;
}
