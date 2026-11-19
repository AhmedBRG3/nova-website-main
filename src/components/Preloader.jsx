// ─────────────────────────────────────────
//  Preloader
//  Full-screen curtain shown on first mount:
//  NOVA logo → live 0→100% counter with a
//  filling progress bar → the whole screen
//  slides up and away (`.done` class, see
//  `#preloader.done` in GlobalStyles), revealing
//  the hero underneath already mid-entrance.
//
//  Calls onDone() once the curtain starts
//  lifting, so <App> can flip the `body.loaded`
//  class that drives every other entrance
//  animation on the page.
// ─────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import NovaLogo from './NovaLogo';

export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(100, n + Math.ceil(Math.random() * 11) + 2);
      setPct(n);
      if (n >= 100 && !finished.current) {
        finished.current = true;
        clearInterval(iv);
        setTimeout(() => {
          setDone(true);
          onDone?.();
        }, 300);
      }
    }, 55);
    return () => clearInterval(iv);
  }, [onDone]);

  const C = 2 * Math.PI * 54;

  return (
    <div id="preloader" className={done ? 'done' : ''}>
      <div className="pre-top">A NOVA Production</div>

      <div className="pre-logo"><NovaLogo height={44} /></div>

      <div className="pre-reel">
        <svg viewBox="0 0 120 120" className="pre-reel-svg" aria-hidden="true">
          <circle cx="60" cy="60" r="54" className="pre-ring-bg" />
          <circle
            cx="60" cy="60" r="54" className="pre-ring"
            transform="rotate(-90 60 60)"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct / 100)}
          />
          <line x1="0" y1="60" x2="120" y2="60" className="pre-cross" />
          <line x1="60" y1="0" x2="60" y2="120" className="pre-cross" />
        </svg>
        <div className="pre-count-wrap">
          <span id="preCount">{pct}</span>
          <span className="pre-pct">%</span>
        </div>
      </div>

      <div className="pre-tag">We Create Moments</div>
    </div>
  );
}
