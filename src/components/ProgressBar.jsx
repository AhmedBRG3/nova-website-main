// ─────────────────────────────────────────
//  ProgressBar
//  Thin red gradient bar pinned to the very
//  top of the viewport that fills as the
//  user scrolls through the whole page.
//  Reads from the shared scroll engine so it
//  stays in lockstep with every other
//  parallax/scroll effect on the page.
// ─────────────────────────────────────────
import { useRef } from 'react';
import useScrollEngine from '../hooks/useScrollEngine';

export default function ProgressBar() {
  const fillRef = useRef(null);

  useScrollEngine(({ sy }) => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (fillRef.current) fillRef.current.style.width = `${(sy / total) * 100}%`;
  });

  return (
    <div id="pbar">
      <div ref={fillRef} id="pbar-fill" />
    </div>
  );
}
